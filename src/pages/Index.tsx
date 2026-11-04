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
import { getSunSignFromDate } from "./Auth";

type Mode = "futuro" | "passado" | "presente";
type SearchPath = "cidade" | "casa" | "intencao" | null;

const modeThemes: Record<
  Mode,
  { accent: string; light: string; rgb: string; glow: string; border: string; bg: string; cardBg: string; video: string }
> = {
  passado: {
    accent: "#94A3B8",
    light: "#E2E8F0",
    rgb: "148, 163, 184",
    glow: "rgba(148,163,184,0.28)",
    border: "rgba(148,163,184,0.38)",
    bg: "rgba(148,163,184,0.10)",
    cardBg: "linear-gradient(180deg, rgba(16,24,38,0.92) 0%, rgba(9,14,24,0.96) 55%, rgba(4,7,14,0.98) 100%)",
    video: "/videos/passado.mp4",
  },
  presente: {
    accent: "#10B981",
    light: "#A7F3D0",
    rgb: "16, 185, 129",
    glow: "rgba(16,185,129,0.28)",
    border: "rgba(16,185,129,0.38)",
    bg: "rgba(16,185,129,0.10)",
    cardBg: "linear-gradient(180deg, rgba(9,28,27,0.92) 0%, rgba(6,17,19,0.96) 55%, rgba(3,8,11,0.98) 100%)",
    video: "/videos/presente.mp4?v=2",
  },
  futuro: {
    accent: "#C9A227",
    light: "#F5DE98",
    rgb: "201, 162, 39",
    glow: "rgba(201,162,39,0.28)",
    border: "rgba(201,162,39,0.38)",
    bg: "rgba(201,162,39,0.10)",
    cardBg: "linear-gradient(180deg, rgba(15,28,52,0.92) 0%, rgba(9,17,32,0.96) 55%, rgba(4,8,18,0.98) 100%)",
    video: "/videos/futuro.mp4?v=2",
  },
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
      else if (targetMode === "passado") setYear(String(Number(currentYear) - 1));
      else setYear("2026");
      
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
    else if (m === "passado") setYear(String(Number(currentYear) - 1));
    else setYear("2026");
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
            className="pt-20 lg:pt-12 pb-28 lg:pb-16 flex flex-col items-center w-full relative"
          >
            {/* Fundo Full-Bleed (100% da janela, sem retângulo cortado nas laterais!) */}
            {(() => {
              const theme = mode ? modeThemes[mode] : modeThemes.futuro;
              return (
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${theme.rgb}, 0.14) 0%, rgba(7, 16, 30, 0.35) 55%, transparent 100%)`,
                    }}
                  />
                  <div 
                    className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[420px] opacity-15 blur-[140px] rounded-full pointer-events-none transition-colors duration-700"
                    style={{ backgroundColor: `rgb(${theme.rgb})` }} 
                  />
                </div>
              );
            })()}

            {/* Wrapper Centralizado */}
            <div className="w-full max-w-lg md:max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center relative z-10">
              
              {/* Header da Seção: Voltar + Badge do Modo Ativo */}
              <div className="w-full flex items-center justify-between mb-6 sm:mb-9">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl transition-all text-white/75 hover:text-white text-[11px] tracking-[0.18em] uppercase font-medium active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>

                {(() => {
                  const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                  const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Compass;
                  return (
                    <div 
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-xl transition-colors"
                      style={{
                        borderColor: `rgba(${theme.rgb}, 0.4)`,
                        backgroundColor: `rgba(${theme.rgb}, 0.12)`,
                      }}
                    >
                      <ModeIcon className="w-3.5 h-3.5" style={{ color: theme.light }} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: theme.light }}>
                        {modeOptions.find(m => m.id === mode)?.title}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Headings - Adaptados ao Tempo Escolhido (Passado / Presente / Futuro) */}
              {(() => {
                const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                const firstName =
                  profile?.full_name?.split(' ')[0] ||
                  profile?.display_name?.split(' ')[0] ||
                  user?.user_metadata?.name?.split(' ')[0] ||
                  'Viajante';
                const sunSign = profile?.birth_date ? getSunSignFromDate(profile.birth_date) : null;
                const userCredits = profile?.credits ?? 0;
                const step2Subtitle =
                  mode === "passado"
                    ? "Reveja um aniversário anterior e comprove o que aquela virada ativou no seu ano."
                    : mode === "presente"
                    ? "Escolha como você quer ler as energias que estão regendo o seu ciclo atual."
                    : "Escolha por onde você prefere começar a planejar seu próximo aniversário.";

                return (
                  <div className="w-full flex flex-col items-center mb-6 sm:mb-9">
                    <div className="text-center mb-5">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-ps-display text-white mb-2.5 tracking-tight leading-tight">
                        Pronto,{" "}
                        <span
                          className="text-transparent bg-clip-text"
                          style={{
                            backgroundImage: `linear-gradient(90deg, ${theme.light} 0%, ${theme.accent} 100%)`,
                          }}
                        >
                          {firstName}
                        </span>
                        ?
                      </h1>
                      <p className="text-white/65 text-sm sm:text-base font-ps-ui max-w-md mx-auto font-light leading-relaxed">
                        {step2Subtitle}
                      </p>
                    </div>

                    {/* Barra de Passaporte Calibrado + Incentivo de Créditos */}
                    {user && isNatalProfileComplete(profile) && (
                      <div className="w-full rounded-2xl border border-[#C9A227]/35 bg-[#08111F]/90 backdrop-blur-xl px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-ps-ui uppercase tracking-[0.15em] font-bold">
                            <Sparkles className="w-3 h-3" />
                            Passaporte Calibrado
                          </span>
                          <span className="text-white font-ps-ui text-xs sm:text-sm font-medium">
                            {profile?.full_name}
                            {sunSign ? ` • ${sunSign.symbol} Sol em ${sunSign.name}` : ""}
                          </span>
                          <span className="text-white/50 font-ps-ui text-xs hidden sm:inline">
                            • 📍 {profile?.birth_city}
                          </span>
                        </div>

                        {userCredits === 0 ? (
                          <Link
                            to="/credits"
                            className="w-full md:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E5C158] hover:brightness-110 text-[#02050A] font-ps-ui text-[11px] font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(201,162,39,0.3)] transition-all active:scale-95"
                          >
                            <span>⚡ Ativar Meus Créditos (A partir de R$ 19,90)</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            to="/credits"
                            className="shrink-0 px-3.5 py-1.5 rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#F5DE98] font-ps-ui text-[11px] font-semibold uppercase tracking-[0.14em] flex items-center gap-1.5 transition-all"
                          >
                            <span>⚡ {userCredits} {userCredits === 1 ? "Crédito ativo" : "Créditos ativos"}</span>
                            <span className="text-white/50">• + Comprar</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Cards: Luxury Majestic Cards Adaptados ao Modo e com Respiro Mobile/Web */}
              <div className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-3 md:gap-6 w-full">
                {(() => {
                   const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                   return pathOptions.map((opt) => {
                     const Icon = opt.icon;
                     const cardDesc =
                        mode === "passado"
                          ? opt.id === "cidade"
                            ? "Digite a cidade onde você passou um aniversário anterior e veja qual área da sua vida ela ativou naquele ano."
                            : opt.id === "casa"
                            ? "Descubra quais cidades teriam ativado dinheiro, amor, carreira ou saúde naquele ano específico."
                            : "Veja onde teria sido o melhor lugar do mundo para destravar o que você buscava naquele ciclo."
                          : mode === "presente"
                          ? opt.id === "cidade"
                            ? "Informe a cidade onde você passou seu último aniversário para revelar a leitura do seu ano atual."
                            : opt.id === "casa"
                            ? "Veja quais cidades ativam dinheiro, amor, carreira ou saúde na configuração do seu ciclo atual."
                            : "Compare onde seus objetivos atuais estariam mais favorecidos na virada deste ciclo."
                          : opt.id === "cidade"
                          ? "Já tem uma viagem ou cidade em mente? Veja o que passar a virada do seu aniversário lá ativa no seu ano."
                          : opt.id === "casa"
                          ? "Escolha a área que você quer priorizar agora: dinheiro, amor, carreira, saúde, visibilidade ou recomeço."
                          : "Diga o que você quer destravar nos próximos 12 meses e descubra as melhores cidades do mundo para isso.";
                     
                     const cardTag =
                        opt.id === "cidade"
                          ? mode === "passado" ? "Cidade onde passei" : mode === "presente" ? "Último aniversário" : "Já tenho destino"
                          : opt.id === "casa"
                          ? "12 Áreas (Casas)"
                          : "Metas & Desejos";

                     const cardAction =
                        opt.id === "cidade"
                          ? mode === "passado" ? "Rever Cidade" : mode === "presente" ? "Ler Meu Ano Atual" : "Testar uma Cidade"
                          : opt.id === "casa"
                          ? "Escolher Área da Vida"
                          : "Definir Objetivo";

                     return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="relative w-full overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between text-left p-5 sm:p-6 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.10),0_16px_40px_rgba(0,0,0,0.65)]"
                          style={{
                            borderColor: `rgba(${theme.rgb}, 0.36)`,
                            background: theme.cardBg,
                          }}
                        >
                          {/* Filete superior de luz do modo ativo */}
                          <div
                            className="absolute top-0 inset-x-0 h-[1.5px] transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, rgba(${theme.rgb}, 0.65) 50%, transparent 100%)`,
                            }}
                          />
                          
                          {/* Top Row: Ícone + Categoria Tag */}
                          <div className="w-full flex items-center justify-between mb-3.5 md:mb-5">
                            <div
                              className="w-11 h-11 md:w-14 md:h-14 rounded-2xl border flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                              style={{
                                borderColor: `rgba(${theme.rgb}, 0.42)`,
                                background: `linear-gradient(135deg, rgba(${theme.rgb}, 0.22) 0%, rgba(${theme.rgb}, 0.05) 100%)`,
                                color: theme.light,
                                boxShadow: `0 0 20px rgba(${theme.rgb}, 0.16)`,
                              }}
                            >
                              <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.75} />
                            </div>

                            <span
                              className="px-3 py-1 rounded-full border text-[9px] uppercase tracking-[0.18em] font-semibold"
                              style={{
                                borderColor: `rgba(${theme.rgb}, 0.28)`,
                                backgroundColor: `rgba(${theme.rgb}, 0.10)`,
                                color: theme.light,
                              }}
                            >
                              {cardTag}
                            </span>
                          </div>

                          {/* Conteúdo textual com respiro nobre */}
                          <div className="flex-1 w-full mb-4 md:mb-6">
                            <h3 className="font-ps-display text-xl sm:text-2xl md:text-2xl text-white font-medium mb-1.5 md:mb-2.5 tracking-wide transition-colors">
                              {opt.title}
                            </h3>
                            <p className="font-ps-ui text-white/75 text-xs sm:text-sm font-light leading-relaxed">
                              {cardDesc}
                            </p>
                          </div>

                          {/* Botão de ação explícito luxuoso */}
                          <div
                            className="w-full py-2.5 md:py-3 px-4 rounded-xl border flex items-center justify-between text-[11px] md:text-xs font-ps-ui uppercase tracking-[0.16em] font-semibold transition-all"
                            style={{
                              borderColor: `rgba(${theme.rgb}, 0.34)`,
                              background: `linear-gradient(90deg, rgba(${theme.rgb}, 0.16) 0%, rgba(${theme.rgb}, 0.08) 50%, rgba(${theme.rgb}, 0.16) 100%)`,
                              color: theme.light,
                            }}
                          >
                            <span>{cardAction}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: theme.light }} />
                          </div>
                        </motion.button>
                     );
                   });
                })()}
              </div>

              {/* Guia / Onboarding Banner de Apoio */}
              <div className="w-full mt-8 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#070E1A]/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
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
            className="pt-20 lg:pt-12 pb-28 lg:pb-16 flex flex-col items-center w-full relative">

            {/* ── Fundo Full-Bleed (100% da tela, sem borda/caixa cortada) ── */}
            {(() => {
              const theme = mode ? modeThemes[mode] : modeThemes.futuro;
              return (
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${theme.rgb}, 0.16) 0%, rgba(7, 16, 30, 0.35) 55%, transparent 100%)`,
                    }}
                  />
                  <div
                    className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[880px] h-[45vh] opacity-15 blur-[140px] rounded-full transition-colors duration-700"
                    style={{ backgroundColor: `rgb(${theme.rgb})` }}
                  />
                </div>
              );
            })()}

            <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 flex flex-col items-center relative z-10">

              {/* ── Nav Row — Voltar + Modo Ativo ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex items-center justify-between mb-6 md:mb-9">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl transition-all duration-300 text-white/80 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold active:scale-95">
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                {(() => {
                  const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                  const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Compass;
                  return (
                    <div
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-xl"
                      style={{
                        borderColor: `rgba(${theme.rgb}, 0.4)`,
                        backgroundColor: `rgba(${theme.rgb}, 0.12)`,
                      }}
                    >
                      <ModeIcon className="w-3.5 h-3.5" style={{ color: theme.light }} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: theme.light }}>
                        {modeOptions.find(m => m.id === mode)?.title}
                      </span>
                    </div>
                  );
                })()}
              </motion.div>

              {/* ── Dados de Nascimento — Apple Glass Card ── */}
              {isNatalProfileComplete(profile) && (() => {
                const sunSign = profile?.birth_date ? getSunSignFromDate(profile.birth_date) : null;
                const userCredits = profile?.credits ?? 0;
                return (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-4 md:gap-6 px-5 sm:px-8 py-4 sm:py-5 rounded-3xl border mb-6 md:mb-10 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                    style={{
                      borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.30)` : 'rgba(201,162,39,0.30)',
                      background: 'rgba(8, 15, 28, 0.80)'
                    }}>
                    <div className="flex flex-wrap gap-6 sm:gap-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/45">Passaporte Natal</span>
                        <span className="font-ps-display text-white/95 text-base sm:text-lg tracking-wide">
                          {profile?.full_name}
                          {sunSign ? ` • ${sunSign.symbol} ${sunSign.name}` : ""}
                        </span>
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
                    <div className="flex items-center gap-3">
                      {userCredits === 0 && (
                        <Link
                          to="/credits"
                          className="px-3 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-ps-ui text-[10px] font-bold uppercase tracking-[0.14em] transition-all"
                        >
                          ⚡ Ativar Créditos
                        </Link>
                      )}
                      <button onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
                        style={{ color: activeTheme ? activeTheme.light : '#F5DE98' }}>
                        Editar
                      </button>
                    </div>
                  </motion.div>
                );
              })()}

              {/* ── ANO HERO — Design Luxo Adaptado à Cor do Modo ── */}
              {(() => {
                const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="flex flex-col items-center mb-6 md:mb-10 relative w-full">
                    <span className="text-[10px] uppercase tracking-[0.42em] font-bold mb-2 md:mb-3" style={{ color: theme.light }}>
                      {mode === "passado" ? "Ano que Você Quer Rever" : mode === "presente" ? "Seu Ciclo Atual" : "Ano do Seu Aniversário"}
                    </span>
                    <div className="relative flex items-center justify-center gap-3 sm:gap-6">
                      {mode !== "presente" && (
                        <button
                          type="button"
                          aria-label="Ano anterior"
                          onClick={() => setYear(String((parseInt(year, 10) || new Date().getFullYear()) - 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border bg-[#081120]/90 hover:bg-[#101F38] flex items-center justify-center text-xl font-light transition-all active:scale-90 shadow-lg shrink-0"
                          style={{
                            borderColor: `rgba(${theme.rgb}, 0.40)`,
                            color: theme.light,
                          }}
                        >
                          −
                        </button>
                      )}
                      <input
                        type="number"
                        aria-label="Ano do aniversário"
                        className="year-hero-input text-center text-6xl sm:text-8xl md:text-[120px] font-ps-display bg-transparent border-b outline-none font-bold tracking-tight leading-none w-44 sm:w-64 md:w-80 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{
                          background: 'transparent',
                          color: theme.light,
                          borderColor: `rgba(${theme.rgb}, 0.35)`,
                          textShadow: `0 4px 32px rgba(${theme.rgb}, 0.35)`,
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
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border bg-[#081120]/90 hover:bg-[#101F38] flex items-center justify-center text-xl font-light transition-all active:scale-90 shadow-lg shrink-0"
                          style={{
                            borderColor: `rgba(${theme.rgb}, 0.40)`,
                            color: theme.light,
                          }}
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
                );
              })()}

              {/* ── Pergunta Adaptada ao Modo ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full text-center mb-6 md:mb-10 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-ps-display text-white leading-tight tracking-tight drop-shadow-2xl">
                  {searchPath === 'cidade'
                    ? mode === 'passado'
                      ? `Onde você passou seu aniversário em ${year}?`
                      : mode === 'presente'
                      ? 'Onde você passou seu último aniversário?'
                      : 'Qual cidade você quer consultar?'
                    : searchPath === 'casa'
                    ? mode === 'passado'
                      ? `Qual área da vida você quer conferir em ${year}?`
                      : 'Qual área da vida você quer priorizar?'
                    : mode === 'passado'
                    ? `Qual objetivo você buscava viver em ${year}?`
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

              {/* Perfil de nascimento incompleto — Card convidativo */}
              {!isNatalProfileComplete(profile) && (
                <div
                  className="mt-6 w-full max-w-2xl rounded-2xl border bg-[#081222]/90 backdrop-blur-xl p-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                  style={{
                    borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.38)` : 'rgba(201,162,39,0.38)',
                  }}
                >
                  <p
                    className="font-ps-display text-sm sm:text-base mb-1"
                    style={{ color: activeTheme ? activeTheme.light : '#F5DE98' }}
                  >
                    Falta só um detalhe: seus dados de nascimento
                  </p>
                  <p className="text-white/65 font-ps-ui text-xs mb-3.5 max-w-md mx-auto leading-relaxed">
                    Para calcular sua rota com precisão, precisamos da sua data, horário exato e cidade onde você nasceu.
                  </p>
                  <button
                    onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                    className="px-5 py-2.5 rounded-xl border text-[11px] font-ps-ui uppercase tracking-[0.16em] font-semibold transition-all active:scale-95"
                    style={{
                      borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.45)` : 'rgba(201,162,39,0.45)',
                      backgroundColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.15)` : 'rgba(201,162,39,0.15)',
                      color: activeTheme ? activeTheme.light : '#F5DE98',
                    }}
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
          className="w-full flex flex-wrap justify-center gap-6 md:gap-10 px-4 pt-4 pb-24 lg:pb-12 z-10 relative">
          {[
            { text: "Dados 100% Privados" },
            { text: "Cálculo Astronômico de Precisão" },
            { text: "Leitura Personalizada do Seu Ano" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-white/45">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeTheme ? activeTheme.accent : '#C9A227' }}
              />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium">{b.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default Index;
