import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Trash2, Search, 
  Hexagon, History,
  Video, Lightbulb, Zap,
  ArrowUpRight, Clock, Target, Layers,
  Shield, Activity, Cpu, Sparkles
} from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const BookmarksPage = () => {
  const { user, dbUser } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState({ tips: [], resources: [] });
  const [tipsData, setTipsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const themeTeal = '#14b8a6';

  useEffect(() => {
    if (user?.uid) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const [bookmarksRes, tipsRes, resourcesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/user/bookmarks/${user.uid}`),
        axios.get(`${API_BASE}/api/tips`),
        axios.get(`${API_BASE}/api/resources`)
      ]);

      if (bookmarksRes.data.success) {
        setBookmarks(bookmarksRes.data.data);
      }
      if (tipsRes.data.success) {
        setTipsData(tipsRes.data.data);
      }
      if (resourcesRes.data.success) {
        setResourcesData(resourcesRes.data.data);
      }
    } catch (err) {
      console.error("Vault mapping failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (type, itemId) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/user/bookmarks/${user.uid}`, {
        data: { type, itemId }
      });
      if (res.data.success) {
        setBookmarks(res.data.data);
        toast.info("Intelligence unit decommissioned from vault.");
      }
    } catch (err) {
      toast.error("Protocol failed.");
    }
  };

  const filteredItems = () => {
    let combined = [];
    if (activeTab === 'All' || activeTab === 'Resources') {
       const resItems = bookmarks.resources
          .map(id => resourcesData.find(r => String(r.id) === String(id)))
          .filter(Boolean)
          .map(detail => ({ id: detail.id, type: 'resource', detail }));
       combined = [...combined, ...resItems];
    }
    if (activeTab === 'All' || activeTab === 'Tips') {
       const tipItems = bookmarks.tips
          .map(id => tipsData.find(t => String(t.id) === String(id)))
          .filter(Boolean)
          .map(detail => ({ id: detail.id, type: 'tip', detail }));
       combined = [...combined, ...tipItems];
    }
    
    if (searchQuery) {
       return combined.filter(item => {
          const title = item.detail.title || '';
          const content = item.detail.content || item.detail.description || '';
          return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 content.toLowerCase().includes(searchQuery.toLowerCase());
       });
    }
    return combined;
  };

  return (
    <div className="min-h-screen bg-[#040d18] text-white pt-[160px] pb-20 overflow-hidden font-sans selection:bg-[#14b8a6]/30">
      
      {/* Neural Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#14b8a60a] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#14b8a605] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* COMMAND HEADER */}
        <div className="text-center mb-20">
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white/[0.03] border border-[#14b8a622] mb-8"
           >
             <Shield className="w-4 h-4 text-[#14b8a6]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#14b8a6]">Personal Collection</span>
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-6xl md:text-8xl font-black tracking-tighter mb-8 tracking-[0.02em] leading-tight"
           >
             Saved <span className="text-[#14b8a6]">Bookmarks</span>
           </motion.h1>
           
           <motion.p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
             Your personalized learning library. Securely store and organize your favorite resources, tips, and tutorials for instant access.
           </motion.p>
        </div>

        {/* HUD INPUT AREA */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
           <div className="md:col-span-3">
              <div className="relative group">
                 <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#14b8a6] transition-colors">
                    <Search size={20} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search your saved bookmarks..."
                   className="w-full bg-[#0a1624]/60 border border-white/5 focus:border-[#14b8a6]/40 rounded-[28px] py-6 pl-16 pr-8 outline-none transition-all text-sm font-bold tracking-tight shadow-2xl"
                   style={{
                     boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                   }}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-600 tracking-tighter uppercase">Library V1</div>
                 </div>
              </div>
           </div>
           
           <div className="hidden md:flex flex-col justify-center bg-white/[0.02] p-8 rounded-[32px] border border-white/5 teal-glow">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Library Stats</span>
                 <Activity size={12} className="text-[#14b8a6] animate-pulse" />
              </div>
              <div className="flex items-end gap-2 mb-3">
                 <span className="text-2xl font-black">{filteredItems().length}</span>
                 <span className="text-[10px] font-black text-slate-600 uppercase mb-1">Items Saved</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${(filteredItems().length / 50) * 100}%` }}
                   className="h-full bg-[#14b8a6] shadow-[0_0_10px_#14b8a6]" 
                 />
              </div>
           </div>
        </div>

        {/* TABS & ADD ACTION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16 relative z-10">
            <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-1.5 flex items-center gap-1 backdrop-blur-xl">
              {['All', 'Resources', 'Tips'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab 
                    ? 'bg-[#14b8a6] text-black shadow-lg shadow-[#14b8a6]/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <Link 
              to="/tips-resources"
              className="flex items-center gap-2 px-8 py-3.5 rounded-[20px] bg-gradient-to-r from-[#14b8a6]/10 to-[#14b8a6]/20 border border-[#14b8a6]/30 text-[#14b8a6] hover:text-[#14b8a6] hover:bg-[#14b8a6]/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all font-black text-[10px] uppercase tracking-[0.2em]"
           >
              <Bookmark size={14} className="fill-[#14b8a6]/50" />
              Bookmarks Saved Details
           </Link>
        </div>

        {/* GRID DISPLAY */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-40 gap-4">
             <div className="w-12 h-12 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Fetching Collection...</span>
          </div>
        ) : filteredItems().length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-white/[0.01] border border-dashed border-white/5 rounded-[60px]"
          >
             <div className="w-24 h-24 bg-[#14b8a611] rounded-[32px] border border-[#14b8a622] flex items-center justify-center mx-auto mb-8 text-[#14b8a6]">
                <Layers size={48} />
             </div>
             <h2 className="text-3xl font-black text-slate-600 mb-2 uppercase tracking-tighter">No Bookmarks Found</h2>
             <p className="text-slate-700 text-sm font-bold uppercase tracking-widest mb-10">Explore courses and tips to add to your collection.</p>
             <Link to="/tips-resources">
                <button className="px-12 py-5 bg-[#14b8a6] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-[#14b8a6]/20 flex items-center gap-3 mx-auto">
                   Explore Resources <ArrowUpRight size={18} />
                </button>
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence mode='popLayout'>
                {filteredItems().map((item, idx) => (
                  <VaultCard 
                    key={`${item.type}-${item.id}`} 
                    item={item} 
                    idx={idx} 
                    onRemove={() => removeBookmark(item.type, item.id)} 
                  />
                ))}
             </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

/* ── COMPONENT: VAULT CARD HUD ── */
const VaultCard = ({ item, idx, onRemove }) => {
  const { detail, type } = item;
  const isResource = type === 'resource';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: idx * 0.05 }}
      className="group bg-[#0a1624]/40 border border-white/5 rounded-[40px] p-10 hover:border-[#14b8a633] transition-all duration-500 overflow-hidden relative backdrop-blur-sm flex flex-col h-full"
    >
       <div className="absolute top-0 right-0 w-40 h-40 bg-[#14b8a6]/[0.01] blur-[80px] pointer-events-none group-hover:bg-[#14b8a6]/[0.04] transition-all" />
       
       <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-[#14b8a611] border border-[#14b8a622] flex items-center justify-center text-[#14b8a6] group-hover:scale-110 transition-transform duration-500 text-2xl">
             {detail.icon || (isResource ? <Video size={32} /> : <Zap size={32} />)}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20 z-10"
            title="Remove Bookmark"
          >
             <Trash2 size={20} />
          </button>
       </div>

       <div className="flex-1 mb-10">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-[10px] font-black text-[#14b8a6] uppercase tracking-[0.3em]">{detail.category || type}</span>
             <div className="w-1 h-1 rounded-full bg-slate-800" />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                ITEM-ID: {String(detail.id || 'Unknown').padStart(4, '0')}
             </span>
          </div>
          <h3 className="text-3xl font-black text-white group-hover:text-[#14b8a6] transition-colors leading-[1.1] tracking-tighter mb-4 line-clamp-2">
             {detail.title}
          </h3>
          <p className="text-sm text-slate-400 font-medium leading-[1.6] line-clamp-3">
             {detail.content || detail.description}
          </p>
          
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-6 flex items-center gap-2">
             <Clock size={12} /> Saved in Library
          </p>
       </div>

       <a 
          href={detail.url || `https://www.google.com/search?q=${encodeURIComponent(detail.title)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-between px-8 py-5 rounded-[24px] bg-white/[0.03] border border-white/5 group-hover:bg-[#14b8a6] group-hover:text-black transition-all font-black text-[11px] uppercase tracking-[0.25em] shadow-lg mt-auto relative z-10 w-full"
       >
          {isResource ? 'Go to Resource' : 'Explore Concept Online'} <ArrowUpRight size={18} />
       </a>
    </motion.div>
  );
};

export default BookmarksPage;
