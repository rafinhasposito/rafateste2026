import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Play, Volume2, VolumeX, X } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import ScanningOverlay from "@/components/ScanningOverlay";
import { MobileHomeFlow } from "@/components/mobile/MobileHomeFlow";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import { getCurrentSolarYear } from "@/lib/astro";
import { prewarmSolarApi, runFreePastAudit } from "@/lib/pastAuditClient";
import { saveStoredAffiliateRef } from "@/lib/affiliates";
import {
  getTargetHouseForPriority,
  getTropicalSunSign,
  HOUSE_PILLAR_SCORES,
  type QuizPriority,
  type TravelRadius,
} from "@/lib/solarQuizUtils";
import {
  FREE_PAST_STORAGE_KEY,
  type StoredFreePastPayload,
} from "@/pages/FreePastResult";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

interface LandingV3Props {
  embeddedInShell?: boolean;
}

interface RealDestinationExample {
  id: string;
  tierLabel: string;
  city: string;
  country: string;
  coords: string;
  houseNum: number;
  houseRoman: string;
  themeTitle: string;
  arrivalNote: string;
  scores: { money: number; love: number; career: number };
  imageSrc: string;
  videoSrc: string;
}

// Exemplos fotográficos reais de cidades escalonadas por raio (zero personagem de IA)
const REAL_DESTINATION_EXAMPLES: RealDestinationExample[] = [
  {
    id: "florianopolis",
    tierLabel: "ATÉ 1.000 KM · ESCAPADA REGIONAL",
    city: "Florianópolis",
    country: "Brasil",
    coords: "27°35'S · 48°32'W",
    houseNum: 2,
    houseRoman: "II",
    themeTitle: "Patrimônio, Margem & Estabilidade",
    arrivalNote: "Retorno Solar às 14:18 BRT · Chegada recomendada até 24h antes",
    scores: { money: 95, love: 74, career: 88 },
    imageSrc: "/images/abertura/florianopolis.jpg",
    videoSrc: "/assets/cities/florianopolis.mp4",
  },
  {
    id: "rome",
    tierLabel: "GLOBAL · EUROPA MEDITERRÂNEA",
    city: "Roma",
    country: "Itália",
    coords: "41°54'N · 12°29'E",
    houseNum: 5,
    houseRoman: "V",
    themeTitle: "Magnetismo, Romance & Expressão Autoral",
    arrivalNote: "Retorno Solar às 19:18 CET · Permanência mínima de 12 a 24h",
    scores: { money: 78, love: 96, career: 84 },
    imageSrc: "/images/abertura/roma.jpg",
    videoSrc: "/assets/cities/florence.mp4",
  },
  {
    id: "zurich",
    tierLabel: "GLOBAL · EIXO FINANCEIRO",
    city: "Zurique",
    country: "Suíça",
    coords: "47°22'N · 08°32'E",
    tierLabelShort: "Zurique",
    houseNum: 10,
    houseRoman: "X",
    themeTitle: "Autoridade Pública, Posicionamento & Topo",
    arrivalNote: "Retorno Solar às 19:18 CET · Coordenada de Meio-do-Céu elevado",
    scores: { money: 94, love: 71, career: 97 },
    imageSrc: "/images/abertura/zurich.jpg",
    videoSrc: "/assets/cities/zurich.mp4",
  } as RealDestinationExample & { tierLabelShort?: string },
  {
    id: "ny",
    tierLabel: "AMÉRICA DO NORTE · EIXO EXECUTIVO",
    city: "Nova York",
    country: "Estados Unidos",
    coords: "40°43'N · 74°00'W",
    houseNum: 11,
    houseRoman: "XI",
    themeTitle: "Rede de Alto Nível, Escala & Visibilidade",
    arrivalNote: "Retorno Solar às 13:18 EST · Chegada recomendada na véspera",
    scores: { money: 91, love: 82, career: 94 },
    imageSrc: "/images/abertura/ny.jpg",
    videoSrc: "/assets/cities/new_york.mp4",
  },
];

function ScoreRing({ value, label, dark = false }: { value: number; label: string; dark?: boolean }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-3.5">
      <div className="relative w-16 h-16 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.10)" : "rgba(7,16,26,0.09)"}
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#C9A227"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-sans text-sm font-bold tabular-nums ${
            dark ? "text-[#F2F4F7]" : "text-[#07101A]"
          }`}
        >
          {value}
        </span>
      </div>
      <div>
        <p
          className={`text-[11px] uppercase tracking-[0.16em] font-semibold ${
            dark ? "text-[#AAB6C4]" : "text-[#07101A]/55"
          }`}
        >
          {label}
        </p>
        <p className={`text-xs mt-0.5 ${dark ? "text-[#E8D59B]" : "text-[#8D6914] font-medium"}`}>
          Índice 0–100
        </p>
      </div>
    </div>
  );
}

export default function LandingV3({ embeddedInShell = true }: LandingV3Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop) {
    return <MobileHomeFlow />;
  }

  return <DesktopLandingV3 embeddedInShell={embeddedInShell} />;
}

function DesktopLandingV3({ embeddedInShell = true }: LandingV3Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();

  useEffect(() => {
    prewarmSolarApi();
  }, []);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) saveStoredAffiliateRef(ref);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 120);
      }
    }
  }, []);

  // ── HERO INTERACTIVE QUIZ FUNNEL (Nebula 5-Step + Past Blind Test) ─────────
  const [funnelMode, setFunnelMode] = useState<"next" | "past">("next");
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4 | 5>(1);
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
  const [contrastPreview, setContrastPreview] = useState<StoredFreePastPayload | null>(null);

  const detectedSign = useMemo(() => getTropicalSunSign(birthDate), [birthDate]);

  // ── MOVEMENT 2: REAL DESTINATION SHOWCASE ──────────────────────────────────
  const [activeExampleIdx, setActiveExampleIdx] = useState(0);
  const activeExample = REAL_DESTINATION_EXAMPLES[activeExampleIdx] || REAL_DESTINATION_EXAMPLES[0];

  // ── MOVEMENT 3: INTERACTIVE 12-HOUSE SOLAR WHEEL ───────────────────────────
  const [wheelHouseId, setWheelHouseId] = useState<number>(2);
  const activeWheelHouse = useMemo(
    () => HOUSES_SHOWCASE.find((h) => h.id === wheelHouseId) || HOUSES_SHOWCASE[1],
    [wheelHouseId]
  );
  const activeWheelCopy = t.houses[activeWheelHouse.id];
  const activeWheelScores = HOUSE_PILLAR_SCORES[activeWheelHouse.id] || HOUSE_PILLAR_SCORES[2];

  // ── OPTIONAL 1M30 AUDIO EXPLAINER MODAL ────────────────────────────────────
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [filmMuted, setFilmMuted] = useState(false);

  // ── FAQ STATE ──────────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectPriority = (p: QuizPriority) => {
    setPriority(p);
    setQuizStep(2);
  };

  const handleStep2Continue = () => {
    if (!firstName.trim()) {
      toast.error("Informe seu primeiro nome.");
      return;
    }
    if (!birthDate) {
      toast.error("Selecione sua data de nascimento.");
      return;
    }
    setQuizStep(3);
  };

  const handleStep3Continue = () => {
    if (!birthCity.trim() || (!birthCityValid && birthCity.trim().length < 3)) {
      toast.error("Digite e selecione sua cidade natal.");
      return;
    }
    setQuizStep(4);
  };

  const handleRunCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCity.trim()) {
      toast.error(
        funnelMode === "past"
          ? "Informe a cidade onde você passou seu último aniversário."
          : "Informe sua cidade atual para compararmos com os destinos ideais."
      );
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

      if (funnelMode === "past") {
        navigate("/meu-passado");
      } else {
        setContrastPreview(payload);
        setQuizStep(5);
      }
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Não foi possível concluir o cálculo agora. Confira as cidades informadas e tente novamente."
      );
    } finally {
      setCalculating(false);
    }
  };

  const handleOpenSamplePastReport = () => {
    const samplePayload: StoredFreePastPayload = {
      userName: firstName.trim() || "Visitante",
      birthDate: "1992-08-19",
      birthTime: "14:35",
      birthPlace: "São Paulo, Brasil",
      pastYear: String(currentYear - 1),
      pastCityDisplay: "Roma, Itália",
      pastCityShort: "Roma",
      pastCountry: "Itália",
      pastLat: 41.9028,
      pastLon: 12.4964,
      pastHouse: 5,
      sunSign: "Leão",
      ascendant: "Escorpião",
      returnDate: `19/08/${currentYear - 1}`,
      returnTimeUtc: "18:42 UTC",
      nextYear: String(currentYear),
      nextStayHouse: 6,
      usedApproximateTime: false,
    };
    sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(samplePayload));
    navigate("/meu-passado");
  };

  const handleSelectPlan = (pkg: "1" | "3" | "full") => {
    const targetHouse = getTargetHouseForPriority(priority);
    navigate(
      `/credits?pkg=${pkg}&returnTo=${encodeURIComponent(
        `/?mode=futuro&path=casa&house=${targetHouse}`
      )}`
    );
  };

  const yearOptions = Array.from({ length: 8 }, (_, idx) => String(currentYear - idx));

  const stayHouseNum = contrastPreview?.nextStayHouse || 6;
  const stayHouseScores = HOUSE_PILLAR_SCORES[stayHouseNum] || HOUSE_PILLAR_SCORES[6];
  const stayHouseCopy = t.houses[stayHouseNum];
  const idealHouseNum = getTargetHouseForPriority(priority);
  const idealHouseCopy = t.houses[idealHouseNum];

  return (
    <div
      className={`min-h-screen bg-[#02050A] text-[#F2F4F7] font-sans overflow-x-hidden ${
        embeddedInShell ? "" : "pt-20"
      }`}
    >
      <ScanningOverlay visible={calculating} mode="passado" />

      {/* =====================================================================
          MOVEMENT 1 — CELESTIAL VOID HERO + INTERACTIVE QUIZ FUNNEL (ZERO BOX SOUP)
          ===================================================================== */}
      <section
        id="consulta-gratuita"
        className="relative min-h-[calc(100svh-80px)] flex items-center py-16 overflow-hidden bg-[#02050A] scroll-mt-20"
      >
        {/* Observational Earth Sunrise + Subtle Official Emblem Watermark */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <video
            src="/videos/v3/terra-sunrise.mp4"
            poster="/videos/v3/terra-sunrise-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02050A] via-[#02050A]/88 to-[#02050A]/62" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] via-transparent to-[#02050A]/75" />
          <img
            src="/brand/protocolo-solar-simbolo-transparente-2048.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-44 -bottom-44 w-[760px] h-[760px] object-contain opacity-[0.06]"
          />
        </div>

        <div className="relative z-10 w-full max-w-[1220px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-16 items-center">
            {/* LEFT 7/12 — Pure Typographic Authority (Marcellus + DM Sans) */}
            <div className="col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E8D59B] mb-5">
                O GPS DO SEU NOVO CICLO · SWISS EPHEMERIS
              </p>

              <h1 className="font-display text-[52px] xl:text-[60px] text-[#F2F4F7] leading-[1.06] tracking-[-0.01em] mb-6">
                A coordenada do seu aniversário redefine as Casas do seu novo ano.
              </h1>

              <p className="text-[17px] text-[#AAB6C4] leading-[1.68] max-w-[560px] mb-10 font-normal">
                Cruze sua data, horário e cidade de nascimento para descobrir em quais destinos — perto de casa ou pelo mundo — passar seu próximo aniversário para favorecer finanças, amor ou carreira. Ou valide gratuitamente o ano que você já viveu.
              </p>

              {/* Clean Hairline Metrics Row — Zero Boxes */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#C9A227]/20 max-w-[560px]">
                <div>
                  <p className="font-display text-2xl text-[#E8D59B]">3 Raios</p>
                  <p className="text-xs text-[#AAB6C4] mt-1 leading-relaxed">
                    Até 1.000 km, até 3.000 km e melhor destino global
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl text-[#E8D59B]">0 a 100</p>
                  <p className="text-xs text-[#AAB6C4] mt-1 leading-relaxed">
                    Índice claro em Dinheiro, Amor e Carreira
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl text-[#E8D59B]">Grátis</p>
                  <p className="text-xs text-[#AAB6C4] mt-1 leading-relaxed">
                    Validação cega do seu último aniversário na tela
                  </p>
                </div>
              </div>

              {/* Discrete Optional Video Explainer Trigger + Sample Link */}
              <div className="mt-8 flex items-center gap-7 text-xs text-[#AAB6C4]">
                <button
                  type="button"
                  onClick={() => setFilmModalOpen(true)}
                  className="inline-flex items-center gap-2.5 text-[#E8D59B] hover:text-white transition-colors"
                >
                  <span className="w-7 h-7 rounded-full border border-[#C9A227]/50 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-[#E8D59B] text-[#E8D59B] ml-0.5" />
                  </span>
                  <span className="tracking-[0.04em] font-medium">
                    Assistir explicação rápida em vídeo (1m30)
                  </span>
                </button>

                <span className="h-3.5 w-px bg-white/15" />

                <button
                  type="button"
                  onClick={handleOpenSamplePastReport}
                  className="hover:text-[#E8D59B] underline underline-offset-4 transition-colors"
                >
                  Abrir leitura demonstrativa pronta
                </button>
              </div>
            </div>

            {/* RIGHT 5/12 — Single Harmonious Interactive Quiz Surface */}
            <div className="col-span-5">
              <div className="rounded-[24px] bg-[#07101A]/92 backdrop-blur-2xl border border-[#C9A227]/24 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
                {/* Clean 2-Mode Segmented Hairline Switch */}
                <div className="grid grid-cols-2 border-b border-white/10 pb-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setFunnelMode("next");
                      setQuizStep(1);
                    }}
                    className={`pb-2 text-left text-xs uppercase tracking-[0.14em] font-semibold transition-colors relative ${
                      funnelMode === "next" ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-white"
                    }`}
                  >
                    Próximo Aniversário
                    {funnelMode === "next" && (
                      <span className="absolute -bottom-[17px] left-0 right-4 h-[2px] bg-[#C9A227]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFunnelMode("past");
                      setQuizStep(2);
                    }}
                    className={`pb-2 text-left text-xs uppercase tracking-[0.14em] font-semibold transition-colors relative ${
                      funnelMode === "past" ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-white"
                    }`}
                  >
                    Testar Passado · Grátis
                    {funnelMode === "past" && (
                      <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[#C9A227]" />
                    )}
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between text-[11px] text-[#AAB6C4] mb-5">
                  <span className="uppercase tracking-[0.18em] text-[#C9A227] font-semibold">
                    {funnelMode === "past"
                      ? "VALIDAÇÃO GRATUITA DO PASSADO"
                      : quizStep === 5
                      ? "DIAGNÓSTICO PRELIMINAR PRONTO"
                      : `ETAPA 0${quizStep} DE 04`}
                  </span>
                  {quizStep > 1 && quizStep < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuizStep((prev) =>
                          funnelMode === "past" && prev === 2 ? 2 : ((prev - 1) as 1 | 2 | 3 | 4)
                        )
                      }
                      className="text-xs text-[#AAB6C4] hover:text-white"
                    >
                      ← Voltar
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: Decision Question Above the Fold (Nebula Pattern) */}
                  {funnelMode === "next" && quizStep === 1 && (
                    <motion.div
                      key="q1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <h2 className="font-display text-[26px] text-[#F2F4F7] leading-[1.18] mb-2">
                        Qual área é sua prioridade nº 1 para os próximos 12 meses?
                      </h2>
                      <p className="text-xs text-[#AAB6C4] mb-6">
                        Selecione um foco para calibrarmos as coordenadas do seu próximo retorno solar.
                      </p>

                      <div className="divide-y divide-white/10 border-y border-white/10">
                        {[
                          {
                            id: "money" as QuizPriority,
                            roman: "II · X",
                            title: "Dinheiro, Valorização & Carreira",
                            sub: "Patrimônio, margem financeira e projeção profissional",
                          },
                          {
                            id: "love" as QuizPriority,
                            roman: "V · VII",
                            title: "Amor, Encontros & Parcerias",
                            sub: "Magnetismo afetivo, relações sérias e alianças",
                          },
                          {
                            id: "life" as QuizPriority,
                            roman: "I · VI · IX",
                            title: "Mudança de Vida, Rotina & Bem-Estar",
                            sub: "Saúde, constância diária, viagens e autonomia",
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectPriority(opt.id)}
                            className="w-full py-4 text-left flex items-center justify-between gap-4 group hover:pl-1.5 transition-all"
                          >
                            <div>
                              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#C9A227] font-semibold">
                                CASAS {opt.roman}
                              </span>
                              <span className="block font-display text-lg text-[#F2F4F7] group-hover:text-[#E8D59B] transition-colors mt-0.5">
                                {opt.title}
                              </span>
                              <span className="block text-xs text-[#AAB6C4] mt-0.5">{opt.sub}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#C9A227] shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFunnelMode("past");
                          setQuizStep(2);
                        }}
                        className="mt-5 w-full text-left text-xs text-[#AAB6C4] hover:text-[#E8D59B] transition-colors"
                      >
                        Prefere conferir se funciona antes?{" "}
                        <span className="underline underline-offset-4 text-[#E8D59B]">
                          Teste grátis seu último aniversário →
                        </span>
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: Name + Birth Date + Instant Astronomical Micro-Reward */}
                  {quizStep === 2 && (
                    <motion.div
                      key="q2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      <h2 className="font-display text-2xl text-[#F2F4F7] leading-snug">
                        Dados de origem para o cálculo astronômico
                      </h2>

                      <div>
                        <label className="block text-xs text-[#AAB6C4] mb-1.5">Primeiro nome</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ex.: Mariana"
                          className="w-full h-12 rounded-xl bg-[#0C1826] border border-white/12 px-4 text-sm text-[#F2F4F7] placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#AAB6C4] mb-1.5">
                          Data de nascimento
                        </label>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          max={`${currentYear - 1}-12-31`}
                          className="w-full h-12 rounded-xl bg-[#0C1826] border border-white/12 px-4 text-sm text-[#F2F4F7] focus:outline-none focus:border-[#C9A227]"
                        />
                      </div>

                      {/* Micro-Reward (Nebula Pattern) */}
                      {detectedSign && (
                        <div className="pt-2 border-t border-[#C9A227]/20 flex items-center justify-between text-xs">
                          <span className="text-[#AAB6C4]">Sol Tropical detectado</span>
                          <span className="font-display text-base text-[#E8D59B]">
                            {detectedSign}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleStep2Continue}
                        className="w-full h-12 rounded-xl bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3: Birth Time (with 12:00 fallback) + Natal City */}
                  {quizStep === 3 && (
                    <motion.div
                      key="q3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      <h2 className="font-display text-2xl text-[#F2F4F7] leading-snug">
                        Horário e cidade de nascimento
                      </h2>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-[#AAB6C4]">Horário de nascimento</label>
                          <button
                            type="button"
                            onClick={() => {
                              const next = !unknownTime;
                              setUnknownTime(next);
                              if (next) setBirthTime("12:00");
                            }}
                            className="text-[11px] text-[#E8D59B] underline underline-offset-4"
                          >
                            {unknownTime ? "Informar hora exata" : "Não sei a hora exata (usar 12:00)"}
                          </button>
                        </div>
                        <input
                          type="time"
                          value={unknownTime ? "12:00" : birthTime}
                          disabled={unknownTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                          className="w-full h-12 rounded-xl bg-[#0C1826] border border-white/12 px-4 text-sm text-[#F2F4F7] disabled:opacity-45 focus:outline-none focus:border-[#C9A227]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#AAB6C4] mb-1.5">Cidade natal</label>
                        <div className="h-12">
                          <CityAutocomplete
                            value={birthCity}
                            onChange={(val, valid, coords) => {
                              setBirthCity(val);
                              setBirthCityValid(valid);
                              setBirthCoords(coords);
                            }}
                            placeholder="Digite e selecione sua cidade natal..."
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStep3Continue}
                        className="w-full h-12 rounded-xl bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 4: Travel Radius Filter (Next) OR Past Birthday City (Past) */}
                  {quizStep === 4 && (
                    <motion.form
                      key="q4"
                      onSubmit={handleRunCalculation}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-5"
                    >
                      {funnelMode === "next" ? (
                        <>
                          <h2 className="font-display text-2xl text-[#F2F4F7] leading-snug">
                            Até onde você toparia viajar no aniversário?
                          </h2>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "1000km" as TravelRadius, label: "Até 1.000 km", sub: "Regional" },
                              { id: "3000km" as TravelRadius, label: "Até 3.000 km", sub: "Continental" },
                              { id: "global" as TravelRadius, label: "Global", sub: "Mundo todo" },
                            ].map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setRadius(r.id)}
                                className={`py-2.5 px-3 rounded-xl text-left border transition-all ${
                                  radius === r.id
                                    ? "bg-[#C9A227]/18 border-[#C9A227] text-[#F2F4F7]"
                                    : "bg-[#0C1826] border-white/10 text-[#AAB6C4]"
                                }`}
                              >
                                <span className="block text-xs font-semibold">{r.label}</span>
                                <span className="block text-[10px] opacity-75">{r.sub}</span>
                              </button>
                            ))}
                          </div>

                          <div>
                            <label className="block text-xs text-[#AAB6C4] mb-1.5">
                              Em qual cidade você mora hoje? (para comparativo gratuito)
                            </label>
                            <div className="h-12">
                              <CityAutocomplete
                                value={refCity}
                                onChange={(val, _valid, coords) => {
                                  setRefCity(val);
                                  setRefCoords(coords);
                                }}
                                placeholder="Ex.: São Paulo, Lisboa..."
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="font-display text-2xl text-[#F2F4F7] leading-snug">
                            Onde você passou seu último aniversário?
                          </h2>

                          <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-4">
                              <label className="block text-xs text-[#AAB6C4] mb-1.5">Ano</label>
                              <select
                                value={pastYear}
                                onChange={(e) => setPastYear(e.target.value)}
                                className="w-full h-12 rounded-xl bg-[#0C1826] border border-white/12 px-3 text-sm text-[#F2F4F7] focus:outline-none focus:border-[#C9A227]"
                              >
                                {yearOptions.map((yr) => (
                                  <option key={yr} value={yr}>
                                    {yr}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-8">
                              <label className="block text-xs text-[#AAB6C4] mb-1.5">
                                Cidade onde estava
                              </label>
                              <div className="h-12">
                                <CityAutocomplete
                                  value={refCity}
                                  onChange={(val, _valid, coords) => {
                                    setRefCity(val);
                                    setRefCoords(coords);
                                  }}
                                  placeholder="Digite a cidade..."
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={calculating}
                        className="w-full h-12 rounded-xl bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all disabled:opacity-55"
                      >
                        <span>
                          {calculating
                            ? "Calculando efemérides..."
                            : funnelMode === "past"
                            ? "Revelar meu ano passado grátis"
                            : "Ver diagnóstico da minha cidade atual"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}

                  {/* STEP 5: Live Free Current-City Contrast Preview + R$ 19,90 Unlock */}
                  {quizStep === 5 && contrastPreview && (
                    <motion.div
                      key="q5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <div className="pb-4 border-b border-white/10">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#E8D59B]">
                          SE PASSAR {contrastPreview.nextYear} EM {contrastPreview.pastCityShort.toUpperCase()}
                        </p>
                        <h3 className="font-display text-2xl text-[#F2F4F7] mt-1">
                          Casa {stayHouseScores.roman} · {stayHouseCopy.title}
                        </h3>
                        <p className="text-xs text-[#AAB6C4] mt-1 leading-relaxed">
                          {stayHouseCopy.focus}
                        </p>
                      </div>

                      {/* 3 Clean Score Bars */}
                      <div className="grid grid-cols-3 gap-3 text-center py-2">
                        <div>
                          <p className="font-display text-xl text-[#F2F4F7]">{stayHouseScores.money}</p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#AAB6C4]">
                            Dinheiro
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-xl text-[#F2F4F7]">{stayHouseScores.love}</p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#AAB6C4]">
                            Amor
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-xl text-[#F2F4F7]">{stayHouseScores.life}</p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#AAB6C4]">
                            Bem-Estar
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-[#AAB6C4]">
                        <p className="text-[#E8D59B] font-medium">
                          Pronto para liberar para sua prioridade ({idealHouseCopy.shortTag}):
                        </p>
                        <p>✓ 3 melhores cidades (até 1.000 km, até 3.000 km e Global)</p>
                        <p>✓ Minuto exato UTC do Retorno Solar + leitura das 8 áreas</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPlan("1")}
                        className="w-full h-12 rounded-xl bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Desbloquear meus destinos ideais · R$ 19,90</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="flex items-center justify-between text-[11px] text-[#AAB6C4]">
                        <button
                          type="button"
                          onClick={() => navigate("/meu-passado")}
                          className="underline underline-offset-4 hover:text-white"
                        >
                          Ver leitura grátis do último ano
                        </button>
                        <a href="#planos" className="text-[#E8D59B] hover:underline">
                          Comparar pacotes (3 ou 12 Casas)
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MOVEMENT 2 — WARM PEARL EDITORIAL MONOGRAPH: O ENTREGÁVEL REAL
          ===================================================================== */}
      <section className="py-28 bg-[#FAF7F2] text-[#07101A]">
        <div className="max-w-[1220px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-16 items-start">
            {/* LEFT 5/12 — Editorial Explanation (Zero Cards) */}
            <div className="col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8D6914] mb-4">
                PROTOCOLO PRÁTICO DE VIAGEM
              </p>
              <h2 className="font-display text-[40px] leading-[1.1] text-[#07101A] mb-6">
                Mesma certidão de nascimento. Três raios de distância. Índice de 0 a 100.
              </h2>
              <p className="text-[16px] text-[#07101A]/72 leading-[1.7] mb-8">
                Seu Mapa Natal permanece idêntico pela vida inteira. Já na Revolução Solar anual, a latitude e a longitude onde você está no minuto exato do retorno solar reposicionam o Ascendente e as 12 Casas dos próximos 12 meses.
              </p>

              {/* Hairline Specification List (Apitex / Editorial Style — Zero Boxes) */}
              <div className="divide-y divide-[#07101A]/10 border-y border-[#07101A]/10">
                <div className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8D6914]">
                    01 · Escalonamento Real por Distância
                  </p>
                  <p className="text-sm text-[#07101A]/75 mt-1 leading-relaxed">
                    Você nunca recebe apenas uma cidade distante: indicamos opções até 1.000 km de casa, até 3.000 km e o melhor destino global.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8D6914]">
                    02 · Comparativo Direto com Sua Cidade Atual
                  </p>
                  <p className="text-sm text-[#07101A]/75 mt-1 leading-relaxed">
                    Veja exatamente o que muda se viajar versus como conduzir o ano caso decida passar o aniversário em casa.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8D6914]">
                    03 · Janela Horária Exata de Chegada
                  </p>
                  <p className="text-sm text-[#07101A]/75 mt-1 leading-relaxed">
                    Cálculo preciso do minuto UTC do retorno solar com recomendação de chegada entre 12 e 24 horas antes.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 7/12 — Clean Apitex-Style Deliverable Sheet with Real City Photography */}
            <div className="col-span-7">
              {/* Destination Selector Hairline Tabs */}
              <div className="flex items-center justify-between border-b border-[#07101A]/12 mb-7">
                {REAL_DESTINATION_EXAMPLES.map((ex, idx) => {
                  const active = idx === activeExampleIdx;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setActiveExampleIdx(idx)}
                      className={`pb-3.5 px-2 text-sm font-medium transition-colors relative ${
                        active ? "text-[#07101A] font-semibold" : "text-[#07101A]/50 hover:text-[#07101A]"
                      }`}
                    >
                      <span>{ex.city}</span>
                      <span className="ml-1.5 text-xs opacity-65">· Casa {ex.houseRoman}</span>
                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clean Single Sheet — Real Aerial City Video/Photo + Radial 0-100 Rings */}
              <div className="rounded-[24px] bg-white shadow-[0_24px_70px_rgba(7,16,26,0.07)] overflow-hidden">
                <div className="relative aspect-[16/9] w-full bg-[#07101A] overflow-hidden">
                  <video
                    key={activeExample.videoSrc}
                    src={activeExample.videoSrc}
                    poster={activeExample.imageSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02050A]/80 via-transparent to-black/20" />

                  <div className="absolute bottom-5 left-7 right-7 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#E8D59B] font-semibold">
                        {activeExample.tierLabel}
                      </p>
                      <h3 className="font-display text-3xl mt-1">
                        {activeExample.city}, {activeExample.country}
                      </h3>
                    </div>
                    <span className="text-xs tracking-[0.14em] uppercase text-[#E8D59B] border border-[#C9A227]/45 bg-[#02050A]/65 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                      Casa {activeExample.houseRoman}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-baseline justify-between gap-4 pb-6 border-b border-[#07101A]/10">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#8D6914] font-semibold">
                        FOCO ATIVADO NESTA COORDENADA (EXEMPLO DEMONSTRATIVO)
                      </p>
                      <p className="font-display text-2xl text-[#07101A] mt-1">
                        {activeExample.themeTitle}
                      </p>
                    </div>
                    <span className="text-xs text-[#07101A]/55 shrink-0">{activeExample.coords}</span>
                  </div>

                  {/* 3 Radial Progress Rings (0–100) */}
                  <div className="grid grid-cols-3 gap-6 py-6 border-b border-[#07101A]/10">
                    <ScoreRing value={activeExample.scores.money} label="Dinheiro" />
                    <ScoreRing value={activeExample.scores.love} label="Amor" />
                    <ScoreRing value={activeExample.scores.career} label="Carreira" />
                  </div>

                  <div className="pt-5 flex items-center justify-between text-xs text-[#07101A]/65">
                    <span>{activeExample.arrivalNote}</span>
                    <span className="text-[#8D6914] font-medium">
                      Suas cidades mudam conforme sua certidão
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MOVEMENT 3 — CELESTIAL NIGHT: INTERACTIVE 12-HOUSE SOLAR WHEEL
          ===================================================================== */}
      <section className="py-28 bg-[#07101A] text-[#F2F4F7]">
        <div className="max-w-[1220px] mx-auto px-8">
          <div className="flex items-end justify-between gap-12 pb-10 mb-14 border-b border-[#C9A227]/16">
            <div className="max-w-[620px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#E8D59B] mb-4">
                ARQUITETURA DAS 12 CASAS SOLARES
              </p>
              <h2 className="font-display text-[42px] leading-[1.08] text-[#F2F4F7]">
                Um setor iluminado define o protagonismo do seu próximo ciclo.
              </h2>
            </div>
            <Link
              to="/casas"
              className="text-xs uppercase tracking-[0.18em] text-[#E8D59B] hover:text-white pb-1 border-b border-[#C9A227]/50 transition-colors shrink-0"
            >
              Ver catálogo completo das 12 Casas →
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-16 items-center">
            {/* LEFT 5/12 — Official Interactive 12-House Wheel */}
            <div className="col-span-5 flex flex-col items-center">
              <div className="relative w-[390px] h-[390px] flex items-center justify-center">
                {/* Official Brand Emblem at Center */}
                <img
                  src="/brand/protocolo-solar-simbolo-transparente-2048.png"
                  alt="Roda das 12 Casas Protocolo Solar"
                  className="w-[240px] h-[240px] object-contain opacity-90 pointer-events-none select-none"
                />

                {/* 12 Interactive Roman Numeral Sector Nodes Around Perimeter */}
                {HOUSES_SHOWCASE.map((h, i) => {
                  const angleDeg = i * 30 - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const r = 166;
                  const x = 195 + r * Math.cos(angleRad);
                  const y = 195 + r * Math.sin(angleRad);
                  const isSelected = h.id === wheelHouseId;
                  const roman = HOUSE_PILLAR_SCORES[h.id]?.roman || String(h.id);

                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setWheelHouseId(h.id)}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-xs font-display transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-[#C9A227] text-[#02050A] font-bold scale-110 shadow-[0_0_28px_rgba(201,162,39,0.55)]"
                          : "bg-[#0C1826] text-[#E8D59B] border border-[#C9A227]/30 hover:border-[#C9A227]"
                      }`}
                      aria-label={`Casa ${h.numberLabel}`}
                    >
                      {roman}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#AAB6C4] mt-4 tracking-wide">
                Selecione qualquer setor (I a XII) na roda solar para inspecionar
              </p>
            </div>

            {/* RIGHT 7/12 — Open Editorial Monograph (Zero Nested Card Boxes) */}
            <div className="col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWheelHouse.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display text-sm tracking-[0.22em] uppercase text-[#C9A227]">
                      CASA {activeWheelHouse.numberLabel} · SETOR {activeWheelScores.roman}
                    </span>
                    <span className="h-px w-10 bg-[#C9A227]/40" />
                    <span className="text-xs uppercase tracking-[0.16em] text-[#AAB6C4]">
                      {activeWheelCopy.shortTag}
                    </span>
                  </div>

                  <h3 className="font-display text-[38px] text-[#F2F4F7] leading-[1.12] mb-6">
                    {activeWheelCopy.title}
                  </h3>

                  <div className="divide-y divide-white/10 border-y border-white/10 mb-8">
                    <div className="py-5 grid grid-cols-12 gap-6">
                      <span className="col-span-4 text-xs uppercase tracking-[0.16em] text-[#E8D59B]">
                        Quando escolher
                      </span>
                      <p className="col-span-8 text-[15px] text-[#AAB6C4] leading-relaxed">
                        {activeWheelCopy.profile}
                      </p>
                    </div>

                    <div className="py-5 grid grid-cols-12 gap-6">
                      <span className="col-span-4 text-xs uppercase tracking-[0.16em] text-[#E8D59B]">
                        Efeito no ciclo anual
                      </span>
                      <p className="col-span-8 text-[15px] text-[#F2F4F7] leading-relaxed">
                        {activeWheelCopy.focus}
                      </p>
                    </div>

                    <div className="py-5 grid grid-cols-12 gap-6">
                      <span className="col-span-4 text-xs uppercase tracking-[0.16em] text-[#E8D59B]">
                        Geografia individual
                      </span>
                      <p className="col-span-8 text-sm text-[#AAB6C4] leading-relaxed">
                        Nenhuma Casa pertence a uma cidade fixa. O motor calcula em quais cidades do Brasil e do mundo a Casa {activeWheelHouse.numberLabel} se abre para os seus dados natais.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <a
                      href="#consulta-gratuita"
                      onClick={() => {
                        setFunnelMode("next");
                      }}
                      className="h-12 px-7 rounded-full bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] text-sm font-semibold inline-flex items-center gap-2.5 transition-all"
                    >
                      <span>Descobrir minhas cidades da Casa {activeWheelHouse.numberLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <Link
                      to={`/casas/${activeWheelHouse.id}`}
                      className="text-xs uppercase tracking-[0.16em] text-[#E8D59B] hover:text-white underline underline-offset-4"
                    >
                      Ler guia completo da Casa {activeWheelHouse.numberLabel}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MOVEMENT 4 — WARM PEARL: CRITÉRIO TRANSPARENTE DE PLANOS (#planos)
          ===================================================================== */}
      <section id="planos" className="py-28 bg-[#FAF7F2] text-[#07101A] scroll-mt-20">
        <div className="max-w-[1220px] mx-auto px-8">
          {/* Header + Why R$ 19,90 Exists */}
          <div className="grid grid-cols-12 gap-12 items-end pb-12 border-b border-[#07101A]/12">
            <div className="col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8D6914] mb-4">
                CRITÉRIO PÚBLICO & ACESSO IMEDIATO
              </p>
              <h2 className="font-display text-[42px] leading-[1.08] text-[#07101A]">
                Pagamento único, sem assinatura e com entrega instantânea na tela.
              </h2>
            </div>
            <div className="col-span-5">
              <p className="text-[15px] text-[#07101A]/70 leading-relaxed">
                Enquanto relatórios manuais tradicionais cobram R$ 69+ para testar uma única cidade escolhida por você e entregam PDF horas depois, o Protocolo Solar realiza a busca reversa automática no ato.
              </p>
            </div>
          </div>

          {/* 3-Column Architectural Ledger (Separated by 1px Hairlines — Zero Carnival Colors) */}
          <div className="grid grid-cols-3 divide-x divide-[#07101A]/12 border-b border-[#07101A]/12">
            {/* Tier 1: R$ 19,90 */}
            <div className="py-12 pr-10 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8D6914]">
                  01 · ENTRADA INDIVIDUAL
                </p>
                <h3 className="font-display text-2xl text-[#07101A] mt-2">
                  1 Objetivo ou 1 Cidade
                </h3>
                <p className="text-sm text-[#07101A]/68 mt-2 leading-relaxed min-h-[66px]">
                  Para descobrir os melhores destinos de 1 tema prioritário ou analisar 1 cidade onde já pretende ir.
                </p>

                <div className="my-8 flex items-baseline gap-1">
                  <span className="text-sm font-medium text-[#07101A]/60">R$</span>
                  <span className="font-display text-5xl text-[#07101A]">19</span>
                  <span className="text-lg font-semibold text-[#07101A]">,90</span>
                  <span className="ml-2 text-xs text-[#07101A]/55">pagamento único</span>
                </div>

                <ul className="space-y-3 text-sm text-[#07101A]/80 border-t border-[#07101A]/10 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Sugestão até 1.000 km, até 3.000 km e Global</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Leitura completa das 8 áreas da vida naquele ciclo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Minuto UTC exato + Cartão 9:16 para compartilhar</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("1")}
                className="mt-10 w-full h-12 rounded-full border border-[#07101A] text-[#07101A] hover:bg-[#07101A] hover:text-[#FAF7F2] text-sm font-semibold transition-all"
              >
                Escolher 1 Leitura · R$ 19,90
              </button>
            </div>

            {/* Tier 2: R$ 49,90 */}
            <div className="py-12 px-10 bg-white/75 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8D6914]">
                  02 · TRANSIÇÃO & VIAGEM
                </p>
                <h3 className="font-display text-2xl text-[#07101A] mt-2">
                  Comparador de 3 Destinos
                </h3>
                <p className="text-sm text-[#07101A]/68 mt-2 leading-relaxed min-h-[66px]">
                  Para colocar até 3 cidades ou 3 Casas lado a lado (ex.: ficar em casa vs. praia próxima vs. exterior).
                </p>

                <div className="my-8 flex items-baseline gap-1">
                  <span className="text-sm font-medium text-[#07101A]/60">R$</span>
                  <span className="font-display text-5xl text-[#07101A]">49</span>
                  <span className="text-lg font-semibold text-[#07101A]">,90</span>
                  <span className="ml-2 text-xs text-[#07101A]/55">pagamento único</span>
                </div>

                <ul className="space-y-3 text-sm text-[#07101A]/80 border-t border-[#07101A]/10 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>3 créditos completos para usar juntos ou quando quiser</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Comparação direta do índice 0–100 e das 8 áreas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Guia prático da cidade atual incluído</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("3")}
                className="mt-10 w-full h-12 rounded-full bg-[#07101A] hover:bg-[#0C1826] text-[#E8D59B] text-sm font-semibold transition-all shadow-md"
              >
                Comparar 3 Destinos · R$ 49,90
              </button>
            </div>

            {/* Tier 3: R$ 99,90 */}
            <div className="py-12 pl-10 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8D6914]">
                  03 · VISÃO INTEGRAL
                </p>
                <h3 className="font-display text-2xl text-[#07101A] mt-2">
                  Mapa Completo das 12 Casas
                </h3>
                <p className="text-sm text-[#07101A]/68 mt-2 leading-relaxed min-h-[66px]">
                  Para destravar simultaneamente todas as 12 Casas Solares do seu próximo aniversário no mundo inteiro.
                </p>

                <div className="my-8 flex items-baseline gap-1">
                  <span className="text-sm font-medium text-[#07101A]/60">R$</span>
                  <span className="font-display text-5xl text-[#07101A]">99</span>
                  <span className="text-lg font-semibold text-[#07101A]">,90</span>
                  <span className="ml-2 text-xs text-[#07101A]/55">pagamento único</span>
                </div>

                <ul className="space-y-3 text-sm text-[#07101A]/80 border-t border-[#07101A]/10 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Todas as 12 Casas e suas cidades regionais/globais abertas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>As 8 áreas da vida detalhadas nas 12 possibilidades</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#8D6914] shrink-0 mt-0.5" />
                    <span>Arquivo permanente de consultas salvo na sua conta</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("full")}
                className="mt-10 w-full h-12 rounded-full border border-[#07101A] text-[#07101A] hover:bg-[#07101A] hover:text-[#FAF7F2] text-sm font-semibold transition-all"
              >
                Liberar as 12 Casas · R$ 99,90
              </button>
            </div>
          </div>

          {/* Subtle Gift & Voucher Strip */}
          <div className="pt-8 flex items-center justify-between text-xs text-[#07101A]/65">
            <span>
              Pagamento via Pix ou Cartão (Mercado Pago) · Liberação automática em segundos
            </span>
            <Link
              to="/resgatar"
              className="font-semibold text-[#8D6914] hover:text-[#07101A] underline underline-offset-4"
            >
              Recebeu um convite VIP ou código de presente? Resgatar aqui →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MOVEMENT 5 — CELESTIAL VOID: CLEAN HAIRLINE FAQ + BRAND SIGNATURE FOOTER
          ===================================================================== */}
      <section className="py-24 bg-[#02050A] text-[#F2F4F7]">
        <div className="max-w-[1220px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-16 items-start">
            <div className="col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E8D59B] mb-4">
                PERGUNTAS FREQUENTES
              </p>
              <h2 className="font-display text-4xl leading-[1.12] text-[#F2F4F7] mb-4">
                Transparência metodológica antes de qualquer decisão.
              </h2>
              <p className="text-sm text-[#AAB6C4] leading-relaxed">
                O Protocolo Solar é uma ferramenta astronômica de planejamento pessoal e reflexão estratégica — sem promessas determinísticas.
              </p>
            </div>

            <div className="col-span-8 divide-y divide-white/10 border-y border-white/10">
              {t.faq.items.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-5 text-left flex items-center justify-between gap-6 group"
                    >
                      <span className="font-display text-lg text-[#F2F4F7] group-hover:text-[#E8D59B] transition-colors">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C9A227] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-5 text-sm text-[#AAB6C4] leading-relaxed max-w-[68ch]">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Footer */}
          <footer className="mt-24 pt-10 border-t border-white/10 flex items-center justify-between text-xs text-[#AAB6C4]">
            <div className="flex items-center gap-6">
              <img
                src="/brand/protocolo-solar-logo-horizontal-4096.png"
                alt="Protocolo Solar"
                className="w-[185px] h-auto opacity-90"
              />
              <span>· Astrologia Ocidental Tropical & Efemérides Swiss Ephemeris (+18)</span>
            </div>

            <div className="flex items-center gap-7">
              <Link to="/casas" className="hover:text-[#E8D59B] transition-colors">
                As 12 Casas
              </Link>
              <Link to="/consultar" className="hover:text-[#E8D59B] transition-colors">
                Calculadora
              </Link>
              <Link to="/resgatar" className="hover:text-[#E8D59B] transition-colors">
                Resgatar Convite
              </Link>
              <Link to="/termos" className="hover:text-[#E8D59B] transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="hover:text-[#E8D59B] transition-colors">
                Privacidade
              </Link>
            </div>
          </footer>
        </div>
      </section>

      {/* =====================================================================
          OPTIONAL 1M30 EXPLAINER FILM MODAL
          ===================================================================== */}
      <AnimatePresence>
        {filmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/88 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => {
              modalVideoRef.current?.pause();
              setFilmModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#02050A] border border-[#C9A227]/25 shadow-2xl"
            >
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                <span className="text-xs uppercase tracking-[0.18em] text-[#E8D59B]">
                  Explicação em Vídeo · 1m30
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !filmMuted;
                      setFilmMuted(next);
                      if (modalVideoRef.current) modalVideoRef.current.muted = next;
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-white inline-flex items-center gap-1.5"
                  >
                    {filmMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{filmMuted ? "Ativar som" : "Silenciar"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      modalVideoRef.current?.pause();
                      setFilmModalOpen(false);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="aspect-video bg-black">
                <video
                  ref={modalVideoRef}
                  src="/videos/v3/filme-protocolo-16x9.mp4"
                  poster="/videos/v3/filme-protocolo-16x9-v3-poster.jpg"
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
