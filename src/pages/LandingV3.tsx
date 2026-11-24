import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Eye,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Moon,
  Plane,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
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

type ReportModalId = "radar" | "areas" | "ticket" | null;

const LandingV3 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const consultSectionRef = useRef<HTMLElement | null>(null);
  const nextCycleSectionRef = useRef<HTMLElement | null>(null);
  const plansSectionRef = useRef<HTMLElement | null>(null);

  // Tema visual: padrão Claro Editorial + Azul Profundo + Dourado (com opção Azul Noturno)
  const initialTheme = searchParams.get("tema") === "escuro" ? "dark" : "light";
  const [themeMode, setThemeMode] = useState<"light" | "dark">(initialTheme);
  const isLight = themeMode === "light";

  // Ângulo A/B via ?angulo=fitness|carreira|cetico
  const rawAngle = (searchParams.get("angulo") || "padrao").toLowerCase();
  const activeAngleKey: V3AngleKey =
    rawAngle === "fitness" || rawAngle === "carreira" || rawAngle === "cetico"
      ? rawAngle
      : "padrao";
  const angle = V3_ANGLES[activeAngleKey];

  // Rastreamento de parceiro ?ref=CODIGO
  const [partnerRef, setPartnerRef] = useState<string | null>(null);
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) saveStoredAffiliateRef(refParam);
    setPartnerRef(getStoredAffiliateRef());
  }, [searchParams]);

  // 1. Hero Boarding Pass: rotação suave entre cidades ilustrativas
  const [heroDestIdx, setHeroDestIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion || heroPaused) return;
    const timer = window.setInterval(() => {
      setHeroDestIdx((prev) => (prev + 1) % HERO_BOARDING_DESTINATIONS.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, heroPaused]);
  const activeHeroDest = HERO_BOARDING_DESTINATIONS[heroDestIdx];

  // 2. Demonstração interativa: personagem fixo mudando de cidade
  const [demoCityId, setDemoCityId] = useState<string>(DEMO_CHARACTER_CITIES[0].id);
  const activeDemoCity = useMemo(
    () =>
      DEMO_CHARACTER_CITIES.find((c) => c.id === demoCityId) ||
      DEMO_CHARACTER_CITIES[0],
    [demoCityId]
  );

  // 3. Consulta Gratuita em 4 etapas curtas (inline na página)
  const [consultOpen, setConsultOpen] = useState(true);
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
  const [validatedMatch, setValidatedMatch] = useState<boolean | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Captura opcional de e-mail APÓS mostrar o resultado gratuito
  const [copyEmail, setCopyEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  // 4. Passagem para o próximo aniversário (prioridade + raio)
  const [selectedNextHouse, setSelectedNextHouse] = useState<number>(
    angle.featuredHouseId || 10
  );
  const [selectedRadius, setSelectedRadius] =
    useState<TravelRadiusOption["id"]>("300km");

  useEffect(() => {
    if (angle.featuredHouseId) setSelectedNextHouse(angle.featuredHouseId);
  }, [angle.featuredHouseId]);

  // 5. Modal de ampliação das páginas reais do relatório
  const [openReportModal, setOpenReportModal] = useState<ReportModalId>(null);

  // Sticky bar mobile após rolar a primeira dobra
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 540);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const availableYears = useMemo(() => {
    const current = new Date().getFullYear();
    return [current, current - 1, current - 2, current - 3, current - 4, current - 5];
  }, []);

  const scrollToConsult = () => {
    setConsultOpen(true);
    setTimeout(() => {
      consultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const scrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAngleSwitch = (nextKey: V3AngleKey) => {
    const next = new URLSearchParams(searchParams);
    if (nextKey === "padrao") next.delete("angulo");
    else next.set("angulo", nextKey);
    setSearchParams(next, { replace: true });
  };

  const toggleThemeMode = () => {
    const nextTheme = isLight ? "dark" : "light";
    setThemeMode(nextTheme);
    const next = new URLSearchParams(searchParams);
    if (nextTheme === "light") next.delete("tema");
    else next.set("tema", "escuro");
    setSearchParams(next, { replace: true });
  };

  const handleNextStep1 = () => {
    setFormError(null);
    if (!birthDate) {
      setFormError("Informe sua data de nascimento para continuar.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setFormError(null);
    if (!unknownTime && !birthTime) {
      setFormError("Informe seu horário ou marque “Não sei meu horário exato”.");
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    setFormError(null);
    if (!birthCity.trim() || (!birthCityValid && !birthCity.includes(","))) {
      setFormError("Digite sua cidade de nascimento e toque em uma sugestão da lista.");
      return;
    }
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
      setFormError(
        "Selecione na lista a cidade onde você passou aquele aniversário."
      );
      return;
    }

    setCalculating(true);
    setValidatedMatch(null);
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
        returnDate: pastData.return_date || null,
        nextStayHouse,
        nextYear,
        usedApproximateTime: unknownTime,
      });
      setStep(5);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setFormError(
          "O servidor astronômico estava acordando. Toque em “Ver minha leitura gratuita” novamente — agora responde em segundos."
        );
      } else {
        setFormError(err?.message || "Erro ao calcular sua leitura. Tente novamente.");
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
      // ignore storage quota errors
    }
    setEmailSaved(true);
  };

  const handleGoToPackage = (pkg: "1" | "3" | "full") => {
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
  const goalShowcase =
    HOUSES_SHOWCASE.find((h) => h.id === selectedNextHouse) || HOUSES_SHOWCASE[9];

  const handleShareBoardingPass = async () => {
    if (!auditResult || !pastShowcase) return;
    const text = `Consultei gratuitamente meu aniversário de ${auditResult.pastYear} em ${auditResult.pastCity} no Protocolo Solar: Sol na Casa ${pastShowcase.numberLabel} (${pastShowcase.title}). Teste um aniversário que você já viveu: https://protocolosolar.com.br/v3`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Minha Leitura Gratuita • Protocolo Solar",
          text,
          url: "https://protocolosolar.com.br/v3",
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2600);
      }
    } catch {
      // cancelado pelo usuário
    }
  };

  // Tokens adaptativos Claro Editorial vs. Azul Noturno
  const pageBg = isLight
    ? "bg-[#F7F4EC] text-[#0B192C]"
    : "bg-[#060C18] text-[#F8FAFC]";
  const headerBg = isLight
    ? "bg-[#F7F4EC]/92 border-[#0B192C]/10"
    : "bg-[#060C18]/90 border-white/10";
  const surfaceCard = isLight
    ? "bg-white border-[#0B192C]/10 shadow-[0_18px_50px_rgba(11,25,44,0.07)]"
    : "bg-[#0B1629]/90 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]";
  const mutedText = isLight ? "text-[#475569]" : "text-[#94A3B8]";
  const bodyText = isLight ? "text-[#1E293B]" : "text-[#CBD5E1]";
  const headingText = isLight ? "text-[#0B192C]" : "text-white";
  const goldAccentText = isLight ? "text-[#9A6F11]" : "text-[#F5B041]";
  const goldBadgeClass = isLight
    ? "border-[#C9A227]/40 bg-[#C9A227]/12 text-[#7C580B]"
    : "border-[#F5B041]/35 bg-[#F5B041]/12 text-[#FFF3D1]";
  const primaryBtnClass = isLight
    ? "bg-[#0B192C] hover:bg-[#132847] text-[#FFF8E7] shadow-[0_14px_34px_rgba(11,25,44,0.22)]"
    : "bg-gradient-to-r from-[#F5B041] to-[#E67E22] hover:brightness-105 text-[#050507] shadow-[0_14px_34px_rgba(245,176,65,0.28)]";

  return (
    <div
      className={`min-h-screen font-ps-ui overflow-x-hidden pb-28 lg:pb-16 transition-colors duration-300 selection:bg-[#C9A227]/25 ${pageBg}`}
    >
      {/* HEADER PRINCIPAL */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-2">
          <Link to="/v3" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0B192C] border border-[#C9A227]/50 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#E5C158]" />
            </div>
            <div className="leading-none min-w-0">
              <span className={`font-ps-display text-sm sm:text-base font-bold tracking-tight block truncate ${headingText}`}>
                Protocolo Solar
              </span>
              <span className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] sm:tracking-[0.18em] block truncate ${goldAccentText}`}>
                Revolução Solar
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <a href="#como-funciona" className={`${mutedText} hover:opacity-100 transition-opacity`}>
              Demonstração
            </a>
            <a href="#consulta-gratuita" className={`${mutedText} hover:opacity-100 transition-opacity`}>
              Consulta Gratuita
            </a>
            <a href="#amostra-relatorio" className={`${mutedText} hover:opacity-100 transition-opacity`}>
              O Relatório
            </a>
            <a href="#planos-v3" className={`${mutedText} hover:opacity-100 transition-opacity`}>
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleThemeMode}
              title="Alternar tema visual da prévia"
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 sm:px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-colors ${
                isLight
                  ? "border-[#0B192C]/15 bg-white text-[#0B192C] hover:bg-[#0B192C]/5"
                  : "border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
              }`}
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-[#0B192C]" /> : <Sun className="w-3.5 h-3.5 text-[#F5B041]" />}
              <span className="hidden sm:inline">{isLight ? "Azul Noturno" : "Claro Editorial"}</span>
            </button>
            <Link
              to="/"
              className={`inline-flex items-center text-[11px] px-2.5 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-colors ${
                isLight
                  ? "border-[#0B192C]/15 text-[#475569] hover:text-[#0B192C]"
                  : "border-white/15 text-[#94A3B8] hover:text-white"
              }`}
            >
              <span className="sm:hidden">V1</span>
              <span className="hidden sm:inline">Ver V1</span>
            </Link>
            <Link
              to="/auth"
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors ${
                isLight
                  ? "bg-[#0B192C] text-white hover:bg-[#152C4D]"
                  : "bg-white/10 text-white border border-white/15 hover:bg-white/15"
              }`}
            >
              Entrar
            </Link>
          </div>
        </div>

        {/* Barra compacta de teste de ângulos A/B */}
        <div
          className={`border-t ${
            isLight ? "border-[#0B192C]/[0.06] bg-[#EFECE2]/80" : "border-white/[0.05] bg-[#040914]/80"
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className={`font-mono text-[9px] uppercase tracking-[0.16em] shrink-0 ${mutedText}`}>
              Prévia /v3:
            </span>
            {(["padrao", "fitness", "carreira", "cetico"] as V3AngleKey[]).map((key) => {
              const item = V3_ANGLES[key];
              const active = key === activeAngleKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAngleSwitch(key)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    active
                      ? "bg-[#0B192C] text-[#F5DE98] shadow-sm"
                      : isLight
                      ? "text-[#475569] hover:bg-black/5"
                      : "text-[#94A3B8] hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Banner discreto de indicação verificada */}
        {partnerRef && (
          <div className="mt-5 rounded-2xl border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2.5 flex items-center justify-center gap-2 text-xs text-center">
            <ShieldCheck className={`w-4 h-4 shrink-0 ${goldAccentText}`} />
            <span>
              Indicação verificada • <strong>{formatPartnerIdLabel(partnerRef)}</strong> — mesmo valor oficial em todos os planos.
            </span>
          </div>
        )}

        {/* =====================================================================
            1. PRIMEIRA TELA: A IDEIA QUE DESPERTA CURIOSIDADE (VISUAL + BOARDING PASS)
            Mobile: título, explicação e botão ANTES da imagem.
            Desktop: texto à esquerda, composição de destinos + cartão de embarque à direita.
           ===================================================================== */}
        <section className="pt-8 pb-14 sm:pt-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Coluna de Texto (aparece primeiro no celular e à esquerda no desktop) */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${goldBadgeClass}`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{angle.badge}</span>
            </div>

            <h1
              className={`font-ps-display font-bold tracking-[-0.03em] leading-[1.06] ${headingText}`}
              style={{ fontSize: "clamp(2.15rem, 4.6vw, 3.65rem)" }}
            >
              {angle.headline}{" "}
              <span
                className={
                  isLight
                    ? "text-[#9A6F11] underline decoration-[#C9A227]/45 decoration-2 underline-offset-8"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D1] via-[#F5B041] to-[#E67E22]"
                }
              >
                {angle.highlight}
              </span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${bodyText}`}>
              {angle.subcopy}
            </p>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={scrollToConsult}
                className={`w-full sm:w-auto min-h-[56px] px-7 py-4 rounded-2xl font-bold text-sm sm:text-base inline-flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${primaryBtnClass}`}
              >
                <span>{angle.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-[#E5C158]" />
              </button>

              <p className={`text-xs sm:text-sm ${mutedText}`}>
                Entenda a experiência antes de escolher um relatório pago • Sem cartão e sem pedir e-mail antes do resultado.
              </p>
            </div>

            <div className={`pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium ${mutedText}`}>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                Cálculo astronômico Swiss Ephemeris
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C9A227]" />
                Opção para quem não sabe a hora exata
              </span>
            </div>
          </div>

          {/* Coluna Visual: Fotografia de Destinos + Cartão de Embarque de Avião */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            {/* Moldura fotográfica principal do destino */}
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[16/11] shadow-[0_26px_70px_rgba(11,25,44,0.22)] border border-[#C9A227]/35 bg-[#0B192C]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeHeroDest.id}
                  src={activeHeroDest.image}
                  alt={`${activeHeroDest.city}, ${activeHeroDest.country}`}
                  initial={prefersReducedMotion ? false : { opacity: 0.35, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.35 }}
                  transition={{ duration: 0.55 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/90 via-[#071120]/25 to-transparent" />

              {/* Selo superior na foto */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#071120]/80 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.16em] text-[#F5DE98]">
                  Destino ilustrativo • Exemplo
                </span>
                <div className="flex items-center gap-1.5 bg-[#071120]/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                  {HERO_BOARDING_DESTINATIONS.map((dest, idx) => (
                    <button
                      key={dest.id}
                      type="button"
                      aria-label={`Ver exemplo ${dest.city}`}
                      onClick={() => {
                        setHeroDestIdx(idx);
                        setHeroPaused(true);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        idx === heroDestIdx ? "w-6 bg-[#E5C158]" : "w-2 bg-white/45 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CARTÃO DE EMBARQUE SOLAR (BOARDING PASS) SOBREPOSTO */}
            <div className="-mt-6 sm:-mt-10 mx-2 sm:mx-6 relative z-10 rounded-2xl bg-[#0B192C] text-white border border-[#C9A227]/50 shadow-[0_20px_50px_rgba(11,25,44,0.32)] overflow-hidden">
              {/* Faixa dourada superior */}
              <div className="px-5 py-2.5 bg-gradient-to-r from-[#13294B] via-[#0F223D] to-[#13294B] border-b border-dashed border-[#C9A227]/40 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5DE98] flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#E5C158]" />
                  Cartão de Embarque • Seu Próximo Ciclo
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                  Exemplo
                </span>
              </div>

              <div className="p-5 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 block">
                    Origem
                  </span>
                  <span className="font-ps-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    NATAL
                  </span>
                  <span className="text-[11px] text-white/65 block truncate">
                    Seus dados natais
                  </span>
                </div>

                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="w-full flex items-center gap-1.5">
                    <span className="h-px flex-1 bg-[#C9A227]/45" />
                    <Plane className="w-4 h-4 text-[#E5C158] shrink-0" />
                    <span className="h-px flex-1 bg-[#C9A227]/45" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5DE98] mt-1 text-center">
                    Retorno Solar
                  </span>
                </div>

                <div className="col-span-4 text-right">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 block">
                    Destino
                  </span>
                  <span className="font-ps-display text-xl sm:text-2xl font-bold text-[#F5DE98] tracking-tight">
                    {activeHeroDest.iata}
                  </span>
                  <span className="text-[11px] text-white/85 block truncate">
                    {activeHeroDest.city}, {activeHeroDest.country}
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 bg-black/25 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[#F5DE98] font-semibold">{activeHeroDest.houseLabel}:</span>{" "}
                  <span className="text-white/80">{activeHeroDest.themeShort}</span>
                </div>
                <span className="font-mono text-[10px] text-white/55">
                  {activeHeroDest.coords}
                </span>
              </div>
            </div>

            {/* Seletor limpo de destinos ilustrativos ABAIXO do Cartão de Embarque (sem sobreposição) */}
            <div className="mt-3.5 mx-2 sm:mx-6 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
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
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      active
                        ? "bg-[#0B192C] text-[#F5DE98] border-[#C9A227] shadow-sm"
                        : isLight
                        ? "bg-white text-[#475569] border-[#0B192C]/12 hover:border-[#0B192C]/35"
                        : "bg-white/[0.05] text-[#CBD5E1] border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                    <span>{dest.city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. DEMONSTRAÇÃO VISUAL QUE EXPLICA O CONCEITO
            "Mesmo aniversário. Cidades diferentes. Outras leituras."
            Personagem fixo + fotos reais + cálculos conferidos.
           ===================================================================== */}
        <section id="como-funciona" className="py-14 sm:py-20 scroll-mt-24">
          <div className="max-w-3xl mb-8 space-y-3">
            <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-semibold block ${goldAccentText}`}>
              Entenda em 15 segundos • Demonstração Visual
            </span>
            <h2 className={`font-ps-display text-2xl sm:text-4xl font-bold tracking-tight ${headingText}`}>
              Mesmo aniversário. Cidades diferentes. Outras leituras.
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
              Na astrologia da Revolução Solar, a latitude e a longitude onde você está no instante do retorno solar reposicionam as Casas do novo ciclo. Toque nas cidades abaixo e veja o que muda na prática para uma mesma pessoa:
            </p>
          </div>

          {/* Barra fixa dos dados natais do personagem demonstrativo */}
          <div className={`rounded-2xl border p-4 mb-6 flex flex-wrap items-center justify-between gap-3 ${surfaceCard}`}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
              <span className={`font-semibold ${headingText}`}>
                {DEMO_CHARACTER_PROFILE.name}
              </span>
              <span className={mutedText}>•</span>
              <span className={bodyText}>
                Nascimento: <strong>{DEMO_CHARACTER_PROFILE.birthDate}</strong> às{" "}
                <strong>{DEMO_CHARACTER_PROFILE.birthTime}</strong> ({DEMO_CHARACTER_PROFILE.birthCity})
              </span>
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border ${goldBadgeClass}`}>
              Dados fixos • Só muda a cidade
            </span>
          </div>

          {/* Abas visuais com foto das 3 cidades */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
            {DEMO_CHARACTER_CITIES.map((city) => {
              const active = city.id === activeDemoCity.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setDemoCityId(city.id)}
                  className={`group rounded-2xl p-2 sm:p-3 border text-left transition-all flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 ${
                    active
                      ? "bg-[#0B192C] text-white border-[#C9A227] shadow-[0_14px_34px_rgba(11,25,44,0.2)]"
                      : isLight
                      ? "bg-white text-[#0B192C] border-[#0B192C]/12 hover:border-[#C9A227]/60"
                      : "bg-[#0B1629]/70 text-white border-white/10 hover:border-[#C9A227]/50"
                  }`}
                >
                  <img
                    src={city.skylineImage}
                    alt={city.city}
                    className="w-full sm:w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] block ${
                        active ? "text-[#F5DE98]" : goldAccentText
                      }`}
                    >
                      {city.houseLabel}
                    </span>
                    <span className="font-ps-display text-sm sm:text-base font-bold block truncate">
                      {city.city}
                    </span>
                    <span
                      className={`text-[11px] hidden sm:block truncate ${
                        active ? "text-white/70" : mutedText
                      }`}
                    >
                      {city.country}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Painel visual da cidade selecionada: Retrato cinematográfico + Leitura conferida */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemoCity.id}
              initial={prefersReducedMotion ? false : { opacity: 0.9, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.9, y: -4 }}
              transition={{ duration: 0.16 }}
              className={`rounded-[28px] border overflow-hidden grid grid-cols-1 lg:grid-cols-12 ${surfaceCard}`}
            >
              {/* Foto real da cena na cidade */}
              <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[360px] bg-[#0B192C]">
                <img
                  src={activeDemoCity.portraitImage}
                  alt={`Aniversário em ${activeDemoCity.city}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/90 via-transparent to-[#071120]/25" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-white">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5DE98] block">
                      Coordenada • {activeDemoCity.coords}
                    </span>
                    <p className="font-ps-display text-2xl font-bold">
                      {activeDemoCity.city}, {activeDemoCity.country}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B192C]/90 border border-[#C9A227]/60 font-mono text-xs font-bold text-[#F5DE98]">
                    {activeDemoCity.houseLabel}
                  </span>
                </div>
              </div>

              {/* O que muda na interpretação */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${goldBadgeClass}`}>
                      {activeDemoCity.houseLabel}
                    </span>
                    <span className={`text-xs font-mono ${mutedText}`}>
                      {activeDemoCity.solarAscendant}
                    </span>
                  </div>

                  <h3 className={`font-ps-display text-xl sm:text-2xl font-bold leading-snug ${headingText}`}>
                    {activeDemoCity.headline}
                  </h3>

                  <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
                    {activeDemoCity.interpretation}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {activeDemoCity.highlights.map((item, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                        isLight
                          ? "bg-[#F7F4EC]/80 border-[#0B192C]/8"
                          : "bg-white/[0.03] border-white/10"
                      }`}
                    >
                      <strong className={headingText}>{item.label}:</strong>{" "}
                      <span className={bodyText}>{item.detail}</span>
                    </div>
                  ))}
                </div>

                <p className={`text-xs leading-relaxed border-t pt-4 ${isLight ? "border-[#0B192C]/10" : "border-white/10"} ${mutedText}`}>
                  <strong>Importante:</strong> não existe “Paris = amor” ou “Nova York = dinheiro” igual para todos. Para outra data e horário de nascimento, Zurique pode ativar outra Casa completamente diferente.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* =====================================================================
            3. A CONSULTA GRATUITA DENTRO DA PÁGINA
            "Comece por um aniversário que você já viveu."
            4 etapas curtas + resultado gratuito ANTES de pedir e-mail.
           ===================================================================== */}
        <section
          ref={consultSectionRef}
          id="consulta-gratuita"
          className="py-14 sm:py-20 scroll-mt-20"
        >
          <div className="rounded-[32px] bg-[#0B192C] text-white border border-[#C9A227]/45 shadow-[0_28px_80px_rgba(11,25,44,0.3)] overflow-hidden">
            {/* Cabeçalho estilo Bilhete Aéreo */}
            <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-dashed border-[#C9A227]/35 bg-gradient-to-r from-[#0E213B] via-[#0B192C] to-[#0E213B] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5DE98] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
                  Primeiro Passo • Experiência Gratuita na Página
                </span>
                <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                  Comece por um aniversário que você já viveu.
                </h2>
                <p className="text-sm text-white/75">
                  Escolha um aniversário passado e conheça gratuitamente a leitura astrológica daquele ciclo — sem pedir cartão ou cadastro antes do resultado.
                </p>
              </div>

              {!consultOpen && (
                <button
                  type="button"
                  onClick={() => setConsultOpen(true)}
                  className="shrink-0 min-h-[50px] px-6 py-3 rounded-xl bg-[#E5C158] hover:bg-[#F0CF70] text-[#0B192C] font-bold text-xs uppercase tracking-[0.15em] inline-flex items-center gap-2"
                >
                  <span>Começar minha consulta gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {consultOpen && (
              <div className="p-6 sm:p-10">
                {/* Barra de progresso das 4 etapas + Resultado */}
                <div className="mb-7">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      {step > 1 && !calculating && (
                        <button
                          type="button"
                          onClick={() =>
                            setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : 1))
                          }
                          className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Voltar</span>
                        </button>
                      )}
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F5DE98] font-semibold">
                        {step < 5 ? `Etapa ${step} de 4` : "Resultado da Consulta Gratuita"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
                      {step === 1 && "Data de nascimento"}
                      {step === 2 && "Horário de nascimento"}
                      {step === 3 && "Cidade de nascimento"}
                      {step === 4 && "Ano e cidade do aniversário"}
                      {step === 5 && "Leitura liberada"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E5C158] to-[#C9A227] transition-all duration-300"
                      style={{ width: `${(step / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* ETAPA 1: DATA DE NASCIMENTO */}
                  {step === 1 && (
                    <motion.div
                      key="c-step-1"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="max-w-xl space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="v3-dob"
                          className="font-ps-display text-xl sm:text-2xl font-bold text-white block mb-1.5"
                        >
                          1. Qual é a sua data de nascimento?
                        </label>
                        <p className="text-xs sm:text-sm text-white/70">
                          Usamos o dia, mês e ano para localizar a posição exata do seu Sol natal.
                        </p>
                      </div>

                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#E5C158] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="v3-dob"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full h-14 pl-11 pr-4 rounded-xl bg-white/[0.07] border border-white/20 text-base text-white focus:outline-none focus:border-[#E5C158] [color-scheme:dark]"
                        />
                      </div>

                      {formError && (
                        <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2.5">
                          {formError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleNextStep1}
                        className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C] font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Continuar para o horário</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* ETAPA 2: HORÁRIO DE NASCIMENTO + ORIENTAÇÃO PARA QUEM NÃO SABE */}
                  {step === 2 && (
                    <motion.div
                      key="c-step-2"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="max-w-xl space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="v3-time"
                          className="font-ps-display text-xl sm:text-2xl font-bold text-white block mb-1.5"
                        >
                          2. Qual é o seu horário de nascimento?
                        </label>
                        <p className="text-xs sm:text-sm text-white/70">
                          Se você não tiver a certidão em mãos agora, marque a opção abaixo para usar a referência solar de meio-dia.
                        </p>
                      </div>

                      <div className="relative">
                        <Clock className="w-4 h-4 text-[#E5C158] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="v3-time"
                          type="time"
                          value={unknownTime ? "12:00" : birthTime}
                          disabled={unknownTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                          className="w-full h-14 pl-11 pr-4 rounded-xl bg-white/[0.07] border border-white/20 text-base text-white focus:outline-none focus:border-[#E5C158] disabled:opacity-45 [color-scheme:dark]"
                        />
                      </div>

                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/15 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={unknownTime}
                          onChange={(e) => {
                            setUnknownTime(e.target.checked);
                            if (e.target.checked) setBirthTime("12:00");
                          }}
                          className="mt-0.5 w-4 h-4 rounded accent-[#E5C158]"
                        />
                        <span className="text-xs sm:text-sm text-white/90 leading-relaxed">
                          <strong>Não sei meu horário exato</strong> (usar 12:00 aproximado)
                        </span>
                      </label>

                      {unknownTime && (
                        <div className="rounded-xl border border-[#E5C158]/35 bg-[#E5C158]/10 px-4 py-3 text-xs text-[#FFF3D1] leading-relaxed">
                          <strong>Orientação transparente:</strong> sem a hora exata da certidão, a cúspide do Ascendente pode variar alguns graus em cidades de fronteira entre duas Casas, mas você já consegue experimentar a leitura inicial.
                        </div>
                      )}

                      {formError && (
                        <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2.5">
                          {formError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleNextStep2}
                        className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C] font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Continuar para cidade natal</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* ETAPA 3: CIDADE DE NASCIMENTO */}
                  {step === 3 && (
                    <motion.div
                      key="c-step-3"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="max-w-xl space-y-5"
                    >
                      <div>
                        <span className="font-ps-display text-xl sm:text-2xl font-bold text-white block mb-1.5">
                          3. Em qual cidade você nasceu?
                        </span>
                        <p className="text-xs sm:text-sm text-white/70">
                          Digite as primeiras letras e selecione sua cidade na lista para capturar latitude e longitude.
                        </p>
                      </div>

                      <div className="h-14">
                        <CityAutocomplete
                          value={birthCity}
                          onChange={(val, valid, coords) => {
                            setBirthCity(val);
                            setBirthCityValid(valid);
                            if (coords) setBirthCoords(coords);
                          }}
                          placeholder="Ex.: São Paulo, Curitiba, Lisboa..."
                          className="!h-14 !rounded-xl !bg-white/[0.07] !border-white/20 !text-base"
                        />
                      </div>

                      {formError && (
                        <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2.5">
                          {formError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleNextStep3}
                        className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C] font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Escolher aniversário passado</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* ETAPA 4: ANO ESCOLHIDO E CIDADE ONDE PASSOU AQUELE ANIVERSÁRIO */}
                  {step === 4 && (
                    <motion.form
                      key="c-step-4"
                      onSubmit={handleRunFreeAudit}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="max-w-xl space-y-5"
                    >
                      <div>
                        <span className="font-ps-display text-xl sm:text-2xl font-bold text-white block mb-1.5">
                          4. Qual aniversário passado você quer consultar?
                        </span>
                        <p className="text-xs sm:text-sm text-white/70">
                          Escolha o ano e a cidade onde você estava na data daquele aniversário.
                        </p>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98] block mb-2">
                          Ano do aniversário vivido
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {availableYears.map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => setTargetYear(yr)}
                              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                                targetYear === yr
                                  ? "bg-[#E5C158] text-[#0B192C] border-[#E5C158]"
                                  : "bg-white/[0.05] text-white/80 border-white/15 hover:border-white/35"
                              }`}
                            >
                              {yr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98]">
                            Cidade onde passou o aniversário de {targetYear}
                          </span>
                          {birthCity && (
                            <button
                              type="button"
                              onClick={() => {
                                setPastCity(birthCity);
                                setPastCityValid(true);
                                if (birthCoords) setPastCoords(birthCoords);
                              }}
                              className="text-[11px] text-[#F5DE98] underline hover:text-white"
                            >
                              Usar minha cidade natal
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
                            placeholder="Cidade onde você estava na virada"
                            className="!h-14 !rounded-xl !bg-white/[0.07] !border-white/20 !text-base"
                          />
                        </div>
                      </div>

                      {formError && (
                        <p className="text-xs text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-3.5 py-2.5">
                          {formError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={calculating}
                        className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-xl bg-[#E5C158] hover:bg-[#F2D272] disabled:opacity-60 text-[#0B192C] font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-all"
                      >
                        {calculating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#0B192C]/30 border-t-[#0B192C] rounded-full animate-spin" />
                            <span>Calculando efemérides de {targetYear}...</span>
                          </>
                        ) : (
                          <>
                            <span>Ver minha leitura gratuita de {targetYear}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}

                  {/* ETAPA 5: RESULTADO GRATUITO (ANTES DE PEDIR E-MAIL) */}
                  {step === 5 && auditResult && pastShowcase && (
                    <motion.div
                      key="c-step-5"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-7"
                    >
                      {/* Cartão Visual do Resultado Passado */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-white/[0.04] border border-[#C9A227]/40 overflow-hidden">
                        {/* Imagem atmosférica da Casa + Selo do Bilhete */}
                        <div className="lg:col-span-5 relative min-h-[240px] bg-[#060E1A]">
                          <img
                            src={`/images/stories/casa-${pastShowcase.id}.jpg`}
                            alt={`Casa ${pastShowcase.numberLabel}`}
                            className="w-full h-full object-cover opacity-85"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#060E1A] via-[#060E1A]/35 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-[#0B192C]/85 border border-[#C9A227]/50 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98]">
                              Ciclo Vivido • {auditResult.pastYear}
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#E5C158] block">
                              {auditResult.pastCity} • Sol na Casa {pastShowcase.numberLabel}
                            </span>
                            <h3 className="font-ps-display text-2xl font-bold mt-0.5">
                              {pastShowcase.title}
                            </h3>
                          </div>
                        </div>

                        {/* Interpretação gratuita + limites transparentes */}
                        <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
                          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                            {pastShowcase.cycleFocus}
                          </p>

                          <div className="space-y-2.5">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98] block">
                              Como essa Casa costuma aparecer no dia a dia:
                            </span>
                            {pastShowcase.inPractice.map((scene, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/85"
                              >
                                <Check className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5" />
                                <span>
                                  <strong className="text-[#F5DE98]">{scene.area}:</strong>{" "}
                                  {scene.example}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Explicação clara dos limites da amostra gratuita */}
                          <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 text-xs text-white/70 leading-relaxed">
                            <strong className="text-[#F5DE98]">O que esta consulta gratuita inclui:</strong> o cálculo astronômico da Casa Solar principal ativada em {auditResult.pastCity} em {auditResult.pastYear}
                            {auditResult.usedApproximateTime
                              ? " (usando horário aproximado 12:00)."
                              : "."}{" "}
                            Nos relatórios completos do próximo aniversário você recebe o cruzamento das 8 áreas da vida, comparação de cidades e Manual de Defesa completo.
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setValidatedMatch(true);
                                nextCycleSectionRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                                validatedMatch
                                  ? "bg-emerald-400 text-[#052014]"
                                  : "bg-[#E5C158] text-[#0B192C] hover:bg-[#F2D272]"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Reconheci meu ano • Planejar meu próximo aniversário</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStep(4)}
                              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15"
                            >
                              Testar outro ano
                            </button>

                            <button
                              type="button"
                              onClick={handleShareBoardingPass}
                              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-[#F5DE98] border border-[#C9A227]/35 inline-flex items-center gap-1.5"
                            >
                              {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                              <span>{copiedPass ? "Link copiado!" : "Compartilhar"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Oferta opcional e não-bloqueante de receber cópia por e-mail */}
                      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-white flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#E5C158]" />
                            Quer salvar uma cópia deste resumo gratuito? (Opcional)
                          </p>
                          <p className="text-xs text-white/65">
                            Sua leitura já está liberada acima — deixe seu e-mail apenas se quiser guardar o registro.
                          </p>
                        </div>

                        {emailSaved ? (
                          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Registro salvo neste dispositivo!
                          </span>
                        ) : (
                          <form onSubmit={handleSaveCopyEmail} className="flex w-full sm:w-auto gap-2">
                            <input
                              type="email"
                              value={copyEmail}
                              onChange={(e) => setCopyEmail(e.target.value)}
                              placeholder="seu@email.com"
                              className="flex-1 sm:w-56 h-10 px-3.5 rounded-xl bg-white/[0.07] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E5C158]"
                            />
                            <button
                              type="submit"
                              className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white shrink-0"
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
            )}
          </div>
        </section>

        {/* =====================================================================
            4. A PASSAGEM NATURAL PARA O PRÓXIMO ANIVERSÁRIO
            Prioridades visuais + filtros reais de distância + contraste Cidade Atual
           ===================================================================== */}
        <section
          ref={nextCycleSectionRef}
          className="py-14 sm:py-20 scroll-mt-24 space-y-10"
        >
          <div className="max-w-3xl space-y-3">
            <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-semibold block ${goldAccentText}`}>
              Próximo Ciclo • Planejamento Personalizado
            </span>
            <h2 className={`font-ps-display text-2xl sm:text-4xl font-bold tracking-tight ${headingText}`}>
              E no seu próximo aniversário, o que você quer priorizar?
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
              Explore destinos considerando os temas que deseja colocar em foco no novo ciclo — e filtre até onde faz sentido viajar para a sua realidade.
            </p>
          </div>

          {/* 4 Cards Fotográficos de Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {V3_PRIORITY_OPTIONS.map((opt) => {
              const selected = selectedNextHouse === opt.houseId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedNextHouse(opt.houseId)}
                  className={`group rounded-2xl overflow-hidden border text-left transition-all flex flex-col justify-between ${
                    selected
                      ? "border-[#C9A227] ring-2 ring-[#C9A227]/40 shadow-xl"
                      : isLight
                      ? "border-[#0B192C]/10 hover:border-[#C9A227]/60"
                      : "border-white/10 hover:border-[#C9A227]/50"
                  } ${isLight ? "bg-white" : "bg-[#0B1629]/90"}`}
                >
                  <div className="relative h-36 w-full overflow-hidden bg-[#0B192C]">
                    <img
                      src={opt.image}
                      alt={opt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/85 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B192C]/85 border border-[#C9A227]/45 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5DE98]">
                      {opt.tag}
                    </span>
                    {selected && (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#E5C158] text-[#0B192C] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5 flex-1">
                    <h3 className={`font-ps-display text-base font-bold ${headingText}`}>
                      {opt.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${mutedText}`}>
                      {opt.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className={mutedText}>
              Tema selecionado: <strong className={headingText}>Casa {goalShowcase.numberLabel} — {goalShowcase.title}</strong>
            </span>
            <Link to="/casas" className={`font-semibold underline ${goldAccentText}`}>
              Conhecer todas as 12 Casas Solares →
            </Link>
          </div>

          {/* Filtro de alcance de viagem */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${surfaceCard}`}>
            <div className="space-y-1.5">
              <h3 className={`font-ps-display text-xl sm:text-2xl font-bold ${headingText}`}>
                Até onde você gostaria de viajar?
              </h3>
              <p className={`text-xs sm:text-sm ${mutedText}`}>
                Considere desde passar na sua própria cidade atual até voos internacionais. Como as Casas dependem da geometria astronômica real, nem sempre haverá mudança de Casa em cidades vizinhas — o relatório mostra com transparência o que está ao seu alcance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TRAVEL_RADIUS_OPTIONS.map((rad) => {
                const active = selectedRadius === rad.id;
                return (
                  <button
                    key={rad.id}
                    type="button"
                    onClick={() => setSelectedRadius(rad.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      active
                        ? "bg-[#0B192C] text-white border-[#C9A227]"
                        : isLight
                        ? "bg-[#F7F4EC]/70 text-[#0B192C] border-[#0B192C]/10 hover:border-[#C9A227]/60"
                        : "bg-white/[0.03] text-white border-white/10 hover:border-[#C9A227]/50"
                    }`}
                  >
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] block mb-1 ${
                        active ? "text-[#F5DE98]" : goldAccentText
                      }`}
                    >
                      {rad.badge}
                    </span>
                    <span className="font-semibold text-sm block mb-1">{rad.title}</span>
                    <span className={`text-xs block leading-relaxed ${active ? "text-white/75" : mutedText}`}>
                      {rad.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Se já calculou o passo 3, mostra prévia real de ficar na cidade atual vs. destinos do objetivo */}
            {auditResult && nextStayShowcase && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#0B192C] text-white border border-white/10 space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98]">
                    Prévia Gratuita • Se ficar em {auditResult.pastCity} em {auditResult.nextYear}
                  </span>
                  <h4 className="font-ps-display text-lg font-bold">
                    Ativa a Casa {nextStayShowcase.numberLabel} — {nextStayShowcase.title}
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    <strong>Manual de Defesa local:</strong> {nextStayDefense.strength}
                  </p>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong>Ponto de atenção:</strong> {nextStayDefense.blindSpot}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#13294B] to-[#0B192C] text-white border border-[#C9A227]/50 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5DE98] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#E5C158]" />
                      Destinos para Casa {goalShowcase.numberLabel} ({goalShowcase.title})
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed">
                      Desbloqueie as cidades compatíveis com o seu mapa para colocar{" "}
                      <strong>{goalShowcase.title}</strong> em destaque no ciclo de {auditResult.nextYear}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToPlans}
                    className="w-full py-3 rounded-xl bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C] font-bold text-xs uppercase tracking-[0.15em]"
                  >
                    Ver opções de relatório a partir de R$ 19,90
                  </button>
                </div>
              </div>
            )}

            <div className="pt-1 flex justify-start">
              <button
                type="button"
                onClick={scrollToPlans}
                className={`min-h-[52px] px-7 py-3.5 rounded-2xl font-bold text-sm inline-flex items-center gap-2.5 transition-all ${primaryBtnClass}`}
              >
                <span>Conhecer meus destinos e relatórios</span>
                <ArrowRight className="w-4 h-4 text-[#E5C158]" />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. MOSTRAR O QUE A PESSOA ESTÁ COMPRANDO ("Veja como é o seu relatório")
            Páginas visuais reais da entrega, ampliáveis no celular + 3 explicações objetivas.
           ===================================================================== */}
        <section id="amostra-relatorio" className="py-14 sm:py-20 scroll-mt-24 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-semibold block ${goldAccentText}`}>
              Produto Concreto • Amostra Real da Entrega
            </span>
            <h2 className={`font-ps-display text-2xl sm:text-4xl font-bold tracking-tight ${headingText}`}>
              Veja como é o seu relatório por dentro.
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
              Toque em qualquer página abaixo para ampliar no celular ou computador e ver exatamente o que é liberado na sua tela após a escolha do plano:
            </p>
          </div>

          {/* 3 Páginas Reais Ampliáveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PÁGINA 1: RADAR DE DESTINOS & MANUAL DE DEFESA */}
            <button
              type="button"
              onClick={() => setOpenReportModal("radar")}
              className={`group rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 flex flex-col justify-between ${surfaceCard}`}
            >
              <div className="rounded-2xl bg-[#091526] text-white p-4 border border-[#C9A227]/30 space-y-3 w-full">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#F5DE98]">
                  <span>Página 01 • Destinos</span>
                  <span className="inline-flex items-center gap-1 text-white/70">
                    <Maximize2 className="w-3 h-3" /> Ampliar
                  </span>
                </div>
                <div className="relative h-32 rounded-xl overflow-hidden">
                  <img
                    src="/images/abertura/zurich.jpg"
                    alt="Exemplo Radar de Destinos"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091526] via-[#091526]/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="font-ps-display text-sm font-bold">Zurique • Casa 02</span>
                    <span className="px-2 py-0.5 rounded bg-[#E5C158] text-[#0B192C] font-mono text-[9px] font-bold">
                      47°22&apos;N
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-lg bg-white/[0.06] flex items-center justify-between">
                    <span>Florianópolis, BR</span>
                    <span className="text-[#F5DE98] font-mono">Regional • Casa 03</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.06] flex items-center justify-between">
                    <span>Cidade Atual (Defesa)</span>
                    <span className="text-emerald-300 font-mono">Incluído</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 px-1 space-y-1">
                <h3 className={`font-ps-display text-lg font-bold ${headingText}`}>
                  1. Destinos & Cidade Atual
                </h3>
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  Coordenadas recomendadas por Casa, comparativo de cidades e Manual de Defesa caso decida não viajar.
                </p>
              </div>
            </button>

            {/* PÁGINA 2: LEITURA DAS 8 ÁREAS DA VIDA */}
            <button
              type="button"
              onClick={() => setOpenReportModal("areas")}
              className={`group rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 flex flex-col justify-between ${surfaceCard}`}
            >
              <div className="rounded-2xl bg-[#091526] text-white p-4 border border-[#C9A227]/30 space-y-3 w-full">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#F5DE98]">
                  <span>Página 02 • 8 Áreas da Vida</span>
                  <span className="inline-flex items-center gap-1 text-white/70">
                    <Maximize2 className="w-3 h-3" /> Ampliar
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    ["Carreira & Metas", "Projetos de vitrine e postura de comando"],
                    ["Vida Financeira", "Foco em margem real e reserva mensal"],
                    ["Amor & Vínculos", "Acordos claros e reciprocidade prática"],
                    ["Saúde & Rotina", "Blocos fixos de treino, sono e energia"],
                  ].map(([title, desc]) => (
                    <div key={title} className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 space-y-1">
                      <span className="font-semibold text-[#F5DE98] block text-[11px]">{title}</span>
                      <span className="text-white/75 text-[10px] leading-snug block">{desc}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-[#E5C158]/15 border border-[#E5C158]/35 text-[11px] text-[#FFF3D1]">
                  + Rede & Amizades • Base Familiar • Energia Vital • Direção Prática
                </div>
              </div>

              <div className="pt-4 px-1 space-y-1">
                <h3 className={`font-ps-display text-lg font-bold ${headingText}`}>
                  2. As 8 Áreas Explicadas
                </h3>
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  Tradução clara e sem jargão técnico de como aquele destino conversa com trabalho, dinheiro, relações e rotina.
                </p>
              </div>
            </button>

            {/* PÁGINA 3: CARTÃO DE EMBARQUE SOLAR 9:16 */}
            <button
              type="button"
              onClick={() => setOpenReportModal("ticket")}
              className={`group rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 flex flex-col justify-between ${surfaceCard}`}
            >
              <div className="rounded-2xl bg-[#091526] text-white p-4 border border-[#C9A227]/30 space-y-3 w-full">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#F5DE98]">
                  <span>Página 03 • Passe Solar</span>
                  <span className="inline-flex items-center gap-1 text-white/70">
                    <Maximize2 className="w-3 h-3" /> Ampliar
                  </span>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src="/images/v3/boarding-pass-art.jpg"
                    alt="Cartão de Embarque Cósmico Protocolo Solar"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="pt-4 px-1 space-y-1">
                <h3 className={`font-ps-display text-lg font-bold ${headingText}`}>
                  3. Cartão de Embarque Solar
                </h3>
                <p className={`text-xs leading-relaxed ${mutedText}`}>
                  Resumo visual com a data e o minuto UTC do seu retorno solar, coordenadas e Casa ativada para guardar.
                </p>
              </div>
            </button>
          </div>

          {/* 3 Explicações Objetivas: O que recebe / Como usar / Como e quando acessa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className={`p-6 rounded-2xl border space-y-2 ${surfaceCard}`}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${goldAccentText}`}>
                01 • O que você recebe
              </span>
              <h4 className={`font-ps-display text-lg font-bold ${headingText}`}>
                Leitura completa na tela
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
                Cálculo astronômico individual da virada solar, cidades compatíveis, interpretação das 8 áreas da vida e Manual de Defesa da sua cidade atual.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2 ${surfaceCard}`}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${goldAccentText}`}>
                02 • Como usar na prática
              </span>
              <h4 className={`font-ps-display text-lg font-bold ${headingText}`}>
                Decida antes de reservar viagem
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
                Compare o cenário de passar em casa com destinos possíveis dentro do seu orçamento e escolha onde estar no momento exato do retorno solar.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2 ${surfaceCard}`}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${goldAccentText}`}>
                03 • Como e quando acessa
              </span>
              <h4 className={`font-ps-display text-lg font-bold ${headingText}`}>
                Acesso digital imediato
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
                Assim que o Pix ou Cartão é confirmado, sua leitura abre na hora no celular e no computador — sem espera por PDF manual e sem mensalidade.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. OS PLANOS, COM DIFERENÇAS FÁCEIS DE ENTENDER
            Sem selo artificial de "mais vendido". R$ 19,90 como compra completa de entrada.
           ===================================================================== */}
        <section
          ref={plansSectionRef}
          id="planos-v3"
          className="py-14 sm:py-20 scroll-mt-24 space-y-10"
        >
          <div className="max-w-3xl space-y-3">
            <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-semibold block ${goldAccentText}`}>
              Planos Padronizados • Pagamento Único
            </span>
            <h2 className={`font-ps-display text-2xl sm:text-4xl font-bold tracking-tight ${headingText}`}>
              Escolha apenas a quantidade de leituras que faz sentido para você.
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${bodyText}`}>
              A profundidade da análise (todas as 8 áreas da vida + cálculo Swiss Ephemeris) é completa desde o plano de entrada. O que muda entre os planos é quantas cidades ou Casas você deseja abrir:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {V3_PLANS.map((plan) => (
              <div
                key={plan.pkg}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between border transition-all ${
                  plan.featured
                    ? "bg-[#0B192C] text-white border-[#C9A227] shadow-[0_24px_65px_rgba(11,25,44,0.25)]"
                    : surfaceCard
                }`}
              >
                <div className="space-y-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.16em] font-semibold border ${
                      plan.featured
                        ? "border-[#C9A227]/50 bg-[#C9A227]/15 text-[#F5DE98]"
                        : goldBadgeClass
                    }`}
                  >
                    {plan.badge}
                  </span>

                  <div>
                    <h3
                      className={`font-ps-display text-2xl font-bold ${
                        plan.featured ? "text-white" : headingText
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                        plan.featured ? "text-white/75" : bodyText
                      }`}
                    >
                      {plan.forWhom}
                    </p>
                  </div>

                  {/* Preço total claro */}
                  <div
                    className={`py-4 border-y flex items-baseline gap-1 ${
                      plan.featured ? "border-white/15" : isLight ? "border-[#0B192C]/10" : "border-white/10"
                    }`}
                  >
                    <span className={`text-xs font-bold ${plan.featured ? "text-[#F5DE98]" : goldAccentText}`}>
                      R$
                    </span>
                    <span
                      className={`font-ps-display text-5xl font-bold tracking-tight ${
                        plan.featured ? "text-[#F5DE98]" : headingText
                      }`}
                    >
                      {plan.priceInt}
                    </span>
                    <span className={`text-base font-semibold ${plan.featured ? "text-white/80" : bodyText}`}>
                      ,{plan.priceDec}
                    </span>
                    <span className={`text-xs ml-2 ${plan.featured ? "text-white/60" : mutedText}`}>
                      pagamento único
                    </span>
                  </div>

                  {/* Quantidade exata */}
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      plan.featured
                        ? "bg-white/[0.06] text-[#FFF3D1]"
                        : isLight
                        ? "bg-[#F7F4EC] text-[#0B192C]"
                        : "bg-white/[0.04] text-white"
                    }`}
                  >
                    <strong>Quantidade incluída:</strong> {plan.exactQuantity}
                  </div>

                  {/* Conteúdo incluído */}
                  <ul className="space-y-2.5">
                    {plan.includedContent.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.featured ? "text-[#E5C158]" : "text-[#C9A227]"
                          }`}
                        />
                        <span className={plan.featured ? "text-white/85" : bodyText}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className={`text-[11px] leading-relaxed ${plan.featured ? "text-white/60" : mutedText}`}>
                    <strong>Acesso:</strong> {plan.accessFormat}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToPackage(plan.pkg)}
                  className={`mt-7 w-full min-h-[52px] py-3.5 px-5 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${
                    plan.featured
                      ? "bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C]"
                      : isLight
                      ? "bg-[#0B192C] hover:bg-[#152C4D] text-white"
                      : "bg-white/10 hover:bg-[#E5C158] text-white hover:text-[#0B192C] border border-[#C9A227]/40"
                  }`}
                >
                  {plan.ctaLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Selo técnico Swiss Ephemeris + Transparência de Parceiros */}
          <div className={`rounded-2xl border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${surfaceCard}`}>
            <div className="flex items-start gap-3.5">
              <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${goldAccentText}`} />
              <p className={`text-xs sm:text-sm leading-relaxed ${bodyText}`}>
                <strong className={headingText}>Precisão astronômica Swiss Ephemeris:</strong> todos os planos calculam o instante exato do retorno solar em coordenadas geográficas reais • Pagamento seguro via Pix ou Cartão no Mercado Pago.
              </p>
            </div>
            <Link
              to="/parceiros"
              className={`shrink-0 text-xs font-semibold underline ${goldAccentText}`}
            >
              Programa de Parceiros (#publi • 20% Pix) →
            </Link>
          </div>
        </section>

        {/* =====================================================================
            7. DÚVIDAS QUE PODEM IMPEDIR A COMPRA + FECHAMENTO
           ===================================================================== */}
        <section className="py-14 sm:py-20 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className={`font-mono text-[11px] uppercase tracking-[0.2em] font-semibold block ${goldAccentText}`}>
              Perguntas Frequentes
            </span>
            <h2 className={`font-ps-display text-2xl sm:text-4xl font-bold ${headingText}`}>
              Tire suas dúvidas antes de decidir
            </h2>
          </div>

          <Accordion type="single" collapsible defaultValue="v3-faq-no-time" className="space-y-3">
            {V3_FAQ_ITEMS.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className={`rounded-2xl border px-5 sm:px-6 overflow-hidden ${surfaceCard}`}
              >
                <AccordionTrigger
                  className={`hover:no-underline py-5 font-ps-display text-base sm:text-lg font-bold text-left ${headingText}`}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className={`text-sm leading-relaxed pb-5 ${bodyText}`}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* FECHAMENTO VISUAL RETOMANDO A EXPERIÊNCIA GRATUITA */}
        <section className="pb-10">
          <div className="relative rounded-[32px] overflow-hidden bg-[#0B192C] text-white border border-[#C9A227]/45 shadow-[0_26px_70px_rgba(11,25,44,0.28)]">
            <img
              src="/earth-orbital-hires.jpg"
              alt="Horizonte terrestre ao nascer do Sol"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#081322]/95 via-[#0B192C]/85 to-[#081322]/90" />

            <div className="relative z-10 p-8 sm:p-14 text-center max-w-2xl mx-auto space-y-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5DE98] block">
                Protocolo Solar
              </span>
              <h2 className="font-ps-display text-2xl sm:text-4xl font-bold leading-tight">
                Seu próximo aniversário começa com uma escolha.
              </h2>
              <p className="text-sm sm:text-base text-white/80">
                Conheça primeiro a experiência gratuita com um aniversário que você já viveu. Depois, decida com calma como planejar o próximo.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToConsult}
                  className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-2xl bg-[#E5C158] hover:bg-[#F2D272] text-[#0B192C] font-bold text-sm inline-flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>Consultar meu aniversário passado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL LIGHTBOX PARA AMPLIAR AS PÁGINAS REAIS DO RELATÓRIO NO CELULAR/DESKTOP */}
      <AnimatePresence>
        {openReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenReportModal(null)}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-3xl bg-[#0B192C] text-white border border-[#C9A227]/50 overflow-hidden shadow-2xl my-auto"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#F5DE98]">
                  {openReportModal === "radar" && "Amostra Real • Página 01: Destinos & Defesa"}
                  {openReportModal === "areas" && "Amostra Real • Página 02: As 8 Áreas da Vida"}
                  {openReportModal === "ticket" && "Amostra Real • Página 03: Cartão de Embarque Solar"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenReportModal(null)}
                  aria-label="Fechar ampliação"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto space-y-4">
                {openReportModal === "radar" && (
                  <>
                    <img
                      src="/images/abertura/zurich.jpg"
                      alt="Destino calculado"
                      className="w-full h-48 rounded-2xl object-cover"
                    />
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#E5C158]">
                        Exemplo de Coordenada Calculada
                      </span>
                      <h3 className="font-ps-display text-2xl font-bold">
                        Zurique, Suíça • Sol na Casa 02
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        Retorno Solar exato: 28/10 às 09:42 UTC • Coordenadas 47°22&apos;N, 08°33&apos;E. Foco anual em estrutura financeira, contratos mais rentáveis e organização patrimonial.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1.5 text-xs">
                      <strong className="text-[#F5DE98] block">
                        Manual de Defesa da Cidade Atual (incluído se não viajar):
                      </strong>
                      <p className="text-white/80">
                        Mostra exatamente qual Casa sua cidade atual ativa, como usar o ponto forte daquele ciclo a seu favor e qual ponto de atenção evitar durante os 12 meses.
                      </p>
                    </div>
                  </>
                )}

                {openReportModal === "areas" && (
                  <div className="space-y-3">
                    <p className="text-sm text-white/80">
                      Cada destino desbloqueado entrega a leitura prática das <strong>8 áreas da vida</strong> para o seu ciclo anual:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {[
                        ["1. Carreira & Reputação", "Como conduzir entregas, visibilidade e decisões de trabalho."],
                        ["2. Dinheiro & Recursos", "Postura recomendada para ganhos, preços e reserva."],
                        ["3. Amor & Parcerias", "Clima para vida afetiva, conversas e sociedades."],
                        ["4. Saúde, Rotina & Ritmo", "Gestão de energia física, treinos e agenda diária."],
                        ["5. Rede & Comunidade", "Papel de amizades, grupos e indicações no ano."],
                        ["6. Casa & Base Familiar", "Organização do lar, imóveis e vínculos íntimos."],
                        ["7. Energia Vital & Mente", "Onde recarregar bateria mental e evitar desgaste."],
                        ["8. Direção Prática do Ano", "Síntese clara do que priorizar e do que cortar."],
                      ].map(([t, d]) => (
                        <div key={t} className="p-3 rounded-xl bg-white/[0.05] border border-white/10 space-y-1">
                          <strong className="text-[#F5DE98] block">{t}</strong>
                          <span className="text-white/75 block leading-relaxed">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {openReportModal === "ticket" && (
                  <div className="space-y-4">
                    <img
                      src="/images/v3/boarding-pass-art.jpg"
                      alt="Cartão de Embarque Cósmico ampliado"
                      className="w-full max-h-[56vh] object-contain rounded-2xl mx-auto bg-black"
                    />
                    <p className="text-xs sm:text-sm text-white/80 text-center">
                      Cartão personalizado gerado com seu nome, cidade escolhida, coordenadas geográficas e Casa Solar ativada.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARRA FIXA MOBILE NA ZONA DO POLEGAR */}
      {showStickyCta && (
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2.5 border-t backdrop-blur-xl ${
            isLight
              ? "bg-[#F7F4EC]/95 border-[#0B192C]/15"
              : "bg-[#060C18]/95 border-white/15"
          }`}
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className={`text-xs font-bold block truncate ${headingText}`}>
                Aniversário passado grátis
              </span>
              <span className={`text-[11px] block truncate ${mutedText}`}>
                Conheça a experiência em 1 min
              </span>
            </div>
            <button
              type="button"
              onClick={scrollToConsult}
              className="shrink-0 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0B192C] text-[#F5DE98] font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center gap-1.5"
            >
              <span>Consultar grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingV3;
