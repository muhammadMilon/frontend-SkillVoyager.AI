import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../providers/AuthProvider';
import { ShieldCheck, Mail, Lock, Calendar, LogOut, Activity, CheckCircle2, Users, Bell, Brain, Settings } from 'lucide-react';
import { fadeUp, stagger } from '../Shared';

const AdminProfile = () => {
  const { user, dbUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => { await logOut(); navigate('/login'); };
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : 'N/A';

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20 }}>
      {/* Profile card */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'32px 28px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:80, background:'linear-gradient(180deg,rgba(99,102,241,0.12) 0%,transparent 100%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)' }} />

        <div style={{ position:'relative', marginBottom:18, zIndex:1 }}>
          <div style={{ width:80, height:80, borderRadius:22, overflow:'hidden', border:'2px solid rgba(99,102,241,0.3)', boxShadow:'0 8px 24px rgba(79,70,229,0.3)' }}>
            <img src={user?.photoURL || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"}
              alt="Admin" style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e=>{ e.target.src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"; }} />
          </div>
          <div style={{ position:'absolute', bottom:-4, right:-4, width:24, height:24, borderRadius:8, background:'#040810', border:'1.5px solid rgba(99,102,241,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ShieldCheck size={12} color="#818cf8" />
          </div>
        </div>

        <h3 style={{ fontSize:18, fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:3, position:'relative', zIndex:1 }}>{user?.displayName || 'Admin'}</h3>
        <span style={{ fontSize:11, fontWeight:700, color:'#a78bfa', marginBottom:22, position:'relative', zIndex:1 }}>
          {dbUser?.role ? dbUser.role.toUpperCase() : 'SYSTEM ADMINISTRATOR'}
        </span>

        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
          {[
            { icon:<Mail size={13} />, value: user?.email || 'admin@skillvoyager.ai' },
            { icon:<Lock size={13} />, value: 'Root Access • Full Permissions' },
            { icon:<Calendar size={13} />, value: `Active since ${joinDate}` },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color:'rgba(148,163,184,0.35)', flexShrink:0 }}>{item.icon}</span>
              <span style={{ fontSize:12, color:'rgba(203,213,225,0.7)', textAlign:'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[{ label:'Access Level', value:'∞' }, { label:'Clearance', value:'ROOT', color:'#818cf8' }].map((s,i) => (
            <div key={i} style={{ padding:'14px 10px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:800, color:s.color||'white', lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div className="mlabel">{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={handleLogout} style={{ width:'100%', padding:'11px 0', borderRadius:11, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)', color:'#f87171', fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', transition:'all 0.2s' }}>
          <LogOut size={13} /> Sign Out Secure Session
        </button>
      </motion.div>

      {/* Permissions + Session */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ShieldCheck size={15} color="#818cf8" />
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:'white' }}>Role & Permissions</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {['Manage All Users','Broadcast Notifications','AI Engine Control','View Full Analytics','Roadmap Management','System Configuration'].map((perm,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 14px', borderRadius:10, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.055)' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span style={{ fontSize:12, color:'rgba(203,213,225,0.75)', fontWeight:500 }}>{perm}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Activity size={15} color="#34d399" />
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:'white' }}>Active Session</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              { label:'Firebase UID', value: user?.uid ? `${user.uid.substring(0,20)}…` : 'Authenticated' },
              { label:'Email Verified', value: user?.emailVerified ? '✓ Verified' : '⚠ Pending' },
              { label:'Auth Provider', value: user?.providerData?.[0]?.providerId || 'password' },
              { label:'System Role', value: dbUser?.role || 'admin' },
              { label:'Session Status', value: 'Active & Secure' },
            ].map((item,i,arr) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom: i<arr.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="mlabel">{item.label}</span>
                <span className="mono" style={{ fontSize:11, color:'rgba(203,213,225,0.75)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'24px 28px' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:16 }}>Quick Actions</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'User Registry', icon:<Users size={14}/>, c:'#6366f1', bg:'rgba(99,102,241,0.08)', bd:'rgba(99,102,241,0.18)' },
              { label:'Broadcast Signal', icon:<Bell size={14}/>, c:'#a855f7', bg:'rgba(168,85,247,0.08)', bd:'rgba(168,85,247,0.18)' },
              { label:'AI Engine Status', icon:<Brain size={14}/>, c:'#06b6d4', bg:'rgba(6,182,212,0.08)', bd:'rgba(6,182,212,0.18)' },
              { label:'System Config', icon:<Settings size={14}/>, c:'#f97316', bg:'rgba(249,115,22,0.08)', bd:'rgba(249,115,22,0.18)' },
            ].map((a,i) => (
              <motion.button key={i} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                style={{ padding:'14px 16px', borderRadius:11, background:a.bg, border:`1px solid ${a.bd}`, display:'flex', alignItems:'center', gap:9, cursor:'pointer', color:a.c }}>
                {a.icon}
                <span style={{ fontSize:12, fontWeight:600, color:'rgba(226,232,240,0.8)' }}>{a.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
