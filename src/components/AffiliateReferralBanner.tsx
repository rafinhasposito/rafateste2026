import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Copy, Check, Share2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import {
  buildAffiliateLink,
  buildAffiliateWhatsAppShareUrl,
} from "@/lib/affiliates";

interface AffiliateReferralBannerProps {
  variant?: "result" | "post-purchase";
  cityName?: string;
}

export const AffiliateReferralBanner = ({
  variant = "result",
  cityName,
}: AffiliateReferralBannerProps) => {
  const navigate = useNavigate();
  const { isAffiliate, affiliateCode } = useIsAffiliate();
  const [copied, setCopied] = useState(false);

  const shareLink = affiliateCode ? buildAffiliateLink(affiliateCode) : null;
  const whatsappUrl = affiliateCode ? buildAffiliateWhatsAppShareUrl(affiliateCode) : null;

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Seu link de indicação (20% Pix) foi copiado!");
    setTimeout(() => setCopied(false), 2400);
  };

  if (variant === "post-purchase") {
    return (
      <div className="mt-7 w-full max-w-lg mx-auto p-5 rounded-2xl border border-[#C9A227]/35 bg-gradient-to-r from-[#C9A227]/12 via-[#0A1324]/90 to-[#08111F]/90 text-left space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/45 flex items-center justify-center text-[#F5DE98] shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#F5DE98] font-bold">
              Indique & Ganhe 20% no Pix
            </p>
            <p className="text-xs sm:text-sm text-white/85 font-ps-ui leading-snug">
              Indique 5 amigos para o Mapa Completo e receba <strong className="text-[#FFF3D1]">R$ 99,90 de volta no Pix</strong> — 20% em cada compra feita pelo seu link.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isAffiliate && shareLink ? (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#050507] text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Link Copiado!" : "Copiar Meu Link"}
              </button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/afiliado")}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/50 text-[#FFF3D1] text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 transition-all"
            >
              <span>Ativar Meu Link Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant "result": convite elegante no fim da página de resultado
  return (
    <section className="w-full px-5 sm:px-6 pb-12 relative z-20">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-[28px] border border-[#C9A227]/35 bg-gradient-to-br from-[#0E1A32]/90 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-mono font-bold uppercase tracking-[0.18em]">
              <Sparkles className="w-3 h-3" /> Indique Amigos & Ganhe 20% no Pix
            </span>
            <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {cityName
                ? `Curtiu descobrir ${cityName}? Ganhe indicando para seus amigos.`
                : "Curtiu seu Mapa Solar? Ganhe indicando para seus amigos."}
            </h3>
            <p className="text-xs sm:text-sm text-white/65 font-ps-ui leading-relaxed">
              {isAffiliate && affiliateCode
                ? `Seu link exclusivo (?ref=${affiliateCode}) já está ativo. Cada amigo que comprar pelo seu link gera 20% direto para o seu saldo.`
                : "Ative seu link exclusivo em 10 segundos. O preço para seus amigos continua o mesmo e você ganha 20% em Pix por cada compra."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {isAffiliate && shareLink ? (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[48px] px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs font-extrabold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Link Copiado!" : "Copiar Meu Link"}
                </button>
                <div className="flex gap-2">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 text-[11px] font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/afiliado")}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/85 text-[11px] font-bold uppercase tracking-[0.12em]"
                  >
                    Painel
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/afiliado")}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs font-extrabold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <span>Ativar Meu Link Grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/parceiros")}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/75 hover:text-white text-[11px] font-semibold uppercase tracking-[0.12em] transition-all"
                >
                  Simular Quanto Posso Ganhar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateReferralBanner;
