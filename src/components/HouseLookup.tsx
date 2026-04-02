import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Search, MapPin } from "lucide-react";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import GoalCards from "@/components/GoalCards";

interface HouseLookupProps {
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseSelected?: (house: number) => void;
}

interface CityOption {
  display_name: string;
  city: string;
  country: string;
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

const HouseLookup = ({ name, birthdate, birthtime, birthPlace, year, onHouseSelected }: HouseLookupProps) => {
  const { showAlert } = useAlert();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HouseResult | null>(null);

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

    setLoading(true);
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
      setLoading(false);
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

            {/* Cidades */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Destinos Calculados
              </h4>
              <div className="grid gap-2">
                {result.cities.highticket && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <span className="text-[9px] bg-primary/20 text-primary font-bold uppercase tracking-wider px-2 py-1 rounded-full">Alto Padrão</span>
                    <p className="text-foreground font-semibold text-sm mt-2">{result.cities.highticket.display_name}</p>
                  </div>
                )}
                {result.cities.acessivel && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <span className="text-[9px] bg-accent/20 text-accent-foreground font-bold uppercase tracking-wider px-2 py-1 rounded-full">Médio Padrão</span>
                    <p className="text-foreground font-semibold text-sm mt-2">{result.cities.acessivel.display_name}</p>
                  </div>
                )}
                {result.cities.nacional && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <span className="text-[9px] bg-secondary text-secondary-foreground font-bold uppercase tracking-wider px-2 py-1 rounded-full">Nacional</span>
                    <p className="text-foreground font-semibold text-sm mt-2">{result.cities.nacional.display_name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vantagens completas */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Todas as Vantagens desta Casa
              </h4>
              <div className="grid gap-2">
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Benefício Principal</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.beneficio}</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Ideal Para</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.ideal}</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Vida Pessoal</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.pessoal}</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Amor</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.amor}</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Profissional</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.prof}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HouseLookup;
