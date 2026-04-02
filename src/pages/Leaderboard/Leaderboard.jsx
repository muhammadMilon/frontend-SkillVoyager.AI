import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp, ChevronDown, X, Zap, Trophy, Flame,
  TrendingUp, Users, Search, Filter, RefreshCw, Share2,
} from 'lucide-react';




const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';





const T = {
  bg: 'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)',
  card: 'rgba(7,19,32,0.85)',
  teal: '#17B6A8',
  tealDim: 'rgba(23,182,168,0.09)',
  tealMid: 'rgba(23,182,168,0.20)',
  border: 'rgba(23,182,168,0.18)',
  cyan: '#0fd4c4',
  gold: '#F5C842',
  text: 'rgba(255,255,255,0.90)',
  textDim: 'rgba(255,255,255,0.55)',
};

// ── Tiers ─────────────────────────────────────────────────────────────────────
const TIERS = [
  { min: 5000, next: Infinity, label: 'Legend', color: 'text-amber-300', bg: 'bg-amber-500/20', bar: 'from-amber-400 to-yellow-500', icon: '⚡', glow: 'from-amber-400/30 to-yellow-400/10' },
  { min: 2000, next: 5000, label: 'Master', color: 'text-cyan-300', bg: 'bg-cyan-500/20', bar: 'from-cyan-400 to-teal-500', icon: '💎', glow: 'from-cyan-400/30 to-teal-400/10' },
  { min: 1000, next: 2000, label: 'Expert', color: 'text-teal-300', bg: 'bg-teal-500/20', bar: 'from-teal-400 to-cyan-500', icon: '🔥', glow: 'from-teal-400/30 to-cyan-400/10' },
  { min: 500, next: 1000, label: 'Rising', color: 'text-emerald-300', bg: 'bg-emerald-500/20', bar: 'from-emerald-400 to-teal-500', icon: '🌱', glow: 'from-emerald-400/30 to-teal-400/10' },
  { min: 0, next: 500, label: 'Rookie', color: 'text-slate-400', bg: 'bg-slate-500/20', bar: 'from-slate-400 to-slate-500', icon: '⭐', glow: 'from-slate-400/20 to-slate-500/5' },
];

const getTier = (p = 0) => TIERS.find(t => p >= t.min) || TIERS[4];
const getXpPct = (p = 0) => {
  const t = getTier(p);
  if (t.next === Infinity) return 100;
  return Math.min(100, Math.round(((p - t.min) / (t.next - t.min)) * 100));
};

// ── Confetti ──────────────────────────────────────────────────────────────────
const COLORS = ['#17B6A8', '#0fd4c4', '#F5C842', '#4fc3f7', '#34d399', '#fbbf24', '#a78bfa'];

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 90 }, (_, i) => {
      const x = Math.random() * 100, dur = 2 + Math.random() * 2.5, del = Math.random() * 2;
      const col = COLORS[i % COLORS.length], sz = 4 + Math.random() * 7, rot = Math.random() * 360;
      return (
        <motion.div key={i} className="absolute rounded-sm"
          style={{ left: `${x}%`, top: -20, width: sz, height: sz, background: col, rotate: rot }}
          animate={{ y: ['0vh', '115vh'], rotate: rot + 900, opacity: [1, 1, 0] }}
          transition={{ duration: dur, delay: del, ease: 'linear' }} />
      );
    })}
  </div>
);

// ── Animated Counter ─────────────────────────────────────────────────────────
const AnimCounter = ({ target, delay = 0 }) => {
  const [val, setVal] = useState(0);
  const numericTarget = Number(target) || 0;

  useEffect(() => {
    if (numericTarget === 0) { setVal(0); return; }
    
    const timeout = setTimeout(() => {
      const steps = 30;
      const step = numericTarget / steps;
      const ms = 800 / steps;
      let c = 0;
      const iv = setInterval(() => {
        c++;
        setVal(Math.min(numericTarget, Math.round(step * c)));
        if (c >= steps) clearInterval(iv);
      }, ms);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [numericTarget, delay]); // target change হলে re-run হবে

  return <>{val.toLocaleString()}</>;
};

// ── Rank Badge ────────────────────────────────────────────────────────────────
const RankBadge = ({ change }) => {
  if (!change || change === 0) return null;
  const up = change > 0;
  return (
    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
      className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${up ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
      {up ? <ChevronUp size={9} /> : <ChevronDown size={9} />}{Math.abs(change)}
    </motion.span>
  );
};

// ── Profile Modal ─────────────────────────────────────────────────────────────
const ProfileModal = ({ u, rank, onClose }) => {
  if (!u) return null;
  const nm = u.displayName || u.email?.split('@')[0] || 'Anonymous';
  const inst = u.onboarding?.institution || 'Global Learner';
 const pts = u.allTimePoints ?? u.points ?? 0;
  const tier = getTier(pts);
  const pct = getXpPct(pts);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,18,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #071320, #091a28)', border: `1px solid ${T.border}`, boxShadow: `0 0 0 1px ${T.border}, 0 40px 80px rgba(0,0,0,0.7)` }}
        onClick={e => e.stopPropagation()}>

        <motion.div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
          animate={{ backgroundPosition: ['0% 0', '200% 0'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl transition-all"
          style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: T.textDim }}
          onMouseEnter={e => { e.currentTarget.style.background = T.tealMid; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.color = T.textDim; }}>
          <X size={15} />
        </button>

        <div className="relative mx-auto w-24 h-24 mb-5">
          <div className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-br ${tier.glow} opacity-70`} />
          <img src={u.photoURL || `https://ui-avatars.com/api/?background=17B6A8&color=fff&name=${encodeURIComponent(nm)}`}
            alt={nm} className="relative w-24 h-24 rounded-full object-cover shadow-2xl"
            style={{ border: `3px solid ${T.border}` }}
            onError={e => { e.target.src = 'https://ui-avatars.com/api/?background=17B6A8&color=fff&name=U'; }} />
          <div className="absolute -bottom-1 -right-1 text-2xl">{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : tier.icon}</div>
        </div>

        <h2 className="text-2xl font-black text-white text-center mb-0.5">{nm}</h2>
        <p className="text-xs font-bold text-center mb-1" style={{ color: T.teal }}>🏫 {inst}</p>
        {u.onboarding?.targetCareer && <p className="text-xs text-center mb-4" style={{ color: T.textDim }}>🎯 {u.onboarding.targetCareer}</p>}

        <div className="mx-auto w-fit px-4 py-1.5 rounded-full font-black text-sm mb-5"
          style={{ background: T.tealDim, color: T.teal, border: `1px solid ${T.border}` }}>
          {tier.icon} {tier.label}
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold" style={{ color: T.textDim }}>XP Progress</span>
            {tier.next !== Infinity
              ? <span style={{ color: T.textDim }}>{pts.toLocaleString()} / {tier.next.toLocaleString()}</span>
              : <span style={{ color: T.gold }} className="font-bold">MAX ⚡</span>}
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${tier.bar}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: 'All-time XP', value: `${pts.toLocaleString()} XP`, color: T.gold },
            { icon: Trophy, label: 'Global Rank', value: `#${rank}`, color: T.teal },
            { icon: Flame, label: 'Streak', value: `${u.streak || 0} days 🔥`, color: '#fb923c' },
            { icon: TrendingUp, label: 'Weekly XP', value: `${(u.weeklyPoints || 0).toLocaleString()} XP`, color: '#34d399' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl p-4 text-center"
              style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
              <Icon size={15} style={{ color, margin: '0 auto 6px' }} />
              <p className="font-black text-sm" style={{ color }}>{value}</p>
              <p className="text-[10px]" style={{ color: T.textDim }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Expanded Row Stats ────────────────────────────────────────────────────────
const ExpandedStats = ({ u, rank }) => {
const pts = u.allTimePoints ?? u.points ?? 0;
  const tier = getTier(pts);
  const pct = getXpPct(pts);
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
      className="overflow-hidden"
      style={{ background: T.tealDim, borderBottom: `1px solid ${T.border}` }}>
      <div className="px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: 'All-time XP', value: `${pts.toLocaleString()} XP`, color: T.gold },
          { icon: Trophy, label: 'Global Rank', value: `#${rank + 1}`, color: T.teal },
          { icon: Flame, label: 'Streak', value: `${u.streak || 0} days 🔥`, color: '#fb923c' },
          { icon: TrendingUp, label: 'Weekly XP', value: `${(u.weeklyPoints || 0).toLocaleString()} XP`, color: '#34d399' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: T.tealDim }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color }}>{value}</p>
              <p className="text-[10px]" style={{ color: T.textDim }}>{label}</p>
            </div>
          </div>
        ))}
        <div className="col-span-2 md:col-span-4">
          <div className="flex justify-between text-[10px] mb-1.5" style={{ color: T.textDim }}>
            <span>Progress → {tier.next !== Infinity ? TIERS[TIERS.indexOf(tier) - 1]?.label || 'Next Tier' : 'MAX TIER'}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${tier.bar}`} />
          </div>
        </div>
        {u.onboarding?.targetCareer && (
          <p className="col-span-2 md:col-span-4 text-[11px]" style={{ color: T.textDim }}>
            🎯 Target: <span style={{ color: T.teal }} className="font-bold">{u.onboarding.targetCareer}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ── Podium Card ───────────────────────────────────────────────────────────────
const PCFG = {
  1: { h: 'h-36', grad: 'from-amber-400 to-yellow-400', lbl: '1st' },
  2: { h: 'h-24', grad: 'from-teal-400 to-cyan-400', lbl: '2nd' },
  3: { h: 'h-20', grad: 'from-cyan-400 to-teal-500', lbl: '3rd' },
};

const PodiumCard = ({ u, rank, delay }) => {
  const cfg = PCFG[rank];
  const isFirst = rank === 1;
  const nm = u.displayName || u.email?.split('@')[0] || 'Anon';
  const inst = u.onboarding?.institution || 'Global Learner';
const pts = u.allTimePoints ?? u.points ?? 0;
  const tier = getTier(pts);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', damping: 16 }}
      className={`flex flex-col items-center ${isFirst ? 'scale-110 z-10' : ''}`}>

      <div className="relative mb-3">
        {isFirst && (
          <motion.span animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 text-3xl select-none z-10">👑</motion.span>
        )}
        {!isFirst && <span className="absolute -top-3 -right-1 text-xl z-10 select-none">{rank === 2 ? '🥈' : '🥉'}</span>}
        <motion.div animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: rank * 0.3 }}
          className={`absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br ${tier.glow}`} />
        <img src={u.photoURL || `https://ui-avatars.com/api/?background=17B6A8&color=fff&name=${encodeURIComponent(nm)}`}
          alt={nm}
          className={`relative rounded-2xl object-cover shadow-2xl ${isFirst ? 'w-20 h-20' : 'w-16 h-16'}`}
          style={{ border: `3px solid ${isFirst ? T.gold : T.teal}` }}
          onError={e => { e.target.src = 'https://ui-avatars.com/api/?background=17B6A8&color=fff&name=U'; }} />
      </div>

      <p className={`font-black text-center max-w-[100px] truncate mb-0.5 ${isFirst ? 'text-white' : 'text-slate-300 text-sm'}`}>{nm}</p>
      <p className="text-[10px] font-bold truncate max-w-[100px] mb-0.5" style={{ color: T.teal }}>{inst}</p>
      {u.streak > 0 && <p className="text-[10px] text-orange-400 mb-0.5">🔥 {u.streak}d</p>}
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black mb-2"
        style={{ background: T.tealDim, color: T.teal, border: `1px solid ${T.border}` }}>
        {tier.icon} {tier.label}
      </div>
      <p className={`font-black mb-3 ${isFirst ? 'text-amber-400 text-lg' : 'text-slate-400 text-sm'}`}>
        <AnimCounter target={pts} delay={delay * 500 + 200} /> XP
      </p>
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom' }}
        className={`w-28 ${cfg.h} rounded-t-2xl bg-gradient-to-b ${cfg.grad} flex items-center justify-center shadow-xl`}>
        <span className="text-white font-black text-lg">{cfg.lbl}</span>
      </motion.div>
    </motion.div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = ({ delay }) => (
  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
    className="animate-pulse" style={{ borderBottom: `1px solid rgba(23,182,168,0.07)` }}>
    <td className="px-6 py-4"><div className="w-8 h-4 rounded" style={{ background: 'rgba(23,182,168,0.10)' }} /></td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'rgba(23,182,168,0.10)' }} />
        <div className="space-y-2">
          <div className="w-28 h-3 rounded" style={{ background: 'rgba(23,182,168,0.10)' }} />
          <div className="w-20 h-2 rounded" style={{ background: 'rgba(23,182,168,0.06)' }} />
        </div>
      </div>
    </td>
    <td className="px-6 py-4 hidden md:table-cell"><div className="w-14 h-5 rounded-lg" style={{ background: 'rgba(23,182,168,0.10)' }} /></td>
    <td className="px-6 py-4 hidden md:table-cell"><div className="w-32 h-2 rounded-full" style={{ background: 'rgba(23,182,168,0.10)' }} /></td>
    <td className="px-6 py-4 text-right"><div className="w-10 h-4 rounded ml-auto" style={{ background: 'rgba(23,182,168,0.10)' }} /></td>
  </motion.tr>
);

// ── Main Leaderboard ──────────────────────────────────────────────────────────
function Leaderboard() {
  const { user } = useContext(AuthContext) || {};

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [instFilter, setInstFilter] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const autoRef = useRef(null);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
        osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    } catch (_) { }
  }, []);

  const fetchLeaderboard = useCallback(async (silent = false, filter = timeFilter) => {
    silent ? setIsRefreshing(true) : setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leaderboard`, { params: { filter } });
      const raw = res.data || [];


      // ডিবাগ: দেখুন raw ডাটা থেকে points আসছে কিনা
      console.log('RAW DATA POINTS CHECK:', raw[0]?.points);
      
      const seen = new Set();
      const data = raw.filter(u => {
        const k = u.uid || u.email || u._id;
        if (!k) return true;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      
      // ডিবাগ: ফিল্টার করার পর points চেক করুন
      console.log('FILTERED DATA POINTS:', data[0]?.points);
      
      setUsers(data);
      setLastUpdated(new Date());
      if (!silent && data.length >= 3) {
        setShowConfetti(true);
        playSound();
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error('Could not load leaderboard.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [timeFilter, playSound]);
  useEffect(() => {
    fetchLeaderboard(false, timeFilter);
  }, [fetchLeaderboard, timeFilter]);

  useEffect(() => {
    autoRef.current = setInterval(() => fetchLeaderboard(true, timeFilter), 30000);
    return () => clearInterval(autoRef.current);
  }, [fetchLeaderboard, timeFilter]);

  const handleShare = async () => {
    const idx = users.findIndex(u => u.email === user?.email);
    const pts = me?.allTimePoints ?? me?.points ?? 0;
    const text = `🏆 I'm ranked #${idx + 1} on SkillVoyager.AI with ${pts} XP! 🚀\n${window.location.origin}/leaderboard`;
    try {
      if (navigator.share) await navigator.share({ title: 'My SkillVoyager Rank', text, url: window.location.href });
      else { await navigator.clipboard.writeText(text); toast.success('Rank copied! 📋'); }
    } catch (_) { }
  };

  const institutions = [...new Set(users.map(u => u.onboarding?.institution).filter(Boolean))].sort();
  const filtered = users.filter(u => {
    const nm = (u.displayName || u.email || '').toLowerCase();
    return nm.includes(search.toLowerCase()) && (!instFilter || u.onboarding?.institution === instFilter);
  });
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(search === '' && !instFilter ? 3 : 0);
  const showPodium = !loading && filtered.length >= 3 && search === '' && !instFilter;
  const myIdx = users.findIndex(u => u.email === user?.email);
  const me = myIdx >= 0 ? users[myIdx] : null;
const myPts = me?.allTimePoints ?? me?.points ?? 0;
  const myTier = getTier(myPts);
  const myXpPct = getXpPct(myPts);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: 'white' }} className="pt-[160px] pb-16 px-4 md:px-8">
      {showConfetti && <Confetti />}

      <AnimatePresence>
        {selectedUser && <ProfileModal u={selectedUser.u} rank={selectedUser.rank} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>

      {/* BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(23,182,168,0.10), transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(15,212,196,0.07), transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(rgba(23,182,168,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: T.teal }} />
            <span style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Trophy style={{ width: 11, height: 11 }} /> Global Rankings
            </span>
            <div style={{ width: 28, height: 2, background: T.teal }} />
          </div>
          <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(38px,5.5vw,64px)', lineHeight: 1.05, margin: '0 0 14px' }}>
            Voyager <span style={{ color: T.teal }}>Leaderboard</span>
          </h1>
          <p style={{ color: T.textDim, fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto 48px', maxWidth: 480 }}>
            Meet the elite learners. Every roadmap built and skill analyzed brings you closer to the top.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: Users, v: users.length, label: 'Learners', c: T.teal },
             
{ icon: Zap, v: users[0] ? `${(users[0].allTimePoints ?? users[0].points ?? 0).toLocaleString()} XP` : '—', label: 'Top Score', c: T.gold },
              { icon: TrendingUp, v: myIdx >= 0 ? `#${myIdx + 1}` : '—', label: 'Your Rank', c: T.cyan },
            ].map(({ icon: Icon, v, label, c }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ border: `1px solid ${T.border}`, background: T.tealDim }}>
                <Icon size={13} style={{ color: c }} />
                <span className="text-white font-black text-sm">{v}</span>
                <span className="text-xs" style={{ color: T.textDim }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Filter bar ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>

          <div className="relative" style={{ flex: '1 1 200px', minWidth: 180, maxWidth: 280 }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textDim }} />
            <input type="text" placeholder="Find a Voyager..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-9 py-2.5 rounded-2xl text-sm font-bold outline-none transition-all"
              style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: 'white' }}
              onFocus={e => { e.target.style.border = `1px solid ${T.teal}`; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; }}
              onBlur={e => { e.target.style.border = `1px solid ${T.border}`; e.target.style.boxShadow = 'none'; }} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: T.textDim }}><X size={14} /></button>
            )}
          </div>

          {institutions.length > 0 && (
            <div className="relative" style={{ flex: '1 1 160px', minWidth: 140, maxWidth: 220 }}>
              <Filter size={13} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
              <select value={instFilter} onChange={e => setInstFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none appearance-none cursor-pointer"
                style={{ background: T.tealDim, border: `1px solid ${T.border}`, color: T.textDim }}>
                <option value="" style={{ background: '#071320' }}>All Institutes</option>
                {institutions.map(i => <option key={i} value={i} style={{ background: '#071320' }}>{i}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: T.tealDim, border: `1px solid ${T.border}` }}>
              {[{ k: 'all', l: 'All Time' }, { k: 'monthly', l: 'Monthly' }, { k: 'weekly', l: 'Weekly' }].map(({ k, l }) => (
                <button key={k} onClick={() => setTimeFilter(k)}
                  className="py-2 px-3 rounded-lg text-[11px] font-black transition-all whitespace-nowrap"
                  style={{ background: timeFilter === k ? T.teal : 'transparent', color: timeFilter === k ? 'white' : T.textDim }}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => fetchLeaderboard(true)} disabled={isRefreshing}
              className="p-2.5 rounded-xl transition-all"
              style={{ border: `1px solid ${T.border}`, background: T.tealDim, color: T.textDim }}
              onMouseEnter={e => { e.currentTarget.style.background = T.tealMid; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.tealDim; e.currentTarget.style.color = T.textDim; }}>
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            {user && myIdx >= 0 && (
              <button onClick={handleShare}
                className="p-2.5 rounded-xl transition-all"
                style={{ border: `1px solid ${T.border}`, background: T.tealDim, color: T.teal }}
                onMouseEnter={e => e.currentTarget.style.background = T.tealMid}
                onMouseLeave={e => e.currentTarget.style.background = T.tealDim}>
                <Share2 size={15} />
              </button>
            )}
            <div className="flex items-center gap-2 text-[11px] px-2" style={{ color: T.textDim }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.teal }} />
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Live'}
            </div>
          </div>
        </motion.div>

        {/* ── My Position Banner ── */}
        {user && me && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative mb-10 rounded-3xl p-6 overflow-hidden"
            style={{ border: `1px solid ${T.border}`, background: 'linear-gradient(135deg, rgba(23,182,168,0.10), rgba(15,212,196,0.05), rgba(23,182,168,0.10))' }}>
            <motion.div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['0% 0', '200% 0'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0 cursor-pointer"
                  onClick={() => setSelectedUser({ u: me, rank: myIdx + 1 })}>
                  <img src={user.photoURL || `https://ui-avatars.com/api/?background=17B6A8&color=fff&name=${encodeURIComponent(user.displayName || 'U')}`}
                    alt="you" className="w-14 h-14 rounded-2xl object-cover hover:scale-105 transition-transform"
                    style={{ border: `2px solid ${T.teal}` }}
                    onError={e => { e.target.src = 'https://ui-avatars.com/api/?background=17B6A8&color=fff&name=U'; }} />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ background: T.teal }}>✦</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-0.5" style={{ color: T.teal }}>Your Position</p>
                  <p className="text-lg font-black text-white">{user.displayName || user.email?.split('@')[0]}</p>
                  {me.streak > 0 && <p className="text-xs text-orange-400 font-bold">🔥 {me.streak} day streak</p>}
                  <div className="mt-1.5 w-52">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className={`${myTier.color} font-black`}>{myTier.icon} {myTier.label}</span>
                      {myTier.next !== Infinity
                        ? <span style={{ color: T.textDim }}>{myPts.toLocaleString()} / {myTier.next.toLocaleString()} XP</span>
                        : <span style={{ color: T.gold }} className="font-bold">MAX ⚡</span>}
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${myXpPct}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${myTier.bar}`} />
                    </div>
                    {myTier.next !== Infinity && (
                      <p className="text-[10px] mt-1" style={{ color: T.textDim }}>
                        {(myTier.next - myPts).toLocaleString()} XP to {TIERS[TIERS.indexOf(myTier) - 1]?.label || 'Next Tier'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-white">#{myIdx + 1}</p>
                <p className="font-bold text-sm mt-1" style={{ color: T.teal }}><AnimCounter target={myPts} delay={200} /> XP</p>
                {me.weeklyPoints > 0 && <p className="text-[11px] text-green-400 mt-0.5">+{me.weeklyPoints} this week</p>}
                <button onClick={handleShare}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto"
                  style={{ background: T.tealDim, color: T.teal, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = T.tealMid}
                  onMouseLeave={e => e.currentTarget.style.background = T.tealDim}>
                  <Share2 size={11} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Podium ── */}
        {showPodium && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }} className="mb-14">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{ width: 28, height: 2, background: T.teal }} />
              <span style={{ color: T.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em' }}>🏆 Top Champions</span>
              <div style={{ width: 28, height: 2, background: T.teal }} />
            </div>
            <div className="flex items-end justify-center gap-4 md:gap-10">
              {[{ p: top3[1], r: 2 }, { p: top3[0], r: 1 }, { p: top3[2], r: 3 }].map(({ p, r }, i) =>
                p ? <PodiumCard key={r} u={p} rank={r} delay={0.2 + i * 0.1} /> : null
              )}
            </div>
          </motion.div>
        )}

        {/* ── Table ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl"
          style={{ background: T.card, border: `1px solid ${T.border}` }}>

          <motion.div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 0', '200% 0'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Rank', 'Voyager', 'Tier', 'Progress', 'XP'].map((h, i) => (
                    <th key={h}
                      className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest ${i >= 2 && i <= 3 ? 'hidden md:table-cell' : ''} ${i === 4 ? 'text-right' : ''}`}
                      style={{ color: T.textDim }}>{h}</th>
                  ))}
                 </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} delay={i * 0.04} />)
                  ) : (showPodium ? rest : filtered).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <p className="text-5xl mb-3">🔍</p>
                        <p className="font-bold" style={{ color: T.textDim }}>No Voyagers Found</p>
                      </td>
                    </tr>
                  ) : (
                    (showPodium ? rest : filtered).map((u, index) => {
                      const rowId = u.uid || u.email || u._id || String(index);
                      const realIdx = users.indexOf(u);
                      const isMe = user?.email === u.email;
                      const isExpand = expandedRow === rowId;
                      const isHover = hoveredRow === rowId;
                     const userPoints = u.allTimePoints ?? u.points ?? 0;
                      const tier = getTier(userPoints);
                      const xpPct = getXpPct(userPoints);
                      const nm = u.displayName || u.email?.split('@')[0] || 'Anonymous';
                      const inst = u.onboarding?.institution || 'Global Learner';

                      return (
                        <React.Fragment key={`wrapper-${rowId}`}>
                          <motion.tr
                            key={rowId}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.025 }}
                            onMouseEnter={() => setHoveredRow(rowId)}
                            onMouseLeave={() => setHoveredRow(null)}
                            onClick={() => setExpandedRow(isExpand ? null : rowId)}
                            className="cursor-pointer select-none transition-all"
                            style={{
                              borderBottom: `1px solid ${T.border}`,
                              borderLeft: isMe ? `3px solid ${T.teal}` : undefined,
                              background: isMe
                                ? 'rgba(23,182,168,0.08)'
                                : isHover
                                  ? 'rgba(23,182,168,0.05)'
                                  : isExpand
                                    ? 'rgba(23,182,168,0.04)'
                                    : 'transparent',
                            }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={realIdx < 3 ? 'text-xl' : `text-sm font-black ${realIdx < 10 ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {realIdx === 0 ? '🥇' : realIdx === 1 ? '🥈' : realIdx === 2 ? '🥉' : `#${realIdx + 1}`}
                                </span>
                                <RankBadge change={u.rankChange} />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0"
                                  onClick={e => { e.stopPropagation(); setSelectedUser({ u, rank: realIdx + 1 }); }}>
                                  <motion.div animate={isHover ? { scale: 1.08 } : { scale: 1 }}>
                                    {isHover && <div className={`absolute inset-0 rounded-xl blur-md opacity-50 bg-gradient-to-br ${tier.bar}`} />}
                                    <img src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(nm)}&background=17B6A8&color=fff`}
                                      alt={nm} className="relative w-10 h-10 rounded-xl object-cover transition-all"
                                      style={{ border: `2px solid ${isMe ? T.teal : isHover ? 'rgba(255,255,255,0.3)' : T.border}` }}
                                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nm)}&background=17B6A8&color=fff`; }} />
                                    {isMe && (
                                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                                        style={{ background: T.teal }}>✦</span>
                                    )}
                                  </motion.div>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-sm font-black truncate transition-colors"
                                      style={{ color: isMe ? T.teal : isHover ? T.teal : 'white' }}>{nm}</span>
                                    {isMe && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black shrink-0"
                                        style={{ background: T.tealDim, color: T.teal, border: `1px solid ${T.border}` }}>YOU</span>
                                    )}
                                    {u.streak > 1 && <span className="text-[9px] text-orange-400 font-black shrink-0">🔥{u.streak}</span>}
                                  </div>
                                  <p className="text-[10px] font-bold truncate" style={{ color: T.teal, opacity: 0.75 }}>{inst}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <motion.span animate={isHover ? { scale: 1.05 } : { scale: 1 }}
                                className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-black ${tier.bg} ${tier.color}`}>
                                {tier.icon} {tier.label}
                              </motion.span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <div className="flex items-center gap-2 w-32">
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.025 + 0.2 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${tier.bar}`} />
                                </div>
                                <span className="text-[10px] shrink-0" style={{ color: T.textDim }}>{xpPct}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <motion.div animate={isHover ? { scale: 1.05 } : { scale: 1 }}>
                                <p className="text-sm font-black"
                                  style={{ color: realIdx === 0 ? T.gold : isMe ? T.teal : 'white' }}>
                                  <AnimCounter target={userPoints} delay={index * 20} />
                                </p>
                                <p className="text-[10px] font-bold" style={{ color: T.textDim }}>XP</p>
                              </motion.div>
                            </td>
                          </motion.tr>
                          <AnimatePresence>
                            {isExpand && (
                              <tr key={`expand-${rowId}`}>
                                <td colSpan="5" className="p-0">
                                  <ExpandedStats u={u} rank={realIdx} />
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="text-center text-[11px] mt-6" style={{ color: T.textDim }}>
          Click row to expand · Click avatar for profile · {users.length} voyagers competing globally
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;