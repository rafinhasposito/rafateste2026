import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    // Armazena no sessionStorage (com fallback para o perfil salvo) para o Trailer processar a API
    const safeName = name || profile?.full_name || "";
    const safeDate = birthdate || profile?.birth_date || "";
    const safeTime = birthtime || (profile?.birth_time ? profile.birth_time.slice(0, 5) : "");
    const safePlace = birthPlace || profile?.birth_city || "";

    if (safeName) sessionStorage.setItem('ps_natal_name', safeName);
    if (safeDate) sessionStorage.setItem('ps_natal_date', safeDate);
    if (safeTime) sessionStorage.setItem('ps_natal_time', safeTime);
    if (safePlace) sessionStorage.setItem('ps_natal_place', safePlace);
    if (year) sessionStorage.setItem('ps_natal_year', year.toString());
    if (mode) sessionStorage.setItem('ps_natal_mode', mode);

    navigate(`/app/trailer?house=${houseNum}&mode=${mode}`);
  };

  const handleLookup = async (unlockFullMap: boolean = false) => {
    const target = overrideTargetHouse !== undefined ? overrideTargetHouse : selectedHouse;
    const safeName = name || profile?.full_name || "";
    const safeDate = birthdate || profile?.birth_date || "";
    const safeTime = birthtime || (profile?.birth_time ? profile.birth_time.slice(0, 5) : "");
    const safePlace = birthPlace || profile?.birth_city || "";
    
    if (target === undefined) { showAlert("Selecione uma opção."); return; }
    if (!safeName || !safeDate || !safeTime || !safePlace) { showAlert("Preencha seus dados de nascimento antes de continuar."); return; }
    if (safeTime === "00:00" || safeTime === "00:00:00") {
      showAlert("A hora de nascimento '00:00' não é processável. Por favor, informe sua hora aproximada ou real de nascimento (ex: 07:30, 14:15).");
      return;
    }
    if (!user) { showAlert("Entre na sua conta para realizar a consulta."); navigate("/auth"); return; }

    const requiredCredits = unlockFullMap ? 7 : 1;
    if (!isAdmin && (profile?.credits ?? 0) < requiredCredits) {
      if (unlockFullMap) {
        showAlert("Ative o Pacote Mapa Completo (7 Créditos) para desbloquear todas as 12 Casas de uma vez!");
        navigate("/credits?pkg=full");
      } else {
        showAlert("Você não possui créditos suficientes. Adquira seu crédito avulso ou o Mapa Completo.");
        navigate("/credits");
      }
      return;
    }

    const houseData0 = target ? cityDatabase[target] : null;
    const description = unlockFullMap
      ? `Mapa Completo (12 Casas) — Casa Inicial ${target} (${houseData0?.label ?? ""}) em ${year}`
      : target 
        ? `Consulta por Intenção — Casa ${target} (${houseData0?.label ?? ""}) em ${year}`
        : `Consulta Completa (12 Casas) em ${year}`;
      
    const charge = await chargeConsultation({
      userId: user.id,
      currentCredits: profile?.credits ?? 0,
      isAdmin,
      description,
      amount: requiredCredits,
    });
    if (!charge.ok) {
      if (charge.reason === "no_credits") {
        showAlert("Você não possui créditos suficientes.");
        navigate(unlockFullMap ? "/credits?pkg=full" : "/credits");
      } else {
        showAlert("Erro de conexão ao processar seus créditos. Tente novamente.");
      }
      return;
    }
    await refreshProfile();

    setLoadingState(true);
    setResult(null);

    try {
      const [ano, mes, dia] = safeDate.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const response = await fetch(`${API_URL}/find_all_cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: safeName.trim(),
          place_of_birth: safePlace.trim(),
          dob: dataFormatada,
          time: safeTime,
          target_year: year,
          alvoId: target,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");

      // Build allResults from the full API response
      const allResults: Record<string, any> = {};
      if (data.results) {
        for (const [key, val] of Object.entries(data.results)) {
          allResults[key] = val;
        }
      }

      const allTwelveHouses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      const consultationId = await saveConsultation({
        userId: user.id,
        name: safeName.trim(),
        birthdate: safeDate,
        birthtime: safeTime,
        birth_place: safePlace.trim(),
        year,
        mode,
        goal: target,
        houses_unlocked: unlockFullMap ? 12 : 1,
        unlocked_houses: unlockFullMap ? allTwelveHouses : target ? [target] : [],
        result: {
          results: allResults,
          house: target,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null,
          ...(unlockFullMap ? { full_map_unlocked: true, unlocked_houses_list: allTwelveHouses } : {}),
        },
      }) ?? undefined;

      // Transição suave para contemplação cósmica
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (consultationId) navigate("/dashboard?id=" + consultationId);
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
        <div className="flex flex-col items-center text-center mb-6">
          <p className="text-white/60 text-sm md:text-base font-light max-w-lg leading-relaxed">
            Escolha a área da vida que você quer fortalecer em {year} para entender como ela funciona e ver quais cidades ativam essa energia.
          </p>
        </div>
      )}

      {overrideTargetHouse === undefined && (
        <GoalCards selectedGoal={selectedHouse} onSelect={handleSelect} mode={mode} />
      )}

      <AnimatePresence>
        {overrideTargetHouse !== undefined && selectedHouse && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-col items-center w-full mt-6 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between w-full p-5 md:p-6 bg-[#08111F]/90 border border-white/[0.12] rounded-2xl md:rounded-3xl backdrop-blur-xl gap-5 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border shrink-0"
                  style={{ backgroundColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}18`, borderColor: `${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}40` }}>
                  <Crown className="w-5 h-5" style={{ color: mode === 'passado' ? '#E2E8F0' : mode === 'presente' ? '#A7F3D0' : '#F5DE98' }} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-ps-display text-lg md:text-xl font-bold">Foco Definido</h4>
                  <p className="text-white/60 text-xs md:text-sm">Escolha revelar apenas esta Casa ou desbloquear seu Mapa Completo (12 Casas).</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => handleLookup(false)}
                  disabled={loading}
                  className="px-6 md:px-7 py-3.5 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-[#02050A] shadow-lg"
                  style={{
                    backgroundColor: mode === 'passado' ? '#CBD5E1' : mode === 'presente' ? '#10B981' : '#C9A227',
                    boxShadow: `0 0 30px ${mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227'}40`,
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{loading ? "Calculando..." : "Revelar Esta Casa"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold">
                    1 Créd.
                  </span>
                </button>

                <button
                  onClick={() => handleLookup(true)}
                  disabled={loading}
                  className="px-5 md:px-6 py-3.5 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full border border-[#E5C158]/60 bg-[#E5C158]/15 hover:bg-[#E5C158]/25 text-[#F6D97A] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,193,88,0.18)]"
                >
                  <Crown className="w-3.5 h-3.5 text-[#E5C158]" />
                  <span>Desbloquear Mapa Completo</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E5C158]/25 text-[#F6D97A] text-[10px] font-bold">
                    12 Casas • 7 Créd.
                  </span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

export default HouseLookup;
