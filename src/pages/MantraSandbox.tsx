import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Command, Fingerprint, Quote } from 'lucide-react';

export default function MantraSandbox() {
  const color = "#10b981"; // Casa Dinheiro
  const mantra = "Eu sei o valor do meu trabalho, cuido bem das minhas contas e faço meu dinheiro render.";

  return (
    <div className="min-h-screen bg-[#03100B] text-white font-sans overflow-x-hidden pb-40">
      
      <div className="max-w-4xl mx-auto px-5 pt-20 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Mantra Showcase</h1>
        <p className="text-white/60">Nem de longe essa é a única forma! O Editorial Serifado é um clássico luxuoso, mas podemos explorar a estética energética, tecnológica ou cinemática da Apple.</p>
      </div>

      {/* =========================================
          V1: O EDITORIAL (O atual)
          ========================================= */}
      <section className="mb-40 border-b border-white/5 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-[#10b981]">V1: O Clássico Editorial (Atual)</h2>
          <p className="text-white/50 text-sm mt-2">Foco no peso tradicional da palavra impressa. Elegante, silencioso e muito focado na leitura pura.</p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-6 text-center relative flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[200px] md:text-[300px] font-serif italic text-white/[0.03] leading-none pointer-events-none select-none">
            "
          </div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex items-center gap-3 mb-10 px-5 py-2.5 bg-white/5 rounded-full border border-white/10">
               <Sparkles className="w-4 h-4" style={{ color }} />
               <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold" style={{ color }}>O Mantra de Ativação</span>
            </div>
            <p className="text-white text-3xl md:text-5xl lg:text-6xl font-serif italic leading-relaxed md:leading-snug drop-shadow-2xl">
              "{mantra}"
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          V2: A AURA ENERGÉTICA (Foco na Astrologia)
          ========================================= */}
      <section className="mb-40 border-b border-white/5 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-[#10b981]">V2: A Aura Energética</h2>
          <p className="text-white/50 text-sm mt-2">Para transmitir "reprogramação" no nível da alma. Uma bolha de energia pulsante e tipografia moderna sem serifa.</p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-6 text-center relative flex flex-col items-center py-20">
          {/* Aura Background */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] blur-[120px] rounded-[100%]"
            style={{ backgroundColor: color }}
          />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="mb-12 border border-white/20 p-4 rounded-full bg-black/40 backdrop-blur-md">
               <Fingerprint className="w-6 h-6" style={{ color }} />
            </div>
            
            <p className="text-white text-4xl md:text-6xl font-ps-display font-light tracking-tight leading-tight drop-shadow-lg max-w-4xl">
              {mantra}
            </p>

            <span className="mt-12 font-mono text-[10px] tracking-[0.4em] uppercase text-white/50 block">Ativação Biomagnética</span>
          </div>
        </div>
      </section>

      {/* =========================================
          V3: O COMANDO DE PROTOCOLO (Tech / Hacker Vibe)
          ========================================= */}
      <section className="mb-40 border-b border-white/5 pb-20">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-[#10b981]">V3: Comando de Protocolo</h2>
          <p className="text-white/50 text-sm mt-2">Uma abordagem mais literal ao nome "Protocolo Solar". O mantra como um código de override mental inserido no sistema.</p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-[#050505] rounded-3xl border border-white/10 p-1 md:p-2 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            
            {/* Placa de Neon Topo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] blur-[8px]" style={{ backgroundColor: color }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px]" style={{ backgroundColor: color }}></div>

            <div className="bg-[#0a0a0a] rounded-[22px] p-8 md:p-14 border border-white/5 flex flex-col relative z-10">
              <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                 <Command className="w-5 h-5" style={{ color }} />
                 <span className="font-mono text-sm tracking-widest uppercase text-white/70">System Override: <span style={{ color }}>Ativação</span></span>
              </div>
              
              <div className="pl-6 border-l-4" style={{ borderColor: color }}>
                <p className="text-white text-3xl md:text-4xl font-ps-display font-medium leading-relaxed tracking-tight">
                  "{mantra}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          V4: O GRADIENTE CINEMÁTICO (Estilo Lançamento Apple)
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 text-center mb-10">
          <h2 className="text-2xl font-bold text-[#10b981]">V4: O Gradiente Cinemático</h2>
          <p className="text-white/50 text-sm mt-2">A frase é massiva e preenchida por uma textura brilhante. Usado pela Apple para destacar o poder dos novos chips (M3/M4).</p>
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 text-center py-20 flex flex-col items-center">
          
          <div className="flex items-center gap-2 mb-10">
             <Quote className="w-6 h-6 text-white/30" />
             <span className="font-mono text-sm tracking-[0.3em] uppercase font-bold text-white/50">Mantra 24 Horas</span>
          </div>
          
          <p className="text-5xl md:text-7xl lg:text-[80px] font-ps-display font-black tracking-tighter leading-[1.1] bg-clip-text text-transparent"
             style={{ backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${color} 50%, #ffffff 100%)` }}>
            {mantra}
          </p>

        </div>
      </section>

    </div>
  );
}
