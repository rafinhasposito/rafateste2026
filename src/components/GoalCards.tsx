import { motion } from "framer-motion";
import { cityDatabase } from "@/data/houses";

interface GoalCardsProps {
  selectedGoal: number | null;
  onSelect: (id: number) => void;
}

const GoalCards = ({ selectedGoal, onSelect }: GoalCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.values(cityDatabase).map((house) => {
        const isSelected = selectedGoal === house.id;
        
        return (
          <motion.div
            key={house.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(house.id)}
            className={`relative w-full text-left p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-center min-h-[110px] overflow-hidden border ${
              isSelected 
                ? "bg-[#D4AF37]/10 border-[#D4AF37]/40" 
                : "bg-white/[0.02] border-white/5 hover:border-white/20"
            }`}
          >
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent pointer-events-none" />
            )}
            
            <div className="relative z-10 flex gap-4 items-center">
              <span className={`font-mono text-3xl font-light opacity-50 ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                {String(house.id).padStart(2, '0')}
              </span>
              
              <div className="flex-1">
                <h3
                  className={`font-cinzel text-lg mb-1 leading-tight ${
                    isSelected ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {house.label}
                </h3>
                <p className="font-inter text-white/50 text-[11px] leading-relaxed">
                  {house.intent}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoalCards;
