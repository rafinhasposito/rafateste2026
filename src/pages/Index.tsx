import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll, Hourglass, Sun, Compass, ChevronLeft, ChevronRight, User, Edit2, Sparkles } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import ScanningOverlay from "@/components/ScanningOverlay";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import CityLookup from "@/components/CityLookup";
import HouseLookup from "@/components/HouseLookup";
import IntentLookup from "@/components/IntentLookup";
import { TemporalSelection } from "@/components/TemporalSelection";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { detectUserLocation } from "@/lib/astro";

type Mode = "futuro" | "passado" | "presente";
type SearchPath = "cidade" | "casa" | "intencao" | null;

const modeThemes: Record<Mode, { accent: string; rgb: string; glow: string; border: string; bg: string; video: string }> = {
  passado: { accent: "#94A3B8", rgb: "148, 163, 184", glow: "rgba(148,163,184,0.3)", border: "rgba(148,163,184,0.4)", bg: "rgba(148,163,184,0.08)", video: "/videos/passado.mp4" },
  presente: { accent: "#10B981", rgb: "16, 185, 129", glow: "rgba(16,185,129,0.3)", border: "rgba(16,185,129,0.4)", bg: "rgba(16,185,129,0.08)", video: "/videos/presente.mp4?v=2" },
  futuro: { accent: "#FACC15", rgb: "250, 204, 21", glow: "rgba(250,204,21,0.3)", border: "rgba(250,204,21,0.4)", bg: "rgba(250,204,21,0.08)", video: "/videos/futuro.mp4?v=2" },
};

const modeCardColors: Record<Mode, { rgb: string }> = {
  passado: { rgb: "148, 163, 184" },
  presente: { rgb: "16, 185, 129" },
  futuro: { rgb: "250, 204, 21" },
};

const mantras = [
  "Você desperta como Cocriador da sua realidade.",
  "O destino não é fixo — é uma coordenada a ser escolhida.",
  "Onde você ancora o seu Sol, define os próximos 12 meses.",
  "O universo respeita quem se move com propósito.",
  "A posição geográfica dita a frequência do seu ano.",
];

const stats = [
  { value: "12", label: "Casas Astrológicas" },
  { value: "365", label: "Dias Calculados" },
  { value: "±0.01°", label: "Precisão GPS" },
];

const modeOptions = [
  {
    id: "passado" as Mode,
    icon: Hourglass,
    title: "Passado",
    desc: "Descubra qual área da vida esteve em destaque no seu último aniversário.",
    tagline: "Revisar o ano que passou",
  },
  {
    id: "presente" as Mode,
    icon: Sun,
    title: "Presente",
    desc: "Veja o que está guiando o seu ano agora — a partir de onde você passou seu aniversário.",
    tagline: "Entender o momento atual",
  },
  {
    id: "futuro" as Mode,
    icon: Compass,
    title: "Futuro",
    desc: "Escolha onde passar seu próximo aniversário e descubra o que cada cidade coloca em destaque.",
    tagline: "Planejar o próximo ano",
  },
];

const pathOptions = [
  {
    id: "cidade" as SearchPath,
    icon: MapPin,
    title: "Por Cidade",
    desc: "Já tenho um destino em mente.",
  },
  {
    id: "casa" as SearchPath,
    icon: Crown,
    title: "Por Área da Vida",
    desc: "Quero focar em dinheiro, amor, carreira ou saúde.",
  },
  {
    id: "intencao" as SearchPath,
    icon: Scroll,
    title: "Por Objetivo do Ano",
    desc: "Sei o que quero viver e quero descobrir as melhores cidades.",
  },
];

const currentYear = new Date().getFullYear().toString();

const Index = () => {
  const { showAlert } = useAlert();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [mode, setMode] = useState<Mode | null>(null);

  // --- ONBOARDING FIRST ACCESS LOGIC ---
  useEffect(() => {
    // PROTEÇÃO P0 AUTH: Aguarda o Supabase ler a URL e extrair os tokens OAuth (senão o navigate apaga o hash)
    if (loading) return;

    if (searchParams.get("resetOnboarding") === "true") {
      localStorage.removeItem("ps_onboarding_completed");
      navigate("/", { replace: true });
      return;
    }
    const isSearchCrawler =
      typeof navigator !== "undefined" &&
      /bot|googlebot|crawler|spider|robot|crawling|lighthouse|facebookexternalhit|whatsapp|twitterbot|linkedinbot/i.test(
        navigator.userAgent
      );
    const hasCompleted = localStorage.getItem("ps_onboarding_completed");
    if (!hasCompleted && !isSearchCrawler) {
      navigate("/app/onboarding", { replace: true });
    }
  }, [searchParams, navigate, loading]);
  // -------------------------------------
  const [isScanning, setIsScanning] = useState(false);
  const [searchPath, setSearchPath] = useState<SearchPath>(null);

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthPlaceValid, setBirthPlaceValid] = useState(false);
  const [year, setYear] = useState("2026");

  const [submitted, setSubmitted] = useState(false);
  const [mantraIndex, setMantraIndex] = useState(0);

  const isNatalProfileComplete = (p: any) => !!(p?.full_name && p?.birth_date && p?.birth_time && p?.birth_city);

  // Auto-seleciona modo caso venha do Onboarding (?mode=passado|presente|futuro) ou via pendingMode
  useEffect(() => {
    let targetMode = searchParams.get("mode") as Mode | null;
    const targetPath = searchParams.get("path") as SearchPath | null;
    
    if (!targetMode) {
      targetMode = sessionStorage.getItem("ps_pending_mode") as Mode | null;
      if (targetMode && user) {
        sessionStorage.removeItem("ps_pending_mode");
      } else if (!user) {
        targetMode = null; // Wait for login
      }
    }

    if (targetMode && ["passado", "presente", "futuro"].includes(targetMode)) {
      if (user && !loading && !isNatalProfileComplete(profile)) {
         const ret = targetPath ? `/?mode=${targetMode}&path=${targetPath}` : `/?mode=${targetMode}`;
         navigate(`/perfil?returnTo=${encodeURIComponent(ret)}`);
         return;
      }
      setMode(targetMode);
      if (targetMode === "presente") setYear(currentYear);
      
      if (targetPath && ["cidade", "casa", "intencao"].includes(targetPath)) {
        setSearchPath(targetPath);
        setStep(3);
      } else {
        setStep(2);
      }
      
      setTimeout(() => {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams, user, profile, loading, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMantraIndex((i) => (i + 1) % mantras.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync profile data to local state for the lookup components
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !name) setName(profile.full_name);
      if (profile.birth_date && !birthdate) setBirthdate(profile.birth_date);
      if (profile.birth_time && !birthtime) {
        const t = String(profile.birth_time).slice(0, 5);
        // Don't auto-fill "00:00" — backend rejects it. Leave blank so user fills in real time.
        if (t !== "00:00") setBirthtime(t);
      }
      if (profile.birth_city && !birthPlace) {
        setBirthPlace(profile.birth_city);
        setBirthPlaceValid(true);
      }
    }
  }, [profile]);

  const handleSelectMode = (m: Mode) => {
    // 1. Se onboarding não foi completado → onboarding primeiro (com modo salvo)
    const hasOnboarding = localStorage.getItem("ps_onboarding_completed");
    if (!hasOnboarding) {
      sessionStorage.setItem("ps_pending_mode", m);
      navigate("/app/onboarding");
      return;
    }
    // 2. Onboarding completo mas sem login → auth (modo preservado)
    if (!user) {
      sessionStorage.setItem("ps_pending_mode", m);
      navigate("/auth");
      return;
    }
    // 3. Logado mas sem perfil natal → completar perfil
    if (!isNatalProfileComplete(profile)) {
      navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${m}`)}`);
      return;
    }
    // 4. Tudo OK → ir direto para o formulário
    setMode(m);
    setSearchPath(null);
    if (m === "presente") setYear(currentYear);
    setStep(2);
  };

  const handleSelectPath = (p: SearchPath) => {
    setSearchPath(p);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setSearchPath(null);
      setStep(2);
    } else if (step === 2) {
      setMode(null);
      setStep(1);
    }
  };

  const natalDataReady = !!(name.trim() && birthdate && birthtime && birthPlaceValid);

  const yearLabel =
    mode === "passado" ? "Ano a Auditar" :
    mode === "presente" ? "Ano Atual" :
    "Ano do Próximo Aniversário";

  const formTitle =
    mode === "passado" ? "Resgate da Linha do Tempo" :
    mode === "presente" ? "Análise do Ciclo Atual" :
    "Calibração Estelar";

  const formSubtitle = isNatalProfileComplete(profile)
    ? searchPath === "cidade"
      ? "Seus dados de nascimento já estão ancorados no sistema. Qual cidade você deseja simular para o seu próximo aniversário?"
      : searchPath === "casa"
      ? "Seus dados natais estão prontos. Escolha o objetivo astrológico que deseja focar neste ano."
      : "Seus dados natais estão prontos. Escolha a sua intenção principal para o próximo ciclo."
    : mode === "passado"
      ? "Insira suas coordenadas natais e o ano que deseja auditar para descobrir o que o Universo havia preparado para você."
      : mode === "presente"
      ? "Insira suas coordenadas natais para analisar a configuração energética do seu ano atual."
      : "Insira suas coordenadas natais para que o algoritmo astrofísico calcule a rota exata da sua prosperidade.";

  const activeTheme = mode ? modeThemes[mode] : null;

  return (
    <>
      <StarryBackground />
      <ScanningOverlay visible={isScanning} mode={mode || "futuro"} year={year} />

      {/* ===== STEP 1: Temporal Selection — FULLSCREEN, outside the container ===== */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TemporalSelection onSelectMode={handleSelectMode} />
          </motion.div>
        )}

        {/* ===== STEP 2: Method Selection ===== */}
        {step === 2 && (
          <motion.div 
            key="step2-root" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            transition={{ duration: 0.3 }} 
            className="pt-24 md:pt-32 pb-40 md:pb-20 flex flex-col items-center w-full px-6 sm:px-8 max-w-lg md:max-w-5xl mx-auto min-h-[100svh] relative"
          >
            {/* Fundo Celestial Limpo — Sem cor de pântano */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {/* Gradiente sutil escuro */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#02050A] via-[#040814] to-[#02050A]" />
                  {/* Aura suave cósmica */}
                  <div 
                    className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[100vw] max-w-[800px] h-[450px] opacity-20 blur-[130px] rounded-full pointer-events-none transition-colors duration-1000"
                    style={{ backgroundColor: theme ? `rgb(${theme.rgb})` : '#C9A227' }} 
                  />
                </div>
              );
            })()}

            {/* Wrapper Centralizado */}
            <div className="w-full flex flex-col items-center relative z-10">
              
              {/* Header da Seção: Voltar + Badge em harmonia */}
              <div className="w-full flex items-center justify-between mb-8 sm:mb-10">
                {/* Botão Voltar */}
                <button 
                  onClick={() => setStep(1)} 
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl transition-all text-white/70 hover:text-white text-[11px] tracking-[0.18em] uppercase font-medium active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>

                {/* Badge Topo */}
                {(() => {
                  const theme = mode ? modeThemes[mode] : null;
                  const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Compass;
                  return (
                    <div 
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 backdrop-blur-xl"
                    >
                      <ModeIcon className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E5C158]">
                        {modeOptions.find(m => m.id === mode)?.title}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Headings - Tipografia com respiro */}
              <div className="text-center mb-6 sm:mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-ps-display text-white mb-2.5 tracking-tight leading-tight">
                  Pronto, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5DE98] to-[#C9A227]">{profile?.full_name?.split(' ')[0] || profile?.display_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Viajante'}</span>?
                </h1>
                <p className="text-white/65 text-sm sm:text-base font-ps-ui max-w-md mx-auto font-light leading-relaxed">
                  Escolha por onde você prefere começar a planejar seu próximo aniversário.
                </p>
              </div>

              {/* Cards: Luxury Majestic Cards with Generous Breathing Room */}
              <div className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-3 md:gap-6 w-full">
                {(() => {
                   return pathOptions.map((opt) => {
                     const Icon = opt.icon;
                     const cardDesc = 
                        opt.id === "cidade" ? "Já tem uma viagem ou cidade em mente? Veja o que passar a virada do seu aniversário lá ativa no seu ano." :
                        opt.id === "casa" ? "Escolha a área que você quer priorizar agora: dinheiro, amor, carreira, saúde, visibilidade ou recomeço." :
                        "Diga o que você quer destravar nos próximos 12 meses e descubra as melhores cidades do mundo para isso.";
                     
                     const cardTag =
                        opt.id === "cidade" ? "Já tenho destino" :
                        opt.id === "casa" ? "12 Áreas (Casas)" :
                        "Metas & Desejos";

                     const cardAction =
                        opt.id === "cidade" ? "Testar uma Cidade" :
                        opt.id === "casa" ? "Escolher Área da Vida" :
                        "Definir Objetivo";

                     return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="relative w-full overflow-hidden rounded-3xl border border-[#C9A227]/35 hover:border-[#C9A227]/75 bg-gradient-to-b from-[#0F1C36]/90 via-[#091222]/95 to-[#040812]/98 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between text-left p-5 sm:p-6 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_16px_40px_rgba(0,0,0,0.6)]"
                        >
                          {/* Filete superior de luz dourada */}
                          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5C158]/50 to-transparent transition-opacity duration-500" />
                          
                          {/* Top Row: Ícone + Categoria Tag */}
                          <div className="w-full flex items-center justify-between mb-3.5 md:mb-5">
                            <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 border border-[#C9A227]/40 flex items-center justify-center text-[#F5DE98] shadow-[0_0_20px_rgba(201,162,39,0.18)] group-hover:scale-105 transition-transform duration-300">
                              <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.75} />
                            </div>

                            <span className="px-3 py-1 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 text-[#F5DE98] text-[9px] uppercase tracking-[0.18em] font-semibold">
                              {cardTag}
                            </span>
                          </div>

                          {/* Conteúdo textual com respiro nobre */}
                          <div className="flex-1 w-full mb-4 md:mb-6">
                            <h3 className="font-ps-display text-xl sm:text-2xl md:text-2xl text-white font-medium mb-1.5 md:mb-2.5 tracking-wide group-hover:text-[#F5DE98] transition-colors">
                              {opt.title}
                            </h3>
                            <p className="font-ps-ui text-white/75 text-xs sm:text-sm font-light leading-relaxed">
                              {cardDesc}
                            </p>
                          </div>

                          {/* Botão de ação explícito luxuoso */}
                          <div className="w-full py-2.5 md:py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A227]/15 via-[#C9A227]/8 to-[#C9A227]/15 border border-[#C9A227]/30 group-hover:border-[#C9A227]/60 group-hover:from-[#C9A227]/25 group-hover:to-[#C9A227]/20 flex items-center justify-between text-[#F5DE98] text-[11px] md:text-xs font-ps-ui uppercase tracking-[0.16em] font-semibold transition-all shadow-[0_4px_16px_rgba(201,162,39,0.08)]">
                            <span>{cardAction}</span>
                            <ChevronRight className="w-4 h-4 text-[#E5C158] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.button>
                     );
                   });
                })()}
              </div>

              {/* Guia / Onboarding Banner de Apoio */}
              <div className="w-full mt-8 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
                <div>
                  <h4 className="text-sm font-ps-display text-white tracking-wide">Primeira vez por aqui?</h4>
                  <p className="text-xs font-ps-ui text-white/60 mt-0.5">Veja o guia rápido de 1 minuto ou entenda como funciona o cálculo.</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link 
                    to="/app/onboarding" 
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-ps-ui font-medium transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> 
                    <span>Guia Rápido</span>
                  </Link>
                  <Link 
                    to="/tecnologia" 
                    className="px-3.5 py-2 rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#F5DE98] text-xs font-ps-ui font-medium transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" /> 
                    <span>Como Funciona</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== STEP 3 ===== */}
        {step === 3 && (
          <motion.div key="step3-root" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.3 }}
            className="pt-20 md:pt-28 pb-36 md:pb-24 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh] relative overflow-hidden">

            {/* ── Fundo Cósmico Profundo (Mesma linguagem de luxo do Step 2) ── */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              const rgb = theme ? theme.rgb : "201, 162, 39";
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#040914] via-[#060D1A] to-[#02050A]" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(${rgb}, 0.16) 0%, rgba(14, 28, 54, 0.35) 55%, transparent 100%)`,
                    }}
                  />
                  <div
                    className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[850px] h-[45vh] opacity-15 blur-[130px] rounded-full"
                    style={{ backgroundColor: `rgb(${rgb})` }}
                  />
                </div>
              );
            })()}

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 pt-2 md:pt-6">

              {/* ── Nav Row — Voltar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex justify-start mb-5 md:mb-10">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl transition-all duration-300 text-white/80 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold active:scale-95">
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              </motion.div>

              {/* ── Dados de Nascimento — Apple Glass Card ── */}
              {isNatalProfileComplete(profile) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-4 md:gap-6 px-5 sm:px-8 py-4 sm:py-5 rounded-3xl border mb-6 md:mb-10 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  style={{
                    borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.25)` : 'rgba(201,162,39,0.25)',
                    background: 'rgba(8, 16, 30, 0.75)'
                  }}>
                  <div className="flex flex-wrap gap-6 sm:gap-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/45">Viajante</span>
                      <span className="font-ps-display text-white/95 text-base sm:text-lg tracking-wide">{profile?.full_name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/45">Cidade de Nascimento</span>
                      <span className="font-ps-ui text-white/75 text-xs sm:text-sm">{profile?.birth_city}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/45">Nascimento</span>
                      <span className="font-ps-ui text-white/75 text-xs sm:text-sm">{profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0,5)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
                    style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#F5DE98' }}>
                    Editar
                  </button>
                </motion.div>
              )}

              {/* ── ANO HERO — Design Luxo com Controles Claros ── */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="flex flex-col items-center mb-6 md:mb-10 relative w-full">
                <span className="text-[10px] uppercase tracking-[0.42em] font-bold mb-2 md:mb-3 text-[#F5DE98]">
                  {mode === "passado" ? "Ano que Você Quer Rever" : mode === "presente" ? "Seu Ciclo Atual" : "Ano do Seu Aniversário"}
                </span>
                <div className="relative flex items-center justify-center gap-3 sm:gap-6">
                  {mode !== "presente" && (
                    <button
                      type="button"
                      aria-label="Ano anterior"
                      onClick={() => setYear(String((parseInt(year, 10) || new Date().getFullYear()) - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A227]/35 bg-[#091324]/90 hover:bg-[#10203A] hover:border-[#C9A227]/70 text-[#F5DE98] flex items-center justify-center text-xl font-light transition-all active:scale-90 shadow-lg shrink-0"
                    >
                      −
                    </button>
                  )}
                  <input
                    type="number"
                    aria-label="Ano do aniversário"
                    className="year-hero-input text-center text-6xl sm:text-8xl md:text-[120px] font-ps-display bg-transparent border-b border-[#C9A227]/30 focus:border-[#C9A227] outline-none font-bold tracking-tight leading-none w-44 sm:w-64 md:w-80 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{
                      background: 'transparent',
                      color: '#F5DE98',
                      textShadow: '0 4px 32px rgba(201, 162, 39, 0.35)',
                    }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={mode === "presente"}
                  />
                  {mode !== "presente" && (
                    <button
                      type="button"
                      aria-label="Próximo ano"
                      onClick={() => setYear(String((parseInt(year, 10) || new Date().getFullYear()) + 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A227]/35 bg-[#091324]/90 hover:bg-[#10203A] hover:border-[#C9A227]/70 text-[#F5DE98] flex items-center justify-center text-xl font-light transition-all active:scale-90 shadow-lg shrink-0"
                    >
                      +
                    </button>
                  )}
                </div>
                {mode === "presente" ? (
                  <div className="mt-3 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="text-[9px] uppercase tracking-widest text-white/60">Ciclo Atual Fixado</span>
                  </div>
                ) : (
                  <span className="mt-2 text-[10px] font-ps-ui text-white/45 tracking-wide">
                    Use os botões ou toque no número para mudar o ano
                  </span>
                )}
              </motion.div>

              {/* ── Pergunta ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full text-center mb-6 md:mb-10 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-ps-display text-white leading-tight tracking-tight drop-shadow-2xl">
                  {searchPath === 'cidade' ? 'Qual cidade você quer consultar?'
                    : searchPath === 'casa' ? 'Qual área da vida você quer priorizar?'
                    : 'O que você quer viver neste novo ciclo?'}
                </h1>
              </motion.div>

              {/* ── Campo de busca — Full width ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-2xl">
                {searchPath === "cidade" && (
                  <CityLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                )}
                {searchPath === "casa" && (
                  <HouseLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                )}
                {searchPath === "intencao" && (
                  <IntentLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                )}
              </motion.div>

              {/* Perfil de nascimento incompleto — Card convidativo em vez de erro vermelho */}
              {!isNatalProfileComplete(profile) && (
                <div className="mt-6 w-full max-w-2xl rounded-2xl border border-[#C9A227]/35 bg-[#081222]/90 backdrop-blur-xl p-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                  <p className="text-[#F5DE98] font-ps-display text-sm sm:text-base mb-1">
                    Falta só um detalhe: seus dados de nascimento
                  </p>
                  <p className="text-white/65 font-ps-ui text-xs mb-3.5 max-w-md mx-auto leading-relaxed">
                    Para calcular sua rota com precisão, precisamos da sua data, horário exato e cidade onde você nasceu.
                  </p>
                  <button
                    onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                    className="px-5 py-2.5 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/45 text-[#F5DE98] text-[11px] font-ps-ui uppercase tracking-[0.16em] font-semibold transition-all active:scale-95"
                  >
                    Preencher Dados de Nascimento →
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust badges — in-flow at the bottom of steps 2 and 3 */}
      {(step === 2 || step === 3) && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="w-full flex flex-wrap justify-center gap-6 md:gap-10 px-4 pt-6 pb-24 md:pb-12 z-10 relative">
          {[
            { text: "Dados 100% Privados" },
            { text: "Cálculo Astronômico de Precisão" },
            { text: "Leitura Personalizada do Seu Ano" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-white/45">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/70" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium">{b.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default Index;
