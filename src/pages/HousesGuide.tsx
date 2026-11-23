import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import GoalCards from "@/components/GoalCards";

export default function HousesGuide() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-[#02050A] text-white pt-20 pb-28 lg:pt-28 lg:pb-20 relative overflow-x-hidden">
      {/* Glow ambiental sutil */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(201,162,39,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#F5DE98] text-[10px] font-ps-ui font-bold uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>As 12 Casas Solares</span>
          </div>

          <h1 className="font-ps-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
            O que cada Casa ativa no seu ano
          </h1>

          <p className="font-ps-ui text-sm sm:text-base text-white/65 leading-relaxed">
            Cada cidade do mundo coloca seu aniversário em uma destas 12 Casas.
            Toque em qualquer Casa abaixo para conhecer a energia dela.
          </p>
        </motion.div>

        <GoalCards
          selectedGoal={null}
          onSelect={(houseId) => navigate(`/casas/${houseId}`)}
        />
      </div>
    </div>
  );
}
