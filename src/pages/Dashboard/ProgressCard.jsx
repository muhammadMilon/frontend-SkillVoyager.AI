import React from 'react';
import { motion } from 'framer-motion';

const ProgressCard = ({ icon, label, value, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-300 overflow-hidden"
    >
      <motion.div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color}`}
        style={{ mixBlendMode: 'overlay' }}
      />
      
      <div className="relative z-10">
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 text-white shadow-lg`}
        >
          {icon}
        </motion.div>
        
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-white/90 transition-colors duration-300 mb-2">
          {label}
        </p>
        
        <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors duration-300">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default ProgressCard;
