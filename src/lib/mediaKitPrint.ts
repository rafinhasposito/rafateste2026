import { COUPON_REWARD_META, type CouponRewardType, type RedeemCouponRow } from "./coupons";
import { renderQrSvg } from "./qrSvg";

/* ======================================================================
   CANVA VOUCHER SYSTEM — Hybrid: Canva PNG background + dynamic QR/code
   ====================================================================== */

const VOUCHER_IMAGES: Record<CouponRewardType, string> = {
  full_map: "/images/vouchers/voucher-mapa-completo.png",
  expansao: "/images/vouchers/voucher-expansao.png",
  "1_casa": "/images/vouchers/voucher-consulta-gratis.png",
};

/** Position config for QR code and coupon code overlay on each Canva design */
const VOUCHER_OVERLAY_POS: Record<CouponRewardType, {
  qr: { bottom: string; left: string; size: string } | null;
  code: { bottom: string; left: string; width: string; fontSize: string };
}> = {
  full_map: {
    qr: { bottom: "19.8%", left: "14.5%", size: "9.5%" },
    code: { bottom: "17.6%", left: "57%", width: "30%", fontSize: "1.4vw" },
  },
  expansao: {
    qr: null, // Design 2 doesn't have a QR placeholder
    code: { bottom: "10.8%", left: "7.5%", width: "28%", fontSize: "1.3vw" },
  },
  "1_casa": {
    qr: null,
    code: { bottom: "16.5%", left: "52%", width: "30%", fontSize: "1.3vw" },
  },
};

export interface CanvaVoucherOptions {
  coupon: RedeemCouponRow;
  redeemUrl: string;
  origin: string;
}

export function buildCanvaVoucherHtml(opts: CanvaVoucherOptions): string {
  const { coupon, redeemUrl, origin } = opts;
  const rewardType = coupon.reward_type as CouponRewardType;
  const bgImage = `${origin}${VOUCHER_IMAGES[rewardType] || VOUCHER_IMAGES.full_map}`;
  const overlay = VOUCHER_OVERLAY_POS[rewardType] || VOUCHER_OVERLAY_POS.full_map;
  const qrSvg = renderQrSvg(redeemUrl, "#0B192C");
  const safeCode = coupon.code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const meta = COUPON_REWARD_META[rewardType] || COUPON_REWARD_META.full_map;

  const qrHtml = overlay.qr ? `
    <div class="qr-overlay" style="
      position: absolute;
      bottom: ${overlay.qr.bottom};
      left: ${overlay.qr.left};
      width: ${overlay.qr.size};
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    ">${qrSvg}</div>
  ` : "";

  const allVouchers = Object.entries(VOUCHER_IMAGES).map(([type, path]) => {
    const typeMeta = COUPON_REWARD_META[type as CouponRewardType];
    return `<option value="${type}" ${type === rewardType ? "selected" : ""}>${typeMeta?.shortLabel || type}</option>`;
  }).join("\n");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Voucher ${safeCode} · ${meta.shortLabel} · Protocolo Solar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      background: #EFEAE0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid #DFC387;
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      box-shadow: 0 8px 25px rgba(11,25,44,0.08);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #065F46;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      padding: 5px 11px;
      border-radius: 999px;
      font-weight: 700;
    }

    .toolbar select, .toolbar button {
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 9px;
      cursor: pointer;
      font-weight: 600;
      border: 1px solid #CBD5E1;
      background: #FFF;
    }

    .btn-print {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #FFF;
      border-color: #B45309;
      font-weight: 700;
    }

    .stage {
      padding: 26px 16px 60px;
      display: flex;
      justify-content: center;
    }

    .a4-sheet {
      width: 210mm;
      height: 297mm;
      position: relative;
      box-shadow: 0 24px 65px rgba(11,25,44,0.16);
      overflow: hidden;
      background: #FFF;
    }

    .a4-sheet img.bg {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .qr-overlay svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .code-overlay {
      position: absolute;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #0B192C;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      body { background: #FFF !important; }
      .toolbar { display: none !important; }
      .stage { padding: 0 !important; }
      .a4-sheet { box-shadow: none !important; }
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="toolbar">
    <div class="toolbar-left">
      <span style="font-weight:700;font-size:14px;">☀️ Protocolo Solar</span>
      <span class="pill">Voucher · ${safeCode}</span>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <select id="selType">${allVouchers}</select>
      <button class="btn-print" onclick="window.print()">🖨️ Imprimir A4 / PDF (⌘P)</button>
    </div>
  </header>

  <main class="stage">
    <article class="a4-sheet" id="a4Sheet">
      <img class="bg" id="bgImg" src="${bgImage}" alt="Voucher Protocolo Solar" />
      ${qrHtml}
      <div class="code-overlay" style="
        bottom: ${overlay.code.bottom};
        left: ${overlay.code.left};
        width: ${overlay.code.width};
        font-size: ${overlay.code.fontSize};
      ">${safeCode}</div>
    </article>
  </main>

  <script>
    const VOUCHER_IMGS = ${JSON.stringify(Object.fromEntries(
      Object.entries(VOUCHER_IMAGES).map(([k, v]) => [k, origin + v])
    ))};
    const OVERLAY_POS = ${JSON.stringify(VOUCHER_OVERLAY_POS)};
    const CODE = ${JSON.stringify(coupon.code)};
    const QR_SVG = ${JSON.stringify(qrSvg)};

    const sel = document.getElementById("selType");
    if (sel) {
      sel.addEventListener("change", () => {
        const type = sel.value;
        document.getElementById("bgImg").src = VOUCHER_IMGS[type] || VOUCHER_IMGS.full_map;
        const pos = OVERLAY_POS[type] || OVERLAY_POS.full_map;

        // Update code overlay
        const codeEl = document.querySelector(".code-overlay");
        if (codeEl) {
          codeEl.style.bottom = pos.code.bottom;
          codeEl.style.left = pos.code.left;
          codeEl.style.width = pos.code.width;
          codeEl.style.fontSize = pos.code.fontSize;
        }

        // Update QR overlay
        const existingQr = document.querySelector(".qr-overlay");
        if (pos.qr) {
          if (existingQr) {
            existingQr.style.bottom = pos.qr.bottom;
            existingQr.style.left = pos.qr.left;
            existingQr.style.width = pos.qr.size;
          } else {
            const qrDiv = document.createElement("div");
            qrDiv.className = "qr-overlay";
            qrDiv.style.cssText = "position:absolute;bottom:" + pos.qr.bottom + ";left:" + pos.qr.left + ";width:" + pos.qr.size + ";aspect-ratio:1;display:flex;align-items:center;justify-content:center;";
            qrDiv.innerHTML = QR_SVG;
            document.getElementById("a4Sheet").appendChild(qrDiv);
          }
        } else if (existingQr) {
          existingQr.remove();
        }
      });
    }
  </script>
</body>
</html>`;
}

export type BoardingPassVisual =
  | "emblem"
  | "theo"
  | "zurich"
  | "ny"
  | "roma"
  | "paris"
  | "tokyo";

export interface MediaKitPrintOptions {
  coupon: RedeemCouponRow;
  redeemUrl: string;
  origin: string;
  hostSignature?: string;
  blankRecipientLine?: boolean;
  visual?: BoardingPassVisual;
  mode?: "full" | "card";
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Crisp inline SVG icons for print (replaces OS emojis for 100% editorial finish) */
function wifiIconSvg(color = "#B87A14"): string {
  return `<svg width="12" height="10" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink:0"><path d="M2 7.5C7.6 2.5 16.4 2.5 22 7.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><path d="M5.5 11.5C9.2 8.2 14.8 8.2 18.5 11.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><path d="M9.2 15.2C10.8 13.7 13.2 13.7 14.8 15.2" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="18.2" r="1.9" fill="${color}"/></svg>`;
}

function giftIconSvg(color = "#B87A14"): string {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink:0"><rect x="3" y="8" width="18" height="4" rx="1" stroke="${color}" stroke-width="2"/><path d="M12 8V21M5 12V20C5 20.6 5.4 21 6 21H18C18.6 21 19 20.6 19 20V12" stroke="${color}" stroke-width="2"/><path d="M12 8H8.5C7.1 8 6 6.9 6 5.5C6 4.1 7.1 3 8.5 3C10.7 3 12 8 12 8ZM12 8H15.5C16.9 8 18 6.9 18 5.5C18 4.1 16.9 3 15.5 3C13.3 3 12 8 12 8Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function scissorsIconSvg(color = "#B87A14"): string {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink:0"><circle cx="6" cy="6" r="3" stroke="${color}" stroke-width="2"/><circle cx="6" cy="18" r="3" stroke="${color}" stroke-width="2"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/** Crisp vector logo designed specifically for light paper (zero dark circle box) */
function lightPaperLogoSvg(accent = "#B87A14"): string {
  return `<svg width="215" height="36" viewBox="0 0 215 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Protocolo Solar">
    <circle cx="18" cy="18" r="14" stroke="${accent}" stroke-width="1.35"/>
    <circle cx="18" cy="18" r="9.8" stroke="${accent}" stroke-opacity="0.45" stroke-width="0.9" stroke-dasharray="2 2"/>
    <circle cx="18" cy="18" r="4.3" fill="${accent}"/>
    <path d="M18 1.8V5.8M18 30.2V34.2M1.8 18H5.8M30.2 18H34.2M6.5 6.5L9.4 9.4M26.6 26.6L29.5 29.5M29.5 6.5L26.6 9.4M9.4 26.6L6.5 29.5" stroke="${accent}" stroke-width="1.35" stroke-linecap="round"/>
    <text x="42" y="17" fill="#0B192C" font-family="Marcellus, Georgia, serif" font-size="14" letter-spacing="2.2">PROTOCOLO SOLAR</text>
    <text x="42" y="28.5" fill="${accent}" font-family="JetBrains Mono, monospace" font-size="6.4" font-weight="700" letter-spacing="1.6">O GPS DO SEU NOVO CICLO</text>
  </svg>`;
}

/** Realistic airline boarding-pass barcode */
function barcodeSvg(seedStr: string, color = "#0B192C"): string {
  let bars = "";
  let x = 0;
  for (let i = 0; i < 44; i++) {
    const ch = seedStr.charCodeAt(i % seedStr.length) || 65;
    const w = ((ch + i * 7) % 3) + 1;
    const gap = ((ch + i * 3) % 2) + 1.15;
    if (i % 2 === 0 || w > 1) {
      bars += `<rect x="${x.toFixed(1)}" y="0" width="${w}" height="24" fill="${color}"/>`;
    }
    x += w + gap;
  }
  return `<svg viewBox="0 0 ${Math.ceil(x)} 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bars}</svg>`;
}

/** Minimal editorial line-art horizon watermark inside the Boarding Pass route */
function horizonArtworkSvg(visual: BoardingPassVisual, accent: string): string {
  if (visual === "zurich") {
    return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 95 L55 48 L95 74 L148 24 L205 78 L258 38 L315 80 L360 55" stroke="${accent}" stroke-width="1.6" stroke-opacity="0.22"/>
      <circle cx="295" cy="28" r="14" stroke="${accent}" stroke-width="1.4" stroke-opacity="0.22"/>
    </svg>`;
  }
  if (visual === "ny") {
    return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 100 V65 H34 V100 M44 100 V46 H70 V100 M80 100 V58 H106 V100 M118 100 V34 L130 14 L142 34 V100 M154 100 V52 H182 V100 M194 100 V40 H220 V100 M234 100 V60 H264 V100 M276 100 V48 H304 V100" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.2"/>
    </svg>`;
  }
  if (visual === "roma") {
    return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M40 98 V48 C40 48 110 38 185 38 C260 38 320 52 320 52 V98" stroke="${accent}" stroke-width="1.6" stroke-opacity="0.22"/>
      <path d="M62 98 V66 A12 12 0 0 1 86 66 V98 M104 98 V64 A12 12 0 0 1 128 64 V98 M146 98 V62 A12 12 0 0 1 170 62 V98 M188 98 V62 A12 12 0 0 1 212 62 V98 M230 98 V64 A12 12 0 0 1 254 64 V98" stroke="${accent}" stroke-width="1.3" stroke-opacity="0.2"/>
    </svg>`;
  }
  if (visual === "paris") {
    return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M180 10 L174 44 L162 76 L142 100 M180 10 L186 44 L198 76 L218 100 M155 76 H205 M167 52 H193 M162 100 A18 18 0 0 1 198 100" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.22"/>
    </svg>`;
  }
  if (visual === "tokyo") {
    return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M25 100 C95 88 135 52 162 28 H198 C225 52 265 88 335 100" stroke="${accent}" stroke-width="1.7" stroke-opacity="0.22"/>
      <circle cx="255" cy="34" r="18" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.22"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 360 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="285" cy="58" r="46" stroke="${accent}" stroke-width="1.2" stroke-opacity="0.2"/>
    <circle cx="285" cy="58" r="32" stroke="${accent}" stroke-width="1" stroke-dasharray="3 4" stroke-opacity="0.2"/>
    <circle cx="285" cy="58" r="15" stroke="${accent}" stroke-width="1.2" stroke-opacity="0.22"/>
  </svg>`;
}

export const BOARDING_VISUAL_THEMES: Record<
  BoardingPassVisual,
  {
    label: string;
    fromCode: string;
    fromLabel: string;
    toCode: string;
    toLabel: string;
    flightNo: string;
    gateLabel: string;
    accent: string;
    softBg: string;
  }
> = {
  theo: {
    label: "Folha A4 Oficial (Dourado Solar)",
    fromCode: "HOJE",
    fromLabel: "Ciclo Atual",
    toCode: "SOL",
    toLabel: "Sua Coordenada",
    flightNo: "PS-365",
    gateLabel: "CASAS I–XII",
    accent: "#B87A14",
    softBg: "#FEF7E6",
  },
  emblem: {
    label: "Dourado Clássico (Ouro Solar)",
    fromCode: "HOJE",
    fromLabel: "Ciclo Atual",
    toCode: "SOL",
    toLabel: "Sua Coordenada",
    flightNo: "PS-365",
    gateLabel: "CASAS I–XII",
    accent: "#B87A14",
    softBg: "#FEF7E6",
  },
  zurich: {
    label: "Zurique · Casa 2 Dinheiro (Verde Esmeralda)",
    fromCode: "BR",
    fromLabel: "Sua Cidade",
    toCode: "ZRH",
    toLabel: "Casa 2 · Dinheiro",
    flightNo: "PS-002",
    gateLabel: "CASA 02",
    accent: "#059669",
    softBg: "#ECFDF5",
  },
  ny: {
    label: "Nova York · Casa 10 Carreira (Azul Cobalto)",
    fromCode: "BR",
    fromLabel: "Sua Cidade",
    toCode: "NYC",
    toLabel: "Casa 10 · Topo",
    flightNo: "PS-010",
    gateLabel: "CASA 10",
    accent: "#0284C7",
    softBg: "#F0F9FF",
  },
  roma: {
    label: "Roma · Casas 5 & 7 Amor (Coral Rubi)",
    fromCode: "BR",
    fromLabel: "Sua Cidade",
    toCode: "ROM",
    toLabel: "Casas 5 & 7 · Amor",
    flightNo: "PS-507",
    gateLabel: "CASAS 5·7",
    accent: "#E11D48",
    softBg: "#FFF1F2",
  },
  paris: {
    label: "Paris · Paixão & Arte (Rosa Editorial)",
    fromCode: "BR",
    fromLabel: "Sua Cidade",
    toCode: "PAR",
    toLabel: "Casas 5 & 7 · Arte",
    flightNo: "PS-005",
    gateLabel: "CASA 05",
    accent: "#DB2777",
    softBg: "#FDF2F8",
  },
  tokyo: {
    label: "Tóquio · Expansão & Futuro (Âmbar)",
    fromCode: "BR",
    fromLabel: "Sua Cidade",
    toCode: "TYO",
    toLabel: "Casa 11 · Futuro",
    flightNo: "PS-011",
    gateLabel: "CASA 11",
    accent: "#D97706",
    softBg: "#FFFBEB",
  },
};

export function buildMediaKitPrintHtml(opts: MediaKitPrintOptions): string {
  const {
    coupon,
    redeemUrl,
    origin,
    hostSignature = "POR RAFAEL SPOSITO",
    blankRecipientLine = false,
    visual = "theo",
    mode = "full",
  } = opts;

  const meta = COUPON_REWARD_META[coupon.reward_type] || COUPON_REWARD_META.full_map;
  const theme = BOARDING_VISUAL_THEMES[visual] || BOARDING_VISUAL_THEMES.theo;
  const qrSvg = renderQrSvg(redeemUrl, "#0B192C");
  const safeCode = escapeHtml(coupon.code);
  const safeHost = escapeHtml((hostSignature || "POR RAFAEL SPOSITO").trim().toUpperCase());
  const safeLabel = escapeHtml(meta.label);
  const safeShort = escapeHtml(meta.shortLabel);
  const safeValue = escapeHtml(meta.valueBrl);
  const safeDesc = escapeHtml(meta.description);

  const hasRecipient = !blankRecipientLine && Boolean(coupon.recipient_name?.trim());
  const safeRecipient = hasRecipient ? escapeHtml(coupon.recipient_name!.trim().toUpperCase()) : "";
  const recipientHtml = hasRecipient
    ? `<span class="bp-cell-value accent">${safeRecipient}</span>`
    : `<span class="bp-cell-value handwrite-line" title="Espaço para assinar à mão com caneta dourada"></span>`;

  // Theo photo: prefers generated bright transparent cutout when present, falls back to composite/studio
  const theoCutoutUrl = `${origin}/images/abertura/theo-ad-cutout-opt.png`;
  const theoFallbackUrl = `${origin}/images/abertura/theo-ad-claro.jpg`;

  if (mode === "card") {
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Passagem VIP · ${safeCode} · Protocolo Solar</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@600;700&family=Marcellus&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      background: #F4EFE4;
      color: #0B192C;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 28px;
      gap: 18px;
    }
    .btn-print {
      border: 1px solid #B45309;
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
    }
    .ticket {
      width: 720px;
      background: #FFFFFF;
      border: 1.5px solid #DEC58B;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 22px 55px rgba(11, 25, 44, 0.12);
    }
    .airline-bar {
      background: ${theme.accent};
      color: #FFFFFF;
      padding: 10px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .ticket-body { padding: 26px 28px; }
    .route-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 20px;
      align-items: center;
      margin: 18px 0;
      padding: 14px 18px;
      background: ${theme.softBg};
      border: 1px solid ${theme.accent}33;
      border-radius: 14px;
    }
    .airport-code { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 700; color: #0B192C; line-height: 1; }
    .airport-sub { font-size: 11px; color: #475569; margin-top: 4px; display: block; }
    .flight-line { display: flex; align-items: center; gap: 10px; color: ${theme.accent}; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
    .flight-line span.dash { flex: 1; border-bottom: 2px dashed ${theme.accent}; }
    h1 { font-family: 'Marcellus', serif; font-size: 22px; font-weight: 400; color: #0B192C; margin-bottom: 6px; }
    .desc { font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 18px; }
    .grid { display: grid; grid-template-columns: 1fr 142px; gap: 20px; align-items: center; border-top: 1px dashed #CBD5E1; padding-top: 18px; }
    .code-box { display: inline-block; padding: 10px 18px; border-radius: 10px; background: #FCF9F2; border: 1.5px dashed ${theme.accent}; font-family: 'JetBrains Mono', monospace; font-size: 21px; font-weight: 700; letter-spacing: 0.14em; color: #0B192C; margin: 6px 0 8px; }
    .qr-wrap { padding: 6px; border: 1px solid #CBD5E1; border-radius: 12px; background: #FFFFFF; }
    .qr-wrap svg { width: 126px; height: 126px; display: block; }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .no-print { display: none !important; }
      .ticket { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="no-print"><button class="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF (⌘P)</button></div>
  <div class="ticket">
    <div class="airline-bar">
      <span>✈ PROTOCOLO SOLAR AIRLINES · CARTÃO DE EMBARQUE</span>
      <span>VOO ${theme.flightNo} · ${safeValue} OFF</span>
    </div>
    <div class="ticket-body">
      ${lightPaperLogoSvg(theme.accent)}
      <div class="route-row">
        <div><span class="airport-code">${theme.fromCode}</span><span class="airport-sub">${theme.fromLabel}</span></div>
        <div class="flight-line"><span class="dash"></span><span>✈ ☀ ${theme.flightNo}</span><span class="dash"></span></div>
        <div style="text-align:right;"><span class="airport-code" style="color:${theme.accent};">${theme.toCode}</span><span class="airport-sub">${theme.toLabel}</span></div>
      </div>
      <h1>“Você não vê o Wi-Fi nem as ondas de energia, mas confia neles todo dia.”</h1>
      <p class="desc">Com o Sol no seu aniversário é igual: a cidade não faz mágica — ela gira seu mapa e sintoniza o próximo ano. <strong>Presente: ${safeLabel}.</strong></p>
      <div class="grid">
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:0.14em;">Passageiro(a): ${hasRecipient ? safeRecipient : "__________________"} · Código de Embarque</div>
          <div class="code-box">${safeCode}</div>
          <div style="font-size:11.5px;color:#475569;">${safeDesc} Resgate pelo QR Code ou em <strong>protocolosolar.com.br/resgatar</strong>.</div>
        </div>
        <div class="qr-wrap">${qrSvg}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  const themesJson = JSON.stringify(
    Object.fromEntries(
      Object.entries(BOARDING_VISUAL_THEMES).map(([k, v]) => [
        k,
        {
          ...v,
          logoSvg: lightPaperLogoSvg(v.accent),
          horizonSvg: horizonArtworkSvg(k as BoardingPassVisual, v.accent),
          barcode: barcodeSvg(coupon.code + k, "#0B192C"),
        },
      ])
    )
  );

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Mídia Kit A4 Único (${safeCode}) · Protocolo Solar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=JetBrains+Mono:wght@500;600;700&family=Marcellus&display=swap" rel="stylesheet">
  <style>
    :root {
      --paper-bg: #EFEAE0;
      --sheet-bg: #FFFFFF;
      --ivory: #FCF9F2;
      --ink-navy: #0B192C;
      --ink-slate: #475569;
      --ink-muted: #64748B;
      --gold-rich: #B87A14;
      --gold-line: #DFC387;
      --bp-accent: ${theme.accent};
      --bp-soft: ${theme.softBg};
      --ps-display: "Marcellus", Georgia, serif;
      --ps-ui: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
      --ps-mono: "JetBrains Mono", ui-monospace, monospace;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      background: var(--paper-bg);
      color: var(--ink-navy);
      font-family: var(--ps-ui);
      line-height: 1.45;
      min-height: 100vh;
    }

    /* TOOLBAR (HIDDEN ON PRINT) */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid #DFC387;
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 8px 25px rgba(11, 25, 44, 0.08);
    }

    .tb-left { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .tb-pill {
      font-family: var(--ps-mono);
      font-size: 11px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #065F46;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      padding: 5px 11px;
      border-radius: 999px;
      font-weight: 700;
    }
    .tb-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
    .tb-select {
      background: var(--ivory);
      border: 1px solid #C9A227;
      color: var(--ink-navy);
      font-family: var(--ps-ui);
      font-size: 12.5px;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 9px;
      cursor: pointer;
    }
    .btn {
      appearance: none;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
      color: var(--ink-navy);
      font-family: var(--ps-ui);
      font-size: 12.5px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 9px;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #FFFFFF;
      border-color: #B45309;
      font-weight: 700;
    }

    /* FOLHA A4 ÚNICA REAL (210mm × 297mm) */
    .stage {
      padding: 26px 16px 60px;
      display: flex;
      justify-content: center;
    }

    .a4-sheet {
      width: 210mm;
      height: 297mm;
      background: var(--sheet-bg);
      padding: 11mm 12mm 10mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 24px 65px rgba(11, 25, 44, 0.16);
      overflow: hidden;
    }

    /* Moldura editorial sutil na folha A4 */
    .a4-sheet::before {
      content: "";
      position: absolute;
      inset: 5.5mm;
      border: 0.28mm solid #E5D4AA;
      pointer-events: none;
      z-index: 1;
    }

    /* TOPO DA FOLHA A4: LOGO LIMPA + SELO DO CONVITE */
    .a4-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.35mm solid #E8DCC0;
      padding-bottom: 3.5mm;
      position: relative;
      z-index: 2;
    }

    .a4-gift-tag {
      display: inline-flex;
      align-items: center;
      gap: 2mm;
      font-family: var(--ps-mono);
      font-size: 6.8pt;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--bp-accent);
      background: var(--bp-soft);
      border: 0.3mm solid var(--bp-accent);
      padding: 1.4mm 3.6mm;
      border-radius: 99mm;
    }

    /* CORPO ADVERTISING DA FOLHA A4 (CLARO / ANITTA PROMO POSTER STYLE) */
    .a4-advertising {
      display: grid;
      grid-template-columns: 1fr 78mm;
      gap: 5mm;
      align-items: center;
      flex: 1;
      padding: 4mm 0 2mm;
      position: relative;
      z-index: 2;
    }

    .a4-ad-rays {
      position: absolute;
      top: -20px;
      right: 0;
      width: 95mm;
      height: 95mm;
      background: radial-gradient(circle, rgba(245, 176, 65, 0.18) 0%, rgba(254, 247, 230, 0.08) 55%, transparent 75%);
      pointer-events: none;
      z-index: -1;
      border-radius: 50%;
    }

    .ad-copy {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2.8mm;
    }

    .ad-badge-top {
      display: inline-flex;
      align-items: center;
      gap: 1.8mm;
      font-family: var(--ps-mono);
      font-size: 6.8pt;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #92400E;
      background: #FEF3C7;
      border: 0.3mm solid #FCD34D;
      padding: 1.2mm 2.8mm;
      border-radius: 99mm;
      font-weight: 700;
      width: fit-content;
    }

    .ad-headline {
      font-family: var(--ps-display);
      font-size: 20pt;
      line-height: 1.12;
      color: var(--ink-navy);
      margin: 1.2mm 0 1.8mm;
      font-weight: 400;
      letter-spacing: -0.015em;
    }

    .ad-headline em {
      font-style: normal;
      color: #B45309;
      font-weight: 700;
      border-bottom: 0.8mm solid #F59E0B;
    }

    .ad-lead {
      margin: 0;
      font-size: 8.8pt;
      line-height: 1.48;
      color: var(--ink-slate);
    }

    .ad-lead strong {
      color: var(--ink-navy);
    }

    /* CARDS FLUTUANTES DE ALTO IMPACTO (ESTILO PAINÉIS RETAIL TELECOM) */
    .ad-promo-cards {
      display: flex;
      flex-direction: column;
      gap: 2.2mm;
      margin: 1.5mm 0;
    }

    .ad-promo-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 3mm;
      align-items: center;
      background: #FFFFFF;
      border: 0.35mm solid #E2E8F0;
      border-left: 1.2mm solid var(--promo-accent, var(--bp-accent));
      border-radius: 2.4mm;
      padding: 2.2mm 3.2mm;
      box-shadow: 0 2mm 5mm rgba(11, 25, 44, 0.04);
    }

    .ad-promo-card.highlight {
      background: #FFFBEB;
      border-color: #FDE68A;
      border-left: 1.2mm solid #D97706;
    }

    .ad-promo-icon {
      font-size: 13pt;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ad-promo-info strong {
      display: block;
      font-family: var(--ps-mono);
      font-size: 7.2pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-navy);
      font-weight: 700;
      margin-bottom: 0.3mm;
    }

    .ad-promo-info p {
      margin: 0;
      font-size: 7.2pt;
      line-height: 1.32;
      color: var(--ink-slate);
    }

    .ad-footer-note {
      font-size: 7.6pt;
      color: var(--ink-muted);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 0.25mm solid #E8DCC0;
      padding-top: 2mm;
    }

    .ad-footer-note strong {
      color: var(--ink-navy);
    }

    /* THEO EM RECORTE DINÂMICO (SEM CAIXA QUADRADA!) */
    .ad-theo-stage {
      position: relative;
      height: 100%;
      min-height: 78mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      overflow: visible;
    }

    .ad-theo-cutout {
      width: 100%;
      max-height: 82mm;
      object-fit: contain;
      object-position: center bottom;
      display: block;
      filter: drop-shadow(0 6mm 10mm rgba(11, 25, 44, 0.12));
      transform: scale(1.04);
      transform-origin: bottom center;
      position: relative;
      z-index: 2;
    }

    .ad-speech-bubble {
      position: absolute;
      top: 6mm;
      left: -10mm;
      background: #FFFFFF;
      border: 0.35mm solid #F59E0B;
      border-radius: 3mm;
      padding: 2mm 3.2mm;
      box-shadow: 0 4mm 10mm rgba(11, 25, 44, 0.09);
      max-width: 52mm;
      z-index: 3;
    }

    .ad-speech-bubble strong {
      display: block;
      font-family: var(--ps-mono);
      font-size: 6.2pt;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #B45309;
      margin-bottom: 0.3mm;
    }

    .ad-speech-bubble p {
      margin: 0;
      font-size: 7pt;
      line-height: 1.25;
      color: var(--ink-navy);
      font-weight: 600;
    }

    .ad-speech-bubble::after {
      content: "";
      position: absolute;
      bottom: -2.2mm;
      left: 12mm;
      width: 3.5mm;
      height: 3.5mm;
      background: #FFFFFF;
      border-right: 0.35mm solid #F59E0B;
      border-bottom: 0.35mm solid #F59E0B;
      transform: rotate(45deg);
    }

    /* ======================================================================
       LINHA DE PICOTE / DESTAQUE (ENTRE APRESENTAÇÃO E PASSAGEM AÉREA)
       ====================================================================== */
    .tear-divider {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 3mm;
      margin: 1mm 0 2.5mm;
      color: var(--gold-rich);
      font-family: var(--ps-mono);
      font-size: 6pt;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
    }

    .tear-divider::before,
    .tear-divider::after {
      content: "";
      flex: 1;
      border-top: 0.45mm dashed #B87A14;
    }

    /* ======================================================================
       PASSAGEM AÉREA REAL NO RODAPÉ DA FOLHA A4 (186mm × 81mm)
       ====================================================================== */
    .boarding-pass {
      width: 100%;
      height: 81mm;
      border-radius: 3.2mm;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 52mm;
      background: #FFFFFF;
      border: 0.35mm solid #DEC58B;
      position: relative;
      z-index: 2;
    }

    .bp-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
    }

    .bp-airline-strip {
      background: var(--bp-accent);
      color: #FFFFFF;
      padding: 2mm 5mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--ps-mono);
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .bp-content {
      padding: 2.8mm 5mm 2.4mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      gap: 2.4mm;
    }

    .bp-route-stage {
      position: relative;
      background: var(--bp-soft);
      border: 0.25mm solid #E5D5AE;
      border-radius: 2.4mm;
      padding: 3.2mm 4.5mm 2.8mm;
      overflow: hidden;
      isolation: isolate;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .bp-route-subline {
      margin: 1.5mm 0 0;
      padding-top: 1.5mm;
      border-top: 0.22mm solid rgba(11, 25, 44, 0.12);
      font-size: 7.4pt;
      color: var(--ink-slate);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3mm;
    }

    .bp-route-subline strong {
      color: var(--ink-navy);
    }

    .bp-horizon-art {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: -1;
    }

    .bp-horizon-art svg { width: 100%; height: 100%; display: block; }

    .bp-route-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 4mm;
      align-items: center;
    }

    .bp-airport { display: flex; flex-direction: column; }
    .bp-airport.right { text-align: right; }

    .bp-iata {
      font-family: var(--ps-mono);
      font-size: 19pt;
      font-weight: 700;
      line-height: 1;
      color: var(--ink-navy);
      letter-spacing: -0.02em;
    }

    .bp-iata.accent { color: var(--bp-accent); }

    .bp-city {
      font-family: var(--ps-mono);
      font-size: 5.4pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-slate);
      margin-top: 0.6mm;
      font-weight: 600;
    }

    .bp-flight-arc {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6mm;
    }

    .bp-arc-label {
      font-family: var(--ps-mono);
      font-size: 5pt;
      letter-spacing: 0.13em;
      color: var(--bp-accent);
      font-weight: 700;
    }

    .bp-arc-line {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1.4mm;
    }

    .bp-arc-line .dot { width: 1.6mm; height: 1.6mm; border-radius: 50%; background: var(--bp-accent); }
    .bp-arc-line .track { flex: 1; border-bottom: 0.42mm dashed var(--bp-accent); }
    .bp-arc-line .plane { font-size: 10pt; color: var(--bp-accent); line-height: 1; }
    .bp-arc-sub { font-family: var(--ps-mono); font-size: 4.8pt; letter-spacing: 0.1em; color: var(--ink-muted); }

    .bp-telemetry {
      display: grid;
      grid-template-columns: 1.4fr 0.65fr 0.8fr 0.65fr 1.1fr;
      gap: 1.6mm;
    }

    .bp-cell {
      border: 0.22mm solid #E2E8F0;
      background: var(--ivory);
      border-radius: 1.6mm;
      padding: 1mm 2mm;
      display: flex;
      flex-direction: column;
      gap: 0.25mm;
    }

    .bp-cell-label {
      font-family: var(--ps-mono);
      font-size: 4.6pt;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }

    .bp-cell-value {
      font-family: var(--ps-mono);
      font-size: 7pt;
      font-weight: 700;
      color: var(--ink-navy);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bp-cell-value.accent { color: var(--bp-accent); }
    .handwrite-line { border-bottom: 0.36mm dotted #B87A14; height: 3.5mm; min-width: 28mm; display: inline-block; }

    .bp-barcode-footer {
      padding: 1.4mm 5mm 2.2mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3mm;
      border-top: 0.22mm solid #E2E8F0;
    }

    .bp-barcode-svg { width: 44mm; height: 4.4mm; }
    .bp-barcode-svg svg { width: 100%; height: 100%; display: block; }
    .bp-barcode-text { font-family: var(--ps-mono); font-size: 5pt; letter-spacing: 0.09em; color: var(--ink-muted); text-transform: uppercase; }

    /* CANHOTO DESTACÁVEL À DIREITA (52mm) */
    .bp-stub {
      position: relative;
      background: var(--ivory);
      border-left: 0.5mm dashed var(--bp-accent);
      display: flex;
      flex-direction: column;
    }

    .bp-stub::before,
    .bp-stub::after {
      content: "";
      position: absolute;
      left: -2.8mm;
      width: 5.4mm;
      height: 5.4mm;
      border-radius: 50%;
      background: var(--sheet-bg);
      border: 0.28mm solid #DEC58B;
      z-index: 10;
    }
    .bp-stub::before { top: -2.8mm; }
    .bp-stub::after { bottom: -2.8mm; }

    .bp-stub-header {
      background: var(--bp-accent);
      color: #FFFFFF;
      padding: 2mm 3mm;
      text-align: center;
      font-family: var(--ps-mono);
      font-size: 5.9pt;
      font-weight: 700;
      letter-spacing: 0.11em;
    }

    .bp-stub-body {
      padding: 3mm 4mm 2.8mm;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }

    .bp-stub-badge {
      font-family: var(--ps-mono);
      font-size: 5.4pt;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #FFFFFF;
      background: var(--ink-navy);
      padding: 0.8mm 2.4mm;
      border-radius: 99mm;
      font-weight: 700;
      display: inline-block;
    }

    .bp-stub-benefit {
      font-family: var(--ps-mono);
      font-size: 5.3pt;
      color: var(--ink-navy);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-top: 0.8mm;
      display: block;
      font-weight: 700;
      line-height: 1.25;
    }

    .qr-frame {
      padding: 1.4mm;
      background: #FFFFFF;
      border: 0.28mm solid #CBD5E1;
      border-radius: 1.8mm;
      display: inline-flex;
    }

    .qr-frame svg { width: 21mm; height: 21mm; display: block; }

    .coupon-box {
      width: 100%;
      background: #FFFFFF;
      border: 0.38mm dashed var(--bp-accent);
      border-radius: 1.6mm;
      padding: 1.2mm 1.8mm;
    }

    .coupon-label {
      font-family: var(--ps-mono);
      font-size: 4.5pt;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: var(--ink-muted);
      display: block;
    }

    .coupon-code {
      font-family: var(--ps-mono);
      font-size: 8.2pt;
      font-weight: 700;
      letter-spacing: 0.07em;
      color: var(--ink-navy);
      display: block;
    }

    .bp-stub-url {
      font-family: var(--ps-mono);
      font-size: 4.9pt;
      color: var(--ink-muted);
      font-weight: 600;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      body { background: #FFFFFF !important; }
      .print-toolbar { display: none !important; }
      .stage { padding: 0 !important; }
      .a4-sheet {
        box-shadow: none !important;
        margin: 0 !important;
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <header class="print-toolbar">
    <div class="tb-left">
      <div id="topLogo">${lightPaperLogoSvg(theme.accent)}</div>
      <span class="tb-pill">Folha A4 Única · Cupom ${safeCode}</span>
    </div>
    <div class="tb-actions">
      <select class="tb-select" id="selVisual" title="Escolha a cor/rota da folha">
        <option value="theo" ${visual === "theo" ? "selected" : ""}>☀️ Ouro Solar (Padrão)</option>
        <option value="zurich" ${visual === "zurich" ? "selected" : ""}>💚 Zurique · Casa 2 (Verde)</option>
        <option value="ny" ${visual === "ny" ? "selected" : ""}>💙 Nova York · Casa 10 (Azul)</option>
        <option value="roma" ${visual === "roma" ? "selected" : ""}>❤️ Roma · Casas 5 &amp; 7 (Coral)</option>
        <option value="paris" ${visual === "paris" ? "selected" : ""}>💗 Paris · Paixão (Rosa)</option>
        <option value="tokyo" ${visual === "tokyo" ? "selected" : ""}>🧡 Tóquio · Futuro (Âmbar)</option>
      </select>
      <button type="button" class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Folha A4 / Salvar PDF (⌘P)</button>
    </div>
  </header>

  <main class="stage">
    <article id="a4Sheet" class="a4-sheet">
      <!-- 1. TOPO: LOGO DO SITE + BADGE CONVITE -->
      <header class="a4-header">
        <div class="a4-logo-slot">${lightPaperLogoSvg(theme.accent)}</div>
        <span class="a4-gift-tag">${giftIconSvg(theme.accent)} <span>Convite Especial · ${safeShort}</span></span>
      </header>

      <!-- 2. CORPO ADVERTISING DA FOLHA A4 (CLARO / ANITTA PROMO POSTER STYLE) -->
      <section class="a4-advertising">
        <div class="a4-ad-rays"></div>

        <div class="ad-copy">
          <div>
            <span class="ad-badge-top">
              ${wifiIconSvg(theme.accent)}
              <span>O PODER DA REVOLUÇÃO SOLAR · SEM MISTICISMO</span>
            </span>

            <h1 class="ad-headline">Você não vê o Wi-Fi nem as ondas de energia, mas <em>confia neles todo dia.</em></h1>
            <p class="ad-lead">
              Com o Sol no seu aniversário é igual: <strong>a cidade não faz mágica</strong> — ela sintoniza onde sua energia ganha força máxima o ano inteiro.
            </p>
          </div>

          <div class="ad-promo-cards">
            <div class="ad-promo-card highlight" style="--promo-accent:#D97706;">
              <div class="ad-promo-icon">📶</div>
              <div class="ad-promo-info">
                <strong>SINAL 100% · 12 CASAS · 365 DIAS</strong>
                <p>Precisão astronômica de ±0.01° GPS sintonizando Dinheiro, Carreira e Amor.</p>
              </div>
            </div>

            <div class="ad-promo-card" style="--promo-accent:#0284C7;">
              <div class="ad-promo-icon">🧭</div>
              <div class="ad-promo-info">
                <strong>3 MODOS LIVRES DE NAVEGAÇÃO</strong>
                <p>Simule e descubra onde passar seu aniversário: Por Cidade, Por Casa ou Por Intenção.</p>
              </div>
            </div>

            <div class="ad-promo-card" style="--promo-accent:#059669;">
              <div class="ad-promo-icon">🎁</div>
              <div class="ad-promo-info">
                <strong>PRESENTE VIP 100% LIBERADO</strong>
                <p>Seu acesso completo no app está pago. Destaque o cartão de embarque abaixo e resgate.</p>
              </div>
            </div>
          </div>

          <div class="ad-footer-note">
            <span>Acesse direto pelo smartphone em <strong>protocolosolar.com.br</strong></span>
            <strong>${safeHost}</strong>
          </div>
        </div>

        <div class="ad-theo-stage">
          <div class="ad-speech-bubble">
            <strong>Theo · Seu Guia Solar</strong>
            <p>“Escolha onde passar seu aniversário e sintonize seu melhor ano.”</p>
          </div>
          <img class="ad-theo-cutout" src="${theoCutoutUrl}" onerror="this.onerror=null;this.src='${theoFallbackUrl}';" alt="Theo · Protocolo Solar" />
        </div>
      </section>

      <!-- 3. LINHA DE CORTE / DESTAQUE -->
      <div class="tear-divider">${scissorsIconSvg("#B87A14")} <span>Destaque abaixo o seu Boarding Pass com o código do presente</span></div>

      <!-- 4. RODAPÉ DA A4: PASSAGEM AÉREA REAL COM CÓDIGO + QR -->
      <section class="boarding-pass" aria-label="Boarding Pass do Presente">
        <div class="bp-main">
          <div class="bp-airline-strip">
            <span>✈ PROTOCOLO SOLAR AIRLINES · CARTÃO DE EMBARQUE</span>
            <span class="bp-strip-right">VOO ${theme.flightNo} &nbsp;•&nbsp; PRESENTE VIP</span>
          </div>

          <div class="bp-content">
            <div class="bp-route-stage">
              <div class="bp-horizon-art">${horizonArtworkSvg(visual, theme.accent)}</div>
              <div class="bp-route-row">
                <div class="bp-airport">
                  <span class="bp-iata">${theme.fromCode}</span>
                  <span class="bp-city">${theme.fromLabel}</span>
                </div>
                <div class="bp-flight-arc">
                  <span class="bp-arc-label">REVOLUÇÃO SOLAR</span>
                  <div class="bp-arc-line">
                    <span class="dot"></span><span class="track"></span><span class="plane">✈</span><span class="track"></span><span class="dot"></span>
                  </div>
                  <span class="bp-arc-sub">24H NA COORDENADA</span>
                </div>
                <div class="bp-airport right">
                  <span class="bp-iata accent">${theme.toCode}</span>
                  <span class="bp-city">${theme.toLabel}</span>
                </div>
              </div>
              <div class="bp-route-subline">
                <span><strong>Como usar:</strong> acesse <strong>protocolosolar.com.br/resgatar</strong> e simule Por Cidade, Casa ou Intenção.</span>
                <span style="font-family:var(--ps-mono);font-size:6pt;color:var(--bp-accent);font-weight:700;white-space:nowrap;">12 CASAS · ±0.01° GPS</span>
              </div>
            </div>

            <div class="bp-telemetry">
              <div class="bp-cell">
                <span class="bp-cell-label">Passageiro(a) / Passenger</span>
                ${recipientHtml}
              </div>
              <div class="bp-cell">
                <span class="bp-cell-label">Voo / Flight</span>
                <span class="bp-cell-value bp-flight-val">${theme.flightNo}</span>
              </div>
              <div class="bp-cell">
                <span class="bp-cell-label">Portão / Gate</span>
                <span class="bp-cell-value bp-gate-val">${theme.gateLabel}</span>
              </div>
              <div class="bp-cell">
                <span class="bp-cell-label">Assento / Seat</span>
                <span class="bp-cell-value">12A · VIP</span>
              </div>
              <div class="bp-cell">
                <span class="bp-cell-label">Presente de</span>
                <span class="bp-cell-value">${safeHost}</span>
              </div>
            </div>
          </div>

          <div class="bp-barcode-footer">
            <div class="bp-barcode-svg">${barcodeSvg(coupon.code + visual, "#0B192C")}</div>
            <span class="bp-barcode-text">${safeCode} // ${safeShort} // ${safeValue} OFF</span>
          </div>
        </div>

        <div class="bp-stub">
          <div class="bp-stub-header"><span>RESGATE SEU PRESENTE</span></div>
          <div class="bp-stub-body">
            <div>
              <span class="bp-stub-badge">${safeValue} OFF</span>
              <span class="bp-stub-benefit">${safeLabel}</span>
            </div>
            <div class="qr-frame">${qrSvg}</div>
            <div class="coupon-box">
              <span class="coupon-label">Código do Presente</span>
              <span class="coupon-code">${safeCode}</span>
            </div>
            <span class="bp-stub-url">protocolosolar.com.br/resgatar</span>
          </div>
        </div>
      </section>
    </article>
  </main>

  <script>
    const THEMES = ${themesJson};
    const selVisual = document.getElementById("selVisual");
    const root = document.documentElement;

    if (selVisual) {
      selVisual.addEventListener("change", () => {
        const k = selVisual.value;
        const t = THEMES[k] || THEMES.theo;
        root.style.setProperty("--bp-accent", t.accent);
        root.style.setProperty("--bp-soft", t.softBg);
        document.querySelector(".a4-logo-slot").innerHTML = t.logoSvg;
        document.getElementById("topLogo").innerHTML = t.logoSvg;
        document.querySelector(".bp-horizon-art").innerHTML = t.horizonSvg;
        document.querySelector(".bp-strip-right").textContent = "VOO " + t.flightNo + " • PRESENTE VIP";
        const iatas = document.querySelectorAll(".bp-iata");
        const cities = document.querySelectorAll(".bp-city");
        if (iatas[0]) iatas[0].textContent = t.fromCode;
        if (iatas[1]) iatas[1].textContent = t.toCode;
        if (cities[0]) cities[0].textContent = t.fromLabel;
        if (cities[1]) cities[1].textContent = t.toLabel;
        document.querySelector(".bp-flight-val").textContent = t.flightNo;
        document.querySelector(".bp-gate-val").textContent = t.gateLabel;
        document.querySelector(".bp-barcode-svg").innerHTML = t.barcode;
      });
    }
  </script>
</body>
</html>`;
}
