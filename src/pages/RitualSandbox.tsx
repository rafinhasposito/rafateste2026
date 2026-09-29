import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, QrCode, Plane, Fingerprint, Lock } from 'lucide-react';

export default function RitualSandbox() {
  const color = "#10b981"; // Casa Dinheiro
  
  const userText = "Mande mensagem para 3 pessoas que te inspiram ou com quem você quer criar laços. Desenhe um plano para o seu maior sonho de vida de longo prazo.";

  // Parallax Ref
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div className="min-h-screen bg-[#03100B] text-white p-5 md:p-10 font-sans overflow-x-hidden pb-40">
      <div className="max-w-5xl mx-auto space-y-40">
        
        <div className="text-center pt-10">
          <h1 className="text-4xl font-bold mb-4">Sandbox: O Ritual (Estética Apple / Anti-PDF)</h1>
          <p className="text-white/60 max-w-2xl mx-auto">Você tem toda razão. Se o Bloco 3 já é "só texto", o Bloco 4 precisa ser uma quebra visual. Aqui estão 3 formas de transformar o texto em uma experiência visual.</p>
        </div>


        {/* =========================================
            OPÇÃO 1: O TICKET TÁTIL (Estilo Apple Wallet)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 1: O Passe de Embarque (Tátil)</h2>
            <p className="text-white/50 text-sm mt-2">Em vez de parecer um parágrafo de texto, parece um objeto físico/ingresso exclusivo que você destravou.</p>
          </div>

          <div className="flex justify-center">
            {/* O Ticket */}
            <div className="w-full max-w-2xl bg-black rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Topo do Ticket */}
              <div className="h-32 relative flex items-center px-10 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }}></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[40px]" style={{ backgroundColor: color }}></div>
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div>
                    <span className="font-mono text-xs tracking-widest text-white/70 uppercase">O Guia de Ancoragem</span>
                    <h3 className="text-3xl font-bold text-white mt-1">O Ritual 24H</h3>
                  </div>
                  <Plane className="w-8 h-8 text-white/50" />
                </div>
              </div>

              {/* Corpo do Ticket */}
              <div className="p-10 pb-16 flex flex-col relative">
                {/* Linha pontilhada (picote) */}
                <div className="absolute top-0 left-0 w-full flex justify-between -mt-[16px]">
                  <div className="w-8 h-8 rounded-full bg-[#03100B] border-r border-b border-white/10 -ml-4"></div>
                  <div className="flex-1 border-t-2 border-dashed border-white/10 mt-[15px] mx-2"></div>
                  <div className="w-8 h-8 rounded-full bg-[#03100B] border-l border-b border-white/10 -mr-4"></div>
                </div>

                <div className="mt-8">
                  <p className="text-white/80 text-2xl font-light leading-relaxed">
                    {userText}
                  </p>
                </div>

                <div className="mt-16 flex items-end justify-between border-t border-white/5 pt-8">
                  <div>
                    <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase block mb-2">Protocolo Desbloqueado</span>
                    <Fingerprint className="w-10 h-10 text-white/20" />
                  </div>
                  <QrCode className="w-16 h-16" style={{ color: color }} />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
            OPÇÃO 2: O RESPIRO IMERSIVO (Parallax Cinematic)
            ========================================= */}
        <section ref={parallaxRef}>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 2: A Quebra Cinematográfica (Parallax)</h2>
            <p className="text-white/50 text-sm mt-2">Um respiro visual. Corta o fundo preto com uma textura ou gradiente em movimento para "limpar" a vista do usuário.</p>
          </div>

          <div className="w-full h-[600px] relative rounded-[40px] overflow-hidden flex items-center justify-center border border-white/10 group">
            {/* Background Parallax */}
            <motion.div 
              style={{ y }}
              className="absolute -inset-[20%] w-[140%] h-[140%] bg-cover bg-center opacity-40 mix-blend-screen"
            >
              {/* Simulando um mesh/glow gigante */}
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: color }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900 rounded-full blur-[150px]"></div>
            </motion.div>

            {/* Content Plate */}
            <div className="relative z-10 max-w-3xl text-center px-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4" style={{ color: color }} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/70">O Guia de Ancoragem</span>
              </div>
              
              <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tighter mb-8 text-white drop-shadow-2xl">
                O Ritual das 24 Horas
              </h2>
              
              <p className="text-white/90 text-2xl md:text-3xl font-light leading-snug drop-shadow-2xl">
                {userText}
              </p>
            </div>
            
            {/* Overlay Glass */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 pointer-events-none"></div>
          </div>
        </section>


        {/* =========================================
            OPÇÃO 3: O DISPLAY INTERATIVO (Dynamic Island Style)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 3: O Display Dinâmico (Anti-Rolagem)</h2>
            <p className="text-white/50 text-sm mt-2">Em vez de um parágrafo solto, o texto fica encapsulado numa "cápsula" super premium inspirada no iOS.</p>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-[50px] p-4 border border-white/5 shadow-2xl relative">
              <div className="absolute inset-0 rounded-[50px] overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12"></div>
              </div>

              <div className="bg-[#111] rounded-[40px] p-12 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10" style={{ backgroundColor: color }}></div>
                
                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-between">
                  <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-[28px] bg-black border border-white/10 relative z-10" style={{ boxShadow: `0 10px 30px ${color}20` }}>
                    <Lock className="w-10 h-10" style={{ color: color }} />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left relative z-10">
                    <span className="font-mono text-sm tracking-widest text-white/40 uppercase mb-2 block">O Guia de Ancoragem</span>
                    <h3 className="font-ps-display text-4xl font-bold text-white mb-6">O Ritual 24H</h3>
                    <p className="text-white/70 text-2xl font-light leading-relaxed">
                      {userText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
