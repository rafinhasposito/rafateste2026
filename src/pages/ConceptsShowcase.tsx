import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ConceptsShowcase() {
  const [params] = useSearchParams();
  const concept = params.get("c") || "A";

  if (concept === "A") return <ConceptA />;
  if (concept === "B") return <ConceptB />;
  if (concept === "C") return <ConceptC />;
  
  return <div className="text-white p-10">Conceito não encontrado</div>;
}

const ConceptA = () => (
  <div className="relative w-full min-h-screen bg-[#030306] flex flex-col justify-end overflow-hidden selection:bg-[#D4AF37]/30">
    {/* Editorial Travel Photography */}
    <img 
      src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000" 
      alt="Paris" 
      className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#030306]/90 via-[#030306]/20 to-transparent" />
    
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-20">
      <div className="mb-4 md:mb-8">
        <span className="font-inter text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#030306]/50">
          Astrologia de Relocalização
        </span>
      </div>
      <h1 className="font-cinzel text-5xl md:text-7xl lg:text-[90px] text-white font-medium leading-[1.05] tracking-tight mb-6 md:mb-8 drop-shadow-2xl">
        Redefina o palco<br/>do seu próximo ano.
      </h1>
      <p className="font-inter text-white/70 text-sm md:text-lg font-light max-w-lg mb-10 md:mb-12 leading-relaxed">
        Descubra como a geografia transforma a configuração energética do seu aniversário. O destino exato da sua evolução pessoal.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <button className="w-full sm:w-auto bg-white text-black px-8 py-4 font-inter text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors">
          Iniciar Descoberta
        </button>
        <span className="font-cinzel text-xs text-white/40 tracking-[0.1em] uppercase hidden sm:block">
          Paris, França 48°52'N 2°19'E
        </span>
      </div>
    </div>
  </div>
);

const ConceptB = () => (
  <div className="relative w-full min-h-screen bg-[#030306] flex items-center justify-center overflow-hidden font-inter selection:bg-white/20">
    {/* Tech Map Wireframe / Geo Data */}
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030306_85%)]" />
    
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="flex-1 text-left w-full">
        <div className="inline-flex items-center gap-3 mb-8 md:mb-10">
          <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
          <span className="font-mono text-[9px] md:text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Protocolo Solar // Motor de Análise Geográfica
          </span>
        </div>
        <h1 className="font-cinzel text-4xl md:text-6xl text-white font-bold leading-[1.1] mb-6 tracking-tight">
          A inteligência<br/>por trás do seu destino.
        </h1>
        <p className="font-inter text-white/50 text-sm md:text-base leading-relaxed max-w-md mb-10 font-light">
          Cruzamos suas coordenadas natais com a malha terrestre para calcular o ponto exato de maior prosperidade e alinhamento no seu próximo ciclo solar.
        </p>
        <button className="w-full sm:w-auto border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-[#D4AF37]/10 transition-colors">
          Calcular Rota Global
        </button>
      </div>

      <div className="flex-1 w-full aspect-square lg:aspect-auto lg:h-[600px] border border-white/10 bg-[#0A0C14]/50 relative overflow-hidden flex items-center justify-center">
        {/* Fake Geo Visualization */}
        <div className="absolute inset-0 opacity-30 flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] stroke-white/40" fill="none">
            {/* Latitude/Longitude arcs */}
            <path d="M 0,200 Q 200,0 400,200 T 800,200" strokeWidth="0.5" strokeDasharray="2 4" />
            <path d="M 200,0 Q 400,200 200,400 T 0,200" strokeWidth="0.5" strokeDasharray="2 4" />
            {/* Radar circle */}
            <circle cx="200" cy="200" r="120" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="180" strokeWidth="0.25" />
            {/* Target nodes */}
            <circle cx="200" cy="200" r="2" fill="#D4AF37" />
            <line x1="200" y1="190" x2="200" y2="210" stroke="#D4AF37" strokeWidth="0.5" />
            <line x1="190" y1="200" x2="210" y2="200" stroke="#D4AF37" strokeWidth="0.5" />
            {/* Alt target */}
            <circle cx="280" cy="140" r="1.5" fill="#FAF7EE" />
            <line x1="200" y1="200" x2="280" y2="140" stroke="#FAF7EE" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <span className="font-mono text-[9px] text-[#D4AF37]/80">TARGET AQCUIRED</span>
          <span className="font-mono text-[9px] text-white/40">LON: 139.6917° E</span>
          <span className="font-mono text-[9px] text-white/40">LAT: 35.6895° N</span>
        </div>
      </div>
    </div>
  </div>
);

const ConceptC = () => (
  <div className="relative w-full min-h-screen bg-[#030306] flex items-center justify-center overflow-hidden text-center selection:bg-white/20">
    {/* Cinematic Depth & Movement */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/20 to-[#030306] pointer-events-none" />
    
    <div className="relative z-10 w-full px-6 max-w-4xl flex flex-col items-center">
      <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mb-8 md:mb-12" />
      
      <span className="font-cinzel text-[10px] md:text-xs text-[#D4AF37] tracking-[0.4em] uppercase mb-6 opacity-90">
        Protocolo Solar
      </span>
      
      <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl text-white font-medium leading-[1.2] mb-8 drop-shadow-2xl">
        Onde você escolhe estar<br className="hidden sm:block" />muda tudo que está por vir.
      </h1>
      
      <p className="font-inter text-white/50 text-sm md:text-lg font-light mb-12 max-w-2xl leading-relaxed mx-auto">
        O tempo é constante. O espaço não. Descubra a geografia exata que alinha as forças do universo a seu favor neste próximo ciclo.
      </p>
      
      <button className="group relative overflow-hidden bg-white text-black px-10 py-5 font-inter text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-all rounded-sm">
        Revelar Destino
      </button>
    </div>
  </div>
);
