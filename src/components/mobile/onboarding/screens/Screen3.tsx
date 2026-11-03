import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lifeAreas = [
  { name: 'Dinheiro',        symbol: '☩' },
  { name: 'Carreira',        symbol: '♄' },
  { name: 'Amor',            symbol: '♀' },
  { name: 'Saúde',           symbol: '☤' },
  { name: 'Estudos',         symbol: '☿' },
  { name: 'Espiritualidade', symbol: '♆' },
  { name: 'Relacionamentos', symbol: '◈' },
  { name: 'Reconhecimento',  symbol: '△' },
];

const MAX_PICKS = 3;

/**
 * Tela 3 — Seletor de prioridades.
 * Agora com proporções épicas no Desktop e Fundo em Vídeo do Zodíaco.
 */
export const Screen3 = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const done = selected.length === MAX_PICKS;

  function toggle(name: string) {
    if (done) return;
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  }

  return (
    <div
      data-onboarding-scroll
      className="relative w-full h-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] overscroll-y-contain touch-pan-y bg-[#030306] px-6 pt-20 pb-32"
    >
      
      {/* Cinematic Stars Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay loop muted playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-50 mix-blend-screen"
          style={{ filter: "saturate(1.1) contrast(1.3)" }}
        >
          <source src="/assets/stars.mp4" type="video/mp4" />
        </video>
        {/* Masks to blend the video smoothly into the dark UI */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-transparent to-[#030306] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#030306_80%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md md:max-w-4xl mx-auto my-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center mb-10 md:mb-16">
                <h2 className="font-ps-display text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight drop-shadow-lg">
                  O que mais importa<br />pra você agora?
                </h2>
                <p className="font-ps-ui text-white/50 text-sm md:text-lg tracking-wide">
                  Escolha até {MAX_PICKS} áreas da sua vida.
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-3 mb-10 md:mb-14">
                {[...Array(MAX_PICKS)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full shadow-[0_0_15px_rgba(201,162,39,0.3)]"
                    animate={{
                      width:  i < selected.length ? (window.innerWidth > 768 ? 40 : 28) : (window.innerWidth > 768 ? 12 : 8),
                      height: window.innerWidth > 768 ? 12 : 8,
                      backgroundColor: i < selected.length ? '#C9A227' : 'rgba(255,255,255,0.1)',
                      boxShadow: i < selected.length ? '0 0 15px rgba(201,162,39,0.5)' : 'none',
                    }}
                    transition={{ duration: 0.4, type: 'spring' }}
                  />
                ))}
              </div>

              {/* Area pills */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-6 md:mb-10 max-w-[300px] md:max-w-none">
                {lifeAreas.map((area, i) => {
                  const isSelected = selected.includes(area.name);
                  return (
                    <motion.button
                      key={area.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      onClick={() => toggle(area.name)}
                      className={`
                        flex items-center gap-2 md:gap-3 px-5 py-3 md:px-8 md:py-4 rounded-full border transition-all duration-300 text-left
                        ${isSelected
                          ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227] scale-105 shadow-[0_0_20px_rgba(201,162,39,0.2)]'
                          : 'border-white/[0.08] bg-white/[0.02] text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-[12px] md:text-[16px] ${isSelected ? 'text-[#C9A227]' : 'text-white/30'}`}>
                        {area.symbol}
                      </span>
                      <span className="font-ps-ui text-[13px] md:text-[16px] font-medium whitespace-nowrap tracking-wide">
                        {area.name}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[#C9A227] text-[12px] md:text-[14px] ml-1"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p className="font-ps-ui text-white/30 text-xs md:text-sm mt-4 uppercase tracking-[0.2em]">
                {selected.length === 0
                  ? 'Toque para selecionar'
                  : selected.length === 1
                  ? '1 de 3 — continue escolhendo'
                  : `${selected.length} de 3 — mais uma`}
              </p>
            </motion.div>
          ) : (
            /* Result */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(201,162,39,0.3)]"
              >
                <span className="text-[#C9A227] text-3xl md:text-4xl">✦</span>
              </motion.div>

              <h2 className="font-ps-display text-3xl md:text-6xl text-white mb-4 leading-tight drop-shadow-md">
                Perfeito.
              </h2>
              <p className="font-ps-ui text-white/50 text-sm md:text-lg mb-12 max-w-sm md:max-w-lg leading-relaxed">
                A cidade certa na Terra pode colocar exatamente essas áreas em destaque no seu próximo ano astrológico.
              </p>

              {/* Chosen areas */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-10">
                {selected.map((name, i) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="font-ps-ui text-[#C9A227] text-xs md:text-sm font-semibold uppercase tracking-[0.2em] px-6 py-3 md:px-10 md:py-4 border border-[#C9A227]/30 bg-[#C9A227]/10 rounded-full shadow-lg"
                  >
                    {name}
                  </motion.span>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-ps-ui text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-4"
              >
                Continue para descobrir como
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
