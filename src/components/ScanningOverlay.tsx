import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanningOverlayProps {
  visible: boolean;
  mode: "futuro" | "passado";
  year?: string;
}

const futureTexts = [
  "Acessando Suíça...",
  "Rotacionando Abóbada...",
  "Cruzando Meridianos...",
  "Lendo Registros Akáshicos...",
  "Sincronizando Malha Geográfica...",
];

const ScanningOverlay = ({ visible, mode, year }: ScanningOverlayProps) => {
  const [logText, setLogText] = useState(futureTexts[0]);
  const pastTexts = [
    "Rebobinando Efemérides...",
    `Calculando posições de ${year}...`,
    "Acessando Memória Estelar...",
    "Decodificando Arquétipos...",
  ];

  useEffect(() => {
    if (!visible) return;
    const texts = mode === "futuro" ? futureTexts : pastTexts;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLogText(texts[idx]);
    }, 1500);
    return () => clearInterval(interval);
  }, [visible, mode, year]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-quantum-950/98 z-[20000] flex flex-col items-center justify-center backdrop-blur-lg p-8"
        >
          <div className="mb-10 text-center">
            <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-8">
              <svg className="w-full h-full text-primary animate-spin opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-foreground ai-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            </div>
            <h2 className="font-cinzel text-xl md:text-3xl text-foreground tracking-[0.4em] uppercase mb-3">
              {mode === "futuro" ? "Rotacionando Abóbada" : "Resgate da Linha do Tempo"}
            </h2>
            <p className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-[0.3em] italic">
              {mode === "futuro" ? "Sincronizando Malha Geográfica..." : `Rebobinando até ${year}...`}
            </p>
          </div>
          <div className="scan-line" />
          <motion.div
            key={logText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 font-mono text-[9px] md:text-xs text-primary/60 uppercase tracking-[0.4em]"
          >
            {logText}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanningOverlay;
