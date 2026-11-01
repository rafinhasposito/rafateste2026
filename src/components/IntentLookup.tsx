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

  const handleSelectIntent = (houseId: number) => {
    setSelectedHouse(houseId);
  };

  const handleConfirmIntent = async () => {
    if (!selectedHouse) return;
    if (!name || !birthdate || !birthtime || !birthPlace) { showAlert("Preencha seus dados natais acima antes de continuar."); return; }
    if (birthtime === "00:00" || birthtime === "00:00:00") {
      showAlert("A hora de nascimento '00:00' não é processável. Por favor, informe sua hora real de nascimento (ex: 07:30, 14:15).");
      return;
    }
    
    const houseData = cityDatabase[selectedHouse];
    if (!houseData) return;

    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description: `Consulta por Intenção — Casa ${selectedHouse} (${houseData.label}) em ${year}`,
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
          alvoId: selectedHouse,
          intent: houseData.intent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");
      if (data?.return_time_utc) (window as any).__solar_return_time = data.return_time_utc;

      const houseResult = data.results?.[String(selectedHouse)];
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
        goal: selectedHouse,
        intent: houseData.intent,
        result: {
          results: allResults,
          house: selectedHouse,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null,
        },
      }) ?? undefined;

      // Transição suave para contemplação cósmica
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (consultationId) navigate("/dashboard?id=" + consultationId);
      onHouseFound?.(selectedHouse);
    } catch (error) {
      const err = error as Error;
      showAlert("Falha na consulta: " + err.message);
      setSelectedHouse(null);
    } finally {
      setLoadingState(false);
    }
  };


  const hexColor = mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227';
  const softHex = mode === 'passado' ? '#E2E8F0' : mode === 'presente' ? '#A7F3D0' : '#F5DE98';

  return (
    <div className="space-y-6">
      {!result && !loading && (
        <div className="flex flex-col gap-3.5 pb-12">
          {Object.values(cityDatabase).map((house, index) => {
            const isSelected = selectedHouse === house.id;
            return (
              <motion.button
                key={house.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectIntent(house.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group flex items-start justify-between gap-4 backdrop-blur-md ${
                  isSelected ? "bg-[#0D1A2F]/95" : "bg-[#08111F]/80 border-white/[0.08] hover:bg-[#0C182B]/90 hover:border-white/20"
                }`}
                style={{
                  borderColor: isSelected ? `${hexColor}65` : undefined,
                  boxShadow: isSelected ? `0 0 28px ${hexColor}1F` : 'none',
                }}
              >
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-medium mb-1 transition-colors leading-snug group-hover:opacity-100"
                      style={{ color: isSelected ? softHex : 'white' }}>
                    {house.intent}
                  </h3>
                  <p className="text-white/60 text-xs font-light leading-relaxed">
                    {house.realLife}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all mt-0.5"
                     style={{ 
                       backgroundColor: isSelected ? `${hexColor}20` : 'rgba(255,255,255,0.03)',
                       borderColor: isSelected ? `${hexColor}50` : 'rgba(255,255,255,0.1)',
                     }}>
                  <ArrowRight className="w-4 h-4 transition-colors" style={{ color: isSelected ? softHex : 'rgba(255,255,255,0.4)' }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Card de Confirmação Unificado */}
      <AnimatePresence>
        {selectedHouse && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-col items-center w-full mt-6 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-5 md:p-6 bg-[#08111F]/90 border border-white/[0.1] rounded-2xl md:rounded-3xl backdrop-blur-xl gap-6 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border shrink-0"
                  style={{ backgroundColor: `${hexColor}18`, borderColor: `${hexColor}40` }}>
                  <Sparkles className="w-5 h-5" style={{ color: softHex }} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-ps-display text-lg md:text-xl font-bold">Foco Definido</h4>
                  <p className="text-white/60 text-xs md:text-sm">Agora veja as cidades que ativam essa área para você.</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <button
                  onClick={handleConfirmIntent}
                  disabled={loading}
                  className="w-full md:w-auto px-8 md:px-10 py-3.5 md:py-4 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-[#02050A] shadow-lg"
                  style={{
                    backgroundColor: mode === 'passado' ? '#CBD5E1' : hexColor,
                    boxShadow: `0 0 30px ${hexColor}40`,
                  }}
                >
                  <Search className="w-4 h-4" />
                  Revelar Cidades
                </button>
                <p className="font-ps-ui text-[10px] uppercase tracking-[0.14em] text-white/55 font-semibold flex items-center justify-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: hexColor }} />
                  Consome 1 crédito • Leitura completa
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 font-ps-display text-sm animate-pulse">Calculando as melhores cidades para o seu ano...</p>
        </div>
      )}

      
    </div>
  );
};

export default IntentLookup;
