import React from "react";

const CompassRose = () => (
  <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="24" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
    <polygon points="26,10 28,26 26,24 24,26" fill="#D4AF37" opacity="0.7" />
    <polygon points="26,42 28,26 26,28 24,26" fill="#D4AF37" opacity="0.22" />
    <polygon points="10,26 26,24 24,26 26,28" fill="#D4AF37" opacity="0.22" />
    <polygon points="42,26 26,24 28,26 26,28" fill="#D4AF37" opacity="0.22" />
    <circle cx="26" cy="26" r="2" fill="#D4AF37" opacity="0.55" />
  </svg>
);

export const BrandHeader = ({ step = 0, totalSteps = 6 }: { step?: number, totalSteps?: number }) => (
  <header className="w-full flex flex-col items-center pt-12 pb-4 shrink-0 pointer-events-none z-40 relative">
    <div className="absolute top-12 right-6 font-sans text-[10px] font-bold tracking-widest text-[#D4AF37]/80">
      {step + 1}/{totalSteps}
    </div>
    <CompassRose />
    <h2 className="font-sans text-[9px] tracking-[0.35em] font-semibold text-[#D4AF37] uppercase mt-3">Protocolo Solar</h2>
    <h3 className="font-sans text-[7px] tracking-[0.25em] text-[#D4AF37]/50 uppercase mt-1">Astrologia de Relocalização</h3>
  </header>
);
