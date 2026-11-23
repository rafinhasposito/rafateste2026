import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertCircle,
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
  MapPin,
  Megaphone,
  Moon,
  Network,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { API_URL, getCurrentSolarYear, normalizeBirthTime } from "@/lib/astro";
import { formatPartnerIdLabel, getStoredAffiliateRef } from "@/lib/affiliates";
import {
  ELEMENT_STYLES,
  HOUSES_SHOWCASE,
  type HouseIconKey,
} from "@/data/housesShowcase";
import { houseThemes } from "@/data/houseThemes";
import {
  HOME_CITY_DEFENSE,
  V3_ANGLES,
  V3_FAQ_ITEMS,
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

interface AuditResult {
  house: number;
  city: string;
  year: string;
  sunSign?: string | null;
  ascendant?: string | null;
  returnDate?: string | null;
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

  // Refs para rolagem guiada
  const validatorRef = useRef<HTMLElement | null>(null);
  const housesRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);

  // Estado do Motor de Validação Reversa Gratuita
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [birthCityValid, setBirthCityValid] = useState(false);
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>(undefined);

  const [targetYear, setTargetYear] = useState<string>(() => {
    const nowYear = new Date().getFullYear();
    return String(nowYear - 1);
  });
  const [pastCity, setPastCity] = useState("");
  const [pastCityValid, setPastCityValid] = useState(false);
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>(undefined);

  const [calculating, setCalculating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [validatedMatch, setValidatedMatch] = useState(false);
  const [selectedNextHouse, setSelectedNextHouse] = useState<number | null>(
    angle.featuredHouseId
  );
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Pré-preenche se usuário já tiver perfil salvo
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
        setBirthCoords({ lat: Number(profile.birth_lat), lon: Number(profile.birth_lon) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    setSelectedNextHouse(angle.featuredHouseId);
  }, [angle.featuredHouseId]);

  useEffect(() => {
    document.title = "Protocolo Solar V3 — Teste Grátis Seu Último Aniversário";
    const onScroll = () => setShowStickyBar(window.scrollY > 360);
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

  const handleToggleUnknownTime = (checked: boolean) => {
    setUnknownTime(checked);
    if (checked) {
      setBirthTime("12:00");
    }
  };

  const handleUseSameAsBirthCity = () => {
    if (!birthCity || !birthCityValid || !birthCoords) {
      setFormError("Selecione primeiro sua cidade de nascimento na lista.");
      return;
    }
    setFormError(null);
    setPastCity(birthCity);
    setPastCityValid(true);
    setPastCoords(birthCoords);
  };

  const handleRunFreeValidation = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!pastCity.trim() || !pastCityValid || !pastCoords) {
      setFormError(
        "Selecione na lista a cidade onde você passou esse aniversário."
      );
      return;
    }

    // Guarda no sessionStorage para o usuário não precisar redigitar se avançar pro Futuro
    sessionStorage.setItem("ps_natal_name", name.trim());
    sessionStorage.setItem("ps_natal_date", birthDate);
    sessionStorage.setItem("ps_natal_time", safeTime);
    sessionStorage.setItem("ps_natal_place", birthCity.trim());

    setCalculating(true);
    setAuditResult(null);
    setValidatedMatch(false);

    try {
      const [ano, mes, dia] = birthDate.split("-");
      const dobFormatted = `${dia}/${mes}/${ano}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      let resp: Response;
      try {
        resp = await fetch(`${API_URL}/audit_past`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: name.trim(),
            place_of_birth: birthCity.trim(),
            dob: dobFormatted,
            time: safeTime,
            target_year: targetYear,
            past_city: pastCity.trim(),
            past_lat: pastCoords.lat,
            past_lon: pastCoords.lon,
          }),
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await resp.json();
      if (!resp.ok || !data?.house) {
        throw new Error(
          data?.error ||
            "Não conseguimos calcular agora. Confira os dados e tente novamente."
        );
      }

      setAuditResult({
        house: Number(data.house),
        city: pastCity.split(",")[0].trim(),
        year: targetYear,
        sunSign: data.sun_sign || null,
        ascendant: data.ascendant || null,
        returnDate: data.return_date || null,
        usedApproximateTime: unknownTime,
      });
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setFormError(
          "O servidor astronômico demorou para responder (cold start). Tente clicar mais uma vez — agora ele já acordou!"
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
    navigate(
      `/credits?pkg=${pkg}&returnTo=${encodeURIComponent(targetReturn)}`
    );
  };

  const resultShowcase = auditResult
    ? HOUSES_SHOWCASE.find((h) => h.id === auditResult.house) || HOUSES_SHOWCASE[0]
    : null;
  const resultTheme = auditResult
    ? houseThemes[auditResult.house] || houseThemes[1]
    : null;
  const resultDefense = auditResult
    ? HOME_CITY_DEFENSE[auditResult.house] || HOME_CITY_DEFENSE[1]
    : null;

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

      {/* TOP BAR LIMPA + SELETOR DE ÂNGULOS A/B PARA AVALIAÇÃO */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050507]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link to="/v3" className="flex items-center gap-2.5 shrink-0">
            {/* SVG Solar Vetorial Nativo */}
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
                Prévia V3 • Validação Grátis
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/casas"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors px-2.5 py-1.5"
            >
              <span>As 12 Casas</span>
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
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#F5B041]/15 border border-[#F5B041]/40 text-[#FFF3D1] text-[11px] font-semibold"
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/auth?returnTo=%2Fv3"
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-white text-[11px] font-semibold hover:bg-white/12 transition-all"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Barra de prévia dos 4 ângulos A/B (MiroFish / TikTok & Reels) */}
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

      {/* BANNER DISCRETO DE INDICAÇÃO VERIFICADA (SE VEIO DE AFILIADO) */}
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
      {/* 1. HERO (3 SEGUNDOS — SPATIAL DARK + SHIMMER CTA + AUTORIDADE)        */}
      {/* ===================================================================== */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 text-center">
        <motion.div
          key={`hero-${angleKey}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5B041]/30 bg-[#F5B041]/10 text-[#FFF3D1] font-mono text-[10px] uppercase tracking-[0.16em] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B041]" />
            <span>{angle.badge}</span>
          </div>

          <h1
            className="font-ps-display font-bold text-white tracking-[-0.03em] leading-[1.06] max-w-4xl mx-auto mb-5"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.85rem)" }}
          >
            {angle.headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3D1] via-[#F5B041] to-[#E67E22]">
              {angle.highlight}
            </span>
          </h1>

          <p className="text-[#CBD5E1] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {angle.subcopy}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-7">
            <button
              type="button"
              onClick={() => scrollToSection(validatorRef)}
              className="w-full sm:w-auto min-h-[54px] px-7 py-4 rounded-2xl font-ps-display font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-[#F5B041] via-[#F8C86A] to-[#E67E22] hover:brightness-110 active:scale-[0.98] text-[#050507] transition-all flex items-center justify-center gap-2 shadow-[0_14px_40px_rgba(245,176,65,0.32)]"
            >
              <span>{angle.ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(housesRef)}
              className="w-full sm:w-auto min-h-[54px] px-6 py-4 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] active:scale-[0.98] text-white/90 font-ps-ui text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] transition-all"
            >
              Ver as 12 Casas
            </button>
          </div>

          {/* Micro-reassurances anti-objeção */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#94A3B8]">
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
              Não precisa viajar para a Europa
            </span>
          </div>
        </motion.div>
      </section>

      {/* ===================================================================== */}
      {/* 2. MOTOR DE VALIDAÇÃO REVERSA GRATUITA (PASSADO / ANO ATUAL — REAL)   */}
      {/* ===================================================================== */}
      <section
        ref={validatorRef}
        id="teste-gratis-passado"
        className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 scroll-mt-28"
      >
        <div
          className="rounded-[28px] border border-[#F5B041]/25 p-5 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,20,30,0.92) 0%, rgba(10,11,16,0.98) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="pointer-events-none absolute top-0 left-8 right-8 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(245,176,65,0.65), transparent)",
            }}
          />

          <div className="mb-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
              Passo 1 • Prova Real Sem Pagar Nada
            </span>
            <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              Teste no seu aniversário atual ou passado
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
              Antes de pensar em pagar ou viajar, coloque a cidade onde você
              passou seu último aniversário (ou um ano anterior) e veja se a
              Casa calculada bate com o que você realmente viveu.
            </p>
          </div>

          <form onSubmit={handleRunFreeValidation} className="space-y-5">
            {/* Linha 1: Nome + Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
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
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
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

            {/* Linha 2: Hora + Checkbox "Não sei meu horário exato" + Cidade Natal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
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
                    direciona a tendência principal da sua cidade. Você poderá
                    atualizar depois.
                  </p>
                )}
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
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

            {/* Linha 3: Qual ano validar + Cidade onde passou o aniversário */}
            <div className="pt-2 border-t border-white/[0.08] space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5B041] font-semibold block mb-2">
                  Qual aniversário você quer conferir?
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
                    Em qual cidade você passou o aniversário de {targetYear}?
                  </label>
                  {birthCityValid && (
                    <button
                      type="button"
                      onClick={handleUseSameAsBirthCity}
                      className="text-[11px] font-semibold text-[#F5B041] hover:underline"
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
            </div>

            {formError && (
              <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 flex items-start gap-2.5 text-xs sm:text-sm text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={calculating}
              className="w-full min-h-[56px] px-6 py-4 rounded-2xl font-ps-display font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-[#F5B041] via-[#F8C86A] to-[#E67E22] hover:brightness-110 active:scale-[0.98] disabled:opacity-60 text-[#050507] transition-all flex items-center justify-center gap-2.5 shadow-[0_14px_38px_rgba(245,176,65,0.28)]"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                  <span>Calculando sua Revolução Solar real...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span>Revelar Minha Casa Grátis Agora</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-[#94A3B8]">
              Sem cartão de crédito • Sem criar senha antes de ver o resultado •
              Cálculo real via Swiss Ephemeris
            </p>
          </form>

          {/* =============================================================== */}
          {/* RESULTADO REAL DA VALIDAÇÃO REVERSA GRATUITA                    */}
          {/* =============================================================== */}
          <AnimatePresence>
            {auditResult && resultShowcase && resultTheme && resultDefense && (
              <motion.div
                key={`result-${auditResult.house}-${auditResult.city}`}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-8 pt-8 border-t border-white/12 space-y-6"
              >
                <div
                  className="rounded-3xl border p-6 sm:p-8 relative overflow-hidden"
                  style={{
                    borderColor: `${resultTheme.themeColor}55`,
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${resultTheme.themeColor}22, rgba(5,5,7,0.95) 75%)`,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-[0.16em] border"
                      style={{
                        color: resultTheme.themeColor,
                        backgroundColor: `${resultTheme.themeColor}18`,
                        borderColor: `${resultTheme.themeColor}45`,
                      }}
                    >
                      Resultado Real • Aniversário {auditResult.year}
                    </span>
                    <span className="font-mono text-[11px] text-white/65">
                      📍 {auditResult.city}
                      {auditResult.sunSign ? ` • Sol em ${auditResult.sunSign}` : ""}
                    </span>
                  </div>

                  <h3 className="font-ps-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
                    Casa {resultShowcase.numberLabel} — {resultShowcase.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-5">
                    {resultShowcase.cycleFocus}
                  </p>

                  {auditResult.usedApproximateTime && (
                    <div className="mb-5 rounded-xl border border-[#F5B041]/30 bg-[#F5B041]/10 px-3.5 py-2.5 text-xs text-[#FFF3D1]">
                      Cálculo feito com horário aproximado (12:00). Para precisão
                      cirúrgica do Ascendente e das cúspides, confira sua certidão
                      de nascimento.
                    </div>
                  )}

                  {/* Como aparece na prática (3 cenas concretas) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    {resultShowcase.inPractice.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-black/45 p-4"
                      >
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] block mb-1"
                          style={{ color: resultTheme.themeColor }}
                        >
                          0{idx + 1} • {item.area}
                        </span>
                        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
                          {item.example}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Manual de Defesa da Cidade Natal */}
                  <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Shield className="w-4 h-4 text-[#F5B041]" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF3D1]">
                        Manual de Defesa da Cidade ({auditResult.city})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] leading-relaxed">
                      <div className="rounded-xl bg-black/35 border border-emerald-500/20 p-3.5">
                        <strong className="text-emerald-300 block mb-1">
                          O que aproveitar neste ciclo:
                        </strong>
                        <span className="text-white/80">{resultDefense.strength}</span>
                      </div>
                      <div className="rounded-xl bg-black/35 border border-amber-500/20 p-3.5">
                        <strong className="text-amber-300 block mb-1">
                          Ponto cego para evitar:
                        </strong>
                        <span className="text-white/80">{resultDefense.blindSpot}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GATILHO DE VALIDAÇÃO REVERSA → PONTE PARA O PRÓXIMO ANIVERSÁRIO */}
                <div className="rounded-2xl border border-[#F5B041]/35 bg-[#F5B041]/[0.08] p-5 sm:p-6 text-center space-y-4">
                  <h4 className="font-ps-display text-lg sm:text-xl font-bold text-white">
                    Bateu com o que você viveu (ou deixou de aproveitar) em{" "}
                    {auditResult.year}?
                  </h4>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl mx-auto">
                    Se o passado fez sentido, imagine escolher{" "}
                    <strong className="text-white">de propósito</strong> qual Casa
                    você quer ativar no seu próximo aniversário — seja na sua
                    região ou em outra cidade do mundo.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setValidatedMatch(true);
                        scrollToSection(housesRef);
                      }}
                      className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#F5B041] hover:bg-[#F8C86A] text-[#050507] font-ps-display font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span>Sim, bateu! Quero escolher meu próximo ano</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditResult(null)}
                      className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-white/85 text-xs font-semibold uppercase tracking-[0.14em]"
                    >
                      Testar outro ano / cidade
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. QUEBRA DE OBJEÇÃO: MOBILIDADE & ORÇAMENTO ("NÃO POSSO VIAJAR")     */}
      {/* ===================================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="rounded-3xl border border-white/10 bg-[#0A0B10]/90 p-6 sm:p-8 md:p-10">
          <div className="max-w-2xl mb-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
              Zero Obrigação de Gastar Fortuna
            </span>
            <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              “Não posso ir para a Europa no meu aniversário. Serve pra mim?”
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Sim. Você decide o raio que cabe no seu bolso — e até se ficar em
              casa recebe estratégia clara para o ano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <Home className="w-5 h-5 text-[#F5B041] mb-3" />
              <h3 className="font-ps-display text-base font-bold text-white mb-1.5">
                Ficar na sua cidade
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Você descobre qual Casa vai rodar na sua cidade atual e recebe o{" "}
                <strong className="text-white/90">Manual de Defesa</strong> para
                amenizar pontos cegos e aproveitar o melhor do ciclo.
              </p>
            </div>

            <div className="rounded-2xl border border-[#F5B041]/30 bg-[#F5B041]/[0.05] p-5">
              <Car className="w-5 h-5 text-[#F5B041] mb-3" />
              <h3 className="font-ps-display text-base font-bold text-white mb-1.5">
                Bate-volta regional (~300 km)
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                Em muitos mapas, mudar para uma cidade vizinha ou outro estado de
                carro/ônibus já altera a Casa do ano sem precisar de passagem
                internacional.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <Globe className="w-5 h-5 text-[#F5B041] mb-3" />
              <h3 className="font-ps-display text-base font-bold text-white mb-1.5">
                Brasil ou Exterior
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Quer planejar uma viagem inesquecível? O sistema lista destinos
                nacionais, acessíveis e internacionais para cada uma das 12 Casas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. VITRINE DAS 12 CASAS (CARROSSEL SNAP NO MOBILE / GRID NO DESKTOP)  */}
      {/* ===================================================================== */}
      <section
        ref={housesRef}
        id="escolher-casa-v3"
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
              Passo 2 • Escolha Seu Próximo Ciclo
            </span>
            <h2 className="font-ps-display text-2xl sm:text-4xl font-bold text-white leading-tight mb-2">
              Qual dessas 12 Casas você quer viver no próximo ano?
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Linguagem direta da vida real. Deslize no celular ou escolha um
              card para pré-selecionar seu objetivo.
            </p>
          </div>
          <Link
            to="/casas"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5B041] hover:text-[#FFF3D1]"
          >
            <span>Abrir página completa das 12 Casas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile: horizontal snap carousel; Desktop: 3-col grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0">
          {HOUSES_SHOWCASE.map((house) => {
            const Icon = ICON_MAP[house.iconKey];
            const themeHex = houseThemes[house.id]?.themeColor || "#F5B041";
            const elStyle = ELEMENT_STYLES[house.element];
            const isSelected = selectedNextHouse === house.id;

            return (
              <div
                key={house.id}
                onClick={() => {
                  setSelectedNextHouse(house.id);
                }}
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
      {/* 5. ESCADA DE PREÇOS CRISTALINA (R$ 19,90 / R$ 49,90 / R$ 99,90)       */}
      {/* ===================================================================== */}
      <section
        ref={pricingRef}
        id="planos-v3"
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 scroll-mt-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block mb-2">
            Passo 3 • Sem Confusão de Planos
          </span>
          <h2 className="font-ps-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            Escolha exatamente o que você precisa
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Todas as opções já incluem{" "}
            <strong className="text-white">todas as 8 áreas da vida abertas</strong>.
            A única diferença é quantas Casas ou destinos você quer desbloquear.
          </p>
          {selectedNextHouse && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F5B041]/45 bg-[#F5B041]/12 text-xs text-[#FFF3D1]">
              <Target className="w-3.5 h-3.5 text-[#F5B041]" />
              <span>
                Pré-selecionado:{" "}
                <strong>
                  Casa {String(selectedNextHouse).padStart(2, "0")} —{" "}
                  {HOUSES_SHOWCASE.find((h) => h.id === selectedNextHouse)?.title}
                </strong>
              </span>
            </div>
          )}
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
                1 destino específico para o seu aniversário.
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

          {/* R$ 49,90 — MAIS ESCOLHIDO */}
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
                Perfeito para comparar até 3 destinos que cabem na sua agenda ou
                explorar 3 Casas diferentes antes de comprar passagem.
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
                  <span>3 créditos livres para testar Cidades ou Casas</span>
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

          {/* R$ 99,90 — MAPA COMPLETO */}
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

        {/* SELO DE AUTORIDADE TÉCNICA SWISS EPHEMERIS */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#F5B041] shrink-0" />
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              <strong className="text-white">
                Cálculo astronômico de precisão (Swiss Ephemeris):
              </strong>{" "}
              não é signo solar genérico de portal — calculamos a coordenada
              geográfica exata do minuto da sua Revolução Solar. Pagamento seguro
              via Pix ou Cartão no Mercado Pago.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. TRANSPARÊNCIA, PARCEIROS (COMPLIANCE CONAR) & FAQ                  */}
      {/* ===================================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-16 space-y-12">
        {/* Bloco Parceiros com Compliance Transparente */}
        <div className="rounded-3xl border border-[#F5B041]/25 bg-[#0A0B10]/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5B041] font-bold block">
              Parceiros & Criadores • 20% no Pix
            </span>
            <h3 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
              Regra de ouro: Sentir → Medir → Recomendar
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

        {/* FAQ */}
        <div>
          <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white text-center mb-6">
            Dúvidas antes de começar
          </h2>
          <Accordion type="single" collapsible defaultValue="v3-faq-free-map" className="space-y-3">
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

      {/* ===================================================================== */}
      {/* 7. STICKY MOBILE BAR NA ZONA DO POLEGAR (APÓS ROLAR A HERO)           */}
      {/* ===================================================================== */}
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
                  {validatedMatch || auditResult
                    ? "Planeje seu próximo ano"
                    : "Teste seu passado grátis"}
                </p>
                <p className="text-[10px] text-[#94A3B8] truncate">
                  {validatedMatch || auditResult
                    ? "Planos a partir de R$ 19,90"
                    : "Veja se bate com o que viveu"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  scrollToSection(
                    validatedMatch || auditResult ? pricingRef : validatorRef
                  )
                }
                className="shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-[#F5B041] active:scale-[0.98] text-[#050507] text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-1.5"
              >
                <span>
                  {validatedMatch || auditResult ? "Ver Planos" : "Testar Grátis"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
