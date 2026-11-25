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
  Megaphone,
  Moon,
  Network,
  RefreshCw,
  Sparkles,
  Trophy,
  Wallet,
} from "lucide-react";
import {
  HOUSES_SHOWCASE,
  type HouseElement,
  type HouseIconKey,
} from "@/data/housesShowcase";
import { getHousePalette } from "@/data/housePalette";
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

const ELEMENTS_ORDER: { key: "ALL" | HouseElement; dot: string }[] = [
  { key: "ALL", dot: "#EAB344" },
  { key: "Fogo", dot: "#E11D48" },
  { key: "Terra", dot: "#10B981" },
  { key: "Ar", dot: "#3B82F6" },
  { key: "Água", dot: "#8B5CF6" },
];

export default function HousesGuide() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useI18n();
  const [selectedElement, setSelectedElement] = useState<"ALL" | HouseElement>("ALL");
  const [hoveredHouseId, setHoveredHouseId] = useState<number>(2);
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

  const activeAmbient = getHousePalette(hoveredHouseId);

  return (
    <div className="min-h-screen bg-[#060911] text-[#F8FAFC] pt-20 pb-36 lg:pt-12 lg:pb-28 relative overflow-x-hidden">
      {/* Dynamic Per-House Chromatic Ambient Light */}
      <div
        className="pointer-events-none fixed -top-32 right-0 w-[680px] h-[680px] rounded-full blur-[150px] z-0 transition-all duration-700"
        style={{ background: activeAmbient.glowRgba }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* 1. ARCHITECTURAL SPLIT HEADER (Left Title · Right Multi-Color Filter) */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.06] text-[#F8FAFC] text-[11px] font-mono font-semibold uppercase tracking-[0.14em] mb-4">
              <Sparkles className="w-3.5 h-3.5" style={{ color: activeAmbient.hex }} />
              <span>{t.housesSection.badge}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em] leading-[1.08] mb-3">
              {t.housesSection.titleStart}
              <span
                className="italic font-semibold transition-colors duration-500"
                style={{ color: activeAmbient.softHex }}
              >
                {t.housesSection.titleHighlight}
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              Cada Casa representa a área da vida que assume o protagonismo dos seus próximos 12 meses. As cidades que ativam cada Casa são únicas para a sua certidão de nascimento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ELEMENTS_ORDER.map(({ key, dot }) => {
              const isSelected = selectedElement === key;
              const label =
                key === "ALL"
                  ? t.housesSection.filterAll
                  : t.housesSection.elements[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedElement(key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-bold transition-all active:scale-95 ${
                    isSelected
                      ? "bg-white text-[#070A12] shadow-lg"
                      : "bg-white/[0.05] border border-white/12 text-[#CBD5E1] hover:text-white hover:bg-white/[0.1]"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dot }}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </motion.header>

        {/* 2. 12-COLOR CELESTIAL LUXURY ARCHITECTURAL GALLERY */}
        <section
          aria-label="Vitrine das 12 Casas Solares"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {filteredHouses.map((house, index) => {
            const Icon = ICON_MAP[house.iconKey];
            const pal = getHousePalette(house.id);
            const localized = t.houses[house.id];

            return (
              <motion.button
                key={house.id}
                type="button"
                onMouseEnter={() => setHoveredHouseId(house.id)}
                onFocus={() => setHoveredHouseId(house.id)}
                onClick={() => navigate(`/casas/${house.id}`)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.02, 0.2) }}
                className="group relative w-full h-full text-left rounded-[24px] bg-[#0B101D] hover:bg-[#10182C] border border-white/10 active:scale-[0.985] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.45)] hover:-translate-y-1 focus:outline-none"
                style={{
                  borderColor: hoveredHouseId === house.id ? `${pal.hex}75` : undefined,
                }}
              >
                {/* Top Jewel Color Signature Strip */}
                <div className="w-full">
                  <div className="h-1.5 w-full" style={{ backgroundColor: pal.hex }} />

                  {/* Bespoke 16:9 Celestial Luxury Architectural Cinema Loop */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#05070D] shrink-0">
                    <HouseVideoPreview
                      houseId={house.id}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      overlayClassName="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/25 pointer-events-none"
                    />

                    {/* Top Row Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg"
                        style={{ backgroundColor: pal.hex }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                        <span>Casa {house.numberLabel}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-[0.12em] bg-black/65 backdrop-blur-md border border-white/15 text-white/90">
                        {t.housesSection.elements[house.element]}
                      </span>
                    </div>

                    {/* Bottom Chromatic Tag */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span
                        className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-sans font-bold"
                        style={{ color: pal.softHex }}
                      >
                        {localized?.shortTag}
                      </span>
                      <span className="text-[10px] font-mono text-white/80 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        Cidades sob medida
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4 w-full">
                  <div className="space-y-3">
                    <h2 className="font-display text-[22px] font-bold text-[#F8FAFC] leading-snug">
                      {localized?.title || house.title}
                    </h2>

                    <p className="font-sans text-[13.5px] text-[#CBD5E1] leading-relaxed line-clamp-2">
                      {localized?.profile || house.profile}
                    </p>

                    <div
                      className="rounded-xl border px-3.5 py-3"
                      style={{
                        backgroundColor: pal.surfaceTint,
                        borderColor: `${pal.hex}38`,
                      }}
                    >
                      <span
                        className="block text-[10px] font-mono font-bold uppercase tracking-[0.14em] mb-1"
                        style={{ color: pal.softHex }}
                      >
                        {t.housesSection.activatesLabel}
                      </span>
                      <p className="font-sans text-xs text-white/95 leading-relaxed line-clamp-2">
                        {localized?.focus || house.cycleFocus}
                      </p>
                    </div>
                  </div>

                  <div
                    className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans font-bold"
                    style={{ color: pal.softHex }}
                  >
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

        {/* 3. WARM TRAVERTINE BOARDING CALLOUT CARD (High-Contrast Break!) */}
        <div className="mt-14 rounded-[28px] bg-[#FAF6EE] text-[#111520] p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_24px_65px_rgba(0,0,0,0.5)]">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#111520] text-[#F7D774] font-mono text-[11px] uppercase tracking-[0.14em] font-bold mb-3">
              {t.checkIn.badge}
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#111520] leading-tight">
              Descubra grátis qual dessas 12 Casas comandou o seu último aniversário.
            </h3>
            <p className="text-sm text-[#111520]/70 mt-2">
              Sem cartão e sem cadastro obrigatório — tire a prova na prática em 30 segundos.
            </p>
          </div>
          <Link
            to="/#consulta-gratuita"
            className="inline-flex items-center justify-center gap-2.5 h-[54px] px-7 rounded-full bg-[#111520] hover:bg-[#1E2538] text-[#F7D774] font-bold text-sm shrink-0 w-full sm:w-auto shadow-xl transition-all"
          >
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
