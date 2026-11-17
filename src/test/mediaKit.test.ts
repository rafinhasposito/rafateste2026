import { describe, expect, it } from "vitest";
import { renderQrSvg } from "@/lib/qrSvg";
import { buildMediaKitPrintHtml } from "@/lib/mediaKitPrint";
import type { RedeemCouponRow } from "@/lib/coupons";

const sampleCoupon: RedeemCouponRow = {
  id: "1",
  code: "SOLAR-WIFI-99",
  reward_type: "full_map",
  credits_amount: 7,
  recipient_name: "Camila Santos",
  note: "Mídia Kit VIP",
  max_uses: 1,
  uses_count: 0,
  active: true,
  expires_at: null,
  created_at: new Date().toISOString(),
};

describe("Mídia Kit Print & QR Generator", () => {
  it("renders crisp vector SVG QR codes for V4 and V5 URLs", () => {
    const shortSvg = renderQrSvg("https://protocolosolar.com.br/resgatar?code=SOLAR-WIFI-99");
    expect(shortSvg).toContain('<svg viewBox="-2 -2 37 37"');
    expect(shortSvg).toContain("<path d=");

    const longUrl = "https://preview.protocolosolar.com.br/resgatar?code=SOLAR-CONVIDADO-ESPECIAL-ANIVERSARIO-2026";
    const longSvg = renderQrSvg(longUrl);
    expect(longSvg).toContain('<svg viewBox="-2 -2 41 41"');
  });

  it("builds light-paper A4 Media Kit HTML connected to real Admin coupon data and visual selector", () => {
    const html = buildMediaKitPrintHtml({
      coupon: sampleCoupon,
      redeemUrl: "https://protocolosolar.com.br/resgatar?code=SOLAR-WIFI-99",
      origin: "https://protocolosolar.com.br",
      hostSignature: "POR RAFAEL SPOSITO",
      visual: "zurich",
      mode: "full",
    });

    expect(html).toContain("SOLAR-WIFI-99");
    expect(html).toContain("CAMILA SANTOS");
    expect(html).toContain("Você não vê o Wi-Fi");
    expect(html).toContain("protocolosolar.com.br/resgatar");
    expect(html).toContain("POR RAFAEL SPOSITO");
    expect(html).toContain("ZRH");
    expect(html).toContain("CARTÃO DE EMBARQUE");
    expect(html).toContain("a4-sheet");
    expect(html).toContain("theo-midia-kit.png");
  });

  it("supports blank handwrite line and escapes HTML in recipient names", () => {
    const html = buildMediaKitPrintHtml({
      coupon: { ...sampleCoupon, recipient_name: "<script>alert(1)</script>" },
      redeemUrl: "https://protocolosolar.com.br/resgatar?code=SOLAR-WIFI-99",
      origin: "https://protocolosolar.com.br",
      blankRecipientLine: false,
      mode: "card",
    });

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;SCRIPT&gt;ALERT(1)&lt;/SCRIPT&gt;");

    const blankHtml = buildMediaKitPrintHtml({
      coupon: sampleCoupon,
      redeemUrl: "https://protocolosolar.com.br/resgatar?code=SOLAR-WIFI-99",
      origin: "https://protocolosolar.com.br",
      blankRecipientLine: true,
      mode: "full",
    });

    expect(blankHtml).toContain("handwrite-line");
  });
});
