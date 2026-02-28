import { useState, useEffect } from "react";

// ─── LAND META ───────────────────────────────────────────────────────────────
const LAND_META = {
  "Celestial Park":       { color:"#818CF8", emoji:"✨", short:"Celestial" },
  "Ministry of Magic":    { color:"#FBBF24", emoji:"⚡", short:"Ministry" },
  "Super Nintendo World": { color:"#F87171", emoji:"🍄", short:"Nintendo" },
  "Isle of Berk":         { color:"#34D399", emoji:"🐉", short:"Berk" },
  "Dark Universe":        { color:"#A78BFA", emoji:"💀", short:"Dark" },
};
const LANDS = Object.keys(LAND_META);

// ─── VIBE CONFIG ─────────────────────────────────────────────────────────────
// priority: ride order within vibe (1=first, null=bonus shelf only)
// showShows: whether to auto-include shows
const VIBE = {
  thrill: {
    label:"Thrill Seeker", emoji:"🔥", desc:"Max intensity, biggest coasters first", color:"#F87171",
    diningStyle:"grab", showShows:false,
    landOrder:["Celestial Park","Dark Universe","Isle of Berk","Super Nintendo World","Ministry of Magic"],
    priority:{ stardust:1, werewolf:2, monsters:3, winggliders:4, dragonracer:5, minecart:6, mariokart:7, ministry:8 },
  },
  family: {
    label:"Family Fun", emoji:"👨‍👩‍👧", desc:"Perfect for all ages and heights", color:"#34D399",
    diningStyle:"grab", showShows:true,
    landOrder:["Super Nintendo World","Isle of Berk","Celestial Park","Ministry of Magic","Dark Universe"],
    priority:{ mariokart:1, minecart:2, toadstool:3, playground:4, winggliders:5, dragonracer:6, fyre:7, waterboat:8, carousel:9, ministry:10, dragons_show:11 },
  },
  firsttimer: {
    label:"First Timer", emoji:"⭐", desc:"Hit every essential, nothing missed", color:"#FBBF24",
    diningStyle:"sitdown", showShows:false,
    landOrder:["Ministry of Magic","Super Nintendo World","Celestial Park","Isle of Berk","Dark Universe"],
    priority:{ ministry:1, minecart:2, monsters:3, werewolf:4, winggliders:5, stardust:6, mariokart:7 },
  },
  chill: {
    label:"Take It Easy", emoji:"☕", desc:"Relaxed pace, shows & great food", color:"#818CF8",
    diningStyle:"sitdown", showShows:true,
    landOrder:["Celestial Park","Ministry of Magic","Super Nintendo World","Isle of Berk","Dark Universe"],
    priority:{ carousel:1, fyre:2, ministry:5, monsters:4, cirque:6, dragons_show:3 },
  },
};

// ─── DINING RECS ─────────────────────────────────────────────────────────────
const DINING = {
  "Celestial Park": {
    grab:    { name:"Star Sui Bao", emoji:"🥟", item:"Bao Buns or Tteokbokki Skewer ($12) — grab and eat while you walk" },
    sitdown: { name:"Oak & Star Tavern", emoji:"🌟", item:"Mango Bread BBQ Platter — sit and rest between rides" },
  },
  "Ministry of Magic": {
    grab:    { name:"Café L'air De La Sirène", emoji:"☕", item:"Butterbeer Crêpe to go ($12) — DFB's must-get, eat it in wizarding Paris" },
    sitdown: { name:"Café L'air De La Sirène", emoji:"☕", item:"Butterbeer Crêpe + Lavender Lemonade — sit at the table and soak it in" },
  },
  "Super Nintendo World": {
    grab:    { name:"Yoshi's Snack Island", emoji:"🦎", item:"Mango Smoothie ($7) + Yoshi Egg Cake Pop" },
    sitdown: { name:"Toadstool Cafe", emoji:"🍄", item:"Mario Burger + Super Mushroom Soup inside the giant mushroom" },
  },
  "Isle of Berk": {
    grab:    { name:"Grog & Gruel", emoji:"🦴", item:"Mac & Cheese Cone ($12) — DFB's standout pick in Berk" },
    sitdown: { name:"Mead Hall", emoji:"🍺", item:"Viking Mead + hearty meat dishes in the longhouse — great rest stop" },
  },
  "Dark Universe": {
    grab:    { name:"Burning Blade Tavern", emoji:"⚔️", item:"Frankenstein Pretzels + stay for the fire eruptions" },
    sitdown: { name:"Burning Blade Tavern", emoji:"⚔️", item:"Staked Grilled Chicken — DFB called it the best atmosphere in the park" },
  },
};

// ─── RIDES ───────────────────────────────────────────────────────────────────
const RIDES = [
  { id:"stardust",     name:"Stardust Racers",               land:"Celestial Park",       minH:48, express:true,  single:true,  dur:4,  isShow:false,
    tip:"62mph dueling coaster. Averaged ~49min. Rope drop or after 7pm." },
  { id:"carousel",     name:"Constellation Carousel",        land:"Celestial Park",       minH:0,  express:true,  single:false, dur:6,  isShow:false,
    tip:"Low capacity — waits spike. Go when Mine-Cart or Mario Kart lines are huge." },
  { id:"ministry",     name:"Battle at the Ministry",        land:"Ministry of Magic",    minH:40, express:false, single:true,  dur:9,  isShow:false,
    tip:"NO EXPRESS. Peaks at 165min weekday, 220min+ weekend. Rope drop or final 90min only." },
  { id:"cirque",       name:"Le Cirque Arcanus",             land:"Ministry of Magic",    minH:0,  express:true,  single:false, dur:25, isShow:true,
    tip:"20-min circus show with magical creatures. Check show times at park entrance." },
  { id:"mariokart",    name:"Mario Kart: Bowser's Challenge",land:"Super Nintendo World", minH:40, express:true,  single:true,  dur:9,  isShow:false,
    tip:"60–90min all day. Single rider line is your best friend. Get the Power-Up Band wristband." },
  { id:"minecart",     name:"Mine-Cart Madness",              land:"Super Nintendo World", minH:40, express:true,  single:false, dur:4,  isShow:false,
    tip:"Peaks 140min weekday, 190min+ weekend. Express or rope drop only on weekends." },
  { id:"toadstool",    name:"Yoshi's Ride",                  land:"Super Nintendo World", minH:34, express:false, single:false, dur:6,  isShow:false,
    tip:"No Express but waits stay low (~20-30min). Great split-party option." },
  { id:"playground",   name:"Nintendo Playground",           land:"Super Nintendo World", minH:0,  express:false, single:false, dur:20, isShow:true,
    tip:"Fully interactive — no wait. Let the kids explore freely." },
  { id:"winggliders",  name:"Hiccup's Wing Gliders",         land:"Isle of Berk",         minH:40, express:true,  single:false, dur:5,  isShow:false,
    tip:"Flying coaster with stunning views. Waits build to 75min by mid-morning." },
  { id:"fyre",         name:"Fyre Drill",                    land:"Isle of Berk",         minH:34, express:true,  single:false, dur:4,  isShow:false,
    tip:"Easy water ride — you'll get splashed. Shorter waits (~40min peak). Great for all ages." },
  { id:"dragonracer",  name:"Dragon Racer's Rally",          land:"Isle of Berk",         minH:48, express:true,  single:false, dur:5,  isShow:false,
    tip:"Family coaster. Good option when Wing Gliders line is long." },
  { id:"waterboat",    name:"Viking Training Camp",          land:"Isle of Berk",         minH:0,  express:true,  single:false, dur:7,  isShow:false,
    tip:"You WILL get wet. Save for a hot afternoon — waits drop off later." },
  { id:"dragons_show", name:"How to Train Your Dragon Show", land:"Isle of Berk",         minH:0,  express:false, single:false, dur:25, isShow:true,
    tip:"Live dragon show in Isle of Berk. Check show times at park entrance." },
  { id:"monsters",     name:"Monsters Unchained",            land:"Dark Universe",        minH:48, express:true,  single:false, dur:6,  isShow:false,
    tip:"SURPRISE: lowest wait headliner (~35min avg). High-capacity KUKA system. Best value in the park." },
  { id:"werewolf",     name:"Curse of the Werewolf",         land:"Dark Universe",        minH:40, express:true,  single:false, dur:4,  isShow:false,
    tip:"Spinning forest coaster. Moderate waits (~50-60min peak). Disorienting in the best way." },
  { id:"walk_monsters",name:"Walk of Monsters",              land:"Dark Universe",        minH:0,  express:false, single:false, dur:15, isShow:true,
    tip:"Walk-through monster experience — no wait, great atmosphere filler." },
];

// ─── WAIT TIMES ──────────────────────────────────────────────────────────────
// Realistic curves anchored to real first-month data
// Index 0 = 8am, each step +1hr through 8pm
const BASE_WAITS = {
  stardust:    [ 20, 35, 55, 65, 75, 80, 75, 65, 55, 45, 35, 25, 15 ],
  carousel:    [  8, 15, 25, 35, 40, 40, 35, 30, 25, 18, 12,  8,  5 ],
  ministry:    [ 30, 80,120,150,160,165,155,140,120, 95, 70, 45, 25 ],
  cirque:      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
  mariokart:   [ 20, 50, 75, 90, 95, 95, 90, 80, 65, 50, 40, 30, 20 ],
  minecart:    [ 25, 65,100,125,135,140,130,115, 95, 75, 55, 35, 20 ],
  toadstool:   [  5, 10, 18, 25, 28, 28, 25, 20, 15, 12,  8,  5,  5 ],
  playground:  [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
  winggliders: [ 15, 40, 65, 78, 85, 85, 78, 65, 50, 40, 30, 20, 10 ],
  fyre:        [ 10, 22, 35, 42, 48, 48, 42, 35, 28, 20, 15, 10,  5 ],
  dragonracer: [ 10, 25, 42, 52, 58, 58, 52, 44, 34, 26, 20, 14,  8 ],
  waterboat:   [  5, 12, 22, 32, 38, 38, 33, 27, 20, 15, 10,  7,  5 ],
  dragons_show:[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
  monsters:    [ 10, 20, 30, 38, 42, 42, 38, 32, 26, 20, 15, 10,  8 ],
  werewolf:    [ 12, 28, 48, 60, 68, 68, 62, 52, 42, 32, 24, 16, 10 ],
  walk_monsters:[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
};
const CROWD = { weekday:0.65, weekend:1.35 };

function getWait(id, hour, hasExpress, crowd) {
  const idx = Math.max(0, Math.min(12, hour - 8));
  const base = BASE_WAITS[id]?.[idx] ?? 25;
  const scaled = Math.round(base * (CROWD[crowd] ?? 1));
  const ride = RIDES.find(r => r.id === id);
  if (hasExpress && ride?.express) return Math.max(5, Math.round(scaled * 0.48));
  return scaled;
}

// ─── SCHEDULE BUILDER ────────────────────────────────────────────────────────
function buildSchedule({ vibeKey, hasExpress, startMins, endMins, crowd, heights }) {
  const vibe = VIBE[vibeKey];
  const dStyle = vibe.diningStyle;
  let cur = startMins;
  const scheduled = [];
  let lunchDone = false;
  const minH = Math.min(...heights.filter(h => h > 0), 999);

  // Get priority rides — those with a number in this vibe
  const prioritized = RIDES
    .filter(r => vibe.priority[r.id] != null)
    .filter(r => r.isShow ? vibe.showShows : true)
    .sort((a, b) => (vibe.priority[a.id] ?? 99) - (vibe.priority[b.id] ?? 99));

  // Group by land in vibe land order
  const byLand = {};
  LANDS.forEach(l => { byLand[l] = []; });
  prioritized.forEach(r => { if (byLand[r.land]) byLand[r.land].push(r); });

  const landOrder = vibe.landOrder.filter(l => byLand[l]?.length > 0);
  let prevLand = null;

  for (let li = 0; li < landOrder.length; li++) {
    const land = landOrder[li];
    const rides = byLand[land];
    if (!rides.length) continue;

    // 15min travel between lands
    if (prevLand && prevLand !== land) {
      if (cur + 15 > endMins) break;
      scheduled.push({ type:"travel", from:prevLand, to:land, startMins:cur, endMins:cur+15, id:`travel-${li}` });
      cur += 15;
    }

    let prevRideInLand = false;
    for (const ride of rides) {
      const hr = Math.floor(cur / 60);

      // Lunch injection 12–2pm
      if (hr >= 12 && hr < 14 && !lunchDone) {
        if (cur + 50 <= endMins) {
          const rec = DINING[land]?.[dStyle];
          scheduled.push({ type:"meal", land, rec, startMins:cur, endMins:cur+50, id:`meal-${cur}` });
          cur += 50; lunchDone = true;
        }
      }

      // 10min walk buffer between rides within same land (not first ride)
      if (prevRideInLand) {
        if (cur + 10 > endMins) break;
        scheduled.push({ type:"walk", land, startMins:cur, endMins:cur+10, id:`walk-${land}-${cur}` });
        cur += 10;
      }

      const wait = getWait(ride.id, Math.floor(cur/60), hasExpress, crowd);
      const total = ride.isShow ? ride.dur + 3 : wait + ride.dur + 2;
      if (cur + total > endMins) continue;

      scheduled.push({ type:"ride", ride, wait, land, startMins:cur, endMins:cur+total, id:`ride-${ride.id}-${cur}`, heightAlert: minH < ride.minH && minH > 0 });
      cur += total;
      prevRideInLand = true;
      prevLand = land;
    }

    // Per-land snack if no food in this land
    const hasFoodHere = scheduled.some(x => x.land === land && (x.type==="meal"||x.type==="snack"));
    if (!hasFoodHere && cur + 12 <= endMins) {
      const rec = DINING[land]?.[dStyle];
      if (rec) {
        scheduled.push({ type:"snack", land, rec, startMins:cur, endMins:cur+12, id:`snack-${land}-${cur}` });
        cur += 12;
      }
    }
  }

  // Bonus rides: eligible, not already scheduled, not explicitly excluded by having no priority in ANY vibe
  const scheduledIds = new Set(scheduled.filter(s=>s.type==="ride").map(s=>s.ride.id));
  const bonus = RIDES.filter(r => !scheduledIds.has(r.id) && !(r.isShow && !vibe.showShows));

  return { scheduled, bonus, endCur: cur };
}

function recalcTimes(items, startMins) {
  let cur = startMins;
  return items.map(item => {
    const dur = item.endMins - item.startMins;
    return { ...item, startMins: cur, endMins: (cur += dur, cur) };
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt12 = m => {
  const h = Math.floor(m/60)%24, mn = m%60, ap = h<12?"AM":"PM";
  return `${h===0?12:h>12?h-12:h}:${mn.toString().padStart(2,"0")} ${ap}`;
};
const waitColor = w => w <= 25 ? "#34D399" : w <= 60 ? "#FBBF24" : "#F87171";
const al = (hex, a) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; };

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#080810;font-family:'Nunito',sans-serif}
  select{-webkit-appearance:none}
  input::-webkit-inner-spin-button{-webkit-appearance:none}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  .fade-up{animation:fadeUp 0.28s ease both}
  .float{animation:float 3s ease-in-out infinite}
  .pop:active{transform:scale(0.97);transition:transform 0.1s}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
`;

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Chip({ label, color, size="sm" }) {
  return <span style={{ display:"inline-flex",alignItems:"center",background:al(color,0.15),color,border:`1px solid ${al(color,0.35)}`,borderRadius:20,padding:size==="xs"?"1px 6px":"3px 9px",fontSize:size==="xs"?9:11,fontWeight:800,whiteSpace:"nowrap" }}>{label}</span>;
}
function Toggle({ label, sub, on, setOn, color="#818CF8" }) {
  return (
    <button onClick={()=>setOn(!on)} className="pop" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"11px 13px",borderRadius:12,cursor:"pointer",background:on?al(color,0.1):"rgba(255,255,255,0.03)",border:`1.5px solid ${on?al(color,0.5):"rgba(255,255,255,0.07)"}`,marginBottom:8,transition:"all 0.2s" }}>
      <div style={{textAlign:"left"}}>
        <div style={{fontSize:13,fontWeight:800,color:on?"#fff":"#94a3b8"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#4a5568",marginTop:1}}>{sub}</div>}
      </div>
      <div style={{width:38,height:22,borderRadius:11,background:on?color:"#1e2d3d",position:"relative",flexShrink:0,transition:"background 0.25s"}}>
        <div style={{position:"absolute",top:3,left:on?19:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.5)"}}/>
      </div>
    </button>
  );
}
function SLabel({ label, color }) {
  return <div style={{fontSize:11,fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",color,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><div style={{width:3,height:14,borderRadius:2,background:color}}/>{label}</div>;
}
function LandBar({ items, activeLand }) {
  const lands = [...new Set(items.filter(x=>x.land).map(x=>x.land))];
  return (
    <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>
      {lands.map((land,i)=>{
        const m=LAND_META[land],active=land===activeLand,done=lands.indexOf(activeLand)>i;
        return(
          <div key={land} style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
            <div style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:800,background:active?m.color:done?al(m.color,0.2):"rgba(255,255,255,0.05)",color:active?"#fff":done?m.color:"#4a5568",border:`1px solid ${active?m.color:done?al(m.color,0.3):"rgba(255,255,255,0.06)"}`,transition:"all 0.3s"}}>{m.emoji} {m.short}</div>
            {i<lands.length-1&&<div style={{fontSize:10,color:"#334155"}}>›</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [riders, setRiders] = useState([{name:"Rider 1",height:54}]);
  const [vibe, setVibe] = useState(null);
  const [crowd, setCrowd] = useState("weekday");
  const [hasExpress, setHasExpress] = useState(false);
  const [startHour, setStartHour] = useState(9);
  const [startMin, setStartMin] = useState(0);
  const [leaveHour, setLeaveHour] = useState(21);
  const [schedule, setSchedule] = useState([]);
  const [bonusRides, setBonusRides] = useState([]);
  const [activeLand, setActiveLand] = useState(LANDS[0]);
  const [expandedId, setExpandedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const heights = riders.map(r=>r.height).filter(h=>h>0);
  const minH = heights.length ? Math.min(...heights) : 0;
  const canGo = vibe && heights.length > 0;
  const startMins = startHour*60 + startMin;
  const endMins = leaveHour*60;

  const nav = s => { window.scrollTo(0,0); setScreen(s); };

  const generate = () => {
    const result = buildSchedule({ vibeKey:vibe, hasExpress, startMins, endMins, crowd, heights });
    setSchedule(result.scheduled);
    setBonusRides(result.bonus);
    setActiveLand(result.scheduled.find(x=>x.land)?.land ?? LANDS[0]);
    setEditMode(false);
    nav("schedule");
  };

  // ── EDIT ACTIONS ──────────────────────────────────────────────────────────
  const deleteItem = idx => {
    const updated = schedule.filter((_,i)=>i!==idx);
    setSchedule(recalcTimes(updated, startMins));
  };

  const addBreak = afterIdx => {
    const after = schedule[afterIdx];
    const item = {type:"break",startMins:after.endMins,endMins:after.endMins+15,id:`break-${Date.now()}`,land:after.land};
    const updated = [...schedule.slice(0,afterIdx+1), item, ...schedule.slice(afterIdx+1)];
    setSchedule(recalcTimes(updated, startMins));
  };

  const handleDragStart = idx => setDragIdx(idx);
  const handleDragOver = (e,idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = idx => {
    if (dragIdx===null||dragIdx===idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const updated = [...schedule];
    const [moved] = updated.splice(dragIdx,1);
    updated.splice(idx,0,moved);
    setSchedule(recalcTimes(updated,startMins));
    setDragIdx(null); setDragOverIdx(null);
  };

  // Tap bonus ride → insert at best spot (after last ride in its land, or at end)
  const addBonusRide = ride => {
    const landItems = schedule.map((item,i)=>({item,i})).filter(({item})=>item.land===ride.land&&item.type==="ride");
    const insertAfter = landItems.length ? landItems[landItems.length-1].i : schedule.length-1;
    const prev = schedule[insertAfter];
    const wait = getWait(ride.id, Math.floor((prev?.endMins??startMins)/60), hasExpress, crowd);
    const total = ride.isShow ? ride.dur+3 : wait+ride.dur+2;
    // walk buffer before new ride
    const walkItem = {type:"walk",land:ride.land,startMins:prev?.endMins??startMins,endMins:(prev?.endMins??startMins)+10,id:`walk-bonus-${Date.now()}`};
    const rideItem = {type:"ride",ride,wait,land:ride.land,startMins:walkItem.endMins,endMins:walkItem.endMins+total,id:`ride-${ride.id}-${Date.now()}`,heightAlert:minH>0&&minH<ride.minH};
    const updated = [...schedule.slice(0,insertAfter+1), walkItem, rideItem, ...schedule.slice(insertAfter+1)];
    setSchedule(recalcTimes(updated,startMins));
    setBonusRides(bonusRides.filter(r=>r.id!==ride.id));
  };

  // ── SHARE ─────────────────────────────────────────────────────────────────
  const shareText = () => {
    const vc = VIBE[vibe]??VIBE.firsttimer;
    let t = `🎢 Epic Universe Day Plan\n${vc.emoji} ${vc.label} · ${crowd==="weekend"?"Weekend":"Weekday"}\n`;
    t += `${hasExpress?"⚡ Express Pass  ":""}Start: ${fmt12(startMins)} → Leave: ${fmt12(endMins)}\n`;
    t += `${"─".repeat(28)}\n`;
    schedule.forEach(item => {
      if (item.type==="ride")    t+=`\n${fmt12(item.startMins)}  🎢 ${item.ride.name}\n              Wait ~${item.wait}min${hasExpress&&item.ride.express?" (Express)":""}\n`;
      if (item.type==="travel")  t+=`\n${fmt12(item.startMins)}  🚶 Walk to ${item.to} (~15min)\n`;
      if (item.type==="walk")    t+=`\n${fmt12(item.startMins)}  🚶 Walk (~10min)\n`;
      if (item.type==="meal")    t+=`\n${fmt12(item.startMins)}  🍽️ Lunch — ${item.rec?.name??""}\n              ${item.rec?.item?.split("—")[0]?.trim()??""}\n`;
      if (item.type==="snack")   t+=`\n${fmt12(item.startMins)}  🍿 Snack — ${item.rec?.name??""}\n`;
      if (item.type==="break")   t+=`\n${fmt12(item.startMins)}  😮‍💨 Rest Break (15min)\n`;
    });
    const rides = schedule.filter(s=>s.type==="ride");
    t += `\n${"─".repeat(28)}\n${rides.length} rides · ~${rides.reduce((s,r)=>s+(r.wait||0),0)}min waiting\nLeave by ${fmt12(endMins)}`;
    return t;
  };

  const copy = () => {
    navigator.clipboard.writeText(shareText()).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  };

  const app = {minHeight:"100vh",background:"#080810",fontFamily:"'Nunito',sans-serif",color:"#f1f5f9",maxWidth:480,margin:"0 auto",paddingBottom:48};
  const pad = {padding:"0 16px"};

  // ══════════════════════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (screen==="setup") return (
    <div style={app}>
      <style>{CSS}</style>
      <div style={{background:"linear-gradient(160deg,#1a1040 0%,#0c0820 60%,#080810 100%)",padding:"32px 20px 26px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(129,140,248,0.15) 0%,transparent 70%)"}}/>
        <div className="float" style={{fontSize:52,marginBottom:8,display:"inline-block",position:"relative"}}>🎢</div>
        <h1 style={{fontSize:28,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,position:"relative"}}>
          Epic Universe<br/><span style={{background:"linear-gradient(90deg,#818CF8,#A78BFA,#F87171)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Day Planner</span>
        </h1>
        <p style={{fontSize:13,color:"#64748b",marginTop:8,position:"relative"}}>Universal Orlando · Build your perfect day</p>
      </div>

      <div style={{...pad,paddingTop:20}}>

        {/* PARTY */}
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:18,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.07)"}}>
          <SLabel label="👥 Your Party" color="#818CF8"/>
          {/* Height guide */}
          <div style={{display:"flex",gap:6,marginBottom:12,padding:"10px 12px",background:"rgba(129,140,248,0.06)",borderRadius:10,border:"1px solid rgba(129,140,248,0.14)"}}>
            <div style={{fontSize:11,color:"#64748b",fontWeight:700,marginRight:4,whiteSpace:"nowrap",paddingTop:1}}>Heights:</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["Any","Carousel, Viking Camp, Playground","#94a3b8"],["34\"+","Yoshi's, Fyre Drill","#34D399"],["40\"+","Ministry, Mario Kart, Mine-Cart, Wing Gliders, Werewolf","#FBBF24"],["48\"+","Stardust, Monsters, Dragon Racer","#F87171"]].map(([h,rides,c])=>(
                <div key={h} style={{fontSize:10,color:c,fontWeight:800}}><span style={{fontFamily:"monospace"}}>{h}</span> <span style={{color:"#4a5568",fontWeight:600}}>{rides}</span></div>
              ))}
            </div>
          </div>
          {riders.map((r,i)=>(
            <div key={i} className="fade-up" style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <input value={r.name} onChange={e=>{const a=[...riders];a[i]={...a[i],name:e.target.value};setRiders(a);}} placeholder={`Rider ${i+1}`}
                style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:10,padding:"9px 12px",color:"#f1f5f9",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",outline:"none"}}/>
              <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:10,padding:"6px 10px",gap:6}}>
                <button onClick={()=>{const a=[...riders];a[i]={...a[i],height:Math.max(0,a[i].height-1)};setRiders(a);}} style={{background:"none",border:"none",color:"#818CF8",cursor:"pointer",fontSize:18,fontWeight:900,padding:"0 2px",lineHeight:1}}>−</button>
                <span style={{fontSize:15,fontWeight:900,color:"#f1f5f9",minWidth:28,textAlign:"center"}}>{r.height||"?"}</span>
                <button onClick={()=>{const a=[...riders];a[i]={...a[i],height:Math.min(96,a[i].height+1)};setRiders(a);}} style={{background:"none",border:"none",color:"#818CF8",cursor:"pointer",fontSize:18,fontWeight:900,padding:"0 2px",lineHeight:1}}>+</button>
                <span style={{fontSize:10,color:"#4a5568",fontWeight:700}}>in</span>
              </div>
              {riders.length>1&&<button onClick={()=>setRiders(riders.filter((_,j)=>j!==i))} style={{background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"8px 10px",color:"#f87171",cursor:"pointer",fontSize:13,fontWeight:900}}>✕</button>}
            </div>
          ))}
          {riders.length<6&&<button onClick={()=>setRiders([...riders,{name:`Rider ${riders.length+1}`,height:54}])} style={{width:"100%",padding:"9px",borderRadius:10,border:"1.5px dashed rgba(129,140,248,0.35)",background:"none",color:"#818CF8",fontSize:13,fontWeight:800,cursor:"pointer",marginTop:2}}>+ Add Rider</button>}
        </div>

        {/* VIBE */}
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:18,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.07)"}}>
          <SLabel label="🎯 What's Your Vibe?" color="#F87171"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {Object.entries(VIBE).map(([key,v])=>(
              <button key={key} onClick={()=>setVibe(key)} className="pop" style={{padding:"13px 10px",borderRadius:14,cursor:"pointer",textAlign:"left",background:vibe===key?al(v.color,0.16):"rgba(255,255,255,0.03)",border:`2px solid ${vibe===key?v.color:"rgba(255,255,255,0.07)"}`,transition:"all 0.2s"}}>
                <div style={{fontSize:24,marginBottom:4}}>{v.emoji}</div>
                <div style={{fontSize:13,fontWeight:900,color:vibe===key?"#fff":"#94a3b8"}}>{v.label}</div>
                <div style={{fontSize:10,color:"#4a5568",marginTop:3,lineHeight:1.35}}>{v.desc}</div>
                {vibe===key&&<div style={{marginTop:5,fontSize:10,color:v.color,fontWeight:800,lineHeight:1.4}}>
                  {key==="thrill"?"Stardust → Dark Universe → Berk...":key==="family"?"Nintendo → Isle of Berk → Celestial...":key==="firsttimer"?"Ministry first → Nintendo → Celestial...":"Celestial → Ministry → Nintendo..."}
                </div>}
              </button>
            ))}
          </div>
        </div>

        {/* DAY SETTINGS */}
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:18,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.07)"}}>
          <SLabel label="📅 Your Day" color="#34D399"/>

          {/* Weekday / Weekend */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[["weekday","Weekday","📅","Shorter waits · 0.65×"],["weekend","Weekend","🎉","Busier · 1.35×"]].map(([val,lbl,em,sub])=>(
              <button key={val} onClick={()=>setCrowd(val)} className="pop" style={{padding:"11px 10px",borderRadius:12,cursor:"pointer",textAlign:"left",background:crowd===val?al("#34D399",0.12):"rgba(255,255,255,0.03)",border:`2px solid ${crowd===val?"#34D399":"rgba(255,255,255,0.07)"}`,transition:"all 0.18s"}}>
                <div style={{fontSize:20,marginBottom:3}}>{em}</div>
                <div style={{fontSize:13,fontWeight:900,color:crowd===val?"#fff":"#94a3b8"}}>{lbl}</div>
                <div style={{fontSize:10,color:"#4a5568",marginTop:1}}>{sub}</div>
              </button>
            ))}
          </div>

          {/* Times */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:800,marginBottom:5}}>Start time</div>
              <div style={{fontSize:10,color:"#4a5568",marginBottom:6,lineHeight:1.4}}>Park opens 9am · Hotel guests enter 8am</div>
              <div style={{display:"flex",gap:6}}>
                <div style={{position:"relative",flex:1}}>
                  <select value={startHour} onChange={e=>setStartHour(Number(e.target.value))} style={{width:"100%",padding:"9px 28px 9px 10px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"#f1f5f9",fontSize:13,fontWeight:800,fontFamily:"'Nunito',sans-serif",outline:"none",cursor:"pointer"}}>
                    {[7,8,9,10,11].map(h=><option key={h} value={h} style={{background:"#1a1a2e"}}>{h > 12 ? h-12 : h}{h<12?" AM":" PM"}</option>)}
                  </select>
                  <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:"#64748b",pointerEvents:"none",fontSize:11}}>▾</span>
                </div>
                <div style={{position:"relative",width:70}}>
                  <select value={startMin} onChange={e=>setStartMin(Number(e.target.value))} style={{width:"100%",padding:"9px 24px 9px 10px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"#f1f5f9",fontSize:13,fontWeight:800,fontFamily:"'Nunito',sans-serif",outline:"none",cursor:"pointer"}}>
                    {[0,15,30,45].map(m=><option key={m} value={m} style={{background:"#1a1a2e"}}>{m.toString().padStart(2,"0")}</option>)}
                  </select>
                  <span style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",color:"#64748b",pointerEvents:"none",fontSize:11}}>▾</span>
                </div>
              </div>
            </div>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:800,marginBottom:5}}>Leave by</div>
              <div style={{fontSize:10,color:"#4a5568",marginBottom:6,lineHeight:1.4}}>Park closes 9pm most days</div>
              <div style={{position:"relative"}}>
                <select value={leaveHour} onChange={e=>setLeaveHour(Number(e.target.value))} style={{width:"100%",padding:"9px 28px 9px 10px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"#f1f5f9",fontSize:13,fontWeight:800,fontFamily:"'Nunito',sans-serif",outline:"none",cursor:"pointer"}}>
                  {[13,14,15,16,17,18,19,20,21].map(h=><option key={h} value={h} style={{background:"#1a1a2e"}}>{h>12?h-12:h}:00 {h<12?"AM":"PM"}</option>)}
                </select>
                <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:"#64748b",pointerEvents:"none",fontSize:11}}>▾</span>
              </div>
            </div>
          </div>

          <Toggle label="⚡ Express Pass" sub="~50% shorter waits on eligible rides" on={hasExpress} setOn={setHasExpress} color="#F87171"/>
        </div>

        <button className="pop" disabled={!canGo} onClick={generate} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:canGo?"linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#F87171 100%)":"rgba(255,255,255,0.06)",color:canGo?"#fff":"#4a5568",fontSize:16,fontWeight:900,cursor:canGo?"pointer":"not-allowed",boxShadow:canGo?"0 4px 28px rgba(129,140,248,0.4)":"none",transition:"all 0.2s"}}>
          {!canGo?(vibe?"Add rider heights ↑":"Pick a vibe first ↑"):"Build My Day 🚀"}
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  // SCHEDULE SCREEN
  // ══════════════════════════════════════════════════════════════════
  const vc = VIBE[vibe]??VIBE.firsttimer;
  const totalRides = schedule.filter(s=>s.type==="ride").length;
  const totalWait = schedule.filter(s=>s.type==="ride").reduce((s,r)=>s+(r.wait||0),0);

  return (
    <div style={app}>
      <style>{CSS}</style>

      {/* Sticky header */}
      <div style={{background:"rgba(8,8,16,0.96)",padding:"12px 16px 10px",borderBottom:"1px solid rgba(255,255,255,0.05)",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(16px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <button onClick={()=>nav("setup")} style={{background:"none",border:"none",color:"#818CF8",cursor:"pointer",fontSize:12,fontWeight:800,padding:0}}>← Back</button>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setEditMode(!editMode)} className="pop" style={{padding:"5px 11px",borderRadius:8,border:`1.5px solid ${editMode?"#FBBF24":al("#FBBF24",0.3)}`,background:editMode?al("#FBBF24",0.15):"none",color:editMode?"#FBBF24":"#64748b",fontSize:12,fontWeight:800,cursor:"pointer"}}>
              {editMode?"✅ Done":"✏️ Edit"}
            </button>
            <button onClick={()=>setShowShare(true)} className="pop" style={{padding:"5px 11px",borderRadius:8,border:`1.5px solid ${al("#34D399",0.3)}`,background:"none",color:"#34D399",fontSize:12,fontWeight:800,cursor:"pointer"}}>📤 Share</button>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <div><span style={{fontSize:15,fontWeight:900}}>Your Epic Day </span><span>{vc.emoji}</span></div>
          <div style={{display:"flex",gap:10,fontSize:12,fontWeight:800}}>
            <span style={{color:"#34D399"}}>🎢 {totalRides} rides</span>
            <span style={{color:"#FBBF24"}}>⏱ {totalWait>=60?`${Math.floor(totalWait/60)}h ${totalWait%60}m`:`${totalWait}m`} waiting</span>
          </div>
        </div>
        <LandBar items={schedule} activeLand={activeLand}/>
        {editMode&&<div style={{marginTop:7,padding:"5px 10px",background:al("#FBBF24",0.08),borderRadius:8,border:`1px solid ${al("#FBBF24",0.2)}`,fontSize:11,color:"#fde68a",fontWeight:700}}>Drag ⠿ to reorder · ✕ to delete · + to add a rest break</div>}
      </div>

      <div style={{...pad,paddingTop:14}}>
        {/* Summary chips */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {[{v:`${totalRides} rides`,c:"#818CF8"},{v:totalWait>=60?`${Math.floor(totalWait/60)}h ${totalWait%60}m waiting`:`${totalWait}m waiting`,c:"#FBBF24"},{v:hasExpress?"⚡ Express":"No Express",c:hasExpress?"#F87171":"#4a5568"},{v:crowd==="weekend"?"🎉 Weekend":"📅 Weekday",c:"#34D399"},{v:`${fmt12(startMins)} – ${fmt12(endMins)}`,c:"#818CF8"}].map(s=>(
            <div key={s.v} style={{padding:"4px 10px",borderRadius:20,background:al(s.c,0.1),border:`1px solid ${al(s.c,0.25)}`,fontSize:11,fontWeight:800,color:s.c}}>{s.v}</div>
          ))}
        </div>

        {/* ── TIMELINE ── */}
        {schedule.map((item,i) => {
          const isLast=i===schedule.length-1;
          const isDragOver=dragOverIdx===i;
          const wrapStyle={display:"flex",gap:10,marginBottom:4,opacity:dragIdx===i?0.4:1,background:isDragOver?al("#818CF8",0.06):"none",borderRadius:12,transition:"opacity 0.15s"};
          const dragProps=editMode?{draggable:true,onDragStart:()=>handleDragStart(i),onDragOver:e=>handleDragOver(e,i),onDrop:()=>handleDrop(i),onDragEnd:()=>{setDragIdx(null);setDragOverIdx(null);}}:{};

          // ── TRAVEL between lands ──
          if (item.type==="travel") {
            const fm=LAND_META[item.from], tm=LAND_META[item.to];
            return (
              <div key={item.id} style={wrapStyle} {...dragProps}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#334155",marginTop:9,flexShrink:0}}/>
                  {!isLast&&<div style={{width:2,flex:1,background:"rgba(255,255,255,0.04)",marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:4,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,padding:"7px 12px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:8}}>
                    {editMode&&<span style={{fontSize:14,cursor:"grab",color:"#334155"}}>⠿</span>}
                    <span style={{fontSize:12}}>{fm?.emoji}</span>
                    <span style={{fontSize:11,color:"#4a5568",fontWeight:800,flex:1}}>Walk to <span style={{color:tm?.color}}>{tm?.emoji} {item.to}</span> · 15 min</span>
                    <span style={{fontSize:11,color:"#334155"}}>{fmt12(item.startMins)}</span>
                  </div>
                  {editMode&&<button onClick={()=>deleteItem(i)} style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,padding:"5px 7px",color:"#f87171",cursor:"pointer",fontSize:12,fontWeight:900,flexShrink:0}}>✕</button>}
                </div>
              </div>
            );
          }

          // ── WALK within land ──
          if (item.type==="walk") {
            const meta=LAND_META[item.land]??{color:"#64748b",emoji:"🚶"};
            return (
              <div key={item.id} style={wrapStyle} {...dragProps}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#1e293b",border:`1px solid #334155`,marginTop:9,flexShrink:0}}/>
                  {!isLast&&<div style={{width:2,flex:1,background:"rgba(255,255,255,0.03)",marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:4}}>
                  <div style={{padding:"5px 12px",borderRadius:8,background:"rgba(255,255,255,0.01)",border:"1px dashed rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:10,color:"#334155"}}>🚶</span>
                    <span style={{fontSize:10,color:"#334155",fontWeight:700}}>Walk around land · 10 min · {fmt12(item.startMins)}</span>
                  </div>
                </div>
              </div>
            );
          }

          // ── MEAL / SNACK / BREAK ──
          if (item.type==="meal"||item.type==="snack"||item.type==="break") {
            const meta=LAND_META[item.land]??{color:"#A78BFA",emoji:"🍴"};
            const isMeal=item.type==="meal", isBreak=item.type==="break";
            const dc=isMeal?"#FBBF24":isBreak?"#94a3b8":"#A78BFA";
            return (
              <div key={item.id} style={wrapStyle} {...dragProps}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:dc,marginTop:9,flexShrink:0}}/>
                  {!isLast&&<div style={{width:2,flex:1,background:"rgba(255,255,255,0.04)",marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:4,display:"flex",alignItems:"flex-start",gap:8}}>
                  <div style={{flex:1,padding:"10px 12px",borderRadius:12,background:isMeal?al("#FBBF24",0.05):isBreak?"rgba(255,255,255,0.02)":al(meta.color,0.04),border:`1.5px dashed ${isMeal?al("#FBBF24",0.2):isBreak?"rgba(255,255,255,0.07)":al(meta.color,0.15)}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:item.rec?6:0}}>
                      {editMode&&<span style={{fontSize:14,cursor:"grab",color:"#334155"}}>⠿</span>}
                      <span style={{fontSize:16}}>{isMeal?"🍽️":isBreak?"😮‍💨":"🍿"}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:900,color:isMeal?"#fde68a":isBreak?"#94a3b8":"#c4b5fd"}}>{isMeal?"Lunch Break":isBreak?"Rest Break":"Snack Stop"}</div>
                        <div style={{fontSize:11,color:"#4a5568"}}>{fmt12(item.startMins)} · {item.endMins-item.startMins}min</div>
                      </div>
                    </div>
                    {item.rec&&<div style={{background:al(meta.color,0.08),borderRadius:8,padding:"8px 10px",border:`1px solid ${al(meta.color,0.15)}`}}>
                      <div style={{fontSize:13,fontWeight:900,color:meta.color,marginBottom:2}}>{item.rec.emoji} {item.rec.name}</div>
                      <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.45}}>{item.rec.item}</div>
                    </div>}
                  </div>
                  {editMode&&<button onClick={()=>deleteItem(i)} style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,padding:"5px 7px",color:"#f87171",cursor:"pointer",fontSize:12,fontWeight:900,flexShrink:0,marginTop:2}}>✕</button>}
                </div>
              </div>
            );
          }

          // ── RIDE ──
          if (item.type==="ride") {
            const meta=LAND_META[item.land]??{color:"#818CF8",emoji:"🎢"};
            const isExp=expandedId===item.id;
            const isMustDo=vc.priority[item.ride.id]!=null;
            return (
              <div key={item.id} style={wrapStyle} {...dragProps} className="fade-up">
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:meta.color,marginTop:13,flexShrink:0,boxShadow:`0 0 8px ${al(meta.color,0.55)}`}}/>
                  {!isLast&&<div style={{width:2,flex:1,background:"rgba(255,255,255,0.05)",marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:4,display:"flex",alignItems:"flex-start",gap:8}}>
                  <div style={{flex:1}}>
                    <div className="pop" onClick={()=>!editMode&&setExpandedId(isExp?null:item.id)} style={{background:al(meta.color,0.05),borderRadius:13,overflow:"hidden",border:`1.5px solid ${al(meta.color,0.28)}`,borderLeft:`3px solid ${meta.color}`,cursor:editMode?"grab":"pointer"}}>
                      <div style={{padding:"11px 12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                              {editMode&&<span style={{fontSize:14,cursor:"grab",color:"#334155",marginRight:2}}>⠿</span>}
                              <span style={{fontSize:11,color:meta.color,fontWeight:900}}>{meta.emoji} {item.land}</span>
                              {isMustDo&&<Chip label="★ Must Do" color={meta.color} size="xs"/>}
                              {!item.ride.express&&<Chip label="No Express" color="#F87171" size="xs"/>}
                              {item.ride.isShow&&<Chip label="🎭 Show" color="#A78BFA" size="xs"/>}
                              {item.heightAlert&&<Chip label="⚠️ Height" color="#F87171" size="xs"/>}
                            </div>
                            <div style={{fontSize:15,fontWeight:900,color:"#f1f5f9",marginBottom:2}}>{item.ride.name}</div>
                            <div style={{fontSize:11,color:"#4a5568"}}>{fmt12(item.startMins)} → {fmt12(item.endMins)}</div>
                          </div>
                          <div style={{flexShrink:0,textAlign:"right"}}>
                            {item.ride.isShow ? (
                              <div style={{fontSize:13,fontWeight:900,color:"#A78BFA"}}>🎭</div>
                            ) : (
                              <>
                                <div style={{fontSize:18,fontWeight:900,color:waitColor(item.wait),fontFamily:"monospace",lineHeight:1}}>{item.wait}m</div>
                                <div style={{fontSize:9,color:"#334155",fontWeight:700,marginTop:1}}>wait</div>
                                {hasExpress&&item.ride.express&&<div style={{fontSize:9,color:"#fca5a5",fontWeight:800,marginTop:2}}>⚡</div>}
                              </>
                            )}
                          </div>
                        </div>
                        {!item.ride.isShow&&<div style={{marginTop:7,height:3,borderRadius:2,background:"rgba(255,255,255,0.06)"}}>
                          <div style={{width:`${Math.min(100,(item.wait/200)*100)}%`,height:"100%",borderRadius:2,background:waitColor(item.wait)}}/>
                        </div>}
                      </div>
                      {isExp&&!editMode&&(
                        <div className="fade-up" style={{padding:"0 12px 11px",borderTop:`1px solid ${al(meta.color,0.12)}`,paddingTop:9}}>
                          {item.heightAlert&&<div style={{padding:"6px 10px",background:al("#F87171",0.1),borderRadius:8,border:`1px solid ${al("#F87171",0.25)}`,fontSize:11,color:"#fca5a5",fontWeight:700,marginBottom:8}}>⚠️ One or more riders may not meet the {item.ride.minH}" height requirement</div>}
                          <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.55,margin:"0 0 8px"}}>💡 {item.ride.tip}</p>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <Chip label={item.ride.minH===0?"Any height":`${item.ride.minH}" min`} color="#64748b" size="xs"/>
                            <Chip label={`~${item.ride.dur}min ride`} color="#64748b" size="xs"/>
                            {item.ride.single&&<Chip label="Single rider" color="#818CF8" size="xs"/>}
                          </div>
                        </div>
                      )}
                    </div>
                    {editMode&&!isLast&&(
                      <button onClick={()=>addBreak(i)} style={{width:"100%",marginTop:4,padding:"4px",borderRadius:8,border:"1px dashed rgba(167,139,250,0.25)",background:"none",color:"#4a5568",fontSize:10,fontWeight:800,cursor:"pointer"}}>+ add rest break here</button>
                    )}
                  </div>
                  <button onClick={()=>{ deleteItem(i); setBonusRides(prev=>[...prev, item.ride]); }} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:11,padding:"8px 10px",color:"#f87171",cursor:"pointer",flexShrink:0,marginTop:2,minWidth:44}}>
                    <span style={{fontSize:16,lineHeight:1}}>−</span>
                    <span style={{fontSize:9,fontWeight:800}}>Remove</span>
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Leave by */}
        <div style={{display:"flex",gap:10,alignItems:"center",padding:"10px 13px",marginTop:4,background:al("#34D399",0.05),borderRadius:12,border:`1px solid ${al("#34D399",0.2)}`}}>
          <div style={{width:12,height:12,borderRadius:"50%",background:"#34D399",flexShrink:0,boxShadow:"0 0 8px rgba(52,211,153,0.5)"}}/>
          <div style={{fontSize:14,fontWeight:900,color:"#34D399"}}>🏁 Leave by {fmt12(endMins)}</div>
        </div>

        {/* ── BONUS RIDES SHELF ── */}
        {bonusRides.length > 0 && (
          <div style={{marginTop:20}}>
            <div style={{fontSize:12,fontWeight:900,color:"#64748b",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:3,height:14,borderRadius:2,background:"#334155"}}/>
              Not in your schedule · Tap to add
            </div>
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,padding:12,border:"1px solid rgba(255,255,255,0.06)"}}>
              {bonusRides.map(ride => {
                const meta=LAND_META[ride.land]??{color:"#818CF8",emoji:"🎢"};
                const tooShort=minH>0&&minH<ride.minH;
                return (
                  <div key={ride.id} onClick={()=>addBonusRide(ride)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 11px",borderRadius:11,marginBottom:6,background:al(meta.color,0.04),border:`1px solid ${al(meta.color,0.18)}`,cursor:"pointer",transition:"all 0.15s",opacity:1}} className="pop">
                    <div style={{width:28,height:28,borderRadius:8,background:al(meta.color,0.15),border:`1px solid ${al(meta.color,0.3)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>+</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:800,color:"#f1f5f9"}}>{ride.name}</span>
                        {tooShort&&<Chip label="⚠️ Height" color="#F87171" size="xs"/>}
                        {ride.isShow&&<Chip label="🎭 Show" color="#A78BFA" size="xs"/>}
                        {!ride.express&&<Chip label="No Express" color="#F87171" size="xs"/>}
                      </div>
                      <div style={{fontSize:11,color:"#4a5568",marginTop:1}}>{meta.emoji} {ride.land} · {ride.minH===0?"Any height":`${ride.minH}" min`}</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:800,color:meta.color,flexShrink:0}}>Add →</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{height:16}}/>
        <button className="pop" onClick={()=>{setScreen("setup");setSchedule([]);setBonusRides([]);setVibe(null);setEditMode(false);}} style={{width:"100%",padding:"13px",borderRadius:14,border:"2px solid rgba(129,140,248,0.3)",background:"none",color:"#818CF8",fontSize:14,fontWeight:900,cursor:"pointer"}}>
          ↩ Plan a New Day
        </button>
        <div style={{height:20}}/>
      </div>

      {/* ── SHARE SHEET ── */}
      {showShare&&(
        <div onClick={()=>setShowShare(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} className="fade-up" style={{background:"#111827",borderRadius:"20px 20px 0 0",padding:"20px 20px 36px",width:"100%",maxWidth:480,border:"1px solid rgba(255,255,255,0.09)"}}>
            <div style={{width:36,height:4,borderRadius:2,background:"#334155",margin:"0 auto 16px"}}/>
            <div style={{fontSize:16,fontWeight:900,marginBottom:3}}>📤 Share Your Plan</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:14}}>Copy and paste into iMessage, WhatsApp, Notes — anywhere</div>
            <div style={{background:"#0f172a",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid rgba(255,255,255,0.06)",maxHeight:200,overflowY:"auto"}}>
              <pre style={{fontSize:11,color:"#94a3b8",lineHeight:1.6,whiteSpace:"pre-wrap",fontFamily:"monospace",margin:0}}>{shareText()}</pre>
            </div>
            <button className="pop" onClick={copy} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:copied?"linear-gradient(135deg,#34D399,#059669)":"linear-gradient(135deg,#818CF8,#A78BFA)",color:"#fff",fontSize:15,fontWeight:900,cursor:"pointer",marginBottom:10}}>
              {copied?"✅ Copied!":"📋 Copy to Clipboard"}
            </button>
            <button onClick={()=>setShowShare(false)} style={{width:"100%",padding:"12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",background:"none",color:"#64748b",fontSize:14,fontWeight:800,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
