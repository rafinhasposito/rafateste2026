import { ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#030306]/90 via-[#030306]/50 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 md:px-12 pt-6 md:pt-12 pb-6 pointer-events-auto">
          {step > 1 ? (
            <button
              onClick={onPrev}
              className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-full transition-all"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <img
              src="/brand/protocolo-solar-logo-horizontal-4096.png"
              alt="Protocolo Solar"
              className="w-[160px] md:w-[320px] h-auto opacity-95 drop-shadow-md"
              draggable={false}
            />
          )}

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] md:text-[11px] text-white/40 tracking-[0.2em]">{step} de {totalSteps}</span>
            <button
              onClick={() => {
                localStorage.setItem('ps_onboarding_completed', 'true');
                navigate('/');
              }}
              className="h-8 w-8 flex items-center justify-center border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-all active:scale-95"
              aria-label="Fechar Onboarding"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#030306]/90 via-[#030306]/50 to-transparent pointer-events-none ${isFinal ? 'lg:hidden' : ''}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-end px-6 md:px-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-12 pointer-events-auto">
          <div className="w-full md:w-auto md:min-w-[240px]">
            <button
              onClick={onNext}
              className={`h-14 md:h-16 w-full px-10 rounded-xl font-ps-display tracking-[0.08em] text-[15px] md:text-[17px] transition-all flex items-center justify-center active:scale-95 hover:scale-[1.02] ${
                isFinal
                  ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                  : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]'
              }`}
            >
              {isFinal ? 'REVELAR MEU DESTINO' : 'CONTINUAR'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
