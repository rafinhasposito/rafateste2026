import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";
import { MobileAppChrome } from "@/layouts/MobileAppChrome";
import { MapPin, ArrowUpCircle, Landmark, CircleDollarSign, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, Eye, Clock, BookOpen, Plane, Hash, CreditCard, Compass, Plus } from "lucide-react";

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
   DATA (Theme is hardcoded to #02160F dark blue, #10b981 bright blue)
   ══════════════════════════════════════════════════ */
const P = {
  name: "Rafael Sposito", firstName: "Rafael", year: 2027, date: "09/08/2027", time: "05:30 (UTC)",
  city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
  house: 2, houseLabel: "Recursos", houseTitle: "Dinheiro, Materialização e Valor",
  houseTag: "Prosperidade Financeira & Segurança",
  match: 98, cost: 1, vector: "FUTURO", hash: "#CC59F4F6",
  sign: "Leão", ascendant: "Virgem", phase: "Adulto", intention: "Dinheiro",
};

/* Textos cinematográficos dinâmicos para cada Casa */
const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "colocar você em primeiro lugar, resgatar sua coragem e liderar um novo começo na sua vida.",
  2: "destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo.",
  3: "destravar a sua voz, fechar novos negócios e fazer sua rotina girar com agilidade.",
  4: "criar raízes sólidas, reestruturar seu lar e conquistar um porto seguro de paz interior.",
  5: "reacender a sua paixão, recuperar a alegria de viver e colocar o seu brilho único em evidência.",
  6: "organizar sua rotina, recuperar sua energia física e fazer o seu dia render com máxima eficiência.",
  7: "atrair um relacionamento sério, firmar grandes parcerias e viver a verdadeira reciprocidade a dois.",
  8: "encerrar ciclos antigos, virar a página com coragem e acessar o seu verdadeiro poder pessoal.",
  9: "dar um salto quântico, expandir seus horizontes e viver uma vida sem fronteiras.",
  10: "assumir o topo do seu mercado, ser reconhecido publicamente e brilhar no modo CEO.",
  11: "atrair aliados de peso, multiplicar suas oportunidades pela rede e construir seus grandes projetos de futuro.",
  12: "desacelerar o barulho externo, gestar grandes ideias nos bastidores e renovar sua paz de espírito."
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
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, teaser: "O dinheiro flui através da sua capacidade de atrair e materializar recursos.", full: "Esta é a Casa da materialização. O aumento de receita não vem de sorte, mas da estruturação sólida do seu valor próprio. Oportunidades financeiras de alto nível se alinham perfeitamente com o seu magnetismo na cidade destino." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", score: 88, unlocked: false, teaser: "Suas metas profissionais avançam focadas na escala de valor.", full: "O seu crescimento profissional passa a exigir uma gestão de carreira impecável. Você começará a ser valorizado não apenas pelo esforço, mas pelo impacto financeiro que a sua expertise gera nos ambientes em que circula." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, teaser: "Sua marca pessoal se torna sinônimo de excelência e poder realizador.", full: "A forma como o mundo te enxerga atinge um nível premium. Você assume uma postura de líder com resultados inquestionáveis. A sua marca pessoal passa a atrair parceiros dispostos a investir e multiplicar a sua visão." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, teaser: "A disciplina se transforma na sua principal ferramenta de escala.", full: "A rotina caótica cede espaço para processos refinados. O segredo da sua prosperidade neste período será a automação do que não exige sua criatividade, liberando sua energia apenas para decisões financeiras e criativas de alto nível." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", score: 65, unlocked: false, teaser: "Pessoas influentes abrem portas restritas do seu mercado.", full: "Você seleciona a dedo com quem compartilha seu tempo. O ano é marcado por círculos menores, porém muito mais poderosos e focados em gerar riqueza, escalar resultados e criar estruturas sólidas de colaboração mútua." },
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, teaser: "O romance pede estabilidade, respeito ao tempo e construção conjunta.", full: "O foco sai da intensidade desmedida e vai para a confiança mútua. O relacionamento se beneficia de sonhos financeiros compartilhados e de uma parceria que traz segurança material e emocional para ambas as partes." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", score: 55, unlocked: false, teaser: "Você encontra propósito ao transformar ideias abstratas em valor material.", full: "O seu legado se torna visível. A realização espiritual acontece quando você percebe que a sua riqueza e os seus talentos estão criando não só conforto para você, mas uma base segura para apoiar projetos que refletem seus princípios." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, teaser: "A manutenção física se torna a base para aguentar o teto patrimonial.", full: "O corpo precisa de constância. Cuidar da alimentação e do sono deixam de ser luxo e passam a ser o requisito número um para você manter o pique exigido pelo volume de realizações materiais que este destino oferece." },
];

const TIMELINE = [
  { phase: "Fase 1", months: "Mês 1 a 3", title: "Mapeamento e Auditoria", desc: "Faça uma limpa saudável nas despesas desnecessárias, organize a sua estrutura de precificação e teste novas fontes de receita.", img: "/apple-mock/audio_mix__cv5tvd3y13ee_large.jpg" },
  { phase: "Fase 2", months: "Mês 4 a 8", title: "Aceleração Financeira", desc: "A fase mais forte e magnética para fechar negócios, atrair capital, precificar alto e materializar as sementes que você plantou.", img: "/apple-mock/app_actions__budci8e25k76_large.jpg", highlight: true },
  { phase: "Fase 3", months: "Mês 9 a 12", title: "Consolidação do Status", desc: "Hora de converter o faturamento em patrimônio seguro, blindar o que você construiu e elevar o seu padrão e conforto de vida.", img: "/apple-mock/photographic_styles__ef8cg39z0q2q_large.jpg" },
];

const DIMS = [
  { icon: DollarSign, label: "Dinheiro", val: 98, color: "#f59e0b" },
  { icon: Briefcase, label: "Trabalho", val: 88, color: "#10b981" },
  { icon: Crown, label: "Identidade", val: 80, color: "#c9a227" },
  { icon: Calendar, label: "Rotina", val: 72, color: "#a855f7" },
  { icon: Users, label: "Networking", val: 65, color: "#10b981" },
  { icon: Heart, label: "Amor", val: 62, color: "#f43f5e" },
  { icon: Sparkles, label: "Espiritual", val: 55, color: "#818cf8" },
  { icon: Leaf, label: "Saúde", val: 52, color: "#22c55e" },
];

export default function AppleResultPrototype() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));
  
  // DEBUG HELPER
  React.useEffect(() => {
    const handleErr = (msg, url, line, col, error) => {
      alert("RUNTIME ERROR: " + msg + " line: " + line);
    };
    window.addEventListener("error", handleErr);
    return () => window.removeEventListener("error", handleErr);
  }, []);

  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: casaProgress } = useScroll({
    target: casaRef,
    offset: ["start 90%", "start 40%"]
  });
  const textScale = useTransform(casaProgress, [0, 1], [1.4, 1]);
  const textOpacity = useTransform(casaProgress, [0, 1], [0, 1]);
  const textBlur = useTransform(casaProgress, [0, 1], ["blur(16px)", "blur(0px)"]);

  return (
    <div className="min-h-screen bg-[#02160F] text-[#f5f5f7] overflow-x-hidden font-sans bg-gradient-to-b from-[#02160F] via-[#042A1D] to-[#02160F]">
      
      {/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}
      <div className="hidden lg:block">
        <DesktopWebChrome />
      </div>
      <div className="block lg:hidden">
        <MobileAppChrome />
      </div>

      {/* ══════════════════════════════════════════════════
         1. HERO DO VÍDEO (Padrão)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Vídeo em full brightness */}
        <motion.div style={{ scale: vidScale, opacity: vidOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#02160F] z-10" />
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/assets/ny.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
           <MapPin className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">EUA</span>
        </div>

        {/* Degradê na base para proteger a transição */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#02160F] to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════════
         2. TEXTO DA CIDADE (Sobreposição Option 1)
         ══════════════════════════════════════════════════ */}
      <section ref={casaRef} className="relative z-20 -mt-[15vh] pb-12 flex flex-col items-center px-6">
        <motion.div style={{ opacity: textOpacity }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
            <span>✦</span>
            <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>
        </motion.div>
        
        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] to-emerald-200 origin-center uppercase text-center"
        >
          {P.city}
        </motion.h2>

        <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             O destino exato para{" "}
             <span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
           </p>
        </motion.div>


      </section>

      {/* ══════════════════════════════════════════════════
         3. PERSONALIZAÇÃO (ACORDEÃO)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-20 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none"></div>
               
               {/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}
               <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-8">
                    <Sparkles className="w-3 h-3" />
                    <span>Seu Resultado Personalizado</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">{P.intention}</span>.</h3>
                  <p className="text-white/50 text-center text-lg max-w-2xl mx-auto mb-16">
                    A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.
                  </p>

                  {/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}
                  <div className="w-full max-w-4xl mx-auto mb-20">
                     <div className="bg-[#02160F]/80 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col">
                       {/* Header */}
                       <div 
                         onClick={() => setIsBoardingPassOpen(!isBoardingPassOpen)}
                         className="bg-[#10b981]/10 border-b border-[#10b981]/20 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-[#10b981]/20 transition-colors select-none"
                       >
                         <div className="flex items-center gap-3">
                           <Plane className="w-5 h-5 text-[#10b981]" />
                           <span className="font-ps-display font-bold uppercase tracking-[0.25em] text-[#10b981] text-sm">Boarding Pass Solar</span>
                         </div>
                         <div className="flex items-center gap-4 md:gap-6">
                           <div className="flex items-center gap-3 hidden md:flex">
                             <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]"></div>
                             <span className="text-[#10b981]/90 font-mono text-xs tracking-widest">{P.hash} • ATIVO</span>
                           </div>
                           
                           {!isBoardingPassOpen && (
                             <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-full animate-pulse">
                               Ver Completo
                             </span>
                           )}
                           
                           <div className={`p-1 rounded-full ${!isBoardingPassOpen ? 'bg-[#10b981]/10' : ''}`}>
                             <ChevronDown className={`w-5 h-5 text-[#10b981] transition-transform duration-500 ${isBoardingPassOpen ? 'rotate-180' : ''}`} />
                           </div>
                         </div>
                       </div>

                       {/* Preview Resumo (Aparece apenas quando fechado) */}
                       <AnimatePresence initial={false}>
                         {!isBoardingPassOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden bg-[#02160F]/40 cursor-pointer"
                             onClick={() => setIsBoardingPassOpen(true)}
                           >
                             <div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-white/30" />
                                  <span className="text-white/60 text-sm font-medium">{P.origin}</span>
                                  <Plane className="w-4 h-4 text-[#10b981]/50" />
                                  <span className="text-[#10b981] font-bold text-sm uppercase">{P.city}</span>
                               </div>
                               <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <span className="flex items-center gap-2 text-white/70">
                                    <Calendar className="w-4 h-4 text-[#10b981]/70" />
                                    09 Ago, 2027
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-[#10b981] font-bold flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    {P.match}% MATCH
                                  </span>
                               </div>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                       
                       {/* Body Completo */}
                       <AnimatePresence initial={false}>
                         {isBoardingPassOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                             className="overflow-hidden origin-top"
                           >
                             <div className="p-8 md:p-10 flex flex-col gap-10">
                         {/* Viajante */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Viajante</p>
                           <p className="text-white font-serif text-3xl">{P.name}</p>
                         </div>
                         {/* Rota de Ancoragem */}
                         <div className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Rota de Ancoragem</p>
                           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                             <div className="flex-1">
                               <p className="text-white font-medium text-xl md:text-2xl flex items-center gap-2">
                                 <MapPin className="w-5 h-5 text-white/50 shrink-0"/> 
                                 <span className="truncate">{P.origin} <span className="text-white/30 text-sm ml-1">(BR)</span></span>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Origem Natal</p>
                             </div>
                             <div className="hidden md:flex flex-col items-center justify-center px-4 w-1/3">
                               <Plane className="w-6 h-6 text-[#10b981] opacity-80" />
                               <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>
                             </div>
                             <div className="md:hidden flex items-center gap-4 text-[#10b981]/50 w-full">
                               <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#10b981]/50 to-transparent ml-2.5"></div>
                               <Plane className="w-5 h-5 rotate-90" />
                             </div>
                             <div className="flex-1 md:text-right">
                               <p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2">
                                 <span className="truncate">{P.city}</span>
                                 <MapPin className="w-6 h-6 shrink-0"/>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Destino do Aniversário</p>
                             </div>
                           </div>
                         </div>
                         {/* Momento Exato */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Momento Exato da Ativação (Retorno Solar)</p>
                           <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white text-lg md:text-xl font-medium">
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Calendar className="w-5 h-5 text-[#10b981]"/> 
                               09 de Agosto, 2027
                             </span>
                             <span className="text-white/20 hidden md:inline">|</span>
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Clock className="w-5 h-5 text-[#10b981]"/> 
                               {P.time}
                             </span>
                           </div>
                         </div>
                         {/* DNA vs Ativação */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-6">
                             <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-5">DNA Astrológico</p>
                             <div className="space-y-4">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Sun className="w-5 h-5 text-yellow-400"/> Sol em {P.sign}
                               </p>
                               <p className="text-white/80 font-medium text-lg flex items-center gap-3">
                                 <ArrowUpCircle className="w-5 h-5 text-purple-400"/> Ascendente {P.ascendant}
                               </p>
                             </div>
                           </div>
                           <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent pointer-events-none"></div>
                             <p className="text-[#10b981]/70 text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10">Ativação Anual</p>
                             <div className="space-y-4 relative z-10">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Landmark className="w-5 h-5 text-[#10b981]"/> Casa {P.house}
                               </p>
                               <p className="text-[#10b981] font-bold text-xl flex items-center gap-3">
                                 <CircleDollarSign className="w-5 h-5"/> Dinheiro & Prosperidade
                               </p>
                             </div>
                           </div>
                         </div>
                         {/* Compatibilidade */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 mt-2 gap-4">
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Compatibilidade da Escolha</p>
                           <div className="flex items-center justify-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-full border border-[#10b981]/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                             <span className="text-[#10b981] font-bold tracking-widest text-lg">{P.match}% MATCH</span>
                           </div>
                         </div>
                       </div>
                       {/* Footer Barcode */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
                         <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar • 24h de Imantação na Cidade de Destino</span>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
                  
{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
                  <div className="w-full mt-10 flex flex-col lg:flex-row gap-6 min-h-[700px] text-left">
                                  {/* COLUNA ESQUERDA: SIDEBAR — expandida por padrão, encolhe pra ícones quando mouse vai pro painel */}
              <motion.div
                animate={{ width: isPanelHovered ? 72 : 300 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.15 }}
                className="hidden lg:flex shrink-0 flex-col gap-2 items-stretch min-h-[700px] overflow-hidden"
              >
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
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
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
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
                              <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${area.color || '#10b981'} 12%, #000000)`}, color-mix(in srgb, ${area.color || '#10b981'} 12%, rgba(0,0,0,0.7)) 50%, transparent)` }} />

                              {/* Conteúdo */}
                              <div className="relative z-10 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-black/20" style={{ borderColor: `${area.color}55` }}>
                                    <area.icon className="w-4 h-4" style={{ color: area.color }} />
                                  </div>
                                  <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.25em]">{area.label}</span>
                                </div>

                                {area.unlocked ? (
                                  <>
                                    <h3 className="font-ps-display text-3xl font-bold text-white leading-tight mb-4">{area.label}</h3>
                                    <div className="w-12 h-px mb-4" style={{ backgroundColor: `${area.color}80` }} />
                                    <p className="text-white/80 text-sm font-light leading-relaxed mb-6">{area.full}</p>
                                    <div
                                      className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                                      style={{ backgroundColor: area.color, color: '#fff', boxShadow: `0 0 30px ${area.color}40` }}
                                    >
                                      <Sparkles className="w-4 h-4" />
                                      Foco Ativado ✓
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <h3 className="font-ps-display text-3xl font-bold text-white/20 leading-tight mb-4 select-none" style={{ filter: 'blur(4px)' }}>{area.label}</h3>
                                    <div className="w-12 h-px mb-4 opacity-20" style={{ backgroundColor: `${area.color}80` }} />
                                    <p className="text-white/10 text-sm font-light leading-relaxed mb-6 select-none" style={{ filter: 'blur(6px)' }}>{area.full}</p>
                                    <button className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">
                                      <CreditCard className="w-4 h-4" />
                                      Desbloquear com 1 Crédito
                                    </button>
                                  </>
                                )}
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
                className="flex-1 h-[600px] lg:min-h-[700px] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || '#10b981'} 12%, #000000)` }}
              >
                <AnimatePresence mode="wait">
                  {sortedAreas.filter(a => a.id === (hoveredArea || sortedAreas[0].id)).map((activeArea) => (
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
                      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${activeArea?.color || '#10b981'} 12%, #000000)`}, color-mix(in srgb, ${activeArea?.color || '#10b981'} 12%, rgba(0,0,0,0.8)) 50%, transparent)` }} />
                      
                      {/* CONTEÚDO — muda conforme desbloqueio */}
                      <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-end h-full">
                        
                        {/* Ícone + label sempre visível */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-black/20 backdrop-blur-md" style={{ borderColor: `${activeArea.color}55` }}>
                            <activeArea.icon className="w-5 h-5" style={{ color: activeArea.color }} />
                          </div>
                          <span className="text-white/60 text-xs uppercase font-bold tracking-[0.25em]">
                            {activeArea.label}
                          </span>
                        </div>

                        {activeArea.unlocked ? (
                          <>
                            {/* DESBLOQUEADO — conteúdo completo */}
                            <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                              {activeArea.label}
                            </h3>
                            <div className="w-16 h-px mb-6" style={{ backgroundColor: `${activeArea.color}80` }} />
                            <p className="text-white/75 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl drop-shadow-md">
                              {activeArea.full}
                            </p>
                            <div
                              className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3"
                              style={{ backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` }}
                            >
                              <Sparkles className="w-4 h-4 shrink-0" />
                              Foco Ativado ✓
                            </div>
                          </>
                        ) : (
                          <>
                            {/* TRANCADO — preview embaçado + botão de crédito */}
                            <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white/20 leading-none drop-shadow-xl mb-6 select-none" style={{ filter: 'blur(6px)' }}>
                              {activeArea.label}
                            </h3>
                            <div className="w-16 h-px mb-6 opacity-20" style={{ backgroundColor: `${activeArea.color}80` }} />
                            <p className="text-white/10 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl select-none" style={{ filter: 'blur(8px)' }}>
                              {activeArea.full}
                            </p>
                            <div className="flex flex-col items-center md:items-start gap-4">
                              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
                                <Lock className="w-4 h-4 text-white/40" />
                                <span className="text-white/50 text-sm font-medium">Conteúdo personalizado bloqueado</span>
                              </div>
                              <button
                                className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
                              >
                                <CreditCard className="w-4 h-4 shrink-0" />
                                Desbloquear com 1 Crédito
                              </button>
                            </div>
                          </>
                        )}
                        
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

                  </div>
               </div>
            </div>
          
</Reveal>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════
         5. A REVELAÇÃO
         ══════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-24 border-t border-white/[0.02]">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#10b981]" />
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
                No dia <strong>{P.date}</strong>, exatamente às <strong>{P.time}</strong>, o seu Sol retorna à posição exata do seu nascimento. Ao passar este momento milimétrico nas coordenadas <span className="font-mono text-sm text-[#10b981]">[{P.coords}]</span> em <strong>{P.city}</strong>, a rotação da Terra forçará a ativação magnética da sua Casa {P.house} para os próximos 365 dias.
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#02160F] via-[#02160F]/90 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center p-12 max-w-xl">
              <Sun className="w-8 h-8 text-[#10b981] mb-6" />
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Signo Solar</p>
              <h3 className="font-ps-display text-5xl font-bold mb-6">Sol em {P.sign}.</h3>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                Magnético e inspirador. Você não persegue a prosperidade através do esforço brutal ou da competição cega. O seu próprio magnetismo atrai naturalmente recursos, clientes e oportunidades exclusivas.
              </p>
              <div className="bg-white/[0.02] border border-[#10b981]/20 p-6 rounded-2xl border-l-4 border-l-[#10b981]">
                <p className="text-white/80 text-lg font-serif italic">"A minha visão criativa gera valor real e o mundo material recompensa o meu brilho."</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4 bg-[#10b981]/10 rounded-[32px] border border-[#10b981]/20 p-10 flex flex-col justify-between min-h-[500px]">
            <div>
              <Zap className="w-8 h-8 text-[#10b981] mb-6" />
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">Ascendente da Revolução</p>
              <h3 className="font-ps-display text-4xl font-bold mb-6">{P.ascendant}.</h3>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                A segurança financeira duradoura exige gestão impecável. A sua prosperidade material este ano não virá de sorte impulsiva, mas da extrema organização.
              </p>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 mt-8 border border-white/5">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Alerta Prático</p>
              <p className="text-sm font-medium">Evite focar obsessivamente em economizar micro-gastos ao invés de estruturar novas fontes de lucro e receita.</p>
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
              <div className={`h-[500px] rounded-[32px] overflow-hidden relative group cursor-pointer border ${t.highlight ? 'border-[#10b981]/40 bg-[#10b981]/10' : 'border-white/[0.04] bg-white/[0.02]'}`}>
                <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2s]" style={{ backgroundImage: `url('${t.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02160F] via-[#02160F]/60 to-transparent" />
                
                {t.highlight && <div className="absolute top-6 right-6 z-10 bg-[#10b981] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Pico do Ano</div>}
                
                <div className="absolute bottom-10 left-10 right-10 z-10">
                  <span className={`text-[10px] font-bold uppercase tracking-widest block mb-3 ${t.highlight ? 'text-[#10b981]' : 'text-white/40'}`}>{t.phase} · {t.months}</span>
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
                <h4 className="text-red-300 font-bold mb-2">Mentalidade de Escassez</h4>
                <p className="text-white/60 text-sm leading-relaxed">O medo irreal de perder o que conquistou. Reter recursos por insegurança apenas interrompe o fluxo de abundância do universo.</p>
              </div>
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <h4 className="text-red-300 font-bold mb-2">Gastos por Compensação</h4>
                <p className="text-white/60 text-sm leading-relaxed">Utilizar compras impulsivas e objetos de luxo para preencher vazios emocionais, sabotando o seu teto patrimonial do ano.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="bg-[#10b981]/10 rounded-[32px] p-10 md:p-14 border border-[#10b981]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen className="w-8 h-8 text-[#10b981]" />
                <h2 className="font-ps-display text-3xl font-bold">O Ritual das 24h.</h2>
              </div>
              <p className="text-white/70 text-lg font-light leading-relaxed mb-8">
                Faça uma transação financeira simbólica e luxuosa. Compre algo de extremo bom gosto que represente sua prosperidade em <strong className="text-white">{P.city}</strong>. Escreva as suas 3 metas exatas de patrimônio e faturamento em um papel.
              </p>
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] text-[#10b981] uppercase tracking-widest font-bold mb-2">Ritual Extra — Ascendente {P.ascendant}</p>
                <p className="text-white/80 text-sm font-medium">Estruture a planilha matriz dos seus rendimentos, investimentos e divisão de lucros.</p>
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
              <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-[#10b981] transition-all">
                <span className="text-[#10b981] text-sm font-bold">{r.match}%</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         12. PAYWALL & FOOTER
         ══════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 text-center overflow-hidden border-t border-white/[0.04] bg-[#02160F]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <Reveal className="max-w-4xl mx-auto px-6 relative z-10">
          <Lock className="w-12 h-12 text-[#10b981] mx-auto mb-8" />
          <h2 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Dossiê Executivo.
          </h2>
          <p className="text-white/50 text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Desbloqueie todas as dimensões trancadas, o radar 360°, os pontos cegos e o plano B alternativo. O mapeamento mais profundo do seu destino.
          </p>
          <button className="bg-[#10b981] text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            Liberar Dossiê Completo
          </button>
        </Reveal>
      </section>

      <style dangerouslySetInnerHTML={{__html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
