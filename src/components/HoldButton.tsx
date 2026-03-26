import { useRef, useState, useCallback, useEffect } from "react";

interface HoldButtonProps {
  onComplete: () => void;
  disabled?: boolean;
  label: string;
  sublabel: string;
}

const HoldButton = ({ onComplete, disabled, label, sublabel }: HoldButtonProps) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startHold = useCallback(() => {
    if (disabled) return;
    setIsHolding(true);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current);
        setIsHolding(false);
        onComplete();
      }
    }, 20);
  }, [disabled, onComplete]);

  const endHold = useCallback(() => {
    if (!isHolding) return;
    clearInterval(intervalRef.current);
    setIsHolding(false);
    setProgress(0);
  }, [isHolding]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <button
        type="button"
        disabled={disabled}
        onMouseDown={startHold}
        onTouchStart={startHold}
        onMouseUp={endHold}
        onTouchEnd={endHold}
        onMouseLeave={endHold}
        className={`relative w-full py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] border overflow-hidden select-none touch-none transition-all duration-200 ${
          disabled
            ? "border-muted bg-muted/20 cursor-not-allowed opacity-50"
            : "border-primary/50 bg-quantum-950 shadow-[0_0_40px_hsl(var(--gold)/0.1)] hover:shadow-[0_0_60px_hsl(var(--gold)/0.2)] active:scale-[0.98]"
        }`}
      >
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-30 transition-none"
          style={{ width: `${progress}%` }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02.1 2.51.412 4.12C10.857 18.18 11.476 20 12 20s1.143-1.82 1.588-3.88c.312-1.61.412-3.1.412-4.12a2 2 0 0 0-2-2z" />
              <path d="M12 10V4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-lg drop-shadow-md">
              {label}
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
            {sublabel}
          </span>
        </div>
      </button>
    </div>
  );
};

export default HoldButton;
