import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, MapPin, Map, Plane } from 'lucide-react';

export default function CityStorytellingSandbox() {
  const color = "#10b981"; // Casa Dinheiro
  
  const cityName = "Tóquio, Japão";
  const cityDesc = "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. Tóquio pulsa com uma energia de disciplina e hiperprodutividade, criando o terreno magnético exato para quem precisa organizar a própria ambição e transformar metas dispersas em lucro previsível.";
  const userText = "Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico nesta cidade. Este objeto será o seu amuleto de ancoragem. Durante a transação, afirme mentalmente que aquele é o último investimento do seu antigo ciclo de escassez.";

  // Parallax Ref
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div className="min-h-screen bg-[#03100B] text-white p-5 md:p-10 font-sans overflow-x-hidden pb-40">
      <div className="max-w-6xl mx-auto space-y-40">
        
        <div className="text-center pt-10">
          <h1 className="text-4xl font-bold mb-4">Sandbox: Storytelling + Ritual</h1>
          <p className="text-white/60 max-w-2xl mx-auto">UX & Neurociência: Aterrando a experiência astrológica abstrata em um local físico e real antes de entregar a instrução prática.</p>
        </div>


        {/* =========================================
            OPÇÃO 1: EDITORIAL SPREAD (Estilo Revista)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 1: Editorial Spread (Metade Imagem / Metade Texto)</h2>
            <p className="text-white/50 text-sm mt-2">Um layout de revista de alto padrão. A foto da cidade domina uma das metades, puxando o olhar, enquanto a instrução desce de forma fluida.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center max-w-5xl mx-auto">
            {/* Esquerda: A Cidade */}
            <div className="w-full md:w-1/2 h-[600px] rounded-[40px] overflow-hidden relative border border-white/10 shadow-[0_20px_50px_rgba(16,185,129,0.15)]">
               <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop" alt="Tokyo" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
               
               <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-2 mb-3">
                     <MapPin className="w-5 h-5" style={{ color }} />
                     <span className="font-mono text-sm tracking-widest uppercase text-white/80">{cityName}</span>
                  </div>
                  <p className="text-white/90 text-lg font-light leading-relaxed">
                    {cityDesc}
                  </p>
               </div>
            </div>

            {/* Direita: O Ritual */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
               <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 mb-6 block" style={{ color }}>O Guia de Ancoragem</span>
               <h3 className="font-ps-display text-5xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
                 O Ritual 24 Horas.
               </h3>
               <p className="text-white/70 text-2xl font-light leading-relaxed">
                 {userText}
               </p>
            </div>
          </div>
        </section>


        {/* =========================================
            OPÇÃO 2: A JANELA IMERSIVA (Full Width Parallax + Glass Card)
            ========================================= */}
        <section ref={parallaxRef}>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 2: Janela Imersiva (Parallax + Glass Card)</h2>
            <p className="text-white/50 text-sm mt-2">A foto preenche 100% da largura criando um verdadeiro teletransporte. O ritual repousa sobre a cidade em uma placa de vidro fosco.</p>
          </div>

          <div className="w-full h-[800px] md:h-[700px] relative rounded-[40px] overflow-hidden flex items-end md:items-center justify-end border border-white/10 group">
            {/* Background Parallax */}
            <motion.div 
              style={{ y }}
              className="absolute -inset-[20%] w-[140%] h-[140%] bg-cover bg-center"
              // Usando um overlay escurecido sobre a imagem
            >
               <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop" alt="Tokyo" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Overlay Gradiente para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03100B] md:bg-gradient-to-l md:from-[#03100B] via-[#03100B]/60 to-transparent"></div>

            {/* Content Plate (Direita) */}
            <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16 flex flex-col">
              
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" style={{ color }} />
                    <span className="font-mono text-sm tracking-widest uppercase text-white/80">{cityName}</span>
                </div>
                <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20" style={{ backgroundColor: color }}></div>
                
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 mb-4 block">O Guia de Ancoragem</span>
                <h3 className="font-ps-display text-3xl font-bold text-white mb-6">O Ritual 24H</h3>
                <p className="text-white/90 text-xl md:text-2xl font-light leading-relaxed">
                  {userText}
                </p>
              </div>

            </div>
            
          </div>
        </section>


        {/* =========================================
            OPÇÃO 3: O DESTINATION CARD (O Monolito)
            ========================================= */}
        <section>
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-bold text-[#10b981]">OPÇÃO 3: O Cartão de Destino (Monolito)</h2>
            <p className="text-white/50 text-sm mt-2">Um card gigante e elegante ao centro. O topo traz a atmosfera, e a parte inferior detalha o ritual de ativação.</p>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-3xl bg-[#0a0a0a] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Metade Superior: A Cidade */}
              <div className="h-[350px] relative">
                 <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop" alt="Tokyo" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                 
                 <div className="absolute bottom-8 left-10 pr-10">
                    <h3 className="font-ps-display text-5xl font-bold text-white mb-4 drop-shadow-lg">{cityName}</h3>
                    <p className="text-white/80 text-lg font-light leading-relaxed drop-shadow-md">
                      {cityDesc}
                    </p>
                 </div>
              </div>

              {/* Metade Inferior: O Ritual */}
              <div className="p-10 relative">
                <div className="absolute top-0 right-10 w-40 h-40 blur-[80px] opacity-10" style={{ backgroundColor: color }}></div>
                
                <div className="flex items-center gap-3 mb-6">
                   <Sparkles className="w-5 h-5" style={{ color }} />
                   <span className="font-mono text-xs tracking-widest text-white/50 uppercase">O Guia de Ancoragem (24H)</span>
                </div>
                
                <p className="text-white/90 text-2xl font-light leading-relaxed relative z-10">
                  {userText}
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
