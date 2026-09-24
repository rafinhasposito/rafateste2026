const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';

const content = `import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountryFlag } from "@/lib/countryFlags";
import { ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, Download, Clock, Target, CheckCircle2, BookOpen } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO } from "@/data/atlas";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function groupCitiesByContinent(cities: any[]) {
  const groups: Record<string, any[]> = {};
  for (const c of cities) {
    const continent = c.continent || c.country || "Outros";
    if (!groups[continent]) groups[continent] = [];
    groups[continent].push(c);
  }
  return groups;
}

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
  const [unlocked] = useState(true);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [videoFailed, setVideoFailed] = useState(false);
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupCitiesByContinent(secondaryCities);
  const masterCity = allCities[0];
  const egregoraText = mode === "passado" ? fallbackOraclesPast[house] : fallbackOraclesFuture[house];

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
      <div className="w-full mt-12 p-8 text-center border border-primary/10 bg-primary/5 rounded-2xl backdrop-blur-sm">
        <p className="text-foreground/60 text-sm font-ps-ui">Nenhuma cidade calculada para esta Casa.</p>
      </div>
    );
  }

  const cityName = masterCity.city || masterCity.display_name || "Desconhecido";
  const safeCityName = typeof cityName === 'string' ? cityName : String(cityName || "desconhecido");
  const videoName = safeCityName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "_");
  const fallbackImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8 pb-16">

      {/* 1. HERO - HÍBRIDO VÍDEO/FOTO - VISUAL PREMIUM (LIGHTER/GLASS) */}
      <section className="relative w-full h-[60vh] min-h-[450px] rounded-3xl overflow-hidden mb-12 flex flex-col justify-end group border border-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.05)]">
        
        {!videoFailed ? (
          <video 
            src={\`/assets/cities/\${videoName}.mp4\`} 
            autoPlay loop muted playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
          />
        ) : wikiImage ? (
          <img 
            src={wikiImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        ) : (
          <img 
            src={fallbackImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 md:p-12 w-full max-w-5xl mx-auto flex flex-col justify-end h-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 mb-4 border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md shadow-lg shadow-primary/5">
                Destino Mestre
              </span>
              <h2 className="font-ps-display text-5xl md:text-7xl text-foreground mb-3 tracking-tight drop-shadow-md">
                {cityName}
              </h2>
              <div className="flex items-center gap-3 text-foreground/80 mb-6 font-mono text-xs tracking-widest uppercase">
                <span className="text-2xl -mt-1 drop-shadow-md">{getCountryFlag(masterCity.country)}</span>
                <span className="font-semibold text-foreground/90">{masterCity.country}</span>
                <span className="text-primary/50">•</span>
                <span className="text-primary font-bold">{masterCity.score || 98}% MATCH</span>
              </div>
              
              {/* O QUE VOCÊ PRECISA ENTENDER EM 10s */}
              <div className="max-w-2xl border-l-2 border-primary/50 pl-5 py-2 bg-gradient-to-r from-primary/5 to-transparent rounded-r-xl">
                 <p className="font-ps-ui text-sm md:text-base text-foreground/90 leading-relaxed italic font-light">
                   "{houseDataFull.oQueVocePrecisaEntender || houseDataFull.oSegredo || "Aguardando download dos dados astrológicos avançados."}"
                 </p>
              </div>
            </div>

            {/* Target House Badge inside Hero */}
            <div className="border border-primary/20 bg-background/60 backdrop-blur-xl p-6 rounded-2xl md:w-80 shrink-0 shadow-xl">
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">
                 Casa {house} em Destaque
               </span>
               <h3 className="font-ps-display text-2xl text-foreground mb-2">{atlasData.title}</h3>
               <p className="font-ps-ui text-xs text-muted-foreground leading-relaxed">"{houseDataFull.translation}"</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-0">

        {/* 2. RAIO-X (BENTO GRID - LEVE E CLEAN) */}
        <section className="mb-12">
           <div className="flex items-center gap-4 mb-8">
             <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Análise de Potencial</h3>
             <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm transition-all hover:bg-primary/10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-ps-display text-xl text-foreground">Pode Favorecer</h3>
                 </div>
                 <ul className="space-y-4">
                    {(houseDataFull.podeFavorecer || []).map((item: string, i: number) => (
                       <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary/80 mt-0.5 shrink-0" />
                          <span className="text-sm font-ps-ui text-foreground/80 leading-relaxed font-light">{item}</span>
                       </li>
                    ))}
                    {(!houseDataFull.podeFavorecer || houseDataFull.podeFavorecer.length === 0) && (
                       <p className="text-muted-foreground text-sm font-light">Os dados de favorecimento estão sendo processados.</p>
                    )}
                 </ul>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm transition-all hover:bg-primary/10 flex flex-col justify-between">
                 <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-ps-display text-xl text-foreground">Ideal Para</h3>
                   </div>
                   <p className="text-sm font-ps-ui text-foreground/80 leading-relaxed mb-6 font-light">
                      {houseDataFull.idealPara || houseDataFull.deepDive || houseDataFull.comoAproveitar || "Perfis com foco em transformação nesta área."}
                   </p>
                 </div>
                 
                 {houseDataFull.profissoes && (
                    <div className="pt-6 border-t border-primary/10 mt-auto">
                       <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 font-semibold">Profissões em Alta</span>
                       <p className="text-sm font-ps-ui text-primary font-medium">{houseDataFull.profissoes}</p>
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 3. O ORÁCULO (ACCORDION DE ÁREAS DA VIDA - GLASS) */}
        <section className="mb-16">
           <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/70 block mb-2">
                Previsões Detalhadas
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-foreground">O Oráculo da Casa {house}</h3>
           </div>
           
           <Accordion type="single" collapsible className="w-full bg-background/40 border border-primary/10 rounded-3xl p-2 backdrop-blur-md shadow-xl">
              {/* Fallback to old 'areasDaVida' if new fields aren't populated yet */}
              {houseDataFull.dinheiro || houseDataFull.areasDaVida ? (
                <>
                  <AccordionItem value="dinheiro" className="border-b border-primary/10 px-4">
                    <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                       <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                         <span className="text-xl">💰</span> Como fica o Dinheiro?
                       </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                       {houseDataFull.dinheiro || houseDataFull.areasDaVida?.['Dinheiro'] || "As energias financeiras estão sendo lidas."}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="amor" className="border-b border-primary/10 px-4">
                    <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                       <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                         <span className="text-xl">❤️</span> Como vai ser no Amor?
                       </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                       {houseDataFull.amor || houseDataFull.areasDaVida?.['Amor'] || "As frequências afetivas estão sendo lidas."}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="trabalho" className="border-b-0 px-4">
                    <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                       <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                         <span className="text-xl">💼</span> E no meu Trabalho?
                       </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                       {houseDataFull.trabalho || houseDataFull.areasDaVida?.['Carreira'] || "O caminho profissional está sendo desenhado."}
                    </AccordionContent>
                  </AccordionItem>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground font-light text-sm">
                  O Oráculo está preparando a leitura detalhada para esta casa.
                </div>
              )}
           </Accordion>
        </section>

        {/* 4. O MAPA DO TEMPO (LINHA DO TEMPO) - SÓ EXIBE SE HOUVER DADOS */}
        {(houseDataFull.fase1 || houseDataFull.fase2 || houseDataFull.fase3) && (
          <section className="mb-16">
             <div className="flex items-center gap-4 mb-10">
               <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">As 3 Fases do Seu Ano</h3>
               <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
             </div>
             
             <div className="relative border-l border-primary/20 ml-4 space-y-12 pb-4">
                {houseDataFull.fase1 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 shadow-[0_0_15px_hsl(var(--primary)/0.6)]" />
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">Fase 1 (Meses 1 a 3)</span>
                      <p className="text-foreground/80 font-ps-ui text-sm leading-relaxed font-light">{houseDataFull.fase1.replace(/^Mês 1-3.*?:\s*/, '')}</p>
                   </div>
                )}
                {houseDataFull.fase2 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-background border-2 border-primary/50 rounded-full -left-[6.5px] top-1.5" />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">Fase 2 (Meses 4 a 8)</span>
                      <p className="text-foreground/80 font-ps-ui text-sm leading-relaxed font-light">{houseDataFull.fase2.replace(/^Mês 4-8.*?:\s*/, '')}</p>
                   </div>
                )}
                {houseDataFull.fase3 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-background border-2 border-primary/50 rounded-full -left-[6.5px] top-1.5" />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-1">Fase 3 (Meses 9 a 12)</span>
                      <p className="text-foreground/80 font-ps-ui text-sm leading-relaxed font-light">{houseDataFull.fase3.replace(/^Mês 9-12.*?:\s*/, '')}</p>
                   </div>
                )}
             </div>
          </section>
        )}

        {/* 5. GUIA TÁTICO (RITUAL & CUIDADOS) */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Clock className="w-40 h-40 text-primary" />
              </div>
              <h4 className="font-sans text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">O Ritual de Imersão</h4>
              <h3 className="font-ps-display text-2xl text-foreground mb-4 drop-shadow-md">Primeiras 24 Horas</h3>
              <p className="font-ps-ui text-foreground/80 leading-relaxed mb-8 font-light relative z-10">
                 {houseDataFull.ritual24h || houseDataFull.comoAproveitar || "Reserve um tempo no seu aniversário para mentalizar as mudanças deste ciclo e desconectar de distrações. Escreva as suas 3 maiores metas."}
              </p>
              
              <div className="border-t border-primary/20 pt-6 relative z-10">
                 <span className="text-[10px] uppercase tracking-widest text-primary/70 block mb-2 font-bold">Mantra do Ano</span>
                 <p className="font-ps-display text-xl text-primary italic drop-shadow-md">
                    "{houseDataFull.mantra || "Eu assumo o controle do meu novo ciclo."}"
                 </p>
              </div>
           </div>

           <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 backdrop-blur-sm transition-all hover:bg-destructive/10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                   <ShieldAlert className="w-4 h-4 text-destructive" />
                 </div>
                 <h3 className="font-ps-display text-xl text-foreground">Atenção Com</h3>
              </div>
              <p className="font-ps-ui text-foreground/80 leading-relaxed text-sm font-light">
                 {houseDataFull.cuidadoCom || houseDataFull.ondePisarComCuidado || "Mantenha o equilíbrio e evite decisões impulsivas nos momentos de transição de energia."}
              </p>
           </div>
        </section>

        {/* 6. MASTERCLASS VIP (INJETADA COM SEGURANÇA E BELEZA) */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Masterclass VIP</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="bg-background/50 border border-primary/10 rounded-3xl p-4 md:p-8 shadow-2xl backdrop-blur-xl">
            {/* VIDEO MOCK */}
            <div className="w-full aspect-video bg-black/60 rounded-2xl border border-primary/5 relative overflow-hidden group cursor-pointer flex items-center justify-center mb-6 shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="flex flex-col items-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center mb-4 border border-primary/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                     <PlayCircle className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <span className="text-foreground/70 text-xs font-ps-ui uppercase tracking-widest font-semibold">Desbloquear Masterclass</span>
               </div>
            </div>

            {/* DOWNLOADS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button className="flex items-center justify-between p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="text-left">
                     <h4 className="text-foreground font-ps-display tracking-wide mb-1">Guia de Revolução</h4>
                     <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
               </button>

               <button className="flex items-center justify-between p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="text-left">
                     <h4 className="text-foreground font-ps-display tracking-wide mb-1">Ritual das 24 Horas</h4>
                     <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
               </button>
            </div>
          </div>
        </section>

        {/* 7. DESTINOS SECUNDÁRIOS - MANTIDO 100% INTACTO DA SUA VERSÃO */}
        {secondaryCities.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Destinos Secundários</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
            </div>
            <p className="text-muted-foreground font-ps-ui text-sm mb-8 font-light">
              Além do Destino Mestre, estas cidades também ativam a frequência da Casa {house}.
            </p>

            <div className="grid gap-8">
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 pl-1 border-l-2 border-primary/50">
                    {continent}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {citiesList.map((c, i) => (
                      <div key={i} className="bg-background/40 border border-primary/10 rounded-xl p-4 hover:border-primary/30 transition-all relative overflow-hidden backdrop-blur-sm group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                           <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 mb-1 relative z-10">
                          <span className="text-xl drop-shadow-md">{getCountryFlag(c.country)}</span>
                          <span className="text-[9px] text-foreground/50 uppercase tracking-wider truncate font-semibold">{c.country}</span>
                        </div>
                        <p className="text-foreground font-semibold text-sm truncate relative z-10 drop-shadow-sm">{c.city || c.display_name}</p>
                        {c.lat != null && c.lon != null && (
                          <p className="text-primary/60 text-[9px] font-mono mt-1 relative z-10">
                            {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}°
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. VISÃO COMPLETA (GRADE DE 12 CASAS) - MANTIDO INTACTO */}
        {!embedded && (
          <section className="border-t border-primary/10 pt-12 mt-12 mb-8">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50 block mb-3">
                Visão Completa
              </span>
              <h3 className="font-ps-display text-2xl text-foreground">As 12 Coordenadas do Ano</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {Object.values(cityDatabase).map((houseItem) => {
                const isCurrentHouse = houseItem.id === house;
                const isUnlocked = isHouseUnlocked ? isHouseUnlocked(houseItem.id) : (isCurrentHouse || autoUnlocked);

                return (
                  <div
                    key={houseItem.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        if (onUnlock) onUnlock(houseItem.id);
                      } else if (onSelectHouse && !isCurrentHouse) {
                        onSelectHouse(houseItem.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={\`relative flex items-center p-3 rounded-xl border transition-all \${!isCurrentHouse ? "cursor-pointer" : ""} \${
                      isCurrentHouse
                        ? "bg-primary/15 border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                        : "bg-background/40 border-primary/10 hover:border-primary/30 hover:bg-primary/5 backdrop-blur-sm"
                    }\`}
                  >
                    <div className="flex flex-col flex-1 truncate">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={\`text-[10px] font-mono font-bold \${isCurrentHouse ? "text-primary drop-shadow-sm" : "text-muted-foreground"}\`}>
                          CASA {String(houseItem.id).padStart(2, "0")}
                        </span>
                      </div>
                      <span className={\`text-xs font-semibold truncate \${isCurrentHouse ? "text-foreground" : (isUnlocked ? "text-foreground/90" : "text-muted-foreground")}\`}>
                        {houseItem.label}
                      </span>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCurrentHouse ? (
                        <Eye className="w-4 h-4 text-primary" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4 text-muted-foreground/50" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default DestinyResults;
\`;

fs.writeFileSync(file, content);
console.log("DestinyResults rebuilt perfectly.");
