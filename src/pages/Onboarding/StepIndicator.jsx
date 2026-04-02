import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:48, gap:8 }}>
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent   = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.1 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{
                width:56, height:56, borderRadius:18,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:900, fontSize:16, transition:'all 0.5s',
                border: `2px solid ${isCompleted ? '#17B6A8' : isCurrent ? '#17B6A8' : 'rgba(23,182,168,0.15)'}`,
                background: isCompleted
                  ? 'linear-gradient(135deg, #17B6A8, #0fd4c4)'
                  : isCurrent
                  ? 'rgba(23,182,168,0.15)'
                  : 'rgba(255,255,255,0.03)',
                color: isCompleted ? 'white' : isCurrent ? '#17B6A8' : 'rgba(255,255,255,0.25)',
                boxShadow: isCompleted
                  ? '0 0 20px rgba(23,182,168,0.45)'
                  : isCurrent
                  ? '0 0 24px rgba(23,182,168,0.30)'
                  : 'none',
              }}>
                {isCompleted ? <Check style={{ width:26, height:26, strokeWidth:3 }} /> : stepNumber}
              </div>
              <span style={{
                marginTop:10, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em',
                color: isCurrent ? '#17B6A8' : 'rgba(255,255,255,0.25)',
                transition:'color 0.5s',
              }}>
                Step {stepNumber}
              </span>
            </motion.div>

            {stepNumber < totalSteps && (
              <div style={{ position:'relative', width:80, height:4, marginTop:-20, marginLeft:-4, marginRight:-4 }}>
                <div style={{ position:'absolute', inset:0, background:'rgba(23,182,168,0.12)', borderRadius:99 }} />
                <motion.div initial={{ width:'0%' }} animate={{ width: isCompleted ? '100%' : '0%' }}
                  style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, #17B6A8, #0fd4c4)', borderRadius:99, boxShadow:'0 0 12px rgba(23,182,168,0.50)' }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;