import { motion } from 'framer-motion';

const previewAreas = [
  { area: 'Dinheiro', text: 'Novas oportunidades profissionais.', accent: false },
  { area: 'Amor', text: 'Equilíbrio entre relação e carreira.', accent: false },
  { area: 'Trabalho', text: 'Reconhecimento e autoridade.', accent: true },
  { area: 'Vida pessoal', text: 'Metas e direção ganham peso.', accent: false },
];

/**
 * Tela 6 — O que eu recebo?
 * O fundo é abstrato/noturno para destacar o Card que contém a imagem da cidade.
 */
export const Screen6 = () => (
  <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden bg-[#030306]">
    {/* Abstract starry background */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#080A14] to-[#030306]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />
    <div className="absolute inset-0 pointer-events-none opacity-50">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() }}
        />
      ))}
    </div>

    {/* Content */}
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 pt-16 pb-28">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 className="font-cinzel text-2xl sm:text-3xl text-white leading-tight">
          Agora imagine descobrir o seu.
        </h2>
      </motion.div>

      {/* Product preview card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#08090F]/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Header with city photo strip */}
        <div className="relative h-28 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            alt="Tóquio skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090F] via-[#08090F]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-cinzel text-xl text-white mb-0.5">Tóquio, Japão</h3>
            <p className="font-mono text-[9px] text-white/50 tracking-widest">35.6762° N · 139.6503° E</p>
          </div>
        </div>

        {/* Main highlight */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <p className="font-inter text-[#D4AF37] text-[10px] font-semibold tracking-[0.15em] uppercase">
              Casa 10 em destaque
            </p>
          </div>
          <p className="font-inter text-white/80 text-[13px] font-light leading-relaxed">
            Carreira, visibilidade e construção profissional entre os principais temas do seu próximo ano neste destino.
          </p>
        </div>

        {/* Area previews */}
        <div className="px-4 pb-4">
          <div className="border-t border-white/[0.05] pt-4 space-y-3">
            {previewAreas.map((row) => (
              <div key={row.area} className="flex items-start gap-3">
                <span className={`font-inter text-[9px] uppercase tracking-widest mt-0.5 w-20 shrink-0 ${
                  row.accent ? 'text-[#D4AF37]/80' : 'text-white/30'
                }`}>
                  {row.area}
                </span>
                <p className={`font-inter text-[11px] leading-snug ${
                  row.accent ? 'text-white' : 'text-white/60'
                }`}>
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Blurred bottom */}
        <div className="h-10 bg-gradient-to-t from-[#08090F] to-transparent relative flex items-center justify-center">
          <div className="absolute inset-x-4 top-0 border-t border-white/[0.03]" />
          <p className="font-inter text-white/25 text-[10px]">+ mais áreas analisadas</p>
        </div>
      </motion.div>
    </div>
  </div>
);
