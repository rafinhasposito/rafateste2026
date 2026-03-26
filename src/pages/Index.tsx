import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import ScanningOverlay from "@/components/ScanningOverlay";
import CityAutocomplete from "@/components/CityAutocomplete";
import GoalCards from "@/components/GoalCards";
import SwipeButton from "@/components/SwipeButton";
import HoldButton from "@/components/HoldButton";
import { useAlert } from "@/hooks/useAlert";
import { API_URL, detectUserLocation } from "@/lib/astro";

type Mode = "futuro" | "passado";

const mantras = [
  '"Você desperta como Cocriador da sua realidade."',
  '"O destino não é fixo — é uma coordenada a ser escolhida."',
  '"Onde você ancora o seu Sol, define os próximos 12 meses."',
  '"A ignorância do mapa estelar é o maior luxo que você não pode pagar."',
  '"O universo respeita quem se move com propósito."',
];

const Index = () => {
  const { showAlert } = useAlert();
  const [mode, setMode] = useState<Mode>("futuro");
  const [isScanning, setIsScanning] = useState(false);

  // Form state
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
  const [protocolAccepted, setProtocolAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mantra rotation
  const [mantraIndex, setMantraIndex] = useState(0);
  useState(() => {
    const interval = setInterval(() => {
      setMantraIndex((i) => (i + 1) % mantras.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const handleDetectLocation = async () => {
    showAlert("Captando coordenadas...");
    const loc = await detectUserLocation();
    if (loc) {
      setOrigin(loc);
      setOriginValid(true);
    } else {
      showAlert("Permissão negada ou erro. Digite manualmente.");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { showAlert("Digite seu nome."); return; }
    if (!birthdate) { showAlert("Informe a data de nascimento."); return; }
    if (!birthtime) { showAlert("Informe a hora de nascimento."); return; }
    if (!birthPlaceValid) { showAlert("Selecione o local de nascimento na lista."); return; }
    if (!originValid) { showAlert("Selecione a cidade de origem na lista."); return; }

    if (mode === "futuro") {
      if (!goal) { showAlert("Selecione uma Casa no grid."); return; }
      if (intent.length < 50) { showAlert("O manifesto exige mínimo de 50 caracteres."); return; }
      if (!protocolAccepted) { showAlert("Deslize para aceitar o Protocolo das 24 Horas."); return; }
    }

    setIsScanning(true);

    const [ano, mes, dia] = birthdate.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      let endpoint = `${API_URL}/find_all_cities`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        name: name.trim(),
        place_of_birth: birthPlace.trim(),
        dob: dataFormatada,
        time: birthtime,
        target_year: year,
      };

      if (mode === "futuro") {
        payload.intent = intent.trim();
        payload.alvoId = goal;
        payload.prompt_mestre = `Aja como o Mestre Astrólogo. O usuário não é vítima do destino, é o arquiteto da própria linha do tempo. Crie um Relatório para ${name}, manifesto: '${intent}'. Confirme o destino como útero físico para a Casa ${goal}. Use linguagem magnética.`;
      } else {
        endpoint = `${API_URL}/audit_past`;
        payload.past_city = origin.trim();
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na comunicação.");

      // TODO: Navigate to results page with data
      console.log("Resultado:", data);
      showAlert("Cálculo concluído! (Dashboard em construção)");
      setIsScanning(false);
    } catch (error: unknown) {
      setIsScanning(false);
      const err = error as Error;
      showAlert(
        err.name === "AbortError"
          ? "A IA demorou a responder. Tente novamente."
          : "Falha na Matrix: " + err.message
      );
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="dynamic-bg" />
      <ScanningOverlay visible={isScanning} mode={mode} year={year} />

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen screen-fade">
        {/* HEADER */}
        <header className="text-center mb-8 md:mb-16 mt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] shadow-[var(--shadow-gold-sm)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            Astrologia de Relocalização
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-foreground uppercase leading-[1.1] drop-shadow-2xl"
          >
            DESCUBRA ONDE PASSAR <br />
            <span className="gold-gradient tracking-widest">SEU PRÓXIMO ANIVERSÁRIO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-xl font-light tracking-wider max-w-4xl mx-auto leading-relaxed px-4"
          >
            E assuma o controle absoluto dos próximos 12 meses. Destrave o{" "}
            <strong className="text-primary font-bold border-b border-primary/50 pb-1">
              GPS exato da sua Prosperidade, Casamento ou Sucesso
            </strong>{" "}
            mudando a sua coordenada geográfica.
          </motion.p>
        </header>

        {/* MODE SELECTOR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-10 w-full max-w-2xl mx-auto bg-quantum-900/50 p-2 rounded-3xl border border-primary/20 shadow-[var(--shadow-gold-sm)] relative z-10"
        >
          <button
            onClick={() => setMode("futuro")}
            className={`flex-1 py-4 px-6 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 flex items-center justify-center gap-3 ${
              mode === "futuro"
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold-sm)]"
                : "text-muted-foreground hover:text-foreground border border-transparent hover:border-foreground/10"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
            Projetar Meu Futuro
          </button>
          <button
            onClick={() => setMode("passado")}
            className={`flex-1 py-4 px-6 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
              mode === "passado"
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold-sm)]"
                : "text-muted-foreground hover:text-foreground border border-transparent hover:border-foreground/10"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
            </svg>
            Auditar Meu Passado
          </button>
        </motion.div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="panel-cockpit w-full p-6 md:p-16 relative overflow-hidden shadow-2xl z-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-10 md:mb-16">
            {/* LEFT COLUMN */}
            <div className="space-y-8 md:space-y-12">
              <div>
                <div className="key-indicator">
                  <span className="key-icon">I</span> Assinatura do Cocriador
                </div>
                <input
                  type="text"
                  className="quantum-input text-lg"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <div className="key-indicator">
                    <span className="key-icon">IV</span> Janela Natal
                  </div>
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">
                    Data exata
                  </label>
                  <input
                    type="date"
                    className="quantum-input"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="key-indicator hidden sm:flex opacity-0">
                    <span className="key-icon">.</span>
                  </div>
                  <label className="block text-[9px] font-bold text-primary/80 uppercase mb-2 tracking-widest">
                    Hora exata
                  </label>
                  <input
                    type="time"
                    className="quantum-input"
                    value={birthtime}
                    onChange={(e) => setBirthtime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8 md:space-y-12">
              <div>
                <div className="key-indicator">
                  <span className="key-icon">II</span> Local de Nascimento
                </div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">
                  Onde você nasceu?
                </label>
                <CityAutocomplete
                  value={birthPlace}
                  onChange={(val, valid) => {
                    setBirthPlace(val);
                    setBirthPlaceValid(valid);
                  }}
                  placeholder="Digite a cidade e selecione"
                  required
                  invalid={submitted && !birthPlaceValid}
                />
              </div>
              <div>
                <div className="key-indicator">
                  <span className="key-icon">III</span> Ponto de Partida
                </div>
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <label className="block text-[9px] font-bold text-primary uppercase mb-2 tracking-widest">
                      {mode === "futuro"
                        ? "Em qual cidade você está hoje?"
                        : "Em qual cidade passou o aniversário?"}
                    </label>
                    <CityAutocomplete
                      value={origin}
                      onChange={(val, valid) => {
                        setOrigin(val);
                        setOriginValid(valid);
                      }}
                      placeholder="Digite e selecione"
                      required
                      invalid={submitted && !originValid}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="bg-primary/10 border border-primary/30 px-4 md:px-6 rounded-xl md:rounded-2xl text-primary mt-6 h-[45px] md:h-[55px] hover:bg-primary/30 transition shadow-inner"
                    aria-label="Localização atual"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="2" x2="5" y1="12" y2="12" />
                      <line x1="19" x2="22" y1="12" y2="12" />
                      <line x1="12" x2="12" y1="2" y2="5" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="bg-black/40 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-foreground/5 mb-8 shadow-inner">
            {/* Year */}
            <div className="mb-12 w-full md:w-1/2 mx-auto">
              <label className="block text-[10px] md:text-xs font-bold text-primary uppercase mb-3 tracking-widest text-center">
                {mode === "futuro"
                  ? "Qual será o Ano do seu Próximo Aniversário?"
                  : "Qual ano você quer auditar?"}
              </label>
              <input
                type="number"
                className="quantum-input text-center text-3xl font-black text-primary h-20"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>

            {/* Cocriador Section - Future only */}
            <AnimatePresence>
              {mode === "futuro" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h3 className="font-cinzel text-lg md:text-2xl text-foreground font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
                        <path d="m21 2-9.6 9.6" />
                        <circle cx="7.5" cy="15.5" r="5.5" />
                      </svg>
                      O Despertar do Cocriador
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-light mb-6 px-2 md:px-8">
                      O dia do seu aniversário não é apenas uma data; é a semente cirúrgica de 24 horas que dita as regras
                      de todo o seu próximo ano. Ao decidir onde ancorar a sua abóbada celeste, você abandona a posição de
                      vítima do destino e se torna o Arquiteto absoluto do seu renascimento.
                    </p>
                    <div className="h-px w-24 bg-primary/50 mx-auto mb-5" />
                    <div className="h-8 flex items-center justify-center px-4">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={mantraIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-primary font-cinzel font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase drop-shadow-md"
                        >
                          {mantras[mantraIndex]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Goal Cards */}
                  <div className="mb-10">
                    <div className="key-indicator mb-8">
                      <span className="key-icon">V</span> Diretrizes Quânticas
                    </div>
                    <label className="block text-sm font-bold text-foreground uppercase mb-6 tracking-widest flex items-center justify-center gap-3 border-b border-foreground/10 pb-4">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      Qual área você exige transformar neste ciclo?
                    </label>
                    <GoalCards selectedGoal={goal} onSelect={setGoal} />
                  </div>

                  {/* Intent */}
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                      <label className="block text-xs font-bold text-primary uppercase tracking-widest">
                        Sua Intenção Central
                      </label>
                      <span
                        className={`text-[10px] font-mono ${
                          intent.length < 50 ? "text-destructive" : "text-green-500"
                        }`}
                      >
                        {intent.length} / 50 min
                      </span>
                    </div>
                    <textarea
                      className="quantum-input h-32 md:h-40 resize-none placeholder-muted-foreground/30 italic text-sm md:text-lg focus:shadow-[0_0_30px_hsl(var(--gold)/0.15)]"
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      placeholder="Descreva a realidade que já é sua. Ex: No meu próximo ano eu fecho a sociedade milionária da minha agência e lanço meu principal produto..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe Button - Future only */}
          {mode === "futuro" && (
            <div className="mb-10">
              <SwipeButton
                checked={protocolAccepted}
                onComplete={() => setProtocolAccepted(true)}
              />
            </div>
          )}

          {/* Hold Button */}
          <HoldButton
            onComplete={handleSubmit}
            label={
              mode === "futuro"
                ? "Segure para Calcular a Rota"
                : "Segure para Auditar Minha História"
            }
            sublabel="Pressione e segure por 2 segundos para selar seu destino"
          />
        </motion.div>
      </div>
    </>
  );
};

export default Index;
