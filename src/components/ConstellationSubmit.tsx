import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
  label: string;
}

const STARS = [
  { x: 10, y: 40 },
  { x: 28, y: 18 },
  { x: 50, y: 45 },
  { x: 72, y: 15 },
  { x: 90, y: 40 },
];

const ConstellationSubmit = ({ onComplete, label }: Props) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const litCount = Math.floor(holdProgress * STARS.length);

  const startHold = useCallback(() => {
    if (completed) return;
    setIsHolding(true);
    const start = Date.now();
    const duration = 2200;

    intervalRef.current = setInterval(() => {
      const pct = Math.min((Date.now() - start) / duration, 1);
      setHoldProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current);
        setIsHolding(false);
        setCompleted(true);
        onComplete();
      }
    }, 25);
  }, [completed, onComplete]);

  const endHold = useCallback(() => {
    if (!isHolding) return;
    clearInterval(intervalRef.current);
    setIsHolding(false);
    if (holdProgress < 1) {
      setHoldProgress(0);
    }
  }, [isHolding, holdProgress]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="w-full max-w-xl mx-auto mt-6 mb-4">
      <button
        type="button"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className="relative w-full rounded-2xl md:rounded-3xl border border-primary/20 bg-card overflow-hidden select-none touch-none transition-shadow duration-500 group focus:outline-none"
        style={{
          boxShadow: isHolding
            ? "0 0 60px hsla(38,85%,55%,0.2), inset 0 0 40px hsla(38,85%,55%,0.05)"
            : "0 0 20px hsla(38,85%,55%,0.05)",
        }}
      >
        {/* Progress fill */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-gold-dark/20 via-primary/25 to-gold-light/20 transition-none"
          style={{ clipPath: `inset(0 ${100 - holdProgress * 100}% 0 0)` }}
        />

        {/* Constellation SVG */}
        <div className="relative py-8 md:py-10 px-6">
          <svg
            viewBox="0 0 100 55"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Lines between stars */}
            {STARS.map((star, i) => {
              if (i === 0) return null;
              const prev = STARS[i - 1];
              const active = i < litCount;
              return (
                <motion.line
                  key={`l${i}`}
                  x1={prev.x} y1={prev.y}
                  x2={star.x} y2={star.y}
                  stroke="hsl(38,85%,55%)"
                  strokeWidth={active ? 0.5 : 0.2}
                  strokeOpacity={active ? 0.7 : 0.06}
                  strokeDasharray={active ? "none" : "1.5 2"}
                  animate={{ strokeOpacity: active ? 0.7 : 0.06 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}

            {/* Star nodes */}
            {STARS.map((star, i) => {
              const active = i < litCount;
              return (
                <g key={`s${i}`}>
                  {active && (
                    <motion.circle
                      cx={star.x} cy={star.y} r={3}
                      fill="none" stroke="hsl(38,85%,55%)" strokeWidth={0.3}
                      initial={{ r: 1.5, opacity: 0.8 }}
                      animate={{ r: 5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <circle
                    cx={star.x} cy={star.y}
                    r={active ? 1.8 : 1}
                    fill={active ? "hsl(38,85%,55%)" : "hsl(220,10%,25%)"}
                    style={active ? { filter: "drop-shadow(0 0 3px hsl(38,85%,55%))" } : undefined}
                  />
                  {active && (
                    <circle cx={star.x} cy={star.y} r={0.6} fill="hsl(42,90%,85%)" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-11 h-11 rounded-full border-2 border-green-500/60 flex items-center justify-center"
                  style={{ boxShadow: "0 0 25px hsla(142,71%,45%,0.2)" }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="hsl(142,71%,45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  className="w-11 h-11 rounded-full border border-primary/30 flex items-center justify-center"
                  animate={{
                    borderColor: isHolding ? "hsl(38,85%,55%)" : "hsla(38,85%,55%,0.3)",
                    scale: isHolding ? 0.92 : 1,
                    boxShadow: isHolding ? "0 0 30px hsla(38,85%,55%,0.3)" : "0 0 0 transparent",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={isHolding ? "hsl(38,85%,55%)" : "hsl(220,10%,40%)"} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                    <path d="M2 12a10 10 0 0 1 18-6" />
                    <path d="M2 16h.01" />
                    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="text-primary font-black uppercase tracking-[0.15em] md:tracking-[0.25em] text-xs md:text-sm">
              {completed ? "Rota Calculada" : label}
            </span>
            <span className="text-[8px] md:text-[9px] text-muted-foreground/60 tracking-[0.3em] uppercase font-space">
              {completed ? "Protocolo selado" : isHolding ? "Selando protocolo..." : "Pressione e segure para selar"}
            </span>
          </div>
        </div>

        {/* Bottom progress line */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold-dark via-primary to-gold-light transition-none" style={{ width: `${holdProgress * 100}%` }} />
      </button>
    </div>
  );
};

export default ConstellationSubmit;
