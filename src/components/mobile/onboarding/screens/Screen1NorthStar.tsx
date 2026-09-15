import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNext: () => void;
  title: React.ReactNode;
  subtitle: string;
}

export const Screen1NorthStar = ({ onNext, title, subtitle }: Props) => {
  return (
    <div className="w-full min-h-[100dvh] bg-[#000000] flex items-center justify-center overflow-hidden font-sans select-none relative">
      {/*
        CHASSI DO APP MOBILE PREMIUM (390px - 430px)
        Moldura discreta para preview em desktop e tela cheia imersiva em mobile
      */}
      <div className="w-full max-w-[430px] h-[100dvh] max-h-[932px] bg-[#020204] relative flex flex-col justify-between overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)] sm:border-x sm:border-white/5">

        {/* ── CAMADA 1: FUNDO PROFUNDO COM GRID CARTOGRÁFICO SUTIL ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Gradiente de profundidade vertical */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/40 via-transparent to-[#020204] z-10" />

          {/* Linhas de grade geoespacial discretas (0.5px) */}
          <div
            className="absolute inset-0 opacity-[0.03] z-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px'
            }}
          />
        </div>

        {/* ── CAMADA 2: VISUAL GEO-ORBITAL (COSMIC TRAVEL INTELLIGENCE) ── */}
        <div className="absolute top-0 right-[-15%] w-[125%] h-[58%] pointer-events-none z-10 overflow-hidden">
          {/* Máscara de fusão suave com o fundo negro */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020204]/40 to-[#020204] z-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020204] via-transparent to-transparent z-20" />

          {/* Planeta Terra em Alta Resolução com Contraste Técnico */}
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <img
              src="/earth-orbital-hires.jpg"
              alt="Earth Geo Orbital"
              className="w-full h-full object-cover object-right-top filter grayscale contrast-125 brightness-95"
              style={{
                maskImage: "radial-gradient(circle at 68% 32%, black 42%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(circle at 68% 32%, black 42%, transparent 78%)"
              }}
            />
          </motion.div>

          {/* SVG com Arcos Geodésicos, Vetores Orbitais e Coordenadas Técnicas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute inset-0 w-full h-full z-30"
          >
            <svg className="w-full h-full" viewBox="0 0 500 500" fill="none">
              {/* Anel orbital externo discreto */}
              <circle
                cx="340"
                cy="160"
                r="180"
                stroke="white"
                strokeWidth="0.75"
                strokeDasharray="3 6"
                className="opacity-20"
              />

              {/* Arco de relocalização solar (Vetor de Descoberta) */}
              <path
                d="M 180 300 C 230 180, 310 130, 390 110"
                stroke="url(#goldGradient)"
                strokeWidth="1.5"
                className="opacity-85"
              />

              {/* Ponto A (Origem) */}
              <g className="opacity-90">
                <circle cx="180" cy="300" r="3" fill="#FAF7EE" />
                <circle cx="180" cy="300" r="7" stroke="rgba(250,247,238,0.3)" strokeWidth="0.75" />
              </g>

              {/* Ponto B (Alvo de Relocalização / Vetor Dourado) */}
              <g className="opacity-95">
                <circle cx="390" cy="110" r="3.5" fill="#C9A227" />
                <circle cx="390" cy="110" r="9" stroke="rgba(212,175,55,0.4)" strokeWidth="1" strokeDasharray="2 3" />
              </g>

              {/* Definição de gradientes SVG */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(250,247,238,0.15)" />
                  <stop offset="70%" stopColor="#C9A227" />
                  <stop offset="100%" stopColor="#FAF7EE" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Micro-telemetria de Coordenadas (Topo/Direita) */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-[38%] right-[18%] z-30 flex flex-col items-start gap-1 font-mono text-[8px] tracking-[0.2em] text-[#FAF7EE]/50 bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
              <span className="text-[#C9A227]">VECTOR ACTIVE</span>
            </div>
            <span className="text-white/40">GEO 40°42'N 74°00'W</span>
          </motion.div>
        </div>

        {/* ── TOPO: BARRA DE STATUS & PROGRESSO DISCRETO ── */}
        <header className="relative z-30 w-full px-6 pt-12 pb-4 flex items-center justify-between">
          {/* Contexto da Aplicação */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAF7EE]/70 uppercase">
              PROTOCOLO SOLAR
            </span>
          </div>

          {/* Indicador de Etapa / Telemetria (01/06 com barra sutil) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`h-[2px] rounded-full transition-all duration-300 ${
                    idx === 0
                      ? 'w-5 bg-[#C9A227]'
                      : 'w-2 bg-white/10'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#FAF7EE]/40">
              01/06
            </span>
          </div>
        </header>

        {/* ── CORPO CENTRAL & BLOCO EDITORIAL (INFERIOR/MÉDIO) ── */}
        <div className="relative z-30 w-full px-7 pb-10 flex flex-col justify-end mt-auto">

          {/* Overline de Contexto */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C9A227]/90">
              01 // RELOCAÇÃO SOLAR
            </span>
          </motion.div>

          {/* Título Principal Editorial (Cinzel) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <h1 className="font-ps-display text-[26px] xs:text-[28px] sm:text-[30px] font-medium leading-[1.2] tracking-[0.04em] text-[#FAF7EE] uppercase drop-shadow-sm">
              {title}
            </h1>
          </motion.div>

          {/* Subtítulo Editorial (Inter) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-ps-ui text-[13px] sm:text-[13.5px] font-light leading-[1.65] text-[#FAF7EE]/70 mt-4 mb-8 pr-2"
          >
            {subtitle}
          </motion.p>

          {/* ── AÇÃO INTEGRADA & ÚNICA (App Premium) ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="w-full"
          >
            <button
              onClick={onNext}
              className="group relative w-full h-[54px] rounded-full bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.98] border border-white/15 hover:border-[#C9A227]/50 transition-all duration-300 flex items-center justify-between px-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Brilho interior sutil */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C9A227]/0 via-[#C9A227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Rótulo da Ação */}
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#FAF7EE] uppercase group-hover:text-white transition-colors">
                Iniciar Exploração
              </span>

              {/* Círculo do Vetor de Avanço */}
              <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-[#C9A227] bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C9A227]/10">
                <ArrowRight className="w-3.5 h-3.5 text-[#FAF7EE]/80 group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
