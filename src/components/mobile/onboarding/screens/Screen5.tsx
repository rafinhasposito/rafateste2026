import { motion } from 'framer-motion';

const dataPoints = [
  { label: 'Data de nascimento', value: '15 Mar 1990' },
  { label: 'Hora de nascimento', value: '14:32' },
  { label: 'Cidade natal', value: 'São Paulo, BR' },
  { label: 'Próximo aniversário', value: '15 Mar 2026' },
  { label: 'Cidade destino', value: 'Tóquio, JP' },
];

/**
 * Tela 5 — É fácil fazer?
 * Visual mais iluminado e premium. O sistema faz o trabalho.
 */
export const Screen5 = () => (
  <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-28">
    {/* Pure starfield background — crisp at any resolution */}
    <div className="absolute inset-0 bg-[#030306]" />
    <div className="absolute inset-0 pointer-events-none">
      {[
        { top: '8%',  left: '12%', size: 1.5, dur: 3.2, del: 0 },
        { top: '15%', left: '78%', size: 1,   dur: 2.4, del: 0.5 },
        { top: '22%', left: '45%', size: 2,   dur: 4,   del: 1 },
        { top: '30%', left: '90%', size: 1,   dur: 2.8, del: 0.3 },
        { top: '35%', left: '5%',  size: 1.5, dur: 3.5, del: 0.8 },
        { top: '42%', left: '60%', size: 1,   dur: 2.1, del: 1.2 },
        { top: '50%', left: '25%', size: 2,   dur: 3.8, del: 0.2 },
        { top: '55%', left: '82%', size: 1,   dur: 2.6, del: 0.9 },
        { top: '62%', left: '15%', size: 1.5, dur: 3,   del: 0.4 },
        { top: '68%', left: '55%', size: 1,   dur: 2.3, del: 1.5 },
        { top: '75%', left: '35%', size: 2,   dur: 4.2, del: 0.7 },
        { top: '80%', left: '70%', size: 1,   dur: 2.9, del: 0.1 },
        { top: '88%', left: '8%',  size: 1.5, dur: 3.3, del: 1.1 },
        { top: '92%', left: '88%', size: 1,   dur: 2.7, del: 0.6 },
        { top: '5%',  left: '55%', size: 2,   dur: 3.6, del: 0.4 },
        { top: '18%', left: '22%', size: 1,   dur: 2.2, del: 1.3 },
        { top: '47%', left: '95%', size: 1.5, dur: 3.1, del: 0.8 },
        { top: '72%', left: '48%', size: 1,   dur: 2.5, del: 0.2 },
        { top: '38%', left: '72%', size: 2,   dur: 3.9, del: 1.4 },
        { top: '58%', left: '38%', size: 1,   dur: 2.8, del: 0.6 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.del, ease: 'easeInOut' }}
        />
      ))}
    </div>
    {/* Subtle golden glow at center */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/[0.05] rounded-full blur-[100px] pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 max-w-sm md:max-w-md w-full text-center mb-8"
    >
      <h2 className="font-cinzel text-2xl sm:text-3xl text-white mb-2 leading-tight">
        Você escolhe o lugar.<br />Nós fazemos as contas.
      </h2>
      <p className="font-inter text-white/50 text-xs">
        Cruzamos os dados exatos para calcular sua nova configuração.
      </p>
    </motion.div>

    {/* Data flow visualization */}
    <div className="relative z-10 w-full max-w-xs md:max-w-sm">
      {/* Input data points */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 backdrop-blur-sm shadow-xl">
        {dataPoints.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1), duration: 0.45 }}
            className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
          >
            <span className="font-inter text-white/40 text-[11px]">{d.label}</span>
            <span className="font-mono text-white/80 text-[11px]">{d.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Flow connector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-col items-center py-3"
      >
        <div className="w-px h-6 bg-gradient-to-b from-white/20 to-[#D4AF37]/50" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] border border-[#D4AF37]/60 my-1 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        />
        <div className="w-px h-6 bg-gradient-to-b from-[#D4AF37]/50 to-[#D4AF37]/10" />
      </motion.div>

      {/* Result */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-center p-5 border border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/10 to-[#D4AF37]/[0.02] rounded-xl backdrop-blur-md shadow-2xl"
      >
        <p className="font-mono text-[9px] text-[#D4AF37]/80 uppercase tracking-[0.3em] mb-1.5">Resultado</p>
        <p className="font-inter text-white text-[15px] font-medium">
          Revolução Solar em Tóquio
        </p>
        <p className="font-inter text-white/50 text-[11px] mt-1">
          Leitura completa dos próximos 12 meses
        </p>
      </motion.div>
    </div>
  </div>
);
