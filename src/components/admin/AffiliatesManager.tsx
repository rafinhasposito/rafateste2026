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

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Informe o nome do afiliado.");
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
      toast.error(err?.message || "Não foi possível cadastrar o afiliado.");
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
      toast.success(aff.active ? `Afiliado ${aff.code} pausado.` : `Afiliado ${aff.code} ativado.`);
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
      `Confirmar repasse Pix de ${formatBrl(aff.pending_brl)} para ${aff.name} (${aff.code})?\n\nTodas as comissões pendentes deste afiliado serão marcadas como PAGAS.`
    );
    if (!confirmed) return;

    setBusyId(aff.id);
    try {
      const res = await adminMarkAffiliatePayout(aff.id, `Pix enviado para ${aff.pix_key || aff.name}`);
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
    <div className="space-y-10">
      {!dbReady && (
        <div className="p-5 rounded-2xl border border-amber-400/40 bg-amber-500/10 text-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-bold">Migration SQL de Afiliados pendente no Supabase</p>
            <p className="text-amber-100/80">
              Rode o arquivo{" "}
              <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[11px]">
                supabase/migrations/20261121183000_affiliate_system.sql
              </code>{" "}
              no SQL Editor do Supabase para ativar as tabelas, links e comissões automáticas.
            </p>
          </div>
        </div>
      )}

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-black/45 border border-white/10 backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/45 block mb-2">
            Afiliados Ativos
          </span>
          <p className="font-ps-display text-3xl font-bold text-white">{totalActive}</p>
          <p className="text-xs text-white/45 mt-1">{affiliates.length} cadastrados</p>
        </div>

        <div className="p-5 rounded-3xl bg-black/45 border border-white/10 backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/45 block mb-2">
            Vendas via Afiliados
          </span>
          <p className="font-ps-display text-3xl font-bold text-white">{totalSales}</p>
          <p className="text-xs text-white/45 mt-1">Comissão padrão {DEFAULT_COMMISSION_RATE}%</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#C9A227]/12 border border-[#C9A227]/35 backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#F5DE98] block mb-2">
            Comissões a Pagar
          </span>
          <p className="font-ps-display text-3xl font-bold text-[#FFF3D1]">
            {formatBrl(totalPendingBrl)}
          </p>
          <p className="text-xs text-[#F5DE98]/70 mt-1">Pendente de repasse Pix</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-950/30 border border-emerald-400/25 backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300/80 block mb-2">
            Total Repassado
          </span>
          <p className="font-ps-display text-3xl font-bold text-emerald-200">
            {formatBrl(totalPaidBrl)}
          </p>
          <p className="text-xs text-emerald-200/60 mt-1">Comissões já liquidadas</p>
        </div>
      </div>

      {/* Formulário: Cadastrar Novo Afiliado */}
      <section className="p-6 sm:p-8 rounded-[32px] border border-[#C9A227]/35 bg-gradient-to-b from-[#0E1A32]/90 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#F5DE98] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3 h-3" /> Programa de Afiliados • Preço Inalterado
            </span>
            <h3 className="font-ps-display text-2xl sm:text-3xl text-white font-bold tracking-tight">
              Cadastrar Novo Afiliado
            </h3>
            <p className="text-white/55 text-xs sm:text-sm font-ps-ui mt-1">
              O parceiro recebe nº de cadastro + link curto (<span className="font-mono text-[#F5DE98]">/i/482917</span>) e acompanha as vendas em{" "}
              <span className="font-mono text-[#F5DE98]">/afiliado</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "recruit-landing",
                  `${typeof window !== "undefined" ? window.location.origin : "https://protocolosolar.com.br"}/parceiros`,
                  "Link da página de recrutamento (/parceiros)"
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-xs text-[#FFF3D1] font-semibold font-ps-ui transition-all"
            >
              {copiedId === "recruit-landing" ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copiar Landing /parceiros
            </button>
            <a
              href="/parceiros"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/80 font-ps-ui transition-all"
            >
              Ver /parceiros <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                1. Nome do Afiliado *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Camila Rocha"
                required
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                2. E-mail da Conta no App (acesso /afiliado)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="camila@email.com"
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                3. Nº de Cadastro / Código (/i/) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(normalizeAffiliateCode(e.target.value))}
                  placeholder="Ex: 482917 ou CAMILA"
                  required
                  className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-[#F5DE98] font-mono text-sm font-bold tracking-wider focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  type="button"
                  onClick={() => setCode(generatePartnerNumber())}
                  className="px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white"
                  title="Gerar novo número de cadastro"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                4. Comissão (%) — Padrão 20%
              </label>
              <input
                type="number"
                min={1}
                max={80}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                5. Chave Pix (Opcional)
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, E-mail ou Celular"
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                6. Observação Interna (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Instagram @camila · 80k"
                className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="text-xs text-white/60 space-y-0.5">
              <p>
                Simulação com <strong className="text-[#F5DE98]">{previewRate}%</strong>:{" "}
                <span className="font-mono text-white/85">
                  1 Casa: {formatBrl(calculateCommissionBrl(19.9, previewRate))} · Expansão:{" "}
                  {formatBrl(calculateCommissionBrl(49.9, previewRate))} · Mapa Completo:{" "}
                  {formatBrl(calculateCommissionBrl(99.9, previewRate))}
                </span>
              </p>
              {code && (
                <p className="font-mono text-[11px] text-[#F5DE98]/80">
                  Link: {buildAffiliateLink(code)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={creating || !dbReady}
              className="min-h-[48px] px-7 py-3 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-black font-ps-ui text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creating ? "Cadastrando..." : "Criar Afiliado"}
            </button>
          </div>
        </form>
      </section>

      {/* Lista de Afiliados */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-ps-display text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#C9A227]" />
            Afiliados Cadastrados ({affiliates.length})
          </h3>
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/50 text-sm">Carregando afiliados...</div>
        ) : affiliates.length === 0 ? (
          <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center text-white/55 text-sm">
            Nenhum afiliado cadastrado ainda. Crie o primeiro parceiro no formulário acima.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {affiliates.map((aff) => {
              const link = buildAffiliateLink(aff.code);
              const isEditingRate = editingRateId === aff.id;
              return (
                <div
                  key={aff.id}
                  className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-xl transition-all ${
                    aff.active
                      ? "bg-[#08111F]/90 border-white/12"
                      : "bg-black/45 border-white/5 opacity-70"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-ps-display text-xl font-bold text-white">
                          {aff.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/45 text-[#F5DE98] font-mono text-xs font-bold">
                          {formatPartnerIdLabel(aff.code)} · /i/{aff.code.toLowerCase()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            aff.active
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                              : "bg-white/10 text-white/50 border border-white/15"
                          }`}
                        >
                          {aff.active ? "Ativo" : "Pausado"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            aff.user_id
                              ? "bg-sky-500/15 text-sky-200 border border-sky-400/30"
                              : "bg-white/5 text-white/45 border border-white/10"
                          }`}
                        >
                          {aff.user_id ? "Conta vinculada" : "Vincula ao logar"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
                        {aff.email && <span>E-mail: {aff.email}</span>}
                        {aff.pix_key && (
                          <button
                            type="button"
                            onClick={() => handleCopy(`pix-${aff.id}`, aff.pix_key || "", "Chave Pix")}
                            className="inline-flex items-center gap-1 text-[#F5DE98]/85 hover:text-[#F5DE98]"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            Pix: {aff.pix_key}
                            {copiedId === `pix-${aff.id}` ? (
                              <Check className="w-3 h-3 text-emerald-300" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                          </button>
                        )}
                        {aff.notes && <span className="text-white/40">• {aff.notes}</span>}
                      </div>
                    </div>

                    {/* Ações rápidas */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {isEditingRate ? (
                        <div className="flex items-center gap-1.5 bg-black/60 border border-[#C9A227]/45 rounded-xl px-2.5 py-1.5">
                          <input
                            type="number"
                            min={1}
                            max={80}
                            step={0.5}
                            value={editingRateVal}
                            onChange={(e) => setEditingRateVal(e.target.value)}
                            className="w-14 bg-transparent text-[#F5DE98] font-mono text-xs font-bold focus:outline-none"
                          />
                          <span className="text-xs text-white/50">%</span>
                          <button
                            type="button"
                            disabled={busyId === aff.id}
                            onClick={() => handleSaveRate(aff.id)}
                            className="px-2 py-1 rounded-lg bg-[#C9A227] text-black text-[10px] font-bold uppercase"
                          >
                            OK
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRateId(null)}
                            className="px-1.5 py-1 text-white/50 text-[10px]"
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
                          className="min-h-[40px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/12 text-xs font-mono text-[#F5DE98] inline-flex items-center gap-1.5"
                          title="Editar taxa de comissão"
                        >
                          <Percent className="w-3.5 h-3.5" />
                          {aff.commission_rate}%
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopy(`link-${aff.id}`, link, "Link de afiliado")}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-[#FFF3D1] text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        {copiedId === `link-${aff.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        Copiar Link
                      </button>

                      <button
                        type="button"
                        disabled={busyId === aff.id}
                        onClick={() => handleToggleActive(aff)}
                        className="min-h-[40px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/12 text-white/75 text-xs inline-flex items-center gap-1.5"
                        title={aff.active ? "Pausar afiliado" : "Reativar afiliado"}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {aff.active ? "Pausar" : "Ativar"}
                      </button>

                      {aff.pending_brl > 0 && (
                        <button
                          type="button"
                          disabled={busyId === aff.id}
                          onClick={() => handlePayoutAll(aff)}
                          className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/45 text-emerald-200 text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pagar {formatBrl(aff.pending_brl)}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mini métricas por afiliado */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/[0.08] text-xs">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Cliques</span>
                      <span className="text-white font-mono font-bold text-sm">{aff.clicks_count}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Cadastros</span>
                      <span className="text-white font-mono font-bold text-sm">{aff.referred_users_count}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-mono">Vendas</span>
                      <span className="text-white font-mono font-bold text-sm">
                        {aff.sales_count}{" "}
                        <span className="text-white/40 font-normal text-[11px]">
                          ({formatBrl(aff.volume_brl)})
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[#F5DE98]/70 block text-[10px] uppercase font-mono">Pendente</span>
                      <span className="text-[#F5DE98] font-mono font-bold text-sm">
                        {formatBrl(aff.pending_brl)}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-300/70 block text-[10px] uppercase font-mono">Pago</span>
                      <span className="text-emerald-300 font-mono font-bold text-sm">
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

      {/* Tabela de Comissões Recentes */}
      <section className="p-6 rounded-3xl bg-[#08111F]/90 border border-white/10 backdrop-blur-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
              Comissões por Venda
            </h3>
            <p className="text-xs text-white/50">
              Cada venda paga via link de afiliado gera 1 registro idempotente nesta tabela.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/45 border border-white/10">
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
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === f.id
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCommissions.length === 0 ? (
          <div className="py-10 text-center text-white/45 text-sm">
            Nenhuma comissão neste filtro ainda.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-left border-collapse min-w-[740px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.16em] text-white/45">
                  <th className="py-3 pr-4">Data</th>
                  <th className="py-3 pr-4">Afiliado</th>
                  <th className="py-3 pr-4">Comprador</th>
                  <th className="py-3 pr-4">Pacote</th>
                  <th className="py-3 pr-4 text-right">Venda</th>
                  <th className="py-3 pr-4 text-right">Comissão</th>
                  <th className="py-3 text-right">Ação / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredCommissions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4 font-mono text-white/60 whitespace-nowrap">
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
                      <span className="font-mono text-[10px] text-[#F5DE98]/80">{c.affiliate_code}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-white/85 block">{c.buyer_name}</span>
                      {c.buyer_email && (
                        <span className="text-[11px] text-white/45">{c.buyer_email}</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-white/80">{c.package_label}</td>
                    <td className="py-3.5 pr-4 text-right font-mono text-white/75 whitespace-nowrap">
                      {formatBrl(c.sale_amount_brl)}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono font-bold text-[#F5DE98] whitespace-nowrap">
                      {formatBrl(c.commission_amount_brl)}
                      <span className="ml-1 text-[10px] font-normal text-white/45">
                        ({c.commission_rate}%)
                      </span>
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      {c.status === "pending" ? (
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() => handleMarkSinglePaid(c)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" /> Marcar Pago
                        </button>
                      ) : c.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Pago
                        </span>
                      ) : (
                        <span className="text-red-300 font-mono text-[10px] uppercase">Cancelado</span>
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

export default AffiliatesManager;
