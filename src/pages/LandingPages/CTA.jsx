import React, { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Star Field ───────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.8 + 0.3,
  dur: 3 + Math.random() * 6,
  delay: Math.random() * 5,
  color: i % 4 === 0 ? '#17B6A8' : i % 4 === 1 ? '#0fd4c4' : i % 4 === 2 ? '#a8f0eb' : '#e0faf8',
}));

// ─── Shooting Star ────────────────────────────────────────────────────────────
const ShootingStar = ({ style }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: '140px', height: '1.5px',
      borderRadius: '9999px',
      background: 'linear-gradient(90deg, transparent, rgba(23,182,168,0.9), transparent)',
      ...style,
    }}
    animate={{ x: [0, 250], opacity: [0, 1, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, delay: style.delay, ease: 'easeInOut' }}
  />
);

// ─── Animated Gradient Border ─────────────────────────────────────────────────
const GradientBorder = () => (
  <motion.div
    style={{
      position: 'absolute',
      inset: '-1.5px',
      borderRadius: '28px',
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, #17B6A8, #0fd4c4, #F5C842, #17B6A8, #0a8c82)',
      backgroundSize: '300% 300%',
    }}
    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
  >
    <div style={{
      position: 'absolute', inset: '1.5px', borderRadius: '27px',
      background: 'linear-gradient(145deg, #0b1d2e 0%, #071320 50%, #0d2338 100%)',
    }} />
  </motion.div>
);

const CTA = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  return (
    <section
      ref={sectionRef}
      id="cta"
      style={{
        position: 'relative',
        padding: '112px 24px',
        overflow: 'hidden',
        background: 'linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)',
      }}
    >
      {/* ── Bg blobs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: 40, left: 40, borderRadius: '50%',
          width: '24rem', height: '24rem', opacity: 0.35,
          background: 'rgba(23,182,168,0.2)', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 40, right: 40, borderRadius: '50%',
          width: '24rem', height: '24rem', opacity: 0.2,
          background: 'rgba(245,200,66,0.15)', filter: 'blur(80px)',
        }} />
      </div>

      {/* ── Star Field ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {STARS.map(s => (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.r}px`, height: `${s.r}px`,
              borderRadius: '50%',
              background: s.color,
              boxShadow: `0 0 ${s.r * 3}px ${s.color}`,
              opacity: 0.15,
            }}
            animate={{ opacity: [0.05, 0.3, 0.05] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}
        <ShootingStar style={{ top: '12%', left: '5%', rotate: '20deg', delay: 0 }} />
        <ShootingStar style={{ top: '58%', left: '65%', rotate: '-15deg', delay: 3.5 }} />
        <ShootingStar style={{ top: '32%', left: '38%', rotate: '10deg', delay: 7 }} />
        <ShootingStar style={{ top: '78%', left: '20%', rotate: '-8deg', delay: 5 }} />
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Floating orbit icons */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[
            { Icon: Rocket, top: '-50px', left: '5%',   dur: 5, offset: 20,  color: '#17B6A8' },
            { Icon: Target, top: '80px',  right: '8%',  dur: 6, offset: -20, color: '#F5C842' },
            { Icon: Zap,    bottom:'-20px',left: '18%', dur: 7, offset: 15,  color: '#0fd4c4' },
          ].map(({ Icon, top, left, right, bottom, dur, offset, color }, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute', top, left, right, bottom,
                padding: '12px', borderRadius: '16px',
                background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                border: `1px solid ${color}40`,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 0 24px ${color}30, inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
              animate={{ y: [0, offset, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon style={{ color, width: 20, height: 20 }} />
            </motion.div>
          ))}
        </div>

        {/* ── CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', textAlign: 'center', borderRadius: '28px' }}
        >
          <GradientBorder />

          {/* Card inner */}
          <div style={{
            position: 'relative', borderRadius: '27px', overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(11,29,46,0.97) 0%, rgba(7,19,32,0.99) 50%, rgba(13,35,56,0.97) 100%)',
            padding: '56px 48px 48px',
          }}>

            {/* Corner glows */}
            <motion.div style={{
              position: 'absolute', top: '-40px', left: '-40px',
              width: '288px', height: '288px', borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(23,182,168,0.18) 0%, transparent 70%)',
              filter: 'blur(35px)',
            }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div style={{
              position: 'absolute', bottom: '-40px', right: '-40px',
              width: '288px', height: '288px', borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)',
              filter: 'blur(35px)',
            }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />

            {/* Top shimmer line */}
            <motion.div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              height: '1px', width: '80%',
              background: 'linear-gradient(90deg, transparent, #17B6A8, #F5C842, #17B6A8, transparent)',
            }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginBottom: '32px', padding: '8px 20px', borderRadius: '9999px',
                fontSize: '11px', fontWeight: '700',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, rgba(245,200,66,0.18), rgba(245,200,66,0.10))',
                border: '1px solid rgba(245,200,66,0.4)',
                color: '#F5C842',
                boxShadow: '0 0 20px rgba(245,200,66,0.12)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles style={{ width: 12, height: 12 }} />
              </motion.span>
              Limited Time Offer
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontWeight: '800', marginBottom: '20px', color: '#fff',
                fontSize: 'clamp(34px, 4.5vw, 54px)',
                lineHeight: 1.1, letterSpacing: '-1px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Ready to Chart{' '}
              <span style={{ color: '#17B6A8' }}>Your</span>{' '}
              Path?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                marginBottom: '40px', maxWidth: '520px', margin: '0 auto 40px',
                color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Join{' '}
              <span style={{
                background: 'linear-gradient(90deg, #17B6A8, #F5C842)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}>10,000+ learners</span>
              {' '}building career-aligned skills with AI-powered roadmaps.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                gap: '12px', marginBottom: '40px',
              }}
            >
              {[
                { label: 'AI-Personalized',   color: '#17B6A8' },
                { label: 'Industry-Aligned',  color: '#F5C842' },
                { label: 'Track Progress',    color: '#0fd4c4' },
                { label: 'Free Forever',      color: '#a8f0eb' },
              ].map(({ label, color }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 18px', borderRadius: '9999px',
                    fontSize: '14px', fontWeight: '500',
                    background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                    border: `1px solid ${color}40`,
                    color: 'rgba(255,255,255,0.88)',
                    boxShadow: `0 0 12px ${color}15`,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: color, display: 'inline-block',
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                  {label}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}
            >
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
  <Link
    to="/roadmap/generate"
    style={{
      position: 'relative',
      padding: '16px 36px',
      borderRadius: '16px',
      fontWeight: '700',
      fontSize: '1rem',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #17B6A8, #0d9e92, #0fd4c4)',
      color: '#fff',
      boxShadow: '0 0 40px rgba(23,182,168,0.45), 0 8px 32px rgba(23,182,168,0.3)',
      letterSpacing: '0.02em',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    Create Your Roadmap
    <ArrowRight style={{ width: 16, height: 16 }} />
  </Link>
</motion.div>

              {/* Secondary */}
              <motion.div
  whileHover={{
    scale: 1.04,
  }}
  whileTap={{ scale: 0.97 }}
>
  <Link
    to="/courses"
    style={{
      padding: '16px 36px',
      borderRadius: '16px',
      fontWeight: '600',
      fontSize: '1rem',
      background: 'rgba(23,182,168,0.06)',
      border: '1px solid rgba(23,182,168,0.35)',
      color: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    View Pricing
    <motion.span
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      →
    </motion.span>
  </Link>
</motion.div>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{
                marginTop: '32px', fontSize: '12px',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              ✦ No credit card required &nbsp;·&nbsp; Start learning in 2 minutes
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;