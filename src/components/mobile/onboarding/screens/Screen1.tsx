import { motion } from 'framer-motion';

/**
 * Tela 1 — O que é?
 * Background: earth-blue.jpg — Terra no centro da Via Láctea.
 * Overlay mínimo para manter nitidez. CSS filter para vivacidade.
 * Conteúdo na parte inferior para não cobrir a Terra.
 */
export const Screen1 = () => (
  <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
    {/* Earth + Milky Way — user's image, maximum sharpness */}
    <img
      src="/assets/earth-blue.jpg"
      alt="Terra no universo"
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ filter: 'contrast(1.08) saturate(1.15) brightness(1.05)' }}
    />
    {/* Single precise gradient — only bottom 50% gets darkened for text legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/70 to-transparent" style={{ background: 'linear-gradient(to top, #030306 0%, #030306cc 30%, #03030640 60%, transparent 100%)' }} />

    {/* Content — positioned at bottom to keep Earth visible */}
    <div className="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-12 pb-28 max-w-7xl mx-auto w-full">
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
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-block font-inter text-[10px] tracking-[0.3em] text-[#D4AF37]/80 uppercase mb-5"
        >
          Protocolo Solar · Relocalização
        </motion.span>

        {/* Headline */}
        <h1 className="font-cinzel text-[1.75rem] sm:text-4xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-5">
          Descubra onde passar{' '}
          <br className="hidden sm:block" />
          seu próximo aniversário.
        </h1>

        {/* Subcopy */}
        <p className="font-inter text-white/65 text-[0.8125rem] md:text-base font-light max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
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
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            >
              <span className="block font-cinzel text-xl md:text-2xl text-white font-bold">{m.value}</span>
              <span className="block font-inter text-[8px] md:text-[9px] text-white/35 uppercase tracking-[0.2em] mt-1">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

