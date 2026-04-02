import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

export const fadeUp = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.45,ease:[0.22,1,0.36,1]}} };
export const stagger = { hidden:{}, visible:{transition:{staggerChildren:0.07}} };

export const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600;700&display=swap');

    .adm {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      background: #040810;
      color: #94a3b8;
      min-height: 100vh;
    }
    .mono { font-family: 'DM Mono', monospace !important; }

    /* Cards */
    .acard {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.065);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .acard:hover { border-color: rgba(99,102,241,0.18); }

    /* Sidebar nav item */
    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: rgba(148,163,184,0.5);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      text-align: left;
    }
    .nav-item:hover { color: rgba(226,232,240,0.8); background: rgba(255,255,255,0.04); }
    .nav-item.active {
      background: rgba(99,102,241,0.12);
      border-color: rgba(99,102,241,0.25);
      color: #a5b4fc;
      font-weight: 600;
    }

    /* Input */
    .ainp {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .ainp:focus { border-color: rgba(99,102,241,0.4); box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
    .ainp::placeholder { color: rgba(148,163,184,0.3); }

    /* Table */
    .atbl { width: 100%; border-collapse: collapse; }
    .atbl th {
      padding: 10px 16px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      color: rgba(148,163,184,0.4);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.055);
    }
    .atbl td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 13px;
    }
    .atbl tr:hover td { background: rgba(255,255,255,0.02); }

    /* Btn primary */
    .abtn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 9px 18px; border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 3px 14px rgba(79,70,229,0.35);
      cursor: pointer; transition: all 0.2s;
    }
    .abtn:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(79,70,229,0.5); }
    .abtn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    /* Ghost btn */
    .abtn-ghost {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 10px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      color: rgba(203,213,225,0.7); font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .abtn-ghost:hover { background: rgba(255,255,255,0.07); color: white; border-color: rgba(99,102,241,0.25); }

    /* Status badges */
    .badge-green { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); color:#34d399; font-size:10px; font-weight:600; }
    .badge-indigo { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); color:#818cf8; font-size:10px; font-weight:600; }
    .badge-slate { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:rgba(148,163,184,0.6); font-size:10px; font-weight:600; }

    /* Section title */
    .sect-title { font-size:15px; font-weight:700; color:white; letter-spacing:-0.02em; }
    .sect-sub { font-size:11px; color:rgba(148,163,184,0.4); font-weight:500; margin-top:2px; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius:99px; }

    /* Micro label */
    .mlabel { font-size:10px; font-weight:600; color:rgba(148,163,184,0.4); letter-spacing:0.06em; text-transform:uppercase; }

    /* Pulse dot */
    @keyframes pdot { 0%,100%{opacity:1} 50%{opacity:0.35} }
    .pdot { animation: pdot 2s ease infinite; }

    /* Hover lift */
    .hlift { transition: transform 0.2s, box-shadow 0.2s; }
    .hlift:hover { transform: translateY(-2px); }
  `}</style>
);

export const Bg = () => (
  <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
    <div style={{ position:'absolute', inset:0, background:'#040810' }} />
    <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize:'80px 80px' }} />
    <div style={{ position:'absolute', top:'-20%', right:'-5%', width:'45vw', height:'45vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(79,70,229,0.06) 0%,transparent 65%)', filter:'blur(40px)' }} />
    <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 65%)', filter:'blur(40px)' }} />
  </div>
);

export const ComingSoon = ({ title }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:480, textAlign:'center', border:'1px dashed rgba(99,102,241,0.2)', borderRadius:18, background:'rgba(99,102,241,0.02)' }}>
    <div style={{ width:56, height:56, borderRadius:16, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
      <Zap size={24} color="#818cf8" />
    </div>
    <h3 style={{ fontSize:22, fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:6 }}>{title}</h3>
    <p className="mlabel">Module Under Construction</p>
  </div>
);

export const StatCard = ({ stat }) => {
  const colorMap = {
    blue: { bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.2)', text:'#60a5fa', glow:'rgba(59,130,246,0.12)' },
    purple: { bg:'rgba(168,85,247,0.1)', border:'rgba(168,85,247,0.2)', text:'#c084fc', glow:'rgba(168,85,247,0.1)' },
    indigo: { bg:'rgba(99,102,241,0.1)', border:'rgba(99,102,241,0.2)', text:'#818cf8', glow:'rgba(99,102,241,0.1)' },
    green: { bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.2)', text:'#34d399', glow:'rgba(16,185,129,0.08)' },
  };
  const c = colorMap[stat.color] || colorMap.indigo;
  const isPositive = stat.grow?.startsWith('+');

  return (
    <motion.div variants={fadeUp} className="acard hlift" style={{ padding:'24px 24px 22px' }}>
      <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:`radial-gradient(circle, ${c.glow} 0%, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div className="mlabel">{stat.label}</div>
        <div style={{ width:34, height:34, borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:c.text, flexShrink:0 }}>
          {stat.icon}
        </div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-0.03em', lineHeight:1, marginBottom:8 }}>{stat.value}</div>
      <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 8px', borderRadius:99, background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border:`1px solid ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`, fontSize:10, fontWeight:600, color: isPositive ? '#34d399' : 'rgba(148,163,184,0.5)' }}>
        {isPositive && <TrendingUp size={9} />}{stat.grow}
      </span>
    </motion.div>
  );
};
