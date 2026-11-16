import React, { useEffect, useState } from "react";

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Root error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#050507] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md rounded-2xl border border-[#F5B041]/25 bg-white/[0.03] p-6 backdrop-blur-xl space-y-4">
            <h2 className="font-ps-display text-xl font-bold text-[#FFF3D1]">
              Não foi possível exibir esta visualização
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              {this.state.error?.message || "Ocorreu um erro inesperado ao renderizar seu mapa."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#C9A227] text-[#050507] font-bold text-xs uppercase tracking-widest"
            >
              Recarregar Mapa
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Compass, Crown, Scroll } from "lucide-react";
import { toast } from "sonner";
import StarryBackground from "@/components/StarryBackground";

import DestinyResults from "@/pages/AppleResultPreviewV3";
import PageLoader from "@/components/PageLoader";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { usePricing } from "@/hooks/usePricing";
import { useAlert } from "@/hooks/useAlert";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast, houseColors } from "@/data/houses";
import {
  TOTAL_HOUSES,
  FOCUS_AREA_METADATA,
  getConsultationGoalHouse,
  isHouseLockedByConsultation,
  getUnlockedHousesList,
  getHouseIntendedFocusId,
  computeAllFocusesCost,
  computeRemainingFullMapCost,
  buildFullMapUnlockedFocuses,
} from "@/lib/consultationUnlocks";


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
  results?: Record<string, HouseResult>;
  oraculo?: string;
  house?: number | string;
  goal_house?: number | string;
  goalHouse?: number | string;
  casa?: number | string;
  full_map_unlocked?: boolean;
  unlocked_houses_list?: number[];
  unlocked_focuses?: Record<string, string[]>;
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
  birthdate?: string;
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

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { getCost } = usePricing();
  const costFocus = getCost("cost_focus", 1);
  const costAllFocuses = getCost("cost_all_focuses", 3);
  const costHouse = getCost("cost_house_1", 1);
  const costFull = getCost("cost_full_map", 7);
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

  const handleUnlockFocus = async (focusId: string, houseNum: number): Promise<boolean> => {
    if (!user || !profile || !consultation || unlocking) return false;

    const existingHouseFocuses = consultation.result?.unlocked_focuses?.[String(houseNum)] || [];
    const currentGoalHouse = getConsultationGoalHouse(consultation);
    const intendedFocusForHouse = getHouseIntendedFocusId(consultation.intent, houseNum, currentGoalHouse);
    if (existingHouseFocuses.includes(focusId) || intendedFocusForHouse === focusId) {
      return true;
    }

    const isFirstFreeFocus = !intendedFocusForHouse && existingHouseFocuses.length === 0;

    if (!isAdmin && !isFirstFreeFocus && credits < costFocus) {
      showAlert(`Você precisa de ${costFocus} crédito${costFocus > 1 ? "s" : ""} para desbloquear este Foco.`);
      navigate(`/credits?pkg=1&returnTo=${encodeURIComponent(`/dashboard?id=${consultation.id}`)}`);
      return false;
    }

    setUnlocking(true);
    try {
      if (!isAdmin && !isFirstFreeFocus) {
        const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
          p_amount: costFocus,
          p_description: `Desbloqueio de Foco: ${focusId} (Casa ${houseNum})`,
          p_type: "deduction"
        });
        if (chargeErr || !chargeSuccess) throw new Error(chargeErr?.message || "Erro ao debitar créditos");
      }

      const currentResult = consultation.result || {};
      const currentUnlockedFocuses = { ...(currentResult.unlocked_focuses || {}) };
      const houseFocuses = [...(currentUnlockedFocuses[String(houseNum)] || [])];

      if (!houseFocuses.includes(focusId)) {
        houseFocuses.push(focusId);
      }
      currentUnlockedFocuses[String(houseNum)] = houseFocuses;

      const newResult = { ...currentResult, unlocked_focuses: currentUnlockedFocuses };

      const { error: updateErr } = await supabase
        .from("consultations")
        .update({ result: newResult as any })
        .eq("id", consultation.id);

      if (updateErr) throw new Error("Erro ao salvar foco escolhido.");

      setConsultation((prev) => (prev ? { ...prev, result: newResult } : null));
      if (!isAdmin && !isFirstFreeFocus) {
        await refreshProfile();
      }
      toast.success(isFirstFreeFocus ? "Foco principal escolhido e ativado!" : "Foco ativado com sucesso!");
      return true;
    } catch (err: any) {
      showAlert(err?.message || "Erro ao ativar foco.");
      return false;
    } finally {
      setUnlocking(false);
    }
  };

  const handleUnlockAllFocuses = async (allFocusIds: string[], houseNum: number): Promise<boolean> => {
    if (!user || !profile || !consultation || unlocking) return false;

    const currentGoalHouse = getConsultationGoalHouse(consultation);
    const intendedFocusForHouse = getHouseIntendedFocusId(consultation.intent, houseNum, currentGoalHouse);
    const existingHouseFocuses = consultation.result?.unlocked_focuses?.[String(houseNum)] || [];
    const targetIds = allFocusIds.length > 0 ? allFocusIds : FOCUS_AREA_METADATA.map((f) => f.id);
    const openFocusSet = new Set([
      ...existingHouseFocuses,
      ...(intendedFocusForHouse ? [intendedFocusForHouse] : []),
    ]);
    const remainingLockedCount = targetIds.filter((id) => !openFocusSet.has(id)).length;

    if (remainingLockedCount <= 0) return true;

    const effectiveFocusCap = !isHouseLockedByConsultation(consultation, houseNum)
      ? Math.min(costAllFocuses, 2)
      : costAllFocuses;
    const requiredCredits = computeAllFocusesCost(remainingLockedCount, costFocus, effectiveFocusCap);

    if (!isAdmin && credits < requiredCredits) {
      showAlert("Ative o Pacote Expansão para liberar a Casa escolhida com todos os Focos desbloqueados.");
      navigate(`/credits?pkg=3&returnTo=${encodeURIComponent(`/dashboard?id=${consultation.id}`)}`);
      return false;
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
      const currentUnlockedFocuses = { ...(currentResult.unlocked_focuses || {}) };
      currentUnlockedFocuses[String(houseNum)] = Array.from(
        new Set([...targetIds, ...(intendedFocusForHouse ? [intendedFocusForHouse] : [])])
      );

      const newResult = { ...currentResult, unlocked_focuses: currentUnlockedFocuses };

      const { error: updateErr } = await supabase
        .from("consultations")
        .update({ result: newResult as any })
        .eq("id", consultation.id);

      if (updateErr) throw new Error("Erro ao salvar desbloqueio.");

      setConsultation((prev) => (prev ? { ...prev, result: newResult } : null));
      if (!isAdmin) {
        await refreshProfile();
      }
      toast.success("Todos os focos desta Casa foram ativados!");
      return true;
    } catch (err: any) {
      showAlert(err?.message || "Erro ao desbloquear.");
      return false;
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

  const handleUnlock = async (targetHouse: number): Promise<boolean> => {
    if (!user || !profile || !consultation || unlocking) return false;

    const isUnlockAll = targetHouse === 0;
    const currentUnlockedCount = getUnlockedHousesList(consultation).length;
    const upgradeToFullCost = computeRemainingFullMapCost(currentUnlockedCount, costFull, costHouse);
    const requiredCredits = isUnlockAll ? upgradeToFullCost : costHouse;

    if (!isUnlockAll && !isHouseLockedByConsultation(consultation, targetHouse)) {
      setSelectedHouse(targetHouse);
      showAlert("Esta casa já está desbloqueada.");
      return true;
    }

    if (!isAdmin && credits < requiredCredits) {
      showAlert(`Você precisa de ${requiredCredits} crédito${requiredCredits > 1 ? "s" : ""} para esta liberação.`);
      const ret = encodeURIComponent(`/dashboard?id=${consultation.id}`);
      navigate(isUnlockAll ? `/credits?pkg=full&returnTo=${ret}` : `/credits?pkg=1&returnTo=${ret}`);
      return false;
    }

    setUnlocking(true);

    try {
      if (isUnlockAll) {
        const allTwelve = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const fullFocusesMap = buildFullMapUnlockedFocuses();
        const { error: fullRpcError } = await supabase.rpc("unlock_full_map_v1", {
          p_consultation_id: consultation.id,
        });

        if (fullRpcError) {
          const msg = String(fullRpcError.message || "");
          const code = String((fullRpcError as { code?: string }).code || "");
          const isMissingRpc =
            code === "42883" ||
            code === "PGRST202" ||
            msg.includes("Could not find the function") ||
            msg.includes("does not exist");

          if (!isMissingRpc) {
            throw fullRpcError;
          }

          // Graceful client fallback while remote DB awaits unlock_full_map_v1 migration
          if (!isAdmin) {
            const { data: chargeSuccess, error: chargeErr } = await supabase.rpc("charge_credits", {
              p_amount: requiredCredits,
              p_description: "Desbloqueio do Mapa Completo (12 Casas + Todos os Focos)",
              p_type: "cost_full_map",
            });
            if (chargeErr || !chargeSuccess) {
              throw new Error(chargeErr?.message || "Erro ao debitar créditos do Mapa Completo.");
            }
          }

          const currentResult = (consultation.result || {}) as Record<string, any>;
          const newResult = {
            ...currentResult,
            full_map_unlocked: true,
            all_focuses_unlocked: true,
            unlocked_houses_list: allTwelve,
            unlocked_focuses: fullFocusesMap,
          };

          const { error: updateErr } = await supabase
            .from("consultations")
            .update({ result: newResult as any })
            .eq("id", consultation.id);

          if (updateErr) throw updateErr;

          setConsultation((prev) =>
            prev
              ? {
                  ...prev,
                  houses_unlocked: 12,
                  unlocked_houses: allTwelve,
                  result: newResult as ApiResult,
                }
              : null
          );
        } else {
          const { data: refreshedConsultation } = await supabase
            .from("consultations")
            .select("*")
            .eq("id", consultation.id)
            .single();

          const baseRefreshedResult = ((refreshedConsultation as any)?.result || consultation.result || {}) as Record<string, any>;
          const mergedResult = {
            ...baseRefreshedResult,
            full_map_unlocked: true,
            all_focuses_unlocked: true,
            unlocked_houses_list: allTwelve,
            unlocked_focuses: fullFocusesMap,
          };

          if (!(baseRefreshedResult as any)?.all_focuses_unlocked) {
            await supabase
              .from("consultations")
              .update({ result: mergedResult as any })
              .eq("id", consultation.id);
          }

          if (refreshedConsultation) {
            setConsultation({
              ...(refreshedConsultation as unknown as ConsultationRow),
              houses_unlocked: 12,
              unlocked_houses: allTwelve,
              result: mergedResult as ApiResult,
            });
          } else {
            setConsultation((prev) =>
              prev
                ? {
                    ...prev,
                    houses_unlocked: 12,
                    unlocked_houses: allTwelve,
                    result: mergedResult as ApiResult,
                  }
                : null
            );
          }
        }

        if (!isAdmin) {
          await refreshProfile();
        }
        toast.success("Mapa Completo desbloqueado! Todas as 12 Casas + Todos os Focos estão livres.");
        return true;
      } else {
        const { error: rpcError } = await supabase.rpc("unlock_consultation_houses", {
          p_consultation_id: consultation.id,
          p_target_house: targetHouse
        });

        if (rpcError) throw rpcError;

        const { data: refreshedConsultation, error: fetchError } = await supabase
          .from("consultations")
          .select("*")
          .eq("id", consultation.id)
          .single();

        if (fetchError) throw fetchError;

        setConsultation(refreshedConsultation as unknown as ConsultationRow);
        if (!isAdmin) {
          await refreshProfile();
        }
        toast.success(`Casa ${targetHouse} desbloqueada com sucesso.`);
        setSelectedHouse(targetHouse);
        return true;
      }
    } catch (error: any) {
      console.error(error);
      showAlert(error?.message || "Falha ao desbloquear. Tente novamente.");
      return false;
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
  const unlockedHousesList = getUnlockedHousesList(consultation);
  const actualUnlockedCount = unlockedHousesList.length;
  const remainingFullMapCost = computeRemainingFullMapCost(actualUnlockedCount, costFull, costHouse);
  const credits = profile?.credits ?? 0;

  const oracleText = consultation.result?.oraculo
    || (goalHouse
      ? (currentMode === "passado" ? fallbackOraclesPast[goalHouse] : fallbackOraclesFuture[goalHouse])
      : null);

  // Se existe uma casa selecionada, o componente V3 (DestinyResults) assume 100% da tela.
  if (selectedHouse && cityDatabase[selectedHouse]) {
    const house = cityDatabase[selectedHouse];
    const result = getHouseResult(selectedHouse);
    const toArr = (v: any): CityOption[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.filter(Boolean);
      return [v];
    };
    const htArr = toArr(result?.options?.highticket);
    const acArr = toArr(result?.options?.acessivel);
    const naArr = toArr(result?.options?.nacional);
    const seen = new Set<string>();
    const dedup = (arr: CityOption[]): CityOption[] => arr.filter((c) => {
      if (!c) return false;
      const k = `${c.city}|${c.country}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const highticket: CityOption[] = dedup(htArr);
    const acessivel: CityOption[] = dedup(acArr);
    const nacional: CityOption[] = dedup(naArr);

    const houseFocuses = consultation.result?.unlocked_focuses?.[String(selectedHouse)] || [];
    const intendedFocusForHouse = getHouseIntendedFocusId(consultation.intent, selectedHouse, goalHouse);
    const openFocusCount = new Set([
      ...houseFocuses,
      ...(intendedFocusForHouse ? [intendedFocusForHouse] : []),
    ]).size;
    const lockedFocusCount = Math.max(0, FOCUS_AREA_METADATA.length - openFocusCount);
    const effectiveFocusCap = !isHouseLocked(selectedHouse) ? Math.min(costAllFocuses, 2) : costAllFocuses;
    const smartAllFocusesCost = computeAllFocusesCost(lockedFocusCount, costFocus, effectiveFocusCap);

    const canApplyFullMapPass = actualUnlockedCount < 12 && credits >= remainingFullMapCost;
    const canApplyExpansaoPass = !canApplyFullMapPass && lockedFocusCount > 0 && credits >= smartAllFocusesCost && smartAllFocusesCost >= 2;

    return (
      <>
        {(canApplyFullMapPass || canApplyExpansaoPass) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-[#071122]/95 border border-[#C9A227]/60 backdrop-blur-xl shadow-[0_16px_45px_rgba(0,0,0,0.75)]">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-[#F5DE98]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5DE98]">
                    {canApplyFullMapPass ? "Passe Mapa Completo Disponível" : "Passe Expansão Disponível"}
                  </p>
                  <p className="text-xs text-white/75">
                    {canApplyFullMapPass
                      ? "Libere todas as 12 Casas + Todos os Focos nesta consulta com 1 toque."
                      : `Libere todos os 8 Focos da Casa ${selectedHouse} nesta consulta.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={unlocking}
                onClick={() =>
                  canApplyFullMapPass
                    ? handleUnlock(0)
                    : handleUnlockAllFocuses(FOCUS_AREA_METADATA.map((f) => f.id), selectedHouse)
                }
                className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-[11px] uppercase tracking-[0.16em] transition-all active:scale-95"
              >
                {unlocking ? "Liberando..." : "Ativar Agora"}
              </button>
            </div>
          </div>
        )}
        <DestinyResults
          birthDate={consultation.birthdate}
          birthTime={(consultation as any).birthtime}
          userName={consultation.name || profile?.display_name || undefined}
          originName={consultation.origin || undefined}
          targetYear={consultation.year}
          returnTimeUtc={(consultation.result as any)?.return_time_utc || undefined}
          returnDate={(consultation.result as any)?.return_date || undefined}
          sunSign={(consultation.result as any)?.sun_sign || undefined}
          ascendantSign={(consultation.result as any)?.ascendant || undefined}
          birthPlace={consultation.birth_place}
          intent={consultation.intent}
          goalHouse={goalHouse}
          house={selectedHouse}
          houseName={house.label}
          houseData={house}
          cities={{ highticket, acessivel, nacional }}
          allResults={consultation.result?.results}
          unlockedFocuses={consultation.result?.unlocked_focuses}
          unlockedHousesList={unlockedHousesList}
          userCredits={credits}
          isAdmin={isAdmin}
          isAuthenticated={!!user}
          consultationId={consultation.id}
          autoUnlocked={true}
          onUnlock={(n) => handleUnlock(n)}
          onUnlockFocus={(fid, hNum) => handleUnlockFocus(fid, hNum)}
          onUnlockAllFocuses={(allIds, hNum) => handleUnlockAllFocuses(allIds, hNum)}
          focusCostLabel={`${costFocus} Crédito${costFocus > 1 ? "s" : ""}`}
          allFocusesCostLabel={`${smartAllFocusesCost} Crédito${smartAllFocusesCost > 1 ? "s" : ""}`}
          embedded={false}
          isHouseUnlocked={(h) => !isHouseLocked(h)}
          onSelectHouse={(h) => setSelectedHouse(h)}
          onNavigateCredits={(pkg) =>
            navigate(`/credits?${pkg ? `pkg=${pkg}&` : ""}returnTo=${encodeURIComponent(`/dashboard?id=${consultation.id}`)}`)
          }
          mode={currentMode}
          unlockedCount={actualUnlockedCount}
          fullMapCost={remainingFullMapCost}
          houseCost={costHouse}
          focusCost={costFocus}
          allFocusesCost={smartAllFocusesCost}
        />
      </>
    );
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
          <button
            onClick={() => navigate(`/credits?returnTo=${encodeURIComponent(`/dashboard?id=${consultation.id}`)}`)}
            className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold"
          >
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
    </>

  );
};

export default Dashboard;

