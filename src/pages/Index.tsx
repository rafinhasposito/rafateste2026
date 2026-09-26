import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll, Hourglass, Sun, Compass, ChevronLeft, User } from "lucide-react";
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

  const formSubtitle =
    mode === "passado"
      ? "Insira os dados do ano que deseja auditar e descubra o que o Universo havia preparado para você."
      : mode === "presente"
      ? "Insira suas coordenadas natais para analisar a configuração energética deste ciclo."
      : "Insira suas coordenadas natais para que o algoritmo astrofísico calcule a rota exata da sua prosperidade.";

  const activeTheme = mode ? modeThemes[mode] : null;

  return (
    <>
      <StarryBackground />
      <ScanningOverlay visible={isScanning} mode={mode || "futuro"} year={year} />

      {/* ===== STEP 1: Temporal Selection — FULLSCREEN, outside the container ===== */}
      {step === 1 && (
        <AnimatePresence mode="wait">
          <motion.div key="step1-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TemporalSelection onSelectMode={handleSelectMode} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ===== STEP 2: Method Selection ===== */}
      {step === 2 && (
        <AnimatePresence mode="wait">
          <motion.div key="step2-root" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-20 md:pt-24 pb-32 md:pb-12 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh] relative">
            
            {/* Cinematic Animated Background (Vídeo Dinâmico) */}
            {(() => {
              const theme = mode ? modeThemes[mode] : null;
              if (!theme) return null;
              return (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <video 
                    key={theme.video}
                    autoPlay loop muted playsInline 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-30" 
                    src={theme.video} 
                  />
                  {/* Máscara de cor para tingir a aura fluida com a cor do Tempo */}
                  <div 
                    className="absolute inset-0 mix-blend-color opacity-50 transition-colors duration-1000" 
                    style={{ backgroundColor: `rgb(${theme.rgb})` }} 
                  />
                  {/* Gradiente adicional para garantir que as bordas da tela continuem bem escuras */}
                  <div className="absolute inset-0 bg-[#030303] mask-radial-fade opacity-80" style={{ background: `radial-gradient(ellipse at top, transparent 0%, #030303 70%)` }} />
                </div>
              );
            })()}

            {/* Wrapper Centralizado */}
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10">
              
              {/* Header da Seção (Voltar + Badge) */}
              <div className="w-full relative flex flex-col md:flex-row items-center justify-center mb-6 md:mb-8">
                
                {/* Botão Voltar (Absolute no Desktop para não empurrar o layout) */}
                <div className="w-full md:w-auto flex justify-start md:absolute md:left-0 md:top-0 mb-6 md:mb-0">
                   <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold">
                     <ChevronLeft className="w-4 h-4" /> Voltar
                   </button>
                </div>

                {/* Badge Topo */}
                {(() => {
                  const theme = mode ? modeThemes[mode] : null;
                  const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Compass;
                  return (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                      style={{ borderColor: theme ? `rgba(${theme.rgb}, 0.3)` : 'rgba(255,255,255,0.1)', background: theme ? `rgba(${theme.rgb}, 0.05)` : 'transparent' }}>
                      <ModeIcon className="w-3.5 h-3.5" style={{ color: theme ? `rgb(${theme.rgb})` : '#fff' }} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme ? `rgb(${theme.rgb})` : '#fff' }}>
                        {modeOptions.find(m => m.id === mode)?.title}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Headings - Apple Scale */}
              <h1 className="text-4xl md:text-5xl font-ps-display text-white mb-4 text-center leading-tight drop-shadow-lg">
                Pronto, {profile?.full_name?.split(' ')[0] || profile?.display_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Viajante'}?
              </h1>
              <p className="text-white/50 text-base font-ps-ui max-w-lg text-center mb-16 leading-relaxed">
                O sistema já processou os seus dados natais. Escolha o método que deseja usar para calcular sua próxima Revolução.
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {(() => {
                   const theme = mode ? modeThemes[mode] : null;
                   return pathOptions.map((opt) => {
                     const Icon = opt.icon;
                     const cardDesc = 
                        opt.id === "cidade" ? "Já tenho um destino em mente." :
                        opt.id === "casa" ? "Quero escolher uma área da vida." :
                        "Sei o que quero mudar, mas não sei qual Casa escolher.";

                     return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="relative w-full overflow-hidden rounded-[28px] border backdrop-blur-2xl transition-all duration-500 group flex flex-col items-center p-10"
                          style={{ 
                            backgroundColor: theme ? `color-mix(in srgb, rgb(${theme.rgb}) 12%, rgba(0,0,0,0.7))` : 'rgba(10,10,12,0.8)',
                            borderColor: theme ? `color-mix(in srgb, rgb(${theme.rgb}) 25%, transparent)` : 'rgba(255,255,255,0.05)'
                          }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: theme ? `color-mix(in srgb, rgb(${theme.rgb}) 5%, transparent)` : 'rgba(255,255,255,0.02)' }} />
                          <div className="absolute top-0 inset-x-0 h-[1px] opacity-30 group-hover:opacity-100 transition-opacity duration-500" style={{ background: theme ? `linear-gradient(90deg, transparent, rgba(${theme.rgb}, 1), transparent)` : 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)' }} />
                          <div className="absolute top-0 inset-x-0 h-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ background: theme ? `radial-gradient(ellipse at top, rgba(${theme.rgb}, 1), transparent 70%)` : 'none' }} />
                          
                          <div className="w-14 h-14 rounded-full border mb-6 flex items-center justify-center transition-all duration-500 relative z-10" style={{ borderColor: theme ? `rgba(${theme.rgb}, 0.2)` : 'rgba(255,255,255,0.2)', color: theme ? `rgb(${theme.rgb})` : '#fff', background: theme ? `rgba(${theme.rgb}, 0.05)` : 'transparent' }}>
                            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                          </div>

                          <h3 className="font-ps-display text-xl text-white mb-2 text-center relative z-10">{opt.title}</h3>
                          <p className="font-ps-ui text-white/40 text-sm font-light text-center leading-relaxed mb-8 min-h-[40px] relative z-10">
                            {cardDesc}
                          </p>

                          <div className="mt-auto flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 relative z-10" style={{ color: theme ? `rgb(${theme.rgb})` : '#fff' }}>
                             Configurar Rota <span className="text-sm leading-none">→</span>
                          </div>
                        </motion.button>
                     );
                   });
                })()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ===== STEP 3: Data Collection + Lookup ===== */}
      {step === 3 && (
        <div className="pt-8 md:pt-32 pb-32 md:pb-12 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh]">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="surface-base p-5 sm:p-6 md:p-12 lg:p-16 relative w-full max-w-5xl"
            style={activeTheme ? {
              borderColor: `rgba(${activeTheme.rgb}, 0.15)`,
              background: "rgba(10, 10, 12, 0.85)",
            } : {
              background: "rgba(10, 10, 12, 0.85)",
            }}
          >
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px"
              style={{ background: activeTheme
                ? `linear-gradient(90deg, transparent, rgba(${activeTheme.rgb}, 0.3), transparent)`
                : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)'
              }}
            />

              {/* ===== STEP 3: Data Collection + Lookup ===== */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                  {/* Breadcrumb badges */}
                  {(() => {
                    const theme = mode ? modeThemes[mode] : null;
                    return (
                      <div className="flex justify-center gap-2 mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
                          style={{
                            borderColor: theme ? `rgba(${theme.rgb}, 0.3)` : undefined,
                            background: theme ? `rgba(${theme.rgb}, 0.08)` : undefined,
                          }}
                        >
                          {mode && (() => {
                            const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Rocket;
                            return <ModeIcon className="w-3 h-3" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }} />;
                          })()}
                          <span className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }}>
                            {modeOptions.find(m => m.id === mode)?.title}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
                          style={{
                            borderColor: theme ? `rgba(${theme.rgb}, 0.3)` : undefined,
                            background: theme ? `rgba(${theme.rgb}, 0.08)` : undefined,
                          }}
                        >
                          {searchPath && (() => {
                            const PathIcon = pathOptions.find(p => p.id === searchPath)?.icon || MapPin;
                            return <PathIcon className="w-3 h-3" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }} />;
                          })()}
                          <span className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }}>
                            {pathOptions.find(p => p.id === searchPath)?.title}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-center mb-12">
                    <h2 className="font-ps-display text-3xl md:text-4xl text-white mb-4 leading-tight">
                      {formTitle}
                    </h2>
                    <p className="font-ps-ui text-white/50 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
                      {formSubtitle}
                    </p>
                  </div>

                  {/* Natal Data Grid - Boarding Pass Estelar */}
                  {isNatalProfileComplete(profile) ? (
                    <div className="flex flex-col md:flex-row items-stretch backdrop-blur-2xl rounded-[24px] mb-12 relative overflow-hidden border"
                      style={{ 
                        backgroundColor: activeTheme ? `color-mix(in srgb, rgb(${activeTheme.rgb}) 5%, rgba(10,10,12,0.8))` : 'rgba(10,10,12,0.8)',
                        borderColor: activeTheme ? `color-mix(in srgb, rgb(${activeTheme.rgb}) 30%, transparent)` : 'rgba(255,255,255,0.08)'
                      }}>
                      
                      <div className="absolute top-0 inset-x-0 h-[1px] opacity-40" style={{ background: activeTheme ? `linear-gradient(90deg, transparent, rgba(${activeTheme.rgb}, 1), transparent)` : 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)' }} />

                      {/* Left: Passenger Info */}
                      <div className="flex-1 p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold mb-1">Passageiro</p>
                            <p className="font-ps-display text-white text-2xl tracking-wide">{profile?.full_name}</p>
                          </div>
                          <User className="w-5 h-5 opacity-50" style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#C9A227' }} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-bold mb-1">Coordenadas (Origem)</p>
                            <p className="font-ps-ui text-white/80 text-sm">{profile?.birth_city}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-bold mb-1">Ponto Zero (Tempo)</p>
                            <p className="font-ps-ui text-white/80 text-sm">
                              {profile?.birth_date?.split('-').reverse().join('/')} <span className="text-white/40 ml-1">{profile?.birth_time?.slice(0, 5)}</span>
                            </p>
                          </div>
                        </div>

                        <button onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}${searchPath ? `&path=${searchPath}` : ''}`)}`)} 
                          className="mt-6 text-[9px] uppercase tracking-[0.2em] hover:text-white transition-colors underline underline-offset-4 font-semibold"
                          style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#C9A227', textDecorationColor: activeTheme ? `rgba(${activeTheme.rgb}, 0.3)` : 'rgba(201,162,39,0.3)' }}>
                          Atualizar Registro
                        </button>
                      </div>

                      {/* Boarding Pass Tear Line */}
                      <div className="hidden md:flex flex-col justify-center items-center relative w-1">
                        <div className="absolute inset-y-0 w-[1px] border-l-2 border-dashed border-white/10" />
                        <div className="w-4 h-4 rounded-full bg-[#030303] absolute -top-2 border-b border-white/10" />
                        <div className="w-4 h-4 rounded-full bg-[#030303] absolute -bottom-2 border-t border-white/10" />
                      </div>

                      <div className="md:hidden flex flex-row justify-center items-center relative h-1 w-full">
                        <div className="absolute inset-x-0 h-[1px] border-t-2 border-dashed border-white/10" />
                        <div className="w-4 h-4 rounded-full bg-[#030303] absolute -left-2 border-r border-white/10" />
                        <div className="w-4 h-4 rounded-full bg-[#030303] absolute -right-2 border-l border-white/10" />
                      </div>

                      {/* Right: Destination/Year */}
                      <div className="w-full md:w-64 p-8 flex flex-col items-center justify-center relative bg-white/[0.02]"
                        style={{ background: activeTheme ? `radial-gradient(circle at center, rgba(${activeTheme.rgb}, 0.05) 0%, transparent 100%)` : 'transparent' }}>
                        
                        <div className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3 text-center" style={{ color: activeTheme ? `rgba(${activeTheme.rgb}, 0.8)` : '#C9A227' }}>
                          Ciclo de Destino
                        </div>
                        
                        <input
                          type="number"
                          className="w-full text-center text-5xl font-ps-display bg-transparent border-none outline-none font-bold tracking-tight"
                          style={{ color: activeTheme ? `rgb(${activeTheme.rgb})` : '#C9A227', textShadow: activeTheme ? `0 0 40px rgba(${activeTheme.rgb}, 0.4)` : 'none' }}
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          disabled={mode === "presente"}
                        />
                        
                        {mode === "presente" && <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/30 mt-3 border border-white/10 rounded-full px-3 py-1">Fixo (Ano Atual)</span>}
                        {mode !== "presente" && <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/30 mt-3">Editável</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-10">
                      <div className="space-y-6 md:space-y-7">
                        <div>
                          <div className="field-label"><span className="label-dot" /> Nome Completo</div>
                          <input type="text" className="quantum-input w-full" placeholder="Seu nome e sobrenome" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
                          <div>
                            <div className="field-label field-label-muted"><span className="label-dot" /> Data de Nascimento</div>
                            <input type="date" className="quantum-input w-full" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                          </div>
                          <div>
                            <div className="field-label"><span className="label-dot" /> Hora Exata</div>
                            <input type="time" className="quantum-input w-full" value={birthtime} onChange={(e) => setBirthtime(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 md:space-y-7">
                        <div>
                          <div className="field-label field-label-muted"><span className="label-dot" /> Cidade de Nascimento</div>
                          <div className="w-full">
                            <CityAutocomplete value={birthPlace} onChange={(v, valid) => { setBirthPlace(v); setBirthPlaceValid(valid); }} placeholder="Digite e selecione da lista" invalid={submitted && !birthPlaceValid} />
                          </div>
                        </div>
                        <div>
                          <div className="field-label"><span className="label-dot" /> {yearLabel}</div>
                          <input
                            type="number"
                            className="quantum-input w-full text-center text-xl md:text-2xl font-bold text-[#C9A227] h-14 font-ps-display"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            disabled={mode === "presente"}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-gold/20 border border-gold/30" />
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                  </div>

                  {/* Mantra */}
                  <div className="text-center mb-10">
                    <AnimatePresence mode="wait">
                      <motion.p key={mantraIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="text-gold/80 font-ps-display text-[11px] md:text-sm tracking-[0.15em] uppercase italic">
                        "{mantras[mantraIndex]}"
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Natal data warning */}
                  {!natalDataReady && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 mb-6 text-center">
                      <p className="text-destructive text-xs font-semibold">
                        Preencha todos os dados natais acima (nome, data, hora e cidade de nascimento) antes de continuar.
                      </p>
                    </motion.div>
                  )}

                  {/* Lookup Component */}
                  <div className="w-full mt-4">
                    {searchPath === "cidade" && (
                      <CityLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                    )}
                    {searchPath === "casa" && (
                      <HouseLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                    )}
                    {searchPath === "intencao" && (
                      <IntentLookup mode={mode || "futuro"} name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} onLoadingChange={setIsScanning} />
                    )}
                  </div>
                </motion.div>
              )}

            <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          </motion.div>

          {/* Discreet onboarding reset */}
          <div className="w-full text-center mt-6 mb-2">
            <Link to="/app/onboarding" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white/30 pb-0.5">
              Ver como funciona
            </Link>
          </div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mt-6 px-4 pb-12">
            {[
              { text: "Dados 100% Privados" },
              { text: "Efemérides Suíças (JPL)" },
              { text: "IA Mestre Astrólogo" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/50">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium">{b.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Index;
