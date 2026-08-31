import { motion } from 'framer-motion';

const paths = [
  {
    title: 'Por Cidade',
    hook: 'Já tenho um lugar em mente.',
    desc: 'Veja o que a cidade revela no seu próximo ano.',
    bg: 'from-blue-950/90 via-blue-900/40 to-transparent',
    glow: 'bg-blue-600/20',
    border: 'border-blue-500/20',
    accent: 'text-blue-300',
    num: '01',
  },
  {
    title: 'Por Casa',
    hook: 'Quero explorar uma área da vida.',
    desc: 'Escolha o tema — dinheiro, amor, carreira — e veja cidades.',
    bg: 'from-amber-950/90 via-amber-900/40 to-transparent',
    glow: 'bg-amber-500/20',
    border: 'border-amber-500/20',
    accent: 'text-amber-300',
    num: '02',
  },
  {
    title: 'Por Intenção',
    hook: 'Sei o que quero viver.',
    desc: 'Descreva seu objetivo e o sistema encontra o destino certo.',
    bg: 'from-violet-950/90 via-violet-900/40 to-transparent',
    glow: 'bg-violet-500/20',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    num: '03',
  },
];

/**
 * Tela 4 — Como eu uso?
 * Três caminhos em blocos de COR PURA (sem imagem).
 * Azul = Cidade, Âmbar = Casa, Violeta = Intenção.
 * Desktop: Cards lado a lado (horizontal). Mobile: Empilhados.
 */
export const Screen4 = () => (
  <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-[#030306]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#080A14] to-[#030306]" />

    {/* Title */}
    <div className="relative z-20 text-center pt-16 pb-3 px-6 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-cinzel text-2xl sm:text-4xl text-white mb-1 leading-tight">
          Como você quer começar?
        </h2>
        <p className="font-inter text-white/35 text-xs sm:text-sm">
          Três caminhos. Um resultado.
        </p>
      </motion.div>
    </div>

    {/* Pure-color cards - Horizontal on desktop, Vertical on mobile */}
    <div className="relative z-10 flex-1 flex flex-col md:flex-row justify-center gap-4 px-5 pb-24 pt-2 md:pt-10 max-w-6xl mx-auto w-full">
      {paths.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.55, ease: 'easeOut' }}
          className={`flex-1 relative overflow-hidden rounded-2xl border ${p.border} min-h-[140px] md:min-h-[300px] flex flex-col`}
        >
          {/* Pure color fill — no image */}
          <div className={`absolute inset-0 bg-gradient-to-r md:bg-gradient-to-b ${p.bg}`} />
          {/* Subtle radial glow center-left (mobile) or top-center (desktop) */}
          <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1/2 md:top-0 -translate-y-1/2 md:translate-y-0 w-32 h-32 md:w-48 md:h-48 rounded-full blur-2xl ${p.glow}`} />

          {/* Content */}
          <div className="relative z-10 h-full flex md:flex-col items-center md:items-start md:justify-end gap-5 md:gap-3 p-6 md:p-8">
            <span className={`font-mono text-3xl md:text-5xl font-bold opacity-20 ${p.accent} shrink-0`}>{p.num}</span>
            <div>
              <h3 className={`font-cinzel text-lg sm:text-2xl text-white mb-1`}>{p.title}</h3>
              <p className={`font-inter text-[11px] sm:text-xs font-semibold mb-1 sm:mb-3 ${p.accent}`}>"{p.hook}"</p>
              <p className="font-inter text-white/40 text-[10px] sm:text-xs font-light leading-relaxed">{p.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

