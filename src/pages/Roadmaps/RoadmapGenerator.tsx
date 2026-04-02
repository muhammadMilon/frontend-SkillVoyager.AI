import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, ArrowRight, Clock, BookOpen, Zap, Target, ChevronRight, Rocket } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const TIMELINE_OPTIONS = ['3 months', '6 months', '1 year', '2 years'];
const STUDY_TIME_OPTIONS = ['1 hour/day', '2 hours/day', '3–4 hours/day', '5+ hours/day'];
const LEARNING_STYLES = [
  { value: 'visual',   label: 'Visual',   icon: '📺' },
  { value: 'reading',  label: 'Reading',  icon: '📚' },
  { value: 'hands-on', label: 'Hands-on', icon: '💻' },
];

const T = {
  teal:    '#17B6A8',
  tealDim: 'rgba(23,182,168,0.08)',
  tealMid: 'rgba(23,182,168,0.18)',
  border:  'rgba(23,182,168,0.20)',
  cyan:    '#0fd4c4',
  gold:    '#F5C842',
  text:    'rgba(255,255,255,0.72)',
  textDim: 'rgba(255,255,255,0.38)',
};

const PHASE_ACCENTS = [
  { border: '#17B6A8', glow: 'rgba(23,182,168,0.12)',  dot: '#17B6A8' },
  { border: '#0fd4c4', glow: 'rgba(15,212,196,0.12)',  dot: '#0fd4c4' },
  { border: '#F5C842', glow: 'rgba(245,200,66,0.10)',  dot: '#F5C842' },
  { border: '#4fc3f7', glow: 'rgba(79,195,247,0.10)',  dot: '#4fc3f7' },
  { border: '#17B6A8', glow: 'rgba(23,182,168,0.12)',  dot: '#17B6A8' },
];

const RoadmapGenerator = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [isLoading, setIsLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    careerGoal: '',
    timeline: '6 months',
    learningStyle: 'visual',
    studyTime: '2 hours/day',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.careerGoal.trim()) { toast.error('Please enter a career goal.'); return; }
    setIsLoading(true); setShowPreview(false); setGeneratedRoadmap(null);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const tryGenerate = async (attempt) => {
      const response = await fetch(`${API_BASE}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.email || 'anonymous', goal: formData.careerGoal, timeline: formData.timeline, learningStyle: formData.learningStyle }),
      });
      const data = await response.json();
      if (!response.ok) {
        const isRateLimit = data.error?.toLowerCase().includes('busy') || data.error?.toLowerCase().includes('quota');
        if (isRateLimit && attempt < 3) {
          const waitSec = attempt * 6;
          toast.info(`AI is busy, retrying in ${waitSec}s… (attempt ${attempt}/3)`, { autoClose: waitSec * 1000 });
          await delay(waitSec * 1000);
          return tryGenerate(attempt + 1);
        }
        throw new Error(data.error || 'Failed to generate roadmap');
      }
      return data;
    };

    try {
      const data = await tryGenerate(1);
      setGeneratedRoadmap(data.roadmap);
      setShowPreview(true);
      toast.success('Roadmap generated successfully! 🎉', {
        style: { background: '#071320', color: '#fff', border: `1px solid ${T.teal}`, borderRadius: '16px' },
        progressStyle: { background: `linear-gradient(90deg, ${T.teal}, ${T.cyan})` }
      });
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoadmap = async () => {
    if (!generatedRoadmap || !user?.uid) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/progress/save-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, roadmapData: generatedRoadmap.roadmapData }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Roadmap saved to your profile! 🚀');
      } else {
        toast.error('Failed to save roadmap.');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Network error while saving.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#05070f' }}>

      {/* ── Hero BG image — UNCHANGED ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1800&q=90"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.32, filter: 'saturate(1.6) brightness(0.65) hue-rotate(-10deg)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(5,4,18,0.5) 0%, rgba(8,5,20,0.65) 35%, rgba(5,7,15,0.92) 72%, #05070f 100%)' }} />

        {/* teal ambient orbs */}
        <motion.div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full blur-[130px]"
          style={{ background: `radial-gradient(circle, rgba(23,182,168,0.10), transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, rgba(15,212,196,0.08), transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[160px] pb-16">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-16">

          {/* section label — teal dash style */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <motion.span
              style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}
              animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }}>
              <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <Sparkles style={{ width: 11, height: 11 }} />
              </motion.span>
              AI Roadmap Generator
            </motion.span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>

          <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 54px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', fontFamily: 'system-ui, sans-serif', margin: '0 0 16px' }}>
            The Map to{' '}
            <span style={{ color: T.teal }}>Your Next Level</span>
          </h1>
          <p style={{ color: T.textDim, fontSize: '1rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
            One goal. Infinite routes. AI finds the sharpest one.
          </p>
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-[2rem] relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0a1828 0%, #0b1e30 55%, #091520 100%)',
            boxShadow: `0 0 0 1px ${T.border}, 0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}>

          {/* animated top border */}
          <motion.div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />

          {/* corner glows */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-[90px] opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${T.teal}, transparent 70%)`, transform: 'translate(-35%, -35%)' }} />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full blur-[70px] opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${T.cyan}, transparent 70%)`, transform: 'translate(25%, 25%)' }} />

          {/* Card header */}
          <div className="px-10 pt-10 pb-0 relative z-10 flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
              <Map style={{ width: 18, height: 18, color: T.teal }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Build Your Roadmap</h2>
              <p className="text-sm mt-0.5" style={{ color: T.textDim }}>Powered by AI • Personalized to you</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6 relative z-10">

            {/* Career Goal + Timeline */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: T.textDim }}>
                  <Target style={{ width: 12, height: 12, color: T.teal }} /> Career Goal
                </label>
                <input type="text" placeholder="e.g., Full Stack Developer"
                  value={formData.careerGoal}
                  onChange={e => setFormData(p => ({ ...p, careerGoal: e.target.value }))}
                  className="w-full px-5 py-3.5 rounded-xl text-white text-base font-semibold outline-none transition-all"
                  style={{ background: T.tealDim, border: `1px solid ${T.border}` }}
                  onFocus={e => { e.target.style.border = `1px solid ${T.teal}`; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
                  onBlur={e => { e.target.style.border = `1px solid ${T.border}`; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: T.textDim }}>
                  <Clock style={{ width: 12, height: 12, color: T.cyan }} /> Timeline
                </label>
                <select value={formData.timeline} onChange={e => setFormData(p => ({ ...p, timeline: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: '#e2e8f0' }}>
                  {TIMELINE_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#071320' }}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Learning Style */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: T.textDim }}>
                <BookOpen style={{ width: 12, height: 12, color: T.gold }} /> Learning Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {LEARNING_STYLES.map(style => (
                  <motion.label key={style.value} whileHover={{ y: -1 }}
                    className="flex items-center gap-2 p-3.5 rounded-xl cursor-pointer transition-all text-sm font-semibold"
                    style={{
                      background: formData.learningStyle === style.value ? T.tealMid : T.tealDim,
                      border: `1px solid ${formData.learningStyle === style.value ? T.teal : T.border}`,
                      color: formData.learningStyle === style.value ? T.teal : T.textDim,
                      boxShadow: formData.learningStyle === style.value ? `0 0 16px rgba(23,182,168,0.15)` : 'none',
                    }}>
                    <input type="radio" name="learningStyle" value={style.value}
                      checked={formData.learningStyle === style.value}
                      onChange={() => setFormData(p => ({ ...p, learningStyle: style.value }))}
                      className="hidden" />
                    {style.icon} {style.label}
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Study Time */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: T.textDim }}>
                <Zap style={{ width: 12, height: 12, color: T.gold }} /> Daily Study Time
              </label>
              <select value={formData.studyTime} onChange={e => setFormData(p => ({ ...p, studyTime: e.target.value }))}
                className="w-full px-5 py-3.5 rounded-xl text-base font-semibold outline-none appearance-none cursor-pointer"
                style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: '#e2e8f0' }}>
                {STUDY_TIME_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#071320' }}>{o}</option>)}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button type="submit" disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              className="relative w-full overflow-hidden rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: '1px' }}>
              <motion.div className="absolute inset-0 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold}, ${T.cyan}, ${T.teal})`, backgroundSize: '400% 400%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
              <div className="relative rounded-xl overflow-hidden m-px flex items-center justify-center gap-2.5 py-4"
                style={{ background: 'linear-gradient(135deg, #071e2e, #060f1a, #071e2e)' }}>
                <motion.div className="absolute inset-0"
                  style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                <div className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(ellipse at 50% 120%, ${T.teal}, transparent 65%)` }} />
                {isLoading ? (
                  <>
                    <motion.div className="w-4 h-4 rounded-full"
                      style={{ border: `2px solid ${T.teal}`, borderTopColor: 'transparent' }}
                      animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
                    <span className="relative text-base font-bold tracking-wide" style={{ color: T.text }}>Generating… Please wait</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="relative" style={{ width: 14, height: 14, color: T.teal }} />
                    <span className="relative text-base font-bold text-white tracking-wide">Generate AI Roadmap</span>
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

        {/* ── Results ── */}
        <AnimatePresence>
          {showPreview && generatedRoadmap && generatedRoadmap.roadmapData && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
              className="mt-6 rounded-[2rem] relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #071320 0%, #0a1828 100%)', boxShadow: `0 0 0 1px ${T.border}, 0 30px 80px rgba(0,0,0,0.5)` }}>

              <motion.div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
                animate={{ backgroundPosition: ['0% 0', '200% 0'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

              <div className="p-10">
                {/* Result header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
                    <Rocket style={{ width: 16, height: 16, color: T.teal }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {generatedRoadmap.roadmapData.title || 'Your Personalized Roadmap'}
                  </h3>
                </div>
                <p className="text-base mb-7 pl-12" style={{ color: T.textDim }}>
                  {generatedRoadmap.roadmapData.description}
                </p>

                {/* Phases */}
                <div className="space-y-4">
                  {generatedRoadmap.roadmapData.phases.map((phase, index) => {
                    const accent = PHASE_ACCENTS[index % PHASE_ACCENTS.length];
                    return (
                      <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                        className="rounded-xl p-5 relative overflow-hidden"
                        style={{ background: T.tealDim, border: `1px solid ${accent.border}28`, boxShadow: `inset 0 0 30px ${accent.glow}` }}>
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                          style={{ background: `linear-gradient(to bottom, transparent, ${accent.border}, transparent)` }} />
                        <h4 className="font-bold text-base mb-1" style={{ color: accent.dot }}>
                          {phase.phaseName} <span style={{ color: T.textDim, fontWeight: 400 }}>({phase.duration})</span>
                        </h4>
                        <p className="text-sm mb-3" style={{ color: T.textDim }}>{phase.description}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.textDim }}>Key Topics</p>
                            <ul className="space-y-1">
                              {phase.topics.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm" style={{ color: T.text }}>
                                  <span style={{ color: accent.dot }} className="mt-0.5 shrink-0">›</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.textDim }}>Resources</p>
                            <ul className="space-y-1">
                              {phase.resources.map((res, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm" style={{ color: T.text }}>
                                  <span style={{ color: accent.dot }} className="mt-0.5 shrink-0">›</span> {res}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link to="/roadmaps/roadmap" className="relative flex-1 overflow-hidden rounded-xl group" style={{ padding: '1px', textDecoration: 'none', display: 'block' }}>
                    <motion.div className="absolute inset-0 rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.teal})`, backgroundSize: '300% 300%' }}
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                    <div className="relative rounded-xl m-px flex items-center justify-center gap-2 py-3.5 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #071e2e, #060f1a)' }}>
                      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)', backgroundSize: '200% 100%' }}
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{ duration: 1.2, repeat: Infinity }} />
                      <ChevronRight className="relative" style={{ width: 14, height: 14, color: T.teal }} />
                      <span className="relative text-sm font-bold text-white tracking-wide">View Full Roadmap</span>
                    </div>
                  </Link>

                  <motion.button type="button" onClick={handleSaveRoadmap}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: T.textDim, cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${T.teal}`; e.currentTarget.style.color = T.teal; e.currentTarget.style.background = T.tealMid; }}
                    onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${T.border}`; e.currentTarget.style.color = T.textDim; e.currentTarget.style.background = T.tealDim; }}>
                    <Sparkles style={{ width: 14, height: 14 }} />
                    Save Roadmap
                  </motion.button>
                </div>
              </div>

              <motion.div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
                animate={{ backgroundPosition: ['200% 0', '0% 0'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default RoadmapGenerator;