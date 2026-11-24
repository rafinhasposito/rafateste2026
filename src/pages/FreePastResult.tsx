import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Plane, X } from "lucide-react";
import AppleResultPreviewV3 from "@/pages/AppleResultPreviewV3";
import { cityDatabase } from "@/data/houses";
import { HOUSES_SHOWCASE } from "@/data/housesShowcase";
import { HOME_CITY_DEFENSE } from "@/data/landingV3Data";
import { FOCUS_AREA_METADATA } from "@/lib/consultationUnlocks";
import { useI18n } from "@/lib/i18n";

export interface StoredFreePastPayload {
  userName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  pastYear: string;
  pastCityDisplay: string;
  pastCityShort: string;
  pastCountry: string;
  pastLat: number;
  pastLon: number;
  pastHouse: number;
  sunSign?: string | null;
  ascendant?: string | null;
  returnDate?: string | null;
  returnTimeUtc?: string | null;
  nextYear: string;
  nextStayHouse?: number | null;
  usedApproximateTime?: boolean;
}

export const FREE_PAST_STORAGE_KEY = "ps_free_past_result_v1";

const FreePastResult = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [payload, setPayload] = useState<StoredFreePastPayload | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [nextDrawerOpen, setNextDrawerOpen] = useState(false);
  const [targetFutureHouse, setTargetFutureHouse] = useState<number | null>(null);
  const [showFloatingBridge, setShowFloatingBridge] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingBridge(window.scrollY > 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FREE_PAST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredFreePastPayload;
        if (parsed?.pastHouse && parsed?.birthDate) {
          setPayload(parsed);
        }
      }
    } catch {
      // ignore invalid json
    } finally {
      setCheckedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (checkedStorage && !payload) {
      navigate("/#consulta-gratuita", { replace: true });
    }
  }, [checkedStorage, payload, navigate]);

  useEffect(() => {
    if (!nextDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNextDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextDrawerOpen]);

  const allFocusIds = useMemo(() => FOCUS_AREA_METADATA.map((f) => f.id), []);

  if (!payload) {
    return <div className="min-h-screen bg-[#060911]" />;
  }

  const houseNum = payload.pastHouse;
  const houseObj = cityDatabase[houseNum] || cityDatabase[2];
  const masterCity = {
    city: payload.pastCityShort,
    country: payload.pastCountry || "Brasil",
    continent: "Américas",
    display_name: payload.pastCityDisplay,
    lat: payload.pastLat,
    lon: payload.pastLon,
    score: 98,
  };

  const allResults = {
    [String(houseNum)]: {
      city: masterCity,
      options: {
        nacional: masterCity,
        acessivel: null,
        highticket: masterCity,
      },
    },
  };

  const unlockedFocuses = {
    [String(houseNum)]: allFocusIds,
  };

  const nextStayShowcase = payload.nextStayHouse
    ? HOUSES_SHOWCASE.find((h) => h.id === payload.nextStayHouse) || null
    : null;
  const nextStayDefense = payload.nextStayHouse
    ? HOME_CITY_DEFENSE[payload.nextStayHouse] || HOME_CITY_DEFENSE[1]
    : null;
  const chosenShowcase = targetFutureHouse
    ? HOUSES_SHOWCASE.find((h) => h.id === targetFutureHouse) || null
    : null;

  const openFutureBridge = (houseToTarget?: number) => {
    if (houseToTarget && houseToTarget >= 1 && houseToTarget <= 12) {
      setTargetFutureHouse(houseToTarget);
    } else {
      setTargetFutureHouse(null);
    }
    setNextDrawerOpen(true);
  };

  const handleChoosePlan = (pkg: "1" | "3" | "full") => {
    const ret = targetFutureHouse
      ? `/?mode=futuro&path=casa&house=${targetFutureHouse}`
      : "/?mode=futuro";
    navigate(`/credits?pkg=${pkg}&returnTo=${encodeURIComponent(ret)}`);
  };

  const planCards = [
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

  const drawerModal = (
    <AnimatePresence>
      {nextDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNextDrawerOpen(false)}
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-3xl bg-[#0B111E] text-[#F8FAFC] border border-[#EAB344]/40 shadow-2xl overflow-hidden my-auto font-sans"
          >
            <div className="px-6 py-4 bg-[#111A2E] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4 text-[#EAB344]" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F3DC9B]">
                  {t.pastReport.drawerBadge} · {payload.nextYear}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNextDrawerOpen(false)}
                aria-label="Fechar"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
              {nextStayShowcase && nextStayDefense && (
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F3DC9B]">
                      {t.pastReport.stayWarningPrefix} {payload.pastCityShort} ({payload.nextYear}):
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                      Casa {nextStayShowcase.numberLabel} — {t.houses[nextStayShowcase.id]?.title || nextStayShowcase.title}
                    </h3>
                    <p className="text-xs text-[#B0BCCF]">{nextStayDefense.strength}</p>
                  </div>
                  {chosenShowcase && (
                    <span className="shrink-0 px-3.5 py-2 rounded-xl bg-[#EAB344]/15 border border-[#EAB344]/40 text-xs text-[#F3DC9B] font-semibold">
                      Casa {chosenShowcase.numberLabel}
                    </span>
                  )}
                </div>
              )}

              <div className="text-center sm:text-left">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-1">
                  {t.pastReport.drawerTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#B0BCCF]">
                  {t.pricing.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {planCards.map((plan) => (
                  <div
                    key={plan.pkg}
                    className={`rounded-2xl p-6 flex flex-col justify-between border ${
                      plan.featured
                        ? "bg-[#111A2E] border-2 border-[#EAB344] shadow-[0_14px_36px_rgba(234,179,68,0.18)]"
                        : "bg-[#060911]/85 border-white/12"
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#EAB344] font-semibold">
                        {plan.featured ? t.pricing.mostPopular : plan.copy.tag}
                      </span>
                      <h4 className="font-display text-xl font-bold text-[#F8FAFC]">
                        {plan.copy.name}
                      </h4>
                      <div className="flex items-baseline gap-1 py-2 border-y border-white/10">
                        <span className="text-xs font-semibold text-[#F3DC9B]">R$</span>
                        <span className="font-display text-4xl font-bold text-[#F8FAFC] tabular-nums">
                          {plan.priceInt}
                        </span>
                        <span className="text-sm font-semibold text-[#B0BCCF]">
                          ,{plan.priceDec}
                        </span>
                      </div>
                      <ul className="space-y-2 pt-1">
                        {plan.copy.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-[#F8FAFC]/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB344] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChoosePlan(plan.pkg)}
                      className={`mt-6 w-full ${plan.featured ? "ps-btn-gold text-xs" : "ps-btn-glass text-xs"}`}
                    >
                      {plan.copy.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-screen bg-[#060911] pt-14 lg:pt-0">
      {/* Top Action Bar */}
      <div className="sticky top-[52px] lg:top-20 z-30 bg-[#060911]/92 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/#consulta-gratuita"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B0BCCF] hover:text-white shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#EAB344]" />
            <span>{t.pastReport.backOtherYear}</span>
          </Link>

          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#F3DC9B] truncate text-right sm:text-center">
            {payload.pastCityShort} · {payload.pastYear} · Casa {String(houseNum).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={() => openFutureBridge()}
            className="hidden sm:inline-flex shrink-0 px-4 py-1.5 rounded-full bg-gradient-to-b from-[#F6D36B] to-[#E6AB3B] text-[#070A12] font-bold text-xs"
          >
            {t.pastReport.planNextYearBtn} ({payload.nextYear})
          </button>
        </div>
      </div>

      {/* FULL SPECTACULAR PAST RESULT PAGE (AppleResultPreviewV3 in mode="passado" with all 8 life areas unlocked) */}
      <AppleResultPreviewV3
        hideShellChrome={true}
        mode="passado"
        userName={payload.userName}
        birthDate={payload.birthDate}
        birthTime={payload.birthTime}
        birthPlace={payload.birthPlace}
        originName={payload.pastCityDisplay}
        targetYear={payload.pastYear}
        sunSign={payload.sunSign || undefined}
        ascendantSign={payload.ascendant || undefined}
        returnDate={payload.returnDate || undefined}
        returnTimeUtc={payload.returnTimeUtc || undefined}
        goalHouse={houseNum}
        house={houseNum}
        houseName={houseObj.label}
        houseData={houseObj}
        cities={{ highticket: [masterCity], acessivel: [], nacional: [masterCity] }}
        allResults={allResults}
        unlockedFocuses={unlockedFocuses}
        unlockedHousesList={[houseNum]}
        unlockedCount={1}
        autoUnlocked={true}
        isHouseUnlocked={(h) => h === houseNum}
        onSelectHouse={(h) => {
          if (h !== houseNum) openFutureBridge(h);
        }}
        onUnlock={(h) => {
          openFutureBridge(h > 0 ? h : undefined);
        }}
        onNavigateCredits={(pkg) => {
          const validPkg = pkg === "1" || pkg === "3" || pkg === "full" ? pkg : "3";
          handleChoosePlan(validPkg);
        }}
      />

      {/* Floating Gold Conversion Bridge (glides in smoothly after Hero scroll) */}
      <AnimatePresence>
        {showFloatingBridge && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-[72px] lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-2xl pointer-events-auto"
          >
            <div className="rounded-2xl bg-[#0B111E]/95 backdrop-blur-2xl border border-[#EAB344]/55 px-4 sm:px-6 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.82)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F3DC9B] block">
                  {t.pastReport.bridgeQuestion} {payload.pastYear}?
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
                  {t.pastReport.bridgeSub} ({payload.nextYear})
                </p>
              </div>
              <button
                type="button"
                onClick={() => openFutureBridge()}
                className="ps-btn-gold w-full sm:w-auto shrink-0 text-xs"
              >
                {t.pastReport.planNextYearBtn} ({payload.nextYear})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {typeof document !== "undefined" ? createPortal(drawerModal, document.body) : null}
    </div>
  );
};

export default FreePastResult;
