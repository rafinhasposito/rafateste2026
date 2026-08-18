import React from "react";
import { motion } from "framer-motion";
import { Plane, MapPin, CalendarDays, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BoardingPassCardProps {
  city: string;
  country: string;
  flagUrl?: string;
  matchScore: number;
  houseNumber: number;
  houseTitle: string;
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
  aiInsight,
  isLoadingInsight,
  onSelect
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="w-full glass-panel glass-panel-glow flex flex-col md:flex-row overflow-hidden group cursor-pointer"
      onClick={onSelect}
    >
      {/* Esquerda: Identificação do Voo / Destino */}
      <div className="bg-primary/5 border-r border-border/50 p-6 md:w-1/3 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
              Destino
            </span>
            <Plane className="w-4 h-4 text-gold/70" />
          </div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight mb-1">
            {city}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {flagUrl && <img src={flagUrl} alt={country} className="w-4 h-3 rounded-sm object-cover" />}
            {country}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground block mb-1">
              Match Score
            </span>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gold">{matchScore}%</span>
              <span className="text-xs text-muted-foreground pb-1">Afinidade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: O Insight e Detalhes da Casa */}
      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Badge variant="outline" className="mb-2 bg-gold/10 text-gold border-gold/20 font-space tracking-widest text-[10px] uppercase">
              Casa {houseNumber}
            </Badge>
            <h4 className="text-lg font-cinzel font-bold text-foreground">
              {houseTitle}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center bg-background">
            <Star className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 text-gold/20">
            <Sparkles className="w-5 h-5" />
          </div>
          
          {isLoadingInsight ? (
            <div className="pl-8 pt-1 space-y-3">
              <div className="h-4 bg-muted/30 rounded w-full animate-pulse" />
              <div className="h-4 bg-muted/30 rounded w-[90%] animate-pulse" />
              <div className="h-4 bg-muted/30 rounded w-[60%] animate-pulse" />
            </div>
          ) : (
            <p className="pl-8 pt-1 text-sm md:text-base text-foreground/80 leading-relaxed font-light">
              {aiInsight || "Insight não disponível."}
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-border/30 flex justify-between items-center">
          <span className="text-[10px] font-space tracking-widest uppercase text-muted-foreground">
            Protocolo Solar Premium
          </span>
          <span className="text-[10px] font-space tracking-widest uppercase text-gold flex items-center gap-2 group-hover:gap-3 transition-all">
            Explorar Destino &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
};
