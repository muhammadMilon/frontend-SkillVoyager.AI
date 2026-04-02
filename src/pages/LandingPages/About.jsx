import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Users, Target, Rocket, Sparkles,
  ShieldCheck, Globe, Zap, Heart,
  CheckCircle, MessageCircle, ArrowRight, Star
} from 'lucide-react';
import * as THREE from 'three';
import Navbar from '../../components/Navbar';
import missionImg from '../../assets/images/mission-vision.png';

/* ═══════════════════════════════════════
   GOOGLE FONTS
═══════════════════════════════════════ */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { font-family: 'DM Sans', sans-serif; }
    .syne { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

/* ═══════════════════════════════════════
   THREE.JS HERO BACKGROUND (Updated Colors)
═══════════════════════════════════════ */
const HeroCanvas = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particle sphere
    const N = 2200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const palette = [
      new THREE.Color('#17B6A8'), new THREE.Color('#0fd4c4'),
      new THREE.Color('#14b8a6'), new THREE.Color('#67e8f9'),
      new THREE.Color('#f5c842'), new THREE.Color('#22d3ee'),
    ];
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 22;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.10, vertexColors: true, transparent: true, opacity: 0.65 });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // Wireframe DNA helix-like double torus
    const t1Geo = new THREE.TorusGeometry(8, 0.5, 16, 80);
    const t1Mat = new THREE.MeshBasicMaterial({ color: 0x17B6A8, wireframe: true, transparent: true, opacity: 0.10 });
    const t1 = new THREE.Mesh(t1Geo, t1Mat);
    t1.position.set(-8, 2, -6);
    scene.add(t1);

    const t2Geo = new THREE.TorusGeometry(5, 0.35, 12, 60);
    const t2Mat = new THREE.MeshBasicMaterial({ color: 0x0fd4c4, wireframe: true, transparent: true, opacity: 0.12 });
    const t2 = new THREE.Mesh(t2Geo, t2Mat);
    t2.position.set(10, -3, -8);
    scene.add(t2);

    // Icosahedron
    const iGeo = new THREE.IcosahedronGeometry(3, 1);
    const iMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.18 });
    const ico = new THREE.Mesh(iGeo, iMat);
    ico.position.set(12, 6, -10);
    scene.add(ico);

    // Octahedron
    const oGeo = new THREE.OctahedronGeometry(2, 0);
    const oMat = new THREE.MeshBasicMaterial({ color: 0xf5c842, wireframe: true, transparent: true, opacity: 0.22 });
    const oct = new THREE.Mesh(oGeo, oMat);
    oct.position.set(-14, -5, -8);
    scene.add(oct);

    // Constellation lines
    const cPts = Array.from({ length: 60 }, () => new THREE.Vector3(
      (Math.random()-0.5)*55, (Math.random()-0.5)*35, (Math.random()-0.5)*20-5
    ));
    const lArr = [];
    for (let i = 0; i < cPts.length; i++)
      for (let j = i+1; j < cPts.length; j++)
        if (cPts[i].distanceTo(cPts[j]) < 9)
          lArr.push(cPts[i].x,cPts[i].y,cPts[i].z, cPts[j].x,cPts[j].y,cPts[j].z);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lArr), 3));
    scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.06 })));

    let mx = 0, my = 0;
    const onMouse = (e) => { mx = (e.clientX/window.innerWidth-0.5)*2; my = (e.clientY/window.innerHeight-0.5)*2; };
    window.addEventListener('mousemove', onMouse);
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf; const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      pts.rotation.y = t * 0.035; pts.rotation.x = t * 0.012;
      t1.rotation.z = t * 0.12; t1.rotation.x = t * 0.07;
      t2.rotation.y = t * 0.18; t2.rotation.z = t * 0.1;
      ico.rotation.x = t * 0.3; ico.rotation.y = t * 0.22;
      ico.position.y = 6 + Math.sin(t * 0.5) * 1.5;
      oct.rotation.x = t * 0.4; oct.rotation.z = t * 0.25;
      oct.position.y = -5 + Math.sin(t * 0.6 + 1) * 1.2;
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.025;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.025;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

/* ═══════════════════════════════════════
   Remaining Components (TiltCard, Counter, Reveal, Orb) - Unchanged
═══════════════════════════════════════ */
const TiltCard = ({ children, className = '', style = {} }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const [hovered, setHovered] = useState(false);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ x: (cy - 0.5) * -16, y: (cx - 0.5) * 16, gx: cx * 100, gy: cy * 100 });
  };
  return (
    <div ref={ref} onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0, gx: 50, gy: 50 }); setHovered(false); }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
        transition: 'transform 0.18s ease-out',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={className}>
      {typeof children === 'function' ? children({ hovered, tilt }) : children}
    </div>
  );
};

const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target);
    const duration = 1800;
    const steps = 60;
    let step = 0;
    const t = setInterval(() => {
      step++;
      setCount(Math.round((num * step) / steps));
      if (step >= steps) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const Reveal = ({ children, delay = 0, y = 40 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const Orb = ({ className, color, size = 'w-96 h-96' }) => (
  <div className={`absolute rounded-full pointer-events-none blur-[130px] ${size} ${className}`}
    style={{ background: color }} />
);

/* ═══════════════════════════════════════
   MAIN ABOUT COMPONENT - NEW TEAL/CYAN THEME
═══════════════════════════════════════ */
const About = () => {
  const stats = [
    { label: "Active Learners", value: "10", suffix: "K+", icon: <Users className="w-5 h-5" />, color: "#17B6A8", bg: "rgba(23,182,168,0.12)" },
    { label: "AI Roadmaps", value: "25", suffix: "K+", icon: <Target className="w-5 h-5" />, color: "#0fd4c4", bg: "rgba(15,212,196,0.12)" },
    { label: "Success Rate", value: "94", suffix: "%", icon: <Zap className="w-5 h-5" />, color: "#67e8f9", bg: "rgba(103,232,249,0.12)" },
    { label: "Skills Covered", value: "500", suffix: "+", icon: <Globe className="w-5 h-5" />, color: "#f5c842", bg: "rgba(245,200,66,0.12)" },
  ];

  const values = [
    {
      title: "AI-First Approach",
      description: "We leverage cutting-edge artificial intelligence to personalize every step of your learning journey.",
      icon: <Sparkles className="w-6 h-6" />,
      gradient: "from-teal-500 to-cyan-500",
      glow: "rgba(23,182,168,0.3)",
    },
    {
      title: "Data-Driven Success",
      description: "Our insights are based on real industry data, ensuring you learn exactly what employers are looking for.",
      icon: <Rocket className="w-6 h-6" />,
      gradient: "from-cyan-500 to-sky-400",
      glow: "rgba(15,212,196,0.3)",
    },
    {
      title: "Continuous Innovation",
      description: "The world of tech moves fast, and so do we. Our AI roadmaps adapt as the industry evolves.",
      icon: <Zap className="w-6 h-6" />,
      gradient: "from-teal-400 to-emerald-500",
      glow: "rgba(23,182,168,0.3)",
    },
  ];

  const team = [
    { name: "Mohammad Milon", role: "Project Architect", image: "/milon.jpg", highlight: true },
    { name: "Kakoly Akhter", role: "Lead UI/UX Designer", image: "https://i.ibb.co.com/39vMkftd/unnamed.jpg" },
    { name: "Md Nayem Talukda", role: "Full Stack Developer", image: "https://i.ibb.co.com/fG94NS2Z/nayem.jpg" },
    { name: "Amena Akter Kona", role: "Frontend Developer", image: "https://i.ibb.co.com/BVHzK20V/amena.jpg" },
    { name: "MH Nahid", role: "Backend Developer", image: "https://i.ibb.co.com/HDp7yRqh/nahid.jpg" },
    { name: "Moinul Islam", role: "Marketing Specialist", image: "https://i.ibb.co.com/nM402x4S/Whats-App-Image-2026-03-02-at-11-15-28-PM.jpg" },
  ];

  const missions = [
    "Personalized learning for every individual",
    "Closing the industry skill gap globally",
    "Making high-quality tech education accessible",
    "Accelerating career growth through data",
  ];

  return (
    <>
      <FontImport />
      <div className="relative w-full min-h-screen overflow-x-hidden selection:bg-teal-500/30"
        style={{ 
          background: 'radial-gradient(ellipse at 15% 40%, #071320 0%, #0b1d2e 55%, #060f1a 100%)' 
        }}>

        {/* 3D Background */}
        <HeroCanvas />

        {/* Readability overlay */}
        <div className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)' }} />

        {/* Ambient orbs - Updated Colors */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          <Orb className="top-[-10%] left-[-8%] opacity-20" color="radial-gradient(circle, #17B6A8, transparent 70%)" />
          <Orb className="bottom-[-10%] right-[-8%] opacity-20" color="radial-gradient(circle, #0fd4c4, transparent 70%)" />
          <Orb className="top-[35%] left-[40%] opacity-10 w-64 h-64" color="radial-gradient(circle, #f5c842, transparent 70%)" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Navbar />
        </div>

        <main style={{ position: 'relative', zIndex: 2 }}>

          {/* ══════════════════════════
              HERO
          ══════════════════════════ */}
          <section className="pt-[160px] pb-24 px-4 text-center">
            <div className="max-w-5xl mx-auto">

              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(23,182,168,0.18), rgba(15,212,196,0.12))',
                  border: '1px solid rgba(23,182,168,0.35)',
                  boxShadow: '0 0 40px rgba(23,182,168,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                </motion.div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-teal-300">Our Story</span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </motion.div>

              {/* Headline */}
              <div className="relative mb-2">
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
                  <div style={{
                    width: '70%', height: '60%',
                    background: 'radial-gradient(ellipse, rgba(23,182,168,0.22) 0%, rgba(15,212,196,0.12) 45%, transparent 75%)',
                    filter: 'blur(40px)',
                  }} />
                </div>

                <div className="overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
                  <motion.p
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="syne font-black leading-[1.05] tracking-[-0.03em]"
                    style={{
                      fontSize: 'clamp(1.1rem, 2.8vw, 2rem)',
                      color: 'rgba(200,230,225,0.75)',
                      textShadow: '0 2px 20px rgba(23,182,168,0.3)',
                    }}>
                    Empowering the
                  </motion.p>
                </div>

                <div className="overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
                  <motion.h1
                    initial={{ y: 90, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                    className="syne font-black leading-[0.9] tracking-[-0.04em]"
                    style={{
                      fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                      backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #e0f2f1 25%, #99f6e4 50%, #5eead4 75%, #14b8a6 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 30px rgba(23,182,168,0.6)) drop-shadow(0 8px 80px rgba(23,182,168,0.3))',
                    }}>
                    Next Generation
                  </motion.h1>
                </div>

                <div className="overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
                  <motion.p
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="syne font-black leading-[1.05] tracking-[-0.02em]"
                    style={{
                      fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
                      backgroundImage: 'linear-gradient(90deg, #67e8f9 0%, #22d3ee 50%, #f5c842 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 24px rgba(15,212,196,0.45))',
                    }}>
                    of Tech Talent
                  </motion.p>
                </div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center justify-center gap-4 mt-10 mb-8">
                <div className="h-px w-20 origin-right" style={{ background: 'linear-gradient(to right, transparent, rgba(23,182,168,0.7))' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                  <Zap className="w-4 h-4 text-teal-400" />
                </motion.div>
                <div className="h-px w-20 origin-left" style={{ background: 'linear-gradient(to left, transparent, rgba(23,182,168,0.7))' }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-16">
                SkillVoyager.AI was born out of a simple idea: that everyone deserves a personalized path to their dream career. We combine AI technology with human expertise to make that a reality.
              </motion.p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <Reveal key={i} delay={0.7 + i * 0.08}>
                    <TiltCard
                      className="relative overflow-hidden rounded-3xl p-6 text-center cursor-default"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      }}>
                      {({ hovered }) => (
                        <>
                          <div className="absolute inset-0 rounded-3xl transition-opacity duration-300"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${s.bg} 0%, transparent 70%)`, opacity: hovered ? 1 : 0 }} />
                          <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
                              style={{ background: s.bg, color: s.color, boxShadow: hovered ? `0 0 20px ${s.color}55` : 'none', transition: 'box-shadow 0.3s' }}>
                              {s.icon}
                            </div>
                            <div className="text-3xl font-black text-white mb-1 syne">
                              <Counter target={s.value} suffix={s.suffix} />
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em]">{s.label}</div>
                          </div>
                        </>
                      )}
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* MISSION SECTION - Updated Theme */}
          <section className="py-28 px-4 relative overflow-hidden">
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,29,46,0.5) 50%, transparent 100%)', backdropFilter: 'blur(2px)' }} />
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">

              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{ background: 'rgba(23,182,168,0.12)', border: '1px solid rgba(23,182,168,0.25)' }}>
                  <Target className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-400">Mission & Vision</span>
                </div>

                <h2 className="syne text-5xl md:text-6xl font-black mb-8 text-white leading-tight">
                  Building the <br />
                  <span style={{ backgroundImage: 'linear-gradient(90deg, #67e8f9, #0fd4c4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Future of Learning
                  </span>
                </h2>
                <p className="text-lg text-slate-400 font-medium mb-10 leading-relaxed">
                  We believe the current traditional education system can't keep pace with the rapid evolution of technology. Our vision is to bridge the gap between education and employment using AI-driven personalization.
                </p>

                <ul className="space-y-4">
                  {missions.map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <li className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] group"
                        style={{ border: '1px solid transparent' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(23,182,168,0.15)', border: '1px solid rgba(23,182,168,0.3)' }}>
                          <CheckCircle className="w-4 h-4 text-teal-400" />
                        </div>
                        <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">{item}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </Reveal>

              {/* Right Image Section - Same as before but enhanced glow */}
              <Reveal delay={0.2} y={50}>
                <div className="relative" style={{ perspective: '1000px' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-8 rounded-[4rem] pointer-events-none"
                    style={{ 
                      background: 'conic-gradient(from 0deg, rgba(23,182,168,0.3), rgba(15,212,196,0.15), rgba(103,232,249,0.2), rgba(23,182,168,0.3))', 
                      filter: 'blur(20px)' 
                    }} />

                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 rounded-[3rem] overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                      padding: '16px',
                    }}>
                    <img src={missionImg} alt="Mission and Vision"
                      className="rounded-[2.5rem] w-full object-cover"
                      style={{ aspectRatio: '4/3', filter: 'contrast(1.05) brightness(1.05) saturate(1.1)' }} />
                  </motion.div>

                  {/* Floating Badges */}
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 z-20 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                    style={{ background: 'rgba(23,182,168,0.15)', border: '1px solid rgba(23,182,168,0.35)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(23,182,168,0.3)' }}>
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-black text-white">AI Powered</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0], x: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -bottom-4 -left-4 z-20 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                    style={{ background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.3)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(245,200,66,0.2)' }}>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-black text-amber-400">Live Platform</span>
                  </motion.div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* CORE VALUES - Updated with Teal Theme */}
          <section className="py-28 px-4">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <div className="text-center mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: 'rgba(23,182,168,0.12)', border: '1px solid rgba(23,182,168,0.25)' }}>
                    <Heart className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-400">What We Stand For</span>
                  </div>
                  <h2 className="syne text-5xl md:text-6xl font-black mb-4 text-white">Core <span
                    style={{ backgroundImage: 'linear-gradient(90deg, #17B6A8, #f5c842)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Values</span>
                  </h2>
                  <p className="text-slate-500 max-w-xl mx-auto font-medium">These core principles guide everything we do at SkillVoyager.AI</p>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-6">
                {values.map((v, i) => (
                  <Reveal key={i} delay={i * 0.12}>
                    <TiltCard
                      className="relative overflow-hidden rounded-3xl p-8 cursor-default h-full"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                      }}>
                      {({ hovered }) => (
                        <>
                          <div className="absolute inset-0 rounded-3xl transition-opacity duration-500"
                            style={{ background: `radial-gradient(circle at 30% 30%, ${v.glow} 0%, transparent 65%)`, opacity: hovered ? 0.7 : 0 }} />

                          <div className="absolute top-4 right-6 syne font-black text-7xl pointer-events-none select-none"
                            style={{ color: 'rgba(255,255,255,0.03)' }}>0{i + 1}</div>

                          <div className="relative z-10" style={{ transform: 'translateZ(16px)' }}>
                            <motion.div
                              animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-6 text-white`}
                              style={{ boxShadow: hovered ? `0 12px 32px ${v.glow}` : `0 6px 18px ${v.glow}`, transition: 'box-shadow 0.3s' }}>
                              {v.icon}
                            </motion.div>

                            <h3 className="syne text-2xl font-black text-white mb-4">{v.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{v.description}</p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-black text-slate-600 group-hover:text-teal-400 transition-colors">
                              <span className="uppercase tracking-wider">Learn more</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </>
                      )}
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* TEAM SECTION - Updated Accent Colors */}
          <section className="py-28 px-4 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,29,46,0.5) 50%, transparent 100%)' }} />

            <div className="max-w-7xl mx-auto relative z-10">
              <Reveal>
                <div className="text-center mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: 'rgba(23,182,168,0.1)', border: '1px solid rgba(23,182,168,0.25)' }}>
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-400">The Team</span>
                  </div>
                  <h2 className="syne text-5xl md:text-6xl font-black mb-4 text-white">
                    Meet Our <span
                      style={{ backgroundImage: 'linear-gradient(90deg, #0fd4c4, #67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Visionaries
                    </span>
                  </h2>
                  <p className="text-slate-500 max-w-xl mx-auto font-medium">The experts building the future of personalized education</p>
                </div>
              </Reveal>

              {/* Team Leader - Updated Crown Color */}
              <div className="flex justify-center mb-16">
                <Reveal>
                  <TiltCard className="text-center cursor-default">
                    {({ hovered }) => (
                      <div className="relative inline-flex flex-col items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                          className="absolute pointer-events-none"
                          style={{
                            width: 310, height: 310,
                            borderRadius: '50%',
                            background: 'conic-gradient(from 0deg, rgba(23,182,168,0.8), rgba(15,212,196,0.4), rgba(245,200,66,0.6), rgba(23,182,168,0.8))',
                            padding: 3,
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))',
                          }} />

                        <img src={team[0].image} alt={team[0].name}
                          className="w-64 h-64 rounded-full object-cover relative z-10 transition-all duration-500"
                          style={{
                            border: '4px solid rgba(23,182,168,0.4)',
                            boxShadow: hovered ? '0 0 60px rgba(23,182,168,0.6), 0 30px 80px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.5)',
                            filter: 'contrast(1.08) brightness(1.06)',
                            transform: `translateZ(${hovered ? 20 : 0}px)`,
                          }} />

                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 4px 16px rgba(251,191,36,0.5)' }}>
                          <Star className="w-3 h-3 text-white fill-white" />
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">Team Leader</span>
                        </div>

                        <div className="mt-6 relative z-10" style={{ transform: 'translateZ(12px)' }}>
                          <h3 className="syne text-4xl font-black text-white">{team[0].name}</h3>
                          <p className="text-teal-400 font-bold mt-1">{team[0].role}</p>
                        </div>
                      </div>
                    )}
                  </TiltCard>
                </Reveal>
              </div>

              {/* Rest of team cards remain the same (TeamMemberCard component below) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12 max-w-4xl mx-auto">
                {team.slice(1, 4).map((m, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <TeamMemberCard member={m} />
                  </Reveal>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl mx-auto">
                {team.slice(4).map((m, i) => (
                  <Reveal key={i} delay={(i + 3) * 0.1}>
                    <TeamMemberCard member={m} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* CTA BRIDGE - Updated Teal Gradient */}
          <section className="py-28 px-4">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="relative overflow-hidden rounded-[3.5rem] p-14 md:p-20 text-center"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.09)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: 'conic-gradient(from 0deg, rgba(23,182,168,0.1), transparent 30%, rgba(15,212,196,0.08), transparent 70%, rgba(23,182,168,0.1))', 
                      borderRadius: '3.5rem' 
                    }} />

                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white"
                      style={{ 
                        background: 'linear-gradient(135deg, #17B6A8, #0fd4c4)', 
                        boxShadow: '0 0 40px rgba(23,182,168,0.5)' 
                      }}>
                      <MessageCircle className="w-7 h-7" />
                    </motion.div>

                    <h2 className="syne text-4xl md:text-6xl font-black text-white mb-6">
                      Have Questions?<br />
                      <span style={{ backgroundImage: 'linear-gradient(90deg, #67e8f9, #0fd4c4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        We're Here.
                      </span>
                    </h2>

                    <p className="text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed text-lg">
                      Whether you're a learner, a partner, or just curious about what we do, our team is always ready to connect.
                    </p>

                    <motion.a href="/helpdesk"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white syne font-black text-lg relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #0fd4c4 100%)',
                        boxShadow: '0 8px 40px rgba(23,182,168,0.5), 0 2px 8px rgba(0,0,0,0.4)',
                      }}>
                      <motion.div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)' }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 2 }} />
                      Get In Touch
                      <ArrowRight className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

        </main>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════
   TEAM MEMBER CARD - Minor accent update
═══════════════════════════════════════ */
const TeamMemberCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY-r.top)/r.height - 0.5) * -12, y: ((e.clientX-r.left)/r.width - 0.5) * 12 });
  };

  return (
    <div ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.04 : 1})`,
        transition: 'transform 0.18s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="text-center cursor-default">

      <div className="relative inline-flex flex-col items-center mb-5">
        <motion.div
          animate={{ rotate: hovered ? 360 : 0 }}
          transition={{ duration: 3, ease: 'linear', repeat: hovered ? Infinity : 0 }}
          className="absolute pointer-events-none"
          style={{
            width: 196, height: 196, borderRadius: '50%',
            background: hovered
              ? 'conic-gradient(from 0deg, rgba(23,182,168,0.9), rgba(15,212,196,0.5), rgba(245,200,66,0.7), rgba(23,182,168,0.9))'
              : 'none',
            border: hovered ? 'none' : '2px solid rgba(255,255,255,0.1)',
            padding: hovered ? 2 : 0,
            WebkitMask: hovered ? 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))' : 'none',
            mask: hovered ? 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))' : 'none',
          }} />

        <div className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-400"
          style={{ background: 'radial-gradient(circle, rgba(23,182,168,0.3), transparent 70%)', opacity: hovered ? 1 : 0 }} />

        <img src={member.image} alt={member.name}
          className="w-44 h-44 rounded-full object-cover relative z-10 transition-all duration-400"
          style={{
            border: hovered ? '3px solid rgba(23,182,168,0.5)' : '3px solid rgba(255,255,255,0.1)',
            boxShadow: hovered ? '0 20px 50px rgba(23,182,168,0.4), 0 0 0 6px rgba(23,182,168,0.08)' : '0 12px 40px rgba(0,0,0,0.5)',
            filter: 'contrast(1.08) brightness(1.05)',
            transform: `translateZ(${hovered ? 14 : 0}px)`,
          }} />
      </div>

      <div style={{ transform: `translateZ(${hovered ? 8 : 0}px)`, transition: 'transform 0.18s' }}>
        <h3 className="syne text-xl font-black text-white transition-colors"
          style={{ color: hovered ? '#e0f2f1' : 'white' }}>{member.name}</h3>
        <p className="text-teal-400 text-sm font-semibold mt-1 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0.7 }}>{member.role}</p>
      </div>
    </div>
  );
};

export default About;