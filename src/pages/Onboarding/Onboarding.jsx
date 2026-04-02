import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../api/axios';
import {
    User, GraduationCap, Code2, Target, Clock,
    ChevronRight, ChevronLeft, CheckCircle2, Sparkles,
    Brain, Rocket, Zap, Heart, BookOpen, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Data ────────────────────────────────────────────────────────────────────

const ROLES = [
    { id: 'student', label: 'Student', icon: '🎓', desc: 'Crafting the future' },
    { id: 'fresh_graduate', label: 'Graduate', icon: '🏫', desc: 'Ready for takeoff' },
    { id: 'professional', label: 'Pro Voyager', icon: '💼', desc: 'Upskilling journey' },
];

const EDUCATION_LEVELS = [
    'HSC / A-Level',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Bootcamp Graduate'
];

const SKILLS_LIST = [
    { cat: 'Programming', items: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript'] },
    { cat: 'Web Architecture', items: ['React', 'Next.js', 'Node.js', 'Django', 'FastAPI'] },
    { cat: 'Intelligence', items: ['Machine Learning', 'Data Science', 'AI APIs', 'Prompt Eng.'] },
    { cat: 'Infrastructure', items: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Git'] },
];

const CAREERS = [
    { id: 'frontend', label: 'Frontend Wizard', icon: '🎨' },
    { id: 'backend', label: 'Systems Architect', icon: '⚙️' },
    { id: 'fullstack', label: 'Full Stack Titan', icon: '🔄' },
    { id: 'ai_engineer', label: 'AI Specialist', icon: '🤖' },
    { id: 'data_scientist', label: 'Data Alchemist', icon: '📊' },
    { id: 'devops', label: 'Cloud Navigator', icon: '🚀' },
];

const TIMELINES = [
    { months: 3, label: '3 Months', desc: 'Supercharged velocity' },
    { months: 6, label: '6 Months', desc: 'Optimal equilibrium' },
    { months: 12, label: '12 Months', desc: 'Steady masterclass' },
];

// ── Components ──────────────────────────────────────────────────────────────

const StepIndicator = ({ current, total }) => (
    <div className="flex items-center justify-center gap-4  mb-12">
        {Array.from({ length: total }).map((_, i) => (
            <React.Fragment key={i}>
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl font-black text-xs transition-all duration-500
                    ${i < current ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : ''}
                    ${i === current ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : ''}
                    ${i > current ? 'bg-slate-800 text-slate-500' : ''}`}>
                    {i < current ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    {i === current && (
                        <motion.div
                            layoutId="indicator-glow"
                            className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-pulse"
                        />
                    )}
                </div>
                {i < total - 1 && (
                    <div className="h-0.5 w-10 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: i < current ? '100%' : '0%' }}
                            className="h-full bg-indigo-500"
                        />
                    </div>
                )}
            </React.Fragment>
        ))}
    </div>
);

// ── Main Component ──────────────────────────────────────────────────────────

const Onboarding = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axios = useAxiosSecure();

    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        role: '',
        bio: '',
        education: '',
        institution: '',
        skills: [],
        targetCareer: '',
        timeline: null,
    });

    const go = (next) => { setStep(next); };

    const toggleSkill = (skill) =>
        setForm(f => ({
            ...f,
            skills: f.skills.includes(skill)
                ? f.skills.filter(s => s !== skill)
                : [...f.skills, skill],
        }));

    const canNext = () => {
        if (step === 0) return form.role && form.bio.length > 10;
        if (step === 1) return form.education && form.institution;
        if (step === 2) return form.skills.length > 0;
        if (step === 3) return form.targetCareer && form.timeline;
        return false;
    };

    const handleSubmit = async () => {
        if (!user?.uid) { toast.error('Identity required to launch'); return; }
        setSaving(true);
        try {
            const res = await axios.post('/api/user/onboarding', {
                uid: user.uid,
                ...form
            });
            if (res.data.success) {
                toast.success('Voyage Profile Synchronized! 🛰️');
                navigate('/dashboard');
            } else {
                toast.error(res.data.message || 'Transmission failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Sector interference. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const stepVariants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-4 py-16 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

            <div className="w-full max-w-3xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-indigo-500/5">
                        <Sparkles className="w-3 h-3" /> System Integration
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
                        Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Voyage</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto italic">
                        Configure your AI-powered learning vector in just 4 steps.
                    </p>
                </motion.div>

                {/* Main Glass Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black"
                >
                    <StepIndicator current={step} total={4} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            {step === 0 && (
                                <div className="space-y-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <h2 className="text-2xl font-black text-white">Identity Context</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {ROLES.map(r => (
                                                <button key={r.id} onClick={() => setForm(f => ({ ...f, role: r.id }))}
                                                    className={`p-6 rounded-[2rem] border-2 text-center transition-all duration-300 group
                                                        ${form.role === r.id
                                                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
                                                            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'}`}>
                                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{r.icon}</div>
                                                    <div className="font-black text-sm text-white">{r.label}</div>
                                                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{r.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <PenTool className="w-5 h-5 text-indigo-400" />
                                            <h3 className="text-lg font-black text-white">Short Bio</h3>
                                        </div>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                                            placeholder="Write a few words about your passion and drive..."
                                            className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all min-h-[100px] text-slate-300"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Min 10 characters required</p>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <h2 className="text-2xl font-black text-white">Academic Level</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {EDUCATION_LEVELS.map(edu => (
                                                <button key={edu} onClick={() => setForm(f => ({ ...f, education: edu }))}
                                                    className={`px-6 py-3 rounded-2xl border-2 text-sm font-black transition-all duration-300
                                                        ${form.education === edu
                                                            ? 'border-purple-500 bg-purple-500/10 text-white'
                                                            : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                                                    {edu}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <BookOpen className="w-5 h-5 text-purple-400" />
                                            <h3 className="text-lg font-black text-white">Institution Name</h3>
                                        </div>
                                        <input
                                            type="text"
                                            value={form.institution}
                                            onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))}
                                            placeholder="e.g. Stanford University, MIT, or Self-taught"
                                            className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl p-4 text-sm focus:border-purple-500 outline-none transition-all text-slate-300"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                <Code2 className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <h2 className="text-2xl font-black text-white">Skill Matrix</h2>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                                            {form.skills.length} Loaded
                                        </span>
                                    </div>

                                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {SKILLS_LIST.map(cat => (
                                            <div key={cat.cat}>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-l-2 border-indigo-500 pl-3">{cat.cat}</p>
                                                <div className="flex flex-wrap gap-2 text-glow">
                                                    {cat.items.map(skill => (
                                                        <button key={skill} onClick={() => toggleSkill(skill)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all duration-300
                                                                ${form.skills.includes(skill)
                                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}>
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                                <Target className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <h2 className="text-2xl font-black text-white">Strategic Objective</h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {CAREERS.map(c => (
                                                <button key={c.id} onClick={() => setForm(f => ({ ...f, targetCareer: c.id }))}
                                                    className={`group flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300
                                                        ${form.targetCareer === c.id
                                                            ? 'border-pink-500 bg-pink-500/5'
                                                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}>
                                                    <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{c.icon}</span>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest text-center">{c.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <h2 className="text-2xl font-black text-white">Temporal Goal</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {TIMELINES.map(t => (
                                                <button key={t.months} onClick={() => setForm(f => ({ ...f, timeline: t.months }))}
                                                    className={`p-6 rounded-[2rem] border-2 text-center transition-all duration-300
                                                        ${form.timeline === t.months
                                                            ? 'border-orange-500 bg-orange-500/5'
                                                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}>
                                                    <div className="font-black text-orange-400 text-xl tracking-tighter">{t.label}</div>
                                                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{t.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom Navigation */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-slate-800/50">
                        <button
                            onClick={() => go(step - 1)}
                            disabled={step === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                                ${step === 0
                                    ? 'opacity-20 cursor-not-allowed'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => go(step + 1)}
                                disabled={!canNext()}
                                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                                    ${canNext()
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!canNext() || saving}
                                className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                                    ${canNext() && !saving
                                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-2xl shadow-indigo-600/20 active:scale-95'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Save Profile <Rocket className="w-4 h-4" /></>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Ambient Status Footer */}
                <div className="flex justify-center mt-8 space-x-8">
                    <StatusDot active={step === 0} label="Identity" />
                    <StatusDot active={step === 1} label="Academic" />
                    <StatusDot active={step === 2} label="Skills" />
                    <StatusDot active={step === 3} label="Objective" />
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
                .text-glow { text-shadow: 0 0 15px rgba(99, 102, 241, 0.2); }
            `}</style>
        </div>
    );
};

const StatusDot = ({ active, label }) => (
    <div className={`flex items-center gap-2 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-20'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-600'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
);

export default Onboarding;
