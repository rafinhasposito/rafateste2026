export const houseSigns: Record<number, string> = {
  1: "Áries",
  2: "Touro",
  3: "Gêmeos",
  4: "Câncer",
  5: "Leão",
  6: "Virgem",
  7: "Libra",
  8: "Escorpião",
  9: "Sagitário",
  10: "Capricórnio",
  11: "Aquário",
  12: "Peixes",
};

export const getHouseArchetype = (name: string) =>
  name.replace(/\s*\(Casa\s*\d+\)\s*/i, "").trim();