import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Search } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { API_URL } from "@/lib/astro";
import { cityDatabase } from "@/data/houses";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import DestinyResults from "@/components/DestinyResults";

interface CityLookupProps {
  mode: string;
  name: string;
  birthdate: string;
  birthtime: string;
  birthPlace: string;
  year: string;
  onHouseFound?: (house: number, city: string) => void;
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

interface LookupResult {
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

const CityLookup = ({ mode, name, birthdate, birthtime, birthPlace, year, onHouseFound, onLoadingChange }: CityLookupProps) => {
  const { showAlert } = useAlert();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [cityValid, setCityValid] = useState(false);
  const [cityCoords, setCityCoords] = useState<CityCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const setLoadingState = (state: boolean) => {
    setLoading(state);
    onLoadingChange?.(state);
  };

  const handleLookup = async () => {
    if (!cityValid || !cityCoords) {
      showAlert("Selecione uma cidade da lista.");
      return;
    }
    if (!name || !birthdate || !birthtime || !birthPlace) {
      showAlert("Preencha seus dados natais acima primeiro.");
      return;
    }
    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description: `Consulta por Cidade — ${city} em ${year}`,
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

      const basePayload = {
        name: name.trim(),
        place_of_birth: birthPlace.trim(),
        dob: dataFormatada,
        time: birthtime,
        target_year: year,
      };

      const auditResp = await fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          past_city: city.trim(),
          past_lat: cityCoords.lat,
          past_lon: cityCoords.lon,
        }),
      });

      const auditData = await auditResp.json();
      if (!auditResp.ok) throw new Error(auditData.error || "Erro na consulta.");

      const houseNum = auditData.house;
      const houseData = cityDatabase[houseNum] || null;
      if (!houseData) throw new Error("Casa não encontrada.");

      const cityParts = city.split(",").map(s => s.trim());
      const countryName = cityParts.length > 1 ? cityParts[cityParts.length - 1] : "";

      const masterCity: CityOption = {
        display_name: city,
        city: cityParts[0],
        country: countryName,
        lat: cityCoords.lat,
        lon: cityCoords.lon,
      };

      // Enrich in parallel with full 12-house city map so unlocks work later
      // just like in the "futuro" flow (HouseLookup / IntentLookup).
      let allResults: Record<string, any> = {};
      try {
        const enrichResp = await fetch(`${API_URL}/find_all_cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, alvoId: houseNum }),
        });
        if (enrichResp.ok) {
          const enrichData = await enrichResp.json();
          if (enrichData?.results) {
            for (const [k, v] of Object.entries(enrichData.results)) allResults[k] = v;
          }
        }
      } catch (e) {
        console.warn("[CityLookup] enrich failed (non-fatal)", e);
      }

      // Ensure the target-house entry reflects the user-chosen city
      allResults[String(houseNum)] = {
        city: masterCity,
        options: {
          highticket: masterCity,
          acessivel: allResults[String(houseNum)]?.options?.acessivel ?? null,
          nacional: allResults[String(houseNum)]?.options?.nacional ?? null,
        },
      };

      // Persist consultation (non-blocking on error)
      const consultationId = await saveConsultation({
        userId: user.id,
        name: name.trim(),
        birthdate,
        birthtime,
        birth_place: birthPlace.trim(),
        year,
        mode,
        goal: houseNum,
        origin: city.trim(),
        result: { results: allResults, house: houseNum },
      }) ?? undefined;

      setResult({
        house: houseNum,
        houseName: houseData.label,
        houseData,
        cities: {
          highticket: [masterCity],
          acessivel: [],
          nacional: [],
        },
        allResults,
        consultationId,
      });
      onHouseFound?.(houseNum, city);
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
          {loading ? "Calculando rota..." : "Consultar (1 crédito)"}
        </button>
      </div>


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

export default CityLookup;
