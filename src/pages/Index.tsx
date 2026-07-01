import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll, Clock, CalendarDays, Rocket, ChevronLeft } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import ScanningOverlay from "@/components/ScanningOverlay";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import CityLookup from "@/components/CityLookup";
import HouseLookup from "@/components/HouseLookup";
import IntentLookup from "@/components/IntentLookup";
import UserMenu from "@/components/UserMenu";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { detectUserLocation } from "@/lib/astro";

type Mode = "futuro" | "passado" | "presente";
type SearchPath = "cidade" | "casa" | "intencao" | null;

const modeThemes: Record<Mode, { accent: string; rgb: string; glow: string; border: string; bg: string }> = {
  passado: { accent: "hsl(30, 76%, 50%)", rgb: "205, 127, 50", glow: "rgba(205,127,50,0.3)", border: "rgba(205,127,50,0.4)", bg: "rgba(205,127,50,0.08)" },
  presente: { accent: "hsl(160, 100%, 35%)", rgb: "0, 180, 120", glow: "rgba(0,180,120,0.3)", border: "rgba(0,180,120,0.4)", bg: "rgba(0,180,120,0.08)" },
  futuro: { accent: "hsl(260, 58%, 59%)", rgb: "120, 80, 220", glow: "rgba(120,80,220,0.3)", border: "rgba(120,80,220,0.4)", bg: "rgba(120,80,220,0.08)" },
};

const modeCardColors: Record<Mode, { rgb: string }> = {
  passado: { rgb: "205, 127, 50" },
  presente: { rgb: "0, 180, 120" },
  futuro: { rgb: "120, 80, 220" },
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
    icon: Clock,
    title: "Passado",
    desc: "Onde você passou seu aniversário?",
    tagline: "Auditar um ciclo anterior",
  },
  {
    id: "presente" as Mode,
    icon: CalendarDays,
    title: "Presente",
    desc: "Onde você está passando seu aniversário este ano?",
    tagline: "Analisar o ciclo atual",
  },
  {
    id: "futuro" as Mode,
    icon: Rocket,
    title: "Futuro",
    desc: "Onde você ancora o seu Sol, define os próximos 12 meses.",
    tagline: "Projetar o próximo ciclo",
  },
];

const pathOptions = [
  {
    id: "cidade" as SearchPath,
    icon: MapPin,
    title: "Por Cidade",
    desc: "Já sabe onde quer ir? Descubra qual casa a cidade ativa.",
  },
  {
    id: "casa" as SearchPath,
    icon: Crown,
    title: "Por Casa",
    desc: "Escolha a área da vida e veja as cidades ideais.",
  },
  {
    id: "intencao" as SearchPath,
    icon: Scroll,
    title: "Por Intenção",
    desc: "Descreva seu desejo e o sistema encontra a casa certa.",
  },
];

const currentYear = new Date().getFullYear().toString();

const Index = () => {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<Mode | null>(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setMantraIndex((i) => (i + 1) % mantras.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-fill com dados natais salvos no perfil
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("profiles")
        .select("full_name, birth_date, birth_time, birth_city")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled || !data) return;
      if (data.full_name && !name) setName(data.full_name);
      if (data.birth_date && !birthdate) setBirthdate(data.birth_date);
      if (data.birth_time && !birthtime) setBirthtime(String(data.birth_time).slice(0, 5));
      if (data.birth_city && !birthPlace) {
        setBirthPlace(data.birth_city);
        setBirthPlaceValid(true);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectMode = (m: Mode) => {
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

  return (
    <>
      <StarryBackground />
      <ScanningOverlay visible={isScanning} mode={mode || "futuro"} year={year} />
      {user && <UserMenu />}

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="orbital-ring w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-30" style={{ "--speed": "80s" } as React.CSSProperties}>
            <div className="orbital-dot" />
          </div>
          <div className="orbital-ring w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-20" style={{ "--speed": "50s", animationDirection: "reverse" } as React.CSSProperties}>
            <div className="orbital-dot" style={{ opacity: 0.5 }} />
          </div>
          <div className="orbital-ring w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-15" style={{ "--speed": "30s" } as React.CSSProperties} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 float-gentle"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold-dark/20 to-transparent border border-gold/20 flex items-center justify-center backdrop-blur-sm">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center shadow-[0_0_40px_hsl(var(--gold)/0.4)]">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>
          <div className="absolute -inset-4 rounded-full border border-gold/10 pulse-ring" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold/15 bg-gold/5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Protocolo Solar · Astrologia de Relocalização
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="font-cinzel text-center text-4xl md:text-6xl lg:text-[5.5rem] font-bold mb-6 leading-[1.05] tracking-tight max-w-5xl">
          <span className="text-foreground block mb-2">DESCUBRA ONDE PASSAR</span>
          <span className="gold-gradient text-glow-gold block">SEU PRÓXIMO ANIVERSÁRIO</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm md:text-lg font-light tracking-wide max-w-3xl mx-auto leading-relaxed mb-10 px-4">
          Assuma o controle absoluto dos próximos 12 meses.
          Destrave o <span className="text-gold font-medium">GPS exato</span> da sua{" "}
          <span className="text-foreground font-medium">Prosperidade</span>,{" "}
          <span className="text-foreground font-medium">Casamento</span> ou{" "}
          <span className="text-foreground font-medium">Sucesso</span>{" "}
          mudando a sua coordenada geográfica.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex items-center gap-6 md:gap-12 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-gold font-cinzel text-xl md:text-2xl font-bold">{s.value}</p>
              <p className="text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2 text-muted-foreground/40 cursor-pointer hover:text-gold/60 transition-colors"
          onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}>
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Iniciar Protocolo</span>
          <motion.svg animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ===== STEPPER SECTION ===== */}
      <section id="form-section" className="relative px-4 pb-20 max-w-5xl mx-auto">

        {/* Step Indicator */}
        {(() => {
          const activeTheme = mode ? modeThemes[mode] : null;
          const stepActiveBg = activeTheme ? `rgb(${activeTheme.rgb})` : undefined;
          const stepActiveShadow = activeTheme ? `0 0 15px rgba(${activeTheme.rgb}, 0.3)` : undefined;
          const stepLineColor = activeTheme ? `rgba(${activeTheme.rgb}, 0.5)` : undefined;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex justify-center items-center gap-3 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step >= s
                        ? "text-background"
                        : "bg-secondary/50 text-muted-foreground border border-primary/10"
                    }`}
                    style={step >= s ? { backgroundColor: stepActiveBg || 'hsl(var(--gold))', boxShadow: stepActiveShadow || '0 0 15px hsl(var(--gold)/0.3)' } : undefined}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 md:w-20 h-px transition-all duration-300 ${step > s ? '' : 'bg-primary/10'}`}
                      style={step > s ? { backgroundColor: stepLineColor || 'hsl(var(--gold)/0.5)' } : undefined}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          );
        })()}

        {/* Back Button */}
        {step > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors mb-6 text-xs uppercase tracking-[0.15em] font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </motion.button>
        )}

        {/* Main Card */}
        {(() => {
          const activeTheme = mode ? modeThemes[mode] : null;
          return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel glass-panel-glow p-6 md:p-12 lg:p-16 relative"
          style={activeTheme ? { borderColor: `rgba(${activeTheme.rgb}, 0.15)` } : undefined}
        >
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px"
            style={{ background: activeTheme
              ? `linear-gradient(90deg, transparent, rgba(${activeTheme.rgb}, 0.4), transparent)`
              : 'linear-gradient(90deg, transparent, hsl(var(--gold)/0.3), transparent)'
            }}
          />

          <AnimatePresence mode="wait">
            {/* ===== STEP 1: Temporal Selection ===== */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-[0.1em] mb-3">
                    Seleção Temporal
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-light max-w-xl mx-auto">
                    Escolha o período que deseja explorar. Cada linha do tempo revela uma configuração energética única.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = mode === opt.id;
                    const cardColor = modeCardColors[opt.id];
                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMode(opt.id)}
                        className="p-6 md:p-8 rounded-xl border text-left transition-all duration-300 group"
                        style={{
                          borderColor: isSelected ? `rgba(${cardColor.rgb}, 0.6)` : `rgba(${cardColor.rgb}, 0.15)`,
                          background: isSelected ? `rgba(${cardColor.rgb}, 0.1)` : undefined,
                          boxShadow: isSelected ? `0 0 30px rgba(${cardColor.rgb}, 0.15)` : undefined,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all"
                          style={{
                            background: isSelected ? `rgba(${cardColor.rgb}, 0.2)` : `rgba(${cardColor.rgb}, 0.08)`,
                          }}
                        >
                          <Icon className="w-5 h-5 transition-colors" style={{ color: isSelected ? `rgb(${cardColor.rgb})` : `rgba(${cardColor.rgb}, 0.6)` }} />
                        </div>
                        <h3
                          className="font-cinzel text-sm md:text-base font-bold uppercase tracking-[0.1em] mb-2"
                          style={{ color: isSelected ? `rgb(${cardColor.rgb})` : undefined }}
                        >
                          {opt.title}
                        </h3>
                        <p className="text-muted-foreground text-[11px] md:text-xs leading-relaxed mb-3">{opt.tagline}</p>
                        <p
                          className="text-[10px] md:text-[11px] italic leading-relaxed"
                          style={{ color: isSelected ? `rgba(${cardColor.rgb}, 0.7)` : undefined }}
                        >
                          "{opt.desc}"
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: Method Selection ===== */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  {/* Selected mode badge */}
                  {(() => {
                    const theme = mode ? modeThemes[mode] : null;
                    return (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                        style={{
                          borderColor: theme ? `rgba(${theme.rgb}, 0.3)` : undefined,
                          background: theme ? `rgba(${theme.rgb}, 0.08)` : undefined,
                        }}
                      >
                        {mode && (() => {
                          const ModeIcon = modeOptions.find(m => m.id === mode)?.icon || Rocket;
                          return <ModeIcon className="w-3.5 h-3.5" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }} />;
                        })()}
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme ? `rgb(${theme.rgb})` : undefined }}>
                          {modeOptions.find(m => m.id === mode)?.title}
                        </span>
                      </div>
                    );
                  })()}

                  <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-[0.1em] mb-3">
                    Como Deseja Consultar?
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-light max-w-xl mx-auto">
                    Escolha um dos três caminhos abaixo. Cada um leva ao mesmo resultado: o destino ideal para o seu ciclo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const theme = mode ? modeThemes[mode] : null;
                    return pathOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPath(opt.id)}
                          className="p-5 md:p-6 rounded-xl border bg-card/30 text-left transition-all duration-300 group"
                          style={{ borderColor: theme ? `rgba(${theme.rgb}, 0.15)` : undefined }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-muted-foreground transition-colors" style={{ '--hover-color': theme ? `rgb(${theme.rgb})` : undefined } as React.CSSProperties} />
                            <span className="font-cinzel text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors">
                              {opt.title}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">{opt.desc}</p>
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

                <div className="text-center mb-10 md:mb-14">
                  <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-[0.1em] mb-3">
                    {formTitle}
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-light max-w-xl mx-auto">
                    {formSubtitle}
                  </p>
                </div>

                {/* Natal Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
                  <div className="space-y-7">
                    <div>
                      <div className="field-label"><span className="label-dot" /> Nome Completo</div>
                      <input type="text" className="quantum-input" placeholder="Seu nome e sobrenome" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="field-label field-label-muted"><span className="label-dot" /> Data de Nascimento</div>
                        <input type="date" className="quantum-input" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                      </div>
                      <div>
                        <div className="field-label"><span className="label-dot" /> Hora Exata</div>
                        <input type="time" className="quantum-input" value={birthtime} onChange={(e) => setBirthtime(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-7">
                    <div>
                      <div className="field-label field-label-muted"><span className="label-dot" /> Cidade de Nascimento</div>
                      <CityAutocomplete value={birthPlace} onChange={(v, valid) => { setBirthPlace(v); setBirthPlaceValid(valid); }} placeholder="Digite e selecione da lista" invalid={submitted && !birthPlaceValid} />
                    </div>
                    <div>
                      <div className="field-label"><span className="label-dot" /> {yearLabel}</div>
                      <input
                        type="number"
                        className="quantum-input text-center text-2xl font-bold text-gold h-14 font-cinzel"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={mode === "presente"}
                      />
                    </div>
                  </div>
                </div>

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
                      className="text-gold/80 font-cinzel text-[11px] md:text-sm tracking-[0.15em] uppercase italic">
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
                <div className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8">
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
          );
        })()}

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8 px-4">
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
      </section>
    </>
  );
};

export default Index;
