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
import { Screen1NorthStar } from "./screens/Screen1NorthStar";

export const ONBOARDING_SCREENS = [
  {
    step: 1,
    title: (
      <>
        O LUGAR ONDE VOCÊ ESTÁ
        <br />
        <span className="text-[#D4AF37]">MUDA TUDO.</span>
      </>
    ),
    subtitle: "A energia do seu próximo ano não depende apenas de quando você nasceu, mas de onde você escolhe estar.",
  },
  {
    step: 2,
    title: (
      <>
        CADA DESTINO,
        <br />
        <span className="text-[#D4AF37]">UMA NOVA POSSIBILIDADE.</span>
      </>
    ),
    subtitle: "As posições dos astros ativam áreas completamente diferentes da sua vida dependendo da sua localização no mundo.",
  },
  {
    step: 3,
    title: (
      <>
        O SEU
        <br />
        <span className="text-[#D4AF37]">PRÓXIMO CICLO.</span>
      </>
    ),
    subtitle: "Diferentes cidades podem impulsionar sua carreira, favorecer seus relacionamentos ou trazer paz interior.",
  },
  {
    step: 4,
    title: (
      <>
        A MESMA DATA.
        <br />
        <span className="text-[#D4AF37]">ENERGIAS DIFERENTES.</span>
      </>
    ),
    subtitle: "Compare destinos e descubra qual lugar oferece a melhor configuração para o seu momento de vida.",
  },
  {
    step: 5,
    title: (
      <>
        NÃO É APENAS
        <br />
        <span className="text-[#D4AF37]">UMA VIAGEM.</span>
      </>
    ),
    subtitle: "É a escolha consciente da energia que vai reger os seus próximos 365 dias.",
  },
  {
    step: 6,
    title: (
      <>
        O SEU NOVO DESTINO
        <br />
        <span className="text-[#D4AF37]">ESTÁ ESCRITO NO CÉU.</span>
      </>
    ),
    subtitle: "Descubra qual cidade guarda as melhores energias para o seu próximo aniversário.",
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

  // ── VISUAL EXPLORATION: NORTH STAR (TELA 1) ──
  if (step === 0) {
    return (
      <Screen1NorthStar 
        onNext={goNext}
        title={current.title}
        subtitle={current.subtitle}
      />
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#000000] flex items-center justify-center overflow-hidden select-none relative">
      {/* 
        CHASSI DO APP 
        Mobile: Preenche a tela toda.
        Desktop: Grid de 2 colunas, limitando o visual de um lado e o texto do outro.
      */}
      <div className="w-full lg:max-w-7xl h-[100dvh] lg:h-auto lg:min-h-[700px] lg:aspect-[16/9] bg-[#030306] relative flex flex-col lg:flex-row justify-between overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] lg:border lg:border-[#D4AF37]/20 lg:rounded-2xl mx-auto">
        
        {/* ── CAMADA CINEMATOGRÁFICA DE FUNDO (TERRA + ESPAÇO) ── */}
        <CinematicEarth step={step} />

        {/* ── ESQUERDA (Desktop) / TOPO E RODAPÉ (Mobile) ── */}
        <div className="w-full lg:w-[45%] h-full flex flex-col justify-between z-40 relative pointer-events-none lg:p-8 lg:bg-gradient-to-r lg:from-[#030306]/80 lg:to-transparent">
          <div className="w-full flex flex-col items-center justify-start pointer-events-auto">
            {/* ── CABEÇALHO DO PROTOCOLO SOLAR COM CONTADOR 1/6 ── */}
            <BrandHeader step={step} totalSteps={totalSteps} />

            {/* ── BLOCO EDITORIAL (TÍTULO, DIVISOR DOURADO, SUBTÍTULO) ── */}
            <div className="w-full lg:mt-6">
              <EditorialBlock
                title={current.title}
                subtitle={current.subtitle}
                step={step}
              />
            </div>
          </div>

          <div className="w-full mt-auto pointer-events-auto lg:pb-8">
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

        {/* ── DIREITA (Desktop) / CENTRO (Mobile) ── */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:w-[55%] h-full flex flex-col z-30 pointer-events-none">
          {/* Empurra o slot visual para o centro no mobile */}
          <div className="h-[210px] lg:h-0 shrink-0 pointer-events-none" />

          {/* ── ÁREA CENTRAL INTERATIVA (SLOT VISUAL) COM DRAG SWIPE ── */}
          <motion.div
            className="relative w-full flex-1 flex flex-col items-center justify-center px-4 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="popLayout" initial={false}>
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
                    DESCOBRIR MEU DESTINO →
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
          
          {/* Espaço para o rodapé no mobile */}
          <div className="h-[90px] lg:h-0 shrink-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default MobileOnboarding;
