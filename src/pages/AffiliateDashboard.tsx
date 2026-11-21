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
  Rocket,
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
  formatBrl,
  getMyAffiliateDashboard,
  joinAffiliateProgram,
  normalizeAffiliateCode,
  suggestAffiliateCodeFromName,
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

  // Estado do auto-cadastro em 1 passo
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
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
    const defaultName = profile?.full_name || profile?.display_name || user.email?.split("@")[0] || "";
    setJoinName((prev) => prev || defaultName);
    setJoinCode((prev) => prev || suggestAffiliateCodeFromName(defaultName || user.email));
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
    toast.success("Link de afiliado copiado!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSavePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPix(true);
    try {
      await updateMyAffiliatePix(pixKey);
      toast.success("Chave Pix atualizada com sucesso!");
      await loadDashboard(true);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar chave Pix.");
    } finally {
      setSavingPix(false);
    }
  };

  const handleJoinAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinName.trim().length < 2) {
      toast.error("Informe seu nome para ativar seu link.");
      return;
    }
    const cleanCode = normalizeAffiliateCode(joinCode);
    if (cleanCode.length < 3) {
      toast.error("Escolha um código com pelo menos 3 caracteres (ex: RAFAEL).");
      return;
    }
    setJoining(true);
    try {
      await joinAffiliateProgram({
        name: joinName.trim(),
        code: cleanCode,
        pix_key: joinPix.trim() || undefined,
        channel: joinChannel.trim() || undefined,
      });
      clearAffiliateCache(user?.id);
      toast.success(`Link ?ref=${cleanCode} ativado! Você já ganha 20% em cada venda.`);
      await loadDashboard(false);
    } catch (err: any) {
      toast.error(err?.message || "Não foi possível ativar seu cadastro.");
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || loading) {
    return <PageLoader label="Carregando painel de afiliado..." />;
  }

  // Visitante deslogado: exibe a Landing Page completa de parceiros (com simulador e FAQ)
  if (!user) {
    return <PartnersLanding />;
  }

  const affiliate = dashboard?.affiliate;
  const stats = dashboard?.stats;
  const commissions = dashboard?.commissions ?? [];

  // Usuário autenticado mas ainda não é afiliado: auto-cadastro instantâneo em 1 passo
  if (!dbReady || !dashboard?.is_affiliate || !affiliate || !stats) {
    return (
      <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 lg:pt-12 pb-28 lg:pb-16 max-w-3xl mx-auto relative z-10 overflow-x-hidden">
        <div className="mb-6 hidden lg:flex">
          <BackButton label="Voltar" to="/" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-[32px] border border-[#C9A227]/35 bg-gradient-to-b from-[#0E1A32]/90 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#F5DE98] mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.22em] text-[#F5DE98]/85 font-semibold">
              Programa de Parceiros • 20% por Venda
            </span>
            <h1 className="font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ative seu Link de Afiliado
            </h1>
            <p className="text-white/65 font-ps-ui text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {!dbReady
                ? "O módulo de afiliados está sendo ativado no servidor. Tente novamente em instantes."
                : "Escolha seu código exclusivo abaixo e comece a divulgar agora mesmo. O cliente paga o mesmo valor e você acompanha todas as vendas nesta tela."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/45 mb-1">
                1 Casa Avulsa (R$ 19,90)
              </p>
              <p className="font-ps-display text-xl font-bold text-[#F5DE98]">
                +{formatBrl(calculateCommissionBrl(19.9, 20))}
              </p>
              <p className="text-[11px] text-white/50">20% por venda</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/45 mb-1">
                Pacote Expansão (R$ 49,90)
              </p>
              <p className="font-ps-display text-xl font-bold text-[#F5DE98]">
                +{formatBrl(calculateCommissionBrl(49.9, 20))}
              </p>
              <p className="text-[11px] text-white/50">20% por venda</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/45 mb-1">
                Mapa Completo (R$ 99,90)
              </p>
              <p className="font-ps-display text-xl font-bold text-[#F5DE98]">
                +{formatBrl(calculateCommissionBrl(99.9, 20))}
              </p>
              <p className="text-[11px] text-white/50">20% por venda</p>
            </div>
          </div>

          {dbReady && (
            <form onSubmit={handleJoinAffiliate} className="space-y-4 pt-2 border-t border-white/10 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#F5DE98] font-semibold">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Ex: Camila Rocha"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#F5DE98] font-semibold">
                    Escolha seu Código do Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(normalizeAffiliateCode(e.target.value))}
                    placeholder="Ex: CAMILA"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm font-mono font-bold uppercase tracking-wider text-[#FFF3D1] placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 font-semibold">
                    Sua Chave Pix (para receber)
                  </label>
                  <input
                    type="text"
                    value={joinPix}
                    onChange={(e) => setJoinPix(e.target.value)}
                    placeholder="CPF, E-mail, Celular ou Aleatória"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60 font-semibold">
                    Onde vai divulgar? (Opcional)
                  </label>
                  <input
                    type="text"
                    value={joinChannel}
                    onChange={(e) => setJoinChannel(e.target.value)}
                    placeholder="Ex: @instagram, TikTok ou WhatsApp"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {joinCode && (
                <div className="px-4 py-3 rounded-xl bg-black/45 border border-[#C9A227]/25 text-xs font-mono text-[#F5DE98]/90 break-all">
                  Seu link será: <span className="text-white">{buildAffiliateLink(joinCode)}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full sm:flex-1 min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-black font-ps-ui text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(201,162,39,0.25)]"
                >
                  <Rocket className="w-4 h-4" />
                  {joining ? "Ativando seu link..." : "Ativar Meu Link de Afiliado (20%)"}
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin?tab=affiliates")}
                    className="w-full sm:w-auto min-h-[52px] px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/85 font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] transition-all"
                  >
                    Abrir Admin
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
    <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 lg:pt-10 pb-28 lg:pb-16 max-w-6xl mx-auto relative z-10 overflow-x-hidden">
      <div className="hidden lg:flex items-center justify-between mb-6">
        <BackButton label="Voltar" to="/" />
        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 font-ps-ui transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar dados
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-mono font-bold uppercase tracking-[0.18em]">
              <Sparkles className="w-3 h-3" /> Parceiro Oficial
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.14em] border ${
                affiliate.active
                  ? "bg-emerald-500/15 border-emerald-400/35 text-emerald-300"
                  : "bg-amber-500/15 border-amber-400/35 text-amber-300"
              }`}
            >
              {affiliate.active ? "Ativo" : "Pausado"}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-[#F5DE98] text-[10px] font-mono font-bold uppercase tracking-[0.14em]">
              {rate}% de comissão
            </span>
          </div>
          <h1 className="font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Olá, {affiliate.name}
          </h1>
          <p className="text-white/55 font-ps-ui text-sm mt-1">
            Acompanhe seus cliques, vendas confirmadas e comissões em tempo real. O preço para o cliente permanece o mesmo.
          </p>
        </div>

        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="lg:hidden self-start inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 font-ps-ui"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </motion.div>

      {/* Link de Indicação */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 sm:p-7 rounded-[28px] border border-[#C9A227]/35 bg-gradient-to-b from-[#0E1A32]/90 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] mb-8 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5DE98]/80 font-semibold mb-1.5">
              Seu Link Exclusivo de Indicação (Janela de 30 dias)
            </span>
            <div className="px-4 py-3.5 rounded-2xl bg-black/55 border border-white/15 font-mono text-xs sm:text-sm text-[#FFF3D1] break-all select-all">
              {shareLink}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-black font-ps-ui text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "Link Copiado!" : "Copiar Link"}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 font-ps-ui text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Quanto você ganha por pacote */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
          <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-ps-ui text-white/85 font-semibold">1 Casa Avulsa</p>
              <p className="text-[10px] font-mono text-white/45">Cliente paga R$ 19,90</p>
            </div>
            <span className="font-mono text-sm font-bold text-[#F5DE98]">
              +{formatBrl(calculateCommissionBrl(19.9, rate))}
            </span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-ps-ui text-white/85 font-semibold">Pacote Expansão</p>
              <p className="text-[10px] font-mono text-white/45">Cliente paga R$ 49,90</p>
            </div>
            <span className="font-mono text-sm font-bold text-[#F5DE98]">
              +{formatBrl(calculateCommissionBrl(49.9, rate))}
            </span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-ps-ui text-white/85 font-semibold">Mapa Completo</p>
              <p className="text-[10px] font-mono text-white/45">Cliente paga R$ 99,90</p>
            </div>
            <span className="font-mono text-sm font-bold text-[#F5DE98]">
              +{formatBrl(calculateCommissionBrl(99.9, rate))}
            </span>
          </div>
        </div>
      </motion.section>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
        <div className="p-5 rounded-3xl bg-[#08111F]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50">
              Cliques / Cadastros
            </span>
            <MousePointerClick className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-ps-display text-3xl sm:text-4xl font-bold text-white leading-none">
            {stats.clicks_count}
          </p>
          <p className="text-xs text-white/50 mt-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#F5DE98]/70" />
            {stats.referred_users_count} conta{stats.referred_users_count === 1 ? "" : "s"} indicada{stats.referred_users_count === 1 ? "" : "s"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#08111F]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50">
              Vendas Pagas
            </span>
            <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-ps-display text-3xl sm:text-4xl font-bold text-white leading-none">
            {stats.total_sales_count}
          </p>
          <p className="text-xs text-white/50 mt-2">
            Volume: {formatBrl(stats.total_volume_brl)} · {conversionRate}% conv.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#C9A227]/15 to-[#08111F]/90 border border-[#C9A227]/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#F5DE98]">
              A Receber (Pendente)
            </span>
            <Clock className="w-4 h-4 text-[#F5DE98]" />
          </div>
          <p className="font-ps-display text-2xl sm:text-3xl font-bold text-[#FFF3D1] leading-none">
            {formatBrl(stats.pending_brl)}
          </p>
          <p className="text-xs text-[#F5DE98]/75 mt-2">
            {stats.pending_sales_count} venda{stats.pending_sales_count === 1 ? "" : "s"} aguardando repasse
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-950/30 border border-emerald-400/25 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-300/85">
              Total Já Recebido
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="font-ps-display text-2xl sm:text-3xl font-bold text-emerald-200 leading-none">
            {formatBrl(stats.paid_brl)}
          </p>
          <p className="text-xs text-emerald-200/65 mt-2">
            Acumulado total: {formatBrl(stats.total_brl)}
          </p>
        </div>
      </div>

      {/* Kit Pronto de Divulgação (WhatsApp, 3 Stories, Roteiro Reels, Arte 9:16) */}
      <AffiliatePromoKit code={affiliate.code} affiliateName={affiliate.name} />

      {/* Chave Pix para Repasse */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#08111F]/90 border border-white/10 backdrop-blur-xl mb-8">
        <form onSubmit={handleSavePix} className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#F5DE98] font-semibold flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Sua Chave Pix para Recebimento das Comissões
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
            />
          </div>
          <button
            type="submit"
            disabled={savingPix}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/45 text-[#FFF3D1] font-ps-ui text-xs font-bold uppercase tracking-[0.16em] transition-all disabled:opacity-50"
          >
            {savingPix ? "Salvando..." : "Salvar Chave Pix"}
          </button>
        </form>
      </section>

      {/* Histórico de Comissões */}
      <section className="p-5 sm:p-7 rounded-3xl bg-[#08111F]/90 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
              Histórico de Vendas & Comissões
            </h2>
            <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              Comissão registrada automaticamente a cada compra confirmada via Pix ou Cartão.
            </p>
          </div>
          <span className="text-xs font-mono text-white/50">
            {commissions.length} registro{commissions.length === 1 ? "" : "s"}
          </span>
        </div>

        {commissions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-9 h-9 text-white/20 mx-auto" />
            <p className="text-white/75 font-ps-display text-lg">
              Nenhuma venda confirmada ainda
            </p>
            <p className="text-white/45 text-xs max-w-md mx-auto">
              Compartilhe seu link exclusivo acima. Toda compra concluída por quem acessar pelo seu link aparecerá aqui instantaneamente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.16em] text-white/45">
                  <th className="py-3 pr-4">Data</th>
                  <th className="py-3 pr-4">Cliente</th>
                  <th className="py-3 pr-4">Pacote</th>
                  <th className="py-3 pr-4 text-right">Venda</th>
                  <th className="py-3 pr-4 text-right">Sua Comissão</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {commissions.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 font-mono text-xs text-white/65 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 pr-4 text-white/85 font-ps-ui text-xs">
                      {item.buyer_label}
                    </td>
                    <td className="py-3.5 pr-4 text-white/80 font-ps-ui text-xs">
                      {item.package_label}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono text-xs text-white/70 whitespace-nowrap">
                      {formatBrl(item.sale_amount_brl)}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono text-sm font-bold text-[#F5DE98] whitespace-nowrap">
                      {formatBrl(item.commission_amount_brl)}
                      <span className="ml-1 text-[10px] font-normal text-white/45">
                        ({item.commission_rate}%)
                      </span>
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      {item.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Pago
                        </span>
                      ) : item.status === "cancelled" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                          Cancelado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-mono font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Pendente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AffiliateDashboard;
