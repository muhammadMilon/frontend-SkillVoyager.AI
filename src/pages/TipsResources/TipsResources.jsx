import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  Lightbulb, BookOpen, Sparkles, ExternalLink, 
  Search, Filter, Clock, ChevronRight, Zap,
  Target, Rocket, Command, Bookmark
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import BookmarkButton from './BookmarkButton';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const TipsResources = () => {
  const { user } = useContext(AuthContext);
  const [tips, setTips] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookmarks, setBookmarks] = useState({ tips: [], resources: [] });
  const [activeTab, setActiveTab] = useState('tips');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.uid || 'demo-user';

        const [tipsRes, resourcesRes, bookmarksRes] = await Promise.all([
          fetch(`${API_BASE}/api/tips`),
          fetch(`${API_BASE}/api/resources`),
          fetch(`${API_BASE}/api/user/bookmarks/${userId}`)
        ]);

        const tipsData = await tipsRes.json();
        const resourcesData = await resourcesRes.json();
        const bookmarksData = await bookmarksRes.json();

        setTips(tipsData.data || []);
        setResources(resourcesData.data || []);
        setBookmarks(bookmarksData.data || { tips: [], resources: [] });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleBookmark = async (type, itemId) => {
    const userId = user?.uid || 'demo-user';
    const cleanId = String(itemId);
    
    const isBookmarked = type === 'tip'
      ? bookmarks.tips.some(id => String(id) === cleanId)
      : bookmarks.resources.some(id => String(id) === cleanId);

    try {
      if (isBookmarked) {
        await fetch(`${API_BASE}/api/user/bookmarks/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId })
        });
      } else {
        await fetch(`${API_BASE}/api/user/bookmarks/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, itemId })
        });
      }

      setBookmarks(prev => {
        const key = type === 'tip' ? 'tips' : 'resources';
        const currentList = prev[key] || [];
        return {
          ...prev,
          [key]: isBookmarked
            ? currentList.filter(id => String(id) !== cleanId)
            : [...currentList, itemId]
        };
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#040d18]">
        <div className="w-16 h-16 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#14b8a6] font-black text-[10px] uppercase tracking-[0.3em]">Syncing Neural Archives...</p>
      </div>
    );
  }

  const categories = activeTab === 'tips'
    ? [...new Set(tips.map(t => t.category))]
    : [...new Set(resources.map(r => r.type))];

  return (
    <div className="w-full min-h-screen bg-[#040d18] text-white selection:bg-[#14b8a6]/30 font-sans">
      <Navbar />

      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Ambient Neural Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,#14b8a611,transparent_70%)] opacity-50" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14b8a608] blur-[120px]" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#14b8a605] blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* HUD Styled Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-[#14b8a622] mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#14b8a6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14b8a6]">
                Learning Hub
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              Tips & <span className="text-[#14b8a6]">Resources</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Your central repository for high-performance study strategies, career advice, and verified learning resources to accelerate your growth.
            </p>
          </motion.div>

          {/* Search & Control HUD */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 bg-white/[0.02] border border-white/5 p-6 rounded-[32px] backdrop-blur-xl">
             <div className="flex items-center gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
                {[
                  { id: 'tips', label: 'Study Tips', icon: <Lightbulb size={14}/> },
                  { id: 'resources', label: 'Web Resources', icon: <BookOpen size={14}/> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id
                        ? 'bg-[#14b8a6] text-black shadow-lg shadow-[#14b8a6]/20'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
             </div>

             <div className="relative w-full md:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#14b8a6] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tips and resources..."
                  className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:outline-none focus:border-[#14b8a6]/40 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          {/* MASONRY FEED */}
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="space-y-16"
             >
               {categories.map((category, catIndex) => {
                 const items = activeTab === 'tips' 
                    ? tips.filter(t => t.category === category && (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || category.toLowerCase().includes(searchQuery.toLowerCase())))
                    : resources.filter(r => r.type === category && (r.title.toLowerCase().includes(searchQuery.toLowerCase()) || category.toLowerCase().includes(searchQuery.toLowerCase())));
                 
                 if (items.length === 0) return null;

                 return (
                  <div key={category}>
                    <div className="flex items-center gap-4 mb-10">
                       <h2 className="text-2xl font-black tracking-tight text-white uppercase">{category}</h2>
                       <div className="h-[2px] flex-1 bg-gradient-to-r from-[#14b8a622] to-transparent" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{items.length} Units</span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {items.map((item, index) => {
                         const itemId = item._id || item.id || index;
                         const isBookmarked = activeTab === 'tips'
                           ? bookmarks.tips.some(id => String(id) === String(itemId))
                           : bookmarks.resources.some(id => String(id) === String(itemId));

                         return (
                           <div key={itemId}>
                              {activeTab === 'tips' ? (
                                  <TipCard 
                                    tip={item} 
                                    index={index} 
                                    isBookmarked={isBookmarked}
                                    onBookmark={() => handleBookmark('tip', itemId)}
                                  />
                              ) : (
                                  <ResourceCard 
                                    resource={item} 
                                    index={index} 
                                    isBookmarked={isBookmarked}
                                    onBookmark={() => handleBookmark('resource', itemId)}
                                  />
                              )}
                           </div>
                         );
                       })}
                    </div>
                  </div>
                 );
               })}
             </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

/* ── COMPONENT: TIP CARD ── */
const TipCard = ({ tip, index, isBookmarked, onBookmark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="group relative p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#14b8a633] transition-all duration-500 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#14b8a6]/[0.02] blur-3xl pointer-events-none group-hover:bg-[#14b8a6]/[0.05]" />
    
    <div className="flex items-start justify-between mb-8">
      <div className="w-16 h-16 rounded-2xl bg-[#14b8a611] border border-[#14b8a622] flex items-center justify-center text-3xl pb-1">
        {tip.icon}
      </div>
      <BookmarkButton
        isBookmarked={isBookmarked}
        onClick={onBookmark}
      />
    </div>
    
    <div className="mb-6">
       <span className="text-[9px] font-black text-[#14b8a6] uppercase tracking-[0.25em] block mb-3">{tip.category}</span>
       <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-[#14b8a6] transition-colors mb-4 leading-tight">
         {tip.title}
       </h3>
       <p className="text-sm text-slate-500 font-medium leading-relaxed">
         {tip.content}
       </p>
    </div>

    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
       <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
          <Clock size={12} /> 2m Read
       </div>
       <Zap size={14} className="text-[#14b8a6] opacity-30 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

/* ── COMPONENT: RESOURCE CARD ── */
const ResourceCard = ({ resource, index, isBookmarked, onBookmark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    onClick={() => resource.url && window.open(resource.url, '_blank')}
    className="group relative rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#14b8a633] transition-all duration-500 overflow-hidden cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#14b8a602] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative p-8 z-10">
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#14b8a611] border border-[#14b8a622] flex items-center justify-center text-3xl pb-1">
          {resource.icon}
        </div>
        <BookmarkButton
          isBookmarked={isBookmarked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBookmark();
          }}
        />
      </div>

      <div className="mb-8">
         <span className="text-[9px] font-black text-[#14b8a6] uppercase tracking-[0.25em] block mb-3">{resource.type}</span>
         <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-[#14b8a6] transition-colors mb-4 leading-tight">
           {resource.title}
         </h3>
         <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
           {resource.description}
         </p>
      </div>

      <div className="flex items-center justify-between w-full px-8 py-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-[#14b8a6] group-hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
        Go to Resource
        <ExternalLink size={14} />
      </div>
    </div>
  </motion.div>
);


export default TipsResources;
