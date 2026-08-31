import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SwipeButtonProps {
  onComplete: () => void;
  checked: boolean;
}

const NODES = [
  { x: 15, y: 50 },
  { x: 30, y: 25 },
  { x: 50, y: 50 },
  { x: 70, y: 20 },
  { x: 85, y: 50 },
];

const SwipeButton = ({ onComplete, checked }: SwipeButtonProps) => {
  const [activatedNodes, setActivatedNodes] = useState<number[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout>>();
  const progressRef = useRef<ReturnType<typeof setInterval>>();
  const [holdProgress, setHoldProgress] = useState(0);

  const activateNext = useCallback(() => {
    if (checked) return;
    setActivatedNodes((prev) => {
      const next = prev.length;
      if (next >= NODES.length) return prev;
      const updated = [...prev, next];
      if (updated.length === NODES.length) {
        setTimeout(() => onComplete(), 400);
      }
      return updated;
    });
  }, [checked, onComplete]);

  const handleHoldStart = () => {
    if (checked) return;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 1800;

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / duration, 1);
      setHoldProgress(pct);

      // Activate nodes at thresholds
      const nodeThresholds = [0.1, 0.3, 0.5, 0.7, 0.9];
      nodeThresholds.forEach((threshold, i) => {
        if (pct >= threshold) {
          setActivatedNodes((prev) => {
            if (prev.includes(i)) return prev;
            return [...prev, i];
          });
        }
      });

      if (pct >= 1) {
        clearInterval(progressRef.current);
        onComplete();
      }
    }, 30);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (progressRef.current) clearInterval(progressRef.current);
    if (!checked && holdProgress < 1) {
      setActivatedNodes([]);
      setHoldProgress(0);
    }
  };

  const allActive = checked || activatedNodes.length === NODES.length;

  return (
    <div className="w-full max-w-xl mx-auto select-none">
      {/* Label */}
      <div className="text-center mb-4">
        <p className="text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground">
          {checked ? "Protocolo Selado" : "Sele o Protocolo das 24 Horas"}
        </p>
      </div>

      {/* Constellation Track */}
      <div
        className="relative h-28 md:h-32 cursor-pointer touch-none"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-opacity duration-500"
            style={{ opacity: isHolding ? 1 : 0.3 }}
          />
          {/* Progress bar at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold-dark via-primary to-gold-light"
            style={{ width: `${holdProgress * 100}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* SVG Constellation */}
        <svg
          viewBox="0 0 100 70"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {NODES.map((node, i) => {
            if (i === 0) return null;
            const prev = NODES[i - 1];
            const isActive =
              activatedNodes.includes(i) && activatedNodes.includes(i - 1);
            return (
              <motion.line
                key={`line-${i}`}
                x1={prev.x}
                y1={prev.y}
                x2={node.x}
                y2={node.y}
                stroke={
                  isActive
                    ? "hsl(38, 85%, 55%)"
                    : "hsl(38, 85%, 55%)"
                }
                strokeOpacity={isActive ? 0.8 : 0.08}
                strokeWidth={isActive ? 0.6 : 0.3}
                strokeDasharray={isActive ? "none" : "2 2"}
                initial={false}
                animate={{
                  strokeOpacity: isActive ? 0.8 : 0.08,
                  strokeWidth: isActive ? 0.6 : 0.3,
                }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const isActive = activatedNodes.includes(i);
            return (
              <g key={`node-${i}`}>
                {/* Outer pulse ring */}
                {isActive && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={4}
                    fill="none"
                    stroke="hsl(38, 85%, 55%)"
                    strokeWidth={0.3}
                    initial={{ r: 2, opacity: 0.8 }}
                    animate={{ r: 6, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                {/* Main node */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 2.2 : 1.5}
                  fill={
                    isActive
                      ? "hsl(38, 85%, 55%)"
                      : "hsl(220, 10%, 30%)"
                  }
                  initial={false}
                  animate={{
                    r: isActive ? 2.2 : 1.5,
                    filter: isActive
                      ? "drop-shadow(0 0 4px hsl(38, 85%, 55%))"
                      : "none",
                  }}
                  transition={{ duration: 0.3, type: "spring" }}
                />
                {/* Inner bright core */}
                {isActive && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={0.8}
                    fill="hsl(42, 90%, 85%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center instruction */}
        <AnimatePresence mode="wait">
          {!checked && (
            <motion.div
              key="instruction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <motion.div
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/20 flex items-center justify-center mb-2"
                animate={{
                  borderColor: isHolding
                    ? "hsl(38, 85%, 55%)"
                    : "hsla(38, 85%, 55%, 0.2)",
                  scale: isHolding ? 0.95 : 1,
                  boxShadow: isHolding
                    ? "0 0 30px hsla(38, 85%, 55%, 0.3)"
                    : "0 0 0px transparent",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Fingerprint icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke={
                    isHolding ? "hsl(38, 85%, 55%)" : "hsl(220, 10%, 40%)"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
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
              <p className="text-[9px] md:text-[10px] text-muted-foreground/60 tracking-widest uppercase font-sans">
                {isHolding ? "Selando..." : "Pressione e segure"}
              </p>
            </motion.div>
          )}

          {checked && (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <motion.div
                className="w-14 h-14 rounded-full border-2 border-green-500/60 flex items-center justify-center mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{
                  boxShadow: "0 0 30px hsla(142, 71%, 45%, 0.2)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="none"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <p className="text-[10px] text-green-500/70 tracking-[0.3em] uppercase font-sans font-semibold">
                Protocolo Selado
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeButton;
