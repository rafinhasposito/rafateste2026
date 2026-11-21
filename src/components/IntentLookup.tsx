import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Sparkles, ArrowRight, HelpCircle, Search, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fotoDaCasa } from "@/lib/fotosEditoriais";
import { Compass, Wallet, MessagesSquare, House, Palette, Activity, HeartHandshake, RefreshCw, Globe, Briefcase, Users, Moon } from "lucide-react";

const objetivos = [
  { titulo: "Começar de novo", Icon: Compass },
  { titulo: "Fortalecer minhas finanças", Icon: Wallet },
  { titulo: "Comunicar e vender melhor", Icon: MessagesSquare },
  { titulo: "Cuidar da casa e da família", Icon: House },
  { titulo: "Viver romances e criar", Icon: Palette },
  { titulo: "Ganhar saúde e rotina", Icon: Activity },
  { titulo: "Firmar uma parceria", Icon: HeartHandshake },
  { titulo: "Transformar minha vida", Icon: RefreshCw },
  { titulo: "Viajar e ampliar horizontes", Icon: Globe },
  { titulo: "Avançar na carreira", Icon: Briefcase },
  { titulo: "Encontrar minha comunidade", Icon: Users },
  { titulo: "Ter tempo para mim", Icon: Moon },
];
import { cityDatabase } from "@/data/houses";
import { API_URL, normalizeBirthTime } from "@/lib/astro";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation, chargeAndSaveConsultationV1, enrichResultForTier } from "@/lib/consultations";
import {
  ALL_TWELVE_HOUSES,
  getTierRequiredCredits,
  type ConsultationUnlockTier,
} from "@/lib/consultationUnlocks";

interface IntentLookupProps {
  mode: string;
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
  allResults?: Record<string, any>;
  consultationId?: string;
}

const IntentLookup = ({ mode, name, birthdate, birthtime, birthPlace, year, onHouseFound, onLoadingChange }: IntentLookupProps) => {
  const { showAlert } = useAlert();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);

  const setLoadingState = (state: boolean) => {
    setLoading(state);
    onLoadingChange?.(state);
  };

  const handleSelectIntent = (houseId: number) => {
    const finalName = (name || profile?.full_name || user?.user_metadata?.name || "Viajante").trim();
    const finalBirthdate = birthdate || profile?.birth_date || "";
    const finalBirthtime = normalizeBirthTime(birthtime || (profile?.birth_time ? String(profile.birth_time).slice(0, 5) : ""));
    const finalBirthPlace = (birthPlace || profile?.birth_city || "").trim();

    if (!finalBirthdate || !finalBirthtime || !finalBirthPlace) {
      showAlert("Complete sua data, horário e cidade de nascimento antes de continuar.");
      return;
    }
    try {
      sessionStorage.setItem("ps_natal_name", finalName);
      sessionStorage.setItem("ps_natal_date", finalBirthdate);
      sessionStorage.setItem("ps_natal_time", finalBirthtime);
      sessionStorage.setItem("ps_natal_place", finalBirthPlace);
      sessionStorage.setItem("ps_natal_year", year);
      sessionStorage.setItem("ps_natal_mode", mode);
    } catch (err) {
      console.warn("[IntentLookup] sessionStorage write failed:", err);
    }
    setSelectedHouse(houseId);
    navigate(`/app/trailer?house=${houseId}&mode=${encodeURIComponent(mode || "futuro")}&year=${encodeURIComponent(year)}`);
  };

  const handleConfirmIntent = async (unlockFullMap: boolean = false) => {
    if (!selectedHouse) return;
    const safeTime = normalizeBirthTime(birthtime);
    if (!name || !birthdate || !safeTime || !birthPlace) { showAlert("Preencha seus dados natais acima antes de continuar."); return; }
    
    const houseData = cityDatabase[selectedHouse];
    if (!houseData) return;

    const returnUrl = `/?mode=${encodeURIComponent(mode || "futuro")}&path=intencao`;
    if (!user) {
      showAlert("Entre na sua conta para realizar a consulta.");
      navigate(`/auth?returnTo=${encodeURIComponent(returnUrl)}`);
      return;
    }

    const userCredits = profile?.credits ?? 0;
    const tier: ConsultationUnlockTier = unlockFullMap ? "full_map" : "single";
    const requiredCredits = getTierRequiredCredits(tier);
    if (!isAdmin && userCredits < requiredCredits) {
      if (unlockFullMap) {
        showAlert("Ative o Passe Mapa Completo para desbloquear todas as 12 Casas + Todos os Focos de uma vez!");
        navigate(`/credits?pkg=full&returnTo=${encodeURIComponent(returnUrl)}`);
      } else {
        showAlert("Você não possui créditos suficientes. Adquira 1 Casa Avulsa, o Pacote Expansão ou o Mapa Completo.");
        navigate(`/credits?pkg=1&returnTo=${encodeURIComponent(returnUrl)}`);
      }
      return;
    }

    setLoadingState(true);
    setResult(null);

    try {
      const [ano, mes, dia] = birthdate.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      let response: Response;
      try {
        response = await fetch(`${API_URL}/find_all_cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: name.trim(),
            place_of_birth: birthPlace.trim(),
            dob: dataFormatada,
            time: safeTime,
            target_year: year,
            alvoId: selectedHouse,
            intent: houseData.intent,
          }),
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta.");
      if (data?.return_time_utc) (window as any).__solar_return_time = data.return_time_utc;

      const houseResult = data.results?.[String(selectedHouse)];
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

      const allResults: Record<string, any> = {};
      if (data.results) {
        for (const [key, val] of Object.entries(data.results)) {
          allResults[key] = val;
        }
      }

      const resultPayload = enrichResultForTier(
        {
          results: allResults,
          house: selectedHouse,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null,
        },
        tier,
        selectedHouse
      );

      let consultationId: string | undefined;

      if (!isAdmin && tier === "single") {
        consultationId = (await chargeAndSaveConsultationV1({
          id: crypto.randomUUID(),
          userId: user.id,
          name: name.trim(),
          birthdate,
          birthtime: safeTime,
          birth_place: birthPlace.trim(),
          year,
          mode,
          goal: selectedHouse,
          intent: houseData.intent,
          result: resultPayload,
        })) ?? undefined;

        if (!consultationId) {
          throw new Error("Não foi possível debitar o crédito e salvar sua consulta.");
        }
        await refreshProfile();
      } else {
        const charge = await chargeConsultation({
          userId: user.id,
          currentCredits: profile?.credits ?? 0,
          isAdmin,
          description:
            tier === "full_map"
              ? `Passe Mapa Completo (12 Casas + Todos os Focos) — Intenção Casa ${selectedHouse} (${houseData.label}) em ${year}`
              : tier === "expansao"
              ? `Passe Expansão (Casa ${selectedHouse} + Todos os Focos) em ${year}`
              : `Consulta por Intenção — Casa ${selectedHouse} (${houseData.label}) em ${year}`,
          amount: requiredCredits,
        });
        if (!charge.ok) {
          if (charge.reason === "no_credits") {
            showAlert("Você não possui créditos suficientes.");
            navigate(`/credits?pkg=${tier === "full_map" ? "full" : tier === "expansao" ? "3" : "1"}&returnTo=${encodeURIComponent(returnUrl)}`);
          } else {
            showAlert("Erro de conexão ao processar seus créditos. Tente novamente.");
          }
          return;
        }
        await refreshProfile();

        consultationId = (await saveConsultation({
          userId: user.id,
          name: name.trim(),
          birthdate,
          birthtime: safeTime,
          birth_place: birthPlace.trim(),
          year,
          mode,
          goal: selectedHouse,
          intent: houseData.intent,
          houses_unlocked: tier === "full_map" ? 12 : 1,
          unlocked_houses: tier === "full_map" ? ALL_TWELVE_HOUSES : [selectedHouse],
          result: resultPayload,
        })) ?? undefined;
      }

      // Transição suave para contemplação cósmica
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (consultationId) navigate("/dashboard?id=" + consultationId);
      onHouseFound?.(selectedHouse);
    } catch (error) {
      const err = error as Error;
      if (err.name === "AbortError") {
        showAlert("O servidor demorou muito para responder. Nenhum crédito foi descontado — tente novamente.");
      } else {
        showAlert("Falha na consulta: " + err.message);
      }
      setSelectedHouse(null);
    } finally {
      setLoadingState(false);
    }
  };


  const hexColor = mode === 'passado' ? '#94A3B8' : mode === 'presente' ? '#10B981' : '#C9A227';
  const softHex = mode === 'passado' ? '#E2E8F0' : mode === 'presente' ? '#A7F3D0' : '#F5DE98';

  return (
    <div className="space-y-6 w-full">
      {!result && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-8">
          {Object.values(cityDatabase).map((house) => {
            const isSelected = selectedHouse === house.id;
            const { titulo, Icon } = objetivos[house.id - 1];
            const foto = fotoDaCasa(house.id);
            return (
              <button
                key={house.id}
                type="button"
                onClick={() => handleSelectIntent(house.id)}
                className={`relative overflow-hidden w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 group flex items-start justify-between gap-4 backdrop-blur-md hover:-translate-y-0.5 active:scale-[0.99] ${
                  isSelected ? "bg-[#0D1A2F]/95" : "bg-[#08111F]/80 border-white/[0.10] hover:bg-[#0C182B]/90 hover:border-white/25"
                }`}
                style={{
                  borderColor: isSelected ? `${hexColor}65` : undefined,
                  boxShadow: isSelected ? `0 0 28px ${hexColor}1F` : '0 10px 30px rgba(0,0,0,0.35)',
                }}
              >
                {foto && <img src={foto} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-20" />}
                <div className="relative flex-1">
                  <Icon className="w-6 h-6 mb-4" style={{ color: softHex }} aria-hidden="true" />
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
                    style={{ color: softHex }}
                  >
                    Casa {house.id}
                  </span>
                  <h3 className="font-ps-display text-xl sm:text-2xl font-bold mb-1.5 transition-colors leading-snug text-white">
                    {titulo}
                  </h3>
                  <p className="text-white/65 text-xs sm:text-sm font-light leading-relaxed">
                    {house.realLife}
                  </p>
                </div>
                <div className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all mt-1"
                     style={{ 
                       backgroundColor: isSelected ? `${hexColor}20` : 'rgba(255,255,255,0.04)',
                       borderColor: isSelected ? `${hexColor}50` : 'rgba(255,255,255,0.12)',
                     }}>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: softHex }} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Card de Confirmação Unificado */}
      <AnimatePresence>
        {selectedHouse && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-col items-center w-full mt-6 overflow-hidden"
          >
            <div className="flex flex-col items-stretch w-full min-w-0 p-5 md:p-6 bg-[#08111F]/90 border border-white/[0.12] rounded-2xl md:rounded-3xl backdrop-blur-xl gap-5 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
              
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border shrink-0"
                  style={{ backgroundColor: `${hexColor}18`, borderColor: `${hexColor}40` }}>
                  <Sparkles className="w-5 h-5" style={{ color: softHex }} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-ps-display text-lg md:text-xl font-bold">Foco Definido</h4>
                  <p className="text-white/60 text-xs md:text-sm">Escolha revelar apenas esta Casa ou desbloquear seu Mapa Completo (12 Casas).</p>
                </div>
              </div>

              <div className="grid w-full gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))]">
                <button
                  onClick={() => handleConfirmIntent(false)}
                  disabled={loading}
                  className="min-w-0 flex-wrap px-3 py-3.5 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-[#02050A] shadow-lg"
                  style={{
                    backgroundColor: mode === 'passado' ? '#CBD5E1' : hexColor,
                    boxShadow: `0 0 30px ${hexColor}40`,
                  }}
                >
                  <Search className="w-4 h-4" />
                  <span>Revelar Esta Casa</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold">
                    1 Créd.
                  </span>
                </button>

                <button
                  onClick={() => handleConfirmIntent(true)}
                  disabled={loading}
                  className="min-w-0 flex-wrap px-3 py-3.5 font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-full border border-[#E5C158]/60 bg-[#E5C158]/15 hover:bg-[#E5C158]/25 text-[#F6D97A] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(229,193,88,0.18)]"
                >
                  <Crown className="w-3.5 h-3.5 text-[#E5C158]" />
                  <span>Desbloquear Mapa Completo</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E5C158]/25 text-[#F6D97A] text-[10px] font-bold">
                    12 Casas + Todos os Focos
                  </span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 font-ps-display text-sm animate-pulse">Calculando as melhores cidades para o seu ano...</p>
        </div>
      )}

      
    </div>
  );
};

export default IntentLookup;
