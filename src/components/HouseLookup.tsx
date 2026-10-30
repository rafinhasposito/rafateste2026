import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import GoalCards from "@/components/GoalCards";
import DestinyResults from "@/components/DestinyResults";
import { PremiumButton } from "@/components/shell";

interface HouseLookupProps {
  mode: string;
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseSelected?: (house: number) => void;
  onLoadingChange?: (loading: boolean) => void;
  overrideTargetHouse?: number | null;
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

interface HouseResult {
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

const HouseLookup = ({ mode, name, birthdate, birthtime, birthPlace, year, onHouseSelected, onLoadingChange, overrideTargetHouse }: HouseLookupProps) => {
  const { showAlert } = useAlert();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(overrideTargetHouse ?? null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HouseResult | null>(null);

  const setLoadingState = (state: boolean) => {
    setLoading(state);
    onLoadingChange?.(state);
  };

  const handleSelect = (houseNum: number) => {
    setSelectedHouse(houseNum);
    setResult(null);
    // Armazena no sessionStorage para o Trailer processar a API
    sessionStorage.setItem('ps_natal_name', name);
    sessionStorage.setItem('ps_natal_date', birthdate);
    sessionStorage.setItem('ps_natal_time', birthtime);
    sessionStorage.setItem('ps_natal_place', birthPlace);
    if (year) sessionStorage.setItem('ps_natal_year', year.toString());
    if (mode) sessionStorage.setItem('ps_natal_mode', mode);
  };

  const handleLookup = async () => {
    const target = overrideTargetHouse !== undefined ? overrideTargetHouse : selectedHouse;
    
    // If target is null, it means General Dashboard unlock. 
    // We pass null to the backend (backend usually handles `alvoId: null` or doesn't filter).
    // Let's assume backend accepts null.
    
    if (target === undefined) { showAlert("Selecione uma opção."); return; }
    if (!name || !birthdate || !birthtime || !birthPlace) { showAlert("Preencha seus dados natais acima antes de continuar."); return; }
    if (birthtime === "00:00" || birthtime === "00:00:00") {
      showAlert("A hora de nascimento '00:00' não é processável. Por favor, informe sua hora real de nascimento (ex: 07:30, 14:15).");
      return;
    }
    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }

    const houseData0 = target ? cityDatabase[target] : null;
    const description = target 
      ? `Consulta por Intenção — Casa ${target} (${houseData0?.label ?? ""}) em ${year}`
      : `Consulta Completa (12 Casas) em ${year}`;
      
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description,
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
          alvoId: target,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      // Se for consulta geral (target null), passamos pra frente sem focar em uma casa
      const houseResult = target ? data.results?.[String(target)] : null;
      const houseData = target ? cityDatabase[target] : null;
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

      // Build allResults from the full API response
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
        goal: target,
        result: {
          results: allResults,
          house: target,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null,
        },
      }) ?? undefined;

      // Transição suave para contemplação cósmica
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (consultationId) navigate("/dashboard?id=" + consultationId);
      if (target) onHouseSelected?.(target);
    } catch (error) {
      const err = error as Error;
      showAlert("Falha na consulta: " + err.message);
    } finally {
      setLoadingState(false);
    }
  };


  return (
    <div className="space-y-6">
      {overrideTargetHouse === undefined && (
        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-white/50 text-sm md:text-base font-light max-w-lg">
            Cada área do grid abaixo corresponde a um foco diferente para o seu ano de {year}. Selecione a energia que você mais precisa atrair.
          </p>
        </div>
      )}

      {overrideTargetHouse === undefined && (
        <GoalCards selectedGoal={selectedHouse} onSelect={handleSelect} mode={mode} />
      )}

      <AnimatePresence>
        {selectedHouse && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-col items-center w-full mt-6 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 md:p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl md:rounded-3xl backdrop-blur-md gap-6">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border shrink-0"
                  style={{ backgroundColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#FACC15'}15`, borderColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#FACC15'}30` }}>
                  <Crown className="w-5 h-5" style={{ color: mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#FACC15' }} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-ps-display text-lg md:text-xl font-bold">Foco Definido</h4>
                  <p className="text-white/60 text-xs md:text-sm">Agora veja as cidades que combinam com você.</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <button
                  onClick={handleLookup}
                  disabled={loading}
                  className="w-full md:w-auto px-8 md:px-10 py-3.5 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-black shadow-lg"
                  style={{
                    backgroundColor: mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#FACC15',
                    boxShadow: `0 0 30px ${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#FACC15'}40`,
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {loading ? "Calculando..." : "Revelar Cidades"}
                </button>
                <p className="font-ps-ui text-[9px] uppercase tracking-[0.16em] text-white/50 font-semibold flex items-center justify-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227' }} />
                  Consome 1 crédito • Leitura completa
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

export default HouseLookup;
