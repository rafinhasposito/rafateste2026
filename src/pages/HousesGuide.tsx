import { useEffect, useState } from "react";
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
  Target,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import {
  ELEMENT_STYLES,
  HOUSES_SHOWCASE,
  type HouseIconKey,
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
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 220);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            aniversário destaca qual dessas 12 áreas ganha os holofotes nos
            próximos 12 meses. Toque em qualquer Casa para ver a página
            completa dela.
          </p>
        </motion.header>

        {/* 2. GRID MOBILE-FIRST DE 12 CASAS (CLIQUE ABRE PÁGINA COMPLETA /casas/:id) */}
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
                onClick={() => navigate(`/casas/${house.id}`)}
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

                  {/* Tema da Casa */}
                  <h2 className="font-ps-display text-lg sm:text-[19px] font-bold text-white leading-snug mb-3.5 group-hover:text-[#F5DE98] transition-colors">
                    {house.title}
                  </h2>

                  {/* Para quem é (identificação no 1º segundo) */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="w-3.5 h-3.5 shrink-0" style={{ color: themeHex }} />
                      <span
                        className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.16em]"
                        style={{ color: themeHex }}
                      >
                        Para quem é
                      </span>
                    </div>
                    <p className="font-ps-ui text-[13px] text-white/90 leading-snug font-medium">
                      {house.profile}
                    </p>
                  </div>

                  {/* A energia da cidade (direto ao ponto) */}
                  <div className="px-0.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 shrink-0 text-[#F5DE98]" />
                      <span className="text-[10px] font-ps-ui font-bold uppercase tracking-[0.16em] text-white/55">
                        A energia da cidade
                      </span>
                    </div>
                    <p className="font-ps-ui text-[13px] text-white/75 leading-relaxed">
                      {house.cycleFocus}
                    </p>
                  </div>
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

      {/* BARRA FIXA DISCRETA NO RODAPÉ (Aparece após rolar a Hero) */}
      <AnimatePresence>
        {showStickyCta && (
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
