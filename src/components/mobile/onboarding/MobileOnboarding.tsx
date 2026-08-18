import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { BrandHeader } from "./components/BrandHeader";
import { EditorialBlock } from "./components/EditorialBlock";
import { CinematicEarth } from "./components/CinematicEarth";
import { CelestialMandala } from "./components/CelestialMandala";
import { CityComparisonBeacons } from "./components/CityComparisonBeacons";
import { TimelineModeCards, type OnboardingMode } from "./components/TimelineModeCards";
import { OnboardingFooter } from "./components/OnboardingFooter";

export const ONBOARDING_SCREENS = [
  {
    step: 1,
    title: (
      <>
        O CÉU SE MOVE.
        <br />
        <span className="text-[#D4AF37]">E VOCÊ TAMBÉM.</span>
      </>
    ),
    subtitle: "A Astrologia de Relocalização mostra como os planetas ativam diferentes áreas da sua vida em cada lugar do mundo.",
  },
  {
    step: 2,
    title: (
      <>
        CADA LUGAR
        <br />
        <span className="text-[#D4AF37]">ATIVA UMA ENERGIA.</span>
      </>
    ),
    subtitle: "Seu mapa muda conforme o lugar onde você está ou escolhe estar. E isso muda tudo.",
  },
  {
    step: 3,
    title: (
      <>
        SEU MAPA. QUALQUER LUGAR.
        <br />
        <span className="text-[#D4AF37]">QUALQUER POSSIBILIDADE.</span>
      </>
    ),
    subtitle: "Calculamos sua Revolução Solar para o lugar e data que você escolher e revelamos como será seu próximo ciclo.",
  },
  {
    step: 4,
    title: (
      <>
        MESMO CÉU.
        <br />
        <span className="text-[#D4AF37]">ENERGIAS DIFERENTES.</span>
      </>
    ),
    subtitle: "Veja como seu mapa muda de um lugar para outro.",
  },
  {
    step: 5,
    title: (
      <>
        ESCOLHA SEU CAMINHO.
        <br />
        <span className="text-[#D4AF37]">EXPLORE SEU CICLO.</span>
      </>
    ),
    subtitle: "Você pode analisar o que já viveu, entender o que está vivendo agora ou projetar o que deseja viver.",
  },
  {
    step: 6,
    title: (
      <>
        AGORA É
        <br />
        <span className="text-[#D4AF37]">SOBRE VOCÊ.</span>
      </>
    ),
    subtitle: "Use seus dados de nascimento para calcular sua Revolução Solar e explorar diferentes possibilidades pelo mundo.",
  },
];

export const MobileOnboarding = () => {
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<OnboardingMode>("futuro");
  const navigate = useNavigate();

  const totalSteps = ONBOARDING_SCREENS.length;
  const current = ONBOARDING_SCREENS[step];

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      navigate(`/?mode=${selectedMode}`);
    }
  }, [step, totalSteps, navigate, selectedMode]);

  const goPrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Teclado (Setas Esquerda e Direita)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Gestos de Swipe no Touch / Mobile
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -45 || info.velocity.x < -400) {
      goNext();
    } else if (info.offset.x > 45 || info.velocity.x > 400) {
      goPrev();
    }
  };

  const handleSelectMode = (mode: OnboardingMode) => {
    setSelectedMode(mode);
    // Smooth transition to next step after small delay
    setTimeout(() => {
      setStep(5);
    }, 250);
  };

  return (
    <div className="w-full h-[100dvh] bg-[#000000] flex items-center justify-center overflow-hidden select-none">
      {/* 
        CHASSI DO APP (Mobile-first, centralizado em monitores maiores)
      */}
      <div className="w-full max-w-[430px] h-full max-h-[932px] bg-[#030306] relative flex flex-col justify-between overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] border-x border-[#D4AF37]/10">
        
        {/* ── CAMADA CINEMATOGRÁFICA DE FUNDO (TERRA + ESPAÇO) ── */}
        <CinematicEarth step={step} />

        {/* ── CABEÇALHO DO PROTOCOLO SOLAR COM CONTADOR 1/6 ── */}
        <BrandHeader step={step} totalSteps={totalSteps} />

        {/* ── BLOCO EDITORIAL (TÍTULO, DIVISOR DOURADO, SUBTÍTULO) ── */}
        <EditorialBlock
          title={current.title}
          subtitle={current.subtitle}
          step={step}
        />

        {/* ── ÁREA CENTRAL INTERATIVA (SLOT VISUAL) COM DRAG SWIPE ── */}
        <motion.div
          className="relative w-full flex-1 flex flex-col items-center justify-center z-30 px-4 overflow-hidden cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {/* TELA 1/6: Botão "VAMOS COMEÇAR" + Cadeado */}
            {step === 0 && (
              <motion.div
                key="screen1-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-end h-full pb-4"
              >
                <div className="w-full max-w-[320px] flex flex-col items-center gap-3">
                  <button
                    onClick={goNext}
                    className="btn-gold-luxury w-full py-4 text-xs tracking-[0.18em]"
                  >
                    VAMOS COMEÇAR →
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#FAF7EE]/50 uppercase font-medium">
                    <Lock className="w-3 h-3 text-[#D4AF37]/80" />
                    <span>DADOS 100% PRIVADOS</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TELA 2/6: Espaço livre para visualização do Globo 3D */}
            {step === 1 && (
              <motion.div
                key="screen2-visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              />
            )}

            {/* TELA 3/6: Mandala Astrológica Orbital */}
            {step === 2 && (
              <motion.div
                key="screen3-mandala"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <CelestialMandala />
              </motion.div>
            )}

            {/* TELA 4/6: Pinos Comparativos São Paulo vs Nova York */}
            {step === 3 && (
              <motion.div
                key="screen4-beacons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col justify-start"
              >
                <CityComparisonBeacons />
              </motion.div>
            )}

            {/* TELA 5/6: Cards de Linha do Tempo (Passado, Presente, Futuro) */}
            {step === 4 && (
              <motion.div
                key="screen5-timeline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center"
              >
                <TimelineModeCards
                  selectedMode={selectedMode}
                  onSelectMode={handleSelectMode}
                />
              </motion.div>
            )}

            {/* TELA 6/6: Botão "CALCULAR MEU MAPA" + Cadeado */}
            {step === 5 && (
              <motion.div
                key="screen6-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-end h-full pb-4"
              >
                <div className="w-full max-w-[320px] flex flex-col items-center gap-3">
                  <button
                    onClick={() => navigate(`/?mode=${selectedMode}`)}
                    className="btn-gold-luxury w-full py-4 text-xs tracking-[0.18em]"
                  >
                    CALCULAR MEU MAPA →
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#FAF7EE]/50 uppercase font-medium">
                    <Lock className="w-3 h-3 text-[#D4AF37]/80" />
                    <span>DADOS 100% PRIVADOS</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── RODAPÉ DE NAVEGAÇÃO INTERATIVA (SETAS + PROGRESSO) ── */}
        <OnboardingFooter
          step={step}
          total={totalSteps}
          onNext={goNext}
          onPrev={goPrev}
          onSelectStep={(idx) => setStep(idx)}
        />
      </div>
    </div>
  );
};

export default MobileOnboarding;
