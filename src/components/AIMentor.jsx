import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, SendHorizontal, Sparkles, Mic, Paperclip } from 'lucide-react';
import { AuthContext } from '../providers/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const S = () => (
  <style>{`
    .mentor-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
    .mentor-wrap {
      width: 420px;
      height: 640px;
      border-radius: 32px;
      background: rgba(10, 22, 36, 0.85);
      border: 1px solid rgba(20, 184, 166, 0.2);
      box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset;
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .mentor-header {
      padding: 24px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(180deg, rgba(20, 184, 166, 0.05) 0%, transparent 100%);
    }
    .mentor-msgs {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .mentor-msgs::-webkit-scrollbar { width: 3px; }
    .mentor-msgs::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.2); border-radius: 10px; }
    .bubble-ai {
      max-width: 85%;
      padding: 16px 20px;
      border-radius: 20px 20px 20px 4px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      line-height: 1.6;
    }
    .bubble-user {
      max-width: 85%;
      padding: 16px 20px;
      border-radius: 20px 20px 4px 20px;
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      color: white;
      font-size: 14px;
      line-height: 1.6;
      box-shadow: 0 10px 25px rgba(20, 184, 166, 0.2);
    }
    .mentor-input-wrap {
      padding: 24px;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: rgba(0,0,0,0.2);
    }
    .mentor-input {
      width: 100%;
      padding: 16px 100px 16px 20px;
      border-radius: 18px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: white;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    .mentor-input:focus { border-color: rgba(20, 184, 166, 0.4); background: rgba(255,255,255,0.05); }
    .mentor-send {
      position: absolute;
      right: 8px; top: 50%;
      transform: translateY(-50%);
      width: 44px; height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      border: none;
      color: white;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .voice-btn-mini {
      position: absolute;
      right: 58px; top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      cursor: pointer;
    }
    .mentor-fab {
      width: 68px; height: 68px;
      border-radius: 22px;
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 16px 40px rgba(20, 184, 166, 0.4);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: white;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .mentor-fab:hover { transform: translateY(-5px) scale(1.05); }
    @keyframes dot-blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
    .dot { width: 5px; height: 5px; border-radius: 50%; background: #14b8a6; animation: dot-blink 1.4s infinite; }
  `}</style>
);

const AIMentor = ({ userContext }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: `Neural Core synchronized. Greetings ${user?.displayName?.split(' ')[0] || 'Voyager'}. Strategic assistance ready.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    if (isOpen) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (e) => setInput(e.results[0][0].transcript);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [messages, isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error('Browser not supported');
    if (isListening) recognitionRef.current.stop();
    else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/mentorship/chat`, {
        message: userText,
        previousChat: messages.slice(-6),
        userContext,
      });
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'model', text: res.data.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Neural link interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mentor-root" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
      <S />
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat"
            className="mentor-wrap shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
          >
            <div className="mentor-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center shadow-lg shadow-[#14b8a633]">
                  <Bot size={20} color="white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">AI Neural Mentor</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#14b8a6] uppercase tracking-wider">Sync Active</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="mentor-msgs custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-lg bg-[#14b8a611] border border-[#14b8a622] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Sparkles size={14} className="text-[#14b8a6]" />
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 ml-11">
                  <div className="dot" /><div className="dot" style={{ animationDelay: '0.2s' }} /><div className="dot" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="mentor-input-wrap">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  className="mentor-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Analyze strategic query..."
                />
                <button type="button" onClick={toggleListening} className="voice-btn-mini hover:text-[#14b8a6] transition-colors">
                  <Mic size={18} className={isListening ? 'animate-pulse text-red-500' : ''} />
                </button>
                <button type="submit" className="mentor-send" disabled={!input.trim() || isLoading}>
                  <SendHorizontal size={18} />
                </button>
              </form>
              <div className="text-center mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                Powered by Neural Core v4.2
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fab"
            className="mentor-fab"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#14b8a6] border-2 border-[#040d18]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMentor;