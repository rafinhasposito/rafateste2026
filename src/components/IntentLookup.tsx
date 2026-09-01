import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { matchIntentToHouse } from "@/lib/intentMap";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import DestinyResults from "@/components/DestinyResults";
import { PremiumButton } from "@/components/shell";

interface IntentLookupProps {
  mode: string;
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseFound?: (house: number) => void;
  onLoadingChange?: (loading: boolean) => void;
}

interface CityOption {
  display_name: string;
  city: string;
  country: string;
  lat?: number;
  lon?: number;
  tags?: string[];
  score?: number;
  continent?: string;
}

interface IntentResult {
  house: number;
  houseName: string;
  houseData: typeof cityDatabase[1];
  cities: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
  allResults?: Record<string, any>;
  consultationId?: string;
}

const IntentLookup = ({ mode, name, birthdate, birthtime, birthPlace, year, onHouseFound, onLoadingChange }: IntentLookupProps) => {
  const { showAlert } = useAlert();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);

  const setLoadingState = (state: boolean) => {
    setLoading(state);
    onLoadingChange?.(state);
  };

  const handleSelectIntent = async (houseId: number) => {
    if (!name || !birthdate || !birthtime || !birthPlace) { showAlert("Preencha seus dados natais acima antes de continuar."); return; }
    if (birthtime === "00:00" || birthtime === "00:00:00") {
      showAlert("A hora de nascimento '00:00' não é processável. Por favor, informe sua hora real de nascimento (ex: 07:30, 14:15).");
      return;
    }
    
    setSelectedHouse(houseId);
    const houseData = cityDatabase[houseId];
    if (!houseData) return;

    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description: `Consulta por Intenção — Casa ${houseId} (${houseData.label}) em ${year}`,
    });
    if (!charge.ok) {
      if (charge.reason === "no_credits") {
        showAlert("Você não possui créditos suficientes. Cada consulta custa 1 crédito.");
        navigate("/credits");
      } else {
        showAlert("Erro de conexão ao processar seus créditos. Tente novamente.");
      }
      return;
    }
    await refreshProfile();
    if (!isAdmin) showAlert("Consulta iniciada. 1 crédito debitado.");

    setLoadingState(true);
    setResult(null);

    try {
      const [ano, mes, dia] = birthdate.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const response = await fetch(`${API_URL}/find_all_cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          place_of_birth: birthPlace.trim(),
          dob: dataFormatada,
          time: birthtime,
          target_year: year,
          alvoId: houseId,
          intent: houseData.intent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      const houseResult = data.results?.[String(houseId)];
      const rawOptions = houseResult?.options || {};

      const toArray = (v: any): CityOption[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v;
        return [v];
      };

      const cities = {
        highticket: toArray(rawOptions.highticket),
        acessivel: toArray(rawOptions.acessivel),
        nacional: toArray(rawOptions.nacional),
      };

      const allResults: Record<string, any> = {};
      if (data.results) {
        for (const [key, val] of Object.entries(data.results)) {
          allResults[key] = val;
        }
      }

      const consultationId = await saveConsultation({
        userId: user.id,
        name: name.trim(),
        birthdate,
        birthtime,
        birth_place: birthPlace.trim(),
        year,
        mode,
        goal: houseId,
        intent: houseData.intent,
        result: { results: allResults, house: houseId },
      }) ?? undefined;

      setResult({ house: houseId, houseName: houseData.label, houseData, cities, allResults, consultationId });
      onHouseFound?.(houseId);
    } catch (error) {
      const err = error as Error;
      showAlert("Falha na consulta: " + err.message);
      setSelectedHouse(null);
    } finally {
      setLoadingState(false);
    }
  };


  return (
    <div className="space-y-6">
      {!result && !loading && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <Scroll className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-cinzel text-sm md:text-base font-bold text-white uppercase tracking-[0.1em]">
              Manifesto de Intenção
            </h3>
          </div>
          <p className="text-white/60 text-xs font-light mb-6">
            O que você gostaria que fosse diferente no seu próximo ano? Escolha o seu desejo principal e a nossa engine fará os cálculos para encontrar o destino exato.
          </p>

          <div className="flex flex-col gap-3 md:gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.values(cityDatabase).map((house) => (
              <motion.button
                key={house.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectIntent(house.id)}
                className="w-full text-left p-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white md:text-sm font-medium mb-1 group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {house.intent}
                    </h3>
                    <p className="text-white/40 text-[10px] font-light">
                      {house.realLife}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors">
                    <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-[#D4AF37] font-cinzel text-sm animate-pulse">Consultando o cosmos...</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button 
              onClick={() => { setResult(null); setSelectedHouse(null); }}
              className="mb-6 flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              ← Trocar Intenção
            </button>
            <DestinyResults
              house={result.house}
              houseName={result.houseName}
              houseData={result.houseData}
              cities={result.cities}
              allResults={result.allResults}
              consultationId={result.consultationId}
              userCredits={profile?.credits ?? 0}
              isAuthenticated={!!user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntentLookup;
