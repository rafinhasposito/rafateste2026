import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sun, Compass, Hourglass, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

// ─── CONTRATO VISUAL ────────────────────────────────────────────────────────
const GOLD = "#E5B05C"; // Adjusted to match the specific gold in the mockups
const GOLD_DIM = "#997330";
const BG = "#050A10"; 
const TEXT_LIGHT = "#E8EAED";
const TEXT_MUTED = "#9AA0A6";

const SCREENS = [
  {
    step: 1,
    title: ["O CÉU SE MOVE.", "E VOCÊ TAMBÉM."],
    goldLine: 1,
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
    bgImage: "/bg_deep_space.png",
    earthImage: null,
  },
  {
    step: 2,
    title: ["CADA LUGAR", "ATIVA UMA ENERGIA."],
    goldLine: 1,
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
    bgImage: "/bg_deep_space.png",
    earthImage: "/earth_master_globe.png",
    earthStyle: { bottom: "-5%", width: "90%" },
  },
  {
    step: 3,
    title: ["SEU MAPA. QUALQUER LUGAR.", "QUALQUER POSSIBILIDADE."],
    goldLine: 1,
    subtitle: "Calculamos sua Revolução Solar para o lugar e a data que você escolher e revelamos como será seu próximo ciclo.",
    bgImage: "/bg_deep_space.png",
    earthImage: null,
  },
  {
    step: 4,
    title: ["MESMO CÉU.", "ENERGIAS DIFERENTES."],
    goldLine: 1,
    subtitle: "São Paulo ou Nova York? Seu mapa mostra como cada lugar ativa áreas diferentes da sua vida.",
    bgImage: "/bg_deep_space.png",
    earthImage: "/earth_orbital.png",
    earthStyle: { bottom: "-10%", width: "130%", left: "-15%" },
  },
  {
    step: 5,
    title: ["PASSADO, PRESENTE,", "FUTURO."],
    goldLine: 1,
    subtitle: "Entenda o que já viveu, o que está vivendo agora e o que pode criar a seguir.",
    bgImage: "/bg_deep_space.png",
    earthImage: null,
  },
  {
    step: 6,
    title: ["AGORA É", "SOBRE VOCÊ."],
    goldLine: 1,
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
    bgImage: "/earth_orbital.png", // Full screen background for screen 6
    earthImage: null,
  }
];

// ─── VISUAL SLOT COMPONENTS ──────────────────────────────────────────────────

const VisualScreen3 = () => {
  const features = [
    { icon: Sun, title: "PLANETAS", desc: "em movimento" },
    { icon: Compass, title: "NOVOS CENÁRIOS", desc: "novas experiências" },
  ];
  return (
    <div className="w-full flex justify-center items-center relative py-6 h-full mb-[20%] pointer-events-none">
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Sol central */}
        <div className="absolute w-12 h-12 rounded-full blur-[2px] shadow-[0_0_30px_rgba(229,176,92,0.5)]" style={{ background: `linear-gradient(to top right, ${GOLD}, #FFF)` }} />
        
        {/* Órbitas e Labels */}
        {features.map((f, i) => {
          const angle = i === 0 ? -30 : 150;
          const radius = 80;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          return (
            <div key={i} className="absolute flex flex-col items-center text-center" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md mb-2" style={{ border: `1px solid ${GOLD}40`, background: `${BG}99` }}>
                <f.icon className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <span className="text-[9px] font-sans font-bold tracking-widest uppercase" style={{ color: GOLD }}>{f.title}</span>
            </div>
          );
        })}
        {/* Órbita circle */}
        <div className="absolute w-[160px] h-[160px] rounded-full border border-dashed" style={{ borderColor: `${GOLD}33` }} />
      </div>
    </div>
  );
};

const VisualScreen4 = () => (
  <div className="w-full h-full flex items-end justify-center gap-16 pb-[30%] relative z-10 pointer-events-none">
    {[
      { city: "SÃO PAULO", color: "#E5B05C" },
      { city: "NOVA YORK", color: "#81B1D5" }
    ].map((loc, i) => (
      <div key={i} className="flex flex-col items-center relative h-[180px]">
        <span className="text-[12px] font-sans font-medium tracking-wide uppercase mb-3 drop-shadow-md" style={{ color: loc.color, fontFamily: "'Cinzel', serif" }}>{loc.city}</span>
        <MapPin className="w-6 h-6 mb-[-4px] relative z-10 drop-shadow-md" style={{ color: loc.color }} fill={loc.color} />
        <div className="w-[1.5px] flex-1" style={{ background: `linear-gradient(to bottom, ${loc.color}, ${loc.color}00)` }} />
        <div className="absolute bottom-0 w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ background: loc.color, color: loc.color }} />
      </div>
    ))}
  </div>
);

const VisualScreen5 = () => {
  const nodes = [
    { label: "PASSADO", desc: "o que te trouxe\naté aqui", icon: Hourglass, color: "#8A69A5" },
    { label: "PRESENTE", desc: "o ciclo que\nvocê vive agora", icon: Sun, color: "#E5B05C", active: true },
    { label: "FUTURO", desc: "o que está ao\nseu alcance", icon: Compass, color: "#CD6B7C" }
  ];
  return (
    <div className="w-full flex items-center justify-center gap-2 px-2 py-8 relative z-10">
      <div className="absolute w-[60%] h-[1px] top-[40px] left-1/2 -translate-x-1/2 -z-10" style={{ background: `linear-gradient(to right, ${nodes[0].color}40, ${nodes[1].color}80, ${nodes[2].color}40)` }} />
      
      {nodes.map((node, i) => (
        <div key={i} className="flex-1 flex flex-col items-center relative z-10 text-center">
          <div 
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5" 
            style={{ 
              border: `1.5px solid ${node.color}${node.active ? '80' : '40'}`, 
              background: node.active ? `radial-gradient(circle, ${node.color}40 0%, transparent 70%)` : `${BG}`,
              boxShadow: node.active ? `0 0 30px ${node.color}20` : 'none'
            }}
          >
            <node.icon className="w-7 h-7" style={{ color: node.color, filter: node.active ? `drop-shadow(0 0 8px ${node.color})` : 'none' }} />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: node.color }}>{node.label}</span>
          <span className="text-[11px] leading-tight opacity-70 whitespace-pre-line" style={{ color: TEXT_LIGHT }}>{node.desc}</span>
        </div>
      ))}
    </div>
  );
};

const VisualScreen6 = ({ onNext }: { onNext: () => void }) => (
  <div className="w-full flex justify-center items-end pb-[10%] relative z-20">
    <button
      onClick={onNext}
      className="w-[85%] h-14 rounded-[28px] font-sans font-semibold tracking-wide text-[14px] uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      style={{
        background: "#D5A04D",
        color: "#111",
        boxShadow: "0 4px 20px rgba(213, 160, 77, 0.2)"
      }}
    >
      CALCULAR MEU MAPA <ArrowRight className="w-4 h-4" />
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
      className="relative w-full h-[100svh] overflow-hidden flex flex-col selection:bg-transparent"
      style={{ background: BG, maxWidth: 430, margin: "0 auto", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── BACKGROUND LAYER ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen.bgImage}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ 
            backgroundImage: `url('${screen.bgImage}')`, 
            backgroundSize: "cover", 
            backgroundPosition: "center bottom",
            opacity: step === 5 ? 0.8 : 1 // Slightly dim the orbital background on last screen for text readability
          }} 
        />
      </AnimatePresence>

      {/* ── EARTH IMAGE LAYER ── */}
      <AnimatePresence>
        {screen.earthImage && (
          <motion.div
            key={screen.earthImage}
            className="absolute left-0 right-0 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={screen.earthStyle}
          >
            <img src={screen.earthImage} alt="Earth" className="w-full h-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRADIENT MASK ── */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050A10] via-[#050A10]/60 to-transparent h-[60%]" />

      {/* ── FOREGROUND CONTENT ── */}
      <motion.div className="relative z-10 flex flex-col h-full" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1} onDragEnd={handleDrag}>
        
        {/* HEADER */}
        <div className="w-full pt-12 pb-6 px-6 relative flex flex-col justify-center items-center shrink-0">
          <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border border-[#E5B05C]">
            <Compass className="w-6 h-6" style={{ color: "#E5B05C" }} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>Protocolo Solar</span>
            <span className="text-[9px] font-medium tracking-[0.15em] uppercase mt-1" style={{ color: GOLD_DIM }}>Astrologia de Relocalização</span>
          </div>
          <div className="absolute right-6 top-12 text-[14px] font-medium tracking-widest" style={{ color: TEXT_LIGHT, fontFamily: "'Inter', sans-serif" }}>
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
            className="w-full px-6 flex flex-col items-center shrink-0 mt-4"
          >
            <h1 className="text-center font-normal leading-tight mb-5" style={{ fontFamily: "'Cinzel', serif", fontSize: "28px", color: TEXT_LIGHT }}>
              {screen.title[0]}<br />
              <span style={{ color: screen.goldLine === 1 ? GOLD : TEXT_LIGHT }}>{screen.title[1]}</span>
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px]" style={{ background: GOLD }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="w-8 h-[1px]" style={{ background: GOLD }} />
            </div>

            <p className="text-center text-[15px] leading-[1.6]" style={{ color: TEXT_LIGHT, maxWidth: "90%" }}>
              {screen.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* VISUAL SLOT */}
        <div className="flex-1 w-full flex flex-col items-center justify-end pb-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step + "-visual"}
              className="w-full h-full flex flex-col justify-end absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {screen.step === 3 && <VisualScreen3 />}
              {screen.step === 4 && <VisualScreen4 />}
              {screen.step === 5 && <VisualScreen5 />}
              {screen.step === 6 && <VisualScreen6 onNext={goNext} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="w-full flex items-center justify-between px-6 pb-10 shrink-0 relative z-20">
          <button onClick={goPrev} style={{ visibility: step === 0 ? "hidden" : "visible", color: GOLD, borderColor: GOLD_DIM }} className="w-10 h-10 rounded-full flex items-center justify-center border transition-opacity hover:bg-white/5 active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {SCREENS.map((s, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{ 
                  width: i === step ? 8 : 6, 
                  height: i === step ? 8 : 6, 
                  background: i === step ? GOLD : "transparent",
                  border: `1px solid ${i === step ? GOLD : TEXT_MUTED}`
                }}
              />
            ))}
          </div>

          <button onClick={goNext} style={{ visibility: step === SCREENS.length - 1 ? "hidden" : "visible", color: GOLD, borderColor: GOLD_DIM }} className="w-10 h-10 rounded-full flex items-center justify-center border transition-opacity hover:bg-white/5 active:scale-95">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default MobileOnboarding;
