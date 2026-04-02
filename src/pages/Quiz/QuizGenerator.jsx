import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Target, Zap } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const T = {
  bg:      'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)',
  card:    'linear-gradient(145deg, #071320 0%, #091a28 55%, #060f1a 100%)',
  teal:    '#17B6A8',
  tealDim: 'rgba(23,182,168,0.09)',
  tealMid: 'rgba(23,182,168,0.20)',
  border:  'rgba(23,182,168,0.22)',
  cyan:    '#0fd4c4',
  gold:    '#F5C842',
  text:    'rgba(255,255,255,0.90)',
  textDim: 'rgba(255,255,255,0.55)',
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const QuizGenerator = () => {
  const navigate    = useNavigate();
  const authContext = useContext(AuthContext);
  const user        = authContext?.user;

  const [topic,      setTopic]      = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [isLoading,  setIsLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) { toast.error('Please enter a topic.'); return; }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, skillLevel }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate quiz');

      toast.success("Quiz generated! Let's go 🎉", {
        style: { background: '#071320', color: '#fff', border: `1px solid ${T.teal}`, borderRadius: '16px' },
        progressStyle: { background: `linear-gradient(90deg, ${T.teal}, ${T.cyan})` },
      });
      navigate(`/quiz/${data.quizId}`, { state: { quiz: data } });
    } catch (error) {
      toast.error(error.message || 'Something went wrong while generating the quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: 'white', position: 'relative', overflow: 'hidden' }}>

      {/* ── Ambient BG ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', filter: 'blur(120px)', background: `radial-gradient(circle, rgba(23,182,168,0.10), transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '55%', height: '55%', borderRadius: '50%', filter: 'blur(120px)', background: `radial-gradient(circle, rgba(15,212,196,0.07), transparent 70%)` }}
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', mask: 'radial-gradient(ellipse at center, black 20%, transparent 80%)', WebkitMask: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }} />
      </div>

      {/* ── Main ── */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: '160px 24px 64px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}>

          {/* section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <span style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <Brain style={{ width: 11, height: 11 }} />
              </motion.span>
              AI Quiz Generator
            </span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>

          <h1 style={{ fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', fontFamily: 'system-ui, sans-serif', margin: '0 0 16px', whiteSpace: 'nowrap' }}>
            Test Your <span style={{ color: T.teal }}>Knowledge</span>
          </h1>
          <p style={{ color: T.textDim, fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>
            Personalized AI assessments tailored to your skill level.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          style={{ borderRadius: 28, position: 'relative', overflow: 'hidden', background: T.card, boxShadow: `0 0 0 1px ${T.border}, 0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)` }}>

          {/* animated top border */}
          <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 0', '200% 0'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />

          {/* corner glows */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 260, height: 260, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.18, pointerEvents: 'none', background: `radial-gradient(circle, ${T.teal}, transparent 70%)`, transform: 'translate(-35%, -35%)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 200, height: 200, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.10, pointerEvents: 'none', background: `radial-gradient(circle, ${T.cyan}, transparent 70%)`, transform: 'translate(25%, 25%)' }} />

          {/* card header */}
          <div style={{ padding: '40px 44px 0', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ width: 50, height: 50, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.tealDim, border: `1px solid ${T.border}`, flexShrink: 0 }}>
              <span style={{ fontSize: 26 }}>🧠</span>
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1, margin: 0 }}>Build Your Quiz</h2>
              <p style={{ color: T.textDim, fontSize: '1rem', marginTop: 6 }}>Powered by AI • Adaptive difficulty</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '0 44px 48px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 26 }}>

            {/* Topic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: T.textDim, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Target style={{ width: 12, height: 12, color: T.teal }} /> Topic or Skill
              </label>
              <input type="text" id="topic" placeholder="e.g., React Hooks, CSS Grid, Python Basics"
                value={topic} onChange={e => setTopic(e.target.value)} required
                style={{ background: T.tealDim, border: `1px solid ${T.border}`, borderRadius: 14, padding: '15px 20px', color: 'white', fontSize: '1.05rem', fontWeight: 600, outline: 'none', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.border = `1px solid ${T.teal}`; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
                onBlur={e => { e.target.style.border = `1px solid ${T.border}`; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Difficulty */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: T.textDim, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap style={{ width: 12, height: 12, color: T.gold }} /> Difficulty Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {LEVELS.map(lvl => (
                  <motion.button key={lvl} type="button" whileHover={{ y: -1 }}
                    onClick={() => setSkillLevel(lvl)}
                    style={{ padding: '14px 10px', borderRadius: 14, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 700, transition: 'all 0.18s', border: 'none',
                      background: skillLevel === lvl ? T.tealMid : T.tealDim,
                      outline: `1px solid ${skillLevel === lvl ? T.teal : T.border}`,
                      color: skillLevel === lvl ? T.teal : T.textDim,
                      boxShadow: skillLevel === lvl ? `0 0 16px rgba(23,182,168,0.18)` : 'none',
                    }}>
                    {lvl === 'Beginner' ? '🌱' : lvl === 'Intermediate' ? '⚡' : '🔥'} {lvl}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              style={{ position: 'relative', width: '100%', padding: 1, borderRadius: 16, overflow: 'hidden', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer', border: 'none', background: 'none', marginTop: 4 }}>
              <motion.div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold}, ${T.cyan}, ${T.teal})`, backgroundSize: '400% 400%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
              <div style={{ position: 'relative', borderRadius: 15, margin: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px', background: 'linear-gradient(135deg, #071e2e, #060f1a, #071e2e)', overflow: 'hidden' }}>
                <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                <div style={{ position: 'absolute', inset: 0, opacity: 0.20, background: `radial-gradient(ellipse at 50% 120%, ${T.teal}, transparent 65%)` }} />
                {isLoading ? (
                  <>
                    <motion.div style={{ width: 18, height: 18, border: `2px solid ${T.teal}`, borderTopColor: 'transparent', borderRadius: '50%', position: 'relative' }}
                      animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
                    <span style={{ position: 'relative', fontSize: '1rem', fontWeight: 700, color: T.text }}>Generating questions…</span>
                  </>
                ) : (
                  <>
                    <Sparkles style={{ position: 'relative', width: 16, height: 16, color: T.teal }} />
                    <span style={{ position: 'relative', fontSize: '1rem', fontWeight: 700, color: 'white' }}>Generate Quiz</span>
                    <ArrowRight style={{ position: 'relative', width: 16, height: 16, color: T.teal }} />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* animated bottom line */}
          <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.cyan}, ${T.teal}, transparent)`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['200% 0', '0% 0'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginTop: 28, padding: '0 8px' }}>
          {[
            { label: 'Questions Generated', value: '50K+' },
            { label: 'Topics Covered',      value: '200+' },
            { label: 'Avg. Score Boost',    value: '+34%' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>{s.value}</div>
              <div style={{ color: T.textDim, fontSize: '0.8rem', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default QuizGenerator;