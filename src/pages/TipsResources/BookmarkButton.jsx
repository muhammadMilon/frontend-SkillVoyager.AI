import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const BookmarkButton = ({ isBookmarked, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
        isBookmarked
          ? 'bg-[#14b8a6] border-[#14b8a6] text-black shadow-lg shadow-[#14b8a6]/20'
          : 'bg-white/5 border-white/5 text-slate-500 hover:text-[#14b8a6] hover:border-[#14b8a6]/40'
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
    </motion.button>
  );
};

export default BookmarkButton;
