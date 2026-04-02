import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, SendHorizontal, Sparkles, Mic, X, 
  LayoutDashboard, History, MessageSquare, 
  Trash2, Copy, Check, Paperclip, Eraser,
  Volume2, VolumeX, Terminal, Shield, Cpu,
  Brain as BrainIcon, Zap, FileText, Activity, Layers,
  Lock, Globe, Search, Map as MapIcon, Plus, ChevronRight,
  MoreVertical, RefreshCw, Calendar
} from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const AIMentorPage = () => {
    const navigate = useNavigate();
  const { user, dbUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // ── SESSIONS SYNC ──
  useEffect(() => {
     if (user?.uid) {
        console.log("Syncing sessions for UID:", user.uid);
        fetchSessions();
     }
  }, [user?.uid]);

  const fetchSessions = async () => {
    if (!user?.uid) return;
    setIsSessionsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/mentorship/sessions/${user.uid}`);
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error("Critical History Sync Failure:", err);
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const loadSessionContent = async (sessionId) => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/mentorship/session/${sessionId}`);
      if (res.data.success) {
        setMessages(res.data.session.messages);
        setCurrentSessionId(sessionId);
      }
    } catch (err) {
      toast.error("Telemetry Retrieval Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
     setMessages([]);
     setCurrentSessionId(null);
     setInput('');
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm('Erase this strategic record?')) return;
    try {
      await axios.delete(`${API_BASE}/api/mentorship/session/${sessionId}`);
      if (currentSessionId === sessionId) startNewChat();
      fetchSessions();
      toast.info("Session Purged");
    } catch (err) {
      toast.error("Cleanup Failed");
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e) => setInput(e.results[0][0].transcript);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error('Incompatible Browser');
    if (isListening) recognitionRef.current.stop(); else { recognitionRef.current.start(); setIsListening(true); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const currentInput = input;
    const currentFile = selectedFile;
    
    // Optimistic UI update
    const userMsg = { role: 'user', text: currentInput, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    setInput('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/mentorship/chat`, {
        message: currentInput,
        sessionId: currentSessionId || null, // Explicitly send null for new chats
        uid: user.uid,
        userContext: {
          career: dbUser?.onboarding?.targetCareer,
          skills: dbUser?.onboarding?.skills,
          fileAttached: !!currentFile,
          fileName: currentFile?.name
        },
      });
      
      if (res.data.success) {
        // Replace temporary model message or just append
        setMessages(prev => [...prev, { role: 'model', text: res.data.text, time: new Date() }]);
        setCurrentSessionId(res.data.sessionId);
        
        // RE-FETCH SESSIONS SO SIDEBAR UPDATES
        setTimeout(() => fetchSessions(), 800); 
      }
    } catch (error) {
      console.error("Mentor Service Error:", error);
      toast.error("Neural Connection Interrupted");
      setMessages(prev => [...prev, { role: 'model', text: "Critical sync error. Please check your network.", time: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast.success('Sync to Datacore');
  };

  return (
    <div className="min-h-screen bg-[#040d18] text-white flex flex-col font-sans selection:bg-[#14b8a6]/30 overflow-hidden">
      <Navbar />
      
      <style>{`
        .glass-card { backdrop-filter: blur(24px); background: rgba(10, 22, 36, 0.6); border: 1px solid rgba(20, 184, 166, 0.1); }
        .chat-bubble { max-width: 85%; padding: 18px 24px; border-radius: 20px; font-size: 15px; line-height: 1.6; }
        .bubble-user { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; border-bottom-right-radius: 4px; align-self: flex-end; }
        .bubble-ai { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.9); border-bottom-left-radius: 4px; align-self: flex-start; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.2); border-radius: 10px; }
        .session-link { transition: all 0.2s; border-radius: 12px; cursor: pointer; border: 1px solid transparent; }
        .session-link:hover { background: rgba(20, 184, 166, 0.08); border-color: rgba(20, 184, 166, 0.2); }
        .session-active { background: rgba(13, 25, 39, 0.8) !important; border-color: rgba(20, 184, 166, 0.4) !important; color: #14b8a6 !important; position: relative; }
        .session-active::before { content: ''; position: absolute; left: 0; top: 20%; height: 60%; width: 2px; background: #14b8a6; border-radius: 4px; }
      `}</style>

      <main className="flex-1 flex mt-[80px] lg:mt-[120px] h-[calc(100vh-80px)] lg:h-[calc(100vh-120px)] overflow-hidden">
        
        {/* ── CHAT HISTORY SIDEBAR ── */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-[100] w-[300px] lg:w-[320px] 
          border-right border-white/5 bg-[#040d18] lg:bg-black/30 flex flex-col 
          transition-transform duration-300 transform
          ${showHistory ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
           {/* Mobile Close Button */}
           <button 
             onClick={() => setShowHistory(false)}
             className="lg:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-white"
           >
              <X size={20} />
           </button>

           <div className="p-6">
              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-[#14b8a633] text-[#14b8a6] font-bold text-sm bg-[#14b8a60a] hover:bg-[#14b8a615] transition-all group shadow-xl shadow-[#14b8a605]"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                New Strategic Session
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <div className="flex items-center justify-between px-2 mb-4">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Neural Logs</p>
                 <button onClick={fetchSessions} className="text-slate-600 hover:text-[#14b8a6]"><RefreshCw size={10} /></button>
              </div>

              <div className="flex flex-col gap-2 pb-10">
                 {isSessionsLoading && sessions.length === 0 ? (
                    <div className="p-4 text-center text-slate-600 text-[10px] font-bold uppercase animate-pulse">Syncing Datacore...</div>
                 ) : sessions.length > 0 ? (
                    sessions.map((s) => (
                       <div 
                         key={s._id} 
                         onClick={() => loadSessionContent(s._id)}
                         className={`session-link p-4 group flex flex-col gap-2 ${currentSessionId === s._id ? 'session-active' : 'text-slate-400'}`}
                       >
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare size={14} className={currentSessionId === s._id ? 'text-[#14b8a6]' : 'text-slate-600'} />
                                <span className="text-[12px] font-bold truncate max-w-[170px] leading-tight">{s.title || "Untitled Fragment"}</span>
                             </div>
                             <button onClick={(e) => deleteSession(e, s._id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                                <Trash2 size={12} />
                             </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-1">
                             <Calendar size={10} className="text-slate-700" />
                             <span className="text-[9px] font-bold text-slate-600 uppercase">
                                {new Date(s.lastUpdated || s.createdAt).toLocaleDateString([], { day:'numeric', month:'short', year:'numeric' })}
                             </span>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-4 border border-dashed border-white/5 rounded-3xl mt-4 bg-white/[0.01]">
                       <History size={24} className="text-slate-800" />
                       <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Neural Cache Empty</p>
                          <p className="text-[9px] font-medium text-slate-800">Ask your mentor a question</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="p-6 mt-auto border-t border-white/5 bg-black/40">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-[#14b8a611] flex items-center justify-center border border-[#14b8a611]">
                    <Shield size={16} className="text-[#14b8a6]" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-[#14b8a6] uppercase tracking-widest leading-none mb-1">Secure</p>
                    <p className="text-[11px] font-bold text-white uppercase leading-none">Status: Linked</p>
                 </div>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 rounded-xl bg-white/[0.03] text-slate-500 font-bold text-[11px] hover:text-white transition-all border border-white/5 hover:border-white/10"
              >
                 System Dashboard
              </button>
           </div>
        </aside>

        {/* ── MAIN CHAT INTERFACE ── */}
         <section className="flex-1 flex flex-col relative bg-[#040d18] neural-bg-dots overflow-hidden">
           
           <header className="px-4 lg:px-8 py-3 lg:py-5 border-b border-white/5 flex items-center justify-between bg-black/10 backdrop-blur-xl z-20">
              <div className="flex items-center gap-3 lg:gap-4">
                 <button 
                   onClick={() => setShowHistory(true)}
                   className="lg:hidden p-2 text-slate-400 hover:text-[#14b8a6] transition-all"
                 >
                    <History size={20} />
                 </button>
                 <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center shadow-lg shadow-[#14b8a622]">
                    <Bot size={18} className="lg:w-[22px] lg:h-[22px]" color="white" />
                 </div>
                 <div>
                    <h2 className="text-sm lg:text-base font-black tracking-tight text-white flex items-center gap-2 leading-none mb-1">
                       Neural Mentor
                       <span className="text-[10px] font-black text-[#14b8a6] uppercase tracking-widest">Active</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Telemetry Linked: Synchronized</p>
                 </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                 <button onClick={fetchSessions} className="p-2 lg:p-3 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl" title="Refresh History"><RefreshCw size={16} className="lg:w-[18px] lg:h-[18px]" /></button>
                 <button onClick={startNewChat} className="p-2 lg:p-3 text-[#14b8a6] hover:bg-[#14b8a611] rounded-xl font-bold text-[10px] lg:text-xs flex items-center gap-2 transition-all">
                    <Plus size={14} className="lg:w-[16px] lg:h-[16px]"/> <span className="hidden sm:inline">New Strategic Chat</span>
                 </button>
              </div>
           </header>

           {/* CHAT AREA */}
           <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-10 flex flex-col gap-6 lg:gap-8 custom-scrollbar relative z-10">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center max-w-lg">
                       <div className="w-20 h-20 rounded-3xl bg-[#14b8a60a] border border-[#14b8a611] flex items-center justify-center mb-8 relative group">
                          <BrainIcon size={40} className="text-[#14b8a6] group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-[#14b8a6] blur-2xl opacity-10 animate-pulse rounded-full" />
                       </div>
                       <h3 className="display text-2xl text-white mb-3 tracking-tighter font-bold">Initiate Strategic Link</h3>
                       <p className="text-sm text-slate-500 leading-relaxed mb-10 font-medium">
                          Welcome to the SkillVoyager Neural Grid. Calibration is required. Input your vocational queries or career fragments to begin mapping.
                       </p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          {[
                             {t:'Advanced Git Troubleshooting', icon:<Terminal size={14}/>},
                             {t:'Junior to Senior Roadmap', icon:<MapIcon size={14}/>},
                             {t:'Industry AI Trends 2026', icon:<Shield size={14}/>},
                             {t:'Cognitive Logic Models', icon:<Zap size={14}/>}
                          ].map(it => (
                             <button key={it.t} onClick={() => setInput(it.t)} className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#14b8a644] transition-all text-left group">
                                <div className="text-slate-600 group-hover:text-[#14b8a6] transition-colors">{it.icon}</div>
                                <span className="text-[11px] font-bold uppercase text-slate-500 group-hover:text-white transition-colors">{it.t}</span>
                             </button>
                          ))}
                       </div>
                    </motion.div>
                 </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`chat-bubble shadow-2xl ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                      {msg.role === 'model' && (
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                          <div className="flex items-center gap-2 text-[#14b8a6]">
                             <Sparkles size={14} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Neural Diagnostics</span>
                          </div>
                          <button onClick={() => copyToClipboard(msg.text, i)} className="text-slate-500 hover:text-white transition-colors">
                             {copiedIdx === i ? <Check size={14} className="text-[#14b8a6]" /> : <Copy size={13} />}
                          </button>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    </div>
                    <div className="mt-3 text-[10px] font-bold text-slate-800 uppercase tracking-tighter px-4">
                       {new Date(msg.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </motion.div>
                ))
              )}

              {isLoading && (
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-[#14b8a611] flex items-center justify-center animate-bounce">
                          <Bot size={20} className="text-[#14b8a6]" />
                       </div>
                       <div className="flex gap-1.5">
                          {[0,1,2].map(i => <motion.div key={i} animate={{ scale:[1,1.5,1], opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:1, delay:i*0.2 }} className="w-2 h-2 rounded-full bg-[#14b8a6]" />)}
                       </div>
                    </div>
                    <p className="text-[9px] font-black text-[#14b8a6] uppercase tracking-[0.3em] ml-14 animate-pulse">Neural Core Processing...</p>
                 </div>
              )}
              <div ref={chatEndRef} />
           </div>

           {/* INPUT AREA */}
           <div className="p-4 lg:p-10 border-t border-white/5 bg-black/20 z-20">
              <form onSubmit={handleSendMessage} className="max-w-[1000px] mx-auto relative lg:px-4">
                 <div className="flex items-center gap-2 lg:gap-4 bg-white/[0.04] border border-white/10 rounded-[20px] lg:rounded-[30px] p-1.5 lg:p-2.5 shadow-2xl focus-within:border-[#14b8a644] focus-within:bg-white/[0.06] transition-all">
                    <button type="button" className="w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-slate-600 hover:text-[#14b8a6] hover:bg-white/5 transition-all"><Paperclip size={18} className="lg:w-[22px] lg:h-[22px]"/></button>
                    <input 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Calibration query..."
                       className="flex-1 bg-transparent border-none outline-none px-2 lg:px-4 text-white font-medium text-sm lg:text-base placeholder:text-slate-600"
                    />
                    <div className="flex items-center gap-1 pr-1">
                       <button 
                         type="button" 
                         onClick={toggleListening}
                         className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all ${isListening ? 'text-red-500 bg-red-500/10' : 'text-slate-600 hover:text-[#14b8a6]'}`}
                       >
                          <Mic size={18} className={`lg:w-[22px] lg:h-[22px] ${isListening ? 'animate-pulse' : ''}`} />
                       </button>
                       <button 
                          type="submit" 
                          disabled={!input.trim() || isLoading}
                          className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-[#040d18] shadow-xl shadow-[#14b8a615] hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale transition-all"
                       >
                          <SendHorizontal size={20} className="lg:w-[26px] lg:h-[26px]" />
                       </button>
                    </div>
                 </div>
              </form>
              <div className="text-center mt-6">
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">Integrated Core // System Calibration: Verified</p>
              </div>
           </div>

        </section>
      </main>
    </div>
  );
};

export default AIMentorPage;
