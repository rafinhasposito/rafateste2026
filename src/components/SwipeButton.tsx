import { useRef, useState, useCallback } from "react";

interface SwipeButtonProps {
  onComplete: () => void;
  checked: boolean;
}

const SwipeButton = ({ onComplete, checked }: SwipeButtonProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerWidth = useRef(0);

  const getContainerWidth = useCallback(() => {
    if (trackRef.current) {
      return trackRef.current.getBoundingClientRect().width - 56; // thumb width
    }
    return 300;
  }, []);

  const handleStart = (clientX: number) => {
    if (checked) return;
    setIsDragging(true);
    startXRef.current = clientX;
    containerWidth.current = getContainerWidth();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || checked) return;
    const diff = clientX - startXRef.current;
    const newPos = Math.max(0, Math.min(diff, containerWidth.current));
    setPosition(newPos);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (position > containerWidth.current * 0.7) {
      setPosition(containerWidth.current);
      onComplete();
    } else {
      setPosition(0);
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative w-full max-w-xl mx-auto h-16 bg-black/60 rounded-full border border-primary/30 overflow-hidden flex items-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] group"
    >
      <div
        className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all ease-out"
        style={{ width: `${position + 56}px` }}
      />
      <div
        className={`absolute w-14 h-14 rounded-full flex items-center justify-center cursor-grab shadow-[0_0_20px_hsl(var(--gold)/0.6)] z-10 transition-transform touch-none ${
          checked
            ? "bg-green-500"
            : "bg-gradient-to-r from-gold-dark to-gold-light hover:scale-105 active:scale-95"
        }`}
        style={{ left: `${position + 4}px` }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
        onMouseLeave={handleEnd}
      >
        {checked ? (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        )}
      </div>
      <div className="w-full text-center text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest select-none pointer-events-none z-0">
        {checked ? "✓ Protocolo Aceito" : "Deslize para aceitar a Regra das 24 Horas"}
      </div>
    </div>
  );
};

export default SwipeButton;
