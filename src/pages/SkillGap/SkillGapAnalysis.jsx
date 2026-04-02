import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Target, Brain, ArrowRight, Rocket,
    Zap, AlertCircle, Map, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import useAxiosSecure from "../../api/axios";

const T = {
    teal:    '#17B6A8',
    tealDim: 'rgba(23,182,168,0.08)',
    tealMid: 'rgba(23,182,168,0.18)',
    border:  'rgba(23,182,168,0.20)',
    cyan:    '#0fd4c4',
    gold:    '#F5C842',
    text:    'rgba(255,255,255,0.90)',
    textDim: 'rgba(255,255,255,0.58)',
};

const SkillIcon = ({ name }) => {
    const n = name.toLowerCase();
    if (n.includes("python"))                                   return <span className="mr-2">🐍</span>;
    if (n.includes("javascript") || n.includes("js"))          return <span className="mr-2">⚡</span>;
    if (n.includes("react"))                                    return <span className="mr-2">⚛️</span>;
    if (n.includes("node"))                                     return <span className="mr-2">🟢</span>;
    if (n.includes("docker"))                                   return <span className="mr-2">🐳</span>;
    if (n.includes("kubernetes"))                               return <span className="mr-2">☸️</span>;
    if (n.includes("aws") || n.includes("cloud"))              return <span className="mr-2">☁️</span>;
    if (n.includes("sql") || n.includes("database"))           return <span className="mr-2">🗄️</span>;
    if (n.includes("typescript") || n.includes("ts"))          return <span className="mr-2">🟦</span>;
    if (n.includes("pytorch") || n.includes("tensorflow") || n.includes("ml")) return <span className="mr-2">🤖</span>;
    return <span className="mr-2">🛠️</span>;
};

// Premium HD images matching AI / learning / roadmap theme
const heroImages = [
    {
        url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=90",
        alt: "AI Neural Network visualization",
    },
    {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=90",
        alt: "Developer coding on laptop with code on screen",
    },
    {
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=90",
        alt: "Futuristic AI glowing circuits",
    },
];

const SkillGapAnalysis = () => {
    const [targetRole, setTargetRole]     = useState("");
    const [currentSkills, setCurrentSkills] = useState("");
    const [loading, setLoading]           = useState(false);
    const [result, setResult]             = useState(null);
    const axios = useAxiosSecure();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!targetRole || !currentSkills) { toast.error("Please fill in both fields!"); return; }

        setLoading(true); setResult(null);
        try {
            const response = await axios.post("/api/analysis/skill-gap", { targetRole, currentSkills });
            if (response.data) {
                setResult(response.data);
                toast.success("Analysis complete! 🎯", {
                    style: { fontWeight: 'bold', borderRadius: '16px', background: '#071320', color: '#fff', border: `1px solid ${T.teal}` },
                    progressStyle: { background: `linear-gradient(90deg, ${T.teal}, ${T.cyan})` }
                });
            } else throw new Error("Analysis failed");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden pb-20 pt-[120px]"
            style={{ background: 'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)' }}>

            {/* ── Ambient BG ── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
                    style={{ background: `radial-gradient(circle, rgba(23,182,168,0.10), transparent 70%)` }}
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
                    style={{ background: `radial-gradient(circle, rgba(15,212,196,0.07), transparent 70%)` }}
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                {/* dot grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', mask: 'radial-gradient(ellipse at center, black 20%, transparent 80%)', WebkitMask: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">

                {/* ─── HERO ─── */}
                <div className="pt-8 pb-6">

                    {/* Centered Header */}
                    <div className="text-center mb-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            {/* section label */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 28, height: 2, background: T.teal }} />
                                <span style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                        <Brain style={{ width: 12, height: 12 }} />
                                    </motion.span>
                                    AI SKILL NAVIGATOR
                                </span>
                                <div style={{ width: 28, height: 2, background: T.teal }} />
                            </div>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                            style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', fontFamily: 'system-ui, sans-serif', margin: '0 0 16px' }}>
                            Identify Your{' '}
                            <span style={{ color: T.teal }}>Skill Gaps</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            style={{ color: T.textDim, fontSize: '1.1rem', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
                            Enter your target role and current skills. Our AI maps exactly what's missing.
                        </motion.p>
                    </div>

                    {/* Card + Images */}
                    <div className="relative pb-10">
                        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-center">

                            {/* LEFT: Form Card */}
                            <div className="relative z-10 mt-20">
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                    className="rounded-3xl p-7 shadow-2xl relative overflow-hidden"
                                    style={{ background: 'linear-gradient(145deg, #071320 0%, #091a28 55%, #060f1a 100%)', boxShadow: `0 0 0 1px ${T.border}, 0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)` }}>

                                    {/* animated top border */}
                                    <motion.div className="absolute top-0 left-0 right-0 h-px"
                                        style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
                                        animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
                                        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />

                                    {/* corner glow */}
                                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
                                        style={{ background: `radial-gradient(circle, ${T.teal}, transparent 70%)`, transform: 'translate(-30%, -30%)' }} />
                                    <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none"
                                        style={{ background: `radial-gradient(circle, ${T.cyan}, transparent 70%)`, transform: 'translate(20%, 20%)' }} />

                                    {/* card header */}
                                    <div className="flex items-center gap-3 mb-6 relative z-10">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                                            <Map style={{ width: 18, height: 18, color: T.teal }} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white leading-none">Analyze Your Skills</h2>
                                            <p className="text-sm mt-0.5" style={{ color: T.textDim }}>Powered by AI • Personalized to you</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAnalyze} className="space-y-5 relative z-10">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: T.textDim }}>
                                                <Target style={{ width: 13, height: 13, color: T.teal }} /> Target Role
                                            </label>
                                            <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                                placeholder="e.g. Senior ML Engineer"
                                                className="w-full px-5 py-3.5 rounded-2xl text-white font-semibold placeholder:text-slate-500 outline-none transition-all text-sm"
                                                style={{ background: T.tealDim, border: `1px solid ${T.border}` }}
                                                onFocus={e => { e.target.style.border = `1px solid ${T.teal}`; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
                                                onBlur={e => { e.target.style.border = `1px solid ${T.border}`; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: T.textDim }}>
                                                <Zap style={{ width: 13, height: 13, color: T.gold }} /> Current Skills
                                            </label>
                                            <input type="text" value={currentSkills} onChange={e => setCurrentSkills(e.target.value)}
                                                placeholder="e.g. Python, SQL, PyTorch"
                                                className="w-full px-5 py-3.5 rounded-2xl text-white font-semibold placeholder:text-slate-500 outline-none transition-all text-sm"
                                                style={{ background: T.tealDim, border: `1px solid ${T.border}` }}
                                                onFocus={e => { e.target.style.border = `1px solid ${T.teal}`; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
                                                onBlur={e => { e.target.style.border = `1px solid ${T.border}`; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>

                                        {/* Submit */}
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading}
                                            className="relative w-full overflow-hidden rounded-2xl disabled:opacity-50"
                                            style={{ padding: '1px', border: 'none', background: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                            <motion.div className="absolute inset-0 rounded-2xl"
                                                style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold}, ${T.cyan}, ${T.teal})`, backgroundSize: '400% 400%' }}
                                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                                            <div className="relative rounded-2xl m-px flex items-center justify-center gap-3 py-4 overflow-hidden"
                                                style={{ background: 'linear-gradient(135deg, #071e2e, #060f1a, #071e2e)' }}>
                                                <motion.div className="absolute inset-0"
                                                    style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)', backgroundSize: '200% 100%' }}
                                                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                                                <div className="absolute inset-0 opacity-20"
                                                    style={{ background: `radial-gradient(ellipse at 50% 120%, ${T.teal}, transparent 65%)` }} />
                                                {loading ? (
                                                    <>
                                                        <motion.div className="w-5 h-5 rounded-full relative"
                                                            style={{ border: `2px solid ${T.teal}`, borderTopColor: 'transparent' }}
                                                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                        <span className="relative text-base font-bold" style={{ color: T.text }}>Analyzing Your Career Path...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="relative" style={{ width: 16, height: 16, color: T.teal }} />
                                                        <span className="relative text-base font-bold text-white">Analyze Skills & Generate Guide</span>
                                                        <ArrowRight className="relative" style={{ width: 16, height: 16, color: T.teal }} />
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </form>

                                    {/* animated bottom line */}
                                    <motion.div className="absolute bottom-0 left-0 right-0 h-px"
                                        style={{ background: `linear-gradient(90deg, transparent, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
                                        animate={{ backgroundPosition: ['200% 0', '0% 0'] }}
                                        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />
                                </motion.div>

                                {/* Stats row */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                    className="flex items-center gap-6 mt-5 px-1">
                                    {[
                                        { label: "Roles Analyzed", value: "10K+" },
                                        { label: "Avg. Time",      value: "< 3s"  },
                                        { label: "Accuracy",       value: "94%"   }
                                    ].map((s, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-white font-black text-xl">{s.value}</div>
                                            <div className="text-sm font-semibold" style={{ color: T.textDim }}>{s.label}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* RIGHT: Images */}
                            <div className="hidden lg:block relative">
                                {/* dashed border */}
                                <div className="absolute rounded-3xl pointer-events-none"
                                    style={{ inset: '0 -8px -24px -200px', border: `1px dashed rgba(23,182,168,0.25)` }}>
                                    {[{ style: { top: 10, left: 10 } }, { style: { top: 10, right: 10 } }, { style: { bottom: 10, left: 10 } }, { style: { bottom: 10, right: 10 } }].map((dot, i) => (
                                        <div key={i} className="absolute w-2 h-2 rounded-full" style={{ ...dot.style, background: T.teal, opacity: 0.5 }} />
                                    ))}
                                </div>

                                {/* Image grid */}
                                <div className="grid grid-cols-2 gap-3 h-[440px] relative z-10">
                                    {/* Left tall — AI/roadmap scene */}
                                    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }} className="row-span-2 rounded-2xl overflow-hidden relative group">
                                        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800https://images.unsplash.com/photo-1717501218636-a390f9ac5957?w=600&q=90q=95"
                                            alt="AI learning path visualization"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,19,32,0.65), transparent)` }} />
                                        {/* teal shimmer overlay */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `linear-gradient(135deg, rgba(23,182,168,0.12), transparent)` }} />
                                    </motion.div>

                                    {/* Top right — coding/tech */}
                                    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden relative group">
                                        <img src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=90q=95"
                                            alt="Developer focused on code"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,19,32,0.55), transparent)` }} />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `linear-gradient(135deg, rgba(15,212,196,0.12), transparent)` }} />
                                    </motion.div>

                                    {/* Bottom right — data/AI */}
                                    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden relative group">
                                        <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&q=90q=95"
                                            alt="AI neural network visualization"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,19,32,0.55), transparent)` }} />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `linear-gradient(135deg, rgba(245,200,66,0.10), transparent)` }} />
                                    </motion.div>
                                </div>

                                {/* Floating badge */}
                                <motion.div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 flex items-center gap-2 shadow-xl whitespace-nowrap z-20"
                                    style={{ background: '#0a1828', border: `1px solid ${T.border}` }}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                                    <motion.div className="w-2 h-2 rounded-full" style={{ background: T.teal }}
                                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                    <span className="text-xs font-black" style={{ color: T.text }}>AI Analysis Ready</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── RESULTS ─── */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                            transition={{ type: "spring", stiffness: 100 }} className="space-y-6 pb-10">

                            {/* Missing Skills Card */}
                            {result.missingSkills && (
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="rounded-[2rem] relative overflow-hidden"
                                    style={{ background: 'linear-gradient(145deg, #060f1a 0%, #081826 40%, #060e18 100%)', boxShadow: `0 0 0 1px ${T.border}, 0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)` }}>

                                    <motion.div className="absolute top-0 left-0 right-0 h-px"
                                        style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
                                        animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

                                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
                                        style={{ background: `radial-gradient(circle, ${T.teal}, transparent 70%)`, transform: 'translate(-30%, -30%)' }} />
                                    <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none"
                                        style={{ background: `radial-gradient(circle, ${T.cyan}, transparent 70%)`, transform: 'translate(20%, 20%)' }} />

                                    <div className="p-8 md:p-10 relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                                                    <AlertCircle style={{ width: 18, height: 18, color: T.teal }} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white tracking-tight leading-none">Missing Critical Assets</h3>
                                                    <p className="text-xs font-medium mt-1" style={{ color: T.textDim }}>
                                                        {result.missingSkills.length} skills to acquire
                                                    </p>
                                                </div>
                                            </div>
                                            {/* live badge */}
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                                style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                                                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: T.teal }}
                                                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: T.teal }}>AI Detected</span>
                                            </div>
                                        </div>

                                        {/* Skill chips */}
                                        <div className="flex flex-wrap gap-2.5 mb-8">
                                            {result.missingSkills.map((skill, i) => (
                                                <motion.span key={i}
                                                    initial={{ opacity: 0, scale: 0.75, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ delay: 0.25 + (i * 0.06), type: 'spring', stiffness: 250 }}
                                                    whileHover={{ y: -3, scale: 1.05 }}
                                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-base font-semibold cursor-default"
                                                    style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: T.teal, boxShadow: `0 0 14px rgba(23,182,168,0.12)` }}>
                                                    <SkillIcon name={skill} />{skill}
                                                </motion.span>
                                            ))}
                                        </div>

                                        {/* Summary quote */}
                                        <div className="rounded-2xl p-5 relative overflow-hidden"
                                            style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                                            <motion.div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                                                style={{ background: `linear-gradient(to bottom, transparent, ${T.teal}, ${T.cyan}, transparent)` }}
                                                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                                            <p className="text-sm leading-relaxed italic pl-4 font-medium" style={{ color: T.text }}>
                                                "{result.summary || "This is your primary path to success."}"
                                            </p>
                                        </div>
                                    </div>

                                    <motion.div className="absolute bottom-0 left-0 right-0 h-px"
                                        style={{ background: `linear-gradient(90deg, transparent, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
                                        animate={{ backgroundPosition: ['200% 0', '0% 0'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                                </motion.div>
                            )}

                            {/* Detailed Guide */}
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                className="rounded-[2rem] p-8 md:p-12"
                                style={{ background: 'linear-gradient(135deg, #050d18 0%, #071525 100%)', border: `1px solid ${T.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.20)' }}>
                                        <Sparkles style={{ width: 16, height: 16, color: T.gold }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Personalized Career Bridge</h3>
                                </div>

                                <div className="prose prose-sm prose-invert max-w-none
                                    prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight
                                    prose-headings:text-white prose-headings:text-base
                                    prose-li:font-normal prose-ul:list-disc prose-ul:pl-5
                                    prose-a:no-underline hover:prose-a:underline"
                                    style={{ '--tw-prose-body': T.text, '--tw-prose-strong': T.teal, '--tw-prose-links': T.cyan }}>
                                    <ReactMarkdown>{result.guide}</ReactMarkdown>
                                </div>

                                {/* Time to Authority + CTA */}
                                {result.estimatedMonths && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                        className="mt-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 p-6 relative overflow-hidden"
                                        style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>

                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                                style={{ background: 'rgba(245,200,66,0.10)', border: '1px solid rgba(245,200,66,0.20)' }}>
                                                <Rocket style={{ width: 20, height: 20, color: T.gold }} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: T.textDim }}>Time to Authority</p>
                                                <h4 className="text-3xl font-black text-white leading-none mt-0.5">
                                                    {result.estimatedMonths} <span className="text-lg font-semibold" style={{ color: T.textDim }}>Months</span>
                                                </h4>
                                            </div>
                                        </div>

                                        {/* CTA button */}
                                        <Link to="/roadmap/generate"
                                            className="relative w-full md:w-auto group overflow-hidden rounded-2xl active:scale-95 z-10 shrink-0"
                                            style={{ padding: '1px', textDecoration: 'none', display: 'block' }}>
                                            <motion.div className="absolute inset-0 rounded-2xl"
                                                style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold}, ${T.cyan}, ${T.teal})`, backgroundSize: '400% 400%' }}
                                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
                                            <div className="relative rounded-2xl overflow-hidden m-px"
                                                style={{ background: 'linear-gradient(135deg, #071e2e, #060f1a, #071e2e)' }}>
                                                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)', backgroundSize: '200% 100%' }}
                                                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
                                                <div className="absolute inset-0 opacity-20"
                                                    style={{ background: `radial-gradient(ellipse at 50% 100%, ${T.teal}, transparent 70%)` }} />
                                                <span className="relative flex items-center justify-center gap-2.5 px-9 py-4 text-white font-bold text-sm tracking-wide">
                                                    <Sparkles style={{ width: 14, height: 14, color: T.teal }} />
                                                    Build Smart Roadmap
                                                    <ArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" style={{ width: 16, height: 16, color: T.teal }} />
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="absolute right-0 top-0 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
                                            style={{ background: T.teal, transform: 'translate(30%, -30%)' }} />
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;