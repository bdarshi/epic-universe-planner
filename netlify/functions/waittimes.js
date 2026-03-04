// Netlify serverless function — proxies Queue-Times.com with 5-minute cache
// Runs server-side so CORS is never an issue for the browser

const PARK_ID = 334; // Universal Epic Universe
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

// In-memory cache (lives for the duration of the function's warm instance)
let cache = { data: null, fetchedAt: 0 };

// Maps Queue-Times ride names → our internal ride IDs
const NAME_MAP = {
  "Stardust Racers":                              "stardust",
  "Constellation Carousel":                       "carousel",
  "Harry Potter and the Battle at the Ministry":  "ministry",
  "Mario Kart: Bowser's Challenge":               "mariokart",
  "Mine-Cart Madness":                            "minecart",
  "Toadstool Garage":                             "toadstool",
  "Hiccup's Wing Gliders":                        "winggliders",
  "Fyre Drill":                                   "fyre",
  "Dragon Racer's Rally":                         "dragonracer",
  "Viking Training Camp":                         "waterboat",
  "Monsters Unchained: The Frankenstein Experiment": "monsters",
  "Curse of the Werewolf":                        "werewolf",
};

export const handler = async () => {
  const now = Date.now();

  // Return cached data if still fresh
  if (cache.data && now - cache.fetchedAt < CACHE_TTL) {
    return respond(200, { waits: cache.data, cached: true, age: Math.round((now - cache.fetchedAt) / 1000) });
  }

  try {
    const res = await fetch(`https://queue-times.com/parks/${PARK_ID}/queue_times.json`, {
      headers: { "User-Agent": "EpicUniversePlanner/1.0" },
    });

    if (!res.ok) throw new Error(`Queue-Times returned ${res.status}`);

    const json = await res.json();

    // Flatten all lands → rides, map to our IDs
    const waits = {};
    const lands = json.lands ?? [];
    for (const land of lands) {
      for (const ride of land.rides ?? []) {
        const id = NAME_MAP[ride.name];
        if (id && typeof ride.wait_time === "number") {
          waits[id] = ride.wait_time;
        }
      }
    }

    // Store in cache
    cache = { data: waits, fetchedAt: now };

    return respond(200, { waits, cached: false, fetchedAt: new Date(now).toISOString() });
  } catch (err) {
    // If fetch fails, return stale cache if we have it — better than nothing
    if (cache.data) {
      return respond(200, { waits: cache.data, cached: true, stale: true, error: err.message });
    }
    return respond(500, { error: err.message, waits: {} });
  }
};

function respond(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300", // also tell browsers to cache 5min
    },
    body: JSON.stringify(body),
  };
}
