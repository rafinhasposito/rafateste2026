import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { isPaidPurchaseType } from "./MetricsDashboard";

interface Tx {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
  price_brl?: number;
}

interface TransactionsTableProps {
  initialFilter?: string;
  initialSearch?: string;
}

const FALLBACK_PRICE_BY_CREDITS: Record<number, number> = {
  1: 19.9,
  3: 39.9,
  7: 59.9,
  12: 59.9,
};

const fmtBrl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatTxTypeBadge = (type: string, amount: number) => {
  if (amount > 0 && isPaidPurchaseType(type)) {
    return {
      label: "Venda Mercado Pago",
      cls: "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
    };
  }
  if (amount > 0) {
    return {
      label: type === "welcome_bonus" ? "Bônus Boas-vindas" : "Cupom / Admin",
      cls: "bg-[#F5B041]/15 border-[#F5B041]/35 text-[#F5B041]",
    };
  }
  return {
    label: "Uso em Consulta",
    cls: "bg-white/5 border-white/15 text-white/60",
  };
};

const TransactionsTable = ({ initialFilter, initialSearch }: TransactionsTableProps) => {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>(initialFilter || "all");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [mpPaymentIdInput, setMpPaymentIdInput] = useState("");
  const [syncingMp, setSyncingMp] = useState(false);

  useEffect(() => {
    if (initialFilter && ["all", "pago", "gratis", "gastos"].includes(initialFilter)) {
      setTypeFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    const [txRes, profilesRes, pricingRes] = await Promise.all([
      supabase
        .from("credit_transactions")
        .select("id, user_id, amount, type, description, created_at")
        .order("created_at", { ascending: false })
        .limit(800),
      supabase
        .from("profiles")
        .select("user_id, email, full_name, display_name"),
      supabase
        .from("pricing_config")
        .select("key, category, credits, price_brl"),
    ]);

    const profMap = new Map<
      string,
      { email: string; name: string }
    >();
    (profilesRes.data ?? []).forEach((p: any) => {
      profMap.set(p.user_id, {
        email: p.email ?? "—",
        name:
          p.full_name?.trim() ||
          p.display_name?.trim() ||
          (p.email ? p.email.split("@")[0] : "Cliente"),
      });
    });

    const priceByKey = new Map<string, number>();
    const priceByCredits = new Map<number, number>();
    (pricingRes.data ?? [])
      .filter((p: any) => p.category === "package" && p.price_brl != null)
      .forEach((p: any) => {
        priceByKey.set(String(p.key).trim(), Number(p.price_brl));
        priceByCredits.set(Number(p.credits), Number(p.price_brl));
      });

    const enriched: Tx[] = ((txRes.data ?? []) as Tx[]).map((t) => {
      const prof = profMap.get(t.user_id);
      const isPaid = t.amount > 0 && isPaidPurchaseType(t.type);
      let priceBrl = 0;

      if (isPaid) {
        const desc = t.description || "";
        const pkgMatch = desc.match(/Compra de pacote:\s*([a-zA-Z0-9_-]+)/i);
        const pkgKey = pkgMatch?.[1]?.trim();
        if (pkgKey && priceByKey.has(pkgKey)) {
          priceBrl = priceByKey.get(pkgKey)!;
        } else if (priceByCredits.has(t.amount)) {
          priceBrl = priceByCredits.get(t.amount)!;
        } else {
          priceBrl = FALLBACK_PRICE_BY_CREDITS[t.amount] ?? t.amount * 19.9;
        }
      }

      return {
        ...t,
        user_email: prof?.email ?? "—",
        user_name: prof?.name ?? "Cliente",
        price_brl: priceBrl,
      };
    });

    setTxs(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleReconcileMp = async (specificId?: string) => {
    setSyncingMp(true);
    try {
      const cleanId = (specificId ?? mpPaymentIdInput).trim();
      const { data, error } = await supabase.functions.invoke(
        "create-mercadopago-checkout",
        {
          body: {
            action: "admin_sync_payment",
            ...(cleanId ? { payment_id: cleanId } : {}),
          },
        }
      );
      if (error) throw error;

      const newly = Number(data?.newlyProcessed || 0);
      const details = Array.isArray(data?.details) ? data.details : [];

      if (cleanId && details.length > 0) {
        const d = details[0];
        toast.success(`Transação ${d.paymentId}: ${d.outcome} (R$ ${Number(d.amount || 0).toFixed(2)})`);
      } else if (newly > 0) {
        toast.success(
          `${newly} venda(s) aprovada(s) no Mercado Pago foram conciliadas e creditadas!`
        );
      } else {
        toast.info(
          `Verificadas ${data?.checked || 0} transações no Mercado Pago. Todas já estavam conciliadas.`
        );
      }

      setMpPaymentIdInput("");
      await loadTransactions();
    } catch (err: any) {
      toast.error(`Falha ao conciliar com Mercado Pago: ${err?.message || "Erro"}`);
    } finally {
      setSyncingMp(false);
    }
  };

  const counts = useMemo(() => {
    return {
      all: txs.length,
      pago: txs.filter((t) => t.amount > 0 && isPaidPurchaseType(t.type)).length,
      gratis: txs.filter((t) => t.amount > 0 && !isPaidPurchaseType(t.type)).length,
      gastos: txs.filter((t) => t.amount < 0).length,
    };
  }, [txs]);

  const filtered = useMemo(() => {
    return txs.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          (t.user_email || "").toLowerCase().includes(q) ||
          (t.user_name || "").toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (t.type || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (typeFilter === "all") return true;
      if (typeFilter === "pago") return t.amount > 0 && isPaidPurchaseType(t.type);
      if (typeFilter === "gratis") return t.amount > 0 && !isPaidPurchaseType(t.type);
      if (typeFilter === "gastos") return t.amount < 0;
      return true;
    });
  }, [txs, searchQuery, typeFilter]);

  if (loading) return <p className="text-white/50 text-sm">Carregando transações…</p>;

  return (
    <div className="space-y-5">
      {/* Barra de Conciliação Direta com Mercado Pago (ex.: ID 190018604873) */}
      <div className="p-4 sm:p-5 rounded-[24px] bg-[#0A0B10]/90 border border-emerald-500/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center shrink-0 text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-ps-display text-sm sm:text-base font-bold text-white">
              Conciliação Direta com Mercado Pago
            </h3>
            <p className="text-white/50 text-xs">
              Cole o nº da transação do Mercado Pago (ex: <code className="text-emerald-300">190018604873</code>) ou sincronize as últimas vendas aprovadas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            placeholder="Nº da Transação MP (opcional)..."
            value={mpPaymentIdInput}
            onChange={(e) => setMpPaymentIdInput(e.target.value)}
            className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/60 min-w-[220px]"
          />
          <button
            type="button"
            onClick={() => handleReconcileMp()}
            disabled={syncingMp}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#047857] hover:brightness-110 text-white text-xs font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingMp ? "animate-spin" : ""}`} />
            <span>
              {syncingMp
                ? "Verificando no MP..."
                : mpPaymentIdInput.trim()
                ? "Validar Transação ID"
                : "Sincronizar Últimas Vendas"}
            </span>
          </button>
        </div>
      </div>

      {/* Filtros + Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2.5 flex-wrap">
          {[
            { id: "all", label: `Todas (${counts.all})` },
            { id: "pago", label: `Pagos R$ (${counts.pago})` },
            { id: "gratis", label: `Cupons / Bônus (${counts.gratis})` },
            { id: "gastos", label: `Consultas (${counts.gastos})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeFilter(t.id)}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 border ${
                typeFilter === t.id
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-[#0A0B10]/80 border-white/10 text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar cliente, e-mail ou pacote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0B10]/90 border border-white/10 text-white pl-9 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-white/30 transition-all text-xs placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="space-y-2">
        {filtered.map((t) => {
          const badge = formatTxTypeBadge(t.type, t.amount);
          const isPaid = t.amount > 0 && isPaidPurchaseType(t.type);

          return (
            <div
              key={t.id}
              className="border border-white/10 bg-[#0A0B10]/85 rounded-2xl backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-white/45 font-mono text-[11px] w-28 shrink-0">
                  {new Date(t.created_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>

                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{t.user_name}</p>
                  <p className="text-white/45 text-[11px] truncate">{t.user_email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <span
                  className="text-white/45 truncate max-w-[240px] hidden lg:inline"
                  title={t.description || ""}
                >
                  {t.description}
                </span>

                <span
                  className={`text-[10px] uppercase tracking-wider font-bold border px-2.5 py-1 rounded-xl ${badge.cls}`}
                >
                  {badge.label}
                </span>

                {isPaid && t.price_brl ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono font-bold">
                    <CheckCircle2 className="w-3 h-3" />+{fmtBrl(t.price_brl)}
                  </span>
                ) : null}

                <span
                  className={`font-mono font-bold w-14 text-right text-sm ${
                    t.amount > 0 ? "text-[#10b981]" : "text-[#F5B041]"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount} cr
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-white/60 text-sm">
              Nenhuma transação encontrada neste filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
