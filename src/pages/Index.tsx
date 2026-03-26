import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import ScanningOverlay from "@/components/ScanningOverlay";
import CityAutocomplete from "@/components/CityAutocomplete";
import GoalCards from "@/components/GoalCards";
import ConstellationSubmit from "@/components/ConstellationSubmit";
import UserMenu from "@/components/UserMenu";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { API_URL, detectUserLocation } from "@/lib/astro";

type Mode = "futuro" | "passado";

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

const Index = () => {
  const { showAlert } = useAlert();
  const [mode, setMode] = useState<Mode>("futuro");
  const [isScanning, setIsScanning] = useState(false);

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthPlaceValid, setBirthPlaceValid] = useState(false);
  const [origin, setOrigin] = useState("");
  const [originValid, setOriginValid] = useState(false);
  const [year, setYear] = useState("2026");
  const [goal, setGoal] = useState<number | null>(null);
  const [intent, setIntent] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [mantraIndex, setMantraIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMantraIndex((i) => (i + 1) % mantras.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDetectLocation = async () => {
    showAlert("Captando coordenadas via satélite...");
    const loc = await detectUserLocation();
    if (loc) { setOrigin(loc); setOriginValid(true); }
    else { showAlert("Permissão negada ou erro. Digite manualmente."); }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!name.trim()) { showAlert("Digite seu nome."); return; }
    if (!birthdate) { showAlert("Informe a data de nascimento."); return; }
    if (!birthtime) { showAlert("Informe a hora de nascimento."); return; }
    if (!birthPlaceValid) { showAlert("Selecione o local de nascimento na lista."); return; }
    if (!originValid) { showAlert("Selecione a cidade de origem na lista."); return; }
    if (mode === "futuro") {
      if (!goal) { showAlert("Selecione uma Casa no grid."); return; }
      if (intent.length < 50) { showAlert("O manifesto exige mínimo de 50 caracteres."); return; }
      
    }

    setIsScanning(true);
    const [ano, mes, dia] = birthdate.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      let endpoint = `${API_URL}/find_all_cities`;
      const payload: Record<string, unknown> = {
        name: name.trim(), place_of_birth: birthPlace.trim(),
        dob: dataFormatada, time: birthtime, target_year: year,
      };
      if (mode === "futuro") {
        payload.intent = intent.trim(); payload.alvoId = goal;
        payload.prompt_mestre = `Aja como o Mestre Astrólogo. O usuário não é vítima do destino, é o arquiteto da própria linha do tempo. Crie um Relatório para ${name}, manifesto: '${intent}'. Confirme o destino como útero físico para a Casa ${goal}. Use linguagem magnética.`;
      } else { endpoint = `${API_URL}/audit_past`; payload.past_city = origin.trim(); }

      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na comunicação.");
      console.log("Resultado:", data);
      showAlert("Cálculo concluído! (Dashboard em construção)");
      setIsScanning(false);
    } catch (error: unknown) {
      setIsScanning(false);
      const err = error as Error;
      showAlert(err.name === "AbortError" ? "A IA demorou a responder. Tente novamente." : "Falha na Matrix: " + err.message);
    }
  };

  return (
    <>
      <StarryBackground />
      <ScanningOverlay visible={isScanning} mode={mode} year={year} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Orbital rings decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="orbital-ring w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-30" style={{ "--speed": "80s" } as React.CSSProperties}>
            <div className="orbital-dot" />
          </div>
          <div className="orbital-ring w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-20" style={{ "--speed": "50s", animationDirection: "reverse" } as React.CSSProperties}>
            <div className="orbital-dot" style={{ opacity: 0.5 }} />
          </div>
          <div className="orbital-ring w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-15" style={{ "--speed": "30s" } as React.CSSProperties} />
        </div>

        {/* GPS Pin Icon */}
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

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold/15 bg-gold/5 backdrop-blur-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Protocolo Solar · Astrologia de Relocalização
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-cinzel text-center text-4xl md:text-6xl lg:text-[5.5rem] font-bold mb-6 leading-[1.05] tracking-tight max-w-5xl"
        >
          <span className="text-foreground block mb-2">DESCUBRA ONDE PASSAR</span>
          <span className="gold-gradient text-glow-gold block">SEU PRÓXIMO ANIVERSÁRIO</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm md:text-lg font-light tracking-wide max-w-3xl mx-auto leading-relaxed mb-10 px-4"
        >
          Assuma o controle absoluto dos próximos 12 meses.
          Destrave o <span className="text-gold font-medium">GPS exato</span> da sua{" "}
          <span className="text-foreground font-medium">Prosperidade</span>,{" "}
          <span className="text-foreground font-medium">Casamento</span> ou{" "}
          <span className="text-foreground font-medium">Sucesso</span>{" "}
          mudando a sua coordenada geográfica.
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-6 md:gap-12 mb-12"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-gold font-cinzel text-xl md:text-2xl font-bold">{s.value}</p>
              <p className="text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2 text-muted-foreground/40 cursor-pointer hover:text-gold/60 transition-colors"
          onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Iniciar Protocolo</span>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section id="form-section" className="relative px-4 pb-20 max-w-5xl mx-auto">
        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-8 w-full max-w-lg mx-auto"
        >
          {(["futuro", "passado"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2.5 ${
                mode === m
                  ? "bg-gold text-background shadow-[0_4px_20px_hsl(var(--gold)/0.3)]"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel glass-panel-glow p-6 md:p-12 lg:p-16 relative"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {/* Section Header */}
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

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
            {/* LEFT */}
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

            {/* RIGHT */}
            <div className="space-y-7">
              <div>
                <div className="field-label field-label-muted"><span className="label-dot" /> Cidade de Nascimento</div>
                <CityAutocomplete value={birthPlace} onChange={(v, valid) => { setBirthPlace(v); setBirthPlaceValid(valid); }} placeholder="Digite e selecione da lista" invalid={submitted && !birthPlaceValid} />
              </div>
              <div>
                <div className="field-label"><span className="label-dot" /> {mode === "futuro" ? "Onde Você Está Hoje" : "Onde Passou o Aniversário"}</div>
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <CityAutocomplete value={origin} onChange={(v, valid) => { setOrigin(v); setOriginValid(valid); }} placeholder="Digite e selecione" invalid={submitted && !originValid} />
                  </div>
                  <button type="button" onClick={handleDetectLocation} className="shrink-0 w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all flex items-center justify-center mt-0" aria-label="GPS">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-gold/20 border border-gold/30" />
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
          </div>

          {/* Year */}
          <div className="mb-10 max-w-xs mx-auto text-center">
            <div className="field-label justify-center"><span className="label-dot" /> {mode === "futuro" ? "Ano do Próximo Aniversário" : "Ano a Auditar"}</div>
            <input type="number" className="quantum-input text-center text-3xl font-bold text-gold h-16 font-cinzel" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>

          {/* FUTURE-ONLY SECTIONS */}
          <AnimatePresence>
            {mode === "futuro" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5 }}>
                {/* Mantra */}
                <div className="text-center mb-10">
                  <div className="h-px w-16 bg-gold/30 mx-auto mb-6" />
                  <AnimatePresence mode="wait">
                    <motion.p key={mantraIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-gold/80 font-cinzel text-[11px] md:text-sm tracking-[0.15em] uppercase italic">
                      "{mantras[mantraIndex]}"
                    </motion.p>
                  </AnimatePresence>
                  <div className="h-px w-16 bg-gold/30 mx-auto mt-6" />
                </div>

                {/* Goal Selection */}
                <div className="mb-10">
                  <div className="text-center mb-8">
                    <h3 className="font-cinzel text-lg md:text-xl font-bold text-foreground uppercase tracking-[0.1em] mb-2">
                      Qual Área Você Exige Transformar?
                    </h3>
                    <p className="text-muted-foreground text-xs font-light">Selecione a Casa que representa o seu maior objetivo para este ciclo</p>
                  </div>
                  <GoalCards selectedGoal={goal} onSelect={setGoal} />
                </div>

                {/* Intent */}
                <div className="mb-10">
                  <div className="flex justify-between items-end mb-3">
                    <div className="field-label mb-0"><span className="label-dot" /> Manifesto de Intenção</div>
                    <span className={`text-[10px] font-mono ${intent.length < 50 ? "text-destructive/70" : "text-green-500/70"}`}>
                      {intent.length}/50 min
                    </span>
                  </div>
                  <textarea
                    className="quantum-input h-32 md:h-36 resize-none text-sm md:text-base"
                    value={intent} onChange={(e) => setIntent(e.target.value)}
                    placeholder="Descreva com detalhes a realidade que já é sua. Ex: No meu próximo ano eu fecho a sociedade milionária da minha agência..."
                  />
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <ConstellationSubmit
            onComplete={handleSubmit}
            label={mode === "futuro" ? "Calcular Rota Estelar" : "Auditar Minha História"}
          />

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8 px-4"
        >
          {[
            { icon: "🛡️", text: "Dados 100% Privados" },
            { icon: "🔬", text: "Efemérides Suíças (JPL)" },
            { icon: "🤖", text: "IA Mestre Astrólogo" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-muted-foreground/50">
              <span className="text-sm">{b.icon}</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium">{b.text}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Index;
