// components/DashboardSidebar.jsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  User, Info, MapPin, GraduationCap, Link as LinkIcon,
 Briefcase, History, Rocket, Book, ShoppingCart, Award,
  CheckCircle2, LogIn, UserPlus, CircleAlert, LayoutDashboard, Activity,
  Brain
} from "lucide-react";
import { AuthContext } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

const T = {
  bg:       'linear-gradient(160deg, #040d18 0%, #071525 60%, #030c14 100%)',
  card:     'linear-gradient(145deg, #071320 0%, #091a28 55%, #060f1a 100%)',
  teal:     '#17B6A8',
  tealDim:  'rgba(23,182,168,0.09)',
  tealMid:  'rgba(23,182,168,0.18)',
  border:   'rgba(23,182,168,0.18)',
  borderDim:'rgba(23,182,168,0.10)',
  cyan:     '#0fd4c4',
  gold:     '#F5C842',
  text:     'rgba(255,255,255,0.90)',
  textDim:  'rgba(255,255,255,0.55)',
  textFaint:'rgba(255,255,255,0.28)',
};

const DashboardSidebar = ({ activeSection, setActiveSection, profileCompletion = 100, isOpen, setIsOpen }) => {
  const { user, dbUser } = useContext(AuthContext);

  const displayName  = dbUser?.displayName  || user?.displayName  || "Voyager";
  const email        = dbUser?.email        || user?.email        || "No email";
  const phone        = dbUser?.phone        || "Phone not set";
  const id           = dbUser?.studentId    || (dbUser?.uid ? `ID-${dbUser.uid.substring(0,6).toUpperCase()}` : "ID-PENDING");
  const photoURL     = dbUser?.photoURL     || user?.photoURL     || null;

  const profileFields = [
    dbUser?.displayName,
    dbUser?.photoURL || user?.photoURL,
    dbUser?.phone,
    dbUser?.studentId,
    dbUser?.onboarding?.bio,
    dbUser?.onboarding?.institution,
    dbUser?.onboarding?.skills?.length > 0,
  ];
  const filledFields  = profileFields.filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length;
  const completionPct = Math.round((filledFields / profileFields.length) * 100);

  const sections = [
    { id: "dashboard",       label: "Dashboard Home", icon: <LayoutDashboard size={17}/>, completed: true  },
    { id: "progress",        label: "Progress Metrics", icon: <Activity size={17}/>,        completed: true  },
    { id: "my-profile",      label: "My Profile",     icon: <User size={17}/>,            completed: completionPct >= 80  },
    { id: "additional-info", label: "Additional Info",icon: <Info size={17}/>,            completed: !!dbUser?.onboarding?.bio  },
    { id: "address",         label: "Address",        icon: <MapPin size={17}/>,          completed: !!dbUser?.onboarding?.address  },
    { id: "education",       label: "Education",      icon: <GraduationCap size={17}/>,   completed: !!dbUser?.onboarding?.institution  },
    { id: "important-links", label: "Important Links",icon: <LinkIcon size={17}/>,        completed: dbUser?.onboarding?.links?.length > 0  },
    { id: "skill-set",       label: "Skill Set",      icon: <Brain size={17}/>,           completed: dbUser?.onboarding?.skills?.length > 0  },
    { id: "job-profile",     label: "Job Profile",    icon: <Briefcase size={17}/>,       completed: !!dbUser?.onboarding?.jobTitle  },
    { id: "job-experience",  label: "Job Experience", icon: <History size={17}/>,         completed: false  },
    { id: "got-hired",       label: "Got Hired",      icon: <Rocket size={17}/>,          completed: false  },
    { id: "course-request",  label: "Course Request", icon: <Book size={17}/>,            completed: false },
    // { id: "order-history",   label: "Order History",  icon: <ShoppingCart size={17}/>,    completed: true  },
    { id: "certification",   label: "Certification",  icon: <Award size={17}/>,           completed: false  },
  ];

  const sidebarContent = (
    <div style={{
      height: '100%', overflowY: 'auto', background: T.bg,
      borderRight: `1px solid ${T.border}`,
    }}>
      {/* animated top accent line */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)` }} />

      <style>{`
        .sidebar-content-inner { padding: 120px 18px 24px; }
        @media (max-width: 1024px) { .sidebar-content-inner { padding: 40px 18px 24px; } }
      `}</style>
      <div className="sidebar-content-inner">
        {user ? (
          <>
            {/* ── Profile Card ── */}
            <div style={{
              background: T.card,
              borderRadius: 24, padding: '24px 20px',
              border: `1px solid ${T.border}`,
              boxShadow: `0 0 0 1px rgba(23,182,168,0.06), 0 20px 40px rgba(0,0,0,0.4)`,
              marginBottom: 24, position: 'relative', overflow: 'hidden',
            }}>
              {/* corner glow */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 180, height: 180, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.18, pointerEvents: 'none', background: `radial-gradient(circle, ${T.teal}, transparent 70%)`, transform: 'translate(-40%, -40%)' }} />
              {/* animated top line */}
              <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
                animate={{ backgroundPosition: ['0% 0', '200% 0'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

              {/* Info icon */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <CircleAlert size={18} style={{ color: T.teal, cursor: 'pointer', opacity: 0.7 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.7} />
              </div>

              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: '50%', padding: 2,
                    background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold})`,
                    boxShadow: `0 0 24px rgba(23,182,168,0.30)`,
                  }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#071320', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {photoURL ? (
                        <img src={photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=071320&color=17B6A8`; }} />
                      ) : (
                        <span style={{ fontSize: 32, fontWeight: 800, color: T.teal }}>{displayName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  {/* online dot */}
                  <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: T.teal, border: `2px solid #071320`, boxShadow: `0 0 6px ${T.teal}` }} />
                </div>

                {/* Name */}
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{displayName}</h3>

                {/* ID */}
                <p style={{ fontSize: 11, fontWeight: 700, color: T.teal, margin: '0 0 3px', letterSpacing: '0.05em' }}>{id}</p>

                {/* Email */}
                <p style={{ fontSize: 12, color: T.textDim, margin: '0 0 2px' }}>{email}</p>

                {/* Phone */}
                <p style={{ fontSize: 12, color: T.textFaint, margin: '0 0 18px' }}>{phone}</p>

                {/* Progress bar */}
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: T.textDim, fontWeight: 600 }}>Complete your profile</span>
                    <span style={{ fontSize: 11, color: T.teal, fontWeight: 700 }}>{completionPct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${T.teal}, ${T.cyan})` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Nav Links ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {sections.map(section => {
                const isActive = activeSection === section.id;
                return (
                  <motion.button key={section.id} whileHover={{ x: isActive ? 0 : 3 }}
                    onClick={() => { setActiveSection(section.id); if (isOpen) setIsOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                      transition: 'all 0.18s', textAlign: 'left',
                      background: isActive ? T.tealMid : 'transparent',
                      borderLeft: isActive ? `3px solid ${T.teal}` : '3px solid transparent',
                      boxShadow: isActive ? `0 0 12px rgba(23,182,168,0.12)` : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.tealDim; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>

                    {/* icon */}
                    <span style={{ color: isActive ? T.teal : T.textDim, flexShrink: 0, transition: 'color 0.18s' }}>
                      {section.icon}
                    </span>

                    {/* label */}
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? T.teal : T.textDim, flex: 1, transition: 'color 0.18s' }}>
                      {section.label}
                    </span>

                    {/* check */}
                    {section.completed && (
                      <CheckCircle2 size={14} style={{ color: isActive ? T.teal : 'rgba(23,182,168,0.35)', flexShrink: 0 }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          /* ── Logged-out state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 48, paddingBottom: 48 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg, ${T.teal}, ${T.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 24, boxShadow: `0 0 32px rgba(23,182,168,0.30)` }}>?</div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 10 }}>Welcome to Dashboard</h3>
            <p style={{ fontSize: 13, color: T.textDim, marginBottom: 32, maxWidth: 220, lineHeight: 1.6 }}>
              Login or Register to unlock your personalized dashboard and AI-powered learning journey.
            </p>

            <div style={{ width: '100%', maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/login" onClick={() => isOpen && setIsOpen(false)}
                style={{ textDecoration: 'none', width: '100%', padding: '13px 0', borderRadius: 14, textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'white', background: `linear-gradient(135deg, #0e2e2a, #0a2020)`, border: `1px solid ${T.border}`, boxShadow: `0 4px 16px rgba(23,182,168,0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <LogIn size={18}/> Login
              </Link>

              <Link to="/register" onClick={() => isOpen && setIsOpen(false)}
                style={{ textDecoration: 'none', width: '100%', padding: '13px 0', borderRadius: 14, textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'white', background: `linear-gradient(135deg, ${T.teal}, ${T.cyan})`, border: '1px solid transparent', boxShadow: `0 4px 16px rgba(23,182,168,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <UserPlus size={18}/> Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isOpen) {
    return (
      <>
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(2,8,18,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)} />
        <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden shadow-2xl">
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  return (
    <div className="hidden lg:block w-72 sticky top-0 h-screen overflow-y-auto">
      {sidebarContent}
    </div>
  );
};

export default DashboardSidebar;