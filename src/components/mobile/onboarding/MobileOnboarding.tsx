import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── DESIGN SYSTEM ─────────────────────────────────────────────────────────────
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F3E5AB";
const BG = "#030306";
const WHITE = "#F4F1EA";
const BODY = "#A8AAB8";

// ─── DADOS DAS 4 TELAS (ALTA CONVERSÃO) ─────────────────────────────────────────
const SCREENS = [
  {
    id: 1,
    bg: "orbital", 
    title: ["O CÉU SE MOVE.", "E O SEU MAPA TAMBÉM."],
    body: "O lugar onde você passa o seu aniversário ativa focos diferentes para o seu ano pessoal.",
    visual: null,
  },
  {
    id: 2,
    bg: "globe", 
    title: ["CADA CIDADE,", "UMA NOVA ENERGIA."],
    body: "Descubra como mudar de localização pode abrir novas oportunidades para a sua carreira, finanças ou amor.",
    visual: "globe-pulse",
  },
  {
    id: 3,
    bg: "cosmos",
    title: ["ESCOLHA", "O SEU CAMINHO."],
    body: "Analise o ano que passou, entenda o seu momento atual ou planeje o destino ideal para o seu próximo aniversário.",
    visual: "timeline",
  },
  {
    id: 4,
    bg: "orbital",
    title: ["AGORA É", "SOBRE VOCÊ."],
    body: "Insira seus dados de nascimento para calcular sua Revolução Solar e explorar as coordenadas pelo mundo.",
    visual: "cta",
  }
];

// ─── BACKGROUND CINEMATIC ────────────────────────────────────────────────────────
const CinematicBackground = ({ type, isActive }: { type: string; isActive: boolean }) => {
  if (type === "orbital") {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/earth-orbital.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #030306 0%, #030306 42%, rgba(3,3,6,0.6) 58%, transparent 75%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-3/4 h-2/5 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 100% 100%, rgba(212,175,55,0.18) 0%, transparent 60%)",
          }}
        />
      </div>
    );
  }

  if (type === "globe") {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg_deep_space.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ paddingBottom: "80px" }}
        >
          <motion.img
            src="/earth-master.png"
            alt=""
            className="pointer-events-none select-none"
            style={{
              width: "75vw",
              maxWidth: "320px",
              mixBlendMode: "screen",
              filter: "brightness(1.1) saturate(1.2)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
            transition={{ duration: 2, ease: "easeOut" }}
            draggable={false}
          />
        </div>
        <div
          className="absolute top-0 inset-x-0"
          style={{
            height: "55%",
            background:
              "linear-gradient(to bottom, #030306 0%, #030306 40%, transparent 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg_deep_space.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: "50%",
          background:
            "linear-gradient(to bottom, #030306 0%, #030306 35%, transparent 100%)",
        }}
      />
    </div>
  );
};

// ─── VISUAL: GLOBO COM PULSE ────────────────────────────────────────────────────
const GlobePulseVisual = () => (
  <div className="w-full flex justify-center items-center py-4">
    {[1.4, 1.2, 1.0].map((s, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: `${s * 90}vw`,
          height: `${s * 90}vw`,
          maxWidth: `${s * 380}px`,
          maxHeight: `${s * 380}px`,
          borderColor: `rgba(212,175,55,${0.04 + i * 0.03})`,
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
      />
    ))}
  </div>
);

// ─── VISUAL: TIMELINE ───────────────────────────────────────────────────────────
const TimelineVisual = () => {
  const items = [
    {
      key: "PASSADO",
      color: "#9B72CF",
      label: "audite ciclos anteriores",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 2h12M6 22h12M6 2c0 6 6 8 6 10S6 16 6 22M18 2c0 6-6 8-6 10s6 4 6 10" />
        </svg>
      ),
    },
    {
      key: "PRESENTE",
      color: GOLD,
      label: "entenda o seu ano atual",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      key: "FUTURO",
      color: "#E07B5A",
      label: "planeje o próximo destino",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-start justify-between relative">
        <div
          className="absolute top-8 left-8 right-8 h-[1px]"
          style={{
            background: `linear-gradient(to right, #9B72CF60, ${GOLD}60, #E07B5A60)`,
          }}
        />
        {items.map(({ key, color, label, icon }) => (
          <div key={key} className="flex flex-col items-center gap-2 w-1/3">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 bg-[#030306]"
              style={{
                background: `radial-gradient(circle, ${color}22 0%, #030306 70%)`,
                border: `1.5px solid ${color}55`,
                color,
              }}
              animate={{ boxShadow: [`0 0 8px ${color}30`, `0 0 20px ${color}50`, `0 0 8px ${color}30`] }}
              transition={{ duration: 3, repeat: Infinity, delay: items.findIndex(i => i.key === key) * 0.8 }}
            >
              {icon}
            </motion.div>
            <span
              className="text-[9px] font-bold tracking-[0.16em] uppercase mt-1"
              style={{ color }}
            >
              {key}
            </span>
            <span
              className="text-[10px] text-center leading-tight mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── VISUAL: CTA ────────────────────────────────────────────────────────────────
const CTAVisual = ({ onNext }: { onNext: () => void }) => (
  <div className="w-full flex flex-col items-center gap-3 px-6 py-2">
    <motion.button
      onClick={onNext}
      whileTap={{ scale: 0.97 }}
      className="w-full h-[56px] rounded-full font-bold tracking-[0.12em] text-[13px] uppercase flex items-center justify-center gap-3"
      style={{
        background: `linear-gradient(90deg, #B8940F 0%, ${GOLD_LIGHT} 50%, #B8940F 100%)`,
        color: "#1a1200",
        boxShadow: `0 0 40px rgba(212,175,55,0.5), 0 2px 20px rgba(0,0,0,0.4)`,
        fontFamily: "sans-serif",
      }}
      animate={{
        boxShadow: [
          "0 0 30px rgba(212,175,55,0.4)",
          "0 0 50px rgba(212,175,55,0.6)",
          "0 0 30px rgba(212,175,55,0.4)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      CALCULAR MEU MAPA
      <span className="text-[16px]">→</span>
    </motion.button>
    <p
      className="text-[10px] text-center tracking-wider font-semibold"
      style={{ color: "rgba(255,255,255,0.35)" }}
    >
      GRÁTIS · 3 MINUTOS · RESULTADO COMPLETO
    </p>
  </div>
);

// ─── HEADER ─────────────────────────────────────────────────────────────────────
const Header = ({ step, total }: { step: number; total: number }) => (
  <div className="flex flex-col items-center pt-safe pt-10 pb-2 px-5 relative z-10">
    <div className="mb-3">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke={GOLD} strokeWidth="1" opacity="0.6" />
        <circle cx="18" cy="18" r="10" stroke={GOLD} strokeWidth="0.5" opacity="0.3" />
        <path d="M18 8 L20 16 L18 14 L16 16 Z" fill={GOLD} />
        <path d="M18 28 L16 20 L18 22 L20 20 Z" fill="rgba(255,255,255,0.3)" />
        <circle cx="18" cy="18" r="2" fill={GOLD} />
      </svg>
    </div>

    <p
      className="text-[11px] font-bold tracking-[0.22em] uppercase mb-0.5"
      style={{ color: GOLD, fontFamily: "sans-serif" }}
    >
      Protocolo Solar
    </p>

    <div
      className="absolute top-10 right-5 text-[11px] font-bold"
      style={{ color: GOLD, fontFamily: "sans-serif" }}
    >
      {step + 1}/{total}
    </div>
  </div>
);

// ─── EDITORIAL BLOCK ────────────────────────────────────────────────────────────
const Editorial = ({ title, body, step }: { title: string[]; body: string; step: number }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center px-6 pt-2 pb-4 relative z-10"
    >
      <h1
        className="text-center font-bold leading-tight mb-1"
        style={{
          fontSize: "clamp(26px, 7vw, 34px)",
          letterSpacing: "-0.01em",
          fontFamily: "serif",
          color: WHITE,
        }}
      >
        {title[0]}
        {title[1] && (
          <>
            <br />
            <span style={{ color: GOLD }}>{title[1]}</span>
          </>
        )}
      </h1>

      <div className="flex items-center gap-2 my-4">
        <div className="w-8 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD, opacity: 0.8 }} />
        <div className="w-8 h-[1px]" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
      </div>

      <p
        className="text-center leading-relaxed"
        style={{
          fontSize: "clamp(13px, 3.5vw, 15px)",
          color: BODY,
          maxWidth: "86%",
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>
    </motion.div>
  </AnimatePresence>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────────
const Footer = ({
  step,
  total,
  onNext,
  onPrev,
}: {
  step: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const ArrowBtn = ({
    dir,
    onClick,
    disabled,
  }: {
    dir: "left" | "right";
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-12 h-12 rounded-full flex items-center justify-center transition-all z-20"
      style={{
        background: disabled ? "transparent" : "rgba(212,175,55,0.12)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.1)" : "rgba(212,175,55,0.4)"}`,
        color: disabled ? "rgba(255,255,255,0.2)" : GOLD,
        cursor: disabled ? "default" : "pointer"
      }}
      aria-label={dir === "left" ? "Anterior" : "Próximo"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  return (
    <div className="flex items-center justify-between px-6 pb-safe pb-8 relative z-10 w-full">
      <ArrowBtn dir="left" onClick={onPrev} disabled={step === 0} />

      <div className="flex items-center gap-2.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === step ? 24 : 8,
              height: 8,
              background: i === step ? GOLD : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <ArrowBtn dir="right" onClick={onNext} disabled={step === total - 1} />
    </div>
  );
};

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────────
export const MobileOnboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const screen = SCREENS[step];

  const goNext = useCallback(
    () => (step < SCREENS.length - 1 ? setStep((s) => s + 1) : navigate("/")),
    [step, navigate]
  );
  const goPrev = useCallback(() => step > 0 && setStep((s) => s - 1), [step]);

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) goNext();
    else if (info.offset.x > 60) goPrev();
  };

  return (
    <div
      className="relative w-full h-[100svh] overflow-hidden flex flex-col"
      style={{ background: BG, maxWidth: 430, margin: "0 auto" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step + "-bg"}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CinematicBackground type={screen.bg} isActive={true} />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex flex-col h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDrag}
      >
        <Header step={step} total={SCREENS.length} />

        <Editorial title={screen.title} body={screen.body} step={step} />

        <div className="flex-1 flex flex-col items-center justify-end pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step + "-visual"}
              className="w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {screen.visual === "globe-pulse" && <GlobePulseVisual />}
              {screen.visual === "timeline" && <TimelineVisual />}
              {screen.visual === "cta" && <CTAVisual onNext={goNext} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer step={step} total={SCREENS.length} onNext={goNext} onPrev={goPrev} />
      </motion.div>
    </div>
  );
};

export default MobileOnboarding;
