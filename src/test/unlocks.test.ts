import { describe, it, expect } from "vitest";
import {
  resolveIntentFocusId,
  getHouseIntendedFocusId,
  isFirstFocusFreeForHouse,
  computeAllFocusesCost,
  computeRemainingFullMapCost,
  countUnlockedHouses,
  getUnlockedHousesList,
  isHouseLockedByConsultation,
  detectDefaultConsultationTier,
  getTierRequiredCredits,
  buildFullMapUnlockedFocuses,
  buildHouseAllFocuses,
} from "../lib/consultationUnlocks";

describe("consultationUnlocks — regras de Casas e Focos", () => {
  it("resolve apenas IDs ou nomes reais de Focos, ignorando taglines descritivas das Casas", () => {
    expect(resolveIntentFocusId("dinheiro")).toBe("dinheiro");
    expect(resolveIntentFocusId("Saúde e Vitalidade")).toBe("saude");
    expect(resolveIntentFocusId("Amor e Relacionamento")).toBe("amor");
    expect(resolveIntentFocusId("A energia do Dinheiro, Valorização e Conquistas")).toBeNull();
    expect(resolveIntentFocusId(null)).toBeNull();
  });

  it("limita o Foco da consulta inicial apenas à Casa raiz sem vazar para Casas extras", () => {
    expect(getHouseIntendedFocusId("amor", 7, 7)).toBe("amor");
    expect(getHouseIntendedFocusId("amor", 2, 7)).toBeNull();
    expect(getHouseIntendedFocusId("A energia do Amor...", 7, 7)).toBeNull();
  });

  it("garante 1º Foco incluso por Casa (inclusive em Casas extras após consultar por Foco)", () => {
    const consultationByIntent = {
      goal: 7,
      intent: "amor",
      houses_unlocked: 2,
      unlocked_houses: [7, 2],
      result: { unlocked_focuses: {} },
    };

    expect(isFirstFocusFreeForHouse(consultationByIntent, 7)).toBe(false);
    expect(isFirstFocusFreeForHouse(consultationByIntent, 2)).toBe(true);

    const afterPickingSecondHouseFocus = {
      ...consultationByIntent,
      result: { unlocked_focuses: { "2": ["trabalho"] } },
    };
    expect(isFirstFocusFreeForHouse(afterPickingSecondHouseFocus, 2)).toBe(false);

    const consultationByHouseTagline = {
      goal: 2,
      intent: "A energia do Dinheiro, Valorização e Conquistas",
      houses_unlocked: 1,
      unlocked_houses: [2],
      result: { unlocked_focuses: {} },
    };
    expect(isFirstFocusFreeForHouse(consultationByHouseTagline, 2)).toBe(true);
  });

  it("calcula preço justo ao desbloquear Todos os Focos restantes", () => {
    expect(computeAllFocusesCost(0, 1, 3)).toBe(0);
    expect(computeAllFocusesCost(1, 1, 3)).toBe(1);
    expect(computeAllFocusesCost(2, 1, 3)).toBe(2);
    expect(computeAllFocusesCost(7, 1, 3)).toBe(3);
  });

  it("calcula saldo restante proporcional para o Mapa Completo (12 Casas)", () => {
    expect(computeRemainingFullMapCost(1, 7, 1)).toBe(6);
    expect(computeRemainingFullMapCost(3, 7, 1)).toBe(4);
    expect(computeRemainingFullMapCost(11, 7, 1)).toBe(1);
  });

  it("sincroniza contagem e bloqueio entre colunas SQL e result.full_map_unlocked", () => {
    const partial = {
      goal: 10,
      houses_unlocked: 3,
      unlocked_houses: [10, 2, 6],
      result: {},
    };
    expect(countUnlockedHouses(partial)).toBe(3);
    expect(getUnlockedHousesList(partial)).toEqual([2, 6, 10]);
    expect(isHouseLockedByConsultation(partial, 2)).toBe(false);
    expect(isHouseLockedByConsultation(partial, 1)).toBe(true);

    const legacyFullMap = {
      goal: 2,
      houses_unlocked: 1,
      unlocked_houses: [2],
      result: { full_map_unlocked: true },
    };
    expect(countUnlockedHouses(legacyFullMap)).toBe(12);
    expect(isHouseLockedByConsultation(legacyFullMap, 12)).toBe(false);
  });

  it("identifica passe automaticamente na consulta (1 Casa, Expansão ou Mapa Completo)", () => {
    expect(detectDefaultConsultationTier(1)).toBe("single");
    expect(detectDefaultConsultationTier(3)).toBe("expansao");
    expect(detectDefaultConsultationTier(7)).toBe("full_map");
    expect(getTierRequiredCredits("single")).toBe(1);
    expect(getTierRequiredCredits("expansao")).toBe(3);
    expect(getTierRequiredCredits("full_map")).toBe(7);

    const houseFocuses = buildHouseAllFocuses({}, 10);
    expect(houseFocuses["10"]).toHaveLength(8);

    const fullFocuses = buildFullMapUnlockedFocuses();
    expect(Object.keys(fullFocuses)).toHaveLength(12);
    expect(fullFocuses["1"]).toHaveLength(8);
    expect(fullFocuses["12"]).toHaveLength(8);
  });
});
