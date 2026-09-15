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

// ─── Desktop: Scrollytelling ──────────────────────────────────────────────────
function DesktopScene({ onSelectMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -48]);
  const lineScaleX = useTransform(scrollYProgress, [0, 0.9], [0.25, 1]);

  const bg1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  const bg3Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const bg4Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const bg5Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);

  const opt1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.45, 0.55, 0.65], [0.55, 0.55, 1, 1, 0.55]);
  const opt2Opacity = useTransform(scrollYProgress, [0, 0.55, 0.65, 0.75, 0.85], [0.55, 0.55, 1, 1, 0.55]);
  const opt3Opacity = useTransform(scrollYProgress, [0, 0.75, 0.85, 1], [0.55, 0.55, 1, 1]);
  const optOpacities = [opt1Opacity, opt2Opacity, opt3Opacity];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-y-scroll"
      style={{ scrollbarWidth: "none" }}
    >
      <div style={{ height: "400vh" }}>

        {/* ── Fixed background scene ── */}
        <div className="fixed inset-0 bg-ps-void" style={{ zIndex: 0 }}>
          <motion.img style={{ opacity: bg1Opacity }} src="/temporal-web-01.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg2Opacity }} src="/temporal-web-02.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg3Opacity }} src="/temporal-web-03.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg4Opacity }} src="/temporal-web-04.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <motion.img style={{ opacity: bg5Opacity }} src="/temporal-web-05.webp" alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ps-void/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ps-void to-transparent pointer-events-none" />
        </div>

        {/* ── Hero — top-left, fades on scroll ── */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, zIndex: 20 }}
          className="fixed left-0 right-0"
          // Positioned below the 56px chrome header
          // Uses top-[72px] so content never clips behind the nav bar
          // and safe area inset-top is respected
        >
          <div className="px-14 pt-[72px]">
            <motion.span
              className="block font-ps-ui text-[11px] tracking-[0.3em] text-ps-gold/80 uppercase mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              O GPS do seu novo ciclo.
            </motion.span>
            <motion.h1
              className="font-ps-display text-[3.75rem] xl:text-[4.5rem] text-white mb-6 leading-[1.02] drop-shadow-xl max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
            >
              Descubra onde passar seu próximo aniversário.
            </motion.h1>
            <motion.p
              className="font-ps-ui text-ps-text/70 text-base font-light max-w-sm leading-relaxed drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Sua Revolução Solar revela os destinos mais alinhados
              ao ciclo que você deseja viver.
              <br className="hidden xl:block" />
              Role para explorar o período.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Timeline — fixed at bottom, always visible ── */}
        <div
          className="fixed left-0 right-0 px-12"
          style={{ zIndex: 30, bottom: "8vh" }}
        >
          <div className="w-full max-w-5xl mx-auto">
            {/* Scroll hint label */}
            <p className="font-ps-ui text-[10px] tracking-[0.3em] text-ps-muted/60 uppercase text-center mb-8">
              Escolha o período
            </p>
            <div className="relative flex items-start justify-between w-full">
              {/* Animated connecting line */}
              <div className="absolute top-[7px] left-[6%] right-[6%] h-[1px] overflow-hidden">
                <motion.div
                  style={{ scaleX: lineScaleX, transformOrigin: "left" }}
                  className="w-full h-full bg-gradient-to-r from-ps-gold/10 via-ps-gold/50 to-ps-gold/10"
                />
              </div>

              {modeOptions.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  style={{ opacity: optOpacities[i] }}
                  onClick={() => onSelectMode(opt.id)}
                  whileHover={{ scale: 1.06, y: -5, opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col items-center text-center focus:outline-none flex-1 min-h-[48px]"
                >
                  {/* Node */}
                  <div className="relative z-10 w-[8px] h-[8px] rounded-full border border-ps-gold/50 bg-ps-void mb-4 transition-all duration-300 group-hover:bg-ps-gold group-hover:border-ps-gold group-hover:shadow-[0_0_20px_rgba(201,162,39,0.9)]" />
                  <span className="block font-ps-ui text-[9px] text-ps-gold/60 tracking-[0.3em] mb-1.5 transition-colors group-hover:text-ps-gold">
                    {opt.number}
                  </span>
                  <h3 className="font-ps-display text-xl tracking-[0.06em] text-white/85 group-hover:text-ps-gold transition-colors duration-300 mb-1 drop-shadow">
                    {opt.title}
                  </h3>
                  <span className="block font-ps-ui text-[9px] tracking-[0.14em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-300 mb-2">
                    {opt.tagline}
                  </span>
                  <p className="font-ps-ui text-[11px] text-ps-muted/60 leading-relaxed group-hover:text-ps-muted/90 transition-colors duration-300 max-w-[160px]">
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

// ─── Mobile: Touch-first vertical layout ─────────────────────────────────────
function MobileTimeline({ onSelectMode }: Props) {
  return (
    <div className="relative w-full min-h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col bg-ps-void">
      {/* Background — mesmo universo visual do desktop: temporal-web-01.webp */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/temporal-web-01.webp"
          alt=""
          onError={(e) => { (e.target as HTMLImageElement).src = "/earth-milkyway.jpg"; }}
          className="w-full h-full object-cover object-center"
          draggable={false}
          style={{ filter: "brightness(0.88) contrast(1.08) saturate(1.05)" }}
        />
        {/* Overlay system idêntico ao desktop:
            - Faixa escura no topo (para o logo respirar)
            - Centro aberto (a imagem respira)
            - Faixa escura na base (para o conteúdo ser legível) */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        <div
          className="absolute inset-x-0 top-0 h-56 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(2,5,10,0.90) 0%, rgba(2,5,10,0.40) 60%, transparent 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(2,5,10,0.98) 0%, rgba(2,5,10,0.85) 35%, rgba(2,5,10,0.50) 65%, transparent 100%)" }}
        />
      </div>

      {/* Content — ancorado na base, igual ao desktop */}
      <div className="relative z-10 flex flex-col w-full min-h-[100svh]">

        {/* ── Logo no topo — discreta, posicionada sobre a faixa escura ── */}
        <motion.div
          className="flex items-start justify-start px-6 pt-[max(env(safe-area-inset-top,20px),20px)] mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/brand/protocolo-solar-logo-horizontal-4096.png"
            alt="Protocolo Solar"
            className="h-7 w-auto drop-shadow-lg opacity-90"
            draggable={false}
          />
        </motion.div>

        {/* Spacer — deixa o universo respirar no meio */}
        <div className="flex-1" />

        {/* ── Conteúdo principal — base da tela, igual ao desktop ── */}
        <div className="px-6 pb-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 32px), 96px)" }}>

          {/* Label — mesmo padrão do desktop */}
          <motion.span
            className="block font-ps-ui text-[10px] tracking-[0.32em] text-ps-gold/80 uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            O GPS do seu novo ciclo.
          </motion.span>

          {/* Headline — mesmo DNA do desktop, escalonada para mobile */}
          <motion.h1
            className="font-ps-display text-white leading-[1.06] mb-5 drop-shadow-xl"
            style={{ fontSize: "clamp(1.85rem, 8.5vw, 2.6rem)" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.85, ease: "easeOut" }}
          >
            Descubra onde passar seu próximo aniversário.
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            className="font-ps-ui text-ps-text/65 font-light leading-relaxed mb-8 max-w-sm drop-shadow"
            style={{ fontSize: "clamp(13px, 3.4vw, 15px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Sua Revolução Solar revela os destinos mais alinhados ao ciclo que você deseja viver.
          </motion.p>

          {/* ── CTA principal ── */}
          <motion.button
            onClick={() => onSelectMode("futuro")}
            className="w-full h-[54px] rounded-full font-ps-display tracking-wide flex items-center justify-center active:scale-[0.97] transition-all mb-4"
            style={{
              fontSize: "clamp(0.9rem, 4vw, 1rem)",
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 4px 24px rgba(201,162,39,0.50)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            DESCOBRIR MEU DESTINO
          </motion.button>

          {/* ── Caminhos secundários — mesma linguagem dos nós do desktop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <p className="font-ps-ui text-[10px] text-ps-muted/60 uppercase tracking-[0.28em] text-center mb-3">
              Explorar outros ciclos
            </p>
            <div className="flex gap-3">
              {[
                { id: "presente" as Mode, label: "Presente", sub: "Ciclo atual" },
                { id: "passado" as Mode, label: "Passado", sub: "Ciclo anterior" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectMode(opt.id)}
                  className="flex-1 min-h-[64px] rounded-xl flex flex-col items-start justify-center px-4 focus:outline-none active:scale-[0.97] transition-transform"
                  style={{
                    background: "rgba(7,16,26,0.80)",
                    border: "1px solid rgba(201,162,39,0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span className="block font-ps-display text-white text-[15px] mb-0.5 drop-shadow">
                    {opt.label}
                  </span>
                  <span className="block font-ps-ui text-ps-muted text-[11px]">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function TemporalSelection({ onSelectMode }: Props) {
  return (
    <>
      {/* Desktop (≥ 1024px) */}
      <div className="hidden lg:block" style={{ height: "calc(100vh - 56px)", position: "relative" }}>
        <DesktopScene onSelectMode={onSelectMode} />
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <MobileTimeline onSelectMode={onSelectMode} />
      </div>
    </>
  );
}
