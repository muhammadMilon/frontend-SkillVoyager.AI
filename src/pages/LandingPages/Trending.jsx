import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Sparkles, Award, BarChart3, Users,
    Clock, Zap, Brain, Code, Database, Cloud, Shield, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressBar = ({ skill }) => {
    const [pct] = useState(() => Math.floor(Math.random() * 30 + 70));
    return (
        <div>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'rgba(255,255,255,0.38)',
                marginBottom: 6, fontWeight: 500,
                fontFamily: 'system-ui, sans-serif'
            }}>
                <span>Market demand</span>
                <span style={{ color: skill.accentColor, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ width: '100%', height: 3, borderRadius: 100, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: skill.delay, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 100, background: skill.progressColor, boxShadow: `0 0 8px ${skill.glowColor}` }}
                />
            </div>
        </div>
    );
};

const Trending = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [hoveredSkill, setHoveredSkill] = useState(null);

    const categories = [
        { id: 'all',  label: 'All Skills',  icon: <Sparkles className="w-4 h-4" /> },
        { id: 'ai',   label: 'AI & ML',     icon: <Brain className="w-4 h-4" /> },
        { id: 'dev',  label: 'Development', icon: <Code className="w-4 h-4" /> },
        { id: 'data', label: 'Data',        icon: <Database className="w-4 h-4" /> },
    ];

    const trendingSkills = [
        {
            id: 1, icon: <Brain className="w-7 h-7" />,
            title: "AI & Machine Learning", description: "Master LLMs, neural networks, and AI agents",
            demand: "High Demand", growth: "+245%", learners: "15.2k", category: "ai",
            accentColor: "#17B6A8", glowColor: "rgba(23,182,168,0.30)", borderGlow: "rgba(23,182,168,0.50)",
            iconBg: "rgba(23,182,168,0.12)", progressColor: "linear-gradient(90deg, #17B6A8, #0fd4c4)",
            skills: ["Python", "TensorFlow", "PyTorch", "LangChain"], trending: true, delay: 0.1,
        },
        {
            id: 2, icon: <Code className="w-7 h-7" />,
            title: "Full Stack Development", description: "Build complete web applications with modern stacks",
            demand: "Very High Demand", growth: "+180%", learners: "24.7k", category: "dev",
            accentColor: "#0fd4c4", glowColor: "rgba(15,212,196,0.25)", borderGlow: "rgba(15,212,196,0.45)",
            iconBg: "rgba(15,212,196,0.10)", progressColor: "linear-gradient(90deg, #17B6A8, #0fd4c4)",
            skills: ["React", "Node.js", "TypeScript", "Next.js"], trending: true, delay: 0.2,
        },
        {
            id: 3, icon: <Database className="w-7 h-7" />,
            title: "Data Science", description: "Extract insights and build predictive models",
            demand: "High Demand", growth: "+210%", learners: "18.9k", category: "data",
            accentColor: "#F5C842", glowColor: "rgba(245,200,66,0.22)", borderGlow: "rgba(245,200,66,0.42)",
            iconBg: "rgba(245,200,66,0.10)", progressColor: "linear-gradient(90deg, #f0b429, #F5C842)",
            skills: ["Python", "SQL", "Pandas", "Tableau"], trending: true, delay: 0.3,
        },
        {
            id: 4, icon: <Cloud className="w-7 h-7" />,
            title: "Cloud Computing", description: "Design and deploy scalable cloud solutions",
            demand: "High Demand", growth: "+165%", learners: "12.3k", category: "dev",
            accentColor: "#17B6A8", glowColor: "rgba(23,182,168,0.20)", borderGlow: "rgba(23,182,168,0.38)",
            iconBg: "rgba(23,182,168,0.10)", progressColor: "linear-gradient(90deg, #0d9e92, #17B6A8)",
            skills: ["AWS", "Azure", "Docker", "Kubernetes"], trending: false, delay: 0.4,
        },
        {
            id: 5, icon: <Shield className="w-7 h-7" />,
            title: "Cybersecurity", description: "Protect systems and networks from threats",
            demand: "Critical Demand", growth: "+195%", learners: "9.8k", category: "ai",
            accentColor: "#fde68a", glowColor: "rgba(253,230,138,0.20)", borderGlow: "rgba(253,230,138,0.38)",
            iconBg: "rgba(245,200,66,0.10)", progressColor: "linear-gradient(90deg, #F5C842, #fde68a)",
            skills: ["Network Security", "Ethical Hacking", "Cryptography"], trending: true, delay: 0.5,
        },
        {
            id: 6, icon: <Smartphone className="w-7 h-7" />,
            title: "Mobile Development", description: "Create iOS and Android applications",
            demand: "Steady Demand", growth: "+120%", learners: "14.2k", category: "dev",
            accentColor: "#0fd4c4", glowColor: "rgba(15,212,196,0.18)", borderGlow: "rgba(15,212,196,0.35)",
            iconBg: "rgba(15,212,196,0.09)", progressColor: "linear-gradient(90deg, #0d9e92, #0fd4c4)",
            skills: ["React Native", "Flutter", "Swift", "Kotlin"], trending: false, delay: 0.6,
        },
    ];

    const filteredSkills = activeTab === 'all' ? trendingSkills : trendingSkills.filter(s => s.category === activeTab);

    return (
        <section id="trending" style={{
            position: 'relative', padding: '100px 24px', overflow: 'hidden',
            fontFamily: 'system-ui, sans-serif',
            background: 'linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)',
        }}>

            {/* BG */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(23,182,168,0.015) 80px, rgba(23,182,168,0.015) 81px)` }} />
                <motion.div style={{ position: 'absolute', borderRadius: '50%', width: 700, height: 700, top: -200, right: -150, background: 'radial-gradient(circle, rgba(23,182,168,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div style={{ position: 'absolute', borderRadius: '50%', width: 600, height: 600, bottom: -150, left: -100, background: 'radial-gradient(circle, rgba(15,212,196,0.09) 0%, transparent 70%)', filter: 'blur(90px)' }} animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div style={{ position: 'absolute', borderRadius: '50%', width: 500, height: 500, top: '30%', left: '30%', background: 'radial-gradient(circle, rgba(245,200,66,0.05) 0%, transparent 65%)', filter: 'blur(70px)' }} animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
                <motion.div style={{ position: 'absolute', borderRadius: '50%', width: 300, height: 300, top: '8%', left: '8%', background: 'radial-gradient(circle, rgba(15,212,196,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} animate={{ x: [0, 18, 0], y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }} />
                {[
                    { cx: '15%', cy: '20%', size: 4, color: 'rgba(23,182,168,0.60)', dur: 4 },
                    { cx: '85%', cy: '15%', size: 3, color: 'rgba(15,212,196,0.50)', dur: 5 },
                    { cx: '75%', cy: '70%', size: 5, color: 'rgba(245,200,66,0.40)',  dur: 6 },
                    { cx: '10%', cy: '75%', size: 3, color: 'rgba(23,182,168,0.45)', dur: 7 },
                    { cx: '50%', cy: '85%', size: 4, color: 'rgba(15,212,196,0.35)', dur: 5 },
                ].map((orb, i) => (
                    <motion.div key={i} style={{ position: 'absolute', left: orb.cx, top: orb.cy, width: orb.size, height: orb.size, borderRadius: '50%', background: orb.color, boxShadow: `0 0 ${orb.size * 3}px ${orb.color}` }} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }} />
                ))}
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>

                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 52 }}>

                    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
                        <span style={{ color: '#17B6A8', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>Market Insights</span>
                        <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ fontSize: 'clamp(34px, 4.5vw, 54px)', fontWeight: '800', letterSpacing: '-1px', lineHeight: 1.1, color: '#fff', fontFamily: 'system-ui, sans-serif', margin: '0 0 16px' }}>
                        Trending{' '}<span style={{ color: '#17B6A8' }}>Skills</span>
                    </motion.h2>

                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.32 }} style={{ color: 'rgba(255,255,255,0.50)', fontSize: '16px', lineHeight: '1.7', maxWidth: '460px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
                        Stay ahead with the most in-demand skills shaping the future of tech careers.
                    </motion.p>

                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ height: 1, maxWidth: 300, margin: '28px auto 0', transformOrigin: 'center', background: 'linear-gradient(90deg, transparent, #17B6A8, #F5C842, #17B6A8, transparent)' }} />
                </motion.div>

                {/* FILTERS */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
                    {categories.map((category, index) => (
                        <motion.button key={category.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + index * 0.08, type: 'spring', stiffness: 200 }} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(category.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease', outline: 'none', fontFamily: 'system-ui, sans-serif', ...(activeTab === category.id ? { background: 'linear-gradient(135deg, #17B6A8, #0d9e92)', color: '#fff', border: 'none', boxShadow: '0 4px 20px rgba(23,182,168,0.40)' } : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(23,182,168,0.18)', backdropFilter: 'blur(10px)' }) }}>
                            <motion.div animate={activeTab === category.id ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.5 }}>{category.icon}</motion.div>
                            {category.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* GRID */}
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                    <AnimatePresence mode="popLayout">
                        {filteredSkills.map((skill) => (
                            <motion.div key={skill.id} layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.96 }} transition={{ duration: 0.4, delay: skill.delay * 0.5 }} whileHover={{ y: -6, scale: 1.015 }} onHoverStart={() => setHoveredSkill(skill.id)} onHoverEnd={() => setHoveredSkill(null)} style={{ position: 'relative', borderRadius: 20, padding: 24, cursor: 'pointer', overflow: 'hidden', background: hoveredSkill === skill.id ? 'linear-gradient(145deg, rgba(23,182,168,0.08) 0%, rgba(255,255,255,0.03) 100%)' : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: `1px solid ${hoveredSkill === skill.id ? skill.borderGlow : 'rgba(23,182,168,0.12)'}`, boxShadow: hoveredSkill === skill.id ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${skill.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)` : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)', transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)' }}>

                                <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: `radial-gradient(ellipse at 50% 0%, ${skill.glowColor} 0%, transparent 60%)`, opacity: hoveredSkill === skill.id ? 0.5 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }} />

                                {skill.trending && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'absolute', top: 18, right: 18, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, background: `linear-gradient(135deg, ${skill.accentColor}18, ${skill.accentColor}10)`, border: `1px solid ${skill.accentColor}45`, color: skill.accentColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', backdropFilter: 'blur(8px)', fontFamily: 'system-ui, sans-serif' }}>
                                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><Zap style={{ width: 11, height: 11 }} /></motion.span>
                                        HOT
                                    </motion.div>
                                )}

                                <motion.div whileHover={{ scale: 1.1, rotate: 8 }} transition={{ type: 'spring', stiffness: 300 }} style={{ width: 56, height: 56, borderRadius: 16, background: skill.iconBg, border: `1px solid ${skill.accentColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: `0 4px 20px ${skill.glowColor}`, color: skill.accentColor }}>
                                    {skill.icon}
                                </motion.div>

                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.3px', fontFamily: 'system-ui, sans-serif' }}>{skill.title}</h3>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>{skill.description}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
                                    {[
                                        { label: 'Demand',   value: skill.demand.split(' ')[0] },
                                        { label: 'Growth',   value: skill.growth, highlight: true },
                                        { label: 'Learners', value: skill.learners },
                                    ].map((stat, i) => (
                                        <div key={i} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 12, background: 'rgba(23,182,168,0.05)', border: '1px solid rgba(23,182,168,0.12)' }}>
                                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 4, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>{stat.label}</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: stat.highlight ? '#17B6A8' : skill.accentColor, fontFamily: 'system-ui, sans-serif' }}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                                    {skill.skills.map((item, idx) => (
                                        <motion.span key={idx} whileHover={{ scale: 1.07 }} style={{ padding: '4px 11px', borderRadius: 8, background: `${skill.accentColor}10`, border: `1px solid ${skill.accentColor}25`, color: skill.accentColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', fontFamily: 'system-ui, sans-serif' }}>{item}</motion.span>
                                    ))}
                                </div>

                                <ProgressBar skill={skill} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* BOTTOM STATS */}
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 720, margin: '52px auto 0' }}>
                    {[
                        { icon: <Users style={{ width: 16, height: 16 }} />,     label: 'Active Learners',  value: '15.2k+',    color: '#17B6A8' },
                        { icon: <BarChart3 style={{ width: 16, height: 16 }} />, label: 'Avg. Growth',      value: '+185%',     color: '#F5C842' },
                        { icon: <Clock style={{ width: 16, height: 16 }} />,     label: 'Updated Daily',    value: 'Real-time', color: '#0fd4c4' },
                        { icon: <Award style={{ width: 16, height: 16 }} />,     label: 'Certified Paths',  value: '50+',       color: '#17B6A8' },
                    ].map((stat, index) => (
                        <motion.div key={index} whileHover={{ y: -5, scale: 1.03 }} style={{ textAlign: 'center', padding: '18px 12px', borderRadius: 16, background: `linear-gradient(135deg, ${stat.color}10 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${stat.color}22`, backdropFilter: 'blur(12px)', transition: 'all 0.3s ease' }}>
                            <div style={{ color: stat.color, display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{stat.icon}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3, fontFamily: 'system-ui, sans-serif' }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 500, fontFamily: 'system-ui, sans-serif' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* VIEW ALL */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} style={{ textAlign: 'center', marginTop: 36 }}>
                   <motion.div whileHover={{ scale: 1.04 }}>
  <Link
    to="/api/topics"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 28px',
      borderRadius: 100,
      background: 'rgba(23,182,168,0.10)',
      border: '1px solid rgba(23,182,168,0.30)',
      color: '#17B6A8',
      fontSize: 14,
      fontWeight: 600,
      textDecoration: 'none',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(23,182,168,0.12)',
      transition: 'all 0.3s ease',
      fontFamily: 'system-ui, sans-serif'
    }}
  >
    View all 50+ skills
    <motion.span
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <TrendingUp style={{ width: 16, height: 16 }} />
    </motion.span>
  </Link>
</motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default Trending;