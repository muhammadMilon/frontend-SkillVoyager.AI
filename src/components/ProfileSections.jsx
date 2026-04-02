import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Hash, MapPin, Globe, CreditCard, 
  Trash2, Plus, Sparkles, GraduationCap, Award, Calendar, 
  Book, ShoppingCart, Info, Briefcase, Camera, Mars, Rocket,
  Download, FileCheck, ShieldCheck,
  Save, Link2 as LinkIcon, ExternalLink, Brain, Building2, Star,History
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OfficialCertificatePDF from "./OfficialCertificatePDF";
import { toast } from 'react-toastify';


const T = {
  bg: 'linear-gradient(160deg, #040d18 0%, #071525 60%, #030c14 100%)',
  card: 'rgba(7,19,32,0.7)',
  cardSolid: '#071320',
  teal: '#17B6A8',
  tealDim: 'rgba(23,182,168,0.08)',
  tealMid: 'rgba(23,182,168,0.18)',
  cyan: '#0fd4c4',
  gold: '#F5C842',
  pink: '#ec4899',
  border: 'rgba(23,182,168,0.18)',
  borderDim: 'rgba(23,182,168,0.10)',
  text: 'rgba(255,255,255,0.92)',
  textDim: 'rgba(255,255,255,0.55)',
  textFaint: 'rgba(255,255,255,0.28)',
};

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
      <div style={{ 
        width: 44, height: 44, borderRadius: 12, background: T.tealDim, 
        border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px rgba(23,182,168,0.15)`
      }}>
        <Icon size={22} style={{ color: T.teal }} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>{title}</h2>
    </div>
    <p style={{ fontSize: 14, color: T.textDim, margin: 0, paddingLeft: 58 }}>{subtitle}</p>
  </div>
);

const SectionCard = ({ children, onSave, loading, showSave = true }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 28,
      padding: 'clamp(20px, 4vw, 40px)', marginBottom: 28, position: 'relative', overflow: 'hidden',
      backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    }}
  >
    {/* Decorative corner glow */}
    <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, rgba(23,182,168,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
    
    <div style={{ position: 'relative', zIndex: 1 }}>
      {children}
      
      {showSave && (
        <div style={{ marginTop: 40, paddingTop: 30, borderTop: `1px solid ${T.borderDim}`, display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }}
            onClick={onSave} 
            disabled={loading}
            style={{
              padding: '14px 28px', borderRadius: 14, 
              background: `linear-gradient(135deg, ${T.teal}, ${T.cyan})`,
              color: 'white', border: 'none', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
              boxShadow: `0 8px 25px rgba(23,182,168,0.3)`,
              opacity: loading ? 0.7 : 1,
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto'
            }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : <Save size={19} />}
            {loading ? 'Processing Mission...' : 'Sync Profile Data'}
          </motion.button>
        </div>
      )}
    </div>

    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </motion.div>
);

const InputGroup = ({ label, value, onChange, placeholder, type = "text", icon: Icon, required = false, onKeyDown }) => (
  <div style={{ marginBottom: 24 }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      {Icon && <Icon size={12} style={{ color: T.teal }} />}
      {label} {required && <span style={{ color: T.pink }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={type} value={value ?? ''} onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        style={{
          width: '100%', padding: '16px 20px', borderRadius: 16,
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
          color: 'white', fontSize: 15, outline: 'none', transition: 'all 0.3s',
          fontFamily: 'inherit', boxSizing: 'border-box'
        }}
        onFocus={e => {
          e.target.style.borderColor = T.teal;
          e.target.style.background = 'rgba(23,182,168,0.06)';
          e.target.style.boxShadow = `0 0 0 4px rgba(23,182,168,0.08)`;
        }}
        onBlur={e => {
          e.target.style.borderColor = T.border;
          e.target.style.background = 'rgba(255,255,255,0.03)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  </div>
);

const ActionButton = ({ onClick, icon: Icon, label, variant = "primary" }) => {
  const isPrimary = variant === "primary";
  return (
    <motion.button 
      whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        width: '100%', padding: '16px', borderRadius: 16,
        background: isPrimary ? T.tealDim : 'transparent',
        border: `1px dashed ${isPrimary ? T.teal : T.border}`,
        color: isPrimary ? T.teal : T.textDim,
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'all 0.2s', marginTop: 10
      }}
    >
      <Icon size={18} /> {label}
    </motion.button>
  );
};

const ProductivityHint = ({ text }) => (
  <div style={{
    padding: '16px 20px', borderRadius: 18, background: 'rgba(245,200,66,0.04)',
    border: `1px solid rgba(245,200,66,0.15)`, display: 'flex', gap: 12, alignItems: 'flex-start',
    marginTop: 32, marginBottom: 12
  }}>
    <Sparkles size={18} style={{ color: T.gold, flexShrink: 0, marginTop: 2 }} />
    <div>
      <p style={{ color: T.gold, fontSize: 11, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Productivity Hint</p>
      <p style={{ color: 'rgba(245,200,66,0.8)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  </div>
);



const ProfileSections = ({ view, dbUser, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (dbUser?.profile) setFormData(dbUser.profile);
  }, [dbUser]);

  const handleSave = async () => {
    if (!dbUser?.uid) { toast.error('Session Error: User ID not detected.'); return; }
    setLoading(true);
    try {
      await onUpdate({ profile: formData });
      toast.success(' Profile synced successfully!');
    } catch (err) {
      toast.error('Sync failed. Please try again.');
    } finally { setLoading(false); }
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      let cur = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i];
        if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
        cur[k] = { ...cur[k] };
        cur = cur[k];
      }
      cur[path[path.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (key, def) => setFormData(p => ({ ...p, [key]: [...(p[key] || []), def] }));
  const removeArrayItem = (key, idx) => setFormData(p => ({ ...p, [key]: (p[key] || []).filter((_, i) => i !== idx) }));
  const updateArrayItem = (arrKey, idx, field, val) => {
    setFormData(prev => {
      const arr = [...(prev[arrKey] || [])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...prev, [arrKey]: arr };
    });
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const cur = formData.jobProfile?.skills || [];
    if (!cur.includes(val)) updateField(['jobProfile', 'skills'], [...cur, val]);
    setSkillInput('');
  };

  const renderContent = () => {
    switch (view) {

      // â”€â”€ MY PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'my-profile':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Personal Identity" 
              subtitle="Update your core profile information across the SkillVoyager ecosystem." 
              icon={User} 
            />
            <div className="db-grid-2col">
              <InputGroup label="First Name" value={formData.firstName} onChange={v => updateField(['firstName'], v)} icon={Hash} />
              <InputGroup label="Last Name"  value={formData.lastName}  onChange={v => updateField(['lastName'], v)} icon={Hash} />
            </div>
            <InputGroup label="Profile Bio" value={formData.bio} onChange={v => updateField(['bio'], v)} placeholder="Bio-synchronization: Describe your professional essence..." icon={Sparkles} />
            <div className="db-grid-2col">
              <InputGroup label="Gender" value={formData.gender} onChange={v => updateField(['gender'], v)} icon={Mars} placeholder="Non-binary, Male, Female..." />
              <InputGroup label="Date of Birth" type="date" value={formData.dateOfBirth?.split('T')[0] ?? ''} onChange={v => updateField(['dateOfBirth'], v)} icon={Calendar} />
            </div>
            <ProductivityHint text="A detailed bio helps our neural network match you with high-precision mentorship opportunities and personalized course roadmaps." />
          </SectionCard>
        );

      // â”€â”€ ADDITIONAL INFO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'additional-info':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader title="Additional Information" subtitle="Secondary preferences and contact details." icon={Info} />
            <InputGroup label="Secondary Email" value={formData.secondaryEmail} onChange={v => updateField(['secondaryEmail'], v)} placeholder="backup@email.com" icon={Mail} />
            <InputGroup label="Languages Known" value={formData.languages} onChange={v => updateField(['languages'], v)} placeholder="English, Bengali, Spanish..." icon={Globe} />
            <ProductivityHint text="Adding your languages helps recruiters and mentors communicate with you more effectively." />
          </SectionCard>
        );

      // â”€â”€ ADDRESS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'address':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Geospatial Coordinates" 
              subtitle="Manage your physical locations for verified certifications and shipping." 
              icon={MapPin} 
            />
            <InputGroup label="Current Deployment (Address)" value={formData.address?.current ?? ''}  onChange={v => updateField(['address', 'current'], v)} placeholder="123 Neural St..." icon={MapPin} />
            <InputGroup label="Permanent Base" value={formData.address?.permanent ?? ''} onChange={v => updateField(['address', 'permanent'], v)} placeholder="Home station address..." icon={MapPin} />
            <div className="db-grid-2col">
              <InputGroup label="Station (City)" value={formData.address?.city ?? ''}    onChange={v => updateField(['address', 'city'], v)} icon={Globe} />
              <InputGroup label="Sector (Country)" value={formData.address?.country ?? ''} onChange={v => updateField(['address', 'country'], v)} icon={Globe} />
            </div>
          </SectionCard>
        );

      // â”€â”€ EDUCATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'education':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Academic Evolution" 
              subtitle="Catalogue your institutional learning nodes and achievements." 
              icon={GraduationCap} 
            />
            <div style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', left: 18, top: 0, bottom: 20, width: 2, background: `linear-gradient(to bottom, ${T.tealMid}, transparent)` }} />
              <AnimatePresence>
                {(formData.education || []).map((edu, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    style={{ 
                      padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', 
                      border: `1px solid ${T.borderDim}`, marginBottom: 24, position: 'relative',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* timeline node */}
                    <div style={{ position: 'absolute', left: -29, top: 30, width: 14, height: 14, borderRadius: '50%', background: T.teal, border: `3px solid #040d18`, boxShadow: `0 0 10px ${T.teal}` }} />
                    
                    <button onClick={() => removeArrayItem('education', i)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: T.pink, cursor: 'pointer', opacity: 0.6 }}>
                      <Trash2 size={18} />
                    </button>
                    <div className="db-grid-2col" style={{ gap: 20 }}>
                      <InputGroup label="Degree Node" value={edu.degree} onChange={v => updateArrayItem('education', i, 'degree', v)} placeholder="B.Sc Computer Science..." />
                      <InputGroup label="Learning Center" value={edu.institution} onChange={v => updateArrayItem('education', i, 'institution', v)} placeholder="MIT, Dhaka University..." />
                    </div>
                    <div className="db-grid-2col" style={{ gap: 20 }}>
                      <InputGroup label="Graduation Cycle (Year)" value={edu.year} onChange={v => updateArrayItem('education', i, 'year', v)} placeholder="2024" />
                      <InputGroup label="Sync Result (CGPA)" value={edu.result} onChange={v => updateArrayItem('education', i, 'result', v)} placeholder="3.90" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ActionButton onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', result: '' })} icon={Plus} label="Initialize New Education Node" />
            <ProductivityHint text="Consistent academic logging improves your credibility score for high-tier enterprise internships." />
          </SectionCard>
        );

      // â”€â”€ IMPORTANT LINKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'important-links':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader title="Professional Links" subtitle="Connect your LinkedIn, GitHub, Portfolio and more." icon={LinkIcon} />
            
            {/* Quick-add chips for popular platforms */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
              {['LinkedIn', 'GitHub', 'Portfolio', 'Behance', 'Twitter'].map(platform => (
                <motion.button key={platform} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                  onClick={() => addArrayItem('importantLinks', { label:platform, url:'' })}
                  style={{ padding:'6px 16px', borderRadius:99, background:T.tealDim, border:`1px solid ${T.border}`, color:T.teal, fontSize:12, fontWeight:700, cursor:'pointer' }}
                >
                  + {platform}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {(formData.importantLinks || []).map((link, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="db-grid-main" style={{ gridTemplateColumns: '1fr 2fr 50px', alignItems: 'flex-end', marginBottom: 20 }}
                >
                  <InputGroup label="Platform" value={link.label} onChange={v => updateArrayItem('importantLinks', i, 'label', v)} placeholder="LinkedIn" icon={Hash} />
                  <InputGroup label="URL" value={link.url} onChange={v => updateArrayItem('importantLinks', i, 'url', v)} placeholder="https://..." icon={ExternalLink} />
                  <div style={{ display:'flex', gap:8, paddingBottom:2 }}>
                    {link.url && <a href={link.url} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:44, height:52, borderRadius:12, background:T.tealDim, border:`1px solid ${T.border}`, color:T.teal }}><ExternalLink size={16} /></a>}
                    <button onClick={() => removeArrayItem('importantLinks', i)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:44, height:52, borderRadius:12, background:'rgba(236,72,153,0.1)', border:'none', color:T.pink, cursor:'pointer' }}><Trash2 size={16} /></button>
                  </div>
                  <div style={{ flex: 2 }}>
                    <InputGroup label="Access URL" value={link.url} onChange={v => updateArrayItem('importantLinks', i, 'url', v)} placeholder="https://linkedin.com/in/..." icon={Globe} />
                  </div>
                  <button onClick={() => removeArrayItem('importantLinks', i)} style={{ background: 'rgba(236, 72, 153, 0.1)', border: 'none', borderRadius: 12, color: T.pink, cursor: 'pointer', padding: 12, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <ActionButton onClick={() => addArrayItem('importantLinks', { label: '', url: '' })} icon={Plus} label="Add External Node Connection" />
            <ProductivityHint text="Backlinking to GitHub and LinkedIn allows our AI to crawl your external contributions and boost your global ranking in the voyager index." />
          </SectionCard>
        );

      // â”€â”€ SKILL SET â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'skill-set':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader title="Technical Skills" subtitle="Your core competencies and tech expertise." icon={Brain} />

            {/* Skills Grid Display */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, minHeight:80, padding:20, borderRadius:20, background:'rgba(0,0,0,0.15)', border:`1px solid ${T.borderDim}`, marginBottom:28 }}>
              <AnimatePresence>
                {(formData.jobProfile?.skills || []).length > 0 ? (
                  formData.jobProfile.skills.map((skill, i) => {
                    const maturity = ["Beginner", "Adept", "Expert"][i % 3];
                    const matColor = maturity === "Expert" ? T.gold : maturity === "Adept" ? T.cyan : T.textDim;
                    return (
                      <motion.div 
                        key={skill} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{ 
                          padding: '10px 18px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(23,182,168,0.15), rgba(7,19,32,0.8))', 
                          border: `1px solid ${T.border}`, color: 'white', display: 'flex', 
                          flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700,
                          minWidth: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                           <span style={{ fontSize: 10, color: matColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{maturity}</span>
                           <Trash2 size={12} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => {
                             const next = formData.jobProfile.skills.filter((_, idx) => idx !== i);
                             updateField(['jobProfile', 'skills'], next);
                           }} />
                        </div>
                        {skill}
                      </motion.div>
                    );
                  })
                ) : <p style={{ color: T.textFaint, margin: 0, fontSize: 13 }}>No skill nodes detected. Start adding skills below.</p>}
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
  <div style={{ flex: 1 }}>
    <InputGroup 
      label="Inject New Skill Node" 
      placeholder="React, Python, AWS..."
      icon={Sparkles}
      value={skillInput}
      onChange={v => setSkillInput(v)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          const val = skillInput.trim();
          if (!val) return;
          const currentSkills = formData.jobProfile?.skills || [];
          if (!currentSkills.includes(val)) {
            updateField(['jobProfile', 'skills'], [...currentSkills, val]);
          }
          setSkillInput('');
        }
      }}
    />
  </div>
  <motion.button 
    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
    onClick={() => {
      const val = skillInput.trim();
      if (!val) return;
      const currentSkills = formData.jobProfile?.skills || [];
      if (!currentSkills.includes(val)) {
        updateField(['jobProfile', 'skills'], [...currentSkills, val]);
      }
      setSkillInput('');
    }}
    style={{ 
      height: 52, padding: '0 24px', borderRadius: 16, background: T.teal, 
      color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 31
    }}
  >
    Inject
  </motion.button>
</div>
            <ProductivityHint text="The matrix analysis determines your eligibility for specific roadmap branches. Every skill node added helps refine your mission's accuracy." />
          </SectionCard>
        );

      case 'job-profile':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Career Trajectory" 
              subtitle="Define your current professional standing and target industry." 
              icon={Briefcase} 
            />
            <InputGroup label="Designation (Current Title)" value={formData.jobProfile?.title} onChange={v => updateField(['jobProfile', 'title'], v)} placeholder="Lead Neural Engineer..." icon={Briefcase} />
            <InputGroup label="Sector (Industry)" value={formData.jobProfile?.industry} onChange={v => updateField(['jobProfile', 'industry'], v)} placeholder="Quantum Computing, Biotech..." icon={Globe} />
          </SectionCard>
        );

      case 'job-experience':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Deployment History" 
              subtitle="Document your previous professional missions and impact." 
              icon={History} 
            />
            <div style={{ position: 'relative', paddingLeft: 40, marginTop: 10 }}>
              <div style={{ position: 'absolute', left: 18, top: 0, bottom: 20, width: 2, background: `linear-gradient(to bottom, ${T.tealMid}, transparent)` }} />
              <AnimatePresence>
                {(formData.jobExperience || []).map((exp, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', 
                      border: `1px solid ${T.borderDim}`, marginBottom: 24, position: 'relative' 
                    }}
                  >
                    {/* timeline node */}
                    <div style={{ position: 'absolute', left: -29, top: 30, width: 14, height: 14, borderRadius: '50%', background: T.cyan, border: `3px solid #040d18`, boxShadow: `0 0 10px ${T.cyan}` }} />
                    
                    <button onClick={() => removeArrayItem('jobExperience', i)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: T.pink, cursor: 'pointer', opacity: 0.6 }}>
                      <Trash2 size={18} />
                    </button>
                    <div className="db-grid-2col" style={{ gap: 20 }}>
                      <InputGroup label="Unit (Company)" value={exp.company} onChange={v => updateArrayItem('jobExperience', i, 'company', v)} placeholder="OpenAI, Google..." />
                      <InputGroup label="Role (Position)" value={exp.position} onChange={v => updateArrayItem('jobExperience', i, 'position', v)} placeholder="Senior Researcher..." />
                    </div>
                    <InputGroup label="Mission Timeline (Duration)" value={exp.duration} onChange={v => updateArrayItem('jobExperience', i, 'duration', v)} placeholder="Jan 2022 - Present" icon={Calendar} />
                    <InputGroup label="Mission Brief (Description)" value={exp.description} onChange={v => updateArrayItem('jobExperience', i, 'description', v)} placeholder="Summarize your impact and achievements..." icon={Info} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ActionButton onClick={() => addArrayItem('jobExperience', { company: '', position: '', duration: '', description: '' })} icon={Plus} label="Add Mission History Node" />
            <ProductivityHint text="Detailed mission briefs allow our AI to generate better interview preparation queries for your next career jump." />
          </SectionCard>
        );

      case 'got-hired':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <motion.div 
              animate={{ 
                boxShadow: formData.hiredStatus?.isHired ? `0 0 40px rgba(23,182,168,0.15)` : 'none',
                scale: formData.hiredStatus?.isHired ? 1.02 : 1
              }}
              style={{ 
                padding: '40px', borderRadius: 32, 
                background: formData.hiredStatus?.isHired ? 'linear-gradient(145deg, rgba(23,182,168,0.12), rgba(2,8,18,0.4))' : 'rgba(255,255,255,0.02)', 
                border: `1px solid ${formData.hiredStatus?.isHired ? T.teal : T.borderDim}`, 
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'center'
              }}
            >
              {formData.hiredStatus?.isHired && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.tealMid, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: `0 0 20px ${T.teal}` }}>
                    <Rocket size={40} style={{ color: 'white' }} />
                  </div>
                </motion.div>
              )}
              
              <h3 style={{ color: 'white', margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Vessel Successfully Docked?</h3>
              <p style={{ color: T.textDim, fontSize: 15, margin: '0 0 32px' }}>Activate this node if you have secured employment to celebrate with the network.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateField(['hiredStatus', 'isHired'], !formData.hiredStatus?.isHired)}
                  style={{
                    width: 80, height: 40, borderRadius: 99, background: formData.hiredStatus?.isHired ? T.teal : 'rgba(255,255,255,0.1)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 6px', transition: 'all 0.4s'
                  }}
                >
                  <div style={{ 
                    width: 28, height: 28, borderRadius: '50%', background: 'white', 
                    transform: formData.hiredStatus?.isHired ? 'translateX(40px)' : 'translateX(0)', 
                    transition: 'transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }} />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {formData.hiredStatus?.isHired && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', textAlign: 'left' }}>
                    <div style={{ height: 1, background: T.borderDim, margin: '24px 0' }} />
                    <InputGroup label="Unit Name (Company)" value={formData.hiredStatus?.company} onChange={v => updateField(['hiredStatus', 'company'], v)} icon={Briefcase} />
                    <InputGroup label="Docking Date (Joining Date)" type="date" value={formData.hiredStatus?.date?.split('T')[0] ?? ''} onChange={v => updateField(['hiredStatus', 'date'], v)} icon={Calendar} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <ProductivityHint text="When confirmed, your profile will be marked as 'Hired' in the talent pool, focusing AI mentorship on your job performance and corporate growth." />
          </SectionCard>
        );

      // â”€â”€ JOB PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case 'certification':
        return (
          <SectionCard onSave={handleSave} loading={loading}>
            <SectionHeader 
              title="Official Certification Nodes" 
              subtitle="Securely issued validations from the SkillVoyager.AI neural network." 
              icon={ShieldCheck} 
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 40 }}>
              {(dbUser?.officialCertificates || []).length > 0 ? (
                dbUser.officialCertificates.map((cert, i) => (
                  <motion.div 
                    key={cert.certId || i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      padding: '24px 30px', borderRadius: 28, 
                      background: 'linear-gradient(135deg, rgba(23,182,168,0.1), rgba(7,19,32,0.9))', 
                      border: `1px solid ${T.teal}`, position: 'relative', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: T.teal }} />
                    <div style={{ position: 'absolute', top: -30, right: -10, width: 120, height: 120, background: `radial-gradient(circle, rgba(23,182,168,0.15) 0%, transparent 70%)`, pointerEvents: 'none' }} />
                    
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: T.tealMid, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileCheck size={28} style={{ color: T.teal }} />
                      </div>
                      <div>
                        <h4 style={{ color: 'white', margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>{cert.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                           <span style={{ fontSize: 12, color: T.textFaint }}>Issuer: <strong style={{color: T.teal}}>{cert.issuer}</strong></span>
                           <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.textFaint }} />
                           <span className="mono" style={{ fontSize: 11, color: T.gold }}>ID: {cert.certId}</span>
                        </div>
                      </div>
                    </div>

                    <PDFDownloadLink
                      document={<OfficialCertificatePDF user={dbUser} cert={cert} />}
                      fileName={`SkillVoyager_Cert_${cert.certId}.pdf`}
                    >
                      {({ loading }) => (
                        <motion.button 
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          style={{
                            padding: '12px 24px', borderRadius: 12, background: T.teal,
                            color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            boxShadow: `0 4px 15px rgba(23,182,168,0.3)`
                          }}
                        >
                           {loading ? 'Decrypting...' : <><Download size={16} /> Download</>}
                        </motion.button>
                      )}
                    </PDFDownloadLink>
                  </motion.div>
                ))
              ) : (
                <div style={{ padding: '60px 0', textAlign: 'center', border: `2px dashed ${T.borderDim}`, borderRadius: 32, background: 'rgba(255,255,255,0.01)' }}>
                  <ShieldCheck size={40} style={{ color: T.textFaint, marginBottom: 16 }} />
                  <p style={{ color: T.textDim, fontWeight: 600 }}>No Official Certificates Found</p>
                  <p style={{ color: T.textFaint, fontSize: 12, maxWidth: 280, margin: '8px auto 0' }}>Complete missions and roadmaps to receive official validation nodes from admins.</p>
                </div>
              )}
            </div>

            <SectionHeader 
              title="Manual Attestation Nodes" 
              subtitle="Showcase your external industry-standard recognitions." 
              icon={Award} 
            />
            <AnimatePresence>
              {(formData.certifications || []).map((cert, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    padding: '24px', borderRadius: 24, background: 'rgba(255,255,255,0.02)', 
                    border: `1px solid ${T.borderDim}`, marginBottom: 20, position: 'relative' 
                  }}
                >
                  <button onClick={() => removeArrayItem('certifications', i)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: T.pink, cursor: 'pointer', opacity: 0.6 }}>
                    <Trash2 size={18} />
                  </button>
                  <InputGroup label="Identity (Certification Name)" value={cert.name} onChange={v => updateArrayItem('certifications', i, 'name', v)} placeholder="AWS Solutions Architect..." />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <InputGroup label="Issuer Authority" value={cert.issuer} onChange={v => updateArrayItem('certifications', i, 'issuer', v)} placeholder="Amazon Web Services..." />
                    <InputGroup label="Sync Date" value={cert.date} onChange={v => updateArrayItem('certifications', i, 'date', v)} placeholder="March 2024" />
                  </div>
                  <InputGroup label="Verification Link (URL)" value={cert.url} onChange={v => updateArrayItem('certifications', i, 'url', v)} placeholder="https://verify.cert/..." icon={Globe} />
                </motion.div>
              ))}
            </AnimatePresence>
            <ActionButton onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', url: '' })} icon={Plus} label="Register New Certification Node" />
            <ProductivityHint text="Verified certifications act as cryptographic proof of your expertise, significantly increasing your trust-factor in the recruitment network." />
          </SectionCard>
        );

      // â”€â”€ COURSE REQUEST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // Inside the switch statement, replace your current 'course-request' case with this:

case 'course-request':
  return (
    <SectionCard showSave={false}>
      <SectionHeader 
        title="Request a Course" 
        subtitle="Tell us what you want to learn next." 
        icon={Book} 
      />

      <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: T.tealDim, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px', 
          boxShadow: `0 0 30px rgba(23,182,168,0.2)` 
        }}>
          <Book size={36} style={{ color: T.teal }} />
        </div>

        <h3 style={{ color: 'white', marginBottom: 12, fontSize: 20, fontWeight: 800 }}>
          What would you like to learn?
        </h3>
        <p style={{ 
          color: T.textDim, 
          marginBottom: 32, 
          maxWidth: 400, 
          margin: '0 auto 32px', 
          lineHeight: 1.6 
        }}>
          Suggest a topic and our AI team will synthesize a comprehensive course and roadmap for it.
        </p>

        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {/* Fixed: Added state for inputs */}
          <InputGroup 
            label="TOPIC / SUBJECT" 
            value={formData.courseRequest?.topic || ''} 
            onChange={v => updateField(['courseRequest', 'topic'], v)} 
            placeholder="e.g. Advanced Rust, Machine Learning for Beginners..." 
            icon={Book} 
          />

          <InputGroup 
            label="WHY DO YOU NEED THIS?" 
            value={formData.courseRequest?.reason || ''} 
            onChange={v => updateField(['courseRequest', 'reason'], v)} 
            placeholder="Explain how this will help your career..." 
            icon={Info} 
          />

          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const topic = formData.courseRequest?.topic?.trim();
              const reason = formData.courseRequest?.reason?.trim();

              if (!topic) {
                toast.error("Please enter a topic/subject");
                return;
              }

              // TODO: Call your API here to submit course request
              console.log("Course Request Submitted:", { topic, reason });
              toast.success("Course request submitted successfully! Our AI team will prepare it soon.");

              // Optional: Clear form after submit
              // updateField(['courseRequest'], { topic: '', reason: '' });
            }}
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: 16, 
              background: `linear-gradient(135deg, ${T.teal}, ${T.cyan})`, 
              color: 'white', 
              border: 'none', 
              fontWeight: 800, 
              cursor: 'pointer', 
              marginTop: 8, 
              boxShadow: `0 8px 25px rgba(23,182,168,0.3)` 
            }}
          >
            Submit Course Request
          </motion.button>
        </div>
      </div>
    </SectionCard>
  );

      // â”€â”€ ORDER HISTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // case 'order-history':
      //   return (
      //     <SectionCard showSave={false}>
      //       <SectionHeader title="Transaction History" subtitle="Track your purchases within SkillVoyager." icon={ShoppingCart} />
      //       <div style={{ textAlign:'center', padding:'60px 0', border:`2px dashed ${T.borderDim}`, borderRadius:24, background:'rgba(255,255,255,0.01)' }}>
      //         <ShoppingCart size={48} style={{ color:T.textFaint, marginBottom:20 }} />
      //         <p style={{ color:T.textDim, fontWeight:600, fontSize:16 }}>No Transactions Yet</p>
      //         <p style={{ color:T.textFaint, fontSize:13, maxWidth:300, margin:'10px auto 0' }}>Your purchase history will appear here once you buy a course or service.</p>
      //       </div>
      //     </SectionCard>
      //   );

      default:
        return (
          <SectionCard showSave={false}>
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                <Sparkles size={40} style={{ color:T.textFaint }} />
              </div>
              <h2 style={{ color:'white', fontWeight:800, textTransform:'capitalize' }}>Coming Soon</h2>
              <p style={{ color:T.textDim }}>The <span style={{ color:T.teal }}>{view.replace(/-/g,' ')}</span> section is being optimized.</p>
            </div>
          </SectionCard>
        );
    }
  };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', paddingBottom:100, position:'relative', zIndex:100, pointerEvents:'auto' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity:0, x:20 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-20 }}
          transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProfileSections;

