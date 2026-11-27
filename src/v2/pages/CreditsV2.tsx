import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { supabase } from "@/integrations/supabase/client";
import {
  clearPendingGiftCode,
  getPendingGiftCode,
  redeemCouponCode,
  savePendingGiftCode
} from "@/lib/coupons";
import { getStoredAffiliateRef, syncAffiliateRefForUser } from "@/lib/affiliates";
import { AffiliateReferralBanner } from "@/components/AffiliateReferralBanner";
import { HOUSES_V2 } from "../data/housesV2";
import { getEnvelopeDataUrl } from "../components/envelopeCanvas";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

interface PixState {
  orderId: string;
  paymentId: string | number;
  qrCode: string;
  qrCodeBase64: string;
}

type TierKey = "single" | "combo3" | "full12";

const TIERS: Record<
  TierKey,
  {
    idx: number;
    pkgParam: "single" | "3" | "full";
    creditsTarget: number;
    pill: string;
    save: string;
    title: string;
    price: string;
    cta: string;
    bullets: string[];
  }
> = {
  single: {
    idx: 0,
    pkgParam: "single",
    creditsTarget: 1,
    pill: "1 CRÉDITO · PRIMEIRO PASSO",
    save: "Acesso imediato",
    title: "1 Crédito Solar",
    price: "19,90",
    cta: "Gerar Pix agora →",
    bullets: [
      "Libera 1 Casa ou 1 Cidade completa (todas as 8 áreas da vida abertas)",
      "Inclui seu Guia personalizado (12 meses + primeiras 24h)"
    ]
  },
  combo3: {
    idx: 1,
    pkgParam: "3",
    creditsTarget: 3,
    pill: "3 CRÉDITOS · PARA COMPARAR 3 OPÇÕES",
    save: "Economize R$ 9,80",
    title: "3 Créditos Solares",
    price: "49,90",
    cta: "Gerar Pix agora →",
    bullets: [
      "Compare 3 Casas ou 3 Cidades completas lado a lado",
      "Todas as 8 áreas da vida abertas nas 3 opções + Guia completo"
    ]
  },
  full12: {
    idx: 2,
    pkgParam: "full",
    creditsTarget: 12,
    pill: "12 CRÉDITOS · MAPA COMPLETO",
    save: "Todas as 12 Casas",
    title: "Mapa Completo · 12 Casas",
    price: "99,90",
    cta: "Liberar mapa completo →",
    bullets: [
      "Todas as 12 Casas do seu próximo ano liberadas de uma vez",
      "Explore qualquer cidade perto de casa, no Brasil e no mundo"
    ]
  }
};

export default function CreditsV2() {
  const { user, profile, session, refreshProfile } = useAuth();
  const { packages } = usePricing();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialPkg = searchParams.get("pkg");
  const initialTier: TierKey =
    initialPkg === "single" || initialPkg === "1"
      ? "single"
      : initialPkg === "full" || initialPkg === "12"
        ? "full12"
        : "combo3";

  const [tier, setTier] = useState<TierKey>(initialTier);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixState | null>(null);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [approved, setApproved] = useState(false);

  const isRedeem = location.pathname.includes("resgatar") || Boolean(searchParams.get("code") || searchParams.get("redeem"));
  const [couponCode, setCouponCode] = useState(() =>
    (searchParams.get("code") || searchParams.get("redeem") || (isRedeem ? getPendingGiftCode() || "" : "")).toUpperCase()
  );
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);
  const envUrls = useMemo(() => HOUSES_V2.map((h) => getEnvelopeDataUrl(h)), []);

  const rawReturnTo = searchParams.get("returnTo");
  const safeReturnTo = rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/v2/consultar";

  useEffect(() => {
    document.title = isRedeem ? "Resgatar Cupom — Protocolo Solar" : "Créditos Solares — Protocolo Solar";
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isRedeem]);

  useEffect(() => {
    const rawCode = searchParams.get("code") || searchParams.get("redeem");
    if (rawCode) {
      const saved = savePendingGiftCode(rawCode);
      if (saved) setCouponCode(saved);
    }
  }, [searchParams]);

  const activePricingItem: PricingItem | undefined = useMemo(() => {
    const targetCredits = TIERS[tier].creditsTarget;
    return (
      packages.find((p) => Number(p.credits_amount) === targetCredits) ||
      packages.find((p) =>
        targetCredits === 1 ? p.key.includes("1") || p.key.includes("single") :
        targetCredits === 3 ? p.key.includes("3") :
        p.key.includes("12") || p.key.includes("full")
      ) ||
      packages[TIERS[tier].idx]
    );
  }, [packages, tier]);

  const resolveToken = useCallback(async (): Promise<string | null> => {
    if (session?.access_token) return session.access_token;
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  }, [session?.access_token]);

  const handleGeneratePix = async () => {
    const t = TIERS[tier];
    if (!user) {
      navigate(`/v2/entrar?returnTo=${encodeURIComponent(`/v2/creditos?pkg=${t.pkgParam}&returnTo=${encodeURIComponent(safeReturnTo)}`)}`);
      return;
    }
    if (!activePricingItem) {
      navigate(`/credits?pkg=${t.pkgParam}&returnTo=${encodeURIComponent(safeReturnTo)}`);
      return;
    }

    setLoadingPix(true);
    setPixError(null);
    setPixData(null);
    setApproved(false);

    try {
      const token = await resolveToken();
      if (!token) {
        navigate(`/v2/entrar?returnTo=${encodeURIComponent(`/v2/creditos?pkg=${t.pkgParam}`)}`);
        return;
      }

      await syncAffiliateRefForUser();
      const affiliateCode = getStoredAffiliateRef();

      const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: {
          action: "create_pix",
          pricing_config_id: activePricingItem.key,
          ...(affiliateCode ? { affiliate_code: affiliateCode } : {})
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (error) throw new Error(error.message || "Erro ao gerar Pix.");
      if (data?.error) throw new Error(data.error);

      setPixData({
        orderId: data.orderId,
        paymentId: data.paymentId,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64
      });
    } catch (err: any) {
      setPixError(err?.message || "Não foi possível gerar o QR Code Pix agora.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCheckPix = async () => {
    if (!pixData) return;
    setChecking(true);
    try {
      const token = await resolveToken();
      if (!token) return;
      const { data } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: { action: "check_pix_status", orderId: pixData.orderId, paymentId: pixData.paymentId },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.status === "approved" || data?.approved) {
        setApproved(true);
        await refreshProfile();
        toast.success("Pagamento aprovado! Seus créditos já estão liberados.");
      } else {
        toast.info("Pagamento ainda em processamento. Assim que compensar, seus créditos entram automaticamente.");
      }
    } catch {
      toast.error("Não foi possível verificar agora.");
    } finally {
      setChecking(false);
    }
  };

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = couponCode.trim().toUpperCase();
    if (!cleaned) return;
    if (!user) {
      savePendingGiftCode(cleaned);
      navigate(`/v2/entrar?returnTo=${encodeURIComponent(`/v2/resgatar?code=${cleaned}`)}`);
      return;
    }
    setRedeeming(true);
    setRedeemSuccess(null);
    try {
      const res = await redeemCouponCode(cleaned);
      clearPendingGiftCode();
      await refreshProfile();
      setRedeemSuccess(res?.message || "Cupom resgatado com sucesso! Créditos adicionados à sua conta.");
      toast.success("Cupom resgatado com sucesso!");
    } catch (err: any) {
      toast.error(err?.message || "Cupom inválido ou já utilizado.");
    } finally {
      setRedeeming(false);
    }
  };

  const current = TIERS[tier];

  return (
    <div className="v2-root">
      <V2TopNav activeTab="credits" backTo={{ label: "← Home", to: "/v2" }} />

      <main
        style={{
          minHeight: "100svh",
          background: "linear-gradient(155deg, #F4EAE0 0%, #EFE1D0 100%)",
          padding: isMob ? "78px 20px 64px" : "96px min(4vw, 56px) 84px"
        }}
      >
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ marginBottom: 16 }}>
            <AffiliateReferralBanner />
          </div>

          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 28px" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.88)",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#101622",
                marginBottom: 14
              }}
            >
              ✦ Pagamento Único · Sem Assinatura · {user ? `Saldo atual: ${profile?.credits ?? 0} crédito(s)` : "Pix ou Cartão"}
            </span>
            <h1 className="v2-serif" style={{ fontSize: "clamp(32px, 4.8vw, 54px)", lineHeight: 1.03, color: "#101622", marginBottom: 10 }}>
              {isRedeem ? "Resgatar Seu Cupom Solar" : "Escolha Seus Créditos Solares"}
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.5, color: "#384357" }}>
              Cada crédito libera <strong>1 Casa ou 1 Cidade completa</strong> (já com todas as 8 áreas da vida abertas) + seu Guia personalizado.
            </p>
          </div>

          {/* KINETIC TIER SELECTOR */}
          <div className="v2-tier-seg-wrap">
            <div className="v2-tier-seg" role="tablist">
              <div className="v2-tier-thumb" style={{ transform: `translateX(${current.idx * 100}%)` }} />
              {(["single", "combo3", "full12"] as TierKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  className={`v2-tier-btn${tier === key ? " active" : ""}`}
                  onClick={() => {
                    setTier(key);
                    setPixData(null);
                    setPixError(null);
                  }}
                >
                  {key === "single" ? "1 Crédito" : key === "combo3" ? "3 Créditos ★" : "Mapa 12"}
                </button>
              ))}
            </div>
          </div>

          {/* STAGE WITH 1 -> 3 -> 12 ENVELOPES + REAL PIX CHECKOUT */}
          <div className="v2-pricing-stage">
            <div className="v2-morph-deck" aria-hidden="true">
              {HOUSES_V2.map((h, i) => {
                let opacity = 0;
                let transform = "translate3d(0, 26px, 0) scale(0.72)";
                let zIndex = 1;
                if (tier === "single") {
                  if (i === 1) { opacity = 1; zIndex = 15; transform = `translate3d(0,0,0) scale(${isMob ? 1.05 : 1.12}) rotate(-3deg)`; }
                } else if (tier === "combo3") {
                  const slots = [0, 1, 2];
                  const slot = slots.indexOf(i);
                  if (slot !== -1) {
                    opacity = 1;
                    zIndex = slot === 1 ? 16 : 10 + slot;
                    transform = `translate3d(${(slot - 1) * (isMob ? 56 : 84)}px, ${slot === 1 ? -12 : 8}px, 0) scale(${slot === 1 ? 1.08 : 0.94}) rotate(${(slot - 1) * 14}deg)`;
                  }
                } else {
                  const angle = -28 + i * (56 / 11);
                  const dx = (i - 5.5) * (isMob ? 13 : 19);
                  const dy = Math.abs(i - 5.5) * (isMob ? 2.2 : 3) - 6;
                  opacity = 1;
                  zIndex = 10 + i;
                  transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${isMob ? 0.8 : 0.88}) rotate(${angle.toFixed(1)}deg)`;
                }
                return (
                  <img
                    key={h.id}
                    src={envUrls[i]}
                    alt={`Envelope Casa ${h.code}`}
                    className="v2-morph-card"
                    style={{ opacity, transform, zIndex }}
                  />
                );
              })}
            </div>

            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <span style={{ padding: "6px 12px", borderRadius: 999, background: "#101622", color: "#F5D993", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em" }}>
                  {current.pill}
                </span>
                <span style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(16,22,34,0.08)", color: "#101622", fontSize: 10.5, fontWeight: 800 }}>
                  {current.save}
                </span>
              </div>

              <h2 className="v2-serif" style={{ fontSize: "clamp(24px, 3vw, 34px)", color: "#101622", marginBottom: 8 }}>
                {current.title}
              </h2>

              <div className="v2-odo-row">
                <div className="v2-odo-price">
                  <span className="v2-odo-prefix">R$</span>
                  <span className="v2-odo-slot">
                    <span className="v2-odo-strip" style={{ transform: `translateY(-${(current.idx * 100) / 3}%)` }}>
                      <span>1</span>
                      <span>4</span>
                      <span>9</span>
                    </span>
                  </span>
                  <span className="v2-odo-slot">
                    <span className="v2-odo-strip" style={{ transform: `translateY(-${(current.idx * 100) / 3}%)` }}>
                      <span>9</span>
                      <span>9</span>
                      <span>9</span>
                    </span>
                  </span>
                  <span>,90</span>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#384357" }}>pagamento único</span>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 22, padding: 0 }}>
                {current.bullets.map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 14.5, lineHeight: 1.48, color: "#384357" }}>
                    <span style={{ color: "#C9A227", fontWeight: 900 }}>✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {!pixData && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button type="button" disabled={loadingPix} className="v2-specular-btn" style={{ width: "100%" }} onClick={handleGeneratePix}>
                    {loadingPix ? "Gerando QR Code Pix..." : user ? current.cta : "Entrar e pagar com Pix →"}
                  </button>
                  <button
                    type="button"
                    className="v2-pill-btn"
                    style={{ width: "100%", height: 48, justifyContent: "center" }}
                    onClick={() => navigate(`/credits?pkg=${current.pkgParam}&returnTo=${encodeURIComponent(safeReturnTo)}`)}
                  >
                    Preferir pagar no Cartão de Crédito →
                  </button>
                </div>
              )}

              {pixError && (
                <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 12, background: "#FEF2F2", color: "#991B1B", fontSize: 13.5, fontWeight: 600 }}>
                  {pixError}
                </div>
              )}

              {pixData && (
                <div style={{ marginTop: 12, padding: 18, borderRadius: 20, background: "#FAF6F0", border: "1.5px solid rgba(16,22,34,0.1)", textAlign: "center" }}>
                  {approved ? (
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#15803D", marginBottom: 10 }}>
                        ✓ Pagamento aprovado! Créditos liberados.
                      </div>
                      <button type="button" className="v2-specular-btn" onClick={() => navigate(safeReturnTo)}>
                        Ir para minha consulta →
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#101622", marginBottom: 10 }}>
                        Escaneie ou copie o código Pix
                      </div>
                      {pixData.qrCodeBase64 && (
                        <img
                          src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                          alt="QR Code Pix"
                          style={{ width: 180, height: 180, margin: "0 auto 12px", borderRadius: 12, background: "#FFF", padding: 8 }}
                        />
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                        <button
                          type="button"
                          className="v2-specular-btn"
                          style={{ height: 46, flex: "1 1 180px" }}
                          onClick={() => {
                            navigator.clipboard?.writeText(pixData.qrCode);
                            setCopied(true);
                            toast.success("Código Pix copiado!");
                            setTimeout(() => setCopied(false), 2500);
                          }}
                        >
                          {copied ? "Código copiado ✓" : "Copiar Pix Copia e Cola"}
                        </button>
                        <button
                          type="button"
                          disabled={checking}
                          className="v2-pill-btn"
                          style={{ height: 46, justifyContent: "center" }}
                          onClick={handleCheckPix}
                        >
                          {checking ? "Verificando..." : "Já paguei"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CUPOM / RESGATAR */}
          <section
            style={{
              marginTop: 28,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 24,
              padding: isMob ? "20px 18px" : "26px 30px",
              border: "1.5px solid rgba(255,255,255,0.98)"
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A227", marginBottom: 6 }}>
              ✦ Cupom ou Vale-Presente
            </div>
            <h3 className="v2-serif" style={{ fontSize: 24, color: "#101622", marginBottom: 12 }}>
              Tem um código de resgate?
            </h3>
            <form onSubmit={handleRedeemCoupon} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Digite seu código (ex.: SOLAR2027)"
                style={{
                  flex: "1 1 240px",
                  height: 50,
                  padding: "0 16px",
                  borderRadius: 14,
                  border: "1.5px solid rgba(16,22,34,0.14)",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.08em"
                }}
              />
              <button type="submit" disabled={redeeming} className="v2-specular-btn" style={{ height: 50, padding: "0 24px" }}>
                {redeeming ? "Resgatando..." : "Resgatar código"}
              </button>
            </form>
            {redeemSuccess && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "#ECFDF5", color: "#065F46", fontSize: 13.5, fontWeight: 700 }}>
                {redeemSuccess}
              </div>
            )}
          </section>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(16,22,34,0.62)", lineHeight: 1.55 }}>
            Acesso digital imediato · Pagamento único via Mercado Pago (Pix ou Cartão) · Cálculo astronômico Swiss Ephemeris · Ferramenta cultural e informativa (18+), sem promessa determinística.
          </p>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="credits" />
    </div>
  );
}
