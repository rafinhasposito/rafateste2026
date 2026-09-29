import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, ArrowUpCircle, Hourglass } from 'lucide-react';

const DNA_DATA = [
  {
    id: 'sol',
    title: 'A Força do Sol em Leão',
    text: 'Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na Casa 2, a energia desta cidade potencializa seu magnetismo para se traduzir em valor monetário real.',
    icon: Sun
  },
  {
    id: 'asc',
    title: 'O Rigor do Ascendente em Virgem',
    text: 'Traz a mente analítica, facilitando que você olhe para processos com disciplina e visão de longo prazo.',
    icon: ArrowUpCircle
  },
  {
    id: 'idade',
    title: 'O Filtro dos 41 Anos',
    text: 'O objetivo financeiro não é a ostentação superficial, mas a construção de um porto seguro e previsibilidade de caixa.',
    icon: Hourglass
  }
];

export default function Block3Sandbox() {
  const [activeTab, setActiveTab] = useState(DNA_DATA[0]);

  return (
    <div className="min-h-screen bg-[#03100B] text-white p-10 font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-32 pb-32">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sandbox: Bloco 3 (O Seu DNA de Ativação)</h1>
          <p className="text-white/60">3 Propostas de Layout estilo Apple para você avaliar antes de aplicarmos na página principal.</p>
        </div>

        {/* ══════════════════════════════════════════════════
            OPÇÃO 1: TECH SPECS (O Painel de Laudo Contínuo)
            ══════════════════════════════════════════════════ */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 1: Tech Specs List</h2>
            <p className="text-white/50 text-sm mt-2">Um único painel de vidro com linhas horizontais. Leitura fluida e contínua.</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 pb-4">
              <h3 className="text-xl font-bold text-white mb-2">O Seu DNA de Ativação</h3>
              <p className="text-sm text-white/50">Como a sua assinatura astrológica interage com essa cidade.</p>
            </div>
            
            <div className="flex flex-col">
              {DNA_DATA.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-6 p-8 transition-colors hover:bg-white/[0.02] ${idx !== DNA_DATA.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <item.icon className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-white/60 leading-relaxed font-light">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════
            OPÇÃO 2: SEGMENTED CONTROL (Abas Interativas)
            ══════════════════════════════════════════════════ */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 2: Abas Interativas (Segmented Control)</h2>
            <p className="text-white/50 text-sm mt-2">Navegação focada. Apenas uma informação por vez, exigindo o clique (interatividade).</p>
          </div>

          <div className="flex flex-col items-center">
            {/* The Pill Control */}
            <div className="bg-black/50 backdrop-blur-xl p-1.5 rounded-full flex gap-1 mb-12 border border-white/10 shadow-lg">
              {DNA_DATA.map(item => {
                const isActive = activeTab.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item)}
                    className={`relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-300 z-10 ${isActive ? 'text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-[#10b981] rounded-full -z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      />
                    )}
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.id === 'sol' ? 'Sol' : item.id === 'asc' ? 'Ascendente' : 'Maturidade'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* The Content Area */}
            <div className="w-full h-[280px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center shadow-2xl"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <activeTab.icon className="w-10 h-10 text-[#10b981]" />
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-4 tracking-tight">{activeTab.title}</h4>
                  <p className="text-white/60 text-lg leading-relaxed font-light max-w-2xl">{activeTab.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════
            OPÇÃO 3: O Z-PATTERN (Estilo Landing Page Apple)
            ══════════════════════════════════════════════════ */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 3: Z-Pattern (Feature Scroll)</h2>
            <p className="text-white/50 text-sm mt-2">Sem caixas fechadas. Os elementos respiram livres na tela, intercalando imagem e texto.</p>
          </div>

          <div className="flex flex-col gap-24 py-10">
            {DNA_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={item.id} className={`flex flex-col md:flex-row items-center gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Icon Side */}
                  <div className="flex-1 flex justify-center relative">
                    <div className="absolute inset-0 bg-[#10b981]/20 blur-[100px] rounded-full scale-150 pointer-events-none"></div>
                    <item.icon className="w-48 h-48 text-[#10b981] drop-shadow-[0_0_30px_rgba(16,185,129,0.5)] relative z-10" strokeWidth={1} />
                  </div>

                  {/* Text Side */}
                  <div className={`flex-1 text-center md:text-left ${!isEven ? 'md:text-right' : ''}`}>
                    <h3 className="text-[#10b981] font-bold tracking-[0.2em] uppercase text-xs mb-3">O Seu DNA</h3>
                    <h4 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{item.title}</h4>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light">{item.text}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
