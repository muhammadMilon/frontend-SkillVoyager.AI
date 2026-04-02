import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, User, ExternalLink, 
  PlayCircle, Search, Filter, Monitor, Users, 
  ChevronRight, Sparkles, History, MonitorDot,
  ArrowUpRight, Plus, X, Globe, ShieldCheck, 
  Trash2, Edit3, Link as LinkIcon, Radio,
  RefreshCw, FileText
} from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const StrategicLiveHub = () => {
  const { user, dbUser } = useContext(AuthContext); 
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: 'Expert-led technical deep-dive and strategic session.', 
    instructor: '',
    startTime: '',
    endTime: '',
    meetingPlatform: 'Google Meet',
    status: 'upcoming',
    recordedLink: ''
  });

  const isAdmin = dbUser?.role === 'admin' || user?.email === 'admin@skillvoyager.ai';

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/sessions`);
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      toast.error("Unable to sync with live servers.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    let finalData = { ...formData };
    if (!finalData.endTime && finalData.startTime) {
       const start = new Date(finalData.startTime);
       const end = new Date(start.getTime() + 60 * 60 * 1000); 
       finalData.endTime = end.toISOString();
    }

    try {
      const res = await axios.post(`${API_BASE}/api/sessions`, finalData);
      if (res.data.success) {
        toast.success("Strategic Session Scheduled!");
        setShowModal(false);
        fetchSessions();
        setFormData({
          title: '', description: 'Expert-led technical deep-dive and strategic session.', 
          instructor: '', startTime: '', endTime: '', meetingLink: '', 
          meetingPlatform: 'Google Meet', status: 'upcoming', recordedLink: ''
        });
      }
    } catch (err) {
      toast.error("Deployment Failed.");
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Abort this session protocol?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/sessions/${id}`);
      if (res.data.success) {
        toast.info("Session Removed");
        fetchSessions();
      }
    } catch (err) {
      toast.error("Removal Failed");
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesTab = s.status === activeTab;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (s.instructor && s.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const liveSessions = sessions.filter(s => s.status === 'live');

  return (
    <div className="min-h-screen bg-[#040d18] text-white pt-[160px] pb-20 font-sans selection:bg-[#14b8a6]/20">

      <style>{`
        .live-glow { box-shadow: 0 0 30px rgba(20, 184, 166, 0.25); }
        .btn-premium { position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-premium::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.6s; }
        .btn-premium:hover::after { transform: translateX(100%); }
        .card-blur { backdrop-filter: blur(12px); background: rgba(13, 25, 39, 0.7); }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1) hue-rotate(180deg) brightness(1.5); }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
           <div className="text-left">
              <div className="flex items-center gap-3 text-[#14b8a6] mb-6">
                 <Radio size={12} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-60">Strategic Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
                 Strategic <span className="text-[#14b8a6]">Live Hub</span>
              </h1>
              <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed">
                 High-fidelity expert synchronization. Deploy modular research sessions and real-time 
                 diagnostics through our elite communication infrastructure.
              </p>
           </div>
           
           {isAdmin && (
             <motion.button 
               whileHover={{ y: -2 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setShowModal(true)}
               className="px-10 py-5 rounded-2xl bg-[#14b8a611] text-[#14b8a6] font-black uppercase tracking-widest text-[11px] flex items-center gap-4 border border-[#14b8a633] hover:bg-[#14b8a61a] transition-all shadow-2xl shadow-[#14b8a605]"
             >
                <Plus size={16} /> Deploy Masterclass Protocol
             </motion.button>
           )}
        </div>

        {/* LIVE HIGHLIGHT - RE-ADDED JOIN NOW BUTTON */}
        <AnimatePresence>
          {liveSessions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-16 relative group"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-[#14b8a610] to-transparent rounded-[32px] blur-3xl opacity-30" />
               <div className="relative card-blur border border-[#14b8a633] rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden shadow-3xl">
                  
                  <div className="flex items-center gap-10 relative z-10">
                     <div className="relative">
                        <div className="w-24 h-24 rounded-[32px] bg-[#14b8a608] border border-[#14b8a615] flex items-center justify-center relative overflow-hidden">
                           <MonitorDot size={44} className="text-[#14b8a6] opacity-90" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex items-center gap-2 bg-[#14b8a6] py-1.5 px-4 rounded-full shadow-xl live-glow">
                           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                           <span className="text-[10px] font-black text-black uppercase tracking-tighter">LIVE</span>
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-4">
                           <span className="text-[10px] font-black text-[#14b8a6] uppercase tracking-widest px-3 py-1 bg-[#14b8a60a] border border-[#14b8a611] rounded-lg">Target: Active Workshop</span>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">// {liveSessions[0].meetingPlatform}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-4 leading-none">{liveSessions[0].title}</h2>
                        <div className="flex flex-wrap items-center gap-6 text-[13px] font-bold text-slate-500">
                           <span className="flex items-center gap-2.5"><User size={16} className="text-[#14b8a6] opacity-40"/> {liveSessions[0].instructor}</span>
                           <span className="flex items-center gap-2.5 font-black text-[11px] uppercase tracking-widest bg-white/[0.02] px-3 py-1 rounded-full border border-white/5 opacity-80 animate-pulse text-[#14b8a6]">2.4k Voyagers Syncing</span>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10">
                    <a 
                      href={liveSessions[0].meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-premium px-12 py-4.5 bg-[#14b8a6] text-black font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-white transition-all shadow-2xl flex items-center gap-4 active:scale-95 text-xs"
                    >
                      LIVE START <ArrowUpRight size={18} />
                    </a>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="flex flex-col lg:flex-row gap-6 mb-14 items-center justify-between">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 flex items-center gap-2 w-full lg:w-auto">
              {['upcoming', 'recorded'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 lg:flex-none px-12 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-[#14b8a6] hover:bg-white text-black shadow-xl' 
                    : 'text-slate-500 hover:text-white  hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative group w-full lg:max-w-md">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-700 group-focus-within:text-[#14b8a6] transition-colors">
                 <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Find session protocols..."
                className="w-full bg-white/[0.02] border border-white/5 focus:border-[#14b8a6]/20 rounded-2xl py-4.5 pl-16 pr-8 outline-none transition-all text-sm font-bold placeholder:text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6 opacity-30">
             <RefreshCw className="w-10 h-10 text-[#14b8a6] animate-spin" />
             <p className="micro tracking-[0.4em]">Querying Core Node...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-40 border border-white/[0.02] rounded-[48px] bg-white/[0.01]">
             <Calendar size={48} className="mx-auto mb-6 text-slate-900" />
             <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.4em]">Neural Cache Empty</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
             {filteredSessions.map((session, idx) => (
               <SessionCard key={session._id} session={session} idx={idx} isAdmin={isAdmin} onDelete={deleteSession} />
             ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
           <div className="fixed inset-0 z-[100] flex items-center mt-40 justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-[#0a1624] border border-[#14b8a620] rounded-[40px] p-10 relative z-10 shadow-3xl overflow-y-auto max-h-[90vh]"
              >
                 <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-all"><X size={20}/></button>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-[#14b8a60a] border border-[#14b8a611] flex items-center justify-center">
                       <MonitorDot className="text-[#14b8a6]" size={28} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-white uppercase tracking-tighter">Strategic Session Configuration</h2>
                       <p className="text-[#14b8a6] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Global Masterclass Protocol</p>
                    </div>
                 </div>

                 <form onSubmit={handleCreateSession} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase font-black text-slate-500 ml-4">Masterclass Descriptor (Title)</label>
                       <input required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all" />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] uppercase font-black text-slate-500 ml-4">Strategic Agenda (Short Description)</label>
                       <textarea required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all h-24 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Lead Mentor</label><input required value={formData.instructor} onChange={e=>setFormData({...formData, instructor:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all" /></div>
                       <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Platform</label><select value={formData.meetingPlatform} onChange={e=>setFormData({...formData, meetingPlatform:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all text-slate-500"><option value="Google Meet">Google Meet</option><option value="Zoom">Zoom</option><option value="Discord">Discord</option></select></div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Commence (Start)</label><input required type="datetime-local" value={formData.startTime} onChange={e=>setFormData({...formData, startTime:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all text-slate-400" /></div>
                       <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Terminate (End)</label><input required type="datetime-local" value={formData.endTime} onChange={e=>setFormData({...formData, endTime:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all text-slate-400" /></div>
                    </div>

                    <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Source URL (Meet/Zoom Link)</label><input required value={formData.meetingLink} onChange={e=>setFormData({...formData, meetingLink:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all text-[#14b8a6]" /></div>
                    <div className="space-y-2"><label className="text-[9px] uppercase font-black text-slate-500 ml-4">Recording URL (YouTube/Drive Link)</label><input value={formData.recordedLink} onChange={e=>setFormData({...formData, recordedLink:e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4.5 text-sm outline-none focus:border-[#14b8a633] transition-all text-[#14b8a6]" placeholder="Optional: Add link after session ends" /></div>

                    <div className="flex gap-2 p-1 bg-black/20 rounded-2xl">{['upcoming', 'live', 'recorded'].map(st => (<button key={st} type="button" onClick={()=>setFormData({...formData, status:st})} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === st ? 'bg-[#14b8a6] text-black shadow-lg shadow-[#14b8a630]' : 'text-slate-600 hover:text-white'}`}>{st}</button>))}</div>

                    <button type="submit" className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[12px] mt-4 hover:bg-[#14b8a6] hover:text-white transition-all shadow-3xl">Launch Session Fragment</button>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SessionCard = ({ session, idx, isAdmin, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group bg-[#0a1624] border border-white/[0.03] rounded-[48px] p-9 hover:border-[#14b8a620] transition-all duration-500 relative shadow-2xl overflow-hidden">
       <div className="absolute top-0 right-0 w-40 h-40 bg-[#14b8a6]/2 blur-[80px] pointer-events-none group-hover:bg-[#14b8a6]/5 transition-all" />
       
       <div className="flex items-start justify-between mb-10">
          <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center border border-white/[0.05] ${session.status === 'live' ? 'bg-[#14b8a608] text-[#14b8a6]' : 'bg-white/[0.01] text-slate-700'}`}>
             {session.status === 'live' ? <MonitorDot size={32} /> : session.status === 'recorded' ? <PlayCircle size={32} /> : <Calendar size={32} />}
          </div>
          {isAdmin && (
             <button onClick={() => onDelete(session._id)} className="p-3 text-slate-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-red-500/10 rounded-xl"><Trash2 size={16} /></button>
          )}
       </div>

       <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${session.status === 'live' ? 'bg-[#14b8a61a] text-[#14b8a6] live-glow' : 'bg-white/[0.02] text-slate-700 font-bold'}`}>{session.status}</span>
             {session.status === 'live' && <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-ping" />}
          </div>
          <h3 className="text-2xl font-black text-white group-hover:text-[#14b8a6] transition-colors leading-[1.3] mb-4 truncate italic tracking-tighter">{session.title}</h3>
          <p className="text-slate-600 text-[13px] font-medium leading-relaxed line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity">{session.description || 'Global session review and modular deep-dive.'}</p>
       </div>

       <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-black uppercase tracking-wider"><User size={16} className="text-[#14b8a633]" /> {session.instructor}</div>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-black uppercase tracking-wider"><Clock size={16} className="text-[#14b8a633]" /> {new Date(session.startTime).toLocaleDateString([], { month:'short', day:'numeric' })} • {new Date(session.startTime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
       </div>

       <a 
         href={session.status === 'recorded' ? (session.recordedLink || session.meetingLink) : session.meetingLink} 
         target="_blank" 
         rel="noopener noreferrer" 
         className={`btn-premium flex items-center justify-between w-full p-6 rounded-[24px] transition-all font-black text-[11px] uppercase tracking-[0.4em] ${
           session.status === 'live' 
           ? 'bg-[#14b8a6] text-black hover:bg-white' 
           : 'bg-white/[0.03] border border-white/5 hover:bg-[#14b8a61a] hover:text-[#14b8a6]'
         }`}
       >
          {session.status === 'recorded' ? 'WATCH RECAP' : 'JOIN NOW'}
          <ArrowUpRight size={20} />
       </a>
    </motion.div>
  );
};

export default StrategicLiveHub;
