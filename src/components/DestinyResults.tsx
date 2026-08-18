import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, MapPin, Star, Sparkles, Loader2, ShieldAlert, Zap, Compass, RefreshCcw, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO, ZodiacElement } from "@/data/atlas";
import { generateDestinyInsight } from "@/lib/ai/concierge";
import { BoardingPassCard } from "./destiny/BoardingPassCard";
import { getCountryFlag } from "@/lib/countryFlags";

interface CityOption {
  display_name: string;
  city: string;
  country: string;
  lat?: number;
  lon?: number;
  tags?: string[];
  score?: number;
}

export interface DestinyResultsProps {
  house: number;
  houseName: string;
  houseData: any; // Mantendo para compatibilidade caso outro componente envie
  cities: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
  allResults?: Record<string, any>;
  onUnlock?: (houses: number) => void;
  userCredits?: number;
  isAuthenticated?: boolean;
  consultationId?: string;
  autoUnlocked?: boolean;
  mode?: "passado" | "presente" | "futuro";
  embedded?: boolean;
  originCity?: string | null;
  isGoal?: boolean;
}

export const DestinyResults: React.FC<DestinyResultsProps> = ({
  house,
  cities,
  autoUnlocked = false,
  isAuthenticated,
  mode = "futuro",
}) => {
  const [unlocked, setUnlocked] = useState(autoUnlocked);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const masterCity = allCities[0];

  useEffect(() => {
    if (unlocked && masterCity) {
      const fetchInsight = async () => {
        setLoadingInsight(true);
        try {
          // Aqui no futuro podemos extrair o elemento astrológico real da cidade.
          // Por enquanto usamos 'Fogo' como default vibrante para a demo Premium.
          const insight = await generateDestinyInsight({
            houseNumber: house,
            element: "Fogo", 
            cityName: masterCity.city || masterCity.display_name,
            intent: mode
          });
          setAiInsight(insight);
        } catch (error) {
          console.error("Erro AI:", error);
        } finally {
          setLoadingInsight(false);
        }
      };
      fetchInsight();
    }
  }, [unlocked, masterCity, house, mode]);

  if (!masterCity) return null;

  const cityName = masterCity.city || masterCity.display_name;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* SEÇÃO 1: O BOARDING PASS CARD (O Destino) */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-space uppercase tracking-widest text-gold mb-1">
              Destino Mestre Recomendado
            </h2>
            <h3 className="text-2xl font-cinzel font-bold text-foreground">
              A Coordenada de Ativação
            </h3>
          </div>
        </div>

        <BoardingPassCard 
          city={cityName}
          country={masterCity.country}
          flagUrl={`https://flagcdn.com/w40/${masterCity.country ? "us" : "us"}.png`} // Simplificado na refatoração, ideal mapear iso code
          matchScore={masterCity.score || 98}
          houseNumber={house}
          houseTitle={atlasData.title}
          aiInsight={aiInsight}
          isLoadingInsight={loadingInsight}
          onSelect={() => {}}
        />
      </section>

      {/* SEÇÃO 2: O DOSSIÊ ESTRATÉGICO (Protocolo Solar) */}
      <section className="glass-panel p-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Star className="w-8 h-8 text-gold mx-auto mb-4 opacity-50" />
          <h2 className="text-sm font-space uppercase tracking-[0.3em] text-muted-foreground mb-2">
            O Dossiê Estratégico
          </h2>
          <h3 className="text-3xl font-cinzel font-bold text-foreground">
            Plano de Execução 12 Meses
          </h3>
          <p className="text-muted-foreground mt-4 font-light">
            Ao ancorar seu aniversário nesta coordenada, você ativa um script 
            astrológico específico. Este é o seu manual de navegação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tesouro */}
          <div className="bg-quantum-900/40 border border-gold/10 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-gold" />
              <h4 className="font-space font-bold uppercase tracking-widest text-sm">O Tesouro</h4>
            </div>
            <p className="text-foreground/80 leading-relaxed font-light">
              {atlasData.tesouro}
            </p>
          </div>

          {/* Sombra */}
          <div className="bg-quantum-900/40 border border-destructive/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <ShieldAlert className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              <h4 className="font-space font-bold uppercase tracking-widest text-sm text-destructive">O Desafio Oculto</h4>
            </div>
            <p className="text-foreground/80 leading-relaxed font-light relative z-10">
              {atlasData.sombra}
            </p>
          </div>
        </div>

        {/* Protocolo de Ativação */}
        <div className="bg-gold/5 border border-gold/20 p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="w-6 h-6 text-gold" />
            <h4 className="font-space font-bold uppercase tracking-widest text-base text-gold">
              Protocolo de Ativação (24h)
            </h4>
          </div>
          <p className="text-lg text-foreground/90 leading-relaxed font-outfit font-light">
            {atlasData.protocolo}
          </p>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-space font-bold uppercase tracking-widest text-sm">Timeline de Materialização</h4>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gold/50 before:via-gold/20 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/50 bg-background text-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-[10px] font-bold">1-3</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                <p className="text-sm text-foreground/80 font-light">{atlasData.timeline.m1_3}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-background text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-[10px] font-bold">4-6</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                <p className="text-sm text-foreground/80 font-light">{atlasData.timeline.m4_6}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-background text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-[10px] font-bold">7-9</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                <p className="text-sm text-foreground/80 font-light">{atlasData.timeline.m7_9}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-gold/10 text-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Star className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel border-gold/30 p-4 rounded-xl">
                <p className="text-sm text-foreground/80 font-light">{atlasData.timeline.m10_12}</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Mantra */}
        <div className="mt-12 text-center p-8 border-t border-border/30">
          <RefreshCcw className="w-5 h-5 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h4 className="font-space font-bold uppercase tracking-widest text-[10px] text-muted-foreground mb-4">
            Mantra de Mudança de Estado
          </h4>
          <p className="font-cinzel text-xl md:text-2xl text-foreground italic text-glow-gold">
            "{atlasData.mantra}"
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: CIDADES SECUNDÁRIAS */}
      {allCities.length > 1 && (
        <section className="pt-8">
          <h3 className="font-space text-sm uppercase tracking-widest text-muted-foreground mb-6">
            Destinos Alternativos (Mesma Frequência)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCities.slice(1).map((city, idx) => (
              <div key={idx} className="glass-panel p-4 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-outfit font-bold text-lg">{city.city || city.display_name}</h4>
                    <span className="text-xs font-bold text-gold">{city.score || 95}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{city.country}</p>
                </div>
                {city.tags && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {city.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-1 bg-primary/20 rounded border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default DestinyResults;
