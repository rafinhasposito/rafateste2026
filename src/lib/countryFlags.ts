/**
 * Convert country name to flag emoji using ISO 3166-1 alpha-2 codes.
 */
const countryToCode: Record<string, string> = {
  "brazil": "BR", "brasil": "BR",
  "united states": "US", "usa": "US", "estados unidos": "US",
  "united kingdom": "GB", "uk": "GB", "reino unido": "GB", "england": "GB", "inglaterra": "GB",
  "france": "FR", "frança": "FR",
  "germany": "DE", "alemanha": "DE",
  "italy": "IT", "itália": "IT", "italia": "IT",
  "spain": "ES", "espanha": "ES",
  "portugal": "PT",
  "japan": "JP", "japão": "JP",
  "china": "CN",
  "south korea": "KR", "coreia do sul": "KR",
  "india": "IN", "índia": "IN",
  "australia": "AU", "austrália": "AU",
  "canada": "CA", "canadá": "CA",
  "mexico": "MX", "méxico": "MX",
  "argentina": "AR",
  "chile": "CL",
  "colombia": "CO", "colômbia": "CO",
  "peru": "PE",
  "uruguay": "UY", "uruguai": "UY",
  "paraguay": "PY", "paraguai": "PY",
  "venezuela": "VE",
  "ecuador": "EC", "equador": "EC",
  "bolivia": "BO", "bolívia": "BO",
  "netherlands": "NL", "holanda": "NL", "países baixos": "NL",
  "belgium": "BE", "bélgica": "BE",
  "switzerland": "CH", "suíça": "CH", "suica": "CH",
  "austria": "AT", "áustria": "AT",
  "sweden": "SE", "suécia": "SE",
  "norway": "NO", "noruega": "NO",
  "denmark": "DK", "dinamarca": "DK",
  "finland": "FI", "finlândia": "FI",
  "ireland": "IE", "irlanda": "IE",
  "iceland": "IS", "islândia": "IS",
  "poland": "PL", "polônia": "PL", "polonia": "PL",
  "czech republic": "CZ", "república tcheca": "CZ", "czechia": "CZ",
  "hungary": "HU", "hungria": "HU",
  "romania": "RO", "romênia": "RO",
  "bulgaria": "BG", "bulgária": "BG",
  "croatia": "HR", "croácia": "HR",
  "greece": "GR", "grécia": "GR",
  "turkey": "TR", "turquia": "TR", "türkiye": "TR",
  "russia": "RU", "rússia": "RU",
  "ukraine": "UA", "ucrânia": "UA",
  "serbia": "RS", "sérvia": "RS",
  "slovenia": "SI", "eslovênia": "SI",
  "slovakia": "SK", "eslováquia": "SK",
  "luxembourg": "LU", "luxemburgo": "LU",
  "monaco": "MC", "mônaco": "MC",
  "thailand": "TH", "tailândia": "TH",
  "vietnam": "VN", "vietnã": "VN",
  "indonesia": "ID", "indonésia": "ID",
  "malaysia": "MY", "malásia": "MY",
  "singapore": "SG", "singapura": "SG", "cingapura": "SG",
  "philippines": "PH", "filipinas": "PH",
  "taiwan": "TW",
  "hong kong": "HK",
  "macau": "MO",
  "united arab emirates": "AE", "emirados árabes unidos": "AE", "uae": "AE",
  "qatar": "QA", "catar": "QA",
  "saudi arabia": "SA", "arábia saudita": "SA",
  "israel": "IL",
  "jordan": "JO", "jordânia": "JO",
  "oman": "OM", "omã": "OM",
  "bahrain": "BH", "bahrein": "BH",
  "egypt": "EG", "egito": "EG",
  "morocco": "MA", "marrocos": "MA",
  "south africa": "ZA", "áfrica do sul": "ZA",
  "kenya": "KE", "quênia": "KE",
  "tanzania": "TZ", "tanzânia": "TZ",
  "nigeria": "NG", "nigéria": "NG",
  "ghana": "GH", "gana": "GH",
  "senegal": "SN",
  "tunisia": "TN", "tunísia": "TN",
  "new zealand": "NZ", "nova zelândia": "NZ",
  "french polynesia": "PF", "polinésia francesa": "PF",
  "cuba": "CU",
  "dominican republic": "DO", "república dominicana": "DO",
  "panama": "PA", "panamá": "PA",
  "costa rica": "CR",
  "bahamas": "BS",
  "jamaica": "JM",
  "puerto rico": "PR", "porto rico": "PR",
};

function codeToFlag(code: string): string {
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join("");
}

export function getCountryFlag(country: string): string {
  if (!country) return "🌍";
  const normalized = country.toLowerCase().trim();
  const code = countryToCode[normalized];
  if (code) return codeToFlag(code);
  return "🌍";
}

export function getCountryCode(country: string): string {
  if (!country) return "";
  const normalized = country.toLowerCase().trim();
  return countryToCode[normalized] || "";
}

/**
 * Get a static map image URL for given coordinates.
 */
export function getStaticMapUrl(lat: number, lon: number, zoom = 5, width = 300, height = 150): string {
  return `https://maps.geoapify.com/v1/staticmap?style=dark-matter-brown&width=${width}&height=${height}&center=lonlat:${lon},${lat}&zoom=${zoom}&apiKey=demo`;
}
