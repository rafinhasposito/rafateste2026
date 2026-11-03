import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const destinationExamples = [
  {
    id: 'tokyo',
    city: "Tóquio",
    house: "Ativação da Casa 10",
    tag: "Carreira, Destaque & Autoridade",
    subtitle: "A escolha ideal para sair dos bastidores e assumir o topo.",
    details: {
      paraQuem: "Influenciadores, artistas e empreendedores que buscam fama, viralização e sucesso.",
      beneficios: "Construção de autoridade, projeção de imagem e prestígio absoluto.",
      vidaReal: "Você para de ser um segredo bem guardado. O mercado te vê como referência, atraindo grandes contratos."
    },
    video: "/assets/tokyo.mp4"
  },
  {
    id: 'zurich',
    city: "Zurique",
    house: "Ativação da Casa 6",
    tag: "Mundo Fit, Rotina & Saúde",
    subtitle: "A escolha ideal para disciplina de ferro sem sofrimento.",
    details: {
      paraQuem: "Quem briga com a balança, fura a dieta ou sente que a rotina está uma bagunça.",
      beneficios: "Eficiência no trabalho, rotina blindada e foco extremo na saúde.",
      vidaReal: "Seu dia vira um relógio suíço: consistência para treinar, comer limpo e organizar a agenda."
    },
    video: "/assets/zurich.mp4"
  },
  {
    id: 'ny',
    city: "Nova York",
    house: "Ativação da Casa 3",
    tag: "Vendas, Comunicação & Negócios",
    subtitle: "A escolha ideal para fechar acordos e fazer o produto circular.",
    details: {
      paraQuem: "Vendedores, corretores e autônomos que precisam destravar a fala e bater metas.",
      beneficios: "Poder de convencimento, clareza nas negociações e networking rápido.",
      vidaReal: "Sua comunicação vira uma máquina de vendas. Feche negócios e faça seu produto circular."
    },
    video: "/assets/newyork.mp4"
  }
];

// ─── Desktop View ────────────────────────────────────────────────────────
const DesktopScreen2 = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden px-12 bg-[#030306]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A227]/5 via-[#030306] to-[#030306]" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-row items-center justify-between gap-8 xl:gap-12">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="w-[30%] flex flex-col justify-center pr-4"
        >
          <span className="inline-block font-ps-ui text-[10px] tracking-[0.3em] text-[#C9A227] uppercase mb-5 drop-shadow-md">
            A geografia recalcula o seu destino
          </span>
          <h2 className="font-ps-display text-4xl xl:text-5xl text-white mb-4 leading-[1.1]">
            Mesmo dia.<br />Mesma pessoa.
          </h2>
          <h3 className="font-ps-ui text-xl text-white/80 mb-6 font-medium">
            Resultados totalmente diferentes.
          </h3>
          <p className="font-ps-ui text-white/60 text-sm xl:text-base leading-relaxed mb-6">
            O lugar onde você comemora o seu aniversário define qual área da sua vida vai virar a chave nos próximos 12 meses.
          </p>
          <p className="font-ps-ui text-[#C9A227]/60 text-xs italic">
            (Passe o mouse nos destinos para ver a transformação em cada cidade)
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="w-[65%] h-[65vh] xl:h-[70vh] flex gap-4">
          {destinationExamples.map((dest) => {
            const isHovered = hoveredCard === dest.id;
            const isOtherHovered = hoveredCard !== null && hoveredCard !== dest.id;
            
            return (
              <motion.div
                key={dest.id}
                onMouseEnter={() => setHoveredCard(dest.id)}
                onMouseLeave={() => setHoveredCard(null)}
                animate={{
                  width: isHovered ? '65%' : hoveredCard ? '17.5%' : '33.33%',
                  opacity: isOtherHovered ? 0.6 : 1,
                  filter: isOtherHovered ? 'grayscale(50%) brightness(0.7)' : 'grayscale(0%) brightness(1)',
                }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                className="relative h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-crosshair bg-[#0A0A0F] flex flex-col"
              >
                {/* Video Header Area */}
                <motion.div
                  animate={{ height: isHovered ? '35%' : '100%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="relative w-full shrink-0 overflow-hidden"
                >
                  <video 
                    autoPlay loop muted playsInline preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "saturate(1.2) contrast(1.1)" }}
                  >
                    <source src={dest.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
                  
                  {/* Floating City Badge (Centered at the top) */}
                  <div className="absolute top-6 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full shadow-lg">
                      <span className="font-ps-ui text-white/90 text-xs font-bold uppercase tracking-[0.3em]">
                        {dest.city}
                      </span>
                    </div>
                  </div>

                  {/* Floating Title (Only visible when NOT hovered) */}
                  <motion.div 
                    animate={{ opacity: isHovered ? 0 : 1 }} 
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 p-6 xl:p-8 w-full flex flex-col justify-end text-center"
                  >
                    <h3 className="font-ps-display text-2xl xl:text-3xl text-white mb-2">{dest.house}</h3>
                    <span className="font-ps-ui text-[#C9A227] text-[10px] xl:text-xs font-bold uppercase tracking-[0.15em] drop-shadow-md">{dest.tag}</span>
                  </motion.div>
                </motion.div>
                
                {/* Solid Background Details Area (Visible only when hovered) */}
                <motion.div 
                  initial={false}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: isHovered ? 0.2 : 0 }}
                  className="flex-1 p-6 xl:p-8 pt-6 flex flex-col min-w-[320px] overflow-hidden"
                >
                  <h3 className="font-ps-display text-3xl xl:text-4xl text-white mb-1">{dest.house}</h3>
                  <span className="font-ps-ui text-[#C9A227] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">{dest.tag}</span>
                  
                  <p className="font-ps-ui text-white/90 text-xs xl:text-[13px] italic mb-3 leading-relaxed border-b border-white/10 pb-3">
                    "{dest.subtitle}"
                  </p>
                  
                  <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* HIGHLIGHT BOX: Para quem é */}
                    <div className="bg-[#C9A227]/10 border-l-2 border-[#C9A227] p-3 xl:p-4 rounded-r-md">
                      <span className="block font-ps-ui text-[#C9A227] text-[10px] xl:text-[11px] uppercase font-bold tracking-wider mb-1">Para quem é</span>
                      <span className="block font-ps-ui text-white text-xs xl:text-[13px] leading-snug">{dest.details.paraQuem}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xl:gap-4">
                      <div className="flex flex-col">
                        <span className="font-ps-ui text-white/40 text-[10px] xl:text-[11px] uppercase font-bold tracking-wider mb-1">Benefícios</span>
                        <span className="font-ps-ui text-white/80 text-[11px] xl:text-[12px] leading-snug">{dest.details.beneficios}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-ps-ui text-white/40 text-[10px] xl:text-[11px] uppercase font-bold tracking-wider mb-1">Na Vida Real</span>
                        <span className="font-ps-ui text-white/80 text-[11px] xl:text-[12px] leading-snug">{dest.details.vidaReal}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Mobile View ─────────────────────────────────────────────────────────
const MobileScreen2 = () => {
  // Começa como null para que o usuário veja todas as cidades empilhadas igualmente primeiro
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-start overflow-hidden bg-[#030306]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A227]/5 via-[#030306] to-[#030306]" />

      {/* Header */}
      <div className="relative z-20 pt-10 pb-4 px-6 text-center">
        <span className="inline-block font-ps-ui text-[9px] tracking-[0.2em] text-[#C9A227] uppercase mb-2 drop-shadow-md">
          A geografia recalcula o seu destino
        </span>
        <h2 className="font-ps-display text-2xl text-white mb-1 leading-tight">
          Mesmo dia. Mesma pessoa.
        </h2>
        <p className="font-ps-ui text-white/60 text-[11px] leading-relaxed max-w-[280px] mx-auto">
          Resultados totalmente diferentes dependendo da sua escolha.
        </p>
      </div>

      {/* Accordion Cards */}
      <div className="relative z-10 flex-1 flex flex-col gap-3 px-5 pb-24">
        {destinationExamples.map((dest) => {
          const isActive = activeCard === dest.id;
          
          return (
            <motion.div
              key={dest.id}
              onClick={() => setActiveCard(isActive ? null : dest.id)}
              animate={{ flex: isActive ? 4 : 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`relative rounded-2xl overflow-hidden border transition-colors duration-500 cursor-pointer flex-shrink-0 ${
                isActive ? 'border-white/20 shadow-2xl' : 'border-white/5 shadow-md'
              }`}
            >
              {/* Background Video */}
              <video 
                autoPlay loop muted playsInline preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-80' : 'opacity-40'}`}
                style={{ filter: "saturate(1.2) contrast(1.1)" }}
              >
                <source src={dest.video} type={dest.video.endsWith('mov') ? 'video/quicktime' : 'video/mp4'} />
                {dest.video.endsWith('mov') && <source src={dest.video} type="video/mp4" />}
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#030306]/80 via-[#030306]/40 to-[#030306]/80" />
              
              {/* Collapsed State: City and House centered */}
              <motion.div 
                animate={{ opacity: isActive ? 0 : 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span className="font-ps-display text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-lg">{dest.city}</span>
                <span className="font-ps-ui text-[#C9A227] text-[10px] font-bold uppercase tracking-[0.2em] mt-2 drop-shadow-md">{dest.house}</span>
                {!activeCard && (
                  <span className="font-ps-ui text-white/30 text-[8px] uppercase tracking-widest mt-4 border border-white/10 rounded-full px-3 py-1">
                    Toque para abrir
                  </span>
                )}
              </motion.div>

              {/* Expanded State: Content Panel */}
              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
              >
                <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col gap-3 pointer-events-auto">
                  
                  {/* Title & Tag */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-ps-display text-xl text-white">{dest.house}</h3>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-white/80 uppercase tracking-widest">{dest.city}</span>
                    </div>
                    <span className="font-ps-ui text-[#C9A227] text-[9px] font-bold uppercase tracking-[0.15em]">{dest.tag}</span>
                  </div>
                  
                  {/* Highlight Box: Para Quem É */}
                  <div className="bg-[#C9A227]/10 border-l-2 border-[#C9A227] p-2.5 rounded-r-md mt-1">
                    <span className="block font-ps-ui text-[#C9A227] text-[9px] uppercase font-bold tracking-widest mb-1">Para quem é</span>
                    <span className="block font-ps-ui text-white text-[11px] leading-snug">{dest.details.paraQuem}</span>
                  </div>

                  {/* Impact: Na Vida Real */}
                  <div className="flex flex-col">
                    <span className="font-ps-ui text-white/40 text-[9px] uppercase font-bold tracking-widest mb-0.5">Na Vida Real</span>
                    <span className="font-ps-ui text-white/80 text-[11px] leading-snug">{dest.details.vidaReal}</span>
                  </div>

                </div>
              </motion.div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Export ─────────────────────────────────────────────────────────
export const Screen2 = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full h-full">
      {isMobile ? <MobileScreen2 /> : <DesktopScreen2 />}
    </div>
  );
};
