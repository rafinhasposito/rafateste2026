import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SwipeToUnlockProps {
  colorBg: string;
  colorText: string;
}

export function SwipeToUnlock({ colorBg, colorText }: SwipeToUnlockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const x = useMotionValue(0);

  // Calcula a opacidade do texto baseado no drag
  const textOpacity = useTransform(x, [0, 150], [1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    // Se o usuário arrastou mais de 200px para a direita, destrava
    if (info.offset.x > 200) {
      setIsUnlocked(true);
      setTimeout(() => navigate('/showcase-onboarding'), 400); // tempo da animação antes de mudar de rota
    }
  };

  return (
    <div className={`relative w-full max-w-sm h-16 rounded-full overflow-hidden flex items-center p-1.5 shadow-2xl ${colorBg} group`}>
      {/* Brilho animado de fundo (Shimmer effect) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

      {/* Texto Deslize para Desbloquear */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center font-bold text-sm uppercase tracking-widest text-white pointer-events-none"
      >
        {isUnlocked ? "Destravando..." : "Deslize para Mapear"}
      </motion.div>

      {/* Thumb (Botão que arrasta) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 260 }}
        dragElastic={0.05}
        dragSnapToOrigin={!isUnlocked} // Se não destravou, volta pro começo
        onDragEnd={handleDragEnd}
        animate={isUnlocked ? { x: 260 } : {}}
        className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
      >
        {isUnlocked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
             <Lock className={`w-5 h-5 ${colorText}`} />
          </motion.div>
        ) : (
          <ArrowRight className={`w-6 h-6 ${colorText} group-hover:translate-x-1 transition-transform`} />
        )}
      </motion.div>
    </div>
  );
}
