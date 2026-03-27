import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarryBackground from "@/components/StarryBackground";
import UserMenu from "@/components/UserMenu";
import HouseCard from "@/components/HouseCard";
import HouseDetail from "@/components/HouseDetail";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";

interface CityOption {
  city: string;
  country: string;
  continent: string;
  display_name: string;
  lat: number;
  lon: number;
}

interface HouseResult {
  city: CityOption;
  options: {
    nacional: CityOption | null;
    acessivel: CityOption | null;
    highticket: CityOption | null;
  };
}

interface ApiResult {
  results: Record<string, HouseResult>;
  oraculo?: string;
}

interface ConsultationRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  houses_unlocked: number;
  result: ApiResult | null;
  created_at: string;
}

const TOTAL_HOUSES = 12;

const isHouseLockedByConsultation = (consultation: ConsultationRow, houseNum: number) => {
  const unlockedCount = Math.max(consultation.houses_unlocked, 0);
  const goalHouse = consultation.goal;

  if (unlockedCount >= TOTAL_HOUSES) return false;

  if (goalHouse && unlockedCount <= 1) {
    return houseNum !== goalHouse;
  }

  if (goalHouse === houseNum) {
    return false;
  }

  return houseNum > unlockedCount;
};

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get("id");

  const [consultation, setConsultation] = useState<ConsultationRow | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlockingAll, setUnlockingAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      let query = supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (consultationId) {
        query = supabase
          .from("consultations")
          .select("*")
          .eq("id", consultationId)
          .eq("user_id", user.id);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        setConsultation(data[0] as unknown as ConsultationRow);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, consultationId]);

  useEffect(() => {
    if (!consultation) {
      setSelectedHouse(null);
      return;
    }

    if (consultation.goal && !isHouseLockedByConsultation(consultation, consultation.goal)) {
      setSelectedHouse(consultation.goal);
      return;
    }

    const firstUnlocked = Array.from({ length: TOTAL_HOUSES }, (_, i) => i + 1).find(
      (houseNum) => !isHouseLockedByConsultation(consultation, houseNum)
    ) ?? null;

    setSelectedHouse(firstUnlocked);
  }, [consultation?.id, consultation?.goal, consultation?.houses_unlocked]);

  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return isHouseLockedByConsultation(consultation, houseNum);
  };

  const getHouseResult = (houseNum: number): HouseResult | null => {
    if (!consultation?.result?.results) return null;
    return consultation.result.results[String(houseNum)] || null;
  };

  const handleUnlockAllHouses = async () => {
    if (!user || !profile || !consultation || unlockingAll) return;

    const creditsNeeded = Math.max(0, TOTAL_HOUSES - consultation.houses_unlocked);

    if (creditsNeeded === 0) {
      showAlert("Todas as casas já estão desbloqueadas.");
      return;
    }

    if ((profile.credits ?? 0) < creditsNeeded) {
      showAlert(`Você precisa de ${creditsNeeded} créditos para liberar todas as casas.`);
      return;
    }

    setUnlockingAll(true);

    try {
      const remainingCredits = profile.credits - creditsNeeded;

      const [{ error: profileError }, { error: consultationError }, { error: transactionError }] = await Promise.all([
        supabase
          .from("profiles")
          .update({ credits: remainingCredits })
          .eq("user_id", user.id),
        supabase
          .from("consultations")
          .update({ houses_unlocked: TOTAL_HOUSES })
          .eq("id", consultation.id)
          .eq("user_id", user.id),
        supabase
          .from("credit_transactions")
          .insert({
            user_id: user.id,
            amount: -creditsNeeded,
            type: "unlock_houses",
            consultation_id: consultation.id,
            description: "Desbloqueio de todas as casas do dashboard",
          }),
      ]);

      if (profileError || consultationError || transactionError) {
        throw profileError || consultationError || transactionError;
      }

      setConsultation((prev) => (prev ? { ...prev, houses_unlocked: TOTAL_HOUSES } : prev));
      await refreshProfile();
      showAlert("Mapa completo desbloqueado com sucesso.");
    } catch (error) {
      console.error(error);
      showAlert("Falha ao desbloquear as casas. Tente novamente.");
    } finally {
      setUnlockingAll(false);
    }
  };

  if (loading) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary font-cinzel text-xl animate-pulse">Carregando mapa estelar...</div>
        </div>
      </>
    );
  }

  if (!consultation) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4">Nenhuma Consulta Encontrada</h2>
          <p className="text-muted-foreground text-sm mb-8">Calcule sua primeira rota estelar para ver o dashboard.</p>
          <button onClick={() => navigate("/")} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest">
            Calcular Rota
          </button>
        </div>
      </>
    );
  }

  const goalHouse = consultation.goal;
  const creditsNeededToUnlockAll = Math.max(0, TOTAL_HOUSES - consultation.houses_unlocked);
  const hasEnoughCreditsForUnlockAll = (profile?.credits ?? 0) >= creditsNeededToUnlockAll;
  const oracleText = consultation.result?.oraculo
    || (goalHouse
      ? (consultation.mode === "passado" ? fallbackOraclesPast[goalHouse] : fallbackOraclesFuture[goalHouse])
      : null);

  return (
    <>
      <StarryBackground />
      {user && <UserMenu />}
      <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors">
            ← Nova Consulta
          </button>
          <button onClick={() => navigate("/credits")} className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
            {profile?.credits ?? 0} Créditos
          </button>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">Mapa Calculado</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase tracking-wider">
            Revolução Solar {consultation.year}
          </h1>
          <p className="text-muted-foreground text-sm font-light">{consultation.name}</p>
          {goalHouse && (
            <p className="text-primary/70 text-xs mt-2 uppercase tracking-widest">
              Casa-alvo: {goalHouse} — {cityDatabase[goalHouse]?.label}
            </p>
          )}
        </motion.div>

        {/* Oracle Text */}
        {oracleText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3 text-center">
              🔮 Oráculo do Mestre Astrólogo
            </p>
            <p className="text-foreground/80 text-sm italic leading-relaxed text-center font-light">
              "{oracleText}"
            </p>
          </motion.div>
        )}

        {/* Selected House Detail (shows above grid) */}
        <AnimatePresence>
          {selectedHouse && (() => {
            const house = cityDatabase[selectedHouse];
            const result = getHouseResult(selectedHouse);
            if (!house) return null;
            return (
              <HouseDetail
                house={house}
                result={result}
                onClose={() => setSelectedHouse(null)}
              />
            );
          })()}
        </AnimatePresence>

        {/* Houses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {Array.from({ length: TOTAL_HOUSES }, (_, i) => i + 1).map((houseNum) => {
            const house = cityDatabase[houseNum];
            const result = getHouseResult(houseNum);
            const locked = isHouseLocked(houseNum);
            const isGoal = goalHouse === houseNum;
            const isSelected = selectedHouse === houseNum;

            return (
              <HouseCard
                key={houseNum}
                houseNum={houseNum}
                house={house}
                result={result}
                locked={locked}
                isGoal={isGoal}
                isSelected={isSelected}
                onSelect={() => setSelectedHouse(isSelected ? null : houseNum)}
              />
            );
          })}
        </div>

        {/* Unlock More CTA */}
        {consultation.houses_unlocked < TOTAL_HOUSES && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-8 max-w-lg mx-auto">
              <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-2">
                Desbloqueie Mais Casas
              </h3>
              <p className="text-muted-foreground text-xs font-light mb-6">
                Você está vendo {consultation.houses_unlocked} de {TOTAL_HOUSES} casas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleUnlockAllHouses}
                  disabled={unlockingAll || !hasEnoughCreditsForUnlockAll}
                  className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unlockingAll
                    ? "Desbloqueando..."
                    : hasEnoughCreditsForUnlockAll
                      ? `Desbloquear tudo (${creditsNeededToUnlockAll} crédito${creditsNeededToUnlockAll > 1 ? "s" : ""})`
                      : `Faltam ${Math.max(0, creditsNeededToUnlockAll - (profile?.credits ?? 0))} créditos`}
                </button>
                <button
                  onClick={() => navigate("/credits")}
                  className="px-6 py-3.5 rounded-xl border border-primary/25 bg-card/40 text-foreground font-bold text-xs uppercase tracking-[0.14em] hover:border-primary/40 transition-all"
                >
                  Comprar Créditos
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
