import { motion } from "framer-motion";
import { cityDatabase } from "@/data/houses";

interface GoalCardsProps {
  selectedGoal: number | null;
  onSelect: (id: number) => void;
}

const GoalCards = ({ selectedGoal, onSelect }: GoalCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.values(cityDatabase).map((house) => (
        <motion.div
          key={house.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(house.id)}
          className={`goal-card ${selectedGoal === house.id ? "selected" : ""}`}
        >
          <div className="text-3xl mb-2 icon-scale transition-transform duration-300">
            {house.emoji}
          </div>
          <p className="text-[10px] text-foreground font-bold uppercase tracking-widest leading-tight">
            {house.label.replace(" & ", " &\n")}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default GoalCards;
