import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import {
  HiOutlineUser, HiOutlineBell, HiOutlineSave,
  HiOutlineLink, HiOutlineAcademicCap, HiOutlineMail
} from "react-icons/hi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Send, Clock, CheckCircle2, TrendingUp, ListChecks, Target, Flame } from "lucide-react";
import emailjs from '@emailjs/browser';
import useAxiosSecure from '../api/axios';

// ── EmailJS config ────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_nytyq8e';
const EMAILJS_TEMPLATE_ID = 'template_52wnkqt';
const EMAILJS_PUBLIC_KEY  = 'duQ-tfdMtaYPR4VHR';

// ── helpers ───────────────────────────────────────────────────────────────────
const getSavedData = () => {
  try { const s = localStorage.getItem('userProfile'); return s ? JSON.parse(s) : null; }
  catch { return null; }
};
const buildProgressPayload = (progressData, profile) => {
  const pct = progressData?.percentage || profile?.mastery || 65;
  const milestones = progressData?.milestones || [];
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const streak = progressData?.streak || profile?.streak || 0;
  
  return {
    skill_progress  : `${pct}%`,
    completed_steps : `${completedCount} milestones`,
    upcoming_tasks  : milestones.find(m => m.status === 'pending')?.title || 'Next milestone awaiting',
    streak          : `${streak} days 🔥`,
    week_label      : `Week ${Math.ceil(new Date().getDate()/7)} · ${new Date().toLocaleString('default',{month:'long',year:'numeric'})}`,
  };
};

// ── theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg:        'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)',
  card:      'rgba(7,19,32,0.88)',
  cardBorder:'rgba(23,182,168,0.16)',
  teal:      '#17B6A8',
  tealDim:   'rgba(23,182,168,0.09)',
  tealMid:   'rgba(23,182,168,0.18)',
  border:    'rgba(23,182,168,0.18)',
  borderDim: 'rgba(23,182,168,0.10)',
  cyan:      '#0fd4c4',
  gold:      '#F5C842',
  pink:      '#ec4899',
  text:      'rgba(255,255,255,0.90)',
  textDim:   'rgba(255,255,255,0.55)',
  textFaint: 'rgba(255,255,255,0.28)',
};

// ── reusable card style ───────────────────────────────────────────────────────
const cardStyle = {
  background: T.card,
  border: `1px solid ${T.cardBorder}`,
  borderRadius: 28,
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(23,182,168,0.06)',
};

const Styles = () => (
  <style>{`
    .st-grid-main { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
    .st-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .st-grid-email { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .st-action-row { display: flex; gap: 14px; }

    @media (max-width: 1024px) {
      .st-grid-main { grid-template-columns: 1fr; }
      .st-grid-main > div:last-child { position: static !important; }
    }

    @media (max-width: 768px) {
      .st-grid-2col { grid-template-columns: 1fr; }
      .st-grid-email { grid-template-columns: 1fr; }
      .st-action-row { flex-direction: column; }
    }
  `}</style>
);

// ── Settings component ────────────────────────────────────────────────────────
const Settings = ({ user: authUser, profile: propProfile, onUpdate: propOnUpdate, progressData: propProgressData }) => {
  const { user: contextUser, dbUser: contextProfile } = useContext(AuthContext);
  const axios = useAxiosSecure();
  const saved = getSavedData();

  // Resolve data sources
  const user = authUser || contextUser;
  const profile = propProfile || contextProfile;
  const progressData = propProgressData;

  const [name,              setName]             = useState(profile?.name || user?.displayName || saved?.name || 'Voyager');
  const [photo,             setPhoto]            = useState(profile?.photoURL || user?.photoURL || saved?.photo || '');
  const [institute,         setInstitute]        = useState(profile?.institute || profile?.onboarding?.institution || saved?.institute || '');
  const [notifEnabled,      setNotifEnabled]     = useState(saved?.notifEnabled ?? true);
  const [loading,           setLoading]          = useState(false);
  const [emailAddress,      setEmailAddress]     = useState(profile?.email || user?.email || saved?.emailAddress || '');
  const [weeklyEmailEnabled,setWeeklyEmailEnabled]= useState(saved?.weeklyEmailEnabled ?? false);
  const [emailSending,      setEmailSending]     = useState(false);
  const [lastEmailSent,     setLastEmailSent]    = useState(saved?.lastEmailSent || null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || profile.displayName || user?.displayName || 'Voyager');
      setPhoto(profile.photoURL || user?.photoURL || '');
      setInstitute(profile.institute || profile.onboarding?.institution || '');
      setEmailAddress(profile.email || user?.email || '');
    }
  }, [profile, user]);

  const persist = (patch = {}) => {
    const current = getSavedData() || {};
    localStorage.setItem('userProfile', JSON.stringify({
      ...current, name, photo, institute, notifEnabled,
      emailAddress, weeklyEmailEnabled, lastEmailSent, ...patch,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const payload = { name, photoURL: photo, institute, email: emailAddress };
      
      if (propOnUpdate) {
        await propOnUpdate(payload);
      } else {
        // Fallback for standalone /settings route
        const uid = user?.uid;
        if (!uid) throw new Error("No UID found");
        await axios.patch(`/api/users/${uid}`, payload);
        toast.success("Profile updated successfully!");
        persist(payload);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress.trim()) { toast.error('Please enter your email address.', { theme:'dark' }); return; }
    setEmailSending(true);
    const progress = buildProgressPayload(progressData, profile);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        { to_name: name, to_email: emailAddress, institute: institute || (profile?.onboarding?.institute || 'SkillVoyager Member'), ...progress },
        EMAILJS_PUBLIC_KEY);
      const ts = new Date().toLocaleString('en-BD', { dateStyle:'medium', timeStyle:'short' });
      setLastEmailSent(ts); persist({ lastEmailSent: ts });
      toast.success(`📬 Report successfully delivered to ${emailAddress}`, { ...toastStyle, autoClose: 4000 });
    } catch (err) {
      console.error('EmailJS error:', err);
      toast.error('Email gateway failure. Check API credentials.', { theme:'dark', autoClose: 5000 });
    } finally { setEmailSending(false); }
  };

  const toastStyle = {
    theme: 'dark',
    style: { background: '#071320', color: '#e2e8f0', border: `1px solid ${T.teal}`, borderRadius: '14px' },
  };

  // shared input style
  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: 16,
    background: 'rgba(23,182,168,0.06)', border: `1px solid ${T.border}`,
    color: T.text, fontFamily: 'inherit', fontSize: 14, outline: 'none',
    transition: 'all 0.2s',
  };
  const inputFocus = (e) => { e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 3px rgba(23,182,168,0.12)`; };
  const inputBlur  = (e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; };

  const labelStyle = { fontSize: 12, fontWeight: 700, color: T.textDim, letterSpacing: '0.05em', display: 'block', marginBottom: 8 };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Styles />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* top accent line */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)` }} />

      {/* background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: '45vw', height: '45vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '38vw', height: '38vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(15,212,196,0.05) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '160px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          {/* section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 2, background: T.teal }} />
            <span style={{ color: T.teal, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Configuration</span>
            <div style={{ width: 24, height: 2, background: T.teal }} />
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, color: '#fff', margin: 0 }}>
            Account <span style={{ color: T.teal }}>Settings</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 15, color: T.textDim }}>Profile changes are synchronized with your neural database</p>
        </div>

        <div className="st-grid-main">

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Personal Info ── */}
            <section style={{ ...cardStyle, padding: '36px 40px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, transparent)` }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 220, background: `radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: T.tealDim, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiOutlineUser size={26} style={{ color: T.teal }} />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Personal Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="st-grid-2col">
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      disabled={loading} placeholder="Your full name"
                      style={{ ...inputStyle, opacity: loading ? 0.6 : 1 }}
                      onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                  <div>
                    <label style={labelStyle}>Institute / Organization</label>
                    <div style={{ position: 'relative' }}>
                      <HiOutlineAcademicCap style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.textDim }} size={18} />
                      <input type="text" value={institute} onChange={e => setInstitute(e.target.value)}
                        disabled={loading} placeholder="E.g. Dhaka University"
                        style={{ ...inputStyle, paddingLeft: 44, opacity: loading ? 0.6 : 1 }}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Profile Photo URL</label>
                  <div style={{ position: 'relative' }}>
                    <HiOutlineLink style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.textDim }} size={18} />
                    <input type="text" value={photo} onChange={e => setPhoto(e.target.value)}
                      disabled={loading} placeholder="https://example.com/photo.jpg"
                      style={{ ...inputStyle, paddingLeft: 44, opacity: loading ? 0.6 : 1 }}
                      onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '15px 0', borderRadius: 16, border: `1px solid ${T.border}`,
                  background: `linear-gradient(135deg, #0e2e2a, #0a2020)`,
                  color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                  boxShadow: `0 4px 20px rgba(23,182,168,0.18)`,
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = `0 6px 28px rgba(23,182,168,0.32)`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 20px rgba(23,182,168,0.18)`; }}>
                  <HiOutlineSave size={20} style={{ color: T.teal }} />
                  <span style={{ color: T.text }}>{loading ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </form>
            </section>

            {/* ── Weekly Progress Email ── */}
            <section style={{ ...cardStyle, padding: '36px 40px' }}>
              <div style={{ position: 'absolute', bottom: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.cyan}, transparent)` }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: T.tealDim, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiOutlineMail size={26} style={{ color: T.teal }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 3px', letterSpacing: '-0.5px' }}>Weekly Progress Email</h2>
                  <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Your skill report — delivered every week via EmailJS</p>
                </div>
              </div>

              {/* Email input */}
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Recipient Email</label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineMail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.textDim }} size={18} />
                  <input type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)}
                    placeholder="your@email.com"
                    style={{ ...inputStyle, paddingLeft: 44 }}
                    onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>

              {/* Preview cards */}
              <div style={{ borderRadius: 18, padding: 18, marginBottom: 22, background: 'rgba(23,182,168,0.05)', border: `1px solid ${T.borderDim}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: T.textFaint, marginBottom: 16 }}>📬 &nbsp;Email will include</p>
                <div className="st-grid-email">
                  {(() => {
                    const p = buildProgressPayload(progressData, profile);
                    return [
                      { icon: TrendingUp, color: T.teal,   bg: T.tealDim,               label: 'Skill Progress',  value: p.skill_progress },
                      { icon: ListChecks, color: T.cyan,   bg: 'rgba(15,212,196,0.09)',  label: 'Completed Steps', value: p.completed_steps },
                      { icon: Target,     color: T.gold,   bg: 'rgba(245,200,66,0.09)',  label: 'Upcoming Tasks',  value: p.upcoming_tasks  },
                      { icon: Flame,      color: '#f97316',bg: 'rgba(249,115,22,0.09)',  label: 'Current Streak',  value: p.streak          },
                    ].map(({ icon: Icon, color, bg, label: l, value }) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} style={{ color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 11, color: T.textFaint, margin: '0 0 2px' }}>{l}</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Last sent */}
              {lastEmailSent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, color: T.teal, fontSize: 13 }}>
                  <CheckCircle2 size={15} />
                  <span>Last sent: <strong>{lastEmailSent}</strong></span>
                </div>
              )}

              {/* Action row */}
              <div className="st-action-row">
                {/* Send Now */}
                <button onClick={handleSendEmail} disabled={emailSending} style={{
                  flex: 1, padding: '14px 0', borderRadius: 16, border: `1px solid ${T.border}`,
                  background: `linear-gradient(135deg, #0e2e2a, #0a2020)`,
                  color: 'white', fontWeight: 700, fontSize: 14, cursor: emailSending ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  opacity: emailSending ? 0.7 : 1, transition: 'all 0.2s',
                  boxShadow: `0 4px 16px rgba(23,182,168,0.18)`,
                }}>
                  <Send size={18} style={{ color: T.teal, animation: emailSending ? 'pulse 1s infinite' : 'none' }} />
                  <span style={{ color: T.text }}>{emailSending ? 'Sending…' : 'Send Report Now'}</span>
                </button>

                {/* Auto weekly toggle */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', borderRadius: 16, background: T.tealDim, border: `1px solid ${T.borderDim}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={18} style={{ color: T.teal }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: T.text, margin: '0 0 1px' }}>Auto Weekly</p>
                      <p style={{ fontSize: 11, color: T.textDim, margin: 0 }}>Next: {new Date(Date.now() + (7 - new Date().getDay() || 7) * 86400000).toLocaleDateString(undefined, {weekday:'long'})} · Recalibrating</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    const v = !weeklyEmailEnabled; setWeeklyEmailEnabled(v); persist({ weeklyEmailEnabled: v });
                    toast.info(v ? '📅 Weekly emails enabled!' : 'Weekly emails paused', toastStyle);
                  }} style={{
                    width: 52, height: 30, borderRadius: 99, padding: '0 3px', border: 'none',
                    background: weeklyEmailEnabled ? `linear-gradient(90deg, ${T.teal}, ${T.cyan})` : 'rgba(255,255,255,0.12)',
                    cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', flexShrink: 0,
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.3)', transform: weeklyEmailEnabled ? 'translateX(22px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
                  </button>
                </div>
              </div>

              <p style={{ marginTop: 16, fontSize: 12, color: T.textFaint }}>
                ⚙️ &nbsp;Requires EmailJS credentials in <code style={{ fontFamily: 'monospace', color: T.teal }}>Settings.jsx</code> —&nbsp;
                <a href="https://dashboard.emailjs.com" target="_blank" rel="noreferrer" style={{ color: T.teal }}>dashboard.emailjs.com</a>
              </p>
            </section>

            {/* ── Notification Toggle ── */}
            <div style={{ ...cardStyle, padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: T.tealDim, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiOutlineBell size={24} style={{ color: T.teal }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 3px' }}>Email Notifications</h3>
                  <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Weekly progress and roadmap alerts</p>
                </div>
              </div>
              <button onClick={() => { const v = !notifEnabled; setNotifEnabled(v); persist({ notifEnabled: v }); }} style={{
                width: 56, height: 32, borderRadius: 99, padding: '0 3px', border: 'none', flexShrink: 0,
                background: notifEnabled ? `linear-gradient(90deg, ${T.teal}, ${T.cyan})` : 'rgba(255,255,255,0.12)',
                cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center',
                boxShadow: notifEnabled ? `0 0 12px rgba(23,182,168,0.35)` : 'none',
              }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.3)', transform: notifEnabled ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
              </button>
            </div>
          </div>

          {/* ══ RIGHT COLUMN – Preview Card ══ */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ ...cardStyle, borderRadius: 32, padding: '40px 32px', textAlign: 'center' }}>
              {/* animated top line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)` }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 180, height: 180, background: `radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Avatar */}
              <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, rgba(23,182,168,0.3) 0%, transparent 70%)`, filter: 'blur(16px)' }} />
                <div style={{ position: 'relative', width: 160, height: 160, borderRadius: '50%', padding: 3, background: `linear-gradient(135deg, ${T.teal}, ${T.cyan}, ${T.gold})`, boxShadow: `0 0 32px rgba(23,182,168,0.30)` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#071320' }}>
                    <img
                      src={photo || `https://ui-avatars.com/api/?background=071320&color=17B6A8&name=${encodeURIComponent(name || 'User')}`}
                      alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?background=071320&color=17B6A8&name=${encodeURIComponent(name || 'User')}`; }} />
                  </div>
                </div>
              </div>

              {/* Name */}
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>{name || 'Skill Voyager'}</h2>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.teal, margin: '0 0 24px' }}>{institute || 'Global Voyager'}</p>

              {/* divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)`, marginBottom: 24 }} />

              {/* Email status */}
              <div style={{
                borderRadius: 18, padding: '14px 18px',
                background: weeklyEmailEnabled ? T.tealDim : 'rgba(255,255,255,0.04)',
                border: `1px solid ${weeklyEmailEnabled ? T.border : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.3s',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: weeklyEmailEnabled ? T.teal : T.textDim, margin: '0 0 4px' }}>
                  {weeklyEmailEnabled ? '📧 Weekly reports ON' : '📧 Weekly reports OFF'}
                </p>
                {emailAddress && <p style={{ fontSize: 12, color: T.textFaint, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emailAddress}</p>}
                {lastEmailSent && <p style={{ fontSize: 12, color: T.teal, margin: 0 }}>✓ {lastEmailSent}</p>}
              </div>

              <p style={{ marginTop: 20, fontSize: 13, color: T.textFaint, fontStyle: 'italic' }}>This is how others see your public profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;