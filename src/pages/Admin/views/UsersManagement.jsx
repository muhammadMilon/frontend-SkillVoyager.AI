import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, PlusCircle, ShieldCheck, Zap, GraduationCap, X, LogOut, CheckCircle2 } from 'lucide-react';
import { fadeUp, stagger } from '../Shared';
import { useAdminService } from '../../../api/adminService';

const roleColors = {
  admin:  { bg:'rgba(99,102,241,0.12)',  bd:'rgba(99,102,241,0.28)',  tx:'#a5b4fc'  },
  member: { bg:'rgba(255,255,255,0.05)', bd:'rgba(255,255,255,0.1)',  tx:'rgba(148,163,184,0.7)' },
  mentor: { bg:'rgba(16,185,129,0.1)',   bd:'rgba(16,185,129,0.22)',  tx:'#34d399'  },
};

const ModalOverlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    onClick={onClose}
    style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', zIndex:8000, display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div onClick={e=>e.stopPropagation()}>{children}</div>
  </motion.div>
);

const inp = { width:'100%', padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontFamily:'Inter,sans-serif', fontSize:13, outline:'none' };

const UsersManagement = () => {
  const { getAllUsers } = useAdminService();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', role:'member', points:0 });
  const [ptsDelta, setPtsDelta] = useState('');
  const [ptsMode, setPtsMode] = useState('add');
  const [toast, setToast] = useState(null);
  const [certForm, setCertForm] = useState({ title: '', issuer: 'SkillVoyager.AI Official' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const rawUsers = await getAllUsers();
      setUsers(rawUsers.map(u => ({
        ...u,
        name: u.displayName || 'Unknown Voyager',
        id: u.uid,
        points: u.points || 0,
        progress: u.progress || { percentage: 0 },
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently',
        avatar: u.photoURL || `https://i.pravatar.cc/100?u=${u.uid?.substr(0,5)}`
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg, color='#34d399') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => { setModal(null); setForm({ name:'', email:'', role:'member', points:0 }); setPtsDelta(''); };

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const nu = { id: Date.now(), ...form, points: Number(form.points)||0, progress: { percentage: 0 }, joined:'just now', avatar:`https://i.pravatar.cc/100?u=${Date.now()}` };
    setUsers(p => [nu, ...p]);
    showToast(`${nu.name} added to registry`);
    closeModal();
  };

  const handleRoleChange = (uid, role) => {
    setUsers(p => p.map(u => u.id===uid ? {...u, role} : u));
    showToast(`Role updated to ${role}`);
    closeModal();
  };

  const handleDelete = (uid) => {
    const u = users.find(x=>x.id===uid);
    setUsers(p => p.filter(x=>x.id!==uid));
    showToast(`${u?.name} removed`, '#f87171');
    closeModal();
  };

  const handlePoints = async (uid) => {
    if (!ptsDelta || isNaN(ptsDelta)) return;
    const amount = Number(ptsDelta);
    setUsers(p => p.map(u => {
      if (u.id === uid) {
        const newPoints = ptsMode === 'add' ? u.points + amount : Math.max(0, u.points - amount);
        return { ...u, points: newPoints };
      }
      return u;
    }));
    showToast(`${ptsMode === 'add' ? 'Added' : 'Subtracted'} ${amount} points`, '#facc15');
    closeModal();
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            style={{ position:'fixed', top:76, left:'50%', transform:'translateX(-50%)', zIndex:9999, padding:'10px 20px', borderRadius:12, background:'rgba(6,9,22,0.97)', border:`1px solid ${toast.color}33`, boxShadow:`0 8px 32px rgba(0,0,0,0.5)`, fontSize:13, fontWeight:600, color:toast.color, fontFamily:'Inter,sans-serif', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:8 }}>
            <CheckCircle2 size={14} color={toast.color} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="acard" style={{ padding:'24px 28px 0', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:22, flexWrap:'wrap' }}>
          <div>
            <div className="sect-title">Voyager Registry</div>
            <div className="sect-sub">{users.length} total records</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(148,163,184,0.3)', width:13, height:13 }} />
              <input value={search} onChange={e=>setSearch(e.target.value)}
                style={{ ...inp, paddingLeft:32, width:200 }} placeholder="Filter voyagers..." />
            </div>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              onClick={()=>{ setForm({name:'',email:'',role:'member',points:0}); setModal('add'); }}
              className="abtn"><PlusCircle size={13}/> Add User</motion.button>
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table className="atbl">
            <thead>
              <tr>
                <th>Voyager</th>
                <th>Role</th>
                <th>Points</th>
                <th>Progress</th>
                <th style={{ textAlign:'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign:'center', padding:'80px 0' }}>
                       <div style={{ width:24, height:24, border:'2px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                       <div className="mlabel">Synchronizing Voyagers...</div>
                    </td>
                  </tr>
                ) : filtered.length===0 ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px 0', color:'rgba(148,163,184,0.3)', fontSize:13 }}>No voyagers found</td></tr>
                ) : (
                  filtered.map((u,i) => {
                  const rc = roleColors[u.role] || roleColors.member;
                  return (
                    <motion.tr key={u.id}
                      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}}
                      transition={{delay:Math.min(i*0.04, 0.4)}}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ position:'relative', flexShrink:0 }}>
                            <img src={u.avatar} style={{ width:36, height:36, borderRadius:11, objectFit:'cover', border:'1px solid rgba(255,255,255,0.09)', display:'block' }} alt=""
                              onError={e=>{ e.target.src=`https://i.pravatar.cc/100?u=${u.id+99}`; }} />
                            {u.role==='admin' && <div style={{ position:'absolute', bottom:-2, right:-2, width:12, height:12, borderRadius:4, background:'#4f46e5', border:'2px solid #040810', display:'flex', alignItems:'center', justifyContent:'center' }}><ShieldCheck size={7} color="white"/></div>}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:'white', lineHeight:1.3 }}>{u.name}</div>
                            <div style={{ fontSize:11, color:'rgba(148,163,184,0.4)', marginTop:1 }}>{u.email}</div>
                            <div className="mlabel" style={{ fontSize:9, marginTop:2 }}>joined {u.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:rc.bg, border:`1px solid ${rc.bd}`, fontSize:10, fontWeight:700, color:rc.tx, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                          {u.role==='admin' && <ShieldCheck size={9}/>}{u.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <Zap size={11} color="#facc15" />
                          <span style={{ fontSize:13, fontWeight:700, color:'white' }}>{u.points?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:90, height:4, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                            <motion.div initial={{width:0}} animate={{width:`${u.progress?.percentage || 0}%`}} transition={{duration:0.8}}
                              style={{ height:'100%', borderRadius:99, background: (u.progress?.percentage||0)>70 ? 'linear-gradient(90deg,#4f46e5,#818cf8)' : (u.progress?.percentage||0)>40 ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'linear-gradient(90deg,#374151,#6b7280)' }} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:600, color:'rgba(148,163,184,0.5)', minWidth:28 }}>{u.progress?.percentage || 0}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6 }}>
                          <button title="Change Role" onClick={()=>{ setModal({type:'role', user:u}); setForm({...form, role:u.role}); }} style={{ width:30, height:30, borderRadius:8, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', color:'#818cf8', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><Users size={12}/></button>
                          <button title="Manage Points" onClick={()=>{ setModal({type:'points', user:u}); setPtsDelta(''); setPtsMode('add'); }} style={{ width:30, height:30, borderRadius:8, background:'rgba(250,204,21,0.08)', border:'1px solid rgba(250,204,21,0.18)', color:'#facc15', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><Zap size={12}/></button>
                          <button title="Delete User" onClick={()=>setModal({type:'delete', user:u})} style={{ width:30, height:30, borderRadius:8, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.16)', color:'#f87171', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><LogOut size={12}/></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                }))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div style={{ height:1 }} />
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* ADD USER */}
        {modal==='add' && (
          <ModalOverlay onClose={closeModal}>
            <motion.div initial={{opacity:0,scale:0.93,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93,y:20}} transition={{duration:0.22,ease:[0.22,1,0.36,1]}} style={{ width:420, background:'rgba(6,9,22,0.99)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)' }} />
              <div style={{ padding:'28px 28px 24px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <PlusCircle size={18} color="#818cf8"/>
                    </div>
                    <div>
                        <div style={{ fontSize:15, fontWeight:700, color:'white' }}>Add New Voyager</div>
                        <div style={{ fontSize:11, color:'rgba(148,163,184,0.4)', marginTop:1 }}>Register a new user to the system</div>
                    </div>
                  </div>
                  <button onClick={closeModal} className="abtn-ghost" style={{ padding: '6px' }}><X size={14}/></button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div><div className="mlabel" style={{ marginBottom:6 }}>Full Name</div><input style={inp} placeholder="e.g. Alex Johnson" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></div>
                  <div><div className="mlabel" style={{ marginBottom:6 }}>Email Address</div><input style={inp} type="email" placeholder="alex@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} /></div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <div className="mlabel" style={{ marginBottom:6 }}>Role</div>
                      <select style={inp} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                        <option value="member">Member</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <div className="mlabel" style={{ marginBottom:6 }}>Starting Points</div>
                      <input style={inp} type="number" min="0" placeholder="0" value={form.points} onChange={e=>setForm(p=>({...p,points:e.target.value}))} />
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:24 }}>
                  <button onClick={closeModal} className="abtn-ghost" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                  <motion.button onClick={handleAdd} className="abtn" style={{ flex:1, justifyContent:'center' }}><PlusCircle size={13}/> Add Voyager</motion.button>
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}

        {/* ROLE CHANGE */}
        {modal?.type==='role' && (
          <ModalOverlay onClose={closeModal}>
            <motion.div initial={{opacity:0,scale:0.93,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93,y:20}} transition={{duration:0.22,ease:[0.22,1,0.36,1]}} style={{ width:380, background:'rgba(6,9,22,0.99)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)' }} />
              <div style={{ padding:'28px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:22 }}>
                  <img src={modal.user.avatar} style={{ width:44,height:44,borderRadius:13,objectFit:'cover',border:'1.5px solid rgba(99,102,241,0.3)' }} alt="" />
                  <div>
                    <div style={{ fontSize:14,fontWeight:700,color:'white' }}>{modal.user.name}</div>
                    <div style={{ fontSize:11,color:'rgba(148,163,184,0.45)',marginTop:2 }}>{modal.user.email}</div>
                  </div>
                  <button onClick={closeModal} className="abtn-ghost" style={{ marginLeft:'auto', padding:'6px' }}><X size={14}/></button>
                </div>
                <div className="mlabel" style={{ marginBottom:12 }}>Select New Role</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['member','mentor','admin'].map(r => {
                    const rc = roleColors[r];
                    const active = modal.user.role===r;
                    return (
                      <button key={r} onClick={()=>handleRoleChange(modal.user.id, r)}
                        style={{ display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:12,border:`1px solid ${active?rc.bd:'rgba(255,255,255,0.07)'}`,background:active?rc.bg:'rgba(255,255,255,0.02)',cursor:'pointer',textAlign:'left' }}>
                        <div style={{ width:34,height:34,borderRadius:10,background:rc.bg,border:`1px solid ${rc.bd}`,display:'flex',alignItems:'center',justifyContent:'center',color:rc.tx,flexShrink:0 }}>
                          {r==='admin'?<ShieldCheck size={14}/>:r==='mentor'?<GraduationCap size={14}/>:<Users size={14}/>}
                        </div>
                        <div>
                          <div style={{ fontSize:13,fontWeight:600,color:'white',textTransform:'capitalize' }}>{r}</div>
                          <div style={{ fontSize:11,color:'rgba(148,163,184,0.4)',marginTop:1 }}>
                            {r==='admin'?'Full system access':r==='mentor'?'Can guide learners':'Standard access'}
                          </div>
                        </div>
                        {active && <CheckCircle2 size={16} color="#34d399" style={{ marginLeft:'auto' }}/>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}

        {/* POINTS */}
        {modal?.type==='points' && (
          <ModalOverlay onClose={closeModal}>
            <motion.div initial={{opacity:0,scale:0.93,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93,y:20}} transition={{duration:0.22,ease:[0.22,1,0.36,1]}} style={{ width:380, background:'rgba(6,9,22,0.99)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(250,204,21,0.5),transparent)' }} />
              <div style={{ padding:'28px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:22 }}>
                  <img src={modal.user.avatar} style={{ width:44,height:44,borderRadius:13,objectFit:'cover',border:'1.5px solid rgba(250,204,21,0.3)' }} alt="" />
                  <div>
                    <div style={{ fontSize:14,fontWeight:700,color:'white' }}>{modal.user.name}</div>
                    <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:3 }}>
                      <Zap size={11} color="#facc15"/>
                      <span style={{ fontSize:12,fontWeight:700,color:'#facc15' }}>{modal.user.points?.toLocaleString() || 0} pts</span>
                    </div>
                  </div>
                  <button onClick={closeModal} className="abtn-ghost" style={{ marginLeft:'auto', padding:'6px' }}><X size={14}/></button>
                </div>

                <div style={{ display:'flex', gap:8, marginBottom:16, padding:'4px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  {['add','subtract'].map(m => (
                    <button key={m} onClick={()=>setPtsMode(m)}
                      style={{ flex:1, padding:'8px', borderRadius:9, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.15s',
                        background: ptsMode===m ? (m==='add'?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.15)') : 'transparent',
                        color: ptsMode===m ? (m==='add'?'#34d399':'#f87171') : 'rgba(148,163,184,0.4)' }}>
                      {m==='add' ? '+ Add Points' : '− Subtract Points'}
                    </button>
                  ))}
                </div>

                <div className="mlabel" style={{ marginBottom:8 }}>Amount</div>
                <input style={{ ...inp, fontSize:20, fontWeight:700, textAlign:'center', color: ptsMode==='add'?'#34d399':'#f87171' }}
                  type="number" min="1" placeholder="100" value={ptsDelta} onChange={e=>setPtsDelta(e.target.value)} />

                <div style={{ display:'flex', gap:8, marginTop:12, marginBottom:20 }}>
                  {[50,100,250,500].map(v => (
                    <button key={v} onClick={()=>setPtsDelta(String(v))}
                      style={{ flex:1, padding:'7px 0', borderRadius:9, border:'1px solid rgba(255,255,255,0.08)', background: ptsDelta===String(v)?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.03)', color: ptsDelta===String(v)?'#a5b4fc':'rgba(148,163,184,0.5)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      {v}
                    </button>
                  ))}
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={closeModal} className="abtn-ghost" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                  <motion.button onClick={()=>handlePoints(modal.user.id)} className="abtn" style={{ flex:1, justifyContent:'center' }}><Zap size={13}/>{ptsMode==='add'?'Add':'Subtract'} Points</motion.button>
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}

        {/* DELETE */}
        {modal?.type==='delete' && (
          <ModalOverlay onClose={closeModal}>
            <motion.div initial={{opacity:0,scale:0.93,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93,y:20}} transition={{duration:0.22,ease:[0.22,1,0.36,1]}} style={{ width:360, background:'rgba(6,9,22,0.99)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:20, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ padding:'32px 28px', textAlign:'center' }}>
                <div style={{ width:56,height:56,borderRadius:16,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',color:'#f87171' }}><LogOut size={22}/></div>
                <div style={{ fontSize:16,fontWeight:700,color:'white',marginBottom:6 }}>Remove Voyager?</div>
                <div style={{ fontSize:14,fontWeight:700,color:'#f87171',marginBottom:24 }}>{modal.user.name}</div>
                <div style={{ display:'flex',gap:10 }}>
                  <button onClick={closeModal} className="abtn-ghost" style={{ flex:1,justifyContent:'center' }}>Cancel</button>
                  <button onClick={()=>handleDelete(modal.user.id)} className="abtn" style={{ flex:1,justifyContent:'center', background:'linear-gradient(135deg, #ef4444, #b91c1c)' }}><LogOut size={13}/> Remove</button>
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersManagement;
