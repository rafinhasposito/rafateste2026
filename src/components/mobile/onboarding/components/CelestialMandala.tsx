import React from "react";
import { motion } from "framer-motion";

export const CelestialMandala = () => {
  const points = Array.from({ length: 12 }, (_, i) => i);
  const radius = 130;

  return (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center pointer-events-none select-none my-auto">
      
      {/* Outer subtle ring */}
      <div className="absolute inset-0 rounded-full border border-white/5" />
      
      {/* Inner tech ring */}
      <div className="absolute w-[200px] h-[200px] rounded-full border border-[#C9A227]/10 border-dashed" />

      {/* 12 House Points */}
      <div className="absolute inset-0">
        {points.map((i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * radius + 160;
          const y = Math.sin(angle) * radius + 160;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="absolute w-8 h-8 -ml-4 -mt-4 flex flex-col items-center justify-center"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <div className="w-1 h-1 rounded-full bg-[#C9A227]/40 mb-1" />
              <span className="font-ps-display text-[8px] text-[#FAF7EE]/30">
                {String(i + 1).padStart(2, '0')}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Center glowing core */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-full border border-[#C9A227]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)]"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/80 shadow-[0_0_10px_#C9A227]" />
      </motion.div>

    </div>
  );
};
