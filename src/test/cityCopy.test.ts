import { describe, it, expect } from "vitest";
import { extractShortCityName, formatEmCidade, interpolateCityCopy } from "@/lib/cityCopy";
import { FOCUS_MATRIX } from "@/data/focusMatrix";

describe("cityCopy & FOCUS_MATRIX integrity", () => {
  it("formata corretamente preposições de cidades em português", () => {
    expect(formatEmCidade("Roma, Itália")).toBe("em Roma");
    expect(formatEmCidade("Rio de Janeiro, Brasil")).toBe("no Rio de Janeiro");
    expect(formatEmCidade("Cidade do México, México")).toBe("na Cidade do México");
    expect(formatEmCidade("Cairo, Egito")).toBe("no Cairo");
    expect(formatEmCidade("Porto, Portugal")).toBe("no Porto");
    expect(extractShortCityName("Malé (Ilhas Maldivas), Maldivas")).toBe("Malé");
  });

  it("interpola {cidade} e {em_cidade} sem deixar placeholders", () => {
    const out = interpolateCityCopy("Celebrar {em_cidade} ativa {cidade}.", "Rio de Janeiro, Brasil");
    expect(out).toBe("Celebrar no Rio de Janeiro ativa Rio de Janeiro.");
    expect(out).not.toContain("{");
  });

  it("garante 100% de textos únicos nas 12 Casas x 7 Focos de FOCUS_MATRIX", () => {
    const focusKeys = ["dinheiro", "trabalho", "identidade", "rotina", "networking", "amor", "espiritual"];
    const headlines = new Set<string>();
    const secrets = new Set<string>();
    const mantras = new Set<string>();
    const blindSpots = new Set<string>();
    const defenseProtocols = new Set<string>();
    const pillarDescs = new Set<string>();
    const phaseDescs = new Set<string>();
    const ritualSteps = new Set<string>();

    for (let h = 1; h <= 12; h++) {
      for (const k of focusKeys) {
        const entry = FOCUS_MATRIX[h][k];
        expect(entry).toBeDefined();
        headlines.add(entry.headline);
        secrets.add(entry.secret);
        mantras.add(entry.mantra);
        blindSpots.add(entry.blindSpot);
        defenseProtocols.add(entry.defenseProtocol);
        entry.pillars.forEach((p: any) => pillarDescs.add(p.description));
        entry.phases.forEach((p: any) => phaseDescs.add(p.description));
        ritualSteps.add(entry.ritual.step1);
        ritualSteps.add(entry.ritual.step2);
        ritualSteps.add(entry.ritual.step3);
      }
    }

    expect(headlines.size).toBe(84);
    expect(secrets.size).toBe(84);
    expect(mantras.size).toBe(84);
    expect(blindSpots.size).toBe(84);
    expect(defenseProtocols.size).toBe(84);
    expect(pillarDescs.size).toBe(252);
    expect(phaseDescs.size).toBe(252);
    expect(ritualSteps.size).toBe(252);
  });
});
