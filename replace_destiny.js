const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';

const content = `import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCountryFlag } from "@/lib/countryFlags";
import { ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, Download, Clock, Target, CheckCircle2, ChevronDown, BookOpen } from "lucide-react";
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
  const [unlockTarget, setUnlockTarget] = useState<number | null>(null);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-12 pb-24">

      {/* 1. HERO - DESTINO PRINCIPAL (VÍDEO/FOTO HÍBRIDO) */}
      <section className="relative w-full h-[70vh] min-h-[500px] rounded-[2rem] overflow-hidden mb-16 flex flex-col justify-end group">
        
        {!videoFailed ? (
          <video 
            src={\`/assets/cities/\${videoName}.mp4\`} 
            autoPlay 
            loop 
            muted 
            playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
        ) : wikiImage ? (
          <img 
            src={wikiImage} 
            alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        ) : (
          <img 
            src={fallbackImage} 
            alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[30s] ease-linear group-hover:scale-110 scale-105 origin-center" 
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 md:p-14 w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 mb-4 border border-[#C9A227]/30 bg-[#C9A227]/10 text-[#C9A227] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
                Destino Mestre
              </span>
              <h2 className="font-ps-display text-5xl md:text-7xl text-white mb-2 tracking-tight">
                {cityName}
              </h2>
              <div className="flex items-center gap-2 text-white/50 mb-6">
                <span className="text-xl">{getCountryFlag(masterCity.country)}</span>
                <span className="text-sm tracking-wider uppercase">{masterCity.country}</span>
              </div>
              
              {/* O QUE VOCÊ PRECISA ENTENDER EM 10s */}
              {houseDataFull.oQueVocePrecisaEntender && (
                 <div className="max-w-2xl border-l-2 border-[#C9A227]/50 pl-4 py-1">
                    <p className="font-ps-ui text-sm md:text-base text-white/80 leading-relaxed italic">
                      "{houseDataFull.oQueVocePrecisaEntender}"
                    </p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-0">

        {/* 2. THE EGREGORE (Opcional - Frase de Impacto) */}
        {egregoraText && (
          <section className="mb-20 text-center">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C9A227]/60 block mb-6">
              A Egrégora do Destino
            </span>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-ps-display italic max-w-3xl mx-auto">
              "{egregoraText}"
            </p>
          </section>
        )}

        {/* 3. RAIO-X (BENTO GRID) */}
        <section className="mb-16">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pode Favorecer */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-5 h-5 text-[#C9A227]" />
                    <h3 className="font-ps-display text-xl text-white">Pode Favorecer</h3>
                 </div>
                 <ul className="space-y-4">
                    {(houseDataFull.podeFavorecer || []).map((item: string, i: number) => (
                       <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A227]/70 mt-0.5 shrink-0" />
                          <span className="text-sm font-ps-ui text-white/70 leading-relaxed">{item}</span>
                       </li>
                    ))}
                    {(!houseDataFull.podeFavorecer || houseDataFull.podeFavorecer.length === 0) && (
                       <p className="text-white/40 text-sm">Nenhum dado específico mapeado.</p>
                    )}
                 </ul>
              </div>

              {/* Ideal Para */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <Target className="w-5 h-5 text-[#C9A227]" />
                    <h3 className="font-ps-display text-xl text-white">Ideal Para</h3>
                 </div>
                 <p className="text-sm font-ps-ui text-white/70 leading-relaxed mb-6">
                    {houseDataFull.idealPara || houseDataFull.deepDive || "Perfis focados nesta área da vida."}
                 </p>
                 
                 {/* Profissoes Extras se existir */}
                 {houseDataFull.profissoes && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                       <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Profissões em Alta</span>
                       <p className="text-sm font-ps-ui text-[#C9A227]/90">{houseDataFull.profissoes}</p>
                    </div>
                 )}
              </div>
           </div>
        </section>

        {/* 4. O ORÁCULO (ACCORDION DE ÁREAS DA VIDA) */}
        <section className="mb-20">
           <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C9A227]/60 block mb-3">
                O Oráculo
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-white">Perguntas & Respostas</h3>
           </div>
           
           <Accordion type="single" collapsible className="w-full space-y-4">
              {houseDataFull.dinheiro && (
                <AccordionItem value="dinheiro" className="border border-white/10 rounded-xl px-6 bg-white/[0.01]">
                  <AccordionTrigger className="text-white hover:no-underline py-6">
                     <span className="font-ps-display text-lg tracking-wide">Como fica o Dinheiro?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 font-ps-ui text-base leading-relaxed pb-6">
                     {houseDataFull.dinheiro}
                  </AccordionContent>
                </AccordionItem>
              )}
              {houseDataFull.amor && (
                <AccordionItem value="amor" className="border border-white/10 rounded-xl px-6 bg-white/[0.01]">
                  <AccordionTrigger className="text-white hover:no-underline py-6">
                     <span className="font-ps-display text-lg tracking-wide">Como vai ser no Amor?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 font-ps-ui text-base leading-relaxed pb-6">
                     {houseDataFull.amor}
                  </AccordionContent>
                </AccordionItem>
              )}
              {houseDataFull.trabalho && (
                <AccordionItem value="trabalho" className="border border-white/10 rounded-xl px-6 bg-white/[0.01]">
                  <AccordionTrigger className="text-white hover:no-underline py-6">
                     <span className="font-ps-display text-lg tracking-wide">E no meu Trabalho?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 font-ps-ui text-base leading-relaxed pb-6">
                     {houseDataFull.trabalho}
                  </AccordionContent>
                </AccordionItem>
              )}
              {houseDataFull.vidaPessoal && (
                <AccordionItem value="pessoal" className="border border-white/10 rounded-xl px-6 bg-white/[0.01]">
                  <AccordionTrigger className="text-white hover:no-underline py-6">
                     <span className="font-ps-display text-lg tracking-wide">A minha Vida Pessoal vai mudar muito?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 font-ps-ui text-base leading-relaxed pb-6">
                     {houseDataFull.vidaPessoal}
                  </AccordionContent>
                </AccordionItem>
              )}
           </Accordion>
        </section>

        {/* 5. O MAPA DO TEMPO (LINHA DO TEMPO) */}
        {(houseDataFull.fase1 || houseDataFull.fase2 || houseDataFull.fase3) && (
          <section className="mb-20">
             <div className="flex items-center gap-4 mb-10">
               <h3 className="font-ps-display text-2xl md:text-3xl text-white">As 3 Fases do Seu Ano</h3>
               <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
             </div>
             
             <div className="relative border-l border-white/10 ml-4 space-y-12 pb-4">
                {houseDataFull.fase1 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-[#C9A227] rounded-full -left-[1.5px] top-1.5 shadow-[0_0_10px_rgba(201,162,39,0.5)]" />
                      <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold block mb-1">Fase 1 (Meses 1 a 3)</span>
                      <p className="text-white/70 font-ps-ui text-sm leading-relaxed">{houseDataFull.fase1.replace(/^Mês 1-3.*?:\s*/, '')}</p>
                   </div>
                )}
                {houseDataFull.fase2 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[1.5px] top-1.5 border border-white/40" />
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Fase 2 (Meses 4 a 8)</span>
                      <p className="text-white/70 font-ps-ui text-sm leading-relaxed">{houseDataFull.fase2.replace(/^Mês 4-8.*?:\s*/, '')}</p>
                   </div>
                )}
                {houseDataFull.fase3 && (
                   <div className="relative pl-8">
                      <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[1.5px] top-1.5 border border-white/40" />
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Fase 3 (Meses 9 a 12)</span>
                      <p className="text-white/70 font-ps-ui text-sm leading-relaxed">{houseDataFull.fase3.replace(/^Mês 9-12.*?:\s*/, '')}</p>
                   </div>
                )}
             </div>
          </section>
        )}

        {/* 6. GUIA TÁTICO (MANTRA, RITUAL, CUIDADOS) */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-gradient-to-br from-[#1A1500] to-[#0A0800] border border-[#C9A227]/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Clock className="w-24 h-24 text-[#C9A227]" />
              </div>
              <h4 className="font-sans text-[10px] uppercase tracking-widest text-[#C9A227] mb-2">O Ritual de Imersão</h4>
              <h3 className="font-ps-display text-2xl text-white mb-4">Primeiras 24 Horas</h3>
              <p className="font-ps-ui text-white/80 leading-relaxed mb-8">
                 {houseDataFull.ritual24h || "Reserve um tempo no seu aniversário para mentalizar as mudanças deste ciclo e desconectar de distrações. Escreva as suas 3 maiores metas e visualize o novo ambiente moldando sua energia."}
              </p>
              
              <div className="border-t border-[#C9A227]/20 pt-6">
                 <span className="text-[10px] uppercase tracking-widest text-[#C9A227]/70 block mb-2">Mantra do Ano</span>
                 <p className="font-ps-display text-xl text-[#C9A227] italic">
                    "{houseDataFull.mantra || "Eu assumo o controle da minha realidade."}"
                 </p>
              </div>
           </div>

           <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldAlert className="w-5 h-5 text-red-500/80" />
                 <h3 className="font-ps-display text-xl text-white">Cuidado Com</h3>
              </div>
              <p className="font-ps-ui text-white/70 leading-relaxed text-sm">
                 {houseDataFull.cuidadoCom || houseDataFull.ondePisarComCuidado || "Decisões impulsivas e falta de planejamento na transição de ciclo."}
              </p>
           </div>
        </section>

        {/* 7. A MASTERCLASS E DOWNLOADS (O Arsenal de Revolução) */}
        <section className="mb-24">
           <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C9A227]/60 block mb-3">
                Aprofundamento VIP
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-white">O Arsenal de Revolução</h3>
              <p className="text-white/50 text-sm mt-3 max-w-2xl mx-auto">
                 Material exclusivo para você extrair o máximo de energia desta Casa Astrológica.
              </p>
           </div>

           <div className="bg-[#030306] border border-white/10 rounded-3xl p-2 md:p-4 mb-6 shadow-2xl">
              {/* VIDEO PLAYER MOCK */}
              <div className="w-full aspect-video bg-black rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer flex items-center justify-center">
                 {houseDataFull.videoUrl ? (
                    <iframe src={houseDataFull.videoUrl} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                 ) : (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                       <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                             <PlayCircle className="w-8 h-8 text-white ml-1" />
                          </div>
                          <span className="text-white/50 text-xs font-ps-ui uppercase tracking-widest">Masterclass em Breve</span>
                       </div>
                    </>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                       <BookOpen className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <div className="text-left">
                       <h4 className="text-white font-ps-display tracking-wide">Guia Prático da Casa</h4>
                       <span className="text-[10px] text-white/40 uppercase tracking-widest">PDF • 2MB</span>
                    </div>
                 </div>
                 <Download className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </button>

              <button className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                       <BookOpen className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <div className="text-left">
                       <h4 className="text-white font-ps-display tracking-wide">Planner do Novo Ciclo</h4>
                       <span className="text-[10px] text-white/40 uppercase tracking-widest">PDF • 5MB</span>
                    </div>
                 </div>
                 <Download className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </button>
           </div>
        </section>

        {/* 8. DESTINOS SECUNDÁRIOS */}
        {secondaryCities.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="font-ps-display text-2xl md:text-3xl text-white">Destinos Secundários</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <p className="text-white/60 font-ps-ui text-sm mb-8">
              Além do Destino Mestre, estas cidades também ativam a frequência da Casa {house}.
            </p>

            <div className="grid gap-8">
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]/80 mb-4 pl-1 border-l-2 border-[#C9A227]/30">
                    {continent}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {citiesList.map((c, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-30">
                           <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getCountryFlag(c.country)}</span>
                          <span className="text-[9px] text-white/50 uppercase tracking-wider truncate">{c.country}</span>
                        </div>
                        <p className="text-white font-semibold text-sm truncate">{c.city || c.display_name}</p>
                        {c.lat != null && c.lon != null && (
                          <p className="text-white/30 text-[9px] font-mono mt-1">
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

        {/* 9. EXPLORAR OUTRAS CASAS */}
        {!embedded && (
          <section className="border-t border-white/10 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40 block mb-3">
                Visão Completa
              </span>
              <h3 className="font-ps-display text-2xl text-white">As 12 Coordenadas do Ano</h3>
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
                        if (onUnlock) onUnlock(houseItem.id); else setUnlockTarget(houseItem.id);
                      } else if (onSelectHouse && !isCurrentHouse) {
                        onSelectHouse(houseItem.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={\`relative flex items-center p-3 rounded-lg border transition-all \${!isCurrentHouse ? "cursor-pointer" : ""} \${
                      isCurrentHouse
                        ? "bg-[#C9A227]/10 border-[#C9A227]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/[0.03]"
                    }\`}
                  >
                    <div className="flex flex-col flex-1 truncate">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={\`text-[10px] font-mono font-bold \${isCurrentHouse ? "text-[#C9A227]" : "text-white/50"}\`}>
                          CASA {String(houseItem.id).padStart(2, "0")}
                        </span>
                      </div>
                      <span className={\`text-xs font-semibold truncate \${isCurrentHouse ? "text-white" : (isUnlocked ? "text-white/90" : "text-white/60")}\`}>
                        {houseItem.label}
                      </span>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCurrentHouse ? (
                        <Eye className="w-4 h-4 text-[#C9A227]" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4 text-white/30" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Modal de Desbloqueio */}
        {unlockTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setUnlockTarget(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                ✕
              </button>

              {(() => {
                const targetHouseData = cityDatabase[unlockTarget];
                return (
                  <>
                    <div className="text-center mb-6">
                      <Lock className="w-8 h-8 text-white/40 mx-auto mb-4" />
                      <h3 className="font-ps-display text-xl text-white mb-2">
                        Casa {unlockTarget} — {targetHouseData?.label}
                      </h3>
                      <p className="text-white/50 text-xs font-ps-ui leading-relaxed max-w-xs mx-auto">
                        Descubra como este destino influencia {targetHouseData?.intent?.toLowerCase()} no seu próximo ciclo.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/5 text-center">
                         <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold">Aviso</span>
                         <p className="text-white/70 text-sm mt-2">
                           O módulo de desbloqueio comercial e Mercado Pago será conectado na próxima fase do projeto.
                         </p>
                      </div>
                      <button
                        onClick={() => setUnlockTarget(null)}
                        className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-sm uppercase tracking-widest text-white/80"
                      >
                        Voltar
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinyResults;
\`;

fs.writeFileSync(file, content);
console.log('Success');
`
node replace_destiny.js
