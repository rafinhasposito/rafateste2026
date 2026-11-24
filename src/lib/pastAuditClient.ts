import { type CityCoords } from "@/components/CityAutocomplete";
import { resolveSearchTerm } from "@/lib/cityAliases";
import { API_URL, getNextBirthdayYear, normalizeBirthTime } from "@/lib/astro";
import { type StoredFreePastPayload } from "@/pages/FreePastResult";

export function prewarmSolarApi(): void {
  if (typeof window === "undefined") return;
  fetch(`${API_URL}/health`, { method: "GET" }).catch(() => {
    // Silent warmup ping for Render cold starts
  });
}

async function resolveCityCoordsFallback(rawCity: string): Promise<{
  display: string;
  coords: CityCoords;
} | null> {
  const query = resolveSearchTerm(rawCity.trim());
  if (query.length < 2) return null;

  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const features = Array.isArray(data?.features) ? data.features : [];
    const match = features.find((f: any) => {
      const osmVal = f?.properties?.osm_value;
      return osmVal !== "state" && osmVal !== "country" && osmVal !== "continent";
    });
    if (!match?.geometry?.coordinates) return null;
    const [lon, lat] = match.geometry.coordinates;
    const name = match.properties?.name || rawCity.trim();
    const state = match.properties?.state;
    const country = match.properties?.country;
    const display = [name, state, country].filter(Boolean).join(", ");
    return {
      display,
      coords: { lat: Number(lat), lon: Number(lon) },
    };
  } catch {
    return null;
  }
}

export interface RunFreePastAuditInput {
  firstName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  unknownTime: boolean;
  birthCity: string;
  birthCoords?: CityCoords;
  pastYear: string;
  pastCity: string;
  pastCoords?: CityCoords;
}

export async function runFreePastAudit(
  input: RunFreePastAuditInput
): Promise<StoredFreePastPayload> {
  const cleanName = input.firstName.trim() || "Viajante";
  const cleanBirthCity = input.birthCity.trim();
  let cleanPastCity = input.pastCity.trim();
  let resolvedPastCoords = input.pastCoords;

  if (!resolvedPastCoords && cleanPastCity) {
    const fallback = await resolveCityCoordsFallback(cleanPastCity);
    if (fallback) {
      resolvedPastCoords = fallback.coords;
      cleanPastCity = fallback.display;
    }
  }

  if (!resolvedPastCoords) {
    throw new Error("Selecione na lista a cidade onde passou seu aniversário.");
  }

  const rawTime = input.unknownTime ? "12:00" : input.birthTime || "12:00";
  const safeTime = normalizeBirthTime(rawTime) || "12:00";

  const [yyyy, mm, dd] = input.birthDate.split("-");
  const formattedDob =
    yyyy && mm && dd ? `${dd}/${mm}/${yyyy}` : input.birthDate;
  const nextBirthdayYear = getNextBirthdayYear(input.birthDate);

  // Persist natal data for seamless handoff to Profile/Checkout
  try {
    sessionStorage.setItem("ps_natal_name", cleanName);
    sessionStorage.setItem("ps_natal_date", input.birthDate);
    sessionStorage.setItem("ps_natal_time", safeTime);
    sessionStorage.setItem("ps_natal_place", cleanBirthCity);
    sessionStorage.setItem("ps_natal_unknown_time", input.unknownTime ? "1" : "0");
    if (input.birthCoords) {
      sessionStorage.setItem("ps_natal_lat", String(input.birthCoords.lat));
      sessionStorage.setItem("ps_natal_lon", String(input.birthCoords.lon));
    }
  } catch {
    // ignore storage quota errors
  }

  const basePayload = {
    name: cleanName,
    place_of_birth: cleanBirthCity,
    dob: formattedDob,
    time: safeTime,
    past_city: cleanPastCity,
    past_lat: resolvedPastCoords.lat,
    past_lon: resolvedPastCoords.lon,
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 60000);

  try {
    const [pastRes, nextStayRes] = await Promise.all([
      fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...basePayload,
          target_year: Number(input.pastYear),
        }),
      }),
      fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...basePayload,
          target_year: Number(nextBirthdayYear),
        }),
      }).catch(() => null),
    ]);

    const pastData = await pastRes.json().catch(() => ({}));
    if (!pastRes.ok) {
      throw new Error(
        pastData?.error || "Não foi possível localizar as cidades informadas."
      );
    }

    const nextStayData =
      nextStayRes && nextStayRes.ok
        ? await nextStayRes.json().catch(() => null)
        : null;

    const resolvedHouse = Number(pastData?.house || pastData?.sun_house || 1);
    const parts = cleanPastCity.split(",").map((s) => s.trim());
    const pastShort = parts[0] || cleanPastCity;
    const pastCountry = parts.length > 1 ? parts[parts.length - 1] : "Brasil";

    return {
      userName: cleanName,
      birthDate: input.birthDate,
      birthTime: safeTime,
      birthPlace: cleanBirthCity,
      pastYear: String(input.pastYear),
      pastCityDisplay: cleanPastCity,
      pastCityShort: pastShort,
      pastCountry,
      pastLat: resolvedPastCoords.lat,
      pastLon: resolvedPastCoords.lon,
      pastHouse: resolvedHouse >= 1 && resolvedHouse <= 12 ? resolvedHouse : 1,
      sunSign: pastData?.sun_sign || null,
      ascendant: pastData?.ascendant || pastData?.sr_ascendant || null,
      returnDate: pastData?.return_date || null,
      returnTimeUtc: pastData?.return_time_utc || null,
      nextYear: String(nextBirthdayYear),
      nextStayHouse: nextStayData?.house ? Number(nextStayData.house) : null,
      usedApproximateTime: input.unknownTime,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
