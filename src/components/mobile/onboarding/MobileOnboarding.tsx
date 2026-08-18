import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sun, Target, Star, Globe } from "lucide-react";

// ─── CONTRATO TÉCNICO: TARGET_VISUAL_OFICIAL ─────────────────────────────────
const GOLD = "#D4AF37";
const BG = "#030306";
const TITLE_COLOR = "#F4F1EA";
const BODY_COLOR = "#A5A7B3";

const SCREENS = [
  {
    step: 1,
    title: ["O CÉU SE MOVE.", "E VOCÊ TAMBÉM."],
    goldLine: 1,
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
    earthScale: 1.0,
    earthY: "0%",
    earthOpacity: 1,
    showGlow: true,
  },
  {
    step: 2,
    title: ["CADA LUGAR", "ATIVA UMA ENERGIA."],
    goldLine: 1,
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
    earthScale: 0.55,
    earthY: "60%",
    earthOpacity: 1,
    showGlow: false,
  },
  {
    step: 3,
    title: ["SEU MAPA. QUALQUER LUGAR.", "QUALQUER POSSIBILIDADE."],
    goldLine: 1,
    subtitle: "Calculamos sua Revolução Solar para o lugar e a data que você escolher e revelamos como será seu próximo ciclo.",
    earthScale: 0.6,
    earthY: "20%",
    earthOpacity: 0.15,
    showGlow: false,
  },
  {
    step: 4,
    title: ["MESMO CÉU.", "ENERGIAS DIFERENTES."],
    goldLine: 1,
    subtitle: "São Paulo ou Nova York? Seu mapa mostra como cada lugar ativa áreas diferentes da sua vida.",
    earthScale: 1.0,
    earthY: "10%",
    earthOpacity: 1,
    showGlow: false,
  },
  {
    step: 5,
    title: ["PASSADO, PRESENTE,", "FUTURO."],
    goldLine: 1,
    subtitle: "Entenda o que já viveu, o que está vivendo agora e o que pode criar a seguir.",
    earthScale: 0.5,
    earthY: "25%",
    earthOpacity: 0.15,
    showGlow: false,
  },
  {
    step: 6,
    title: ["AGORA É", "SOBRE VOCÊ."],
    goldLine: 1,
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
    earthScale: 1.0,
    earthY: "0%",
    earthOpacity: 1,
    showGlow: true,
  }
];

// ─── VISUAL SLOT COMPONENTS (EXATAMENTE COMO NO TARGET) ──────────────────────

// Tela 1 e 2: Apenas Terra
const VisualScreen1 = () => null;
const VisualScreen2 = () => null;

// Tela 3: Infográfico orbital central em dourado
const VisualScreen3 = () => {
  const features = [
    { icon: Sun, title: "PLANETAS", desc: "em movimento" },
    { icon: Target, title: "NOVOS CENÁRIOS", desc: "novas experiências" },
    { icon: Star, title: "ESCOLHAS", desc: "que transformam" },
    { icon: Globe, title: "CONEXÕES", desc: "globais" }
  ];
  return (
    <div className="w-full flex justify-center relative py-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Sol central */}
        <div className="absolute w-12 h-12 rounded-full blur-[2px] shadow-[0_0_30px_rgba(212,175,55,0.6)]" style={{ background: `linear-gradient(to top right, ${GOLD}, #F3E5AB)` }} />
        
        {/* Órbitas e Labels */}
        {features.map((f, i) => {
          const angle = (i * 360) / features.length - 45;
          const radius = 95;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          return (
            <div key={i} className="absolute flex flex-col items-center text-center" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md mb-2" style={{ border: `1px solid ${GOLD}40`, background: `${BG}99` }}>
                <f.icon className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <span className="text-[9px] font-sans font-bold tracking-wider uppercase" style={{ color: GOLD }}>{f.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tela 4: Marcadores de cidade + linhas
const VisualScreen4 = () => (
  <div className="w-full flex items-end justify-center gap-16 pb-0 pt-10 relative z-10">
    {[
      { city: "SÃO PAULO", color: GOLD },
      { city: "NOVA YORK", color: "#87CEEB" }
    ].map((loc, i) => (
      <div key={i} className="flex flex-col items-center relative">
        <span className="text-[11px] font-sans font-bold tracking-widest uppercase mb-2" style={{ color: loc.color }}>{loc.city}</span>
        <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md mb-0" style={{ border: `1px solid ${loc.color}30`, background: `${BG}99` }}>
          <Star className="w-5 h-5" style={{ color: loc.color }} />
        </div>
        <div className="w-[1px]" style={{ height: "120px", background: `linear-gradient(to bottom, ${loc.color}80, transparent)` }} />
      </div>
    ))}
  </div>
);

// Tela 5: Três nós horizontais simétricos
const VisualScreen5 = () => {
  const nodes = ["PASSADO", "PRESENTE", "FUTURO"];
  return (
    <div className="w-full flex items-center justify-center gap-0 px-4 py-8 relative z-10">
      {/* Linha horizontal central */}
      <div className="absolute w-[70%] h-[1px] top-1/2 -translate-y-1/2" style={{ background: `linear-gradient(to right, transparent, ${GOLD}80, transparent)` }} />
      
      {nodes.map((node, i) => (
        <div key={i} className="flex-1 flex flex-col items-center relative z-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ border: `1px solid ${GOLD}40`, background: `${BG}` }}>
            <div className="w-3 h-3 rounded-full" style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
          </div>
          <span className="text-[9px] font-sans font-bold tracking-widest uppercase" style={{ color: GOLD }}>{node}</span>
        </div>
      ))}
    </div>
  );
};

// Tela 6: CTA Dourado
const VisualScreen6 = ({ onNext }: { onNext: () => void }) => (
  <div className="w-full flex justify-center items-end py-6 relative z-10">
    <button
      onClick={onNext}
      className="w-[85%] h-14 rounded-full font-sans font-bold tracking-widest text-[12px] uppercase flex items-center justify-center gap-2 hover:scale-105 transition-transform"
      style={{
        background: `linear-gradient(90deg, ${GOLD} 0%, #F3E5AB 50%, ${GOLD} 100%)`,
        color: "#000",
        boxShadow: `0 0 30px ${GOLD}66`
      }}
    >
      Calcular Meu Mapa
    </button>
  </div>
);

// ─── A MÁQUINA PRINCIPAL ──────────────────────────────────────────────────────
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
      style={{ background: BG, maxWidth: 430, margin: "0 auto", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── BACKGROUND UNIVERSO (Mesmo universo visual em todas as telas) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/bg_deep_space.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />

      {/* ── ESFERA CSS 3D (O Fim dos PNGs Recortados) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
        <motion.div
          className="absolute origin-bottom rounded-full"
          style={{ 
            width: "160vw", 
            height: "160vw", 
            bottom: "-70vw",
            backgroundImage: "url('/earth-texture.jpg')",
            backgroundSize: "200% 100%", // Permite rotação horizontal
            backgroundRepeat: "repeat-x",
            boxShadow: `
              inset -20vw -20vw 40vw rgba(0,0,0,0.95), /* Sombra do lado noturno */
              inset 2vw 2vw 8vw rgba(212,175,55,0.25), /* Brilho na atmosfera iluminada */
              0 0 40px rgba(212,175,55,0.15) /* Halo externo sutil no cosmos */
            `,
            filter: "brightness(0.9) contrast(1.1)"
          }}
          initial={{ scale: screen.earthScale, y: screen.earthY, opacity: screen.earthOpacity }}
          animate={{ 
            scale: screen.earthScale, 
            y: screen.earthY, 
            opacity: screen.earthOpacity,
            backgroundPosition: ["0% 0%", "100% 0%"] // Planeta girando eternamente
          }}
          transition={{ 
            scale: { duration: 1.5, ease: "easeOut" },
            y: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 1.5 },
            backgroundPosition: { duration: 240, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      {/* ── MÁSCARA EDITORIAL (Garante leitura) ── */}
      <div className="absolute top-0 inset-x-0 h-[50%] pointer-events-none" style={{ background: `linear-gradient(to bottom, ${BG}FF 0%, ${BG}DD 40%, transparent 100%)` }} />
      
      {/* ── SUNRISE GLOW ── */}
      <AnimatePresence>
        {screen.showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 right-0 w-full h-[40%] pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 80% at 80% 100%, ${GOLD}33 0%, transparent 60%)` }}
          />
        )}
      </AnimatePresence>

      {/* ── FOREGROUND CONTENT ── */}
      <motion.div className="relative z-10 flex flex-col h-full" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1} onDragEnd={handleDrag}>
        
        {/* BRAND HEADER & STEP COUNTER */}
        <div className="w-full pt-10 pb-4 px-6 relative flex justify-center items-center shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Protocolo Solar</span>
            <span className="text-[9px] tracking-[0.18em] uppercase mt-1" style={{ color: `${TITLE_COLOR}55` }}>Astrologia de Relocalização</span>
          </div>
          <div className="absolute right-6 top-10 text-[11px] font-bold" style={{ color: GOLD }}>
            {screen.step}/6
          </div>
        </div>

        {/* EDITORIAL BLOCK */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full px-6 flex flex-col items-center shrink-0"
          >
            <h1 className="text-center font-normal leading-tight mb-4" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(26px, 6.5vw, 32px)", color: TITLE_COLOR }}>
              {screen.title[0]}<br />
              <span style={{ color: screen.goldLine === 1 ? GOLD : TITLE_COLOR }}>{screen.title[1]}</span>
            </h1>

            <div className="w-[60px] h-[1px] mb-4" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

            <p className="text-center text-[14px] leading-relaxed max-w-[85%]" style={{ color: BODY_COLOR }}>
              {screen.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* VISUAL SLOT (Expands to fill available space) */}
        <div className="flex-1 w-full flex flex-col items-center justify-end pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step + "-visual"}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {screen.step === 1 && <VisualScreen1 />}
              {screen.step === 2 && <VisualScreen2 />}
              {screen.step === 3 && <VisualScreen3 />}
              {screen.step === 4 && <VisualScreen4 />}
              {screen.step === 5 && <VisualScreen5 />}
              {screen.step === 6 && <VisualScreen6 onNext={goNext} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER (Same axis across 1-6) */}
        <div className="w-full flex items-center justify-between px-6 pb-8 shrink-0">
          <button onClick={goPrev} disabled={step === 0} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity" style={{ opacity: step === 0 ? 0.2 : 1, color: GOLD, border: `1px solid ${GOLD}40`, background: `${GOLD}10` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="flex items-center gap-2">
            {SCREENS.map((s, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{ width: i === step ? 24 : 6, height: 6, background: i === step ? GOLD : `${TITLE_COLOR}33` }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <button onClick={goNext} disabled={step === SCREENS.length - 1} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity" style={{ opacity: step === SCREENS.length - 1 ? 0.2 : 1, color: GOLD, border: `1px solid ${GOLD}40`, background: `${GOLD}10` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default MobileOnboarding;
