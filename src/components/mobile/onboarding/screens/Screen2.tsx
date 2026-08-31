import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Tela 2 — Isso realmente muda?
 * Cards premium em cascata interativos. O clique inverte os destinos.
 */
export const Screen2 = () => {
  const [activeCard, setActiveCard] = useState<'tokyo' | 'roma'>('tokyo');

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-28 bg-[#030306]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-[#030306] to-[#030306]" />

      <div className="relative z-10 w-full max-w-md lg:max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="font-cinzel text-2xl sm:text-3xl text-white mb-2 leading-tight">
            Mesma pessoa.<br />Mesmo aniversário.
          </h2>
          <p className="font-inter text-white/50 text-xs sm:text-sm">
            Toque nos destinos para ver a leitura mudar.
          </p>
        </motion.div>

        <div 
          className="relative w-full h-[300px] cursor-pointer"
          onClick={() => setActiveCard(prev => prev === 'tokyo' ? 'roma' : 'tokyo')}
        >
          {/* Card Tóquio */}
          <motion.div
            animate={{ 
              opacity: activeCard === 'tokyo' ? 1 : 0.6,
              y: activeCard === 'tokyo' ? 0 : 40,
              scale: activeCard === 'tokyo' ? 1 : 0.95,
              zIndex: activeCard === 'tokyo' ? 20 : 10,
              rotate: activeCard === 'tokyo' ? -2 : 2,
            }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
            className="absolute top-0 left-4 right-8 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Tóquio" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090F] via-[#08090F]/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-5">
              <h3 className="font-cinzel text-xl text-white">Tóquio</h3>
              <p className="font-inter text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest mt-1">Carreira em destaque</p>
            </div>
          </motion.div>

          {/* Card Roma */}
          <motion.div
            animate={{ 
              opacity: activeCard === 'roma' ? 1 : 0.6,
              y: activeCard === 'roma' ? 0 : 40,
              scale: activeCard === 'roma' ? 1 : 0.95,
              zIndex: activeCard === 'roma' ? 20 : 10,
              rotate: activeCard === 'roma' ? 2 : -2,
            }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
            className="absolute top-4 left-8 right-4 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Roma" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090F] via-[#08090F]/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-5">
              <h3 className="font-cinzel text-xl text-white">Roma</h3>
              <p className="font-inter text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest mt-1">Amor em destaque</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
