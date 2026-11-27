import type { HouseV2 } from "../data/housesV2";

const cache = new Map<number, string>();

export function getEnvelopeDataUrl(house: HouseV2): string {
  const existing = cache.get(house.id);
  if (existing) return existing;
  if (typeof document === "undefined") return "";

  const c = document.createElement("canvas");
  c.width = 260;
  c.height = 408;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  // Ticket sticking out of envelope
  ctx.fillStyle = house.ticket;
  ctx.beginPath();
  ctx.roundRect(24, 6, 212, 94, 14);
  ctx.fill();
  ctx.fillStyle = "rgba(16,22,34,0.22)";
  for (let i = 0; i < 6; i++) ctx.fillRect(204, 22 + i * 7, 18, i % 2 === 0 ? 3 : 2);

  // Main envelope body with semicircular thumb notch
  ctx.save();
  ctx.beginPath();
  const topY = 48;
  const nr = 26;
  const W = 260;
  const H = 404;
  ctx.moveTo(14, topY);
  ctx.lineTo(W / 2 - nr, topY);
  ctx.arc(W / 2, topY, nr, Math.PI, 0, true);
  ctx.lineTo(W - 14, topY);
  ctx.quadraticCurveTo(W - 4, topY, W - 4, topY + 12);
  ctx.lineTo(W - 4, H - 12);
  ctx.quadraticCurveTo(W - 4, H, W - 16, H);
  ctx.lineTo(16, H);
  ctx.quadraticCurveTo(4, H, 4, H - 12);
  ctx.lineTo(4, topY + 12);
  ctx.quadraticCurveTo(4, topY, 14, topY);
  ctx.closePath();
  ctx.clip();

  const grad = ctx.createLinearGradient(0, topY, W, H);
  grad.addColorStop(0, house.env);
  grad.addColorStop(1, house.envDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, topY, W, H - topY);

  // Subtle gold radial glow
  const glow = ctx.createRadialGradient(W / 2, 220, 12, W / 2, 220, 140);
  glow.addColorStop(0, "rgba(245, 217, 147, 0.16)");
  glow.addColorStop(1, "rgba(245, 217, 147, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, topY, W, H - topY);

  // Brand oval
  ctx.strokeStyle = "rgba(244,230,193,0.48)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(W / 2, 126, 66, 17, -0.18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#F5E7C3";
  ctx.font = "600 11.5px 'DM Sans', sans-serif";
  ctx.fillText("PROTOCOLO", W / 2, 125);
  ctx.font = "600 10.5px 'DM Sans', sans-serif";
  ctx.fillText("SOLAR", W / 2, 140);

  ctx.font = "400 16px 'Marcellus', Georgia, serif";
  ctx.fillStyle = "rgba(245,231,195,0.88)";
  ctx.fillText("C A S A", W / 2, 186);

  ctx.font = "400 92px 'Marcellus', Georgia, serif";
  ctx.fillStyle = "#FFF4D1";
  ctx.fillText(String(house.id), W / 2, 276);

  ctx.font = "700 10.5px 'DM Sans', sans-serif";
  ctx.fillStyle = "#F5E7C3";
  ctx.fillText("— " + house.cover + " —", W / 2, 378);
  ctx.restore();

  const url = c.toDataURL("image/png");
  cache.set(house.id, url);
  return url;
}
