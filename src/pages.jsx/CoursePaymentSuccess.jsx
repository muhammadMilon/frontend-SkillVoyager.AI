import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaGraduationCap, FaInfinity, FaStar, FaShieldAlt } from 'react-icons/fa';

const BACKEND = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

// ── localStorage ──────────────────────────────────────────────────────────────
const PURCHASED_KEY = 'sv_purchased_courses';
const markPurchased = (id) => {
  if (!id) return;
  const strId = String(id).trim();
  try {
    const list = JSON.parse(localStorage.getItem(PURCHASED_KEY) || '[]');
    if (!list.includes(strId)) {
      localStorage.setItem(PURCHASED_KEY, JSON.stringify([...list, strId]));
    }
    console.log('✅ localStorage saved courseId:', strId);
  } catch (e) {
    console.error('localStorage error:', e);
  }
};

// ── Confetti ──────────────────────────────────────────────────────────────────
const COLORS = ['#17B6A8','#0fd4c4','#F5C842','#f87171','#a78bfa','#34d399','#60a5fa','#fb7185','#fbbf24'];
function ConfettiCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const ps = Array.from({ length: 180 }, () => ({
      x: Math.random() * c.width, y: -10 - Math.random() * 200,
      w: 5 + Math.random() * 10, h: 3 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 360, rs: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 4, vy: 1.5 + Math.random() * 4,
      op: 1, circle: Math.random() > 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      ps.forEach(p => {
        if (p.op <= 0) return; alive = true;
        p.x += p.vx; p.y += p.vy; p.rot += p.rs; p.vy += 0.04;
        if (p.y > c.height * 0.65) p.op -= 0.014;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.op);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />;
}

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const n = (f, s, d, v = 0.15) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + s);
      g.gain.linearRampToValueAtTime(v, ctx.currentTime + s + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s + d);
      o.start(ctx.currentTime + s); o.stop(ctx.currentTime + s + d);
    };
    n(523, 0, .4); n(659, .1, .4); n(784, .2, .4); n(1047, .3, .8, .18);
    n(523, .55, 1.2, .12); n(659, .55, 1.2, .1); n(784, .55, 1.2, .1);
  } catch {}
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CoursePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get('session_id');

  // ✅ URL এ purchased param থাকতে পারে (PaymentModal থেকে পাঠানো)
  // অথবা না থাকলে backend থেকে নেব
  const purchasedFromUrl = searchParams.get('purchased');

  const [confetti, setConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Verifying payment...');

  useEffect(() => {
    // Debug: URL এ কী আছে দেখো
    console.log('Full URL:', window.location.href);
    console.log('All search params:', Object.fromEntries(searchParams.entries()));
    console.log('sessionId:', sessionId);
    console.log('purchasedFromUrl:', purchasedFromUrl);

    setTimeout(() => { setConfetti(true); playSound(); }, 300);

    const prog = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(prog); return 100; } return p + 100 / 38; });
    }, 100);

    const run = async () => {
      let courseId = purchasedFromUrl; // URL থেকে প্রথমে চেষ্টা

      // URL এ না থাকলে backend থেকে নাও
      if (!courseId && sessionId) {
        try {
          setStatus('Verifying with server...');
          const res = await fetch(`${BACKEND}/api/verify-session?session_id=${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            courseId = data?.courseId || null;
            console.log('Backend response:', data);
          }
        } catch (e) {
          console.warn('Backend verify failed:', e.message);
        }
      }

      if (courseId) {
        markPurchased(courseId);
        setStatus('✓ Course unlocked! Redirecting...');
        console.log('✅ Course unlocked:', courseId);
      } else {
        console.warn('⚠️ Could not get courseId');
        setStatus('Redirecting...');
      }

      await new Promise(r => setTimeout(r, 2800));

      if (courseId) {
        navigate(`/courses?purchased=${encodeURIComponent(String(courseId))}`, { replace: true });
      } else {
        navigate('/courses', { replace: true });
      }
    };

    run();
    return () => clearInterval(prog);
  }, []); // eslint-disable-line

  return (
    <>
      {confetti && <ConfettiCanvas />}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', background: 'linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)' }}>
        <div style={{ position: 'fixed', top: '-80px', left: '-60px', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,182,168,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-80px', right: '-60px', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: 480, textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(160deg, #0a1828 0%, #071320 100%)', borderRadius: 40, border: '1px solid rgba(23,182,168,0.25)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', padding: '56px 40px 0' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #17B6A8, #0fd4c4, #F5C842, #17B6A8, transparent)', backgroundSize: '200% auto', animation: 'shimmer 2s linear infinite', borderRadius: '40px 40px 0 0' }} />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, animation: 'bounceIn 0.7s cubic-bezier(.36,.07,.19,.97)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'rgba(23,182,168,0.15)', animation: 'ping 1.8s ease infinite' }} />
              <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: 'rgba(23,182,168,0.07)', animation: 'ping 1.8s ease infinite', animationDelay: '0.4s' }} />
              <div style={{ position: 'relative', background: 'linear-gradient(135deg, rgba(23,182,168,0.2), rgba(15,212,196,0.1))', padding: 28, borderRadius: '50%', border: '3px solid rgba(23,182,168,0.4)', boxShadow: '0 0 50px rgba(23,182,168,0.35)' }}>
                <FaCheckCircle style={{ color: '#17B6A8', fontSize: 68, filter: 'drop-shadow(0 0 20px rgba(23,182,168,0.7))' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#17B6A8', background: 'rgba(23,182,168,0.1)', border: '1px solid rgba(23,182,168,0.3)', padding: '8px 20px', borderRadius: 999, marginBottom: 20, animation: 'fadeUp 0.5s ease 0.3s both' }}>
            <FaGraduationCap /> Enrollment Confirmed
          </div>

          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 10, lineHeight: 1.2, animation: 'fadeUp 0.5s ease 0.4s both' }}>
            You're all set! 🎉
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.75, maxWidth: 320, margin: '0 auto 28px', animation: 'fadeUp 0.5s ease 0.5s both' }}>
            Payment confirmed. You now have <strong style={{ color: 'rgba(255,255,255,0.9)' }}>lifetime access</strong> to your course.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24, animation: 'fadeUp 0.5s ease 0.6s both' }}>
            {[
              { icon: <FaInfinity />, label: 'Lifetime Access' },
              { icon: <FaStar />, label: 'Certificate Included' },
              { icon: <FaShieldAlt />, label: 'Secure & Verified' },
              { icon: <FaGraduationCap />, label: 'Learn at Your Pace' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(23,182,168,0.07)', border: '1px solid rgba(23,182,168,0.15)', borderRadius: 14, padding: '10px 14px' }}>
                <span style={{ color: '#17B6A8', fontSize: 13 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>

          {sessionId && (
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, border: '1px solid rgba(23,182,168,0.1)', animation: 'fadeUp 0.5s ease 0.7s both' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 5 }}>Payment Reference</p>
              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#17B6A8', wordBreak: 'break-all', lineHeight: 1.6 }}>{sessionId}</p>
            </div>
          )}

          <div style={{ animation: 'fadeUp 0.5s ease 0.8s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{status}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#17B6A8', fontWeight: 700 }}>
                <FaArrowRight size={9} /> Courses
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #17B6A8, #0fd4c4, #F5C842)', borderRadius: 4, transition: 'width 0.1s linear', boxShadow: '0 0 10px rgba(23,182,168,0.5)' }} />
            </div>
          </div>

          <div style={{ height: 36 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to top, rgba(23,182,168,0.05), transparent)', borderRadius: '0 0 40px 40px' }} />
        </div>
      </div>

      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.1)} 70%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping     { 75%,100%{transform:scale(2.2);opacity:0} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>
    </>
  );
}