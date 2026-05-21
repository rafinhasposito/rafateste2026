import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Minus, Shield, ShieldOff } from "lucide-react";

interface Row {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  credits: number;
  created_at: string;
  is_admin: boolean;
}

const UsersTable = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, email, display_name, credits, created_at")
      .order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").eq("role", "admin");
    const adminIds = new Set((roles ?? []).map(r => r.user_id));
    setRows(((profiles ?? []) as any).map((p: any) => ({ ...p, is_admin: adminIds.has(p.user_id) })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const adjustCredits = async (row: Row, delta: number) => {
    setBusy(row.user_id);
    const newCredits = Math.max(0, row.credits + delta);
    const { error } = await supabase.from("profiles").update({ credits: newCredits }).eq("user_id", row.user_id);
    if (!error) {
      await supabase.from("credit_transactions").insert({
        user_id: row.user_id,
        amount: delta,
        type: delta > 0 ? "admin_grant" : "admin_deduct",
        description: `Ajuste manual via painel admin (${delta > 0 ? "+" : ""}${delta})`,
      });
      toast.success(`Créditos: ${row.credits} → ${newCredits}`);
      load();
    } else toast.error(error.message);
    setBusy(null);
  };

  const toggleAdmin = async (row: Row) => {
    setBusy(row.user_id);
    if (row.is_admin) {
      await supabase.from("user_roles").delete().eq("user_id", row.user_id).eq("role", "admin");
      toast.success("Removido como admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: row.user_id, role: "admin" });
      toast.success("Promovido a admin");
    }
    setBusy(null);
    load();
  };

  const filtered = rows.filter(r =>
    !filter ||
    r.email?.toLowerCase().includes(filter.toLowerCase()) ||
    r.display_name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground text-sm">Carregando usuários…</p>;

  return (
    <div>
      <input
        placeholder="Buscar por email ou nome…" value={filter} onChange={e => setFilter(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-background/40 border border-border text-foreground text-sm mb-4"
      />
      <div className="space-y-2">
        {filtered.map(row => (
          <div key={row.id} className="glass-panel p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-foreground font-medium text-sm truncate">{row.display_name || "—"}</p>
                {row.is_admin && <span className="text-[9px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded">Admin</span>}
              </div>
              <p className="text-muted-foreground text-xs truncate">{row.email}</p>
              <p className="text-muted-foreground/50 text-[10px]">Cadastro: {new Date(row.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5">
              <span className="text-primary font-bold text-lg">{row.credits}</span>
              <span className="text-muted-foreground text-[10px] uppercase">cr</span>
            </div>
            <button onClick={() => adjustCredits(row, 1)} disabled={busy === row.user_id}
              className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-30" title="+1 crédito">
              <Plus className="w-4 h-4 text-emerald-400" />
            </button>
            <button onClick={() => adjustCredits(row, -1)} disabled={busy === row.user_id || row.credits <= 0}
              className="p-2 rounded-lg border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 disabled:opacity-30" title="-1 crédito">
              <Minus className="w-4 h-4 text-destructive" />
            </button>
            <button onClick={() => toggleAdmin(row)} disabled={busy === row.user_id}
              className="p-2 rounded-lg border border-border hover:border-primary/40 disabled:opacity-30"
              title={row.is_admin ? "Remover admin" : "Tornar admin"}>
              {row.is_admin ? <ShieldOff className="w-4 h-4 text-muted-foreground" /> : <Shield className="w-4 h-4 text-primary" />}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Nenhum usuário encontrado.</p>}
      </div>
    </div>
  );
};

export default UsersTable;
