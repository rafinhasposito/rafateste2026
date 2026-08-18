import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepProgress } from "./StepProgress";

export const OnboardingFooter = ({ step, total, onNext, onPrev }: any) => (
  <footer className="w-full h-[100px] shrink-0 px-6 flex items-center justify-between pb-6 z-40 relative">
    <button
      onClick={onPrev}
      className={cn(
        "w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] bg-[#030306]/40 backdrop-blur-md transition-all",
        step === 0 ? "opacity-100 pointer-events-none" : "opacity-100"
      )}
      aria-disabled={step === 0}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
    <StepProgress current={step} total={total} />
    <button
      onClick={onNext}
      className={cn(
        "w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] bg-[#030306]/40 backdrop-blur-md transition-all",
        step === total - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <ArrowRight className="w-5 h-5" />
    </button>
  </footer>
);
