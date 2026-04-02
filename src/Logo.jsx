import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        {/* Logo image (bird) */}
        <img
          src="Gemini_Generated_Image_9qdsdo9qdsdo9qds.png"
          alt="SkillVoyager.AI Logo"
          className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
        />

        {/* Premium glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A73E8] to-[#8B5CF6] blur-2xl rounded-full -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      </div>

      {/* Text design */}
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1A73E8] via-[#8B5CF6] to-[#00D2FF] bg-[length:200%_auto] hover:bg-[100%_center] transition-all duration-500">
            SkillVoyager
          </span>
          <span className="text-[#00D2FF]">.AI</span>
        </h1>
        {/* Colored border line below text */}
        <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#1A73E8] via-[#8B5CF6] to-[#00D2FF] transition-all duration-500 rounded-full mt-1"></div>
      </div>
    </div>
  );
};

export default Logo;