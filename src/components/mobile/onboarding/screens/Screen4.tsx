import { useState } from 'react';
import { motion } from 'framer-motion';

const paths = [
  {
    title: 'Por Cidade',
    hook: 'Já sei para onde quero viajar.',
    desc: 'Descubra exatamente como essa coordenada vai ativar novos acontecimentos e transformar seu novo ciclo.',
    poster: '/images/abertura/paris.jpg',
    video: '/assets/paris.mp4',
    num: '01',
  },
  {
    title: 'Por Casa Astrológica',
    hook: 'Quero virar a chave em uma área.',
    desc: 'Destrave finanças, carreira ou amor. Escolha a mudança que você precisa e encontre os destinos ideais.',
    poster: '/images/abertura/stars.jpg',
    video: '/assets/stars.mp4',
    num: '02',
  },
  {
    title: 'Por Intenção',
    hook: 'Sei o resultado que quero alcançar.',
    desc: 'Escolha o que quer viver neste ano e descubra os destinos ligados ao seu objetivo.',
    poster: '/images/abertura/particles.jpg',
    video: '/assets/particles.mp4',
    num: '03',
  },
];

/**
 * Tela 4 — Como eu uso?
 * Três pilares cinematográficos com imagens pré-carregadas instantâneas (0.00s) + vídeo em crossfade suave.
 */
export const Screen4 = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [playingVideos, setPlayingVideos] = useState<Record<number, boolean>>({});

  return (
    <div className="relative w-full min-h-[100svh] bg-[#010103]">
      {/* Deep ambient background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-[#010103] to-[#010103]" />

      <div className="relative z-10 min-h-[100svh] w-full flex flex-col justify-start md:justify-center pt-[72px] pb-28 sm:pt-20 sm:pb-32 md:py-24">
        {/* Title */}
        <div className="relative z-20 text-center shrink-0 pb-3 sm:pb-5 px-5 md:pb-12">
          <h2 className="font-ps-display text-[20px] sm:text-3xl md:text-5xl text-white mb-1 md:mb-4 leading-snug drop-shadow-lg">
            Como você quer transformar seu ano?
          </h2>
          <p className="font-ps-ui text-[#C9A227] text-[9px] sm:text-[10px] md:text-xs tracking-[0.22em] sm:tracking-[0.26em] uppercase drop-shadow-md">
            Três caminhos para mudar a sua realidade.
          </p>
        </div>

        {/* Cinematic Cards */}
        <div className="relative z-10 flex flex-col md:flex-row justify-start md:justify-center items-stretch gap-2.5 sm:gap-3.5 md:gap-6 px-5 sm:px-6 max-w-7xl mx-auto w-full shrink-0">
          {paths.map((p, i) => {
            const isOtherHovered = hovered !== null && hovered !== i;
            const isVideoReady = Boolean(playingVideos[i]);

            return (
              <motion.div
                key={p.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
                className={`
                  group relative shrink-0 md:flex-1 rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 shadow-xl cursor-pointer transition-all duration-500 bg-[#080B14]
                  ${isOtherHovered ? 'md:flex-[0.7] opacity-60 grayscale' : 'md:flex-[1.2] opacity-100'}
                `}
              >
                {/* Camada 1: Imagem Pré-carregada Instantânea (0.00s, nunca fica preta) */}
                <img
                  src={p.poster}
                  alt=""
                  loading="eager"
                  decoding="sync"
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-[10s] ease-linear group-hover:scale-110 ${
                    isOtherHovered ? 'opacity-20' : 'opacity-50 md:opacity-75'
                  }`}
                />

                {/* Camada 2: Vídeo em Crossfade Suave (só aparece depois de carregado) */}
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onPlaying={() => setPlayingVideos(prev => ({ ...prev, [i]: true }))}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
                    isVideoReady ? (isOtherHovered ? 'opacity-20' : 'opacity-60 md:opacity-80') : 'opacity-0'
                  }`}
                >
                  <source src={p.video} type="video/mp4" />
                </video>

                {/* Gradient Mask */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r md:bg-gradient-to-t from-[#010103]/95 via-[#010103]/75 to-[#010103]/35" />
                
                {/* Content */}
                <div className="relative z-10 flex md:flex-col items-center md:items-start md:justify-end px-4 py-3 sm:p-5 md:p-10 gap-3 sm:gap-5 md:gap-4">
                  <span className="font-ps-display text-2xl sm:text-4xl md:text-6xl font-bold opacity-40 text-[#C9A227] md:text-white shrink-0 group-hover:text-[#C9A227] group-hover:opacity-85 transition-all duration-500 w-8 sm:w-auto text-center">
                    {p.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-ps-display text-[15px] sm:text-xl md:text-3xl text-white mb-0.5 md:mb-3 drop-shadow-lg leading-tight">
                      {p.title}
                    </h3>
                    <p className="font-ps-ui text-[10.5px] sm:text-xs md:text-sm font-semibold mb-0.5 md:mb-4 text-[#C9A227] drop-shadow-md">
                      "{p.hook}"
                    </p>
                    <p className="font-ps-ui text-white/80 text-[10.5px] sm:text-xs md:text-sm font-light leading-tight md:leading-relaxed max-w-[300px]">
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

