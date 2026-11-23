import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
  Wallet,
  X,
} from "lucide-react";
import {
  ELEMENT_STYLES,
  HOUSES_SHOWCASE,
  type HouseIconKey,
  type HouseShowcaseItem,
} from "@/data/housesShowcase";
import { houseThemes } from "@/data/houseThemes";

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

export default function HousesGuide() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  const selectedHouse: HouseShowcaseItem | null =
    selectedHouseId !== null
      ? HOUSES_SHOWCASE.find((h) => h.id === selectedHouseId) ?? null
      : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Show sticky bar only after scrolling past the hero
  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 220);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll & keyboard navigation while Bottom Sheet is open
  const goPrevHouse = useCallback(() => {
    setSelectedHouseId((curr) => (curr === null ? null : curr === 1 ? 12 : curr - 1));
  }, []);

  const goNextHouse = useCallback(() => {
    setSelectedHouseId((curr) => (curr === null ? null : curr === 12 ? 1 : curr + 1));
  }, []);

  useEffect(() => {
    if (selectedHouseId === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedHouseId(null);
      else if (e.key === "ArrowLeft") goPrevHouse();
      else if (e.key === "ArrowRight") goNextHouse();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedHouseId, goPrevHouse, goNextHouse]);

  const handleActivateHouse = (houseId: number) => {
    setSelectedHouseId(null);
    navigate(`/?mode=futuro&path=casa&house=${houseId}`);
  };

  return (
    <div className="min-h-screen bg-[#02050A] text-white pt-20 pb-40 lg:pt-28 lg:pb-32 relative overflow-x-hidden">
      {/* Ambient Solar Mesh Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 68% 42% at 50% 0%, rgba(201,162,39,0.14) 0%, rgba(10,16,30,0.4) 52%, transparent 78%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* 1. HERO & EXPLICAÇÃO EM 15 SEGUNDOS */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#F5DE98] text-[10px] font-ps-ui font-bold uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Painel do Seu Novo Ano</span>
          </div>

          <h1 className="font-ps-display text-3xl sm:text-5xl md:text-[54px] font-bold text-white tracking-[-0.03em] leading-[1.06] mb-3">
            As 12 Casas Solares
          </h1>

          <p className="font-ps-display text-base sm:text-xl text-[#F5DE98] font-medium mb-4">
            O painel de controle do seu próximo ano pessoal.
          </p>

          <p className="font-ps-ui text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            O seu mapa de nascimento é fixo, mas a cidade onde você passa o
            aniversário escolhe qual dessas 12 áreas ganha os holofotes nos
            próximos 12 meses. Toque em qualquer Casa para ver o que ela
            destrava na prática.
          </p>
        </motion.header>

        {/* 2. GRID MOBILE-FIRST DE 12 SUPERPODERES */}
        <section
          aria-label="Vitrine das 12 Casas Solares"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {HOUSES_SHOWCASE.map((house, index) => {
            const Icon = ICON_MAP[house.iconKey];
            const themeHex = houseThemes[house.id]?.themeColor || "#C9A227";
            const elStyle = ELEMENT_STYLES[house.element];

            return (
              <motion.button
                key={house.id}
                type="button"
                onClick={() => setSelectedHouseId(house.id)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.28) }}
                className="group relative w-full min-h-[212px] text-left p-5 sm:p-6 rounded-[24px] bg-[#08101E]/85 hover:bg-[#0D182C]/95 border border-white/[0.08] hover:border-white/[0.22] active:scale-[0.985] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                {/* Spotlight sutil na cor da Casa */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${themeHex}, transparent 68%)`,
                  }}
                />
                {/* Linha superior luminosa 1px */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-45 group-hover:opacity-90 transition-opacity pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${themeHex}, transparent)`,
                  }}
                />

                <div className="relative z-10 w-full">
                  {/* Topo: Número + Ícone + Badge Elemento */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: `${themeHex}18`,
                          borderColor: `${themeHex}42`,
                        }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: themeHex }} />
                      </div>
                      <span
                        className="font-mono text-xs font-bold uppercase tracking-[0.18em]"
                        style={{ color: themeHex }}
                      >
                        Casa {house.numberLabel}
                      </span>
                    </div>

                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-ps-ui font-semibold uppercase tracking-[0.14em] border"
                      style={{
                        color: elStyle.text,
                        backgroundColor: elStyle.bg,
                        borderColor: elStyle.border,
                      }}
                    >
                      {elStyle.label}
                    </span>
                  </div>

                  {/* Título com apelo real */}
                  <h2 className="font-ps-display text-lg sm:text-[19px] font-bold text-white leading-snug mb-2.5 group-hover:text-[#F5DE98] transition-colors">
                    {house.title}
                  </h2>

                  {/* Frase de impacto na vida real */}
                  <p className="font-ps-ui text-[13.5px] sm:text-sm text-white/68 leading-relaxed">
                    “{house.hook}”
                  </p>
                </div>

                {/* Rodapé sutil de ação */}
                <div className="relative z-10 pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between w-full">
                  <span className="text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em] text-white/55 group-hover:text-white transition-colors">
                    Ver detalhes desta área
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/[0.05] group-hover:bg-[#C9A227]/20 border border-white/[0.08] group-hover:border-[#C9A227]/45 flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 text-white/65 group-hover:text-[#F5DE98] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </section>
      </div>

      {/* 3. BOTTOM SHEET (MOBILE) / MODAL LUXURY (DESKTOP) — PORTALED ACIMA DO CHROME */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedHouse && (() => {
              const SelectedIcon = ICON_MAP[selectedHouse.iconKey];
              const themeHex = houseThemes[selectedHouse.id]?.themeColor || "#C9A227";
              const elStyle = ELEMENT_STYLES[selectedHouse.element];

              return (
                <motion.div
                  key="house-sheet-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedHouseId(null)}
                  className="fixed inset-0 z-[100] bg-black/78 backdrop-blur-md flex items-end md:items-center justify-center md:p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="house-sheet-title"
                >
                  <motion.div
                    key={`sheet-card-${selectedHouse.id}`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { y: 48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { y: 40, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full md:max-w-xl max-h-[92svh] overflow-y-auto rounded-t-[28px] md:rounded-[30px] border-t md:border border-white/15 bg-[#070D19]/98 shadow-[0_-24px_80px_rgba(0,0,0,0.9)]"
                    style={{
                      paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
                    }}
                  >
                    {/* Brilho sutil no topo na cor da Casa */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-25"
                      style={{
                        background: `radial-gradient(ellipse 85% 90% at 50% 0%, ${themeHex}, transparent 75%)`,
                      }}
                    />

                    {/* Handle bar mobile */}
                    <div className="md:hidden flex justify-center pt-2.5 pb-1 relative z-10">
                      <div className="w-11 h-1.5 rounded-full bg-white/20" />
                    </div>

                    <div className="relative z-10 px-5 pt-3 pb-4 sm:p-7">
                      {/* Top controls: Prev / Next + Close */}
                      <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center border"
                            style={{
                              backgroundColor: `${themeHex}22`,
                              borderColor: `${themeHex}50`,
                            }}
                          >
                            <SelectedIcon className="w-4.5 h-4.5" style={{ color: themeHex }} />
                          </div>
                          <span
                            className="font-mono text-xs font-bold uppercase tracking-[0.18em]"
                            style={{ color: themeHex }}
                          >
                            Casa {selectedHouse.numberLabel}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-ps-ui font-semibold uppercase tracking-[0.12em] border"
                            style={{
                              color: elStyle.text,
                              backgroundColor: elStyle.bg,
                              borderColor: elStyle.border,
                            }}
                          >
                            {elStyle.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={goPrevHouse}
                            aria-label="Casa anterior"
                            className="w-9 h-9 rounded-full border border-white/12 bg-white/[0.05] hover:bg-white/[0.12] flex items-center justify-center text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={goNextHouse}
                            aria-label="Próxima Casa"
                            className="w-9 h-9 rounded-full border border-white/12 bg-white/[0.05] hover:bg-white/[0.12] flex items-center justify-center text-white/80 hover:text-white transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedHouseId(null)}
                            aria-label="Fechar detalhes"
                            className="w-9 h-9 rounded-full border border-white/12 bg-white/[0.05] hover:bg-white/[0.12] flex items-center justify-center text-white/80 hover:text-white transition-colors ml-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Título da Casa */}
                      <h2
                        id="house-sheet-title"
                        className="font-ps-display text-[22px] sm:text-3xl font-bold text-white leading-tight mb-4 sm:mb-5"
                      >
                        {selectedHouse.title}
                      </h2>

                      {/* 4 BLOCOS CURTOS E ESCANEÁVEIS */}
                      <div className="flex flex-col gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
                        {/* Bloco 1: O que destrava */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 sm:p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: themeHex }} />
                            <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em] text-white/60">
                              O que destrava
                            </span>
                          </div>
                          <p className="font-ps-ui text-[13.5px] sm:text-[15px] text-white/90 leading-relaxed">
                            {selectedHouse.unlocks}
                          </p>
                        </div>

                        {/* Bloco 2: Para quem é o ano perfeito */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 sm:p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-3.5 h-3.5 shrink-0" style={{ color: themeHex }} />
                            <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em] text-white/60">
                              Para quem é o ano perfeito
                            </span>
                          </div>
                          <p className="font-ps-ui text-[13.5px] sm:text-[15px] text-white/85 leading-relaxed">
                            {selectedHouse.idealFor}
                          </p>
                        </div>

                        {/* Bloco 3: Exemplo de Cidade-Símbolo */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 sm:p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#F5DE98]" />
                            <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.2em] text-white/60">
                              Exemplo de Cidade-Símbolo
                            </span>
                          </div>
                          <p className="font-ps-ui text-[13.5px] sm:text-[15px] text-white/90 leading-relaxed">
                            <strong className="text-white font-semibold">
                              {selectedHouse.symbolCity.name} ({selectedHouse.symbolCity.country})
                            </strong>{" "}
                            — {selectedHouse.symbolCity.reason}
                          </p>
                          <p className="font-ps-ui text-[11px] text-white/45 mt-1.5">
                            Exemplo simbólico desta energia. No seu mapa, as cidades reais são calculadas pela sua data e hora de nascimento.
                          </p>
                        </div>
                      </div>

                      {/* Bloco 4: Botão de Ação Direta */}
                      <button
                        type="button"
                        onClick={() => handleActivateHouse(selectedHouse.id)}
                        className="w-full min-h-[52px] px-4 sm:px-5 py-3.5 rounded-2xl font-ps-display font-bold text-[13.5px] sm:text-base tracking-wide bg-[#C9A227] hover:bg-[#E5C158] active:scale-[0.98] text-[#02050A] transition-all flex items-center justify-center gap-2 shadow-[0_12px_34px_rgba(201,162,39,0.34)]"
                      >
                        <span>Quero ativar a Casa {selectedHouse.numberLabel} no meu aniversário</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      <div className="mt-3 text-center">
                        <Link
                          to={`/casas/${selectedHouse.id}`}
                          onClick={() => setSelectedHouseId(null)}
                          className="inline-flex items-center gap-1.5 text-xs font-ps-ui text-white/55 hover:text-[#F5DE98] transition-colors py-1"
                        >
                          <span>Ver leitura completa das 8 áreas nesta Casa</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>,
          document.body
        )}

      {/* 5. BARRA FIXA DISCRETA NO RODAPÉ (Aparece após rolar a Hero e some quando a gaveta abre) */}
      <AnimatePresence>
        {showStickyCta && selectedHouseId === null && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-[76px] lg:bottom-5 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center"
          >
            <div
              className="pointer-events-auto w-full max-w-xl rounded-2xl border border-[#C9A227]/30 px-4 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-3 shadow-[0_16px_48px_rgba(0,0,0,0.75)]"
              style={{
                background: "rgba(7, 13, 25, 0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <p className="font-ps-ui text-xs sm:text-sm font-medium text-white/85 whitespace-nowrap">
                <span className="sm:hidden">Em dúvida?</span>
                <span className="hidden sm:inline">Ficou em dúvida de qual Casa escolher?</span>
              </p>
              <Link
                to="/?mode=futuro"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] active:scale-[0.98] text-[#02050A] font-ps-ui text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">Descobrir Destino Ideal</span>
                <span className="hidden sm:inline">Descobrir Meu Destino Ideal</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
