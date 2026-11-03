const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';

const content = `import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountryFlag } from "@/lib/countryFlags";
import { ArrowRight, MapPin, Zap, ShieldAlert, PlayCircle, Download, Clock, Target, CheckCircle2, BookOpen } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO } from "@/data/atlas";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";
import { mockDestinyNewYork } from "@/data/destiny";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface DestinyResultsProps {
  house: number;
  houseName: string;
  houseData: any;
  cities: any;
  allResults?: Record<string, any>;
  onUnlock?: (houses: number) => void;
  userCredits?: number;
  isAuthenticated?: boolean;
  consultationId?: string;
  autoUnlocked?: boolean;
  embedded?: boolean;
  isHouseUnlocked?: (house: number) => boolean;
  onSelectHouse?: (house: number) => void;
  mode?: "passado" | "presente" | "futuro";
  unlockedCount?: number;
}

export const DestinyResults: React.FC<DestinyResultsProps> = ({
  house, cities, autoUnlocked = false, mode = "futuro",
  consultationId, userCredits, isAuthenticated, embedded = false,
  isHouseUnlocked, onSelectHouse, onUnlock, unlockedCount = 1
}) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const masterCity = allCities[0];

  useEffect(() => {
    if (!masterCity) return;
    setVideoFailed(false);
    setWikiImage(null);
    
    const name = masterCity.city || masterCity.display_name || "";
    if (!name) return;

    const fetchWiki = async () => {
      try {
        const ptRes = await fetch(\`https://pt.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(name)}\`);
        if (ptRes.ok) {
          const data = await ptRes.json();
          if (data.type !== "disambiguation" && (data.originalimage?.source || data.thumbnail?.source)) {
            setWikiImage(data.originalimage?.source || data.thumbnail?.source);
            return;
          }
        }
        const enRes = await fetch(\`https://en.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(name)}\`);
        if (enRes.ok) {
          const data = await enRes.json();
          setWikiImage(data.originalimage?.source || data.thumbnail?.source || null);
        }
      } catch (e) {
        console.error("Wiki fetch error", e);
      }
    };
    fetchWiki();
  }, [masterCity]);

  if (!masterCity) {
    return (
      <div className="w-full mt-12 p-8 text-center border border-white/10 rounded-2xl">
        <p className="text-white/60 text-sm font-ps-ui">Nenhuma cidade calculada para esta Casa.</p>
      </div>
    );
  }

  const cityName = masterCity.city || masterCity.display_name || "Desconhecido";
  const safeCityName = typeof cityName === 'string' ? cityName : String(cityName || "desconhecido");
  const videoName = safeCityName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "_");
  const fallbackImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8 pb-12">

      {/* 1. HERO COMPACTO (Clean Glass) */}
      <section className="relative w-full h-[55vh] min-h-[400px] rounded-3xl overflow-hidden mb-12 flex flex-col justify-end group border border-white/5 shadow-2xl">
        {!videoFailed ? (
          <video 
            src={\`/assets/cities/\${videoName}.mp4\`} 
            autoPlay loop muted playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-70" 
          />
        ) : wikiImage ? (
          <img 
            src={wikiImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        ) : (
          <img 
            src={fallbackImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 md:p-12 w-full max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 mb-4 border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
            Sua Rota {house}
          </span>
          <h2 className="font-ps-display text-4xl md:text-6xl text-foreground mb-2 tracking-tight">
            {cityName}
          </h2>
          <div className="flex items-center gap-2 text-foreground/60 mb-4">
            <span className="text-xl">{getCountryFlag(masterCity.country)}</span>
            <span className="text-sm tracking-wider uppercase">{masterCity.country}</span>
          </div>
          
          {houseDataFull.oQueVocePrecisaEntender && (
             <p className="font-ps-ui text-sm md:text-base text-foreground/80 leading-relaxed max-w-2xl font-light">
               "{houseDataFull.oQueVocePrecisaEntender}"
             </p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-0">
        
        {/* 2. RAIO-X (BENTO GRID - LEVE E CLEAN) */}
        <section className="mb-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-foreground/[0.02] border border-foreground/[0.05] rounded-3xl p-8 backdrop-blur-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-ps-display text-xl text-foreground">Favorece</h3>
                 </div>
                 <ul className="space-y-4">
                    {(houseDataFull.podeFavorecer || []).map((item: string, i: number) => (
                       <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary/70 mt-0.5 shrink-0" />
                          <span className="text-sm font-ps-ui text-foreground/70 leading-relaxed">{item}</span>
                       </li>
                    ))}
                    {(!houseDataFull.podeFavorecer || houseDataFull.podeFavorecer.length === 0) && (
                       <p className="text-foreground/40 text-sm">Sem dados específicos.</p>
                    )}
                 </ul>
              </div>

              <div className="bg-foreground/[0.02] border border-foreground/[0.05] rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-between">
                 <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-ps-display text-xl text-foreground">Ideal Para</h3>
                   </div>
                   <p className="text-sm font-ps-ui text-foreground/70 leading-relaxed mb-6 font-light">
                      {houseDataFull.idealPara || houseDataFull.deepDive || "Foco total nesta energia."}
                   </p>
                 </div>
                 
                 {houseDataFull.profissoes && (
                    <div className="pt-6 border-t border-foreground/[0.05]">
                       <span className="text-[10px] uppercase tracking-widest text-foreground/40 block mb-2">Profissões em Alta</span>
                       <p className="text-sm font-ps-ui text-primary/90">{houseDataFull.profissoes}</p>
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 3. O ORÁCULO (ACCORDION - CLEAN) */}
        <section className="mb-12">
           <Accordion type="single" collapsible className="w-full bg-foreground/[0.02] border border-foreground/[0.05] rounded-3xl p-2 backdrop-blur-sm">
              {houseDataFull.dinheiro && (
                <AccordionItem value="dinheiro" className="border-b-0 px-4">
                  <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                     <span className="font-ps-display text-lg tracking-wide">💰 Como fica o Dinheiro?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 font-ps-ui text-base leading-relaxed pb-6 font-light">
                     {houseDataFull.dinheiro}
                  </AccordionContent>
                </AccordionItem>
              )}
              {houseDataFull.amor && (
                <AccordionItem value="amor" className="border-b border-foreground/[0.05] px-4">
                  <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                     <span className="font-ps-display text-lg tracking-wide">❤️ Como vai ser no Amor?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 font-ps-ui text-base leading-relaxed pb-6 font-light">
                     {houseDataFull.amor}
                  </AccordionContent>
                </AccordionItem>
              )}
              {houseDataFull.trabalho && (
                <AccordionItem value="trabalho" className="border-b border-foreground/[0.05] px-4">
                  <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                     <span className="font-ps-display text-lg tracking-wide">💼 E no meu Trabalho?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 font-ps-ui text-base leading-relaxed pb-6 font-light">
                     {houseDataFull.trabalho}
                  </AccordionContent>
                </AccordionItem>
              )}
           </Accordion>
        </section>

        {/* 4. AVISOS E RITUAL (CLEAN) */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Ritual */}
           <div className="bg-primary/[0.03] border border-primary/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                 <Clock className="w-5 h-5 text-primary" />
                 <h3 className="font-ps-display text-xl text-foreground">Ritual das 24h</h3>
              </div>
              <p className="font-ps-ui text-foreground/70 leading-relaxed text-sm mb-6 font-light">
                 {houseDataFull.ritual24h || "Mentalize as mudanças deste ciclo e desconecte-se de distrações no seu aniversário."}
              </p>
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                 <span className="text-[10px] uppercase tracking-widest text-primary block mb-1">Mantra do Ano</span>
                 <p className="font-ps-display text-primary italic">"{houseDataFull.mantra || "Eu crio meu destino."}"</p>
              </div>
           </div>

           {/* Cuidado */}
           <div className="bg-destructive/[0.02] border border-destructive/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldAlert className="w-5 h-5 text-destructive/80" />
                 <h3 className="font-ps-display text-xl text-foreground">Cuidado Com</h3>
              </div>
              <p className="font-ps-ui text-foreground/70 leading-relaxed text-sm font-light">
                 {houseDataFull.cuidadoCom || houseDataFull.ondePisarComCuidado || "Decisões impulsivas e falta de planejamento."}
              </p>
           </div>
        </section>

      </div>
    </motion.div>
  );
};

export default DestinyResults;
\`;

fs.writeFileSync(file, content);
console.log('Success');
