import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, Eye, Clock, BookOpen, Plane, Hash, CreditCard, Compass, Plus } from "lucide-react";

/* ══════════════════════════════════════════════════
   ANIMATION COMPONENTS
   ══════════════════════════════════════════════════ */
const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
};

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = () => { n += Math.ceil(target / 30); if (n >= target) { setVal(target); return; } setVal(n); requestAnimationFrame(step); };
    step();
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ══════════════════════════════════════════════════
   DATA (Theme is hardcoded to #0B1426 dark blue, #3b82f6 bright blue)
   ══════════════════════════════════════════════════ */
const P = {
  name: "Rafael Sposito", firstName: "Rafael", year: 2027, date: "09/08/2027", time: "05:30 (UTC)",
  city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
  house: 11, houseLabel: "Grupos", houseTitle: "Amigos, Parcerias e Ganhos Digitais",
  houseTag: "Networking, Comunidades & Escala Viral",
  match: 98, cost: 1, vector: "FUTURO", hash: "#CC59F4F6",
  sign: "Leão", ascendant: "Virgem", phase: "Adulto", intention: "Amor",
};

/* Filtro de cor do vídeo de partículas — 1 vídeo, 12 auras */
const HOUSE_VIDEO_FILTER: Record<number, string> = {
  1:  "hue-rotate(0deg) saturate(1.4)",        // Vermelho — Identidade
  2:  "hue-rotate(120deg) saturate(1.2)",       // Verde — Recursos
  3:  "hue-rotate(60deg) saturate(1.3)",        // Amarelo — Comunicação
  4:  "hue-rotate(180deg) saturate(0.8)",       // Prata/Azul claro — Lar
  5:  "hue-rotate(40deg) saturate(1.5)",        // Dourado — Criatividade
  6:  "hue-rotate(30deg) saturate(0.5)",        // Terra — Rotina
  7:  "hue-rotate(300deg) saturate(1.2)",       // Rosa — Relacionamentos
  8:  "hue-rotate(270deg) saturate(1.4)",       // Roxo escuro — Transformação
  9:  "hue-rotate(20deg) saturate(1.3)",        // Laranja — Expansão
  10: "hue-rotate(200deg) saturate(1.2)",       // Azul escuro — Carreira
  11: "none",                                   // Azul (original) — Grupos
  12: "hue-rotate(250deg) saturate(1.3)",       // Violeta — Espiritualidade
};

const FAVORECER = [
  { icon: Users, text: "Conhecer pessoas influentes que abrem portas profissionais importantes" },
  { icon: ArrowUpRight, text: "Aumentar de forma consistente a sua rede de contatos e audiência" },
  { icon: DollarSign, text: "Receber indicações, propostas e convites de trabalho de forma mais leve" },
  { icon: Target, text: "Criar parcerias de negócios, programas de afiliados ou coproduções de peso" },
  { icon: Sparkles, text: "Tirar projetos antigos do papel com a ajuda de grupos ou masterminds" },
];

const LIFE_AREAS = [
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 98, unlocked: true, teaser: "O romance nasce da afinidade intelectual e do convívio em grupos.", full: "O romance neste período nasce de forma muito natural através da amizade e da cumplicidade intelectual. É comum se apaixonar por alguém do seu círculo de amizades ou que compartilha das mesmas metas de vida. O relacionamento se beneficia de sonhos compartilhados para o futuro e da participação leve em eventos sociais." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", score: 85, unlocked: false, teaser: "Suas metas profissionais avançam com parcerias complementares de sucesso mútuo.", full: "O seu crescimento profissional deixa de ser uma escalada solitária e passa a ser impulsionado por quem você conhece. Oportunidades corporativas surgem através de indicações. Projetos em parceria ganham tração extrema e o seu networking será a sua maior alavanca de promoção e autoridade." },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b", score: 75, unlocked: false, teaser: "O dinheiro flui através do seu network, não do esforço solo.", full: "Esta é a Casa dos ganhos indiretos. O aumento de receita não vem de trabalhar o dobro de horas, mas sim do alcance que o seu grupo proporciona. Comissões, bônus, indicações de alto ticket, monetização de audiência ou venda de participações em negócios se tornam os canais mais rentáveis." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 55, unlocked: false, teaser: "Mantenha a saúde como prioridade em meio à expansão social intensa.", full: "O perigo aqui é negligenciar o bem-estar físico por excesso de compromissos sociais. A solução magnética para a saúde na Casa 11 é transformar o cuidado físico em um evento coletivo: entre para grupos de corrida, esportes em equipe ou aulas em grupo, onde o contágio social te manterá ativo." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", score: 95, unlocked: false, teaser: "Pessoas influentes do seu mercado começam a interagir com seus projetos.", full: "Você não será mais a pessoa buscando uma oportunidade, mas sim o centro de uma comunidade. O seu ano é marcado por convites para grupos de masterminds, associações exclusivas e contatos com figuras de liderança que podem encurtar anos de esforço com uma simples indicação." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 65, unlocked: false, teaser: "Cuidado para não abraçar muitas atividades de grupo ao mesmo tempo.", full: "A rotina pode ficar caótica se você tentar estar presente em todas as rodas sociais. O segredo da produtividade é a automação e a delegação. Use o poder da Casa 11 para contratar assistentes ou criar sistemas que permitam que você gerencie múltiplas relações sem perder o controle diário." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", score: 80, unlocked: false, teaser: "Você sente que faz parte de uma rede de suporte real e ganha fôlego.", full: "O sentido de propósito vai além do individual. A sua realização espiritual acontece quando você percebe que os seus talentos estão gerando impacto em uma comunidade, ONG ou grupo focado em uma visão humanitária. O seu trabalho ganha um legado de longo prazo." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 88, unlocked: false, teaser: "Sua mente se liberta do imediatismo e ganha fôlego para metas ambiciosas.", full: "A forma como o mundo te enxerga sofre um upgrade de status social. Você assume uma persona de líder inovador, visionário ou conector de pessoas. A sua marca pessoal fica colada aos círculos de excelência que você passa a frequentar e liderar." },
];

const TIMELINE = [
  { phase: "Fase 1", months: "Mês 1 a 3", title: "Organização de Contatos", desc: "Faça uma limpa saudável nas suas redes sociais, afaste-se de relações que não somam e teste novos projetos em formato experimental.", img: "/apple-mock/audio_mix__cv5tvd3y13ee_large.jpg" },
  { phase: "Fase 2", months: "Mês 4 a 8", title: "Extroversão Máxima", desc: "A fase mais forte para aceitar convites, frequentar eventos presenciais, fechar parcerias comerciais e ver novos aliados surgirem.", img: "/apple-mock/app_actions__budci8e25k76_large.jpg", highlight: true },
  { phase: "Fase 3", months: "Mês 9 a 12", title: "Escala de Resultados", desc: "Hora de colher os frutos do networking, delegar tarefas operacionais pesadas e deixar que a força do grupo multiplique o alcance do seu faturamento.", img: "/apple-mock/photographic_styles__ef8cg39z0q2q_large.jpg" },
];

const DIMS = [
  { icon: Heart, label: "Amor", val: 98, color: "#f43f5e" },
  { icon: Users, label: "Networking", val: 95, color: "#3b82f6" },
  { icon: Crown, label: "Identidade", val: 88, color: "#c9a227" },
  { icon: Briefcase, label: "Trabalho", val: 85, color: "#10b981" },
  { icon: Sparkles, label: "Espiritual", val: 80, color: "#818cf8" },
  { icon: DollarSign, label: "Dinheiro", val: 75, color: "#f59e0b" },
  { icon: Calendar, label: "Rotina", val: 65, color: "#a855f7" },
  { icon: Leaf, label: "Saúde", val: 55, color: "#22c55e" },
];

export default function AppleResultPrototype() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("amor");
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: casaProgress } = useScroll({
    target: casaRef,
    offset: ["start 85%", "start 30%"]
  });
  const casaScale = useTransform(casaProgress, [0, 1], [1.4, 1]);
  const casaOpacity = useTransform(casaProgress, [0, 1], [0, 1]);
  const casaBlur = useTransform(casaProgress, [0, 1], ["blur(16px)", "blur(0px)"]);

  return (
    <div className="min-h-screen bg-[#0B1426] text-[#f5f5f7] overflow-x-hidden font-sans bg-gradient-to-b from-[#0B1426] via-[#101D36] to-[#0B1426]">
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0B1426]/50 backdrop-blur-xl border-b border-white/[0.04] px-6 h-14 flex items-center justify-between text-sm">
        <span className="font-ps-display font-semibold tracking-widest text-white/90 text-xs uppercase">Protocolo Solar</span>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-white/50 text-[10px] font-mono tracking-widest">110 Créditos</span>
          <button className="bg-[#3b82f6] text-white text-[10px] font-bold px-4 py-1.5 rounded-full hover:brightness-110 transition uppercase tracking-wider">Dossiê Executivo</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
         1. HERO DO VÍDEO + CIDADE (tudo na mesma section = zero linha visível)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[110vh] w-full bg-[#0B1426]">
        {/* Vídeo em full brightness, ocupa a parte superior */}
        <motion.div style={{ scale: vidScale, opacity: vidOpacity }} className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/assets/ny.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Degradê nasce do fundo e sobe suavemente cobrindo os últimos 60% */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0B1426] via-[#0B1426]/85 to-transparent pointer-events-none" />

        {/* Legenda de País no topo direito (estilo UI de sistema) */}
        <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
           <MapPin className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">EUA</span>
        </div>

        {/* Texto flutua DENTRO da seção, posicionado no bottom sobre o gradiente */}
        <div className="absolute bottom-0 left-0 right-0 pb-16 flex flex-col items-center text-center px-6 z-10">

          {/* Pill tag acima — estilo da página Tecnologia */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-xs uppercase font-bold tracking-[0.3em] text-white/70 mb-6">
            <span>✦</span>
            <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>

          {/* Nome da cidade — máximo impacto */}
          <h1 className="font-ps-display text-[15vw] md:text-[140px] font-bold tracking-tight leading-[0.85] mb-6">
            {P.city}
          </h1>

          {/* Descrição: copy única por Casa */}
          <p className="text-white/60 text-base md:text-lg font-light max-w-lg mx-auto leading-relaxed">
            O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         3. CASA 11 GIGANTE com tags visuais abaixo do título
         ══════════════════════════════════════════════════ */}
      <section ref={casaRef} className="relative pt-16 pb-20 md:pb-32 bg-[#0B1426]">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <motion.h2
              style={{ scale: casaScale, opacity: casaOpacity, filter: casaBlur }}
              className="font-ps-display text-[22vw] md:text-[200px] font-bold tracking-tighter leading-[0.8] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
            >
              CASA {P.house}
            </motion.h2>
            {/* O subtítulo e a tag acompanham o fade da Casa */}
            <motion.div style={{ opacity: casaOpacity }} className="flex flex-col items-center">
              <h3 className="text-2xl md:text-4xl text-white/90 font-ps-display tracking-tight mb-5">{P.houseTitle}</h3>
              <span className="inline-block bg-white/[0.04] border border-white/10 text-white/60 text-xs font-semibold px-5 py-2 rounded-full tracking-[0.15em] uppercase">
                {P.houseTag}
              </span>
            </motion.div>
          </div>

          {/* 1. A ENERGIA DO ANO (Editorial Typography + Video Background) */}
          <section className="relative py-32 md:py-48 px-6 flex flex-col items-center justify-center">
            
            {/* Fundo em Vídeo - Quebra o limite de 1200px para ocupar a TELA TODA (100vw) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100vw] pointer-events-none flex items-center justify-center -z-10">
              <div 
                className="absolute inset-0 w-full h-full opacity-30 mix-blend-lighten"
                style={{
                  WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 30%, transparent 100%)',
                  maskImage: 'radial-gradient(50% 50% at 50% 50%, black 30%, transparent 100%)'
                }}
              >
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover"
                  style={{ filter: HOUSE_VIDEO_FILTER[P.house] || 'none' }}
                >
                  <source src="/videos/teste-fundo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <Reveal className="text-center max-w-[1000px] mx-auto relative z-10">
              <h3 className="text-[#3b82f6] text-[11px] font-bold uppercase tracking-[0.3em] mb-10">A Energia do Ano</h3>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-ps-display text-white/90 leading-tight mb-10">
                Seu ano gira em torno de <br className="hidden md:block" />
                <span className="text-[#3b82f6]">projetos coletivos, tecnologia</span> <br className="hidden md:block" />
                e parcerias de negócios.
              </h2>
            </Reveal>

            <Reveal delay={0.2} className="text-center max-w-2xl mx-auto relative z-10">
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light px-4">
                Pessoas, grupos e a internet terão um papel vital na realização dos seus objetivos práticos.
              </p>
              
              <div className="w-px h-12 bg-white/10 mx-auto my-12"></div>
              
              <p className="text-2xl md:text-4xl text-white/90 leading-tight font-ps-display italic">
                Trabalhar sozinho tem limite. <br className="hidden md:block" />
                <span className="text-white/60">A magia consiste em olhar para o lado e aceitar a força do coletivo.</span>
              </p>
            </Reveal>
          </section>

          {/* 2. O DIAGNÓSTICO E PARA QUEM É (Interactive Tabs) */}
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none"></div>

               <h3 className="text-white/90 text-3xl md:text-5xl font-ps-display font-bold mb-6 text-center relative z-10">Para Quem É A Casa {P.house}?</h3>
               <p className="text-white/50 text-center mb-10 text-lg relative z-10">Esta viagem de aniversário é exatamente para você que:</p>

               <ul className="space-y-6 max-w-3xl mx-auto mb-16 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div></div>
                    <p className="text-white/80 text-lg leading-relaxed">Cansou de carregar a vida sozinho no esforço individual e entendeu que o seu sucesso depende do ecossistema certo.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div></div>
                    <p className="text-white/80 text-lg leading-relaxed">Quer parar de bater em portas fechadas e precisa de aliados ou mentores influentes abrindo caminhos para você.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div></div>
                    <p className="text-white/80 text-lg leading-relaxed">Busca um ano leve, onde o seu nome circula através de indicações, convites e pertencimento a uma egrégora forte.</p>
                  </li>
               </ul>

               {/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}
               <div className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#3b82f6] mb-8">
                    <Sparkles className="w-3 h-3" />
                    <span>Seu Resultado Personalizado</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">{P.intention}</span>.</h3>
                  <p className="text-white/50 text-center text-lg max-w-2xl mx-auto mb-16">
                    O algoritmo escolheu a Casa {P.house} milimetricamente porque ela é a grande chave para destravar esse objetivo específico no seu próximo ano.
                  </p>

                  {/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
                  <div className="w-full mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Lista de Acordeões */}
                      <div className="md:col-span-5 space-y-3">
                        {LIFE_AREAS.map((area) => {
                          const isUnlocked = area.id.toLowerCase() === P.intention.toLowerCase() || area.unlocked;
                          const isOpen = openArea === area.id;
                          return (
                            <motion.button
                              key={area.id}
                              onClick={() => setOpenArea(isOpen ? "" : area.id)}
                              initial="closed"
                              animate={isOpen ? "open" : "closed"}
                              whileHover="hovered"
                              className={`w-full text-left rounded-3xl border transition-colors duration-500 overflow-hidden ${isOpen ? (isUnlocked ? 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'bg-white/[0.04] border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)]') : 'bg-black/40 border-white/5'}`}
                            >
                              <div className="flex items-center gap-4 px-6 py-5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isUnlocked ? 'bg-rose-500/20 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
                                  {isUnlocked ? <area.icon className="w-5 h-5 text-rose-400" /> : <Lock className="w-4 h-4 text-white/30" />}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`block text-base font-medium ${isOpen ? 'text-white' : 'text-white/70'}`}>{area.label}</span>
                                  </div>
                                  
                                  {/* SCORE EMBAIXO DO TEXTO (Mais grossa e animada no hover/select) */}
                                  <div className="flex items-center gap-4 mt-2.5">
                                    <div className="flex-1 max-w-[220px] h-3.5 bg-white/[0.05] rounded-full overflow-hidden">
                                      <motion.div 
                                        className="h-full rounded-full" 
                                        variants={{
                                          closed: { width: '0%' },
                                          hovered: { width: `${area.score}%` },
                                          open: { width: `${area.score}%` }
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        style={{ backgroundColor: area.color }} 
                                      />
                                    </div>
                                    <AnimatePresence>
                                      {isOpen && (
                                        <motion.span 
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -10 }}
                                          transition={{ duration: 0.3 }}
                                          className="text-[10px] font-bold font-ps-display tracking-widest uppercase" 
                                          style={{ color: area.color }}
                                        >
                                          {area.score}% MATCH
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {isUnlocked
                                  ? <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-400' : 'text-white/30'}`} />
                                  : <ChevronRight className="w-5 h-5 text-white/20" />
                                }
                              </div>

                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <div className="px-6 pb-6 pt-2">
                                      {isUnlocked ? (
                                        <>
                                          {/* Mobile: Mostra o texto completo pois não há painel lateral */}
                                          <div className="md:hidden">
                                            <p className="text-white/80 text-sm font-light leading-relaxed">{area.full}</p>
                                          </div>
                                          {/* Desktop: Mostra só o resumo e botão, pois o texto completo já está no painel ao lado */}
                                          <div className="hidden md:block">
                                            <p className="text-white/50 text-sm font-light leading-relaxed mb-4">{area.teaser}</p>
                                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-4 flex items-center justify-center gap-3 mt-4 shadow-[0_0_20px_rgba(244,63,94,0.05)] cursor-default">
                                              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                                              <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">Acesso Livre — Seu Foco Atual</span>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <div>
                                          <p className="text-white/50 text-sm font-light leading-relaxed mb-4">{area.teaser}</p>
                                          
                                          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors mt-4 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                            <Lock className="w-4 h-4 text-white/60 shrink-0" />
                                            <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Desbloquear análise — 1 crédito</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Painel Sticky Lateral (Desktop) */}
                      <div className="md:col-span-7 hidden md:block">
                        <div className="sticky top-10 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden min-h-[600px] relative flex flex-col justify-end">
                          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transition-all duration-1000" style={{ backgroundImage: "url('/apple-mock/apple_intelligence__bkgdcn4e0kj6_large.png')" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-transparent" />

                          <div className="relative z-10 p-12 max-w-2xl">
                            {LIFE_AREAS.filter(a => a.id === openArea).map(area => {
                              const isUnlocked = area.id.toLowerCase() === P.intention.toLowerCase() || area.unlocked;
                              return (
                                <motion.div key={area.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${isUnlocked ? 'bg-rose-500/20 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
                                    <area.icon className={`w-8 h-8 ${isUnlocked ? 'text-rose-400' : 'text-white/30'}`} />
                                  </div>
                                  <h3 className="font-ps-display text-4xl font-bold tracking-tight mb-4">{area.label}</h3>
                                  {isUnlocked ? (
                                    <p className="text-white/80 text-lg font-light leading-relaxed">{area.full}</p>
                                  ) : (
                                    <div>
                                      <p className="text-white/50 text-lg font-light leading-relaxed mb-8">{area.teaser}</p>
                                      <button className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-gray-200 transition flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                        <Lock className="w-4 h-4" />
                                        Liberar Acesso (1 Crédito)
                                      </button>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </Reveal>

          {/* 4. RADAR 360 */}
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-black/40 border border-white/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[100px] rounded-full pointer-events-none"></div>
              <h3 className="text-white/90 text-2xl font-bold mb-2 relative z-10">Radar 360°</h3>
              <p className="text-white/50 mb-10 text-sm relative z-10">A visão geral do impacto desta Casa nas 8 dimensões do seu ano.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative z-10">
                 {[
                   { label: "Amor", value: 98, color: "bg-rose-400" },
                   { label: "Networking", value: 95, color: "bg-[#3b82f6]" },
                   { label: "Identidade", value: 88, color: "bg-blue-400" },
                   { label: "Trabalho", value: 85, color: "bg-emerald-400" },
                   { label: "Espiritual", value: 80, color: "bg-purple-400" },
                   { label: "Dinheiro", value: 75, color: "bg-emerald-500" },
                   { label: "Rotina", value: 65, color: "bg-amber-400" },
                   { label: "Saúde", value: 55, color: "bg-rose-500" },
                 ].map((item, i) => (
                   <div key={i}>
                      <div className="flex justify-between mb-2"><span className="text-white/80 font-medium text-sm">{item.label}</span><span className="text-white/50 text-sm">{item.value}%</span></div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div></div>
                   </div>
                 ))}
              </div>
            </div>
          </Reveal>

          {/* 5. COMO APARECE NA VIDA REAL (Bento Grid 4 Áreas) */}
          <Reveal className="mb-10 text-center">
            <h3 className="text-white/90 text-3xl md:text-5xl font-ps-display font-bold mb-4">Na Vida Real</h3>
            <p className="text-white/50 max-w-xl mx-auto">Como a energia magnética da Casa 11 reconfigura as 4 áreas essenciais do seu ano.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-[1200px] mx-auto">
            {/* Dinheiro */}
            <Reveal delay={0.1} className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-500 text-xl">💰</span>
                </div>
                <h4 className="text-xl font-bold text-white/90">Dinheiro & Finanças</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">As oportunidades financeiras fogem da via tradicional. O dinheiro flui através de contatos, indicações, público e parcerias, mais do que de um esforço totalmente individual. Comissões e negócios digitais ganham muita força.</p>
            </Reveal>

            {/* Trabalho */}
            <Reveal delay={0.2} className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 text-xl">💼</span>
                </div>
                <h4 className="text-xl font-bold text-white/90">Trabalho & Carreira</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">É um ótimo período para quem trabalha com redes sociais, internet, mídias, marketing, eventos ou gestão de comunidades. Suas metas profissionais avançam rápido com parcerias complementares de sucesso mútuo.</p>
            </Reveal>

            {/* Amor */}
            <Reveal delay={0.3} className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <span className="text-rose-500 text-xl">💖</span>
                </div>
                <h4 className="text-xl font-bold text-white/90">Amor & Relações</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">O romance neste período nasce de forma muito natural através da amizade e da cumplicidade intelectual. É muito comum se apaixonar por alguém do seu círculo de amizades ou que compartilha dos mesmos ideais que você.</p>
            </Reveal>

            {/* Saúde */}
            <Reveal delay={0.4} className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-500 text-xl">🌿</span>
                </div>
                <h4 className="text-xl font-bold text-white/90">Saúde & Mente</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Sua mente se liberta do imediatismo angustiante. Você sente que faz parte de uma rede de suporte real e ganha fôlego e saúde mental para desenhar metas ambiciosas para os próximos anos com total tranquilidade.</p>
            </Reveal>
          </div>

          {/* 6. O MANTRA DA CASA */}
          <Reveal className="mb-24 mt-16 text-center max-w-4xl mx-auto">
             <span className="text-[#3b82f6] text-xs font-bold uppercase tracking-[0.3em]">Mantra do Ciclo</span>
             <h3 className="text-3xl md:text-5xl font-ps-display text-white/90 mt-4 leading-tight italic">"A minha visão inspira comunidades e os meus aliados multiplicam os meus resultados."</h3>
          </Reveal>

          {/* 7. AÇÃO PRÁTICA E ALERTA (Lado a Lado) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
             {/* Ritual */}
             <Reveal delay={0.2} className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-center">
                <h4 className="text-[#3b82f6] text-[11px] font-bold uppercase tracking-widest mb-3">O Ritual das 24 Horas</h4>
                <p className="text-white/80 leading-relaxed text-sm">No exato momento do seu aniversário neste destino, mande mensagem para 3 pessoas que te inspiram ou com quem você quer criar laços. Desenhe um plano para o seu maior sonho de longo prazo.</p>
             </Reveal>

             {/* Alerta */}
             <Reveal delay={0.3} className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-center">
                <h4 className="text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-3">Ponto Cego & Alerta</h4>
                <p className="text-white/80 leading-relaxed text-sm">Uso consciente: Cuidado com amizades interesseiras, promessas de apoio sem compromisso real ou com abraçar muitas atividades de grupo ao mesmo tempo e acabar perdendo o foco nas suas obrigações.</p>
             </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         4. BOARDING PASS
         ══════════════════════════════════════════════════ */}
      <section className="relative z-20 px-6 max-w-5xl mx-auto pb-24 md:pb-32">
        <Reveal className="bg-white/[0.02] backdrop-blur-xl border border-[#3b82f6]/20 rounded-[28px] overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)] flex flex-col md:flex-row">
          
          <div className="p-8 md:p-10 flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                <Plane className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <span className="font-ps-display text-lg font-semibold tracking-widest uppercase text-white/90">Boarding Pass Solar</span>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Viajante</p>
                <p className="text-lg font-semibold text-white/90">{P.name}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Origem Natal</p>
                <p className="text-lg font-semibold text-white/90">{P.origin}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Data da Viagem</p>
                <p className="text-lg font-semibold text-white/90">{P.date}</p>
                <p className="text-xs text-white/50">{P.time}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Destino Ideal</p>
                <p className="text-lg font-semibold text-white/90">{P.city}</p>
                <p className="text-xs text-white/50">{P.coords}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center relative w-8">
            <div className="absolute top-0 bottom-0 w-px border-dashed border-l border-white/20" />
            <div className="w-8 h-8 bg-[#0B1426] rounded-full absolute -top-4 border-b border-white/10" />
            <div className="w-8 h-8 bg-[#0B1426] rounded-full absolute -bottom-4 border-t border-white/10" />
          </div>

          <div className="bg-[#3b82f6]/10 p-8 md:p-10 md:w-[320px] flex flex-col justify-between border-l border-white/[0.02]">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Classe / Energia</p>
              <h3 className="text-4xl font-ps-display font-bold text-[#3b82f6] mb-1">Casa {P.house}</h3>
              <p className="text-sm text-white/70 font-medium mb-6">{P.houseLabel}</p>
              
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex items-center justify-between mb-4">
                <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Match</span>
                <span className="text-2xl font-bold text-[#3b82f6]">{P.match}%</span>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Custo</span>
                <span className="text-lg font-bold text-white/90">{P.cost} Crédito</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-mono text-white/40">{P.hash}</span>
              <span className="text-[10px] font-mono text-white/40">{P.vector}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         5. A REVELAÇÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-24 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight">A Revelação.</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-8 text-white/70 text-lg md:text-xl font-light leading-[1.8]">
            <p>
              <strong className="text-white font-semibold">{P.firstName}</strong>, o mapa revela que o seu próximo ciclo é regido pela energia da <strong className="text-white font-semibold">Casa {P.house}</strong>.
            </p>
            
            <div className="pl-6 border-l-2 border-white/10 py-2 my-8">
              <p>
                No dia <strong>{P.date}</strong>, exatamente às <strong>{P.time}</strong>, o seu Sol retorna à posição exata do seu nascimento. Ao passar este momento milimétrico nas coordenadas <span className="font-mono text-sm text-[#3b82f6]">[{P.coords}]</span> em <strong>{P.city}</strong>, a rotação da Terra forçará a ativação magnética da sua Casa {P.house} para os próximos 365 dias.
              </p>
            </div>

            <p>
              Isso significa que este será um ano em que pessoas, amizades, grupos, internet e novos contatos terão um papel muito maior na realização dos seus objetivos práticos. <span className="text-white border-b border-white/20 pb-0.5">O universo pede que você pare de caminhar sozinho.</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
         6. SEU DNA CÓSMICO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-32 border-t border-white/[0.02]">
        <Reveal className="text-center mb-16">
          <h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tight mb-4">A Sua Identidade.</h2>
          <p className="text-white/50 text-xl font-light">Como a energia universal se adapta ao seu mapa.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Reveal className="md:col-span-8 bg-white/[0.02] rounded-[32px] overflow-hidden relative min-h-[500px] border border-white/[0.04] group hover:border-white/10 transition-colors">
            <div className="absolute right-0 top-0 w-2/3 h-full bg-cover bg-right opacity-30 mix-blend-lighten" style={{ backgroundImage: "url('/apple-mock/camera_system_startframe__e0gisudnvv2a_large.jpg')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1426] via-[#0B1426]/90 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center p-12 max-w-xl">
              <Sun className="w-8 h-8 text-[#3b82f6] mb-6" />
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Signo Solar</p>
              <h3 className="font-ps-display text-5xl font-bold mb-6">Sol em {P.sign}.</h3>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                Magnético e inspirador. Você não entra em uma comunidade como um mero membro. Você entra como o farol reluzente que atrai e lidera multidões.
              </p>
              <div className="bg-white/[0.02] border border-[#3b82f6]/20 p-6 rounded-2xl border-l-4 border-l-[#3b82f6]">
                <p className="text-white/80 text-lg font-serif italic">"A minha visão inspira comunidades e os meus aliados multiplicam os meus resultados."</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4 bg-[#3b82f6]/10 rounded-[32px] border border-[#3b82f6]/20 p-10 flex flex-col justify-between min-h-[500px]">
            <div>
              <Zap className="w-8 h-8 text-[#3b82f6] mb-6" />
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">Ascendente da Revolução</p>
              <h3 className="font-ps-display text-4xl font-bold mb-6">{P.ascendant}.</h3>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                A escala viral exige processos impecáveis. O seu crescimento em redes não virá do caos, mas da extrema organização.
              </p>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 mt-8 border border-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Alerta Prático</p>
              <p className="text-sm font-medium">Evite focar excessivamente nos aplausos da audiência e esquecer de valorizar quem trabalha nos bastidores.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* A seção VIDA COMPLETA foi movida para cima, dentro de 'Para Quem É' */}

      {/* ══════════════════════════════════════════════════
         8. RADAR 360°
         ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 border-t border-white/[0.02]">
        <div className="max-w-[1000px] mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Radar 360°.</h2>
            <p className="text-white/40 text-lg font-light">A visão geral das 8 dimensões do seu ano.</p>
          </Reveal>

          <div className="space-y-6">
            {DIMS.map((d, i) => (
              <Reveal key={i} delay={i * 0.06} className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center shrink-0">
                  <d.icon className="w-4 h-4" style={{ color: d.color }} />
                </div>
                <span className="text-sm font-semibold w-24 shrink-0 text-white/80">{d.label}</span>
                <div className="flex-1 h-2 bg-white/[0.02] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${d.val}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.08 }} viewport={{ once: true }} className="h-full rounded-full" style={{ backgroundColor: d.color }} />
                </div>
                <span className="text-sm font-bold font-mono w-12 text-right" style={{ color: d.color }}><CountUp target={d.val} suffix="%" /></span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         9. CRONOGRAMA
         ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 mb-12 flex justify-between items-end">
          <Reveal>
            <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight mb-2">Linha do tempo.</h2>
            <p className="text-white/50 text-xl font-light">As 3 fases do seu {P.year}.</p>
          </Reveal>
          <div className="hidden md:flex gap-3">
            <button onClick={() => scrollCar(-420)} className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 transition"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => scrollCar(420)} className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={carRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-[max(24px,calc(50vw-680px))] pb-8 no-scrollbar scroll-smooth">
          {TIMELINE.map((t, i) => (
            <Reveal key={i} delay={i * 0.1} className="snap-center shrink-0 w-[85vw] md:w-[420px]">
              <div className={`h-[500px] rounded-[32px] overflow-hidden relative group cursor-pointer border ${t.highlight ? 'border-[#3b82f6]/40 bg-[#3b82f6]/10' : 'border-white/[0.04] bg-white/[0.02]'}`}>
                <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2s]" style={{ backgroundImage: `url('${t.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/60 to-transparent" />
                
                {t.highlight && <div className="absolute top-6 right-6 z-10 bg-[#3b82f6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Pico do Ano</div>}
                
                <div className="absolute bottom-10 left-10 right-10 z-10">
                  <span className={`text-[10px] font-bold uppercase tracking-widest block mb-3 ${t.highlight ? 'text-[#3b82f6]' : 'text-white/40'}`}>{t.phase} · {t.months}</span>
                  <h3 className="font-ps-display text-3xl font-bold mb-4 tracking-tight">{t.title}</h3>
                  <p className="text-white/60 text-base font-light leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         10. PONTOS CEGOS & RITUAL
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-32 border-t border-white/[0.02]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal className="bg-red-950/10 rounded-[32px] p-10 md:p-14 border border-red-900/20">
            <div className="flex items-center gap-4 mb-8">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="font-ps-display text-3xl font-bold text-red-100">Pontos Cegos.</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <h4 className="text-red-300 font-bold mb-2">Amizades Interesseiras</h4>
                <p className="text-white/60 text-sm leading-relaxed">Falsas promessas de apoio sem compromisso real. Confiar rápido demais pode custar caro.</p>
              </div>
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <h4 className="text-red-300 font-bold mb-2">Perda de Foco</h4>
                <p className="text-white/60 text-sm leading-relaxed">Abraçar muitas atividades de grupo ao mesmo tempo e acabar sem foco nas obrigações diárias.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="bg-[#3b82f6]/10 rounded-[32px] p-10 md:p-14 border border-[#3b82f6]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen className="w-8 h-8 text-[#3b82f6]" />
                <h2 className="font-ps-display text-3xl font-bold">O Ritual das 24h.</h2>
              </div>
              <p className="text-white/70 text-lg font-light leading-relaxed mb-8">
                Não passe o dia do seu aniversário sozinho. Jante com amigos, mande mensagens para pessoas importantes da sua rede de contatos ou visite um local dinâmico e movimentado em <strong className="text-white">{P.city}</strong>. Escreva suas 3 maiores metas de futuro em um papel.
              </p>
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] text-[#3b82f6] uppercase tracking-widest font-bold mb-2">Ritual Extra — Ascendente {P.ascendant}</p>
                <p className="text-white/80 text-sm font-medium">Crie uma planilha de contatos organizada por categorias de networking.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         11. PLANO B
         ══════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 border-t border-white/[0.02]">
        <Reveal className="mb-10">
          <h2 className="font-ps-display text-3xl md:text-4xl font-bold tracking-tight mb-2">Plano B.</h2>
          <p className="text-white/50 text-lg font-light">Cidades com ressonância magnética similar.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[{ city: "Los Angeles", match: 85 }, { city: "Calgary", match: 85 }, { city: "Toronto", match: 82 }].map((r, i) => (
            <Reveal key={i} delay={i * 0.1} className="bg-white/[0.02] rounded-[24px] p-6 border border-white/[0.04] flex justify-between items-center group cursor-pointer hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <div>
                <h4 className="text-xl font-bold mb-1 text-white/90">{r.city}</h4>
                <span className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Casa {P.house}</span>
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-[#3b82f6] transition-all">
                <span className="text-[#3b82f6] text-sm font-bold">{r.match}%</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         12. PAYWALL & FOOTER
         ══════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 text-center overflow-hidden border-t border-white/[0.04] bg-[#0B1426]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <Reveal className="max-w-4xl mx-auto px-6 relative z-10">
          <Lock className="w-12 h-12 text-[#3b82f6] mx-auto mb-8" />
          <h2 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Dossiê Executivo.
          </h2>
          <p className="text-white/50 text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Desbloqueie todas as dimensões trancadas, o radar 360°, os pontos cegos e o plano B alternativo. O mapeamento mais profundo do seu destino.
          </p>
          <button className="bg-[#3b82f6] text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_60px_rgba(59,130,246,0.15)]">
            Liberar Dossiê Completo
          </button>
        </Reveal>
      </section>

      <style dangerouslySetInnerHTML={{__html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
