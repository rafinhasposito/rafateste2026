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

const modeThemes: Record<Mode, { accent: string; rgb: string; glow: string; border: string; bg: string }> = {
  passado: { accent: "hsl(270, 91%, 65%)", rgb: "168, 85, 247", glow: "rgba(168,85,247,0.3)", border: "rgba(168,85,247,0.4)", bg: "rgba(168,85,247,0.08)" },
  presente: { accent: "hsl(43, 85%, 53%)", rgb: "212, 175, 55", glow: "rgba(212,175,55,0.3)", border: "rgba(212,175,55,0.4)", bg: "rgba(212,175,55,0.08)" },
  futuro: { accent: "hsl(348, 83%, 60%)", rgb: "244, 63, 94", glow: "rgba(244,63,94,0.3)", border: "rgba(244,63,94,0.4)", bg: "rgba(244,63,94,0.08)" },
};

const modeCardColors: Record<Mode, { rgb: string }> = {
  passado: { rgb: "168, 85, 247" },
  presente: { rgb: "212, 175, 55" },
  futuro: { rgb: "244, 63, 94" },
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

      {/* ===== STEPS 2 + 3: inside the original container ===== */}
      {step > 1 && (
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

            <AnimatePresence mode="wait">
              {/* ===== STEP 2: Method Selection ===== */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="pt-4">
                  <div className="text-center mb-12">
                    {/* Selected mode badge */}
                    {(() => {
                      const theme = mode ? modeThemes[mode] : null;
                      return (
                        <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 cursor-pointer hover:scale-105 transition-transform"
                          style={{
                            borderColor: theme ? `rgba(${theme.rgb}, 0.3)` : undefined,
                            background: theme ? `rgba(${theme.rgb}, 0.08)` : undefined,
                          }}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }}>
                            ← {modeOptions.find(m => m.id === mode)?.title}
                          </span>
                        </button>
                      );
                    })()}

                    <h2 className="font-ps-display text-3xl md:text-4xl text-white mb-4 leading-tight">
                      Como Deseja Consultar?
                    </h2>
                    <p className="font-ps-ui text-white/50 text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
                      Escolha um dos três caminhos. Cada um leva ao mesmo resultado: o destino ideal para o seu ciclo.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                    {(() => {
                      const theme = mode ? modeThemes[mode] : null;
                      return pathOptions.map((opt, idx) => {
                        const Icon = opt.icon;
                        return (
                          <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectPath(opt.id)}
                            className="w-full relative overflow-hidden rounded-2xl border text-left transition-all duration-300 group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 md:p-8"
                            style={{
                              borderColor: theme ? `rgba(${theme.rgb}, 0.15)` : "rgba(212, 175, 55, 0.15)",
                              backgroundColor: "rgba(255, 255, 255, 0.02)",
                            }}
                          >
                            {/* Glow effect on hover */}
                            <div 
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                              style={{
                                background: theme ? `radial-gradient(circle at left center, rgba(${theme.rgb}, 0.1), transparent 70%)` : `radial-gradient(circle at left center, rgba(212,175,55,0.1), transparent 70%)`
                              }}
                            />

                            {/* Icon area */}
                            <div className="flex items-center gap-4 shrink-0">
                              <div
                                className="w-12 h-12 rounded-full border flex items-center justify-center transition-colors"
                                style={{
                                  borderColor: theme ? `rgba(${theme.rgb}, 0.2)` : 'rgba(212,175,55,0.2)',
                                  background: theme ? `rgba(${theme.rgb}, 0.05)` : 'rgba(212,175,55,0.05)',
                                  color: theme ? `rgb(${theme.rgb})` : "#C9A227"
                                }}
                              >
                                <Icon className="w-5 h-5 opacity-90" strokeWidth={1.5} />
                              </div>
                              <div className="w-px h-8 bg-white/10 hidden sm:block" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <h3 className="font-ps-display text-xl text-white mb-1.5">
                                {opt.title}
                              </h3>
                              <p className="font-ps-ui text-[13px] leading-relaxed text-white/50">
                                {opt.desc}
                              </p>
                            </div>

                            {/* Chevron */}
                            <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full border border-white/10 items-center justify-center group-hover:border-white/30 transition-colors">
                              <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                            </div>
                          </motion.button>
                        );
                      });
                    })()}
                  </div>
                </motion.div>
              )}

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

                  {/* Natal Data Grid */}
                  {isNatalProfileComplete(profile) ? (
                    <div className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 md:mb-10 gap-6">
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <User className="w-4 h-4 text-[#C9A227]" />
                          <span className="text-white font-bold text-sm uppercase tracking-widest">{profile?.full_name}</span>
                        </div>
                        <p className="text-white/50 text-xs font-ps-ui leading-relaxed pl-7">
                          {profile?.birth_date?.split('-').reverse().join('/')} às {profile?.birth_time?.slice(0, 5)}<br/>
                          {profile?.birth_city}
                        </p>
                        <button onClick={() => navigate(`/perfil?returnTo=${encodeURIComponent(`/?mode=${mode}${searchPath ? `&path=${searchPath}` : ''}`)}`)} className="text-[#C9A227] text-[10px] uppercase tracking-widest hover:text-white transition-colors pl-7 mt-2 underline decoration-[#C9A227]/30 underline-offset-4">
                          Editar Dados Natais
                        </button>
                      </div>

                      <div className="w-full md:w-48 bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="field-label justify-center mb-3"><span className="label-dot" /> {yearLabel}</div>
                        <input
                          type="number"
                          className="quantum-input w-full text-center text-2xl font-bold text-[#C9A227] h-12 font-ps-display bg-transparent border-b border-white/20 focus:border-[#C9A227] outline-none"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          disabled={mode === "presente"}
                        />
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
            </AnimatePresence>

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
