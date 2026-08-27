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

  const filtered = txs.filter(t => typeFilter === "all" || t.type === typeFilter);
  const types = Array.from(new Set(txs.map(t => t.type)));

  if (loading) return <p className="text-muted-foreground text-sm">Carregando…</p>;

  return (
    <div>
      <div className="h-scroll mb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        <button onClick={() => setTypeFilter("all")} className={`px-3 py-2 rounded-full text-xs uppercase tracking-widest border whitespace-nowrap ${typeFilter === "all" ? "bg-primary text-background border-primary" : "border-border text-muted-foreground"}`}>Tudo</button>
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-2 rounded-full text-xs uppercase tracking-widest border whitespace-nowrap ${typeFilter === t ? "bg-primary text-background border-primary" : "border-border text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-1.5">
        {filtered.map(t => (
          <div key={t.id} className="glass-panel p-3 flex items-center gap-3 text-xs">
            <span className="text-muted-foreground w-24 shrink-0">{new Date(t.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
            <span className="text-foreground truncate flex-1">{t.user_email}</span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest bg-secondary/40 px-2 py-0.5 rounded">{t.type}</span>
            <span className={`font-bold w-12 text-right ${t.amount > 0 ? "text-emerald-400" : "text-destructive"}`}>{t.amount > 0 ? "+" : ""}{t.amount}</span>
            <span className="text-muted-foreground/70 truncate w-64 hidden md:block">{t.description}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">Sem transações.</p>}
      </div>
    </div>
  );
};

export default TransactionsTable;
