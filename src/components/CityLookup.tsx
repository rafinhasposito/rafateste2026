import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Compass } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { API_URL } from "@/lib/astro";
import { cityDatabase } from "@/data/houses";
import { useAlert } from "@/hooks/useAlert";

interface CityLookupProps {
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseFound?: (house: number, city: string) => void;
}

interface LookupResult {
  house: number;
  houseName: string;
  city: string;
  houseData: typeof cityDatabase[1] | null;
}

const CityLookup = ({ name, birthdate, birthtime, birthPlace, year, onHouseFound }: CityLookupProps) => {
  const { showAlert } = useAlert();
  const [city, setCity] = useState("");
  const [cityValid, setCityValid] = useState(false);
  const [cityCoords, setCityCoords] = useState<CityCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleLookup = async () => {
    if (!cityValid || !cityCoords) {
      showAlert("Selecione uma cidade da lista.");
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

      const response = await fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          place_of_birth: birthPlace.trim(),
          dob: dataFormatada,
          time: birthtime,
          target_year: year,
          past_city: city.trim(),
          past_lat: cityCoords.lat,
          past_lon: cityCoords.lon,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      const houseNum = data.house;
      const houseData = cityDatabase[houseNum] || null;

      const lookupResult: LookupResult = {
        house: houseNum,
        houseName: houseData?.label || `Casa ${houseNum}`,
        city: city,
        houseData,
      };

      setResult(lookupResult);
      onHouseFound?.(houseNum, city);
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
        <Compass className="w-5 h-5 text-primary" />
        <h3 className="font-cinzel text-sm md:text-base font-bold text-foreground uppercase tracking-[0.1em]">
          Consultar por Cidade
        </h3>
      </div>
      <p className="text-muted-foreground text-xs font-light">
        Digite a cidade onde deseja passar seu aniversário em {year}. O sistema calculará em qual casa astrológica ela se posiciona.
      </p>

      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <CityAutocomplete
            value={city}
            onChange={(v, valid, coords) => {
              setCity(v);
              setCityValid(valid);
              setCityCoords(coords ?? null);
              setResult(null);
            }}
            placeholder="Ex: Nova York, Londres, Jerusalém..."
          />
        </div>
        <button
          onClick={handleLookup}
          disabled={loading || !cityValid}
          className="shrink-0 h-12 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {loading ? "Calculando..." : "Consultar"}
        </button>
      </div>

      <AnimatePresence>
        {result && result.houseData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-primary/25 bg-card/60 backdrop-blur-sm p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <p className="text-foreground font-semibold text-sm">{result.city}</p>
            </div>

            <div className="bg-primary/10 rounded-lg p-5 space-y-3">
              <p className="font-cinzel text-primary text-lg font-bold uppercase tracking-wider">
                Casa {result.house} — {result.houseName}
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {result.houseData.resumo}
              </p>
              <p className="text-foreground/60 text-xs leading-relaxed">
                {result.houseData.porque}
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Vantagens desta Casa
              </h4>
              <div className="grid gap-2">
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Benefício Principal</p>
                  <p className="text-foreground/80 text-xs leading-relaxed">{result.houseData.beneficio}</p>
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

export default CityLookup;
