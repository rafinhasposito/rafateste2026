import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Plane,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import {
  DEMO_CHARACTER_CITIES,
  DEMO_CHARACTER_PROFILE,
  HERO_BOARDING_DESTINATIONS,
  HOME_CITY_DEFENSE,
  TRAVEL_RADIUS_OPTIONS,
  V3_ANGLES,
  V3_FAQ_ITEMS,
  V3_PLANS,
  V3_PRIORITY_OPTIONS,
  type TravelRadiusOption,
  type V3AngleKey,
} from "@/data/landingV3Data";
import {
  formatPartnerIdLabel,
  getStoredAffiliateRef,
  saveStoredAffiliateRef,
} from "@/lib/affiliates";
import { normalizeBirthTime } from "@/lib/astro";

const API_URL =
  import.meta.env.VITE_ASTRO_API_URL || "https://protocolo-solar-api.onrender.com";

function getDefaultPastSolarYear(): number {
  const now = new Date();
  return now.getMonth() >= 4 ? now.getFullYear() - 1 : now.getFullYear() - 2;
}

interface DualAuditResult {
  pastHouse: number;
  pastCity: string;
  pastYear: number;
  sunSign?: string | null;
  returnDate?: string | null;
  nextStayHouse?: number | null;
  nextYear: number;
  usedApproximateTime: boolean;
}

type LightboxModalId = "theo" | "radar" | "areas" | "ticket" | null;

interface LandingV3Props {
  embeddedInShell?: boolean;
}

// Micro-componente Solari Split-Flap (efeito mecânico rápido <= 260ms, acessível e respeita reduced-motion)
const SplitFlapCell = ({ text, reduced }: { text: string; reduced: boolean }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·";
    let tick = 0;
    const interval = window.setInterval(() => {
      tick += 1;
      if (tick >= 4) {
        setDisplay(text);
        window.clearInterval(interval);
      } else {
        setDisplay(
          text
            .split("")
            .map((ch, idx) =>
              ch === " "
                ? " "
                : idx < (tick / 4) * text.length
                ? ch
                : glyphs[(idx + tick * 7) % glyphs.length]
            )
            .join("")
        );
      }
    }, 45);
    return () => window.clearInterval(interval);
  }, [text, reduced]);

  return (
    <span className="inline-block font-mono tracking-[0.14em] text-[#F5DE98] tabular-nums">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
};

const LandingV3 = ({ embeddedInShell = false }: LandingV3Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const consultSectionRef = useRef<HTMLElement | null>(null);
  const plansSectionRef = useRef<HTMLElement | null>(null);

  const rawAngle = (searchParams.get("angulo") || "padrao").toLowerCase();
  const activeAngleKey: V3AngleKey =
    rawAngle === "fitness" || rawAngle === "carreira" || rawAngle === "cetico"
      ? rawAngle
      : "padrao";
  const angle = V3_ANGLES[activeAngleKey];

  const [partnerRef, setPartnerRef] = useState<string | null>(null);
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) saveStoredAffiliateRef(refParam);
    setPartnerRef(getStoredAffiliateRef());
  }, [searchParams]);

  // 1. Hero Cinema + Boarding Pass
  const [heroDestIdx, setHeroDestIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion || heroPaused) return;
    const timer = window.setInterval(() => {
      setHeroDestIdx((prev) => (prev + 1) % HERO_BOARDING_DESTINATIONS.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, heroPaused]);
  const activeHeroDest = HERO_BOARDING_DESTINATIONS[heroDestIdx];

  // 2. Interactive Flight Map + 3-City Cinema
  const [demoCityId, setDemoCityId] = useState<string>(DEMO_CHARACTER_CITIES[0].id);
  const activeDemoCity = useMemo(
    () =>
      DEMO_CHARACTER_CITIES.find((c) => c.id === demoCityId) ||
      DEMO_CHARACTER_CITIES[0],
    [demoCityId]
  );

  // 3. Tactile 4-Step Check-In Kiosk (Free Past Reveal)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [birthCityValid, setBirthCityValid] = useState(false);
  const [birthCoords, setBirthCoords] = useState<CityCoords | null>(null);

  const [targetYear, setTargetYear] = useState<number>(getDefaultPastSolarYear());
  const [pastCity, setPastCity] = useState("");
  const [pastCityValid, setPastCityValid] = useState(false);
  const [pastCoords, setPastCoords] = useState<CityCoords | null>(null);

  const [calculating, setCalculating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<DualAuditResult | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copyEmail, setCopyEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  // 4. Split-Flap Desire Board + Travel Filter
  const [selectedNextHouse, setSelectedNextHouse] = useState<number>(
    angle.featuredHouseId || 10
  );
  const [selectedRadius, setSelectedRadius] =
    useState<TravelRadiusOption["id"]>("300km");

  useEffect(() => {
    if (angle.featuredHouseId) setSelectedNextHouse(angle.featuredHouseId);
  }, [angle.featuredHouseId]);

  // 5. Lightbox Modals (Escape closes per Layoza craft-floor)
  const [activeModal, setActiveModal] = useState<LightboxModalId>(null);
  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeModal]);

  const availableYears = useMemo(() => {
    const current = new Date().getFullYear();
    return [current, current - 1, current - 2, current - 3, current - 4];
  }, []);

  const persistNatalHandoff = (
    dateVal: string,
    timeVal: string,
    unknownVal: boolean,
    cityVal: string,
    coordsVal: CityCoords | null
  ) => {
    try {
      if (dateVal) sessionStorage.setItem("ps_natal_date", dateVal);
      sessionStorage.setItem(
        "ps_natal_time",
        unknownVal ? "12:00" : normalizeBirthTime(timeVal)
      );
      sessionStorage.setItem("ps_natal_unknown_time", unknownVal ? "1" : "0");
      if (cityVal) sessionStorage.setItem("ps_natal_place", cityVal.trim());
      if (coordsVal) {
        sessionStorage.setItem("ps_natal_lat", String(coordsVal.lat));
        sessionStorage.setItem("ps_natal_lon", String(coordsVal.lon));
      }
    } catch {
      // ignore
    }
  };

  const scrollToConsult = () => {
    consultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNextStep1 = () => {
    setFormError(null);
    if (!birthDate) {
      setFormError("Escolha sua data de nascimento.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError(null);
    if (!unknownTime && !birthTime) {
      setFormError("Informe a hora ou toque em “Usar 12:00”.");
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    setFormError(null);
    if (!birthCity.trim() || (!birthCityValid && !birthCity.includes(","))) {
      setFormError("Digite e toque na sua cidade natal na lista.");
      return;
    }
    persistNatalHandoff(birthDate, birthTime, unknownTime, birthCity, birthCoords);
    if (!pastCity && birthCity) {
      setPastCity(birthCity);
      setPastCityValid(true);
      if (birthCoords) setPastCoords(birthCoords);
    }
    setStep(4);
  };

  const handleRunFreeAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!pastCity.trim() || (!pastCityValid && !pastCity.includes(","))) {
      setFormError("Toque na cidade da lista onde você passou aquele aniversário.");
      return;
    }

    persistNatalHandoff(birthDate, birthTime, unknownTime, birthCity, birthCoords);
    setCalculating(true);
    setEmailSaved(false);

    try {
      const [yyyy, mm, dd] = birthDate.split("-");
      const dobFormatted = `${dd}/${mm}/${yyyy}`;
      const effectiveTime = unknownTime ? "12:00" : normalizeBirthTime(birthTime);
      const nextYear = new Date().getFullYear() + 1;

      const commonPayload = {
        name: "Visitante",
        place_of_birth: birthCity.trim(),
        dob: dobFormatted,
        time: effectiveTime,
      };

      const stayCity = pastCity.trim();
      const stayLat = pastCoords?.lat;
      const stayLon = pastCoords?.lon;

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 32000);

      let pastResp: Response;
      let nextResp: Response | null = null;
      try {
        [pastResp, nextResp] = await Promise.all([
          fetch(`${API_URL}/audit_past`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              ...commonPayload,
              target_year: targetYear,
              past_city: stayCity,
              past_lat: stayLat,
              past_lon: stayLon,
            }),
          }),
          fetch(`${API_URL}/audit_past`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              ...commonPayload,
              target_year: nextYear,
              past_city: stayCity,
              past_lat: stayLat,
              past_lon: stayLon,
            }),
          }).catch(() => null),
        ]);
      } finally {
        clearTimeout(timeoutId);
      }

      const pastData = await pastResp.json();
      if (!pastResp.ok || !pastData?.house) {
        throw new Error(
          pastData?.error || "Não conseguimos calcular agora. Tente novamente."
        );
      }

      let nextStayHouse: number | null = null;
      if (nextResp && nextResp.ok) {
        try {
          const nextData = await nextResp.json();
          if (nextData?.house) nextStayHouse = Number(nextData.house);
        } catch {
          nextStayHouse = null;
        }
      }

      setAuditResult({
        pastHouse: Number(pastData.house),
        pastCity: stayCity.split(",")[0].trim(),
        pastYear: targetYear,
        sunSign: pastData.sun_sign || null,
        returnDate: pastData.return_date || null,
        nextStayHouse,
        nextYear,
        usedApproximateTime: unknownTime,
      });
      setStep(5);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setFormError(
          "Servidor astronômico aquecendo — toque novamente para revelar em segundos."
        );
      } else {
        setFormError(err?.message || "Erro ao calcular. Confira os dados.");
      }
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveCopyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyEmail.trim() || !copyEmail.includes("@")) return;
    try {
      localStorage.setItem(
        "ps_v3_free_audit_lead",
        JSON.stringify({
          email: copyEmail.trim(),
          pastHouse: auditResult?.pastHouse,
          pastCity: auditResult?.pastCity,
          pastYear: auditResult?.pastYear,
          savedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }
    setEmailSaved(true);
  };

  const handleGoToPackage = (pkg: "1" | "3" | "full") => {
    if (birthDate) {
      persistNatalHandoff(birthDate, birthTime, unknownTime, birthCity, birthCoords);
    }
    const targetReturn = selectedNextHouse
      ? `/?mode=futuro&path=casa&house=${selectedNextHouse}`
      : "/?mode=futuro";
    navigate(`/credits?pkg=${pkg}&returnTo=${encodeURIComponent(targetReturn)}`);
  };

  const pastShowcase = auditResult
    ? HOUSES_SHOWCASE.find((h) => h.id === auditResult.pastHouse) ||
      HOUSES_SHOWCASE[0]
    : null;
  const nextStayShowcase = auditResult?.nextStayHouse
    ? HOUSES_SHOWCASE.find((h) => h.id === auditResult.nextStayHouse) || null
    : null;
  const nextStayDefense = auditResult?.nextStayHouse
    ? HOME_CITY_DEFENSE[auditResult.nextStayHouse] || HOME_CITY_DEFENSE[1]
    : auditResult
    ? HOME_CITY_DEFENSE[auditResult.pastHouse] || HOME_CITY_DEFENSE[1]
    : HOME_CITY_DEFENSE[2];
  const activePriority =
    V3_PRIORITY_OPTIONS.find((p) => p.houseId === selectedNextHouse) ||
    V3_PRIORITY_OPTIONS[0];
  const activeRadiusObj =
    TRAVEL_RADIUS_OPTIONS.find((r) => r.id === selectedRadius) ||
    TRAVEL_RADIUS_OPTIONS[1];
  const goalShowcase =
    HOUSES_SHOWCASE.find((h) => h.id === selectedNextHouse) || HOUSES_SHOWCASE[9];

  const handleShareBoardingPass = async () => {
    if (!auditResult || !pastShowcase) return;
    const text = `Descobri grátis que meu aniversário de ${auditResult.pastYear} em ${auditResult.pastCity} ligou a Casa ${pastShowcase.numberLabel} (${pastShowcase.title})! Teste o seu no Protocolo Solar: https://protocolosolar.com.br/`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Meu Passe Solar",
          text,
          url: "https://protocolosolar.com.br/",
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2600);
      }
    } catch {
      // cancelado
    }
  };

  // Curva de voo SVG de São Paulo até a cidade demonstrativa ativa
  const flightPathD = useMemo(() => {
    const x1 = DEMO_CHARACTER_PROFILE.mapX;
    const y1 = DEMO_CHARACTER_PROFILE.mapY;
    const x2 = activeDemoCity.mapX;
    const y2 = activeDemoCity.mapY;
    const cx = (x1 + x2) / 2;
    const cy = Math.min(y1, y2) - 75;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  }, [activeDemoCity]);

  const modalPortal = (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-[#071120] text-white border border-[#C9A227]/45 overflow-hidden shadow-2xl my-auto font-ps-ui"
          >
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#F5DE98]">
                {activeModal === "theo" && "Theo explica em 14 segundos"}
                {activeModal === "radar" && "Radar de Destinos & Defesa Local"}
                {activeModal === "areas" && "As 8 Áreas da Vida"}
                {activeModal === "ticket" && "Bilhete de Embarque Cósmico"}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Fechar janela"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {activeModal === "theo" && (
                <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                  <video
                    src="/videos/v3/theo-explica-14s.mp4"
                    poster="/videos/v3/theo-explica-poster.jpg"
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {activeModal === "radar" && (
                <div className="space-y-4">
                  <img
                    src="/images/abertura/zurich.jpg"
                    alt="Zurique calculada"
                    width={1280}
                    height={720}
                    className="w-full h-52 rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-ps-display text-2xl font-bold">
                      Zurique · Sol na Casa 02
                    </h3>
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#E5C158]/20 text-[#F5DE98] border border-[#E5C158]/40">
                      47°22&apos;N · 08°33&apos;E
                    </span>
                  </div>
                  <p className="text-sm text-[#CBD5E1]">
                    Mostra os destinos ideais para seu objetivo e inclui o <strong>Manual de Defesa da Cidade Atual</strong> caso você escolha comemorar sem viajar.
                  </p>
                </div>
              )}

              {activeModal === "areas" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    ["Carreira", "Palco, metas e decisões"],
                    ["Dinheiro", "Margem, preço e reserva"],
                    ["Amor", "Vínculos e acordos"],
                    ["Saúde & Rotina", "Ritmo, treino e sono"],
                    ["Rede", "Grupos e indicações"],
                    ["Família", "Casa e base íntima"],
                    ["Energia", "Foco mental e descanso"],
                    ["Ação Prática", "O que priorizar no ano"],
                  ].map(([t, d]) => (
                    <div key={t} className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                      <strong className="text-[#F5DE98] block text-sm">{t}</strong>
                      <span className="text-[#CBD5E1] block">{d}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === "ticket" && (
                <div className="space-y-3 text-center">
                  <img
                    src="/images/v3/boarding-pass-art.jpg"
                    alt="Bilhete de Embarque Cósmico"
                    width={720}
                    height={1280}
                    className="max-h-[64vh] w-auto mx-auto rounded-2xl object-contain"
                  />
                  <p className="text-xs text-[#CBD5E1]">
                    Gerado com seu nome, cidade escolhida, minuto UTC exato e Casa Solar ativada.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full bg-[#040812] text-[#F8FAFC] font-ps-ui overflow-x-hidden selection:bg-[#E5C158]/30 [color-scheme:dark]">
      {!embeddedInShell && (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040812]/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#E5C158]" />
              <span className="font-ps-display text-base font-bold text-white">
                Protocolo Solar
              </span>
            </Link>
            <div className="flex items-center gap-4 text-xs">
              <Link to="/casas" className="text-[#F5DE98] font-semibold">
                As 12 Casas
              </Link>
              <Link
                to="/auth"
                className="px-3.5 py-1.5 rounded-full bg-white/10 text-white font-semibold"
              >
                Entrar
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* =====================================================================
          CENA 1 — CINEMA FULL-BLEED + BILHETE DE EMBARQUE SOLAR INTERATIVO
          Zero blocos de texto longos. A arte e o bilhete dominam a cena.
         ===================================================================== */}
      <section
        className={`relative min-h-[90svh] flex items-center overflow-hidden border-b border-white/[0.08] ${
          embeddedInShell ? "pt-20 pb-14 lg:py-16" : "py-16"
        }`}
      >
        {/* Cinema Full-Bleed do Destino Ativo */}
        <div className="absolute inset-0 z-0 bg-[#040812]">
          {prefersReducedMotion ? (
            <img
              src={activeHeroDest.image}
              alt={`${activeHeroDest.city}, ${activeHeroDest.country}`}
              width={1600}
              height={900}
              className="w-full h-full object-cover opacity-55"
            />
          ) : (
            <video
              key={activeHeroDest.id}
              src={activeHeroDest.video}
              poster={activeHeroDest.image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover opacity-55 scale-[1.02]"
            />
          )}
          {/* Vinheta esculpida garantindo contraste >12:1 no texto e céu visível à direita */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(95deg, rgba(4,8,18,0.96) 0%, rgba(4,8,18,0.86) 46%, rgba(4,8,18,0.42) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-transparent to-[#040812]/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full">
          {partnerRef && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5C158]/40 bg-[#071120]/85 backdrop-blur-md px-4 py-1.5 text-xs text-[#FFF3D1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Convite verificado {formatPartnerIdLabel(partnerRef)}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Ação principal sempre ao alcance em 375px */}
            <div className="lg:col-span-6 space-y-6">
              <h1
                className="font-ps-display font-bold text-white tracking-[-0.03em] leading-[1.02] [text-wrap:balance]"
                style={{ fontSize: "clamp(2.45rem, 5.5vw, 4.4rem)" }}
              >
                {angle.headline}
              </h1>

              <p className="text-base sm:text-xl text-[#E2E8F0] leading-snug max-w-[38ch]">
                {angle.subcopy}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={scrollToConsult}
                  className="min-h-[56px] px-7 py-4 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#050A14] font-bold text-sm sm:text-base shadow-[0_18px_45px_rgba(229,193,88,0.3)] transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFF3D1]"
                >
                  {angle.ctaLabel}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal("theo")}
                  className="min-h-[56px] px-5 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md border border-white/15 text-white font-semibold text-sm inline-flex items-center justify-center gap-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E5C158]"
                >
                  <span className="w-7 h-7 rounded-full bg-[#E5C158] text-[#050A14] flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </span>
                  <span>Ver em 14s</span>
                </button>
              </div>
            </div>

            {/* O Objeto-Assinatura em Escala: Bilhete de Embarque Solar Interativo */}
            <div
              className="lg:col-span-6"
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
            >
              <div className="relative max-w-md mx-auto lg:ml-auto">
                {/* Glow dourado atrás do bilhete */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[#C9A227]/25 via-transparent to-[#E5C158]/20 blur-2xl pointer-events-none"
                />

                {/* Bilhete físico com entalhes laterais reais */}
                <div className="relative rounded-[28px] bg-[#081324]/92 backdrop-blur-2xl border border-[#E5C158]/45 shadow-[0_28px_80px_rgba(0,0,0,0.75)] overflow-hidden">
                  {/* Topo do bilhete com janela fotográfica viva */}
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img
                      src={activeHeroDest.image}
                      alt={activeHeroDest.city}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081324] via-[#081324]/25 to-transparent" />
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-[#040812]/75 backdrop-blur-md text-[#F5DE98] border border-[#E5C158]/35">
                        Solar Boarding Pass
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-[#E5C158] text-[#040812] font-bold">
                        {activeHeroDest.houseCode}
                      </span>
                    </div>
                  </div>

                  {/* Rotas IATA grandes */}
                  <div className="px-6 pt-3 pb-5">
                    <div className="grid grid-cols-11 items-center">
                      <div className="col-span-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94A3B8] block">
                          Origem
                        </span>
                        <span className="font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                          VOCÊ
                        </span>
                      </div>

                      <div className="col-span-3 flex flex-col items-center">
                        <div className="w-full flex items-center gap-1.5">
                          <span className="h-px flex-1 bg-[#E5C158]/40" />
                          <Plane className="w-4 h-4 text-[#E5C158]" />
                          <span className="h-px flex-1 bg-[#E5C158]/40" />
                        </div>
                        <span className="font-mono text-[9px] text-[#F5DE98] mt-1">
                          365 DIAS
                        </span>
                      </div>

                      <div className="col-span-4 text-right">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94A3B8] block">
                          Exemplo
                        </span>
                        <span className="font-ps-display text-3xl sm:text-4xl font-bold text-[#F5DE98] tracking-tight tabular-nums">
                          {activeHeroDest.iata}
                        </span>
                      </div>
                    </div>

                    {/* Linha picotada real com entalhes semicirculares simétricos nas bordas */}
                    <div className="relative my-4 -mx-6 flex items-center justify-between">
                      <span
                        aria-hidden="true"
                        className="-ml-2.5 w-5 h-5 rounded-full bg-[#040812] border border-[#E5C158]/40 shrink-0"
                      />
                      <div className="w-full border-t border-dashed border-[#E5C158]/35 mx-2" />
                      <span
                        aria-hidden="true"
                        className="-mr-2.5 w-5 h-5 rounded-full bg-[#040812] border border-[#E5C158]/40 shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-ps-display text-lg font-bold text-white">
                          {activeHeroDest.city}, {activeHeroDest.country}
                        </p>
                        <p className="text-xs text-[#CBD5E1]">{activeHeroDest.vibe}</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#94A3B8] tabular-nums shrink-0">
                        {activeHeroDest.coords}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seletor tátil de cidades em 1 toque (sem quebrar em duas linhas feias) */}
                <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {HERO_BOARDING_DESTINATIONS.map((dest, idx) => {
                    const active = idx === heroDestIdx;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => {
                          setHeroDestIdx(idx);
                          setHeroPaused(true);
                        }}
                        className={`shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          active
                            ? "bg-[#E5C158] text-[#040812]"
                            : "bg-white/[0.07] text-[#CBD5E1] hover:bg-white/[0.14]"
                        }`}
                      >
                        {dest.city}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CENA 2 — MAPA INTERATIVO DE ROTAS + CINEMA AO VIVO NAS 3 CIDADES
          "Mesma data. Outra coordenada. Outro sinal."
         ===================================================================== */}
      <section id="como-funciona" className="py-16 sm:py-24 border-b border-white/[0.07] scroll-mt-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2
                className="font-ps-display font-bold text-white tracking-[-0.025em] leading-[1.05] [text-wrap:balance]"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
              >
                Mesma pessoa. Outra cidade. Outro ano.
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8]">
                Como o Wi-Fi: você não vê o sinal no ar, mas sente na hora quando ele fica cheio.
              </p>
            </div>

            {/* Seletor de 3 cidades com miniatura */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {DEMO_CHARACTER_CITIES.map((city) => {
                const active = city.id === activeDemoCity.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setDemoCityId(city.id)}
                    className={`shrink-0 min-h-[46px] pl-2 pr-4 py-1.5 rounded-full border flex items-center gap-2.5 transition-colors ${
                      active
                        ? "bg-[#E5C158] text-[#040812] border-[#E5C158] font-bold"
                        : "bg-[#091426] text-white border-white/15 hover:border-[#E5C158]/50 font-medium"
                    }`}
                  >
                    <img
                      src={city.skylineImage}
                      alt=""
                      width={32}
                      height={32}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs sm:text-sm">{city.city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Mapa Orbital SVG Interativo (5 colunas) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#081222] border border-white/10 p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
                <span className="font-semibold text-white">{DEMO_CHARACTER_PROFILE.name}</span>
                <span className="font-mono text-[11px] text-[#F5DE98]">
                  Origem: {DEMO_CHARACTER_PROFILE.originIata}
                </span>
              </div>

              {/* Carta de Rotas SVG */}
              <div className="my-4 relative rounded-2xl bg-[#050B16] border border-white/[0.06] overflow-hidden aspect-[16/10] flex items-center justify-center">
                <svg
                  viewBox="0 0 800 420"
                  className="w-full h-full"
                  role="img"
                  aria-label={`Rota solar de São Paulo para ${activeDemoCity.city}`}
                >
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#E5C158" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#050B16" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width="800" height="420" fill="url(#mapGlow)" />

                  {/* Grade náutica/orbital sutil */}
                  {[90, 170, 250, 330].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="800"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="3 6"
                    />
                  ))}
                  {[160, 320, 480, 640].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="420"
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="3 6"
                    />
                  ))}

                  {/* Rotas inativas */}
                  {DEMO_CHARACTER_CITIES.map((c) => {
                    const cx = (DEMO_CHARACTER_PROFILE.mapX + c.mapX) / 2;
                    const cy = Math.min(DEMO_CHARACTER_PROFILE.mapY, c.mapY) - 75;
                    return (
                      <path
                        key={c.id}
                        d={`M ${DEMO_CHARACTER_PROFILE.mapX} ${DEMO_CHARACTER_PROFILE.mapY} Q ${cx} ${cy} ${c.mapX} ${c.mapY}`}
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                        strokeDasharray="4 5"
                      />
                    );
                  })}

                  {/* Arco de voo ativo em ouro */}
                  <motion.path
                    key={activeDemoCity.id}
                    d={flightPathD}
                    fill="none"
                    stroke="#E5C158"
                    strokeWidth="3"
                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />

                  {/* Ponto de Origem: São Paulo */}
                  <g>
                    <circle
                      cx={DEMO_CHARACTER_PROFILE.mapX}
                      cy={DEMO_CHARACTER_PROFILE.mapY}
                      r="7"
                      fill="#FFFFFF"
                    />
                    <text
                      x={DEMO_CHARACTER_PROFILE.mapX}
                      y={DEMO_CHARACTER_PROFILE.mapY + 22}
                      textAnchor="middle"
                      fill="#CBD5E1"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      SÃO PAULO
                    </text>
                  </g>

                  {/* Pinos clicáveis das 3 cidades */}
                  {DEMO_CHARACTER_CITIES.map((c) => {
                    const isSel = c.id === activeDemoCity.id;
                    return (
                      <g
                        key={c.id}
                        onClick={() => setDemoCityId(c.id)}
                        className="cursor-pointer"
                      >
                        {isSel && (
                          <circle
                            cx={c.mapX}
                            cy={c.mapY}
                            r="18"
                            fill="rgba(229,193,88,0.22)"
                          />
                        )}
                        <circle
                          cx={c.mapX}
                          cy={c.mapY}
                          r={isSel ? "8" : "5.5"}
                          fill={isSel ? "#E5C158" : "#64748B"}
                          stroke="#040812"
                          strokeWidth="2"
                        />
                        <text
                          x={c.mapX}
                          y={c.mapY - 14}
                          textAnchor="middle"
                          fill={isSel ? "#FFF3D1" : "#94A3B8"}
                          fontSize="12"
                          fontWeight={isSel ? "700" : "500"}
                          fontFamily="monospace"
                        >
                          {c.iata}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Não existe cidade mágica: Zurique abre caixa pro Lucas, mas pode ser só silêncio pro amigo dele.
              </p>
            </div>

            {/* Portal de Cinema da Cidade Selecionada (7 colunas) */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-[#081222] border border-[#E5C158]/35 min-h-[340px] sm:min-h-[420px] flex flex-col justify-end">
              {prefersReducedMotion ? (
                <img
                  src={activeDemoCity.portraitImage}
                  alt={activeDemoCity.city}
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <video
                  key={activeDemoCity.id}
                  src={activeDemoCity.portraitVideo}
                  poster={activeDemoCity.portraitImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-[#040812]/35 to-transparent" />

              {/* Carimbo superior no vídeo */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#040812]/80 backdrop-blur-md border border-[#E5C158]/45 font-mono text-xs font-bold text-[#F5DE98]">
                  {activeDemoCity.city} · {activeDemoCity.houseLabel}
                </span>
                <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-[#040812]/75 text-[#CBD5E1] tabular-nums">
                  {activeDemoCity.coords}
                </span>
              </div>

              {/* Placa inferior enxuta: 1 frase + 3 pílulas */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3.5">
                <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {activeDemoCity.headline}
                </h3>
                <p className="text-sm sm:text-base text-[#E2E8F0] max-w-xl">
                  {activeDemoCity.oneLiner}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeDemoCity.chips.map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#FFF3D1]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CENA 3 — CHECK-IN INTERATIVO DE 30 SEGUNDOS (ANIVERSÁRIO PASSADO GRÁTIS)
          Visual de quiosque de primeira classe + Revelação estilo Spotify Wrapped
         ===================================================================== */}
      <section
        ref={consultSectionRef}
        id="consulta-gratuita"
        className="py-16 sm:py-24 border-b border-white/[0.07] scroll-mt-28"
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="rounded-[32px] bg-gradient-to-b from-[#0B192E] to-[#07101F] border border-[#E5C158]/45 shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Topo curto e direto */}
            <div className="px-6 sm:px-10 py-6 border-b border-dashed border-[#E5C158]/35 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                  Teste um aniversário que você já viveu
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                  100% gratuito · Resultado imediato na tela sem pedir cadastro antes
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-[#E5C158]/15 border border-[#E5C158]/40 text-[#F5DE98] tabular-nums">
                {step < 5 ? `${step} / 4` : "Passe Gerado"}
              </span>
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="k-1"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16 }}
                    className="max-w-md space-y-5"
                  >
                    <label
                      htmlFor="v3-dob"
                      className="font-ps-display text-xl sm:text-2xl font-bold text-white block"
                    >
                      Quando você nasceu?
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#E5C158] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="v3-dob"
                        type="date"
                        autoComplete="bday"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full h-14 pl-11 pr-4 rounded-2xl bg-white/[0.07] border border-white/20 text-base text-white focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    {formError && (
                      <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2">
                        {formError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812] font-bold text-sm transition-colors"
                    >
                      Continuar
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="k-2"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16 }}
                    className="max-w-md space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="v3-time"
                        className="font-ps-display text-xl sm:text-2xl font-bold text-white"
                      >
                        Qual horário?
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-[#94A3B8] hover:text-white inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    </div>

                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#E5C158] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="v3-time"
                        type="time"
                        value={unknownTime ? "12:00" : birthTime}
                        disabled={unknownTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full h-14 pl-11 pr-4 rounded-2xl bg-white/[0.07] border border-white/20 text-base text-white focus:outline-none focus:border-[#E5C158] disabled:opacity-45"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !unknownTime;
                        setUnknownTime(next);
                        if (next) setBirthTime("12:00");
                      }}
                      className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                        unknownTime
                          ? "bg-[#E5C158]/20 border-[#E5C158] text-[#FFF3D1]"
                          : "bg-white/[0.04] border-white/15 text-[#CBD5E1] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>Não sei meu horário exato (usar 12:00)</span>
                      {unknownTime && <Check className="w-4 h-4 text-[#E5C158]" />}
                    </button>

                    {unknownTime && (
                      <p className="text-xs text-[#F5DE98]/90">
                        Usamos 12:00 como referência solar (cidades na fronteira entre duas Casas podem variar alguns graus).
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812] font-bold text-sm transition-colors"
                    >
                      Continuar
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="k-3"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16 }}
                    className="max-w-md space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-ps-display text-xl sm:text-2xl font-bold text-white">
                        Em qual cidade você nasceu?
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs text-[#94A3B8] hover:text-white inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    </div>

                    <div className="h-14">
                      <CityAutocomplete
                        value={birthCity}
                        onChange={(val, valid, coords) => {
                          setBirthCity(val);
                          setBirthCityValid(valid);
                          if (coords) setBirthCoords(coords);
                        }}
                        placeholder="Digite e toque na cidade..."
                        className="!h-14 !rounded-2xl !bg-white/[0.07] !border-white/20 !text-base"
                      />
                    </div>

                    {formError && (
                      <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2">
                        {formError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleNextStep3}
                      className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812] font-bold text-sm transition-colors"
                    >
                      Continuar
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.form
                    key="k-4"
                    onSubmit={handleRunFreeAudit}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16 }}
                    className="max-w-lg space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-ps-display text-xl sm:text-2xl font-bold text-white">
                        Onde você passou aquele aniversário?
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-xs text-[#94A3B8] hover:text-white inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                      {availableYears.map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setTargetYear(yr)}
                          className={`shrink-0 min-h-[42px] px-4 py-2 rounded-full font-mono text-xs font-bold border transition-colors tabular-nums ${
                            targetYear === yr
                              ? "bg-[#E5C158] text-[#040812] border-[#E5C158]"
                              : "bg-white/[0.05] text-white border-white/15 hover:bg-white/10"
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#CBD5E1]">
                          Cidade em {targetYear}
                        </span>
                        {birthCity && (
                          <button
                            type="button"
                            onClick={() => {
                              setPastCity(birthCity);
                              setPastCityValid(true);
                              if (birthCoords) setPastCoords(birthCoords);
                            }}
                            className="text-xs text-[#F5DE98] underline"
                          >
                            Passei na minha cidade natal
                          </button>
                        )}
                      </div>
                      <div className="h-14">
                        <CityAutocomplete
                          value={pastCity}
                          onChange={(val, valid, coords) => {
                            setPastCity(val);
                            setPastCityValid(valid);
                            if (coords) setPastCoords(coords);
                          }}
                          placeholder="Cidade onde você estava na virada..."
                          className="!h-14 !rounded-2xl !bg-white/[0.07] !border-white/20 !text-base"
                        />
                      </div>
                    </div>

                    {formError && (
                      <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={calculating}
                      className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] disabled:opacity-60 text-[#040812] font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-colors"
                    >
                      {calculating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#040812]/30 border-t-[#040812] rounded-full animate-spin" />
                          <span>Calculando {targetYear}...</span>
                        </>
                      ) : (
                        <span>Revelar meu ano de {targetYear} grátis</span>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* REVELAÇÃO VISUAL ESTILO WRAPPED + CONTRASTE IMEDIATO */}
                {step === 5 && auditResult && pastShowcase && (
                  <motion.div
                    key="k-5"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Bilhete Visual do Ano Vivido */}
                      <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#050B16] border border-[#E5C158]/50 relative">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`/images/stories/casa-${pastShowcase.id}.jpg`}
                            alt={`Casa ${pastShowcase.numberLabel}`}
                            width={720}
                            height={480}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-[#050B16]/35 to-transparent" />
                          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-[#040812]/80 text-[#F5DE98] border border-[#E5C158]/40">
                            {auditResult.pastCity} · {auditResult.pastYear}
                          </span>
                          <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                            <div>
                              <span className="font-mono text-xs text-[#E5C158] block">
                                SOL NA CASA {pastShowcase.numberLabel}
                              </span>
                              <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                                {pastShowcase.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                          <p className="text-sm text-[#E2E8F0] leading-relaxed">
                            {pastShowcase.cycleFocus}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {pastShowcase.inPractice.map((scene, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs"
                              >
                                <strong className="text-[#F5DE98] block mb-0.5">
                                  {scene.area}
                                </strong>
                                <span className="text-[#CBD5E1] line-clamp-3">
                                  {scene.example}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={handleShareBoardingPass}
                              className="min-h-[42px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#F5DE98] text-xs font-semibold inline-flex items-center gap-1.5"
                            >
                              {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                              <span>{copiedPass ? "Copiado!" : "Compartilhar"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStep(4)}
                              className="min-h-[42px] px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs text-[#CBD5E1]"
                            >
                              Testar outro ano
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Contraste imediato para o próximo aniversário */}
                      <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#122544] to-[#081324] border border-[#E5C158]/45 p-5 sm:p-6 flex flex-col justify-between gap-5">
                        <div className="space-y-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5DE98]">
                            E em {auditResult.nextYear}?
                          </span>
                          {nextStayShowcase ? (
                            <>
                              <h4 className="font-ps-display text-xl font-bold text-white">
                                Ficar em {auditResult.pastCity} liga a Casa {nextStayShowcase.numberLabel}
                              </h4>
                              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                                {nextStayDefense.strength}
                              </p>
                            </>
                          ) : (
                            <h4 className="font-ps-display text-xl font-bold text-white">
                              Compare onde você mora com seus melhores destinos
                            </h4>
                          )}

                          {/* 3 Destinos Bloqueados */}
                          <div className="space-y-2 pt-2">
                            {["Destino Ideal #1", "Destino Regional #2", "Rota Global #3"].map(
                              (label) => (
                                <div
                                  key={label}
                                  className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs"
                                >
                                  <span className="text-white/75 flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-[#E5C158]" />
                                    {label}
                                  </span>
                                  <span className="font-mono text-[10px] text-[#F5DE98] blur-[3px] select-none">
                                    CASA {goalShowcase.numberLabel}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={scrollToPlans}
                          className="w-full min-h-[50px] py-3.5 px-5 rounded-2xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812] font-bold text-xs uppercase tracking-[0.14em]"
                        >
                          Destravar meus destinos (a partir de R$ 19,90)
                        </button>
                      </div>
                    </div>

                    {/* Salvar cópia opcional em 1 linha compacta */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-xs text-[#CBD5E1] flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#E5C158] shrink-0" />
                        Quer guardar este resumo grátis no seu e-mail? (Opcional)
                      </span>
                      {emailSaved ? (
                        <span className="text-xs font-semibold text-emerald-300">
                          Salvo com sucesso!
                        </span>
                      ) : (
                        <form onSubmit={handleSaveCopyEmail} className="flex w-full sm:w-auto gap-2">
                          <input
                            type="email"
                            autoComplete="email"
                            value={copyEmail}
                            onChange={(e) => setCopyEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="flex-1 sm:w-52 h-10 px-3 rounded-xl bg-white/[0.07] border border-white/15 text-base sm:text-xs text-white"
                          />
                          <button
                            type="submit"
                            className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white"
                          >
                            Salvar
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CENA 4 — PAINEL SPLIT-FLAP DE PARTIDAS + LEQUE VISUAL DO RELATÓRIO
          Zero paredes de texto. Toque para girar o painel e ampliar as artes!
         ===================================================================== */}
      <section id="amostra-relatorio" className="py-16 sm:py-24 border-b border-white/[0.07] scroll-mt-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-14">
          {/* Painel Solari Split-Flap Interativo */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <h2
                className="font-ps-display font-bold text-white tracking-[-0.025em] leading-[1.05]"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.1rem)" }}
              >
                Qual sinal você quer ligar no próximo ciclo?
              </h2>
              <Link
                to="/casas"
                className="text-xs font-semibold text-[#F5DE98] underline shrink-0"
              >
                Explorar todas as 12 Casas
              </Link>
            </div>

            {/* 4 Cartões Fotográficos Limpos */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {V3_PRIORITY_OPTIONS.map((opt) => {
                const selected = selectedNextHouse === opt.houseId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedNextHouse(opt.houseId)}
                    className={`group relative h-40 sm:h-48 rounded-3xl overflow-hidden border text-left transition-transform active:scale-[0.98] ${
                      selected
                        ? "border-[#E5C158] ring-2 ring-[#E5C158]/40"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={opt.image}
                      alt={opt.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/95 via-[#040812]/30 to-transparent" />
                    <span className="absolute top-3 left-3 font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#040812]/80 text-[#F5DE98] border border-white/15">
                      {opt.tag}
                    </span>
                    {selected && (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#E5C158] text-[#040812] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="absolute bottom-3.5 left-4 right-4">
                      <span className="font-ps-display text-base sm:text-lg font-bold text-white block leading-snug">
                        {opt.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filtros de alcance + Painel Mecânico de Aeroporto (Split-Flap) sem cortes */}
            <div className="rounded-3xl bg-[#070E1B] border border-white/12 p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {TRAVEL_RADIUS_OPTIONS.map((rad) => {
                  const active = selectedRadius === rad.id;
                  return (
                    <button
                      key={rad.id}
                      type="button"
                      onClick={() => setSelectedRadius(rad.id)}
                      className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                        active
                          ? "bg-[#E5C158] text-[#040812] border-[#E5C158]"
                          : "bg-white/[0.04] text-[#CBD5E1] border-white/12 hover:bg-white/10"
                      }`}
                    >
                      {rad.title}
                    </button>
                  );
                })}
              </div>

              {/* Placa Solari Split-Flap */}
              <div className="rounded-2xl bg-[#03060C] border border-[#E5C158]/30 px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs sm:text-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] block mb-0.5">
                    Painel de Embarque
                  </span>
                  <SplitFlapCell
                    text={`${activePriority.flapCode} · ${activeRadiusObj.badge.toUpperCase()}`}
                    reduced={prefersReducedMotion}
                  />
                </div>
                <button
                  type="button"
                  onClick={scrollToPlans}
                  className="shrink-0 min-h-[42px] px-5 py-2 rounded-xl bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812] font-bold text-xs uppercase tracking-[0.12em]"
                >
                  Ver Passes
                </button>
              </div>
            </div>
          </div>

          {/* Vitrine Visual Ampliável do Entregável (Arte Grande, Pouco Texto) */}
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                Espie seu passe por dentro
              </h3>
              <span className="text-xs text-[#94A3B8]">Toque para ampliar</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {/* 1. Radar Geográfico */}
              <button
                type="button"
                onClick={() => setActiveModal("radar")}
                className="group rounded-3xl bg-[#081222] border border-white/10 hover:border-[#E5C158]/50 p-4 text-left flex flex-col justify-between transition-colors"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden bg-[#040812]">
                  <img
                    src="/images/abertura/zurich.jpg"
                    alt="Radar de Destinos"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081222] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#040812]/75 text-white flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-ps-display text-lg font-bold text-white">
                      Zurique · Casa 02
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#E5C158] text-[#040812] font-bold">
                      47°22&apos;N
                    </span>
                  </div>
                </div>
                <div className="pt-3.5 px-1">
                  <strong className="font-ps-display text-lg text-white block">
                    Radar de Cidades & Defesa Local
                  </strong>
                  <span className="text-xs text-[#94A3B8]">
                    Destinos ideais + guia para quem fica em casa
                  </span>
                </div>
              </button>

              {/* 2. Bilhete Cósmico Central em Destaque */}
              <button
                type="button"
                onClick={() => setActiveModal("ticket")}
                className="group rounded-3xl bg-gradient-to-b from-[#10213D] to-[#081222] border border-[#E5C158]/45 p-4 text-left flex flex-col justify-between transition-transform md:-translate-y-2"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden bg-[#060911] p-2 flex items-center justify-center">
                  <img
                    src="/images/v3/boarding-pass-art.jpg"
                    alt="Bilhete de Embarque Solar"
                    width={720}
                    height={1280}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#040812]/75 text-white flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="pt-3.5 px-1">
                  <strong className="font-ps-display text-lg text-[#F5DE98] block">
                    Bilhete de Embarque 9:16
                  </strong>
                  <span className="text-xs text-[#CBD5E1]">
                    Pronto para salvar ou postar nos Stories
                  </span>
                </div>
              </button>

              {/* 3. As 8 Áreas da Vida */}
              <button
                type="button"
                onClick={() => setActiveModal("areas")}
                className="group rounded-3xl bg-[#081222] border border-white/10 hover:border-[#E5C158]/50 p-4 text-left flex flex-col justify-between transition-colors"
              >
                <div className="relative h-64 rounded-2xl bg-[#050B16] border border-white/[0.06] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#F5DE98]">
                      8 Áreas Abertas
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Carreira & Palco",
                      "Dinheiro & Caixa",
                      "Amor & Dupla",
                      "Corpo & Rotina",
                      "Rede & Amigos",
                      "Casa & Base",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-2 rounded-xl bg-white/[0.05] text-xs text-white font-medium truncate"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3.5 px-1">
                  <strong className="font-ps-display text-lg text-white block">
                    Leitura Direta sem Astrologuês
                  </strong>
                  <span className="text-xs text-[#94A3B8]">
                    Acesso online na hora após confirmação
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CENA 5 — 3 BILHETES DE PASSE SOLAR (R$ 19,90 · R$ 49,90 · R$ 99,90) + FAQ CURTO
         ===================================================================== */}
      <section ref={plansSectionRef} id="planos-v3" className="py-16 sm:py-24 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2
              className="font-ps-display font-bold text-white tracking-[-0.025em]"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.2rem)" }}
            >
              Escolha seu Passe Solar
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Pagamento único via Pix ou Cartão · Todas as 8 áreas da vida inclusas em qualquer passe
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {V3_PLANS.map((plan) => (
              <div
                key={plan.pkg}
                className={`relative rounded-[28px] p-7 flex flex-col justify-between border overflow-hidden ${
                  plan.featured
                    ? "bg-gradient-to-b from-[#122646] to-[#081222] border-2 border-[#E5C158] shadow-[0_24px_65px_rgba(229,193,88,0.16)]"
                    : "bg-[#081222] border-white/12 hover:border-[#E5C158]/45"
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#F5DE98] font-bold">
                      {plan.code}
                    </span>
                    <Plane className="w-4 h-4 text-[#E5C158]" />
                  </div>

                  <div>
                    <h3 className="font-ps-display text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Linha picotada de bilhete */}
                  <div className="border-t border-dashed border-white/15 pt-4 flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[#F5DE98]">R$</span>
                    <span className="font-ps-display text-5xl font-bold text-[#F5DE98] tabular-nums">
                      {plan.priceInt}
                    </span>
                    <span className="text-base font-semibold text-white/80 tabular-nums">
                      ,{plan.priceDec}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E2E8F0]">
                        <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToPackage(plan.pkg)}
                  className={`mt-7 w-full min-h-[52px] py-3.5 px-5 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] transition-colors ${
                    plan.featured
                      ? "bg-[#E5C158] hover:bg-[#F0CF6E] text-[#040812]"
                      : "bg-white/[0.08] hover:bg-[#E5C158] text-[#F5DE98] hover:text-[#040812] border border-[#E5C158]/35"
                  }`}
                >
                  {plan.ctaLabel}
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#94A3B8] text-center">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E5C158]" />
              Efemérides astronômicas Swiss Ephemeris
            </span>
            <Link to="/parceiros" className="text-[#F5DE98] underline">
              Programa de Parceiros (20% Pix · #publi)
            </Link>
          </div>

          {/* 4 Dúvidas Rápidas */}
          <div className="max-w-2xl mx-auto pt-4">
            <Accordion type="single" collapsible className="space-y-2.5">
              {V3_FAQ_ITEMS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-white/10 bg-[#081222] px-5 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-4 font-ps-display text-base font-bold text-left text-white hover:text-[#F5DE98]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm leading-relaxed pb-4 text-[#CBD5E1]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <footer className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
            <span>© {new Date().getFullYear()} Protocolo Solar</span>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/consultar" className="hover:text-white">Calculador</Link>
              <Link to="/casas" className="hover:text-white">As 12 Casas</Link>
              <Link to="/parceiros" className="hover:text-white">Parceiros</Link>
              <Link to="/termos" className="hover:text-white">Termos</Link>
              <Link to="/privacidade" className="hover:text-white">Privacidade</Link>
            </div>
          </footer>
        </div>
      </section>

      {typeof document !== "undefined" ? createPortal(modalPortal, document.body) : null}
    </div>
  );
};

export default LandingV3;
