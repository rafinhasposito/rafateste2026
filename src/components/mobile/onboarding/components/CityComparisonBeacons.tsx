import React from "react";
import { motion } from "framer-motion";
import { Sun, Sparkles } from "lucide-react";

export const CityComparisonBeacons = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none select-none">
      {/* ── BEACONS AREA (Upper Half of Visual Slot) ── */}
      <div className="relative w-full flex items-center justify-around px-4 pt-4 z-20">
        
        {/* BEACON 1: SÃO PAULO (Gold / Sun) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-full border border-[#D4AF37] bg-[#0A0C14]/90 backdrop-blur-md flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <Sun className="w-5 h-5 animate-pulse" />
          </div>

          {/* City & Country Label */}
          <div className="text-center mt-2">
            <span className="font-cinzel text-xs font-bold tracking-[0.15em] text-[#FAF7EE] uppercase block">
              SÃO PAULO
            </span>
            <span className="font-inter text-[10px] tracking-[0.1em] text-[#FAF7EE]/60 block mt-0.5">
              Brasil
            </span>
          </div>

          {/* Vertical Glowing Light Ray */}
          <div className="relative w-0.5 h-20 md:h-28 mt-2 flex flex-col items-center">
            <div className="w-full h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
            <motion.div
              animate={{ y: [0, 60, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 w-1 h-3 rounded-full bg-[#FAF7EE] shadow-[0_0_8px_#D4AF37]"
            />
            {/* Ground anchor pulse dot */}
            <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]" />
          </div>
        </motion.div>

        {/* BEACON 2: NOVA YORK (Cyan / Star) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-full border border-[#5EEAD4] bg-[#0A0C14]/90 backdrop-blur-md flex items-center justify-center text-[#5EEAD4] shadow-[0_0_15px_rgba(94,234,212,0.4)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* City & Country Label */}
          <div className="text-center mt-2">
            <span className="font-cinzel text-xs font-bold tracking-[0.15em] text-[#FAF7EE] uppercase block">
              NOVA YORK
            </span>
            <span className="font-inter text-[10px] tracking-[0.1em] text-[#FAF7EE]/60 block mt-0.5">
              EUA
            </span>
          </div>

          {/* Vertical Glowing Light Ray */}
          <div className="relative w-0.5 h-20 md:h-28 mt-2 flex flex-col items-center">
            <div className="w-full h-full bg-gradient-to-b from-[#5EEAD4] via-[#5EEAD4]/50 to-transparent" />
            <motion.div
              animate={{ y: [0, 60, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-0 w-1 h-3 rounded-full bg-[#FAF7EE] shadow-[0_0_8px_#5EEAD4]"
            />
            {/* Ground anchor pulse dot */}
            <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-[#5EEAD4] shadow-[0_0_12px_#5EEAD4]" />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
