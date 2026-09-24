import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicEarthProps {
  step: number;
}

export const CinematicEarth = ({ step }: CinematicEarthProps) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Base void black */}
      <div className="absolute inset-0 bg-[#030306]" />

      {/* Subtle top radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 10%, rgba(212,175,55,0.04) 0%, transparent 70%)" }}
      />

      {/* ── STEP-SPECIFIC EARTH RENDERING ── */}
      <AnimatePresence mode="wait">
        {/* TELA 1 & TELA 6: Horizon Earth Curve with Golden Atmospheric Sunrise */}
        {(step === 0 || step === 5) && (
          <motion.div
            key={`horizon-${step}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-end items-center"
          >
            {/* Golden Sunrise Horizon Glow */}
            <div 
              className="absolute bottom-16 inset-x-0 h-[220px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(212, 175, 55, 0.35) 0%, rgba(245, 224, 156, 0.15) 35%, transparent 75%)"
              }}
            />
            {/* Earth Horizon Image / Curve */}
            <div className="relative w-full h-[52%] overflow-hidden flex items-start justify-center">
              <img
                src="/earth-orbital-hires.jpg"
                alt="Earth Horizon"
                className="w-[140%] max-w-none object-cover opacity-90 filter contrast-125 brightness-110"
                style={{
                  maskImage: "linear-gradient(to top, black 50%, transparent 95%)",
                  WebkitMaskImage: "linear-gradient(to top, black 50%, transparent 95%)",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* TELA 2: Complete Floating Glowing Globe in Deep Space */}
        {step === 1 && (
          <motion.div
            key="globe-step2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pt-20"
          >
            {/* Globe Atmospheric Aura */}
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-500/10 to-transparent filter blur-xl" />
            
            {/* 3D Planet Globe */}
            <div className="relative w-52 h-52 rounded-full overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25),inset_-15px_-15px_40px_rgba(0,0,0,0.8),inset_10px_10px_25px_rgba(255,255,255,0.2)] border border-[#C9A227]/30">
              <img
                src="/target_2.png"
                alt="Glowing Globe"
                className="w-full h-full object-cover scale-[1.3] animate-[spin_160s_linear_infinite]"
                onError={(e) => {
                  // Fallback to earth master if target_2 fails
                  (e.target as HTMLImageElement).src = "/earth-master.png";
                }}
              />
              {/* Spherical Shadow overlay */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 35% 30%, transparent 40%, rgba(3, 3, 6, 0.7) 85%, rgba(3, 3, 6, 0.95) 100%)"
                }}
              />
            </div>
          </motion.div>
        )}

        {/* TELA 3: Nebula backdrop for Celestial Orbit Mandala */}
        {step === 2 && (
          <motion.div
            key="mandala-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[360px] h-[360px] rounded-full bg-radial-gradient from-amber-500/10 via-purple-900/5 to-transparent filter blur-2xl" />
          </motion.div>
        )}

        {/* TELA 4: Earth Horizon Curve for City Beacons */}
        {step === 3 && (
          <motion.div
            key="beacons-earth"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col justify-end items-center"
          >
            {/* Horizon atmosphere glow */}
            <div 
              className="absolute bottom-12 inset-x-0 h-[180px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 90% 50% at 50% 100%, rgba(212, 175, 55, 0.25) 0%, rgba(94, 234, 212, 0.15) 50%, transparent 80%)"
              }}
            />
            {/* Earth horizon base */}
            <div className="relative w-full h-[45%] overflow-hidden flex items-start justify-center">
              <img
                src="/earth-orbital-hires.jpg"
                alt="Earth Horizon"
                className="w-[145%] max-w-none object-cover opacity-85 filter contrast-125"
                style={{
                  maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* TELA 5: Starry cosmos for Timeline Cards */}
        {step === 4 && (
          <motion.div
            key="timeline-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[380px] h-[380px] rounded-full bg-radial-gradient from-amber-500/5 via-purple-900/10 to-transparent filter blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDITORIAL GRADIENT MASK (Header readability) ── */}
      <div
        className="absolute top-0 inset-x-0 pointer-events-none z-10"
        style={{
          height: "38svh",
          background: "linear-gradient(to bottom, #030306 0%, #030306 60%, rgba(3,3,6,0.8) 80%, transparent 100%)",
        }}
      />
    </div>
  );
};
