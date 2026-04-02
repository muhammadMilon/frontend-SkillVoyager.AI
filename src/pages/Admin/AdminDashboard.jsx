import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import {
  LayoutDashboard, Users, Route, Brain, GraduationCap,
  BookOpen, Bell, MessageSquare, User, Settings, ShieldCheck,
  Search, ChevronDown, Menu, X, LogOut, Activity,
  Zap, Target, BarChart3, CreditCard,
} from 'lucide-react';

import { Styles, Bg } from './Shared';

// ── Views ────────────────────────────────────────────────────────────────
import OverviewDashboard from './views/OverviewDashboard';
import UsersManagement from './views/UsersManagement';
import AIAnalytics from './views/AIAnalytics';
import CoursesAdmin from './views/CoursesAdmin';
import TransactionsView from './views/TransactionsView';
import ReportsFeedback from './views/ReportsFeedback';
import SystemSettings from './views/SystemSettings';
import NotificationsAdmin from './views/NotificationsAdmin';
import SkillGapMonitor from './views/SkillGapMonitor';
import RoadmapControl from './views/RoadmapControl';
import QuizControl from './views/QuizControl';
import AdminProfile from './views/AdminProfile';

/* ─────────────────────────────────────────
   ADMIN DASHBOARD LAYOUT
───────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, dbUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { await logOut(); navigate('/login'); };

  const menuItems = [
    { id:'dashboard',     label:'Dashboard',          icon:<LayoutDashboard size={15}/> },
    { id:'users',         label:'Users Management',   icon:<Users size={15}/> },
    { id:'ai-analytics',  label:'AI Analytics',       icon:<Brain size={15}/> },
    { id:'courses',       label:'Courses',            icon:<BookOpen size={15}/> },
    { id:'transactions',  label:'Transactions',       icon:<CreditCard size={15}/> },
    { id:'roadmaps',      label:'Roadmap Control',    icon:<Route size={15}/> },
    { id:'skill-gap',     label:'Skill Gap Monitor',  icon:<Target size={15}/> },
    { id:'quizzes',       label:'Quiz & Assessment',  icon:<GraduationCap size={15}/> },
    { id:'notifications', label:'Signal Broadcast',   icon:<Bell size={15}/> },
    { id:'reports',       label:'Reports & Feedback', icon:<MessageSquare size={15}/> },
    { id:'profile',       label:'Admin Profile',      icon:<User size={15}/> },
    { id:'system',        label:'System Settings',    icon:<Settings size={15}/> },
  ];

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':     return <OverviewDashboard />;
      case 'users':         return <UsersManagement />;
      case 'ai-analytics':  return <AIAnalytics />;
      case 'courses':       return <CoursesAdmin />;
      case 'transactions':  return <TransactionsView />;
      case 'roadmaps':      return <RoadmapControl />;
      case 'skill-gap':     return <SkillGapMonitor />;
      case 'quizzes':       return <QuizControl />;
      case 'notifications': return <NotificationsAdmin />;
      case 'reports':       return <ReportsFeedback />;
      case 'profile':       return <AdminProfile />;
      case 'system':        return <SystemSettings />;
      default:              return <OverviewDashboard />;
    }
  };

  return (
    <>
      <Styles />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .sidebar { transition: width 0.25s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
      <div className="adm" style={{ display:'flex', position:'relative' }}>
        <Bg />

        {/* ── SIDEBAR ── */}
        <aside className="sidebar" style={{
          width: sidebarOpen ? 240 : 64,
          background:'rgba(4,8,16,0.95)',
          borderRight:'1px solid rgba(255,255,255,0.055)',
          backdropFilter:'blur(20px)',
          position:'fixed', height:'100vh', zIndex:50,
          display:'flex', flexDirection:'column',
          transition:'width 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* Logo */}
          <div style={{ padding:'18px 14px 16px', borderBottom:'1px solid rgba(255,255,255,0.055)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            {sidebarOpen && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(79,70,229,0.4)', flexShrink:0 }}>
                  <ShieldCheck size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:'white', letterSpacing:'-0.02em', lineHeight:1.2 }}>SkillVoyager</div>
                  <div style={{ fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:1 }}>Admin</div>
                </div>
              </div>
            )}
            <button onClick={()=>setSidebarOpen(!sidebarOpen)}
              style={{ width:30, height:30, borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(148,163,184,0.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
              {sidebarOpen ? <X size={14}/> : <Menu size={14}/>}
            </button>
          </div>

          {/* Mini profile */}
          {sidebarOpen && (
            <div style={{ padding:'12px 12px 10px', borderBottom:'1px solid rgba(255,255,255,0.055)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <img src={user?.photoURL || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"} alt=""
                  style={{ width:30, height:30, borderRadius:9, objectFit:'cover', border:'1px solid rgba(99,102,241,0.25)', flexShrink:0 }}
                  onError={e=>{ e.target.src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"; }} />
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.displayName || 'Admin'}</div>
                  <div style={{ fontSize:9, fontWeight:600, color:'#818cf8', textTransform:'uppercase', letterSpacing:'0.08em' }}>{dbUser?.role || 'admin'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex:1, padding:'10px 10px', overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
            {menuItems.map(item => (
              <button key={item.id} onClick={()=>setActiveTab(item.id)}
                className={`nav-item${activeTab===item.id?' active':''}`}
                title={!sidebarOpen ? item.label : ''}>
                <span style={{ flexShrink:0 }}>{item.icon}</span>
                {sidebarOpen && (
                  <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div style={{ padding:'10px 10px', borderTop:'1px solid rgba(255,255,255,0.055)', flexShrink:0 }}>
            <button onClick={handleLogout} className="nav-item" style={{ color:'rgba(248,113,113,0.6)' }}>
              <LogOut size={15} style={{ flexShrink:0 }} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ marginLeft: sidebarOpen ? 240 : 64, flex:1, minHeight:'100vh', transition:'margin-left 0.25s cubic-bezier(0.22,1,0.36,1)', position:'relative', zIndex:1 }}>

          {/* Header */}
          <header style={{ position:'sticky', top:0, zIndex:40, background:'rgba(4,8,16,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.055)', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'white', letterSpacing:'-0.02em', textTransform:'capitalize' }}>
                  {activeTab.replace(/-/g,' ')}
                </h2>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:99, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)' }}>
                  <span className="pdot" style={{ width:5, height:5, borderRadius:'50%', background:'#818cf8', display:'block' }} />
                  <span style={{ fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'0.1em', textTransform:'uppercase' }}>Live</span>
                </span>
              </div>
              <p style={{ fontSize:10, color:'rgba(148,163,184,0.35)', fontWeight:500, letterSpacing:'0.05em', marginTop:1 }}>Root Access • AI Supervision</p>
            </motion.div>

            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(148,163,184,0.3)', width:13, height:13 }} />
                <input className="ainp" type="text" placeholder="Search..." style={{ padding:'8px 14px 8px 32px', borderRadius:10, fontSize:12, width:200 }} />
              </div>

              {/* Profile dropdown */}
              <div style={{ position:'relative' }} ref={dropdownRef}>
                <button onClick={()=>setDropdownOpen(v=>!v)}
                  style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 10px 6px 6px', borderRadius:11, background: dropdownOpen ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', border:`1px solid ${dropdownOpen ? 'rgba(99,102,241,0.28)' : 'rgba(255,255,255,0.07)'}`, cursor:'pointer', transition:'all 0.2s' }}>
                  <div style={{ position:'relative' }}>
                    <img src={user?.photoURL || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"} alt=""
                      style={{ width:30, height:30, borderRadius:9, objectFit:'cover', border:'1px solid rgba(99,102,241,0.25)', display:'block' }}
                      onError={e=>{ e.target.src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"; }} />
                    <div style={{ position:'absolute', bottom:-1, right:-1, width:9, height:9, borderRadius:'50%', background:'#10b981', border:'2px solid #040810' }} />
                  </div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'white', lineHeight:1.2 }}>{user?.displayName?.split(' ')[0] || 'Admin'}</div>
                    <div style={{ fontSize:9, fontWeight:600, color:'#818cf8', textTransform:'uppercase', letterSpacing:'0.08em' }}>{dbUser?.role || 'admin'}</div>
                  </div>
                  <ChevronDown size={13} style={{ color:'rgba(148,163,184,0.4)', marginLeft:2, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s' }} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity:0, y:8, scale:0.96 }}
                      animate={{ opacity:1, y:0, scale:1 }}
                      exit={{ opacity:0, y:8, scale:0.96 }}
                      transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
                      style={{
                        position:'fixed', top:68, right:20,
                        width:260,
                        background:'linear-gradient(160deg, rgba(10,13,30,0.98) 0%, rgba(6,9,22,0.99) 100%)',
                        border:'1px solid rgba(255,255,255,0.09)',
                        borderRadius:18,
                        backdropFilter:'blur(40px)',
                        boxShadow:'0 8px 12px rgba(0,0,0,0.3), 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 40px rgba(99,102,241,0.06)',
                        overflow:'hidden',
                        zIndex:9999,
                      }}>
                      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)' }} />
                      <div style={{ padding:'16px 16px 14px', borderBottom:'1px solid rgba(255,255,255,0.055)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                          <div style={{ position:'relative', flexShrink:0 }}>
                            <img src={user?.photoURL || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"} alt=""
                              style={{ width:40, height:40, borderRadius:12, objectFit:'cover', border:'1.5px solid rgba(99,102,241,0.3)' }}
                              onError={e=>{ e.target.src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"; }} />
                            <div style={{ position:'absolute', bottom:-2, right:-2, width:11, height:11, borderRadius:'50%', background:'#10b981', border:'2px solid #06091a' }} />
                          </div>
                          <div style={{ overflow:'hidden' }}>
                            <div style={{ fontSize:13, fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.displayName || 'Admin'}</div>
                            <div style={{ fontSize:11, color:'rgba(148,163,184,0.5)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{user?.email || 'admin@skillvoyager.ai'}</div>
                            <div style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:5, padding:'2px 7px', borderRadius:99, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.22)' }}>
                              <ShieldCheck size={9} color="#818cf8" />
                              <span style={{ fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'0.08em', textTransform:'uppercase' }}>System Administrator</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding:'6px 8px' }}>
                        {[
                          { label:'Admin Dashboard', icon:<LayoutDashboard size={14}/>, action:()=>{ setActiveTab('dashboard'); setDropdownOpen(false); } },
                          { label:'Admin Profile', icon:<ShieldCheck size={14}/>, action:()=>{ setActiveTab('profile'); setDropdownOpen(false); }, accent:true },
                          { label:'Build Roadmap', icon:<Route size={14}/>, action:()=>{ navigate('/onboarding'); setDropdownOpen(false); } },
                          { label:'Settings', icon:<Settings size={14}/>, action:()=>{ setActiveTab('system'); setDropdownOpen(false); } },
                        ].map((item,i) => (
                          <motion.button key={i} onClick={item.action} whileHover={{ x:2 }} transition={{ duration:0.12 }}
                            style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:11, border:'none', background:'transparent', color: item.accent ? '#a5b4fc' : 'rgba(203,213,225,0.7)', fontSize:13, fontWeight: item.accent ? 600 : 500, cursor:'pointer', transition:'background 0.15s, color 0.15s', textAlign:'left', fontFamily:'Inter,sans-serif', marginBottom:1 }}
                            onMouseEnter={e=>{ e.currentTarget.style.background= item.accent ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.color='white'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=item.accent?'#a5b4fc':'rgba(203,213,225,0.7)'; }}>
                            <div style={{ width:30, height:30, borderRadius:9, background: item.accent ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)', border:`1px solid ${item.accent ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'}`, display:'flex', alignItems:'center', justifyContent:'center', color: item.accent ? '#818cf8' : 'rgba(148,163,184,0.5)', flexShrink:0 }}>
                              {item.icon}
                            </div>
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                      <div style={{ padding:'6px 8px 8px', borderTop:'1px solid rgba(255,255,255,0.055)' }}>
                        <motion.button onClick={handleLogout} whileHover={{ x:2 }} transition={{ duration:0.12 }}
                          style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:11, border:'none', background:'transparent', color:'rgba(248,113,113,0.7)', fontSize:13, fontWeight:500, cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif' }}
                          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.color='#f87171'; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(248,113,113,0.7)'; }}>
                          <div style={{ width:30, height:30, borderRadius:9, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171', flexShrink:0 }}>
                            <LogOut size={13} />
                          </div>
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Content */}
          <div style={{ padding:'24px 28px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}>
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;