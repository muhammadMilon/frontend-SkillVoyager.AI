import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Zap, Sparkles } from 'lucide-react';
import { fadeUp, stagger } from '../Shared';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const inputStyle = { width:'100%', padding:'11px 14px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#e2e8f0', fontFamily:'Inter,sans-serif', fontSize:13, outline:'none', transition:'all 0.2s' };

const NotificationsAdmin = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('system');
  const [link, setLink] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) return;
    try {
      setIsBroadcasting(true);
      const response = await fetch(`${API_BASE}/api/notifications/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `📢 ${title}`, message, type, link })
      });
      const data = await response.json();
      if (data.success) {
        alert(`✅ Broadcast Successful! Sent to ${data.count} voyagers.`);
        setTitle(''); setMessage(''); setLink('');
      } else {
        alert(`❌ Failed: ${data.message || 'Unknown error'}`);
      }
    } catch { 
      alert('❌ Failed to blast the signal. Network error.'); 
    } finally { 
      setIsBroadcasting(false); 
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
      {/* Broadcast form */}
      <motion.div variants={fadeUp} className="acard" style={{ padding:'32px 32px' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)' }} />
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:26, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Megaphone size={17} color="#818cf8" />
          </div>
          <div>
            <div className="sect-title">Broadcast Center</div>
            <div className="sect-sub">Send signal to all voyagers</div>
          </div>
        </div>

        <form onSubmit={handleBroadcast} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div className="mlabel" style={{ marginBottom:6 }}>Signal Title</div>
            <input className="ainp" style={inputStyle} type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. New Feature Launched!" />
          </div>
          <div>
            <div className="mlabel" style={{ marginBottom:6 }}>Message</div>
            <textarea className="ainp" style={{ ...inputStyle, resize:'none', lineHeight:1.65 }} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type your strategic message..." />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <div className="mlabel" style={{ marginBottom:6 }}>Signal Type</div>
              <select className="ainp" style={inputStyle} value={type} onChange={e=>setType(e.target.value)}>
                <option value="system">System Admin</option>
                <option value="new_course">Course Update</option>
                <option value="achievement">Achievement</option>
                <option value="milestone_complete">Milestone</option>
                <option value="roadmap_update">Roadmap Signal</option>
              </select>
            </div>
            <div>
              <div className="mlabel" style={{ marginBottom:6 }}>Redirect Link</div>
              <input className="ainp" style={inputStyle} type="text" value={link} onChange={e=>setLink(e.target.value)} placeholder="/trending" />
            </div>
          </div>
          <button type="submit" className="abtn" disabled={isBroadcasting} style={{ width:'100%', justifyContent:'center', marginTop:4, padding:'12px 0' }}>
            {isBroadcasting
              ? <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
              : <Zap size={14} />}
            Blast Signal to All Voyagers
          </button>
        </form>
      </motion.div>

      {/* Tips + AI Optimizer */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
            <Sparkles size={14} color="#818cf8" />
            <div style={{ fontSize:14, fontWeight:700, color:'white' }}>Signal Best Practices</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {["Use emojis to boost engagement (🚀, 📚, 🎉)", "Keep messages concise and actionable", "Strategic redirects increase user retention", "All signals are permanent in Voyager history"].map((tip,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.055)' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'rgba(99,102,241,0.7)', flexShrink:0, marginTop:1 }}>0{i+1}</span>
                <span style={{ fontSize:12, color:'rgba(148,163,184,0.65)', lineHeight:1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px', background:'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))', borderColor:'rgba(99,102,241,0.25)' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'white' }}>AI Optimizer</div>
            <Zap size={14} color="#818cf8" />
          </div>
          <p style={{ fontSize:12, color:'rgba(148,163,184,0.6)', lineHeight:1.65, marginBottom:18 }}>Gemini 2.0 suggests the optimal broadcast window for maximum reach.</p>
          <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span className="mlabel">Optimal Window</span>
              <span style={{ fontSize:10, fontWeight:600, color:'#34d399' }}>Ready</span>
            </div>
            <p className="mono" style={{ fontSize:11, color:'rgba(165,180,252,0.8)' }}>NEXT_REACH: Active Voyagers @ 09:00 PM</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotificationsAdmin;
