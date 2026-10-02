import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Tx {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
  user_email?: string;
}

const TransactionsTable = () => {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data: tx } = await supabase
        .from("credit_transactions")
        .select("id, user_id, amount, type, description, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      const { data: profiles } = await supabase.from("profiles").select("user_id, email");
      const emailMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p.email]));
      setTxs(((tx ?? []) as Tx[]).map(t => ({ ...t, user_email: emailMap.get(t.user_id) ?? "—" })));
      setLoading(false);
    })();
  }, []);

  const filtered = txs.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (t.user_email || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (typeFilter === "all") return true;
    if (typeFilter === "pago") return t.amount > 0 && t.type === "purchase";
    if (typeFilter === "gratis") return t.amount > 0 && t.type !== "purchase";
    if (typeFilter === "gastos") return t.amount < 0;
    return true;
  });

  if (loading) return <p className="text-white/50 text-sm">Carregando…</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
        {[
          { id: "all", label: "Todas" },
          { id: "pago", label: "Pagos (R$)" },
          { id: "gratis", label: "Grátis / Admin" },
          { id: "gastos", label: "Desbloqueios" }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTypeFilter(t.id)} 
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border 
              ${typeFilter === t.id 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105" 
                : "bg-black/50 border-white/10 text-white/40 hover:text-white hover:bg-white/5"}
            `}
          >
            {t.label}
          </button>
        ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar email ou transação..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner text-xs placeholder:text-white/20"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        {filtered.map(t => (
          <div key={t.id} className="border border-white/10 bg-white/[0.02] rounded-2xl backdrop-blur-md p-4 flex items-center gap-4 text-xs hover:bg-white/[0.04] transition-colors">
            <span className="text-white/50 w-24 shrink-0">{new Date(t.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
            <span className="text-white truncate flex-1">{t.user_email}</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded-lg">{t.type.replace('cost_', 'custo_')}</span>
            <span className={`font-bold w-12 text-right text-sm ${t.amount > 0 ? "text-[#10b981]" : "text-amber-500"}`}>{t.amount > 0 ? "+" : ""}{t.amount}</span>
            <span className="text-white/30 truncate flex-1 hidden md:block" title={t.description || ""}>{t.description}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-white/50 text-sm text-center py-6">Sem transações.</p>}
      </div>
    </div>
  );
};

export default TransactionsTable;
