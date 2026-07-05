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

interface HouseLookupProps {
  mode: string;
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseSelected?: (house: number) => void;
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

const HouseLookup = ({ mode, name, birthdate, birthtime, birthPlace, year, onHouseSelected, onLoadingChange }: HouseLookupProps) => {
  const { showAlert } = useAlert();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
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
    if (!selectedHouse) { showAlert("Selecione uma Casa no grid."); return; }
    if (!name || !birthdate || !birthtime || !birthPlace) { showAlert("Preencha seus dados natais acima primeiro."); return; }
    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }

    const houseData0 = cityDatabase[selectedHouse];
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description: `Consulta por Casa — Casa ${selectedHouse} (${houseData0?.label ?? ""}) em ${year}`,
    });
    if (!charge.ok) {
      showAlert("Você não tem créditos suficientes. Cada consulta custa 1 crédito.");
      navigate("/credits");
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
          alvoId: selectedHouse,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      const houseResult = data.results?.[String(selectedHouse)];
      const houseData = cityDatabase[selectedHouse];
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
        goal: selectedHouse,
        result: { results: allResults, house: selectedHouse },
      }) ?? undefined;

      setResult({
        house: selectedHouse,
        houseName: houseData?.label || `Casa ${selectedHouse}`,
        houseData,
        cities,
        allResults,
        consultationId,
      });
      onHouseSelected?.(selectedHouse);
    } catch (error) {
      const err = error as Error;
      showAlert("Erro: " + err.message);
    } finally {
      setLoadingState(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="font-cinzel text-sm md:text-base font-bold text-foreground uppercase tracking-[0.1em]">
          Escolher por Casa Astrológica
        </h3>
      </div>
      <p className="text-muted-foreground text-xs font-light">
        Selecione a área da vida que deseja ativar em {year}. O sistema retornará as cidades ideais para ancorar o Sol nessa casa.
      </p>

      <GoalCards selectedGoal={selectedHouse} onSelect={handleSelect} />

      <button
        onClick={handleLookup}
        disabled={loading || !selectedHouse}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        {loading ? "Calculando Rotas..." : "Revelar Cidades Ideais (1 crédito)"}
      </button>

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
