import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Compass,
  Crown,
  Flame,
  Globe,
  HeartHandshake,
  Home,
  MapPin,
  Megaphone,
  Moon,
  Network,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
  Wallet,
} from "lucide-react";
import {
  ELEMENT_STYLES,
  HOUSES_SHOWCASE,
  type HouseElement,
  type HouseIconKey,
} from "@/data/housesShowcase";
import { houseThemes } from "@/data/houseThemes";
import { HouseVideoPreview } from "@/components/HouseVideoPreview";
import { useI18n } from "@/lib/i18n";

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

const ELEMENTS_ORDER: ("ALL" | HouseElement)[] = ["ALL", "Fogo", "Terra", "Ar", "Água"];

export default function HousesGuide() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useI18n();
  const [selectedElement, setSelectedElement] = useState<"ALL" | HouseElement>("ALL");
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 260);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredHouses = useMemo(() => {
    if (selectedElement === "ALL") return HOUSES_SHOWCASE;
    return HOUSES_SHOWCASE.filter((item) => item.element === selectedElement);
  }, [selectedElement]);

  return (
    <div className="min-h-screen bg-[#060911] text-[#F8FAFC] pt-20 pb-36 lg:pt-12 lg:pb-28 relative overflow-x-hidden">
      {/* Subtle Celestial Gold Mesh */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 40% at 50% 0%, rgba(234,179,68,0.12) 0%, rgba(11,17,30,0.45) 55%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* 1. CENTERED SYMMETRIC EDITORIAL HEADER */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[#F3DC9B] text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB344]" />
            <span>{t.housesSection.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em] leading-[1.08] mb-3">
            {t.housesSection.titleStart}
            <span className="italic text-[#F3DC9B] font-semibold">
              {t.housesSection.titleHighlight}
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#B0BCCF] leading-relaxed max-w-xl mx-auto">
            {t.housesSection.subtitle}
          </p>

          {/* Element Filter Bar — Symmetric Centered Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {ELEMENTS_ORDER.map((elKey) => {
              const isSelected = selectedElement === elKey;
              const label =
                elKey === "ALL"
                  ? t.housesSection.filterAll
                  : t.housesSection.elements[elKey];
              return (
                <button
                  key={elKey}
                  type="button"
                  onClick={() => setSelectedElement(elKey)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-b from-[#F6D36B] to-[#E6AB3B] text-[#070A12] shadow-[0_6px_18px_rgba(234,179,68,0.28)]"
                      : "bg-[#0B111E]/90 border border-white/12 text-[#B0BCCF] hover:text-white hover:border-[#EAB344]/40"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.header>

        {/* 2. SYMMETRIC 3x4 LIVING VIDEO HOUSE GRID */}
        <section
          aria-label="Vitrine das 12 Casas Solares"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {filteredHouses.map((house, index) => {
            const Icon = ICON_MAP[house.iconKey];
            const themeHex = houseThemes[house.id]?.themeColor || "#EAB344";
            const elStyle = ELEMENT_STYLES[house.element];
            const localized = t.houses[house.id];

            return (
              <motion.button
                key={house.id}
                type="button"
                onClick={() => navigate(`/casas/${house.id}`)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.25) }}
                className="group relative w-full h-full text-left rounded-2xl bg-[#0B111E]/92 hover:bg-[#111A2E]/95 border border-white/[0.09] hover:border-[#EAB344]/45 active:scale-[0.985] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB344]"
              >
                {/* TOP CINEMA VIDEO HEADER (16:10 uniform aspect ratio) */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#060911] shrink-0">
                  <HouseVideoPreview
                    houseId={house.id}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    overlayClassName="absolute inset-0 bg-gradient-to-t from-[#0B111E] via-[#060911]/25 to-black/25 pointer-events-none"
                  />

                  {/* Top Row Badges over Video */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#060911]/80 backdrop-blur-md border border-white/15 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F8FAFC]">
                      <Icon className="w-3.5 h-3.5" style={{ color: themeHex }} />
                      <span>Casa {house.numberLabel}</span>
                    </span>

                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.12em] border backdrop-blur-md"
                      style={{
                        color: elStyle.text,
                        backgroundColor: "rgba(6, 9, 17, 0.72)",
                        borderColor: elStyle.border,
                      }}
                    >
                      {t.housesSection.elements[house.element]}
                    </span>
                  </div>

                  {/* Bottom Theme Tag + Personalization Indicator (ZERO Fixed Cities!) */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060911]/80 backdrop-blur-md border border-white/12 text-[11px] font-sans font-semibold text-[#F3DC9B]">
                      <Sparkles className="w-3 h-3 text-[#EAB344]" />
                      <span>{localized?.shortTag}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-[#060911]/80 backdrop-blur-md border border-white/12 text-[10px] font-sans font-medium text-[#B0BCCF] group-hover:text-white transition-colors">
                      Varia p/ cada pessoa
                    </span>
                  </div>
                </div>

                {/* EQUAL-HEIGHT CARD BODY */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 w-full">
                  <div className="space-y-3">
                    <h2 className="font-display text-xl font-bold text-[#F8FAFC] leading-snug group-hover:text-[#F3DC9B] transition-colors">
                      {localized?.title || house.title}
                    </h2>

                    <p className="font-sans text-[13.5px] text-[#B0BCCF] leading-relaxed line-clamp-2">
                      {localized?.profile || house.profile}
                    </p>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
                      <span className="block text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#EAB344] mb-1">
                        {t.housesSection.activatesLabel}
                      </span>
                      <p className="font-sans text-xs text-[#F8FAFC]/90 leading-relaxed line-clamp-2">
                        {localized?.focus || house.cycleFocus}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs font-sans font-semibold text-[#F3DC9B] group-hover:text-[#EAB344] transition-colors">
                    <span>
                      {t.housesSection.exploreHouse} {house.numberLabel}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </section>

        {/* 3. BOTTOM CALLOUT CARD — SYMMETRIC */}
        <div className="mt-12 rounded-2xl border border-[#EAB344]/30 bg-[#0B111E]/95 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#EAB344] font-semibold">
              {t.checkIn.badge}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1">
              {t.hero.titleStart}
              <span className="italic text-[#F3DC9B]">{t.hero.titleHighlight}</span>
            </h3>
          </div>
          <Link to="/#consulta-gratuita" className="ps-btn-gold text-sm shrink-0 w-full sm:w-auto">
            <Compass className="w-4 h-4" />
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. FLOATING MOBILE CTA */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22 }}
            className="fixed left-4 right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:hidden z-40 flex justify-center pointer-events-none"
          >
            <Link
              to="/#consulta-gratuita"
              className="pointer-events-auto ps-btn-gold w-full max-w-md text-xs sm:text-sm shadow-[0_14px_34px_rgba(0,0,0,0.65)]"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
