import { useCallback, useEffect, useMemo, useState } from "react";
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
  AlertTriangle,
  Sparkles,
  Search,
  Trash2,
  Download,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  MessageSquare,
  Edit3,
  Mail,
  Tag,
  Flame,
  ShieldAlert,
} from "lucide-react";
import {
  adminBulkAffiliatesAction,
  adminCreateAffiliate,
  adminDeleteAffiliate,
  adminGetAffiliatesOverview,
  adminMarkAffiliatePayout,
  adminMarkCommissionPaid,
  adminUpdateAffiliate,
  AFFILIATE_TIER_PRESETS,
  applyAffiliateTagToNotes,
  buildAffiliateLink,
  buildAffiliatesFullCsv,
  buildAffiliatesPixCsv,
  calculateCommissionBrl,
  computeAffiliateAgeDays,
  computeAffiliateConversionPct,
  DEFAULT_COMMISSION_RATE,
  extractAffiliateTag,
  formatBrl,
  formatPartnerIdLabel,
  generatePartnerNumber,
  isAffiliateInactiveZeroSales,
  normalizeAffiliateCode,
  stripAffiliateTagFromNotes,
  type AdminAffiliateCommissionRow,
  type AdminAffiliateRow,
  type AffiliateTierTag,
} from "@/lib/affiliates";

type PartnerFilter =
  | "all"
  | "pending_payout"
  | "ready_pix"
  | "missing_pix"
  | "top_sellers"
  | "active"
  | "paused"
  | "inactive_zero";

type PartnerSort =
  | "pending_desc"
  | "sales_desc"
  | "clicks_desc"
  | "conversion_desc"
  | "newest"
  | "oldest_inactive";

const downloadCsvFile = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AffiliatesManager = () => {
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(true);
  const [affiliates, setAffiliates] = useState<AdminAffiliateRow[]>([]);
  const [commissions, setCommissions] = useState<AdminAffiliateCommissionRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [commissionSearch, setCommissionSearch] = useState("");

  // Filtros, Busca, Ordenação e Operação em Escala
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerFilter, setPartnerFilter] = useState<PartnerFilter>("all");
  const [partnerSort, setPartnerSort] = useState<PartnerSort>("pending_desc");
  const [minPayoutBrl, setMinPayoutBrl] = useState<number>(20);
  const [inactiveDaysThreshold, setInactiveDaysThreshold] = useState<number>(30);
  const [inactiveOnlyZeroClicks, setInactiveOnlyZeroClicks] = useState<boolean>(false);
  const [showCleanupPanel, setShowCleanupPanel] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Seleção em lote (Bulk Operations)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRateInput, setBulkRateInput] = useState<string>("25");
  const [bulkTagInput, setBulkTagInput] = useState<AffiliateTierTag>("VIP");
  const [bulkBusy, setBulkBusy] = useState<boolean>(false);

  // Formulário de novo cadastro
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string>(() => generatePartnerNumber());
  const [commissionRate, setCommissionRate] = useState<number>(DEFAULT_COMMISSION_RATE);
  const [newTierTag, setNewTierTag] = useState<AffiliateTierTag>("PADRAO");
  const [pixKey, setPixKey] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Edição individual de parceiro
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingAffiliateId, setEditingAffiliateId] = useState<string | null>(null);
  const [editRateVal, setEditRateVal] = useState<string>("20");
  const [editPixVal, setEditPixVal] = useState<string>("");
  const [editEmailVal, setEditEmailVal] = useState<string>("");
  const [editTagVal, setEditTagVal] = useState<AffiliateTierTag>("PADRAO");
  const [editNotesVal, setEditNotesVal] = useState<string>("");

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

  // Mapa da última venda de cada afiliado a partir das comissões carregadas
  const lastSaleByAffiliateId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of commissions) {
      if (c.status === "cancelled") continue;
      const prev = map[c.affiliate_id];
      if (!prev || c.created_at > prev) {
        map[c.affiliate_id] = c.created_at;
      }
    }
    return map;
  }, [commissions]);

  // Contadores de filtros inteligentes
  const filterCounts = useMemo(() => {
    const nowMs = Date.now();
    return {
      all: affiliates.length,
      pending_payout: affiliates.filter((a) => Number(a.pending_brl || 0) > 0).length,
      ready_pix: affiliates.filter(
        (a) =>
          Number(a.pending_brl || 0) >= minPayoutBrl &&
          Number(a.pending_brl || 0) > 0 &&
          Boolean(a.pix_key?.trim())
      ).length,
      missing_pix: affiliates.filter(
        (a) => !a.pix_key?.trim() && (Number(a.pending_brl || 0) > 0 || a.active)
      ).length,
      top_sellers: affiliates.filter((a) => Number(a.sales_count || 0) > 0).length,
      active: affiliates.filter((a) => a.active).length,
      paused: affiliates.filter((a) => !a.active).length,
      inactive_zero: affiliates.filter((a) =>
        isAffiliateInactiveZeroSales(a, inactiveDaysThreshold, inactiveOnlyZeroClicks, nowMs)
      ).length,
    };
  }, [affiliates, minPayoutBrl, inactiveDaysThreshold, inactiveOnlyZeroClicks]);

  // Lista de inativos para a Faxina Rápida
  const inactiveCandidates = useMemo(() => {
    const nowMs = Date.now();
    return affiliates.filter((a) =>
      isAffiliateInactiveZeroSales(a, inactiveDaysThreshold, inactiveOnlyZeroClicks, nowMs)
    );
  }, [affiliates, inactiveDaysThreshold, inactiveOnlyZeroClicks]);

  // Lista filtrada e ordenada de parceiros
  const filteredAffiliates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const nowMs = Date.now();

    const list = affiliates.filter((a) => {
      if (q) {
        const hay = [
          a.name,
          a.code,
          formatPartnerIdLabel(a.code),
          a.email || "",
          a.pix_key || "",
          a.notes || "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      switch (partnerFilter) {
        case "pending_payout":
          return Number(a.pending_brl || 0) > 0;
        case "ready_pix":
          return (
            Number(a.pending_brl || 0) >= minPayoutBrl &&
            Number(a.pending_brl || 0) > 0 &&
            Boolean(a.pix_key?.trim())
          );
        case "missing_pix":
          return !a.pix_key?.trim() && (Number(a.pending_brl || 0) > 0 || a.active);
        case "top_sellers":
          return Number(a.sales_count || 0) > 0;
        case "active":
          return a.active;
        case "paused":
          return !a.active;
        case "inactive_zero":
          return isAffiliateInactiveZeroSales(
            a,
            inactiveDaysThreshold,
            inactiveOnlyZeroClicks,
            nowMs
          );
        default:
          return true;
      }
    });

    return [...list].sort((a, b) => {
      switch (partnerSort) {
        case "pending_desc":
          return (
            Number(b.pending_brl || 0) - Number(a.pending_brl || 0) ||
            Number(b.sales_count || 0) - Number(a.sales_count || 0)
          );
        case "sales_desc":
          return (
            Number(b.sales_count || 0) - Number(a.sales_count || 0) ||
            Number(b.volume_brl || 0) - Number(a.volume_brl || 0)
          );
        case "clicks_desc":
          return Number(b.clicks_count || 0) - Number(a.clicks_count || 0);
        case "conversion_desc":
          return (
            computeAffiliateConversionPct(b.clicks_count, b.sales_count) -
            computeAffiliateConversionPct(a.clicks_count, a.sales_count)
          );
        case "newest":
          return Date.parse(b.created_at || "") - Date.parse(a.created_at || "");
        case "oldest_inactive":
          return (
            Number(a.sales_count || 0) - Number(b.sales_count || 0) ||
            Date.parse(a.created_at || "") - Date.parse(b.created_at || "")
          );
        default:
          return 0;
      }
    });
  }, [
    affiliates,
    searchQuery,
    partnerFilter,
    partnerSort,
    minPayoutBrl,
    inactiveDaysThreshold,
    inactiveOnlyZeroClicks,
  ]);

  const selectedAffiliates = useMemo(() => {
    const idSet = new Set(selectedIds);
    return affiliates.filter((a) => idSet.has(a.id));
  }, [affiliates, selectedIds]);

  const allFilteredSelected =
    filteredAffiliates.length > 0 &&
    filteredAffiliates.every((a) => selectedIds.includes(a.id));

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filteredAffiliates.map((a) => a.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filteredAffiliates.map((a) => a.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

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
      const finalNotes = applyAffiliateTagToNotes(notes, newTierTag);
      await adminCreateAffiliate({
        name: name.trim(),
        code: cleanCode,
        email: email.trim() || undefined,
        commission_rate: Number(commissionRate) || DEFAULT_COMMISSION_RATE,
        pix_key: pixKey.trim() || undefined,
        notes: finalNotes || undefined,
      });
      toast.success(
        `Parceiro ${formatPartnerIdLabel(cleanCode)} cadastrado com ${commissionRate}% de comissão!`
      );
      setName("");
      setEmail("");
      setCode(generatePartnerNumber());
      setCommissionRate(DEFAULT_COMMISSION_RATE);
      setNewTierTag("PADRAO");
      setPixKey("");
      setNotes("");
      setShowCreateForm(false);
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

  const openEditAffiliate = (aff: AdminAffiliateRow) => {
    setEditingAffiliateId(aff.id);
    setEditRateVal(String(aff.commission_rate));
    setEditPixVal(aff.pix_key || "");
    setEditEmailVal(aff.email || "");
    setEditTagVal(extractAffiliateTag(aff.notes));
    setEditNotesVal(stripAffiliateTagFromNotes(aff.notes));
  };

  const handleSaveAffiliateEdit = async (aff: AdminAffiliateRow) => {
    const parsedRate = Number(editRateVal);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0 || parsedRate > 80) {
      toast.error("Informe uma comissão válida entre 1% e 80%.");
      return;
    }
    setBusyId(aff.id);
    try {
      await adminUpdateAffiliate({
        affiliate_id: aff.id,
        commission_rate: parsedRate,
        pix_key: editPixVal.trim(),
        email: editEmailVal.trim(),
        notes: applyAffiliateTagToNotes(editNotesVal, editTagVal),
      });
      toast.success(`Cadastro de ${aff.name} atualizado.`);
      setEditingAffiliateId(null);
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar cadastro.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteSingle = async (aff: AdminAffiliateRow) => {
    const hasSales = Number(aff.sales_count || 0) > 0;
    const msg = hasSales
      ? `${aff.name} (${formatPartnerIdLabel(aff.code)}) já possui ${aff.sales_count} venda(s) registrada(s).\n\nPara proteger seu histórico financeiro, ele será PAUSADO e marcado como [ARQUIVADO]. Confirmar?`
      : `Excluir DEFINITIVAMENTE ${aff.name} (${formatPartnerIdLabel(aff.code)})?\n\nEste parceiro tem 0 vendas e será removido do banco.`;
    if (!window.confirm(msg)) return;

    setBusyId(aff.id);
    try {
      const res = await adminDeleteAffiliate(aff);
      toast.success(
        res.action === "deleted"
          ? `Parceiro ${formatPartnerIdLabel(aff.code)} excluído definitivamente.`
          : `Parceiro ${formatPartnerIdLabel(aff.code)} arquivado e pausado.`
      );
      setSelectedIds((prev) => prev.filter((id) => id !== aff.id));
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao remover parceiro.");
    } finally {
      setBusyId(null);
    }
  };

  const handlePayoutAll = async (aff: AdminAffiliateRow) => {
    if (aff.pending_brl <= 0) return;
    const confirmed = window.confirm(
      `Confirmar repasse Pix de ${formatBrl(aff.pending_brl)} para ${aff.name} (${formatPartnerIdLabel(aff.code)})?\nChave Pix: ${aff.pix_key || "Não informada"}\n\nTodas as comissões pendentes deste parceiro serão marcadas como PAGAS.`
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

  const handleBulkAction = async (
    action: "activate" | "pause" | "set_rate" | "payout" | "delete_unused" | "set_tag",
    customTargets?: AdminAffiliateRow[]
  ) => {
    const targets = customTargets || selectedAffiliates;
    if (!targets.length) {
      toast.error("Selecione pelo menos 1 parceiro.");
      return;
    }

    if (action === "set_rate") {
      const parsed = Number(bulkRateInput);
      if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 80) {
        toast.error("Informe uma comissão válida entre 1% e 80%.");
        return;
      }
      if (
        !window.confirm(
          `Alterar a comissão de ${targets.length} parceiro(s) selecionado(s) para ${parsed}%?`
        )
      ) {
        return;
      }
    } else if (action === "payout") {
      const withPending = targets.filter((a) => Number(a.pending_brl || 0) > 0);
      if (!withPending.length) {
        toast.error("Nenhum dos parceiros selecionados possui saldo pendente a pagar.");
        return;
      }
      const totalBrl = withPending.reduce((s, a) => s + Number(a.pending_brl || 0), 0);
      if (
        !window.confirm(
          `Confirmar baixa em lote de Pix para ${withPending.length} parceiro(s), totalizando ${formatBrl(totalBrl)}?`
        )
      ) {
        return;
      }
    } else if (action === "delete_unused") {
      const zeroSalesCount = targets.filter((a) => Number(a.sales_count || 0) === 0).length;
      const withSalesCount = targets.length - zeroSalesCount;
      if (
        !window.confirm(
          `Confirmar limpeza em lote de ${targets.length} parceiro(s)?\n\n• ${zeroSalesCount} com 0 vendas serão EXCLUÍDOS definitivamente.\n• ${withSalesCount} com histórico de vendas serão PAUSADOS e [ARQUIVADOS].`
        )
      ) {
        return;
      }
    }

    setBulkBusy(true);
    try {
      const res = await adminBulkAffiliatesAction({
        affiliates: targets,
        action,
        commission_rate: action === "set_rate" ? Number(bulkRateInput) : undefined,
        tag: action === "set_tag" ? bulkTagInput : undefined,
        note: "Repasse Pix em lote via Admin",
      });

      if (action === "payout") {
        toast.success(
          `Folha Pix liquidada! ${res.affected} comissão(ões)/parceiro(s) pagos (${formatBrl(res.paid_total_brl)}).`
        );
      } else if (action === "delete_unused") {
        toast.success(
          `Limpeza concluída: ${res.affected} excluído(s) definitivamente e ${res.archived} arquivado(s).`
        );
        setSelectedIds([]);
      } else if (action === "set_tag") {
        toast.success(`Tier [${bulkTagInput}] aplicado em ${targets.length} parceiro(s).`);
      } else {
        toast.success(`Ação em lote aplicada em ${targets.length} parceiro(s).`);
      }
      await fetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao executar ação em lote.");
    } finally {
      setBulkBusy(false);
    }
  };

  const handlePayoutAllEligiblePix = async () => {
    const eligible = affiliates.filter(
      (a) =>
        Number(a.pending_brl || 0) >= minPayoutBrl &&
        Number(a.pending_brl || 0) > 0 &&
        Boolean(a.pix_key?.trim())
    );
    if (!eligible.length) {
      toast.error(
        `Nenhum parceiro com chave Pix e saldo ≥ ${formatBrl(minPayoutBrl)} no momento.`
      );
      return;
    }
    await handleBulkAction("payout", eligible);
  };

  const handleCopyPartnerMessage = (aff: AdminAffiliateRow) => {
    const link = buildAffiliateLink(aff.code);
    const idLabel = formatPartnerIdLabel(aff.code);
    let message = "";

    if (Number(aff.pending_brl || 0) > 0 && !aff.pix_key?.trim()) {
      message = `Olá, ${aff.name}! Você tem ${formatBrl(aff.pending_brl)} em comissões aprovadas no Protocolo Solar (Cadastro ${idLabel}). Cadastre sua chave Pix em https://protocolosolar.com.br/afiliado para liberarmos o seu repasse!`;
    } else if (Number(aff.pending_brl || 0) > 0) {
      message = `Olá, ${aff.name}! Seu repasse do Protocolo Solar (Cadastro ${idLabel}) no valor de ${formatBrl(aff.pending_brl)} está em processamento para a chave Pix ${aff.pix_key}. Seu link oficial: ${link}`;
    } else if (Number(aff.sales_count || 0) === 0) {
      message = `Olá, ${aff.name}! Seu cadastro oficial de parceiro do Protocolo Solar (${idLabel}) já está ativo com ${aff.commission_rate}% de comissão por venda. Seu link curto para compartilhar nos Stories e WhatsApp é: ${link} — em https://protocolosolar.com.br/afiliado você também encontra criativos prontos 9:16!`;
    } else {
      message = `Olá, ${aff.name}! Parabéns pelas ${aff.sales_count} venda(s) no Protocolo Solar (Cadastro ${idLabel} · Total acumulado: ${formatBrl(aff.total_brl)}). Continue compartilhando seu link oficial: ${link}`;
    }

    handleCopy(`msg-${aff.id}`, message, `Mensagem para ${aff.name}`);
  };

  const handleCopySelectedEmails = (list: AdminAffiliateRow[]) => {
    const emails = Array.from(
      new Set(list.map((a) => a.email?.trim()).filter((e): e is string => Boolean(e)))
    );
    if (!emails.length) {
      toast.error("Nenhum e-mail cadastrado nos parceiros selecionados.");
      return;
    }
    handleCopy("bulk-emails", emails.join(", "), `${emails.length} e-mail(s)`);
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
  const totalClicks = affiliates.reduce((sum, a) => sum + Number(a.clicks_count || 0), 0);
  const totalVolumeBrl = affiliates.reduce((sum, a) => sum + Number(a.volume_brl || 0), 0);
  const totalPendingBrl = affiliates.reduce((sum, a) => sum + Number(a.pending_brl || 0), 0);
  const totalPaidBrl = affiliates.reduce((sum, a) => sum + Number(a.paid_brl || 0), 0);
  const avgConversionPct = computeAffiliateConversionPct(totalClicks, totalSales);

  const eligiblePixPartners = affiliates.filter(
    (a) =>
      Number(a.pending_brl || 0) >= minPayoutBrl &&
      Number(a.pending_brl || 0) > 0 &&
      Boolean(a.pix_key?.trim())
  );
  const eligiblePixTotalBrl = eligiblePixPartners.reduce(
    (sum, a) => sum + Number(a.pending_brl || 0),
    0
  );

  const filteredCommissions = useMemo(() => {
    const q = commissionSearch.trim().toLowerCase();
    return commissions.filter((c) => {
      if (statusFilter === "pending" && c.status !== "pending") return false;
      if (statusFilter === "paid" && c.status !== "paid") return false;
      if (q) {
        const hay = [
          c.affiliate_name,
          c.affiliate_code,
          c.buyer_name,
          c.buyer_email || "",
          c.package_label,
          c.order_id,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [commissions, statusFilter, commissionSearch]);

  const previewRate =
    Number(commissionRate) > 0 ? Number(commissionRate) : DEFAULT_COMMISSION_RATE;

  return (
    <div className="space-y-8">
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

      {/* 1. KPIs Clicáveis (Clicar já filtra a operação) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() =>
            setPartnerFilter((f) => (f === "pending_payout" ? "all" : "pending_payout"))
          }
          className={`text-left p-5 rounded-2xl bg-gradient-to-b from-[#C9A227]/14 to-[#07101A]/95 border transition-all backdrop-blur-xl ${
            partnerFilter === "pending_payout"
              ? "border-[#F5DE98] ring-1 ring-[#C9A227]/50"
              : "border-[#C9A227]/40 hover:border-[#C9A227]/70"
          }`}
        >
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#F5DE98] font-semibold block mb-2">
            Comissões a Pagar
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {formatBrl(totalPendingBrl)}
          </p>
          <p className="font-ps-ui text-xs text-[#E8D59B]/85 mt-1.5">
            {filterCounts.pending_payout} parceiro(s) com saldo · Clique p/ filtrar
          </p>
        </button>

        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 backdrop-blur-xl">
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Total Repassado
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {formatBrl(totalPaidBrl)}
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1.5">
            Comissões já liquidadas via Pix
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setPartnerFilter((f) => (f === "top_sellers" ? "all" : "top_sellers"))
          }
          className={`text-left p-5 rounded-2xl bg-[#07101A]/90 border transition-all backdrop-blur-xl ${
            partnerFilter === "top_sellers"
              ? "border-[#C9A227] ring-1 ring-[#C9A227]/40"
              : "border-white/10 hover:border-white/25"
          }`}
        >
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Vendas via Parceiros
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {totalSales}{" "}
            <span className="text-base font-ps-ui text-[#E8D59B]">
              ({formatBrl(totalVolumeBrl)})
            </span>
          </p>
          <p className="font-ps-ui text-xs text-[#94A3B8] mt-1.5">
            {totalClicks} cliques · Conversão média {avgConversionPct}%
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            setPartnerFilter((f) => (f === "inactive_zero" ? "all" : "inactive_zero"))
          }
          className={`text-left p-5 rounded-2xl bg-[#07101A]/90 border transition-all backdrop-blur-xl ${
            partnerFilter === "inactive_zero"
              ? "border-[#C9A227] ring-1 ring-[#C9A227]/40"
              : "border-white/10 hover:border-white/25"
          }`}
        >
          <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] font-semibold block mb-2">
            Rede & Inatividade
          </span>
          <p className="font-ps-display font-normal text-3xl text-white tabular-nums">
            {totalActive}{" "}
            <span className="text-base font-ps-ui text-[#94A3B8]">
              / {affiliates.length} ativos
            </span>
          </p>
          <p className="font-ps-ui text-xs text-[#E8D59B]/85 mt-1.5">
            {filterCounts.inactive_zero} sem venda há {inactiveDaysThreshold}d+ ·{" "}
            {filterCounts.missing_pix} sem Pix
          </p>
        </button>
      </div>

      {/* 2. Barra Operacional: Dia do Pix, Exportação CSV, Faxina de Inativos e Novo Parceiro */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#07101A]/90 border border-white/10 backdrop-blur-xl space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#E8D59B] font-semibold block">
              Operação em Escala (1 a 1.000+ Afiliados)
            </span>
            <h3 className="font-ps-display font-normal text-xl sm:text-2xl text-white">
              Fechamento Pix, Exportação & Limpeza de Rede
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor de Saque Mínimo */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#040912] border border-white/12 text-xs font-ps-ui">
              <span className="text-[#94A3B8]">Saque mín.:</span>
              {([0, 20, 50, 100] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMinPayoutBrl(val)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    minPayoutBrl === val
                      ? "bg-[#C9A227] text-[#02050A]"
                      : "text-[#CBD5E1] hover:text-white"
                  }`}
                >
                  {val === 0 ? "Sem mín." : `R$${val}`}
                </button>
              ))}
            </div>

            {/* Liquidar Folha Pix Elegível em 1 clique */}
            <button
              type="button"
              disabled={bulkBusy || eligiblePixPartners.length === 0}
              onClick={handlePayoutAllEligiblePix}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] disabled:opacity-40 text-[#02050A] font-ps-ui text-xs font-bold inline-flex items-center gap-2 transition-all tabular-nums"
              title="Marca como pago todos os parceiros com chave Pix e saldo acima do mínimo"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Dar Baixa Folha Pix ({eligiblePixPartners.length} ·{" "}
                {formatBrl(eligiblePixTotalBrl)})
              </span>
            </button>

            {/* Exportar CSV Folha Pix */}
            <button
              type="button"
              onClick={() => {
                const csv = buildAffiliatesPixCsv(affiliates, minPayoutBrl);
                const dateStr = new Date().toISOString().slice(0, 10);
                downloadCsvFile(`protocolo-solar-folha-pix-${dateStr}.csv`, csv);
                toast.success("Planilha da Folha Pix (.CSV) baixada!");
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-[#F5DE98] font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Folha Pix (.CSV)</span>
            </button>

            {/* Exportar Base Completa CSV */}
            <button
              type="button"
              onClick={() => {
                const csv = buildAffiliatesFullCsv(filteredAffiliates, lastSaleByAffiliateId);
                const dateStr = new Date().toISOString().slice(0, 10);
                downloadCsvFile(`protocolo-solar-afiliados-${dateStr}.csv`, csv);
                toast.success(
                  `Planilha com ${filteredAffiliates.length} parceiro(s) exportada!`
                );
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-[#CBD5E1] font-ps-ui text-xs inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Lista (.CSV)</span>
            </button>

            {/* Abrir Faxina de Inativos */}
            <button
              type="button"
              onClick={() => setShowCleanupPanel((v) => !v)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                showCleanupPanel
                  ? "bg-red-500/15 border-red-400/45 text-red-200"
                  : "bg-white/[0.04] hover:bg-white/[0.09] border-white/12 text-[#CBD5E1]"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Faxina de Inativos ({filterCounts.inactive_zero})</span>
            </button>

            {/* Abrir Cadastro Manual */}
            <button
              type="button"
              onClick={() => setShowCreateForm((v) => !v)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                showCreateForm
                  ? "bg-[#C9A227]/20 border-[#C9A227]/60 text-[#F5DE98]"
                  : "bg-[#C9A227]/12 hover:bg-[#C9A227]/20 border-[#C9A227]/35 text-[#F5DE98]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showCreateForm ? "Fechar Cadastro" : "Novo Parceiro"}</span>
            </button>
          </div>
        </div>

        {/* Painel Retrátil: Faxina de Inativos (Deletar ou Pausar quem não vendeu nada em X dias) */}
        {showCleanupPanel && (
          <div className="p-5 rounded-2xl bg-[#040912]/90 border border-red-400/30 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-red-300 font-ps-ui text-xs font-semibold uppercase tracking-[0.14em]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Limpeza Inteligente de Parceiros sem Vendas</span>
                </div>
                <p className="font-ps-ui text-xs text-[#94A3B8] max-w-3xl">
                  Filtra afiliados com <strong className="text-white">0 vendas</strong>{" "}
                  cadastrados há mais de <strong className="text-white">{inactiveDaysThreshold} dias</strong>.
                  Quem nunca vendeu nada pode ser excluído definitivamente do banco; quem já
                  teve venda algum dia jamais é apagado por engano (é apenas pausado/arquivado).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-ps-ui text-xs text-[#94A3B8]">Sem vender há:</span>
                {([15, 30, 60, 90, 180] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setInactiveDaysThreshold(days)}
                    className={`px-3 py-1.5 rounded-lg font-ps-ui text-xs font-semibold transition-all ${
                      inactiveDaysThreshold === days
                        ? "bg-[#C9A227] text-[#02050A]"
                        : "bg-white/[0.04] text-[#CBD5E1] hover:text-white border border-white/10"
                    }`}
                  >
                    {days}+ dias
                  </button>
                ))}

                <label className="inline-flex items-center gap-2 ml-2 font-ps-ui text-xs text-[#CBD5E1] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inactiveOnlyZeroClicks}
                    onChange={(e) => setInactiveOnlyZeroClicks(e.target.checked)}
                    className="rounded border-white/20 bg-[#07101A]"
                  />
                  <span>Apenas com 0 cliques</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              <div className="font-ps-ui text-xs text-[#E2E8F0]">
                Encontrados:{" "}
                <strong className="text-[#F5DE98] text-sm tabular-nums">
                  {inactiveCandidates.length}
                </strong>{" "}
                parceiro(s) com 0 vendas há {inactiveDaysThreshold}+ dias
                {inactiveOnlyZeroClicks ? " (e 0 cliques)" : ""}.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={inactiveCandidates.length === 0}
                  onClick={() => {
                    setPartnerFilter("inactive_zero");
                    setSelectedIds(inactiveCandidates.map((a) => a.id));
                    toast.success(
                      `${inactiveCandidates.length} parceiro(s) inativo(s) selecionados na lista abaixo.`
                    );
                  }}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-ps-ui text-xs font-semibold disabled:opacity-40"
                >
                  Ver e Selecionar na Lista ({inactiveCandidates.length})
                </button>

                <button
                  type="button"
                  disabled={bulkBusy || inactiveCandidates.length === 0}
                  onClick={() => handleBulkAction("pause", inactiveCandidates)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 font-ps-ui text-xs font-semibold disabled:opacity-40"
                >
                  Pausar Todos os Inativos ({inactiveCandidates.length})
                </button>

                <button
                  type="button"
                  disabled={bulkBusy || inactiveCandidates.length === 0}
                  onClick={() => handleBulkAction("delete_unused", inactiveCandidates)}
                  className="min-h-[38px] px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/45 text-red-200 font-ps-ui text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Definitivamente ({inactiveCandidates.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Painel Retrátil: Cadastrar Novo Parceiro Manualmente */}
        {showCreateForm && (
          <form
            onSubmit={handleCreate}
            className="p-5 rounded-2xl bg-[#040912]/90 border border-[#C9A227]/35 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#E8D59B] font-semibold block">
                  Cadastro Manual / VIP
                </span>
                <h4 className="font-ps-display font-normal text-xl text-white">
                  Cadastrar Parceiro com Tier e Comissão Customizada
                </h4>
              </div>

              {/* Presets de Tier em 1 clique */}
              <div className="flex flex-wrap items-center gap-1.5">
                {AFFILIATE_TIER_PRESETS.filter((p) => p.tag !== "ARQUIVADO").map((preset) => (
                  <button
                    key={preset.tag}
                    type="button"
                    onClick={() => {
                      setNewTierTag(preset.tag);
                      setCommissionRate(preset.defaultRate);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-ps-ui text-[11px] font-semibold border transition-all ${
                      newTierTag === preset.tag
                        ? "bg-[#C9A227] text-[#02050A] border-[#C9A227]"
                        : "bg-white/[0.04] text-[#CBD5E1] border-white/10 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  Nome do Parceiro *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ana Solar"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  Nº de Cadastro (ou Código VIP) *
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(normalizeAffiliateCode(e.target.value))}
                    placeholder="Ex: 482917"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm font-mono text-[#F5DE98] placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="button"
                    onClick={() => setCode(generatePartnerNumber())}
                    className="min-h-[44px] px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-xs text-[#E8D59B] font-ps-ui shrink-0"
                    title="Sortear novo número de 6 dígitos"
                  >
                    Gerar Nº
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  E-mail da Conta (vínculo automático)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parceiro@email.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  Comissão (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={80}
                  step={0.5}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm text-white tabular-nums focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  Chave Pix
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, e-mail, celular ou aleatória"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block font-ps-ui text-[11px] uppercase tracking-[0.12em] text-[#AAB6C4] font-semibold mb-1.5">
                  Observações / @Instagram / WhatsApp
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: @anasolar · WhatsApp (11) 99999-9999"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#07101A] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2 text-xs font-ps-ui text-[#CBD5E1]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Repasse em {previewRate}%:</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#F5DE98] tabular-nums">
                  R$ 19,90 → {formatBrl(calculateCommissionBrl(19.9, previewRate))}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#F5DE98] tabular-nums">
                  R$ 49,90 → {formatBrl(calculateCommissionBrl(49.9, previewRate))}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#F5DE98] tabular-nums">
                  R$ 99,90 → {formatBrl(calculateCommissionBrl(99.9, previewRate))}
                </span>
              </div>

              <button
                type="submit"
                disabled={creating || !dbReady}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{creating ? "Cadastrando..." : "Salvar Parceiro"}</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 3. Busca, 8 Filtros Inteligentes, Ordenação e Seleção em Massa */}
      <section className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#07101A]/90 border border-white/10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Input de Busca Instantânea */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar parceiro por nome, #código, e-mail, chave Pix ou @nota..."
                className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl bg-[#040912] border border-white/12 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#C9A227]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ordenação + Atualizar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#040912] border border-white/12 text-xs font-ps-ui text-[#CBD5E1]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Ordenar:</span>
                <select
                  value={partnerSort}
                  onChange={(e) => setPartnerSort(e.target.value as PartnerSort)}
                  className="bg-transparent text-white font-semibold focus:outline-none"
                >
                  <option value="pending_desc" className="bg-[#07101A]">
                    Maior saldo a pagar
                  </option>
                  <option value="sales_desc" className="bg-[#07101A]">
                    Mais vendas (volume)
                  </option>
                  <option value="clicks_desc" className="bg-[#07101A]">
                    Mais cliques no link
                  </option>
                  <option value="conversion_desc" className="bg-[#07101A]">
                    Melhor conversão (%)
                  </option>
                  <option value="newest" className="bg-[#07101A]">
                    Mais recentes
                  </option>
                  <option value="oldest_inactive" className="bg-[#07101A]">
                    Mais antigos sem vender
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={toggleSelectAllFiltered}
                disabled={filteredAffiliates.length === 0}
                className="min-h-[42px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-xs text-[#F5DE98] font-ps-ui font-semibold disabled:opacity-40"
              >
                {allFilteredSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#C9A227]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#94A3B8]" />
                )}
                <span>
                  {allFilteredSelected
                    ? "Desmarcar Filtro"
                    : `Selecionar Filtro (${filteredAffiliates.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={fetchOverview}
                disabled={loading}
                className="min-h-[42px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-xs text-[#CBD5E1] font-ps-ui"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Atualizar</span>
              </button>
            </div>
          </div>

          {/* 8 Pílulas de Filtro Rápido */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8] mr-1" />
            {(
              [
                { id: "all", label: `Todos (${filterCounts.all})` },
                { id: "pending_payout", label: `A Pagar (${filterCounts.pending_payout})` },
                {
                  id: "ready_pix",
                  label: `Liberados Pix ≥ R$${minPayoutBrl} (${filterCounts.ready_pix})`,
                },
                { id: "missing_pix", label: `Sem Pix (${filterCounts.missing_pix})` },
                { id: "top_sellers", label: `Com Vendas (${filterCounts.top_sellers})` },
                { id: "active", label: `Ativos (${filterCounts.active})` },
                { id: "paused", label: `Pausados (${filterCounts.paused})` },
                {
                  id: "inactive_zero",
                  label: `0 Vendas há ${inactiveDaysThreshold}d+ (${filterCounts.inactive_zero})`,
                },
              ] as Array<{ id: PartnerFilter; label: string }>
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setPartnerFilter(f.id)}
                className={`min-h-[34px] px-3 py-1 rounded-xl font-ps-ui text-xs font-semibold border transition-all ${
                  partnerFilter === f.id
                    ? "bg-[#C9A227] text-[#02050A] border-[#C9A227]"
                    : "bg-[#040912]/70 text-[#AAB6C4] border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Ação em Lote (aparece quando 1 ou 100+ parceiros estão marcados) */}
        {selectedAffiliates.length > 0 && (
          <div className="sticky top-20 z-20 p-4 rounded-2xl bg-[#0B1626]/95 border border-[#C9A227]/60 shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 font-ps-ui text-xs">
              <span className="px-3 py-1 rounded-full bg-[#C9A227] text-[#02050A] font-bold tabular-nums">
                {selectedAffiliates.length} selecionado(s)
              </span>
              <span className="text-[#E8D59B] tabular-nums">
                Saldo pendente no lote:{" "}
                <strong>
                  {formatBrl(
                    selectedAffiliates.reduce((s, a) => s + Number(a.pending_brl || 0), 0)
                  )}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[#94A3B8] hover:text-white underline ml-1"
              >
                Limpar seleção
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkAction("payout")}
                className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pagar Pix do Lote</span>
              </button>

              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkAction("activate")}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 font-ps-ui text-xs font-semibold"
              >
                Ativar Lote
              </button>

              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkAction("pause")}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#CBD5E1] font-ps-ui text-xs font-semibold"
              >
                Pausar Lote
              </button>

              {/* Mudar Comissão % em Lote */}
              <div className="inline-flex items-center gap-1 bg-[#040912] border border-white/15 rounded-xl px-2 py-1">
                <input
                  type="number"
                  min={1}
                  max={80}
                  step={0.5}
                  value={bulkRateInput}
                  onChange={(e) => setBulkRateInput(e.target.value)}
                  className="w-12 bg-transparent text-[#F5DE98] font-ps-ui text-xs font-bold tabular-nums focus:outline-none"
                />
                <span className="text-xs text-[#94A3B8]">%</span>
                <button
                  type="button"
                  disabled={bulkBusy}
                  onClick={() => handleBulkAction("set_rate")}
                  className="px-2 py-0.5 rounded-lg bg-[#C9A227]/25 hover:bg-[#C9A227]/40 text-[#F5DE98] text-[11px] font-semibold"
                >
                  Aplicar %
                </button>
              </div>

              {/* Aplicar Tag/Tier em Lote */}
              <div className="inline-flex items-center gap-1 bg-[#040912] border border-white/15 rounded-xl px-2 py-1">
                <select
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value as AffiliateTierTag)}
                  className="bg-transparent text-xs font-ps-ui text-[#E8D59B] focus:outline-none"
                >
                  {AFFILIATE_TIER_PRESETS.map((p) => (
                    <option key={p.tag} value={p.tag} className="bg-[#07101A]">
                      {p.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={bulkBusy}
                  onClick={() => handleBulkAction("set_tag")}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold"
                >
                  Tag
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopySelectedEmails(selectedAffiliates)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-[#CBD5E1] font-ps-ui text-xs inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Copiar E-mails</span>
              </button>

              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => handleBulkAction("delete_unused")}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/35 text-red-200 font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir / Arquivar</span>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Parceiros Filtrados */}
        {loading ? (
          <div className="p-10 text-center text-[#94A3B8] text-sm font-ps-ui">
            Carregando parceiros...
          </div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="p-10 rounded-2xl border border-white/10 bg-[#07101A]/75 text-center text-[#94A3B8] text-sm font-ps-ui space-y-2">
            <p>Nenhum parceiro encontrado neste filtro/busca.</p>
            {partnerFilter !== "all" || searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setPartnerFilter("all");
                  setSearchQuery("");
                }}
                className="text-xs text-[#F5DE98] underline"
              >
                Limpar filtros e mostrar todos ({affiliates.length})
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredAffiliates.map((aff) => {
              const link = buildAffiliateLink(aff.code);
              const isSelected = selectedIds.includes(aff.id);
              const isEditing = editingAffiliateId === aff.id;
              const tierTag = extractAffiliateTag(aff.notes);
              const tierMeta =
                AFFILIATE_TIER_PRESETS.find((p) => p.tag === tierTag) ||
                AFFILIATE_TIER_PRESETS[0];
              const cleanNotes = stripAffiliateTagFromNotes(aff.notes);
              const ageDays = computeAffiliateAgeDays(aff.created_at);
              const convPct = computeAffiliateConversionPct(
                aff.clicks_count,
                aff.sales_count
              );
              const lastSaleIso = lastSaleByAffiliateId[aff.id];
              const missingPixWithBalance =
                Number(aff.pending_brl || 0) > 0 && !aff.pix_key?.trim();

              return (
                <div
                  key={aff.id}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                    isSelected
                      ? "bg-[#0A1626]/95 border-[#C9A227]/65 ring-1 ring-[#C9A227]/35"
                      : aff.active
                        ? "bg-[#07101A]/90 border-white/12"
                        : "bg-[#040912]/70 border-white/[0.06] opacity-75"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Checkbox de Seleção */}
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(aff.id)}
                        className="mt-1 text-[#C9A227] hover:scale-105 transition-transform shrink-0"
                        aria-label={`Selecionar ${aff.name}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#C9A227]" />
                        ) : (
                          <Square className="w-5 h-5 text-white/35 hover:text-white/70" />
                        )}
                      </button>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-ps-display font-normal text-xl text-white">
                            {aff.name}
                          </h4>

                          <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#F5DE98] font-mono text-xs">
                            {formatPartnerIdLabel(aff.code)} · /i/{aff.code.toLowerCase()}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-ps-ui font-semibold border ${tierMeta.badgeClass}`}
                          >
                            {tierMeta.label}
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

                          {Number(aff.sales_count || 0) >= 5 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-ps-ui font-semibold bg-[#C9A227]/20 text-[#F5DE98] border border-[#C9A227]/45">
                              <Flame className="w-3 h-3" /> Top Seller
                            </span>
                          )}

                          {missingPixWithBalance && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-ps-ui font-semibold bg-amber-500/15 text-amber-200 border border-amber-400/40">
                              <AlertTriangle className="w-3 h-3" /> Saldo sem chave Pix!
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ps-ui text-xs text-[#94A3B8]">
                          {aff.email && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(`email-${aff.id}`, aff.email || "", "E-mail")
                              }
                              className="hover:text-white inline-flex items-center gap-1"
                            >
                              <span>{aff.email}</span>
                            </button>
                          )}

                          {aff.pix_key ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(`pix-${aff.id}`, aff.pix_key || "", "Chave Pix")
                              }
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
                          ) : (
                            <span className="text-amber-300/80">Sem Pix cadastrado</span>
                          )}

                          {cleanNotes && <span className="text-[#CBD5E1]">• {cleanNotes}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação Individual */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => (isEditing ? setEditingAffiliateId(null) : openEditAffiliate(aff))}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-xs font-ps-ui font-semibold text-[#F5DE98] inline-flex items-center gap-1.5 tabular-nums"
                        title="Editar comissão, Pix, Tier e notas"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{aff.commission_rate}% · Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(`link-${aff.id}`, link, "Link do parceiro")}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/25 border border-[#C9A227]/40 text-[#F5DE98] font-ps-ui text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        {copiedId === `link-${aff.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyPartnerMessage(aff)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-[#CBD5E1] font-ps-ui text-xs inline-flex items-center gap-1.5"
                        title="Copiar mensagem personalizada (cobrar Pix, reativar ou parabenizar)"
                      >
                        {copiedId === `msg-${aff.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5" />
                        )}
                        <span>Mensagem</span>
                      </button>

                      <button
                        type="button"
                        disabled={busyId === aff.id}
                        onClick={() => handleToggleActive(aff)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 text-[#CBD5E1] font-ps-ui text-xs inline-flex items-center gap-1.5"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{aff.active ? "Pausar" : "Ativar"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={busyId === aff.id}
                        onClick={() => handleDeleteSingle(aff)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/25 text-red-300 font-ps-ui text-xs inline-flex items-center gap-1"
                        title={
                          Number(aff.sales_count || 0) > 0
                            ? "Arquivar parceiro (preserva histórico de vendas)"
                            : "Excluir parceiro (0 vendas)"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {aff.pending_brl > 0 && (
                        <button
                          type="button"
                          disabled={busyId === aff.id}
                          onClick={() => handlePayoutAll(aff)}
                          className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#D9B643] text-[#02050A] font-ps-ui text-xs font-bold inline-flex items-center gap-1.5 tabular-nums"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pagar {formatBrl(aff.pending_brl)}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Painel Inline de Edição Completa */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-[#040912]/80 p-4 rounded-xl">
                      <div>
                        <label className="block font-ps-ui text-[10px] uppercase tracking-[0.12em] text-[#94A3B8] mb-1">
                          Comissão (%)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={80}
                          step={0.5}
                          value={editRateVal}
                          onChange={(e) => setEditRateVal(e.target.value)}
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#07101A] border border-white/15 text-xs text-[#F5DE98] font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-ps-ui text-[10px] uppercase tracking-[0.12em] text-[#94A3B8] mb-1">
                          Tier / Categoria
                        </label>
                        <select
                          value={editTagVal}
                          onChange={(e) => {
                            const nextTag = e.target.value as AffiliateTierTag;
                            setEditTagVal(nextTag);
                            const preset = AFFILIATE_TIER_PRESETS.find((p) => p.tag === nextTag);
                            if (preset) setEditRateVal(String(preset.defaultRate));
                          }}
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#07101A] border border-white/15 text-xs text-white"
                        >
                          {AFFILIATE_TIER_PRESETS.map((p) => (
                            <option key={p.tag} value={p.tag} className="bg-[#07101A]">
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-ps-ui text-[10px] uppercase tracking-[0.12em] text-[#94A3B8] mb-1">
                          Chave Pix
                        </label>
                        <input
                          type="text"
                          value={editPixVal}
                          onChange={(e) => setEditPixVal(e.target.value)}
                          placeholder="CPF, e-mail, celular..."
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#07101A] border border-white/15 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-ps-ui text-[10px] uppercase tracking-[0.12em] text-[#94A3B8] mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={editEmailVal}
                          onChange={(e) => setEditEmailVal(e.target.value)}
                          placeholder="email@parceiro.com"
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#07101A] border border-white/15 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-ps-ui text-[10px] uppercase tracking-[0.12em] text-[#94A3B8] mb-1">
                          Observações / WhatsApp
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editNotesVal}
                            onChange={(e) => setEditNotesVal(e.target.value)}
                            placeholder="@insta / telefone"
                            className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#07101A] border border-white/15 text-xs text-white"
                          />
                          <button
                            type="button"
                            disabled={busyId === aff.id}
                            onClick={() => handleSaveAffiliateEdit(aff)}
                            className="min-h-[38px] px-3 rounded-lg bg-[#C9A227] text-[#02050A] font-ps-ui text-xs font-bold shrink-0"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6 Métricas por Parceiro */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 pt-3.5 border-t border-white/[0.07] font-ps-ui text-xs tabular-nums">
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Cliques</span>
                      <span className="text-white font-semibold text-sm">
                        {aff.clicks_count}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Cadastros</span>
                      <span className="text-white font-semibold text-sm">
                        {aff.referred_users_count}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Vendas & Conv.</span>
                      <span className="text-white font-semibold text-sm">
                        {aff.sales_count}{" "}
                        <span className="text-[#94A3B8] font-normal">
                          ({convPct}% · {formatBrl(aff.volume_brl)})
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[11px]">Atividade</span>
                      <span className="text-[#CBD5E1] font-medium text-xs">
                        {lastSaleIso
                          ? `Últ. venda ${new Date(lastSaleIso).toLocaleDateString("pt-BR")}`
                          : `0 vendas (${ageDays}d)`}
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

      {/* 4. Histórico de Comissões por Venda */}
      <section className="p-5 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-white/10 backdrop-blur-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-ps-display font-normal text-2xl text-white">
              Comissões por Venda ({filteredCommissions.length})
            </h3>
            <p className="font-ps-ui text-xs text-[#94A3B8] mt-0.5">
              Cada venda confirmada gera 1 registro idempotente vinculado ao pedido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={commissionSearch}
                onChange={(e) => setCommissionSearch(e.target.value)}
                placeholder="Filtrar por parceiro ou comprador..."
                className="min-h-[36px] pl-8 pr-3 py-1.5 rounded-xl bg-[#040912] border border-white/12 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#C9A227]"
              />
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
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-ps-ui text-xs font-semibold transition-all ${
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
                        <span className="font-semibold text-white block">
                          {c.affiliate_name}
                        </span>
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
