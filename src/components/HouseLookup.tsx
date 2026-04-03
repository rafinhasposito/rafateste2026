import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Search } from "lucide-react";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import GoalCards from "@/components/GoalCards";
import CityDisplay from "@/components/CityDisplay";

interface HouseLookupProps {
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
}

interface HouseResult {
  house: number;
  houseName: string;
  houseData: typeof cityDatabase[1];
  cities: {
    highticket: CityOption | null;
    acessivel: CityOption | null;
    nacional: CityOption | null;
  };
}

const HouseLookup = ({ name, birthdate, birthtime, birthPlace, year, onHouseSelected, onLoadingChange }: HouseLookupProps) => {
  const { showAlert } = useAlert();
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
    if (!selectedHouse) {
      showAlert("Selecione uma Casa no grid.");
      return;
    }
    if (!name || !birthdate || !birthtime || !birthPlace) {
      showAlert("Preencha seus dados natais acima primeiro.");
      return;
    }

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
      const cities = houseResult?.options || { highticket: null, acessivel: null, nacional: null };

      setResult({
        house: selectedHouse,
        houseName: houseData?.label || `Casa ${selectedHouse}`,
        houseData,
        cities,
      });
      onHouseSelected?.(selectedHouse);
    } catch (error) {
      const err = error as Error;
      showAlert("Erro: " + err.message);
    } finally {
      setLoadingState(false);
    }
  };

  const renderCity = (city: CityOption | null, tier: "highticket" | "acessivel" | "nacional") => {
    if (!city) return null;
    return (
      <CityDisplay
        city={city.city || city.display_name}
        country={city.country || ""}
        lat={city.lat}
        lon={city.lon}
        tier={tier}
      />
    );
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
        {loading ? "Calculando Rotas..." : "Revelar Cidades Ideais"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-primary/25 bg-card/60 backdrop-blur-sm p-5 space-y-5"
          >
            <div className="bg-primary/10 rounded-lg p-5 space-y-3">
              <p className="font-cinzel text-primary text-lg font-bold uppercase tracking-wider">
                Casa {result.house} — {result.houseName}
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {result.houseData.resumo}: {result.houseData.porque}
              </p>
            </div>

            {/* Cities with maps + flags */}
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Destinos Calculados
              </h4>
              <div className="grid gap-3 md:grid-cols-3">
                {renderCity(result.cities.highticket, "highticket")}
                {renderCity(result.cities.acessivel, "acessivel")}
                {renderCity(result.cities.nacional, "nacional")}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Todas as Vantagens desta Casa
              </h4>
              <div className="grid gap-2">
                {[
                  { label: "Benefício Principal", text: result.houseData.beneficio },
                  { label: "Ideal Para", text: result.houseData.ideal },
                  { label: "Vida Pessoal", text: result.houseData.pessoal },
                  { label: "Amor", text: result.houseData.amor },
                  { label: "Profissional", text: result.houseData.prof },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-foreground/80 text-xs leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HouseLookup;
