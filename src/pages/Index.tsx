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
    title: "Por Casa",
    desc: "Quero escolher uma área da vida.",
  },
  {
    id: "intencao" as SearchPath,
    icon: Scroll,
    title: "Por Intenção",
    desc: "Sei o que quero mudar, mas não sei qual Casa escolher.",
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
    const hasCompleted = localStorage.getItem("ps_onboarding_completed");
    if (!hasCompleted) {
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
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-ps-display text-white mb-3 tracking-tight leading-tight">
                  Pronto, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5DE98] to-[#C9A227]">{profile?.full_name?.split(' ')[0] || profile?.display_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Viajante'}</span>?
                </h1>
                <p className="text-white/55 text-sm sm:text-base font-ps-ui max-w-md mx-auto font-light leading-relaxed">
                  Escolha como prefere explorar as coordenadas da sua próxima Revolução Solar.
                </p>
              </div>

              {/* Cards: Luxury Majestic Cards with Generous Breathing Room */}
              <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6 w-full">
                {(() => {
                   return pathOptions.map((opt) => {
                     const Icon = opt.icon;
                     const cardDesc = 
                        opt.id === "cidade" ? "Já tem um destino em mente? O sistema calcula a casa solar exata que você ativará nessa localização geográfica." :
                        opt.id === "casa" ? "Foque na área da sua vida que mais precisa de impulso: dinheiro, carreira, novos começos, saúde ou expansão." :
                        "Defina seu objetivo central para o novo ciclo. A inteligência do Protocolo cruza as efemérides para encontrar a sua coordenada.";
                     
                     const cardTag =
                        opt.id === "cidade" ? "Destino Fixo" :
                        opt.id === "casa" ? "Casas 1 a 12" :
                        "Intenção & Metas";

                     const cardAction =
                        opt.id === "cidade" ? "Simular Minha Cidade" :
                        opt.id === "casa" ? "Escolher Área da Vida" :
                        "Definir Minha Intenção";

                     return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="relative w-full overflow-hidden rounded-3xl border border-[#C9A227]/30 hover:border-[#C9A227]/70 bg-gradient-to-b from-[#0F1C36]/90 via-[#091222]/95 to-[#040812]/98 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between text-left p-6 sm:p-7 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_16px_40px_rgba(0,0,0,0.6)]"
                        >
                          {/* Filete superior de luz dourada */}
                          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5C158]/50 to-transparent transition-opacity duration-500" />
                          
                          {/* Top Row: Ícone + Categoria Tag */}
                          <div className="w-full flex items-center justify-between mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 border border-[#C9A227]/40 flex items-center justify-center text-[#F5DE98] shadow-[0_0_20px_rgba(201,162,39,0.18)] group-hover:scale-105 transition-transform duration-300">
                              <Icon className="w-6 h-6" strokeWidth={1.75} />
                            </div>

                            <span className="px-3 py-1 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 text-[#F5DE98] text-[9px] uppercase tracking-[0.2em] font-semibold">
                              {cardTag}
                            </span>
                          </div>

                          {/* Conteúdo textual com respiro nobre */}
                          <div className="flex-1 w-full mb-6">
                            <h3 className="font-ps-display text-2xl md:text-2xl text-white font-medium mb-2.5 tracking-wide group-hover:text-[#F5DE98] transition-colors">
                              {opt.title}
                            </h3>
                            <p className="font-ps-ui text-white/70 text-sm font-light leading-relaxed">
                              {cardDesc}
                            </p>
                          </div>

                          {/* Botão de ação explícito luxuoso */}
                          <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A227]/15 via-[#C9A227]/8 to-[#C9A227]/15 border border-[#C9A227]/30 group-hover:border-[#C9A227]/60 group-hover:from-[#C9A227]/25 group-hover:to-[#C9A227]/20 flex items-center justify-between text-[#F5DE98] text-xs font-ps-ui uppercase tracking-[0.18em] font-semibold transition-all shadow-[0_4px_16px_rgba(201,162,39,0.08)]">
                            <span>{cardAction}</span>
                            <ChevronRight className="w-4 h-4 text-[#E5C158] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.button>
                     );
                   });
                })()}
              </div>

              {/* Guia / Onboarding Banner de Apoio */}
              <div className="w-full mt-10 p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
                <div>
                  <h4 className="text-sm font-ps-display text-white tracking-wide">Dúvida sobre qual caminho escolher?</h4>
                  <p className="text-xs font-ps-ui text-white/55 mt-0.5">Veja o onboarding completo ou entenda o cálculo astrofísico.</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link 
                    to="/app/onboarding" 
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-ps-ui font-medium transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> 
                    <span>Ver Onboarding</span>
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
            className="pt-24 md:pt-28 pb-40 md:pb-24 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh] relative">

            {/* ── Fundo Premium Luxuoso (Ouro/Prata/Esmeralda) ── */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              if (!theme) return null;
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {/* Luz principal: Um gradiente suntuoso e rico cobrindo a tela toda */}
                  <div className="absolute inset-0 transition-colors duration-1000 mix-blend-screen opacity-60"
                    style={{ background: `radial-gradient(ellipse at 50% -20%, rgba(${theme.rgb}, 0.5) 0%, rgba(${theme.rgb}, 0.1) 50%, transparent 100%)` }} />
                  
                  {/* Glow volumétrico centralizado para criar profundidade luxuosa (semelhante ao brilho do vídeo) */}
                  <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120vw] max-w-[1200px] h-[80vh] opacity-30 blur-[150px] rounded-full transition-colors duration-1000"
                    style={{ backgroundColor: `rgb(${theme.rgb})` }} />

                  {/* Vinheta suave nas bordas para manter contraste de leitura */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,3,6,0.8) 100%)' }} />
                </div>
              );
            })()}

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 pt-2 md:pt-6">

              {/* ── Nav Row — Voltar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex justify-start mb-6 md:mb-10">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-300 text-white/70 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold active:scale-95">
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              </motion.div>

              {/* ── Dados Natais — Apple Glass Card ── */}
              {isNatalProfileComplete(profile) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-6 px-8 py-5 rounded-3xl border mb-16 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  style={{
                    borderColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.15)` : 'rgba(255,255,255,0.08)',
                    background: activeTheme ? `color-mix(in srgb, rgb(${activeTheme.rgb}) 4%, rgba(10,10,12,0.6))` : 'rgba(10,10,12,0.6)'
                  }}>
                  <div className="flex flex-wrap gap-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Passageiro</span>
                      <span className="font-ps-display text-white/90 text-lg tracking-wide">{profile?.full_name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Origem</span>
                      <span className="font-ps-ui text-white/70 text-sm">{profile?.birth_city}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Momento</span>
                      <span className="font-ps-ui text-white/70 text-sm">{profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0,5)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}&path=${searchPath}`)}`)}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-transform"
                    style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#fff' }}>
                    Editar
                  </button>
                </motion.div>
              )}

              {/* ── ANO HERO — Design Apple Vision Pro ── */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="flex flex-col items-center mb-12 relative w-full">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-4 opacity-80"
                  style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#C9A227' }}>
                  Ano do Destino
                </span>
                <div className="relative flex justify-center w-full">
                  <input
                    type="number"
                    className="text-center text-8xl md:text-[140px] font-ps-display bg-transparent border-none outline-none font-bold tracking-tighter leading-none w-full"
                    style={{
                      color: activeTheme ? `rgb(${activeTheme.rgb})` : '#C9A227',
                      textShadow: activeTheme ? `0 0 80px rgba(${activeTheme.rgb}, 0.5)` : 'none',
                      caretColor: 'transparent'
                    }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={mode === "presente"}
                  />
                  {mode === "presente" && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                      <span className="text-[9px] uppercase tracking-widest text-white/60">Ciclo Atual Fixado</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── Pergunta ── */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full text-center mb-12 max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-ps-display text-white leading-tight tracking-tight drop-shadow-2xl">
                  {searchPath === 'cidade' ? 'Onde você vai passar o seu aniversário?'
                    : searchPath === 'casa' ? 'Qual energia você quer ativar?'
                    : 'O que você quer destravar no seu ano?'}
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

              {/* Perfil incompleto */}
              {!isNatalProfileComplete(profile) && (
                <div className="mt-8 w-full max-w-2xl rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
                  <p className="text-destructive text-xs font-semibold mb-2">Seus dados natais estão incompletos.</p>
                  <button onClick={() => navigate('/perfil')} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white underline">
                    Completar Perfil
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
            { text: "Efemérides Suíças (JPL)" },
            { text: "IA Mestre Astrólogo" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-white/40">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/60" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium">{b.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default Index;
