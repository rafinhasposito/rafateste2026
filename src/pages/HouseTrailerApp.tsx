import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Briefcase, DollarSign, Leaf, Users, Calendar, Sparkles, Crown, MapPin, ChevronLeft, ChevronDown, ChevronRight, Target, Lock, Globe } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { API_URL } from "@/lib/astro";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import { cityDatabase } from "@/data/houses";
import { toast } from "sonner";
import { houseThemes } from "@/data/houseThemes";
import ScanningOverlay from "@/components/ScanningOverlay";

const P = {
  name: "Rafael",
  house: 11,
  year: 2026,
  gender: "M", // Mock data simulating user's gender
};

const LIFE_AREAS = [
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", teaser: "A escolha perfeita para quem quer viver um romance leve e sem cobranças. Favorece encontros que nascem naturalmente da amizade, da convivência em grupo e de sonhos em comum." },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981", teaser: "Desenhado sob medida para quem busca crescer sem precisar fazer tudo sozinho. O terreno é fértil para impulsionar seus projetos através de alianças e apoios do seu mercado." },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b", teaser: "A rota certa para quem precisa faturar aproveitando conexões e novos públicos. A energia estimula oportunidades financeiras que tendem a fluir por indicações e projetos colaborativos." },
  { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", teaser: "Recomendado para quem quer renovar a disposição física de forma motivadora. Convida você a criar constância em novos ambientes, esportes ao ar livre e atividades coletivas." },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#3b82f6", teaser: "O caminho ideal para abrir portas em círculos seletos e ativos. Facilita o acesso a mentores e aliados que apoiam e recomendam genuinamente suas ideias." },
  { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", teaser: "Excelente para quem quer organizar o cotidiano com leveza e colaboração. Ajuda a otimizar o dia a dia dividindo tarefas, usando tecnologia e contando com o suporte de equipe." },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#818cf8", teaser: "Para você que busca dar um significado maior aos seus projetos. Tende a despertar uma realização profunda ao colocar seus talentos a serviço de uma causa ou ecossistema." },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", teaser: "A estratégia certa se você quer ganhar destaque, relevância e simpatia pública. Ativa uma presença acolhedora e inspiradora que encoraja você a se posicionar como referência na sua tribo." },
];

// Matriz de Afinidade Astrológica: Define o Match % de cada Foco baseado na Casa
const AFFINITY_MATRIX: Record<number, Record<string, number>> = {
  1: { amor: 72, trabalho: 85, dinheiro: 75, saude: 92, networking: 68, rotina: 70, espiritual: 65, identidade: 98 },
  2: { amor: 62, trabalho: 88, dinheiro: 98, saude: 52, networking: 65, rotina: 72, espiritual: 55, identidade: 80 },
  3: { amor: 65, trabalho: 92, dinheiro: 80, saude: 58, networking: 88, rotina: 85, espiritual: 60, identidade: 72 },
  4: { amor: 82, trabalho: 60, dinheiro: 78, saude: 72, networking: 50, rotina: 75, espiritual: 88, identidade: 65 },
  5: { amor: 98, trabalho: 82, dinheiro: 75, saude: 78, networking: 70, rotina: 60, espiritual: 65, identidade: 92 },
  6: { amor: 50, trabalho: 88, dinheiro: 78, saude: 98, networking: 60, rotina: 95, espiritual: 55, identidade: 65 },
  7: { amor: 98, trabalho: 86, dinheiro: 75, saude: 55, networking: 92, rotina: 60, espiritual: 65, identidade: 72 },
  8: { amor: 88, trabalho: 80, dinheiro: 92, saude: 70, networking: 65, rotina: 55, espiritual: 85, identidade: 78 },
  9: { amor: 72, trabalho: 88, dinheiro: 75, saude: 70, networking: 82, rotina: 58, espiritual: 98, identidade: 80 },
  10: { amor: 58, trabalho: 98, dinheiro: 88, saude: 55, networking: 80, rotina: 72, espiritual: 68, identidade: 95 },
  11: { amor: 72, trabalho: 90, dinheiro: 85, saude: 62, networking: 98, rotina: 68, espiritual: 78, identidade: 80 },
  12: { amor: 70, trabalho: 60, dinheiro: 65, saude: 88, networking: 50, rotina: 80, espiritual: 98, identidade: 75 },
};

export default function HouseTrailerApp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlHouse = searchParams.get("house");
  
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);
  const [currentHouse, setCurrentHouse] = useState(() => {
    const parsed = urlHouse ? parseInt(urlHouse, 10) : P.house;
    return Number.isFinite(parsed) && parsed >= 1 && parsed <= 12 ? parsed : P.house;
  });

  useEffect(() => {
    if (urlHouse) {
      const parsed = parseInt(urlHouse, 10);
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 12) {
        setCurrentHouse(parsed);
      }
    }
  }, [urlHouse]);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (_) {
      // Ignore scroll errors on older WebKit
    }
    
    const timeout = setTimeout(() => {
      try {
        window.scrollTo(0, 0);
      } catch (_) {}
    }, 50);

    return () => clearTimeout(timeout);
  }, [currentHouse, urlHouse]);


  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();

  const handleRevelarCidades = async (unlockFullMap: boolean = false) => {
    const id = searchParams.get('id');
    if (id) {
      navigate(`/dashboard?id=${id}`);
      return;
    }

    const target = currentHouse;
    const name = sessionStorage.getItem('ps_natal_name') || profile?.full_name || '';
    const birthdate = sessionStorage.getItem('ps_natal_date') || profile?.birth_date || '';
    const birthtime = sessionStorage.getItem('ps_natal_time') || (profile?.birth_time ? profile.birth_time.slice(0, 5) : '');
    const birthPlace = sessionStorage.getItem('ps_natal_place') || profile?.birth_city || '';
    const yearStr = sessionStorage.getItem('ps_natal_year');
    const mode = sessionStorage.getItem('ps_natal_mode') || searchParams.get('mode') || 'futuro';

    if (!target) return;

    if (!name || !birthdate || !birthtime || !birthPlace) {
      toast.error("Complete seus dados de nascimento na tela inicial para revelar suas cidades.");
      navigate('/? calculate=true'.replace(' ', ''));
      return;
    }

    if (!user) {
      toast.error("Entre na sua conta para revelar as cidades do seu mapa.");
      navigate("/auth");
      return;
    }

    const requiredCredits = unlockFullMap ? 7 : 1;
    if (!isAdmin && (profile?.credits ?? 0) < requiredCredits) {
      if (unlockFullMap) {
        toast.info("Ative o Pacote Mapa Completo (7 Créditos) para desbloquear todas as 12 Casas de uma vez!");
        navigate("/credits?pkg=full");
      } else {
        toast.error("Você não possui créditos suficientes. Adquira seu crédito avulso ou o Mapa Completo.");
        navigate("/credits");
      }
      return;
    }

    setIsProcessing(true);

    try {
      const houseData0 = cityDatabase[target];
      const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
      const description = unlockFullMap
        ? `Mapa Completo (12 Casas) — Foco Inicial Casa ${target} (${houseData0?.label ?? ""}) em ${year}`
        : `Consulta por Área da Vida — Casa ${target} (${houseData0?.label ?? ""}) em ${year}`;

      const charge = await chargeConsultation({
        userId: user.id,
        currentCredits: profile?.credits ?? 0,
        isAdmin,
        description,
        amount: requiredCredits,
      });

      if (!charge.ok) {
        if (charge.reason === "no_credits") {
          toast.error("Você não possui créditos suficientes. Adquira mais na loja.");
          navigate(unlockFullMap ? "/credits?pkg=full" : "/credits");
        } else {
          toast.error("Erro ao debitar créditos.");
        }
        setIsProcessing(false);
        return;
      }
      
      await refreshProfile();

      const [ano, mes, dia] = birthdate.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const response = await fetch(`${API_URL}/find_all_cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          place_of_birth: birthPlace.trim(),
          dob: dataFormatada,
          time: birthtime,
          target_year: year,
          alvoId: target,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta astronômica.");

      const allResults = data.results || {};

      const houseIntent = houseData0?.intent || "";
      const allTwelveHouses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      const consultationId = await saveConsultation({
        userId: user.id,
        name: name.trim(),
        birthdate,
        birthtime,
        birth_place: birthPlace.trim(),
        year: year.toString(),
        mode,
        goal: target,
        intent: selectedIntention || houseIntent,
        houses_unlocked: unlockFullMap ? 12 : 1,
        unlocked_houses: unlockFullMap ? allTwelveHouses : [target],
        result: {
          results: allResults,
          house: target,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null,
          ...(unlockFullMap ? { full_map_unlocked: true, unlocked_houses_list: allTwelveHouses } : {}),
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      if (consultationId) {
        navigate("/dashboard?id=" + consultationId);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error("Falha na consulta: " + err.message);
      setIsProcessing(false);
    }
  };
  const theme = houseThemes[currentHouse] || houseThemes[11];
  
  // Ordena as áreas de vida pelo Match % baseado na casa atual
  const sortedAreas = [...LIFE_AREAS].map(area => ({
    ...area,
    score: AFFINITY_MATRIX[currentHouse]?.[area.id] || 50
  })).sort((a, b) => b.score - a.score);

  // Garante que o foco de maior afinidade já venha pré-selecionado para exibir a barra de ação imediatamente
  const activeIntentionId = selectedIntention || sortedAreas[0]?.id || "identidade";

  const handleSelectIntention = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIntention(id);
  };

  // Cores dinâmicas injetadas via color-mix para garantir um fundo rico que herda a cor da casa
  const bgBase = `color-mix(in srgb, ${theme.themeColor} 12%, #000000)`;
  const navBg = `color-mix(in srgb, ${theme.themeColor} 10%, rgba(0,0,0,0.6))`;
  const heroGradient = `linear-gradient(to bottom, transparent, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.8)) 60%, ${bgBase} 100%)`;

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white/10 pb-36 relative transition-colors duration-1000 pt-16 md:pt-20" style={{ backgroundColor: bgBase }}>

      {/* TOP BAR COM BOTÃO VOLTAR */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between" style={{ backgroundColor: navBg }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-semibold uppercase tracking-[0.16em] text-white/90 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
          Casa {String(currentHouse).padStart(2, "0")} • {theme.subtitle}
        </span>
      </div>

      {/* HERO E VÍDEO (EXATAMENTE COMO NO FINAL) */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-16">
        <div className="w-[100vw] absolute left-1/2 -translate-x-1/2 top-0 h-[100vh] z-0 pointer-events-none" style={{ maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)" }}>
          
          {/* TINT OVERLAY PARA O VÍDEO */}
          <div className="absolute inset-0 z-10 mix-blend-color transition-colors duration-1000" style={{ backgroundColor: theme.themeColor }} />
          
          <video autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-screen opacity-20 grayscale">
            <source src="/videos/teste-fundo.mp4" type="video/mp4" />
          </video>
        </div>
        <motion.div className="absolute inset-0 z-10 pointer-events-none transition-colors duration-1000" style={{ background: heroGradient }} />

        <motion.div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h1 className="text-[140px] md:text-[220px] font-ps-display font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 uppercase pb-6 md:pb-12" style={{ filter: `drop-shadow(0px 20px 40px ${theme.themeColor}33)` }}>
              Casa {currentHouse}
            </h1>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-3xl font-ps-display font-light tracking-tight text-white/80 mt-[-30px] md:mt-[-60px]">
            {theme.subtitle}
          </motion.h2>
        </motion.div>

        {/* ENERGIA DO ANO */}
        <motion.div className="relative z-20 mt-32 max-w-4xl mx-auto px-6">

          {/* Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ color: theme.themeColor }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-10 text-center"
          >
            A Energia do Ano
          </motion.span>

          {/* Headline — palavra por palavra (usando o primeiro parágrafo real com coloração na parte final) */}
          <p className="text-3xl md:text-5xl font-light text-white/90 leading-tight mb-20 text-center">
            {theme.energyIntro.split(' ').map((word, i, arr) => {
              const splitIndex = Math.floor(arr.length * 0.55); // Colore os últimos 45% da frase
              const isColored = i >= splitIndex;
              return (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} 
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.16,1,0.3,1] }} 
                  style={isColored ? { color: theme.themeColor } : {}}
                  className={`inline-block mr-[0.25em] ${isColored ? 'font-medium' : ''}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </p>

          {/* Statements empilhados (Demais parágrafos do NotebookLM) */}
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {theme.energyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.9 + i * 0.18, ease: [0.16,1,0.3,1] }}
                className="flex items-start gap-8 py-8 group"
              >
                <span className="font-ps-display text-5xl md:text-6xl font-bold text-white/[0.07] transition-colors duration-500 leading-none shrink-0 w-16 text-right group-hover:opacity-60" style={{ color: theme.themeColor }}>
                  0{i+1}
                </span>
                <div className="flex-1 mt-1">
                  <h4 className="text-xl md:text-2xl font-ps-display font-bold text-white/90 mb-2 group-hover:text-white transition-colors duration-300">
                    {point.title}
                  </h4>
                  <p className="text-white/40 text-sm md:text-base font-light leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {point.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* PARA QUEM É A CASA X & ACCORDION (O layout Apple) */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-6 mt-10">
        
        {/* PARA QUEM É A CASA X? */}
        <motion.div className="w-full backdrop-blur-3xl border border-white/[0.05] rounded-[28px] p-8 md:p-12 mb-20 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden mt-20 transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${theme.themeColor} 18%, rgba(0,0,0,0.8))` }}>
          <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] transition-all duration-500" style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.themeColor}80, transparent)` }} />
          
          <div className="mt-4 flex flex-col items-center">
            <span style={{ color: theme.themeColor }} className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 transition-colors duration-500">Para Quem É A Casa {currentHouse}?</span>
            <h3 className="font-ps-display text-2xl md:text-3xl font-bold mb-2 text-center">Esta viagem é para você que...</h3>
            <p className="text-white/40 text-xs font-light mb-10 text-center">Identifique-se com ao menos um dos cenários abaixo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 w-full max-w-3xl mt-12">
            {theme.personas.map(({ text, avatarM, avatarF }, i) => (
              <motion.div
                key={i}
                whileHover={{ borderColor: `${theme.themeColor}4d`, backgroundColor: `${theme.themeColor}0a` }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col items-center text-center gap-2 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] cursor-default group"
              >
                {/* Efeitos visuais do card restritos as bordas */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  {/* Linha de destaque no topo */}
                  <div className="absolute top-0 left-6 right-6 h-px transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.themeColor}80, transparent)` }} />
                  {/* Glow sutil no topo no hover */}
                  <div className="absolute top-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.themeColor}26 0%, transparent 100%)` }} />
                </div>

                {/* Memoji centralizado dentro do card */}
                <div className="relative z-20 w-32 h-32 mb-4">
                  <div className="absolute inset-0 rounded-full blur-[20px] transition-colors duration-300" style={{ backgroundColor: `${theme.themeColor}0d` }} />
                  <img 
                    src={`/memojis/${P.gender === 'M' ? avatarM : avatarF}`} 
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest mb-8" style={{ color: theme.themeColor }}>
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
                              <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${bgBase}, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.7)) 50%, transparent)` }} />

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


              {/* COLUNA DIREITA: O PAINEL DE CINEMA — apenas desktop (hidden lg:block) para não duplicar no mobile */}
              <motion.div
                layout
                onMouseEnter={() => setIsPanelHovered(true)}
                onMouseLeave={() => setIsPanelHovered(false)}
                className="hidden lg:block flex-1 h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: bgBase }}
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
                      <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: activeArea.color }} />
                      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${bgBase}, color-mix(in srgb, ${theme.themeColor} 12%, rgba(0,0,0,0.8)) 50%, transparent)` }} />
                      
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
                            className={`w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${activeIntentionId !== activeArea.id && 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 hover:bg-gray-100'}`}
                            style={activeIntentionId === activeArea.id ? { backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` } : {}}
                          >
                            {activeIntentionId === activeArea.id ? <Sparkles className="w-4 h-4 shrink-0" /> : <Target className="w-4 h-4 shrink-0" />}
                            {activeIntentionId === activeArea.id ? 'Foco Ativado ✓' : 'Ativar Este Foco'}
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
      
      {/* STICKY BOTTOM BAR (Sempre acessível com o Foco Principal ou o Foco Escolhido) */}
      <AnimatePresence>
        {activeIntentionId && (() => {
          const chosen = LIFE_AREAS.find(a => a.id === activeIntentionId) || sortedAreas[0];
          const color = chosen?.color || '#C9A227';
          return (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 w-full z-50 p-3 md:p-6 pointer-events-none"
            >
              <div className="max-w-5xl mx-auto pointer-events-auto">
                <div className="backdrop-blur-xl transition-colors duration-1000 border border-white/15 p-4 md:p-6 rounded-2xl shadow-[0_-20px_80px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-3 md:gap-4" style={{ backgroundColor: navBg }}>
                  
                  <div className="flex items-center gap-3.5 flex-[1_1_16rem] min-w-0">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
                      <Sparkles className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-ps-display text-base md:text-lg font-bold leading-tight">
                        Foco: {chosen?.label || `Casa ${currentHouse}`}
                      </h4>
                      <p className="text-white/65 text-xs md:text-sm">Escolha revelar as cidades desta Casa ou desbloquear seu Mapa Completo (12 Casas).</p>
                    </div>
                  </div>

                  <div className="grid flex-[2_1_36rem] min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-2.5">
                    <button 
                      onClick={() => handleRevelarCidades(false)}
                      disabled={isProcessing}
                      className="px-6 py-3.5 font-bold uppercase tracking-widest text-xs md:text-sm rounded-full hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-white"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 32px ${color}55`,
                      }}
                    >
                      <Globe className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{isProcessing ? 'Calculando...' : 'Revelar Cidades'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-black/25 text-[10px] font-bold tracking-wider">
                        1 Créd.
                      </span>
                    </button>

                    <button 
                      onClick={() => handleRevelarCidades(true)}
                      disabled={isProcessing}
                      className="px-5 py-3.5 font-bold uppercase tracking-widest text-xs md:text-sm rounded-full border border-[#E5C158]/60 bg-[#E5C158]/15 hover:bg-[#E5C158]/25 text-[#F6D97A] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(229,193,88,0.2)]"
                    >
                      <Sparkles className="w-4 h-4 shrink-0 text-[#E5C158]" />
                      <span>Desbloquear Mapa Completo</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E5C158]/25 text-[#F6D97A] text-[10px] font-bold tracking-wider">
                        12 Casas • 7 Créd.
                      </span>
                    </button>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <ScanningOverlay visible={isProcessing} mode="futuro" />
    </div>
  );
}
