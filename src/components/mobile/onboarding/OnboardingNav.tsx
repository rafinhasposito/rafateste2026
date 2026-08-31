import { ChevronLeft } from 'lucide-react';

interface OnboardingNavProps {
  step: number; // 1‑6
  totalSteps?: number;
  onNext: () => void;
  onPrev: () => void;
  isFinal?: boolean;
}

/**
 * Shared navigation for the onboarding flow.
 * - Top bar: back button (hidden on step 1) + "X de 6" counter.
 * - Bottom bar: primary CTA (Continuar or Começar Minha Análise).
 * All buttons have identical size, style and placement on every screen.
 */
export function OnboardingNav({
  step,
  totalSteps = 6,
  onNext,
  onPrev,
  isFinal = false,
}: OnboardingNavProps) {
  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-4 pb-2 bg-gradient-to-b from-[#030306]/80 to-transparent">
        {step > 1 ? (
          <button
            onClick={onPrev}
            className="h-10 w-10 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}
        <p className="font-mono text-[10px] text-white/30 tracking-widest">{step} de {totalSteps}</p>
        <div className="h-10 w-10" /> {/* placeholder */}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#030306]/80 to-transparent">
        <button
          onClick={onNext}
          className={`h-12 w-full font-inter text-xs font-bold tracking-[0.15em] uppercase transition-all ${
            isFinal
              ? 'bg-[#D4AF37] text-black hover:bg-[#c9a832] active:scale-[0.98]'
              : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
          }`}
        >
          {isFinal ? 'Começar Minha Análise' : 'Continuar'}
        </button>
      </div>
    </>
  );
}
