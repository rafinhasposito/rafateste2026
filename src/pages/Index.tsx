import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll, Hourglass, Sun, Compass, ChevronLeft, ChevronRight, User, Edit2, Sparkles } from "lucide-react";
import ScanningOverlay from "@/components/ScanningOverlay";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import CityLookup from "@/components/CityLookup";
import HouseLookup from "@/components/HouseLookup";
import IntentLookup from "@/components/IntentLookup";
import { TemporalSelection } from "@/components/TemporalSelection";

import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { detectUserLocation, getCurrentSolarYear, getNextBirthdayYear, normalizeBirthTime } from "@/lib/astro";
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
    id: "casa" as SearchPath,
    icon: Crown,
    title: "Quero descobrir minha melhor cidade",
    desc: "Escolha o que quer viver (Dinheiro, Amor, Carreira, Saúde...) e veja os melhores destinos.",
  },
  {
    id: "cidade" as SearchPath,
    icon: MapPin,
    title: "Já tenho uma cidade em mente",
    desc: "Digite qualquer cidade do mundo e veja como será seu ano se passar o aniversário lá.",
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
  const [year, setYear] = useState(() => getNextBirthdayYear(profile?.birth_date));

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
      if (loading) return;
      const ret = targetPath ? `/?mode=${targetMode}&path=${targetPath}` : `/?mode=${targetMode}`;
      if (!user) {
        sessionStorage.setItem("ps_pending_mode", targetMode);
        navigate(`/auth?returnTo=${encodeURIComponent(ret)}`, { replace: true });
        return;
      }
      if (!isNatalProfileComplete(profile)) {
        navigate(`/perfil?returnTo=${encodeURIComponent(ret)}`);
        return;
      }
      setMode(targetMode);
      const activeBirthDate = profile?.birth_date || birthdate;
      const currentSolar = getCurrentSolarYear(activeBirthDate);
      if (targetMode === "presente") setYear(currentSolar);
      else if (targetMode === "passado") setYear(String(Number(currentSolar) - 1));
      else setYear(getNextBirthdayYear(activeBirthDate));
      
      if (targetPath && ["cidade", "casa", "intencao"].includes(targetPath)) {
        setSearchPath(targetPath);
        setStep(3);
      } else if (targetMode === "presente" || targetMode === "passado") {
        // Presente e Passado pulam o menu intermediário e abrem direto o campo da cidade!
        setSearchPath("cidade");
        setStep(3);
      } else {
        setStep(2);
      }
      
      setTimeout(() => {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (profile.birth_date && !birthdate) {
        setBirthdate(profile.birth_date);
        if (!mode || mode === "futuro") {
          setYear(getNextBirthdayYear(profile.birth_date));
        }
      }
      if (profile.birth_time && !birthtime) {
        setBirthtime(normalizeBirthTime(profile.birth_time));
      }
      if (profile.birth_city && !birthPlace) {
        setBirthPlace(profile.birth_city);
        setBirthPlaceValid(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      navigate(`/auth?returnTo=${encodeURIComponent(`/?mode=${m}`)}`);
      return;
    }
    // 3. Logado mas sem perfil natal → completar perfil
    if (!isNatalProfileComplete(profile)) {
      navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${m}`)}`);
      return;
    }
    // 4. Tudo OK → Presente e Passado abrem direto o campo da cidade (1 passo só!)
    setMode(m);
    const activeBirthDate = profile?.birth_date || birthdate;
    const currentSolar = getCurrentSolarYear(activeBirthDate);
    if (m === "presente") {
      setYear(currentSolar);
      setSearchPath("cidade");
      setStep(3);
      return;
    }
    if (m === "passado") {
      setYear(String(Number(currentSolar) - 1));
      setSearchPath("cidade");
      setStep(3);
      return;
    }
    setYear(getNextBirthdayYear(activeBirthDate));
    setSearchPath(null);
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
    mode === "passado" ? "Ano que Você Quer Rever" :
    mode === "presente" ? "Ano Atual" :
    "Ano do Próximo Aniversário";

  const formTitle =
    mode === "passado" ? "Rever Ano Passado" :
    mode === "presente" ? "Leitura do Ano Atual" :
    "Planejar Próximo Aniversário";

  const formSubtitle = isNatalProfileComplete(profile)
    ? searchPath === "cidade"
      ? "Seus dados de nascimento já estão salvos. Qual cidade você quer consultar para o seu aniversário?"
      : searchPath === "casa"
      ? "Seus dados de nascimento estão prontos. Escolha a área da vida que você quer priorizar neste ano."
      : "Seus dados de nascimento estão prontos. Escolha o objetivo principal para o seu próximo ciclo."
    : mode === "passado"
      ? "Informe seus dados de nascimento e o ano que deseja rever para descobrir qual área da vida esteve em destaque."
      : mode === "presente"
      ? "Informe seus dados de nascimento para ler a energia que está guiando o seu ano atual."
      : "Informe seus dados de nascimento para descobrir as melhores cidades para o seu próximo aniversário.";

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
                    ? "Reveja um aniversário anterior e descubra qual área da vida esteve em destaque naquele ano."
                    : mode === "presente"
                    ? "Veja como estão as energias do seu ano atual a partir de onde você passou seu último aniversário."
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

                    {/* Barra de Dados de Nascimento + Incentivo de Créditos */}
                    {user && isNatalProfileComplete(profile) && (
                      <div className="w-full rounded-2xl border border-[#C9A227]/35 bg-[#08111F]/90 backdrop-blur-xl px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-ps-ui uppercase tracking-[0.15em] font-bold">
                            <Sparkles className="w-3 h-3" />
                            Dados Salvos
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

              {/* Cards: 2 Escolhas Diretas e Zero Confusão */}
              <div className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-2 md:gap-6 w-full max-w-4xl">
                {(() => {
                   const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                   return pathOptions.map((opt) => {
                     const Icon = opt.icon;
                     const cardDesc = opt.desc;
                     const cardTag =
                        opt.id === "casa"
                          ? "Recomendado • 12 Casas"
                          : "Testar um Destino";
                     const cardAction =
                        opt.id === "casa"
                          ? "Escolher pelas 12 Casas"
                          : "Digitar uma Cidade";

                     return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="relative w-full overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between text-left p-6 sm:p-7 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.10),0_16px_40px_rgba(0,0,0,0.65)]"
                          style={{
                            borderColor: `rgba(${theme.rgb}, 0.42)`,
                            background: theme.cardBg,
                          }}
                        >
                          <div
                            className="absolute top-0 inset-x-0 h-[1.5px] transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, rgba(${theme.rgb}, 0.65) 50%, transparent 100%)`,
                            }}
                          />
                          
                          <div className="w-full flex items-center justify-between mb-4">
                            <div
                              className="w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                              style={{
                                borderColor: `rgba(${theme.rgb}, 0.42)`,
                                background: `linear-gradient(135deg, rgba(${theme.rgb}, 0.22) 0%, rgba(${theme.rgb}, 0.05) 100%)`,
                                color: theme.light,
                                boxShadow: `0 0 20px rgba(${theme.rgb}, 0.16)`,
                              }}
                            >
                              <Icon className="w-6 h-6" strokeWidth={1.75} />
                            </div>

                            <span
                              className="px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.16em] font-semibold"
                              style={{
                                borderColor: `rgba(${theme.rgb}, 0.32)`,
                                backgroundColor: `rgba(${theme.rgb}, 0.12)`,
                                color: theme.light,
                              }}
                            >
                              {cardTag}
                            </span>
                          </div>

                          <div className="flex-1 w-full mb-5">
                            <h3 className="font-ps-display text-2xl sm:text-3xl text-white font-normal mb-2 tracking-tight">
                              {opt.title}
                            </h3>
                            <p className="font-ps-ui text-white/75 text-sm font-light leading-relaxed">
                              {cardDesc}
                            </p>
                          </div>

                          <div
                            className="w-full py-3.5 px-5 rounded-xl border flex items-center justify-between text-xs font-ps-ui uppercase tracking-[0.16em] font-bold transition-all"
                            style={{
                              borderColor: `rgba(${theme.rgb}, 0.45)`,
                              background:
                                opt.id === "casa"
                                  ? "#C9A227"
                                  : `linear-gradient(90deg, rgba(${theme.rgb}, 0.18) 0%, rgba(${theme.rgb}, 0.10) 100%)`,
                              color: opt.id === "casa" ? "#02050A" : theme.light,
                            }}
                          >
                            <span>{cardAction}</span>
                            <ChevronRight
                              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                              style={{ color: opt.id === "casa" ? "#02050A" : theme.light }}
                            />
                          </div>
                        </motion.button>
                     );
                   });
                })()}
              </div>

              {/* Atalho Direto para assistir aos Trailers das 12 Casas */}
              <div className="w-full max-w-4xl mt-6 p-4 sm:p-5 rounded-2xl border border-[#C9A227]/35 bg-[#070E1A]/90 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
                <div>
                  <h4 className="text-base font-ps-display text-white">
                    Quer entender o que significa cada uma das 12 Casas?
                  </h4>
                  <p className="text-xs font-ps-ui text-white/65 mt-0.5">
                    Veja a explicação completa da Casa 1 à Casa 12 antes de escolher.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                  <Link 
                    to="/casas" 
                    className="px-4 py-2.5 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227] border border-[#C9A227]/50 text-[#F5DE98] hover:text-[#02050A] text-xs font-ps-ui font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" /> 
                    <span>Ver as 12 Casas →</span>
                  </Link>
                  <Link 
                    to="/app/onboarding" 
                    className="px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-ps-ui font-medium transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> 
                    <span>Guia Rápido (1 min)</span>
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

            <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center relative z-10">

              {/* ── Nav Row — Voltar + Barra Compacta de Dados & Ano ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex flex-wrap items-center justify-between gap-3 mb-5">
                <button
                  onClick={() => {
                    if (mode === "presente" || mode === "passado") {
                      setMode(null);
                      setSearchPath(null);
                      setStep(1);
                    } else {
                      setStep(2);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl transition-all duration-300 text-white/80 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold active:scale-95">
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>

                {/* Seletor Compacto de Ano + Modo */}
                {(() => {
                  const theme = mode ? modeThemes[mode] : modeThemes.futuro;
                  return (
                    <div
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-xl"
                      style={{
                        borderColor: `rgba(${theme.rgb}, 0.4)`,
                        backgroundColor: `rgba(${theme.rgb}, 0.12)`,
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: theme.light }}>
                        {mode === "passado" ? "Aniversário de:" : mode === "presente" ? "Ano Atual:" : "Aniversário:"}
                      </span>
                      {mode !== "presente" && (
                        <button
                          type="button"
                          aria-label="Ano anterior"
                          onClick={() => setYear(String((parseInt(year, 10) || new Date().getFullYear()) - 1))}
                          className="w-6 h-6 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-white"
                        >
                          −
                        </button>
                      )}
                      <input
                        type="number"
                        aria-label="Ano do aniversário"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={mode === "presente"}
                        className="w-14 text-center font-ps-display text-base font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ color: theme.light }}
                      />
                      {mode !== "presente" && (
                        <button
                          type="button"
                          aria-label="Próximo ano"
                          onClick={() => setYear(String((parseInt(year, 10) || new Date().getFullYear()) + 1))}
                          className="w-6 h-6 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-white"
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })()}
              </motion.div>

              {/* ── Pílula Compacta de Dados de Nascimento (1 linha limpa) ── */}
              {isNatalProfileComplete(profile) && (() => {
                const sunSign = profile?.birth_date ? getSunSignFromDate(profile.birth_date) : null;
                const userCredits = profile?.credits ?? 0;
                return (
                  <div
                    className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl border mb-6 backdrop-blur-xl text-xs font-ps-ui"
                    style={{
                      borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.25)` : 'rgba(201,162,39,0.25)',
                      background: 'rgba(8, 15, 28, 0.75)'
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-white/85">
                      <span className="font-semibold text-white">{profile?.full_name}</span>
                      {sunSign && <span className="text-[#F5DE98]">• {sunSign.symbol} {sunSign.name}</span>}
                      <span className="text-white/55">• 📍 {profile?.birth_city}</span>
                      <span className="text-white/55 hidden sm:inline">
                        • {profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0,5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {userCredits === 0 && (
                        <Link
                          to="/credits"
                          className="px-2.5 py-1 rounded-lg bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] text-[10px] font-bold uppercase tracking-wider"
                        >
                          ⚡ Ativar Créditos
                        </Link>
                      )}
                      <button
                        onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                        className="text-[11px] font-semibold underline hover:text-white"
                        style={{ color: activeTheme ? activeTheme.light : '#F5DE98' }}
                      >
                        Alterar dados
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ── Pergunta Direta e Autoexplicativa ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full text-center mb-6 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-ps-display text-white leading-tight tracking-tight drop-shadow-2xl">
                  {searchPath === 'cidade'
                    ? mode === 'passado'
                      ? `Em qual cidade você passou seu aniversário em ${year}?`
                      : mode === 'presente'
                      ? 'Em qual cidade você passou seu último aniversário?'
                      : 'Digite a cidade que você quer testar:'
                    : 'Escolha a Casa que você quer consultar:'}
                </h1>
                {searchPath === 'cidade' && mode === 'futuro' && (
                  <button
                    type="button"
                    onClick={() => setSearchPath('casa')}
                    className="mt-2.5 text-xs font-ps-ui text-[#F5DE98] hover:underline"
                  >
                    Não tem cidade definida? Escolha pelas 12 Casas →
                  </button>
                )}
                {searchPath === 'casa' && (
                  <button
                    type="button"
                    onClick={() => setSearchPath('cidade')}
                    className="mt-2.5 text-xs font-ps-ui text-[#F5DE98] hover:underline"
                  >
                    Já tem uma cidade em mente? Testar por Cidade →
                  </button>
                )}
              </motion.div>

              {/* ── Campo de busca — Largura ampla e simétrica para grids ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className={searchPath === "cidade" ? "w-full max-w-2xl" : "w-full max-w-5xl"}>
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
