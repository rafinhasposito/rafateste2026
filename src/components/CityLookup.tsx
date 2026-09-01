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
import { PremiumButton } from "@/components/shell";

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
      showAlert("Preencha seus dados natais acima antes de continuar.");
      return;
    }
    if (birthtime === "00:00" || birthtime === "00:00:00") {
      showAlert("A hora de nascimento '00:00' não é processável. Por favor, informe sua hora real de nascimento (ex: 07:30, 14:15).");
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
      const allResults: Record<string, any> = {};
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
      showAlert("Falha na consulta: " + err.message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-12">
        <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
          Defina o Ponto no Mapa
        </label>
        
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
          <div className="flex-1 relative">
            <CityAutocomplete
              value={city}
              onChange={(v, valid, coords) => {
                setCity(v);
                setCityValid(valid);
                setCityCoords(coords ?? null);
                setResult(null);
              }}
              placeholder="Ex: Nova York, Londres, Jerusalém..."
              className="w-full text-xl font-cinzel placeholder:font-sans placeholder:text-lg border-b border-white/20 bg-transparent pb-3 pt-2 text-white focus:border-[#D4AF37] focus:ring-0 transition-colors rounded-none"
            />
          </div>
          <button
            onClick={handleLookup}
            disabled={loading || !cityValid}
            className="shrink-0 h-14 px-8 bg-white text-black hover:bg-gray-200 disabled:bg-white/10 disabled:text-white/30 transition-all font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Simulando" : "Simular Destino"}
          </button>
        </div>
        <p className="font-inter text-[10px] text-white/40 mt-3 font-light tracking-wide">
          * A consulta exige 1 crédito da sua conta.
        </p>
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
