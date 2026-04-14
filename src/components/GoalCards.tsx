import { motion } from "framer-motion";
import { cityDatabase, houseColors } from "@/data/houses";
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

function extractAccentColor(house: number): string {
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
}

interface GoalCardsProps {
  selectedGoal: number | null;
  onSelect: (id: number) => void;
}

const GoalCards = ({ selectedGoal, onSelect }: GoalCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.values(cityDatabase).map((house) => {
        const accent = extractAccentColor(house.id);
        return (
          <motion.div
            key={house.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(house.id)}
            className={`goal-card ${selectedGoal === house.id ? "selected" : ""}`}
          >
            <div
              className="mb-2 transition-transform duration-300 icon-scale"
              style={{ color: `rgb(${accent})` }}
            >
              {houseIcons[house.id]}
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5 font-cinzel text-sm font-black"
              style={{
                background: `rgba(${accent}, 0.15)`,
                border: `1px solid rgba(${accent}, 0.3)`,
                color: `rgb(${accent})`,
              }}
            >
              {house.id}
            </div>
            <p
              className="text-xs font-bold uppercase tracking-widest leading-tight"
              style={{ color: `rgb(${accent})` }}
            >
              {house.label.replace(" & ", " &\n")}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoalCards;
