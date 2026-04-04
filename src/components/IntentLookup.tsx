import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Sparkles } from "lucide-react";
import { matchIntentToHouse } from "@/lib/intentMap";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import CityDisplay from "@/components/CityDisplay";

interface IntentLookupProps {
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
}

const IntentLookup = ({ name, birthdate, birthtime, birthPlace, year, onHouseFound, onLoadingChange }: IntentLookupProps) => {
  const { showAlert } = useAlert();
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);

  const setLoadingState = (state: boolean) => {
    setLoading(state);
    onLoadingChange?.(state);
  };

  const handleLookup = async () => {
    if (intent.length < 10) {
      showAlert("Descreva seu desejo com pelo menos 10 caracteres.");
      return;
    }
    if (!name || !birthdate || !birthtime || !birthPlace) {
      showAlert("Preencha seus dados natais acima primeiro.");
      return;
    }

    const match = matchIntentToHouse(intent);
    if (!match) {
      showAlert("Não conseguimos identificar a área. Tente palavras como: dinheiro, amor, carreira, saúde, viagem...");
      return;
    }

    const houseNum = match.house;
    const houseData = cityDatabase[houseNum];
    if (!houseData) return;

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
          alvoId: houseNum,
          intent: intent.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      const houseResult = data.results?.[String(houseNum)];
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

      setResult({ house: houseNum, houseName: houseData.label, houseData, cities });
      onHouseFound?.(houseNum);
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
        <Scroll className="w-5 h-5 text-primary" />
        <h3 className="font-cinzel text-sm md:text-base font-bold text-foreground uppercase tracking-[0.1em]">
          Manifesto de Intenção
        </h3>
      </div>
      <p className="text-muted-foreground text-xs font-light">
        Descreva o que você deseja para este ciclo. O sistema identificará a casa astrológica mais alinhada e sugerirá cidades ideais.
      </p>

      <textarea
        className="quantum-input h-28 resize-none text-sm"
        value={intent}
        onChange={(e) => { setIntent(e.target.value); setResult(null); }}
        placeholder="Ex: Quero ganhar mais dinheiro e construir patrimônio... / Quero encontrar o amor da minha vida... / Quero ser promovido e ter reconhecimento..."
      />

      {intent.length >= 10 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary/70">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            {matchIntentToHouse(intent)
              ? `Detectado: Casa ${matchIntentToHouse(intent)!.house} — ${cityDatabase[matchIntentToHouse(intent)!.house]?.label}`
              : "Continue digitando para identificar a casa..."}
          </span>
        </motion.div>
      )}

      <button
        onClick={handleLookup}
        disabled={loading || intent.length < 10}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {loading ? "Consultando o Cosmos..." : "Revelar Meu Destino"}
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
                Cidades Ideais para Este Ciclo
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
                Por que esta Casa atende seu desejo
              </h4>
              <div className="grid gap-2">
                {[
                  { label: "Benefício", text: result.houseData.beneficio },
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

export default IntentLookup;
