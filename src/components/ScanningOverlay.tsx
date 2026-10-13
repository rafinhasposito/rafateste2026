import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanningOverlayProps {
  visible: boolean;
  mode?: "futuro" | "passado" | "presente";
  year?: string;
  title?: string;
  subtitle?: string;
}

const futureTexts = [
  "Acessando Efemérides Suíças...",
  "Rotacionando Abóbada Celeste...",
  "Cruzando Meridianos Planetários...",
  "Lendo Registros Akáshicos...",
  "Sincronizando Malha Geográfica...",
  "Calculando Posições Estelares...",
  "Mapeando Coordenadas de Destino...",
];

const ScanningOverlay = ({ visible, mode = "futuro", year, title, subtitle }: ScanningOverlayProps) => {
  const [logText, setLogText] = useState(futureTexts[0]);
  const [progress, setProgress] = useState(0);

  const pastTexts = [
    "Rebobinando Efemérides...",
    `Calculando posições de ${year}...`,
    "Acessando Memória Estelar...",
    "Decodificando Arquétipos...",
    "Reconstruindo Mapa Celeste...",
    "Cruzando Dados Planetários...",
  ];

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }
    const texts = mode === "futuro" ? futureTexts : pastTexts;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLogText(texts[idx]);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 95));
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [visible, mode, year]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 bg-background/98 z-[20000] flex flex-col items-center justify-center backdrop-blur-xl p-8"
        >
          {/* Orbital rings */}
          <div className="relative w-40 h-40 md:w-52 md:h-52 mb-10">
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-primary/20"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--gold)/0.6)]" />
            </motion.div>

            {/* Middle ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-6 rounded-full border border-primary/15"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--gold)/0.4)]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/40" />
            </motion.div>

            {/* Inner ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-primary/10"
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/50" />
            </motion.div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_hsl(var(--gold)/0.2)]"
              >
                <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </motion.div>
            </div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  x: [0, Math.sin(i * 60) * 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + i * 0.4,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 rounded-full bg-primary/40"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              />
            ))}
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-ps-display text-xl md:text-3xl text-foreground tracking-[0.3em] uppercase mb-3 text-center"
          >
            {title || (mode === "futuro" ? "Calculando Rota Estelar" : mode === "presente" ? "Sintonizando Ciclo Atual" : "Resgate da Linha do Tempo")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-[0.25em] mb-8 text-center"
          >
            {subtitle || (mode === "futuro" ? "Sincronizando malha geográfica..." : mode === "presente" ? "Calculando alinhamento estelar..." : (year ? `Rebobinando até ${year}...` : "Acessando memória estelar..."))}
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 md:w-80 h-1 rounded-full bg-primary/10 overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Rotating log text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={logText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-mono text-[9px] md:text-[11px] text-primary/50 uppercase tracking-[0.3em] text-center"
            >
              {logText}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanningOverlay;
