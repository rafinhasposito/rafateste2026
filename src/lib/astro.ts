export const API_URL = "https://protocolo-solar-api.onrender.com";

export interface DetectedLocation {
  label: string;
  coords: {
    lat: number;
    lon: number;
  };
}

export function calcularNumerologia(nome: string): number {
  const tabela: Record<string, number> = {
    a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4, e: 5, n: 5, w: 5, f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7, h: 8, q: 8, z: 8, i: 9, r: 9,
  };
  let soma = 0;
  const nomeLimpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  for (const char of nomeLimpo) {
    if (tabela[char]) soma += tabela[char];
  }
  while (soma > 9 && soma !== 11 && soma !== 22 && soma !== 33) {
    soma = soma
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0);
  }
  return soma;
}

export async function detectUserLocation(): Promise<DetectedLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}&accept-language=pt`
          );
          const d = await r.json();
          if (d.address) {
            const parts: string[] = [];
            if (d.address.city || d.address.town || d.address.village)
              parts.push(d.address.city || d.address.town || d.address.village);
            if (d.address.state) parts.push(d.address.state);
            if (d.address.country) parts.push(d.address.country);
            resolve({
              label: parts.join(", "),
              coords: {
                lat: p.coords.latitude,
                lon: p.coords.longitude,
              },
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
}
