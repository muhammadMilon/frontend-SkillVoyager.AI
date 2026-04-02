import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Trending from './LandingPages/Trending';

const TrendingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-[160px]" style={{ position: 'relative', overflow: 'hidden' }}>

            {/* ══════════ SAME BG AS TRENDING SECTION ══════════ */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>

                {/* Deep dark cosmic base */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, #040c1a 0%, #060d1f 30%, #050b1c 60%, #03091a 100%)'
                }} />

                {/* Subtle teal-blue grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }} />

                {/* Diagonal lines accent */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 80px,
                        rgba(109,91,255,0.015) 80px,
                        rgba(109,91,255,0.015) 81px
                    )`
                }} />

                {/* Noise grain */}
                <div style={{
                    position: 'absolute', inset: 0,
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px'
                }} />

                {/* Ambient glow — top right violet */}
                <motion.div style={{
                    position: 'absolute', borderRadius: '50%',
                    width: 700, height: 700,
                    top: -200, right: -150,
                    background: 'radial-gradient(circle, rgba(109,91,255,0.14) 0%, rgba(67,56,202,0.06) 45%, transparent 70%)',
                    filter: 'blur(80px)'
                }}
                    animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Ambient glow — bottom left teal */}
                <motion.div style={{
                    position: 'absolute', borderRadius: '50%',
                    width: 600, height: 600,
                    bottom: -150, left: -100,
                    background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, rgba(6,182,212,0.04) 45%, transparent 70%)',
                    filter: 'blur(90px)'
                }}
                    animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Center deep blue glow */}
                <motion.div style={{
                    position: 'absolute', borderRadius: '50%',
                    width: 500, height: 500,
                    top: '30%', left: '30%',
                    background: 'radial-gradient(circle, rgba(14,78,163,0.12) 0%, transparent 65%)',
                    filter: 'blur(70px)'
                }}
                    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                {/* Top left pink accent */}
                <motion.div style={{
                    position: 'absolute', borderRadius: '50%',
                    width: 300, height: 300,
                    top: '8%', left: '8%',
                    background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }}
                    animate={{ x: [0, 18, 0], y: [0, 15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                />

                {/* Floating orbs */}
                {[
                    { cx: '15%', cy: '20%', size: 4, color: 'rgba(109,91,255,0.6)', dur: 4 },
                    { cx: '85%', cy: '15%', size: 3, color: 'rgba(0,212,255,0.5)', dur: 5 },
                    { cx: '75%', cy: '70%', size: 5, color: 'rgba(244,114,182,0.45)', dur: 6 },
                    { cx: '10%', cy: '75%', size: 3, color: 'rgba(52,211,153,0.5)', dur: 7 },
                    { cx: '50%', cy: '85%', size: 4, color: 'rgba(251,146,60,0.4)', dur: 5 },
                ].map((orb, i) => (
                    <motion.div key={i} style={{
                        position: 'absolute',
                        left: orb.cx, top: orb.cy,
                        width: orb.size, height: orb.size,
                        borderRadius: '50%',
                        background: orb.color,
                        boxShadow: `0 0 ${orb.size * 3}px ${orb.color}`,
                    }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                        transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
                    />
                ))}
            </div>

            {/* Page content on top */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Trending />
            </div>
        </div>
    );
};

export default TrendingPage;