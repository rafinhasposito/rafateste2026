import React from "react";

const SolarCompassLogo = () => (
  <svg width="44" height="44" viewBox="0 0 52 52" fill="none" className="drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
    {/* Outer subtle ring */}
    <circle cx="26" cy="26" r="23" stroke="#D4AF37" strokeWidth="0.75" strokeOpacity="0.45" strokeDasharray="2 2" />
    <circle cx="26" cy="26" r="20" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.3" />
    
    {/* Cardinal Star Points */}
    <polygon points="26,6 28.5,23.5 26,21.5 23.5,23.5" fill="#D4AF37" />
    <polygon points="26,46 28.5,28.5 26,30.5 23.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
    <polygon points="6,26 23.5,23.5 21.5,26 23.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
    <polygon points="46,26 28.5,23.5 30.5,26 28.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
    
    {/* Diagonal Star Points */}
    <polygon points="12,12 24,24 22.5,25.5 25.5,22.5" fill="#D4AF37" fillOpacity="0.4" />
    <polygon points="40,12 28,24 29.5,25.5 26.5,22.5" fill="#D4AF37" fillOpacity="0.4" />
    <polygon points="12,40 24,28 22.5,26.5 25.5,29.5" fill="#D4AF37" fillOpacity="0.4" />
    <polygon points="40,40 28,28 29.5,26.5 26.5,29.5" fill="#D4AF37" fillOpacity="0.4" />
    
    {/* Center Core */}
    <circle cx="26" cy="26" r="3.5" fill="#D4AF37" />
    <circle cx="26" cy="26" r="1.5" fill="#FAF7EE" />
  </svg>
);

export const BrandHeader = ({ step = 0, totalSteps = 6 }: { step?: number; totalSteps?: number }) => (
  <header className="w-full flex flex-col items-center pt-8 pb-2 shrink-0 pointer-events-none z-40 relative">
    {/* Top Right Counter (e.g. 1/6) */}
    <div className="absolute top-8 right-6 font-mono text-[11px] font-semibold tracking-widest text-[#D4AF37]/80">
      {step + 1}/{totalSteps}
    </div>

    {/* Center Logo & Subtitles */}
    <SolarCompassLogo />
    <h2 className="font-sans text-[10px] tracking-[0.32em] font-semibold text-[#D4AF37] uppercase mt-2.5">
      Protocolo Solar
    </h2>
    <h3 className="font-sans text-[7.5px] tracking-[0.24em] text-[#D4AF37]/60 uppercase mt-0.5">
      Astrologia de Relocalização
    </h3>
  </header>
);
