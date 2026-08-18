import React from "react";
import { motion } from "framer-motion";
import { Sun, Sparkles, Orbit, Compass, Layers } from "lucide-react";

export const CelestialMandala = () => {
  return (
    <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center pointer-events-none select-none my-auto">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-amber-500/5 to-transparent rounded-full filter blur-2xl pointer-events-none" />

      {/* Orbit 1: Outer Dashed Golden Circle */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-[#D4AF37]/25 border-dashed" />

      {/* Orbit 2: Middle Fine Golden Ring with Dots */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute w-[210px] h-[210px] rounded-full border border-[#D4AF37]/20"
      >
        {/* Orbiting celestial particle 1 */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
        {/* Orbiting celestial particle 2 */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F6D678] shadow-[0_0_6px_#F6D678]" />
      </motion.div>

      {/* Orbit 3: Inner Dotted Ring */}
      <div className="absolute w-[130px] h-[130px] rounded-full border border-[#D4AF37]/30 border-dotted" />

      {/* Radiant Sun in Center */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Sun corona glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-[#D4AF37]/40 via-[#F6D678]/50 to-[#C28912]/40 filter blur-md"
        />
        {/* Sun Core */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C28912] via-[#F6D678] to-[#FFFFFF] flex items-center justify-center shadow-[0_0_25px_#D4AF37,0_0_50px_rgba(212,175,55,0.4)]">
          <div className="w-6 h-6 rounded-full bg-[#FAF7EE] shadow-inner" />
        </div>
      </div>

      {/* ── CARDINAL NODES (Matching Reference Image) ── */}

      {/* Top Node: 12 CASAS (da vida) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30"
      >
        <div className="w-7 h-7 rounded-full border border-[#D4AF37]/60 bg-[#0B0D17]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] mb-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <span className="font-cinzel text-[10px] font-bold tracking-[0.15em] text-[#FAF7EE] uppercase">
          12 CASAS
        </span>
        <span className="font-inter text-[8px] tracking-[0.1em] text-[#FAF7EE]/60 lowercase">
          da vida
        </span>
      </motion.div>

      {/* Left Node: PLANETAS (em movimento) */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-center z-30 max-w-[90px]"
      >
        <div className="w-7 h-7 rounded-full border border-[#D4AF37]/60 bg-[#0B0D17]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] mb-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          <Orbit className="w-3.5 h-3.5" />
        </div>
        <span className="font-cinzel text-[9px] font-bold tracking-[0.12em] text-[#FAF7EE] uppercase">
          PLANETAS
        </span>
        <span className="font-inter text-[8px] tracking-[0.08em] text-[#FAF7EE]/60">
          em movimento
        </span>
      </motion.div>

      {/* Right Node: NOVOS CENÁRIOS (novas experiências) */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-center z-30 max-w-[95px]"
      >
        <div className="w-7 h-7 rounded-full border border-[#D4AF37]/60 bg-[#0B0D17]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] mb-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          <Compass className="w-3.5 h-3.5" />
        </div>
        <span className="font-cinzel text-[9px] font-bold tracking-[0.1em] text-[#FAF7EE] uppercase whitespace-nowrap">
          NOVOS CENÁRIOS
        </span>
        <span className="font-inter text-[8px] tracking-[0.08em] text-[#FAF7EE]/60 whitespace-nowrap">
          novas experiências
        </span>
      </motion.div>

      {/* Bottom Node: ESCOLHAS (que transformam) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30"
      >
        <div className="w-7 h-7 rounded-full border border-[#D4AF37]/60 bg-[#0B0D17]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] mb-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="font-cinzel text-[10px] font-bold tracking-[0.15em] text-[#FAF7EE] uppercase">
          ESCOLHAS
        </span>
        <span className="font-inter text-[8px] tracking-[0.1em] text-[#FAF7EE]/60">
          que transformam
        </span>
      </motion.div>
    </div>
  );
};
