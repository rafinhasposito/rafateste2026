import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Target, Compass, CheckCircle2 } from 'lucide-react';

const mockData = {
  city: "TÓQUIO, JAPÃO",
  house: 2,
  intention: "DINHEIRO E PROSPERIDADE",
  img: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80",
  desc: "A energia dessa cidade foca direto na sua estabilidade e na sua segurança financeira.",
  objetivo: "É o destino perfeito pra quando a prioridade do seu ciclo é organizar a vida financeira, juntar dinheiro e construir uma base sólida pra pisar em terreno firme.",
  beneficios: "O ambiente ajuda você a enxergar com clareza o valor real do seu tempo e dos seus talentos, acabando de vez com aquela mania de dar desconto por vergonha.",
  vidaReal: "Na prática, o dia a dia aqui te ensina a ter pé no chão e juízo com cada centavo. A vibe da cidade facilita a arrumação das contas, o reajuste de preços e o fim dos gastos bobos. Não tem mágica nem sorte cega, mas sim um ambiente que joga junto pra você criar reservas e viver com tranquilidade.",
  tema: "Organização, Caixa Forte e Estabilidade",
  segredo: "Na CASA 2, a energia do seu aniversário se conecta com a necessidade de segurança material. A vibração dessa cidade ajuda você a enxergar onde tá perdendo grana e a tomar decisões financeiras mais inteligentes sem complicação.",
  ritual: [
    "Abra seus aplicativos de banco e organize suas contas no minuto exato do seu aniversário.",
    "Pense com firmeza: 'Eu cuido bem do meu dinheiro, valorizo meu trabalho e construo uma vida financeira estável.'",
    "Faça um investimento ou guarde uma quantia consciente na sua conta pra marcar o compromisso com sua prosperidade."
  ],
  color: "#C9A227"
};

export default function DossierSandbox() {
  return (
    <div className="min-h-screen bg-[#030306] text-white overflow-y-auto overflow-x-hidden font-sans">
      
      {/* Header Info */}
      <div className="w-full bg-black/80 py-10 text-center border-b border-white/10">
        <h1 className="font-ps-display text-4xl mb-4">Sandbox: 3 Opções de Layout do Dossiê</h1>
        <p className="text-white/60">A ordem de atenção foi invertida (Cidade &gt; Casa &gt; Descrição). A label 'Para Quem É' virou 'Objetivo'.</p>
      </div>

      {/* =========================================================================
          OPÇÃO 1: CINEMATIC BENTO GRID (Evolução do atual com imagem descortinada)
          ========================================================================= */}
      <div className="py-24 border-b border-white/10">
        <div className="text-center mb-16">
          <h2 className="font-ps-display text-3xl text-[#C9A227]">OPÇÃO 1: Cinematic Bento Grid</h2>
          <p className="text-white/50">Imagem panorâmica inteira (sem cortes agressivos) no topo + Bento Grid organizado abaixo.</p>
        </div>

        <div className="w-full max-w-[1400px] mx-auto relative px-4 md:px-8">
          {/* O Header com Imagem Panorâmica */}
          <div className="w-full h-[50vh] min-h-[400px] md:h-[65vh] rounded-[40px] overflow-hidden relative shadow-2xl mb-8 border border-white/10">
            <img src={mockData.img} alt={mockData.city} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/40 to-transparent"></div>
            
            <div className="absolute bottom-12 left-8 md:bottom-16 md:left-16 z-10 flex flex-col">
              {/* Hierarquia invertida: Cidade gigante, Casa menor */}
              <h1 className="font-ps-display text-6xl md:text-8xl text-white mb-2 tracking-tight drop-shadow-2xl">
                {mockData.city}
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-ps-ui text-lg md:text-2xl text-[#C9A227] italic font-light drop-shadow-md">
                  Ativação da Casa {mockData.house}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>
                <span className="font-ps-ui text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
                  {mockData.intention}
                </span>
              </div>
            </div>
          </div>

          {/* O Grid Bento (Sem fundo preto gigante, usando cards separados) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Esquerda: A Vibração (Ocupa 7 colunas) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-12 h-full">
                <h3 className="font-ps-display text-3xl mb-6 text-white">A Vibração do Lugar</h3>
                <p className="font-ps-ui text-white/90 text-xl italic leading-relaxed mb-10 border-l-2 border-[#C9A227] pl-6">
                  "{mockData.desc}"
                </p>

                {/* Mudança: Para quem é -> OBJETIVO */}
                <div className="bg-[#C9A227]/10 p-6 rounded-2xl mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-[#C9A227]" />
                    <span className="font-ps-ui text-xs uppercase font-bold tracking-widest text-[#C9A227]">Objetivo Central</span>
                  </div>
                  <span className="block font-ps-ui text-white/90 text-lg leading-relaxed">{mockData.objetivo}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto">
                  <div className="flex flex-col">
                    <span className="font-ps-ui text-white/40 text-[11px] uppercase font-bold tracking-widest mb-2 block">Benefícios</span>
                    <span className="font-ps-ui text-white/80 text-[15px] leading-relaxed block">{mockData.beneficios}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-ps-ui text-white/40 text-[11px] uppercase font-bold tracking-widest mb-2 block">Na Vida Real</span>
                    <span className="font-ps-ui text-white/80 text-[15px] leading-relaxed block">{mockData.vidaReal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: O Ritual (Ocupa 5 colunas) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-[#C9A227]/[0.05] border border-[#C9A227]/20 rounded-[32px] p-8 md:p-12 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                  <h3 className="font-ps-display text-3xl text-white">O Ritual de Ativação</h3>
                </div>

                <div className="mb-8">
                  <span className="font-sans text-[11px] tracking-[0.2em] uppercase block mb-3 text-[#C9A227]">O Tema do seu Ano</span>
                  <p className="text-white text-2xl font-ps-display font-medium leading-tight">
                    {mockData.tema}
                  </p>
                </div>

                <div className="mb-10">
                  <span className="font-sans text-[11px] tracking-[0.2em] uppercase block mb-3 text-[#C9A227]">O Segredo</span>
                  <p className="text-white/70 text-[15px] leading-relaxed">
                    {mockData.segredo}
                  </p>
                </div>

                <div className="bg-black/40 border border-white/5 p-6 rounded-3xl mt-auto">
                  <span className="font-sans text-[11px] tracking-[0.2em] uppercase block mb-6 text-[#C9A227]">Passo a Passo de 24h</span>
                  <div className="space-y-6">
                    {mockData.ritual.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="font-sans text-lg font-bold mt-0.5 text-[#C9A227]">{idx + 1}.</span>
                        <p className="text-white/80 text-[15px] font-light leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* =========================================================================
          OPÇÃO 2: MAGAZINE EDITORIAL SPLIT (Foco colossal na foto)
          ========================================================================= */}
      <div className="py-24 border-b border-white/10">
        <div className="text-center mb-16">
          <h2 className="font-ps-display text-3xl text-[#C9A227]">OPÇÃO 2: Magazine Editorial Split</h2>
          <p className="text-white/50">A imagem ocupa metade da tela fixa, enquanto você rola o dossiê textual elegantemente na direita.</p>
        </div>

        <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-0 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-[#050505]">
            
            {/* Esquerda: Imagem e Hierarquia */}
            <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-[850px]">
              <img src={mockData.img} alt={mockData.city} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-16 left-12 right-12">
                <h1 className="font-ps-display text-6xl md:text-8xl text-white mb-2 leading-none drop-shadow-xl">{mockData.city}</h1>
                <h2 className="font-ps-ui text-2xl text-[#C9A227] italic drop-shadow-md">Ativação da Casa {mockData.house}</h2>
              </div>
            </div>

            {/* Direita: Textos (Scrollable se a tela for pequena, ou flui natural) */}
            <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col gap-12 bg-black/50 backdrop-blur-3xl">
              
              <div>
                <p className="font-ps-display text-white/90 text-3xl leading-relaxed mb-2">
                  "{mockData.desc}"
                </p>
                <span className="font-ps-ui text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">{mockData.intention}</span>
              </div>

              {/* OBJETIVO */}
              <div>
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <Target className="w-5 h-5 text-[#C9A227]" />
                  <h4 className="font-sans text-sm tracking-[0.2em] uppercase font-bold text-white">Objetivo Principal</h4>
                </div>
                <p className="text-white/80 text-lg leading-relaxed">{mockData.objetivo}</p>
              </div>

              {/* Beneficios e Vida Real lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-[#C9A227] mb-3">Benefícios</h4>
                  <p className="text-white/70 text-[15px] leading-relaxed">{mockData.beneficios}</p>
                </div>
                <div>
                  <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-[#C9A227] mb-3">Na Vida Real</h4>
                  <p className="text-white/70 text-[15px] leading-relaxed">{mockData.vidaReal}</p>
                </div>
              </div>

              <div className="w-full h-px bg-white/10"></div>

              {/* Ritual Box */}
              <div>
                <h3 className="font-ps-display text-4xl text-white mb-6">O Ritual de 24h</h3>
                <p className="text-[#C9A227] font-ps-ui text-lg italic mb-2">{mockData.tema}</p>
                <p className="text-white/60 text-sm mb-8">{mockData.segredo}</p>
                
                <div className="space-y-6 pl-4 border-l-2 border-[#C9A227]/30">
                  {mockData.ritual.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="font-sans text-sm font-bold mt-0.5 text-[#C9A227]">0{idx + 1}.</span>
                      <p className="text-white/80 text-[15px] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          OPÇÃO 3: IMMERSIVE GLASS OVERLAY (Cards flutuantes sobre o fundo inteiro)
          ========================================================================= */}
      <div className="py-24 mb-32 relative">
        <div className="absolute inset-0 z-0">
          <img src={mockData.img} alt={mockData.city} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#030306]/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-ps-display text-3xl text-[#C9A227]">OPÇÃO 3: Immersive Glass Overlay</h2>
            <p className="text-white/50">A imagem da cidade vira o pano de fundo gigante e as informações flutuam em cartões de vidro.</p>
          </div>

          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col gap-6">
            
            {/* Header Flutuante Gigante */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-12 md:p-16 rounded-[40px] text-center shadow-2xl flex flex-col items-center">
              <h1 className="font-ps-display text-6xl md:text-8xl text-white mb-4 drop-shadow-xl">{mockData.city}</h1>
              <h2 className="font-ps-ui text-3xl text-[#C9A227] italic mb-6">Ativação da Casa {mockData.house}</h2>
              <p className="font-ps-display text-white/90 text-2xl md:text-4xl max-w-3xl mx-auto leading-tight">
                "{mockData.desc}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box Objetivo & Beneficios */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-[40px] shadow-2xl">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 px-4 py-2 rounded-full mb-4">
                    <Target className="w-4 h-4 text-[#C9A227]" />
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-[#C9A227]">Objetivo</span>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">{mockData.objetivo}</p>
                </div>

                <div className="space-y-6">
                  <div className="border-l border-white/20 pl-6">
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-white/40 block mb-2">Benefícios</span>
                    <p className="text-white/70 text-[15px] leading-relaxed">{mockData.beneficios}</p>
                  </div>
                  <div className="border-l border-white/20 pl-6">
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-white/40 block mb-2">Na Vida Real</span>
                    <p className="text-white/70 text-[15px] leading-relaxed">{mockData.vidaReal}</p>
                  </div>
                </div>
              </div>

              {/* Box Ritual */}
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-[40px] shadow-2xl">
                <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 px-4 py-2 rounded-full mb-8">
                  <Compass className="w-4 h-4 text-[#C9A227]" />
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-[#C9A227]">O Ritual</span>
                </div>
                
                <h3 className="font-ps-display text-3xl text-white mb-2">{mockData.tema}</h3>
                <p className="text-white/60 text-sm mb-10">{mockData.segredo}</p>
                
                <div className="space-y-6">
                  {mockData.ritual.map((step, idx) => (
                    <div key={idx} className="flex gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-6 h-6 text-[#C9A227] shrink-0" />
                      <p className="text-white/80 text-[15px] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
