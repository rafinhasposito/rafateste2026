import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Plane, Fingerprint, QrCode } from 'lucide-react';

export default function TheRealFlowSandbox() {
  const color = "#10b981"; // Casa Dinheiro
  const cityName = "Tóquio, Japão";
  const cityDesc = "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. Tóquio pulsa com uma energia de disciplina e hiperprodutividade, criando o terreno magnético exato para quem precisa organizar a própria ambição e transformar metas dispersas em lucro previsível.";
  
  const ritualText = "Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto de ancoragem. Durante a transação, afirme mentalmente que aquele é o último investimento do seu antigo ciclo de escassez.";
  const mantraText = "Eu sei o valor do meu trabalho, cuido bem das minhas contas e faço meu dinheiro render.";

  const imgUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop";

  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div className="min-h-screen bg-[#03100B] text-white font-sans overflow-x-hidden pb-40">
      
      <div className="max-w-4xl mx-auto px-5 pt-20 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">O Meu Fracasso (E a Correção)</h1>
        <p className="text-white/60">Eu finalmente entendi: você não odiou o Ticket (Apple Wallet). Você odiou que ele apareceu "do nada". A neurociência exigia que você visse a cidade PRIMEIRO, e depois recebesse o ingresso. Aqui está o fluxo contínuo.</p>
      </div>

      {/* PARTE 1: A CHEGADA (Storytelling da Cidade) */}
      <div ref={parallaxRef} className="w-full max-w-5xl mx-auto h-[600px] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-24">
        <motion.div style={{ y }} className="absolute -inset-[20%] w-[140%] h-[140%] left-0">
          <img src={imgUrl} alt="Tokyo" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        {/* Degradê de proteção de leitura */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03100B] via-[#03100B]/40 to-transparent"></div>

        {/* Texto da Cidade (Ancoragem visual) */}
        <div className="absolute bottom-0 left-0 w-full p-12 md:p-16">
          <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" style={{ color }} />
              <span className="font-mono text-xs tracking-widest uppercase text-white/80">Estar na Cidade</span>
          </div>
          <h2 className="font-ps-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl">{cityName}</h2>
          <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed max-w-3xl drop-shadow-md">
            {cityDesc}
          </p>
        </div>
      </div>

      {/* PARTE 2: A ENTREGA DO RITUAL (O Ticket Apple Wallet) */}
      <div className="w-full max-w-2xl mx-auto relative z-10 -mt-32">
        
        <div className="w-full bg-[#0a0a0a] rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
          {/* Topo do Ticket */}
          <div className="h-32 relative flex items-center px-10 border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }}></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[40px]" style={{ backgroundColor: color }}></div>
            <div className="relative z-10 flex items-center justify-between w-full">
              <div>
                <span className="font-mono text-xs tracking-widest text-white/70 uppercase">O Guia de Ancoragem</span>
                <h3 className="text-3xl font-bold text-white mt-1">Ritual 24H</h3>
              </div>
              <Plane className="w-8 h-8 text-white/50" />
            </div>
          </div>

          {/* Corpo do Ticket */}
          <div className="p-10 pb-16 flex flex-col relative">
            {/* Linha pontilhada */}
            <div className="absolute top-0 left-0 w-full flex justify-between -mt-[16px]">
              <div className="w-8 h-8 rounded-full bg-[#03100B] border-r border-b border-white/10 -ml-4"></div>
              <div className="flex-1 border-t-2 border-dashed border-white/10 mt-[15px] mx-2"></div>
              <div className="w-8 h-8 rounded-full bg-[#03100B] border-l border-b border-white/10 -mr-4"></div>
            </div>

            <div className="mt-8">
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase block mb-6">Ação Prática</span>
              <p className="text-white/90 text-2xl font-light leading-relaxed">
                {ritualText}
              </p>
            </div>

            <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase block mb-3">O Mantra de Ativação</span>
              <p className="text-white/80 text-lg font-serif italic">
                "{mantraText}"
              </p>
            </div>

            <div className="mt-12 flex items-end justify-between border-t border-white/5 pt-8">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase block mb-2">Protocolo Desbloqueado</span>
                <Fingerprint className="w-10 h-10 text-white/20" />
              </div>
              <QrCode className="w-16 h-16" style={{ color }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
