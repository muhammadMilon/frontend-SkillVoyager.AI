// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
// import { AuthContext } from '../../providers/AuthProvider';
// import {
//   Target, Clock, TrendingUp, Award, Calendar,
//   CheckCircle2, Hourglass, Rocket, Lock, Zap,
//   Brain, Activity, Cpu, GitBranch, Radio, Wifi
// } from 'lucide-react';
// import Navbar from '../../components/Navbar';
// import AIRecommendedCourses from './AIRecommendedCourses';


// const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

// /* ═══════════════════════════════════════════════
//    GLOBAL STYLES
// ═══════════════════════════════════════════════ */
// const Styles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Share+Tech+Mono&display=swap');

//     :root {
//       --neon-blue:   #00d4ff;
//       --neon-violet: #7c3aed;
//       --neon-green:  #00ff9d;
//       --neon-amber:  #ffb800;
//       --neon-rose:   #ff2d78;
//       --bg-deep:     #010b1a;
//       --bg-panel:    rgba(0, 212, 255, 0.025);
//       --border-glow: rgba(0, 212, 255, 0.12);
//     }

//     .nos-root {
//       font-family: 'Exo 2', sans-serif;
//       background: var(--bg-deep);
//       min-height: 100vh;
//       color: #94a3b8;
//       -webkit-font-smoothing: antialiased;
//       cursor: crosshair;
//     }

//     /* ── Orbitron display ── */
//     .nos-orb { font-family: 'Orbitron', monospace; letter-spacing: 0.04em; }
//     .nos-mono { font-family: 'Share Tech Mono', monospace; }

//     /* ── Holographic panel ── */
//     .nos-panel {
//       background: var(--bg-panel);
//       border: 1px solid var(--border-glow);
//       border-radius: 4px;
//       position: relative;
//       overflow: hidden;
//       transition: all 0.3s ease;
//       backdrop-filter: blur(12px);
//     }
//     .nos-panel::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, rgba(0,212,255,0.04) 0%, transparent 50%, rgba(124,58,237,0.03) 100%);
//       pointer-events: none;
//     }
//     .nos-panel:hover {
//       border-color: rgba(0,212,255,0.28);
//       box-shadow: 0 0 30px rgba(0,212,255,0.06), inset 0 0 30px rgba(0,212,255,0.02);
//     }

//     /* ── Corner brackets ── */
//     .nos-panel .corner {
//       position: absolute;
//       width: 12px; height: 12px;
//       border-color: var(--neon-blue);
//       border-style: solid;
//       opacity: 0.6;
//       transition: opacity 0.3s;
//     }
//     .nos-panel:hover .corner { opacity: 1; }
//     .nos-panel .corner.tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
//     .nos-panel .corner.tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
//     .nos-panel .corner.bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
//     .nos-panel .corner.br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

//     /* ── Stat block ── */
//     .nos-stat {
//       background: rgba(0,212,255,0.018);
//       border: 1px solid rgba(0,212,255,0.1);
//       border-radius: 4px;
//       padding: 20px 18px;
//       position: relative;
//       overflow: hidden;
//       transition: all 0.25s ease;
//       cursor: default;
//     }
//     .nos-stat::after {
//       content: '';
//       position: absolute;
//       bottom: 0; left: 0; right: 0;
//       height: 1px;
//       background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
//       opacity: 0;
//       transition: opacity 0.3s;
//     }
//     .nos-stat:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.06); }
//     .nos-stat:hover::after { opacity: 0.7; }

//     /* ── Skill chip ── */
//     .nos-chip {
//       display: inline-flex; align-items: center; gap: 5px;
//       padding: 5px 12px; border-radius: 2px;
//       font-family: 'Share Tech Mono', monospace;
//       font-size: 10px;
//       background: rgba(0,255,157,0.06);
//       border: 1px solid rgba(0,255,157,0.2);
//       color: var(--neon-green);
//       transition: all 0.2s ease;
//     }
//     .nos-chip:hover { background: rgba(0,255,157,0.12); border-color: rgba(0,255,157,0.5); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,255,157,0.15); }

//     /* ── Animated scanline ── */
//     @keyframes scanline {
//       0%   { transform: translateY(-100%); opacity: 0; }
//       10%  { opacity: 0.3; }
//       90%  { opacity: 0.3; }
//       100% { transform: translateY(1000%); opacity: 0; }
//     }
//     .nos-scanline {
//       position: absolute; left: 0; right: 0; height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
//       animation: scanline 4s linear infinite;
//       pointer-events: none;
//       z-index: 10;
//     }

//     /* ── Blink cursor ── */
//     @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%,99%{opacity:0} }
//     .nos-cursor::after { content: '█'; animation: blink 1s step-end infinite; font-size: 0.8em; }

//     /* ── Glow text ── */
//     .nos-glow-blue  { text-shadow: 0 0 10px rgba(0,212,255,0.8),  0 0 30px rgba(0,212,255,0.4); }
//     .nos-glow-green { text-shadow: 0 0 10px rgba(0,255,157,0.8),  0 0 30px rgba(0,255,157,0.4); }
//     .nos-glow-amber { text-shadow: 0 0 10px rgba(255,184,0,0.8),  0 0 30px rgba(255,184,0,0.4); }

//     /* ── Hexagon ── */
//     .nos-hex {
//       clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
//     }

//     /* ── Pulse ring ── */
//     @keyframes pulse-ring {
//       0%   { transform: scale(0.85); opacity: 0.7; }
//       100% { transform: scale(1.4);  opacity: 0; }
//     }
//     .nos-pulse-ring {
//       position: absolute; inset: -8px; border-radius: 50%;
//       border: 1px solid rgba(0,212,255,0.4);
//       animation: pulse-ring 2s ease-out infinite;
//     }

//     /* ── Progress arc animation ── */
//     @keyframes arc-glow { 0%,100%{filter:drop-shadow(0 0 4px rgba(0,212,255,0.6))} 50%{filter:drop-shadow(0 0 14px rgba(0,212,255,1))} }
//     .nos-arc-glow { animation: arc-glow 2.5s ease infinite; }

//     /* ── Grid flicker ── */
//     @keyframes flicker { 0%,100%{opacity:0.025} 95%{opacity:0.025} 96%{opacity:0.01} 97%{opacity:0.025} }
//     .nos-grid { animation: flicker 8s ease infinite; }

//     /* ── Data stream ── */
//     @keyframes stream { from{background-position:0 0} to{background-position:0 100px} }

//     /* ── Typewriter ── */
//     @keyframes typing { from{width:0} to{width:100%} }

//     /* ── Responsive Utilities ── */
//     .nos-grid-hero { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center; margin-bottom: 44px; }
//     .nos-grid-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 24px; }
//     .nos-grid-main { display: grid; grid-template-columns: 1fr 390px; gap: 20px; align-items: start; }

//     @media (max-width: 1024px) {
//       .nos-grid-hero { grid-template-columns: 1fr; gap: 32px; text-align: center; }
//       .nos-grid-hero > div { display: flex; flex-direction: column; align-items: center; }
//       .nos-grid-stats { grid-template-columns: repeat(3, 1fr); }
//       .nos-grid-main { grid-template-columns: 1fr; }
//     }

//     @media (max-width: 640px) {
//       .nos-grid-stats { grid-template-columns: repeat(2, 1fr); }
//     }

//     ::-webkit-scrollbar { width: 3px; background: rgba(0,212,255,0.03); }
//     ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); }
//   `}</style>
// );

// /* ═══════════════════════════════════════════════
//    ANIMATED NEURAL NETWORK BACKGROUND
// ═══════════════════════════════════════════════ */
// const NeuralBg = () => {
//   const nodes = Array.from({ length: 16 }, (_, i) => ({
//     x: [12, 28, 45, 62, 78, 88, 15, 35, 55, 72, 90, 8, 40, 65, 82, 25][i],
//     y: [15, 8, 20, 12, 18, 35, 45, 38, 32, 42, 52, 68, 60, 55, 70, 80][i],
//   }));
//   const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[1,7],[2,7],[2,8],[3,8],[3,9],[4,9],[4,10],[5,10],[6,7],[7,8],[8,9],[9,10],[6,11],[7,12],[8,12],[9,13],[10,14],[11,12],[12,13],[13,14],[11,15],[12,15],[15,13]];

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
//       {/* Deep background */}
//       <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(0,18,40,1) 0%, #010b1a 100%)' }} />

//       {/* Grid */}
//       <div className="nos-grid" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)', backgroundSize: '60px 60px', opacity: 0.025 }} />

//       {/* Neural network SVG */}
//       <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }} preserveAspectRatio="xMidYMid slice">
//         <defs>
//           <filter id="glow-f">
//             <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//             <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
//           </filter>
//         </defs>
//         {/* Edges */}
//         {edges.map(([a, b], i) => (
//           <motion.line key={i}
//             x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
//             x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
//             stroke="rgba(0,212,255,0.15)" strokeWidth={0.5}
//             initial={{ opacity: 0 }} animate={{ opacity: [0.08, 0.2, 0.08] }}
//             transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
//           />
//         ))}
//         {/* Nodes */}
//         {nodes.map((n, i) => (
//           <motion.circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r={3}
//             fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth={1}
//             filter="url(#glow-f)"
//             animate={{ r: [2.5, 4, 2.5], opacity: [0.4, 0.9, 0.4] }}
//             transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
//           />
//         ))}
//         {/* Traveling data packet */}
//         {[0, 5, 10].map(startIdx => {
//           const fromNode = nodes[edges[startIdx]?.[0]];
//           const toNode   = nodes[edges[startIdx]?.[1]];
//           if (!fromNode || !toNode) return null;
//           return (
//             <motion.circle key={`p${startIdx}`}
//               r={3}
//               cx={`${fromNode.x}%`}
//               cy={`${fromNode.y}%`}
//               fill="#00d4ff"
//               filter="url(#glow-f)"
//               animate={{
//                 cx: [`${fromNode.x}%`, `${toNode.x}%`],
//                 cy: [`${fromNode.y}%`, `${toNode.y}%`],
//                 opacity: [0, 1, 0],
//               }}
//               transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: startIdx * 0.8 }}
//             />
//           );
//         })}
//       </svg>

//       {/* Horizontal scanline sweep */}
//       <div className="nos-scanline" />

//       {/* Corner HUD elements */}
//       <div style={{ position: 'absolute', top: 80, left: 20, opacity: 0.12 }}>
//         {['SYS.ACTIVE', 'NEURAL.SYNC', 'DATA.STREAM'].map((t, i) => (
//           <div key={i} className="nos-mono" style={{ fontSize: 9, color: '#00d4ff', marginBottom: 4, letterSpacing: '0.12em' }}>
//             [{String(i+1).padStart(2,'0')}] {t}
//           </div>
//         ))}
//       </div>

//       {/* Right side decorative bars */}
//       <div style={{ padding: '100px 32px 32px', opacity: 0.18 }}>
//         {Array.from({length:12},(_,i)=>(
//           <motion.div key={i} style={{ width: 20 + (i%4)*8, height: 2, background: '#00d4ff', borderRadius: 1 }}
//             animate={{ opacity:[0.3,1,0.3] }} transition={{duration:1.5,repeat:Infinity,delay:i*0.1}} />
//         ))}
//       </div>

//       {/* Top glow line */}
//       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent 5%,rgba(0,212,255,0.7) 50%,transparent 95%)' }} />
//       {/* Bottom glow line */}
//       <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent 20%,rgba(124,58,237,0.5) 50%,transparent 80%)' }} />

//       {/* Ambient orbs */}
//       <div style={{ position: 'absolute', top: '-10%', right: '0%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,60,120,0.35) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
//       <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(40,0,80,0.3) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    CIRCULAR MISSION RING
// ═══════════════════════════════════════════════ */
// const MissionRing = ({ pct = 0, targetRole = '' }) => {
//   const size = 240, stroke = 8, r = (size - stroke * 2) / 2;
//   const circ = 2 * Math.PI * r;
//   const endAngle = (pct / 100) * 2 * Math.PI - Math.PI / 2;

//   return (
//     <div style={{ position: 'relative', width: size, height: size }}>
//       {/* Outer decorative ring */}
//       <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.08)' }} />
//       <div style={{ position: 'absolute', inset: -28, borderRadius: '50%', border: '1px dashed rgba(0,212,255,0.04)' }} />

//       {/* Pulse rings */}
//       <div className="nos-pulse-ring" style={{ inset: -4, animationDelay: '0s' }} />
//       <div className="nos-pulse-ring" style={{ inset: -4, animationDelay: '1s' }} />

//       <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
//         <defs>
//           <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%"   stopColor="#00d4ff" />
//             <stop offset="50%"  stopColor="#7c3aed" />
//             <stop offset="100%" stopColor="#00ff9d" />
//           </linearGradient>
//           <filter id="arcBlur">
//             <feGaussianBlur stdDeviation="1.5" result="blur"/>
//             <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
//           </filter>
//         </defs>

//         {/* Tick marks */}
//         {Array.from({ length: 60 }, (_, i) => {
//           const a = (i / 60) * 2 * Math.PI;
//           const isMajor = i % 5 === 0;
//           const inner = r - (isMajor ? 10 : 5), outer = r - 1;
//           return (
//             <line key={i}
//               x1={size/2 + Math.cos(a)*inner} y1={size/2 + Math.sin(a)*inner}
//               x2={size/2 + Math.cos(a)*outer} y2={size/2 + Math.sin(a)*outer}
//               stroke={isMajor ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}
//               strokeWidth={isMajor ? 1 : 0.5}
//             />
//           );
//         })}

//         {/* Track */}
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth={stroke} />

//         {/* Progress arc */}
//         <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
//           stroke="url(#arcGrad)" strokeWidth={stroke} strokeLinecap="round"
//           strokeDasharray={circ}
//           initial={{ strokeDashoffset: circ }}
//           animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
//           transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
//           filter="url(#arcBlur)"
//           className="nos-arc-glow"
//         />

//         {/* Leading dot */}
//         {pct > 1 && (
//           <motion.circle
//             cx={size/2 + Math.cos(endAngle) * r}
//             cy={size/2 + Math.sin(endAngle) * r}
//             r={5} fill="#00d4ff"
//             initial={{ opacity: 0, r: 0 }}
//             animate={{ opacity: 1, r: 5 }}
//             transition={{ delay: 2.5 }}
//             style={{ filter: 'drop-shadow(0 0 8px #00d4ff) drop-shadow(0 0 20px rgba(0,212,255,0.6))' }}
//           />
//         )}
//       </svg>

//       {/* Center */}
//       <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
//         <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
//           style={{ textAlign: 'center' }}>
//           <div className="nos-mono" style={{ fontSize: 9, color: 'rgba(0,212,255,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>SYS.MASTERY</div>
//           <div className="nos-orb nos-glow-blue" style={{ fontSize: 52, fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>
//             {pct}<span style={{ fontSize: 22, color: 'rgba(0,212,255,0.5)' }}>%</span>
//           </div>
//           <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)', margin: '8px auto' }} />
//           <div className="nos-mono" style={{ fontSize: 9, color: 'rgba(0,255,157,0.6)', letterSpacing: '0.06em', maxWidth: 110, lineHeight: 1.4 }}>
//             {targetRole || 'TARGET.LOCKED'}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    STAT CARD
// ═══════════════════════════════════════════════ */
// const StatCard = ({ icon, label, value, accent, code, delay }) => (
//   <motion.div className="nos-stat"
//     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//     transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: 0.5 }} />
//     <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40%', height: 1, background: accent, opacity: 0.25 }} />
//     <div style={{ position: 'absolute', top: 8, right: 10 }}>
//       <span className="nos-mono" style={{ fontSize: 8, color: `${accent}60`, letterSpacing: '0.1em' }}>{code}</span>
//     </div>
//     <div style={{ width: 32, height: 32, borderRadius: 2, background: `${accent}12`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, marginBottom: 14 }}>
//       {icon}
//     </div>
//     <div className="nos-mono" style={{ fontSize: 9, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
//     <div className="nos-orb" style={{ fontSize: 18, fontWeight: 700, color: accent, lineHeight: 1, textShadow: `0 0 12px ${accent}80` }}>{value}</div>
//   </motion.div>
// );

// /* ═══════════════════════════════════════════════
//    MILESTONE ITEM
// ═══════════════════════════════════════════════ */
// const MilestoneItem = ({ m, index, total, pct, totalCount }) => {
//   const done = m.status === 'completed';
//   const cur  = m.status === 'current';
//   const isLast = index === total - 1;
//   const statusColor = done ? '#00ff9d' : cur ? '#00d4ff' : 'rgba(255,255,255,0.12)';

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.35 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//       style={{ display: 'flex', gap: 0 }}>

//       {/* Spine */}
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 52, flexShrink: 0 }}>
//         <motion.div whileHover={{ scale: 1.1 }}
//           style={{
//             width: 40, height: 40,
//             clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
//             background: done ? 'rgba(0,255,157,0.1)' : cur ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.025)',
//             border: 'none',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             color: statusColor,
//             opacity: m.status === 'upcoming' ? 0.35 : 1,
//             zIndex: 1,
//             boxShadow: done ? '0 0 18px rgba(0,255,157,0.3)' : cur ? '0 0 18px rgba(0,212,255,0.3)' : 'none',
//             position: 'relative',
//           }}>
//           {/* hex border overlay */}
//           <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', border: `1px solid ${statusColor}40`, pointerEvents: 'none' }} />
//           {done ? <CheckCircle2 size={16} /> : cur ? <Rocket size={16} /> : <Lock size={13} />}
//         </motion.div>
//         {!isLast && (
//           <div style={{ width: 1, flex: 1, minHeight: 20, background: `linear-gradient(to bottom,${statusColor}30,rgba(255,255,255,0.03))`, margin: '3px 0' }} />
//         )}
//       </div>

//       {/* Content */}
//       <motion.div whileHover={{ x: 5 }}
//         style={{ flex: 1, paddingLeft: 14, paddingBottom: isLast ? 0 : 24 }}>
//         <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
//           <div>
//             <div className="nos-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: statusColor, opacity: 0.65, marginBottom: 4, textTransform: 'uppercase' }}>
//               {done ? '◆ PHASE.COMPLETE' : cur ? '▶ PHASE.ACTIVE' : '◇ PHASE.LOCKED'} · {String(index+1).padStart(2,'0')}
//             </div>
//             <h4 style={{ fontFamily: "'Exo 2',sans-serif", fontSize: 14, fontWeight: 600, color: m.status === 'upcoming' ? 'rgba(255,255,255,0.18)' : 'rgba(220,230,255,0.9)', margin: '0 0 6px', lineHeight: 1.3 }}>
//               {m.title}
//             </h4>
//             {m.date && (
//               <span className="nos-mono" style={{ fontSize: 9, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.06em' }}>
//                 LOGGED: {m.date}
//               </span>
//             )}
//           </div>
//           {cur && (
//             <div style={{ flexShrink: 0, padding: '9px 13px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.04)', minWidth: 110 }}>
//               <div className="nos-mono" style={{ fontSize: 8, color: 'rgba(0,212,255,0.45)', letterSpacing: '0.1em', marginBottom: 6 }}>ACTIVE.SYNC</div>
//               <div style={{ height: 3, background: 'rgba(0,212,255,0.08)' }}>
//                 <motion.div initial={{ width: 0 }} 
//                   animate={{ width: `${(pct % (100 / (totalCount || 1))) * (totalCount || 1)}%` }}
//                   transition={{ duration: 1.8, delay: 0.8, ease: [0.16,1,0.3,1] }}
//                   style={{ height: '100%', background: 'linear-gradient(90deg,#00d4ff,#7c3aed)', boxShadow: '0 0 6px rgba(0,212,255,0.5)' }} />
//               </div>
//               <div className="nos-mono" style={{ fontSize: 9, color: '#00d4ff', marginTop: 5 }}>ACTIVE</div>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* ═══════════════════════════════════════════════
//    HUD HEADER BAR
// ═══════════════════════════════════════════════ */
// const HudBar = ({ label, children }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
//     <div style={{ width: 3, height: 18, background: 'linear-gradient(to bottom,#00d4ff,#7c3aed)', flexShrink: 0 }} />
//     <div>
//       <div className="nos-mono" style={{ fontSize: 8, color: 'rgba(0,212,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 1 }}>SYSTEM.MODULE</div>
//       <h2 className="nos-orb" style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0, letterSpacing: '0.06em' }}>{label}</h2>
//     </div>
//     {children && <div style={{ marginLeft: 'auto' }}>{children}</div>}
//   </div>
// );

// /* ═══════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════ */
// const ProgressDashboard = ({ embedded = false }) => {
//   const { user, dbUser } = useContext(AuthContext);
//   const [progressData, setProgressData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bootText, setBootText] = useState('INIT');

//   useEffect(() => {
//     const texts = ['INIT','AUTH.CHECK','DATA.FETCH','SYNC.NEURAL','READY'];
//     let i = 0;
//     const iv = setInterval(() => { if (i < texts.length) setBootText(texts[i++]); else clearInterval(iv); }, 220);
//     return () => clearInterval(iv);
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const uid = user?.uid || 'demo-user';
//         const r = await fetch(`${API_BASE}/api/progress?uid=${uid}`);
//         const d = await r.json();
//         if (d.success) setProgressData(d.data);
//       } catch(e) { console.error(e); }
//       finally { setLoading(false); }
//     })();
//   }, [user]);

//   const pct = progressData?.percentage || 0;
//   const completedCount = progressData?.milestones?.filter(m => m.status === 'completed').length || 0;
//   const totalCount = progressData?.milestones?.length || 0;

//   const stats = [
//     { icon: <Target size={14}/>,       label: 'Target Role',    value: progressData?.targetRole || 'Initializing...', accent: '#00d4ff', code: 'TGT.01', delay: 0.08 },
//     { icon: <CheckCircle2 size={14}/>, label: 'Phases Done',    value: `${completedCount}/${totalCount}`,           accent: '#00ff9d', code: 'PHZ.02', delay: 0.14 },
//     { icon: <Brain size={14}/>,        label: 'Skill Gaps',     value: progressData?.missingSkills?.length || 0,    accent: '#a855f7', code: 'GAP.03', delay: 0.20 },
//     { icon: <Hourglass size={14}/>,    label: 'Days Remaining', value: `${progressData?.estimatedDays || 0}d`,      accent: '#ffb800', code: 'TIM.04', delay: 0.26 },
//     { icon: <Clock size={14}/>,        label: 'Study Hours',    value: `${progressData?.totalStudyHours || 0}h`,    accent: '#ff6b35', code: 'LOG.05', delay: 0.32 },
//     { icon: <Activity size={14}/>,     label: 'Velocity',       value: `${(pct / 10 + 0.5).toFixed(1)}×`,           accent: '#ff2d78', code: 'VEL.06', delay: 0.38 },
//   ];

//   /* ── Loading screen ── */
//   if (loading) return (
//     <><Styles/>{!embedded && <NeuralBg/>}
//       <div style={{ minHeight: embedded ? '60vh' : '100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
//         <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:'center'}}>
//           <div style={{ width:60, height:60, margin:'0 auto 24px', position:'relative' }}>
//             <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
//               style={{ width:60, height:60, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.15)', borderTopColor:'#00d4ff', position:'absolute', inset:0 }}/>
//             <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
//               style={{ width:44, height:44, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.2)', borderBottomColor:'#7c3aed', position:'absolute', inset:8 }}/>
//             <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
//               <Cpu size={18} color="#00d4ff" />
//             </div>
//           </div>
//           <div className="nos-mono nos-glow-blue" style={{ fontSize:11, color:'#00d4ff', letterSpacing:'0.15em' }}>{bootText}_</div>
//         </motion.div>
//       </div>
//     </>
//   );

//   return (
//     <><Styles/>
//       <div className={embedded ? "" : "nos-root"}>
//         {!embedded && <NeuralBg/>}
//         {!embedded && <Navbar/>}

//         <main style={{ position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto', padding: embedded ? '10px 0 60px' : '48px 24px 100px' }}>

//           {/* ══ HERO HEADER ══ */}
//           <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
//             className="nos-grid-hero">
//             <div>
//               {/* System status badge */}
//               <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'6px 14px', border:'1px solid rgba(0,212,255,0.2)', background:'rgba(0,212,255,0.04)', marginBottom:20 }}>
//                 <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.4, repeat:Infinity }}
//                   style={{ width:6, height:6, borderRadius:'50%', background:'#00ff9d', boxShadow:'0 0 8px #00ff9d' }}/>
//                 <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,212,255,0.6)', letterSpacing:'0.14em', textTransform:'uppercase' }}>NEURAL.OS // PROGRESS.MODULE // ONLINE</span>
//                 <span className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.3)' }}>{user?.displayName || 'VOYAGER'}</span>
//               </div>

//               {/* Title */}
//               <h1 className="nos-orb" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, margin:'0 0 6px', lineHeight:1, color:'transparent', WebkitTextStroke:'1px rgba(0,212,255,0.4)', letterSpacing:'0.06em' }}>
//                 PROGRESS
//               </h1>
//               <h1 className="nos-orb nos-glow-blue" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, margin:'0 0 20px', lineHeight:1, color:'#00d4ff', letterSpacing:'0.06em' }}>
//                 DASHBOARD
//               </h1>

//               <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'rgba(148,163,184,0.55)', maxWidth:420, lineHeight:1.8, fontWeight:300 }}>
//                 Real-time neural pathway analytics · Skill acquisition tracking ·{' '}
//                 <span style={{ color:'rgba(0,212,255,0.7)', fontWeight:500 }}>{pct}% mastery threshold</span> achieved across all learning vectors.
//               </p>

//               {/* Master progress strip */}
//               <div style={{ marginTop:24, maxWidth:460 }}>
//                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
//                   <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,212,255,0.4)', letterSpacing:'0.12em' }}>MASTER.PROGRESS.VECTOR</span>
//                   <span className="nos-mono nos-glow-blue" style={{ fontSize:10, color:'#00d4ff' }}>{pct}%</span>
//                 </div>
//                 {/* Multi-segment bar */}
//                 <div style={{ height:8, background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.1)', position:'relative', overflow:'hidden' }}>
//                   <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
//                     transition={{ duration:2.2, delay:0.3, ease:[0.16,1,0.3,1] }}
//                     style={{ height:'100%', background:'linear-gradient(90deg,#7c3aed,#00d4ff,#00ff9d)', position:'relative', boxShadow:'0 0 12px rgba(0,212,255,0.4)' }}>
//                     {/* Moving shimmer */}
//                     <motion.div animate={{ x:['-100%','200%'] }} transition={{ duration:2, repeat:Infinity, ease:'linear', delay:2.5 }}
//                       style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width:'40%' }}/>
//                   </motion.div>
//                   {/* Segment marks */}
//                   {[25,50,75].map(v=>(
//                     <div key={v} style={{ position:'absolute', top:0, bottom:0, left:`${v}%`, width:1, background:'rgba(0,0,0,0.4)' }}/>
//                   ))}
//                 </div>
//                 <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
//                   {['INIT','25%','50%','75%','MAX'].map(v=>(
//                     <span key={v} className="nos-mono" style={{ fontSize:8, color:'rgba(0,212,255,0.2)' }}>{v}</span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Mission Ring */}
//             <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3, duration:0.9, ease:[0.22,1,0.36,1] }}>
//               <MissionRing pct={pct} targetRole={progressData?.targetRole}/>
//             </motion.div>
//           </motion.div>

//           {/* ══ STATS GRID ══ */}
//           <div className="nos-grid-stats">
//             {stats.map((s,i) => <StatCard key={i} {...s}/>)}
//           </div>

//           {/* ══ MAIN 2-COL LAYOUT ══ */}
//           <div className="nos-grid-main">

//             {/* ── LEFT ── */}
//             <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

//               {/* Milestones */}
//               <motion.div className="nos-panel" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
//                 style={{ padding:'32px 34px' }}>
//                 <div className="nos-scanline" style={{ animationDelay:'2s' }}/>
//                 <div className="corner tl"/><div className="corner tr"/>
//                 <div className="corner bl"/><div className="corner br"/>

//                 <HudBar label="LEARNING.MILESTONES">
//                   <div className="nos-panel" style={{ padding:'4px 12px', display:'flex', alignItems:'center', gap:6 }}>
//                     <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,255,157,0.6)', letterSpacing:'0.1em' }}>
//                       {completedCount}/{totalCount} VERIFIED
//                     </span>
//                   </div>
//                 </HudBar>

//                 {/* Milestones list */}
//                 <div style={{ position:'relative' }}>
//                   {(progressData?.milestones || []).map((m,i,arr) => (
//                     <MilestoneItem key={i} m={m} index={i} total={arr.length} pct={pct} totalCount={totalCount}/>
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Skill Gaps */}
//               {progressData?.missingSkills?.length > 0 && (
//                 <motion.div className="nos-panel" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
//                   style={{ padding:'28px 32px' }}>
//                   <div className="corner tl"/><div className="corner tr"/>
//                   <div className="corner bl"/><div className="corner br"/>
//                   <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,45,120,0.4),transparent)' }}/>

//                   <HudBar label="SKILL.GAP.ANALYSIS">
//                     <div className="nos-mono" style={{ fontSize:18, fontWeight:700, color:'#ff2d78', textShadow:'0 0 12px rgba(255,45,120,0.6)' }}>
//                       {progressData.missingSkills.length}
//                     </div>
//                   </HudBar>

//                   <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//                     {progressData.missingSkills.map((skill, i) => (
//                       <motion.span key={i} className="nos-chip"
//                         initial={{ opacity:0, scale:0.7, y:10 }}
//                         animate={{ opacity:1, scale:1, y:0 }}
//                         transition={{ delay: 0.5 + i * 0.04 }}
//                         whileHover={{ scale:1.06, y:-3 }}>
//                         <Zap size={8}/>{skill.toUpperCase()}
//                       </motion.span>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* ── RIGHT ── */}
//             <div style={{ display:'flex', flexDirection:'column', gap:18, position:'sticky', top:24 }}>

//               {/* Metrics */}
//               <motion.div className="nos-panel" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
//                 style={{ padding:'26px 24px' }}>
//                 <div className="corner tl"/><div className="corner tr"/>
//                 <div className="corner bl"/><div className="corner br"/>
//                 <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,184,0,0.4),transparent)' }}/>

//                 <HudBar label="MISSION.METRICS"/>

//                 {[
//                   { label:'COMPLETION', value:pct, max:100, color:'linear-gradient(90deg,#7c3aed,#00d4ff)', display:`${pct}%`, glow:'rgba(0,212,255,0.4)' },
//                   { label:'DAYS.ELAPSED', value:progressData?.estimatedDays||0, max:90, color:'linear-gradient(90deg,#00ff9d,#00d4ff)', display:`${progressData?.estimatedDays||0}d`, glow:'rgba(0,255,157,0.4)' },
//                   { label:'STUDY.HOURS', value:progressData?.totalStudyHours||0, max:100, color:'linear-gradient(90deg,#ffb800,#ff6b35)', display:`${progressData?.totalStudyHours||0}h`, glow:'rgba(255,184,0,0.4)' },
//                 ].map((item,i) => (
//                   <div key={i} style={{ marginBottom:18 }}>
//                     <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
//                       <span className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.4)', letterSpacing:'0.1em' }}>{item.label}</span>
//                       <span className="nos-mono" style={{ fontSize:10, fontWeight:600, color:'rgba(220,230,255,0.8)' }}>{item.display}</span>
//                     </div>
//                     <div style={{ height:4, background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.08)', overflow:'hidden' }}>
//                       <motion.div initial={{ width:0 }} animate={{ width:`${Math.min((item.value/item.max)*100,100)}%` }}
//                         transition={{ duration:1.8, delay:0.5+i*0.12, ease:[0.16,1,0.3,1] }}
//                         style={{ height:'100%', background:item.color, boxShadow:`0 0 8px ${item.glow}` }}/>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Mini system readout */}
//                 <div style={{ borderTop:'1px solid rgba(0,212,255,0.08)', paddingTop:14, marginTop:4 }}>
//                   {[
//                     `MASTERY.LEVEL: ${pct}%`, 
//                     `TOTAL.EFFORT: ${progressData?.totalStudyHours || 0}h`, 
//                     `SYNC.STATUS: ${dbUser?.streak > 0 ? 'ACTIVE' : 'STANDBY'}`
//                   ].map((line,i) => (
//                     <motion.div key={i} className="nos-mono" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1+i*0.15 }}
//                       style={{ fontSize:9, color:'rgba(0,212,255,0.25)', letterSpacing:'0.08em', marginBottom:3 }}>
//                       › {line}
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>

//             </div>
//           </div>

//           {/* ══ AI RECOMMENDED COURSES — FULL WIDTH ══ */}
//           <motion.div className="nos-panel" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
//             style={{ marginTop:20, padding:'32px 36px' }}>
//             <div className="corner tl"/><div className="corner tr"/>
//             <div className="corner bl"/><div className="corner br"/>
//             <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(124,58,237,0.6),rgba(0,212,255,0.4),transparent)' }}/>
//             <div style={{ position:'absolute', top:0, right:0, width:300, height:300, background:'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 65%)', pointerEvents:'none' }}/>
//             <AIRecommendedCourses mode="grid" />
//           </motion.div>

//         </main>
//       </div>
//     </>
//   );
// };

// export default ProgressDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import {
  Target, CheckCircle2, Rocket, Lock, Zap,
  Cpu,
} from 'lucide-react';
import { HiOutlineFire } from 'react-icons/hi';
import Navbar from '../../components/Navbar';
import AIRecommendedCourses from './AIRecommendedCourses';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════ */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Share+Tech+Mono&display=swap');

    :root {
      --neon-blue:   #00d4ff;
      --neon-violet: #7c3aed;
      --neon-green:  #00ff9d;
      --neon-amber:  #ffb800;
      --neon-rose:   #ff2d78;
      --bg-deep:     #010b1a;
      --bg-panel:    rgba(0,212,255,0.025);
      --border-glow: rgba(0,212,255,0.12);
    }

    .nos-root {
      font-family: 'Exo 2', sans-serif;
      background: var(--bg-deep);
      min-height: 100vh;
      color: #94a3b8;
      -webkit-font-smoothing: antialiased;
      cursor: crosshair;
    }

    .nos-orb  { font-family: 'Orbitron', monospace; letter-spacing: 0.04em; }
    .nos-mono { font-family: 'Share Tech Mono', monospace; }

    /* ── Panel ── */
    .nos-panel {
      background: var(--bg-panel);
      border: 1px solid var(--border-glow);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(12px);
    }
    .nos-panel::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg,rgba(0,212,255,0.04) 0%,transparent 50%,rgba(124,58,237,0.03) 100%);
      pointer-events: none;
    }
    .nos-panel:hover {
      border-color: rgba(0,212,255,0.28);
      box-shadow: 0 0 30px rgba(0,212,255,0.06),inset 0 0 30px rgba(0,212,255,0.02);
    }

    /* ── Corner brackets ── */
    .nos-panel .corner {
      position: absolute; width: 12px; height: 12px;
      border-color: var(--neon-blue); border-style: solid;
      opacity: 0.6; transition: opacity 0.3s;
    }
    .nos-panel:hover .corner { opacity: 1; }
    .nos-panel .corner.tl { top:0; left:0;  border-width:1px 0 0 1px; }
    .nos-panel .corner.tr { top:0; right:0; border-width:1px 1px 0 0; }
    .nos-panel .corner.bl { bottom:0; left:0;  border-width:0 0 1px 1px; }
    .nos-panel .corner.br { bottom:0; right:0; border-width:0 1px 1px 0; }

    /* ── Stat card ── */
    .dynamic-stat {
      background: rgba(0,212,255,0.018);
      border: 1px solid rgba(0,212,255,0.1);
      border-radius: 4px; padding: 20px 18px;
      position: relative; overflow: hidden;
      transition: all 0.25s ease; cursor: default;
    }
    .dynamic-stat::after {
      content: ''; position: absolute;
      bottom:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg,transparent,var(--neon-blue),transparent);
      opacity:0; transition:opacity 0.3s;
    }
    .dynamic-stat:hover {
      border-color: rgba(0,212,255,0.3);
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.5),0 0 20px rgba(0,212,255,0.06);
    }
    .dynamic-stat:hover::after { opacity:0.7; }

    /* ── Skill chip ── */
    .nos-chip {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 12px; border-radius:2px;
      font-family:'Share Tech Mono',monospace; font-size:10px;
      background:rgba(0,255,157,0.06); border:1px solid rgba(0,255,157,0.2);
      color:var(--neon-green); transition:all 0.2s ease;
    }
    .nos-chip:hover {
      background:rgba(0,255,157,0.12); border-color:rgba(0,255,157,0.5);
      transform:translateY(-2px);
    }

    /* ── Scanline ── */
    @keyframes scanline {
      0%   { transform:translateY(-100%); opacity:0; }
      10%  { opacity:0.3; }
      90%  { opacity:0.3; }
      100% { transform:translateY(1000%); opacity:0; }
    }
    .nos-scanline {
      position:absolute; left:0; right:0; height:1px;
      background:linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent);
      animation:scanline 4s linear infinite;
      pointer-events:none; z-index:10;
    }

    /* ── Glow text ── */
    .nos-glow-blue  { text-shadow:0 0 10px rgba(0,212,255,0.8), 0 0 30px rgba(0,212,255,0.4); }
    .nos-glow-green { text-shadow:0 0 10px rgba(0,255,157,0.8), 0 0 30px rgba(0,255,157,0.4); }

    /* ── Pulse ring ── */
    @keyframes pulse-ring {
      0%   { transform:scale(0.85); opacity:0.7; }
      100% { transform:scale(1.4);  opacity:0; }
    }
    .nos-pulse-ring {
      position:absolute; inset:-8px; border-radius:50%;
      border:1px solid rgba(0,212,255,0.4);
      animation:pulse-ring 2s ease-out infinite;
    }

    /* ── Arc glow ── */
    @keyframes arc-glow {
      0%,100% { filter:drop-shadow(0 0 4px rgba(0,212,255,0.6)); }
      50%     { filter:drop-shadow(0 0 14px rgba(0,212,255,1)); }
    }
    .nos-arc-glow { animation:arc-glow 2.5s ease infinite; }

    /* ── Grid flicker ── */
    @keyframes flicker {
      0%,100%{opacity:0.025} 95%{opacity:0.025} 96%{opacity:0.01} 97%{opacity:0.025}
    }
    .nos-grid { animation:flicker 8s ease infinite; }

    /* ── Layout grids ── */
    .nos-grid-hero  { display:grid; grid-template-columns:1fr auto; gap:48px; align-items:center; margin-bottom:44px; }
    .nos-grid-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:15px; margin-bottom:24px; }

    /* KEY FIX: align-items:stretch so both columns grow to same height */
    .nos-grid-main  { display:grid; grid-template-columns:1fr 390px; gap:20px; align-items:stretch; }

    @media (max-width:1024px) {
      .nos-grid-hero  { grid-template-columns:1fr; gap:32px; text-align:center; }
      .nos-grid-hero > div { display:flex; flex-direction:column; align-items:center; }
      .nos-grid-stats { grid-template-columns:repeat(2,1fr); }
      .nos-grid-main  { grid-template-columns:1fr; }
    }
    @media (max-width:640px) {
      .nos-grid-stats { grid-template-columns:1fr; }
    }

    ::-webkit-scrollbar { width:3px; background:rgba(0,212,255,0.03); }
    ::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.2); }
  `}</style>
);

/* ═══════════════════════════════════════════════
   NEURAL BACKGROUND
═══════════════════════════════════════════════ */
const NeuralBg = () => {
  const nodes = Array.from({ length: 16 }, (_, i) => ({
    x: [12,28,45,62,78,88,15,35,55,72,90,8,40,65,82,25][i],
    y: [15, 8,20,12,18,35,45,38,32,42,52,68,60,55,70,80][i],
  }));
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[1,7],[2,7],[2,8],[3,8],
    [3,9],[4,9],[4,10],[5,10],[6,7],[7,8],[8,9],[9,10],[6,11],[7,12],
    [8,12],[9,13],[10,14],[11,12],[12,13],[13,14],[11,15],[12,15],[15,13],
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 120% 80% at 50% 0%,rgba(0,18,40,1) 0%,#010b1a 100%)' }} />
      <div className="nos-grid" style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)', backgroundSize:'60px 60px', opacity:0.025 }} />

      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.35 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow-f">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {edges.map(([a,b],i) => (
          <motion.line key={i}
            x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
            x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
            stroke="rgba(0,212,255,0.15)" strokeWidth={0.5}
            initial={{ opacity:0 }} animate={{ opacity:[0.08,0.2,0.08] }}
            transition={{ duration:3+i*0.3, repeat:Infinity, ease:'easeInOut', delay:i*0.15 }}
          />
        ))}
        {nodes.map((n,i) => (
          <motion.circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r={3}
            fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth={1}
            filter="url(#glow-f)"
            animate={{ r:[2.5,4,2.5], opacity:[0.4,0.9,0.4] }}
            transition={{ duration:2.5+i*0.2, repeat:Infinity, ease:'easeInOut', delay:i*0.12 }}
          />
        ))}
      </svg>

      <div className="nos-scanline" />
      <div style={{ position:'absolute', top:'-10%', right:'0%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,60,120,0.35) 0%,transparent 65%)', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'-5%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(40,0,80,0.3) 0%,transparent 65%)', filter:'blur(60px)' }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MISSION RING
═══════════════════════════════════════════════ */
const MissionRing = ({ pct = 0, targetRole = '' }) => {
  const size = 240, stroke = 8, r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const endAngle = (pct / 100) * 2 * Math.PI - Math.PI / 2;

  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <div style={{ position:'absolute', inset:-16, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.08)' }} />
      <div style={{ position:'absolute', inset:-28, borderRadius:'50%', border:'1px dashed rgba(0,212,255,0.04)' }} />
      <div className="nos-pulse-ring" style={{ inset:-4, animationDelay:'0s' }} />
      <div className="nos-pulse-ring" style={{ inset:-4, animationDelay:'1s' }} />

      <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'relative', zIndex:1 }}>
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="50%"  stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#00ff9d" />
          </linearGradient>
          <filter id="arcBlur">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {Array.from({ length:60 }, (_,i) => {
          const a = (i/60)*2*Math.PI;
          const isMajor = i%5===0;
          const inner = r-(isMajor?10:5), outer = r-1;
          return (
            <line key={i}
              x1={size/2+Math.cos(a)*inner} y1={size/2+Math.sin(a)*inner}
              x2={size/2+Math.cos(a)*outer} y2={size/2+Math.sin(a)*outer}
              stroke={isMajor?'rgba(0,212,255,0.3)':'rgba(0,212,255,0.1)'}
              strokeWidth={isMajor?1:0.5}
            />
          );
        })}

        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#arcGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }}
          animate={{ strokeDashoffset:circ*(1-pct/100) }}
          transition={{ duration:2.8, ease:[0.16,1,0.3,1] }}
          filter="url(#arcBlur)" className="nos-arc-glow"
        />
        {pct > 1 && (
          <motion.circle
            cx={size/2+Math.cos(endAngle)*r} cy={size/2+Math.sin(endAngle)*r}
            r={5} fill="#00d4ff"
            initial={{ opacity:0, r:0 }} animate={{ opacity:1, r:5 }}
            transition={{ delay:2.5 }}
            style={{ filter:'drop-shadow(0 0 8px #00d4ff) drop-shadow(0 0 20px rgba(0,212,255,0.6))' }}
          />
        )}
      </svg>

      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2 }}>
        <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.6, duration:1, ease:[0.22,1,0.36,1] }}
          style={{ textAlign:'center' }}>
          <div className="nos-mono" style={{ fontSize:9, color:'rgba(0,212,255,0.5)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:4 }}>SYS.MASTERY</div>
          <div className="nos-orb nos-glow-blue" style={{ fontSize:52, fontWeight:900, color:'#00d4ff', lineHeight:1 }}>
            {pct}<span style={{ fontSize:22, color:'rgba(0,212,255,0.5)' }}>%</span>
          </div>
          <div style={{ width:40, height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)', margin:'8px auto' }} />
          <div className="nos-mono" style={{ fontSize:9, color:'rgba(0,255,157,0.6)', letterSpacing:'0.06em', maxWidth:110, lineHeight:1.4 }}>
            {targetRole || 'TARGET.LOCKED'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   DYNAMIC STAT CARD
═══════════════════════════════════════════════ */
const DynamicStatCard = ({ icon, label, value, subValue, accent, code, delay, progress }) => (
  <motion.div className="dynamic-stat"
    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
    transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}>
    <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${accent},transparent)`, opacity:0.5 }} />
    <div style={{ position:'absolute', bottom:0, left:0, width:'40%', height:1, background:accent, opacity:0.25 }} />
    <div style={{ position:'absolute', top:8, right:10 }}>
      <span className="nos-mono" style={{ fontSize:8, color:`${accent}60`, letterSpacing:'0.1em' }}>{code}</span>
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
      <div style={{ width:36, height:36, borderRadius:2, background:`${accent}12`, border:`1px solid ${accent}25`, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
        {icon}
      </div>
      <div>
        <div className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <div className="nos-orb" style={{ fontSize:22, fontWeight:700, color:accent, lineHeight:1, textShadow:`0 0 12px ${accent}80` }}>{value}</div>
          {subValue && <span className="nos-mono" style={{ fontSize:10, color:`${accent}80` }}>{subValue}</span>}
        </div>
      </div>
    </div>
    {progress !== undefined && (
      <div style={{ height:4, width:'100%', background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden', marginTop:8 }}>
        <motion.div
          initial={{ width:0 }} animate={{ width:`${progress}%` }}
          transition={{ duration:1, delay:delay+0.3 }}
          style={{ height:'100%', background:accent, borderRadius:99 }}
        />
      </div>
    )}
  </motion.div>
);

/* ═══════════════════════════════════════════════
   MILESTONE ITEM
═══════════════════════════════════════════════ */
const MilestoneItem = ({ m, index, total, pct, totalCount }) => {
  const done  = m.status === 'completed';
  const cur   = m.status === 'current';
  const isLast = index === total - 1;
  const statusColor = done ? '#00ff9d' : cur ? '#00d4ff' : 'rgba(255,255,255,0.12)';

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:0.35+index*0.1, duration:0.5, ease:[0.22,1,0.36,1] }}
      style={{ display:'flex', gap:0 }}>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:52, flexShrink:0 }}>
        <motion.div whileHover={{ scale:1.1 }}
          style={{
            width:40, height:40,
            clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            background: done?'rgba(0,255,157,0.1)':cur?'rgba(0,212,255,0.1)':'rgba(255,255,255,0.025)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:statusColor,
            opacity: m.status==='upcoming'?0.35:1,
            boxShadow: done?'0 0 18px rgba(0,255,157,0.3)':cur?'0 0 18px rgba(0,212,255,0.3)':'none',
            position:'relative',
          }}>
          <div style={{ position:'absolute', inset:0, clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', border:`1px solid ${statusColor}40`, pointerEvents:'none' }} />
          {done ? <CheckCircle2 size={16}/> : cur ? <Rocket size={16}/> : <Lock size={13}/>}
        </motion.div>
        {!isLast && <div style={{ width:1, flex:1, minHeight:20, background:`linear-gradient(to bottom,${statusColor}30,rgba(255,255,255,0.03))`, margin:'3px 0' }} />}
      </div>

      <div style={{ flex:1, paddingLeft:14, paddingBottom:isLast?0:24 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div>
            <div className="nos-mono" style={{ fontSize:9, letterSpacing:'0.12em', color:statusColor, opacity:0.65, marginBottom:4, textTransform:'uppercase' }}>
              {done?'◆ PHASE.COMPLETE':cur?'▶ PHASE.ACTIVE':'◇ PHASE.LOCKED'} · {String(index+1).padStart(2,'0')}
            </div>
            <h4 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, fontWeight:600, color:m.status==='upcoming'?'rgba(255,255,255,0.18)':'rgba(220,230,255,0.9)', margin:'0 0 6px', lineHeight:1.3 }}>
              {m.title}
            </h4>
            {m.date && <span className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.3)', letterSpacing:'0.06em' }}>LOGGED: {m.date}</span>}
          </div>
          {cur && (
            <div style={{ flexShrink:0, padding:'9px 13px', border:'1px solid rgba(0,212,255,0.2)', background:'rgba(0,212,255,0.04)', minWidth:110 }}>
              <div className="nos-mono" style={{ fontSize:8, color:'rgba(0,212,255,0.45)', letterSpacing:'0.1em', marginBottom:6 }}>ACTIVE.SYNC</div>
              <div style={{ height:3, background:'rgba(0,212,255,0.08)' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width:`${(pct%(100/(totalCount||1)))*(totalCount||1)}%` }}
                  transition={{ duration:1.8, delay:0.8, ease:[0.16,1,0.3,1] }}
                  style={{ height:'100%', background:'linear-gradient(90deg,#00d4ff,#7c3aed)', boxShadow:'0 0 6px rgba(0,212,255,0.5)' }}
                />
              </div>
              <div className="nos-mono" style={{ fontSize:9, color:'#00d4ff', marginTop:5 }}>ACTIVE</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   HUD BAR
═══════════════════════════════════════════════ */
const HudBar = ({ label, children }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
    <div style={{ width:3, height:18, background:'linear-gradient(to bottom,#00d4ff,#7c3aed)', flexShrink:0 }} />
    <div>
      <div className="nos-mono" style={{ fontSize:8, color:'rgba(0,212,255,0.45)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:1 }}>SYSTEM.MODULE</div>
      <h2 className="nos-orb" style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', margin:0, letterSpacing:'0.06em' }}>{label}</h2>
    </div>
    {children && <div style={{ marginLeft:'auto' }}>{children}</div>}
  </div>
);

/* ═══════════════════════════════════════════════
   METRIC BOX — reusable for Efficiency/Latency/Grade
═══════════════════════════════════════════════ */
const MetricBox = ({ label, value, color, hint }) => (
  <div style={{
    flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '20px 12px',
    borderRadius: 4,
    border: '1px solid rgba(0,212,255,0.1)',
    background: 'rgba(0,212,255,0.02)',
    textAlign: 'center',
  }}>
    <div className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.4)', letterSpacing:'0.1em', marginBottom:8 }}>
      {label}
    </div>
    <h4 className="nos-orb" style={{ fontSize:26, fontWeight:700, color, margin:'0 0 10px', textShadow:`0 0 14px ${color}80` }}>
      {value}
    </h4>
    <div style={{ background:'rgba(255,255,255,0.03)', padding:'4px 10px', borderRadius:4, fontSize:8, color:'rgba(255,255,255,0.35)', display:'inline-block' }}>
      {hint}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const ProgressDashboard = ({ embedded = false }) => {
  const { user, dbUser } = useContext(AuthContext);
  const [progressData, setProgressData] = useState(null);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [bootText,     setBootText]     = useState('INIT');

  /* ── Boot animation ── */
  useEffect(() => {
    const texts = ['INIT','AUTH.CHECK','DATA.FETCH','SYNC.NEURAL','READY'];
    let i = 0;
    const iv = setInterval(() => { if (i < texts.length) setBootText(texts[i++]); else clearInterval(iv); }, 220);
    return () => clearInterval(iv);
  }, []);

  /* ── Default / fallback data ── */
  const getDefaultData = () => ({
    progress: {
      percentage: 45,
      targetRole: 'Full Stack Developer',
      missingSkills: ['TypeScript','Docker','GraphQL','AWS'],
      milestones: [
        { title:'HTML/CSS Basics',        status:'completed', date:'2024-03-01' },
        { title:'JavaScript Essentials',  status:'completed', date:'2024-03-10' },
        { title:'React Fundamentals',     status:'current',   date:'In Progress' },
        { title:'Node.js & Express',      status:'upcoming',  date:'TBD' },
        { title:'MongoDB',                status:'upcoming',  date:'TBD' },
        { title:'Full Stack Project',     status:'upcoming',  date:'TBD' },
      ],
      estimatedDays: 58,
      totalStudyHours: 42,
    },
    stats: { points:1660, streak:2, rank:'Bronze Voyager' },
  });

  /* ── Fetch data ── */
  useEffect(() => {
    (async () => {
      try {
        const uid = user?.uid || 'demo-user';
        const [progressRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/progress?uid=${uid}`),
          fetch(`${API_BASE}/api/dashboard/stats/${uid}`).catch(() => ({ json: () => ({}) })),
        ]);
        const progressJson = await progressRes.json();
        const statsJson    = await statsRes.json();

        setProgressData(progressJson.success && progressJson.data ? progressJson.data : getDefaultData().progress);
        setStats(statsJson.success && statsJson.data ? statsJson.data : getDefaultData().stats);
      } catch (e) {
        console.error(e);
        const d = getDefaultData();
        setProgressData(d.progress);
        setStats(d.stats);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* ── Derived values ── */
  const pct            = progressData?.percentage ?? 0;
  const completedCount = progressData?.milestones?.filter(m => m.status === 'completed').length ?? 0;
  const totalCount     = progressData?.milestones?.length ?? 0;
  const missingSkills  = progressData?.missingSkills ?? [];
  const milestones     = progressData?.milestones ?? [];
  const xp             = stats?.points  ?? 0;
  const streak         = stats?.streak  ?? 0;
  const rank           = stats?.rank    ?? 'Voyager';

  const dynamicStats = [
    { icon:<Cpu size={14}/>,          label:'NEURAL XP',  value:xp,                  subValue:rank,        accent:'#00d4ff', code:'XP.01',  delay:0.08, progress:Math.min(100,(xp/2000)*100) },
    { icon:<HiOutlineFire size={14}/>, label:'STREAK',     value:`${streak}d`,        subValue:'Activity',  accent:'#f97316', code:'STR.02', delay:0.14, progress:Math.min(100,(streak/30)*100) },
    { icon:<CheckCircle2 size={14}/>, label:'COMPLETION', value:`${completedCount}/${totalCount}`, subValue:'Milestone', accent:'#00ff9d', code:'CMP.03', delay:0.20, progress:(completedCount/totalCount)*100||0 },
    { icon:<Target size={14}/>,       label:'MASTERY',    value:`${pct}%`,            subValue:'Accuracy',  accent:'#ffb800', code:'MST.04', delay:0.26, progress:pct },
  ];

  const efficiency    = Math.min(100, Math.max(0, (xp/25) + (streak*6))).toFixed(1);
  const latency       = streak>=15?'8ms':streak>=8?'12ms':streak>=3?'18ms':streak>=1?'25ms':'42ms';
  const gradeSystem   = [
    { min:95, grade:'S+', desc:'Genius Tier' },
    { min:85, grade:'S',  desc:'Master Tier' },
    { min:75, grade:'A+', desc:'Elite Skill' },
    { min:60, grade:'A',  desc:'Advanced' },
    { min:0,  grade:'B',  desc:'Growing' },
  ];
  const currentGrade  = gradeSystem.find(g => pct >= g.min) ?? gradeSystem[gradeSystem.length-1];

  /* ── Loading ── */
  if (loading) return (
    <><Styles/>{!embedded && <NeuralBg/>}
      <div style={{ minHeight:embedded?'60vh':'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center' }}>
          <div style={{ width:60, height:60, margin:'0 auto 24px', position:'relative' }}>
            <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
              style={{ width:60, height:60, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.15)', borderTopColor:'#00d4ff', position:'absolute', inset:0 }} />
            <motion.div animate={{ rotate:-360 }} transition={{ duration:3, repeat:Infinity, ease:'linear' }}
              style={{ width:44, height:44, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.2)', borderBottomColor:'#7c3aed', position:'absolute', inset:8 }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Cpu size={18} color="#00d4ff"/>
            </div>
          </div>
          <div className="nos-mono nos-glow-blue" style={{ fontSize:11, color:'#00d4ff', letterSpacing:'0.15em' }}>{bootText}_</div>
        </motion.div>
      </div>
    </>
  );

  /* ── Main render ── */
  return (
    <><Styles/>
      <div className={embedded ? '' : 'nos-root'}>
        {!embedded && <NeuralBg/>}

        <main style={{ position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto', padding:embedded?'10px 0 60px':'16px 24px 100px' }}>

          {/* ══ HERO ══ */}
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
            className="nos-grid-hero">
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'6px 14px', border:'1px solid rgba(0,212,255,0.2)', background:'rgba(0,212,255,0.04)', marginBottom:20 }}>
                <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.4, repeat:Infinity }}
                  style={{ width:6, height:6, borderRadius:'50%', background:'#00ff9d', boxShadow:'0 0 8px #00ff9d' }} />
                <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,212,255,0.6)', letterSpacing:'0.14em', textTransform:'uppercase' }}>
                  NEURAL.OS // PROGRESS.MODULE // ONLINE
                </span>
                <span className="nos-mono" style={{ fontSize:9, color:'rgba(148,163,184,0.3)' }}>
                  {user?.displayName || 'VOYAGER'}
                </span>
              </div>

              <h1 className="nos-orb" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, margin:'0 0 6px', lineHeight:1, color:'transparent', WebkitTextStroke:'1px rgba(0,212,255,0.4)', letterSpacing:'0.06em' }}>
                PROGRESS
              </h1>
              <h1 className="nos-orb nos-glow-blue" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, margin:'0 0 20px', lineHeight:1, color:'#00d4ff', letterSpacing:'0.06em' }}>
                DASHBOARD
              </h1>

              <p style={{ fontFamily:"'Exo 2',sans-serif", fontSize:14, color:'rgba(148,163,184,0.55)', maxWidth:420, lineHeight:1.8, fontWeight:300 }}>
                Real-time neural pathway analytics · Skill acquisition tracking ·{' '}
                <span style={{ color:'rgba(0,212,255,0.7)', fontWeight:500 }}>{pct}% mastery threshold</span> achieved across all learning vectors.
              </p>

              {/* Master progress strip */}
              <div style={{ marginTop:24, maxWidth:460 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,212,255,0.4)', letterSpacing:'0.12em' }}>MASTER.PROGRESS.VECTOR</span>
                  <span className="nos-mono nos-glow-blue" style={{ fontSize:10, color:'#00d4ff' }}>{pct}%</span>
                </div>
                <div style={{ height:8, background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.1)', position:'relative', overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
                    transition={{ duration:2.2, delay:0.3, ease:[0.16,1,0.3,1] }}
                    style={{ height:'100%', background:'linear-gradient(90deg,#7c3aed,#00d4ff,#00ff9d)', position:'relative', boxShadow:'0 0 12px rgba(0,212,255,0.4)' }}>
                    <motion.div animate={{ x:['-100%','200%'] }} transition={{ duration:2, repeat:Infinity, ease:'linear', delay:2.5 }}
                      style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width:'40%' }} />
                  </motion.div>
                  {[25,50,75].map(v => (
                    <div key={v} style={{ position:'absolute', top:0, bottom:0, left:`${v}%`, width:1, background:'rgba(0,0,0,0.4)' }} />
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                  {['INIT','25%','50%','75%','MAX'].map(v => (
                    <span key={v} className="nos-mono" style={{ fontSize:8, color:'rgba(0,212,255,0.2)' }}>{v}</span>
                  ))}
                </div>
              </div>
            </div>

            <MissionRing pct={pct} targetRole={progressData?.targetRole}/>
          </motion.div>

          {/* ══ STATS GRID ══ */}
          <div className="nos-grid-stats">
            {dynamicStats.map((s,i) => <DynamicStatCard key={i} {...s}/>)}
          </div>

          {/* ══ MAIN 2-COL — align-items:stretch keeps heights equal ══ */}
          <div className="nos-grid-main">

            {/* ── LEFT: Milestones + Skill Gaps ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

              {/* Milestones */}
              <motion.div className="nos-panel" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
                style={{ padding:'32px 34px', flex:1 }}>
                <div className="nos-scanline" style={{ animationDelay:'2s' }}/>
                <div className="corner tl"/><div className="corner tr"/>
                <div className="corner bl"/><div className="corner br"/>

                <HudBar label="LEARNING.MILESTONES">
                  <div className="nos-panel" style={{ padding:'4px 12px', display:'flex', alignItems:'center', gap:6 }}>
                    <span className="nos-mono" style={{ fontSize:9, color:'rgba(0,255,157,0.6)', letterSpacing:'0.1em' }}>
                      {completedCount}/{totalCount} VERIFIED
                    </span>
                  </div>
                </HudBar>

                <div style={{ position:'relative' }}>
                  {milestones.map((m,i,arr) => (
                    <MilestoneItem key={i} m={m} index={i} total={arr.length} pct={pct} totalCount={totalCount}/>
                  ))}
                </div>
              </motion.div>

              {/* Skill Gaps */}
              {missingSkills.length > 0 && (
                <motion.div className="nos-panel" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
                  style={{ padding:'28px 32px' }}>
                  <div className="corner tl"/><div className="corner tr"/>
                  <div className="corner bl"/><div className="corner br"/>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,45,120,0.4),transparent)' }}/>

                  <HudBar label="SKILL.GAP.ANALYSIS">
                    <div className="nos-mono" style={{ fontSize:18, fontWeight:700, color:'#ff2d78', textShadow:'0 0 12px rgba(255,45,120,0.6)' }}>
                      {missingSkills.length}
                    </div>
                  </HudBar>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {missingSkills.map((skill,i) => (
                      <motion.span key={i} className="nos-chip"
                        initial={{ opacity:0, scale:0.7, y:10 }}
                        animate={{ opacity:1, scale:1, y:0 }}
                        transition={{ delay:0.5+i*0.04 }}
                        whileHover={{ scale:1.06, y:-3 }}>
                        <Zap size={8}/>{skill.toUpperCase()}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Mission Metrics ── */}
            {/*
                KEY FIX:
                - No position:sticky (that breaks stretch)
                - motion.div gets display:flex + flexDirection:column + height:100%
                - Inner metric boxes each get flex:1 so they expand equally
            */}
            <div style={{ display:'flex', flexDirection:'column' }}>
              <motion.div className="nos-panel"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
                style={{
                  padding:'5px 24px',
                  display:'flex', flexDirection:'column',
                  height:'100%',          /* fill the grid cell */
                }}>
                <div className="corner tl"/><div className="corner tr"/>
                <div className="corner bl"/><div className="corner br"/>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,184,0,0.4),transparent)' }}/>

                <HudBar label="MISSION.METRICS"/>

                {/* Three metric boxes — flex:1 makes each take equal vertical space */}
                <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                  <MetricBox
                    label="EFFICIENCY"
                    value={`${efficiency}%`}
                    color="#00d4ff"
                    hint="(XP/25)+(Streak×6)"
                  />
                  <MetricBox
                    label="LATENCY"
                    value={latency}
                    color="#00ff9d"
                    hint="System heartbeat"
                  />
                  <MetricBox
                    label="SYNC LEVEL"
                    value={currentGrade.grade}
                    color="#ffb800"
                    hint={currentGrade.desc}
                  />
                </div>

              
              </motion.div>
            </div>

          </div>{/* end nos-grid-main */}

          {/* ══ AI RECOMMENDED COURSES ══ */}
          <motion.div className="nos-panel" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
            style={{ marginTop:20, padding:'32px 36px' }}>
            <div className="corner tl"/><div className="corner tr"/>
            <div className="corner bl"/><div className="corner br"/>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(124,58,237,0.6),rgba(0,212,255,0.4),transparent)' }}/>
            <div style={{ position:'absolute', top:0, right:0, width:300, height:300, background:'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 65%)', pointerEvents:'none' }}/>
            <AIRecommendedCourses mode="grid"/>
          </motion.div>

        </main>
      </div>
    </>
  );
};

export default ProgressDashboard;