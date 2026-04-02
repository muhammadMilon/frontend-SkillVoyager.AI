import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Bell, Sparkles, AlertCircle } from 'lucide-react';

// ── Animated gradient border ──────────────────────────────────────────────────
const GradientBorder = () => (
  <motion.div
    className="absolute -inset-[1.5px] rounded-3xl pointer-events-none"
    style={{
      background: 'linear-gradient(135deg, #17B6A8, #0fd4c4, #F5C842, #17B6A8)',
      backgroundSize: '300% 300%',
    }}
    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
  >
    <div
      className="absolute inset-[1.5px] rounded-[calc(1.5rem-1.5px)]"
      style={{ background: 'linear-gradient(145deg, #071320 0%, #0b1d2e 50%, #060f1a 100%)' }}
    />
  </motion.div>
);

// ── Shooting Star ─────────────────────────────────────────────────────────────
const ShootingStar = ({ top, left, rotate, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      top, left, rotate,
      width: '110px', height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(23,182,168,0.85), transparent)',
    }}
    animate={{ x: [0, 220], opacity: [0, 1, 0] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email'); return; }
    setError('');
    setIsSubmitted(true);
    setTimeout(() => { setIsSubmitted(false); setEmail(''); }, 3000);
  };

  return (
    <section id="newsletter" className="relative py-28 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)' }}>

      {/* ── BG blobs ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-10 left-10 rounded-full opacity-40"
          style={{ width: '28rem', height: '28rem', background: 'rgba(23,182,168,0.14)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-10 right-10 rounded-full opacity-30"
          style={{ width: '28rem', height: '28rem', background: 'rgba(245,200,66,0.08)', filter: 'blur(80px)' }} />
      </div>

      {/* ── Shooting stars ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <ShootingStar top="12%" left="5%"  rotate="18deg"  delay={0}   />
        <ShootingStar top="55%" left="65%" rotate="-14deg" delay={3.5} />
        <ShootingStar top="75%" left="25%" rotate="8deg"   delay={6}   />
      </div>

      {/* ══════════ CARD ══════════ */}
      <div className="max-w-xl mx-auto relative" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl"
        >
          {/* Animated gradient border */}
          <GradientBorder />

          {/* ── Floating corner icons ── */}
          <div className="hidden md:block absolute -top-5 -left-5" style={{ zIndex: 30 }}>
            <motion.div
              animate={{ rotate: [0, 12, -12, 0], y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                width: 52, height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #17B6A8, #0fd4c4)',
                boxShadow: '0 8px 28px rgba(23,182,168,0.55), 0 2px 0 rgba(255,255,255,0.20) inset, 0 -3px 0 rgba(0,0,0,0.3) inset',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'perspective(200px) rotateX(10deg) rotateY(-10deg)',
              }}
            >
              <Mail style={{ width: 22, height: 22, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
            </motion.div>
          </div>

          <div className="hidden md:block absolute -bottom-5 -right-5" style={{ zIndex: 30 }}>
            <motion.div
              animate={{ rotate: [0, -12, 12, 0], y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              style={{
                width: 52, height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #F5C842, #f0b429)',
                boxShadow: '0 8px 28px rgba(245,200,66,0.50), 0 2px 0 rgba(255,255,255,0.20) inset, 0 -3px 0 rgba(0,0,0,0.3) inset',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'perspective(200px) rotateX(-10deg) rotateY(10deg)',
              }}
            >
              <Bell style={{ width: 22, height: 22, color: '#071320', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </motion.div>
          </div>

          {/* Card body */}
          <div className="relative rounded-3xl overflow-hidden" style={{
            background: 'linear-gradient(145deg, rgba(7,19,32,0.97) 0%, rgba(11,29,46,0.98) 50%, rgba(6,15,26,0.97) 100%)',
            backdropFilter: 'blur(32px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
          }}>

            {/* Inner corner glows */}
            <motion.div className="absolute -top-10 -left-10 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(23,182,168,0.20) 0%, transparent 70%)', filter: 'blur(30px)' }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />

            {/* Animated top shimmer line */}
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 h-px" style={{
              width: '85%',
              background: 'linear-gradient(90deg, transparent, #17B6A8, #F5C842, #0fd4c4, transparent)',
            }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Success toast */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap"
                  style={{
                    background: 'rgba(23,182,168,0.15)',
                    border: '1px solid rgba(23,182,168,0.35)',
                    color: '#17B6A8',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Successfully subscribed!
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Content ── */}
            <div className="px-8 pt-12 pb-10 md:px-12">

              {/* Section label — same as all other sections */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
              >
                <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
                <span style={{
                  color: '#17B6A8',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  Never Miss an Update
                </span>
                <div style={{ width: '28px', height: '2px', background: '#17B6A8' }} />
              </motion.div>

              {/* Heading — white / teal / white */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18, duration: 0.55 }}
                style={{
                  fontSize: 'clamp(34px, 4.5vw, 54px)',
                  fontWeight: '800',
                  letterSpacing: '-1px',
                  lineHeight: 1.1,
                  color: '#fff',
                  fontFamily: 'system-ui, sans-serif',
                  marginBottom: '14px',
                }}
              >
                Stay in{' '}
                <span style={{ color: '#17B6A8' }}>the</span>{' '}
                Loop
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.26, duration: 0.5 }}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: 'rgba(255,255,255,0.50)',
                  fontFamily: 'system-ui, sans-serif',
                  marginBottom: '28px',
                }}
              >
                Exclusive tips, product updates, and AI learning insights delivered weekly.{' '}
                <span style={{ color: '#17B6A8' }}>No spam. Unsubscribe anytime.</span>
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.33, duration: 0.5 }}
                className="grid grid-cols-3 gap-3 mb-9"
              >
                {[
                  { icon: <Sparkles className="w-3.5 h-3.5" />, text: 'Weekly Tips',      color: '#17B6A8' },
                  { icon: <Bell     className="w-3.5 h-3.5" />, text: 'Product Updates',  color: '#F5C842' },
                  { icon: <Mail     className="w-3.5 h-3.5" />, text: 'Early Access',     color: '#0fd4c4' },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.06, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium text-center"
                    style={{
                      background: `linear-gradient(135deg, ${b.color}15, ${b.color}06)`,
                      border: `1px solid ${b.color}30`,
                      color: 'rgba(255,255,255,0.70)',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    <motion.span
                      style={{ color: b.color }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                    >
                      {b.icon}
                    </motion.span>
                    {b.text}
                  </motion.div>
                ))}
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.41, duration: 0.5 }}
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-4 h-4 transition-colors duration-300"
                        style={{ color: isFocused ? '#17B6A8' : 'rgba(255,255,255,0.30)' }}
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full pl-11 pr-4 py-4 rounded-xl text-white placeholder-white/25 text-sm outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${error ? 'rgba(239,68,68,0.6)' : isFocused ? 'rgba(23,182,168,0.65)' : 'rgba(23,182,168,0.18)'}`,
                        boxShadow: isFocused ? '0 0 0 3px rgba(23,182,168,0.14)' : 'none',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    />
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 -bottom-5 text-xs flex items-center gap-1"
                        style={{ color: 'rgba(239,68,68,0.85)' }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, boxShadow: '0 12px 36px rgba(23,182,168,0.55)' }}
                    whileTap={{ scale: 0.96 }}
                    className="group relative flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #17B6A8, #0d9e92)',
                      boxShadow: '0 8px 28px rgba(23,182,168,0.40)',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Subscribe
                      <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                        <Send className="w-4 h-4" />
                      </motion.span>
                    </span>
                  </motion.button>
                </div>
              </motion.form>

              {/* Trust */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex items-center justify-center gap-3 mt-7 text-xs"
                style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'system-ui, sans-serif' }}
              >
                <span>🔒 No spam</span>
                <span>·</span>
                <span>📧 Unsubscribe anytime</span>
                <span>·</span>
                <span>⚡ 2 min read</span>
              </motion.div>
            </div>

            {/* Social proof footer */}
            <div className="px-8 md:px-12 py-5 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(23,182,168,0.12)', background: 'rgba(0,0,0,0.20)' }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'system-ui, sans-serif' }}>
                Join{' '}
                <span className="font-semibold" style={{ color: '#17B6A8' }}>5,000+</span>
                {' '}learners already subscribed
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, zIndex: 10 }}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{
                      borderColor: 'rgba(0,0,0,0.5)',
                      background: i % 2 === 0
                        ? 'linear-gradient(135deg, #17B6A8, #0fd4c4)'
                        : 'linear-gradient(135deg, #0b9e92, #17B6A8)',
                    }}
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                  style={{
                    borderColor: 'rgba(0,0,0,0.5)',
                    background: 'rgba(23,182,168,0.25)',
                    color: '#17B6A8',
                  }}
                >
                  +5k
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsLetter;