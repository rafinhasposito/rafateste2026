import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Flame,
  Globe,
  HeartHandshake,
  Home,
  Loader2,
  Lock,
  Megaphone,
  Moon,
  Network,
  RefreshCw,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Wallet,
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import {
  API_URL,
  getCurrentSolarYear,
  getNextBirthdayYear,
  normalizeBirthTime,
} from "@/lib/astro";
import { formatPartnerIdLabel, getStoredAffiliateRef } from "@/lib/affiliates";
import {
  ELEMENT_STYLES,
  HOUSES_SHOWCASE,
  type HouseIconKey,
} from "@/data/housesShowcase";
import { houseThemes } from "@/data/houseThemes";
import {
  HOME_CITY_DEFENSE,
  TRAVEL_RADIUS_OPTIONS,
  V3_ANGLES,
  V3_FAQ_ITEMS,
  V3_PRIORITY_OPTIONS,
  type TravelRadiusOption,
  type V3AngleKey,
} from "@/data/landingV3Data";

const ICON_MAP: Record<HouseIconKey, typeof Crown> = {
  crown: Crown,
  wallet: Wallet,
  megaphone: Megaphone,
  home: Home,
  flame: Flame,
  activity: Activity,
  handshake: HeartHandshake,
  refresh: RefreshCw,
  globe: Globe,
  trophy: Trophy,
  network: Network,
  moon: Moon,
};

interface DualAuditResult {
  pastHouse: number;
  pastCity: string;
  pastYear: string;
  sunSign?: string | null;
  nextStayHouse: number | null;
  nextYear: string;
  usedApproximateTime: boolean;
}

function parseAngle(raw: string | null): V3AngleKey {
  if (raw === "fitness" || raw === "carreira" || raw === "cetico") return raw;
  return "padrao";
}

export default function LandingV3() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const angleKey = parseAngle(searchParams.get("angulo"));
  const angle = V3_ANGLES[angleKey];

  const affiliateRef = useMemo(() => {
    const urlRef = searchParams.get("ref");
    return urlRef || getStoredAffiliateRef();
  }, [searchParams]);

  const quizRef = useRef<HTMLElement | null>(null);
  const housesRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);

  // Quiz Funnel de 5 Passos
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedNextHouse, setSelectedNextHouse] = useState<number>(
    angle.featuredHouseId || 2
  );
  const [selectedRadius, setSelectedRadius] =
    useState<TravelRadiusOption["id"]>("300km");

  // Dados natais + validação do passado
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [birthCityValid, setBirthCityValid] = useState(false);
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>(undefined);

  const [targetYear, setTargetYear] = useState<string>(() =>
    String(new Date().getFullYear() - 1)
  );
  const [pastCity, setPastCity] = useState("");
  const [pastCityValid, setPastCityValid] = useState(false);
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>(undefined);

  const [calculating, setCalculating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<DualAuditResult | null>(null);
  const [validatedMatch, setValidatedMatch] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Pré-preenche se o usuário já estiver logado com perfil natal
  useEffect(() => {
    if (!profile) return;
    if (profile.full_name && !name) setName(profile.full_name);
    if (profile.birth_date && !birthDate) {
      setBirthDate(profile.birth_date);
      setTargetYear(getCurrentSolarYear(profile.birth_date));
    }
    if (profile.birth_time && !birthTime && !unknownTime) {
      setBirthTime(normalizeBirthTime(profile.birth_time));
    }
    if (profile.birth_city && !birthCity) {
      setBirthCity(profile.birth_city);
      setBirthCityValid(true);
      if (profile.birth_lat && profile.birth_lon) {
        setBirthCoords({
          lat: Number(profile.birth_lat),
          lon: Number(profile.birth_lon),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (angle.featuredHouseId) {
      setSelectedNextHouse(angle.featuredHouseId);
    }
  }, [angle.featuredHouseId]);

  useEffect(() => {
    document.title =
      "Protocolo Solar V3 — Quiz & Validação Gratuita do Aniversário";
    const onScroll = () => setShowStickyBar(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const yearOptions = useMemo(() => {
    const currentSolar = birthDate
      ? Number(getCurrentSolarYear(birthDate))
      : new Date().getFullYear();
    return [
      { value: String(currentSolar), label: `Último (${currentSolar})` },
      { value: String(currentSolar - 1), label: String(currentSolar - 1) },
      { value: String(currentSolar - 2), label: String(currentSolar - 2) },
      { value: String(currentSolar - 3), label: String(currentSolar - 3) },
    ];
  }, [birthDate]);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectPriority = (houseId: number) => {
    setSelectedNextHouse(houseId);
    setFormError(null);
    setQuizStep(2);
  };

  const handleToggleUnknownTime = (checked: boolean) => {
    setUnknownTime(checked);
    if (checked) setBirthTime("12:00");
  };

  const handleAdvanceFromNatal = () => {
    setFormError(null);
    const safeTime = unknownTime ? "12:00" : normalizeBirthTime(birthTime);
    if (!name.trim()) {
      setFormError("Digite seu primeiro nome para personalizar sua leitura.");
      return;
    }
    if (!birthDate) {
      setFormError("Informe sua data de nascimento.");
      return;
    }
    if (!safeTime) {
      setFormError(
        "Informe sua hora de nascimento ou marque “Não sei meu horário exato”."
      );
      return;
    }
    if (!birthCity.trim() || !birthCityValid) {
      setFormError("Selecione sua cidade de nascimento nas sugestões da lista.");
      return;
    }
    setQuizStep(3);
  };

  const handleUseSameAsBirthCity = () => {
    if (!birthCity || !birthCityValid || !birthCoords) {
      setFormError("Volte ao passo 2 e selecione sua cidade de nascimento.");
      return;
    }
    setFormError(null);
    setPastCity(birthCity);
    setPastCityValid(true);
    setPastCoords(birthCoords);
  };

  const handleAdvanceFromPastCity = () => {
    setFormError(null);
    if (!pastCity.trim() || !pastCityValid || !pastCoords) {
      setFormError(
        "Selecione na lista a cidade onde você passou esse aniversário."
      );
      return;
    }
    setQuizStep(4);
  };

  // Dispara cálculo REAL em paralelo: (1) Passado + (2) Próximo aniversário na cidade atual
  const handleSelectRadiusAndCalculate = async (
    radiusId: TravelRadiusOption["id"]
  ) => {
    setSelectedRadius(radiusId);
    setFormError(null);

    const safeTime = unknownTime ? "12:00" : normalizeBirthTime(birthTime);
    if (!birthDate || !safeTime || !birthCityValid || !pastCityValid || !pastCoords) {
      setFormError("Revise seus dados de nascimento e cidade do último aniversário.");
      setQuizStep(2);
      return;
    }

    sessionStorage.setItem("ps_natal_name", name.trim());
    sessionStorage.setItem("ps_natal_date", birthDate);
    sessionStorage.setItem("ps_natal_time", safeTime);
    sessionStorage.setItem("ps_natal_place", birthCity.trim());

    setCalculating(true);
    setQuizStep(5);
    setAuditResult(null);
    setValidatedMatch(false);

    try {
      const [ano, mes, dia] = birthDate.split("-");
      const dobFormatted = `${dia}/${mes}/${ano}`;
      const nextYear = getNextBirthdayYear(birthDate);

      const commonPayload = {
        name: name.trim(),
        place_of_birth: birthCity.trim(),
        dob: dobFormatted,
        time: safeTime,
      };

      const stayCity = pastCity.trim();
      const stayLat = pastCoords.lat;
      const stayLon = pastCoords.lon;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);

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
          pastData?.error ||
            "Não conseguimos calcular agora. Confira os dados e tente novamente."
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
        nextStayHouse,
        nextYear,
        usedApproximateTime: unknownTime,
      });
    } catch (err: any) {
      setQuizStep(4);
      if (err?.name === "AbortError") {
        setFormError(
          "O servidor astronômico estava acordando. Toque na sua opção novamente — agora o cálculo responde rápido!"
        );
      } else {
        setFormError(err?.message || "Erro ao calcular sua Casa. Tente novamente.");
      }
    } finally {
      setCalculating(false);
    }
  };

  const handleGoToPackage = (pkg: "1" | "3" | "full") => {
    const targetReturn = selectedNextHouse
      ? `/?mode=futuro&path=casa&house=${selectedNextHouse}`
      : "/?mode=futuro";
    navigate(`/credits?pkg=${pkg}&returnTo=${encodeURIComponent(targetReturn)}`);
  };

  const handleShareBoardingPass = async () => {
    if (!auditResult || !pastShowcase) return;
    const text = `Fiz o teste grátis do meu aniversário de ${auditResult.pastYear} em ${auditResult.pastCity} no Protocolo Solar e caiu na Casa ${pastShowcase.numberLabel} (${pastShowcase.title})! Testa onde você passou o seu: https://protocolosolar.com.br/v3`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Meu Bilhete Cósmico • Protocolo Solar",
          text,
          url: "https://protocolosolar.com.br/v3",
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2600);
      }
    } catch {
      // Usuário cancelou o diálogo nativo
    }
  };

  const pastShowcase = auditResult
    ? HOUSES_SHOWCASE.find((h) => h.id === auditResult.pastHouse) ||
      HOUSES_SHOWCASE[0]
    : null;
  const pastTheme = auditResult
    ? houseThemes[auditResult.pastHouse] || houseThemes[1]
    : null;
  const nextStayShowcase = auditResult?.nextStayHouse
    ? HOUSES_SHOWCASE.find((h) => h.id === auditResult.nextStayHouse) || null
    : null;
  const nextStayDefense = auditResult?.nextStayHouse
    ? HOME_CITY_DEFENSE[auditResult.nextStayHouse] || HOME_CITY_DEFENSE[1]
    : auditResult
    ? HOME_CITY_DEFENSE[auditResult.pastHouse] || HOME_CITY_DEFENSE[1]
    : null;
  const goalShowcase =
    HOUSES_SHOWCASE.find((h) => h.id === selectedNextHouse) || HOUSES_SHOWCASE[1];
  const radiusObj =
    TRAVEL_RADIUS_OPTIONS.find((r) => r.id === selectedRadius) ||
    TRAVEL_RADIUS_OPTIONS[1];

  return (
    <div className="min-h-screen bg-[#050507] text-[#F8FAFC] font-ps-ui overflow-x-hidden pb-28 lg:pb-16 selection:bg-[#F5B041]/25">
      {/* Ambient Solar Light Mesh */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 42% at 50% -6%, rgba(245,176,65,0.16) 0%, rgba(10,11,16,0.45) 55%, transparent 80%)",
        }}
      />

      {/* TOP BAR + SELETOR A/B */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050507]/88 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link to="/v3" className="flex items-center gap-2.5 shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <defs>
                <radialGradient id="v3SunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF3D1" />
                  <stop offset="55%" stopColor="#F5B041" />
                  <stop offset="100%" stopColor="#E67E22" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="14" stroke="rgba(245,176,65,0.35)" strokeWidth="1" />
              <circle cx="16" cy="16" r="9" stroke="rgba(245,176,65,0.6)" strokeWidth="1" strokeDasharray="2 3" />
              <circle cx="16" cy="16" r="6" fill="url(#v3SunGlow)" />
            </svg>
            <div className="leading-none">
              <span className="font-ps-display text-sm sm:text-base font-bold tracking-tight text-white block">
                Protocolo Solar
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5B041]">
                Prévia V3 • Quiz Funnel
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/casas"
              className="hidden sm:inline-flex items-center text-xs text-[#94A3B8] hover:text-white transition-colors px-2.5 py-1.5"
            >
              As 12 Casas
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] text-[11px] font-medium text-white/80 hover:text-white transition-all whitespace-nowrap shrink-0"
            >
              <span className="sm:hidden">V1</span>
              <span className="hidden sm:inline">Ver V1 Atual</span>
            </Link>
            {user ? (
              <Link
                to="/history"
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#F5B041]/15 border border-[#F5B041]/40 text-[#FFF3D1] text-[11px] font-semibold whitespace-nowrap shrink-0"
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/auth?returnTo=%2Fv3"
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-white text-[11px] font-semibold hover:bg-white/12 transition-all whitespace-nowrap shrink-0"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Barra de prévia dos 4 ângulos A/B */}
        <div className="border-t border-white/[0.05] bg-[#0A0B10]/90">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#94A3B8] shrink-0">
              Ângulo A/B:
            </span>
            {(Object.keys(V3_ANGLES) as V3AngleKey[]).map((key) => {
              const active = key === angleKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    if (key === "padrao") next.delete("angulo");
                    else next.set("angulo", key);
                    setSearchParams(next, { replace: true });
                  }}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
                    active
                      ? "bg-[#F5B041]/18 border-[#F5B041]/55 text-[#FFF3D1]"
                      : "bg-white/[0.03] border-white/10 text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {V3_ANGLES[key].label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* BANNER INDICAÇÃO VERIFICADA */}
      {affiliateRef && (
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-4">
          <div className="rounded-2xl border border-[#F5B041]/30 bg-[#F5B041]/[0.07] px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#FFF3D1]">
            <BadgeCheck className="w-4 h-4 text-[#F5B041] shrink-0" />
            <span>
              Indicação verificada •{" "}
              <strong className="font-semibold">
                {formatPartnerIdLabel(affiliateRef)}
              </strong>{" "}
              — 100% auditado pelo Protocolo Solar (mesmo preço oficial).
            </span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. HERO COMPACTO + QUIZ FUNNEL INTERATIVO DE 5 PASSOS ACIMA DA DOBRA  */}
      {/* ===================================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
        <motion.div
          key={`hero-${angleKey}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5B041]/30 bg-[#F5B041]/10 text-[#FFF3D1] font-mono text-[10px] uppercase tracking-[0.16em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B041]" />
            <span>{angle.badge}</span>
          </div>

          <h1
            className="font-ps-display font-bold text-white tracking-[-0.03em] leading-[1.06] max-w-3xl mx-auto mb-3.5"
            style={{ fontSize: "clamp(1.85rem, 4.8vw, 3.35rem)" }}
          >
            {angle.headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D1] via-[#F5B041] to-[#E67E22]">
              {angle.highlight}
            </span>
          </h1>

          <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-4">
            {angle.subcopy}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-[#94A3B8]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B041]" />
              Teste do passado 100% grátis
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5B041]" />
              Funciona mesmo sem a hora exata
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#F5B041]" />
              Destinos regionais ou exterior
            </span>
          </div>
        </motion.div>

        {/* CARD INTERATIVO DO QUIZ FUNNEL 5 PASSOS */}
        <section
          ref={quizRef}
          id="quiz-v3"
          aria-label="Quiz interativo do Protocolo Solar"
          className="rounded-[28px] border border-[#F5B041]/25 p-5 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)] relative overflow-hidden scroll-mt-28"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,20,30,0.94) 0%, rgba(10,11,16,0.98) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Barra de progresso 5 passos */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {quizStep > 1 && !calculating && (
                  <button
                    type="button"
                    onClick={() =>
                      setQuizStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : 1))
                    }
                    className="inline-flex items-center gap-1 text-xs text-[#94A3B8] hover:text-white pr-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                )}
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5B041]">
                  Passo {quizStep} de 5
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">
                {quizStep === 1 && "Prioridade do ano"}
                {quizStep === 2 && "Dados de nascimento"}
                {quizStep === 3 && "Validação do passado"}
                {quizStep === 4 && "Raio de viagem"}
                {quizStep === 5 && "Seu diagnóstico gratuito"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F5B041] to-[#E67E22] transition-all duration-300"
                style={{ width: `${(quizStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* PASSO 1: PERGUNTA DECISORA ACIMA DA DOBRA */}
            {quizStep === 1 && (
              <motion.div
                key="step-1"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
              >
                <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white leading-snug mb-1.5">
                  Qual área da sua vida é prioridade nº 1 nos próximos 12 meses?
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mb-5">
                  Toque em uma opção abaixo — em 2 minutos mostramos grátis o
                  que seu último aniversário ativou e o contraste para o próximo.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {V3_PRIORITY_OPTIONS.map((opt) => {
                    const active = selectedNextHouse === opt.houseId;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPriority(opt.houseId)}
                        className={`group min-h-[76px] p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                          active
                            ? "border-[#F5B041]/75 bg-[#F5B041]/12"
                            : "border-white/10 bg-white/[0.03] hover:border-[#F5B041]/50 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-bold block mb-0.5">
                            {opt.tag}
                          </span>
                          <span className="font-ps-display text-sm sm:text-base font-bold text-white block leading-snug">
                            {opt.title}
                          </span>
                          <span className="text-xs text-[#94A3B8] block mt-0.5 leading-snug">
                            {opt.subtitle}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#F5B041] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PASSO 2: DADOS NATAIS + "NÃO SEI MEU HORÁRIO EXATO" */}
            {quizStep === 2 && (
              <motion.div
                key="step-2"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
                    Seus dados de nascimento
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    Usamos as tabelas astronômicas Swiss Ephemeris para calcular
                    o minuto exato da sua virada solar. Sem criar conta agora.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-1.5">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex.: Rafael"
                      className="w-full min-h-[48px] rounded-xl border border-white/15 bg-[#050507]/90 px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5B041]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-1.5">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBirthDate(val);
                        if (val) setTargetYear(getCurrentSolarYear(val));
                      }}
                      className="w-full min-h-[48px] rounded-xl border border-white/15 bg-[#050507]/90 px-4 py-3 text-base text-white focus:outline-none focus:border-[#F5B041] [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-1.5">
                      Hora de Nascimento (Certidão)
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      disabled={unknownTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full min-h-[48px] rounded-xl border border-white/15 bg-[#050507]/90 px-4 py-3 text-base text-white disabled:opacity-50 focus:outline-none focus:border-[#F5B041] [color-scheme:dark]"
                    />
                    <label className="mt-2.5 flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={unknownTime}
                        onChange={(e) => handleToggleUnknownTime(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded accent-[#F5B041] cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-[#CBD5E1] leading-snug">
                        <strong>Não sei meu horário exato</strong> (usar 12:00 aproximado)
                      </span>
                    </label>
                    {unknownTime && (
                      <p className="mt-2 rounded-xl border border-[#F5B041]/25 bg-[#F5B041]/[0.07] px-3 py-2 text-[11px] text-[#FFF3D1]/85 leading-relaxed">
                        Sem a hora exata da certidão, a cúspide do Ascendente pode
                        variar alguns graus, mas a posição do Sol no horizonte já
                        direciona a tendência da sua cidade.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-1.5">
                      Cidade Onde Você Nasceu
                    </label>
                    <CityAutocomplete
                      value={birthCity}
                      onChange={(val, valid, coords) => {
                        setBirthCity(val);
                        setBirthCityValid(valid);
                        if (coords) setBirthCoords(coords);
                      }}
                      placeholder="Digite e toque na cidade da lista"
                      className="w-full min-h-[48px] rounded-xl border border-white/15 bg-[#050507]/90 px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5B041]"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 flex items-start gap-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAdvanceFromNatal}
                  className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5B041] to-[#E67E22] hover:brightness-110 active:scale-[0.98] text-[#050507] font-ps-display font-bold text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>Continuar para o Teste do Passado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* PASSO 3: VALIDAÇÃO REVERSA GRATUITA (CIDADE DO ÚLTIMO ANIVERSÁRIO) */}
            {quizStep === 3 && (
              <motion.div
                key="step-3"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
                    Onde você passou seu último aniversário?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    Vamos revelar grátis qual Casa governou esse ano — para você
                    conferir na prática se bateu com o que realmente viveu.
                  </p>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
                    Escolha o ano para validar
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {yearOptions.map((opt) => {
                      const active = targetYear === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setTargetYear(opt.value)}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            active
                              ? "bg-[#F5B041]/20 border-[#F5B041]/70 text-[#FFF3D1]"
                              : "bg-white/[0.03] border-white/12 text-[#94A3B8] hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold">
                      Cidade onde você estava no aniversário de {targetYear}
                    </label>
                    {birthCityValid && (
                      <button
                        type="button"
                        onClick={handleUseSameAsBirthCity}
                        className="text-xs font-semibold text-[#F5B041] hover:underline"
                      >
                        Passei na minha cidade natal →
                      </button>
                    )}
                  </div>
                  <CityAutocomplete
                    value={pastCity}
                    onChange={(val, valid, coords) => {
                      setPastCity(val);
                      setPastCityValid(valid);
                      if (coords) setPastCoords(coords);
                    }}
                    placeholder="Ex.: São Paulo, Rio de Janeiro, Curitiba..."
                    className="w-full min-h-[48px] rounded-xl border border-white/15 bg-[#050507]/90 px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5B041]"
                  />
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 flex items-start gap-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAdvanceFromPastCity}
                  className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5B041] to-[#E67E22] hover:brightness-110 active:scale-[0.98] text-[#050507] font-ps-display font-bold text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>Avançar para Raio de Viagem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* PASSO 4: RAIO DE VIAGEM (ACOLHE QUEM NÃO PODE VIAJAR LONGE) */}
            {quizStep === 4 && (
              <motion.div
                key="step-4"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
                    Até onde você toparia ir no seu próximo aniversário?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    Toque na sua realidade atual para calcularmos grátis o seu
                    passado + o contraste do próximo ciclo.
                  </p>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 flex items-start gap-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRAVEL_RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectRadiusAndCalculate(opt.id)}
                      className="group min-h-[82px] p-4 rounded-2xl border border-white/12 bg-white/[0.03] hover:border-[#F5B041]/70 hover:bg-[#F5B041]/[0.08] active:scale-[0.98] text-left transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5B041] font-bold block mb-0.5">
                          {opt.badge}
                        </span>
                        <span className="font-ps-display text-sm sm:text-base font-bold text-white block">
                          {opt.title}
                        </span>
                        <span className="text-xs text-[#94A3B8] block mt-0.5 leading-snug">
                          {opt.subtitle}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#F5B041] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PASSO 5: REVELAÇÃO DE CONTRASTE DUPLO + BILHETE CÓSMICO + CIDADES BLOQUEADAS */}
            {quizStep === 5 && (
              <motion.div
                key="step-5"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {calculating ? (
                  <div className="py-12 text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-[#F5B041] animate-spin mx-auto" />
                    <div>
                      <h3 className="font-ps-display text-xl font-bold text-white mb-1">
                        Calculando sua Revolução Solar real...
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8]">
                        Consultando efemérides astronômicas (Swiss Ephemeris) para{" "}
                        <strong className="text-white">{pastCity.split(",")[0]}</strong>.
                      </p>
                    </div>
                  </div>
                ) : auditResult && pastShowcase && pastTheme && nextStayDefense ? (
                  <div className="space-y-6">
                    {/* BLOCO A: VALIDAÇÃO REAL DO PASSADO */}
                    <div
                      className="rounded-3xl border p-5 sm:p-7 relative overflow-hidden"
                      style={{
                        borderColor: `${pastTheme.themeColor}55`,
                        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${pastTheme.themeColor}22, rgba(5,5,7,0.96) 75%)`,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.16em] border"
                          style={{
                            color: pastTheme.themeColor,
                            backgroundColor: `${pastTheme.themeColor}18`,
                            borderColor: `${pastTheme.themeColor}45`,
                          }}
                        >
                          Prova Real Gratuita • Aniversário {auditResult.pastYear}
                        </span>
                        <span className="font-mono text-[11px] text-white/65">
                          📍 {auditResult.pastCity}
                          {auditResult.sunSign ? ` • Sol em ${auditResult.sunSign}` : ""}
                        </span>
                      </div>

                      <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                        Casa {pastShowcase.numberLabel} — {pastShowcase.title}
                      </h3>

                      <p className="text-sm text-white/85 leading-relaxed mb-5">
                        {pastShowcase.cycleFocus}
                      </p>

                      {auditResult.usedApproximateTime && (
                        <div className="mb-4 rounded-xl border border-[#F5B041]/30 bg-[#F5B041]/10 px-3.5 py-2 text-xs text-[#FFF3D1]">
                          Cálculo feito com horário aproximado (12:00). Atualize
                          com a hora da certidão quando quiser maior precisão.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                        {pastShowcase.inPractice.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-white/10 bg-black/45 p-3.5"
                          >
                            <span
                              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] block mb-1"
                              style={{ color: pastTheme.themeColor }}
                            >
                              0{idx + 1} • {item.area}
                            </span>
                            <p className="text-xs text-white/80 leading-relaxed">
                              {item.example}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Confirmação do "Momento Aha!" */}
                      <div className="rounded-2xl border border-white/12 bg-black/45 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-medium text-white text-center sm:text-left">
                          Bateu com o que você viveu (ou deixou de aproveitar) em{" "}
                          {auditResult.pastYear}?
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setValidatedMatch(true)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              validatedMatch
                                ? "bg-emerald-500 text-[#050507]"
                                : "bg-[#F5B041] text-[#050507] hover:brightness-110"
                            }`}
                          >
                            {validatedMatch ? "✓ Validado!" : "Sim, bateu muito!"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuizStep(3)}
                            className="px-3 py-2 rounded-xl border border-white/15 text-xs text-white/80 hover:bg-white/10"
                          >
                            Testar outro ano
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BLOCO B: CONTRASTE INEVITÁVEL — FICAR PARADO vs. 3 CIDADES BLOQUEADAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Lado 1: Se ficar na cidade atual + Manual de Defesa */}
                      <div className="rounded-3xl border border-white/12 bg-[#0A0B10]/95 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8] font-bold block mb-2">
                            Se você ficar em {auditResult.pastCity} em{" "}
                            {auditResult.nextYear}
                          </span>
                          <h4 className="font-ps-display text-xl font-bold text-white mb-2">
                            {nextStayShowcase
                              ? `Ativa a Casa ${nextStayShowcase.numberLabel} — ${nextStayShowcase.title}`
                              : `Manual de Defesa de ${auditResult.pastCity}`}
                          </h4>
                          {nextStayShowcase && (
                            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                              {nextStayShowcase.cycleFocus}
                            </p>
                          )}

                          <div className="space-y-2.5 text-xs leading-relaxed">
                            <div className="rounded-xl bg-white/[0.03] border border-emerald-500/20 p-3">
                              <strong className="text-emerald-300 flex items-center gap-1.5 mb-1">
                                <Shield className="w-3.5 h-3.5" />
                                Manual de Defesa • O que aproveitar:
                              </strong>
                              <span className="text-white/80">
                                {nextStayDefense.strength}
                              </span>
                            </div>
                            <div className="rounded-xl bg-white/[0.03] border border-amber-500/20 p-3">
                              <strong className="text-amber-300 block mb-1">
                                Ponto cego para evitar se ficar parado:
                              </strong>
                              <span className="text-white/80">
                                {nextStayDefense.blindSpot}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lado 2: 3 Cidades Bloqueadas para a Casa Escolhida */}
                      <div className="rounded-3xl border-2 border-[#F5B041]/60 bg-gradient-to-b from-[#161C2C] to-[#0A0B10] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-[0_18px_50px_rgba(245,176,65,0.16)]">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5B041] font-bold block mb-2">
                            Seu Próximo Aniversário ({auditResult.nextYear}) •{" "}
                            {radiusObj.badge}
                          </span>
                          <h4 className="font-ps-display text-xl font-bold text-white mb-1.5">
                            Cidades para ativar a Casa {goalShowcase.numberLabel}
                          </h4>
                          <p className="text-xs text-[#CBD5E1] mb-4">
                            Objetivo escolhido:{" "}
                            <strong className="text-white">
                              {goalShowcase.title}
                            </strong>
                            . Destrave suas coordenadas exatas agora:
                          </p>

                          <div className="space-y-2.5 mb-5">
                            {[
                              { rank: "#1 Destino Principal", match: "98%" },
                              { rank: "#2 Opção Acessível", match: "94%" },
                              { rank: "#3 Rota Alternativa", match: "91%" },
                            ].map((slot) => (
                              <div
                                key={slot.rank}
                                className="rounded-xl border border-white/10 bg-black/45 px-3.5 py-2.5 flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Lock className="w-3.5 h-3.5 text-[#F5B041] shrink-0" />
                                  <div className="min-w-0">
                                    <span className="text-xs font-semibold text-white block">
                                      {slot.rank}
                                    </span>
                                    <span className="text-[11px] text-white/40 blur-[4px] select-none block">
                                      Cidade Recomendada • País
                                    </span>
                                  </div>
                                </div>
                                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5B041]/15 text-[#F5B041] shrink-0">
                                  {slot.match}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleGoToPackage("1")}
                            className="w-full min-h-[50px] px-4 py-3 rounded-2xl bg-gradient-to-r from-[#F5B041] to-[#E67E22] hover:brightness-110 active:scale-[0.98] text-[#050507] font-ps-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(245,176,65,0.3)]"
                          >
                            <span>
                              Destravar Casa {goalShowcase.numberLabel} por R$ 19,90
                            </span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollToSection(pricingRef)}
                            className="w-full py-2 text-xs font-semibold text-[#F5B041] hover:text-[#FFF3D1] transition-colors"
                          >
                            Ou comparar 3 cidades (R$ 49,90) / Todas as 12 Casas (R$ 99,90) →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BLOCO C: BILHETE DE EMBARQUE CÓSMICO (VIRAL STORIES 9:16) */}
                    <div className="rounded-3xl border border-[#F5B041]/30 bg-gradient-to-r from-[#0F1524] via-[#0A0B10] to-[#141118] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-16 rounded-xl border border-[#F5B041]/50 bg-[#050507] flex flex-col items-center justify-center shrink-0">
                          <span className="font-mono text-[8px] uppercase text-[#F5B041]">
                            SOLAR
                          </span>
                          <span className="font-ps-display text-lg font-bold text-white leading-none">
                            {pastShowcase.numberLabel}
                          </span>
                          <span className="font-mono text-[8px] text-white/50">
                            {auditResult.pastYear}
                          </span>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-bold block">
                            Bilhete de Embarque Cósmico
                          </span>
                          <p className="font-ps-display text-sm sm:text-base font-bold text-white">
                            {name} • {auditResult.pastCity} → Casa{" "}
                            {pastShowcase.numberLabel}
                          </p>
                          <p className="text-xs text-[#94A3B8]">
                            Compartilhe seu resultado real e desafie amigos a
                            testarem o último aniversário grátis.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleShareBoardingPass}
                        className="shrink-0 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#F5B041]/45 bg-[#F5B041]/12 hover:bg-[#F5B041] text-[#FFF3D1] hover:text-[#050507] text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-2 transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>
                          {copiedPass ? "Copiado!" : "Compartilhar Resultado"}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </section>

      {/* ===================================================================== */}
      {/* 2. VITRINE DAS 12 CASAS (CARROSSEL SNAP MOBILE / GRID DESKTOP)        */}
      {/* ===================================================================== */}
      <section
        ref={housesRef}
        id="escolher-casa-v3"
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
              As 12 Casas em Linguagem Real
            </span>
            <h2 className="font-ps-display text-2xl sm:text-4xl font-bold text-white leading-tight mb-2">
              Qual Casa faz sentido para o seu próximo ano?
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Sem astrologuês e sem promessa mágica. Escolha um card para
              pré-selecionar seu objetivo.
            </p>
          </div>
          <Link
            to="/casas"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5B041] hover:text-[#FFF3D1]"
          >
            <span>Abrir vitrine completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0">
          {HOUSES_SHOWCASE.map((house) => {
            const Icon = ICON_MAP[house.iconKey];
            const themeHex = houseThemes[house.id]?.themeColor || "#F5B041";
            const elStyle = ELEMENT_STYLES[house.element];
            const isSelected = selectedNextHouse === house.id;

            return (
              <div
                key={house.id}
                onClick={() => setSelectedNextHouse(house.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedNextHouse(house.id);
                  }
                }}
                className={`snap-start shrink-0 w-[84vw] sm:w-[340px] md:w-auto rounded-[24px] p-5 sm:p-6 border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#111927] border-[#F5B041] shadow-[0_14px_40px_rgba(245,176,65,0.2)]"
                    : "bg-[#0A0B10]/90 border-white/[0.08] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${themeHex}18`,
                          borderColor: `${themeHex}45`,
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: themeHex }} />
                      </div>
                      <span
                        className="font-mono text-xs font-bold uppercase tracking-[0.16em]"
                        style={{ color: themeHex }}
                      >
                        Casa {house.numberLabel}
                      </span>
                    </div>

                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border"
                      style={{
                        color: elStyle.text,
                        backgroundColor: elStyle.bg,
                        borderColor: elStyle.border,
                      }}
                    >
                      {elStyle.label}
                    </span>
                  </div>

                  <h3 className="font-ps-display text-lg font-bold text-white leading-snug mb-3">
                    {house.title}
                  </h3>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 mb-2.5">
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.16em] font-bold block mb-1"
                      style={{ color: themeHex }}
                    >
                      Para quem é
                    </span>
                    <p className="text-xs text-white/90 leading-snug">
                      {house.profile}
                    </p>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {house.cycleFocus}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNextHouse(house.id);
                      scrollToSection(pricingRef);
                    }}
                    className={`text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                      isSelected ? "text-[#F5B041]" : "text-white/75 hover:text-[#F5B041]"
                    }`}
                  >
                    {isSelected ? "✓ Casa Selecionada" : "Quero esta Casa →"}
                  </button>
                  <Link
                    to={`/casas/${house.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-[#94A3B8] hover:text-white underline"
                  >
                    Ver completa
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. ESCADA DE PREÇOS CRISTALINA (R$ 19,90 / R$ 49,90 / R$ 99,90)       */}
      {/* ===================================================================== */}
      <section
        ref={pricingRef}
        id="planos-v3"
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 scroll-mt-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
            Escada Transparente • Pagamento Único
          </span>
          <h2 className="font-ps-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            Escolha exatamente o que você precisa
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Todas as opções já incluem{" "}
            <strong className="text-white">todas as 8 áreas da vida abertas</strong>.
            A única diferença é quantas Casas ou destinos você quer revelar.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F5B041]/45 bg-[#F5B041]/12 text-xs text-[#FFF3D1]">
            <Target className="w-3.5 h-3.5 text-[#F5B041]" />
            <span>
              Objetivo atual:{" "}
              <strong>
                Casa {goalShowcase.numberLabel} — {goalShowcase.title}
              </strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* R$ 19,90 */}
          <div className="rounded-3xl border border-white/12 bg-[#0A0B10]/95 p-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8] font-bold block mb-3">
                Entrada • 1 Consulta
              </span>
              <h3 className="font-ps-display text-2xl font-bold text-white mb-1.5">
                1 Casa ou 1 Cidade
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-5">
                Para revelar as melhores cidades de 1 Casa escolhida ou analisar
                1 destino específico para o seu próximo aniversário.
              </p>

              <div className="flex items-baseline gap-1 pb-5 mb-5 border-b border-white/10">
                <span className="text-xs text-[#F5B041] font-bold">R$</span>
                <span className="font-ps-display text-5xl font-bold text-white">19</span>
                <span className="text-sm text-white/70">,90</span>
                <span className="text-[11px] text-[#94A3B8] ml-2">pagamento único</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-white/85 mb-7">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Libera 1 Casa escolhida ou 1 Cidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Todas as 8 áreas da vida abertas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Rotas no Brasil e no mundo para essa Casa</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleGoToPackage("1")}
              className="w-full min-h-[50px] py-3.5 rounded-2xl border border-[#F5B041]/45 bg-[#F5B041]/12 hover:bg-[#F5B041] text-[#FFF3D1] hover:text-[#050507] font-ps-ui text-xs font-bold uppercase tracking-[0.15em] transition-all"
            >
              Escolher 1 Consulta (R$ 19,90)
            </button>
          </div>

          {/* R$ 49,90 */}
          <div className="rounded-3xl border-2 border-[#F5B041]/80 bg-gradient-to-b from-[#151A28] to-[#0A0B10] p-7 flex flex-col justify-between relative shadow-[0_22px_60px_rgba(245,176,65,0.18)] md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F5B041] text-[#050507] font-mono text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap">
              Mais Escolhido • Comparador
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5B041] font-bold block mb-3">
                3 Consultas • Comparar Destinos
              </span>
              <h3 className="font-ps-display text-2xl font-bold text-white mb-1.5">
                Comparador de 3 Cidades
              </h3>
              <p className="text-xs text-[#CBD5E1] leading-relaxed mb-5">
                Teste e compare até 3 cidades que cabem no seu orçamento ou
                desbloqueie 3 Casas completas antes de comprar passagem.
              </p>

              <div className="flex items-baseline gap-1 pb-5 mb-5 border-b border-white/10">
                <span className="text-xs text-[#F5B041] font-bold">R$</span>
                <span className="font-ps-display text-5xl font-bold text-[#FFF3D1]">49</span>
                <span className="text-sm text-[#FFF3D1]/70">,90</span>
                <span className="text-[11px] text-[#94A3B8] ml-2">pagamento único</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90 mb-7">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>3 créditos livres para Cidades ou Casas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Todas as 8 áreas da vida abertas em cada uma</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Economia real frente a 3 consultas avulsas</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleGoToPackage("3")}
              className="w-full min-h-[52px] py-3.5 rounded-2xl bg-gradient-to-r from-[#F5B041] to-[#E67E22] hover:brightness-110 active:scale-[0.98] text-[#050507] font-ps-ui text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-[0_10px_30px_rgba(245,176,65,0.3)]"
            >
              Comparar 3 Destinos (R$ 49,90)
            </button>
          </div>

          {/* R$ 99,90 */}
          <div className="rounded-3xl border border-[#F5B041]/35 bg-[#0A0B10]/95 p-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFF3D1] font-bold block mb-3">
                Acesso Total • 12 Casas
              </span>
              <h3 className="font-ps-display text-2xl font-bold text-white mb-1.5">
                Mapa Completo (12 Casas)
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-5">
                Desbloqueia de uma só vez todas as 12 Casas do seu próximo
                aniversário com todas as cidades recomendadas no mundo.
              </p>

              <div className="flex items-baseline gap-1 pb-5 mb-5 border-b border-white/10">
                <span className="text-xs text-[#F5B041] font-bold">R$</span>
                <span className="font-ps-display text-5xl font-bold text-[#F5B041]">99</span>
                <span className="text-sm text-white/70">,90</span>
                <span className="text-[11px] text-[#94A3B8] ml-2">pagamento único</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-white/85 mb-7">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Todas as 12 Casas do seu ano liberadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Todas as 8 áreas da vida nas 12 Casas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B041] shrink-0 mt-0.5" />
                  <span>Visão 360º completa para escolher o destino ideal</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleGoToPackage("full")}
              className="w-full min-h-[50px] py-3.5 rounded-2xl border border-[#F5B041]/55 bg-[#F5B041]/15 hover:bg-[#F5B041] text-[#FFF3D1] hover:text-[#050507] font-ps-ui text-xs font-bold uppercase tracking-[0.15em] transition-all"
            >
              Liberar Todas as 12 Casas (R$ 99,90)
            </button>
          </div>
        </div>

        {/* SELO TÉCNICO SWISS EPHEMERIS */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#F5B041] shrink-0" />
          <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            <strong className="text-white">
              Cálculo astronômico de precisão (Swiss Ephemeris):
            </strong>{" "}
            não é signo solar genérico de portal — calculamos a coordenada
            geográfica exata do minuto da sua virada solar. Pagamento seguro via
            Pix ou Cartão no Mercado Pago.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. PARCEIROS (COMPLIANCE CONAR) & FAQ                                 */}
      {/* ===================================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-16 space-y-12">
        <div className="rounded-3xl border border-[#F5B041]/25 bg-[#0A0B10]/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block">
              Parceiros & Criadores • 20% no Pix
            </span>
            <h3 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
              Protocolo transparente: Sentir → Medir → Recomendar
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Nossos parceiros testam primeiro o próprio Aniversário Passado,
              sinalizam <strong className="text-white">#publi</strong> conforme o
              CONAR e nunca fazem promessas mágicas. Quem entra pelo link paga o
              mesmo preço oficial e o parceiro recebe 20% direto no Pix.
            </p>
          </div>
          <Link
            to="/parceiros"
            className="shrink-0 min-h-[48px] px-5 py-3 rounded-xl border border-[#F5B041]/45 bg-[#F5B041]/12 hover:bg-[#F5B041] text-[#FFF3D1] hover:text-[#050507] text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-all"
          >
            <span>Conhecer Programa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
          <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white text-center mb-6">
            Dúvidas frequentes
          </h2>
          <Accordion
            type="single"
            collapsible
            defaultValue="v3-faq-free-map"
            className="space-y-3"
          >
            {V3_FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-white/10 bg-[#0A0B10]/90 rounded-2xl px-5 overflow-hidden"
              >
                <AccordionTrigger className="text-white hover:text-[#F5B041] hover:no-underline py-4 font-ps-display text-base sm:text-lg text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* STICKY MOBILE BAR NA ZONA DO POLEGAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-3 left-3 right-3 z-50 lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div
              className="rounded-2xl border border-[#F5B041]/40 px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
              style={{
                background: "rgba(10, 11, 16, 0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {auditResult
                    ? "Destrave seu próximo ano"
                    : "Teste seu passado grátis"}
                </p>
                <p className="text-[10px] text-[#94A3B8] truncate">
                  {auditResult
                    ? "Planos a partir de R$ 19,90"
                    : "Quiz rápido em 5 passos"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  scrollToSection(auditResult ? pricingRef : quizRef)
                }
                className="shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-[#F5B041] active:scale-[0.98] text-[#050507] text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-1.5"
              >
                <span>{auditResult ? "Ver Planos" : "Fazer Quiz"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
