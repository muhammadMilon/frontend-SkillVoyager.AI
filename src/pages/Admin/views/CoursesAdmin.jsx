import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, PlusCircle, Edit, Trash2, X, CheckCircle2, Filter, ToggleLeft, ToggleRight, ExternalLink, Play, Image } from 'lucide-react';
import { fadeUp, stagger } from '../Shared';
import { AuthContext } from '../../../providers/AuthProvider';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';
const inp = { width:'100%', padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontFamily:'Inter,sans-serif', fontSize:13, outline:'none', transition:'border-color 0.2s' };
const inpFocus = { borderColor:'rgba(99,102,241,0.5)' };
const label = { fontSize:11, fontWeight:700, color:'rgba(148,163,184,0.6)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, display:'block' };

const CATEGORIES = [
  'AI/ML', 'AI', 'Frontend', 'Backend', 'Programming', 'Design',
  'Data', 'DevOps', 'Architecture', 'Database', 'Security',
  'DevTools', 'Development', 'Web Development', 'Automation',
  'Marketing', 'E-commerce', 'Other'
];

const CoursesAdmin = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', videoId: '', videoUrl: '',
    thumbnail: '', category: 'Development', price: 0,
    isFree: false, level: 'Beginner', duration: '',
  });
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : (data.courses || []));
    } catch (e) {
      console.error('Failed to fetch courses:', e);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, color='#34d399') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = ['all', ...new Set(courses.map(c => c.category || 'Uncategorized'))];

  const filtered = courses.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || c.category === category;
    return matchesSearch && matchesCat;
  });

  const resetForm = () => setForm({
    title: '', description: '', videoId: '', videoUrl: '',
    thumbnail: '', category: 'Development', price: 0,
    isFree: false, level: 'Beginner', duration: '',
  });

  const closeModal = () => { setModal(null); resetForm(); };

  // Auto-generate thumbnail preview
  const autoThumbnail = form.thumbnail || (form.videoId ? `https://img.youtube.com/vi/${form.videoId}/0.jpg` : null);

  const handleAddCourse = async () => {
    if (!form.title.trim()) { showToast('Title is required', '#f87171'); return; }
    if (!form.category) { showToast('Category is required', '#f87171'); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        videoId: form.videoId.trim() || null,
        videoUrl: form.videoUrl.trim() || null,
        thumbnail: form.thumbnail.trim() || null,
        category: form.category,
        price: form.isFree ? 0 : (Number(form.price) || 0),
        level: form.level,
        duration: form.duration.trim() || null,
        createdBy: user?.uid || null,
      };

      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setCourses(prev => [data.course, ...prev]);
        showToast(`"${data.course.title}" created successfully!`);
        closeModal();
      } else {
        showToast(data.message || 'Failed to create course', '#f87171');
      }
    } catch (err) {
      console.error('Add course error:', err);
      showToast('Server error — please try again', '#f87171');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    const course = courses.find(c => c._id === id);
    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses(prev => prev.filter(c => c._id !== id));
        showToast(`"${course?.title}" deleted`, '#f87171');
      } else {
        showToast(data.message || 'Failed to delete', '#f87171');
      }
    } catch (err) {
      showToast('Server error', '#f87171');
    }
    setModal(null);
  };

  const isFreePrice = (price) => !price || price === 0;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            style={{ position:'fixed', top:76, left:'50%', transform:'translateX(-50%)', zIndex:9999, padding:'10px 20px', borderRadius:12, background:'rgba(6,9,22,0.97)', border:`1px solid ${toast.color}33`, fontSize:13, fontWeight:600, color:toast.color, fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:8, backdropFilter:'blur(20px)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
            <CheckCircle2 size={14} color={toast.color} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'24px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div className="sect-title">Course Management</div>
            <div className="sect-sub">{courses.length} total courses • {filtered.length} shown</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(148,163,184,0.3)', width:13, height:13 }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, paddingLeft:32, width:200 }} placeholder="Search courses..." />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Filter size={12} color="rgba(148,163,184,0.4)" />
              <select value={category} onChange={e=>setCategory(e.target.value)} style={{ ...inp, width:140 }}>
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
              </select>
            </div>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setModal('add')} className="abtn" style={{ gap:6 }}>
              <PlusCircle size={13}/> Add Course
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:28, height:28, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
            <div className="mlabel">Loading courses...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="acard" style={{ padding:'60px 40px', textAlign:'center' }}>
          <BookOpen size={40} color="rgba(148,163,184,0.2)" style={{ margin:'0 auto 16px' }} />
          <div style={{ fontSize:16, fontWeight:700, color:'white', marginBottom:6 }}>No Courses Found</div>
          <div style={{ fontSize:13, color:'rgba(148,163,184,0.5)', marginBottom:20 }}>Try adjusting your search or add a new course.</div>
          <motion.button whileHover={{scale:1.02}} onClick={()=>setModal('add')} className="abtn" style={{ margin:'0 auto' }}>
            <PlusCircle size={13}/> Add Your First Course
          </motion.button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {filtered.map((course, i) => (
            <motion.div key={course._id || i} variants={fadeUp} className="acard hlift" style={{ overflow:'hidden' }}>
              <div style={{ height:140, background:`linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} />
                ) : course.videoId ? (
                  <img src={`https://img.youtube.com/vi/${course.videoId}/0.jpg`} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} />
                ) : (
                  <BookOpen size={40} color="rgba(255,255,255,0.15)" />
                )}
                <div style={{ position:'absolute', top:10, right:10, display:'flex', gap:6 }}>
                  <span style={{ padding:'3px 10px', borderRadius:99, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', fontSize:10, fontWeight:700, color:'#818cf8' }}>
                    {course.category || 'General'}
                  </span>
                </div>
                <div style={{ position:'absolute', top:10, left:10 }}>
                  <span style={{ padding:'3px 8px', borderRadius:99, background: isFreePrice(course.price) ? 'rgba(52,211,153,0.2)' : 'rgba(245,200,66,0.2)', backdropFilter:'blur(8px)', fontSize:10, fontWeight:700, color: isFreePrice(course.price) ? '#34d399' : '#f5c842', border: `1px solid ${isFreePrice(course.price) ? 'rgba(52,211,153,0.3)' : 'rgba(245,200,66,0.3)'}` }}>
                    {isFreePrice(course.price) ? '✦ FREE' : `৳${course.price}`}
                  </span>
                </div>
                {course.videoId && (
                  <a href={`https://www.youtube.com/watch?v=${course.videoId}`} target="_blank" rel="noopener noreferrer"
                    style={{ position:'absolute', bottom:10, right:10, width:32, height:32, borderRadius:10, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', cursor:'pointer', transition:'all 0.2s' }}
                    onClick={e=>e.stopPropagation()}>
                    <Play size={12} />
                  </a>
                )}
              </div>
              <div style={{ padding:'18px 20px' }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:6, lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{course.title}</h4>
                <p style={{ fontSize:12, color:'rgba(148,163,184,0.5)', marginBottom:12, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {course.description || 'No description available.'}
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {course.level && <span style={{ fontSize:10, fontWeight:600, color:'rgba(148,163,184,0.4)', background:'rgba(255,255,255,0.04)', padding:'2px 8px', borderRadius:6 }}>{course.level}</span>}
                    {course.duration && <span style={{ fontSize:10, fontWeight:600, color:'rgba(148,163,184,0.4)', background:'rgba(255,255,255,0.04)', padding:'2px 8px', borderRadius:6 }}>{course.duration}</span>}
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>setModal({type:'delete', course})} style={{ width:28, height:28, borderRadius:7, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.16)', color:'#f87171', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.15)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(239,68,68,0.07)';}}>
                      <Trash2 size={11}/>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══ ADD COURSE MODAL ═══ */}
      <AnimatePresence>
        {modal === 'add' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={closeModal}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.70)', backdropFilter:'blur(8px)', zIndex:8000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
            <motion.div onClick={e=>e.stopPropagation()} initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:20}}
              style={{ width:560, maxHeight:'90vh', overflowY:'auto', background:'linear-gradient(160deg, rgba(6,9,22,0.99), rgba(10,13,30,0.99))', border:'1px solid rgba(255,255,255,0.09)', borderRadius:22, boxShadow:'0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.08)' }}>
              <div style={{ height:2, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.6),#818cf8,rgba(99,102,241,0.6),transparent)' }} />
              <div style={{ padding:'28px 30px' }}>
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg, #4f46e5, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(79,70,229,0.4)' }}>
                      <PlusCircle size={17} color="white" />
                    </div>
                    <div>
                      <div style={{ fontSize:17, fontWeight:800, color:'white', letterSpacing:'-0.02em' }}>Add New Course</div>
                      <div style={{ fontSize:11, color:'rgba(148,163,184,0.4)', fontWeight:500 }}>Fill in the details below</div>
                    </div>
                  </div>
                  <button onClick={closeModal} style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(148,163,184,0.5)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='white';e.currentTarget.style.background='rgba(255,255,255,0.1)';}}
                    onMouseLeave={e=>{e.currentTarget.style.color='rgba(148,163,184,0.5)';e.currentTarget.style.background='rgba(255,255,255,0.05)';}}>
                    <X size={14}/>
                  </button>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {/* Title */}
                  <div>
                    <label style={label}>Course Title *</label>
                    <input style={inp} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. React JS Full Course" onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={label}>Description</label>
                    <textarea style={{ ...inp, resize:'none' }} rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Brief description of the course..." onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>

                  {/* Video ID & URL */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={label}>Video ID (YouTube)</label>
                      <input style={inp} value={form.videoId} onChange={e=>setForm(p=>({...p,videoId:e.target.value}))} placeholder="e.g. dQw4w9WgXcQ" onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                    </div>
                    <div>
                      <label style={label}>Video URL</label>
                      <input style={inp} value={form.videoUrl} onChange={e=>setForm(p=>({...p,videoUrl:e.target.value}))} placeholder="https://youtube.com/watch?v=..." onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label style={label}>Thumbnail URL {form.videoId && !form.thumbnail && <span style={{ color:'#818cf8', fontWeight:500, textTransform:'none' }}>(auto-generated from Video ID)</span>}</label>
                    <input style={inp} value={form.thumbnail} onChange={e=>setForm(p=>({...p,thumbnail:e.target.value}))} placeholder="Custom thumbnail URL (optional)" onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                    {autoThumbnail && (
                      <div style={{ marginTop:10, borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', position:'relative', aspectRatio:'16/9', maxWidth:240 }}>
                        <img src={autoThumbnail} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.parentElement.style.display='none';}} />
                        <div style={{ position:'absolute', bottom:6, right:6, display:'flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:6, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>
                          <Image size={9}/> Preview
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category & Level */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={label}>Category *</label>
                      <select style={inp} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={label}>Level</label>
                      <select style={inp} value={form.level} onChange={e=>setForm(p=>({...p,level:e.target.value}))}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Free/Paid Toggle + Price */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={label}>Pricing</label>
                      <button onClick={()=>setForm(p=>({...p,isFree:!p.isFree, price: !p.isFree ? 0 : p.price}))}
                        style={{ ...inp, display:'flex', alignItems:'center', gap:10, cursor:'pointer', background: form.isFree ? 'rgba(52,211,153,0.08)' : 'rgba(245,200,66,0.06)', border: `1px solid ${form.isFree ? 'rgba(52,211,153,0.25)' : 'rgba(245,200,66,0.2)'}`, transition:'all 0.2s' }}>
                        {form.isFree
                          ? <ToggleRight size={20} color="#34d399" />
                          : <ToggleLeft size={20} color="#f5c842" />
                        }
                        <span style={{ fontSize:13, fontWeight:700, color: form.isFree ? '#34d399' : '#f5c842' }}>
                          {form.isFree ? '✦ Free Course' : '★ Paid Course'}
                        </span>
                      </button>
                    </div>
                    <div>
                      <label style={label}>Price (৳)</label>
                      <input
                        style={{ ...inp, opacity: form.isFree ? 0.4 : 1, cursor: form.isFree ? 'not-allowed' : 'text' }}
                        type="number" min="0"
                        value={form.isFree ? 0 : form.price}
                        onChange={e=>setForm(p=>({...p,price:e.target.value}))}
                        disabled={form.isFree}
                        placeholder="e.g. 999"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={label}>Duration</label>
                    <input style={inp} value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} placeholder="e.g. 12h 30m" onFocus={e=>Object.assign(e.target.style,inpFocus)} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:10, marginTop:28 }}>
                  <button onClick={closeModal} className="abtn-ghost" style={{ flex:1, justifyContent:'center', padding:'12px 16px' }}>Cancel</button>
                  <motion.button
                    whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                    onClick={handleAddCourse}
                    disabled={submitting}
                    className="abtn"
                    style={{ flex:1, justifyContent:'center', padding:'12px 16px', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? (
                      <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }}/> Creating...</>
                    ) : (
                      <><PlusCircle size={13}/> Create Course</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
        {modal?.type === 'delete' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={closeModal}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', zIndex:8000, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <motion.div onClick={e=>e.stopPropagation()} initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:20}}
              style={{ width:380, background:'rgba(6,9,22,0.99)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:20, boxShadow:'0 30px 80px rgba(0,0,0,0.7)', padding:'32px 28px', textAlign:'center' }}>
              <div style={{ width:56,height:56,borderRadius:16,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',color:'#f87171' }}><Trash2 size={22}/></div>
              <div style={{ fontSize:16,fontWeight:700,color:'white',marginBottom:6 }}>Delete Course?</div>
              <div style={{ fontSize:14,fontWeight:700,color:'#f87171',marginBottom:8 }}>{modal.course.title}</div>
              <div style={{ fontSize:12,color:'rgba(148,163,184,0.4)',marginBottom:24 }}>This action cannot be undone.</div>
              <div style={{ display:'flex',gap:10 }}>
                <button onClick={closeModal} className="abtn-ghost" style={{ flex:1,justifyContent:'center' }}>Cancel</button>
                <button onClick={()=>handleDeleteCourse(modal.course._id)} className="abtn" style={{ flex:1,justifyContent:'center', background:'linear-gradient(135deg, #ef4444, #b91c1c)' }}><Trash2 size={13}/> Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoursesAdmin;
