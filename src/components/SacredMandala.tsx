import React from 'react';
import { motion } from 'framer-motion';

export function SacredMandala() {
  return (
    <div className="relative flex items-center justify-center w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] pointer-events-none">
      
      {/* Central Starburst Core */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-24 h-24 md:w-40 md:h-40">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#F2F8FB] rounded-full blur-[20px]"
          />
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 bg-white rounded-full blur-[8px] shadow-[0_0_60px_rgba(255,255,255,1)]"
          />
          <div className="absolute inset-4 bg-white rounded-full shadow-[0_0_100px_40px_rgba(255,255,255,0.8)]" />
          
          {/* Intense Light Rays (SVG) */}
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 100 100" 
            className="absolute -inset-10 md:-inset-20 w-[200%] h-[200%] opacity-80 mix-blend-screen"
          >
            <defs>
              <linearGradient id="rayGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {/* 8 point star */}
            <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" fill="url(#rayGrad)" />
            <path d="M15 15 L48 48 L85 15 L52 52 L85 85 L52 52 L15 85 L48 52 Z" fill="url(#rayGrad)" opacity="0.6" />
          </motion.svg>
        </div>
      </div>

      {/* Geometry Layer 1: Hexagram & Inner Rings */}
      <motion.svg 
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400" 
        className="absolute inset-0 w-full h-full opacity-60 z-10"
      >
        <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="4 4" />
        
        {/* Sacred Hexagram */}
        <polygon points="200,60 321,270 79,270" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <polygon points="200,340 79,130 321,130" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      </motion.svg>

      {/* Geometry Layer 2: Astrolabe Outer Rings */}
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400" 
        className="absolute inset-0 w-full h-full opacity-40 z-10"
      >
        {/* Main outer boundary */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Sub-circles on the boundary representing planets/nodes */}
        <circle cx="200" cy="40" r="10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
        <circle cx="200" cy="360" r="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <circle cx="40" cy="200" r="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <circle cx="360" cy="200" r="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        
        {/* Connecting crossing lines */}
        <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </motion.svg>
      
      {/* Fine Constellation Lines (Static overlay) */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-30 z-0">
         <polyline points="100,100 150,80 180,120 250,90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
         <circle cx="100" cy="100" r="1.5" fill="white" />
         <circle cx="150" cy="80" r="2" fill="white" />
         <circle cx="180" cy="120" r="1.5" fill="white" />
         <circle cx="250" cy="90" r="2.5" fill="white" />

         <polyline points="300,300 280,260 320,220" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
         <circle cx="300" cy="300" r="1.5" fill="white" />
         <circle cx="280" cy="260" r="1.5" fill="white" />
         <circle cx="320" cy="220" r="2" fill="white" />
      </svg>
      
    </div>
  );
}
