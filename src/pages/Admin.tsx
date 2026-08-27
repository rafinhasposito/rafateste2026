import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import PricingEditor from "@/components/admin/PricingEditor";
import UsersTable from "@/components/admin/UsersTable";
import TransactionsTable from "@/components/admin/TransactionsTable";
import MetricsDashboard from "@/components/admin/MetricsDashboard";

type Tab = "metrics" | "pricing" | "users" | "transactions";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [tab, setTab] = useState<Tab>("metrics");

  if (authLoading || adminLoading) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex items-center justify-center text-primary font-cinzel animate-pulse">Verificando acesso…</div>
      </>
    );
  }

  if (!user) { navigate("/auth"); return null; }

  if (!isAdmin) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
          <h1 className="font-cinzel text-2xl text-foreground uppercase tracking-wider">Acesso restrito</h1>
          <p className="text-muted-foreground text-sm text-center max-w-md">Esta área é apenas para administradores.</p>
          <button onClick={() => navigate("/")} className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-xs uppercase tracking-widest">← Voltar</button>
        </div>
      </>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "metrics", label: "Métricas" },
    { id: "pricing", label: "Preços & Custos" },
    { id: "users", label: "Usuários" },
    { id: "transactions", label: "Transações" },
  ];

  return (
    <>
      <StarryBackground />
      <div className="min-h-screen px-4 py-10 md:py-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary mb-6 inline-flex items-center min-h-[44px]">← Voltar</button>
          <h1 className="font-cinzel text-2xl md:text-4xl font-bold text-foreground uppercase tracking-wider mb-2">Painel Admin</h1>
          <p className="text-muted-foreground text-sm mb-8">Gerencie preços, usuários e transações da plataforma.</p>

          <div className="h-scroll mb-6 border-b border-border pb-3 -mx-4 px-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-t-lg text-[11px] md:text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all ${tab === t.id ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>


          {tab === "metrics" && <MetricsDashboard />}
          {tab === "pricing" && <PricingEditor />}
          {tab === "users" && <UsersTable />}
          {tab === "transactions" && <TransactionsTable />}
        </motion.div>
      </div>
    </>
  );
};

export default Admin;
