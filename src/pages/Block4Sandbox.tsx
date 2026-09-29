import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';

const TIMELINE_DATA = [
  { 
    phase: "Fase 1: Preparação de Terreno", 
    period: "Meses 1 a 4", 
    text: "O ciclo se inicia pedindo arrumação de casa. A energia favorece a revisão de preços, corte de gastos inúteis e o planejamento cirúrgico do seu funil de vendas." 
  },
  { 
    phase: "Fase 2: Tração Magnética", 
    period: "Meses 5 a 8", 
    text: "Com a base arrumada, o seu magnetismo entra em potência máxima. Convites e propostas tendem a se materializar com mais facilidade." 
  },
  { 
    phase: "Fase 3: Consolidação", 
    period: "Meses 9 a 12", 
    text: "A euforia da expansão cede lugar à segurança estrutural. O destino foca em transformar lucros isolados em previsibilidade financeira e blindagem de patrimônio." 
  }
];

export default function Block4Sandbox() {
  const [openPhase, setOpenPhase] = useState<number | null>(0);
  const color = "#10b981"; // Cor da casa Dinheiro para exemplo

  return (
    <div className="min-h-screen bg-[#03100B] text-white p-10 font-sans overflow-y-auto pb-40">
      <div className="max-w-4xl mx-auto space-y-40">
        
        <div className="text-center pt-10">
          <h1 className="text-4xl font-bold mb-4">Sandbox: Bloco 4 (Linha do Tempo)</h1>
          <p className="text-white/60">3 Propostas de Layout para contar a história dos 12 meses.</p>
        </div>

        {/* =========================================
            OPÇÃO 1: ACCORDION BORDERLESS (A que eu fiz)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 1: O Acordeão Borderless Apple</h2>
            <p className="text-white/50 text-sm mt-2">Leitura limpa, sob demanda. Oculta o texto para não cansar o usuário e cria interação.</p>
          </div>

          <div className="flex flex-col border-t border-white/10 bg-black/20 p-10 rounded-[40px] shadow-2xl">
            {TIMELINE_DATA.map((phase, index) => {
              const isOpen = openPhase === index;
              return (
                <div key={index} className="border-b border-white/10 flex flex-col group">
                  <button 
                    onClick={() => setOpenPhase(isOpen ? null : index)}
                    className="w-full py-8 flex items-center justify-between text-left"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <span className="font-mono text-xs tracking-[0.2em] uppercase transition-colors" style={{ color: isOpen ? color : 'rgba(255,255,255,0.4)' }}>
                        {phase.period}
                      </span>
                      <h3 className={`font-ps-display text-4xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-white/40'}`}>
                        {phase.phase}
                      </h3>
                    </div>
                    <div className="shrink-0 ml-4 w-10 h-10 flex items-center justify-center rounded-full border transition-all" style={{ borderColor: isOpen ? color : 'rgba(255,255,255,0.1)', backgroundColor: isOpen ? `${color}10` : 'transparent' }}>
                        <Plus className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} style={{ color: isOpen ? color : 'white' }} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8">
                            <p className="text-white/60 text-xl font-light leading-relaxed">{phase.text}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>


        {/* =========================================
            OPÇÃO 2: TIMELINE VERTICAL (Talo Central)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 2: Vertical Path (Storytelling)</h2>
            <p className="text-white/50 text-sm mt-2">Uma linha guia visual conectando os meses. Todos os textos abertos em uma rolagem narrativa.</p>
          </div>

          <div className="relative pl-6 md:pl-12">
            {/* A Linha Vertical */}
            <div className="absolute top-0 bottom-0 left-8 md:left-14 w-px bg-white/10"></div>
            
            <div className="flex flex-col gap-24">
              {TIMELINE_DATA.map((phase, index) => (
                <div key={index} className="relative pl-12 md:pl-20">
                  {/* O Ponto/Nó da Timeline */}
                  <div className="absolute top-2 left-[-11px] md:left-[-11px] w-6 h-6 rounded-full border-4 border-[#03100B] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ backgroundColor: color }}></div>
                  
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-sm tracking-[0.2em] uppercase font-bold" style={{ color: color }}>
                      {phase.period}
                    </span>
                    <h3 className="font-ps-display text-4xl font-bold text-white tracking-tight">
                      {phase.phase}
                    </h3>
                    <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl mt-4">
                      {phase.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* =========================================
            OPÇÃO 3: CAROUSEL HORIZONTAL (Cards Swipáveis)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 3: Horizontal Carousel</h2>
            <p className="text-white/50 text-sm mt-2">Cards focados lado a lado. Muito amigável para celular (Swipe).</p>
          </div>

          <div className="w-full flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {TIMELINE_DATA.map((phase, index) => (
              <div key={index} className="min-w-[85%] md:min-w-[400px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-10 snap-center flex flex-col justify-between shrink-0 relative overflow-hidden group">
                
                {/* Glow Background */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: color }}></div>

                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-8" style={{ color: color }}>
                    Fase 0{index + 1}
                  </div>
                  
                  <h3 className="font-ps-display text-3xl font-bold text-white mb-6">
                    {phase.phase.replace('Fase 1: ', '').replace('Fase 2: ', '').replace('Fase 3: ', '')}
                  </h3>
                  
                  <p className="text-white/60 text-lg font-light leading-relaxed">
                    {phase.text}
                  </p>
                </div>

                <div className="mt-10 font-mono text-xs tracking-widest text-white/30 uppercase">
                  {phase.period}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
