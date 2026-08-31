import React from "react";
import { motion } from "framer-motion";
import { Plane, MapPin, Star } from "lucide-react";
import type { HouseData } from "@/data/houses";

interface BoardingPassCardProps {
  city: string;
  country: string;
  flagUrl?: string;
  matchScore: number;
  houseNumber: number;
  houseTitle: string;
  houseData: HouseData;
  aiInsight?: string;
  isLoadingInsight?: boolean;
  onSelect?: () => void;
}

export const BoardingPassCard: React.FC<BoardingPassCardProps> = ({
  city,
  country,
  flagUrl,
  matchScore,
  houseNumber,
  houseTitle,
  houseData,
  aiInsight,
  isLoadingInsight,
  onSelect
}) => {
  const tags = houseData.realLife.split("·").map(t => t.trim()).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(10, 10, 12, 0.92)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.7)",
      }}
      onClick={onSelect}
    >
      {/* Gold accent top bar */}
      <div
        className="h-[2px] w-full"
        style={{ background: "linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,0.8) 50%, rgba(212,175,55,0))" }}
      />

      <div className="flex flex-col md:flex-row">
        {/* Left panel: Destination */}
        <div
          className="p-6 md:p-8 md:w-[38%] flex flex-col justify-between border-b md:border-b-0 md:border-r"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 font-sans">
                Destino Recomendado
              </span>
              <Plane className="w-3.5 h-3.5 text-gold/40" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold font-sans text-foreground tracking-tight leading-none mb-2">
              {city}
            </h3>
            <p className="text-sm text-white/40 font-sans flex items-center gap-2">
              {flagUrl && <img src={flagUrl} alt={country} className="w-4 h-3 rounded-sm object-cover opacity-70" />}
              {country}
            </p>
          </div>

          {/* Score */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-white/25 font-sans block mb-1.5">
              Compatibilidade
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gold font-sans">{matchScore}%</span>
              <span className="text-xs text-white/30 font-sans">afinidade astral</span>
            </div>
            {/* Score bar */}
            <div className="mt-2 h-0.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${matchScore}%`,
                  background: "linear-gradient(90deg, rgba(212,175,55,0.4), rgba(212,175,55,0.9))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right panel: House + Insight */}
        <div className="p-6 md:p-8 md:w-[62%] flex flex-col">
          {/* House badge */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <span
                className="inline-block text-[9px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded mb-2 font-sans"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  color: "rgba(212,175,55,0.8)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                Casa {houseNumber}
              </span>
              <h4 className="text-base font-cinzel font-bold text-foreground">
                {houseTitle}
              </h4>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
            >
              <Star className="w-3.5 h-3.5 text-white/20 group-hover:text-gold transition-colors duration-200" />
            </div>
          </div>

          {/* Translation quote */}
          <div className="mb-5">
            <p className="text-base md:text-lg font-cinzel text-foreground/90 leading-snug">
              "{houseData.translation}"
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-1 font-sans"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* AI Insight */}
          <div
            className="mt-auto pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-gold/50 block mb-2 font-sans">
              Leitura do Destino
            </span>
            {isLoadingInsight ? (
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-4/5 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-3/5 animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-white/60 leading-relaxed font-light font-sans">
                {aiInsight || "Insight gerado após cálculo."}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
