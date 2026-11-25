import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Play, Volume2, VolumeX, X } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import ScanningOverlay from "@/components/ScanningOverlay";
import { getCurrentSolarYear } from "@/lib/astro";
import { prewarmSolarApi, runFreePastAudit } from "@/lib/pastAuditClient";
import {
  getTargetHouseForPriority,
  getTropicalSunSign,
  HOUSE_PILLAR_SCORES,
  type QuizPriority,
  type TravelRadius,
} from "@/lib/solarQuizUtils";
import { useI18n } from "@/lib/i18n";
import {
  FREE_PAST_STORAGE_KEY,
  type StoredFreePastPayload,
} from "@/pages/FreePastResult";
import { toast } from "sonner";

type MobileScreen = "quiz" | "plans";

function MobileRing({ value, label }: { value: number; label: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const off = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(7,16,26,0.09)" strokeWidth="3.5" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="#C9A227"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={off}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-sans text-xs font-bold text-[#07101A] tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.14em] text-[#07101A]/60 mt-1.5 font-semibold">
        {label}
      </span>
    </div>
  );
}

export function MobileHomeFlow() {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    prewarmSolarApi();
  }, []);

  const [screen, setScreen] = useState<MobileScreen>("quiz");
  const [mode, setMode] = useState<"next" | "past">("next");
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [priority, setPriority] = useState<QuizPriority>("money");
  const [radius, setRadius] = useState<TravelRadius>("1000km");

  const [firstName, setFirstName] = useState(() => sessionStorage.getItem("ps_natal_name") || "");
  const [birthDate, setBirthDate] = useState(() => sessionStorage.getItem("ps_natal_date") || "");
  const [birthTime, setBirthTime] = useState(() => sessionStorage.getItem("ps_natal_time") || "12:00");
  const [unknownTime, setUnknownTime] = useState(
    () => sessionStorage.getItem("ps_natal_unknown_time") === "1"
  );
  const [birthCity, setBirthCity] = useState(() => sessionStorage.getItem("ps_natal_place") || "");
  const [birthCityValid, setBirthCityValid] = useState(() =>
    Boolean(sessionStorage.getItem("ps_natal_place"))
  );
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>(() => {
    const lat = sessionStorage.getItem("ps_natal_lat");
    const lon = sessionStorage.getItem("ps_natal_lon");
    return lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
  });

  const currentYear = new Date().getFullYear();
  const defaultPastYear = useMemo(() => {
    if (birthDate) return getCurrentSolarYear(birthDate);
    return String(currentYear - 1);
  }, [birthDate, currentYear]);

  const [pastYear, setPastYear] = useState<string>(() => defaultPastYear);
  useEffect(() => {
    if (birthDate) setPastYear(getCurrentSolarYear(birthDate));
  }, [birthDate]);

  const [refCity, setRefCity] = useState("");
  const [refCoords, setRefCoords] = useState<CityCoords | undefined>(undefined);
  const [calculating, setCalculating] = useState(false);
  const [contrastResult, setContrastResult] = useState<StoredFreePastPayload | null>(null);

  // Optional vertical 9:16 video explainer modal
  const [reelOpen, setReelOpen] = useState(false);
  const [reelMuted, setReelMuted] = useState(false);
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!reelOpen) return;
    const el = reelVideoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.muted = false;
    setReelMuted(false);
    void el.play().catch(() => {
      el.muted = true;
      setReelMuted(true);
      void el.play();
    });
  }, [reelOpen]);

  const detectedSign = useMemo(() => getTropicalSunSign(birthDate), [birthDate]);
  const yearOptions = [
    String(currentYear),
    String(currentYear - 1),
    String(currentYear - 2),
    String(currentYear - 3),
    String(currentYear - 4),
    String(currentYear - 5),
  ];

  const handleSubmitStep4 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCity.trim()) {
      toast.error("Informe a cidade para concluir o cálculo.");
      return;
    }

    setCalculating(true);
    try {
      const payload = await runFreePastAudit({
        firstName,
        birthDate,
        birthTime,
        unknownTime,
        birthCity,
        birthCoords,
        pastYear,
        pastCity: refCity,
        pastCoords: refCoords,
      });
      sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(payload));
      if (mode === "past") {
        navigate("/meu-passado");
      } else {
        setContrastResult(payload);
        setStep(5);
      }
    } catch (err: any) {
      toast.error(err?.message || "Confira as cidades informadas e tente novamente.");
    } finally {
      setCalculating(false);
    }
  };

  const handleCheckout = (pkg: "1" | "3" | "full") => {
    const targetHouse = getTargetHouseForPriority(priority);
    navigate(
      `/credits?pkg=${pkg}&returnTo=${encodeURIComponent(
        `/?mode=futuro&path=casa&house=${targetHouse}`
      )}`
    );
  };

  const stayHouseNum = contrastResult?.nextStayHouse || 6;
  const stayScores = HOUSE_PILLAR_SCORES[stayHouseNum] || HOUSE_PILLAR_SCORES[6];
  const stayCopy = t.houses[stayHouseNum];
  const targetHouseCopy = t.houses[getTargetHouseForPriority(priority)];

  const reelModal = (
    <AnimatePresence>
      {reelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] bg-black flex flex-col justify-between"
        >
          <video
            ref={reelVideoRef}
            src="/videos/v3/filme-protocolo-9x16.mp4"
            poster="/videos/v3/filme-protocolo-9x16-v3-poster.jpg"
            playsInline
            controls
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
          <div
            className="relative z-10 px-4 pt-4 flex items-center justify-between"
            style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 14px)" }}
          >
            <span className="text-xs uppercase tracking-[0.18em] text-[#E8D59B]">
              Protocolo Solar
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const el = reelVideoRef.current;
                  if (!el) return;
                  el.muted = !reelMuted;
                  setReelMuted(!reelMuted);
                }}
                aria-label="Som"
                className="w-10 h-10 rounded-full bg-black/65 border border-white/20 flex items-center justify-center text-white"
              >
                {reelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  reelVideoRef.current?.pause();
                  setReelOpen(false);
                }}
                aria-label="Fechar"
                className="w-10 h-10 rounded-full bg-black/65 border border-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full min-h-[calc(100svh-4rem)] bg-[#FAF7F2] text-[#07101A] font-sans overflow-x-hidden flex flex-col pb-20">
      <ScanningOverlay visible={calculating} mode="passado" />

      {/* =====================================================================
          SCREEN 1: NEBULA-STYLE MOBILE QUIZ FUNNEL (ABOVE THE FOLD, HARMONIOUS)
          ===================================================================== */}
      {screen === "quiz" && (
        <div className="flex-1 flex flex-col">
          {/* Compact Celestial Brand Header Zone (#02050A Void + Official Solar Wheel) */}
          <div className="relative pt-16 pb-9 px-6 bg-[#02050A] overflow-hidden flex items-center justify-between">
            <div className="relative z-10 max-w-[235px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E8D59B]">
                O GPS DO SEU NOVO CICLO
              </p>
              <p className="font-display text-lg text-[#F2F4F7] leading-snug mt-1">
                {mode === "past"
                  ? "Validação gratuita do seu último aniversário"
                  : step === 1
                  ? "Planejamento anual por coordenadas"
                  : `Passo 0${step} de 04`}
              </p>
            </div>

            <img
              src="/brand/protocolo-solar-simbolo-transparente-2048.png"
              alt="Roda Solar"
              className="w-20 h-20 object-contain opacity-90 shrink-0"
            />
          </div>

          {/* Seamless Warm Pearl Sheet (#FAF7F2 — Apitex Clean Tonal Surface) */}
          <div className="flex-1 -mt-4 rounded-t-[30px] bg-[#FAF7F2] px-5 pt-6 pb-8">
            {/* Step Progress Hairline when inside steps 2..4 */}
            {step > 1 && step < 5 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === "past" && step === 2) {
                        setMode("next");
                        setStep(1);
                      } else {
                        setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07101A]/75 py-1"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8D6914]" />
                    <span>Voltar</span>
                  </button>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#8D6914] font-semibold">
                    {mode === "past" ? "Teste Grátis" : `Etapa ${step}/4`}
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[#07101A]/10 overflow-hidden">
                  <div
                    className="h-full bg-[#C9A227] transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1 — Decision Question Immediately Visible Without Scrolling */}
              {step === 1 && (
                <motion.div
                  key="m1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <h1 className="font-display text-[28px] text-[#07101A] leading-[1.12]">
                    Qual área é sua prioridade nº 1 nos próximos 12 meses?
                  </h1>
                  <p className="text-sm text-[#07101A]/65 mt-2 mb-5 leading-relaxed">
                    Toque em um objetivo para calcularmos suas melhores cidades perto de casa e pelo mundo.
                  </p>

                  {/* 3 Clean Tonal Touch Rows (Zero Heavy Borders, Soft Apitex Surface) */}
                  <div className="space-y-2.5">
                    {[
                      {
                        id: "money" as QuizPriority,
                        roman: "II · X",
                        title: "Dinheiro & Carreira",
                        sub: "Patrimônio, valorização e projeção profissional",
                      },
                      {
                        id: "love" as QuizPriority,
                        roman: "V · VII",
                        title: "Amor & Relacionamentos",
                        sub: "Encontros, magnetismo pessoal e alianças sérias",
                      },
                      {
                        id: "life" as QuizPriority,
                        roman: "I · VI · IX",
                        title: "Mudança de Vida & Bem-Estar",
                        sub: "Saúde, constância na rotina, viagens e paz",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setMode("next");
                          setPriority(opt.id);
                          setStep(2);
                        }}
                        className="w-full rounded-2xl bg-white px-5 py-4 text-left flex items-center justify-between gap-3 shadow-[0_6px_20px_rgba(7,16,26,0.04)] active:scale-[0.985] transition-transform"
                      >
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-[#8D6914] font-semibold">
                            CASAS {opt.roman}
                          </span>
                          <span className="block font-display text-lg text-[#07101A] mt-0.5">
                            {opt.title}
                          </span>
                          <span className="block text-xs text-[#07101A]/60 mt-0.5">{opt.sub}</span>
                        </div>
                        <span className="w-9 h-9 rounded-full bg-[#07101A] text-[#E8D59B] flex items-center justify-center shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Clean Hairline Actions: Free Past Validation + Video + Plans */}
                  <div className="mt-6 pt-5 border-t border-[#07101A]/10 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("past");
                        setStep(2);
                      }}
                      className="w-full h-12 rounded-full bg-[#07101A] text-[#E8D59B] text-xs font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
                    >
                      <span>Testar grátis meu último aniversário</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-between px-1 pt-1 text-xs text-[#07101A]/70">
                      <button
                        type="button"
                        onClick={() => setReelOpen(true)}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#07101A]"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                        <span>Explicação em vídeo (1m30)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setScreen("plans")}
                        className="font-semibold text-[#8D6914] underline underline-offset-4"
                      >
                        Planos a partir de R$ 19,90
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Name + Birth Date + Tropical Sun Micro-Reward */}
              {step === 2 && (
                <motion.div
                  key="m2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <h2 className="font-display text-2xl text-[#07101A] leading-snug">
                    Como podemos te chamar e quando você nasceu?
                  </h2>

                  <div>
                    <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                      Primeiro nome
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex.: Mariana"
                      autoComplete="given-name"
                      className="w-full h-12 rounded-xl bg-white border border-[#07101A]/14 px-4 text-base text-[#07101A] placeholder:text-[#07101A]/35 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      max={`${currentYear - 1}-12-31`}
                      className="w-full h-12 rounded-xl bg-white border border-[#07101A]/14 px-4 text-base text-[#07101A] focus:outline-none focus:border-[#C9A227] [color-scheme:light]"
                    />
                  </div>

                  {detectedSign && (
                    <div className="py-3 border-y border-[#07101A]/10 flex items-center justify-between text-xs">
                      <span className="text-[#07101A]/65">Sol Tropical identificado</span>
                      <span className="font-display text-base text-[#8D6914] font-semibold">
                        {detectedSign}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!firstName.trim()) {
                        toast.error("Informe seu primeiro nome.");
                        return;
                      }
                      if (!birthDate) {
                        toast.error("Selecione sua data de nascimento.");
                        return;
                      }
                      setStep(3);
                    }}
                    className="w-full h-13 py-3.5 rounded-full bg-[#07101A] text-[#E8D59B] font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 3 — Birth Time + Natal City */}
              {step === 3 && (
                <motion.div
                  key="m3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <h2 className="font-display text-2xl text-[#07101A] leading-snug">
                    Horário e cidade de nascimento
                  </h2>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#07101A]/70">
                        Horário na certidão
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !unknownTime;
                          setUnknownTime(next);
                          if (next) setBirthTime("12:00");
                        }}
                        className="text-xs font-semibold text-[#8D6914] underline underline-offset-4"
                      >
                        {unknownTime ? "Informar hora exata" : "Usar 12:00 aproximado"}
                      </button>
                    </div>
                    <input
                      type="time"
                      value={unknownTime ? "12:00" : birthTime}
                      disabled={unknownTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full h-12 rounded-xl bg-white border border-[#07101A]/14 px-4 text-base text-[#07101A] disabled:opacity-45 focus:outline-none focus:border-[#C9A227] [color-scheme:light]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                      Cidade natal
                    </label>
                    <div className="h-12">
                      <CityAutocomplete
                        variant="light"
                        value={birthCity}
                        onChange={(val, valid, coords) => {
                          setBirthCity(val);
                          setBirthCityValid(valid);
                          if (coords) setBirthCoords(coords);
                        }}
                        placeholder="Digite e selecione sua cidade natal..."
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!birthCity.trim() || (!birthCityValid && birthCity.trim().length < 3)) {
                        toast.error("Escolha sua cidade natal na lista.");
                        return;
                      }
                      setStep(4);
                    }}
                    className="w-full py-3.5 rounded-full bg-[#07101A] text-[#E8D59B] font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 4 — Travel Radius + Current City OR Past Birthday City */}
              {step === 4 && (
                <motion.form
                  key="m4"
                  onSubmit={handleSubmitStep4}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  {mode === "next" ? (
                    <>
                      <h2 className="font-display text-2xl text-[#07101A] leading-snug">
                        Qual raio de distância você prefere avaliar?
                      </h2>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "1000km" as TravelRadius, label: "1.000 km", sub: "Perto" },
                          { id: "3000km" as TravelRadius, label: "3.000 km", sub: "Continental" },
                          { id: "global" as TravelRadius, label: "Global", sub: "Mundo" },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRadius(r.id)}
                            className={`py-3 px-2 rounded-2xl text-center transition-all ${
                              radius === r.id
                                ? "bg-[#07101A] text-[#E8D59B] font-semibold"
                                : "bg-white text-[#07101A]/75 border border-[#07101A]/12"
                            }`}
                          >
                            <span className="block text-xs">{r.label}</span>
                            <span className="block text-[10px] opacity-70">{r.sub}</span>
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                          Em qual cidade você mora hoje? (comparativo gratuito)
                        </label>
                        <div className="h-12">
                          <CityAutocomplete
                            variant="light"
                            value={refCity}
                            onChange={(val, _valid, coords) => {
                              setRefCity(val);
                              if (coords) setRefCoords(coords);
                            }}
                            placeholder="Ex.: São Paulo, Rio, Lisboa..."
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-display text-2xl text-[#07101A] leading-snug">
                        Onde você passou seu último aniversário?
                      </h2>

                      <div>
                        <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                          Ano do aniversário
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {yearOptions.map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => setPastYear(yr)}
                              className={`h-10 rounded-xl text-xs font-semibold transition-all ${
                                pastYear === yr
                                  ? "bg-[#07101A] text-[#E8D59B]"
                                  : "bg-white border border-[#07101A]/12 text-[#07101A]"
                              }`}
                            >
                              {yr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#07101A]/70 mb-1.5">
                          Cidade onde você estava
                        </label>
                        <div className="h-12">
                          <CityAutocomplete
                            variant="light"
                            value={refCity}
                            onChange={(val, _valid, coords) => {
                              setRefCity(val);
                              if (coords) setRefCoords(coords);
                            }}
                            placeholder="Digite e selecione a cidade..."
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full h-14 rounded-full bg-[#C9A227] text-[#02050A] font-semibold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-55"
                  >
                    <span>
                      {calculating
                        ? "Calculando coordenadas..."
                        : mode === "past"
                        ? "Revelar meu ano passado grátis"
                        : "Gerar meu diagnóstico gratuito"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              )}

              {/* STEP 5 — Free Contrast Diagnosis + Clean R$ 19,90 Impulse Paywall */}
              {step === 5 && contrastResult && (
                <motion.div
                  key="m5"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8D6914]">
                      DIAGNÓSTICO GRATUITO · SE FICAR EM {contrastResult.pastCityShort.toUpperCase()}
                    </p>
                    <h2 className="font-display text-2xl text-[#07101A] mt-1">
                      Casa {stayScores.roman} · {stayCopy.title}
                    </h2>
                    <p className="text-xs text-[#07101A]/70 mt-1.5 leading-relaxed">
                      {stayCopy.focus}
                    </p>
                  </div>

                  {/* 3 Clean Radial Rings (Apitex / Mockup Precision) */}
                  <div className="py-5 border-y border-[#07101A]/10 grid grid-cols-3 gap-2">
                    <MobileRing value={stayScores.money} label="Dinheiro" />
                    <MobileRing value={stayScores.love} label="Amor" />
                    <MobileRing value={stayScores.life} label="Bem-Estar" />
                  </div>

                  {/* Locked Ideal Cities Escalated by Distance */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-[#07101A]">
                      Pronto para liberar para {firstName} ({targetHouseCopy.shortTag}):
                    </p>
                    <div className="divide-y divide-[#07101A]/8 bg-white rounded-2xl px-4">
                      {[
                        "Melhor destino até 1.000 km de casa",
                        "Melhor destino continental até 3.000 km",
                        "Melhor coordenada global + minuto UTC exato",
                      ].map((row, idx) => (
                        <div key={idx} className="py-3 flex items-center gap-2.5 text-xs text-[#07101A]/85">
                          <Check className="w-4 h-4 text-[#8D6914] shrink-0" />
                          <span>{row}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCheckout("1")}
                    className="w-full h-14 rounded-full bg-[#C9A227] text-[#02050A] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Liberar meus destinos · R$ 19,90</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#07101A]/70 px-1">
                    <button
                      type="button"
                      onClick={() => navigate("/meu-passado")}
                      className="underline underline-offset-4"
                    >
                      Ler meu último ano grátis
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreen("plans")}
                      className="font-semibold text-[#8D6914] underline underline-offset-4"
                    >
                      Ver pacotes 3 ou 12 Casas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: CLEAN HARMONIOUS PLANS LEDGER (ZERO RAINBOW BOXES)
          ===================================================================== */}
      {screen === "plans" && (
        <div className="flex-1 pt-16 bg-[#FAF7F2] px-5 pb-10">
          <div className="pt-3 pb-5 border-b border-[#07101A]/10">
            <button
              type="button"
              onClick={() => setScreen("quiz")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07101A]/75 py-1"
            >
              <ArrowLeft className="w-4 h-4 text-[#8D6914]" />
              <span>Voltar</span>
            </button>
            <h2 className="font-display text-2xl text-[#07101A] mt-2">
              Escolha seu acesso imediato
            </h2>
            <p className="text-xs text-[#07101A]/65 mt-1">
              Pagamento único via Pix ou cartão, sem assinatura.
            </p>
          </div>

          <div className="divide-y divide-[#07101A]/10">
            {[
              {
                pkg: "1" as const,
                tag: "01 · ENTRADA INDIVIDUAL",
                title: "1 Objetivo ou 1 Cidade",
                price: "19",
                desc: "Sugestões até 1.000 km, 3.000 km e Global + 8 áreas da vida.",
                primary: false,
              },
              {
                pkg: "3" as const,
                tag: "02 · COMPARAÇÃO DE VIAGEM",
                title: "Comparador de 3 Destinos",
                price: "49",
                desc: "Compare até 3 cidades reais lado a lado com pontuação 0–100.",
                primary: true,
              },
              {
                pkg: "full" as const,
                tag: "03 · VISÃO INTEGRAL",
                title: "Mapa Completo (12 Casas)",
                price: "99",
                desc: "Todas as 12 Casas Solares do próximo aniversário liberadas.",
                primary: false,
              },
            ].map((p) => (
              <div key={p.pkg} className="py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8D6914]">
                      {p.tag}
                    </p>
                    <h3 className="font-display text-xl text-[#07101A] mt-0.5">{p.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#07101A]/60">R$ </span>
                    <span className="font-display text-3xl text-[#07101A]">{p.price}</span>
                    <span className="text-xs font-semibold text-[#07101A]">,90</span>
                  </div>
                </div>

                <p className="text-xs text-[#07101A]/68 mt-1.5 mb-3.5 leading-relaxed">{p.desc}</p>

                <button
                  type="button"
                  onClick={() => handleCheckout(p.pkg)}
                  className={`w-full h-11 rounded-full text-xs font-semibold transition-all ${
                    p.primary
                      ? "bg-[#07101A] text-[#E8D59B]"
                      : "bg-white border border-[#07101A]/20 text-[#07101A]"
                  }`}
                >
                  Selecionar · R$ {p.price},90
                </button>
              </div>
            ))}
          </div>

          <div className="pt-5 border-t border-[#07101A]/10 text-center">
            <Link
              to="/resgatar"
              className="text-xs font-semibold text-[#8D6914] underline underline-offset-4"
            >
              Possui código de presente ou convite VIP? Resgatar aqui →
            </Link>
          </div>
        </div>
      )}

      {typeof document !== "undefined" ? createPortal(reelModal, document.body) : null}
    </div>
  );
}
