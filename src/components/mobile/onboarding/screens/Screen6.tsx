import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Tela 6 — O que eu recebo? / Fechamento
 * O usuário vê um mockup de alta qualidade (Roma) e o CTA final.
 */
export const Screen6 = ({ onComplete }: { onComplete?: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [romeVideoPlaying, setRomeVideoPlaying] = useState(false);

  return (
    <div className="relative w-full min-h-[100svh] flex flex-col items-center justify-start lg:justify-center bg-[#030306]">
      
      {/* Abstract starry background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#080A14] to-[#030306]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A227]/[0.03] via-transparent to-transparent" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-8 lg:px-12 pt-20 pb-32 lg:pt-28 lg:pb-12 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] items-center gap-6 lg:gap-12">
        
        {/* Left Column: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full min-w-0 text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <span className="inline-block font-ps-ui text-[10px] md:text-[11px] tracking-[0.3em] text-[#C9A227] uppercase mb-5 drop-shadow-md">
            O Seu Mapa de Virada de Chave
          </span>
          
          <h2 className="font-ps-display text-3xl md:text-5xl xl:text-6xl text-white mb-6 leading-[1.1] drop-shadow-lg">
            Você está a um clique de gerar a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C9A227] to-[#C9A227]/70">
              análise exata
            </span>{' '}
            para o seu próximo aniversário.
          </h2>
          
          <p className="font-ps-ui text-white/60 text-sm md:text-lg leading-relaxed lg:mb-10 max-w-md mx-auto lg:mx-0">
            Veja a prévia de como o seu relatório estratégico de 365 dias será entregue.
          </p>

          <div className="hidden lg:block w-full mt-4">
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center bg-[#C9A227] text-[#02050A] hover:bg-[#E5C158] font-ps-display text-sm font-bold uppercase tracking-widest px-8 py-5 rounded-full shadow-[0_10px_36px_rgba(201,162,39,0.35)] transition-all duration-300 w-auto mb-4"
            >
              <span className="relative z-10">Revelar o Destino do Meu Aniversário</span>
              <div className="absolute inset-0 rounded-full border border-[#F5DE98]/40 scale-105 group-hover:scale-110 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
            </motion.button>

            {/* Trust Badge */}
            <p className="font-ps-ui text-white/40 text-xs italic flex items-center justify-start gap-2">
              <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Precisão astronômica calculada para a sua data e hora exata.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Premium Rome Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
          className="w-full min-w-0 max-w-2xl flex flex-col items-center justify-center mx-auto"
        >
          <div className="relative w-full bg-[#08090F]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
            
            {/* Subtle Glow Behind Card */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#C9A227]/20 to-transparent opacity-30 rounded-2xl blur-md pointer-events-none" />

            {/* Header with Instant Preloaded Rome Photo + Progressive Video Crossfade */}
            <div className="relative w-full h-36 sm:h-auto sm:aspect-[2.7/1] overflow-hidden border-b border-white/[0.05] bg-[#0B0E17]">
              <img
                src="/images/abertura/roma.jpg"
                alt="Roma, Itália"
                loading="eager"
                decoding="sync"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
                style={{ filter: "saturate(1.2) contrast(1.1)" }}
              />
              <video 
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onPlaying={() => setRomeVideoPlaying(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  romeVideoPlaying ? 'opacity-75' : 'opacity-0'
                }`}
                style={{ filter: "saturate(1.2) contrast(1.1)" }}
              >
                <source src="/assets/roma.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090F] via-[#08090F]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="font-ps-display text-3xl md:text-4xl text-white mb-1 drop-shadow-md">Roma, Itália</h3>
                <p className="font-mono text-[10px] md:text-xs text-white/50 tracking-widest drop-shadow">41.9028° N · 12.4964° E</p>
              </div>
            </div>

            {/* Main highlight */}
            <div className="px-5 pt-6 pb-4 md:px-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                <p className="font-ps-ui text-[#C9A227] text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase">
                  Casa 7 em Destaque
                </p>
              </div>
              <h4 className="font-ps-display text-white text-xl md:text-2xl leading-snug">
                O destino exato para ativar a Casa 7 e destravar a sua vida amorosa.
              </h4>
            </div>

            {/* Mobile Accordion Trigger */}
            <button type="button" aria-expanded={isExpanded} aria-controls="previa-roma"
              className="w-full lg:hidden flex items-center justify-between px-5 py-4 border-y border-white/[0.05] cursor-pointer bg-white/[0.02]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="font-ps-ui text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Ver prévia das mudanças</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-white/50" />
              </motion.div>
            </button>

            {/* High-Impact Area Previews */}
            <motion.div id="previa-roma"
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              className="overflow-hidden lg:!h-auto lg:!opacity-100"
            >
              <div className="px-5 pb-6 pt-4 lg:pt-0 md:px-7">
                <div className="grid sm:grid-cols-2 gap-3">
                  
                  <div className="bg-white/[0.02] border border-white/[0.05] p-4 md:p-5 rounded-xl">
                    <h5 className="font-ps-ui text-white/90 text-[13px] md:text-[14px] font-bold uppercase tracking-widest mb-1.5">
                      Encontro de Almas
                    </h5>
                    <p className="font-ps-ui text-white/60 text-[13px] md:text-[14px] leading-relaxed">
                      A energia da Casa 7 acaba com as relações rasas, atraindo o parceiro de vida ideal e oficializando casamentos.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-[#C9A227]/20 p-4 md:p-5 rounded-xl">
                    <h5 className="font-ps-ui text-[#C9A227] text-[13px] md:text-[14px] font-bold uppercase tracking-widest mb-1.5">
                      A Força da União
                    </h5>
                    <p className="font-ps-ui text-white/60 text-[13px] md:text-[14px] leading-relaxed">
                      Porque a Casa 7 rege as alianças de alto valor. Ao ativar esta casa no seu aniversário, você constrói uma vida próspera a dois.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Blurred bottom */}
            <div className="h-14 bg-gradient-to-t from-[#030306] to-transparent relative flex items-center justify-center">
              <div className="absolute inset-x-6 top-0 border-t border-white/[0.03]" />
              <p className="font-ps-ui text-white/30 text-[10px] md:text-xs italic tracking-wide">
                + 8 Áreas detalhadas no relatório completo
              </p>
            </div>
          </div>
          
          {/* Mobile Trust Badge placed directly below card */}
          <div className="lg:hidden mt-6 text-center w-full">
            <p className="font-ps-ui text-white/40 text-[10px] italic flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Precisão calculada para seus dados exatos.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
