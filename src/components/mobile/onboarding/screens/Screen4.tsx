import { useState } from 'react';
import { motion } from 'framer-motion';

const paths = [
  {
    title: 'Por Cidade',
    hook: 'Já sei para onde quero viajar.',
    desc: 'Descubra exatamente como essa coordenada vai ativar novos acontecimentos e transformar seu novo ciclo.',
    video: '/assets/paris.mp4',
    num: '01',
  },
  {
    title: 'Por Casa Astrológica',
    hook: 'Quero virar a chave em uma área.',
    desc: 'Destrave finanças, carreira ou amor. Escolha a mudança que você precisa e encontre os destinos ideais.',
    video: '/assets/stars.mp4',
    num: '02',
  },
  {
    title: 'Por Intenção',
    hook: 'Sei o resultado que quero alcançar.',
    desc: 'Escreva o seu maior objetivo e a inteligência do sistema revela a cidade perfeita no mundo para torná-lo real.',
    video: '/assets/particles.mp4',
    num: '03',
  },
];

/**
 * Tela 4 — Como eu uso?
 * Três pilares de vidro cinematográficos com vídeos embutidos.
 */
export const Screen4 = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      data-onboarding-scroll
      className="relative w-full h-full overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] overscroll-y-contain touch-pan-y bg-[#010103]"
    >
      {/* Deep ambient background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-[#010103] to-[#010103]" />

      <div className="relative z-10 min-h-full w-full flex flex-col justify-start md:justify-center pt-[calc(4.25rem+env(safe-area-inset-top,0px))] pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] md:py-24">
        {/* Title */}
        <div className="relative z-20 text-center shrink-0 pb-4 px-6 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="font-ps-display text-[22px] sm:text-3xl md:text-5xl text-white mb-1.5 md:mb-4 leading-tight drop-shadow-lg">
              Como você quer transformar seu ano?
            </h2>
            <p className="font-ps-ui text-[#C9A227] text-[10px] md:text-xs tracking-[0.26em] uppercase drop-shadow-md">
              Três caminhos para mudar a sua realidade.
            </p>
          </motion.div>
        </div>

        {/* Cinematic Cards */}
        <div className="relative z-10 flex flex-col md:flex-row justify-start md:justify-center items-stretch gap-3 md:gap-6 px-5 sm:px-6 max-w-7xl mx-auto w-full shrink-0">
          {paths.map((p, i) => {
            const isOtherHovered = hovered !== null && hovered !== i;

            return (
              <motion.div
                key={p.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className={`
                  group relative shrink-0 md:flex-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-crosshair transition-all duration-700
                  ${isOtherHovered ? 'md:flex-[0.7] opacity-60 grayscale' : 'md:flex-[1.2] opacity-100'}
                `}
              >
                {/* Background Video */}
                <video 
                  autoPlay loop muted playsInline preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-[10s] ease-linear group-hover:scale-110 ${isOtherHovered ? 'opacity-20' : 'opacity-60 md:opacity-80'}`}
                >
                  <source src={p.video} type="video/mp4" />
                </video>

                {/* Gradient Mask */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r md:bg-gradient-to-t from-[#010103] via-[#010103]/65 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 flex md:flex-col items-center md:items-start md:justify-end p-4 sm:p-5 md:p-10 gap-3.5 sm:gap-5 md:gap-4 transition-transform duration-500 group-hover:translate-x-2 md:group-hover:translate-x-0 md:group-hover:-translate-y-2">
                  <span className="font-ps-display text-3xl sm:text-4xl md:text-6xl font-bold opacity-35 text-white shrink-0 group-hover:text-[#C9A227] group-hover:opacity-80 transition-all duration-500">
                    {p.num}
                  </span>
                  <div>
                    <h3 className="font-ps-display text-base sm:text-xl md:text-3xl text-white mb-0.5 md:mb-3 drop-shadow-lg">
                      {p.title}
                    </h3>
                    <p className="font-ps-ui text-[11px] md:text-sm font-semibold mb-1 md:mb-4 text-[#C9A227] drop-shadow-md">
                      "{p.hook}"
                    </p>
                    <p className="font-ps-ui text-white/65 text-[11px] md:text-sm font-light leading-snug md:leading-relaxed max-w-[280px]">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

