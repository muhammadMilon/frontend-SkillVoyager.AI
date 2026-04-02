import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import {
    Map,
    RefreshCw,
    Sparkles,
    BarChart3,
    Users,
    CheckCircle,
    ArrowRight,
    Zap,
    Brain,
    Rocket
} from 'lucide-react';

const features = [
    
    {
        icon: Brain,
        title: "AI Skill Gap Analysis",
        description: "Advanced AI identifies gaps between your current skills and target career, providing precise recommendations for improvement.",
        stats: "95% Accuracy",
        color: "#17B6A8",
        glow: "rgba(23,182,168,0.35)",
        border: "rgba(23,182,168,0.30)",
        cardBg: "rgba(23,182,168,0.06)",
        iconBg: "rgba(23,182,168,0.15)",
        badgeBg: "rgba(23,182,168,0.12)",
        delay: 0.05,
    },
    {
        icon: Map,
        title: "Personalized Roadmaps",
        description: "Step-by-step learning paths with curated resources, projects, and milestones tailored to your unique goals.",
        stats: "500+ Paths",
        color: "#F5C842",
        glow: "rgba(245,200,66,0.28)",
        border: "rgba(245,200,66,0.28)",
        cardBg: "rgba(245,200,66,0.05)",
        iconBg: "rgba(245,200,66,0.12)",
        badgeBg: "rgba(245,200,66,0.10)",
        delay: 0.10,
    },
    {
        icon: RefreshCw,
        title: "Adaptive Updates",
        description: "Roadmaps dynamically adjust based on your progress, quiz results, and feedback for optimal learning efficiency.",
        stats: "Real-time",
        color: "#0fd4c4",
        glow: "rgba(15,212,196,0.30)",
        border: "rgba(15,212,196,0.28)",
        cardBg: "rgba(15,212,196,0.05)",
        iconBg: "rgba(15,212,196,0.14)",
        badgeBg: "rgba(15,212,196,0.11)",
        delay: 0.15,
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description: "Visualize your learning journey with detailed analytics, completion rates, and skill mastery indicators.",
        stats: "Live Metrics",
        color: "#17B6A8",
        glow: "rgba(23,182,168,0.30)",
        border: "rgba(23,182,168,0.28)",
        cardBg: "rgba(23,182,168,0.05)",
        iconBg: "rgba(23,182,168,0.13)",
        badgeBg: "rgba(23,182,168,0.10)",
        delay: 0.20,
    },
    {
        icon: Users,
        title: "Community Learning",
        description: "Connect with peers, share insights, and collaborate on projects in topic-specific learning groups.",
        stats: "10K+ Learners",
        color: "#F5C842",
        glow: "rgba(245,200,66,0.25)",
        border: "rgba(245,200,66,0.26)",
        cardBg: "rgba(245,200,66,0.04)",
        iconBg: "rgba(245,200,66,0.11)",
        badgeBg: "rgba(245,200,66,0.09)",
        delay: 0.25,
    },
    {
        icon: Zap,
        title: "Quick Implementation",
        description: "Get started in minutes with instant roadmap generation and immediately actionable learning resources.",
        stats: "< 2 mins",
        color: "#0fd4c4",
        glow: "rgba(15,212,196,0.28)",
        border: "rgba(15,212,196,0.26)",
        cardBg: "rgba(15,212,196,0.04)",
        iconBg: "rgba(15,212,196,0.12)",
        badgeBg: "rgba(15,212,196,0.09)",
        delay: 0.30,
        
    },
];

const FeatureCard = ({ f }) => {
    const Icon = f.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: f.delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative p-7 rounded-2xl overflow-hidden cursor-default select-none"
            style={{
                background: f.cardBg,
                border: `1px solid ${f.border}`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "box-shadow 0.35s ease, border-color 0.35s ease",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 40px ${f.glow}, 0 16px 48px rgba(0,0,0,0.55)`;
                e.currentTarget.style.borderColor = f.color + "88";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = f.border;
            }}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: `linear-gradient(90deg, transparent 5%, ${f.color}90 40%, ${f.color} 55%, transparent 95%)` }} />

            {/* Corner ambient glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${f.color}20 0%, transparent 70%)`, filter: "blur(16px)" }} />

            {/* Grain texture */}
            <div className="absolute inset-0 opacity-[0.022] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px 180px",
                }}
            />

            {/* Hover shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-in-out pointer-events-none"
                style={{ background: `linear-gradient(105deg, transparent 30%, ${f.color}10 50%, transparent 70%)` }} />

            <div className="relative z-10">
                {/* Icon */}
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{
                        background: f.iconBg,
                        border: `1.5px solid ${f.color}40`,
                        boxShadow: `0 4px 18px ${f.glow}`,
                    }}
                >
                    <Icon style={{ width: 24, height: 24, color: f.color }} strokeWidth={1.8} />
                </motion.div>

                {/* Title */}
                <h3 className="mb-2.5 leading-snug"
                    style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#fff",
                        fontFamily: "system-ui, sans-serif",
                        letterSpacing: "-0.3px",
                    }}>
                    {f.title}
                </h3>

                {/* Description */}
                <p className="text-sm mb-5"
                    style={{
                        color: "rgba(255,255,255,0.58)",
                        fontFamily: "system-ui, sans-serif",
                        lineHeight: 1.8,
                    }}>
                    {f.description}
                </p>

                {/* Stats badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                        color: f.color,
                        background: f.badgeBg,
                        border: `1px solid ${f.color}28`,
                        fontFamily: "system-ui, sans-serif",
                    }}>
                    <CheckCircle style={{ width: 13, height: 13 }} />
                    {f.stats}
                </div>

                {/* Arrow on hover */}
                <motion.div
                    className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}>
                    <ArrowRight style={{ width: 17, height: 17, color: f.color }} />
                </motion.div>
            </div>
        </motion.div>
    );
};

const Features = () => {
    const navigate = useNavigate();
    return (
        <section id="features" className="relative py-24 px-4 overflow-hidden"
            style={{ background: "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)" }}>

            {/* BG */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(23,182,168,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,182,168,0.04) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }} />
                <motion.div animate={{ x: [0, 40, 0], y: [0, -25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute rounded-full"
                    style={{ width: 600, height: 600, top: -100, left: -150, background: "radial-gradient(circle, rgba(23,182,168,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
                <motion.div animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute rounded-full"
                    style={{ width: 500, height: 500, top: "10%", right: -120, background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
                <motion.div animate={{ x: [0, 20, 0], y: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute rounded-full"
                    style={{ width: 550, height: 550, bottom: -80, left: "30%", background: "radial-gradient(circle, rgba(15,212,196,0.08) 0%, transparent 70%)", filter: "blur(55px)" }} />
                <motion.div animate={{ x: [0, -20, 0], y: [0, -18, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute rounded-full"
                    style={{ width: 400, height: 400, bottom: "5%", right: "5%", background: "radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ── HEADER — same style as CTA / FAQ / Testimonials ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    {/* Section label — teal line + uppercase text */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
                        <span style={{
                            color: "#17B6A8",
                            fontSize: "11px",
                            fontWeight: "700",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            fontFamily: "system-ui, sans-serif",
                        }}>
                            Why Choose Us
                        </span>
                        <div style={{ width: "28px", height: "2px", background: "#17B6A8" }} />
                    </div>

                    {/* Main heading — white / teal / white (CTA style) */}
                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.15 }}
                        style={{
                            fontSize: "clamp(34px, 4.5vw, 54px)",
                            fontWeight: "800",
                            letterSpacing: "-1px",
                            lineHeight: 1.1,
                            color: "#fff",
                            fontFamily: "system-ui, sans-serif",
                            margin: "0 0 16px",
                        }}
                    >
                        Built to{" "}
                        <span style={{ color: "#17B6A8" }}>Empower</span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{
                            color: "rgba(255,255,255,0.50)",
                            fontSize: "16px",
                            maxWidth: "460px",
                            margin: "0 auto",
                            lineHeight: "1.7",
                            fontFamily: "system-ui, sans-serif",
                        }}
                    >
                        Everything you need to build a career-aligned learning path powered by AI.
                    </motion.p>

                    {/* Animated divider line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            height: 1,
                            maxWidth: 300,
                            margin: "28px auto 0",
                            transformOrigin: "center",
                            background: "linear-gradient(90deg, transparent, #17B6A8, #F5C842, #17B6A8, transparent)",
                        }}
                    />
                </motion.div>

                {/* Cards grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => <FeatureCard key={i} f={f} />)}
                </div>

                {/* Bottom CTA button */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.35 }}
                    className="text-center mt-16"
                >
                    <motion.button
    onClick={() => navigate("/roadmap/generate")}
    className="relative inline-flex items-center gap-3 font-bold text-white overflow-hidden"
    style={{
        padding: "18px 40px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #17B6A8, #0d9e92)",
        boxShadow: "0 16px 56px rgba(23,182,168,0.40)",
        fontFamily: "system-ui, sans-serif",
        fontSize: "16px",
        border: "none",
        cursor: "pointer"
    }}
>
    <span className="relative z-10">Start Your Journey</span>
    <Rocket style={{ width: 18, height: 18 }} />
</motion.button>

                    <p className="mt-3 text-[11px] tracking-widest uppercase"
                        style={{ color: "rgba(255,255,255,0.28)", fontFamily: "system-ui, sans-serif" }}>
                        Free to start · No credit card required
                    </p>
                </motion.div>

            </div>
        </section>
    );
};

export default Features;