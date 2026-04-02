import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Bell, Calendar, ChevronRight, 
  ExternalLink, Filter, Search, Newspaper, 
  Sparkles, Globe, Clock, Bookmark, Share2,
  AlertTriangle, Info, Plus, X, Upload, Trash2,
  Tv, Zap,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const T = {
  teal: '#17B6A8',
  tealMid: 'rgba(23,182,168,0.15)',
  border: 'rgba(23,182,168,0.1)',
  bg: '#040d18',
  card: 'rgba(13, 25, 39, 0.7)',
  gold: '#F5C842',
};

const NewsPage = () => {
  const { user, dbUser } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Admin Check
  const isAdmin = dbUser?.role === 'admin' || user?.email === 'admin@skillvoyager.ai';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'medium',
    thumbnail: '',
    actionLink: '',
    actionText: 'Learn More'
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/announcements`);
      if (res.data.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error("News fetch error:", err);
      toast.error("Systems encountered error retrieving datacore.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostNews = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/announcements`, formData);
      if (res.data.success) {
        toast.success("Broadcast Transmitted Successfully!");
        setShowModal(false);
        fetchNews();
        setFormData({ title: '', content: '', category: 'General', priority: 'medium', thumbnail: '', actionLink: '', actionText: 'Learn More' });
      }
    } catch (err) {
      toast.error("Transmission failed.");
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Abort this transmission?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/announcements/${id}`);
      if (res.data.success) {
        toast.info("Broadcast Terminated");
        fetchNews();
      }
    } catch (err) {
      toast.error("Process Aborted");
    }
  };

  const categories = ['All', 'General', 'Update', 'Event', 'Urgent'];
  
  const filtered = announcements.filter(a => {
    const matchesTab = activeTab === 'All' || a.category === activeTab;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: T.bg, 
      color: 'white',
      paddingTop: '160px',
      paddingBottom: '80px',
      fontFamily: 'Inter, sans-serif'
    }}>  

      <style>{`
        .news-card { backdrop-filter: blur(24px); background: ${T.card}; border: 1px solid ${T.border}; border-radius: 32px; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .news-card:hover { transform: translateY(-8px); border-color: ${T.teal}44; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6); }
        .neon-tab { padding: 12px 28px; border-radius: 16px; cursor: pointer; transition: all 0.4s; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); }
        .neon-tab.active { background: ${T.teal}; color: black; border-color: ${T.teal}; box-shadow: 0 0 20px ${T.teal}33; }
        .priority-dot { width: 8px; height: 8px; border-radius: 50%; }
        .search-container { position: relative; width: 100%; max-width: 400px; }
        .search-input { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid ${T.border}; border-radius: 18px; padding: 14px 20px 14px 50px; color: white; outline: none; transition: all 0.3s; }
        .search-input:focus { border-color: ${T.teal}88; background: rgba(255,255,255,0.05); }
        .admin-btn { background: ${T.tealMid}; color: ${T.teal}; border: 1px solid ${T.teal}33; padding: 12px 24px; border-radius: 16px; font-weight: 800; font-size: 12px; display: flex; alignItems: center; gap: 10px; cursor: pointer; transition: all 0.3s; }
        .admin-btn:hover { background: ${T.teal}; color: black; }
        .featured-badge { background: ${T.gold}; color: black; padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 900; text-transform: uppercase; }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        
        {/* HEADER & SEARCH */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 80 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(23,182,168,0.05)', padding: '10px 24px', borderRadius: 99, color: T.teal, marginBottom: 24, border: `1px solid ${T.border}` }}>
              <Zap size={14} fill={T.teal} />
              <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>Voyager Broadcast Center</span>
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 950, marginBottom: 20, letterSpacing: '-3px', lineHeight: 1 }}>Neural <span style={{ color: T.teal }}>Updates</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, maxWidth: 700, margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>Real-time synchronization for the SkillVoyager ecosystem. Access critical transmissions and platform evolution nodes.</p>
          </motion.div>

          <div style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', width: '100%' }}>
            <div className="search-container">
               <Search size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
               <input type="text" placeholder="Query transmission log..." className="search-input" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
            </div>
            {isAdmin && (
              <button className="admin-btn" onClick={() => setShowModal(true)}>
                <Plus size={18} /> INITIALIZE BROADCAST
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 60, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <div key={cat} className={`neon-tab ${activeTab === cat ? 'active' : ''}`} onClick={() => setActiveTab(cat)}>
              {cat}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '120px 0', opacity: 0.3 }}>
             <RefreshCw size={40} className="animate-spin" style={{ color: T.teal, marginBottom: 20 }} />
             <p style={{ fontWeight: 900, letterSpacing: '5px', textTransform: 'uppercase', fontSize: 10 }}>Accessing Core Datacenter...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '120px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 40, background: 'rgba(255,255,255,0.01)' }}>
            <Newspaper size={64} style={{ opacity: 0.1, marginBottom: 24 }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '4px' }}>No Signals Detected</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 40 }}>
            {filtered.map((news, i) => (
              <motion.div 
                key={news._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="news-card"
                style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                {/* Image Handle */}
                {news.thumbnail ? (
                   <div style={{ width: 'calc(100% + 80px)', margin: '-40px -40px 0 -40px', height: '220px', overflow: 'hidden' }}>
                     <img src={news.thumbnail} alt="News" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                ) : (
                   <div style={{ width: 'calc(100% + 80px)', margin: '-40px -40px 0 -40px', height: '10px', background: T.tealMid }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="priority-dot" style={{ background: news.priority === 'high' ? '#ef4444' : news.priority === 'medium' ? T.gold : T.teal, boxShadow: `0 0 10px ${news.priority === 'high' ? '#ef4444' : news.priority === 'medium' ? T.gold : T.teal}55` }} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: T.teal, textTransform: 'uppercase', letterSpacing: '2px' }}>{news.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}>
                    <Clock size={12} />
                    {new Date(news.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.5px' }}>{news.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{news.content}</p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 30, borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {news.actionLink ? (
                    <a href={news.actionLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: T.teal, fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {news.actionText} <ArrowUpRight size={16} />
                    </a>
                   ) : (
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>SkillVoyager Protocol</span>
                   )}
                  
                  <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    {isAdmin && (
                      <button onClick={()=>deleteNews(news._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.4 }} className="hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                    )}
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Bookmark size={18} /></button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}><Share2 size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL - ADMIN BROADCAST */}
      <AnimatePresence>
        {showModal && (
           <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className="w-full max-w-2xl bg-[#0a1118] border border-[#14b8a633] rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 relative shadow-3xl my-auto"
              >
                 <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                 
                 <div className="flex items-center gap-4 mb-8 sm:mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#17B6A811] flex items-center justify-center border border-[#17B6A833]">
                       <Tv size={24} color={T.teal} />
                    </div>
                    <div>
                       <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Initialize Broadcast</h2>
                       <p className="text-[#17B6A8] text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Global Transmission Protocol</p>
                    </div>
                 </div>
 
                 <form onSubmit={handlePostNews} className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Broadcast Identifier (Title)</label>
                       <input required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all" placeholder="Enter title..." />
                    </div>
 
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Transmission Content</label>
                       <textarea required value={formData.content} onChange={e=>setFormData({...formData, content:e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all min-h-[120px] resize-none" placeholder="Enter transmission details..." />
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Category</label>
                          <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all cursor-pointer">
                            {categories.filter(c=>c!=='All').map(c => <option key={c} value={c} className="bg-[#0a1118]">{c}</option>)}
                          </select>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Priority Level</label>
                          <select value={formData.priority} onChange={e=>setFormData({...formData, priority:e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all cursor-pointer">
                             <option value="low" className="bg-[#0a1118]">Low (Teal)</option>
                             <option value="medium" className="bg-[#0a1118]">Medium (Gold)</option>
                             <option value="high" className="bg-[#0a1118]">High (Red)</option>
                          </select>
                       </div>
                    </div>
 
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Image URL (Optional)</label>
                       <input value={formData.thumbnail} onChange={e=>setFormData({...formData, thumbnail:e.target.value})} placeholder="https://image-link.com" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all" />
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Action URL</label>
                          <input value={formData.actionLink} onChange={e=>setFormData({...formData, actionLink:e.target.value})} placeholder="https://action.url" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all" />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Action Label</label>
                          <input value={formData.actionText} onChange={e=>setFormData({...formData, actionText:e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#17B6A8]/50 transition-all" />
                       </div>
                    </div>
 
                    <button type="submit" className="w-full bg-[#17B6A8] text-black font-black uppercase tracking-widest py-5 rounded-2xl text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all mt-4">
                       Transmit Broadcast
                    </button>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;
