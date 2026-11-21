import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Share2,
  MousePointerClick,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Wallet,
  RefreshCw,
  Sparkles,
  Users,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import PageLoader from "@/components/PageLoader";
import { BackButton } from "@/components/ui/BackButton";
import AffiliatePromoKit from "@/components/AffiliatePromoKit";
import PartnersLanding from "@/pages/PartnersLanding";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { clearAffiliateCache } from "@/hooks/useIsAffiliate";
import {
  buildAffiliateLink,
  buildAffiliateWhatsAppShareUrl,
  calculateCommissionBrl,
  formatAffiliateShortPath,
  formatBrl,
  formatPartnerIdLabel,
  generatePartnerNumber,
  getMyAffiliateDashboard,
  joinAffiliateProgram,
  normalizeAffiliateCode,
  updateMyAffiliatePix,
  type AffiliateDashboardResponse,
} from "@/lib/affiliates";

const AffiliateDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbReady, setDbReady] = useState(true);
  const [dashboard, setDashboard] = useState<AffiliateDashboardResponse | null>(null);
  const [pixKey, setPixKey] = useState("");
  const [savingPix, setSavingPix] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-cadastro em 1 passo (Número de Cadastro oficial automático)
  const [joinName, setJoinName] = useState("");
  const [autoPartnerNumber, setAutoPartnerNumber] = useState<string>(() => generatePartnerNumber());
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [joinPix, setJoinPix] = useState("");
  const [joinChannel, setJoinChannel] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;
    const rawProfileName = profile?.full_name || profile?.display_name || "";
    const emailLocal = (user.email || "").split("@")[0]?.toLowerCase() || "";
    const cleanProfileName =
      rawProfileName &&
      !rawProfileName.includes("@") &&
      rawProfileName.trim().toLowerCase() !== emailLocal
        ? rawProfileName.trim()
        : "";
    if (cleanProfileName) {
      setJoinName((prev) => prev || cleanProfileName);
    }
  }, [user, profile?.full_name, profile?.display_name]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getMyAffiliateDashboard();
      setDbReady(res.dbReady);
      setDashboard(res.data);
      if (res.data?.affiliate?.pix_key !== undefined) {
        setPixKey(res.data.affiliate.pix_key || "");
      }
      if (res.error) {
        toast.error(res.error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadDashboard(false);
    }
  }, [user?.id, loadDashboard]);

  const handleCopyLink = () => {
    if (!dashboard?.affiliate?.code) return;
    const link = buildAffiliateLink(dashboard.affiliate.code);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Link de parceiro copiado!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSavePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPix(true);
    try {
      await updateMyAffiliatePix(pixKey);
      toast.success("Chave Pix salva com sucesso!");
      await loadDashboard(true);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar chave Pix.");
    } finally {
      setSavingPix(false);
    }
  };

  const activeCodeForSignup = useCustomSlug
    ? normalizeAffiliateCode(customSlug)
    : autoPartnerNumber;

  const handleJoinAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinName.trim().length < 2) {
      toast.error("Informe seu nome para ativar seu cadastro.");
      return;
    }
    const candidateCode = useCustomSlug
      ? normalizeAffiliateCode(customSlug)
      : autoPartnerNumber;
    if (candidateCode.length < 3) {
      toast.error("Escolha um apelido com pelo menos 3 caracteres (ex: camila).");
      return;
    }
    setJoining(true);
    try {
      let registeredCode = candidateCode;
      try {
        await joinAffiliateProgram({
          name: joinName.trim(),
          code: candidateCode,
          pix_key: joinPix.trim() || undefined,
          channel: joinChannel.trim() || undefined,
        });
      } catch (firstErr: any) {
        if (!useCustomSlug && String(firstErr?.message || "").toLowerCase().includes("em uso")) {
          const retryNum = generatePartnerNumber();
          setAutoPartnerNumber(retryNum);
          registeredCode = retryNum;
          await joinAffiliateProgram({
            name: joinName.trim(),
            code: retryNum,
            pix_key: joinPix.trim() || undefined,
            channel: joinChannel.trim() || undefined,
          });
        } else {
          throw firstErr;
        }
      }
      clearAffiliateCache(user?.id);
      toast.success(
        `Cadastro ${formatPartnerIdLabel(registeredCode)} ativado! Seu link já está pronto.`
      );
      await loadDashboard(false);
    } catch (err: any) {
      toast.error(err?.message || "Não foi possível ativar seu cadastro.");
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || loading) {
    return <PageLoader label="Carregando painel de parceiro..." />;
  }

  // Visitante deslogado vê a Landing Page oficial completa
  if (!user) {
    return <PartnersLanding />;
  }

  const affiliate = dashboard?.affiliate;
  const stats = dashboard?.stats;
  const commissions = dashboard?.commissions ?? [];

  // Usuário autenticado ainda sem cadastro de parceiro: ativação limpa em 1 passo
  if (!dbReady || !dashboard?.is_affiliate || !affiliate || !stats) {
    return (
      <div className="min-h-[100svh] px-4 sm:px-6 pt-20 lg:pt-10 pb-24 lg:pb-16 max-w-2xl mx-auto relative z-10 overflow-x-hidden">
        <div className="mb-6 hidden lg:flex">
          <BackButton label="Voltar" to="/" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-[28px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A30]/92 via-[#07101C]/96 to-[#040912]/98 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] space-y-7"
        >
          {/* Cabeçalho */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#C9A227]/40 bg-[#07101C] flex items-center justify-center text-[#F5DE98] shadow-[0_0_30px_rgba(201,162,39,0.16)]">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <span className="inline-block font-ps-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A227] font-semibold">
              Programa de Parceiros • 20% no Pix
            </span>
            <h1 className="font-ps-display font-normal text-3xl sm:text-4xl text-white leading-tight">
              Ative seu cadastro de parceiro
            </h1>
            <p className="font-ps-ui text-[#AAB6C4] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              {!dbReady
                ? "O módulo de parceiros está sendo ativado no servidor. Tente novamente em instantes."
                : "O cliente paga exatamente o mesmo preço e você recebe 20% direto no Pix por cada compra confirmada."}
            </p>
          </div>

          {/* Referência limpa de ganhos */}
          <div className="grid grid-cols-3 gap-2.5 text-center py-4 px-3 rounded-2xl bg-[#040912]/70 border border-white/[0.08]">
            <div>
              <p className="font-ps-ui text-[11px] text-[#94A3B8]">1 Casa</p>
              <p className="font-ps-display font-normal text-lg sm:text-xl text-[#F5DE98] mt-0.5 tabular-nums">
                +{formatBrl(calculateCommissionBrl(19.9, 20))}
              </p>
            </div>
            <div className="border-x border-white/[0.08]">
              <p className="font-ps-ui text-[11px] text-[#94A3B8]">Expansão</p>
              <p className="font-ps-display font-normal text-lg sm:text-xl text-[#F5DE98] mt-0.5 tabular-nums">
                +{formatBrl(calculateCommissionBrl(49.9, 20))}
              </p>
            </div>
            <div>
              <p className="font-ps-ui text-[11px] text-[#94A3B8]">Mapa Completo</p>
              <p className="font-ps-display font-normal text-lg sm:text-xl text-[#F5DE98] mt-0.5 tabular-nums">
                +{formatBrl(calculateCommissionBrl(99.9, 20))}
              </p>
            </div>
          </div>

          {dbReady && (
            <form onSubmit={handleJoinAffiliate} className="space-y-5">
              {/* Credencial automática */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#040912]/80 border border-[#C9A227]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#E8D59B] font-semibold block">
                      {useCustomSlug ? "Link Personalizado" : `Nº de Cadastro #${autoPartnerNumber}`}
                    </span>
                    <p className="font-mono text-sm text-white mt-1 break-all">
                      {activeCodeForSignup
                        ? formatAffiliateShortPath(activeCodeForSignup)
                        : "protocolosolar.com.br/i/seunome"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!useCustomSlug && (
                      <button
                        type="button"
                        onClick={() => setAutoPartnerNumber(generatePartnerNumber())}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs text-[#CBD5E1] font-ps-ui inline-flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Outro nº</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setUseCustomSlug((v) => !v)}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#C9A227]/12 hover:bg-[#C9A227]/22 border border-[#C9A227]/35 text-xs text-[#F5DE98] font-ps-ui font-medium transition-colors"
                    >
                      {useCustomSlug ? "Usar nº automático" : "Personalizar"}
                    </button>
                  </div>
                </div>

                {useCustomSlug && (
                  <div className="flex items-center rounded-xl bg-[#07101A] border border-white/15 focus-within:border-[#C9A227] overflow-hidden">
                    <span className="px-3 py-3 text-xs font-mono text-[#94A3B8] bg-white/[0.03] border-r border-white/10 shrink-0">
                      protocolosolar.com.br/i/
                    </span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) =>
                        setCustomSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, "")
                            .slice(0, 32)
                        )
                      }
                      placeholder="seunome"
                      className="w-full min-h-[46px] px-3 py-2.5 bg-transparent text-base font-mono text-[#FFF3D1] placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                )}

                <p className="font-ps-ui text-xs text-[#94A3B8]">
                  {useCustomSlug
                    ? "Use apenas letras, números ou hífen (mínimo 3 caracteres)."
                    : "Número gerado automaticamente — curto, neutro e sem expor seu e-mail."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-name"
                    className="block font-ps-ui text-xs uppercase tracking-[0.16em] text-[#E8D59B] font-semibold"
                  >
                    Seu Nome *
                  </label>
                  <input
                    id="partner-name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    required
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Ex: Camila Rocha"
                    className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#040912]/90 border border-white/15 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-pix"
                    className="block font-ps-ui text-xs uppercase tracking-[0.16em] text-[#CBD5E1] font-semibold"
                  >
                    Sua Chave Pix (para receber os 20%)
                  </label>
                  <input
                    id="partner-pix"
                    name="pix_key"
                    type="text"
                    value={joinPix}
                    onChange={(e) => setJoinPix(e.target.value)}
                    placeholder="CPF, E-mail, Celular ou Chave Aleatória"
                    className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#040912]/90 border border-white/15 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="partner-channel"
                    className="block font-ps-ui text-xs uppercase tracking-[0.16em] text-[#94A3B8] font-semibold"
                  >
                    Onde você vai divulgar? (Opcional)
                  </label>
                  <input
                    id="partner-channel"
                    name="channel"
                    type="text"
                    value={joinChannel}
                    onChange={(e) => setJoinChannel(e.target.value)}
                    placeholder="Ex: WhatsApp, @instagram ou TikTok"
                    className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#040912]/90 border border-white/15 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full sm:flex-1 min-h-[54px] px-6 py-3.5 rounded-xl font-ps-ui text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#02050A] bg-[#C9A227] hover:bg-[#D9B643] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_28px_rgba(201,162,39,0.25)]"
                >
                  <span>{joining ? "Ativando cadastro..." : "Ativar Meu Cadastro (20%)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin?tab=affiliates")}
                    className="w-full sm:w-auto min-h-[54px] px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] transition-all"
                  >
                    Admin
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  const shareLink = buildAffiliateLink(affiliate.code);
  const whatsappUrl = buildAffiliateWhatsAppShareUrl(affiliate.code);
  const rate = Number(affiliate.commission_rate || 20);
  const conversionRate =
    stats.clicks_count > 0
      ? ((stats.total_sales_count / stats.clicks_count) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-[100svh] px-4 sm:px-6 pt-20 lg:pt-10 pb-24 lg:pb-16 max-w-6xl mx-auto relative z-10 overflow-x-hidden">
      <div className="hidden lg:flex items-center justify-between mb-6">
        <BackButton label="Voltar" to="/" />
        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 text-xs text-[#CBD5E1] font-ps-ui transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Atualizar dados</span>
        </button>
      </div>

      {/* Cabeçalho do Painel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/12 border border-[#C9A227]/35 text-[#F5DE98] text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em]">
              <Sparkles className="w-3 h-3 text-[#E5C158]" />
              Parceiro {formatPartnerIdLabel(affiliate.code)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-ps-ui font-medium border ${
                affiliate.active
                  ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-400/30 text-amber-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  affiliate.active ? "bg-emerald-400" : "bg-amber-300"
                }`}
              />
              {affiliate.active ? "Ativo" : "Pausado"}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/12 text-[#E8D59B] text-[11px] font-ps-ui font-medium tabular-nums">
              {rate}% por venda
            </span>
          </div>
          <h1 className="font-ps-display font-normal text-3xl sm:text-4xl text-white leading-tight">
            Olá, {affiliate.name}
          </h1>
          <p className="font-ps-ui text-[#AAB6C4] text-sm mt-1.5">
            Acompanhe seus cliques, vendas confirmadas e comissões em tempo real.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="lg:hidden self-start inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 text-xs text-[#CBD5E1] font-ps-ui"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Atualizar</span>
        </button>
      </motion.div>

      {/* Cartão Principal: Seu Link Exclusivo */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="p-5 sm:p-7 rounded-[24px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A30]/92 via-[#07101C]/96 to-[#040912]/98 backdrop-blur-2xl shadow-[0_20px_55px_rgba(0,0,0,0.55)] mb-7 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="block font-ps-ui text-[11px] uppercase tracking-[0.18em] text-[#E8D59B] font-semibold">
              Seu Link Curto de Indicação • Janela de 30 dias
            </span>
            <div className="px-4 py-3.5 rounded-xl bg-[#040912]/85 border border-white/12 font-mono text-sm text-white break-all select-all">
              {shareLink}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(201,162,39,0.22)]"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#F2F4F7] font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Share2 className="w-4 h-4 text-[#E5C158]" />
              <span>WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Comissão por pacote (linha editorial limpa) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
          <div className="px-4 py-3 rounded-xl bg-[#040912]/60 border border-white/[0.07] flex items-center justify-between gap-2">
            <div>
              <p className="font-ps-ui text-xs font-semibold text-white">1 Casa Avulsa</p>
              <p className="font-ps-ui text-[11px] text-[#94A3B8]">Cliente paga R$ 19,90</p>
            </div>
            <span className="font-ps-ui text-sm font-bold text-[#F5DE98] tabular-nums">
              +{formatBrl(calculateCommissionBrl(19.9, rate))}
            </span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#040912]/60 border border-white/[0.07] flex items-center justify-between gap-2">
            <div>
              <p className="font-ps-ui text-xs font-semibold text-white">Pacote Expansão</p>
              <p className="font-ps-ui text-[11px] text-[#94A3B8]">Cliente paga R$ 49,90</p>
            </div>
            <span className="font-ps-ui text-sm font-bold text-[#F5DE98] tabular-nums">
              +{formatBrl(calculateCommissionBrl(49.9, rate))}
            </span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#C9A227]/[0.07] border border-[#C9A227]/25 flex items-center justify-between gap-2">
            <div>
              <p className="font-ps-ui text-xs font-semibold text-[#FFF3D1]">Mapa Completo</p>
              <p className="font-ps-ui text-[11px] text-[#E8D59B]/75">Cliente paga R$ 99,90</p>
            </div>
            <span className="font-ps-ui text-sm font-bold text-[#F5DE98] tabular-nums">
              +{formatBrl(calculateCommissionBrl(99.9, rate))}
            </span>
          </div>
        </div>
      </motion.section>

      {/* 4 KPIs (Ordem de prioridade: A Receber primeiro, seguido de Pago, Vendas e Cliques) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-7">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#C9A227]/14 to-[#07101A]/95 border border-[#C9A227]/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.14em] text-[#F5DE98] font-semibold">
              A Receber
            </span>
            <Clock className="w-4 h-4 text-[#E5C158]" />
          </div>
          <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-none tabular-nums">
            {formatBrl(stats.pending_brl)}
          </p>
          <p className="font-ps-ui text-xs text-[#E8D59B]/80 mt-2.5 tabular-nums">
            {stats.pending_sales_count} venda{stats.pending_sales_count === 1 ? "" : "s"} pendente{stats.pending_sales_count === 1 ? "" : "s"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.14em] text-[#AAB6C4] font-semibold">
              Já Recebido
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-none tabular-nums">
            {formatBrl(stats.paid_brl)}
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-2.5 tabular-nums">
            Total acumulado: {formatBrl(stats.total_brl)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.14em] text-[#AAB6C4] font-semibold">
              Vendas Pagas
            </span>
            <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-none tabular-nums">
            {stats.total_sales_count}
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-2.5 tabular-nums">
            {formatBrl(stats.total_volume_brl)} · {conversionRate}% conv.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.14em] text-[#AAB6C4] font-semibold">
              Cliques no Link
            </span>
            <MousePointerClick className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-none tabular-nums">
            {stats.clicks_count}
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-2.5 flex items-center gap-1.5 tabular-nums">
            <Users className="w-3.5 h-3.5 text-[#E8D59B]/75" />
            <span>
              {stats.referred_users_count} cadastro{stats.referred_users_count === 1 ? "" : "s"}
            </span>
          </p>
        </div>
      </div>

      {/* Kit Pronto de Divulgação */}
      <AffiliatePromoKit code={affiliate.code} affiliateName={affiliate.name} />

      {/* Chave Pix para Repasse */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#07101A]/90 border border-white/10 backdrop-blur-xl mb-7">
        <form onSubmit={handleSavePix} className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="dashboard-pix"
              className="font-ps-ui text-xs uppercase tracking-[0.16em] text-[#E8D59B] font-semibold flex items-center gap-2"
            >
              <Wallet className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Sua Chave Pix para Recebimento</span>
            </label>
            <input
              id="dashboard-pix"
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#040912]/90 border border-white/15 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={savingPix}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227]/16 hover:bg-[#C9A227]/26 border border-[#C9A227]/45 text-[#F5DE98] font-ps-ui text-xs font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-50 shrink-0"
          >
            {savingPix ? "Salvando..." : "Salvar Chave Pix"}
          </button>
        </form>
      </section>

      {/* Histórico de Vendas & Comissões */}
      <section className="p-5 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="font-ps-display font-normal text-2xl text-white">
              Histórico de Vendas & Comissões
            </h2>
            <p className="font-ps-ui text-xs text-[#94A3B8] mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span>Registrado automaticamente a cada pagamento confirmado via Pix ou Cartão.</span>
            </p>
          </div>
          <span className="font-ps-ui text-xs text-[#94A3B8] tabular-nums">
            {commissions.length} registro{commissions.length === 1 ? "" : "s"}
          </span>
        </div>

        {commissions.length === 0 ? (
          <div className="py-12 text-center space-y-2.5">
            <ShoppingBag className="w-9 h-9 text-[#C9A227]/40 mx-auto" />
            <p className="font-ps-display font-normal text-xl text-white">
              Nenhuma venda confirmada ainda
            </p>
            <p className="font-ps-ui text-[#94A3B8] text-sm max-w-md mx-auto leading-relaxed">
              Compartilhe seu link acima usando o Kit Pronto. Assim que alguém finalizar uma compra, sua comissão aparecerá aqui automaticamente.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile (< 768px): Lista em Cards Nativos (zero scroll lateral forçado) */}
            <div className="md:hidden space-y-3">
              {commissions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#040912]/75 border border-white/[0.08] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-ps-ui text-sm font-semibold text-white">
                        {item.package_label}
                      </p>
                      <p className="font-ps-ui text-xs text-[#94A3B8] mt-0.5">
                        {item.buyer_label} ·{" "}
                        {new Date(item.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </p>
                    </div>
                    {item.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-400/30 text-emerald-300 text-[11px] font-ps-ui font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Pago
                      </span>
                    ) : item.status === "cancelled" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500/12 border border-red-400/30 text-red-300 text-[11px] font-ps-ui font-semibold">
                        Cancelado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#F5DE98] text-[11px] font-ps-ui font-semibold">
                        <Clock className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.06] text-xs font-ps-ui">
                    <span className="text-[#94A3B8] tabular-nums">
                      Venda: {formatBrl(item.sale_amount_brl)}
                    </span>
                    <span className="text-sm font-bold text-[#F5DE98] tabular-nums">
                      +{formatBrl(item.commission_amount_brl)}{" "}
                      <span className="font-normal text-[#94A3B8]">({item.commission_rate}%)</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop (>= 768px): Tabela limpa com números alinhados à direita */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-ps-ui uppercase tracking-[0.14em] text-[#94A3B8]">
                    <th className="py-3 pr-4 font-semibold">Data</th>
                    <th className="py-3 pr-4 font-semibold">Cliente</th>
                    <th className="py-3 pr-4 font-semibold">Pacote</th>
                    <th className="py-3 pr-4 text-right font-semibold">Venda</th>
                    <th className="py-3 pr-4 text-right font-semibold">Sua Comissão</th>
                    <th className="py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm font-ps-ui">
                  {commissions.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 text-xs text-[#AAB6C4] whitespace-nowrap tabular-nums">
                        {new Date(item.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 pr-4 text-[#E2E8F0]">{item.buyer_label}</td>
                      <td className="py-3.5 pr-4 text-[#CBD5E1]">{item.package_label}</td>
                      <td className="py-3.5 pr-4 text-right text-[#CBD5E1] whitespace-nowrap tabular-nums">
                        {formatBrl(item.sale_amount_brl)}
                      </td>
                      <td className="py-3.5 pr-4 text-right font-semibold text-[#F5DE98] whitespace-nowrap tabular-nums">
                        {formatBrl(item.commission_amount_brl)}
                        <span className="ml-1 text-xs font-normal text-[#94A3B8]">
                          ({item.commission_rate}%)
                        </span>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        {item.status === "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                          </span>
                        ) : item.status === "cancelled" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500/12 border border-red-400/30 text-red-300 text-xs font-medium">
                            Cancelado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#F5DE98] text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" /> Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AffiliateDashboard;
