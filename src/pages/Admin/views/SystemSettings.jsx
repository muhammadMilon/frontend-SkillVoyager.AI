import React from 'react';
import { Activity, ShieldCheck, Zap, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../Shared';

const SystemSettings = () => {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
      <motion.div variants={fadeUp} className="acard" style={{ padding:'28px 28px' }}>
        <div className="sect-title" style={{ marginBottom:20 }}>Production Ecosystem</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { name:'Primary Backend Node', status:'Online', info:'Node.js 20.x • v8 Engine', icon:<Activity size={14} color="#34d399"/>, sc:'green' },
            { name:'SkillVoyager Atlas DB', status:'Stable', info:'MongoDB Replica Set (3 Nodes)', icon:<ShieldCheck size={14} color="#818cf8"/>, sc:'indigo' },
            { name:'Gemini-2.0 Reasoning', status:'Optimal', info:'Token Limit: 1M/min', icon:<Zap size={14} color="#facc15"/>, sc:'green' },
            { name:'Frontend CDN (Vite)', status:'Live', info:'Global Edge Network Active', icon:<CloudLightning size={14} color="#38bdf8"/>, sc:'indigo' },
          ].map((sys,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderRadius:12, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.055)', transition:'border-color 0.2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {sys.icon}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'white', marginBottom:2 }}>{sys.name}</div>
                  <div className="mlabel" style={{ fontSize:9 }}>{sys.info}</div>
                </div>
              </div>
              <span className={sys.sc==='green'?'badge-green':'badge-indigo'}>{sys.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <motion.div variants={fadeUp} className="acard mono" style={{ padding:'20px 20px', fontSize:11, color:'rgba(165,180,252,0.7)', lineHeight:1.8 }}>
          <div style={{ display:'flex', gap:6, marginBottom:14, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            {['#ef4444','#facc15','#22c55e'].map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
            <span style={{ fontSize:9, fontWeight:600, color:'rgba(148,163,184,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginLeft:4 }}>Sys-Logs</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <span style={{ color:'#34d399' }}>[EXEC] Auth: ROOT OK</span>
            <span style={{ color:'rgba(148,163,184,0.3)' }}>» VOYAGER_ANALYTICS...</span>
            <span style={{ color:'rgba(148,163,184,0.3)' }}>» GEMINI_REFLECTOR init</span>
            <span style={{ color:'rgba(165,180,252,0.8)' }}>» ROADMAP_GEN: OK (240ms)</span>
            <span style={{ color:'rgba(148,163,184,0.2)', animation:'pdot 1.5s ease infinite' }}>_ waiting for input</span>
          </div>
        </motion.div>
        <motion.button variants={fadeUp} className="abtn" style={{ width:'100%', justifyContent:'center', padding:'12px 0', background:'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
          Full System Flush
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SystemSettings;
