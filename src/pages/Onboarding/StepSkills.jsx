import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, X, Plus, Search } from 'lucide-react';

const StepSkills = ({ formData, updateFormData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
    'HTML/CSS', 'SQL', 'MongoDB', 'Git', 'Docker',
    'AWS', 'Machine Learning', 'Data Analysis', 'UI/UX Design',
    'Project Management', 'Communication', 'Problem Solving',
    'Kubernetes', 'Go', 'Rust', 'Next.js', 'Tailwind CSS',
    'Cloud Computing', 'Firebase', 'GraphQL', 'Redux'
  ];

  const toggleSkill = (skill) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      updateFormData('skills', currentSkills.filter(s => s !== skill));
    } else {
      updateFormData('skills', [...currentSkills, skill]);
    }
  };

  const filteredSkills = availableSkills.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase()) && !formData.skills?.includes(s)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Code className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            What's in your toolbox?
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Select the skills you already possess. We'll use this to find your gaps.
        </p>
      </div>

      {/* Search and Selected */}
      <div className="space-y-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-bold shadow-sm"
          />
        </div>

        {/* Selected Skills */}
        <div className="min-h-[100px] p-6 rounded-3xl bg-slate-50 dark:bg-indigo-500/5 border-2 border-dashed border-slate-200 dark:border-slate-800">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
            Currently Selected ({formData.skills?.length || 0})
          </label>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-500/20"
                  >
                    {skill}
                    <button
                      onClick={() => toggleSkill(skill)}
                      className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-slate-400 dark:text-slate-600 font-bold text-sm italic py-2">No skills selected yet...</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Available Skills Suggestion */}
      <div className="space-y-4">
        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">
          Suggestions
        </label>
        <div className="flex flex-wrap gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredSkills.map((skill) => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(skill)}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-black hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 opacity-50" /> {skill}
            </motion.button>
          ))}
          {filteredSkills.length === 0 && (
            <p className="text-slate-400 dark:text-slate-600 font-bold text-sm italic">No more matching skills found...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StepSkills;
