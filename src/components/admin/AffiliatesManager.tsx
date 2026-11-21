import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Copy,
  Check,
  Power,
  Wallet,
  CheckCircle2,
  Clock,
  RefreshCw,
  Percent,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  adminCreateAffiliate,
  adminGetAffiliatesOverview,
  adminMarkAffiliatePayout,
  adminMarkCommissionPaid,
  adminUpdateAffiliate,
  buildAffiliateLink,
  calculateCommissionBrl,
  DEFAULT_COMMISSION_RATE,
  formatBrl,
  formatPartnerIdLabel,
  generatePartnerNumber,
  normalizeAffiliateCode,
  type AdminAffiliateCommissionRow,
  type AdminAffiliateRow,
} from "@/lib/affiliates";

const AffiliatesManager = () => {
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(true);
  const [affiliates, setAffiliates] = useState<AdminAffiliateRow[]>([]);
  const [commissions, setCommissions] = useState<AdminAffiliateCommissionRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");

  // Formulário de cadastro (gera nº oficial de 6 dígitos por padrão, editável para VIPs)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string>(() => generatePartnerNumber());
  const [commissionRate, setCommissionRate] = useState<number>(DEFAULT_COMMISSION_RATE);
  const [pixKey, setPixKey] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editingRateVal, setEditingRateVal] = useState<string>("20");

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetAffiliatesOverview();
      setDbReady(res.dbReady);
      setAffiliates(res.affiliates);
      setCommissions(res.commissions);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar afiliados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Informe o nome do parceiro.");
      return;
    }
    const cleanCode = normalizeAffiliateCode(code) || generatePartnerNumber();
    if (cleanCode.length < 3) {
      toast.error("Informe um nº de cadastro ou código com pelo menos 3 caracteres.");
      return;
    }
    setCreating(true);
    try {
      await adminCreateAffiliate({
        name: name.trim(),
        code: cleanCode,
        email: email.trim() || undefined,
        commission_rate: Number(commissionRate) || DEFAULT_COMMISSION_RATE,
        pix_key: pixKey.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      toast.success(
        `Parceiro ${formatPartnerIdLabel(cleanCode)} cadastrado com ${commissionRate}% de comissão!`
      );
      setName("");
      setEmail("");
      setCode(generatePartnerNumber());
      setCommissionRate(DEFAULT_COMMISSION_RATE);
      setPixKey("");
      setNotes("");
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Não foi possível cadastrar o parceiro.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (key: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleToggleActive = async (aff: AdminAffiliateRow) => {
    setBusyId(aff.id);
    try {
      await adminUpdateAffiliate({ affiliate_id: aff.id, active: !aff.active });
      toast.success(
        aff.active
          ? `Parceiro ${formatPartnerIdLabel(aff.code)} pausado.`
          : `Parceiro ${formatPartnerIdLabel(aff.code)} ativado.`
      );
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveRate = async (affId: string) => {
    const parsed = Number(editingRateVal);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 80) {
      toast.error("Informe uma comissão válida entre 1% e 80%.");
      return;
    }
    setBusyId(affId);
    try {
      await adminUpdateAffiliate({ affiliate_id: affId, commission_rate: parsed });
      toast.success(`Comissão atualizada para ${parsed}%.`);
      setEditingRateId(null);
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar comissão.");
    } finally {
      setBusyId(null);
    }
  };

  const handlePayoutAll = async (aff: AdminAffiliateRow) => {
    if (aff.pending_brl <= 0) return;
    const confirmed = window.confirm(
      `Confirmar repasse Pix de ${formatBrl(aff.pending_brl)} para ${aff.name} (${formatPartnerIdLabel(aff.code)})?\n\nTodas as comissões pendentes deste parceiro serão marcadas como PAGAS.`
    );
    if (!confirmed) return;

    setBusyId(aff.id);
    try {
      const res = await adminMarkAffiliatePayout(
        aff.id,
        `Pix enviado para ${aff.pix_key || aff.name}`
      );
      toast.success(
        `Repasse registrado! ${res.paid_count} comissão(ões) totalizando ${formatBrl(res.paid_total_brl)}.`
      );
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao registrar repasse.");
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkSinglePaid = async (comm: AdminAffiliateCommissionRow) => {
    setBusyId(comm.id);
    try {
      await adminMarkCommissionPaid(comm.id, "Pago via Pix");
      toast.success(`Comissão de ${formatBrl(comm.commission_amount_brl)} marcada como paga.`);
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao marcar comissão como paga.");
    } finally {
      setBusyId(null);
    }
  };

  const totalActive = affiliates.filter((a) => a.active).length;
  const totalSales = affiliates.reduce((sum, a) => sum + Number(a.sales_count || 0), 0);
  const totalPendingBrl = affiliates.reduce((sum, a) => sum + Number(a.pending_brl || 0), 0);
  const totalPaidBrl = affiliates.reduce((sum, a) => sum + Number(a.paid_brl || 0), 0);

  const filteredCommissions = commissions.filter((c) => {
    if (statusFilter === "pending") return c.status === "pending";
    if (statusFilter === "paid") return c.status === "paid";
    return true;
  });

  const previewRate = Number(commissionRate) > 0 ? Number(commissionRate) : DEFAULT_COMMISSION_RATE;

  return (
    <div className="space-y-9">
      {!dbReady && (
        <div className="p-5 rounded-2xl border border-amber-400/35 bg-amber-500/10 text-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="font-ps-ui text-sm space-y-1">
            <p className="font-semibold">Migration SQL de Afiliados pendente no Supabase</p>
            <p className="text-amber-100/80 text-xs">
              Execute{" "}
              <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[11px]">
                supabase/migrations/20261121183000_affiliate_system.sql
              </code>{" "}
              no SQL Editor do Supabase para ativar as tabelas e comissões automáticas.
            </p>
          </div>
        </div>
      )}

      {/* Resumo Geral (Ordem: A Pagar primeiro para operação rápida) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#C9A227]/14 to-[#07101A]/95 border border-[#C9A227]/40 backdrop-blur-xl">
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#F5DE98] font-semibold block mb-2">
            Comissões a Pagar
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {formatBrl(totalPendingBrl)}
          </p>
          <p className="font-ps-ui text-xs text-[#E8D59B]/80 mt-1.5">Pendente de repasse Pix</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Total Repassado
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {formatBrl(totalPaidBrl)}
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1.5">Comissões já liquidadas</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Vendas via Parceiros
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">{totalSales}</p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1.5">
            Taxa padrão {DEFAULT_COMMISSION_RATE}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Parceiros Ativos
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">{totalActive}</p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1.5">{affiliates.length} cadastrados</p>
        </div>
      </div>

      {/* Formulário: Cadastrar Novo Parceiro */}
      <section className="p-6 sm:p-8 rounded-[24px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A30]/92 via-[#07101C]/96 to-[#040912]/98 backdrop-blur-2xl shadow-[0_20px_55px_rgba(0,0,0,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.08]">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/12 border border-[#C9A227]/35 text-[#F5DE98] text-[11px] font-ps-ui font-semibold uppercase tracking-[0.18em] mb-2">
              <Sparkles className="w-3 h-3 text-[#E5C158]" /> Programa de Parceiros • Preço Inalterado
            </span>
            <h3 className="font-ps-display font-normal text-2xl sm:text-3xl text-white">
              Cadastrar Novo Parceiro
            </h3>
            <p className="font-ps-ui text-[#AAB6C4] text-sm mt-1">
              O parceiro recebe nº de cadastro + link curto (<span className="font-mono text-xs text-[#E8D59B]">/i/482917</span>) e acompanha as vendas em{" "}
              <span className="font-mono text-xs text-[#E8D59B]">/afiliado</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "recruit-landing",
                  `${typeof window !== "undefined" ? window.location.origin : "https://protocolosolar.com.br"}/parceiros`,
                  "Link da página de parceiros (/parceiros)"
                )
              }
              className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-xs text-[#F5DE98] font-semibold font-ps-ui transition-all"
            >
              {copiedId === "recruit-landing" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copiar /parceiros</span>
            </button>
            <a
              href="/parceiros"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-xs text-[#CBD5E1] font-ps-ui transition-all"
            >
              <span>Abrir /parceiros</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#CBD5E1]">
                1. Nome do Parceiro *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Camila Rocha"
                required
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#CBD5E1]">
                2. E-mail da Conta (acesso /afiliado)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="camila@email.com"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#E8D59B]">
                3. Nº de Cadastro / Código (/i/) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(normalizeAffiliateCode(e.target.value))}
                  placeholder="Ex: 482917 ou CAMILA"
                  required
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-[#F5DE98] font-mono text-sm font-semibold tracking-wider focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  type="button"
                  onClick={() => setCode(generatePartnerNumber())}
                  className="min-w-[44px] px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-[#CBD5E1] hover:text-white flex items-center justify-center"
                  title="Gerar novo número de cadastro"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#CBD5E1]">
                4. Comissão (%) — Padrão 20%
              </label>
              <input
                type="number"
                min={1}
                max={80}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-white text-sm tabular-nums focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#CBD5E1]">
                5. Chave Pix (Opcional)
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, E-mail ou Celular"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-ps-ui text-xs uppercase tracking-[0.14em] font-semibold text-[#CBD5E1]">
                6. Observação Interna (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Instagram @camila · 80k"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#040912]/90 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <div className="font-ps-ui text-xs text-[#AAB6C4] space-y-1">
              <p className="tabular-nums">
                Com <strong className="text-[#F5DE98]">{previewRate}%</strong>: 1 Casa{" "}
                <span className="text-white">{formatBrl(calculateCommissionBrl(19.9, previewRate))}</span> · Expansão{" "}
                <span className="text-white">{formatBrl(calculateCommissionBrl(49.9, previewRate))}</span> · Mapa Completo{" "}
                <span className="text-white">{formatBrl(calculateCommissionBrl(99.9, previewRate))}</span>
              </p>
              {code && (
                <p className="font-mono text-xs text-[#E8D59B] break-all">
                  {buildAffiliateLink(code)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={creating || !dbReady}
              className="min-h-[48px] px-7 py-3 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{creating ? "Cadastrando..." : "Criar Parceiro"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Lista de Parceiros */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-ps-display font-normal text-2xl text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#C9A227]" />
            <span>Parceiros Cadastrados ({affiliates.length})</span>
          </h3>
          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-xs text-[#CBD5E1] font-ps-ui"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[#94A3B8] text-sm font-ps-ui">Carregando parceiros...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-10 rounded-2xl border border-white/10 bg-[#07101A]/75 text-center text-[#94A3B8] text-sm font-ps-ui">
            Nenhum parceiro cadastrado ainda. Crie o primeiro acima ou compartilhe <span className="font-mono text-[#E8D59B]">/parceiros</span>.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {affiliates.map((aff) => {
              const link = buildAffiliateLink(aff.code);
              const isEditingRate = editingRateId === aff.id;
              return (
                <div
                  key={aff.id}
                  className={`p-5 sm:p-6 rounded-2xl border backdrop-blur-xl transition-all ${
                    aff.active
                      ? "bg-[#07101A]/90 border-white/12"
                      : "bg-[#040912]/70 border-white/[0.06] opacity-70"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-ps-display font-normal text-xl text-white">
                          {aff.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] font-mono text-xs">
                          {formatPartnerIdLabel(aff.code)} · /i/{aff.code.toLowerCase()}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-ps-ui font-medium border ${
                            aff.active
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/30"
                              : "bg-white/5 text-[#94A3B8] border-white/15"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              aff.active ? "bg-emerald-400" : "bg-white/40"
                            }`}
                          />
                          {aff.active ? "Ativo" : "Pausado"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-ps-ui bg-white/[0.04] text-[#AAB6C4] border border-white/10">
                          {aff.user_id ? "Conta vinculada" : "Vincula ao logar"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ps-ui text-xs text-[#94A3B8]">
                        {aff.email && <span>{aff.email}</span>}
                        {aff.pix_key && (
                          <button
                            type="button"
                            onClick={() => handleCopy(`pix-${aff.id}`, aff.pix_key || "", "Chave Pix")}
                            className="inline-flex items-center gap-1.5 text-[#E8D59B] hover:text-[#F5DE98]"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            <span>Pix: {aff.pix_key}</span>
                            {copiedId === `pix-${aff.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                          </button>
                        )}
                        {aff.notes && <span className="text-[#94A3B8]">• {aff.notes}</span>}
                      </div>
                    </div>

                    {/* Ações rápidas */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {isEditingRate ? (
                        <div className="flex items-center gap-1.5 bg-[#040912] border border-[#C9A227]/45 rounded-xl px-2.5 py-1.5">
                          <input
                            type="number"
                            min={1}
                            max={80}
                            step={0.5}
                            value={editingRateVal}
                            onChange={(e) => setEditingRateVal(e.target.value)}
                            className="w-14 bg-transparent text-[#F5DE98] font-ps-ui text-xs font-semibold tabular-nums focus:outline-none"
                          />
                          <span className="text-xs text-[#94A3B8]">%</span>
                          <button
                            type="button"
                            disabled={busyId === aff.id}
                            onClick={() => handleSaveRate(aff.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#C9A227] text-[#02050A] text-[11px] font-bold"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRateId(null)}
                            className="px-1.5 py-1 text-[#94A3B8] hover:text-white text-xs"
                            aria-label="Cancelar edição de comissão"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRateId(aff.id);
                            setEditingRateVal(String(aff.commission_rate));
                          }}
                          className="min-h-[40px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-xs font-ps-ui font-semibold text-[#F5DE98] inline-flex items-center gap-1.5 tabular-nums"
                          title="Alterar taxa de comissão"
                        >
                          <Percent className="w-3.5 h-3.5" />
                          <span>{aff.commission_rate}%</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopy(`link-${aff.id}`, link, "Link do parceiro")}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-[#F5DE98] font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        {copiedId === `link-${aff.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>Copiar Link</span>
                      </button>

                      <button
                        type="button"
                        disabled={busyId === aff.id}
                        onClick={() => handleToggleActive(aff)}
                        className="min-h-[40px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-[#CBD5E1] font-ps-ui text-xs inline-flex items-center gap-1.5"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{aff.active ? "Pausar" : "Ativar"}</span>
                      </button>

                      {aff.pending_brl > 0 && (
                        <button
                          type="button"
                          disabled={busyId === aff.id}
                          onClick={() => handlePayoutAll(aff)}
                          className="min-h-[40px] px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold inline-flex items-center gap-1.5 tabular-nums"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pagar {formatBrl(aff.pending_brl)}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Métricas por parceiro */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/[0.07] font-ps-ui text-xs tabular-nums">
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Cliques</span>
                      <span className="text-white font-semibold text-sm">{aff.clicks_count}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Cadastros</span>
                      <span className="text-white font-semibold text-sm">
                        {aff.referred_users_count}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Vendas</span>
                      <span className="text-white font-semibold text-sm">
                        {aff.sales_count}{" "}
                        <span className="text-[#94A3B8] font-normal">
                          ({formatBrl(aff.volume_brl)})
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[#E8D59B] block text-[11px]">A Pagar</span>
                      <span className="text-[#F5DE98] font-semibold text-sm">
                        {formatBrl(aff.pending_brl)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Já Pago</span>
                      <span className="text-emerald-300 font-semibold text-sm">
                        {formatBrl(aff.paid_brl)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Comissões por Venda */}
      <section className="p-5 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-white/10 backdrop-blur-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-ps-display font-normal text-2xl text-white">
              Comissões por Venda
            </h3>
            <p className="font-ps-ui text-xs text-[#94A3B8] mt-0.5">
              Cada venda confirmada gera 1 registro idempotente vinculado ao pedido.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#040912]/80 border border-white/10">
            {(
              [
                { id: "all", label: "Todas" },
                { id: "pending", label: "Pendentes" },
                { id: "paid", label: "Pagas" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-ps-ui text-xs font-semibold transition-all ${
                  statusFilter === f.id
                    ? "bg-[#C9A227] text-[#02050A]"
                    : "text-[#AAB6C4] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCommissions.length === 0 ? (
          <div className="py-10 text-center text-[#94A3B8] text-sm font-ps-ui">
            Nenhuma comissão neste filtro ainda.
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredCommissions.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#040912]/75 border border-white/[0.08] space-y-2.5 font-ps-ui"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {c.affiliate_name}{" "}
                        <span className="font-mono text-xs font-normal text-[#E8D59B]">
                          {formatPartnerIdLabel(c.affiliate_code)}
                        </span>
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {c.package_label} · {c.buyer_name}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#F5DE98] tabular-nums">
                      {formatBrl(c.commission_amount_brl)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-xs text-[#94A3B8] tabular-nums">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")} · Venda{" "}
                      {formatBrl(c.sale_amount_brl)}
                    </span>
                    {c.status === "pending" ? (
                      <button
                        type="button"
                        disabled={busyId === c.id}
                        onClick={() => handleMarkSinglePaid(c)}
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#C9A227] text-[#02050A] text-xs font-bold"
                      >
                        Marcar Pago
                      </button>
                    ) : (
                      <span className="text-emerald-300 text-xs font-semibold">Pago</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-ps-ui uppercase tracking-[0.14em] text-[#94A3B8]">
                    <th className="py-3 pr-4 font-semibold">Data</th>
                    <th className="py-3 pr-4 font-semibold">Parceiro</th>
                    <th className="py-3 pr-4 font-semibold">Comprador</th>
                    <th className="py-3 pr-4 font-semibold">Pacote</th>
                    <th className="py-3 pr-4 text-right font-semibold">Venda</th>
                    <th className="py-3 pr-4 text-right font-semibold">Comissão</th>
                    <th className="py-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs font-ps-ui">
                  {filteredCommissions.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 text-[#AAB6C4] whitespace-nowrap tabular-nums">
                        {new Date(c.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-semibold text-white block">{c.affiliate_name}</span>
                        <span className="font-mono text-[11px] text-[#E8D59B]">
                          {formatPartnerIdLabel(c.affiliate_code)}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-[#E2E8F0] block">{c.buyer_name}</span>
                        {c.buyer_email && (
                          <span className="text-[11px] text-[#94A3B8]">{c.buyer_email}</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-[#CBD5E1]">{c.package_label}</td>
                      <td className="py-3.5 pr-4 text-right text-[#CBD5E1] whitespace-nowrap tabular-nums">
                        {formatBrl(c.sale_amount_brl)}
                      </td>
                      <td className="py-3.5 pr-4 text-right font-semibold text-[#F5DE98] whitespace-nowrap tabular-nums">
                        {formatBrl(c.commission_amount_brl)}
                        <span className="ml-1 font-normal text-[#94A3B8]">
                          ({c.commission_rate}%)
                        </span>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        {c.status === "pending" ? (
                          <button
                            type="button"
                            disabled={busyId === c.id}
                            onClick={() => handleMarkSinglePaid(c)}
                            className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-[#C9A227]/18 hover:bg-[#C9A227]/30 border border-[#C9A227]/45 text-[#F5DE98] text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Marcar Pago</span>
                          </button>
                        ) : c.status === "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                          </span>
                        ) : (
                          <span className="text-red-300 text-xs font-medium">Cancelado</span>
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

export default AffiliatesManager;
