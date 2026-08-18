import React from "react";
import { motion } from "framer-motion";
import { Hourglass, Sun, Compass, ChevronRight } from "lucide-react";

export type OnboardingMode = "passado" | "presente" | "futuro";

interface TimelineModeCardsProps {
  selectedMode?: OnboardingMode | null;
  onSelectMode?: (mode: OnboardingMode) => void;
}

const CARDS = [
  {
    id: "passado" as OnboardingMode,
    badge: "PASSADO",
    title: "Auditar um ciclo anterior",
    quote: "“Onde você passou seu aniversário?”",
    icon: Hourglass,
    theme: {
      border: "border-purple-500/30 hover:border-purple-400/60",
      activeBorder: "border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]",
      badgeColor: "text-purple-400",
      iconBg: "bg-purple-950/40 border border-purple-500/30 text-purple-400",
      glowBg: "rgba(168,85,247,0.08)",
      chevron: "text-purple-400/70",
    },
  },
  {
    id: "presente" as OnboardingMode,
    badge: "PRESENTE",
    title: "Analisar o ciclo atual",
    quote: "“Onde você está passando seu aniversário este ano?”",
    icon: Sun,
    theme: {
      border: "border-amber-500/30 hover:border-amber-400/60",
      activeBorder: "border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)]",
      badgeColor: "text-[#D4AF37]",
      iconBg: "bg-amber-950/40 border border-amber-500/30 text-[#D4AF37]",
      glowBg: "rgba(212,175,55,0.08)",
      chevron: "text-[#D4AF37]/70",
    },
  },
  {
    id: "futuro" as OnboardingMode,
    badge: "FUTURO",
    title: "Projetar o próximo ciclo",
    quote: "“Onde você ancora o seu Sol, define os próximos 12 meses.”",
    icon: Compass,
    theme: {
      border: "border-rose-500/30 hover:border-rose-400/60",
      activeBorder: "border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]",
      badgeColor: "text-rose-400",
      iconBg: "bg-rose-950/40 border border-rose-500/30 text-rose-400",
      glowBg: "rgba(244,63,94,0.08)",
      chevron: "text-rose-400/70",
    },
  },
];

export const TimelineModeCards = ({ selectedMode, onSelectMode }: TimelineModeCardsProps) => {
  return (
    <div className="w-full flex flex-col gap-3 px-6 max-w-[380px] mx-auto z-30">
      {CARDS.map((card, idx) => {
        const Icon = card.icon;
        const isSelected = selectedMode === card.id;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode && onSelectMode(card.id)}
            className={`cursor-pointer rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 backdrop-blur-xl ${
              isSelected ? card.theme.activeBorder : card.theme.border
            }`}
            style={{
              backgroundColor: isSelected ? card.theme.glowBg : "rgba(10, 12, 20, 0.75)",
            }}
          >
            {/* Left Icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.theme.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Middle Content */}
            <div className="flex-1 min-w-0">
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase block ${card.theme.badgeColor}`}>
                {card.badge}
              </span>
              <h4 className="font-sans text-[13px] font-semibold text-[#FAF7EE] leading-tight mt-0.5 truncate">
                {card.title}
              </h4>
              <p className="font-sans text-[11px] text-[#FAF7EE]/60 italic leading-tight mt-1 truncate">
                {card.quote}
              </p>
            </div>

            {/* Right Chevron */}
            <div className="shrink-0 pl-1">
              <ChevronRight className={`w-4 h-4 ${card.theme.chevron}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
