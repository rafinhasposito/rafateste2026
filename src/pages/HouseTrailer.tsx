import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Briefcase, DollarSign, Leaf, Users, Calendar, Sparkles, Crown, MapPin, ChevronLeft, ChevronDown, ChevronRight, Target, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const P = {
  name: "Rafael",
  house: 11,
  year: 2026,
  gender: "M", // Mock data simulating user's gender
};

const LIFE_AREAS = [
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 98, teaser: "A escolha perfeita para quem quer viver um romance leve e sem cobranças. Favorece encontros que nascem naturalmente da amizade, da convivência em grupo e de sonhos em comum." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", score: 98, teaser: "Desenhado sob medida para quem busca crescer sem precisar fazer tudo sozinho. O terreno é fértil para impulsionar seus projetos através de alianças e apoios do seu mercado." },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b", score: 98, teaser: "A rota certa para quem precisa faturar aproveitando conexões e novos públicos. A energia estimula oportunidades financeiras que tendem a fluir por indicações e projetos colaborativos." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 98, teaser: "Recomendado para quem quer renovar a disposição física de forma motivadora. Convida você a criar constância em novos ambientes, esportes ao ar livre e atividades coletivas." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", score: 98, teaser: "O caminho ideal para abrir portas em círculos seletos e ativos. Facilita o acesso a mentores e aliados que apoiam e recomendam genuinamente suas ideias." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 98, teaser: "Excelente para quem quer organizar o cotidiano com leveza e colaboração. Ajuda a otimizar o dia a dia dividindo tarefas, usando tecnologia e contando com o suporte de equipe." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", score: 98, teaser: "Para você que busca dar um significado maior aos seus projetos. Tende a despertar uma realização profunda ao colocar seus talentos a serviço de uma causa ou ecossistema." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 98, teaser: "A estratégia certa se você quer ganhar destaque, relevância e simpatia pública. Ativa uma presença acolhedora e inspiradora que encoraja você a se posicionar como referência na sua tribo." },
];

export default function HouseTrailer() {
  const navigate = useNavigate();
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

  

  const handleSelectIntention = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIntention(id);
  };

  return (
    <div className="min-h-screen bg-[#0B1426] text-white font-sans overflow-x-hidden selection:bg-[#3b82f6]/30 pb-32">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0B1426]/50 backdrop-blur-xl border-b border-white/[0.04] px-6 h-14 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
            <ChevronLeft className="w-4 h-4 text-white/70" />
          </button>
          <span className="font-ps-display font-semibold tracking-widest text-white/90 text-xs uppercase">Protocolo Solar</span>
        </div>
      </nav>

      {/* HERO E VÍDEO (EXATAMENTE COMO NO FINAL) */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20">
        <div className="w-[100vw] absolute left-1/2 -translate-x-1/2 top-0 h-[100vh] z-0 pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)" }}>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-screen opacity-30" style={{ filter: "hue-rotate(0deg)" }}>
            <source src="/videos/teste-fundo.mp4" type="video/mp4" />
          </video>
        </div>
        <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1426]/80 to-[#0B1426] z-10 pointer-events-none" />

        <motion.div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h1 className="text-[140px] md:text-[220px] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase" style={{ filter: 'drop-shadow(0px 20px 40px rgba(255,255,255,0.15))' }}>
              Casa {P.house}
            </h1>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/80 mt-[-10px] md:mt-[-20px]">
            Redes, Aliados &amp; Projetos de Futuro
          </motion.h2>
        </motion.div>

        {/* ENERGIA DO ANO */}
        <motion.div className="relative z-20 mt-32 max-w-4xl mx-auto px-6">

          {/* Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] block mb-10 text-center"
          >
            A Energia do Ano
          </motion.span>

          {/* Headline — palavra por palavra */}
          <p className="text-3xl md:text-5xl font-light text-white/90 leading-tight mb-20 text-center">
            {['A','energia','deste','ano','convida','você','a','sair','do','esforço','individual','e','construir','através','da'].map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.16,1,0.3,1] }} className="inline-block mr-[0.25em]">{word}</motion.span>
            ))}{' '}
            {['força','do','coletivo,','das','amizades','e','das','alianças','certas.'].map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0.2 + (15+i) * 0.04, ease: [0.16,1,0.3,1] }} className="inline-block mr-[0.25em] text-[#3b82f6] font-medium">{word}</motion.span>
            ))}
          </p>

          {/* 3 statements empilhados */}
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {[
              { n: '01', title: 'Pertencimento e visão de futuro', sub: 'Pessoas, grupos, comunidades e novas conexões desempenham um papel vital nos seus objetivos práticos.' },
              { n: '02', title: 'A força do coletivo', sub: 'Carregar tudo sozinho tem limite. O ecossistema certo acelera o que o esforço individual nunca conseguiria.' },
              { n: '03', title: 'Aliados que abrem caminhos', sub: 'Mentores, parceiros e redes certas transformam convites e indicações no motor invisível do seu crescimento.' },
            ].map(({ n, title, sub }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.9 + i * 0.18, ease: [0.16,1,0.3,1] }}
                className="flex items-start gap-8 py-8 group"
              >
                <span className="font-ps-display text-5xl md:text-6xl font-bold text-white/[0.07] group-hover:text-[#3b82f6]/40 transition-colors duration-500 leading-none shrink-0 w-16 text-right">
                  {n}
                </span>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-ps-display font-bold text-white/90 mb-2 group-hover:text-white transition-colors duration-300">{title}</h4>
                  <p className="text-white/40 text-sm md:text-base font-light leading-relaxed">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </section>

        {/* PARA QUEM É A CASA 11 & ACCORDION (O layout Apple) */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-6 mt-10">
        
        {/* PARA QUEM É A CASA 11? */}
        <motion.div className="w-full bg-[#0d172a]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[28px] p-8 md:p-12 mb-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden mt-20">
          <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Para Quem É A Casa {P.house}?</span>
            <h3 className="font-ps-display text-2xl md:text-3xl font-bold mb-2 text-center">Esta viagem é para você que...</h3>
            <p className="text-white/40 text-xs font-light mb-10 text-center">Identifique-se com ao menos um dos cenários abaixo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 w-full max-w-3xl mt-12">
            {[
              { 
                avatar: P.gender === 'M' ? "homem_jovem.png" : "mulher_oriental.png", 
                text: `Cansou de carregar tudo sozinh${P.gender === 'M' ? 'o' : 'a'} e entendeu que o seu crescimento depende do ecossistema certo.` 
              },
              { 
                avatar: P.gender === 'M' ? "homem_adulto.png" : "mulher_moderna.png", 
                text: "Busca abrir caminhos com mentores e pessoas que acreditam genuinamente nas suas ideias." 
              },
              { 
                avatar: P.gender === 'M' ? "homem_nerd.png" : "mulher_negra.png",    
                text: "Quer que seu nome e projetos circulem através de convites, indicações e pertencimento." 
              },
            ].map(({ text, avatar }, i) => (
              <motion.div
                key={i}
                whileHover={{ borderColor: 'rgba(59,130,246,0.3)', backgroundColor: 'rgba(59,130,246,0.04)' }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col items-center text-center gap-2 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-default group"
              >
                {/* Efeitos visuais do card restritos as bordas */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  {/* Linha de destaque no topo */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent group-hover:via-[#3b82f6]/90 transition-all duration-300" />
                  {/* Glow sutil no topo no hover */}
                  <div className="absolute top-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 100%)' }} />
                </div>

                {/* Memoji centralizado dentro do card */}
                <div className="relative z-20 w-32 h-32 mb-4">
                  <div className="absolute inset-0 bg-[#3b82f6]/5 rounded-full blur-[20px] group-hover:bg-[#3b82f6]/20 transition-colors duration-300" />
                  <img 
                    src={`/memojis/${avatar}`} 
                    alt={`Persona`} 
                    className="w-full h-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 relative z-10"
                  />
                </div>

                <p className="text-white/70 text-base font-light leading-relaxed group-hover:text-white transition-colors duration-200 relative z-10">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SELEÇÃO DO FOCO EM FORMATO ACCORDION APPLE */}
        <motion.div className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#3b82f6] mb-8">
              <Target className="w-3 h-3" />
              <span>Passo Necessário</span>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">Escolha o seu Foco.</h3>
            <p className="text-white/50 text-center text-lg max-w-2xl mx-auto mb-16">
              O impacto desta Casa muda conforme a sua intenção principal. Veja o percentual de match de cada área abaixo e selecione a que deseja ativar.
            </p>

            {/* LAYOUT: SIDEBAR RETRÁTIL + PAINEL QUE CRESCE */}
            <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col-reverse lg:flex-row gap-6 lg:gap-6 relative z-10 pb-20 lg:h-[700px] xl:h-[760px] items-stretch">
              
              {/* COLUNA ESQUERDA: SIDEBAR — expandida por padrão, encolhe pra ícones quando mouse vai pro painel */}
              <motion.div
                animate={{ width: isPanelHovered ? 72 : 300 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.15 }}
                className="hidden lg:flex shrink-0 flex-col gap-2 items-stretch h-full overflow-hidden"
              >
                {LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <div
                      key={area.id}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onClick={() => { setHoveredArea(area.id); setIsPanelHovered(true); }}
                      className="relative flex-1 rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.05)',
                        boxShadow: isActive ? `0 0 20px ${area.color}20` : 'none',
                      }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }}
                        />
                      )}

                      {/* Conteúdo sempre visível: ícone + nome + barra */}
                      <div className="absolute inset-0 flex items-center gap-3 px-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: isActive ? `${area.color}33` : `${area.color}15`,
                            borderColor: isActive ? `${area.color}55` : `${area.color}30`,
                          }}
                        >
                          <area.icon className="w-4 h-4" style={{ color: isActive ? area.color : `${area.color}80` }} />
                        </div>

                        <motion.div
                          animate={{ opacity: isPanelHovered ? 0 : 1 }}
                          transition={{ duration: 0.25 }}
                          className="flex-1 min-w-0 pointer-events-none"
                        >
                          <span className={`block font-ps-display text-sm font-bold mb-1 whitespace-nowrap tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                            {area.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                animate={{ width: isActive ? `${area.score}%` : '0%' }}
                                transition={{ duration: 0.8, type: 'spring', bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                                style={{ backgroundColor: area.color, opacity: isActive ? 1 : 0.4 }}
                              />
                            </div>
                            <motion.span
                              animate={{ opacity: isActive ? 1 : 0 }}
                              transition={{ duration: 0.3, delay: isActive ? 0.7 : 0 }}
                              className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                            >
                              {area.score}%
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* MOBILE: ACCORDION — tap item → barra anima + painel expande inline */}
              <div className="w-full lg:hidden flex flex-col gap-3">
                {LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <div key={area.id} className="flex flex-col">
                      {/* Cabeçalho do item (sempre visível) */}
                      <button
                        onClick={() => setHoveredArea(isActive ? null : area.id)}
                        className="relative flex items-center gap-4 p-4 rounded-2xl border overflow-hidden text-left transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                          borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.06)',
                          boxShadow: isActive ? `0 0 20px ${area.color}20` : 'none',
                        }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }} />
                        )}

                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                          style={{ backgroundColor: isActive ? `${area.color}33` : `${area.color}15`, borderColor: isActive ? `${area.color}55` : `${area.color}30` }}
                        >
                          <area.icon className="w-5 h-5" style={{ color: isActive ? area.color : `${area.color}80` }} />
                        </div>

                        <div className="flex-1 min-w-0 relative z-10">
                          <span className={`block font-ps-display text-base font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {area.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                animate={{ width: isActive ? `${area.score}%` : '0%' }}
                                transition={{ duration: 0.8, type: 'spring', bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                                style={{ backgroundColor: area.color }}
                              />
                            </div>
                            <motion.span
                              animate={{ opacity: isActive ? 1 : 0 }}
                              transition={{ duration: 0.3, delay: isActive ? 0.7 : 0 }}
                              className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                            >
                              {area.score}%
                            </motion.span>
                          </div>
                        </div>
                      </button>

                      {/* Painel expandido (aparece só quando ativo) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="relative mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
                              style={{ minHeight: 320 }}
                            >
                              {/* Background colorido */}
                              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 80%)` }} />
                              <div className="absolute inset-0 mix-blend-color opacity-60 pointer-events-none" style={{ backgroundColor: area.color }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/70 to-transparent pointer-events-none" />

                              {/* Conteúdo */}
                              <div className="relative z-10 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-black/20" style={{ borderColor: `${area.color}55` }}>
                                    <area.icon className="w-4 h-4" style={{ color: area.color }} />
                                  </div>
                                  <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.25em]">{area.label}</span>
                                </div>
                                <h3 className="font-ps-display text-3xl font-bold text-white leading-tight mb-4">{area.label}</h3>
                                <div className="w-12 h-px mb-4" style={{ backgroundColor: `${area.color}80` }} />
                                <p className="text-white/80 text-sm font-light leading-relaxed mb-6">{area.teaser}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSelectIntention(area.id, e); }}
                                  className={`w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${selectedIntention !== area.id ? 'bg-white text-black' : ''}`}
                                  style={selectedIntention === area.id ? { backgroundColor: area.color, color: '#fff' } : {}}
                                >
                                  {selectedIntention === area.id ? <Sparkles className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                                  {selectedIntention === area.id ? 'Foco Ativado ✓' : 'Ativar Este Foco'}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>


              {/* COLUNA DIREITA: O PAINEL DE CINEMA — quando mouse entra aqui a sidebar encolhe pra ícones */}
              <motion.div
                layout
                onMouseEnter={() => setIsPanelHovered(true)}
                onMouseLeave={() => setIsPanelHovered(false)}
                className="flex-1 h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0B1426] z-10"
              >
                <AnimatePresence mode="wait">
                  {LIFE_AREAS.filter(a => a.id === (hoveredArea || "amor")).map((activeArea) => (
                    <motion.div
                      key={activeArea.id}
                      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-end"
                    >
                      {/* BACKGROUNDS PREMIUM */}
                      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${activeArea.color} 0%, transparent 80%)` }} />
                      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" src="/videos/aura-loop.mp4" />
                      <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: activeArea.color }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/80 to-transparent pointer-events-none" />
                      
                      {/* CONTEÚDO PRINCIPAL */}
                      <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-end h-full">
                        
                        {/* Ícone pequeno + label da área */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-black/20 backdrop-blur-md" style={{ borderColor: `${activeArea.color}55` }}>
                            <activeArea.icon className="w-5 h-5" style={{ color: activeArea.color }} />
                          </div>
                          <span className="text-white/60 text-xs uppercase font-bold tracking-[0.25em]">
                            {activeArea.label}
                          </span>
                        </div>

                        {/* Título grande e limpo */}
                        <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                          {activeArea.label}
                        </h3>

                        <div className="w-16 h-px mb-6" style={{ backgroundColor: `${activeArea.color}80` }} />
                        
                        <p className="text-white/75 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl drop-shadow-md">
                          {activeArea.teaser}
                        </p>
                        
                        <div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectIntention(activeArea.id, e); }}
                            className={`w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${selectedIntention !== activeArea.id && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 hover:bg-gray-100'}`}
                            style={selectedIntention === activeArea.id ? { backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` } : {}}
                          >
                            {selectedIntention === activeArea.id ? <Sparkles className="w-4 h-4 shrink-0" /> : <Target className="w-4 h-4 shrink-0" />}
                            {selectedIntention === activeArea.id ? 'Foco Ativado ✓' : 'Ativar Este Foco'}
                          </button>
                        </div>
                        
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
      </section>
      
      {/* STICKY BOTTOM BAR (Aparece quando escolhe) */}
      <AnimatePresence>
        {selectedIntention && (() => {
          const chosen = LIFE_AREAS.find(a => a.id === selectedIntention);
          const color = chosen?.color || '#ffffff';
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 pointer-events-none"
            >
              <div className="max-w-4xl mx-auto pointer-events-auto">
                <div className="bg-[#0B1426]/90 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl shadow-[0_-20px_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
                      <Sparkles className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-ps-display text-xl font-bold">Foco Definido</h4>
                      <p className="text-white/60 text-sm">Agora veja as cidades que combinam com você.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/map')}
                    className="w-full md:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-white"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Revelar Cidades
                  </button>
                  
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
