import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Coins,
  Compass,
  Download,
  Plus,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

type AdminTab = "metrics" | "pricing" | "coupons" | "affiliates" | "users" | "transactions";
type PeriodKey = "today" | "7d" | "30d" | "all";
type ChartMetricKey = "revenue" | "signups" | "consultations";
type FeedFilterKey = "paid" | "all" | "bonus" | "spent";

interface MetricsDashboardProps {
  onNavigateTab?: (tab: AdminTab, searchOrFilter?: string) => void;
}

interface RawProfile {
  user_id: string;
  email: string | null;
  display_name: string | null;
  full_name: string | null;
  credits: number | null;
  created_at: string;
}

interface RawConsultation {
  user_id: string;
  origin: string | null;
  intent: string | null;
  goal: number | null;
  mode: string | null;
  created_at: string;
}

interface RawTx {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

interface RawPricing {
  key: string;
  label: string | null;
  category: string;
  credits: number;
  price_brl: number | null;
}

interface EnrichedTx extends RawTx {
  userName: string;
  userEmail: string;
  isPaid: boolean;
  isBonus: boolean;
  isSpend: boolean;
  priceBrl: number;
  packageLabel: string;
}

export const isPaidPurchaseType = (type: string | null | undefined): boolean => {
  const t = (type || "").toLowerCase().trim();
  return t === "compra_mercadopago" || t === "purchase";
};

const FALLBACK_PRICE_BY_CREDITS: Record<number, number> = {
  1: 19.9,
  3: 39.9,
  7: 59.9,
  12: 59.9,
};

const fmtBrl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const getInitials = (name: string, email: string) => {
  const clean = (name && name !== "—" ? name : email || "PS").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

const MetricsDashboard = ({ onNavigateTab }: MetricsDashboardProps) => {
  const [loading, setLoading] = useState(true);
  const [syncingMp, setSyncingMp] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date>(new Date());

  const [period, setPeriod] = useState<PeriodKey>("all");
  const [chartMetric, setChartMetric] = useState<ChartMetricKey>("revenue");
  const [feedFilter, setFeedFilter] = useState<FeedFilterKey>("paid");
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const [profiles, setProfiles] = useState<RawProfile[]>([]);
  const [consultations, setConsultations] = useState<RawConsultation[]>([]);
  const [txs, setTxs] = useState<RawTx[]>([]);
  const [pricing, setPricing] = useState<RawPricing[]>([]);
  const [affiliateStats, setAffiliateStats] = useState<{
    activeCount: number;
    pendingCommissionBrl: number;
    paidCommissionBrl: number;
    referredSalesCount: number;
  }>({
    activeCount: 0,
    pendingCommissionBrl: 0,
    paidCommissionBrl: 0,
    referredSalesCount: 0,
  });

  const loadDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [profilesRes, consultsRes, txRes, pricingRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, email, display_name, full_name, credits, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("consultations")
          .select("user_id, origin, intent, goal, mode, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("credit_transactions")
          .select("id, user_id, amount, type, description, created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
        supabase
          .from("pricing_config")
          .select("key, label, category, credits, price_brl"),
      ]);

      setProfiles((profilesRes.data as RawProfile[]) ?? []);
      setConsultations((consultsRes.data as RawConsultation[]) ?? []);
      setTxs((txRes.data as RawTx[]) ?? []);
      setPricing((pricingRes.data as RawPricing[]) ?? []);

      // Carrega resumo de afiliados sem falhar caso a tabela não esteja disponível
      try {
        const [affRes, commRes] = await Promise.all([
          supabase.from("affiliates").select("id, active"),
          supabase
            .from("affiliate_commissions")
            .select("commission_amount_brl, status"),
        ]);
        const affList = (affRes.data as any[]) ?? [];
        const commList = (commRes.data as any[]) ?? [];
        let pendingBrl = 0;
        let paidBrl = 0;
        commList.forEach((c) => {
          const val = Number(c.commission_amount_brl || 0);
          if (c.status === "paid") paidBrl += val;
          else if (c.status !== "cancelled") pendingBrl += val;
        });
        setAffiliateStats({
          activeCount: affList.filter((a) => a.active).length,
          pendingCommissionBrl: pendingBrl,
          paidCommissionBrl: paidBrl,
          referredSalesCount: commList.length,
        });
      } catch {
        // Ignora silenciosamente
      }

      setLastSyncAt(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSyncMercadoPago = async () => {
    setSyncingMp(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-mercadopago-checkout",
        {
          body: { action: "admin_sync_payment" },
        }
      );
      if (error) throw error;
      const newly = Number(data?.newlyProcessed || 0);
      const checked = Number(data?.checked || 0);
      if (newly > 0) {
        toast.success(
          `${newly} venda(s) aprovada(s) no Mercado Pago foram conciliadas e creditadas agora!`
        );
      } else {
        toast.info(
          `Sincronizado com o Mercado Pago (${checked} transações verificadas). Tudo em dia!`
        );
      }
      await loadDashboardData(true);
    } catch (err: any) {
      toast.error(
        `Não foi possível consultar a API do Mercado Pago: ${err?.message || "Erro"}`
      );
    } finally {
      setSyncingMp(false);
    }
  };

  // Mapeamento de preços de pacotes e perfis
  const { priceByKey, labelByKey, priceByCredits, profileById } = useMemo(() => {
    const pByKey = new Map<string, number>();
    const lByKey = new Map<string, string>();
    const pByCredits = new Map<number, number>();

    pricing
      .filter((p) => p.category === "package" && p.price_brl != null)
      .forEach((p) => {
        const key = String(p.key).trim();
        const price = Number(p.price_brl);
        pByKey.set(key, price);
        lByKey.set(key, p.label || key);
        pByCredits.set(Number(p.credits), price);
      });

    const profMap = new Map<string, RawProfile>();
    profiles.forEach((p) => profMap.set(p.user_id, p));

    return {
      priceByKey: pByKey,
      labelByKey: lByKey,
      priceByCredits: pByCredits,
      profileById: profMap,
    };
  }, [pricing, profiles]);

  // Enriquece todas as transações com nome, e-mail e valor real em R$
  const enrichedTxs: EnrichedTx[] = useMemo(() => {
    return txs.map((t) => {
      const prof = profileById.get(t.user_id);
      const userName =
        prof?.full_name?.trim() ||
        prof?.display_name?.trim() ||
        (prof?.email ? prof.email.split("@")[0] : "Cliente");
      const userEmail = prof?.email || "—";

      const isPaid = t.amount > 0 && isPaidPurchaseType(t.type);
      const isBonus = t.amount > 0 && !isPaidPurchaseType(t.type);
      const isSpend = t.amount < 0;

      let priceBrl = 0;
      let packageLabel = t.description || "Pacote de Créditos";

      if (isPaid) {
        const desc = t.description || "";
        const pkgMatch = desc.match(/Compra de pacote:\s*([a-zA-Z0-9_-]+)/i);
        const pkgKey = pkgMatch?.[1]?.trim();

        if (pkgKey && priceByKey.has(pkgKey)) {
          priceBrl = priceByKey.get(pkgKey)!;
          packageLabel = labelByKey.get(pkgKey) || `Pacote ${pkgKey}`;
        } else if (priceByCredits.has(t.amount)) {
          priceBrl = priceByCredits.get(t.amount)!;
        } else {
          priceBrl = FALLBACK_PRICE_BY_CREDITS[t.amount] ?? t.amount * 19.9;
        }

        if (t.amount === 1) packageLabel = "1 Casa Avulsa (1 crédito)";
        else if (t.amount === 3) packageLabel = "Pacote Expansão (3 créditos)";
        else if (t.amount >= 7) packageLabel = `Mapa Completo (${t.amount} créditos)`;
      }

      return {
        ...t,
        userName,
        userEmail,
        isPaid,
        isBonus,
        isSpend,
        priceBrl,
        packageLabel,
      };
    });
  }, [txs, profileById, priceByKey, labelByKey, priceByCredits]);

  // Filtro temporal
  const periodCutoffIso = useMemo(() => {
    const now = new Date();
    if (period === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.toISOString();
    }
    if (period === "7d") {
      return new Date(Date.now() - 7 * 86400_000).toISOString();
    }
    if (period === "30d") {
      return new Date(Date.now() - 30 * 86400_000).toISOString();
    }
    return "";
  }, [period]);

  const metrics = useMemo(() => {
    const inPeriod = (iso: string) => !periodCutoffIso || iso >= periodCutoffIso;

    const periodProfiles = profiles.filter((p) => inPeriod(p.created_at));
    const periodConsults = consultations.filter((c) => inPeriod(c.created_at));
    const periodTxs = enrichedTxs.filter((t) => inPeriod(t.created_at));

    const paidTxsInPeriod = periodTxs.filter((t) => t.isPaid);
    const allPaidTxs = enrichedTxs.filter((t) => t.isPaid);

    const revenueBrl = paidTxsInPeriod.reduce((acc, t) => acc + t.priceBrl, 0);
    const totalAllTimeRevenueBrl = allPaidTxs.reduce((acc, t) => acc + t.priceBrl, 0);

    const salesCount = paidTxsInPeriod.length;
    const avgTicketBrl = salesCount > 0 ? revenueBrl / salesCount : 0;

    const uniqueBuyersInPeriod = new Set(paidTxsInPeriod.map((t) => t.user_id)).size;
    const uniqueBuyersAllTime = new Set(allPaidTxs.map((t) => t.user_id)).size;

    const creditsSold = paidTxsInPeriod.reduce((acc, t) => acc + t.amount, 0);
    const creditsBonus = periodTxs
      .filter((t) => t.isBonus)
      .reduce((acc, t) => acc + t.amount, 0);
    const creditsSpent = periodTxs
      .filter((t) => t.isSpend)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const walletBalanceTotal = profiles.reduce(
      (acc, p) => acc + Math.max(0, Number(p.credits || 0)),
      0
    );

    const activeConsultUserIdsAllTime = new Set(consultations.map((c) => c.user_id));
    const activeConsultUserIdsPeriod = new Set(periodConsults.map((c) => c.user_id));

    const byPath = { city: 0, house: 0, intent: 0 };
    const byMode = { futuro: 0, presente: 0, passado: 0 };
    periodConsults.forEach((c) => {
      if (c.origin) byPath.city++;
      else if (c.intent) byPath.intent++;
      else byPath.house++;

      const m = (c.mode || "futuro").toLowerCase();
      if (m === "passado") byMode.passado++;
      else if (m === "presente") byMode.presente++;
      else byMode.futuro++;
    });

    // Mix de pacotes vendidos no período
    const packageMix = {
      single: { label: "1 Casa Avulsa", price: "R$ 19,90", count: 0, revenue: 0, color: "#10B981" },
      expansao: { label: "Pacote Expansão", price: "R$ 39,90", count: 0, revenue: 0, color: "#F5B041" },
      full: { label: "Mapa Completo", price: "R$ 59,90", count: 0, revenue: 0, color: "#8B5CF6" },
    };
    paidTxsInPeriod.forEach((t) => {
      if (t.amount === 1) {
        packageMix.single.count++;
        packageMix.single.revenue += t.priceBrl;
      } else if (t.amount === 3) {
        packageMix.expansao.count++;
        packageMix.expansao.revenue += t.priceBrl;
      } else {
        packageMix.full.count++;
        packageMix.full.revenue += t.priceBrl;
      }
    });

    // Série diária dos últimos 14 dias (para o gráfico de pílulas estilo Donezo)
    const dailySeries: Array<{
      dateKey: string;
      dayShort: string;
      dayNum: string;
      fullLabel: string;
      revenue: number;
      salesCount: number;
      signups: number;
      consultations: number;
    }> = [];

    const weekDaysPt = ["D", "S", "T", "Q", "Q", "S", "S"];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000);
      const dateKey = d.toISOString().slice(0, 10);
      const dayShort = weekDaysPt[d.getDay()];
      const dayNum = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const fullLabel = d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      });

      const dayPaid = allPaidTxs.filter((t) => t.created_at.slice(0, 10) === dateKey);
      const dayRevenue = dayPaid.reduce((acc, t) => acc + t.priceBrl, 0);
      const daySignups = profiles.filter((p) => p.created_at.slice(0, 10) === dateKey).length;
      const dayConsults = consultations.filter((c) => c.created_at.slice(0, 10) === dateKey).length;

      dailySeries.push({
        dateKey,
        dayShort,
        dayNum,
        fullLabel,
        revenue: dayRevenue,
        salesCount: dayPaid.length,
        signups: daySignups,
        consultations: dayConsults,
      });
    }

    // Funil geral da plataforma
    const totalUsersAllTime = profiles.length;
    const activatedUsersCount = activeConsultUserIdsAllTime.size;
    const activationRatePct =
      totalUsersAllTime > 0 ? Math.round((activatedUsersCount / totalUsersAllTime) * 100) : 0;
    const buyerConversionPct =
      totalUsersAllTime > 0
        ? Number(((uniqueBuyersAllTime / totalUsersAllTime) * 100).toFixed(1))
        : 0;

    return {
      revenueBrl,
      totalAllTimeRevenueBrl,
      salesCount,
      avgTicketBrl,
      uniqueBuyersInPeriod,
      uniqueBuyersAllTime,
      creditsSold,
      creditsBonus,
      creditsSpent,
      walletBalanceTotal,
      totalUsersAllTime,
      newUsersInPeriod: periodProfiles.length,
      activeUsersAllTime: activatedUsersCount,
      activeUsersInPeriod: activeConsultUserIdsPeriod.size,
      consultsInPeriod: periodConsults.length,
      consultsAllTime: consultations.length,
      byPath,
      byMode,
      packageMix,
      dailySeries,
      activationRatePct,
      buyerConversionPct,
      paidTxsInPeriod,
      periodTxs,
    };
  }, [profiles, consultations, enrichedTxs, periodCutoffIso]);

  // Lista filtrada do feed "Últimas Vendas & Movimentações"
  const feedItems = useMemo(() => {
    const base = enrichedTxs.filter((t) => {
      if (feedFilter === "paid") return t.isPaid;
      if (feedFilter === "bonus") return t.isBonus;
      if (feedFilter === "spent") return t.isSpend;
      return true;
    });
    return base.slice(0, 8);
  }, [enrichedTxs, feedFilter]);

  const handleExportSalesCsv = () => {
    const paidRows = enrichedTxs.filter((t) => t.isPaid);
    const rowsToExport = paidRows.length > 0 ? paidRows : enrichedTxs;
    const headers = [
      "Data_Hora",
      "Cliente",
      "Email",
      "Tipo",
      "Pacote_Descricao",
      "Creditos",
      "Valor_BRL",
      "ID_Transacao",
    ];
    const csvLines = [
      headers.join(";"),
      ...rowsToExport.map((r) =>
        [
          new Date(r.created_at).toLocaleString("pt-BR"),
          `"${(r.userName || "").replace(/"/g, '""')}"`,
          `"${(r.userEmail || "").replace(/"/g, '""')}"`,
          r.type,
          `"${(r.description || r.packageLabel || "").replace(/"/g, '""')}"`,
          r.amount,
          r.priceBrl.toFixed(2).replace(".", ","),
          r.id,
        ].join(";")
      ),
    ];
    const blob = new Blob(["\uFEFF" + csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protocolo-solar-transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório CSV exportado com sucesso!");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 rounded-[28px] bg-white/[0.03] border border-white/10"
          />
        ))}
        <div className="lg:col-span-2 h-80 rounded-[28px] bg-white/[0.03] border border-white/10" />
        <div className="h-80 rounded-[28px] bg-white/[0.03] border border-white/10" />
        <div className="h-80 rounded-[28px] bg-white/[0.03] border border-white/10" />
      </div>
    );
  }

  // Dados da série de pílulas (14 dias)
  const chartValues = metrics.dailySeries.map((d) =>
    chartMetric === "revenue"
      ? d.revenue
      : chartMetric === "signups"
      ? d.signups
      : d.consultations
  );
  const maxChartValue = Math.max(...chartValues, 1);
  const peakIdx = chartValues.reduce(
    (bestIdx, val, idx, arr) => (val >= arr[bestIdx] ? idx : bestIdx),
    chartValues.length - 1
  );
  const activeBarIdx = selectedDayIdx !== null ? selectedDayIdx : peakIdx;

  // Cálculo do gauge semicircular (Funil)
  const totalFunnel = Math.max(metrics.totalUsersAllTime, 1);
  const buyersRatio = Math.min(1, metrics.uniqueBuyersAllTime / totalFunnel);
  const consultRatio = Math.min(1, metrics.activeUsersAllTime / totalFunnel);
  const arcCircumference = Math.PI * 80; // r = 80

  const periodLabels: Record<PeriodKey, string> = {
    today: "Hoje",
    "7d": "7 Dias",
    "30d": "30 Dias",
    all: "Tudo",
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER EXECUTIVO (Título + Filtro de Período + Ações Rápidas Estilo Donezo) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-ps-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Dashboard
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ao Vivo
            </span>
          </div>
          <p className="text-white/50 text-xs sm:text-sm font-ps-ui mt-1">
            Planeje, acompanhe vendas reais do Mercado Pago, consultas solares e parceiros com clareza.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seletor de Período */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#0A0B10]/90 border border-white/10 backdrop-blur-xl">
            {(["today", "7d", "30d", "all"] as PeriodKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                  period === key
                    ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {periodLabels[key]}
              </button>
            ))}
          </div>

          {/* Botão Sincronizar Vendas MP */}
          <button
            type="button"
            onClick={handleSyncMercadoPago}
            disabled={syncingMp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#047857] hover:brightness-110 text-white text-xs font-bold tracking-wide shadow-[0_10px_28px_rgba(16,185,129,0.28)] transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingMp ? "animate-spin" : ""}`} />
            <span>{syncingMp ? "Sincronizando MP..." : "Sincronizar Vendas MP"}</span>
          </button>

          {/* + Novo Cupom */}
          <button
            type="button"
            onClick={() => onNavigateTab?.("coupons")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F5B041]/15 hover:bg-[#F5B041]/25 border border-[#F5B041]/40 text-[#FFF3D1] text-xs font-bold tracking-wide transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#F5B041]" />
            <span>Novo Voucher</span>
          </button>

          {/* Exportar CSV */}
          <button
            type="button"
            onClick={handleExportSalesCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* ── LINHA 1: 4 HERO KPI CARDS (Padrão Donezo: 1º Card em Gradiente Destaque + 3 Cards Obsidian Glass) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — DESTAQUE PRINCIPAL: Receita Aprovada (R$) */}
        <div
          onClick={() => onNavigateTab?.("transactions", "pago")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigateTab?.("transactions", "pago")}
          className="group relative overflow-hidden rounded-[28px] p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-[0_20px_50px_rgba(16,185,129,0.22)] border border-emerald-400/40"
          style={{
            background:
              "linear-gradient(135deg, #064E3B 0%, #047857 52%, #065F46 100%)",
          }}
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#F5B041]/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="text-white/90 text-xs font-semibold tracking-wide">
              Receita Aprovada ({periodLabels[period]})
            </span>
            <span className="w-8 h-8 rounded-full bg-white text-[#064E3B] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12 shadow-md">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>

          <div className="relative z-10 font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {fmtBrl(metrics.revenueBrl)}
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/25 border border-white/20 text-emerald-200 font-mono font-bold">
              <TrendingUp className="w-3 h-3" />
              {metrics.salesCount} {metrics.salesCount === 1 ? "venda" : "vendas"}
            </span>
            <span className="text-emerald-100/80 truncate">
              Ticket médio: {fmtBrl(metrics.avgTicketBrl)}
            </span>
          </div>
        </div>

        {/* Card 2 — Compradores & Créditos Vendidos */}
        <div
          onClick={() => onNavigateTab?.("transactions", "pago")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigateTab?.("transactions", "pago")}
          className="group relative overflow-hidden rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 hover:border-[#F5B041]/40 backdrop-blur-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-xs font-medium">
              Compradores & Créditos
            </span>
            <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] text-white/80 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-[#F5B041]/50 group-hover:text-[#F5B041]">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="font-ps-display text-4xl font-bold text-white tracking-tight">
              {metrics.uniqueBuyersInPeriod}
            </span>
            <span className="text-xs text-white/45 font-mono">
              ({metrics.creditsSold} cr vendidos)
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F5B041]/15 border border-[#F5B041]/30 text-[#F5B041] font-mono font-bold">
              {metrics.buyerConversionPct}% conv.
            </span>
            <span className="text-white/45 truncate">
              +{metrics.creditsBonus} cr em cupons/bônus
            </span>
          </div>
        </div>

        {/* Card 3 — Cadastros & Usuários Ativos */}
        <div
          onClick={() => onNavigateTab?.("users")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigateTab?.("users")}
          className="group relative overflow-hidden rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 hover:border-[#10B981]/40 backdrop-blur-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-xs font-medium">
              Cadastros na Plataforma
            </span>
            <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] text-white/80 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-[#10B981]/50 group-hover:text-[#10B981]">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="font-ps-display text-4xl font-bold text-white tracking-tight">
              {period === "all" ? metrics.totalUsersAllTime : metrics.newUsersInPeriod}
            </span>
            {period !== "all" && (
              <span className="text-xs text-white/45 font-mono">
                de {metrics.totalUsersAllTime} total
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
              {metrics.activeUsersAllTime} ativos
            </span>
            <span className="text-white/45 truncate">
              {metrics.activationRatePct}% já consultaram
            </span>
          </div>
        </div>

        {/* Card 4 — Consultas Solares Realizadas */}
        <div
          onClick={() => onNavigateTab?.("transactions", "gastos")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigateTab?.("transactions", "gastos")}
          className="group relative overflow-hidden rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 hover:border-[#F5B041]/40 backdrop-blur-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-xs font-medium">
              Consultas Solares
            </span>
            <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] text-white/80 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-[#F5B041]/50 group-hover:text-[#F5B041]">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="font-ps-display text-4xl font-bold text-white tracking-tight">
              {metrics.consultsInPeriod}
            </span>
            <span className="text-xs text-white/45 font-mono">
              ({metrics.creditsSpent} cr usados)
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-white/60 truncate">
              Cidade <strong className="text-white">{metrics.byPath.city}</strong> · Casa{" "}
              <strong className="text-white">{metrics.byPath.house}</strong> · Intenção{" "}
              <strong className="text-white">{metrics.byPath.intent}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── LINHA 2: BENTO GRID ASSIMÉTRICO (Gráfico de Pílulas 14d + Pulso de Afiliados + Mix de Pacotes) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bloco 2.1 (Cols 1-6): Análise Diária em Pílulas Verticais (Estilo Donezo Project Analytics) */}
        <div className="lg:col-span-6 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-ps-display text-lg font-bold text-white">
                Análise Diária (Últimos 14 Dias)
              </h3>
              <p className="text-white/45 text-xs">
                Toque em um dia para inspecionar • Barras listradas indicam dias sem registro
              </p>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-black/60 border border-white/10 self-start">
              {(
                [
                  { id: "revenue", label: "Receita (R$)" },
                  { id: "signups", label: "Cadastros" },
                  { id: "consultations", label: "Consultas" },
                ] as Array<{ id: ChartMetricKey; label: string }>
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setChartMetric(tab.id);
                    setSelectedDayIdx(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    chartMetric === tab.id
                      ? "bg-white text-black shadow"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gráfico de Pílulas Verticais Estilo Donezo */}
          <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 sm:gap-2.5 items-end h-48 pt-8 pb-1 px-1">
            {metrics.dailySeries.map((day, idx) => {
              const rawVal =
                chartMetric === "revenue"
                  ? day.revenue
                  : chartMetric === "signups"
                  ? day.signups
                  : day.consultations;
              const isZero = rawVal <= 0;
              const isSelected = idx === activeBarIdx;
              const heightPct = isZero
                ? Math.min(68, 34 + ((idx * 11) % 28))
                : Math.max(26, Math.round((rawVal / maxChartValue) * 100));

              const formattedBadge =
                chartMetric === "revenue"
                  ? rawVal >= 100
                    ? `R$${Math.round(rawVal)}`
                    : `R$${rawVal.toFixed(0)}`
                  : String(rawVal);

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  title={`${day.fullLabel}: ${
                    chartMetric === "revenue" ? fmtBrl(day.revenue) : rawVal
                  }`}
                  className="group flex flex-col items-center justify-end h-full focus:outline-none"
                >
                  <div className="relative w-full flex-1 flex items-end justify-center">
                    {/* Pílula */}
                    <div
                      className="relative w-full max-w-[30px] rounded-full transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        ...(isZero
                          ? {
                              backgroundImage:
                                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.13) 0px, rgba(255,255,255,0.13) 3px, transparent 3px, transparent 7px)",
                              border: "1px solid rgba(255,255,255,0.10)",
                            }
                          : isSelected
                          ? {
                              background:
                                "linear-gradient(180deg, #34D399 0%, #059669 60%, #064E3B 100%)",
                              boxShadow: "0 0 24px rgba(16,185,129,0.45)",
                              border: "1px solid rgba(167,243,208,0.6)",
                            }
                          : {
                              background:
                                "linear-gradient(180deg, rgba(16,185,129,0.55) 0%, rgba(5,150,105,0.35) 100%)",
                              border: "1px solid rgba(16,185,129,0.35)",
                            }),
                      }}
                    >
                      {/* Badge Flutuante no topo da pílula ativa (Estilo Donezo 74%) */}
                      {isSelected && !isZero && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-[#050507] font-mono text-[9px] font-bold whitespace-nowrap shadow-lg">
                          {formattedBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`mt-2 text-[10px] font-mono ${
                      isSelected ? "text-emerald-300 font-bold" : "text-white/40"
                    }`}
                  >
                    {day.dayShort}
                  </span>
                  <span className="text-[8px] font-mono text-white/25 hidden sm:block">
                    {day.dayNum.slice(0, 2)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rodapé do dia selecionado */}
          {metrics.dailySeries[activeBarIdx] && (
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
              <span>
                Dia selecionado:{" "}
                <strong className="text-white">
                  {metrics.dailySeries[activeBarIdx].fullLabel}
                </strong>
              </span>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="text-emerald-300">
                  {fmtBrl(metrics.dailySeries[activeBarIdx].revenue)} (
                  {metrics.dailySeries[activeBarIdx].salesCount} vendas)
                </span>
                <span className="text-white/70">
                  {metrics.dailySeries[activeBarIdx].signups} cadastros
                </span>
                <span className="text-[#F5B041]">
                  {metrics.dailySeries[activeBarIdx].consultations} consultas
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bloco 2.2 (Cols 7-9): Pulso de Afiliados & Cupons (Estilo Donezo Reminders Card) */}
        <div className="lg:col-span-3 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5B041]">
                Parceiros & Cupons
              </span>
              <Award className="w-4 h-4 text-[#F5B041]" />
            </div>

            <h3 className="font-ps-display text-2xl font-bold text-white leading-snug mb-1">
              {fmtBrl(affiliateStats.pendingCommissionBrl)}
            </h3>
            <p className="text-white/45 text-xs mb-5">
              Comissões pendentes de repasse Pix ({affiliateStats.referredSalesCount}{" "}
              vendas indicadas)
            </p>

            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="text-white/60">Afiliados ativos</span>
                <span className="font-mono font-bold text-white">
                  {affiliateStats.activeCount} parceiros
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="text-white/60">Comissões já pagas</span>
                <span className="font-mono font-bold text-emerald-300">
                  {fmtBrl(affiliateStats.paidCommissionBrl)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="text-white/60">Créditos via Cupons</span>
                <span className="font-mono font-bold text-[#F5B041]">
                  +{metrics.creditsBonus} cr
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab?.("affiliates")}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#065F46] to-[#047857] hover:brightness-110 border border-emerald-400/30 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(16,185,129,0.22)] transition-all active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>Gerenciar Afiliados</span>
          </button>
        </div>

        {/* Bloco 2.3 (Cols 10-12): Mix de Pacotes & Ciclos (Estilo Donezo Project List Card) */}
        <div className="lg:col-span-3 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-ps-display text-lg font-bold text-white">
                Mix de Pacotes
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab?.("pricing")}
                className="px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 text-[10px] font-bold text-white/80 transition-colors"
              >
                Preços ↗
              </button>
            </div>

            <div className="space-y-3">
              {[
                metrics.packageMix.single,
                metrics.packageMix.expansao,
                metrics.packageMix.full,
              ].map((pkg, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${pkg.color}18`,
                        borderColor: `${pkg.color}45`,
                        color: pkg.color,
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold truncate">
                        {pkg.label}
                      </p>
                      <p className="text-white/40 text-[10px]">
                        {pkg.price} • {pkg.count}{" "}
                        {pkg.count === 1 ? "venda" : "vendas"}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 shrink-0">
                    {fmtBrl(pkg.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini distribuição por tempo (Futuro / Presente / Passado) */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">
              Consultas por Tempo
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="block font-ps-display text-sm font-bold text-[#F5B041]">
                  {metrics.byMode.futuro}
                </span>
                <span className="text-[9px] text-white/45 uppercase">Futuro</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="block font-ps-display text-sm font-bold text-emerald-400">
                  {metrics.byMode.presente}
                </span>
                <span className="text-[9px] text-white/45 uppercase">Presente</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="block font-ps-display text-sm font-bold text-slate-300">
                  {metrics.byMode.passado}
                </span>
                <span className="text-[9px] text-white/45 uppercase">Passado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LINHA 3: BENTO GRID INFERIOR (Últimas Vendas & Movimentações + Funil Semicircular + Radar de Créditos) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bloco 3.1 (Cols 1-6): Últimas Vendas & Movimentações (Estilo Donezo Team Collaboration) */}
        <div className="lg:col-span-6 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-ps-display text-lg font-bold text-white">
                  Últimas Vendas & Movimentações
                </h3>
                <p className="text-white/45 text-xs">
                  Compras via Mercado Pago (`compra_mercadopago`), cupons e uso de créditos
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigateTab?.("transactions", feedFilter === "paid" ? "pago" : "all")
                }
                className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-white self-start transition-colors"
              >
                Ver Todas ↗
              </button>
            </div>

            {/* Pílulas de filtro do Feed */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(
                [
                  { id: "paid", label: `Vendas Pagas (${enrichedTxs.filter((t) => t.isPaid).length})` },
                  { id: "all", label: "Todas" },
                  { id: "bonus", label: "Cupons & Bônus" },
                  { id: "spent", label: "Consultas (-1 cr)" },
                ] as Array<{ id: FeedFilterKey; label: string }>
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFeedFilter(f.id)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    feedFilter === f.id
                      ? "bg-white text-black border-white"
                      : "bg-black/40 border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Lista de clientes / transações */}
            {feedItems.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                <p className="text-white/60 text-sm font-medium mb-1">
                  Nenhuma movimentação encontrada neste filtro.
                </p>
                <p className="text-white/40 text-xs mb-4">
                  Se uma venda acabou de ser aprovada no Mercado Pago, clique em{" "}
                  <strong className="text-white">Sincronizar Vendas MP</strong> para conciliar imediatamente.
                </p>
                <button
                  type="button"
                  onClick={handleSyncMercadoPago}
                  disabled={syncingMp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingMp ? "animate-spin" : ""}`} />
                  <span>Conciliar Vendas com Mercado Pago</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {feedItems.map((item) => {
                  const initials = getInitials(item.userName, item.userEmail);
                  const dateLabel = new Date(item.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-ps-display text-xs font-bold shrink-0 border ${
                            item.isPaid
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                              : item.isBonus
                              ? "bg-[#F5B041]/20 border-[#F5B041]/40 text-[#F5B041]"
                              : "bg-white/10 border-white/15 text-white/75"
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-xs sm:text-sm font-bold truncate">
                              {item.userName}
                            </p>
                            <span className="text-white/35 text-[10px] font-mono shrink-0">
                              {dateLabel}
                            </span>
                          </div>
                          <p className="text-white/45 text-[11px] truncate">
                            {item.userEmail} •{" "}
                            <span className="text-white/65">{item.packageLabel}</span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {item.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />+{fmtBrl(item.priceBrl)}
                          </span>
                        ) : item.isBonus ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5B041]/15 border border-[#F5B041]/35 text-[#F5B041] font-mono text-[11px] font-bold">
                            +{item.amount} cr
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-white/60 font-mono text-[11px] font-bold">
                            {item.amount} cr
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bloco 3.2 (Cols 7-9): Progresso do Funil (Arco Semicircular SVG — Estilo Donezo Project Progress 41%) */}
        <div className="lg:col-span-3 rounded-[28px] p-6 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div>
            <h3 className="font-ps-display text-lg font-bold text-white mb-1">
              Progresso do Funil
            </h3>
            <p className="text-white/45 text-xs mb-4">
              Conversão de cadastros em consultas e compras
            </p>
          </div>

          {/* Semicircle SVG Gauge */}
          <div className="relative flex flex-col items-center justify-center my-2">
            <svg viewBox="0 0 200 115" className="w-full max-w-[230px] overflow-visible">
              <defs>
                <pattern
                  id="donezoHatch"
                  width="6"
                  height="6"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="6"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="2.5"
                  />
                </pattern>
              </defs>

              {/* Trilha base listrada (Cadastros totais) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#donezoHatch)"
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Arco de Usuários que Consultaram */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#047857"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${consultRatio * arcCircumference} ${arcCircumference}`}
              />

              {/* Arco de Compradores Pagos */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#34D399"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${buyersRatio * arcCircumference} ${arcCircumference}`}
              />
            </svg>

            <div className=" -mt-12 text-center">
              <span className="font-ps-display text-4xl font-bold text-white">
                {metrics.activationRatePct}%
              </span>
              <span className="block text-[11px] text-white/50">
                Usuários Ativados
              </span>
            </div>
          </div>

          {/* Legenda de 3 pontos (Estilo Donezo) */}
          <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/70">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                Compradores (R$)
              </span>
              <span className="font-mono font-bold text-white">
                {metrics.uniqueBuyersAllTime} ({metrics.buyerConversionPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/70">
                <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
                Já Consultaram
              </span>
              <span className="font-mono font-bold text-white">
                {metrics.activeUsersAllTime} ({metrics.activationRatePct}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/70">
                <span className="w-2.5 h-2.5 rounded-full border border-white/30 bg-white/10" />
                Total de Cadastros
              </span>
              <span className="font-mono font-bold text-white">
                {metrics.totalUsersAllTime}
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 3.3 (Cols 10-12): Balanço de Créditos & Radar (Estilo Donezo Time Tracker Dark Wave Card) */}
        <div
          className="lg:col-span-3 relative overflow-hidden rounded-[28px] p-6 border border-emerald-500/30 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
          style={{
            background:
              "radial-gradient(circle at 85% 20%, rgba(16,185,129,0.28) 0%, rgba(6,78,59,0.45) 42%, #05080B 100%)",
          }}
        >
          {/* Ondas decorativas sutis */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 100% 100%, transparent 0, transparent 14px, rgba(52,211,153,0.16) 15px, transparent 16px)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-200/90">
                Tesouraria de Créditos
              </span>
              <Coins className="w-4 h-4 text-[#F5B041]" />
            </div>

            <div className="text-center my-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 block mb-1">
                Saldo nas Carteiras
              </span>
              <span className="font-mono text-4xl font-bold text-white tracking-wider">
                {metrics.walletBalanceTotal} cr
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-center">
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="block font-mono text-sm font-bold text-emerald-300">
                  +{metrics.creditsSold}
                </span>
                <span className="text-[9px] text-white/45 uppercase">
                  Vendidos
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="block font-mono text-sm font-bold text-[#F5B041]">
                  -{metrics.creditsSpent}
                </span>
                <span className="text-[9px] text-white/45 uppercase">
                  Consumidos
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2 pt-3 border-t border-white/10">
            <span className="text-[10px] font-mono text-white/50">
              Sync:{" "}
              {lastSyncAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadDashboardData()}
                title="Atualizar dados do banco"
                className="w-9 h-9 rounded-full bg-white text-[#050507] hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg transition-transform"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab?.("transactions")}
                title="Abrir Transações e Conciliação"
                className="w-9 h-9 rounded-full bg-[#F5B041] text-[#050507] hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg transition-transform"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
