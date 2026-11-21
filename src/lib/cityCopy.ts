/**
 * Utilitário para personalizar textos do dossiê com o nome real da cidade calculada,
 * respeitando as preposições naturais do português (ex: "em Roma", "no Rio de Janeiro", "na Cidade do México").
 */

const MASCULINE_CITIES = new Set([
  "rio de janeiro",
  "porto",
  "cairo",
  "recife",
  "funchal",
  "panama",
  "panamá",
  "porto alegre",
  "porto seguro",
  "porto velho",
  "guaruja",
  "guarujá",
  "rio branco",
]);

const FEMININE_CITIES = new Set([
  "cidade do mexico",
  "cidade do méxico",
  "cidade do cabo",
  "cidade do panama",
  "cidade do panamá",
  "bahia",
  "patagonia",
  "patagônia",
  "provence",
  "madeira",
  "sicilia",
  "sicília",
  "toscana",
]);

const PLURAL_FEMININE_CITIES = new Set([
  "maldivas",
  "ilhas maldivas",
  "bahamas",
  "seychelles",
  "canarias",
  "canárias",
]);

function normalizeKey(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function extractShortCityName(fullCity?: string | null): string {
  if (!fullCity) return "";
  const first = fullCity.split(",")[0].trim();
  return first.replace(/\s*\([^)]*\)\s*/g, "").trim() || first;
}

export function formatEmCidade(fullCity?: string | null): string {
  const city = extractShortCityName(fullCity);
  if (!city) return "nessa cidade";
  const key = normalizeKey(city);

  if (PLURAL_FEMININE_CITIES.has(key) || key.startsWith("ilhas ")) {
    return `nas ${city}`;
  }
  if (FEMININE_CITIES.has(key) || key.startsWith("cidade d")) {
    return `na ${city}`;
  }
  if (MASCULINE_CITIES.has(key)) {
    return `no ${city}`;
  }
  return `em ${city}`;
}

export function interpolateCityCopy(text: string | undefined | null, fullCity?: string | null): string {
  if (!text) return "";
  const city = extractShortCityName(fullCity) || "sua cidade solar";
  const emCidade = formatEmCidade(fullCity);
  const emCidadeCap = emCidade.charAt(0).toUpperCase() + emCidade.slice(1);
  return text
    .replace(/\bEm \{cidade\}/g, emCidadeCap)
    .replace(/\bem \{cidade\}/g, emCidade)
    .replace(/\{em_cidade\}/g, emCidade)
    .replace(/\{cidade\}/g, city);
}
