import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin, Zap, ShieldAlert, Star, Lock, Eye, Crown } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO } from "@/data/atlas";
import { cityDatabase } from "@/data/houses";
import { mockDestinyNewYork } from "@/data/destiny";
import { generateDestinyInsight } from "@/lib/ai/concierge";

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
}

export const DestinyResults: React.FC<DestinyResultsProps> = ({
  house, cities, autoUnlocked = false, mode = "futuro",
  consultationId, userCredits, isAuthenticated, embedded = false,
  isHouseUnlocked, onSelectHouse
}) => {
  // Always show content — access gating is handled by Dashboard's isHouseLocked
  const [unlocked] = useState(true);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const masterCity = allCities[0];

  useEffect(() => {
    if (unlocked && masterCity) {
      const fetchInsight = async () => {
        setLoadingInsight(true);
        try {
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
        {aiInsight && (
          <section className="mb-20 text-center">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#D4AF37]/60 block mb-6">
              A Egrégora do Destino
            </span>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-cinzel italic max-w-3xl mx-auto">
              "{aiInsight}"
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

        {/* 4. EXPLORAR OUTRAS CASAS */}
        {!embedded && (
          <section className="border-t border-white/10 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40 block mb-3">
                Visão Completa
              </span>
              <h3 className="font-cinzel text-2xl text-white">As 12 Coordenadas do Ano</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.values(cityDatabase).map((houseItem) => {
                const isCurrentHouse = houseItem.id === house;
                const isUnlocked = isHouseUnlocked ? isHouseUnlocked(houseItem.id) : (isCurrentHouse || autoUnlocked);
                
                return (
                  <div
                    key={houseItem.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        setShowUnlockModal(true);
                      } else if (onSelectHouse && !isCurrentHouse) {
                        onSelectHouse(houseItem.id);
                        // Scroll to top of results for better UX
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`relative p-5 rounded-xl transition-all ${!isCurrentHouse ? "cursor-pointer hover:border-white/20" : ""} ${!isUnlocked ? "opacity-60 hover:opacity-100" : ""} ${
                      isCurrentHouse 
                        ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30" 
                        : "bg-white/[0.02] border border-white/5"
                    }`}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-[2px] z-10 transition-all hover:bg-black/40">
                        <div className="text-center">
                          <Lock className="w-5 h-5 mx-auto mb-2 text-white/50" />
                          <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Bloqueada</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-mono tracking-widest ${isCurrentHouse ? "text-[#D4AF37]" : "text-white/40"}`}>
                        {String(houseItem.id).padStart(2, "0")}
                      </span>
                      {isCurrentHouse && <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />}
                    </div>
                    <h4 className={`font-cinzel text-sm mb-1 ${isCurrentHouse ? "text-white" : "text-white/70"}`}>
                      {houseItem.label}
                    </h4>
                    <p className="text-[10px] text-white/30 font-sans truncate">{houseItem.intent}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Modal de Desbloqueio */}
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full relative"
            >
              <button 
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <Crown className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="font-cinzel text-xl text-white mb-2">Desbloquear Mapa Completo</h3>
                <p className="text-white/50 text-xs font-inter leading-relaxed">
                  Esta casa faz parte da sua mandala estelar estendida. 
                  Você tem {userCredits ?? 0} créditos disponíveis.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { houses: 1, credits: 1, label: "+1 Casa", desc: "Revele a próxima casa do mapa" },
                  { houses: 3, credits: 3, label: "+3 Casas", desc: "Expanda sua visão do ano" },
                  { houses: 12, credits: 11, label: "Todas as Casas", desc: "Desbloqueio total do dossiê" }
                ].map(pkg => (
                  <button
                    key={pkg.houses}
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/auth");
                        return;
                      }
                      if ((userCredits ?? 0) < pkg.credits) {
                        showAlert(`Você precisa de ${pkg.credits} créditos. Redirecionando...`);
                        navigate("/credits");
                        return;
                      }
                      if (consultationId) {
                        navigate(`/dashboard?id=${consultationId}&unlock=${pkg.houses}`);
                      } else {
                        showAlert("Erro: Dossiê não encontrado.");
                      }
                    }}
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D4AF37]/30 transition-all flex items-center justify-between group text-left"
                  >
                    <div>
                      <div className="font-cinzel text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                        {pkg.label}
                      </div>
                      <div className="text-[10px] text-white/40 font-sans mt-1">
                        {pkg.desc}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                      {pkg.credits} CR
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default DestinyResults;
