import React, { useEffect, useState } from "react";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Root error:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{background:'red', color:'white', padding:50}}>ROOT CRASH: {this.state.error?.toString()}</div>;
    }
    return this.props.children;
  }
}

import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Compass, Crown, Scroll } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";

import HouseCard from "@/components/HouseCard";
import HouseDetail from "@/components/HouseDetail";
import DestinyResults from "@/pages/AppleResultPreviewV3";
import ConfirmCreditAction from "@/components/ConfirmCreditAction";
import PageLoader from "@/components/PageLoader";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { usePricing } from "@/hooks/usePricing";
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
  unlocked_houses: number[];
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
  if (consultation.unlocked_houses?.includes(houseNum)) return false;

  const unlockedCount = Math.max(consultation.houses_unlocked, 0);
  const goalHouse = getConsultationGoalHouse(consultation);

  if (unlockedCount >= TOTAL_HOUSES) return false;
  if (goalHouse && houseNum === goalHouse) return false;
  if (goalHouse && unlockedCount <= 1) return houseNum !== goalHouse;
  return houseNum > unlockedCount;
};

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { getCost, loading: pricingLoading } = usePricing();
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
    window.scrollTo(0, 0);
  }, [consultationId]);

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
  }, [consultation?.id, consultation?.goal, consultation?.houses_unlocked, consultation?.unlocked_houses, consultation?.result]);

  const handleUnlockFocus = async (focusId: string, houseNum: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    if (!isAdmin && credits < 1) {
      showAlert(`Você não tem créditos suficientes. Adquira mais no menu.`);
      navigate("/credits");
      throw new Error("Sem créditos");
    }

    setUnlocking(true);
    try {
      if (!isAdmin) {
        const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
          p_amount: 1,
          p_description: `Desbloqueio de Foco: ${focusId} (Casa ${houseNum})`,
          p_type: "deduction"
        });
        if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
      }

      // Save to database
      const currentResult = consultation.result || {};
      const currentUnlockedFocuses = currentResult.unlocked_focuses || {};
      const houseFocuses = currentUnlockedFocuses[String(houseNum)] || [];
      
      if (!houseFocuses.includes(focusId)) {
        houseFocuses.push(focusId);
      }
      currentUnlockedFocuses[String(houseNum)] = houseFocuses;
      
      const newResult = { ...currentResult, unlocked_focuses: currentUnlockedFocuses };
      
      const { error: updateErr } = await supabase
        .from("consultations")
        .update({ result: newResult })
        .eq("id", consultation.id);
        
      if (updateErr) throw new Error("Erro ao salvar desbloqueio.");
      
      // Update local state
      setConsultation(prev => prev ? { ...prev, result: newResult } : null);
      if (!isAdmin) {
         setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      }
      showAlert("Foco ativado com sucesso!", "success");
    } catch (err: any) {
      showAlert(err.message || "Erro ao desbloquear.");
      throw err;
    } finally {
      setUnlocking(false);
    }
  };

  const handleUnlockAllFocuses = async (allFocusIds: string[], houseNum: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const requiredCredits = getCost("cost_all_focuses", 3);

    if (!isAdmin && credits < requiredCredits) {
      showAlert(`Você precisa de ${requiredCredits} créditos. Adquira mais no menu.`);
      navigate("/credits");
      throw new Error("Sem créditos");
    }

    setUnlocking(true);
    try {
      if (!isAdmin) {
        const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
          p_amount: requiredCredits,
          p_description: `Desbloqueio de Todos os Focos (Casa ${houseNum})`,
          p_type: "cost_all_focuses"
        });
        if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
      }

      const currentResult = consultation.result || {};
      const currentUnlockedFocuses = currentResult.unlocked_focuses || {};
      currentUnlockedFocuses[String(houseNum)] = allFocusIds;
      
      const newResult = { ...currentResult, unlocked_focuses: currentUnlockedFocuses };
      
      const { error: updateErr } = await supabase
        .from("consultations")
        .update({ result: newResult })
        .eq("id", consultation.id);
        
      if (updateErr) throw new Error("Erro ao salvar desbloqueio.");
      
      setConsultation(prev => prev ? { ...prev, result: newResult } : null);
      await refreshProfile();
      showAlert("Todos os focos desta Casa foram ativados!", "success");
    } catch (err: any) {
      showAlert(err.message || "Erro ao desbloquear.");
      throw err;
    } finally {
      setUnlocking(false);
    }
  };

  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return isHouseLockedByConsultation(consultation, houseNum);
  };

  const getHouseResult = (houseNum: number): HouseResult | null => {
    if (!consultation?.result?.results) return null;
    return consultation.result.results[String(houseNum)] || null;
  };

  const handleUnlock = async (targetHouse: number) => {
    if (!user || !profile || !consultation || unlocking) return;

    const isUnlockAll = targetHouse === 0;
    const requiredCredits = isUnlockAll ? 7 : 1;

    if (!isAdmin && credits < requiredCredits) {
      showAlert(`Você não tem créditos suficientes. Adquira mais no menu.`);
      navigate("/credits");
      return;
    }

    if (!isUnlockAll && !isHouseLockedByConsultation(consultation, targetHouse)) {
      showAlert("Esta casa já está desbloqueada.");
      return;
    }

    setUnlocking(true);

    try {
      if (isUnlockAll) {
         if (!isAdmin) {
            // Debit 7 credits manually
            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
               p_amount: 7,
               p_description: "Visão 360 Completa - Desbloqueio de 12 Casas",
               p_type: "deduction"
            });
            if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
         }
         
         // Update all 12 houses
         const allHouses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
         const { error: updateError } = await supabase
          .from("consultations")
          .update({ unlocked_houses: allHouses })
          .eq("id", consultation.id);
         if (updateError) throw updateError;
      } else {
        if (isAdmin) {
          const newUnlocked = consultation.unlocked_houses ? [...consultation.unlocked_houses, targetHouse] : [targetHouse];
          const { error: updateError } = await supabase
            .from("consultations")
            .update({ unlocked_houses: Array.from(new Set(newUnlocked)) })
            .eq("id", consultation.id);
          if (updateError) throw updateError;
        } else {
          const { error: rpcError } = await supabase.rpc("unlock_consultation_houses", {
            p_consultation_id: consultation.id,
            p_target_house: targetHouse
          });
          if (rpcError) throw rpcError;
        }
      }

      const { data: refreshedConsultation, error: fetchError } = await supabase
        .from("consultations")
        .select("*")
        .eq("id", consultation.id)
        .single();

      if (fetchError) throw fetchError;

      setConsultation(refreshedConsultation as ConsultationRow);
      await refreshProfile();
      if (isUnlockAll) {
        showAlert(`Visão 360 desbloqueada com sucesso!`);
      } else {
        showAlert(`Casa ${targetHouse} desbloqueada com sucesso.`);
        setSelectedHouse(targetHouse);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error(error);
      showAlert(error.message || "Falha ao desbloquear. Tente novamente.");
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

  // Se existe uma casa selecionada, o componente V3 (DestinyResults) assume 100% da tela.
  if (selectedHouse) {
    const house = cityDatabase[selectedHouse];
    const result = getHouseResult(selectedHouse);
    if (house && result) {
      const toArr = (v: any): CityOption[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean);
        return [v];
      };
      const htArr = toArr(result.options?.highticket);
      const acArr = toArr(result.options?.acessivel);
      const naArr = toArr(result.options?.nacional);
      const masterCity = result.city || htArr[0] || acArr[0] || naArr[0] || null;
      const seen = new Set<string>();
      const dedup = (arr: CityOption[]): CityOption[] => arr.filter(c => {
        if (!c) return false;
        const k = `${c.city}|${c.country}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (masterCity) seen.add(`${masterCity.city}|${masterCity.country}`);
      const highticket: CityOption[] = masterCity ? [masterCity, ...dedup(htArr)] : dedup(htArr);
      const acessivel: CityOption[] = dedup(acArr);
      const nacional: CityOption[] = dedup(naArr);

      return (
        <>
          <DestinyResults
            intent={consultation.intent}
            house={selectedHouse}
            houseName={house.label}
            houseData={house}
            cities={{ highticket, acessivel, nacional }}
            allResults={consultation.result?.results}
            userCredits={credits}
            isAuthenticated={!!user}
            consultationId={consultation.id}
            autoUnlocked={true}
            onUnlock={(n) => handleUnlock(n)}
            onUnlockFocus={(fid, hNum) => handleUnlockFocus(fid, hNum)}
            onUnlockAllFocuses={(allIds, hNum) => handleUnlockAllFocuses(allIds, hNum)}
            focusCostLabel={`${getCost("cost_focus", 1)} Crédito${getCost("cost_focus", 1) > 1 ? "s" : ""}`}
            allFocusesCostLabel={`${getCost("cost_all_focuses", 3)} Créditos`}
            unlockedFocuses={consultation.result?.unlocked_focuses || {}}
            embedded={false}
            isHouseUnlocked={isHouseLocked ? (h) => !isHouseLocked(h) : undefined}
            onSelectHouse={(h) => setSelectedHouse(h)}
            mode={currentMode}
            unlockedCount={consultation.houses_unlocked}
          />
          <ConfirmCreditAction
            open={pendingUnlock !== null}
            onOpenChange={(o) => { if (!o) setPendingUnlock(null); }}
            onConfirm={() => {
              const n = pendingUnlock;
              setPendingUnlock(null);
              if (n) handleUnlock(n);
            }}
            title={pendingUnlock ? `Desbloquear Casa ${pendingUnlock}` : ""}
            description={pendingUnlock ? `Você está prestes a desbloquear a Casa ${pendingUnlock} desta consulta.` : undefined}
            credits={1}
            currentBalance={credits}
            confirmLabel="Desbloquear agora"
            loading={unlocking}
          />
        </>
      );
    }
  }

  return (
    <>
      <StarryBackground />

      <div className="min-h-[100dvh] px-4 py-8 max-w-7xl mx-auto relative z-10">
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
        {!selectedHouse && (() => {
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
                    <span className="text-foreground font-ps-display font-bold text-sm">
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
        {!selectedHouse && oracleText && (
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

        


      </div>

      <ConfirmCreditAction
        open={pendingUnlock !== null}
        onOpenChange={(o) => { if (!o) setPendingUnlock(null); }}
        onConfirm={() => {
          const n = pendingUnlock;
          setPendingUnlock(null);
          if (n) handleUnlock(n);
        }}
        title={`Desbloquear Casa ${pendingUnlock}`}
        description={
          pendingUnlock
            ? `Você está prestes a desbloquear a Casa ${pendingUnlock} desta consulta.`
            : undefined
        }
        credits={1}
        currentBalance={credits}
        confirmLabel="Desbloquear agora"
        loading={unlocking}
      />
    </>

  );
};

export default Dashboard;

