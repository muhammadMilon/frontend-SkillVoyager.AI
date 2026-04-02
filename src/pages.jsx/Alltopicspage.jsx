import { useState } from "react";
import _courses from "../../data/coursesData";

const PRICE_MAP = { 1: 799, 2: 999, 5: 599 };
const courses = _courses.map(c => ({ ...c, price: PRICE_MAP[c.id] || 0 }));

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg:       "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
  card:     "rgba(23,182,168,0.05)",
  cardHov:  "rgba(23,182,168,0.10)",
  border:   "rgba(23,182,168,0.14)",
  borderHv: "rgba(23,182,168,0.40)",
  teal:     "#17B6A8",
  tealDim:  "rgba(23,182,168,0.08)",
  tealMid:  "rgba(23,182,168,0.18)",
  cyan:     "#0fd4c4",
  gold:     "#F5C842",
  text:     "rgba(255,255,255,0.72)",
  textDim:  "rgba(255,255,255,0.38)",
};

const getCategoryColor = (category) => {
  const map = {
    "AI/ML":           { from: "#17B6A8", to: "#0a8c82", glow: "#17B6A8" },
    "Frontend":        { from: "#0fd4c4", to: "#0a9e96", glow: "#0fd4c4" },
    "Programming":     { from: "#F5C842", to: "#c9a030", glow: "#F5C842" },
    "E-commerce":      { from: "#17B6A8", to: "#0d7a73", glow: "#17B6A8" },
    "Design":          { from: "#0fd4c4", to: "#17B6A8", glow: "#0fd4c4" },
    "Data":            { from: "#4fc3f7", to: "#0288d1", glow: "#4fc3f7" },
    "Backend":         { from: "#17B6A8", to: "#0a8c82", glow: "#17B6A8" },
    "DevOps":          { from: "#F5C842", to: "#c9a030", glow: "#F5C842" },
    "Architecture":    { from: "#0fd4c4", to: "#17B6A8", glow: "#0fd4c4" },
    "Database":        { from: "#4fc3f7", to: "#0288d1", glow: "#4fc3f7" },
    "Security":        { from: "#f87171", to: "#ef4444", glow: "#f87171" },
    "AI":              { from: "#0fd4c4", to: "#17B6A8", glow: "#0fd4c4" },
    "DevTools":        { from: "#17B6A8", to: "#0fd4c4", glow: "#17B6A8" },
    "Development":     { from: "#F5C842", to: "#c9a030", glow: "#F5C842" },
    "Web Development": { from: "#17B6A8", to: "#0fd4c4", glow: "#17B6A8" },
    "Automation":      { from: "#0fd4c4", to: "#17B6A8", glow: "#0fd4c4" },
    "Marketing":       { from: "#fb7185", to: "#f43f5e", glow: "#fb7185" },
  };
  return map[category] || { from: "#17B6A8", to: "#0fd4c4", glow: "#17B6A8" };
};

const buildTopics = () => {
  const topicMap = {};
  courses.forEach(course => {
    const cat = course.category || "Other";
    if (!topicMap[cat]) topicMap[cat] = { name: cat, count: 0, courses: [] };
    topicMap[cat].count++;
    topicMap[cat].courses.push(course);
  });
  return Object.values(topicMap).sort((a, b) => b.count - a.count);
};

const allTopics = buildTopics();

// ─── TOPIC DETAIL PANEL ───────────────────────────────────────────────────────
const TopicPanel = ({ topic, onClose, onNavigateToCourses }) => {
  const color = getCategoryColor(topic.name);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(2,8,18,0.92)", backdropFilter:"blur(20px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:720,
        background:"linear-gradient(170deg, #071320 0%, #060f1a 100%)",
        border:`1px solid ${T.border}`,
        borderRadius:24, overflow:"hidden",
        boxShadow:`0 0 80px ${color.glow}22, 0 40px 80px rgba(0,0,0,0.7)`,
        animation:"panelUp 0.3s cubic-bezier(.16,1,.3,1)",
      }}>

        {/* HEADER */}
        <div style={{ position:"relative", padding:"28px 32px 24px", background:`linear-gradient(135deg, ${color.from}10, ${color.to}06, transparent)`, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, background:`radial-gradient(circle, ${color.from}20 0%, transparent 70%)`, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${color.from}55, transparent)` }}/>

          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:32, height:32, borderRadius:10, background:T.tealDim, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.textDim, transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.tealMid; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.color = T.textDim; }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:64, height:64, borderRadius:18, flexShrink:0, background:`linear-gradient(135deg, ${color.from}18, ${color.to}10)`, border:`1px solid ${color.from}35`, boxShadow:`0 0 24px ${color.glow}25`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={color.from} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <div>
              <p style={{ color:color.from, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:6 }}>Topic</p>
              <h2 style={{ color:"white", fontWeight:800, fontSize:"1.85rem", lineHeight:1.15, letterSpacing:"-0.025em", margin:"0 0 5px" }}>{topic.name}</h2>
              <p style={{ color:T.textDim, fontSize:"0.9rem", margin:0 }}>
                <span style={{ color:color.from, fontWeight:700 }}>{topic.count}</span> course{topic.count!==1?"s":""} available
              </p>
            </div>
          </div>
        </div>

        {/* COURSE LIST */}
        <div style={{ padding:"8px 20px 4px", maxHeight:"44vh", overflowY:"auto", scrollbarWidth:"thin", scrollbarColor:`${T.teal} transparent` }}>
          {topic.courses.map((course, idx) => {
            const isFree = !course.price || course.price === 0;
            return (
              <div key={course.id} onClick={() => onNavigateToCourses(topic.name)}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:14, marginBottom:8, background:T.tealDim, border:`1px solid ${T.border}`, cursor:"pointer", transition:"all 0.16s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color.from}12`; e.currentTarget.style.borderColor = `${color.from}40`; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.borderColor = T.border; }}>
                <span style={{ fontSize:12, fontWeight:800, color:T.textDim, width:26, flexShrink:0, textAlign:"center", fontVariantNumeric:"tabular-nums" }}>{String(idx+1).padStart(2,"0")}</span>
                <div style={{ width:84, height:54, borderRadius:10, overflow:"hidden", flexShrink:0, border:`1px solid ${T.border}` }}>
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt={course.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg, ${color.from}, ${color.to})` }}/>
                  }
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color:"rgba(255,255,255,0.90)", fontWeight:600, fontSize:"0.95rem", lineHeight:1.35, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>{course.title}</p>
                  <p style={{ color:T.textDim, fontSize:"0.82rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:"3px 0 0" }}>{course.description}</p>
                </div>
                <span style={{ padding:"5px 12px", borderRadius:9, flexShrink:0, fontSize:"0.8rem", fontWeight:700, background:isFree?T.tealDim:"rgba(245,200,66,0.10)", color:isFree?T.teal:T.gold, border:`1px solid ${isFree?T.border:"rgba(245,200,66,0.20)"}` }}>
                  {isFree ? "Free" : `৳${course.price}`}
                </span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{ padding:"18px 28px 30px" }}>
          <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.border}, transparent)`, marginBottom:18 }}/>
          <button onClick={() => onNavigateToCourses(topic.name)} style={{ width:"100%", padding:"17px 24px", borderRadius:16, fontWeight:700, fontSize:"1rem", color:"white", background:`linear-gradient(135deg, ${color.from} 0%, ${color.to} 100%)`, border:`1px solid ${color.from}55`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9, boxShadow:`0 4px 22px ${color.glow}40, 0 10px 38px ${color.glow}20`, transition:"all 0.16s", letterSpacing:"-0.01em" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${color.glow}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 22px ${color.glow}40`; }}>
            View All {topic.name} Courses
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
      <style>{`@keyframes panelUp { from { transform: translateY(22px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AllTopicsPage({ onBack, onSelectTopic }) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const filtered = allTopics.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleNavigateToCourses = (topicName) => {
    setSelectedTopic(null);
    if (onSelectTopic) onSelectTopic(topicName);
    if (onBack) onBack(topicName);
  };

  return (
    <div style={{ minHeight:"100vh", color:"white", background: T.bg }}>

      {/* BG effects */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-8%", left:"10%", width:700, height:700, background:`radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 60%)`, borderRadius:"50%", filter:"blur(50px)" }}/>
        <div style={{ position:"absolute", top:"30%", right:"-5%", width:500, height:500, background:`radial-gradient(circle, rgba(15,212,196,0.05) 0%, transparent 60%)`, borderRadius:"50%", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", bottom:"5%", left:"30%", width:600, height:350, background:`radial-gradient(circle, rgba(23,182,168,0.04) 0%, transparent 60%)`, borderRadius:"50%", filter:"blur(70px)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)`, backgroundSize:"40px 40px", mask:"radial-gradient(ellipse at center, black 20%, transparent 80%)", WebkitMask:"radial-gradient(ellipse at center, black 20%, transparent 80%)" }}/>
      </div>

      <div style={{ position:"relative", width:"100%", maxWidth:1700, margin:"0 auto", padding:"80px 56px 88px" }}>

        {/* BACK */}
        {onBack && (
          <button onClick={() => onBack(null)} style={{ display:"inline-flex", alignItems:"center", gap:9, color:T.text, fontSize:"0.875rem", fontWeight:600, background:T.tealDim, border:`1px solid ${T.border}`, borderRadius:12, cursor:"pointer", marginBottom:36, padding:"10px 18px", transition:"all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.tealMid; e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Courses
          </button>
        )}

        {/* HERO */}
        <div style={{ marginBottom:80, textAlign:"center" }}>
          {/* section label */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:28, height:2, background:T.teal }}/>
            <span style={{ color:T.teal, fontSize:11, fontWeight:700, letterSpacing:"3px", textTransform:"uppercase" }}>EXPLORE</span>
            <div style={{ width:28, height:2, background:T.teal }}/>
          </div>
          <h1 style={{ fontSize:"clamp(34px,4.5vw,54px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-1px", margin:"0 0 18px", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
            Explore <span style={{ color:T.teal }}>High-Impact</span> Skills
          </h1>
          <p style={{ color:"rgba(255,255,255,0.50)", fontSize:"1rem", maxWidth:500, lineHeight:1.7, margin:"0 auto" }}>
            Pick a topic to start your journey — every skill compounds your career leverage.
          </p>
        </div>

        {/* SEARCH + TOGGLE */}
        <div style={{ display:"flex", alignItems:"stretch", gap:12, marginBottom:22 }}>
          <div style={{ position:"relative", flex:1, maxWidth:620 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search topics..."
              style={{ width:"100%", boxSizing:"border-box", background:T.tealDim, border:`1px solid ${T.border}`, borderRadius:14, padding:"15px 48px 15px 48px", fontSize:"0.975rem", color:"white", outline:"none", transition:"all 0.2s" }}
              onFocus={e => { e.target.style.background = T.tealMid; e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
              onBlur={e => { e.target.style.background = T.tealDim; e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.textDim, display:"flex", padding:2 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* View toggle */}
          <div style={{ display:"flex", alignItems:"stretch", background:T.tealDim, border:`1px solid ${T.border}`, borderRadius:14, padding:5, gap:3 }}>
            {["grid","list"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{ padding:"0 16px", borderRadius:10, border:"none", cursor:"pointer", transition:"all 0.18s", color:viewMode===mode?"white":T.textDim, background:viewMode===mode?T.tealMid:"transparent", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:viewMode===mode?`0 2px 8px rgba(23,182,168,0.25)`:"none" }}
                onMouseEnter={e => { if (viewMode!==mode) e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { if (viewMode!==mode) e.currentTarget.style.color = T.textDim; }}>
                {mode==="grid"
                  ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                }
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, fontSize:"0.875rem", color:T.textDim }}>
          <span><span style={{ color:T.text, fontWeight:700 }}>{allTopics.length}</span> topics</span>
          <span style={{ width:1, height:12, background:T.border, display:"inline-block" }}/>
          <span><span style={{ color:T.text, fontWeight:700 }}>{courses.length}</span> total courses</span>
          {search && filtered.length !== allTopics.length && (
            <><span style={{ width:1, height:12, background:T.border, display:"inline-block" }}/><span style={{ color:T.teal, fontWeight:600 }}>{filtered.length} results</span></>
          )}
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(210px, 1fr))", gap:12 }}>
            {filtered.map(topic => {
              const color = getCategoryColor(topic.name);
              return (
                <button key={topic.name} onClick={() => setSelectedTopic(topic)}
                  style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:"26px 22px", textAlign:"left", cursor:"pointer", transition:"all 0.2s cubic-bezier(.16,1,.3,1)", position:"relative", overflow:"hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color.from}50`; e.currentTarget.style.background = `linear-gradient(160deg, ${color.from}10 0%, ${color.to}06 100%)`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${color.glow}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${T.border}`; e.currentTarget.style.background = T.card; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  {/* shimmer top */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${color.from}50, transparent)` }}/>
                  {/* icon */}
                  <div style={{ width:46, height:46, borderRadius:13, marginBottom:16, background:`linear-gradient(135deg, ${color.from}18, ${color.to}0e)`, border:`1px solid ${color.from}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke={color.from} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.90)", fontWeight:700, fontSize:"1rem", lineHeight:1.38, margin:"0 0 12px" }}>{topic.name}</p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, padding:"4px 11px", borderRadius:8, background:`${color.from}14`, color:color.from, border:`1px solid ${color.from}25` }}>
                      {topic.count} course{topic.count!==1?"s":""}
                    </span>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {filtered.map(topic => {
              const color = getCategoryColor(topic.name);
              return (
                <button key={topic.name} onClick={() => setSelectedTopic(topic)}
                  style={{ width:"100%", background:T.tealDim, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 24px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:18, transition:"all 0.16s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color.from}0e`; e.currentTarget.style.borderColor = `${color.from}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.borderColor = T.border; }}>
                  <div style={{ width:3, height:40, borderRadius:3, background:`linear-gradient(to bottom, ${color.from}, ${color.to})`, flexShrink:0, boxShadow:`0 0 10px ${color.glow}40` }}/>
                  <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:`${color.from}14`, border:`1px solid ${color.from}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={color.from} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:"rgba(255,255,255,0.90)", fontWeight:700, fontSize:"1rem", margin:0 }}>{topic.name}</p>
                    <p style={{ color:T.textDim, fontSize:"0.82rem", margin:"3px 0 0" }}>{topic.count} course{topic.count!==1?"s":""}</p>
                  </div>
                  {/* thumbnails */}
                  <div style={{ display:"flex", alignItems:"center" }}>
                    {topic.courses.slice(0,5).map((c,i) => (
                      <div key={c.id} style={{ width:38, height:38, borderRadius:9, border:"2px solid #071320", overflow:"hidden", marginLeft:i===0?0:-10 }}>
                        {c.thumbnail ? <img src={c.thumbnail} alt={c.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg, ${color.from}, ${color.to})` }}/>}
                      </div>
                    ))}
                    {topic.count > 5 && (
                      <div style={{ width:38, height:38, borderRadius:9, border:"2px solid #071320", background:T.tealDim, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:-10 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:T.textDim }}>+{topic.count-5}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ padding:"6px 14px", borderRadius:10, flexShrink:0, fontSize:"0.82rem", fontWeight:700, background:`${color.from}14`, color:color.from, border:`1px solid ${color.from}25` }}>
                    {topic.count} courses
                  </span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ padding:"80px 0", textAlign:"center" }}>
            <p style={{ color:T.textDim, fontSize:"0.925rem" }}>No topics found for "<span style={{ color:T.text }}>{search}</span>"</p>
          </div>
        )}
      </div>

      {selectedTopic && <TopicPanel topic={selectedTopic} onClose={() => setSelectedTopic(null)} onNavigateToCourses={handleNavigateToCourses}/>}
    </div>
  );
}