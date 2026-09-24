import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Briefcase, DollarSign, Leaf, Users, Calendar, Sparkles, Crown, MapPin, ChevronLeft, ChevronDown, ChevronRight, Target, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const P = {
  name: "Rafael",
  house: 11,
  year: 2026,
};

const LIFE_AREAS = [
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 98, teaser: "A escolha perfeita para quem quer focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração favorece conexões afetivas que nascem de forma leve através da convivência, da cumplicidade e da afinidade de metas." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", score: 85, teaser: "Desenhado sob medida para quem busca focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração cria um terreno fértil para impulsionar seus projetos profissionais por meio de alianças estratégicas e reconhecimento no mercado." },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b", score: 75, teaser: "A rota certa para quem precisa focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração estimula oportunidades de faturamento que tendem a fluir com mais facilidade através de parcerias, novos canais e indicações." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 55, teaser: "Recomendado para quem quer focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração convida você a renovar sua disposição física e mental encontrando motivação em novos hábitos, ambientes e rituais saudáveis." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", score: 95, teaser: "O caminho ideal de quem deseja focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração abre portas para você integrar círculos seletos, atraindo o apoio espontâneo de mentores, aliados e conexões influentes." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 65, teaser: "Excelente para quem cansou de focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração facilita a organização do dia a dia ao incentivar a otimização de processos, divisão de tarefas e rotina sem sobrecarga." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", score: 80, teaser: "Para você que busca focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração tende a despertar um sentimento de realização pessoal quando você coloca seus talentos e ideias a serviço de um propósito maior." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 88, teaser: "A estratégia certa se você quer focar na força dos grupos, na internet, no networking de elite e nos projetos de futuro. Esta configuração ativa uma energia de destaque e autoridade, encorajando você a se posicionar com autoconfiança e respeito público." },
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
          {/* BADGE DE TEMPO */}
          <div className="mb-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">
            <Calendar className="w-3 h-3" />
            Próximo Aniversário ({P.year})
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h1 className="text-[140px] md:text-[220px] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase" style={{ filter: 'drop-shadow(0px 20px 40px rgba(255,255,255,0.15))' }}>
              Casa 11
            </h1>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/90 mt-[-10px] md:mt-[-20px] mb-6">
            Amigos, Parcerias e Ganhos Digitais
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">
              Networking, Comunidades & Escala Viral
            </div>
          </motion.div>
        </motion.div>

        {/* ENERGIA DO ANO */}
        <motion.div className="relative z-20 mt-32 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.3em] block mb-8">A Energia do Ano</span>
            <p className="text-3xl md:text-5xl font-light text-white/90 leading-tight mb-8">
              Seu ano gira em torno de <span className="text-[#3b82f6] font-medium">projetos coletivos, tecnologia</span> e parcerias de negócios.
            </p>
            <p className="text-white/50 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-16">
              Pessoas, grupos e a internet terão um papel vital na realização dos seus objetivos práticos.
            </p>
            <motion.div className="w-px h-24 bg-gradient-to-b from-[#3b82f6]/50 to-transparent mx-auto mb-16" />
            <p className="text-2xl md:text-3xl font-ps-display italic text-white/80 leading-relaxed max-w-xl mx-auto">
              Trabalhar sozinho tem limite. <br/> A magia consiste em olhar para o lado e aceitar a força do coletivo.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* PARA QUEM É A CASA 11 & ACCORDION (O layout Apple) */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-6 mt-10">
        
        {/* PARA QUEM É A CASA 11? */}
        <motion.div className="w-full bg-[#0d172a]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[40px] p-10 md:p-16 mb-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden">
          <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h3 className="font-ps-display text-3xl md:text-4xl font-bold mb-4 text-center">Para Quem É A Casa 11?</h3>
          <p className="text-white/50 text-sm md:text-base font-light mb-12 text-center">Esta viagem de aniversário é exatamente para você que:</p>
          <ul className="space-y-6 max-w-2xl w-full">
            {[
              "Cansou de carregar a vida sozinho no esforço individual e entendeu que o seu sucesso depende do ecossistema certo.",
              "Quer parar de bater em portas fechadas e precisa de aliados ou mentores influentes abrindo caminhos para você.",
              "Busca um ano leve, onde o seu nome circula através de indicações, convites e pertencimento a uma egrégora forte."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <span className="text-white/80 font-light leading-relaxed text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>

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
                      onClick={() => setHoveredArea(area.id)}
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
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                animate={{ width: `${area.score}%` }}
                                transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
                                style={{ backgroundColor: area.color, opacity: isActive ? 1 : 0.4 }}
                              />
                            </div>
                            <span className={`text-[10px] font-bold tracking-widest shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/30'}`}>
                              {area.score}%
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>


              <div className="w-full lg:hidden flex flex-col gap-2">
                {LIFE_AREAS.map((area) => {
                  const currentActive = hoveredArea || "amor";
                  const isActive = currentActive === area.id;

                  return (
                    <button
                      key={area.id}
                      onClick={() => setHoveredArea(area.id)}
                      className={`relative flex items-center gap-4 p-3 rounded-2xl border overflow-hidden text-left ${
                        isActive ? 'border-white/20' : 'border-white/5'
                      }`}
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive ? `${area.color}44` : undefined,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: `${area.color}22`, borderColor: `${area.color}44` }}
                      >
                        <area.icon className="w-5 h-5" style={{ color: area.color }} />
                      </div>
                      <div className="flex-1">
                        <span className="block font-ps-display text-sm text-white font-bold mb-1">
                          {area.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: `${area.score}%` }}
                              transition={{ duration: 0.8, type: 'spring' }}
                              style={{ backgroundColor: area.color }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-white/70">{area.score}%</span>
                        </div>
                      </div>
                    </button>
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
                      <div className="relative z-10 p-8 md:p-16 w-full max-w-4xl flex flex-col">
                        
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center border shrink-0 shadow-[0_0_50px_rgba(255,255,255,0.15)] bg-black/20 backdrop-blur-md" style={{ borderColor: `${activeArea.color}66` }}>
                            <activeArea.icon className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ color: activeArea.color }} />
                          </div>
                          <div className="flex-1 pb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-4 text-white drop-shadow-md">
                              Foco e Intenção
                            </span>
                            <h3 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-none drop-shadow-xl">{activeArea.label}</h3>
                          </div>
                        </div>
                        
                        <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-8" />
                        
                        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                          {activeArea.teaser}
                        </p>
                        
                        <div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectIntention(activeArea.id, e); }}
                            className={`w-full md:w-auto px-10 py-5 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${selectedIntention !== activeArea.id && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 hover:bg-gray-100'}`}
                            style={selectedIntention === activeArea.id ? { backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` } : {}}
                          >
                            {selectedIntention === activeArea.id ? <Sparkles className="w-5 h-5 shrink-0" /> : <Target className="w-5 h-5 shrink-0" />}
                            {selectedIntention === activeArea.id ? 'Foco Selecionado' : 'Selecionar Como Meu Destino'}
                          </button>
                        </div>
                        
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* STICKY BOTTOM BAR (Aparece quando escolhe) */}
      <AnimatePresence>
        {selectedIntention && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <div className="bg-[#0B1426]/90 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl shadow-[0_-20px_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-ps-display text-xl font-bold">Tudo Certo</h4>
                    <p className="text-white/60 text-sm">Seu foco principal foi definido.</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/map')}
                  className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
