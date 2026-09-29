import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export default function CitySandboxParallax() {
  const color = "#10b981"; // Casa Dinheiro
  const cityName = "Tóquio, Japão";
  const cityDesc = "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. O terreno magnético exato para quem precisa transformar metas dispersas em lucro previsível.";
  const ritualText = "Compre um item simbólico de alto valor percebido usando dinheiro físico. Durante a transação, afirme mentalmente que aquele é o último investimento do seu ciclo de escassez.";

  // Parallax Refs
  const ref1 = useRef(null);
  const { scrollYProgress: scroll1 } = useScroll({ target: ref1, offset: ["start end", "end start"] });
  const y1 = useTransform(scroll1, [0, 1], ["-15%", "15%"]);

  const ref2 = useRef(null);
  const { scrollYProgress: scroll2 } = useScroll({ target: ref2, offset: ["start end", "end start"] });
  const y2 = useTransform(scroll2, [0, 1], ["-15%", "15%"]);

  const ref3 = useRef(null);
  const { scrollYProgress: scroll3 } = useScroll({ target: ref3, offset: ["start end", "end start"] });
  const y3 = useTransform(scroll3, [0, 1], ["-15%", "15%"]);

  const imgUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#03100B] text-white font-sans overflow-x-hidden pb-40">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="text-center pt-20 pb-20">
          <h1 className="text-4xl font-bold mb-4">Sandbox: A Janela Imersiva (V2)</h1>
          <p className="text-white/60 max-w-2xl mx-auto">Você tem um olho treinado. A execução anterior ficou espremida e com contraste ruim. Aqui estão 3 novas execuções do conceito "Parallax + Glass Card", polidas com nível Apple.</p>
        </div>
      </div>

      {/* =========================================
          VERSÃO 1: EDGE-TO-EDGE COM BOTTOM CARD
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">V1: Edge-to-Edge (Full Bleed)</h2>
          <p className="text-white/50 text-sm mt-2">A foto quebra a margem do site e vai de ponta a ponta na tela. O card de vidro repousa na parte inferior, ancorando a leitura.</p>
        </div>

        {/* Quebra o container para ocupar 100vw */}
        <div ref={ref1} className="w-full h-[80vh] min-h-[600px] relative overflow-hidden border-y border-white/10 group">
          <motion.div style={{ y: y1 }} className="absolute -inset-[20%] w-[140%] h-[140%]">
            <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-80" />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#03100B] via-transparent to-black/40"></div>

          <div className="absolute bottom-0 left-0 w-full p-5 md:p-10 flex justify-center">
            <div className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl border border-white/20 rounded-[32px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col md:flex-row gap-10 items-center">
              
              <div className="md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-10">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" style={{ color }} />
                    <span className="font-mono text-xs tracking-widest uppercase text-white">{cityName}</span>
                </div>
                <p className="text-white/70 text-base font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              <div className="md:w-2/3 flex flex-col gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block" style={{ color }}>O Ritual 24H</span>
                <h3 className="font-ps-display text-2xl md:text-4xl font-bold text-white tracking-tight leading-snug">
                  "{ritualText}"
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          VERSÃO 2: SPATIAL COMPUTING (Vision Pro Center)
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">V2: Visão Espacial (Center Glass)</h2>
          <p className="text-white/50 text-sm mt-2">Mantém a foto contida num formato widescreen de luxo, com um card de altíssimo desfoque flutuando exatamente no centro, como uma interface holográfica.</p>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div ref={ref2} className="w-full h-[700px] relative rounded-[60px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
            
            <motion.div style={{ y: y2 }} className="absolute -inset-[20%] w-[140%] h-[140%]">
              <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-60" />
            </motion.div>
            
            {/* Um mesh gradient pra dar o tom "astrológico" em cima da foto */}
            <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}></div>
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Glass Card Central */}
            <div className="relative z-10 w-[90%] max-w-3xl bg-white/5 backdrop-blur-[60px] border border-white/20 rounded-[40px] p-10 md:p-16 flex flex-col items-center text-center shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 blur-[50px] opacity-20" style={{ backgroundColor: color }}></div>
              
              <div className="flex items-center gap-2 mb-8 px-4 py-1.5 bg-black/40 rounded-full border border-white/10">
                  <MapPin className="w-4 h-4" style={{ color }} />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-white">{cityName}</span>
              </div>
              
              <p className="text-white/80 text-xl font-light leading-relaxed mb-10 max-w-xl">
                {cityDesc}
              </p>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10"></div>

              <div className="flex flex-col items-center gap-4">
                <Sparkles className="w-6 h-6" style={{ color }} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">O Guia de Ancoragem</span>
                <h3 className="font-ps-display text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-2xl mt-2">
                  {ritualText}
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          VERSÃO 3: O PAINEL LATERAL (Split Imersivo)
          ========================================= */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">V3: O Painel Lateral (Split)</h2>
          <p className="text-white/50 text-sm mt-2">A foto da cidade domina 100% da tela, mas um elegante painel de vidro vertical "nasce" na lateral direita para abrigar a leitura.</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div ref={ref3} className="w-full h-[700px] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex justify-end">
            
            <motion.div style={{ y: y3 }} className="absolute -inset-[20%] w-[140%] h-[140%] left-0">
              <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-90" />
            </motion.div>
            
            {/* Gradiente sutil protegendo a esquerda */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#03100B]/80 via-transparent to-transparent"></div>

            {/* Painel Lateral Direito */}
            <div className="relative z-10 w-full md:w-[45%] h-full bg-[#03100B]/70 backdrop-blur-2xl border-l border-white/10 p-10 md:p-16 flex flex-col justify-center">
              
              <div className="mb-12">
                <h3 className="font-ps-display text-5xl font-bold text-white mb-4">{cityName}</h3>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30" style={{ backgroundColor: color }}></div>
                
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color }}>O Ritual de 24 Horas</span>
                <p className="text-white/90 text-xl font-light leading-relaxed relative z-10">
                  {ritualText}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
