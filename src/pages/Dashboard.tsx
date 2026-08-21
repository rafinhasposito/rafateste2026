import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Compass, Crown, Scroll } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";

import HouseCard from "@/components/HouseCard";
import HouseDetail from "@/components/HouseDetail";
import DestinyResults from "@/components/DestinyResults";
import ConfirmCreditAction from "@/components/ConfirmCreditAction";
import PageLoader from "@/components/PageLoader";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast, houseColors } from "@/data/houses";


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
  house?: number | string;
  goal_house?: number | string;
  goalHouse?: number | string;
  casa?: number | string;
}

interface ConsultationRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  intent: string | null;
  origin: string | null;
  birth_place: string;
  houses_unlocked: number;
  result: ApiResult | null;
  created_at: string;
}

function extractAccentColor(house: number | null): string {
  if (!house) return "255, 215, 0";
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
}

function inferSearchType(c: { origin: string | null; intent: string | null }): { label: string; Icon: typeof Compass } {
  if (c.origin) return { label: "Por Cidade", Icon: Compass };
  if (c.intent) return { label: "Por Intenção", Icon: Scroll };
  return { label: "Por Casa", Icon: Crown };
}

const TOTAL_HOUSES = 12;

const parseHouseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= TOTAL_HOUSES) return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= TOTAL_HOUSES) return parsed;
  }
  return null;
};

const getConsultationGoalHouse = (consultation: ConsultationRow | null): number | null => {
  if (!consultation) return null;
  return (
    parseHouseNumber(consultation.goal)
    ?? parseHouseNumber(consultation.result?.house)
    ?? parseHouseNumber(consultation.result?.goal_house)
    ?? parseHouseNumber(consultation.result?.goalHouse)
    ?? parseHouseNumber(consultation.result?.casa)
  );
};

const isHouseLockedByConsultation = (consultation: ConsultationRow, houseNum: number) => {
  const unlockedCount = Math.max(consultation.houses_unlocked, 0);
  const goalHouse = getConsultationGoalHouse(consultation);

  if (unlockedCount >= TOTAL_HOUSES) return false;
  if (goalHouse && houseNum === goalHouse) return false;
  if (goalHouse && unlockedCount <= 1) return houseNum !== goalHouse;
  return houseNum > unlockedCount;
};

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const consultationId = searchParams.get("id");
  const unlockParam = searchParams.get("unlock");

  const [consultation, setConsultation] = useState<ConsultationRow | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [autoUnlockDone, setAutoUnlockDone] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState<number | null>(null);


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

  // Auto-select goal house or first unlocked
  useEffect(() => {
    if (!consultation) {
      setSelectedHouse(null);
      return;
    }
    const resolvedGoalHouse = getConsultationGoalHouse(consultation);
    if (resolvedGoalHouse && !isHouseLockedByConsultation(consultation, resolvedGoalHouse)) {
      setSelectedHouse(resolvedGoalHouse);
      return;
    }
    const firstUnlocked = Array.from({ length: TOTAL_HOUSES }, (_, i) => i + 1).find(
      (h) => !isHouseLockedByConsultation(consultation, h)
    ) ?? null;
    setSelectedHouse(firstUnlocked);
  }, [consultation?.id, consultation?.goal, consultation?.houses_unlocked, consultation?.result]);

  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return isHouseLockedByConsultation(consultation, houseNum);
  };

  const getHouseResult = (houseNum: number): HouseResult | null => {
    if (!consultation?.result?.results) return null;
    return consultation.result.results[String(houseNum)] || null;
  };

  const handleUnlock = async (amount: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const currentUnlocked = consultation.houses_unlocked;
    const targetUnlocked = Math.min(currentUnlocked + amount, TOTAL_HOUSES);
    const creditsNeeded = targetUnlocked - currentUnlocked;

    if (creditsNeeded <= 0) {
      showAlert("Essas casas já estão desbloqueadas.");
      return;
    }

    if ((profile.credits ?? 0) < creditsNeeded) {
      showAlert(`Você precisa de ${creditsNeeded} crédito${creditsNeeded > 1 ? "s" : ""}.`);
      return;
    }

    setUnlocking(true);

    try {
      const remainingCredits = (profile.credits ?? 0) - creditsNeeded;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ credits: remainingCredits })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      const { error: consultationError } = await supabase
        .from("consultations")
        .update({ houses_unlocked: targetUnlocked })
        .eq("id", consultation.id)
        .eq("user_id", user.id);

      if (consultationError) throw consultationError;

      await supabase
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          amount: -creditsNeeded,
          type: "unlock_houses",
          consultation_id: consultation.id,
          description: `Desbloqueio de +${creditsNeeded} casa${creditsNeeded > 1 ? "s" : ""}`,
        });

      setConsultation((prev) => (prev ? { ...prev, houses_unlocked: targetUnlocked } : prev));
      await refreshProfile();
      showAlert(`${creditsNeeded} casa${creditsNeeded > 1 ? "s" : ""} desbloqueada${creditsNeeded > 1 ? "s" : ""} com sucesso.`);
    } catch (error) {
      console.error(error);
      showAlert("Falha ao desbloquear. Tente novamente.");
    } finally {
      setUnlocking(false);
    }
  };

  // Auto-trigger unlock when arriving via /dashboard?id=…&unlock=N
  useEffect(() => {
    if (autoUnlockDone) return;
    if (!consultation || !profile || unlocking) return;
    if (!unlockParam) return;
    const n = parseInt(unlockParam, 10);
    if (!Number.isFinite(n) || n <= 0) return;
    setAutoUnlockDone(true);
    handleUnlock(n).finally(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("unlock");
      setSearchParams(next, { replace: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultation?.id, profile?.credits, unlockParam, autoUnlockDone]);

  if (loading) {
    return <PageLoader label="Carregando mapa estelar..." />;
  }

  if (!consultation) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-dvh flex items-center justify-center">
          <EmptyState
            icon={Compass}
            title="Nenhuma consulta encontrada"
            description="Calcule sua primeira rota estelar para ver o dashboard."
            action={{ label: "Calcular Rota", onClick: () => navigate("/") }}
          />
        </div>
      </>
    );
  }

  const goalHouse = getConsultationGoalHouse(consultation);
  const currentMode = (consultation.mode || "futuro") as "passado" | "presente" | "futuro";
  const lockedCount = Math.max(0, TOTAL_HOUSES - consultation.houses_unlocked);
  const credits = profile?.credits ?? 0;


  const oracleText = consultation.result?.oraculo
    || (goalHouse
      ? (currentMode === "passado" ? fallbackOraclesPast[goalHouse] : fallbackOraclesFuture[goalHouse])
      : null);

  // Unlock tier options
  const unlockOptions = [];
  if (lockedCount > 0) {
    if (lockedCount >= 1) unlockOptions.push({ amount: 1, label: "+1 Casa", cost: 1 });
    if (lockedCount >= 3) unlockOptions.push({ amount: 3, label: "+3 Casas", cost: 3 });
    if (lockedCount > 3) unlockOptions.push({ amount: lockedCount, label: `Todas (${lockedCount})`, cost: lockedCount });
    else if (lockedCount === 3) {
      // already have +3 option, skip "todas"
    } else if (lockedCount === 2) {
      unlockOptions.push({ amount: 2, label: "Todas (2)", cost: 2 });
    }
  }

  return (
    <>
      <StarryBackground />

      <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors">
            ← Nova Consulta
          </button>
          <button onClick={() => navigate("/credits")} className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
            {credits} Créditos
          </button>
        </div>

        {/* Header — Consultation Summary Card (mirrors History) */}
        {(() => {
          const isPast = currentMode === "passado";
          const accent = extractAccentColor(goalHouse);
          const searchType = inferSearchType(consultation);
          const SearchIcon = searchType.Icon;
          const houseLabel = goalHouse ? cityDatabase[goalHouse]?.label : null;
          const dt = new Date(consultation.created_at);
          const formattedDate = dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
          const formattedTime = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 md:p-6 mb-8 max-w-3xl mx-auto"
              style={{ borderLeft: `4px solid rgba(${accent}, 0.6)` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${
                      isPast
                        ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                        : currentMode === "presente"
                          ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                          : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                    }`}>
                      {isPast ? "Passado" : currentMode === "presente" ? "Presente" : "Futuro"}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-foreground/20 bg-foreground/5 text-foreground/60 flex items-center gap-1">
                      <SearchIcon className="w-2.5 h-2.5" />
                      {searchType.label}
                    </span>
                    <span className="text-foreground font-cinzel font-bold text-sm">
                      Revolução Solar {consultation.year}
                    </span>
                  </div>

                  <p className="text-foreground/80 text-sm mb-1">{consultation.name}</p>

                  {goalHouse && houseLabel && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${accent})` }} />
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: `rgb(${accent})` }}>
                        Casa {goalHouse} — {houseLabel}
                      </p>
                    </div>
                  )}

                  {consultation.origin && (
                    <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[11px]">{consultation.origin}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-[11px] shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formattedTime}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Oracle Text */}
        {oracleText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3 text-center">
              {currentMode === "passado" ? "Análise do Mestre Astrólogo" : "Oráculo do Mestre Astrólogo"}
            </p>
            <p className="text-foreground/80 text-sm italic leading-relaxed text-center font-light">
              "{oracleText}"
            </p>
          </motion.div>
        )}

        {/* Selected House Detail — unified DestinyResults layout */}
        <AnimatePresence>
          {selectedHouse && (() => {
            const house = cityDatabase[selectedHouse];
            const result = getHouseResult(selectedHouse);
            if (!house) return null;
            if (!result) {
              return (
                <HouseDetail
                  house={house}
                  result={result}
                  mode={currentMode}
                  isGoal={goalHouse === selectedHouse}
                  originCity={consultation.origin}
                  onClose={() => setSelectedHouse(null)}
                />
              );
            }
            // Convert single-option HouseResult → DestinyResults arrays.
            const master = result.city;
            const seen = new Set<string>();
            const push = (arr: CityOption[], c: CityOption | null | undefined) => {
              if (!c) return;
              const k = `${c.city}|${c.country}`;
              if (seen.has(k)) return;
              seen.add(k);
              arr.push(c);
            };
            const highticket: CityOption[] = [];
            const acessivel: CityOption[] = [];
            const nacional: CityOption[] = [];
            push(highticket, master);
            push(highticket, result.options.highticket);
            push(acessivel, result.options.acessivel);
            push(nacional, result.options.nacional);
            return (
              <div key={selectedHouse} className="mb-12">
                <DestinyResults
                  house={selectedHouse}
                  houseName={house.label}
                  houseData={house}
                  cities={{ highticket, acessivel, nacional }}
                  allResults={consultation.result?.results}
                  userCredits={credits}
                  isAuthenticated={!!user}
                  consultationId={consultation.id}
                  autoUnlocked
                  embedded
                  mode={currentMode}
                  isGoal={goalHouse === selectedHouse}
                  originCity={consultation.origin}
                />
              </div>
            );
          })()}
        </AnimatePresence>

        {/* Houses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
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

        {/* Unlock CTA */}
        {lockedCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-8 max-w-xl mx-auto">
              <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-2">
                Desbloqueie Mais Casas
              </h3>
              <p className="text-muted-foreground text-xs font-light mb-6">
                {consultation.houses_unlocked} de {TOTAL_HOUSES} casas visíveis · {credits} créditos disponíveis
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {unlockOptions.map((opt) => {
                  const canAfford = credits >= opt.cost;
                  const requiresConfirm = opt.cost >= 2;
                  return (
                    <button
                      key={opt.amount}
                      onClick={() => {
                        if (!canAfford) return;
                        if (requiresConfirm) setPendingUnlock(opt.amount);
                        else handleUnlock(opt.amount);
                      }}
                      disabled={unlocking || !canAfford}
                      className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {unlocking ? "Processando..." : `${opt.label} (${opt.cost} crédito${opt.cost > 1 ? "s" : ""})`}
                    </button>
                  );
                })}
                <button
                  onClick={() => navigate("/credits")}
                  className="px-5 py-3 rounded-xl border border-primary/25 bg-card/40 text-foreground font-bold text-xs uppercase tracking-[0.14em] hover:border-primary/40 transition-all"
                >
                  Comprar Créditos
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <ConfirmCreditAction
        open={pendingUnlock !== null}
        onOpenChange={(o) => { if (!o) setPendingUnlock(null); }}
        onConfirm={() => {
          const n = pendingUnlock;
          setPendingUnlock(null);
          if (n) handleUnlock(n);
        }}
        title="Desbloquear casas"
        description={
          pendingUnlock
            ? `Você está prestes a desbloquear ${pendingUnlock} casa${pendingUnlock > 1 ? "s" : ""} desta consulta.`
            : undefined
        }
        credits={pendingUnlock ?? 0}
        currentBalance={credits}
        confirmLabel="Desbloquear agora"
        loading={unlocking}
      />
    </>
  );
};

export default Dashboard;

