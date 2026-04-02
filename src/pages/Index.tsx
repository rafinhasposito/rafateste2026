import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crown, Scroll } from "lucide-react";
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

type Mode = "futuro" | "passado";
type SearchPath = "cidade" | "casa" | "intencao" | null;

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

const Index = () => {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("futuro");
  const [isScanning] = useState(false);
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

  const natalDataReady = !!(name.trim() && birthdate && birthtime && birthPlaceValid);

  return (
    <>
      <StarryBackground />
      <ScanningOverlay visible={isScanning} mode={mode} year={year} />
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

      {/* ===== FORM SECTION ===== */}
      <section id="form-section" className="relative px-4 pb-20 max-w-5xl mx-auto">
        {/* Mode Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex justify-center gap-2 mb-8 w-full max-w-lg mx-auto">
          {(["futuro", "passado"] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setSearchPath(null); }}
              className={`flex-1 py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2.5 ${
                mode === m
                  ? "bg-gold text-background shadow-[0_4px_20px_hsl(var(--gold)/0.3)]"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>
              {m === "futuro" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
                </svg>
              )}
              {m === "futuro" ? "Projetar Futuro" : "Auditar Passado"}
            </button>
          ))}
        </motion.div>

        {/* Main Form Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel glass-panel-glow p-6 md:p-12 lg:p-16 relative">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground uppercase tracking-[0.1em] mb-3">
              {mode === "futuro" ? "Calibração Estelar" : "Resgate da Linha do Tempo"}
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm font-light max-w-xl mx-auto">
              {mode === "futuro"
                ? "Insira suas coordenadas natais para que o algoritmo astrofísico calcule a rota exata da sua prosperidade."
                : "Insira os dados do ano que deseja auditar e descubra o que o Universo havia preparado para você."}
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
                <div className="field-label"><span className="label-dot" /> {mode === "futuro" ? "Ano do Próximo Aniversário" : "Ano a Auditar"}</div>
                <input type="number" className="quantum-input text-center text-2xl font-bold text-gold h-14 font-cinzel" value={year} onChange={(e) => setYear(e.target.value)} />
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

          {/* ===== 3-PATH DECISION ===== */}
          <div className="mb-10">
            <div className="text-center mb-8">
              <h3 className="font-cinzel text-lg md:text-xl font-bold text-foreground uppercase tracking-[0.1em] mb-2">
                Como Deseja Consultar?
              </h3>
              <p className="text-muted-foreground text-xs font-light">
                Escolha um dos três caminhos abaixo. Cada um leva ao mesmo resultado: o destino ideal para o seu ciclo.
              </p>
            </div>

            {/* Path Selector Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {pathOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = searchPath === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSearchPath(isSelected ? null : opt.id)}
                    className={`p-5 rounded-xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[0_0_25px_hsl(var(--gold)/0.15)]"
                        : "border-primary/15 bg-card/30 hover:border-primary/30 hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`font-cinzel text-xs font-bold uppercase tracking-[0.1em] ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {opt.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{opt.desc}</p>
                  </motion.button>
                );
              })}
            </div>

            {/* Natal data warning */}
            {searchPath && !natalDataReady && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 mb-6 text-center">
                <p className="text-destructive text-xs font-semibold">
                  Preencha todos os dados natais acima (nome, data, hora e cidade de nascimento) antes de continuar.
                </p>
              </motion.div>
            )}

            {/* Path Content */}
            <AnimatePresence mode="wait">
              {searchPath === "cidade" && (
                <motion.div key="cidade" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8">
                  <CityLookup name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} />
                </motion.div>
              )}
              {searchPath === "casa" && (
                <motion.div key="casa" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8">
                  <HouseLookup name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} />
                </motion.div>
              )}
              {searchPath === "intencao" && (
                <motion.div key="intencao" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8">
                  <IntentLookup name={name} birthdate={birthdate} birthtime={birthtime} birthPlace={birthPlace} year={year} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        </motion.div>

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
