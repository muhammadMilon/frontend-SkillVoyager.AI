import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
/* ── Custom SVG Icons ── */
const IconGoal = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="14" stroke={color} strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />
    <circle cx="18" cy="18" r="9" stroke={color} strokeWidth="2" />
    <circle cx="18" cy="18" r="4" fill={color} />
    <line x1="18" y1="4" x2="18" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="28" x2="18" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="18" x2="8" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="18" x2="32" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconAI = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="8" y="8" width="20" height="20" rx="4" stroke={color} strokeWidth="2" />
    <circle cx="13" cy="13" r="2" fill={color} />
    <circle cx="23" cy="13" r="2" fill={color} />
    <circle cx="13" cy="23" r="2" fill={color} />
    <circle cx="23" cy="23" r="2" fill={color} />
    <circle cx="18" cy="18" r="3" fill={color} opacity="0.7" />
    <line x1="13" y1="13" x2="18" y2="18" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="23" y1="13" x2="18" y2="18" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="13" y1="23" x2="18" y2="18" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="23" y1="23" x2="18" y2="18" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M18 2 L20 6 L18 5 L16 6 Z" fill={color} opacity="0.6" />
    <path d="M34 18 L30 20 L31 18 L30 16 Z" fill={color} opacity="0.6" />
  </svg>
);

const IconTrack = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <polyline points="4,26 12,16 18,21 26,10 32,14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="14" r="3" fill={color} />
    <line x1="4" y1="30" x2="32" y2="30" stroke={color} strokeWidth="1.5" opacity="0.3" />
    <line x1="4" y1="6" x2="4" y2="30" stroke={color} strokeWidth="1.5" opacity="0.3" />
    <circle cx="12" cy="16" r="2" fill={color} opacity="0.6" />
    <circle cx="18" cy="21" r="2" fill={color} opacity="0.6" />
    <circle cx="26" cy="10" r="2" fill={color} opacity="0.6" />
  </svg>
);

const steps = [
  {
    Icon: IconGoal,
    title: "Set Your Goal",
    description: "Choose your desired career path, timeline, and current skill level. Our AI instantly models a baseline for your unique journey.",
    tag: "Discovery",
    tagEmoji: "🎯",
    features: ["Career selection", "Timeline setting", "Skill assessment"],
    cardBg: "linear-gradient(145deg, #071a20 0%, #0b2a30 55%, #061518 100%)",
    borderColor: "rgba(23,182,168,0.35)",
    accent: "#17B6A8",
    accentSecondary: "#0fd4c4",
    glow: "rgba(23,182,168,0.50)",
    tagBg: "rgba(23,182,168,0.12)",
    tagColor: "#a7f3ee",
    decorShape: "circle",
  },
  {
    Icon: IconAI,
    title: "AI Builds Roadmap",
    description: "Advanced Gemini AI generates a personalized step-by-step roadmap with curated resources, real projects, and measurable milestones.",
    tag: "Generation",
    tagEmoji: "⚡",
    features: ["Personalized path", "Resource curation", "Milestone planning"],
    cardBg: "linear-gradient(145deg, #151008 0%, #261d05 55%, #1a1404 100%)",
    borderColor: "rgba(245,200,66,0.30)",
    accent: "#F5C842",
    accentSecondary: "#fde68a",
    glow: "rgba(245,200,66,0.45)",
    tagBg: "rgba(245,200,66,0.10)",
    tagColor: "#fef3c7",
    decorShape: "square",
  },
  {
    Icon: IconTrack,
    title: "Track & Adapt",
    description: "Monitor progress, complete quizzes, earn achievements — and watch your roadmap evolve intelligently with your growing skills.",
    tag: "Growth",
    tagEmoji: "🚀",
    features: ["Progress tracking", "Smart adaptation", "Achievement badges"],
    cardBg: "linear-gradient(145deg, #071820 0%, #0b2535 55%, #060f1a 100%)",
    borderColor: "rgba(15,212,196,0.30)",
    accent: "#0fd4c4",
    accentSecondary: "#67e8f9",
    glow: "rgba(15,212,196,0.45)",
    tagBg: "rgba(15,212,196,0.10)",
    tagColor: "#cffafe",
    decorShape: "triangle",
  },
];

const stats = [
  { value: "< 2 min",    label: "Setup time",       color: "#17B6A8" },
  { value: "AI-Powered", label: "Smart generation", color: "#F5C842" },
  { value: "100% Free",  label: "Basic plan",       color: "#0fd4c4" },
  { value: "24/7",       label: "Access",           color: "#17B6A8" },
];

/* ── Decorative floating shape per card ── */
const DecorShape = ({ type, color }) => {
  if (type === "circle") return (
    <svg className="absolute bottom-6 right-6 opacity-10 pointer-events-none" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="8" fill="none" />
      <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="10" fill={color} />
    </svg>
  );
  if (type === "square") return (
    <svg className="absolute bottom-6 right-6 opacity-10 pointer-events-none" width="100" height="100" viewBox="0 0 100 100">
      <rect x="15" y="15" width="70" height="70" stroke={color} strokeWidth="7" fill="none" rx="6" />
      <rect x="30" y="30" width="40" height="40" stroke={color} strokeWidth="4" fill="none" rx="4" />
      <rect x="42" y="42" width="16" height="16" fill={color} rx="2" />
    </svg>
  );
  return (
    <svg className="absolute bottom-6 right-6 opacity-10 pointer-events-none" width="100" height="100" viewBox="0 0 100 100">
      <polygon points="50,10 90,80 10,80" stroke={color} strokeWidth="7" fill="none" />
      <polygon points="50,28 75,70 25,70" stroke={color} strokeWidth="3.5" fill="none" />
      <polygon points="50,46 62,65 38,65" fill={color} />
    </svg>
  );
};

/* ── Step Card ── */
const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const { Icon } = step;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
      style={{ zIndex: hovered ? 10 : 1 }}
    >
      {/* Outer glow border on hover */}
      <div
        className="absolute -inset-px rounded-3xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${step.accent}60, ${step.accentSecondary}20, transparent)`,
          opacity: hovered ? 1 : 0,
          borderRadius: "24px",
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-3xl overflow-hidden h-full transition-all duration-500"
        style={{
          background: step.cardBg,
          border: `1px solid ${hovered ? step.borderColor : step.borderColor.replace("0.35", "0.18").replace("0.30", "0.15")}`,
          boxShadow: hovered
            ? `0 40px 100px ${step.glow.replace("0.50", "0.20").replace("0.45", "0.20")}, 0 0 0 1px ${step.accent}15, inset 0 1px 0 rgba(255,255,255,0.07)`
            : "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          transform: hovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
        }}
      >
        {/* Top color strip */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-400"
          style={{
            background: `linear-gradient(90deg, ${step.accent}, ${step.accentSecondary}80, transparent)`,
            opacity: hovered ? 1 : 0.45,
          }}
        />

        {/* Inner ambient glow */}
        <div
          className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${step.accent}25 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />

        <DecorShape type={step.decorShape} color={step.accent} />

        <div className="relative z-10 p-8 flex flex-col h-full">

          {/* Header: tag + step dots */}
          <div className="flex items-center justify-between mb-7">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
              style={{
                color: step.tagColor,
                background: step.tagBg,
                border: `1px solid ${step.accent}30`,
              }}
            >
              <span>{step.tagEmoji}</span>
              {step.tag}
            </span>
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? "18px" : "5px",
                    height: "5px",
                    background: i === index ? step.accent : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon box */}
          <motion.div
            animate={hovered ? { scale: 1.08, rotate: [-2, 2, -2, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-7 relative"
            style={{
              background: `linear-gradient(135deg, ${step.accent}25 0%, ${step.accentSecondary}12 100%)`,
              border: `1.5px solid ${step.accent}50`,
              boxShadow: hovered
                ? `0 0 0 6px ${step.accent}10, 0 12px 40px ${step.glow.replace("0.50","0.30").replace("0.45","0.28")}`
                : `0 4px 20px ${step.glow.replace("0.50","0.15").replace("0.45","0.13")}`,
            }}
          >
            {hovered && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.85, 1.5, 1.9] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ border: `2px solid ${step.accent}`, borderRadius: "16px" }}
              />
            )}
            <Icon color={step.accent} />
          </motion.div>

          {/* Title */}
          <h3
            className="font-black mb-3 leading-tight"
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 2vw, 1.55rem)",
              fontWeight: "800",
              letterSpacing: "-0.3px",
              color: "#fff",
            }}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-7 flex-grow"
            style={{
              color: "rgba(255,255,255,0.58)",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.8,
            }}
          >
            {step.description}
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {step.features.map((f, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.5 + i * 0.08, duration: 0.4, ease: "backOut" }}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{
                  color: step.accentSecondary,
                  background: `${step.accent}12`,
                  border: `1px solid ${step.accent}28`,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: step.accent }} />
                {f}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${step.accent}80, ${step.accentSecondary}50, transparent)`,
            opacity: hovered ? 1 : 0.25,
          }}
        />
      </div>
    </motion.div>
  );
};

/* ── Main Component ── */
const HowItWorks = () => {
   const navigate = useNavigate(); 
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
        padding: "clamp(80px, 10vw, 140px) 0",
      }}
    >
      {/* BG */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Blobs */}
        <div className="absolute rounded-full" style={{ width: "700px", height: "700px", top: "-150px", left: "-200px", background: "radial-gradient(circle, rgba(23,182,168,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute rounded-full" style={{ width: "600px", height: "600px", top: "15%", right: "-150px", background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute rounded-full" style={{ width: "500px", height: "500px", bottom: "-80px", left: "35%", background: "radial-gradient(circle, rgba(15,212,196,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── HEADER — same style as all other sections ── */}
        <div ref={titleRef} className="mb-20">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
          >
            <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
            <span style={{
              color: "#17B6A8",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}>
              Simple 3-Step Process
            </span>
            <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
          </motion.div>

          {/* Heading + subtitle row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div style={{ overflow: "hidden" }}>
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                animate={titleInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
                How It{" "}
                <span style={{ color: "#17B6A8" }}>Works</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={titleInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:max-w-xs lg:text-right"
              style={{
                color: "rgba(255,255,255,0.50)",
                fontSize: "16px",
                lineHeight: "1.7",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Start your personalized learning journey in three simple steps. No technical expertise required.
            </motion.p>
          </div>

          {/* Animated divider — teal → yellow → teal */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px"
            style={{
              transformOrigin: "left",
              background: "linear-gradient(90deg, #17B6A8, #F5C842, #0fd4c4, transparent)",
            }}
          />
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-7">
          {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-2xl p-5 text-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${stat.color}10 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${stat.color}25`,
              }}
            >
              <div className="text-base font-black mb-1" style={{ fontFamily: "system-ui, sans-serif", color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[11px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "system-ui, sans-serif" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex justify-center"
        >
          <motion.button
  onClick={() => navigate("/skill-gap")}
  className="group relative inline-flex items-center gap-3 font-bold text-base text-white overflow-hidden"
  style={{
    padding: "18px 40px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #17B6A8, #0d9e92)",
    boxShadow: "0 20px 60px rgba(23,182,168,0.40)",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.02em",
    fontSize: "16px",
    border: "none",
    cursor: "pointer"
  }}
>
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            <span className="relative z-10">Start Your Journey Now</span>
            <motion.span className="relative z-10" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;