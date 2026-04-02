import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Trophy } from 'lucide-react';

const StepCareerTimeline = ({ formData, updateFormData }) => {
  const careers = [
    { value: 'full-stack', label: 'Full Stack', icon: '💻' },
    { value: 'frontend', label: 'Frontend', icon: '🎨' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'data-science', label: 'Data Science', icon: '📊' },
    { value: 'ml-engineer', label: 'ML Engineer', icon: '🤖' },
    { value: 'devops', label: 'DevOps', icon: '🔧' },
    { value: 'mobile', label: 'Mobile App', icon: '📱' },
    { value: 'ui-ux', label: 'AI UI/UX', icon: '🎯' }
  ];

  const timelines = [
    { value: '3-months', label: '3 Months', description: 'Intensive Blitz', accent: 'border-orange-500' },
    { value: '6-months', label: '6 Months', description: 'Steady Cruise', accent: 'border-blue-500' },
    { value: '1-year', label: '1 Year', description: 'Deep Mastery', accent: 'border-purple-500' },
    { value: 'flexible', label: 'Flexible', description: 'Self-Paced', accent: 'border-slate-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Target Career */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Design your future
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium ml-1">
          Select your destination. We'll build the most efficient route.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {careers.map((career) => (
            <motion.button
              key={career.value}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFormData('targetCareer', career.value)}
              className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-3 ${formData.targetCareer === career.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-xl shadow-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
            >
              <div className="text-4xl filter drop-shadow-md">{career.icon}</div>
              <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {career.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Commit to excellence
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium ml-1">
          When do you want to achieve this milestone?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timelines.map((timeline) => (
            <motion.button
              key={timeline.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData('timeline', timeline.value)}
              className={`p-6 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 group ${formData.timeline === timeline.value
                  ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-xl shadow-indigo-500/10`
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Trophy className={`w-7 h-7 ${formData.timeline === timeline.value ? 'text-indigo-500' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1">
                <div className="font-black text-xl text-slate-900 dark:text-white mb-1 tracking-tight">
                  {timeline.label}
                </div>
                <div className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                  {timeline.description}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StepCareerTimeline;
