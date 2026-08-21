import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';

interface Props {
  onNext: () => void;
  title: React.ReactNode;
  subtitle: string;
}

export const Screen1NorthStar = ({ onNext, title, subtitle }: Props) => {
  return (
    <div className="w-full min-h-[100dvh] bg-[#000000] flex items-center justify-center overflow-hidden font-sans select-none relative">
      {/* Container imitando as bordas do App Mobile para consistência de preview */}
      <div className="w-full max-w-[430px] h-[100dvh] max-h-[932px] bg-[#030306] relative flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] border-x border-[#D4AF37]/10">
        
        {/* ── VISUAL: ASYMMETRICAL EARTH / ORBIT ── */}
        <div className="absolute top-0 right-[-30%] w-[130%] h-[60%] pointer-events-none mix-blend-screen">
          {/* Gradient masking for smooth blend into black */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030306]/60 to-[#030306] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030306] via-transparent to-transparent z-10" />
          
          <img 
            src="/earth-orbital-hires.jpg" 
            alt="Earth" 
            className="w-full h-full object-cover object-right-top filter grayscale opacity-40 contrast-125 brightness-110"
            style={{ 
              maskImage: "radial-gradient(circle at 70% 30%, black 30%, transparent 70%)", 
              WebkitMaskImage: "radial-gradient(circle at 70% 30%, black 30%, transparent 70%)" 
            }}
          />
          
          {/* Tech/Geo Overlay (Orbital rings) */}
          <motion.div 
            initial={{ rotate: -5, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[5%] right-[5%] w-[80%] aspect-square border border-[#D4AF37]/20 rounded-full z-20" 
          />
          <motion.div 
            initial={{ rotate: 5, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
            className="absolute top-[10%] right-[10%] w-[70%] aspect-square border border-[#D4AF37]/10 rounded-full z-20" 
          />
          
          {/* Reticule Coordinates Style */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-[45%] right-[25%] flex items-center gap-2 z-20"
          >
            <div className="w-1.5 h-1.5 border border-[#D4AF37] rounded-full" />
            <div className="w-8 h-[1px] bg-[#D4AF37]/30" />
            <span className="font-mono text-[8px] tracking-[0.2em] text-[#D4AF37]/50">N 40°42' E -74°00'</span>
          </motion.div>
        </div>

        {/* ── CONTEÚDO PRINCIPAL (Z-30) ── */}
        <div className="relative z-30 flex flex-col h-full px-8 pt-16 pb-12">
          
          {/* 1. Progress & Contexto */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 opacity-80">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
              <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[#FAF7EE]/70">
                Protocolo Solar
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#FAF7EE]/40">
              01/06
            </span>
          </div>

          {/* Espaçador flexível para empurrar o título para o centro/baixo */}
          <div className="flex-1" />

          {/* 2. Mensagem Principal */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-[290px]"
          >
            <h1 className="font-cinzel text-[26px] md:text-[28px] leading-[1.25] tracking-wide text-[#FAF7EE] uppercase mb-5 drop-shadow-md">
              {title}
            </h1>
            
            <p className="font-inter text-[13px] font-light leading-[1.7] text-[#FAF7EE]/60 mb-14 pr-4">
              {subtitle}
            </p>

            {/* 4. Ação (Única, elegante, integrada) */}
            <button 
              onClick={onNext}
              className="group flex items-center gap-5 text-[11px] font-semibold tracking-[0.15em] text-[#FAF7EE] uppercase transition-colors"
            >
              <div className="w-11 h-11 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:border-[#D4AF37]/80 group-hover:bg-[#D4AF37]/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="opacity-80 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-colors pb-0.5 border-b border-transparent group-hover:border-[#D4AF37]/30">
                Iniciar Exploração
              </span>
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
