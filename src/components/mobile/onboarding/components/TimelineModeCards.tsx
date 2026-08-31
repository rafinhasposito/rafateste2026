import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export type OnboardingMode = "passado" | "presente" | "futuro";

interface TimelineModeCardsProps {
  selectedMode?: OnboardingMode | null;
  onSelectMode?: (mode: OnboardingMode) => void;
}

const CARDS = [
  {
    id: "passado" as OnboardingMode,
    num: "01",
    badge: "PASSADO",
    title: "Auditar um ciclo anterior",
    desc: "Onde você passou seu aniversário?",
  },
  {
    id: "presente" as OnboardingMode,
    num: "02",
    badge: "PRESENTE",
    title: "Analisar o ciclo atual",
    desc: "Onde está passando seu aniversário este ano?",
  },
  {
    id: "futuro" as OnboardingMode,
    num: "03",
    badge: "FUTURO",
    title: "Projetar o próximo ciclo",
    desc: "Onde ancorar o Sol define os próximos 12 meses.",
  },
];

const getColors = (id: OnboardingMode, isSelected: boolean) => {
  if (id === "futuro") {
    return {
      border: isSelected ? "rgba(212,175,55,0.55)" : "rgba(212,175,55,0.15)",
      accent: "rgba(212,175,55,0.9)",
      bg: isSelected ? "rgba(212,175,55,0.06)" : "rgba(10,10,12,0.75)",
    };
  }
  if (id === "presente") {
    return {
      border: isSelected ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)",
      accent: "rgba(212,175,55,0.65)",
      bg: isSelected ? "rgba(212,175,55,0.04)" : "rgba(10,10,12,0.75)",
    };
  }
  return {
    border: isSelected ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)",
    accent: "rgba(255,255,255,0.45)",
    bg: isSelected ? "rgba(255,255,255,0.04)" : "rgba(10,10,12,0.75)",
  };
};

export const TimelineModeCards = ({ selectedMode, onSelectMode }: TimelineModeCardsProps) => {
  return (
    <div className="w-full flex flex-col gap-2.5 px-5 max-w-[380px] mx-auto z-30">
      {CARDS.map((card, idx) => {
        const isSelected = selectedMode === card.id;
        const colors = getColors(card.id, isSelected);

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectMode && onSelectMode(card.id)}
            className="cursor-pointer rounded-xl p-4 flex items-center gap-3.5 transition-all duration-200 relative overflow-hidden"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
          >
            {isSelected && (
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }}
              />
            )}

            <span
              className="text-[10px] font-bold tracking-[0.2em] font-sans shrink-0 w-6 text-center"
              style={{ color: colors.accent }}
            >
              {card.num}
            </span>

            <div className="flex-1 min-w-0">
              <span
                className="text-[8px] font-bold tracking-[0.22em] uppercase block mb-0.5 font-sans"
                style={{ color: colors.accent }}
              >
                {card.badge}
              </span>
              <h4 className="font-sans text-[13px] font-semibold text-[#FAF7EE] leading-tight">
                {card.title}
              </h4>
              <p className="font-sans text-[10px] text-[#FAF7EE]/40 leading-snug mt-0.5">
                {card.desc}
              </p>
            </div>

            <ChevronRight
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: isSelected ? colors.accent : "rgba(255,255,255,0.2)" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
