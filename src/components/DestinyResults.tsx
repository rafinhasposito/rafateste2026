import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountryFlag } from "@/lib/countryFlags";
import { ArrowRight } from "lucide-react";
import { Compass, MapPin, Zap, ShieldAlert, Star, Lock, Eye, Crown } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO } from "@/data/atlas";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";
import { mockDestinyNewYork } from "@/data/destiny";

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
  mode?: "passado" | "presente" | "futuro";
  embedded?: boolean;
  isHouseUnlocked?: (houseNum: number) => boolean;
  onSelectHouse?: (houseNum: number) => void;
  unlockedCount?: number;
}

export const DestinyResults: React.FC<DestinyResultsProps> = ({
  house, cities, autoUnlocked = false, mode = "futuro",
  consultationId, userCredits, isAuthenticated, embedded = false,
  isHouseUnlocked, onSelectHouse, onUnlock, unlockedCount = 1
}) => {
  // Always show content — access gating is handled by Dashboard's isHouseLocked
  const [unlocked] = useState(true);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [unlockTarget, setUnlockTarget] = useState<number | null>(null);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupCitiesByContinent(secondaryCities);
  const masterCity = allCities[0];
  const egregoraText = mode === "passado" ? fallbackOraclesPast[house] : fallbackOraclesFuture[house];


  if (!masterCity) {
    return (
      <div className="w-full mt-12 p-8 text-center border border-white/10 rounded-2xl">
        <p className="text-white/60 text-sm font-inter">Nenhuma cidade calculada para esta Casa.</p>
      </div>
    );
  }

  const cityName = masterCity.city || masterCity.display_name || "Desconhecido";
  const cityContext = cityName.includes("New York") ? mockDestinyNewYork : null;
  const bgImage = cityContext?.context?.imageUrl || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-12 pb-24">
      
      {/* 1. HERO - DESTINO PRINCIPAL */}
      <section className="relative w-full h-[70vh] min-h-[500px] rounded-[2rem] overflow-hidden mb-16 flex flex-col justify-end">
        <img src={bgImage} alt={cityName} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/60 to-transparent" />
        
        <div className="relative z-10 p-8 md:p-14 w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                  A Coordenada de Ativação
                </span>
                <div className="h-px w-12 bg-[#D4AF37]/50" />
              </div>
              <h2 className="font-cinzel text-5xl md:text-7xl font-bold text-white mb-2 leading-none">
                {cityName}
              </h2>
              <div className="flex items-center gap-4 text-white/50 font-mono text-xs tracking-widest uppercase mt-4">
                <span>{masterCity.country}</span>
                <span>·</span>
                <span>{masterCity.lat ? masterCity.lat.toFixed(4) : "40.7128"}°, {masterCity.lon ? masterCity.lon.toFixed(4) : "-74.0060"}°</span>
                <span>·</span>
                <span className="text-[#D4AF37]">{masterCity.score || 98}% MATCH</span>
              </div>
            </div>

            {/* Target House Badge inside Hero */}
            <div className="border border-white/10 bg-black/40 backdrop-blur-md p-6 rounded-2xl md:w-80 shrink-0">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                 Casa {house} em Destaque
               </span>
               <h3 className="font-cinzel text-2xl text-white mb-2">{atlasData.title}</h3>
               <p className="font-inter text-xs text-white/60">"{houseDataFull.translation}"</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-0">
        
        {/* 2. THE EGREGORE (AI Insight) */}
        {egregoraText && (
          <section className="mb-20 text-center">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#D4AF37]/60 block mb-6">
              A Egrégora do Destino
            </span>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-cinzel italic max-w-3xl mx-auto">
              "{egregoraText}"
            </p>
          </section>
        )}

        {/* 3. DOSSIÊ (Editorial Layout) */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="font-cinzel text-3xl md:text-4xl text-white">Dossiê Estratégico</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="space-y-16">
            
            {/* O Segredo */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-4">O Segredo deste Ano</span>
              <p className="font-inter text-xl md:text-2xl font-light text-white leading-relaxed">
                {houseDataFull.oSegredo}
              </p>
            </div>

            {/* Áreas da vida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {Object.entries(houseDataFull.areasDaVida || {}).map(([key, text]) => (
                <div key={key}>
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3">{key}</h4>
                  <p className="font-inter text-sm text-white/60 leading-relaxed">{text as string}</p>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Como Aproveitar & Cuidados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                   <Zap className="w-4 h-4 text-[#D4AF37]" />
                   <h4 className="font-sans text-[10px] uppercase tracking-widest text-white">Como Aproveitar</h4>
                 </div>
                 <p className="font-inter text-sm text-white/60 leading-relaxed">{houseDataFull.comoAproveitar}</p>
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-4">
                   <ShieldAlert className="w-4 h-4 text-destructive" />
                   <h4 className="font-sans text-[10px] uppercase tracking-widest text-white">Onde Pisar com Cuidado</h4>
                 </div>
                 <p className="font-inter text-sm text-white/60 leading-relaxed">{houseDataFull.ondePisarComCuidado}</p>
              </div>
            </div>

          </div>
        </section>

        

        {/* 3.5 DESTINOS SECUNDÁRIOS */}
        {secondaryCities.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="font-cinzel text-2xl md:text-3xl text-white">Destinos Secundários</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <p className="text-white/60 font-inter text-sm mb-8">
              Além do Destino Mestre, estas cidades também ativam a frequência da Casa {house}.
            </p>
            
            <div className="grid gap-8">
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/80 mb-4 pl-1 border-l-2 border-[#D4AF37]/30">
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

        {/* 4. EXPLORAR OUTRAS CASAS */}
        {!embedded && (
          <section className="border-t border-white/10 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40 block mb-3">
                Visão Completa
              </span>
              <h3 className="font-cinzel text-2xl text-white">As 12 Coordenadas do Ano</h3>
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
                    className={`relative flex items-center p-3 rounded-lg border transition-all ${!isCurrentHouse ? "cursor-pointer" : ""} ${
                      isCurrentHouse 
                        ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                        : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col flex-1 truncate">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-mono font-bold ${isCurrentHouse ? "text-[#D4AF37]" : "text-white/50"}`}>
                          CASA {String(houseItem.id).padStart(2, "0")}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold truncate ${isCurrentHouse ? "text-white" : (isUnlocked ? "text-white/90" : "text-white/60")}`}>
                        {houseItem.label}
                      </span>
                    </div>
                    
                    <div className="shrink-0 ml-2">
                      {isCurrentHouse ? (
                        <Eye className="w-4 h-4 text-[#D4AF37]" />
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
            
            <div className="text-center mt-8">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2">
                {unlockedCount} DE 12 CASAS REVELADAS
              </span>
              <p className="text-white/40 text-xs font-inter">
                Clique em qualquer Casa para explorar aquela área do seu próximo ano.
              </p>
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
                      <h3 className="font-cinzel text-xl text-white mb-2">
                        Casa {unlockTarget} — {targetHouseData?.label}
                      </h3>
                      <p className="text-white/50 text-xs font-inter leading-relaxed max-w-xs mx-auto">
                        Descubra como este destino influencia {targetHouseData?.intent?.toLowerCase()} no seu próximo ciclo.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center">
                         <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Aviso</span>
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
