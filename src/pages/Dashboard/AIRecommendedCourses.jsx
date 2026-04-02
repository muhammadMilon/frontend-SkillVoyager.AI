import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, BookOpen, ExternalLink, Zap,
  AlertCircle, RefreshCw, ArrowRight, Star,
  Clock, Users, ChevronRight, GraduationCap
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://backend-skill-voyager-ai.vercel.app";

/* ── Styles ── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .arc2-root { font-family: 'DM Sans', sans-serif; }

    /* Scrollable container */
    .arc2-scroll {
      max-height: 520px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: rgba(99,102,241,0.2) transparent;
      padding-right: 4px;
    }
    .arc2-scroll::-webkit-scrollbar { width: 3px; }
    .arc2-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
    .arc2-scroll::-webkit-scrollbar-track { background: transparent; }

    /* Course row card */
    .arc2-row {
      display: flex;
      align-items: stretch;
      gap: 0;
      border: 1px solid rgba(255,255,255,0.065);
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
      background: rgba(255,255,255,0.018);
      cursor: pointer;
    }
    .arc2-row:hover {
      border-color: rgba(99,102,241,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.08);
      transform: translateX(3px);
    }

    /* Left color stripe */
    .arc2-stripe {
      width: 3px;
      flex-shrink: 0;
      border-radius: 0;
    }

    /* Enroll CTA button */
    .arc2-enroll {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
      border: 1px solid rgba(99,102,241,0.3);
      background: rgba(99,102,241,0.08);
      color: #a5b4fc;
      text-decoration: none;
      transition: all 0.22s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .arc2-enroll:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 16px rgba(79,70,229,0.45);
      transform: translateY(-1px);
    }

    /* Platform chip */
    .arc2-platform {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 99px;
      font-family: 'Syne', sans-serif;
      font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    }

    /* Refresh btn */
    .arc2-refresh {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      background: rgba(99,102,241,0.07);
      border: 1px solid rgba(99,102,241,0.18);
      color: #a5b4fc;
      font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
    }
    .arc2-refresh:hover:not(:disabled) { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: white; }
    .arc2-refresh:disabled { opacity: 0.45; cursor: not-allowed; }

    /* View all button */
    .arc2-viewall {
      display: flex; align-items: center; justify-content: center; gap: 7px;
      width: 100%; padding: 11px;
      border-radius: 10px;
      border: 1px dashed rgba(99,102,241,0.2);
      background: rgba(99,102,241,0.04);
      color: rgba(165,180,252,0.65);
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.22s;
      margin-top: 12px;
    }
    .arc2-viewall:hover { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.1); color: #a5b4fc; }

    @keyframes spin2 { to { transform: rotate(360deg); } }
    .spin2 { animation: spin2 0.9s linear infinite; }

    @keyframes shimmer2 {
      0%  { transform: translateX(-100%); }
      100%{ transform: translateX(300%); }
    }
    .shimmer2 {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent);
      animation: shimmer2 1.8s ease infinite;
    }

    @keyframes sparkle { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
    .sparkle { animation: sparkle 2.5s ease infinite; }

    /* Fade bottom mask on scroll list */
    .arc2-scroll-wrap { position: relative; }
    .arc2-fade-bottom {
      position: absolute; bottom: 0; left: 0; right: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(10,10,20,0.7));
      pointer-events: none; border-radius: 0 0 10px 10px;
    }
  `}</style>
);

/* ── Platform config ── */
const PLATFORMS = {
  udemy:        { bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.22)", color: "#f472b6", stripe: "#ec4899" },
  coursera:     { bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.22)", color: "#38bdf8", stripe: "#0ea5e9" },
  youtube:      { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.22)",  color: "#f87171", stripe: "#ef4444" },
  freecodecamp: { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.22)", color: "#34d399", stripe: "#10b981" },
  default:      { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.22)", color: "#a5b4fc", stripe: "#6366f1" },
};
const getPlatform = (p = "") => PLATFORMS[p.toLowerCase().replace(/\s/g, "")] || PLATFORMS.default;

/* ── Skeleton row ── */
const SkeletonRow = ({ delay = 0 }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.4 }}
    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, marginBottom: 8, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
    <div className="shimmer2" />
    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ width: "70%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 7 }} />
      <div style={{ width: "45%", height: 9, borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
    </div>
    <div style={{ width: 70, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
  </motion.div>
);

/* ── Course Row Card ── */
const CourseRow = ({ course, index, onEnroll }) => {
  const ps = getPlatform(course.platform);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="arc2-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ marginBottom: 8 }}
    >
      {/* Top glow on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ps.color}55, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        )}
      </AnimatePresence>

      {/* Color stripe */}
      <div className="arc2-stripe" style={{ background: ps.stripe, opacity: hovered ? 1 : 0.5, transition: "opacity 0.25s" }} />

      {/* Main content */}
      <div style={{ flex: 1, padding: "14px 14px 14px 14px", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>

        {/* Platform icon box */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: ps.bg, border: `1px solid ${ps.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hovered ? `0 0 12px ${ps.color}30` : "none",
          transition: "box-shadow 0.25s",
        }}>
          <GraduationCap size={17} color={ps.color} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Platform + meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
            <span className="arc2-platform" style={{ background: ps.bg, border: `1px solid ${ps.border}`, color: ps.color }}>
              {course.platform || "Course"}
            </span>
            {course.duration && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, color: "rgba(148,163,184,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                <Clock size={8} /> {course.duration}
              </span>
            )}
            {course.rating && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, color: "rgba(251,191,36,0.7)" }}>
                <Star size={8} fill="rgba(251,191,36,0.7)" /> {course.rating}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13, fontWeight: 700, lineHeight: 1.3,
            color: hovered ? "white" : "rgba(226,232,240,0.9)",
            margin: "0 0 4px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            transition: "color 0.2s",
          }}>
            {course.title}
          </h4>

          {/* Reason */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 300, fontStyle: "italic",
            color: "rgba(148,163,184,0.5)", lineHeight: 1.5,
            margin: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {course.reason}
          </p>
        </div>

        {/* Enroll button */}
        <a
          href={course.link || "#"}
          target="_blank"
          rel="noreferrer"
          className="arc2-enroll"
          onClick={(e) => { e.stopPropagation(); onEnroll(course); }}
        >
          Enroll <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  );
};

/* ── Grid Card (full-width mode) ── */
const CourseGridCard = ({ course, index, onEnroll, isEnrolled }) => {
  const ps = getPlatform(course.platform);
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.95 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-5, boxShadow:`0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px ${ps.color}22` }}
      style={{
        background:'rgba(255,255,255,0.022)',
        border:`1px solid rgba(255,255,255,0.07)`,
        borderRadius:16, overflow:'hidden', position:'relative',
        display:'flex', flexDirection:'column',
        transition:'border-color 0.25s',
      }}
    >
      {/* Top accent */}
      <div style={{ height:3, background:`linear-gradient(90deg,${ps.stripe},${ps.color}80,transparent)` }}/>
      {/* Glow orb */}
      <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle,${ps.color}10 0%,transparent 65%)`, pointerEvents:'none' }}/>

      <div style={{ padding:'22px 22px 18px', flex:1, display:'flex', flexDirection:'column' }}>
        {/* Platform + badge row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <span className="arc2-platform" style={{ background:ps.bg, border:`1px solid ${ps.border}`, color:ps.color }}>
            <BookOpen size={8}/> {course.platform || 'Course'}
          </span>
          {course.rating && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:'rgba(251,191,36,0.8)', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
              <Star size={10} fill="rgba(251,191,36,0.7)"/> {course.rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 style={{
          fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, lineHeight:1.35,
          color:'rgba(226,232,240,0.95)', margin:'0 0 10px',
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>{course.title}</h4>

        {/* Reason */}
        <p style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:12, fontStyle:'italic', fontWeight:300,
          color:'rgba(148,163,184,0.55)', lineHeight:1.7, margin:'0 0 16px', flex:1,
          display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>"{course.reason}"</p>

        {/* Meta */}
        {(course.duration || course.level) && (
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            {course.duration && <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:'rgba(148,163,184,0.4)' }}><Clock size={9}/>{course.duration}</span>}
            {course.level   && <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:'rgba(148,163,184,0.4)' }}><GraduationCap size={9}/>{course.level}</span>}
          </div>
        )}

        {/* Enroll CTA */}
        <a href={course.link || '#'} target="_blank" rel="noreferrer"
          className="arc2-enroll"
          onClick={() => onEnroll(course)}
          style={{
            padding:'10px 0',
            background: isEnrolled
              ? 'rgba(16,185,129,0.12)'
              : 'rgba(99,102,241,0.08)',
            borderColor: isEnrolled
              ? 'rgba(16,185,129,0.3)'
              : 'rgba(99,102,241,0.28)',
            color: isEnrolled ? '#34d399' : '#a5b4fc',
          }}
        >
          {isEnrolled ? <>✓ Enrolled</> : <>Enroll Now <ExternalLink size={11}/></>}
        </a>
      </div>
    </motion.div>
  );
};

/* ── Main Component ── */
const AIRecommendedCourses = ({ mode = 'list' }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [enrolled, setEnrolled] = useState(new Set());

  const fetchCourses = async () => {
    if (!user?.uid) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/api/recommendations/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setCourses(data.courses || (Array.isArray(data) ? data : []));
    } catch (err) {
      setError("Unable to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [user?.uid]);

  const handleEnroll = (course) => {
    setEnrolled(prev => new Set([...prev, course.title]));
  };

  const handleViewAll = () => {
    navigate("/courses");
  };

  return (
    <>
      <Styles />
      <div className="arc2-root" style={{ color: "#cbd5e1" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(251,191,36,0.08))",
              border: "1px solid rgba(245,158,11,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={15} color="#fbbf24" className="sparkle" />
            </div>
            <div>
              <div style={{ fontSize: 9, fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(148,163,184,0.45)", textTransform: "uppercase", marginBottom: 1 }}>
                AI · Personalized
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.01em" }}>
                Recommended Courses
              </h3>
            </div>
          </div>

          <button className="arc2-refresh" onClick={fetchCourses} disabled={loading}>
            <RefreshCw size={10} className={loading ? "spin2" : ""} />
            {loading ? "Analyzing…" : "Refresh"}
          </button>
        </div>

        {/* ── Stats bar ── */}
        {courses.length > 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <BookOpen size={11} color="#a5b4fc" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(165,180,252,0.8)" }}>{courses.length} courses found</span>
            </div>
            <div style={{ width: 1, height: 12, background: "rgba(99,102,241,0.2)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={10} color="#fbbf24" />
              <span style={{ fontSize: 11, color: "rgba(148,163,184,0.5)" }}>Tailored to your skill gaps</span>
            </div>
            {enrolled.size > 0 && (
              <>
                <div style={{ width: 1, height: 12, background: "rgba(99,102,241,0.2)" }} />
                <span style={{ fontSize: 11, color: "rgba(52,211,153,0.8)", fontWeight: 600 }}>✓ {enrolled.size} enrolled</span>
              </>
            )}
          </motion.div>
        )}

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 12 }}>
              <AlertCircle size={13} color="#f87171" />
              <span style={{ fontSize: 12, color: "rgba(248,113,113,0.8)", flex: 1 }}>{error}</span>
              <button onClick={fetchCourses} style={{ fontSize: 10, fontWeight: 700, color: "#f87171", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!loading && courses.length === 0 && !error && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ padding:"40px 20px", textAlign:"center", borderRadius:14, background:"rgba(255,255,255,0.015)", border:"1px dashed rgba(255,255,255,0.07)" }}>
            <div style={{ width:44, height:44, borderRadius:13, margin:"0 auto 14px", background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.14)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Zap size={18} color="#818cf8"/>
            </div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"rgba(148,163,184,0.45)", margin:"0 0 4px" }}>No recommendations yet</p>
            <p style={{ fontSize:11, color:"rgba(148,163,184,0.28)", margin:0, lineHeight:1.6 }}>Complete your profile to unlock<br/>AI-powered course suggestions</p>
          </motion.div>
        )}

        {/* ── GRID MODE ── */}
        {mode === 'grid' && courses.length > 0 && !loading && (
          <AnimatePresence>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
              {courses.map((course,i) => (
                <CourseGridCard key={i} course={course} index={i}
                  onEnroll={handleEnroll} isEnrolled={enrolled.has(course.title)}/>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* ── GRID loading skeletons ── */}
        {mode === 'grid' && loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {[0,1,2,3].map(i => <SkeletonRow key={i} delay={i*0.08}/>)}
          </div>
        )}

        {/* ── LIST MODE ── */}
        {mode === 'list' && (
          <div className="arc2-scroll-wrap">
            <div className="arc2-scroll">
              {loading
                ? [0,1,2].map(i => <SkeletonRow key={i} delay={i*0.08}/>)
                : courses.length > 0 && (
                  <AnimatePresence>
                    {courses.map((course,i) => (
                      <CourseRow key={i} course={course} index={i}
                        onEnroll={handleEnroll} isEnrolled={enrolled.has(course.title)}/>
                    ))}
                  </AnimatePresence>
                )
              }
            </div>
            {courses.length > 4 && <div className="arc2-fade-bottom"/>}
          </div>
        )}

        {/* ── View All ── */}
        {!loading && (
          <button className="arc2-viewall" onClick={handleViewAll}>
            <GraduationCap size={13}/>
            View All Courses
            <ChevronRight size={12}/>
          </button>
        )}
      </div>
    </>
  );
};

export default AIRecommendedCourses;