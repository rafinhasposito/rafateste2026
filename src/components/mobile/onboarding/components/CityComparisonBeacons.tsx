import React from "react";
import { motion } from "framer-motion";
import { Sun, Sparkles } from "lucide-react";

export const CityComparisonBeacons = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none select-none">
      <div className="relative w-full flex items-center justify-around px-4 pt-4 z-20">
        
        {/* BEACON 1: SÃO PAULO (Gold) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full border border-[#C9A227]/50 bg-[#0A0C14]/90 backdrop-blur-md flex items-center justify-center text-[#C9A227] shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Sun className="w-4 h-4" />
          </div>

          <div className="text-center mt-3">
            <span className="font-ps-display text-[11px] font-bold tracking-[0.2em] text-[#FAF7EE] uppercase block">
              SÃO PAULO
            </span>
            <span className="font-ps-ui text-[9px] tracking-[0.1em] text-[#FAF7EE]/40 block mt-1 uppercase">
              Brasil
            </span>
          </div>

          <div className="relative w-px h-24 md:h-32 mt-3 flex flex-col items-center">
            <div className="w-full h-full bg-gradient-to-b from-[#C9A227]/60 via-[#C9A227]/20 to-transparent" />
            <motion.div
              animate={{ y: [0, 60, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 w-px h-6 bg-[#FAF7EE] shadow-[0_0_8px_#C9A227]"
            />
            <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#C9A227]/50" />
          </div>
        </motion.div>

        {/* BEACON 2: NOVA YORK (Cream/White) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 bg-[#0A0C14]/90 backdrop-blur-md flex items-center justify-center text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="text-center mt-3">
            <span className="font-ps-display text-[11px] font-bold tracking-[0.2em] text-[#FAF7EE] uppercase block">
              NOVA YORK
            </span>
            <span className="font-ps-ui text-[9px] tracking-[0.1em] text-[#FAF7EE]/40 block mt-1 uppercase">
              EUA
            </span>
          </div>

          <div className="relative w-px h-24 md:h-32 mt-3 flex flex-col items-center">
            <div className="w-full h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
            <motion.div
              animate={{ y: [0, 60, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-0 w-px h-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            />
            <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
