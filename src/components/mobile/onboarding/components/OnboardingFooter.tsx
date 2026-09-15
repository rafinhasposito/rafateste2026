import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepProgress } from "./StepProgress";

interface OnboardingFooterProps {
  step: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectStep?: (index: number) => void;
}

export const OnboardingFooter = ({
  step,
  total,
  onNext,
  onPrev,
  onSelectStep,
}: OnboardingFooterProps) => {
  const isFirst = step === 0;

  return (
    <footer className="w-full h-[90px] shrink-0 px-6 flex items-center justify-between pb-6 pt-2 z-40 relative select-none">
      {/* Botão Voltar */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`w-11 h-11 rounded-full border border-[#C9A227]/50 flex items-center justify-center bg-[#030306]/70 backdrop-blur-md text-[#C9A227] transition-all duration-200 ${
          isFirst
            ? "opacity-0 pointer-events-none"
            : "opacity-100 hover:scale-105 active:scale-95 hover:border-[#C9A227] hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
        }`}
        aria-label="Tela anterior"
      >
        <ChevronLeft className="w-5 h-5 -ml-0.5" />
      </button>

      {/* 6 Barras de Progresso */}
      <StepProgress current={step} total={total} onSelectStep={onSelectStep} />

      {/* Botão Avançar */}
      <button
        onClick={onNext}
        className="w-11 h-11 rounded-full border border-[#C9A227]/50 flex items-center justify-center bg-[#030306]/70 backdrop-blur-md text-[#C9A227] transition-all duration-200 opacity-100 hover:scale-105 active:scale-95 hover:border-[#C9A227] hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
        aria-label="Próxima tela"
      >
        <ChevronRight className="w-5 h-5 -mr-0.5" />
      </button>
    </footer>
  );
};
