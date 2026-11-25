export interface HouseChromaticTheme {
  id: number;
  code: string;
  paletteName: string;
  hex: string;
  softHex: string;
  glowRgba: string;
  surfaceTint: string;
  lightBg: string;
  lightText: string;
  goalGroup: "money" | "love" | "peace" | "world";
}

/**
 * Paleta Mestra Oficial das 12 Casas Solares (docs/02_database_prompts/08-paleta-casas.md)
 * Cada Casa irradia sua própria assinatura cromática — zero monotonia de cor única.
 */
export const HOUSE_PALETTE: Record<number, HouseChromaticTheme> = {
  1: {
    id: 1,
    code: "01",
    paletteName: "Vermelho Rubi",
    hex: "#E11D48",
    softHex: "#FDA4AF",
    glowRgba: "rgba(225, 29, 72, 0.34)",
    surfaceTint: "rgba(225, 29, 72, 0.14)",
    lightBg: "#FFF1F2",
    lightText: "#9F1239",
    goalGroup: "world",
  },
  2: {
    id: 2,
    code: "02",
    paletteName: "Verde Esmeralda",
    hex: "#10B981",
    softHex: "#6EE7B7",
    glowRgba: "rgba(16, 185, 129, 0.34)",
    surfaceTint: "rgba(16, 185, 129, 0.14)",
    lightBg: "#ECFDF5",
    lightText: "#065F46",
    goalGroup: "money",
  },
  3: {
    id: 3,
    code: "03",
    paletteName: "Âmbar Solar",
    hex: "#F59E0B",
    softHex: "#FCD34D",
    glowRgba: "rgba(245, 158, 11, 0.34)",
    surfaceTint: "rgba(245, 158, 11, 0.14)",
    lightBg: "#FFFBEB",
    lightText: "#92400E",
    goalGroup: "money",
  },
  4: {
    id: 4,
    code: "04",
    paletteName: "Azul Sereno",
    hex: "#38BDF8",
    softHex: "#BAE6FD",
    glowRgba: "rgba(56, 189, 248, 0.34)",
    surfaceTint: "rgba(56, 189, 248, 0.14)",
    lightBg: "#F0F9FF",
    lightText: "#075985",
    goalGroup: "peace",
  },
  5: {
    id: 5,
    code: "05",
    paletteName: "Dourado Imperial",
    hex: "#EAB308",
    softHex: "#FDE047",
    glowRgba: "rgba(234, 179, 8, 0.34)",
    surfaceTint: "rgba(234, 179, 8, 0.14)",
    lightBg: "#FEFCE8",
    lightText: "#854D0E",
    goalGroup: "love",
  },
  6: {
    id: 6,
    code: "06",
    paletteName: "Verde Menta",
    hex: "#14B8A6",
    softHex: "#5EEAD4",
    glowRgba: "rgba(20, 184, 166, 0.34)",
    surfaceTint: "rgba(20, 184, 166, 0.14)",
    lightBg: "#F0FDFA",
    lightText: "#115E59",
    goalGroup: "peace",
  },
  7: {
    id: 7,
    code: "07",
    paletteName: "Rosa Quartzo",
    hex: "#F43F5E",
    softHex: "#FDA4AF",
    glowRgba: "rgba(244, 63, 94, 0.34)",
    surfaceTint: "rgba(244, 63, 94, 0.14)",
    lightBg: "#FFF1F2",
    lightText: "#9F1239",
    goalGroup: "love",
  },
  8: {
    id: 8,
    code: "08",
    paletteName: "Vinho Alquimia",
    hex: "#BE123C",
    softHex: "#FDA4AF",
    glowRgba: "rgba(190, 18, 60, 0.36)",
    surfaceTint: "rgba(190, 18, 60, 0.16)",
    lightBg: "#FFF1F2",
    lightText: "#881337",
    goalGroup: "money",
  },
  9: {
    id: 9,
    code: "09",
    paletteName: "Índigo Boreal",
    hex: "#6366F1",
    softHex: "#A5B4FC",
    glowRgba: "rgba(99, 102, 241, 0.36)",
    surfaceTint: "rgba(99, 102, 241, 0.15)",
    lightBg: "#EEF2FF",
    lightText: "#3730A3",
    goalGroup: "world",
  },
  10: {
    id: 10,
    code: "10",
    paletteName: "Titânio & Ouro CEO",
    hex: "#60A5FA",
    softHex: "#BFDBFE",
    glowRgba: "rgba(96, 165, 250, 0.34)",
    surfaceTint: "rgba(96, 165, 250, 0.14)",
    lightBg: "#EFF6FF",
    lightText: "#1E3A8A",
    goalGroup: "money",
  },
  11: {
    id: 11,
    code: "11",
    paletteName: "Azul Elétrico",
    hex: "#3B82F6",
    softHex: "#93C5FD",
    glowRgba: "rgba(59, 130, 246, 0.36)",
    surfaceTint: "rgba(59, 130, 246, 0.15)",
    lightBg: "#EFF6FF",
    lightText: "#1D4ED8",
    goalGroup: "world",
  },
  12: {
    id: 12,
    code: "12",
    paletteName: "Violeta Místico",
    hex: "#8B5CF6",
    softHex: "#C4B5FD",
    glowRgba: "rgba(139, 92, 246, 0.36)",
    surfaceTint: "rgba(139, 92, 246, 0.15)",
    lightBg: "#F5F3FF",
    lightText: "#5B21B6",
    goalGroup: "peace",
  },
};

export function getHousePalette(houseId: number): HouseChromaticTheme {
  return HOUSE_PALETTE[houseId] || HOUSE_PALETTE[1];
}
