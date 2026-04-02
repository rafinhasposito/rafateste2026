import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Sparkles } from "lucide-react";
import { matchIntentToHouse } from "@/lib/intentMap";
import { cityDatabase } from "@/data/houses";
import { API_URL } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";

interface IntentLookupProps {
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseFound?: (house: number) => void;
}

interface IntentResult {
  house: number;
  houseName: string;
  houseData: typeof cityDatabase[1];
  cities: {
    highticket: { display_name: string } | null;
    acessivel: { display_name: string } | null;
    nacional: { display_name: string } | null;
  };
}

const IntentLookup = ({ name, birthdate, birthtime, birthPlace, year, onHouseFound }: IntentLookupProps) => {
  const { showAlert } = useAlert();
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);

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
          alvoId: houseNum,
          intent: intent.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      const houseResult = data.results?.[String(houseNum)];
      const cities = houseResult?.options || { highticket: null, acessivel: null, nacional: null };

      setResult({ house: houseNum, houseName: houseData.label, houseData, cities });
      onHouseFound?.(houseNum);
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

            {/* Cidades sugeridas */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Cidades Ideais para Este Ciclo
              </h4>
              <div className="grid gap-2">
                {result.cities.highticket && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-center gap-3">
                    <span className="text-[9px] bg-primary/20 text-primary font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0">Alto Padrão</span>
                    <span className="text-foreground/80 text-sm font-medium">{result.cities.highticket.display_name}</span>
                  </div>
                )}
                {result.cities.acessivel && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-center gap-3">
                    <span className="text-[9px] bg-accent/20 text-accent-foreground font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0">Médio Padrão</span>
                    <span className="text-foreground/80 text-sm font-medium">{result.cities.acessivel.display_name}</span>
                  </div>
                )}
                {result.cities.nacional && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-center gap-3">
                    <span className="text-[9px] bg-secondary text-secondary-foreground font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0">Nacional</span>
                    <span className="text-foreground/80 text-sm font-medium">{result.cities.nacional.display_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vantagens */}
            <div className="space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-foreground uppercase tracking-wider">
                Por que esta Casa atende seu desejo
              </h4>
              <div className="grid gap-2">
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Benefício</p>
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

export default IntentLookup;
