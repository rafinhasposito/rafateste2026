import { motion } from "framer-motion";
import { cityDatabase } from "@/data/houses";
import { Crown, DollarSign, Radio, Home, Sparkles, Settings, Handshake, Flame, Globe, Award, Users, Eye } from "lucide-react";

const houseIcons: Record<number, React.ReactNode> = {
  1: <Flame className="w-6 h-6" />,
  2: <DollarSign className="w-6 h-6" />,
  3: <Radio className="w-6 h-6" />,
  4: <Home className="w-6 h-6" />,
  5: <Sparkles className="w-6 h-6" />,
  6: <Settings className="w-6 h-6" />,
  7: <Handshake className="w-6 h-6" />,
  8: <Flame className="w-6 h-6" />,
  9: <Globe className="w-6 h-6" />,
  10: <Crown className="w-6 h-6" />,
  11: <Users className="w-6 h-6" />,
  12: <Eye className="w-6 h-6" />,
};

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
          <div className="text-primary mb-2 icon-scale transition-transform duration-300">
            {houseIcons[house.id]}
          </div>
          <p className="text-[10px] text-foreground font-bold uppercase tracking-widest leading-tight">
            Casa {house.id} — {house.label.replace(" & ", " &\n")}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default GoalCards;
