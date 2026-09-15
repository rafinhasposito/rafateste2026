import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, ShoppingCart, DollarSign, Coins, Search, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Metrics {
  totalUsers: number;
  newLast7: number;
  newLast30: number;
  activeUsers: number;
  buyers: number;
  revenueBrl: number;
  creditsSold: number;
  creditsSpent: number;
  consultations: number;
  byType: { city: number; house: number; intent: number };
  signupSeries: { date: string; count: number }[];
  topBuyers: { name: string; email: string; credits: number }[];
  topSpenders: { name: string; email: string; spent: number }[];
}

const Card = ({ icon: Icon, label, value, hint, accent = "primary" }: { icon: any; label: string; value: string | number; hint?: string; accent?: string }) => (
  <div className="glass-panel p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 text-${accent}`} />
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
    <p className="font-ps-display text-2xl text-foreground font-bold leading-none">{value}</p>
    {hint && <p className="text-muted-foreground/60 text-[10px] mt-1.5">{hint}</p>}
  </div>
);

const MetricsDashboard = () => {
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    (async () => {
      const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();
      const since30 = new Date(Date.now() - 30 * 86400_000).toISOString();

      const [profilesRes, consultsRes, txRes, pricingRes] = await Promise.all([
        supabase.from("profiles").select("user_id, email, display_name, full_name, created_at"),
        supabase.from("consultations").select("user_id, origin, intent, goal, created_at"),
        supabase.from("credit_transactions").select("user_id, amount, type"),
        supabase.from("pricing_config").select("key, credits, price_brl"),
      ]);

      const profiles = profilesRes.data ?? [];
      const consults = consultsRes.data ?? [];
      const txs = txRes.data ?? [];
      const pricing = pricingRes.data ?? [];

      const totalUsers = profiles.length;
      const newLast7 = profiles.filter(p => p.created_at >= since7).length;
      const newLast30 = profiles.filter(p => p.created_at >= since30).length;

      const activeIds = new Set(consults.map(c => c.user_id));
      const buyerIds = new Set(txs.filter(t => t.type === "purchase").map(t => t.user_id));

      // Revenue: sum each purchase amount × matching pricing price/credits
      const priceByCredits = new Map<number, number>();
      pricing.forEach(p => priceByCredits.set(Number(p.credits), Number(p.price_brl)));
      let revenueBrl = 0;
      let creditsSold = 0;
      let creditsSpent = 0;
      const buyerCredits = new Map<string, number>();
      const spenderCredits = new Map<string, number>();
      txs.forEach(t => {
        if (t.type === "purchase") {
          creditsSold += t.amount;
          const price = priceByCredits.get(t.amount) ?? 0;
          revenueBrl += price;
          buyerCredits.set(t.user_id, (buyerCredits.get(t.user_id) ?? 0) + t.amount);
        } else if (t.amount < 0) {
          creditsSpent += Math.abs(t.amount);
          spenderCredits.set(t.user_id, (spenderCredits.get(t.user_id) ?? 0) + Math.abs(t.amount));
        }
      });

      const byType = { city: 0, house: 0, intent: 0 };
      consults.forEach(c => {
        if (c.origin) byType.city++;
        else if (c.intent) byType.intent++;
        else byType.house++;
      });

      // Signup series — last 30 days
      const days: { date: string; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400_000);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        days.push({ date: label, count: profiles.filter(p => p.created_at.slice(0, 10) === key).length });
      }

      const profileById = new Map(profiles.map(p => [p.user_id, p]));
      const topBuyers = [...buyerCredits.entries()]
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([uid, c]) => ({ name: profileById.get(uid)?.full_name || profileById.get(uid)?.display_name || "—", email: profileById.get(uid)?.email || "", credits: c }));
      const topSpenders = [...spenderCredits.entries()]
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([uid, c]) => ({ name: profileById.get(uid)?.full_name || profileById.get(uid)?.display_name || "—", email: profileById.get(uid)?.email || "", spent: c }));

      setM({
        totalUsers, newLast7, newLast30,
        activeUsers: activeIds.size,
        buyers: buyerIds.size,
        revenueBrl, creditsSold, creditsSpent,
        consultations: consults.length,
        byType,
        signupSeries: days,
        topBuyers, topSpenders,
      });
    })();
  }, []);

  if (!m) return <p className="text-muted-foreground text-sm">Carregando métricas…</p>;

  const fmtBrl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card icon={Users} label="Cadastros" value={m.totalUsers} hint="Total na plataforma" />
        <Card icon={UserPlus} label="Últimos 7 dias" value={m.newLast7} hint={`${m.newLast30} nos últimos 30`} />
        <Card icon={Activity} label="Ativos" value={m.activeUsers} hint="Pelo menos 1 consulta" />
        <Card icon={ShoppingCart} label="Compradores" value={m.buyers} hint="Pelo menos 1 compra" />
        <Card icon={DollarSign} label="Receita Total" value={fmtBrl(m.revenueBrl)} hint={m.revenueBrl === 0 ? "Aguardando pagamentos" : "Estimado via tabela de preços"} />
        <Card icon={Coins} label="Créditos Vendidos" value={m.creditsSold} />
        <Card icon={TrendingDown} label="Créditos Gastos" value={m.creditsSpent} />
        <Card icon={Search} label="Consultas" value={m.consultations} hint={`Cidade ${m.byType.city} · Casa ${m.byType.house} · Intenção ${m.byType.intent}`} />
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-ps-display text-sm uppercase tracking-wider text-foreground mb-4">Cadastros — últimos 30 dias</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={m.signupSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-panel p-5">
          <h3 className="font-ps-display text-sm uppercase tracking-wider text-foreground mb-3">Top 10 — Compradores</h3>
          {m.topBuyers.length === 0 ? <p className="text-muted-foreground text-xs">Sem compras ainda.</p> :
            <div className="space-y-1.5">
              {m.topBuyers.map((u, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground/60 w-5">{i + 1}.</span>
                  <div className="flex-1 min-w-0"><p className="text-foreground truncate">{u.name}</p><p className="text-muted-foreground/60 text-[10px] truncate">{u.email}</p></div>
                  <span className="text-primary font-bold">{u.credits} cr</span>
                </div>
              ))}
            </div>}
        </div>
        <div className="glass-panel p-5">
          <h3 className="font-ps-display text-sm uppercase tracking-wider text-foreground mb-3">Top 10 — Quem mais gastou</h3>
          {m.topSpenders.length === 0 ? <p className="text-muted-foreground text-xs">Sem gastos ainda.</p> :
            <div className="space-y-1.5">
              {m.topSpenders.map((u, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground/60 w-5">{i + 1}.</span>
                  <div className="flex-1 min-w-0"><p className="text-foreground truncate">{u.name}</p><p className="text-muted-foreground/60 text-[10px] truncate">{u.email}</p></div>
                  <span className="text-destructive font-bold">{u.spent} cr</span>
                </div>
              ))}
            </div>}
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
