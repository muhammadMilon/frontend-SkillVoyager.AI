import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Users, Target, Trophy, TrendingUp, Globe, Award, Zap } from 'lucide-react';

/* ══════════════════════════════════════════
   AI NEURAL NETWORK SVG BACKGROUND
══════════════════════════════════════════ */
const NeuralBg = () => {
  const nodes = [
    { x: 8, y: 15 }, { x: 25, y: 8 }, { x: 18, y: 35 },
    { x: 42, y: 12 }, { x: 55, y: 28 }, { x: 38, y: 45 },
    { x: 70, y: 10 }, { x: 62, y: 38 }, { x: 80, y: 25 },
    { x: 90, y: 50 }, { x: 72, y: 60 }, { x: 50, y: 65 },
    { x: 30, y: 72 }, { x: 15, y: 60 }, { x: 5, y: 48 },
    { x: 45, y: 82 }, { x: 85, y: 78 }, { x: 20, y: 88 },
    { x: 65, y: 85 }, { x: 95, y: 20 },
  ];
  const edges = [
    [0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[4,7],
    [5,7],[5,11],[6,8],[7,8],[8,9],[8,10],[9,10],[9,16],
    [10,11],[11,12],[11,15],[12,13],[13,14],[14,2],[15,18],
    [16,18],[12,17],[17,19],[0,14],[6,19],[4,10],
  ];
  const pulseColors = ["#17B6A8", "#0fd4c4", "#F5C842"];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nodeGrad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#17B6A8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0fd4c4" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0fd4c4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#17B6A8" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id="nodeGrad3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5C842" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.4" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#17B6A8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0fd4c4" stopOpacity="0.12" />
        </linearGradient>
        {edges.slice(0, 12).map(([a, b], i) => (
          <path key={`path-${i}`} id={`edge-path-${i}`} d={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`} fill="none" />
        ))}
      </defs>

      {edges.map(([a, b], i) => (
        <motion.line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#edgeGrad)" strokeWidth="0.18"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.04, ease: "easeOut" }} />
      ))}

      {edges.slice(0, 12).map(([a, b], i) => (
        <circle key={`pulse-${i}`} r="0.35" fill={pulseColors[i % 3]} opacity="0.85" filter="url(#glow)">
          <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.1}s`} begin={`${i * 0.4 + 1}s`} repeatCount="indefinite" />
          <animateMotion dur={`${2.5 + i * 0.1}s`} begin={`${i * 0.4 + 1}s`} repeatCount="indefinite" calcMode="linear">
            <mpath href={`#edge-path-${i}`} />
          </animateMotion>
        </circle>
      ))}

      {nodes.map((n, i) => {
        const grad = i % 3 === 0 ? "url(#nodeGrad1)" : i % 3 === 1 ? "url(#nodeGrad2)" : "url(#nodeGrad3)";
        const baseColor = i % 3 === 0 ? "#17B6A8" : i % 3 === 1 ? "#0fd4c4" : "#F5C842";
        const size = i < 4 ? 1.1 : 0.75;
        const pulseDur = `${2.5 + i * 0.2}s`;
        const pulseDelay = `${i * 0.15}s`;
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={size * 2.2} fill="none" stroke={baseColor} strokeWidth="0.15">
              <animate attributeName="r" values={`${size * 1.8};${size * 3.2};${size * 1.8}`} dur={pulseDur} begin={pulseDelay} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur={pulseDur} begin={pulseDelay} repeatCount="indefinite" />
            </circle>
            <circle cx={n.x} cy={n.y} r={size} fill={grad} filter="url(#glow)">
              <animate attributeName="opacity" values="0;1" dur="0.5s" begin={`${0.5 + i * 0.06}s`} fill="freeze" />
              <animate attributeName="r" values={`0;${size}`} dur="0.5s" begin={`${0.5 + i * 0.06}s`} fill="freeze" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════ */
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const end = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start) + suffix);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count || "0"}</span>;
};

/* ══════════════════════════════════════════
   MAGNETIC HOVER CARD
══════════════════════════════════════════ */
const MagneticCard = ({ children, className, style }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }} className={className}>
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const statsData = [
  {
    icon: Users,
    value: "10k+",
    label: "Active Learners",
    description: "Globally growing community of ambitious professionals",
    accent: "#17B6A8",
    secondary: "#0fd4c4",
    glow: "rgba(23,182,168,0.40)",
    cardBg: "linear-gradient(145deg, #071a20 0%, #0b2a30 60%, #061518 100%)",
    border: "rgba(23,182,168,0.28)",
    progress: 85,
    progressLabel: "85% retention rate",
  },
  {
    icon: Target,
    value: "50+",
    label: "Career Paths",
    description: "Curated roadmaps across tech, design, data and beyond",
    accent: "#F5C842",
    secondary: "#fde68a",
    glow: "rgba(245,200,66,0.35)",
    cardBg: "linear-gradient(145deg, #151008 0%, #261d05 60%, #1a1404 100%)",
    border: "rgba(245,200,66,0.25)",
    progress: 70,
    progressLabel: "70% more added yearly",
  },
  {
    icon: Trophy,
    value: "1M+",
    label: "Milestones Hit",
    description: "Achievements unlocked by our dedicated learners worldwide",
    accent: "#0fd4c4",
    secondary: "#67e8f9",
    glow: "rgba(15,212,196,0.38)",
    cardBg: "linear-gradient(145deg, #071820 0%, #0b2535 60%, #060f1a 100%)",
    border: "rgba(15,212,196,0.25)",
    progress: 95,
    progressLabel: "95% goal completion",
  },
];

const secondaryStats = [
  { icon: Globe,   label: "15+ Countries", sub: "Global reach",    color: "#17B6A8" },
  { icon: Award,   label: "92% Success",   sub: "Career outcomes", color: "#F5C842" },
  { icon: Zap,     label: "< 2min Setup",  sub: "Instant start",   color: "#0fd4c4" },
  { icon: Users,   label: "24/7 Support",  sub: "Always active",   color: "#17B6A8" },
];

const ratings = [
  { name: "Trustpilot", score: "4.8" },
  { name: "Capterra",   score: "4.9" },
  { name: "G2",         score: "4.7" },
];

/* ══════════════════════════════════════════
   MAIN STATS COMPONENT
══════════════════════════════════════════ */
const Stats = () => {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 1]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
        padding: "clamp(80px, 10vw, 140px) 0",
      }}
    >
      {/* Neural BG */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 pointer-events-none opacity-20">
        <NeuralBg />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #071320 100%)" }} />

      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{ width: "500px", height: "500px", top: "-100px", left: "-150px", background: "radial-gradient(circle, rgba(23,182,168,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute rounded-full"
          style={{ width: "450px", height: "450px", top: "20%", right: "-100px", background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <motion.div animate={{ x: [0, 20, 0], y: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute rounded-full"
          style={{ width: "400px", height: "400px", bottom: "-60px", left: "35%", background: "radial-gradient(circle, rgba(15,212,196,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">

        {/* ── HEADER — same style as all sections ── */}
        <div ref={titleRef} className="text-center mb-20">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}
          >
            <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
            <span style={{ color: "#17B6A8", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "system-ui, sans-serif" }}>
              Our Impact
            </span>
            <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
          </motion.div>

          {/* Heading — white / teal / white */}
          <div style={{ overflow: "hidden" }}>
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              animate={titleInView ? { y: "0%", opacity: 1 } : {}}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "clamp(34px, 4.5vw, 54px)",
                fontWeight: "800",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                color: "#fff",
                margin: 0,
              }}
            >
              By <span style={{ color: "#17B6A8" }}>the</span> Numbers
            </motion.h2>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{
              marginTop: "16px",
              fontSize: "16px",
              lineHeight: "1.7",
              maxWidth: "480px",
              margin: "16px auto 0",
              color: "rgba(255,255,255,0.50)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Join thousands of learners achieving their career goals with our AI-powered platform
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 1, maxWidth: 300, margin: "28px auto 0", transformOrigin: "center",
              background: "linear-gradient(90deg, transparent, #17B6A8, #F5C842, #17B6A8, transparent)",
            }}
          />
        </div>

        {/* ── Main Stat Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.85, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
                <MagneticCard
                  className="relative rounded-3xl overflow-hidden h-full cursor-default"
                  style={{
                    background: stat.cardBg,
                    border: `1px solid ${stat.border}`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                    transition: "box-shadow 0.4s, border-color 0.4s",
                  }}
                >
                  {/* Corner glow */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${stat.accent}20 0%, transparent 70%)` }} />
                  {/* Top accent strip */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: `linear-gradient(90deg, ${stat.accent}, ${stat.secondary}70, transparent)` }} />
                  {/* BG trending icon */}
                  <motion.div className="absolute top-5 right-5 opacity-10"
                    animate={{ rotate: [0, 8, -8, 0], y: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}>
                    <TrendingUp className="w-14 h-14" style={{ color: stat.accent }} />
                  </motion.div>

                  <div className="relative z-10 p-8">
                    {/* Icon */}
                    <motion.div whileHover={{ scale: 1.12, rotate: 5 }} transition={{ duration: 0.3 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7"
                      style={{
                        background: `linear-gradient(135deg, ${stat.accent}25, ${stat.secondary}12)`,
                        border: `1.5px solid ${stat.accent}40`,
                        boxShadow: `0 4px 20px ${stat.glow.replace("0.40", "0.18").replace("0.35", "0.15").replace("0.38", "0.16")}`,
                      }}>
                      <Icon className="w-7 h-7" style={{ color: stat.accent }} />
                    </motion.div>

                    {/* Counter */}
                    <div className="font-black mb-2 leading-none"
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "clamp(3rem, 5vw, 4rem)",
                        letterSpacing: "-0.04em",
                        backgroundImage: `linear-gradient(135deg, #ffffff 30%, ${stat.accent} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                      <Counter value={stat.value} />
                    </div>

                    {/* Label */}
                    <h3 className="font-bold mb-2"
                      style={{ fontFamily: "system-ui, sans-serif", fontSize: "1.1rem", color: "#ffffff", letterSpacing: "-0.3px" }}>
                      {stat.label}
                    </h3>

                    {/* Description */}
                    <p className="text-xs leading-relaxed mb-6"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
                      {stat.description}
                    </p>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] tracking-widest uppercase"
                          style={{ color: "rgba(255,255,255,0.28)", fontFamily: "system-ui, sans-serif" }}>
                          {stat.progressLabel}
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: stat.accent }}>{stat.progress}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.6, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${stat.accent}, ${stat.secondary})` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}60, transparent)` }} />
                </MagneticCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── Secondary Stats ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} whileHover={{ y: -6, scale: 1.03 }} transition={{ duration: 0.2 }}
                className="relative rounded-2xl p-5 text-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${s.color}10 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${s.color}22` }}>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="flex justify-center mb-2">
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </motion.div>
                <div className="text-sm font-bold mb-0.5" style={{ color: "#ffffff", fontFamily: "system-ui, sans-serif" }}>{s.label}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif" }}>{s.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Ratings ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8">
          {ratings.map((r, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="flex items-center gap-2.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <motion.svg key={j} className="w-3.5 h-3.5" viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 + j * 0.06, duration: 0.3, ease: "backOut" }}>
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fill="#F5C842" />
                  </motion.svg>
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.40)", fontFamily: "system-ui, sans-serif", fontSize: "12px" }}>
                {r.name} <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>{r.score}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Stats;