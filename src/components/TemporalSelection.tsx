import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Mode = "futuro" | "passado" | "presente";

interface ModeOption {
  id: Mode;
  title: string;
  tagline: string;
  desc: string;
  number: string;
}

const modeOptions: ModeOption[] = [
  {
    id: "passado",
    title: "PASSADO",
    tagline: "Revisar o ano que passou",
    desc: "Descubra qual área da vida esteve em destaque no seu último aniversário.",
    number: "01",
  },
  {
    id: "presente",
    title: "PRESENTE",
    tagline: "Entender o momento atual",
    desc: "Veja o que está guiando o seu ano agora — a partir de onde você passou seu aniversário.",
    number: "02",
  },
  {
    id: "futuro",
    title: "FUTURO",
    tagline: "Planejar o próximo ano",
    desc: "Escolha onde passar seu próximo aniversário e descubra o que cada cidade coloca em destaque.",
    number: "03",
  },
];

interface Props {
  onSelectMode: (m: Mode) => void;
}

// ─── Desktop: Full-viewport scene, hero top-left, timeline bottom ─────────────
// Scrollytelling implementation
function DesktopScene({ onSelectMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Hero text fades out on initial scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  // Timeline line scales up with scroll
  const lineScaleX = useTransform(scrollYProgress, [0, 0.9], [0.3, 1]);

  // Crossfade between the 5 web assets based on scroll
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const bg3Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const bg4Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const bg5Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);

  // Timeline UI opacity: starts a bit dim, highlights based on scroll section
  const opt1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.45, 0.55, 0.65], [0.6, 0.6, 1, 1, 0.6]);
  const opt2Opacity = useTransform(scrollYProgress, [0, 0.55, 0.65, 0.75, 0.85], [0.6, 0.6, 1, 1, 0.6]);
  const opt3Opacity = useTransform(scrollYProgress, [0, 0.75, 0.85, 1], [0.6, 0.6, 1, 1]);
  const optOpacities = [opt1Opacity, opt2Opacity, opt3Opacity];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-y-scroll"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Tall scroll area for narrative (400vh allows enough room for 5 states) */}
      <div style={{ height: "400vh" }}>

        {/* ── Fixed background scene ── */}
        <div className="fixed inset-0 bg-[#030306]" style={{ zIndex: 0, top: 56 }}>
          <motion.img style={{ opacity: bg1Opacity }} src="/temporal-web-01.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg2Opacity }} src="/temporal-web-02.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg3Opacity }} src="/temporal-web-03.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg4Opacity }} src="/temporal-web-04.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg5Opacity }} src="/temporal-web-05.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />

          {/* Overlays to ensure text legibility */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030306]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#030306]/90 to-transparent pointer-events-none" />
        </div>

        {/* ── Hero — top-left, scroll-animated out ── */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="fixed left-0 right-0 top-14 pointer-events-none"
          style2={{ zIndex: 20 }}
        >
          <div className="px-14 pt-10">
            <span className="block font-inter text-[10px] tracking-[0.35em] text-[#D4AF37]/80 uppercase mb-4">
              Ponto de Partida
            </span>
            <h2 className="font-cinzel text-5xl xl:text-6xl text-white mb-5 tracking-wide drop-shadow-lg leading-tight">
              SELEÇÃO TEMPORAL
            </h2>
            <p className="font-inter text-white/65 text-sm xl:text-base font-light max-w-xs leading-relaxed drop-shadow-md">
              Role para explorar o cenário. Cada linha do tempo revela
              uma configuração energética única.
            </p>
          </div>
        </motion.div>

        {/* ── Timeline — fixed at ~65% height, always visible ── */}
        <div
          className="fixed left-0 right-0 px-12"
          style={{ zIndex: 30, top: "calc(56px + 65vh)" }}
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative flex items-start justify-between w-full">
              {/* Animated line — sits on top of the nodes */}
              <div className="absolute top-[7px] left-[6%] right-[6%] h-[1px] overflow-hidden">
                <motion.div
                  style={{ scaleX: lineScaleX, transformOrigin: "left" }}
                  className="w-full h-full bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/40 to-[#D4AF37]/15"
                />
              </div>

              {modeOptions.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  style={{ opacity: optOpacities[i] }}
                  onClick={() => onSelectMode(opt.id)}
                  whileHover={{ scale: 1.05, y: -4, opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col items-center text-center focus:outline-none flex-1"
                >
                  <div className="relative z-10 w-[7px] h-[7px] rounded-full border border-[#D4AF37]/50 bg-[#030306] mb-4 transition-all duration-400 group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.9)]" />
                  <span className="block font-mono text-[9px] text-[#D4AF37]/60 tracking-[0.25em] mb-1.5 transition-colors group-hover:text-[#D4AF37]">
                    {opt.number}
                  </span>
                  <h3 className="font-cinzel text-lg xl:text-xl tracking-[0.08em] text-white/80 group-hover:text-[#D4AF37] transition-colors duration-400 mb-1 drop-shadow-md">
                    {opt.title}
                  </h3>
                  <span className="block font-inter text-[9px] tracking-[0.15em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-400 mb-1.5">
                    {opt.tagline}
                  </span>
                  <p className="font-inter text-[10px] text-white/35 leading-relaxed group-hover:text-white/60 transition-colors duration-400 max-w-[170px]">
                    {opt.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Mobile: Vertical Interactive Timeline ─────────────────────────────────────
function MobileTimeline({ onSelectMode }: Props) {
  return (
    <div className="relative w-full min-h-[100svh] overflow-hidden flex flex-col bg-[#030306]">
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="/temporal-mobile-bg.webp"
          alt=""
          className="w-full h-full object-cover object-center opacity-90"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#030306]/95 via-[#030306]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#030306]/85 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-[100svh] pt-16 pb-24 px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="block font-inter text-[9px] tracking-[0.3em] text-[#D4AF37]/80 uppercase mb-3">
            Ponto de Partida
          </span>
          <h2 className="font-cinzel text-[2rem] text-white mb-3 tracking-wide drop-shadow-md leading-tight">
            SELEÇÃO<br />TEMPORAL
          </h2>
          <p className="font-inter text-white/55 text-xs font-light max-w-[240px] mx-auto leading-relaxed">
            Escolha o período que deseja explorar.
          </p>
        </motion.div>

        <div className="relative flex flex-col gap-0">
          <motion.div
            className="absolute left-[19px] top-4 bottom-4 w-[1px]"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.25), rgba(212,175,55,0.25), transparent)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />

          {modeOptions.map((opt, i) => (
            <motion.button
              key={opt.id}
              onClick={() => onSelectMode(opt.id)}
              className="group relative flex items-start text-left w-full focus:outline-none active:scale-[0.98] transition-transform"
            >
              <div className="relative shrink-0 w-10 h-[76px] flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 group-active:border-[#D4AF37]/60 transition-all duration-300 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 group-active:bg-[#D4AF37]/10" />
                <div className="relative z-10 w-[7px] h-[7px] rounded-full border border-[#D4AF37]/50 bg-[#030306] group-hover:bg-[#D4AF37]/80 group-active:bg-[#D4AF37] group-hover:shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all duration-300" />
              </div>

              <div className="flex-1 py-3 border-b border-white/5 group-hover:border-[#D4AF37]/20 group-active:border-[#D4AF37]/40 transition-colors duration-300 pr-2">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-[9px] text-[#D4AF37]/60 tracking-[0.25em]">
                    {opt.number}
                  </span>
                  <h3 className="font-cinzel text-[1.15rem] tracking-[0.08em] text-white/90 group-hover:text-white group-active:text-[#D4AF37] transition-colors duration-300 drop-shadow-md">
                    {opt.title}
                  </h3>
                </div>
                <div className="font-inter text-[9px] tracking-[0.15em] uppercase text-[#D4AF37]/60 mb-1.5">
                  {opt.tagline}
                </div>
                <p className="font-inter text-[11px] text-white/45 leading-relaxed">
                  {opt.desc}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center w-8 mt-3 text-white/20 group-hover:text-[#D4AF37]/60 group-active:text-[#D4AF37] transition-colors duration-300 text-sm">
                →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function TemporalSelection({ onSelectMode }: Props) {
  return (
    <>
      {/* Desktop (>= 1024px): fixed scene, hero top-left, timeline bottom */}
      <div
        className="hidden lg:block"
        style={{ height: "calc(100vh - 56px)", position: "relative" }}
      >
        <DesktopScene onSelectMode={onSelectMode} />
      </div>

      {/* Mobile / Tablet: interactive vertical timeline */}
      <div className="lg:hidden">
        <MobileTimeline onSelectMode={onSelectMode} />
      </div>
    </>
  );
}
