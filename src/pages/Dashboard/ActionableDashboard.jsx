// import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../../providers/AuthProvider";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { 
//   Trophy, Target, Award, Cpu, Fingerprint, 
//   HelpCircle, Settings as SettingsIcon, CheckCircle2, 
//   Rocket,
//   Map,
//   Zap,
//   Brain,
//   ShieldCheck
// } from "lucide-react";
// import { HiOutlineFire } from "react-icons/hi";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, PointElement,
//   LineElement, Title, Tooltip, Legend, Filler
// } from "chart.js";
// import Navbar from "../../components/Navbar";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const T = {
//   bg: '#040d18',
//   card: 'rgba(13, 25, 39, 0.45)',
//   teal: '#17B6A8',
//   cyan: '#0fd4c4',
//   gold: '#F5C842',
//   rose: '#ff2d78',
//   violet: '#7c3aed',
//   text: 'rgba(255,255,255,0.95)',
//   textDim: 'rgba(255,255,255,0.65)',
//   textFaint: 'rgba(255,255,255,0.40)',
// };

// const Chip = ({ children, color = '#17B6A8', glow = false }) => (
//   <span style={{
//     display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 99,
//     background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 11, fontWeight: 700,
//     boxShadow: glow ? `0 0 15px ${color}20` : 'none'
//   }}>
//     {children}
//   </span>
// );

// const StyleProvider = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
//     .db-root {
//       font-family: 'Inter', sans-serif;
//       background: #040d18; 
//       min-height: 100vh;
//       background-image: 
//         radial-gradient(circle at 50% 0%, rgba(23,182,168,0.06) 0%, transparent 50%),
//         radial-gradient(circle at 100% 100%, rgba(23,182,168,0.03) 0%, transparent 40%);
//     }
    
//     .display { font-weight: 700; letter-spacing: -0.015em; }
    
//     .card {
//       background: rgba(13, 25, 39, 0.55);
//       border: 1px solid rgba(23,182,168,0.12);
//       border-radius: 18px; 
//       backdrop-filter: blur(24px);
//       transition: all 0.3s ease;
//     }
//     .card:hover { border-color: rgba(23,182,168,0.25); }

//     .micro { font-size: 10.5px; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 0.14em; text-transform: uppercase; }

//     .btn-p {
//       display: inline-flex; align-items: center; gap: 8px;
//       padding: 12px 24px; border-radius: 12px;
//       background: linear-gradient(135deg, #17B6A8, #0da89a);
//       color: #040d18; font-size: 13px; font-weight: 700;
//       border: none; cursor: pointer; transition: 0.2s;
//     }
//     .btn-p:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(23,182,168,0.35); }

//     .btn-s {
//       display: inline-flex; align-items: center; gap: 8px;
//       padding: 10px 20px; border-radius: 12px;
//       background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
//       color: white; font-size: 13px; font-weight: 600;
//       cursor: pointer; transition: 0.2s;
//     }

//     .glass-tab {
//       padding: 8px 18px; border-radius: 10px; font-size: 12px; font-weight: 600;
//       cursor: pointer; transition: 0.2s; border: 1px solid transparent; color: ${T.textDim};
//     }
//     .glass-tab.active { 
//       background: rgba(23,182,168,0.12); 
//       border-color: rgba(23,182,168,0.3); 
//       color: ${T.teal}; 
//     }
    
//     .badge-card {
//       padding: 22px 18px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.06);
//       transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//       position: relative; overflow: hidden;
//     }
//     .badge-unlocked {
//       background: rgba(23, 182, 168, 0.08);
//       border-color: rgba(23, 182, 168, 0.3);
//       box-shadow: 0 12px 40px -12px rgba(23, 182, 168, 0.25);
//     }
//     .badge-unlocked:hover { 
//       transform: scale(1.04) translateY(-4px); 
//       border-color: ${T.teal}; 
//     }
//     .badge-locked { opacity: 0.25; grayscale: 1; }
    
//     @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
//     .pulse-glow { animation: pulse-glow 2.5s infinite; }

//     .formula-tag {
//       background: rgba(255,255,255,0.04); 
//       padding: 5px 10px; border-radius: 8px; 
//       font-size: 9.5px; color: rgba(255,255,255,0.45);
//       border: 1px solid rgba(255,255,255,0.08);
//       margin-top: 8px; display: inline-block;
//       font-weight: 600;
//     }
//   `}</style>
// );

// const ActionableDashboard = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
  
//   const [activeTab, setActiveTab] = useState("Activity Matrix");
//   const [stats, setStats] = useState(null);
//   const [progressData, setProgressData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       try {
//         const [statsRes, progRes] = await Promise.all([
//           fetch(`${API_BASE}/api/dashboard/stats/${user.uid}`),
//           fetch(`${API_BASE}/api/progress?uid=${user.uid}`)
//         ]);
//         const sData = await statsRes.json();
//         const pData = await progRes.json();
//         if (sData.success) setStats(sData.data);
//         if (pData.success) setProgressData(pData.data);
//       } catch (err) {
//         console.error("Dashboard Data Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user?.uid, API_BASE]);

//   // ==================== Dynamic Values ====================
//   const xp = stats?.points || 0;
//   const streak = stats?.streak || 0;
//   const pct = progressData?.percentage ?? 0;
//   const rank = stats?.rank || "Voyager";
//   const milestonesCount = progressData?.milestones?.filter(m => m.status === 'completed')?.length || 0;

//   // Efficiency (Balanced)
//   const efficiency = Math.min(100, Math.max(0, (xp / 25) + (streak * 6))).toFixed(1);

//   // Dynamic Latency
//   const getLatency = () => {
//     if (streak >= 15) return "8ms";
//     if (streak >= 8)  return "12ms";
//     if (streak >= 3)  return "18ms";
//     if (streak >= 1)  return "25ms";
//     return "42ms";
//   };
//   const latency = getLatency();

//   // Sync Level Grade
//   const gradeSystem = [
//     { min: 95, grade: 'S+', desc: 'Genius Tier' },
//     { min: 85, grade: 'S',  desc: 'Master Tier' },
//     { min: 75, grade: 'A+', desc: 'Elite Skill' },
//     { min: 60, grade: 'A',  desc: 'Advanced' },
//     { min: 0,  grade: 'B',  desc: 'Growing' }
//   ];
//   const currentGrade = gradeSystem.find(g => pct >= g.min) || gradeSystem[gradeSystem.length - 1];

//   // ==================== Achievement Nodes (Badges) ====================
//   const ALL_BADGES = [
//     { id:'initiation',   name:'Initiation',    desc:'Joined SkillVoyager',   icon:'Rocket',     color: T.teal,     check: () => true },
//     { id:'first_roadmap',name:'Explorer',      desc:'1 milestone done',      icon:'Map',        color: '#10b981',  check: () => milestonesCount >= 1 },
//     { id:'continuous',   name:'Consistent',    desc:'3+ day streak',         icon:'Fire',       color: '#f97316',  check: () => streak >= 3 },
//     { id:'century',      name:'Centurion',     desc:'Earn 100+ XP',          icon:'Zap',        color: T.gold,     check: () => xp >= 100 },
//     { id:'architect',    name:'Architect',     desc:'3+ milestones',         icon:'Brain',      color: T.violet,   check: () => milestonesCount >= 3 },
//     { id:'neural_sync',  name:'Neural Sync',   desc:'50%+ mastery',          icon:'Target',     color: T.cyan,     check: () => pct >= 50 },
//     { id:'voyager',      name:'Elite Voyager', desc:'80%+ mastery',          icon:'ShieldCheck',color: T.teal,     check: () => pct >= 80 },
//     { id:'grandmaster',  name:'Grandmaster',   desc:'1000+ XP',              icon:'Award',      color: T.rose,     check: () => xp >= 1000 },
//   ];

//   const badges = ALL_BADGES.map(b => ({ ...b, unlocked: b.check() }));
//   const unlockedCount = badges.filter(b => b.unlocked).length;

//   const iconMap = {
//     Rocket: <Rocket size={26} />,
//     Map: <Map size={26} />,
//     Fire: <HiOutlineFire size={26} />,
//     Zap: <Zap size={26} />,
//     Brain: <Brain size={26} />,
//     Target: <Target size={26} />,
//     ShieldCheck: <ShieldCheck size={26} />,
//     Award: <Award size={26} />,
//   };

//   // Chart Data
//   const getChartData = () => {
//     let labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
//     let data = [1.4, 0.9, 2.8, 1.2, 3.5, 2.1, 4.2];
//     let color = T.teal;

//     if (activeTab === "Neural Progress") {
//       labels = ['P1','P2','P3','P4','P5','P6','NOW'];
//       data = [0, xp*0.15, xp*0.3, xp*0.45, xp*0.6, xp*0.8, xp];
//       color = T.rose;
//     } else if (activeTab === "Skill Load") {
//       const skills = progressData?.skillStrength || {};
//       const pairs = Object.entries(skills);
//       if (pairs.length > 0) {
//         labels = pairs.map(([k]) => k.slice(0,8));
//         data = pairs.map(([,v]) => v);
//       } else {
//         labels = ['Frontend','Backend','DevOps','UI/UX','Cloud'];
//         data = [65, 42, 28, 55, 33];
//       }
//       color = T.violet;
//     }

//     return {
//       labels,
//       datasets: [{
//         label: activeTab,
//         data,
//         borderColor: color,
//         backgroundColor: `${color}08`,
//         fill: true,
//         tension: 0.4,
//         pointRadius: 5,
//       }]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { display: false } },
//     scales: {
//       y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: T.textFaint } },
//       x: { grid: { display: false }, ticks: { color: T.textFaint } }
//     }
//   };

//   return (
//     <div className="db-root">
//       <StyleProvider />
//       <Navbar />
      
//       <main className="max-w-[1300px] mx-auto pt-24 px-6 pb-20">
//         {!loading && (
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
//             {/* Header */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
//               <div className="flex items-center gap-5">
//                 <div className="w-14 h-14 rounded-xl overflow-hidden border border-teal-500/30 shadow-2xl">
//                   <img 
//                     src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=17B6A8&color=fff`} 
//                     className="w-full h-full object-cover" 
//                     alt="avatar" 
//                   />
//                 </div>
//                 <div>
//                   <h1 className="display text-2xl text-white mb-1">System Command</h1>
//                   <Chip color={T.teal} glow>Real-time Matrix Sync</Chip>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <button className="btn-p" onClick={() => navigate('/dashboard')}>Return to Deck</button>
//                 <button className="btn-s" onClick={() => navigate('/settings')}>
//                   <SettingsIcon size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Top Stats Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
//               {[
//                 { label: "Neural XP", value: xp, sub: rank, icon: <Cpu size={16}/>, color: T.teal, bar: Math.min(100, (xp / 1000) * 100) },
//                 { label: "Streak", value: `${streak}d`, sub: "Activity", icon: <HiOutlineFire size={16}/>, color: '#f97316', bar: Math.min(100, (streak / 30) * 100) },
//                 { label: "Completion", value: milestonesCount, sub: "Milestone", icon: <Fingerprint size={16}/>, color: T.cyan, bar: pct },
//                 { label: "Mastery", value: `${pct}%`, sub: "Accuracy", icon: <Target size={16}/>, color: T.gold, bar: pct },
//               ].map((m, i) => (
//                 <div key={i} className="card p-5 flex flex-col justify-center" style={{ minHeight: '125px' }}>
//                   <div className="flex items-center gap-4 mb-3">
//                     <div style={{ background: `${m.color}15`, padding: 8, borderRadius: 10, color: m.color }}>{m.icon}</div>
//                     <p className="micro">{m.label}</p>
//                   </div>
//                   <div className="flex items-baseline gap-3 mb-3">
//                     <h2 className="display text-2xl text-white">{m.value}</h2>
//                     <span style={{ color: m.color, fontSize: 11, fontWeight: 700 }}>{m.sub}</span>
//                   </div>
//                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
//                     <motion.div initial={{ width: 0 }} animate={{ width: `${m.bar}%` }} className="h-full" style={{ background: m.color }} />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* ==================== ACHIEVEMENT NODES ==================== */}
//               <div className="lg:col-span-1">
//                 <section className="card p-7 h-full">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="display text-base text-white flex items-center gap-3">
//                       <Trophy size={18} color={T.gold} /> Achievement Nodes
//                     </h3>
//                     <Chip color={T.teal}>{unlockedCount}/8</Chip>
//                   </div>

//                   <div className="grid grid-cols-2 gap-5">
//                     {badges.map((b, i) => (
//                       <div key={i} className={`badge-card ${b.unlocked ? 'badge-unlocked' : 'badge-locked'}`}>
//                         <div className="flex justify-between items-start mb-4">
//                           <div style={{ color: b.unlocked ? b.color : 'inherit' }}>
//                             {iconMap[b.icon]}
//                           </div>
//                           {b.unlocked && <CheckCircle2 size={14} className="text-teal-400" />}
//                         </div>
//                         <p className="text-[14px] font-bold text-white mb-1">{b.name}</p>
//                         <p className="text-[10px] text-white/45 leading-relaxed">{b.desc}</p>
//                         {b.unlocked && (
//                           <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-400 pulse-glow" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               </div>

//               {/* Chart + 3 Metrics */}
//               <div className="lg:col-span-2">
//                 <section className="card p-7">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
//                     <div className="flex gap-2">
//                       {["Activity Matrix", "Neural Progress", "Skill Load"].map(tab => (
//                         <div 
//                           key={tab} 
//                           onClick={() => setActiveTab(tab)}
//                           className={`glass-tab ${activeTab === tab ? 'active' : ''}`}
//                         >
//                           {tab}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="h-[340px] w-full">
//                     <Line data={getChartData()} options={chartOptions} />
//                   </div>

//                   {/* 3 Dynamic Metrics Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
//                     {[
//                       { l: "EFFICIENCY", v: `${efficiency}%`, c: T.teal, f: "(XP / 25) + (Streak × 6)", d: "Velocity Index" },
//                       { l: "LATENCY",    v: latency, c: T.cyan, f: "System heartbeat", d: "Response Time" },
//                       { l: "SYNC LEVEL", v: currentGrade.grade, c: T.gold, f: `Mastery: ${currentGrade.desc}`, d: "Overall Grade" },
//                     ].map((x, i) => (
//                       <div key={i} className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
//                         <div className="flex items-center justify-center gap-2 mb-3">
//                           <p className="micro">{x.l}</p>
//                           <HelpCircle size={11} className="text-white/30" />
//                         </div>
//                         <h4 className="text-3xl font-bold display mb-1" style={{ color: x.c }}>
//                           {x.v}
//                         </h4>
//                         <div className="formula-tag">{x.f}</div>
//                         <p className="text-[10px] text-white/40 mt-2">{x.d}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               </div>
//             </div>

//           </motion.div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ActionableDashboard;



import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, Target, Award, Cpu, Fingerprint, 
  HelpCircle, Settings as SettingsIcon, CheckCircle2, 
  Rocket, Map, Zap, Brain, ShieldCheck
} from "lucide-react";
import { HiOutlineFire } from "react-icons/hi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import Navbar from "../../components/Navbar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const T = {
  bg: '#040d18',
  card: 'rgba(13, 25, 39, 0.45)',
  teal: '#17B6A8',
  cyan: '#0fd4c4',
  gold: '#F5C842',
  rose: '#ff2d78',
  violet: '#7c3aed',
  text: 'rgba(255,255,255,0.95)',
  textDim: 'rgba(255,255,255,0.65)',
  textFaint: 'rgba(255,255,255,0.40)',
};

const Chip = ({ children, color = '#17B6A8', glow = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 99,
    background: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 11, fontWeight: 700,
    boxShadow: glow ? `0 0 15px ${color}20` : 'none'
  }}>
    {children}
  </span>
);

const StyleProvider = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    .db-root {
      font-family: 'Inter', sans-serif;
      background: #040d18; 
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(23,182,168,0.06) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(23,182,168,0.03) 0%, transparent 40%);
    }
    
    .display { font-weight: 700; letter-spacing: -0.015em; }
    
    .card {
      background: rgba(13, 25, 39, 0.55);
      border: 1px solid rgba(23,182,168,0.12);
      border-radius: 18px; 
      backdrop-filter: blur(24px);
      transition: all 0.3s ease;
    }
    .card:hover { border-color: rgba(23,182,168,0.25); }

    .micro { font-size: 10.5px; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 0.14em; text-transform: uppercase; }

    .btn-p {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; border-radius: 12px;
      background: linear-gradient(135deg, #17B6A8, #0da89a);
      color: #040d18; font-size: 13px; font-weight: 700;
      border: none; cursor: pointer; transition: 0.2s;
    }
    .btn-p:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(23,182,168,0.35); }

    .btn-s {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 12px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
      color: white; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: 0.2s;
    }

    .glass-tab {
      padding: 8px 18px; border-radius: 10px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: 0.2s; border: 1px solid transparent; color: ${T.textDim};
    }
    .glass-tab.active { 
      background: rgba(23,182,168,0.12); 
      border-color: rgba(23,182,168,0.3); 
      color: ${T.teal}; 
    }
    
    .badge-card {
      padding: 22px 18px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative; overflow: hidden;
    }
    .badge-unlocked {
      background: rgba(23, 182, 168, 0.08);
      border-color: rgba(23, 182, 168, 0.3);
      box-shadow: 0 12px 40px -12px rgba(23, 182, 168, 0.25);
    }
    .badge-unlocked:hover { 
      transform: scale(1.04) translateY(-4px); 
      border-color: ${T.teal}; 
    }
    .badge-locked { opacity: 0.25; grayscale: 1; }
    
    @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
    .pulse-glow { animation: pulse-glow 2.5s infinite; }

    .formula-tag {
      background: rgba(255,255,255,0.04); 
      padding: 5px 10px; border-radius: 8px; 
      font-size: 9.5px; color: rgba(255,255,255,0.45);
      border: 1px solid rgba(255,255,255,0.08);
      margin-top: 8px; display: inline-block;
      font-weight: 600;
    }
  `}</style>
);

const ActionableDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState("Activity Matrix");
  const [stats, setStats] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const [statsRes, progRes] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/stats/${user.uid}`),
          fetch(`${API_BASE}/api/progress?uid=${user.uid}`)
        ]);
        const sData = await statsRes.json();
        const pData = await progRes.json();
        if (sData.success) setStats(sData.data);
        if (pData.success) setProgressData(pData.data);
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, API_BASE]);

  // Time tracking is handled globally (see `ActivityTracker`)

  // Live-refresh stats so Activity Matrix reflects newly counted time
  useEffect(() => {
    if (!user?.uid) return;
    let stopped = false;

    const refreshStats = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/dashboard/stats/${user.uid}`);
        const j = await r.json();
        if (!stopped && j?.success) setStats(j.data);
      } catch (_) {
        // non-critical
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') refreshStats();
    }, 20_000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [user?.uid, API_BASE]);

  // Dynamic Values
  const xp = stats?.points || 0;
  const streak = stats?.streak || 0;
  const pct = progressData?.percentage ?? 0;
  const rank = stats?.rank || "Voyager";
  const milestonesCount = progressData?.milestones?.filter(m => m.status === 'completed')?.length || 0;

  const efficiency = Math.min(100, Math.max(0, (xp / 25) + (streak * 6))).toFixed(1);

  const getLatency = () => {
    if (streak >= 15) return "8ms";
    if (streak >= 8)  return "12ms";
    if (streak >= 3)  return "18ms";
    if (streak >= 1)  return "25ms";
    return "42ms";
  };
  const latency = getLatency();

  const gradeSystem = [
    { min: 95, grade: 'S+', desc: 'Genius Tier' },
    { min: 85, grade: 'S',  desc: 'Master Tier' },
    { min: 75, grade: 'A+', desc: 'Elite Skill' },
    { min: 60, grade: 'A',  desc: 'Advanced' },
    { min: 0,  grade: 'B',  desc: 'Growing' }
  ];
  const currentGrade = gradeSystem.find(g => pct >= g.min) || gradeSystem[gradeSystem.length - 1];

  // Achievement Nodes
  const ALL_BADGES = [
    { id:'initiation',   name:'Initiation',    desc:'Joined SkillVoyager',   icon:'Rocket',     color: T.teal,     check: () => true },
    { id:'first_roadmap',name:'Explorer',      desc:'1 milestone done',      icon:'Map',        color: '#10b981',  check: () => milestonesCount >= 1 },
    { id:'continuous',   name:'Consistent',    desc:'3+ day streak',         icon:'Fire',       color: '#f97316',  check: () => streak >= 3 },
    { id:'century',      name:'Centurion',     desc:'Earn 100+ XP',          icon:'Zap',        color: T.gold,     check: () => xp >= 100 },
    { id:'architect',    name:'Architect',     desc:'3+ milestones',         icon:'Brain',      color: T.violet,   check: () => milestonesCount >= 3 },
    { id:'neural_sync',  name:'Neural Sync',   desc:'50%+ mastery',          icon:'Target',     color: T.cyan,     check: () => pct >= 50 },
    { id:'voyager',      name:'Elite Voyager', desc:'80%+ mastery',          icon:'ShieldCheck',color: T.teal,     check: () => pct >= 80 },
    { id:'grandmaster',  name:'Grandmaster',   desc:'1000+ XP',              icon:'Award',      color: T.rose,     check: () => xp >= 1000 },
  ];

  const badges = ALL_BADGES.map(b => ({ ...b, unlocked: b.check() }));
  const unlockedCount = badges.filter(b => b.unlocked).length;

  const iconMap = {
    Rocket: <Rocket size={26} />,
    Map: <Map size={26} />,
    Fire: <HiOutlineFire size={26} />,
    Zap: <Zap size={26} />,
    Brain: <Brain size={26} />,
    Target: <Target size={26} />,
    ShieldCheck: <ShieldCheck size={26} />,
    Award: <Award size={26} />,
  };

  // ==================== FULLY DYNAMIC CHART DATA ====================
  const getChartData = () => {
    let labels = [];
    let data = [];
    let color = T.teal;
    let labelText = activeTab;

    if (activeTab === "Activity Matrix") {
      // watchHistory comes from dashboard stats (last 7 days)
      const history = stats?.watchHistory || [];
      const todayKey = (() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0];
      })();
      const localTodayMinutes = (() => {
        try {
          const sec = Number(localStorage.getItem(`sv_active_seconds_${todayKey}`) || "0");
          return Math.floor(sec / 60);
        } catch (_) {
          return 0;
        }
      })();

      if (history.length > 0) {
        const sorted = [...history]
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7);

        labels = sorted.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });

        // minutes are easier to see than tiny hour fractions
        data = sorted.map(item => {
          const d = new Date(item.date);
          const k = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0];
          const serverMin = Math.round((Number(item.hours) || 0) * 60);
          return k === todayKey ? Math.max(serverMin, localTodayMinutes) : serverMin;
        });
     } else {
  const days = 7;
  labels = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - i - 1));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  data = labels.map((_, i) => {
    return i === labels.length - 1 ? localTodayMinutes : 0;
  });
}
      color = T.teal;
      labelText = "Daily Active Minutes";
    } 
    else if (activeTab === "Neural Progress") {
      labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'NOW'];
      data = [0, xp * 0.15, xp * 0.3, xp * 0.45, xp * 0.6, xp * 0.8, xp];
      color = T.rose;
      labelText = "Neural XP Growth";
    } 
    else if (activeTab === "Skill Load") {
      const skills = progressData?.skillStrength || {};
      const pairs = Object.entries(skills);

      if (pairs.length > 0) {
        labels = pairs.map(([k]) => k.slice(0, 8));
        data = pairs.map(([, v]) => Number(v) || 0);
      } else {
        labels = ['HTML', 'CSS', 'JS', 'React', 'Node'];
        data = [65, 58, 42, 55, 33];
      }
      color = T.violet;
      labelText = "Skill Mastery %";
    }

    return {
      labels,
      datasets: [{
        label: labelText,
        data,
        borderColor: color,
        backgroundColor: `${color}08`,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: T.textFaint } },
      x: { grid: { display: false }, ticks: { color: T.textFaint } }
    }
  };

  return (
    <div className="db-root">
      <StyleProvider />
      
      <main className="max-w-[1300px] mx-auto pt-[160px] px-6 pb-20">
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-teal-500/30 shadow-2xl">
                  <img 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=17B6A8&color=fff`} 
                    className="w-full h-full object-cover" 
                    alt="avatar" 
                  />
                </div>
                <div>
                  <h1 className="display text-2xl text-white mb-1">System Command</h1>
                  <Chip color={T.teal} glow>Real-time Matrix Sync</Chip>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-p" onClick={() => navigate('/dashboard')}>Return to Deck</button>
                <button className="btn-s" onClick={() => navigate('/settings')}>
                  <SettingsIcon size={18} />
                </button>
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {[
                { label: "Neural XP", value: xp, sub: rank, icon: <Cpu size={16}/>, color: T.teal, bar: Math.min(100, (xp / 1000) * 100) },
                { label: "Streak", value: `${streak}d`, sub: "Activity", icon: <HiOutlineFire size={16}/>, color: '#f97316', bar: Math.min(100, (streak / 30) * 100) },
                { label: "Completion", value: milestonesCount, sub: "Milestone", icon: <Fingerprint size={16}/>, color: T.cyan, bar: pct },
                { label: "Mastery", value: `${pct}%`, sub: "Accuracy", icon: <Target size={16}/>, color: T.gold, bar: pct },
              ].map((m, i) => (
                <div key={i} className="card p-5 flex flex-col justify-center" style={{ minHeight: '125px' }}>
                  <div className="flex items-center gap-4 mb-3">
                    <div style={{ background: `${m.color}15`, padding: 8, borderRadius: 10, color: m.color }}>{m.icon}</div>
                    <p className="micro">{m.label}</p>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="display text-2xl text-white">{m.value}</h2>
                    <span style={{ color: m.color, fontSize: 11, fontWeight: 700 }}>{m.sub}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.bar}%` }} className="h-full" style={{ background: m.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Achievement Nodes */}
              <div className="lg:col-span-1">
                <section className="card p-7 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="display text-base text-white flex items-center gap-3">
                      <Trophy size={18} color={T.gold} /> Achievement Nodes
                    </h3>
                    <Chip color={T.teal}>{unlockedCount}/8</Chip>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {badges.map((b, i) => (
                      <div key={i} className={`badge-card ${b.unlocked ? 'badge-unlocked' : 'badge-locked'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div style={{ color: b.unlocked ? b.color : 'inherit' }}>
                            {iconMap[b.icon]}
                          </div>
                          {b.unlocked && <CheckCircle2 size={14} className="text-teal-400" />}
                        </div>
                        <p className="text-[14px] font-bold text-white mb-1">{b.name}</p>
                        <p className="text-[10px] text-white/45 leading-relaxed">{b.desc}</p>
                        {b.unlocked && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-400 pulse-glow" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Chart Section */}
              <div className="lg:col-span-2">
                <section className="card p-7">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
                    <div className="flex gap-2">
                      {["Activity Matrix", "Neural Progress", "Skill Load"].map(tab => (
                        <div 
                          key={tab} 
                          onClick={() => setActiveTab(tab)}
                          className={`glass-tab ${activeTab === tab ? 'active' : ''}`}
                        >
                          {tab}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-[340px] w-full">
                    <Line data={getChartData()} options={chartOptions} />
                  </div>

                  {/* 3 Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                    {[
                      { l: "EFFICIENCY", v: `${efficiency}%`, c: T.teal, f: "(XP / 25) + (Streak × 6)", d: "Velocity Index" },
                      { l: "LATENCY",    v: latency, c: T.cyan, f: "System heartbeat", d: "Response Time" },
                      { l: "SYNC LEVEL", v: currentGrade.grade, c: T.gold, f: `Mastery: ${currentGrade.desc}`, d: "Overall Grade" },
                    ].map((x, i) => (
                      <div key={i} className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <p className="micro">{x.l}</p>
                          <HelpCircle size={11} className="text-white/30" />
                        </div>
                        <h4 className="text-3xl font-bold display mb-1" style={{ color: x.c }}>
                          {x.v}
                        </h4>
                        <div className="formula-tag">{x.f}</div>
                        <p className="text-[10px] text-white/40 mt-2">{x.d}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ActionableDashboard;