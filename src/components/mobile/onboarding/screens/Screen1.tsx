import { useState } from 'react';
import { motion } from 'framer-motion';

/**
  * Tela 1 — O que é?
  * Background: earth-blue.jpg com movimento Ken Burns instantâneo + crossfade suave do vídeo vecteezy-earth.mp4.
  */
export const Screen1 = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div
      data-onboarding-scroll
      className="relative w-full h-full overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] overscroll-y-contain touch-pan-y flex flex-col bg-[#030306]"
    >
      {/* Earth + Milky Way — Ken Burns Instant Layer + Progressive Video Crossfade */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(1.08) saturate(1.15) brightness(1.05)' }}>
        {/* Camada 1: Imagem da Terra com movimento lento contínuo (0.1s de abertura) */}
        <motion.img
          src="/assets/earth-blue.jpg"
          alt="Terra no universo"
          initial={{ scale: 1 }}
          animate={{ scale: videoPlaying ? 1.03 : 1.12 }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Camada 2: Vídeo da Terra com Crossfade Invisível assim que estiver rodando */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setVideoPlaying(true)}
          onCanPlay={() => setVideoPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/assets/vecteezy-earth.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Single precise gradient — only bottom 50% gets darkened for text legibility */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#030306] via-[#030306]/70 to-transparent"
        style={{ background: 'linear-gradient(to top, #030306 0%, #030306cc 30%, #03030640 60%, transparent 100%)' }}
      />

      {/* Content — positioned at bottom to keep Earth visible */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-12 pt-24 pb-32 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-center lg:text-left lg:max-w-2xl"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block font-ps-ui text-[10px] tracking-[0.3em] text-[#C9A227]/80 uppercase mb-5"
          >
            Protocolo Solar · Relocalização
          </motion.span>

          {/* Headline */}
          <h1 className="font-ps-display text-[1.75rem] sm:text-4xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-5">
            Descubra onde passar{' '}
            <br className="hidden sm:block" />
            seu próximo aniversário.
          </h1>

          {/* Subcopy */}
          <p className="font-ps-ui text-white/65 text-[0.8125rem] md:text-base font-light max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
            O lugar onde você passa seu aniversário pode mudar a leitura do seu próximo ano — e colocar dinheiro, amor, carreira ou outras áreas da sua vida em maior destaque.
          </p>

          {/* Credibility metrics */}
          <div className="flex justify-center lg:justify-start gap-8 md:gap-12">
            {[
              { value: '12', label: 'Casas Astrológicas' },
              { value: '365', label: 'Dias Calculados' },
              { value: '±0.01°', label: 'Precisão GPS' },
            ].map((m, i) => (
              <motion.div
                key={m.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              >
                <span className="block font-ps-display text-xl md:text-2xl text-white font-bold">{m.value}</span>
                <span className="block font-ps-ui text-[8px] md:text-[9px] text-white/35 uppercase tracking-[0.2em] mt-1">{m.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
