import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap } from 'lucide-react';

const T = {
  teal:    '#17B6A8',
  tealDim: 'rgba(23,182,168,0.09)',
  tealMid: 'rgba(23,182,168,0.18)',
  border:  'rgba(23,182,168,0.18)',
  textDim: 'rgba(255,255,255,0.50)',
  textFaint:'rgba(255,255,255,0.25)',
};

const StepRole = ({ formData, updateFormData }) => {
  const roles = [
    { value: 'student',        label: 'Student',              icon: '🎓' },
    { value: 'professional',   label: 'Working Professional', icon: '💼' },
    { value: 'graduate',       label: 'Fresh Graduate',       icon: '🎯' },
    { value: 'career-changer', label: 'Career Changer',       icon: '🔄' },
  ];

  const educationLevels = [
    { value: 'high-school', label: 'High School'          },
    { value: 'bachelors',   label: "Bachelor's Degree"    },
    { value: 'masters',     label: "Master's Degree"      },
    { value: 'phd',         label: 'PhD'                  },
    { value: 'bootcamp',    label: 'Bootcamp/Self-taught' },
  ];

  return (
    <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
      transition={{ duration:0.3 }}
      style={{ display:'flex', flexDirection:'column', gap:32 }}>

      {/* Section header */}
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <div style={{ width:48, height:48, borderRadius:16, background:T.tealDim, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User style={{ width:22, height:22, color:T.teal }} />
          </div>
          <h2 style={{ fontSize:28, fontWeight:900, color:'white', margin:0, letterSpacing:'-0.5px' }}>Tell us about yourself</h2>
        </div>
        <p style={{ color:T.textDim, fontWeight:500, margin:0, fontSize:14 }}>
          Help us understand your background to personalize your learning path
        </p>
      </div>

      {/* Role selection */}
      <div>
        <label style={{ display:'block', fontSize:11, fontWeight:900, color:T.textFaint, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:14 }}>
          What best describes you?
        </label>
        <style>{`
          .role-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 14px; }
          @media (min-width: 640px) { .role-grid { grid-template-columns: repeat(2, 1fr); } }
        `}</style>
        <div className="role-grid">
          {roles.map(role => {
            const active = formData.role === role.value;
            return (
              <motion.button key={role.value} whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.98 }}
                onClick={() => updateFormData('role', role.value)}
                style={{
                  padding:'20px 22px', borderRadius:20,
                  border:`2px solid ${active ? T.teal : 'rgba(255,255,255,0.08)'}`,
                  background: active ? T.tealDim : 'rgba(255,255,255,0.03)',
                  display:'flex', alignItems:'center', gap:16, textAlign:'left', cursor:'pointer',
                  boxShadow: active ? `0 0 20px rgba(23,182,168,0.18)` : 'none',
                  transition:'all 0.25s',
                }}>
                <div style={{ width:56, height:56, borderRadius:14, background: active ? T.tealMid : 'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {role.icon}
                </div>
                <span style={{ fontWeight:900, fontSize:16, color: active ? T.teal : 'rgba(255,255,255,0.80)' }}>
                  {role.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Education level */}
      <div>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight:900, color:T.textFaint, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:14 }}>
          <GraduationCap style={{ width:15, height:15, color:T.teal }} />
          Education Level
        </label>
        <div style={{ position:'relative' }}>
          <select value={formData.education} onChange={e => updateFormData('education', e.target.value)}
            style={{
              width:'100%', padding:'16px 48px 16px 20px', borderRadius:18,
              border:`2px solid ${formData.education ? T.teal : 'rgba(23,182,168,0.18)'}`,
              background:'#071320', color: formData.education ? 'white' : T.textDim,
              fontSize:14, fontWeight:700, outline:'none', appearance:'none', cursor:'pointer',
              transition:'all 0.2s',
              boxShadow: formData.education ? `0 0 0 3px rgba(23,182,168,0.10)` : 'none',
            }}
            onFocus={e  => { e.target.style.borderColor=T.teal; e.target.style.boxShadow=`0 0 0 3px rgba(23,182,168,0.12)`; }}
            onBlur={e   => { e.target.style.borderColor=formData.education?T.teal:'rgba(23,182,168,0.18)'; e.target.style.boxShadow=formData.education?`0 0 0 3px rgba(23,182,168,0.10)`:'none'; }}>
            <option value="" style={{ background:'#071320', color:'rgba(255,255,255,0.40)' }}>Select your education level</option>
            {educationLevels.map(level => (
              <option key={level.value} value={level.value} style={{ background:'#071320', color:'white' }}>{level.label}</option>
            ))}
          </select>
          <div style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.teal }}>
            <svg style={{ width:18, height:18, fill:'currentColor' }} viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepRole;