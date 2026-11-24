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
} from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import ScanningOverlay from "@/components/ScanningOverlay";
import { HouseVideoPreview } from "@/components/HouseVideoPreview";
import { MobileHomeFlow } from "@/components/mobile/MobileHomeFlow";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
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
  cityLabel: Record<SupportedLocale, string>;
  houseNum: number;
  houseCode: string;
  videoSrc: string;
  posterSrc: string;
}

// Exemplo específico do personagem Theo (19/08, 14:35, SP) — deixa claro que são cidades do mapa DELE
const BOARDING_DESTINATIONS: BoardingDestination[] = [
  {
    id: "zurich",
    code: "ZRH",
    cityLabel: { pt: "Zurique", es: "Zúrich", en: "Zurich", fr: "Zurich", it: "Zurigo" },
    houseNum: 2,
    houseCode: "02",
    videoSrc: "/videos/v3/theo-zurique-v3.mp4",
    posterSrc: "/videos/v3/theo-zurique-v3-poster.jpg",
  },
  {
    id: "rome",
    code: "FCO",
    cityLabel: { pt: "Roma", es: "Roma", en: "Rome", fr: "Rome", it: "Roma" },
    houseNum: 5,
    houseCode: "05",
    videoSrc: "/videos/v3/theo-roma-v3.mp4",
    posterSrc: "/videos/v3/theo-roma-v3-poster.jpg",
  },
  {
    id: "paris",
    code: "CDG",
    cityLabel: { pt: "Paris", es: "París", en: "Paris", fr: "Paris", it: "Parigi" },
    houseNum: 7,
    houseCode: "07",
    videoSrc: "/videos/v3/theo-paris-v3.mp4",
    posterSrc: "/videos/v3/theo-paris-v3-poster.jpg",
  },
  {
    id: "ny",
    code: "JFK",
    cityLabel: { pt: "Nova York", es: "Nueva York", en: "New York", fr: "New York", it: "New York" },
    houseNum: 10,
    houseCode: "10",
    videoSrc: "/videos/v3/theo-ny-v3.mp4",
    posterSrc: "/videos/v3/theo-ny-v3-poster.jpg",
  },
];

const COMPARISON_REELS = [
  {
    id: "zurich",
    cityLabel: { pt: "Zurique (Suíça)", es: "Zúrich (Suiza)", en: "Zurich (Switzerland)", fr: "Zurich (Suisse)", it: "Zurigo (Svizzera)" },
    houseNum: 2,
    houseLabel: "02",
    videoSrc: "/videos/v3/theo-zurique-v3.mp4",
    posterSrc: "/videos/v3/theo-zurique-v3-poster.jpg",
  },
  {
    id: "rome",
    cityLabel: { pt: "Roma (Itália)", es: "Roma (Italia)", en: "Rome (Italy)", fr: "Rome (Italie)", it: "Roma (Italia)" },
    houseNum: 5,
    houseLabel: "05",
    videoSrc: "/videos/v3/theo-roma-v3.mp4",
    posterSrc: "/videos/v3/theo-roma-v3-poster.jpg",
  },
  {
    id: "ny",
    cityLabel: { pt: "Nova York (EUA)", es: "Nueva York (EE. UU.)", en: "New York (USA)", fr: "New York (USA)", it: "New York (USA)" },
    houseNum: 10,
    houseLabel: "10",
    videoSrc: "/videos/v3/theo-ny-v3.mp4",
    posterSrc: "/videos/v3/theo-ny-v3-poster.jpg",
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

  // Preserve affiliate ref if present
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) saveStoredAffiliateRef(ref);
  }, [searchParams]);

  // Smooth scroll when arriving with #consulta-gratuita or #planos
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

  // Hero interactive boarding pass state
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const activeDest = BOARDING_DESTINATIONS[activeDestIndex] || BOARDING_DESTINATIONS[0];
  const activeDestCopy = t.houses[activeDest.houseNum];

  // Official Film Player state (16:9 desktop / 9:16 mobile)
  const desktopFilmRef = useRef<HTMLVideoElement | null>(null);
  const mobileFilmRef = useRef<HTMLVideoElement | null>(null);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [filmMuted, setFilmMuted] = useState(false);

  const getActiveFilmElement = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      return desktopFilmRef.current;
    }
    return mobileFilmRef.current;
  };

  const handleToggleFilm = () => {
    const vid = getActiveFilmElement();
    if (!vid) return;
    if (vid.paused) {
      vid.muted = filmMuted;
      void vid.play().then(() => setFilmPlaying(true)).catch(() => {
        vid.muted = true;
        setFilmMuted(true);
        void vid.play().then(() => setFilmPlaying(true));
      });
    } else {
      vid.pause();
      setFilmPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !filmMuted;
    setFilmMuted(nextMuted);
    if (desktopFilmRef.current) desktopFilmRef.current.muted = nextMuted;
    if (mobileFilmRef.current) mobileFilmRef.current.muted = nextMuted;
  };

  const scrollToAndPlayFilm = () => {
    const sec = document.getElementById("filme-oficial");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const vid = getActiveFilmElement();
      if (vid && vid.paused) {
        vid.muted = false;
        setFilmMuted(false);
        void vid.play().then(() => setFilmPlaying(true)).catch(() => {
          vid.muted = true;
          setFilmMuted(true);
          void vid.play().then(() => setFilmPlaying(true));
        });
      }
    }, 450);
  };

  // Free Past Birthday 4-Step Wizard State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [firstName, setFirstName] = useState(() => sessionStorage.getItem("ps_natal_name") || "");
  const [birthDate, setBirthDate] = useState(() => sessionStorage.getItem("ps_natal_date") || "");
  const [birthTime, setBirthTime] = useState(() => sessionStorage.getItem("ps_natal_time") || "12:00");
  const [unknownTime, setUnknownTime] = useState(
    () => sessionStorage.getItem("ps_natal_unknown_time") === "1"
  );
  const [birthCity, setBirthCity] = useState(() => sessionStorage.getItem("ps_natal_place") || "");
  const [birthCityValid, setBirthCityValid] = useState(() => Boolean(sessionStorage.getItem("ps_natal_place")));
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
  const [pastCityValid, setPastCityValid] = useState(false);
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>(undefined);
  const [calculating, setCalculating] = useState(false);

  // FAQ state
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
      toast.error("Selecione sua cidade de nascimento na lista.");
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

  const pricingCards = [
    {
      pkg: "1" as const,
      featured: false,
      priceInt: "19",
      priceDec: "90",
      copy: t.pricing.plans.single,
    },
    {
      pkg: "3" as const,
      featured: true,
      priceInt: "49",
      priceDec: "90",
      copy: t.pricing.plans.triple,
    },
    {
      pkg: "full" as const,
      featured: false,
      priceInt: "99",
      priceDec: "90",
      copy: t.pricing.plans.full,
    },
  ];

  const yearOptions = Array.from({ length: 8 }, (_, idx) => String(currentYear - idx));

  return (
    <div
      className={`min-h-screen bg-[#060911] text-[#F8FAFC] font-sans overflow-x-hidden ${
        embeddedInShell ? "pt-16 lg:pt-4" : ""
      }`}
    >
      <ScanningOverlay visible={calculating} mode="passado" />

      {/* =====================================================================
          SECTION 1 — HERO (SYMMETRIC 6/6 DESKTOP · VISUAL-FIRST MOBILE)
          ===================================================================== */}
      <section className="relative py-6 sm:py-12 lg:py-20 overflow-hidden border-b border-white/[0.06]">
        {/* Ambient Celestial Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 15%, rgba(234,179,68,0.13) 0%, rgba(11,17,30,0.45) 55%, transparent 80%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* LEFT 6 COLS: Copy + Dual Action Buttons */}
            <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-3.5 sm:mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#EAB344]" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#F8FAFC] tracking-[-0.02em] leading-[1.06] mb-3 sm:mb-4 max-w-xl">
                {t.hero.titleStart}
                <span className="italic text-[#F3DC9B] font-semibold">
                  {t.hero.titleHighlight}
                </span>
                {t.hero.titleEnd}
              </h1>

              <p className="font-sans text-sm sm:text-lg text-[#B0BCCF] leading-relaxed max-w-lg mb-5 sm:mb-7">
                {t.hero.subtitle}
              </p>

              {/* Primary Solar Gold CTA + Secondary Film Glass CTA */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#consulta-gratuita"
                  className="ps-btn-gold text-sm sm:text-[15px]"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={scrollToAndPlayFilm}
                  className="ps-btn-glass text-sm"
                >
                  <Play className="w-4 h-4 text-[#EAB344] fill-[#EAB344] shrink-0" />
                  <span>{t.hero.ctaFilm}</span>
                </button>
              </div>
            </div>

            {/* RIGHT 6 COLS: Live Interactive Solar Boarding Pass + 4 Symmetric City Selectors */}
            <div className="lg:col-span-6 order-1 lg:order-2 w-full">
              <div className="relative rounded-3xl border border-white/14 bg-[#0B111E] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                {/* Bright Destination Video Window */}
                <div className="relative aspect-[2/1] sm:aspect-[16/10] w-full overflow-hidden bg-[#060911]">
                  <video
                    key={activeDest.videoSrc}
                    src={activeDest.videoSrc}
                    poster={activeDest.posterSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-[#060911]/20 to-black/20 pointer-events-none" />

                  {/* Decorative Golden Solar Orbit SVG */}
                  <svg
                    viewBox="0 0 240 240"
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 opacity-45"
                  >
                    <circle
                      cx="120"
                      cy="120"
                      r="92"
                      fill="none"
                      stroke="#EAB344"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r="64"
                      fill="none"
                      stroke="#F3DC9B"
                      strokeWidth="0.8"
                      opacity="0.6"
                    />
                    <circle cx="55" cy="55" r="4.5" fill="#F6D36B" />
                  </svg>

                  {/* Top Boarding Pass Header Strip */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 font-sans text-[11px] font-semibold text-[#F3DC9B]">
                      <Plane className="w-3 h-3 text-[#EAB344]" />
                      <span>{t.hero.passHeader}</span>
                    </span>
                  </div>

                  {/* Bottom Route Title Inside Video */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 z-10">
                    <div>
                      <span className="block font-sans text-[11px] font-medium text-[#F3DC9B]">
                        {t.hero.destinationLabel}:
                      </span>
                      <div className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] leading-tight">
                        {activeDest.cityLabel[locale]} <span className="font-mono text-sm text-[#F3DC9B]">({activeDest.code})</span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#EAB344] text-[#070A12] font-mono text-xs font-bold uppercase tracking-[0.1em] shadow-md">
                      Casa {activeDest.houseCode}
                    </span>
                  </div>
                </div>

                {/* Symmetric Boarding Pass Metadata Grid */}
                <div className="p-4 sm:p-5 bg-[#0B111E] border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#111A2E]/80 border border-white/[0.07] px-3.5 py-2.5">
                      <span className="block font-sans text-[11px] text-[#B0BCCF]">
                        {t.hero.houseLabel}
                      </span>
                      <span className="font-sans text-sm font-semibold text-[#F8FAFC]">
                        Casa {activeDest.houseCode} · {activeDestCopy?.shortTag}
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#111A2E]/80 border border-white/[0.07] px-3.5 py-2.5">
                      <span className="block font-sans text-[11px] text-[#B0BCCF]">
                        {t.hero.focusLabel}
                      </span>
                      <span className="font-sans text-sm font-semibold text-[#F3DC9B] truncate block">
                        {activeDestCopy?.title}
                      </span>
                    </div>
                  </div>

                  {/* 4 Equal-Width Destination Simulator Buttons */}
                  <div>
                    <p className="text-[11px] text-[#B0BCCF] mb-2 text-center sm:text-left">
                      {t.hero.tapCityHint}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {BOARDING_DESTINATIONS.map((dest, idx) => {
                        const isSelected = idx === activeDestIndex;
                        return (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => setActiveDestIndex(idx)}
                            className={`rounded-xl py-2 px-2 text-center transition-all border active:scale-95 ${
                              isSelected
                                ? "bg-[#EAB344]/18 border-[#EAB344] text-[#F3DC9B] shadow-[0_0_16px_rgba(234,179,68,0.18)]"
                                : "bg-[#060911]/70 border-white/10 text-[#B0BCCF] hover:text-white hover:border-white/25"
                            }`}
                          >
                            <span className="block font-sans text-xs font-semibold truncate">
                              {dest.cityLabel[locale]}
                            </span>
                            <span className="block font-mono text-[10px] opacity-80">
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
        </div>
      </section>

      {/* =====================================================================
          SECTION 2 — OFFICIAL FILM (16:9 DESKTOP / 9:16 MOBILE) + 3 REELS
          ===================================================================== */}
      <section
        id="filme-oficial"
        className="scroll-mt-20 py-16 lg:py-24 border-b border-white/[0.06] bg-[#080D18]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Symmetric Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-4">
              <Play className="w-3 h-3 text-[#EAB344] fill-[#EAB344]" />
              <span>{t.film.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#F8FAFC] leading-[1.1] mb-3">
              {t.film.titleStart}
              <span className="italic text-[#F3DC9B] font-semibold">
                {t.film.titleHighlight}
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#B0BCCF] leading-relaxed">
              {t.film.subtitle}
            </p>
          </div>

          {/* Responsive Official Film Theater Frame */}
          <div className="mb-14">
            {/* Desktop 16:9 Master */}
            <div className="hidden md:block relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/14 bg-[#060911] shadow-[0_24px_64px_rgba(0,0,0,0.65)] aspect-video">
              <video
                ref={desktopFilmRef}
                src="/videos/v3/filme-protocolo-16x9.mp4"
                poster="/videos/v3/filme-protocolo-16x9-v3-poster.jpg"
                playsInline
                preload="metadata"
                onEnded={() => setFilmPlaying(false)}
                onClick={handleToggleFilm}
                className="w-full h-full object-cover cursor-pointer"
              />
              {!filmPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                  <button
                    type="button"
                    onClick={handleToggleFilm}
                    className="pointer-events-auto ps-btn-gold text-sm shadow-[0_16px_40px_rgba(0,0,0,0.65)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.film.playWithSound}</span>
                  </button>
                </div>
              )}
              {filmPlaying && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={handleToggleFilm}
                    aria-label="Pausar"
                    className="px-3.5 py-2 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5 text-[#EAB344]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="px-3.5 py-2 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    {filmMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#EAB344]" />
                        <span>{t.film.unmute}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#EAB344]" />
                        <span>{t.film.mute}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile 9:16 Vertical Master */}
            <div className="md:hidden relative max-w-[360px] mx-auto rounded-3xl overflow-hidden border border-white/14 bg-[#060911] shadow-[0_20px_50px_rgba(0,0,0,0.65)] aspect-[9/16]">
              <video
                ref={mobileFilmRef}
                src="/videos/v3/filme-protocolo-9x16.mp4"
                poster="/videos/v3/filme-protocolo-9x16-v3-poster.jpg"
                playsInline
                preload="metadata"
                onEnded={() => setFilmPlaying(false)}
                onClick={handleToggleFilm}
                className="w-full h-full object-cover cursor-pointer"
              />
              {!filmPlaying && (
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                  <button
                    type="button"
                    onClick={handleToggleFilm}
                    className="pointer-events-auto ps-btn-gold text-xs shadow-[0_14px_34px_rgba(0,0,0,0.7)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.film.playWithSound}</span>
                  </button>
                </div>
              )}
              {filmPlaying && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={handleToggleFilm}
                    aria-label="Pausar"
                    className="p-2.5 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 text-white"
                  >
                    <Pause className="w-4 h-4 text-[#EAB344]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    aria-label="Som"
                    className="p-2.5 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 text-white"
                  >
                    {filmMuted ? (
                      <VolumeX className="w-4 h-4 text-[#EAB344]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#EAB344]" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Symmetric 3-Column Visual Comparison Cards */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#EAB344] font-semibold">
              {t.film.reelsBadge}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1">
              {t.film.reelsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#B0BCCF] mt-1.5">
              {t.film.reelsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {COMPARISON_REELS.map((reel) => {
              const houseCopy = t.houses[reel.houseNum];
              return (
                <Link
                  key={reel.id}
                  to={`/casas/${reel.houseNum}`}
                  className="group rounded-2xl bg-[#0B111E] border border-white/10 hover:border-[#EAB344]/45 overflow-hidden flex flex-col justify-between transition-all shadow-[0_14px_36px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#060911]">
                    <video
                      src={reel.videoSrc}
                      poster={reel.posterSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-transparent to-black/25" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#060911]/85 backdrop-blur-md border border-white/15 font-sans text-[10px] font-semibold text-[#F3DC9B]">
                        Theo · Casa {reel.houseLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#EAB344] mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{reel.cityLabel[locale]}</span>
                      </div>
                      <h4 className="font-display text-xl font-bold text-[#F8FAFC] group-hover:text-[#F3DC9B] transition-colors">
                        {houseCopy?.title}
                      </h4>
                      <p className="font-sans text-xs text-[#B0BCCF] leading-relaxed mt-1.5">
                        {houseCopy?.focus}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs font-semibold text-[#F3DC9B]">
                      <span>
                        {t.housesSection.exploreHouse} {reel.houseLabel}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3 — FREE PAST BIRTHDAY CHECK-IN (#consulta-gratuita)
          Routes directly to FULL /meu-passado AppleResultPreviewV3 report!
          ===================================================================== */}
      <section
        id="consulta-gratuita"
        className="scroll-mt-20 relative py-16 lg:py-24 border-b border-white/[0.06] overflow-hidden"
      >
        {/* Bright Earth Sunrise Backdrop */}
        <img
          src="/earth-orbital-hires.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060911] via-[#060911]/75 to-[#060911]" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Symmetric Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/12 text-[#F3DC9B] text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-4">
              <Compass className="w-3.5 h-3.5 text-[#EAB344]" />
              <span>{t.checkIn.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#F8FAFC] leading-[1.1] mb-3">
              {t.checkIn.titleStart}
              <span className="italic text-[#F3DC9B] font-semibold">
                {t.checkIn.titleHighlight}
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#B0BCCF] leading-relaxed">
              {t.checkIn.subtitle}
            </p>
          </div>

          {/* Symmetric Centered Wizard Card */}
          <div className="max-w-2xl mx-auto ps-card p-6 sm:p-8">
            {/* Symmetric 4-Step Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.14em] text-[#F3DC9B] mb-2">
                <span>
                  {t.checkIn.stepOf} {step} / 4
                </span>
                <span>{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (idx < step) setStep(idx as 1 | 2 | 3 | 4);
                    }}
                    aria-label={`${t.checkIn.stepOf} ${idx}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx <= step ? "bg-[#EAB344]" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleCalculatePast} className="space-y-5">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {t.checkIn.step1Title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                        {t.checkIn.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t.checkIn.namePlaceholder}
                        autoComplete="given-name"
                        className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-4 text-base text-[#F8FAFC] placeholder:text-white/35 focus:outline-none focus:border-[#EAB344]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                        {t.checkIn.birthDateLabel}
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={`${currentYear - 1}-12-31`}
                        className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-4 text-base text-[#F8FAFC] focus:outline-none focus:border-[#EAB344]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="ps-btn-gold w-full text-sm mt-2"
                  >
                    <span>{t.checkIn.continueBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {t.checkIn.step2Title}
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                      {t.checkIn.birthTimeLabel}
                    </label>
                    <input
                      type="time"
                      value={unknownTime ? "12:00" : birthTime}
                      disabled={unknownTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-4 text-base text-[#F8FAFC] disabled:opacity-50 focus:outline-none focus:border-[#EAB344]"
                    />
                  </div>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#111A2E]/70 border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unknownTime}
                      onChange={(e) => {
                        setUnknownTime(e.target.checked);
                        if (e.target.checked) setBirthTime("12:00");
                      }}
                      className="mt-1 h-4 w-4 accent-[#EAB344]"
                    />
                    <span className="text-xs sm:text-sm text-[#F8FAFC]/90 leading-snug">
                      <strong className="block font-semibold">{t.checkIn.unknownTimeLabel}</strong>
                      <span className="text-[#B0BCCF] text-xs">{t.checkIn.unknownTimeNote}</span>
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="ps-btn-glass col-span-1 text-xs"
                    >
                      {t.nav.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="ps-btn-gold col-span-2 text-sm"
                    >
                      <span>{t.checkIn.continueBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {t.checkIn.step3Title}
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                      {t.checkIn.birthCityLabel}
                    </label>
                    <CityAutocomplete
                      value={birthCity}
                      onChange={(val, valid, coords) => {
                        setBirthCity(val);
                        setBirthCityValid(valid);
                        if (coords) setBirthCoords(coords);
                      }}
                      placeholder={t.checkIn.birthCityPlaceholder}
                      className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-4 text-base text-[#F8FAFC]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="ps-btn-glass col-span-1 text-xs"
                    >
                      {t.nav.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep3}
                      className="ps-btn-gold col-span-2 text-sm"
                    >
                      <span>{t.checkIn.continueBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {t.checkIn.step4Title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                        {t.checkIn.pastYearLabel}
                      </label>
                      <select
                        value={pastYear}
                        onChange={(e) => setPastYear(e.target.value)}
                        className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-3.5 text-base text-[#F8FAFC] focus:outline-none focus:border-[#EAB344]"
                      >
                        {yearOptions.map((yr) => (
                          <option key={yr} value={yr} className="bg-[#0B111E] text-[#F8FAFC]">
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#B0BCCF] mb-1.5">
                        {t.checkIn.pastCityLabel}
                      </label>
                      <CityAutocomplete
                        value={pastCity}
                        onChange={(val, valid, coords) => {
                          setPastCity(val);
                          setPastCityValid(valid);
                          if (coords) setPastCoords(coords);
                        }}
                        placeholder={t.checkIn.pastCityPlaceholder}
                        className="w-full h-12 rounded-xl bg-[#111A2E] border border-white/14 px-4 text-base text-[#F8FAFC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="ps-btn-glass col-span-1 text-xs"
                    >
                      {t.nav.back}
                    </button>
                    <button
                      type="submit"
                      disabled={calculating || pastCity.trim().length < 2}
                      className="ps-btn-gold col-span-2 text-sm disabled:opacity-50"
                    >
                      <span>
                        {calculating ? t.checkIn.calculatingBtn : t.checkIn.submitFreeBtn}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Instant Sample Preview + Trust Micro-line */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-xs text-[#B0BCCF]">{t.checkIn.trustLine}</p>
              <button
                type="button"
                onClick={handleOpenSamplePastReport}
                className="text-xs font-semibold text-[#F3DC9B] hover:text-[#EAB344] underline underline-offset-4 shrink-0"
              >
                {t.checkIn.samplePreviewBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 — LIVING VIDEO SHOWCASE OF ALL 12 SOLAR HOUSES
          Symmetric 2x6 (mobile) · 3x4 (tablet) · 4x3 (desktop) — Zero Holes!
          ===================================================================== */}
      <section
        id="as-12-casas"
        className="scroll-mt-20 py-16 lg:py-24 border-b border-white/[0.06] bg-[#060911]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-4">
              <Crown className="w-3.5 h-3.5 text-[#EAB344]" />
              <span>{t.housesSection.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#F8FAFC] leading-[1.1] mb-3">
              {t.housesSection.titleStart}
              <span className="italic text-[#F3DC9B] font-semibold">
                {t.housesSection.titleHighlight}
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#B0BCCF] leading-relaxed">
              {t.housesSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {HOUSES_SHOWCASE.map((house) => {
              const localized = t.houses[house.id];
              return (
                <Link
                  key={house.id}
                  to={`/casas/${house.id}`}
                  className="group rounded-2xl bg-[#0B111E] border border-white/[0.09] hover:border-[#EAB344]/45 overflow-hidden flex flex-col justify-between transition-all shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#060911]">
                    <HouseVideoPreview
                      houseId={house.id}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      overlayClassName="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-transparent to-black/25 pointer-events-none"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#060911]/80 backdrop-blur-md border border-white/15 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F3DC9B]">
                      Casa {house.numberLabel}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <span className="block font-sans text-[11px] font-semibold text-[#EAB344] truncate">
                        {localized?.shortTag}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#F8FAFC] leading-snug mt-0.5 group-hover:text-[#F3DC9B] transition-colors line-clamp-2">
                        {localized?.title || house.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-semibold text-[#B0BCCF] group-hover:text-[#F3DC9B]">
                      <span className="truncate">{t.housesSection.exploreHouse}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link to="/casas" className="ps-btn-glass text-sm">
              <Crown className="w-4 h-4 text-[#EAB344]" />
              <span>{t.housesSection.viewAllBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 — CRISP, SYMMETRIC 3-PASS PRICING (ZERO WALLS OF TEXT)
          ===================================================================== */}
      <section
        id="planos"
        className="scroll-mt-20 py-16 lg:py-24 border-b border-white/[0.06] bg-[#080D18]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-4">
              <Plane className="w-3.5 h-3.5 text-[#EAB344]" />
              <span>{t.pricing.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#F8FAFC] leading-[1.1] mb-3">
              {t.pricing.titleStart}
              <span className="italic text-[#F3DC9B] font-semibold">
                {t.pricing.titleHighlight}
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#B0BCCF] leading-relaxed">
              {t.pricing.subtitle}
            </p>
            {t.pricing.currencyHint && (
              <p className="font-mono text-[11px] text-[#F3DC9B]/85 mt-2">
                {t.pricing.currencyHint}
              </p>
            )}
          </div>

          {/* Symmetric 2-Column MiroFish Contrast: Free Static Chart vs. Protocolo Solar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
            <div className="rounded-2xl bg-[#0B111E]/75 border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <span className="inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B0BCCF] mb-1">
                  {t.pricing.contrast.freeLabel}
                </span>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]/85">
                  {t.pricing.contrast.freeTitle}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#B0BCCF] leading-relaxed mt-1.5">
                  {t.pricing.contrast.freeDesc}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111A2E]/90 border border-[#EAB344]/40 p-5 flex flex-col justify-between shadow-[0_12px_32px_rgba(234,179,68,0.12)]">
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#EAB344] font-semibold mb-1">
                  <Sparkles className="w-3 h-3 text-[#EAB344]" />
                  <span>{t.pricing.contrast.solarLabel}</span>
                </span>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  {t.pricing.contrast.solarTitle}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#E2E8F0] leading-relaxed mt-1.5">
                  {t.pricing.contrast.solarDesc}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Equal-Height Symmetric Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pricingCards.map((plan) => (
              <div
                key={plan.pkg}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  plan.featured
                    ? "bg-[#111A2E] border-2 border-[#EAB344] shadow-[0_20px_50px_rgba(234,179,68,0.18)]"
                    : "bg-[#0B111E] border border-white/10"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-b from-[#F6D36B] to-[#E6AB3B] text-[#070A12] font-mono text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap shadow-md">
                    {t.pricing.mostPopular}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#EAB344] font-semibold">
                      {plan.copy.tag}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#F8FAFC] mt-1">
                      {plan.copy.name}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#B0BCCF] leading-relaxed mt-1.5 min-h-[40px]">
                      {plan.copy.desc}
                    </p>
                  </div>

                  <div className="py-4 border-y border-white/10 flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#F3DC9B]">R$</span>
                    <span className="font-display text-5xl font-bold text-[#F8FAFC] tabular-nums leading-none">
                      {plan.priceInt}
                    </span>
                    <span className="text-lg font-semibold text-[#B0BCCF]">
                      ,{plan.priceDec}
                    </span>
                    <span className="ml-2 text-xs text-[#B0BCCF]">
                      · {t.pricing.oneTime}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.copy.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-[#F8FAFC]/90"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#EAB344] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.pkg)}
                  className={`mt-7 w-full text-sm ${
                    plan.featured ? "ps-btn-gold" : "ps-btn-glass"
                  }`}
                >
                  <span>{plan.copy.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Symmetric Trust Strip */}
          <div className="mt-8 rounded-2xl bg-[#0B111E]/85 border border-white/[0.08] px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#B0BCCF]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#EAB344] shrink-0" />
              <span>{t.pricing.trustSwiss}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#EAB344] shrink-0" />
              <span>{t.pricing.trustNoTravel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#EAB344] shrink-0" />
              <span>{t.pricing.trustRedeem}</span>
              <Link
                to="/resgatar"
                className="font-semibold text-[#F3DC9B] hover:text-[#EAB344] underline underline-offset-4"
              >
                {t.pricing.trustRedeemLink}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6 — CONCISE FAQ + SYMMETRIC FOOTER
          ===================================================================== */}
      <section className="py-16 lg:py-20 bg-[#060911]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#EAB344] font-semibold">
              {t.faq.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F8FAFC] mt-1">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl bg-[#0B111E] border border-white/[0.09] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-sans text-sm sm:text-base font-semibold text-[#F8FAFC]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#EAB344] shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-[#B0BCCF] leading-relaxed border-t border-white/[0.06] pt-3">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Clean Symmetric Footer */}
          <footer className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B0BCCF]">
            <span>© {currentYear} Protocolo Solar · Swiss Ephemeris</span>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link to="/casas" className="hover:text-white transition-colors">
                {t.nav.houses}
              </Link>
              <Link to="/parceiros" className="hover:text-white transition-colors">
                {t.nav.partners}
              </Link>
              <Link to="/tecnologia" className="hover:text-white transition-colors">
                Tecnologia
              </Link>
              <Link to="/termos" className="hover:text-white transition-colors">
                Termos
              </Link>
              <Link to="/privacidade" className="hover:text-white transition-colors">
                Privacidade
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
