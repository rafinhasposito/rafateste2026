import { BackButton } from "@/components/ui/BackButton";
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
        <div className="min-h-[100dvh] flex items-center justify-center text-primary font-ps-display animate-pulse">Verificando acesso…</div>
      </>
    );
  }

  if (!user) { navigate("/auth"); return null; }

  if (!isAdmin) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 gap-4">
          <h1 className="font-ps-display text-2xl text-foreground uppercase tracking-wider">Acesso restrito</h1>
          <p className="text-muted-foreground text-sm text-center max-w-md">Esta área é apenas para administradores.</p>
          <BackButton label="Voltar" to="/" />
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
      <div className="min-h-[100dvh] px-4 py-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <BackButton label="Voltar" to="/" className="mb-6" />
          <h1 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">Painel Admin</h1>
          <p className="text-white/40 text-lg font-light font-ps-ui mb-10 leading-relaxed max-w-2xl">Gerencie preços, usuários e transações da plataforma.</p>

          <div className="flex flex-wrap gap-3 mb-12 p-2 bg-black/40 border border-white/10 rounded-3xl w-fit backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-2xl ${tab === t.id ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
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
