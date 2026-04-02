import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StepIndicator from './StepIndicator';
import StepRole from './StepRole';
import StepSkills from './StepSkills';
import StepCareerTimeline from './StepCareerTimeline';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FileText, Download, RefreshCw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RoadmapPDF from './RoadmapPDF';
import ResumePDF from './ResumePDF';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

const T = {
  teal:    '#17B6A8',
  tealDim: 'rgba(23,182,168,0.09)',
  tealMid: 'rgba(23,182,168,0.18)',
  border:  'rgba(23,182,168,0.18)',
  cyan:    '#0fd4c4',
  gold:    '#F5C842',
  text:    'rgba(255,255,255,0.90)',
  textDim: 'rgba(255,255,255,0.50)',
  textFaint:'rgba(255,255,255,0.22)',
};

const OnboardingFlow = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep]   = useState(1);
  const [isCompleted, setIsCompleted]   = useState(false);
  const [isLoading,   setIsLoading]     = useState(false);
  const [formData,    setFormData]      = useState({ role:'', education:'', skills:[], targetCareer:'', timeline:'' });

  const totalSteps = 3;

  const handleNext = () => { if (currentStep < totalSteps) { setCurrentStep(s => s+1); window.scrollTo({top:0,behavior:'smooth'}); } };
  const handleBack = () => { if (currentStep > 1)          { setCurrentStep(s => s-1); window.scrollTo({top:0,behavior:'smooth'}); } };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const uid = user?.uid || 'demo-user';
      const response = await fetch(`${API_BASE}/api/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, ...formData })
      });
      if (!response.ok) { const e = await response.json().catch(()=>({})); throw new Error(e.message||`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      if (data.success) { toast.success('Onboarding complete! Your journey begins now. 🚀'); setIsCompleted(true); }
      else toast.error(data.message || 'Failed to save profile');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      toast.error('Error: ' + (error.message || 'Something went wrong'));
    } finally { setIsLoading(false); }
  };

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.role && formData.education;
      case 2: return formData.skills.length >= 1;
      case 3: return formData.targetCareer && formData.timeline;
      default: return false;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(150deg, #040d18 0%, #071525 55%, #030c14 100%)', color:'white', userSelect:'none' }}>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(23,182,168,0.04) 1px, transparent 1px)', backgroundSize:'56px 56px' }} />
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'40%', height:'40%', borderRadius:'50%', background:'radial-gradient(circle, rgba(23,182,168,0.09) 0%, transparent 65%)', filter:'blur(100px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'40%', height:'40%', borderRadius:'50%', background:'radial-gradient(circle, rgba(15,212,196,0.06) 0%, transparent 65%)', filter:'blur(100px)' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)` }} />
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'160px 16px 80px', position:'relative', zIndex:10 }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:T.tealDim, border:`1px solid ${T.border}`, padding:'8px 18px', borderRadius:99, marginBottom:24 }}>
            <Sparkles style={{ width:14, height:14, color:T.teal }} />
            <span style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:T.teal }}>Personalization Engine</span>
          </div>
          <h1 style={{ fontSize:'clamp(38px, 6vw, 62px)', fontWeight:900, letterSpacing:'-2px', lineHeight:1.05, margin:'0 0 20px' }}>
            Welcome to{' '}
            <span style={{ background:`linear-gradient(90deg, #e0fff8, ${T.teal}, ${T.cyan}, ${T.gold}, ${T.teal})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              SkillVoyager.AI
            </span>
          </h1>
          <p style={{ fontSize:18, color:T.textDim, fontWeight:500, maxWidth:520, margin:'0 auto' }}>
            In just 3 steps, we'll architect a learning journey tailored exclusively for your career goals.
          </p>
        </motion.div>

        {!isCompleted && <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />}

        {/* Main Card */}
        <motion.div initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} style={{
          background:'rgba(7,19,32,0.88)', backdropFilter:'blur(32px)',
          borderRadius:48, border:`1px solid ${T.border}`,
          boxShadow:'0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(23,182,168,0.08)',
          position:'relative', overflow:'hidden',
        }}>
          {/* top accent */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${T.teal}, ${T.cyan}, transparent)` }} />
          <div style={{ position:'absolute', top:0, right:0, width:280, height:280, background:`radial-gradient(circle, rgba(23,182,168,0.07) 0%, transparent 70%)`, pointerEvents:'none' }} />

          {isCompleted ? (
            /* ── Success Screen ── */
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}
              style={{ padding:'64px 48px', textAlign:'center' }}>
              <div style={{ marginBottom:36 }}>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:96, height:96, borderRadius:'50%', background:`linear-gradient(135deg, ${T.teal}, ${T.cyan})`, marginBottom:28, boxShadow:`0 0 40px rgba(23,182,168,0.40)` }}>
                  <CheckCircle2 style={{ width:52, height:52, color:'white' }} />
                </div>
                <h2 style={{ fontSize:'clamp(28px, 4vw, 46px)', fontWeight:900, color:'white', marginBottom:20, letterSpacing:'-1px' }}>
                  Voyager Profile Initialized! 🌟
                </h2>
                <p style={{ fontSize:17, color:T.textDim, maxWidth:700, margin:'0 auto', lineHeight:1.7 }}>
                  Congratulations! You've successfully completed the onboarding process. Your personalized learning roadmap and AI-generated resume are now ready.
                </p>
              </div>

              {/* PDF buttons */}
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:20, marginBottom:36 }}>
                <PDFDownloadLink
                  document={<RoadmapPDF roadmapData={formData} userName={user?.displayName||'Voyager'}/>}
                  fileName={`SkillVoyager_Roadmap_${new Date().toISOString().split('T')[0]}.pdf`}>
                  {({ loading }) => (
                    <button disabled={loading||isLoading} style={{
                      minWidth:260, padding:'18px 32px', borderRadius:20, fontWeight:900, fontSize:15,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor: loading||isLoading?'not-allowed':'pointer',
                      background: loading||isLoading ? 'rgba(255,255,255,0.07)' : `linear-gradient(135deg, #0e2e2a, #0a2020)`,
                      border:`1px solid ${loading||isLoading ? 'rgba(255,255,255,0.08)' : T.border}`,
                      color: loading||isLoading ? T.textFaint : T.teal,
                      boxShadow: loading||isLoading ? 'none' : `0 4px 20px rgba(23,182,168,0.22)`,
                      transition:'all 0.2s',
                    }}>
                      {loading||isLoading ? <div style={{ width:22,height:22,border:`2px solid rgba(23,182,168,0.3)`,borderTopColor:T.teal,borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> : <><Download style={{width:20,height:20}}/> Download Roadmap PDF</>}
                    </button>
                  )}
                </PDFDownloadLink>

                <PDFDownloadLink
                  document={<ResumePDF userData={{ ...formData, name: user?.displayName||'Voyager' }}/>}
                  fileName={`AI_Resume_SkillVoyager_${new Date().toISOString().split('T')[0]}.pdf`}>
                  {({ loading }) => (
                    <button disabled={loading||isLoading} style={{
                      minWidth:260, padding:'18px 32px', borderRadius:20, fontWeight:900, fontSize:15,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor: loading||isLoading?'not-allowed':'pointer',
                      background: loading||isLoading ? 'rgba(255,255,255,0.07)' : `linear-gradient(135deg, rgba(15,212,196,0.15), rgba(23,182,168,0.10))`,
                      border:`1px solid ${loading||isLoading ? 'rgba(255,255,255,0.08)' : 'rgba(15,212,196,0.35)'}`,
                      color: loading||isLoading ? T.textFaint : T.cyan,
                      boxShadow: loading||isLoading ? 'none' : `0 4px 20px rgba(15,212,196,0.18)`,
                      transition:'all 0.2s',
                    }}>
                      {loading||isLoading ? <div style={{ width:22,height:22,border:`2px solid rgba(15,212,196,0.3)`,borderTopColor:T.cyan,borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> : <><FileText style={{width:20,height:20}}/> Generate AI Resume</>}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>

              {/* Nav buttons */}
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:16 }}>
                <button onClick={()=>navigate('/dashboard')} style={{
                  padding:'16px 36px', borderRadius:20, fontWeight:700, fontSize:14,
                  background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.10)`,
                  color:T.text, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.09)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                  Go to Dashboard <ArrowRight style={{width:20,height:20}}/>
                </button>
                <button onClick={()=>setIsCompleted(false)} style={{
                  padding:'16px 36px', borderRadius:20, fontWeight:700, fontSize:14,
                  background:T.tealDim, border:`1px solid ${T.border}`,
                  color:T.teal, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.background=T.tealMid}
                onMouseLeave={e=>e.currentTarget.style.background=T.tealDim}>
                  Review Answers <RefreshCw style={{width:20,height:20}}/>
                </button>
              </div>
            </motion.div>

          ) : (
            /* ── Normal Steps ── */
            <>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                  transition={{ duration:0.4, ease:'easeOut' }}
                  style={{ minHeight:400, padding:'40px 48px' }}>
                  {currentStep===1 && <StepRole formData={formData} updateFormData={updateFormData}/>}
                  {currentStep===2 && <StepSkills formData={formData} updateFormData={updateFormData}/>}
                  {currentStep===3 && <StepCareerTimeline formData={formData} updateFormData={updateFormData}/>}
                </motion.div>
              </AnimatePresence>

              {/* Nav Bar */}
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16, marginTop:32, paddingTop:28, borderTop:`1px solid rgba(23,182,168,0.12)`, padding:'28px 48px 40px' }}>
                <button onClick={handleBack} disabled={currentStep===1} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'14px 24px', borderRadius:16,
                  background:'transparent', border:`1px solid ${currentStep===1?'transparent':T.border}`,
                  color: currentStep===1 ? 'transparent' : T.textDim,
                  fontWeight:900, fontSize:11, textTransform:'uppercase', letterSpacing:'0.2em',
                  cursor: currentStep===1 ? 'default' : 'pointer', transition:'all 0.2s', pointerEvents: currentStep===1?'none':'auto',
                }}
                onMouseEnter={e=>{ if(currentStep>1){e.currentTarget.style.background=T.tealDim; e.currentTarget.style.color='white';}}}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=currentStep===1?'transparent':T.textDim;}}>
                  <ArrowLeft style={{width:18,height:18}}/> Previous Step
                </button>

                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  {currentStep < totalSteps ? (
                    <button onClick={handleNext} disabled={!isStepValid()} style={{
                      padding:'16px 40px', borderRadius:16, fontWeight:900, fontSize:12,
                      textTransform:'uppercase', letterSpacing:'0.2em',
                      display:'flex', alignItems:'center', gap:10,
                      background: isStepValid() ? `linear-gradient(135deg, #0e2e2a, #0a2020)` : 'rgba(255,255,255,0.05)',
                      border:`1px solid ${isStepValid() ? T.teal : 'rgba(255,255,255,0.08)'}`,
                      color: isStepValid() ? T.teal : T.textFaint,
                      cursor: isStepValid() ? 'pointer' : 'not-allowed',
                      boxShadow: isStepValid() ? `0 4px 20px rgba(23,182,168,0.22)` : 'none',
                      transition:'all 0.2s',
                    }}>
                      Continue to Step {currentStep+1} <ArrowRight style={{width:17,height:17}}/>
                    </button>
                  ) : (
                    <button onClick={handleComplete} disabled={!isStepValid()||isLoading} style={{
                      padding:'16px 40px', borderRadius:16, fontWeight:900, fontSize:12,
                      textTransform:'uppercase', letterSpacing:'0.2em', minWidth:300,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      background: isStepValid()&&!isLoading ? `linear-gradient(135deg, #0e2e2a, #0a2020)` : 'rgba(255,255,255,0.05)',
                      border:`1px solid ${isStepValid()&&!isLoading ? T.teal : 'rgba(255,255,255,0.08)'}`,
                      color: isStepValid()&&!isLoading ? T.teal : T.textFaint,
                      cursor: isStepValid()&&!isLoading ? 'pointer' : 'not-allowed',
                      boxShadow: isStepValid()&&!isLoading ? `0 4px 24px rgba(23,182,168,0.25)` : 'none',
                      transition:'all 0.2s',
                    }}>
                      {isLoading ? (
                        <><div style={{ width:18,height:18,border:`2px solid rgba(23,182,168,0.3)`,borderTopColor:T.teal,borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> Initializing...</>
                      ) : (
                        <>Initialize My Voyager Profile <CheckCircle2 style={{width:17,height:17}}/></>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Hint */}
              {!isStepValid() && (
                <p style={{ textAlign:'center', marginBottom:24, color:'rgba(23,182,168,0.45)', fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em' }}
                  className="animate-pulse">
                  Please complete all fields to advance
                </p>
              )}
            </>
          )}
        </motion.div>

        {/* Footer Progress */}
        {!isCompleted && (
          <div style={{ marginTop:40, display:'flex', alignItems:'center', justifyContent:'center', gap:14, color:T.textFaint, fontSize:12, fontWeight:900 }}>
            <div style={{ width:120, height:4, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
              <motion.div animate={{ width:`${(currentStep/totalSteps)*100}%` }}
                style={{ height:'100%', background:`linear-gradient(90deg, ${T.teal}, ${T.cyan})`, borderRadius:99 }} />
            </div>
            <span style={{ letterSpacing:'0.15em', textTransform:'uppercase', fontSize:11 }}>
              Progress: {Math.round((currentStep/totalSteps)*100)}%
            </span>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OnboardingFlow;