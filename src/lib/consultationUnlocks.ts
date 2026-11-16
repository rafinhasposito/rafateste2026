export const TOTAL_HOUSES = 12;

export const FOCUS_AREA_METADATA: ReadonlyArray<{ id: string; label: string }> = [
  { id: "dinheiro", label: "Dinheiro e Recursos" },
  { id: "trabalho", label: "Trabalho e Carreira" },
  { id: "identidade", label: "Identidade e Imagem" },
  { id: "rotina", label: "Rotina e Produtividade" },
  { id: "networking", label: "Networking e Conexões" },
  { id: "amor", label: "Amor e Relacionamento" },
  { id: "espiritual", label: "Espiritual e Propósito" },
  { id: "saude", label: "Saúde e Vitalidade" },
];

export interface ConsultationUnlockRecord {
  goal?: number | null;
  intent?: string | null;
  houses_unlocked?: number | null;
  unlocked_houses?: number[] | null;
  result?: {
    house?: number | string;
    goal_house?: number | string;
    goalHouse?: number | string;
    casa?: number | string;
    full_map_unlocked?: boolean;
    unlocked_houses_list?: number[];
    unlocked_focuses?: Record<string, string[]>;
  } | null;
}

const normalizeText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Resolves a stored `intent` to one of the 8 specific Focus IDs.
 * Descriptive house taglines (e.g. "A energia do Dinheiro...") intentionally return null
 * so UI and backend agree that the user still chooses their 1st included Focus.
 */
export const resolveIntentFocusId = (intent?: string | null): string | null => {
  if (!intent) return null;
  const norm = normalizeText(intent);
  if (!norm || norm.startsWith("a energia d")) return null;

  const exactId = FOCUS_AREA_METADATA.find((area) => area.id === norm);
  if (exactId) return exactId.id;

  const exactLabel = FOCUS_AREA_METADATA.find((area) => normalizeText(area.label) === norm);
  if (exactLabel) return exactLabel.id;

  return null;
};

export const parseHouseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= TOTAL_HOUSES) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= TOTAL_HOUSES) {
      return parsed;
    }
  }
  return null;
};

export const getConsultationGoalHouse = (consultation: ConsultationUnlockRecord | null): number | null => {
  if (!consultation) return null;
  return (
    parseHouseNumber(consultation.goal) ??
    parseHouseNumber(consultation.result?.house) ??
    parseHouseNumber(consultation.result?.goal_house) ??
    parseHouseNumber(consultation.result?.goalHouse) ??
    parseHouseNumber(consultation.result?.casa)
  );
};

export const isHouseLockedByConsultation = (
  consultation: ConsultationUnlockRecord,
  houseNum: number
): boolean => {
  if (consultation.result?.full_map_unlocked === true) return false;
  if (
    Array.isArray(consultation.result?.unlocked_houses_list) &&
    consultation.result.unlocked_houses_list.includes(houseNum)
  ) {
    return false;
  }
  if (consultation.unlocked_houses?.includes(houseNum)) return false;

  const unlockedCount = Math.max(consultation.houses_unlocked ?? 0, 0);
  const goalHouse = getConsultationGoalHouse(consultation);
  const hasExplicitList =
    (consultation.unlocked_houses?.length ?? 0) > 0 ||
    (consultation.result?.unlocked_houses_list?.length ?? 0) > 0;

  if (unlockedCount >= TOTAL_HOUSES) return false;
  if (goalHouse && houseNum === goalHouse) return false;
  if (hasExplicitList || goalHouse) return true;
  return houseNum > unlockedCount;
};

export const getUnlockedHousesList = (consultation: ConsultationUnlockRecord | null): number[] => {
  if (!consultation) return [];
  return Array.from({ length: TOTAL_HOUSES }, (_, i) => i + 1).filter(
    (houseNum) => !isHouseLockedByConsultation(consultation, houseNum)
  );
};

export const countUnlockedHouses = (consultation: ConsultationUnlockRecord | null): number =>
  getUnlockedHousesList(consultation).length;

/**
 * Computes the root-scoped intended focus for a specific house so that
 * choosing a Focus on the original consultation never leaks into extra houses.
 */
export const getHouseIntendedFocusId = (
  intent: string | null | undefined,
  houseNum: number,
  goalHouse?: number | null
): string | null => {
  const focusId = resolveIntentFocusId(intent);
  if (!focusId) return null;
  if (goalHouse && houseNum !== goalHouse) return null;
  return focusId;
};

export const isFirstFocusFreeForHouse = (
  consultation: ConsultationUnlockRecord | null,
  houseNum: number
): boolean => {
  if (!consultation) return false;
  const existing = consultation.result?.unlocked_focuses?.[String(houseNum)] || [];
  if (existing.length > 0) return false;
  const goalHouse = getConsultationGoalHouse(consultation);
  return getHouseIntendedFocusId(consultation.intent, houseNum, goalHouse) === null;
};

export const computeAllFocusesCost = (
  lockedFocusCount: number,
  focusCost: number,
  allFocusesCost: number
): number => {
  if (lockedFocusCount <= 0) return 0;
  return Math.max(1, Math.min(allFocusesCost, lockedFocusCount * focusCost));
};

export const computeRemainingFullMapCost = (
  unlockedHousesCount: number,
  fullMapCost: number,
  houseCost: number
): number => {
  return Math.max(1, fullMapCost - unlockedHousesCount * houseCost);
};

export type ConsultationUnlockTier = "single" | "expansao" | "full_map";

export const ALL_FOCUS_IDS: string[] = FOCUS_AREA_METADATA.map((f) => f.id);

export const ALL_TWELVE_HOUSES: number[] = Array.from({ length: TOTAL_HOUSES }, (_, i) => i + 1);

export const buildFullMapUnlockedFocuses = (): Record<string, string[]> => {
  const map: Record<string, string[]> = {};
  for (let h = 1; h <= TOTAL_HOUSES; h++) {
    map[String(h)] = [...ALL_FOCUS_IDS];
  }
  return map;
};

export const buildHouseAllFocuses = (
  existing: Record<string, string[]> | undefined,
  houseNum: number
): Record<string, string[]> => ({
  ...(existing || {}),
  [String(houseNum)]: [...ALL_FOCUS_IDS],
});

/**
 * Identifica automaticamente o melhor passe disponível no saldo do usuário:
 * - >= 7 créditos -> "full_map" (Mapa Completo: 12 Casas + Todos os Focos)
 * - >= 3 créditos -> "expansao" (Pacote Expansão: 1 Casa + Todos os Focos)
 * - >= 1 crédito  -> "single"   (1 Casa Avulsa)
 */
export const detectDefaultConsultationTier = (credits: number): ConsultationUnlockTier => {
  if (credits >= 7) return "full_map";
  if (credits >= 3) return "expansao";
  return "single";
};

export const getTierRequiredCredits = (tier: ConsultationUnlockTier): number => {
  if (tier === "full_map") return 7;
  if (tier === "expansao") return 3;
  return 1;
};

