import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Option3Refinements() {
  const color = "#10b981"; // Casa Dinheiro
  const cityName = "Tóquio, Japão";
  const cityDesc = "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. O terreno magnético exato para quem precisa transformar metas dispersas em lucro previsível.";
  const ritualText = "Compre um item simbólico de alto valor percebido usando dinheiro físico. Durante a transação, afirme mentalmente que aquele é o último investimento do seu ciclo de escassez.";

  const imgUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#03100B] text-white font-sans overflow-x-hidden pb-40">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="text-center pt-20 pb-20">
          <h1 className="text-4xl font-bold mb-4">Refinando o Painel Lateral (Split)</h1>
          <p className="text-white/60 max-w-2xl mx-auto">Você tem razão. A apresentação do texto e a divisão do vidro podiam ficar mais elegantes. Criei 3 evoluções desse exato layout para focar na leitura e na hierarquia.</p>
        </div>
      </div>

      {/* =========================================
          REFINAMENTO 1: PUREZA TIPOGRÁFICA (Sem caixas internas)
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">R1: Pureza Tipográfica (Zero Caixas Internas)</h2>
          <p className="text-white/50 text-sm mt-2">Removi a "caixinha" de dentro do painel. A divisão entre a cidade e o ritual agora é feita inteiramente por espaço em branco e uma linha sutil (estilo Apple Spec Sheet).</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="w-full h-[700px] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex justify-end">
            
            <div className="absolute inset-0 left-0 w-[60%]">
              <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#03100B]/50 to-[#03100B]"></div>
            </div>

            {/* Painel Lateral (Pure Text) */}
            <div className="relative z-10 w-full md:w-[45%] h-full bg-[#03100B]/80 backdrop-blur-3xl border-l border-white/5 p-12 md:p-20 flex flex-col justify-center">
              
              {/* Bloco da Cidade */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5" style={{ color }} />
                    <span className="font-mono text-xs tracking-widest uppercase text-white/70">O Destino</span>
                </div>
                <h3 className="font-ps-display text-5xl font-bold text-white mb-6 leading-tight">{cityName}</h3>
                <p className="text-white/70 text-xl font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              {/* Divisória Sutil */}
              <div className="w-full h-px bg-white/10 my-8"></div>

              {/* Bloco do Ritual */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                     <Sparkles className="w-4 h-4" style={{ color }} />
                   </div>
                   <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block">O Guia de Ancoragem (24H)</span>
                </div>
                
                <p className="text-white text-2xl font-light leading-relaxed">
                  {ritualText}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          REFINAMENTO 2: O CARTÃO FLUTUANTE (Overlap 3D)
          ========================================= */}
      <section className="mb-40">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">R2: O Cartão Flutuante (Overlap 3D)</h2>
          <p className="text-white/50 text-sm mt-2">Em vez de cortar a tela ao meio, a foto da cidade domina 100% do fundo, e o painel lateral é um cartão flutuante que não encosta nas bordas, gerando profundidade.</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="w-full h-[700px] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-end p-8">
            
            <div className="absolute inset-0">
              <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Floating Side Panel */}
            <div className="relative z-10 w-full md:w-[45%] h-full max-h-[600px] bg-black/60 backdrop-blur-[40px] border border-white/20 rounded-[32px] p-12 flex flex-col justify-between shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
              
              <div>
                <h3 className="font-ps-display text-4xl font-bold text-white mb-4">{cityName}</h3>
                <p className="text-white/70 text-lg font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-2xl mt-10">
                <div className="bg-black/60 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 block mb-4">O Ritual de 24 Horas</span>
                  <p className="text-white/90 text-xl font-light leading-relaxed">
                    {ritualText}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          REFINAMENTO 3: TRANSIÇÃO INVISÍVEL (Seamless Fade)
          ========================================= */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-10 mb-8">
          <h2 className="text-2xl font-bold text-[#10b981]">R3: Transição Invisível (Seamless Fade)</h2>
          <p className="text-white/50 text-sm mt-2">Elimina as bordas de vidro. A imagem simplesmente "derrete" para um fundo preto liso no lado direito, onde o texto brilha com máximo contraste.</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="w-full h-[700px] relative rounded-[40px] overflow-hidden border border-white/5 bg-[#03100B] flex justify-end">
            
            {/* Imagem com Fade */}
            <div className="absolute inset-0 left-0 w-[70%]">
              <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-80" />
              {/* Fade brutal da esquerda pra direita */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#03100B]/80 to-[#03100B]"></div>
            </div>

            {/* Painel Textual sem vidro, apenas fundo sólido e tipografia */}
            <div className="relative z-10 w-full md:w-[40%] h-full p-12 md:p-16 flex flex-col justify-center bg-transparent">
              
              <div className="mb-16">
                <span className="font-mono text-sm tracking-widest uppercase text-white/50 mb-4 block" style={{ color }}>{cityName}</span>
                <p className="text-white/80 text-2xl font-light leading-relaxed">
                  {cityDesc}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                     <CheckCircle2 className="w-5 h-5" style={{ color }} />
                   </div>
                   <h3 className="font-ps-display text-3xl font-bold text-white">O Ritual</h3>
                </div>
                
                <p className="text-white/60 text-xl font-light leading-relaxed pl-14">
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
