import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Crown,
  Gift,
  Globe,
  MapPin,
  Pause,
  Plane,
  Play,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import ScanningOverlay from "@/components/ScanningOverlay";
import { HouseVideoPreview } from "@/components/HouseVideoPreview";
import { MobileHomeFlow } from "@/components/mobile/MobileHomeFlow";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import { getHousePalette } from "@/data/housePalette";
import { getCurrentSolarYear } from "@/lib/astro";
import { prewarmSolarApi, runFreePastAudit } from "@/lib/pastAuditClient";
import { saveStoredAffiliateRef } from "@/lib/affiliates";
import {
  FREE_PAST_STORAGE_KEY,
  type StoredFreePastPayload,
} from "@/pages/FreePastResult";
import { type SupportedLocale, useI18n } from "@/lib/i18n";
import { toast } from "sonner";

interface LandingV3Props {
  embeddedInShell?: boolean;
}

interface BoardingDestination {
  id: string;
  code: string;
  coords: string;
  cityLabel: Record<SupportedLocale, string>;
  countryLabel: Record<SupportedLocale, string>;
  houseNum: number;
  houseCode: string;
  videoSrc: string;
  posterSrc: string;
}

// Exemplo individual do personagem Theo (19/08 · 14:35 · São Paulo)
const BOARDING_DESTINATIONS: BoardingDestination[] = [
  {
    id: "zurich",
    code: "ZRH",
    coords: "47°22'N · 08°32'E",
    cityLabel: { pt: "Zurique", es: "Zúrich", en: "Zurich", fr: "Zurich", it: "Zurigo" },
    countryLabel: { pt: "Suíça", es: "Suiza", en: "Switzerland", fr: "Suisse", it: "Svizzera" },
    houseNum: 2,
    houseCode: "02",
    videoSrc: "/videos/v3/theo-zurique-v3.mp4",
    posterSrc: "/videos/v3/theo-zurique-v3-poster.jpg",
  },
  {
    id: "rome",
    code: "FCO",
    coords: "41°54'N · 12°29'E",
    cityLabel: { pt: "Roma", es: "Roma", en: "Rome", fr: "Rome", it: "Roma" },
    countryLabel: { pt: "Itália", es: "Italia", en: "Italy", fr: "Italie", it: "Italia" },
    houseNum: 5,
    houseCode: "05",
    videoSrc: "/videos/v3/theo-roma-v3.mp4",
    posterSrc: "/videos/v3/theo-roma-v3-poster.jpg",
  },
  {
    id: "paris",
    code: "CDG",
    coords: "48°51'N · 02°21'E",
    cityLabel: { pt: "Paris", es: "París", en: "Paris", fr: "Paris", it: "Parigi" },
    countryLabel: { pt: "França", es: "Francia", en: "France", fr: "France", it: "Francia" },
    houseNum: 7,
    houseCode: "07",
    videoSrc: "/videos/v3/theo-paris-v3.mp4",
    posterSrc: "/videos/v3/theo-paris-v3-poster.jpg",
  },
  {
    id: "ny",
    code: "JFK",
    coords: "40°43'N · 74°00'W",
    cityLabel: { pt: "Nova York", es: "Nueva York", en: "New York", fr: "New York", it: "New York" },
    countryLabel: { pt: "EUA", es: "EE. UU.", en: "USA", fr: "USA", it: "USA" },
    houseNum: 10,
    houseCode: "10",
    videoSrc: "/videos/v3/theo-ny-v3.mp4",
    posterSrc: "/videos/v3/theo-ny-v3-poster.jpg",
  },
];

type GoalFilter = "all" | "money" | "love" | "peace" | "world";

const GOAL_TABS: {
  id: GoalFilter;
  color: string;
  label: Record<SupportedLocale, string>;
}[] = [
  {
    id: "all",
    color: "#EAB344",
    label: { pt: "Todas as 12", es: "Las 12 Casas", en: "All 12 Houses", fr: "Les 12 Maisons", it: "Tutte le 12" },
  },
  {
    id: "money",
    color: "#10B981",
    label: { pt: "Dinheiro & Carreira", es: "Dinero y Carrera", en: "Wealth & Career", fr: "Argent & Carrière", it: "Denaro & Carriera" },
  },
  {
    id: "love",
    color: "#F43F5E",
    label: { pt: "Amor & Alianças", es: "Amor y Alianzas", en: "Love & Partnerships", fr: "Amour & Alliances", it: "Amore & Alleanze" },
  },
  {
    id: "peace",
    color: "#38BDF8",
    label: { pt: "Lar, Saúde & Paz", es: "Hogar, Salud y Paz", en: "Home, Health & Peace", fr: "Foyer, Santé & Paix", it: "Casa, Salute & Pace" },
  },
  {
    id: "world",
    color: "#8B5CF6",
    label: { pt: "Recomeço & Mundo", es: "Reinicio y Mundo", en: "Fresh Start & World", fr: "Renouveau & Monde", it: "Ripartenza & Mondo" },
  },
];

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
  const { locale, t } = useI18n();

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

  // Act 1 — Interactive Solar Boarding Ticket state
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const activeDest = BOARDING_DESTINATIONS[activeDestIndex] || BOARDING_DESTINATIONS[0];
  const activeDestCopy = t.houses[activeDest.houseNum];
  const activeDestPalette = getHousePalette(activeDest.houseNum);

  // Official 1m30 Film Lightbox Modal
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [filmPlaying, setFilmPlaying] = useState(true);
  const [filmMuted, setFilmMuted] = useState(false);

  const openFilmModal = () => {
    setFilmModalOpen(true);
    setFilmPlaying(true);
    setFilmMuted(false);
  };

  const closeFilmModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setFilmModalOpen(false);
  };

  // Act 3 — 12 Houses Interactive Chromatic Stage
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("all");
  const [selectedHouseId, setSelectedHouseId] = useState<number>(2);

  const filteredHouses = useMemo(() => {
    if (goalFilter === "all") return HOUSES_SHOWCASE;
    return HOUSES_SHOWCASE.filter((h) => getHousePalette(h.id).goalGroup === goalFilter);
  }, [goalFilter]);

  useEffect(() => {
    if (!filteredHouses.some((h) => h.id === selectedHouseId) && filteredHouses[0]) {
      setSelectedHouseId(filteredHouses[0].id);
    }
  }, [filteredHouses, selectedHouseId]);

  const activeHouse = useMemo(
    () => HOUSES_SHOWCASE.find((h) => h.id === selectedHouseId) || HOUSES_SHOWCASE[1],
    [selectedHouseId]
  );
  const activeHouseCopy = t.houses[activeHouse.id];
  const activeHousePalette = getHousePalette(activeHouse.id);

  // Act 4 — Free Past Birthday 4-Step Check-In State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
    if (birthDate) {
      setPastYear(getCurrentSolarYear(birthDate));
    }
  }, [birthDate]);

  const [pastCity, setPastCity] = useState("");
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>(undefined);
  const [calculating, setCalculating] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleNextStep1 = () => {
    if (!firstName.trim()) {
      toast.error("Informe seu primeiro nome.");
      return;
    }
    if (!birthDate) {
      toast.error("Selecione sua data de nascimento.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!unknownTime && !birthTime) {
      toast.error("Informe o horário ou marque 12:00 aproximado.");
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!birthCity.trim() || (!birthCityValid && birthCity.trim().length < 3)) {
      toast.error("Digite e selecione sua cidade natal.");
      return;
    }
    setStep(4);
  };

  const handleOpenSamplePastReport = () => {
    const samplePayload: StoredFreePastPayload = {
      userName: firstName.trim() || "Theo",
      birthDate: "1990-08-19",
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
      nextStayHouse: 4,
      usedApproximateTime: false,
    };
    sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(samplePayload));
    navigate("/meu-passado");
  };

  const handleCalculatePast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastCity.trim()) {
      toast.error("Informe a cidade onde você passou seu aniversário.");
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
        pastCity,
        pastCoords,
      });
      sessionStorage.setItem(FREE_PAST_STORAGE_KEY, JSON.stringify(payload));
      navigate("/meu-passado");
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Não foi possível concluir o cálculo agora. Confira as cidades informadas e tente novamente."
      );
    } finally {
      setCalculating(false);
    }
  };

  const handleSelectPlan = (pkg: "1" | "3" | "full") => {
    navigate(`/credits?pkg=${pkg}&returnTo=${encodeURIComponent("/?mode=futuro")}`);
  };

  const pricingTickets = [
    {
      pkg: "1" as const,
      featured: false,
      passCode: "PASS · 01",
      stubColor: "#10B981",
      stubSoft: "rgba(16, 185, 129, 0.14)",
      priceInt: "19",
      priceDec: "90",
      copy: t.pricing.plans.single,
    },
    {
      pkg: "3" as const,
      featured: true,
      passCode: "PASS · 03",
      stubColor: "#EAB344",
      stubSoft: "rgba(234, 179, 68, 0.16)",
      priceInt: "49",
      priceDec: "90",
      copy: t.pricing.plans.triple,
    },
    {
      pkg: "full" as const,
      featured: false,
      passCode: "PASS · 12",
      stubColor: "#8B5CF6",
      stubSoft: "rgba(139, 92, 246, 0.15)",
      priceInt: "99",
      priceDec: "90",
      copy: t.pricing.plans.full,
    },
  ];

  const yearOptions = Array.from({ length: 8 }, (_, idx) => String(currentYear - idx));

  return (
    <div
      className={`min-h-screen bg-[#060911] text-[#F8FAFC] font-sans overflow-x-hidden ${
        embeddedInShell ? "" : "pt-20"
      }`}
    >
      <ScanningOverlay visible={calculating} mode="passado" />

      {/* =====================================================================
          ACT 1 — ORBITAL EARTH SUNRISE + PHYSICAL PERFORATED SOLAR TICKET
          ===================================================================== */}
      <section className="relative min-h-[calc(100svh-80px)] flex items-center py-14 overflow-hidden bg-[#05070D]">
        {/* Full-Viewport Orbital Earth Sunrise Cinema Backdrop */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <video
            src="/videos/v3/terra-sunrise.mp4"
            poster="/videos/v3/terra-sunrise-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-55 scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070D] via-[#05070D]/82 to-[#05070D]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]/60" />
          {/* Dynamic Per-House Chromatic Aura on Right Side */}
          <div
            className="absolute -right-24 top-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full blur-[130px] transition-all duration-700"
            style={{ background: activeDestPalette.glowRgba }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* LEFT 6/12 — Editorial Proposition + Clear Dual Actions */}
            <div className="col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md text-[#F8FAFC] text-[11px] font-mono font-semibold uppercase tracking-[0.14em] mb-6">
                <span
                  className="w-2 h-2 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: activeDestPalette.hex }}
                />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="font-display text-[52px] xl:text-[58px] font-bold text-[#F8FAFC] tracking-[-0.025em] leading-[1.05] mb-5">
                {t.hero.titleStart}
                <span className="text-[#F3DC9B] italic font-semibold">
                  {t.hero.titleHighlight}
                </span>
                {t.hero.titleEnd}
              </h1>

              <p className="text-[17px] text-[#CBD5E1] leading-[1.62] max-w-[540px] mb-8">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <a
                  href="#consulta-gratuita"
                  className="inline-flex items-center gap-3 h-[54px] px-7 rounded-full bg-gradient-to-b from-[#F7D774] to-[#E5A935] text-[#080B12] font-sans font-bold text-[15px] shadow-[0_14px_34px_rgba(234,179,68,0.34)] hover:brightness-105 active:scale-[0.985] transition-all"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={openFilmModal}
                  className="inline-flex items-center gap-2.5 h-[54px] px-6 rounded-full border border-white/18 bg-white/[0.06] hover:bg-white/[0.11] backdrop-blur-md text-[#F8FAFC] font-sans font-semibold text-[14px] transition-all active:scale-[0.985]"
                >
                  <span className="w-7 h-7 rounded-full bg-[#EAB344]/20 border border-[#EAB344]/50 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-[#F3DC9B] fill-[#F3DC9B] ml-0.5" />
                  </span>
                  <span>{t.hero.ctaFilm}</span>
                </button>
              </div>

              {/* Crisp 3-pillar micro-bar — aligned to left margin */}
              <div className="grid grid-cols-3 gap-5 pt-6 border-t border-white/12 w-full">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#F3DC9B] font-semibold">
                    100% Gratuito
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Teste seu último aniversário sem cartão
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6EE7B7] font-semibold">
                    Cálculo Individual
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Suas cidades mudam conforme sua certidão
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#93C5FD] font-semibold">
                    Perto ou Longe
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Opções no seu estado, Brasil ou exterior
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 6/12 — Tactile Perforated Airline-Style Solar Boarding Pass */}
            <div className="col-span-6">
              <div className="relative rounded-[28px] bg-[#FAF6EE] text-[#111520] shadow-[0_32px_90px_rgba(0,0,0,0.65)] overflow-hidden border border-white/25">
                {/* Top Colored Airline Header Bar (shifts live per House!) */}
                <div
                  className="px-6 py-3.5 flex items-center justify-between text-white transition-colors duration-500"
                  style={{ backgroundColor: activeDestPalette.hex }}
                >
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                      {t.hero.passHeader}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.1em] opacity-95">
                    {activeDest.coords}
                  </span>
                </div>

                {/* Live Destination Video Window */}
                <div className="relative aspect-[16/9] w-full bg-[#090D16] overflow-hidden">
                  <video
                    key={activeDest.videoSrc}
                    src={activeDest.videoSrc}
                    poster={activeDest.posterSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                  {/* Route Overlay inside Video Bottom */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/75">
                        {t.hero.destinationLabel}
                      </p>
                      <div className="flex items-baseline gap-2.5 mt-0.5">
                        <span className="font-display text-3xl font-bold tracking-tight">
                          {activeDest.cityLabel[locale]}
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
                          {activeDest.code}
                        </span>
                      </div>
                    </div>

                    <div
                      className="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg transition-colors duration-500"
                      style={{ backgroundColor: activeDestPalette.hex }}
                    >
                      CASA {activeDest.houseCode}
                    </div>
                  </div>
                </div>

                {/* Perforated Tear Seam with Real Semicircular Notches */}
                <div className="relative flex items-center justify-between px-3 py-1 bg-[#FAF6EE]">
                  <span className="w-5 h-5 rounded-full bg-[#05070D] -ml-5 shrink-0" />
                  <div className="w-full border-t-2 border-dashed border-[#111520]/18 mx-2" />
                  <span className="w-5 h-5 rounded-full bg-[#05070D] -mr-5 shrink-0" />
                </div>

                {/* Boarding Pass Telemetry Body on Warm Ivory Paper */}
                <div className="px-6 pt-3 pb-6 bg-[#FAF6EE]">
                  <div className="grid grid-cols-12 gap-4 items-center pb-4 border-b border-[#111520]/10">
                    <div className="col-span-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111520]/55 font-semibold">
                        ORIGEM NATAL (FIXA)
                      </p>
                      <p className="font-sans text-sm font-bold text-[#111520] mt-0.5">
                        São Paulo · 19/08
                      </p>
                      <p className="text-[11px] text-[#111520]/60">14:35 · Exemplo do Theo</p>
                    </div>

                    <div className="col-span-8 rounded-2xl px-4 py-3 border transition-colors duration-500"
                      style={{
                        backgroundColor: activeDestPalette.lightBg,
                        borderColor: `${activeDestPalette.hex}35`,
                      }}
                    >
                      <p
                        className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold"
                        style={{ color: activeDestPalette.lightText }}
                      >
                        {t.hero.focusLabel} · CASA {activeDest.houseCode}
                      </p>
                      <p className="font-sans text-base font-bold text-[#111520] mt-0.5">
                        {activeDestCopy.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-[#111520]/65 mt-3.5 mb-2.5">
                    {t.hero.tapCityHint}
                  </p>

                  {/* 4 Color-Coded Destination Tabs */}
                  <div className="grid grid-cols-4 gap-2">
                    {BOARDING_DESTINATIONS.map((dest, idx) => {
                      const isActive = idx === activeDestIndex;
                      const pal = getHousePalette(dest.houseNum);
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => setActiveDestIndex(idx)}
                          className={`rounded-xl px-2.5 py-2.5 text-left border transition-all ${
                            isActive
                              ? "bg-[#111520] text-white border-[#111520] shadow-md -translate-y-0.5"
                              : "bg-white hover:bg-[#F1ECE1] text-[#111520] border-[#111520]/12"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold truncate">
                              {dest.cityLabel[locale]}
                            </span>
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: pal.hex }}
                            />
                          </div>
                          <span
                            className={`block font-mono text-[10px] mt-0.5 ${
                              isActive ? "text-white/75" : "text-[#111520]/55"
                            }`}
                          >
                            Casa {dest.houseCode}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 2 — WARM SUNLIT TRAVERTINE ATLAS: 1 PESSOA · 3 COORDENADAS · 3 ANOS
          ===================================================================== */}
      <section className="py-24 bg-[#F4EFE6] text-[#111520] border-t border-[#111520]/10">
        <div className="max-w-[1240px] mx-auto px-8">
          {/* Top Architectural Bar (Left Headline · Right Individual Notice) */}
          <div className="grid grid-cols-12 gap-10 items-end mb-14 pb-8 border-b border-[#111520]/12">
            <div className="col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111520] text-[#F7D774] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>{t.film.reelsBadge}</span>
              </div>
              <h2 className="font-display text-[40px] leading-[1.08] tracking-[-0.02em] font-bold text-[#111520]">
                {t.film.reelsTitle}
              </h2>
            </div>
            <div className="col-span-5">
              <p className="text-[15px] text-[#111520]/75 leading-relaxed">
                {t.film.reelsSubtitle}
              </p>
            </div>
          </div>

          {/* 5/7 Split: Left Flight Route Atlas + Video Card · Right 3 Perforated Boarding Tickets */}
          <div className="grid grid-cols-12 gap-10 items-stretch">
            {/* LEFT 5/12 — Dotted World Flight Route Card + 1m30 Film Trigger + Skeptic Contrast */}
            <div className="col-span-5 flex flex-col justify-between gap-6">
              {/* Interactive Route Telemetry Card (Inspired by Airline Route UI) */}
              <div className="rounded-[26px] bg-[#FFFDF9] border border-[#111520]/12 p-7 shadow-[0_18px_45px_rgba(17,21,32,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#111520]/55">
                    SIMULAÇÃO REAL · MESMA CERTIDÃO
                  </span>
                  <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#111520]/6 text-[#111520]">
                    19/08 · 14:35 · SP
                  </span>
                </div>

                {/* Dotted Flight Arcs SVG */}
                <div className="rounded-2xl bg-[#F4EFE6] border border-[#111520]/10 p-5 mb-5">
                  <svg viewBox="0 0 420 155" className="w-full h-auto" aria-hidden="true">
                    {/* Subtle lat/lon grid lines */}
                    <line x1="20" y1="40" x2="400" y2="40" stroke="#111520" strokeOpacity="0.07" strokeDasharray="3 3" />
                    <line x1="20" y1="85" x2="400" y2="85" stroke="#111520" strokeOpacity="0.07" strokeDasharray="3 3" />
                    <line x1="20" y1="130" x2="400" y2="130" stroke="#111520" strokeOpacity="0.07" strokeDasharray="3 3" />

                    {/* Curved Flight Paths from São Paulo (70, 125) */}
                    <path
                      d="M 72 122 Q 210 18 345 34"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.4"
                      strokeDasharray="5 5"
                    />
                    <path
                      d="M 72 122 Q 225 65 358 78"
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="2.4"
                      strokeDasharray="5 5"
                    />
                    <path
                      d="M 72 122 Q 145 55 215 44"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.4"
                      strokeDasharray="5 5"
                    />

                    {/* Origin Pin: São Paulo */}
                    <circle cx="72" cy="122" r="7" fill="#111520" />
                    <circle cx="72" cy="122" r="13" fill="#111520" fillOpacity="0.12" />
                    <text x="42" y="146" fill="#111520" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">
                      São Paulo (GRU)
                    </text>

                    {/* NY Pin */}
                    <circle cx="215" cy="44" r="6" fill="#3B82F6" />
                    <text x="168" y="28" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">
                      Nova York · C10
                    </text>

                    {/* Zurich Pin */}
                    <circle cx="345" cy="34" r="6" fill="#10B981" />
                    <text x="300" y="20" fill="#065F46" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">
                      Zurique · C02
                    </text>

                    {/* Rome Pin */}
                    <circle cx="358" cy="78" r="6" fill="#EAB308" />
                    <text x="322" y="100" fill="#854D0E" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">
                      Roma · C05
                    </text>
                  </svg>
                </div>

                {/* Skeptic Proof Contrast inside Card */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F4EFE6]/80 p-3.5 border border-[#111520]/8">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111520]/50">
                      {t.pricing.contrast.freeLabel}
                    </p>
                    <p className="text-xs font-bold text-[#111520] mt-1">
                      {t.pricing.contrast.freeTitle}
                    </p>
                    <p className="text-[11px] text-[#111520]/65 mt-1 leading-snug">
                      Sempre igual a vida inteira, sem considerar onde você está.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#111520] text-white p-3.5">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#F7D774]">
                      {t.pricing.contrast.solarLabel}
                    </p>
                    <p className="text-xs font-bold text-white mt-1">
                      Muda a cada aniversário
                    </p>
                    <p className="text-[11px] text-white/75 mt-1 leading-snug">
                      Recalcula a posição exata do Sol na cidade onde você vira o ano.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Cinema Trigger Card — 1m30 Film without giant black page hole */}
              <button
                type="button"
                onClick={openFilmModal}
                className="group relative rounded-[26px] overflow-hidden bg-[#111520] text-left p-6 flex items-center gap-5 shadow-[0_18px_45px_rgba(17,21,32,0.14)] hover:-translate-y-0.5 transition-all"
              >
                <div className="relative w-28 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/15">
                  <img
                    src="/videos/v3/filme-protocolo-16x9-v3-poster.jpg"
                    alt="Filme Oficial Protocolo Solar"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-[#F7D774] text-[#111520] flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-[#111520] ml-0.5" />
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#F7D774]">
                    FILME EXPLICATIVO · 1M30
                  </span>
                  <p className="font-display text-lg font-bold text-white leading-snug mt-0.5">
                    {t.film.titleStart}
                    {t.film.titleHighlight}
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    Clique para assistir com áudio em tela cheia →
                  </p>
                </div>
              </button>
            </div>

            {/* RIGHT 7/12 — 3 Physical Perforated Boarding-Pass Examples (Theo's Map) */}
            <div className="col-span-7 flex flex-col justify-between gap-4">
              {[BOARDING_DESTINATIONS[0], BOARDING_DESTINATIONS[1], BOARDING_DESTINATIONS[3]].map(
                (dest) => {
                  const pal = getHousePalette(dest.houseNum);
                  const houseCopy = t.houses[dest.houseNum];
                  return (
                    <div
                      key={dest.id}
                      className="group relative rounded-[24px] bg-[#FFFDF9] border border-[#111520]/12 shadow-[0_14px_36px_rgba(17,21,32,0.06)] hover:shadow-[0_20px_48px_rgba(17,21,32,0.11)] transition-all overflow-hidden grid grid-cols-12 items-stretch"
                    >
                      {/* Colored Left Airline Stub */}
                      <div
                        className="col-span-1 flex flex-col items-center justify-center py-4 text-white"
                        style={{ backgroundColor: pal.hex }}
                      >
                        <span className="font-mono text-[11px] font-bold tracking-[0.18em] -rotate-90 whitespace-nowrap">
                          CASA {dest.houseCode}
                        </span>
                      </div>

                      {/* Live Theo City Video Thumbnail */}
                      <div className="col-span-4 relative bg-[#090D16] overflow-hidden">
                        <video
                          src={dest.videoSrc}
                          poster={dest.posterSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                          GRU ✈ {dest.code}
                        </div>
                      </div>

                      {/* Ticket Content + Perforated Divider */}
                      <div className="col-span-7 p-5 pl-6 flex flex-col justify-between border-l-2 border-dashed border-[#111520]/12">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
                              style={{
                                backgroundColor: pal.lightBg,
                                color: pal.lightText,
                              }}
                            >
                              {dest.cityLabel[locale]} · {dest.countryLabel[locale]}
                            </span>
                            <span className="font-mono text-[10px] text-[#111520]/45 font-semibold">
                              {dest.coords}
                            </span>
                          </div>

                          <h3 className="font-display text-[22px] font-bold text-[#111520] leading-snug">
                            {houseCopy.title}
                          </h3>
                          <p className="text-[13px] text-[#111520]/70 leading-relaxed mt-1 line-clamp-2">
                            {houseCopy.focus}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#111520]/8 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#111520]/55">
                            No mapa do Theo cai em {dest.cityLabel[locale]}
                          </span>
                          <Link
                            to={`/casas/${dest.houseNum}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#111520] hover:opacity-75"
                          >
                            <span>Ver Casa {dest.houseCode}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

              {/* Clear Individualization Notice Bar */}
              <div className="rounded-2xl bg-[#EAE2D3] border border-[#111520]/12 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#92400E] shrink-0" />
                  <p className="text-xs font-semibold text-[#111520]">
                    Importante: {t.film.sameBirthNotice}. Se para o Theo a Casa 02 fica em Zurique, para você pode ficar em Lisboa, Florianópolis ou Curitiba.
                  </p>
                </div>
                <a
                  href="#consulta-gratuita"
                  className="shrink-0 ml-4 text-xs font-bold underline text-[#111520] hover:opacity-75"
                >
                  Calcular meu mapa →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 3 — LIVING 12-COLOR CELESTIAL STAGE: AS 12 CASAS SOLARES
          ===================================================================== */}
      <section className="relative py-24 bg-[#060911] text-[#F8FAFC] overflow-hidden">
        {/* Dynamic Per-House Chromatic Ambient Flood (08-paleta-casas.md) */}
        <div
          className="pointer-events-none absolute -top-32 right-0 w-[780px] h-[780px] rounded-full blur-[150px] transition-all duration-700"
          style={{ background: activeHousePalette.glowRgba }}
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-32 w-[620px] h-[620px] rounded-full blur-[150px] transition-all duration-700 opacity-60"
          style={{ background: activeHousePalette.glowRgba }}
        />

        <div className="relative z-10 max-w-[1240px] mx-auto px-8">
          {/* Full-Width Architectural Header + Multi-Color Life Goal Filter */}
          <div className="flex items-end justify-between gap-8 mb-10 pb-7 border-b border-white/10">
            <div className="max-w-[580px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.05] text-xs font-mono font-semibold uppercase tracking-[0.14em] text-[#F8FAFC] mb-4">
                <Crown className="w-3.5 h-3.5" style={{ color: activeHousePalette.hex }} />
                <span>{t.housesSection.badge}</span>
              </div>
              <h2 className="font-display text-[42px] font-bold leading-[1.08] tracking-[-0.02em] text-white">
                {t.housesSection.titleStart}
                <span className="italic font-semibold" style={{ color: activeHousePalette.softHex }}>
                  {t.housesSection.titleHighlight}
                </span>
              </h2>
              <p className="text-[15px] text-[#CBD5E1] mt-2.5 leading-relaxed">
                Escolha o tema que você quer destravar no próximo ciclo. Zero cidades fixas: calculamos onde cada Casa cai exclusivamente para os seus dados.
              </p>
            </div>

            {/* Life-Goal Filter Tabs */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {GOAL_TABS.map((tab) => {
                const active = goalFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setGoalFilter(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-bold transition-all ${
                      active
                        ? "bg-white text-[#070A12] shadow-lg"
                        : "bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-[#E2E8F0]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tab.color }}
                    />
                    <span>{tab.label[locale]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEATURED INTERACTIVE SPOTLIGHT STAGE (7/5 Split) */}
          <div
            className="rounded-[28px] border bg-[#0B101D]/90 backdrop-blur-xl overflow-hidden mb-10 shadow-[0_28px_80px_rgba(0,0,0,0.55)] transition-colors duration-500 grid grid-cols-12"
            style={{ borderColor: `${activeHousePalette.hex}55` }}
          >
            {/* Left 7/12 — Widescreen Bespoke Celestial Luxury Architectural Cinema Loop */}
            <div className="col-span-7 relative aspect-[16/9] bg-[#05070D] overflow-hidden">
              <HouseVideoPreview
                key={activeHouse.id}
                houseId={activeHouse.id}
                className="w-full h-full object-cover"
                overlayClassName="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B101D]/85"
              />
              <div className="absolute top-5 left-5 flex items-center gap-2.5">
                <span
                  className="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg"
                  style={{ backgroundColor: activeHousePalette.hex }}
                >
                  CASA {activeHouse.numberLabel}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[11px] text-white/90">
                  {activeHousePalette.paletteName} · {t.housesSection.elements[activeHouse.element]}
                </span>
              </div>
            </div>

            {/* Right 5/12 — Color-Tinted Life Impact Readout */}
            <div className="col-span-5 p-8 flex flex-col justify-between">
              <div>
                <p
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] mb-2"
                  style={{ color: activeHousePalette.softHex }}
                >
                  TEMA PROTAGONISTA DO ANO
                </p>
                <h3 className="font-display text-3xl font-bold text-white leading-tight mb-5">
                  {activeHouseCopy.title}
                </h3>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 mb-1">
                      {t.housesSection.forWhoLabel}
                    </p>
                    <p className="text-sm text-[#E2E8F0] leading-relaxed">
                      {activeHouseCopy.profile}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      backgroundColor: activeHousePalette.surfaceTint,
                      borderColor: `${activeHousePalette.hex}40`,
                    }}
                  >
                    <p
                      className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] mb-1"
                      style={{ color: activeHousePalette.softHex }}
                    >
                      {t.housesSection.activatesLabel}
                    </p>
                    <p className="text-sm text-white leading-relaxed">
                      {activeHouseCopy.focus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <Link
                  to={`/casas/${activeHouse.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: activeHousePalette.hex }}
                >
                  <span>Mergulhar na Casa {activeHouse.numberLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/casas"
                  className="text-xs font-semibold text-white/75 hover:text-white underline"
                >
                  {t.housesSection.viewAllBtn}
                </Link>
              </div>
            </div>
          </div>

          {/* 12-HOUSE CHROMATIC MATRIX (4 cols, each with its authentic 08-paleta-casas color) */}
          <div className="grid grid-cols-4 gap-4">
            {filteredHouses.map((house) => {
              const pal = getHousePalette(house.id);
              const copy = t.houses[house.id];
              const isSelected = house.id === activeHouse.id;
              const padded = String(house.id).padStart(2, "0");

              return (
                <div
                  key={house.id}
                  onClick={() => setSelectedHouseId(house.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedHouseId(house.id);
                    }
                  }}
                  className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#121A2D] -translate-y-1 shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
                      : "bg-[#0B101D]/85 hover:bg-[#10182B] border-white/10 hover:-translate-y-0.5"
                  }`}
                  style={isSelected ? { borderColor: pal.hex } : undefined}
                >
                  {/* Top Chromatic Bar + Bespoke Architectural Plate */}
                  <div>
                    <div className="h-1.5 w-full" style={{ backgroundColor: pal.hex }} />
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#05070D]">
                      <img
                        src={`/videos/v3/casa-${padded}-lux-poster.jpg`}
                        alt={`Casa ${house.numberLabel} — ${copy.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/25" />
                      <span
                        className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold text-white shadow"
                        style={{ backgroundColor: pal.hex }}
                      >
                        CASA {house.numberLabel}
                      </span>
                    </div>

                    <div className="p-4">
                      <p
                        className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] mb-1"
                        style={{ color: pal.softHex }}
                      >
                        {copy.shortTag}
                      </p>
                      <h4 className="font-display text-[17px] font-bold text-white leading-snug">
                        {copy.title}
                      </h4>
                    </div>
                  </div>

                  <div className="px-4 pb-3.5 pt-2 border-t border-white/[0.07] flex items-center justify-between">
                    <span className="text-[11px] text-white/55">
                      {isSelected ? "Em exibição no palco" : "Clique p/ prévia"}
                    </span>
                    <Link
                      to={`/casas/${house.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold hover:underline"
                      style={{ color: pal.softHex }}
                    >
                      <span>Abrir</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 4 — WARM TRAVERTINE CHECK-IN TERMINAL (#consulta-gratuita)
          ===================================================================== */}
      <section
        id="consulta-gratuita"
        className="py-24 bg-[#EAE2D3] text-[#111520] border-y border-[#111520]/10 scroll-mt-20"
      >
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* LEFT 5/12 — Skeptic Challenge + Exact Free Deliverables */}
            <div className="col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#065F46] text-white font-mono text-[11px] font-bold uppercase tracking-[0.14em] mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.checkIn.badge}</span>
              </div>

              <h2 className="font-display text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-[#111520] mb-4">
                {t.checkIn.titleStart}
                <span className="italic text-[#92400E]">{t.checkIn.titleHighlight}</span>
              </h2>

              <p className="text-[15px] text-[#111520]/75 leading-relaxed mb-7">
                {t.checkIn.subtitle}
              </p>

              {/* 3 Numbered Proof Deliverables */}
              <div className="space-y-3.5 mb-7">
                {[
                  {
                    num: "01",
                    title: "Qual Casa comandou o seu último ano",
                    desc: "Cálculo astronômico real pela latitude e longitude onde você virou o aniversário.",
                  },
                  {
                    num: "02",
                    title: "Leitura aberta das 8 áreas da vida",
                    desc: "Amor, dinheiro, carreira, saúde e rotina destrinchados sem pedir cartão nem cadastro.",
                  },
                  {
                    num: "03",
                    title: "Alerta do próximo aniversário na sua cidade",
                    desc: "Veja qual Casa será ativada se você não viajar na próxima virada.",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="rounded-2xl bg-[#FFFDF9]/85 border border-[#111520]/10 p-4 flex items-start gap-3.5"
                  >
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#111520] text-[#F7D774] shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#111520]">{item.title}</p>
                      <p className="text-xs text-[#111520]/65 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleOpenSamplePastReport}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#111520] underline hover:opacity-75"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#92400E]" />
                <span>{t.checkIn.samplePreviewBtn}</span>
              </button>
            </div>

            {/* RIGHT 7/12 — Tactile Airline Check-In Terminal Card */}
            <div className="col-span-7">
              <div className="rounded-[28px] bg-[#FFFDF9] border border-[#111520]/14 shadow-[0_28px_70px_rgba(17,21,32,0.12)] overflow-hidden">
                {/* Terminal Top Header */}
                <div className="bg-[#111520] text-white px-8 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#F7D774]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
                      CHECK-IN SOLAR GRATUITO · PASSADO REAL
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          if (n < step) setStep(n as 1 | 2 | 3 | 4);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          n === step
                            ? "w-8 bg-[#F7D774]"
                            : n < step
                            ? "w-4 bg-[#10B981] cursor-pointer"
                            : "w-4 bg-white/20"
                        }`}
                        aria-label={`${t.checkIn.stepOf} ${n}`}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCalculatePast} className="p-8">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#92400E]">
                      {t.checkIn.stepOf} 0{step} / 04
                    </span>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                        className="text-xs font-bold text-[#111520]/65 hover:text-[#111520]"
                      >
                        ← Voltar etapa
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="s1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <h3 className="font-display text-2xl font-bold text-[#111520]">
                          {t.checkIn.step1Title}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                              {t.checkIn.nameLabel}
                            </label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder={t.checkIn.namePlaceholder}
                              className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-[#111520] placeholder:text-[#111520]/35 text-sm font-medium focus:outline-none focus:border-[#B8861E] focus:ring-2 focus:ring-[#D99B26]/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                              {t.checkIn.birthDateLabel}
                            </label>
                            <input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              max={`${currentYear - 1}-12-31`}
                              className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-[#111520] text-sm font-medium focus:outline-none focus:border-[#B8861E] focus:ring-2 focus:ring-[#D99B26]/30 [color-scheme:light]"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleNextStep1}
                          className="w-full h-[52px] rounded-xl bg-[#111520] hover:bg-[#1C2233] text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                        >
                          <span>{t.checkIn.continueBtn}</span>
                          <ArrowRight className="w-4 h-4 text-[#F7D774]" />
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <h3 className="font-display text-2xl font-bold text-[#111520]">
                          {t.checkIn.step2Title}
                        </h3>
                        <div>
                          <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                            {t.checkIn.birthTimeLabel}
                          </label>
                          <input
                            type="time"
                            value={unknownTime ? "12:00" : birthTime}
                            disabled={unknownTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-4 text-[#111520] text-sm font-medium disabled:opacity-45 focus:outline-none focus:border-[#B8861E] [color-scheme:light]"
                          />
                        </div>

                        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F4EFE6] border border-[#111520]/10 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={unknownTime}
                            onChange={(e) => setUnknownTime(e.target.checked)}
                            className="mt-0.5 rounded accent-[#111520]"
                          />
                          <div>
                            <span className="block text-xs font-bold text-[#111520]">
                              {t.checkIn.unknownTimeLabel}
                            </span>
                            <span className="block text-[11px] text-[#111520]/65 mt-0.5">
                              {t.checkIn.unknownTimeNote}
                            </span>
                          </div>
                        </label>

                        <button
                          type="button"
                          onClick={handleNextStep2}
                          className="w-full h-[52px] rounded-xl bg-[#111520] hover:bg-[#1C2233] text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                        >
                          <span>{t.checkIn.continueBtn}</span>
                          <ArrowRight className="w-4 h-4 text-[#F7D774]" />
                        </button>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="s3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <h3 className="font-display text-2xl font-bold text-[#111520]">
                          {t.checkIn.step3Title}
                        </h3>
                        <div>
                          <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                            {t.checkIn.birthCityLabel}
                          </label>
                          <div className="h-12">
                            <CityAutocomplete
                              variant="light"
                              value={birthCity}
                              onChange={(val, valid, coords) => {
                                setBirthCity(val);
                                setBirthCityValid(valid);
                                setBirthCoords(coords);
                              }}
                              placeholder={t.checkIn.birthCityPlaceholder}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleNextStep3}
                          className="w-full h-[52px] rounded-xl bg-[#111520] hover:bg-[#1C2233] text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                        >
                          <span>{t.checkIn.continueBtn}</span>
                          <ArrowRight className="w-4 h-4 text-[#F7D774]" />
                        </button>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="s4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <h3 className="font-display text-2xl font-bold text-[#111520]">
                          {t.checkIn.step4Title}
                        </h3>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                            <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                              {t.checkIn.pastYearLabel}
                            </label>
                            <select
                              value={pastYear}
                              onChange={(e) => setPastYear(e.target.value)}
                              className="w-full h-12 rounded-xl bg-white border border-[#111520]/15 px-3.5 text-[#111520] text-sm font-bold focus:outline-none focus:border-[#B8861E]"
                            >
                              {yearOptions.map((yr) => (
                                <option key={yr} value={yr}>
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-8">
                            <label className="block text-xs font-bold text-[#111520]/75 mb-2">
                              {t.checkIn.pastCityLabel}
                            </label>
                            <div className="h-12">
                              <CityAutocomplete
                                variant="light"
                                value={pastCity}
                                onChange={(val, _valid, coords) => {
                                  setPastCity(val);
                                  setPastCoords(coords);
                                }}
                                placeholder={t.checkIn.pastCityPlaceholder}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={calculating}
                          className="w-full h-[56px] rounded-xl bg-gradient-to-b from-[#F7D774] to-[#E5A935] text-[#080B12] font-bold text-[15px] shadow-[0_14px_30px_rgba(234,179,68,0.35)] hover:brightness-105 inline-flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {calculating ? t.checkIn.calculatingBtn : t.checkIn.submitFreeBtn}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 pt-4 border-t border-[#111520]/10 flex items-center justify-between text-[11px] text-[#111520]/60">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#065F46]" />
                      {t.checkIn.trustLine}
                    </span>
                    <span className="font-mono uppercase tracking-wider">SWISS EPHEMERIS</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 5 — FIRST-CLASS PASS COUNTER: 3 PERFORATED BOARDING PASSES (#planos)
          ===================================================================== */}
      <section id="planos" className="py-24 bg-[#060911] text-[#F8FAFC] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-8">
          {/* Top Architectural Header + Honest Deliverable Strip */}
          <div className="grid grid-cols-12 gap-10 items-end mb-12 pb-8 border-b border-white/10">
            <div className="col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] mb-4">
                <Plane className="w-3.5 h-3.5 text-[#EAB344]" />
                <span>{t.pricing.badge}</span>
              </div>
              <h2 className="font-display text-[42px] font-bold leading-[1.08] tracking-[-0.02em]">
                {t.pricing.titleStart}
                <span className="italic text-[#F3DC9B] font-semibold">
                  {t.pricing.titleHighlight}
                </span>
              </h2>
            </div>
            <div className="col-span-5">
              <p className="text-[15px] text-[#CBD5E1] leading-relaxed">
                {t.pricing.subtitle}
              </p>
              <p className="text-xs font-mono text-[#F3DC9B] mt-2">{t.pricing.currencyHint}</p>
            </div>
          </div>

          {/* 3 Honest Deliverables Strip (What actually opens on screen) */}
          <div className="grid grid-cols-3 gap-5 mb-12">
            {[
              {
                color: "#10B981",
                tag: "ENTREGÁVEL 01",
                title: "Cidades perto, no Brasil e no Exterior",
                desc: "Você filtra por distância real e orçamento — sem precisar cruzar o oceano para ativar uma boa Casa.",
              },
              {
                color: "#EAB344",
                tag: "ENTREGÁVEL 02",
                title: "As 8 Áreas da Vida em Português Claro",
                desc: "Amor, dinheiro, carreira, rotina e saúde traduzidos sem jargão astrológico difícil.",
              },
              {
                color: "#38BDF8",
                tag: "ENTREGÁVEL 03",
                title: "Guia Prático se Você Não Viajar",
                desc: "Vai passar o aniversário em casa? Receba o manual exato de como conduzir o ciclo na sua cidade.",
              },
            ].map((d) => (
              <div
                key={d.tag}
                className="rounded-2xl bg-[#0C1220] border border-white/10 p-5 flex items-start gap-4"
              >
                <span
                  className="w-2.5 h-10 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: d.color }}
                />
                <div>
                  <p
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: d.color }}
                  >
                    {d.tag}
                  </p>
                  <p className="font-sans text-sm font-bold text-white mt-1">{d.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Perforated Boarding-Pass Pricing Tickets */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            {pricingTickets.map((ticket) => (
              <div
                key={ticket.pkg}
                className={`relative rounded-[26px] overflow-hidden flex flex-col justify-between transition-all ${
                  ticket.featured
                    ? "bg-[#FAF6EE] text-[#111520] shadow-[0_28px_80px_rgba(234,179,68,0.24)] -translate-y-1.5 border-2 border-[#EAB344]"
                    : "bg-[#0D1424] text-[#F8FAFC] border border-white/12 hover:border-white/25"
                }`}
              >
                {/* Top Colored Pass Band */}
                <div>
                  <div
                    className="px-6 py-3 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      backgroundColor: ticket.stubColor,
                      color: ticket.featured ? "#111520" : "#FFFFFF",
                    }}
                  >
                    <span>{ticket.passCode} · {ticket.copy.tag}</span>
                    {ticket.featured && <span>★ {t.pricing.mostPopular}</span>}
                  </div>

                  <div className="p-7 pb-5">
                    <h3 className="font-display text-2xl font-bold leading-snug">
                      {ticket.copy.name}
                    </h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed min-h-[38px] ${
                        ticket.featured ? "text-[#111520]/70" : "text-[#94A3B8]"
                      }`}
                    >
                      {ticket.copy.desc}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span
                        className={`font-mono text-sm font-bold ${
                          ticket.featured ? "text-[#111520]/70" : "text-white/60"
                        }`}
                      >
                        R$
                      </span>
                      <span className="font-display text-5xl font-bold tracking-tight">
                        {ticket.priceInt}
                      </span>
                      <span className="font-mono text-lg font-bold">,{ticket.priceDec}</span>
                      <span
                        className={`ml-2 text-xs ${
                          ticket.featured ? "text-[#111520]/60" : "text-[#94A3B8]"
                        }`}
                      >
                        · {t.pricing.oneTime}
                      </span>
                    </div>
                  </div>

                  {/* Perforated Tear Divider */}
                  <div className="relative flex items-center justify-between px-3">
                    <span className="w-4 h-4 rounded-full bg-[#060911] -ml-5 shrink-0" />
                    <div
                      className={`w-full border-t-2 border-dashed mx-2 ${
                        ticket.featured ? "border-[#111520]/18" : "border-white/15"
                      }`}
                    />
                    <span className="w-4 h-4 rounded-full bg-[#060911] -mr-5 shrink-0" />
                  </div>

                  {/* 3 Clean Bullets */}
                  <ul className="px-7 py-5 space-y-3">
                    {ticket.copy.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: ticket.featured ? "#065F46" : ticket.stubColor }}
                        />
                        <span className={ticket.featured ? "text-[#111520]/85 font-medium" : "text-[#E2E8F0]"}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-7 pb-7">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(ticket.pkg)}
                    className={`w-full h-[50px] rounded-xl font-sans font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-[0.985] ${
                      ticket.featured
                        ? "bg-[#111520] hover:bg-[#1E2538] text-[#F7D774] shadow-lg"
                        : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
                    }`}
                  >
                    <span>{ticket.copy.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gift Redeem Bar */}
          <div className="mt-10 rounded-2xl bg-[#0C1220] border border-white/10 px-6 py-4 flex items-center justify-between text-xs text-[#CBD5E1]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>{t.pricing.trustSwiss} · {t.pricing.trustNoTravel}</span>
            </div>
            <Link
              to="/resgatar"
              className="inline-flex items-center gap-2 font-bold text-[#F3DC9B] hover:underline"
            >
              <Gift className="w-4 h-4" />
              <span>{t.pricing.trustRedeem} {t.pricing.trustRedeemLink} →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 6 — WARM TRAVERTINE EDITORIAL FAQ + ARCHITECTURAL FOOTER
          ===================================================================== */}
      <section className="py-24 bg-[#F4EFE6] text-[#111520]">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-start">
            {/* Left 4/12 — Editorial Anchor */}
            <div className="col-span-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#111520] text-[#F7D774] font-mono text-[11px] font-bold uppercase tracking-[0.14em] mb-4">
                {t.faq.badge}
              </span>
              <h2 className="font-display text-4xl font-bold leading-[1.1] text-[#111520] mb-4">
                {t.faq.title}
              </h2>
              <p className="text-sm text-[#111520]/70 leading-relaxed mb-6">
                Respostas diretas, sem misticismo vago e sem letras miúdas.
              </p>
              <a
                href="#consulta-gratuita"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#111520] text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <Compass className="w-3.5 h-3.5 text-[#F7D774]" />
                <span>Testar meu último aniversário grátis</span>
              </a>
            </div>

            {/* Right 8/12 — Clean Accordion */}
            <div className="col-span-8 space-y-3">
              {t.faq.items.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#FFFDF9] border border-[#111520]/12 overflow-hidden shadow-[0_8px_24px_rgba(17,21,32,0.04)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-sans text-[15px] font-bold text-[#111520]">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#111520]/60 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-0 text-sm text-[#111520]/75 leading-relaxed border-t border-[#111520]/8">
                        <p className="pt-3.5">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architectural Footer */}
          <footer className="mt-20 pt-10 border-t border-[#111520]/12 flex items-center justify-between text-xs text-[#111520]/65">
            <div className="flex items-center gap-4">
              <span className="font-display font-bold text-base text-[#111520]">
                Protocolo Solar
              </span>
              <span>· Cálculo astronômico de Revolução Solar por coordenadas</span>
            </div>
            <div className="flex items-center gap-6 font-semibold">
              <Link to="/casas" className="hover:text-[#111520]">
                As 12 Casas
              </Link>
              <Link to="/consultar" className="hover:text-[#111520]">
                Calculadora
              </Link>
              <Link to="/resgatar" className="hover:text-[#111520]">
                Resgatar Código
              </Link>
              <Link to="/auth" className="hover:text-[#111520]">
                Minha Conta
              </Link>
            </div>
          </footer>
        </div>
      </section>

      {/* =====================================================================
          OFFICIAL 1M30 FILM LIGHTBOX MODAL
          ===================================================================== */}
      <AnimatePresence>
        {filmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={closeFilmModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#060911] border border-white/15 shadow-2xl"
            >
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#EAB344]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white">
                    {t.film.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !filmMuted;
                      setFilmMuted(next);
                      if (modalVideoRef.current) modalVideoRef.current.muted = next;
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    {filmMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{filmMuted ? t.film.unmute : t.film.mute}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeFilmModal}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                    aria-label="Fechar vídeo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video bg-black">
                <video
                  ref={modalVideoRef}
                  src="/videos/v3/filme-protocolo-16x9.mp4"
                  poster="/videos/v3/filme-protocolo-16x9-v3-poster.jpg"
                  autoPlay
                  controls
                  playsInline
                  onPlay={() => setFilmPlaying(true)}
                  onPause={() => setFilmPlaying(false)}
                  className="w-full h-full object-contain"
                />
                {!filmPlaying && (
                  <button
                    type="button"
                    onClick={() => modalVideoRef.current?.play()}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <span className="w-16 h-16 rounded-full bg-[#EAB344] text-[#070A12] flex items-center justify-center shadow-2xl">
                      <Play className="w-6 h-6 fill-[#070A12] ml-0.5" />
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
