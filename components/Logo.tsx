import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Logo based on the user provided image: Red 'C' with a Black Triangle */}
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
         {/* The Red C shape */}
         <path 
           d="M85 25 C 90 35 90 40 85 50" 
           stroke="none" 
           fill="none" 
         />
         {/* Main red arc */}
         <path 
           d="M 90 25 A 40 40 0 1 0 90 75"
           stroke="#E31E24" 
           strokeWidth="18" 
           strokeLinecap="butt"
           fill="none"
         />
         {/* The Black Triangle (Arrow) */}
         <path 
           d="M 75 25 L 95 25 L 85 10 Z" 
           fill="#1F2937" 
         />
      </svg>
      <div className="flex flex-col justify-center">
         <span className="text-brand-red font-bold text-xl leading-none tracking-tight">CORPORATE</span>
         <span className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase">ASK</span>
      </div>
    </div>
  );
};

export default Logo;