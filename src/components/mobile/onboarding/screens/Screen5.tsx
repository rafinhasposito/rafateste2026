import { motion } from 'framer-motion';

/**
 * Tela 5 — O Minimalismo "Apple"
 * Foco absoluto no texto, tipografia gigante e espaço negativo.
 * Serve como um respiro luxuoso antes do resultado final.
 */
export const Screen5 = () => (
  <div className="relative w-full min-h-[100svh] flex flex-col items-center justify-center bg-[#020204] px-6 pt-20 pb-32">
    
    {/* Ultra-subtle stage light (Quase invisível, apenas para dar profundidade ao preto) */}
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A227]/[0.02] rounded-full blur-[120px] pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
      
      {/* Premium Top Tag */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="font-ps-ui text-[#C9A227] text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-medium mb-8 md:mb-12"
      >
        Tecnologia & Precisão Astronômica
      </motion.span>

      {/* Massive Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
        className="font-ps-display text-4xl md:text-6xl lg:text-7xl text-white mb-8 md:mb-12 leading-[1.1] tracking-tight drop-shadow-xl"
      >
        O Universo mapeado<br className="hidden md:block" /> para você.
      </motion.h2>

      {/* Minimalist Paragraph */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
        className="font-ps-ui text-white/50 text-[15px] md:text-lg max-w-2xl leading-[1.8] md:leading-[1.9] font-light"
      >
        Cruzamos a exatidão do seu nascimento com a rotação dos astros em milissegundos.
        <br /><br />
        Nossa inteligência encontra a única cidade no mundo capaz de ativar a mudança que você deseja viver nos próximos 365 dias.
      </motion.p>
      
      {/* Animated minimalist line drawing downward */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 80, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: 'easeInOut' }}
        className="w-px bg-gradient-to-b from-[#C9A227]/60 to-transparent mt-12 md:mt-16"
      />

    </div>
  </div>
);
