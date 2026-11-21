import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Copy, Check, Share2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import {
  buildAffiliateLink,
  buildAffiliateWhatsAppShareUrl,
  formatPartnerIdLabel,
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
      <div className="mt-7 w-full max-w-lg mx-auto p-5 rounded-2xl border border-[#C9A227]/30 bg-[#07101A]/90 text-left space-y-3.5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/35 flex items-center justify-center text-[#F5DE98] shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-ps-ui text-[11px] uppercase tracking-[0.18em] text-[#E8D59B] font-semibold">
              Indique & Ganhe 20% no Pix
            </p>
            <p className="font-ps-ui text-sm text-[#CBD5E1] leading-relaxed">
              Indique 5 amigos para o Mapa Completo e receba{" "}
              <strong className="text-[#F5DE98] font-semibold">R$ 99,90 de volta no Pix</strong> — 20% em cada compra pelo seu link.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {isAffiliate && shareLink ? (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Link Copiado!" : "Copiar Meu Link"}</span>
              </button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#E5C158]" />
                  <span>WhatsApp</span>
                </a>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/afiliado")}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C9A227]/16 hover:bg-[#C9A227]/26 border border-[#C9A227]/45 text-[#F5DE98] font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 transition-all"
            >
              <span>Ativar Meu Cadastro Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant "result": convite harmônico no fim da página de resultado
  return (
    <section className="w-full px-5 sm:px-6 pb-12 relative z-20">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-[24px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A30]/92 via-[#07101C]/96 to-[#040912]/98 backdrop-blur-2xl shadow-[0_20px_55px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/12 border border-[#C9A227]/35 text-[#F5DE98] text-[11px] font-ps-ui font-semibold uppercase tracking-[0.18em]">
              <Sparkles className="w-3 h-3 text-[#E5C158]" />
              Programa de Parceiros • 20% no Pix
            </span>
            <h3 className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-snug">
              {cityName
                ? `Curtiu descobrir ${cityName}? Ganhe indicando para seus amigos.`
                : "Curtiu seu Mapa Solar? Ganhe indicando para seus amigos."}
            </h3>
            <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
              {isAffiliate && affiliateCode
                ? `Seu cadastro (${formatPartnerIdLabel(affiliateCode)}) já está ativo. Cada amigo que comprar pelo seu link gera 20% direto para o seu saldo.`
                : "Ative seu cadastro de parceiro em 10 segundos. O preço para seus amigos continua o mesmo e você recebe 20% no Pix por cada compra."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {isAffiliate && shareLink ? (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Link Copiado!" : "Copiar Meu Link"}</span>
                </button>
                <div className="flex gap-2">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/afiliado")}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#E8D59B] font-ps-ui text-xs font-semibold uppercase tracking-[0.12em]"
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
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <span>Ativar Meu Cadastro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/parceiros")}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-[#CBD5E1] hover:text-white font-ps-ui text-xs font-medium uppercase tracking-[0.12em] transition-all"
                >
                  Simular Ganhos
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
