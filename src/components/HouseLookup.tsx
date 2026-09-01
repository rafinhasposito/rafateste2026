import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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
        result: { results: allResults, house: target },
      }) ?? undefined;

      setResult({
        house: target ?? 1, // Fallback visual se for geral, mas a dashboard cuida disso
        houseName: houseData?.label || (target ? `Casa ${target}` : "Visão Geral"),
        houseData,
        cities,
        allResults,
        consultationId,
      });
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
        <>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-cinzel text-sm md:text-base font-bold text-white uppercase tracking-[0.1em]">
              Escolher por Casa Astrológica
            </h3>
          </div>
          <p className="text-white/60 text-xs font-light">
            Selecione a área da vida que deseja ativar em {year}. O sistema retornará as cidades ideais para ancorar o Sol nessa casa.
          </p>
          <GoalCards selectedGoal={selectedHouse} onSelect={handleSelect} />
        </>
      )}

      <PremiumButton
        variant="primary"
        onClick={handleLookup}
        disabled={loading || (overrideTargetHouse === undefined && !selectedHouse)}
        className="w-full h-12 mt-4"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : (
          <Search className="w-4 h-4 mr-2" />
        )}
        {loading ? "Calculando rotas..." : "Revelar cidades ideais (1 crédito)"}
      </PremiumButton>

      <AnimatePresence>
        {result && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default HouseLookup;
