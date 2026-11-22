import { beforeEach, describe, expect, it } from "vitest";
import {
  AFFILIATE_REF_STORAGE_KEY,
  AFFILIATE_WINDOW_DAYS,
  buildAffiliateLink,
  buildAffiliateWhatsAppShareUrl,
  calculateCommissionBrl,
  extractRefFromPathname,
  extractRefFromSearch,
  formatAffiliateShortPath,
  formatPartnerIdLabel,
  generatePartnerNumber,
  getStoredAffiliateRef,
  isValidAffiliateCode,
  normalizeAffiliateCode,
  RESERVED_AFFILIATE_CODES,
  saveStoredAffiliateRef,
  suggestAffiliateCodeFromName,
  extractAffiliateTag,
  applyAffiliateTagToNotes,
  stripAffiliateTagFromNotes,
  computeAffiliateConversionPct,
  isAffiliateInactiveZeroSales,
  buildAffiliatesPixCsv,
  type AdminAffiliateRow,
} from "@/lib/affiliates";

describe("Sistema de Afiliados — cálculos e rastreamento", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calcula 20% corretamente sobre os 3 preços oficiais sem alterar valor do cliente", () => {
    expect(calculateCommissionBrl(19.9, 20)).toBe(3.98);
    expect(calculateCommissionBrl(49.9, 20)).toBe(9.98);
    expect(calculateCommissionBrl(99.9, 20)).toBe(19.98);
  });

  it("suporta taxas personalizadas e protege contra valores inválidos", () => {
    expect(calculateCommissionBrl(99.9, 25)).toBe(24.98);
    expect(calculateCommissionBrl(49.9, 10)).toBe(4.99);
    expect(calculateCommissionBrl(0, 20)).toBe(0);
    expect(calculateCommissionBrl(-50, 20)).toBe(0);
    expect(calculateCommissionBrl(99.9, 0)).toBe(0);
  });

  it("normaliza e valida códigos de afiliado", () => {
    expect(normalizeAffiliateCode("  camilá rocha! ")).toBe("CAMILA-ROCHA");
    expect(normalizeAffiliateCode("joao_2026")).toBe("JOAO_2026");
    expect(isValidAffiliateCode("CAMILA")).toBe(true);
    expect(isValidAffiliateCode("ab")).toBe(false);
    expect(isValidAffiliateCode("")).toBe(false);
  });

  it("extrai ?ref=, ?afiliado= e ?partner= da query string", () => {
    expect(extractRefFromSearch("?ref=camila")).toBe("CAMILA");
    expect(extractRefFromSearch("?utm_source=ig&afiliado=ana-solar")).toBe("ANA-SOLAR");
    expect(extractRefFromSearch("?partner=vip_01")).toBe("VIP_01");
    expect(extractRefFromSearch("?ref=x")).toBeNull();
    expect(extractRefFromSearch("")).toBeNull();
  });

  it("persiste o código por 30 dias e expira corretamente após a janela", () => {
    const t0 = 1_700_000_000_000;
    const saved = saveStoredAffiliateRef("camila", t0);
    expect(saved?.code).toBe("CAMILA");

    // 15 dias depois: ainda válido
    const day15 = t0 + 15 * 24 * 60 * 60 * 1000;
    expect(getStoredAffiliateRef(day15)).toBe("CAMILA");

    // 31 dias depois: expirado e limpo do localStorage
    const day31 = t0 + (AFFILIATE_WINDOW_DAYS + 1) * 24 * 60 * 60 * 1000;
    expect(getStoredAffiliateRef(day31)).toBeNull();
    expect(localStorage.getItem(AFFILIATE_REF_STORAGE_KEY)).toBeNull();
  });

  it("gera link curto /i/ oficial e link de compartilhamento WhatsApp", () => {
    expect(buildAffiliateLink("482917", "https://protocolosolar.com.br")).toBe(
      "https://protocolosolar.com.br/i/482917"
    );
    expect(buildAffiliateLink("CAMILA", "https://protocolosolar.com.br")).toBe(
      "https://protocolosolar.com.br/i/camila"
    );
    expect(formatAffiliateShortPath("482917")).toBe("protocolosolar.com.br/i/482917");
    expect(formatPartnerIdLabel("482917")).toBe("#482917");
    expect(formatPartnerIdLabel("CAMILA")).toBe("CAMILA");

    const wa = buildAffiliateWhatsAppShareUrl("482917", "https://protocolosolar.com.br");
    expect(wa).toContain("https://wa.me/?text=");
    expect(decodeURIComponent(wa)).toContain("https://protocolosolar.com.br/i/482917");
  });

  it("extrai código tanto de rotas curtas /i/ e /r/ quanto de ?ref=", () => {
    expect(extractRefFromPathname("/i/482917")).toBe("482917");
    expect(extractRefFromPathname("/i/camila")).toBe("CAMILA");
    expect(extractRefFromPathname("/r/ana-solar")).toBe("ANA-SOLAR");
    expect(extractRefFromPathname("/parceiros")).toBeNull();
  });

  it("gera número de cadastro de 6 dígitos e nunca vaza prefixo de e-mail na sugestão", () => {
    const num = generatePartnerNumber();
    expect(num).toMatch(/^\d{6}$/);
    expect(Number(num)).toBeGreaterThanOrEqual(100000);
    expect(Number(num)).toBeLessThanOrEqual(999999);

    expect(suggestAffiliateCodeFromName("Rafael Sposito")).toBe("RAFAEL");
    expect(suggestAffiliateCodeFromName("todomundorp@gmail.com")).toBe("");
    expect(suggestAffiliateCodeFromName("Admin")).toBe("ADMIN2026");
    expect(RESERVED_AFFILIATE_CODES.has("ADMIN")).toBe(true);
  });

  it("gerencia tags/tiers, inatividade de 0 vendas e exportação CSV da Folha Pix", () => {
    expect(extractAffiliateTag("[VIP] @anasolar")).toBe("VIP");
    expect(extractAffiliateTag("[INFLUENCER] TikTok")).toBe("INFLUENCER");
    expect(extractAffiliateTag("Nota comum")).toBe("PADRAO");
    expect(stripAffiliateTagFromNotes("[VIP] @anasolar")).toBe("@anasolar");
    expect(applyAffiliateTagToNotes("[VIP] @anasolar", "INFLUENCER")).toBe(
      "[INFLUENCER] @anasolar"
    );
    expect(applyAffiliateTagToNotes("[VIP] @anasolar", "PADRAO")).toBe("@anasolar");

    expect(computeAffiliateConversionPct(100, 5)).toBe(5);
    expect(computeAffiliateConversionPct(0, 0)).toBe(0);

    const nowMs = Date.parse("2026-11-22T00:00:00Z");
    const inactive45d = {
      sales_count: 0,
      clicks_count: 0,
      created_at: "2026-10-01T00:00:00Z",
    };
    const activeSeller = {
      sales_count: 2,
      clicks_count: 15,
      created_at: "2026-09-01T00:00:00Z",
    };
    expect(isAffiliateInactiveZeroSales(inactive45d, 30, false, nowMs)).toBe(true);
    expect(isAffiliateInactiveZeroSales(inactive45d, 60, false, nowMs)).toBe(false);
    expect(isAffiliateInactiveZeroSales(activeSeller, 30, false, nowMs)).toBe(false);

    const sampleRows: AdminAffiliateRow[] = [
      {
        id: "1",
        user_id: null,
        code: "482917",
        name: "Ana Solar",
        email: "ana@solar.com",
        pix_key: "ana@pix.com",
        commission_rate: 25,
        active: true,
        clicks_count: 40,
        created_at: "2026-11-01T00:00:00Z",
        notes: "[INFLUENCER]",
        referred_users_count: 5,
        sales_count: 3,
        pending_brl: 49.9,
        paid_brl: 19.9,
        total_brl: 69.8,
        volume_brl: 279.2,
      },
      {
        id: "2",
        user_id: null,
        code: "111222",
        name: "Saldo Baixo",
        email: null,
        pix_key: "111",
        commission_rate: 20,
        active: true,
        clicks_count: 5,
        created_at: "2026-11-01T00:00:00Z",
        notes: null,
        referred_users_count: 1,
        sales_count: 1,
        pending_brl: 3.98,
        paid_brl: 0,
        total_brl: 3.98,
        volume_brl: 19.9,
      },
    ];

    const csvMin20 = buildAffiliatesPixCsv(sampleRows, 20);
    expect(csvMin20).toContain("#482917;Ana Solar;ana@solar.com;ana@pix.com;49,90;25%");
    expect(csvMin20).not.toContain("Saldo Baixo");
  });
});
