import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cityDatabase } from "@/data/houses";
import { houseThemes } from "@/data/houseThemes";

interface GoalCardsProps {
  selectedGoal: number | null;
  onSelect: (id: number) => void;
  mode?: string;
}

const GoalCards = ({ selectedGoal, onSelect }: GoalCardsProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-8 relative">
      {Object.values(cityDatabase).map((house, index) => {
        const isSelected = selectedGoal === house.id;
        const themeHex = houseThemes[house.id]?.themeColor || "#C9A227";

        return (
          <motion.button
            key={house.id}
            type="button"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            onClick={() => onSelect(house.id)}
            className={`group relative w-full min-h-[210px] text-left p-6 md:p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between border overflow-hidden ${
              isSelected
                ? "bg-[#0B1526]/95 border-[#C9A227]/60 shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                : "bg-[#08111F]/80 border-white/[0.08] hover:bg-[#0C182B]/90 hover:border-white/[0.20] hover:-translate-y-0.5 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
            }`}
          >
            {/* Brilho suave no topo do card */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${themeHex}, transparent 70%)`,
              }}
            />

            <div className="relative z-10 w-full">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] border"
                  style={{
                    color: themeHex,
                    backgroundColor: `${themeHex}14`,
                    borderColor: `${themeHex}35`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: themeHex }}
                  />
                  Casa {String(house.id).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-ps-display text-lg md:text-xl font-bold text-white leading-snug mb-2.5 group-hover:text-[#F5DE98] transition-colors">
                {house.tag || house.intent}
              </h3>

              <p className="font-ps-body text-sm text-white/65 leading-relaxed line-clamp-3">
                {house.translation || house.intent}
              </p>
            </div>

            <div className="relative z-10 pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50 group-hover:text-white transition-colors">
                Ver detalhes desta área
              </span>
              <div className="w-7 h-7 rounded-full bg-white/[0.05] group-hover:bg-[#C9A227]/20 border border-white/[0.08] group-hover:border-[#C9A227]/40 flex items-center justify-center transition-all">
                <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:text-[#F5DE98] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GoalCards;

