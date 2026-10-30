import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Search, MapPin, Globe } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { API_URL } from "@/lib/astro";
import { cityDatabase } from "@/data/houses";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { saveConsultation, chargeAndSaveConsultationV1 } from "@/lib/consultations";
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

  const lookupSignatureRef = useRef<string>("");
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

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
    
    // VERIFICAR SALDO ANTES DE CALCULOS PESADOS
    if (!isAdmin && (profile?.credits ?? 0) < 1) {
      showAlert("Você não possui créditos suficientes. Cada consulta custa 1 crédito.");
      navigate("/credits");
      return;
    }

    setLoadingState(true);
    setResult(null);

    const currentSignature = `${name}|${birthdate}|${birthtime}|${birthPlace}|${year}|${city}`;
    if (lookupSignatureRef.current !== currentSignature) {
      idempotencyKeyRef.current = crypto.randomUUID();
      lookupSignatureRef.current = currentSignature;
    }
    const consultationIdToUse = idempotencyKeyRef.current;

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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout para suportar cold-starts

      const auditResp = await fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
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

      let returnTimeUtc = auditData.return_time_utc || null;
      let returnDate = auditData.return_date || null;
      let sunSign = auditData.sun_sign || null;
      let ascendant = auditData.ascendant || null;

      // Enrich in parallel with full 12-house city map so unlocks work later
      // just like in the "futuro" flow (HouseLookup / IntentLookup).
      const allResults: Record<string, any> = {};
      try {
        const enrichResp = await fetch(`${API_URL}/find_all_cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ ...basePayload, alvoId: houseNum }),
        });
        if (enrichResp.ok) {
          const enrichData = await enrichResp.json();
          if (enrichData?.results) {
            for (const [k, v] of Object.entries(enrichData.results)) allResults[k] = v;
          }
          if (enrichData?.return_time_utc) returnTimeUtc = enrichData.return_time_utc;
          if (enrichData?.return_date) returnDate = enrichData.return_date;
          if (enrichData?.sun_sign) sunSign = enrichData.sun_sign;
          if (enrichData?.ascendant) ascendant = enrichData.ascendant;
        }
      } catch (e) {
        console.warn("[CityLookup] enrich failed (non-fatal)", e);
      }
      clearTimeout(timeoutId);

      // Ensure the target-house entry reflects the user-chosen city
      allResults[String(houseNum)] = {
        city: masterCity,
        options: {
          highticket: masterCity,
          acessivel: allResults[String(houseNum)]?.options?.acessivel ?? null,
          nacional: allResults[String(houseNum)]?.options?.nacional ?? null,
        },
      };

      const finalResultPayload = {
        results: allResults,
        house: houseNum,
        return_time_utc: returnTimeUtc,
        return_date: returnDate,
        sun_sign: sunSign,
        ascendant: ascendant,
      };

      // ATOMIC CHARGE AND SAVE
      let consultationId: string | undefined = undefined;
      
      if (!isAdmin) {
        const savedId = await chargeAndSaveConsultationV1({
          id: consultationIdToUse,
          userId: user.id,
          name: name.trim(),
          birthdate,
          birthtime,
          birth_place: birthPlace.trim(),
          year,
          mode,
          goal: houseNum,
          origin: city.trim(),
          result: finalResultPayload,
        });
        
        if (!savedId) {
          throw new Error("Falha ao debitar crédito ou salvar consulta.");
        }
        consultationId = savedId;
        await refreshProfile();
      } else {
        const savedId = await saveConsultation({
          id: consultationIdToUse,
          userId: user.id,
          name: name.trim(),
          birthdate,
          birthtime,
          birth_place: birthPlace.trim(),
          year,
          mode,
          goal: houseNum,
          origin: city.trim(),
          result: finalResultPayload,
        });
        if (savedId) consultationId = savedId;
      }

      // Transição suave para contemplação cósmica
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (consultationId) navigate("/dashboard?id=" + consultationId);
      onHouseFound?.(houseNum, city);
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AbortError') {
        showAlert("O servidor demorou muito para responder. Por favor, tente novamente.");
      } else {
        showAlert("Falha na consulta: " + err.message);
      }
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Luxury Spotlight Search Bar */}
      <p className="font-ps-ui text-white/65 text-sm md:text-base font-light mb-6 text-center max-w-md leading-relaxed">
        Digite a cidade onde você pensa em comemorar (ou onde passou) para ver o que ela ativa no seu ano.
      </p>
      <div className="w-full relative group mb-6 mt-0">
        {/* Glow de fundo da barra de busca */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#C9A227]/15 to-transparent rounded-2xl md:rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition duration-700 group-focus-within:opacity-100" />
        
        <div className="relative flex flex-col items-center bg-[#07101C]/90 backdrop-blur-3xl border border-[#C9A227]/35 rounded-2xl md:rounded-[32px] p-1.5 md:p-2 transition-all duration-500 focus-within:border-[#C9A227]/75 focus-within:bg-[#0B1728]/95 shadow-[0_14px_38px_rgba(0,0,0,0.65)]">
          
          <div className="w-full flex items-center px-4 md:px-6 py-3 md:py-4">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-[#C9A227]/80 mr-3.5 md:mr-4 shrink-0" />
            <div className="flex-1">
              <CityAutocomplete
                value={city}
                onChange={(v, valid, coords) => {
                  setCity(v);
                  setCityValid(valid);
                  setCityCoords(coords ?? null);
                  setResult(null);
                }}
                placeholder="Ex: Lisboa, Paris, Rio de Janeiro..."
                className="w-full text-lg sm:text-2xl md:text-3xl font-ps-display placeholder:font-ps-ui placeholder:font-light placeholder:text-white/35 bg-transparent border-none outline-none text-white focus:ring-0 px-0 h-auto"
              />
            </div>
            {cityValid && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] ml-3 shrink-0 shadow-[0_0_10px_#10B981]" />
            )}
          </div>
        </div>
      </div>

      {/* Progressive Disclosure: Botão só aparece quando a cidade é válida */}
      <AnimatePresence>
        {cityValid && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-col items-center w-full mt-4 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 md:p-6 bg-[#07101C]/90 border border-[#C9A227]/30 rounded-2xl md:rounded-3xl backdrop-blur-md gap-5 shadow-xl">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border shrink-0"
                  style={{ backgroundColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}15`, borderColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}40` }}>
                  <MapPin className="w-5 h-5" style={{ color: mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#F5DE98' }} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-ps-display text-lg md:text-xl font-bold">Cidade Selecionada</h4>
                  <p className="text-white/65 text-xs md:text-sm">Confirme para ver a leitura completa dessa cidade no seu ano.</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto">
                <button
                  onClick={handleLookup}
                  disabled={loading}
                  className="w-full md:w-auto px-8 md:px-10 py-3.5 md:py-4 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-black shadow-lg"
                  style={{
                    backgroundColor: mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227',
                    boxShadow: `0 0 30px ${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}40`,
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  {loading ? "Analisando Destino..." : "Ver Leitura desta Cidade"}
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

export default CityLookup;
