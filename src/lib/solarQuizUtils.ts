export type QuizPriority = "money" | "love" | "life";
export type TravelRadius = "1000km" | "3000km" | "global";

export function getTropicalSunSign(isoDate: string): string | null {
  if (!isoDate || !isoDate.includes("-")) return null;
  const parts = isoDate.split("-");
  if (parts.length < 3) return null;
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!month || !day) return null;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
  return "Peixes";
}

/**
 * Índices de afinidade temática (0–100) das 12 Casas Solares para os 3 pilares
 * principais do estudo global (Dinheiro & Carreira, Amor & Alianças, Bem-Estar & Mudança).
 */
export const HOUSE_PILLAR_SCORES: Record<
  number,
  { money: number; love: number; life: number; roman: string }
> = {
  1: { money: 82, love: 74, life: 95, roman: "I" },
  2: { money: 96, love: 68, life: 79, roman: "II" },
  3: { money: 88, love: 78, life: 81, roman: "III" },
  4: { money: 70, love: 84, life: 93, roman: "IV" },
  5: { money: 76, love: 95, life: 89, roman: "V" },
  6: { money: 86, love: 66, life: 94, roman: "VI" },
  7: { money: 84, love: 96, life: 80, roman: "VII" },
  8: { money: 89, love: 79, life: 85, roman: "VIII" },
  9: { money: 83, love: 81, life: 96, roman: "IX" },
  10: { money: 97, love: 71, life: 78, roman: "X" },
  11: { money: 90, love: 83, life: 86, roman: "XI" },
  12: { money: 65, love: 72, life: 92, roman: "XII" },
};

export function getTargetHouseForPriority(priority: QuizPriority): number {
  if (priority === "money") return 2;
  if (priority === "love") return 7;
  return 9;
}
