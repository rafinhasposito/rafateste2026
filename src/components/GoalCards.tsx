import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cityDatabase } from "@/data/houses";
import { houseThemes } from "@/data/houseThemes";
import { useNavigate } from "react-router-dom";

interface GoalCardsProps {
  selectedGoal: number | null;
  onSelect: (id: number) => void;
  mode?: string;
}

const GoalCards = ({ selectedGoal, onSelect, mode = "futuro" }: GoalCardsProps) => {
  const navigate = useNavigate();
  const [expandingHouse, setExpandingHouse] = useState<number | null>(null);

  // O VÍDEO EXATO QUE TOCA NO TRAILER, PARA CONECTAR AS EXPERIÊNCIAS
  const videoSrc = '/videos/teste-fundo.mp4';

  const handleHouseClick = (id: number) => {
    onSelect(id);
    setExpandingHouse(id);
    
    // Animação de expansão majestosa e depois direciona para o CLONE integrado ao App
    setTimeout(() => {
      navigate(`/app/trailer?house=${id}&mode=${mode}`);
    }, 1500); // Aumentei o tempo de 800ms para 1.5s para respirar
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 pb-12 relative">
      {Object.values(cityDatabase).map((house, index) => {
        const isSelected = selectedGoal === house.id;
        const isExpanding = expandingHouse === house.id;
        const themeHex = houseThemes[house.id]?.themeColor || "#ffffff";
        
        const gradient = `linear-gradient(135deg, ${themeHex}, color-mix(in srgb, ${themeHex} 40%, white))`;

        return (
          <motion.button
            key={house.id}
            layoutId={`house-card-${house.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: expandingHouse && !isExpanding ? 0 : 1, 
              y: 0,
              scale: isExpanding ? 1.05 : 1,
              zIndex: isExpanding ? 50 : 1
            }}
            transition={{ duration: isExpanding ? 1.2 : 0.5, delay: isExpanding ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={!expandingHouse ? { scale: 1.03 } : {}}
            whileTap={!expandingHouse ? { scale: 0.97 } : {}}
            onClick={() => handleHouseClick(house.id)}
            className={`group w-full text-left p-6 md:p-8 transition-all duration-700 flex flex-col justify-center border overflow-hidden ${
              isSelected || isExpanding ? "bg-[#030303] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)]" : "bg-white/[0.03] backdrop-blur-md border-white/5 hover:bg-white/[0.06] hover:border-white/15"
            } ${isExpanding ? "fixed inset-0 z-50 rounded-none md:rounded-none m-0" : "relative rounded-[2rem]"}`}
            style={{
              borderColor: isSelected || isExpanding ? themeHex : undefined,
              boxShadow: isSelected || isExpanding ? `0 0 80px ${themeHex}40, inset 0 0 50px ${themeHex}20` : 'none',
            }}
          >
            {/* VÍDEO DE FUNDO NO HOVER (Animado e Tingido com a cor da Casa) */}
            <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none z-0 ${isExpanding ? 'opacity-40' : 'opacity-0 group-hover:opacity-[0.25]'}`}>
              <video autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-screen grayscale">
                <source src={videoSrc} type="video/mp4" />
              </video>
              <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: themeHex }} />
            </div>

            {/* Banho de Cor Único (Mais Forte) */}
            <div 
              className={`absolute inset-0 transition-opacity duration-500 pointer-events-none z-0 mix-blend-screen ${
                isSelected || isExpanding ? 'opacity-[0.80]' : 'opacity-0 group-hover:opacity-[0.50]'
              }`}
              style={{ background: `radial-gradient(ellipse at top left, ${themeHex}, transparent 80%)` }}
            />

            {/* Borda Glow Externa no Hover */}
            <div 
              className="absolute inset-0 border-2 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ borderColor: `${themeHex}80` }}
            />

            <div className="relative z-10 flex flex-col items-start w-full">
              <div className="relative mb-3">
                <h3
                  className={`font-ps-display text-xl md:text-3xl font-bold uppercase tracking-widest transition-opacity duration-500 ${
                    isSelected || isExpanding ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                  }`}
                  style={{ color: 'white' }}
                >
                  {house.label}
                </h3>
                
                <h3
                  className={`absolute top-0 left-0 font-ps-display text-xl md:text-3xl font-bold uppercase tracking-widest transition-opacity duration-500 ${
                    isSelected || isExpanding ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    backgroundImage: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: `0px 4px 50px ${themeHex}`
                  }}
                >
                  {house.label}
                </h3>
              </div>
              
              <p className={`font-ps-ui text-sm md:text-base leading-relaxed transition-colors duration-500 ${
                isSelected || isExpanding ? 'text-white' : 'text-white/60 group-hover:text-white'
              }`}>
                {house.intent}
              </p>
            </div>
            
            {/* Mensagem de Transição para o Trailer */}
            <AnimatePresence>
              {isExpanding && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-ps-display text-sm tracking-[0.2em] uppercase font-bold"
                  style={{ textShadow: `0 0 20px ${themeHex}` }}
                >
                  Abrindo Trailer...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GoalCards;
