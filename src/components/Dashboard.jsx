import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

import { HiOutlineBell, HiOutlineSave, HiOutlineChevronRight, HiOutlineFire } from "react-icons/hi";
import {
  LayoutDashboard, Settings as SettingsIcon, Award, BookOpen, Sparkles,
  Target, Zap, TrendingUp, History, CheckCircle2, ArrowRight, Brain,
  Rocket, Lock, ShieldCheck, ChevronUp, Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../api/axios";
import ProgressReportPDF from "./ProgressReportPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SkillRadarChart from "./SkillRadarChart";
import DashboardSidebar from "./DashboardSidebar";
import Settings from "./Settings";
import ProfileSections from "./ProfileSections";
import ProgressDashboard from "../pages/Dashboard/ProgressDashboard";
import { Activity } from "lucide-react";

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg:      'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)',
  card:    'rgba(7,19,32,0.85)',
  cardSolid: 'linear-gradient(145deg, #071320 0%, #091a28 55%, #060f1a 100%)',
  teal:    '#17B6A8',
  tealDim: 'rgba(23,182,168,0.09)',
  tealMid: 'rgba(23,182,168,0.20)',
  border:  'rgba(23,182,168,0.18)',
  borderDim: 'rgba(23,182,168,0.10)',
  cyan:    '#0fd4c4',
  gold:    '#F5C842',
  text:    'rgba(255,255,255,0.90)',
  textDim: 'rgba(255,255,255,0.55)',
  textFaint: 'rgba(255,255,255,0.30)',
};

/* ─────────────────────────────────────────
   FONTS & GLOBAL STYLES
───────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .db-root {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.75);
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      background: #040d18; min-height: 100vh;
    }
    .display { font-family: 'Inter', -apple-system, sans-serif !important; font-weight: 700 !important; letter-spacing: -0.025em !important; }
    .serif   { font-family: 'Instrument Serif', Georgia, serif !important; font-optical-sizing: auto; letter-spacing: -0.01em !important; }

    .card {
      background: rgba(23,182,168,0.04);
      border: 1px solid rgba(23,182,168,0.14);
      border-radius: 18px; backdrop-filter: blur(20px);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative; overflow: hidden;
    }
    .card:hover { border-color: rgba(23,182,168,0.28); box-shadow: 0 0 0 1px rgba(23,182,168,0.08); }

    .micro { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.35); letter-spacing: 0.06em; }

    .btn-p {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 22px; border-radius: 12px; position: relative; overflow: hidden;
      background: linear-gradient(135deg, #0e2e2a, #0a2020);
      color: white; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      border: 1px solid rgba(23,182,168,0.35);
      box-shadow: 0 4px 18px rgba(23,182,168,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer; transition: all 0.2s;
    }
    .btn-p::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(23,182,168,0.15), rgba(15,212,196,0.08));
      opacity: 0; transition: opacity 0.2s;
    }
    .btn-p:hover::before { opacity: 1; }
    .btn-p:hover { box-shadow: 0 6px 24px rgba(23,182,168,0.30); transform: translateY(-1px); }
    .btn-p::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
      transform: translateX(-100%); transition: 0.5s;
    }
    .btn-p:hover::after { transform: translateX(100%); }

    .btn-s {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 20px; border-radius: 12px;
      background: rgba(23,182,168,0.06); border: 1px solid rgba(23,182,168,0.18);
      color: rgba(255,255,255,0.75); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-s:hover { background: rgba(23,182,168,0.14); color: white; border-color: rgba(23,182,168,0.38); }

    .inp {
      width: 100%; padding: 12px 16px; border-radius: 12px;
      background: rgba(23,182,168,0.06); border: 1px solid rgba(23,182,168,0.15);
      color: #e2e8f0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400;
      outline: none; transition: all 0.2s; line-height: 1.5;
    }
    .inp::placeholder { color: rgba(255,255,255,0.25); }
    .inp:focus { border-color: rgba(23,182,168,0.55); box-shadow: 0 0 0 3px rgba(23,182,168,0.10); }

    .tab-wrap {
      display: flex; gap: 3px; padding: 4px;
      background: rgba(23,182,168,0.05); border: 1px solid rgba(23,182,168,0.12); border-radius: 14px;
      overflow-x: auto; white-space: nowrap; scrollbar-width: none;
    }
    .tab-wrap::-webkit-scrollbar { display: none; }
    .tab {
      display: flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 10px;
      border: 1px solid transparent; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      color: rgba(255,255,255,0.35); cursor: pointer; transition: all 0.2s; background: transparent;
      flex-shrink: 0;
    }
    .tab:hover { color: rgba(255,255,255,0.75); background: rgba(23,182,168,0.07); }
    .tab.on  { background: rgba(23,182,168,0.16); border-color: rgba(23,182,168,0.32); color: #17B6A8; font-weight: 600; }

    .bar-wrap { height: 4px; border-radius: 99px; background: rgba(255,255,255,0.07); overflow: hidden; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(23,182,168,0.25); border-radius: 99px; }

    @keyframes dpulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .dpulse { animation: dpulse 2s ease infinite; }

    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    .hero-name {
      font-family: 'Inter', sans-serif !important; font-weight: 800 !important;
      background: linear-gradient(90deg, #e0fff8, #17B6A8, #0fd4c4, #F5C842, #17B6A8, #e0fff8);
      background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite;
    }

    /* ── Responsive Utilities ── */
    .db-grid-main { display: grid; grid-template-columns: 1fr 360px; gap: 18px; align-items: start; }
    .db-grid-hero { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
    .db-grid-metrics { display: grid; grid-template-columns: 1fr 220px; gap: 12px; }
    .db-grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .db-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .db-grid-group { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    @media (max-width: 1100px) {
      .db-grid-main { grid-template-columns: 1fr; }
      .db-grid-hero { flex-direction: column; text-align: center; }
      .db-grid-hero > div { flex: 1; width: 100%; }
    }

    @media (max-width: 768px) {
      .db-grid-main { grid-template-columns: 1fr; }
      .db-grid-hero { flex-direction: column; text-align: center; padding: 24px !important; }
      .db-grid-metrics { grid-template-columns: 1fr; }
      .db-grid-row { grid-template-columns: 1fr; }
      .db-grid-2col { grid-template-columns: 1fr; gap: 0; }
      .db-grid-group { grid-template-columns: 1fr; }
    }
  `}</style>
);

/* ─────────────────────────────────────────
   BACKGROUND
───────────────────────────────────────── */
const Bg = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: '#040d18' }} />
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.018 }}>
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    <div style={{ position: 'absolute', top: '-20%', right: '-8%', width: '48vw', height: '48vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 65%)', filter: 'blur(40px)' }} />
    <div style={{ position: 'absolute', bottom: '-15%', left: '-6%', width: '42vw', height: '42vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,212,196,0.05) 0%, transparent 65%)', filter: 'blur(40px)' }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(23,182,168,0.45), transparent)` }} />
  </div>
);

/* ─────────────────────────────────────────
   MINI PROGRESS BAR
───────────────────────────────────────── */
const Bar = ({ value = 0, color = '#17B6A8' }) => (
  <div className="bar-wrap">
    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%', borderRadius: 99, background: color }} />
  </div>
);

/* ─────────────────────────────────────────
   PROGRESS RING
───────────────────────────────────────── */
const Ring = ({ pct = 65 }) => {
  const size = 130, stroke = 7, r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(23,182,168,0.10)" strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#rg2)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} />
        <defs>
          <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#17B6A8" /><stop offset="100%" stopColor="#0fd4c4" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="display" style={{ fontSize: 24, fontWeight: 800, color: 'white', lineHeight: 1 }}>{pct}%</span>
        <span className="micro" style={{ marginTop: 4 }}>Mastery</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CHIP
───────────────────────────────────────── */
const Chip = ({ children, color = '#17B6A8', dot = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99,
    background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif",
  }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'block' }} className="dpulse" />}
    {children}
  </span>
);

/* ─────────────────────────────────────────
   DASHBOARD MAIN
───────────────────────────────────────── */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, dbUser } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const [view, setView] = useState("dashboard");
  const [progressData, setProgressData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const isAdmin = dbUser?.role === 'admin' || user?.email === 'admin@skillvoyager.ai';
  const pct = progressData?.percentage || 0;
  const xp = progressData?.xp || dbUser?.points || 0;
  const rankRaw = progressData?.rank || dbUser?.rank || null;
  const rank = rankRaw;
  const rankDisplay = rankRaw ? (typeof rankRaw === 'number' ? `#${rankRaw}` : rankRaw) : '—';
  const streak = progressData?.streak || dbUser?.streak || 0;
  const milestones = progressData?.milestones || [];
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  
  // Calculate dynamic XP threshold (e.g., next multiple of 1000 or level-based)
  const nextLevelXP = Math.ceil((xp + 1) / 1000) * 1000 || 1000;
  const velocity = progressData?.velocity || (completedCount > 0 ? (1 + (completedCount * 0.1)).toFixed(1) : "1.0");

  // Real logic for Daily Objectives
  const currentMilestone = milestones.find(m => m.status === 'current');
  const sessionLoginDone = !!user; // Always true if they are on dashboard
  const studyCurrentDone = !currentMilestone; // If no current, all done
  const skillSyncDone = progressData?.missingSkills?.length === 0 || pct > 80;

  const ALL_BADGES = [
    { id:'initiation',   name:'Initiation',    desc:'Joined SkillVoyager',   icon:'Rocket',     g:['#17B6A8','#0fd4c4'], glow:'rgba(23,182,168,0.45)',  check:()=>true },
    { id:'first_roadmap',name:'First Roadmap', desc:'Complete 1 milestone',  icon:'Map',        g:['#10b981','#059669'], glow:'rgba(16,185,129,0.45)',  check:()=>completedCount>=1 },
    { id:'continuous',   name:'Continuous',    desc:'3+ day streak',         icon:'Fire',       g:['#f97316','#ef4444'], glow:'rgba(239,68,68,0.4)',    check:()=>streak>=3 },
    { id:'century',      name:'100 Points',    desc:'Earn 100+ XP',          icon:'Zap',        g:['#F5C842','#f97316'], glow:'rgba(245,200,66,0.45)',  check:()=>xp>=100 },
    { id:'architect',    name:'Architect',     desc:'3+ milestones done',    icon:'Brain',      g:['#a855f7','#ec4899'], glow:'rgba(168,85,247,0.4)',   check:()=>completedCount>=3 },
    { id:'neural_sync',  name:'Neural Sync',   desc:'50%+ mastery',          icon:'Target',     g:['#17B6A8','#0fd4c4'], glow:'rgba(23,182,168,0.4)',   check:()=>pct>=50 },
    { id:'voyager',      name:'Voyager Elite', desc:'80%+ mastery',          icon:'ShieldCheck',g:['#0fd4c4','#17B6A8'], glow:'rgba(15,212,196,0.5)',   check:()=>pct>=80 },
    { id:'grandmaster',  name:'Grandmaster',   desc:'1000+ XP earned',       icon:'Award',      g:['#F5C842','#f97316'], glow:'rgba(245,200,66,0.5)',   check:()=>xp>=1000 },
  ];
  const badges = ALL_BADGES.map(b=>({...b, unlocked:b.check()})).sort((a,b)=>Number(b.unlocked)-Number(a.unlocked));
  const unlockedCount = badges.filter(b=>b.unlocked).length;

  const NOTIF_META = {
    milestone_complete: { color:'#17B6A8',  icon:<CheckCircle2 size={13}/> },
    new_course:         { color:'#a855f7',  icon:<BookOpen size={13}/> },
    roadmap_update:     { color:'#0fd4c4',  icon:<Rocket size={13}/> },
    achievement:        { color:'#F5C842',  icon:<Award size={13}/> },
    reminder:           { color:'#f97316',  icon:<HiOutlineBell size={13}/> },
    system:             { color:'#17B6A8',  icon:<Sparkles size={13}/> },
  };
  const notifList = notifications.slice(0,4);
  const formatTime = (iso) => {
    if (!iso) return 'Just now';
    const diff = Math.floor((Date.now()-new Date(iso))/60000);
    if (diff<1) return 'Just now'; if (diff<60) return `${diff}m ago`;
    if (diff<1440) return `${Math.floor(diff/60)}h ago`; return `${Math.floor(diff/1440)}d ago`;
  };

  useEffect(()=>{ if(user?.uid) axios.get(`/api/user/profile/${user.uid}`).then(r=>setProfile(r?.data?.user)).catch(console.error); },[user]);

  useEffect(()=>{
    const fetchNotifications = async ()=>{
      if(!user?.uid) return;
      try {
        const base=import.meta.env.VITE_API_URL||'https://backend-skill-voyager-ai.vercel.app';
        const r=await fetch(`${base}/api/notifications/${user.uid}`); const d=await r.json();
        if(d.success&&d.notifications?.length>0) setNotifications(d.notifications);
      } catch(e){console.error(e);}
    };
    fetchNotifications();
  },[user?.uid]);

  useEffect(()=>{
    const fetchLeaderboard=async()=>{
      try{
        const base=import.meta.env.VITE_API_URL||'https://backend-skill-voyager-ai.vercel.app';
        const [lbRes,rankRes]=await Promise.all([
          fetch(`${base}/api/leaderboard?limit=3`),
          user?.uid?fetch(`${base}/api/leaderboard/user-points?email=${user.email}`):Promise.resolve(null),
        ]);
        const lbData=await lbRes.json();
        if(Array.isArray(lbData)) setLeaderboard(lbData.slice(0,3));
        if(rankRes){
          const rankData=await rankRes.json(); 
          if(rankData.rank) setProgressData(prev=>({...(prev||{}),rank:rankData.rank}));
        }
      }catch(e){console.error(e);}
    };
    fetchLeaderboard();
  },[user?.uid]);

  useEffect(()=>{
    const fetchProgress=async()=>{
      if(!user?.uid) return; setLoadingProgress(true);
      try{
        const base=import.meta.env.VITE_API_URL||'https://backend-skill-voyager-ai.vercel.app';
        const res=await fetch(`${base}/api/progress?uid=${user.uid}`); const json=await res.json();
        console.log('Progress API full response:',json);
        if(json.success&&json.data) setProgressData(json.data); else console.warn('No progress data found:',json.message||json);
      }catch(err){console.error('Progress fetch error:',err);}
      finally{setLoadingProgress(false);}
    };
    fetchProgress();
  },[user?.uid]);

  const handleUpdateProfile=async(data)=>{
    try {
      const r=await axios.patch(`/api/user/profile/${user.uid}`,data); 
      setProfile(r.data.user);
      return r.data;
    } catch(err) {
      throw err;
    }
  };

  const handleCompleteMilestone = async (milestoneTitle) => {
    if (!user?.uid) return;
    try {
      const base = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';
      const res = await fetch(`${base}/api/progress/milestone/${user.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneTitle, status: 'completed' })
      });
      const data = await res.json();
      if (data.success) {
        setProgressData(data.data);
        // Refresh notifications or trigger a toast if needed
        console.log("Milestone completed:", milestoneTitle);
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  const stagger={hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:0.07}}};
  const item={hidden:{y:20,opacity:0},show:{y:0,opacity:1,transition:{duration:0.5,ease:[0.22,1,0.36,1]}}};

  return (
    <>
      <Styles />
      <div className="db-root flex min-h-screen">
        <Bg />

        <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} activeSection={view} setActiveSection={setView} />

        <div className="flex-1">
          {/* Mobile topbar - positioned lower on mobile to avoid global navbar overlap */}
          <div className="lg:hidden sticky top-[80px] md:top-[96px] z-40 backdrop-blur-md border-b p-4 flex items-center justify-between shadow-lg shadow-black/20"
            style={{ background: 'rgba(7,19,32,0.98)', borderColor: T.border }}>
            <button onClick={()=>setSidebarOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-white hover:bg-white/5 active:scale-95 transition-all"
              style={{ background: T.tealDim, borderColor: T.border }}>
              <Menu size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Sections</span>
            </button>
            <h1 className="text-sm font-black text-white uppercase tracking-widest">{view.replace(/-/g, ' ')}</h1>
            <div className="w-8" />
          </div>

          <main className="px-3 sm:px-6 pt-6 lg:pt-[160px] pb-10 lg:pb-20 relative z-10 mx-auto max-w-[1300px]">

            {/* ── TOP NAV ── */}
            <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:28,flexWrap:'wrap'}}>
              <div className="tab-wrap">
                {[
                  {key:'dashboard', icon:<LayoutDashboard size={13}/>, label:'Dashboard'},
                  {key:'progress',  icon:<Activity size={13}/>,        label:'Progress'},
                  {key:'settings',  icon:<SettingsIcon size={13}/>,    label:'Settings'},
                ].map(t=>(
                  <button key={t.key} onClick={()=>setView(t.key)} className={`tab${view===t.key?' on':''}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
                {isAdmin && (
                  <Link to="/admin-dashboard" style={{textDecoration:'none'}}>
                    <button className="tab" style={{color:T.teal,borderColor:T.border,background:T.tealDim}}>
                      <ShieldCheck size={13}/> Admin
                    </button>
                  </Link>
                )}
              </div>

              <div style={{display:'flex',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:10,background:'rgba(23,182,168,0.07)',border:`1px solid rgba(23,182,168,0.18)`}}>
                  <span className="dpulse" style={{width:6,height:6,borderRadius:'50%',background:T.teal,display:'block'}} />
                  <span style={{fontSize:12,fontWeight:600,color:T.teal}}>Online</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:10,background:'rgba(245,200,66,0.07)',border:'1px solid rgba(245,200,66,0.18)'}}>
                  <HiOutlineFire style={{color:T.gold,width:13,height:13}} />
                  <span style={{fontSize:12,fontWeight:600,color:T.gold}}>{streak>0?`${streak} Day Streak`:'No Streak Yet'}</span>
                </div>
              </div>
            </motion.div>

            {/* ── VIEWS ── */}
            <AnimatePresence mode="wait">
              {view==='dashboard' ? (
                <motion.div key="dash" variants={stagger} initial="hidden" animate="show" exit={{opacity:0}}
                  className="db-grid-main grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6">

                  {/* ══ LEFT ══ */}
                  <div style={{display:'flex',flexDirection:'column',gap:16}}>

                    {/* HERO */}
                    <motion.div variants={item}>
                      <style>{`
                        .card-hero { padding: 44px 48px; }
                        @media (max-width: 768px) { .card-hero { padding: 24px 20px; } }
                      `}</style>
                      <div className="card card-hero" style={{
                        background:'linear-gradient(135deg, rgba(7,25,40,0.97) 0%, rgba(4,13,24,0.98) 100%)',
                        border:`1px solid ${T.border}`,
                        boxShadow:`0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(23,182,168,0.08)`,
                      }}>
                        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(23,182,168,0.35) 1px, transparent 1px)',backgroundSize:'30px 30px',opacity:0.05,pointerEvents:'none',borderRadius:18}} />
                        <div style={{position:'absolute',top:0,right:0,width:300,height:300,background:'radial-gradient(circle, rgba(23,182,168,0.10) 0%, transparent 65%)',pointerEvents:'none'}} />
                        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent 10%, ${T.teal} 50%, transparent 90%)`,borderRadius:'18px 18px 0 0'}} />

                        <div className="db-grid-hero" style={{position:'relative',zIndex:1}}>
                          <div style={{flex:1}}>
                            <div style={{marginBottom:16}}>
                              <Chip color={isAdmin?'#a855f7':T.teal} dot>{isAdmin?'Admin Control Center':'Learning Dashboard'}</Chip>
                            </div>
                            <p style={{fontSize:14,color:T.textDim,marginBottom:6,fontWeight:400}}>{isAdmin?'System Administrator':'Welcome back,'}</p>
                            <h1 className="serif hero-name" style={{fontSize:'clamp(2.4rem, 4vw, 3.8rem)',fontWeight:800,lineHeight:1.05,letterSpacing:'-0.03em',margin:'0 0 16px'}}>
                              {user?.displayName?.split(' ')[0]||(isAdmin?'Admin':'Voyager')}.
                            </h1>
                            <p style={{fontSize:14,color:T.textDim,maxWidth:420,lineHeight:1.7,marginBottom:28}}>
                              {isAdmin
                                ? <><strong style={{color:'white',fontWeight:600}}>Full root access</strong> to all SkillVoyager systems. Manage users and oversee AI operations.</>
                                : <>Your trajectory is <strong style={{color:'white',fontWeight:600}}>optimized</strong>. {pct}% mastery achieved across all skill modules. Keep going.</>}
                            </p>
                            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                              {isAdmin ? (
                                <>
                                  <Link to="/admin-dashboard"><button className="btn-p"><ShieldCheck size={14}/> Admin Panel</button></Link>
                                  <Link to="/leaderboard"><button className="btn-s"><TrendingUp size={14} style={{color:T.teal}}/> Leaderboard</button></Link>
                                </>
                              ) : (
                                <>
                                  <Link to="/onboarding"><button className="btn-p">Resume Mission <ArrowRight size={14}/></button></Link>
                                  <Link to="/skill-gap"><button className="btn-s"><Brain size={14} style={{color:T.teal}}/> Gap Analysis</button></Link>
                                  <PDFDownloadLink
                                    document={<ProgressReportPDF userName={user?.displayName} pct={pct} progressData={progressData} dbUser={dbUser}/>}
                                    fileName={`SkillVoyager_Progress_${new Date().toISOString().split('T')[0]}.pdf`}>
                                    {({loading})=>(
                                      <button className="btn-p" disabled={loading} style={{
                                        background:loading?'rgba(220,38,38,0.5)':'linear-gradient(135deg, #7f1d1d, #dc2626, #ef4444)',
                                        border:'1px solid rgba(220,38,38,0.4)', boxShadow:'0 4px 18px rgba(220,38,38,0.35)', minWidth:210,
                                      }}>
                                        {loading?'Preparing Full Report...':'Export Full Progress Report'}
                                      </button>
                                    )}
                                  </PDFDownloadLink>
                                </>
                              )}
                            </div>
                          </div>
                          <div style={{flexShrink:0}}>
                            {isAdmin
                              ? <div style={{width:130,height:130,borderRadius:24,background:T.tealDim,border:`1px solid ${T.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                                  <ShieldCheck size={32} color={T.teal}/>
                                  <span style={{fontSize:11,color:T.textDim,fontWeight:500,textAlign:'center',lineHeight:1.4}}>All Systems OK</span>
                                </div>
                              : <Ring pct={pct}/>
                            }
                          </div>
                        </div>
                      </div>
                    </motion.div>


                    {/* MISSION + OBJECTIVES */}
                    <motion.div variants={item}>
                      <div className="db-grid-metrics">
                        <div className="card" style={{padding:'30px 32px'}}>
                          <div style={{position:'absolute',top:0,left:0,width:160,height:160,background:`radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)`,pointerEvents:'none'}} />
                          <div style={{position:'relative',zIndex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                              <Chip color={T.teal} dot>Active</Chip>
                              <span className="micro">{new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                            </div>
                            <h3 className="display" style={{fontSize:20,fontWeight:700,color:'white',marginBottom:10,lineHeight:1.25}}>
                              {progressData?.currentMilestone||(loadingProgress ? "Calibrating..." : "Mission Pending")}
                            </h3>
                            <p style={{fontSize:13,color:T.textDim,lineHeight:1.7,marginBottom:22}}>
                              {progressData?.missingSkills?.length>0
                                ?`Focus areas: ${progressData.missingSkills.slice(0,2).join(', ')}. Complete this milestone to unlock the next phase.`
                                :'Synchronization required for the next neural node. Complete the deep-dive into advanced systemic patterns.'}
                            </p>
                            <div style={{display:'flex', gap: 10}}>
                              <Link to="/onboarding"><button className="btn-p" style={{fontSize:12}}><Rocket size={13}/> Initiate Task</button></Link>
                              <button 
                                onClick={() => handleCompleteMilestone(progressData.currentMilestone)} 
                                className="btn-p" 
                                style={{fontSize:12, background: T.teal, border:'none'}}
                              >
                                <CheckCircle2 size={13}/> Mark Done
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="card" style={{padding:'26px 24px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:18}}>
                            <Zap size={13} color={T.gold}/>
                            <span style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>Daily Objectives</span>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:13}}>
                            {[
                              {task:"Session Login",xp:"+50",done:sessionLoginDone},
                              {task: (currentMilestone ? `Study: ${currentMilestone.title.split(' ').slice(0,2).join(' ')}` : "All Studies Done"), xp:"+150", done: !currentMilestone},
                              {task: (progressData?.missingSkills?.[0] ? `Skill: ${progressData.missingSkills[0].split(' ')[0]}` : "Skills Synced"), xp:"+30", done: skillSyncDone},
                            ].map((o,i)=>(
                              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <div style={{display:'flex',alignItems:'center',gap:9}}>
                                  <div style={{width:18,height:18,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                                    background:o.done?T.tealDim:'rgba(255,255,255,0.04)',border:`1px solid ${o.done?T.border:'rgba(255,255,255,0.09)'}`}}>
                                    {o.done&&<CheckCircle2 size={11} color={T.teal}/>}
                                  </div>
                                  <span style={{fontSize:12,fontWeight:500,color:o.done?T.textFaint:'rgba(255,255,255,0.8)',textDecoration:o.done?'line-through':'none'}}>{o.task}</span>
                                </div>
                                <span style={{fontSize:11,fontWeight:600,color:T.teal,opacity:0.6}}>{o.xp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* METRICS ROW */}
                    <motion.div variants={item}>
                      <div className="db-grid-row">
                        <div className="card" style={{padding:'28px 30px'}}>
                          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18}}>
                            <div style={{width:38,height:38,borderRadius:11,background:T.tealDim,border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <History size={16} color={T.teal}/>
                            </div>
                            <span className="display" style={{fontSize:48,fontWeight:800,color:'rgba(23,182,168,0.06)',lineHeight:1}}>{pct}%</span>
                          </div>
                          <h4 className="display" style={{fontSize:16,fontWeight:700,color:'white',margin:'0 0 4px'}}>Project Synthesis</h4>
                          <p className="micro" style={{marginBottom:14}}>Frameworks & Architecture</p>
                          <Bar value={pct}/>
                          <button onClick={() => setView('progress')} style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
                            <span style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:14,fontSize:12,fontWeight:600,color:T.teal}}>
                              Identify All Nodes <HiOutlineChevronRight size={12}/>
                            </span>
                          </button>
                        </div>

                        <div className="card" style={{padding:'28px 30px'}}>
                          <div style={{position:'absolute',top:-20,right:-20,width:130,height:130,background:`radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)`,pointerEvents:'none'}} />
                          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18}}>
                            <div style={{width:38,height:38,borderRadius:11,background:T.tealDim,border:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <Brain size={16} color={T.teal}/>
                            </div>
                            <Chip color={T.cyan}>Market Pulse</Chip>
                          </div>
                          <h4 className="display" style={{fontSize:16,fontWeight:700,color:'white',margin:'0 0 8px',position:'relative',zIndex:1}}>Neural Gap Analysis</h4>
                          <p style={{fontSize:13,color:T.textDim,lineHeight:1.7,marginBottom:20,position:'relative',zIndex:1}}>Identify high-value tech nodes missing from your profile.</p>
                          <Link to="/skill-gap"><button className="btn-s" style={{width:'100%',justifyContent:'center',fontSize:12}}>Scan Ecosystem</button></Link>
                        </div>
                      </div>
                    </motion.div>

                    {/* SKILL RADAR */}
                    <motion.div variants={item}>
                      <div className="card" style={{padding:'30px 34px'}}>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <Brain className="w-6 h-6" style={{color:T.teal}}/>
                          Skill Strength Radar
                        </h3>
                        {loadingProgress ? (
                          <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{borderColor:`${T.teal} transparent transparent transparent`}}></div>
                            <p style={{color:T.textDim}}>Analyzing your skills...</p>
                          </div>
                        ) : progressData ? (()=>{
                          let skillsObj={};
                          if(progressData.skillStrength){
                            if(progressData.skillStrength instanceof Map) skillsObj=Object.fromEntries(progressData.skillStrength);
                            else if(typeof progressData.skillStrength==='object') skillsObj=progressData.skillStrength;
                          }
                          const hasSkills=Object.keys(skillsObj).length>0;
                          return hasSkills ? (
                            <div className="h-80 md:h-96 w-full"><SkillRadarChart skillsData={skillsObj}/></div>
                          ) : (
                            <div className="text-center py-16" style={{color:T.textDim}}>
                              <Brain size={48} className="mx-auto mb-6 opacity-50" style={{color:T.teal}}/>
                              <h4 className="text-xl font-semibold text-white mb-3">Skill Radar Unlocked Soon</h4>
                              <p className="max-w-md mx-auto mb-6">Complete quizzes, projects, or skill assessments to unlock your real strengths and growth areas.</p>
                              <Link to="/onboarding" className="inline-block px-6 py-3 rounded-xl font-medium transition text-white"
                                style={{background:`linear-gradient(135deg, ${T.teal}, ${T.cyan})`}}>Finish Onboarding</Link>
                            </div>
                          );
                        })() : (
                          <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{borderColor:`${T.teal} transparent transparent transparent`}}></div>
                            <p style={{color:T.textDim}}>Loading skill data...</p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* MILESTONES */}
                    <motion.div variants={item}>
                      <div className="card" style={{padding:'30px 34px'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:26}}>
                          <div style={{display:'flex',alignItems:'center',gap:9}}>
                            <Target size={17} color={T.teal}/>
                            <h3 className="display" style={{fontSize:16,fontWeight:700,color:'white',margin:0}}>Neural Path</h3>
                          </div>
                          <span className="micro">Velocity {velocity}×</span>
                        </div>
                        <div style={{position:'relative',display:'flex',flexDirection:'column',gap:20}}>
                          {milestones.length>0 ? (
                            <>
                              <div style={{position:'absolute',left:19,top:10,bottom:10,width:1,background:`linear-gradient(to bottom, rgba(23,182,168,0.45), rgba(23,182,168,0.04))`}} />
                              {milestones.map((m,i)=>(
                                <motion.div key={i} whileHover={{x:5}} style={{display:'flex',alignItems:'flex-start',gap:18,position:'relative',zIndex:1}}>
                                  <div style={{
                                    width:38,height:38,borderRadius:11,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
                                    background:m.status==='completed'?T.tealDim:'rgba(255,255,255,0.03)',
                                    border:`1px solid ${m.status==='completed'?T.border:m.status==='current'?'rgba(23,182,168,0.25)':'rgba(255,255,255,0.07)'}`,
                                    boxShadow:m.status==='completed'?`0 0 16px rgba(23,182,168,0.25)`:'none',
                                    opacity:m.status==='upcoming'?0.4:1,
                                  }}>
                                    {m.status==='completed'?<CheckCircle2 size={16} color={T.teal}/>:
                                     m.status==='current'?<Rocket size={16} color={T.teal}/>:
                                     <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.25)'}}>{i+1}</span>}
                                  </div>
                                  <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                                    <div>
                                      <span style={{fontSize:11,fontWeight:600,color:T.teal,opacity:0.7,display:'block',marginBottom:3}}>Phase 0{i+1}</span>
                                      <h5 className="display" style={{fontSize:15,fontWeight:700,color:m.status==='upcoming'?'rgba(255,255,255,0.22)':'white',margin:'0 0 2px',lineHeight:1.3}}>{m.title}</h5>
                                      <span style={{fontSize:12,color:m.status==='completed'?'#10b981':m.status==='current'?T.teal:'rgba(255,255,255,0.2)',fontWeight:500}}>
                                        {m.status==='completed'?'✓ Verified':m.status==='current'?'⟳ In Progress':'🔒 Locked'}
                                      </span>
                                    </div>
                                    {m.status==='current'&&(
                                      <div style={{display:'flex', gap: 10}}>
                                        <div style={{padding:'10px 14px',borderRadius:10,background:'rgba(23,182,168,0.05)',border:`1px solid ${T.borderDim}`,minWidth:130}}>
                                          <div className="micro" style={{marginBottom:6}}>Sync Status</div>
                                          <Bar value={pct}/>
                                        </div>
                                        <button 
                                          onClick={() => handleCompleteMilestone(m.title)}
                                          className="btn-p" 
                                          style={{padding:'8px 16px', fontSize: 11, background: T.teal, border:'none', height: 'fit-content', alignSelf: 'center'}}
                                        >
                                          <ShieldCheck size={14}/> Mark Done
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </>
                          ) : (
                            <div style={{textAlign:'center',padding:'20px 0',border:`1px dashed ${T.border}`,borderRadius:12}}>
                              <p style={{fontSize:13,color:T.textDim}}>No roadmap milestones yet.</p>
                              <Link to="/onboarding" style={{color:T.teal,fontSize:12,fontWeight:600}}>Create Roadmap</Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {/* ══ RIGHT SIDEBAR ══ */}
                  <div className="flex flex-col gap-[14px] lg:sticky lg:top-6">

                    {/* Profile card */}
                    <motion.div variants={item}>
                      <div className="card" style={{padding:'28px 24px'}}>
                        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent, ${T.teal}, transparent)`,borderRadius:'18px 18px 0 0'}} />
                        <div style={{position:'absolute',top:0,right:0,width:140,height:140,background:`radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 65%)`,pointerEvents:'none'}} />

                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',marginBottom:20}}>
                          <div style={{position:'relative',marginBottom:14}}>
                            <motion.div whileHover={{rotate:4}} style={{width:72,height:72,borderRadius:20,overflow:'hidden',border:`2px solid ${T.border}`,boxShadow:`0 6px 20px rgba(23,182,168,0.25)`}}>
                              <img src={user?.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName||'U')}&background=17B6A8&color=fff`}
                                alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                            </motion.div>
                            <div style={{position:'absolute',bottom:-3,right:-3,width:22,height:22,borderRadius:7,background:'#040d18',border:`1.5px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              {isAdmin?<ShieldCheck size={11} color={T.teal}/>:<CheckCircle2 size={11} color={T.teal}/>}
                            </div>
                          </div>
                          <h4 className="display" style={{fontSize:17,fontWeight:700,color:'white',margin:'0 0 3px'}}>{user?.displayName||'Voyager'}</h4>
                          <span style={{fontSize:11,fontWeight:600,color:T.teal,textTransform:'capitalize'}}>
                            {isAdmin?'System Administrator':(profile?.onboarding?.targetRole||'Executive Voyager')}
                          </span>
                        </div>

                        <div style={{height:1,background:`rgba(23,182,168,0.10)`,margin:'0 0 16px'}} />

                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                          {[
                            {label:'Neural XP',   value:xp>=1000?`${(xp/1000).toFixed(1)}k`:String(xp||0), delta:xp>0?'+Active':null},
                            {label:'Global Rank', value:rankDisplay, delta:null},
                          ].map((s,i)=>(
                            <div key={i} style={{padding:'12px 14px',borderRadius:12,background:T.tealDim,border:`1px solid ${T.borderDim}`}}>
                              <div className="micro" style={{marginBottom:4}}>{s.label}</div>
                              <div style={{display:'flex',alignItems:'baseline',gap:5}}>
                                <span className="display" style={{fontSize:s.value?.length>10?14:18,fontWeight:800,color:'white',lineHeight:1.2}}>{s.value}</span>
                                <span style={{fontSize:10,fontWeight:600,color:T.teal}}>{s.delta}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {isAdmin&&(
                          <Link to="/admin-dashboard">
                            <button className="btn-p" style={{width:'100%',justifyContent:'center'}}>
                              <ShieldCheck size={14}/> Admin Interface
                            </button>
                          </Link>
                        )}
                      </div>
                    </motion.div>

                    {/* Activity */}
                    <motion.div variants={item}>
                      <div className="card" style={{padding:'24px 22px',position:'relative'}}>
                        <div style={{position:'absolute',top:14,right:14,width:7,height:7,borderRadius:'50%',background:T.teal}} className="dpulse"/>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
                          <HiOutlineBell style={{color:T.teal,width:15,height:15}}/>
                          <h3 className="display" style={{fontSize:14,fontWeight:700,color:'white',margin:0}}>Activity</h3>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:15}}>
                          {notifList.length>0 ? notifList.map(n=>{
                            const meta=NOTIF_META[n.type]||NOTIF_META.system;
                            const isUnread=!n.read;
                            return (
                              <div key={n._id||n.id} style={{display:'flex',gap:10}}>
                                <div style={{width:28,height:28,borderRadius:9,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
                                  background:`${meta.color}${isUnread?'25':'14'}`,border:`1px solid ${meta.color}${isUnread?'40':'25'}`,color:meta.color}}>
                                  {meta.icon}
                                </div>
                                <div style={{flex:1}}>
                                  <p style={{fontSize:12,color:isUnread?'#ffffff':T.textDim,fontWeight:isUnread?700:400,lineHeight:1.65,margin:'0 0 2px'}}>{n.message}</p>
                                  <span className="micro" style={{fontSize:10,color:isUnread?T.teal:T.textFaint}}>{formatTime(n.createdAt)}</span>
                                </div>
                              </div>
                            );
                          }) : (
                            <div style={{textAlign:'center',padding:'10px 0'}}>
                              <p style={{fontSize:12,color:T.textFaint}}>No recent activity to show.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Leaderboard mini */}
                    <motion.div variants={item}>
                      <div className="card" style={{padding:'24px 22px'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <Award size={15} color={T.gold}/>
                            <h3 className="display" style={{fontSize:14,fontWeight:700,color:'white',margin:0}}>Skill Grid</h3>
                          </div>
                          <TrendingUp size={13} color="#10b981"/>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:13}}>
                          {(leaderboard.length>0?leaderboard:[
                            {name:user?.displayName||"You",points:dbUser?.points||0,photoURL:user?.photoURL||null},
                            {name:"Top Voyager",points:0,photoURL:"https://i.pravatar.cc/150?u=99"},
                            {name:"Elite Learner",points:0,photoURL:"https://i.pravatar.cc/150?u=88"},
                          ]).map((p,i)=>{
                            const rankColors=[T.gold,'#94a3b8','#b45309'];
                            const rc=rankColors[i]||T.teal;
                            const xpDisplay=p.points>=1000?`${(p.points/1000).toFixed(1)}k`:p.points>0?String(p.points):'—';
                            return (
                              <motion.div key={i} whileHover={{x:3}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
                                <div style={{display:'flex',alignItems:'center',gap:10}}>
                                  <div style={{position:'relative'}}>
                                    <img src={p.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name||'U')}&background=17B6A8&color=fff`}
                                      style={{width:34,height:34,borderRadius:10,objectFit:'cover'}} alt=""/>
                                    <div style={{position:'absolute',top:-3,left:-3,width:14,height:14,borderRadius:4,background:'#040d18',border:`1px solid ${rc}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:rc}}>{i+1}</div>
                                  </div>
                                  <div>
                                    <div style={{fontSize:13,fontWeight:500,color:'rgba(255,255,255,0.8)',lineHeight:1.3}}>{p.name||p.displayName||'Voyager'}</div>
                                    <div style={{fontSize:11,fontWeight:600,color:T.teal}}>{xpDisplay} XP</div>
                                  </div>
                                </div>
                                <HiOutlineChevronRight style={{color:'rgba(255,255,255,0.15)',width:13}}/>
                              </motion.div>
                            );
                          })}
                        </div>
                        <Link to="/leaderboard" style={{textDecoration:'none',display:'block',marginTop:16}}>
                          <button className="btn-s" style={{width:'100%',justifyContent:'center',fontSize:12,padding:'9px 16px'}}>View Full Grid</button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

              ) : view === 'settings' ? (
                <motion.div key="settings" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <Settings user={user} profile={profile} onUpdate={handleUpdateProfile} progressData={progressData} />
                </motion.div>
              ) : view === 'progress' ? (
                <motion.div key="progress" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <ProgressDashboard embedded={true} />
                </motion.div>
              ) : [
                "my-profile", "additional-info", "address", "education",
                "important-links", "skill-set", "job-profile",
                "job-experience", "got-hired", "course-request",
                "order-history", "certification"
              ].includes(view) ? (
                <motion.div key={view} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <ProfileSections view={view} dbUser={profile || dbUser} onUpdate={handleUpdateProfile} />
                </motion.div>
              ) : (
                <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
                  <div className="w-24 h-24 mb-8 rounded-full flex items-center justify-center shadow-2xl"
                    style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                    <Sparkles size={40} style={{ color: T.teal }} />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 capitalize tracking-tight">{view.replace(/-/g, ' ')}</h2>
                  <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: T.textDim }}>
                    This module is currently being calibrated. Your personalized data for{' '}
                    <strong style={{ color: T.teal }}>{view.replace(/-/g, ' ')}</strong> will be available shortly.
                  </p>
                  <button onClick={() => setView('dashboard')} className="btn-s">
                    <ArrowRight size={16} className="rotate-180 mr-2" /> Return to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;