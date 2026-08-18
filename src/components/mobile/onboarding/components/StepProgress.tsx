import React from "react";

interface StepProgressProps {
  current: number;
  total: number;
  onSelectStep?: (index: number) => void;
}

export const StepProgress = ({ current, total, onSelectStep }: StepProgressProps) => (
  <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#030306]/60 backdrop-blur-md border border-[#D4AF37]/20">
    {Array.from({ length: total }).map((_, i) => {
      const isActive = i === current;
      return (
        <button
          key={i}
          onClick={() => onSelectStep && onSelectStep(i)}
          className={`h-1 rounded-full transition-all duration-300 ${
            isActive
              ? "w-6 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
              : "w-3 bg-white/25 hover:bg-[#D4AF37]/50"
          }`}
          aria-label={`Ir para a tela ${i + 1}`}
        />
      );
    })}
  </div>
);
