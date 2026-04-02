import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, color = 'from-indigo-600 to-purple-600' }) => {
  return (
    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${color} shadow-lg`}
      />
    </div>
  );
};

export default ProgressBar;

