import { extractShortCityName } from "@/lib/cityCopy";

const wikiPhotoCache = new Map<string, string | null>();

const REJECTED_IMAGE_PATTERNS = [
  /\.svg(\?|$)/i,
  /\.gif(\?|$)/i,
  /flag[_ -]?of/i,
  /bandeira/i,
  /bras[aã]o/i,
  /coat[_ -]?of[_ -]?arms/i,
  /escudo/i,
  /locator/i,
  /location[_ -]?map/i,
  /mapa/i,
  /municipality/i,
  /blank[_ -]?map/i,
  /seal[_ -]?of/i,
  /logo/i,
  /emblem/i,
  /icon/i,
];

export function isAcceptableCityPhotoUrl(url?: string | null, width?: number, height?: number): boolean {
  if (!url || typeof url !== "string") return false;
  if (REJECTED_IMAGE_PATTERNS.some((rx) => rx.test(url))) return false;
  if (typeof width === "number" && width < 500) return false;
  if (typeof height === "number" && height < 350) return false;
  // Avoid extreme ultra-wide panoramas/banners that crop poorly into 9:16
  if (typeof width === "number" && typeof height === "number" && height > 0) {
    const ratio = width / height;
    if (ratio > 3.2 || ratio < 0.3) return false;
  }
  return true;
}

async function fetchWikipediaSummaryPhoto(lang: "pt" | "en", queryTitle: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const encoded = encodeURIComponent(queryTitle.replace(/\s+/g, "_"));
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.type === "disambiguation") return null;

    // Prefer Wikimedia's native originalimage URL directly (already CDN-capped and CORS-enabled with ACAO: *)
    const orig = data?.originalimage;
    const thumb = data?.thumbnail;

    if (orig?.source && isAcceptableCityPhotoUrl(orig.source, orig.width, orig.height)) {
      return orig.source;
    }

    if (thumb?.source && isAcceptableCityPhotoUrl(thumb.source, thumb.width, thumb.height)) {
      return thumb.source;
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolve uma foto REAL verificada para qualquer cidade X, Y ou Z com custo zero:
 * 1. Usa foto curada específica da cidade quando fornecida;
 * 2. Para qualquer outra cidade (ex: as outras 188 do motor ou busca livre mundial),
 *    busca automaticamente na Wikipedia/Wikimedia REST API (CORS liberado), filtrando
 *    mapas, bandeiras, brasões e imagens pequenas;
 * 3. Retorna null se não houver foto boa — permitindo fallback limpo para o modo Minimalista Neutro
 *    sem nunca exibir a foto de outra cidade.
 */
export async function resolveRealCityPhoto(
  fullCity: string,
  curatedCityUrl?: string | null
): Promise<string | null> {
  if (curatedCityUrl) return curatedCityUrl;

  const shortCity = extractShortCityName(fullCity);
  if (!shortCity) return null;

  const cacheKey = fullCity.trim().toLowerCase();
  if (wikiPhotoCache.has(cacheKey)) {
    return wikiPhotoCache.get(cacheKey) ?? null;
  }

  const country = fullCity.includes(",") ? fullCity.split(",").slice(1).join(",").trim() : "";
  const candidates: Array<{ lang: "pt" | "en"; title: string }> = [
    { lang: "pt", title: shortCity },
    { lang: "en", title: shortCity },
  ];
  if (country) {
    candidates.push({ lang: "pt", title: `${shortCity} (${country})` });
    candidates.push({ lang: "en", title: `${shortCity}, ${country}` });
  }

  for (const c of candidates) {
    const found = await fetchWikipediaSummaryPhoto(c.lang, c.title);
    if (found) {
      wikiPhotoCache.set(cacheKey, found);
      return found;
    }
  }

  wikiPhotoCache.set(cacheKey, null);
  return null;
}
