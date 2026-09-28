import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll, Hourglass, Sun, Compass, ChevronLeft, User, Edit2 } from "lucide-react";
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
          <motion.div key="step2-root" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="pt-20 md:pt-24 pb-32 md:pb-12 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh] relative">
            
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
        )}

        {/* ===== STEP 3 ===== */}
        {step === 3 && (
          <motion.div key="step3-root" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.3 }}
            className="pb-32 flex flex-col items-center w-full px-4 md:px-5 min-h-[100svh] relative">

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

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 pt-6 md:pt-10">

              {/* ── Nav Row — Voltar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                className="w-full flex justify-start mb-8 md:mb-12">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-300 text-white/70 hover:text-white text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Voltar
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

      {/* Trust badges — visible on steps 2 and 3 */}
      {(step === 2 || step === 3) && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="fixed bottom-4 left-0 right-0 flex flex-wrap justify-center gap-6 md:gap-10 px-4 z-20 pointer-events-none">
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
      )}
    </>
  );
};

export default Index;
