import React, { useState } from "react";
import { PanInfo, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import { OnboardingShell } from "./components/OnboardingShell";
import { BrandHeader } from "./components/BrandHeader";
import { EditorialBlock } from "./components/EditorialBlock";
import { VisualSlot } from "./components/VisualSlot";
import { OnboardingFooter } from "./components/OnboardingFooter";
import { CinematicEarth } from "./components/CinematicEarth";
import { onboardingScreens } from "./config/onboardingScreens";

// ─── VISUAL: TELA 2 — Cosmos expandido (globo já na CinematicEarth) ──────────
const Screen02Visual = () => null;

// ─── VISUAL: TELA 3 — Anel de 12 Casas ──────────────────────────────────────
const Screen03Visual = () => {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <div className="relative w-56 h-56">
        {/* Anel orbital externo */}
        <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20" />
        <div className="absolute inset-4 rounded-full border border-[#D4AF37]/10" />

        {/* Sol central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: "radial-gradient(circle, #F3E5AB 0%, #D4AF37 60%, rgba(212,175,55,0) 100%)",
              boxShadow: "0 0 24px rgba(212,175,55,0.6)",
            }}
          />
        </div>

        {/* 12 pontos de casas */}
        {houses.map((h) => {
          const angle = ((h - 1) * 360) / 12 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 98;
          const x = 50 + (r / 112) * 50 * Math.cos(rad);
          const y = 50 + (r / 112) * 50 * Math.sin(rad);
          return (
            <div
              key={h}
              className="absolute flex flex-col items-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-5 h-5 rounded-full border border-[#D4AF37]/40 bg-[#030306]/80 flex items-center justify-center">
                <span className="text-[7px] font-sans text-[#D4AF37] font-bold">{h}</span>
              </div>
            </div>
          );
        })}

        {/* Linhas de eixo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-[1px] bg-[#D4AF37]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[1px] h-full bg-[#D4AF37]" />
        </div>
      </div>

      <p className="text-[10px] font-sans tracking-widest text-[#D4AF37]/60 uppercase mt-4">
        As 12 Casas da sua vida
      </p>
    </div>
  );
};

// ─── VISUAL: TELA 4 — Location Pins sobre a Terra ───────────────────────────
const Screen04Visual = () => (
  <div className="w-full flex items-end justify-center gap-20 pb-6">
    {/* São Paulo */}
    <div className="flex flex-col items-center">
      <span className="text-[#D4AF37] font-sans font-bold tracking-widest text-[11px] uppercase mb-2">
        SÃO PAULO
      </span>
      <div className="flex flex-col items-center gap-0">
        <MapPin className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/30" />
        <div
          className="w-[1px] bg-gradient-to-b from-[#D4AF37]/60 to-transparent"
          style={{ height: "80px" }}
        />
      </div>
    </div>

    {/* Nova York */}
    <div className="flex flex-col items-center">
      <span className="text-sky-300 font-sans font-bold tracking-widest text-[11px] uppercase mb-2">
        NOVA YORK
      </span>
      <div className="flex flex-col items-center gap-0">
        <MapPin className="w-5 h-5 text-sky-300 fill-sky-300/30" />
        <div
          className="w-[1px] bg-gradient-to-b from-sky-300/60 to-transparent"
          style={{ height: "80px" }}
        />
      </div>
    </div>
  </div>
);

// ─── VISUAL: TELA 5 — Timeline PASSADO / PRESENTE / FUTURO ──────────────────
const Screen05Visual = () => {
  const items = [
    {
      key: "PASSADO",
      color: "#9B6DE5",
      label: "o que te trouxe até aqui",
      icon: (
        // Hourglass SVG
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2h12M6 22h12M6 2c0 6 6 8 6 10S6 16 6 22M18 2c0 6-6 8-6 10s6 4 6 10" />
        </svg>
      ),
    },
    {
      key: "PRESENTE",
      color: "#D4AF37",
      label: "o ciclo que você vive agora",
      icon: (
        // Sun SVG
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      key: "FUTURO",
      color: "#C0392B",
      label: "o que está ao seu alcance",
      icon: (
        // Compass SVG
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center py-2">
      {/* Timeline horizontal com ícones */}
      <div className="flex items-center justify-center gap-0 w-full px-4">
        {items.map((item, i) => (
          <React.Fragment key={item.key}>
            <div className="flex flex-col items-center gap-2">
              {/* Ícone circular */}
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: item.color + "66",
                  background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)`,
                  color: item.color,
                  boxShadow: `0 0 16px ${item.color}33`,
                }}
              >
                {item.icon}
              </div>
              {/* Label */}
              <span
                className="text-[9px] font-sans font-bold tracking-widest uppercase"
                style={{ color: item.color }}
              >
                {item.key}
              </span>
              <span className="text-[8px] font-sans text-white/40 text-center max-w-[80px] leading-tight">
                {item.label}
              </span>
            </div>

            {/* Linha conectora */}
            {i < items.length - 1 && (
              <div
                className="flex-1 h-[1px] mx-1 mb-10"
                style={{
                  background: `linear-gradient(to right, ${items[i].color}60, ${items[i + 1].color}60)`,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─── VISUAL: TELA 6 — CTA Button ────────────────────────────────────────────
const Screen06Visual = ({ onNext }: { onNext: () => void }) => (
  <div className="w-full flex justify-center items-center py-4">
    <motion.button
      onClick={onNext}
      whileTap={{ scale: 0.97 }}
      className="w-[88%] h-14 rounded-full font-sans font-bold tracking-[0.12em] text-[13px] uppercase flex items-center justify-center gap-3 select-none"
      style={{
        background: "linear-gradient(90deg, #C9A227 0%, #F3E5AB 50%, #C9A227 100%)",
        color: "#1a1300",
        boxShadow: "0 0 32px rgba(212,175,55,0.45)",
      }}
    >
      CALCULAR MEU MAPA
      <span className="text-[16px] font-light">→</span>
    </motion.button>
  </div>
);

// ─── A MÁQUINA ───────────────────────────────────────────────────────────────
export const MobileOnboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const screen = onboardingScreens[step];

  const goNext = () =>
    step < onboardingScreens.length - 1 ? setStep(step + 1) : navigate("/");
  const goPrev = () => step > 0 && setStep(step - 1);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  const ep = screen.earthProps as any;

  return (
    <OnboardingShell>
      <CinematicEarth
        mode={ep.mode}
        src={ep.src}
        scale={ep.scale}
        y={ep.y}
        opacity={ep.opacity}
        showHorizonGlow={ep.showHorizonGlow}
        maskStart={ep.maskStart}
        maskMid={ep.maskMid}
        maskEnd={ep.maskEnd}
      />

      <BrandHeader step={step} totalSteps={onboardingScreens.length} />

      <EditorialBlock step={step} title={screen.title} subtitle={screen.subtitle} />

      <VisualSlot step={step} onDragEnd={handleDragEnd}>
        {step === 0 && null}
        {step === 1 && <Screen02Visual />}
        {step === 2 && <Screen03Visual />}
        {step === 3 && <Screen04Visual />}
        {step === 4 && <Screen05Visual />}
        {step === 5 && <Screen06Visual onNext={goNext} />}
      </VisualSlot>

      <OnboardingFooter
        step={step}
        total={onboardingScreens.length}
        onNext={goNext}
        onPrev={goPrev}
      />
    </OnboardingShell>
  );
};

export default MobileOnboarding;
