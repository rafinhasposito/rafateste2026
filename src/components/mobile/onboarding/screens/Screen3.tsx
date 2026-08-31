import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lifeAreas = [
  { name: 'Dinheiro',        symbol: '◈' },
  { name: 'Amor',            symbol: '◇' },
  { name: 'Carreira',        symbol: '▲' },
  { name: 'Família',         symbol: '○' },
  { name: 'Saúde',           symbol: '✦' },
  { name: 'Viagens',         symbol: '◎' },
  { name: 'Relacionamentos', symbol: '◈' },
  { name: 'Reconhecimento',  symbol: '△' },
];

const MAX_PICKS = 3;

/**
 * Tela 3 — Seletor de prioridades.
 * Mostra todas as 8 áreas simultaneamente como tags tapeáveis.
 * O usuário escolhe até 3. Ao atingir 3, transita para o estado de resultado.
 * Funciona bem em mobile E em desktop (layout centrado).
 */
export const Screen3 = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const done = selected.length === MAX_PICKS;

  function toggle(name: string) {
    if (done) return; // trava após 3
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  }

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#030306] px-5 pt-16 pb-28">
      {/* Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#080A14] to-[#030306]" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }}
      />

      {/* Blinking Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: `${10 + (i * 47) % 80}%`,
              left: `${5 + (i * 31) % 90}%`,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.4) % 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content — max-w-sm centers on desktop too */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="font-cinzel text-2xl sm:text-3xl text-white mb-2 leading-tight">
                  O que mais importa<br />pra você agora?
                </h2>
                <p className="font-inter text-white/40 text-xs">
                  Escolha até {MAX_PICKS} áreas que quer ver em destaque.
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mb-6">
                {[...Array(MAX_PICKS)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    animate={{
                      width:  i < selected.length ? 24 : 8,
                      height: 8,
                      backgroundColor: i < selected.length ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Area pills — flex-wrap, centered */}
              <div className="flex flex-wrap justify-center gap-2.5 mb-4">
                {lifeAreas.map((area, i) => {
                  const isSelected = selected.includes(area.name);
                  return (
                    <motion.button
                      key={area.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      onClick={() => toggle(area.name)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 text-left
                        ${isSelected
                          ? 'border-[#D4AF37]/70 bg-[#D4AF37]/10 text-[#D4AF37] scale-105'
                          : 'border-white/[0.08] bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-[10px] ${isSelected ? 'text-[#D4AF37]' : 'text-white/30'}`}>
                        {area.symbol}
                      </span>
                      <span className="font-inter text-[12px] font-medium whitespace-nowrap">
                        {area.name}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[#D4AF37] text-[10px] ml-0.5"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p className="font-inter text-white/20 text-[10px] mt-2">
                {selected.length === 0
                  ? 'Toque para selecionar'
                  : selected.length === 1
                  ? '1 de 3 — continue escolhendo'
                  : `${selected.length} de 3 — mais uma`}
              </p>
            </motion.div>
          ) : (
            /* Result — appears automatically after 3rd pick */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mb-5"
              >
                <span className="text-[#D4AF37] text-xl">✦</span>
              </motion.div>

              <h2 className="font-cinzel text-2xl text-white mb-2 leading-tight">
                Perfeito.
              </h2>
              <p className="font-inter text-white/50 text-sm mb-8 max-w-[260px]">
                Uma cidade certa pode colocar exatamente essas áreas em destaque.
              </p>

              {/* Chosen areas */}
              <div className="flex flex-wrap justify-center gap-2.5 mb-6">
                {selected.map((name, i) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.35 }}
                    className="font-inter text-[#D4AF37] text-[11px] font-semibold uppercase tracking-widest px-5 py-2.5 border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] rounded-full"
                  >
                    {name}
                  </motion.span>
                ))}
              </div>

              {/* Subtle nudge to continue */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-inter text-white/25 text-[10px] tracking-widest uppercase"
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
