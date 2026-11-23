import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Handshake,
  LayoutDashboard,
  Receipt,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Store,
  Ticket,
  Users,
} from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { BackButton } from "@/components/ui/BackButton";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import PricingEditor from "@/components/admin/PricingEditor";
import UsersTable from "@/components/admin/UsersTable";
import TransactionsTable from "@/components/admin/TransactionsTable";
import MetricsDashboard, { isPaidPurchaseType } from "@/components/admin/MetricsDashboard";
import CouponsManager from "@/components/admin/CouponsManager";
import AffiliatesManager from "@/components/admin/AffiliatesManager";

type Tab = "metrics" | "transactions" | "users" | "affiliates" | "coupons" | "pricing";

const VALID_TABS: Tab[] = [
  "metrics",
  "transactions",
  "users",
  "affiliates",
  "coupons",
  "pricing",
];

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const rawInitialTab = (searchParams.get("tab") as Tab) || "metrics";
  const [tab, setTab] = useState<Tab>(
    VALID_TABS.includes(rawInitialTab) ? rawInitialTab : "metrics"
  );

  const [txFilter, setTxFilter] = useState<string>("all");
  const [txSearch, setTxSearch] = useState<string>("");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [badges, setBadges] = useState<{ paidSales: number; users: number }>({
    paidSales: 0,
    users: 0,
  });

  useEffect(() => {
    if (!authLoading && !adminLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [authLoading, adminLoading, user, navigate]);

  // Carrega contadores leves para os badges da sidebar (Vendas Pagas e Usuários)
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const [usersCountRes, txRes] = await Promise.all([
          supabase.from("profiles").select("user_id", { count: "exact", head: true }),
          supabase.from("credit_transactions").select("amount, type").gt("amount", 0),
        ]);
        const paidSales = (txRes.data ?? []).filter((t: any) =>
          isPaidPurchaseType(t.type)
        ).length;
        setBadges({
          paidSales,
          users: usersCountRes.count ?? 0,
        });
      } catch {
        // Silencioso
      }
    })();
  }, [isAdmin]);

  const handleSelectTab = (nextTab: Tab, filterOrSearch?: string) => {
    setTab(nextTab);
    setSearchParams({ tab: nextTab }, { replace: true });
    if (nextTab === "transactions") {
      if (filterOrSearch && ["all", "pago", "gratis", "gastos"].includes(filterOrSearch)) {
        setTxFilter(filterOrSearch);
      } else if (filterOrSearch !== undefined) {
        setTxSearch(filterOrSearch);
      }
    }
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = globalSearch.trim();
    if (!q) return;
    setTxFilter("all");
    setTxSearch(q);
    handleSelectTab("transactions");
  };

  if (authLoading || adminLoading) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-[100dvh] flex items-center justify-center text-[#F5B041] font-ps-display animate-pulse">
          Verificando acesso administrativo…
        </div>
      </>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 gap-4">
          <h1 className="font-ps-display text-2xl text-foreground uppercase tracking-wider">
            Acesso restrito
          </h1>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Esta área é apenas para administradores.
          </p>
          <BackButton label="Voltar" to="/" />
        </div>
      </>
    );
  }

  const menuItems: Array<{
    id: Tab;
    label: string;
    shortLabel: string;
    icon: typeof LayoutDashboard;
    badge?: string | number;
  }> = [
    { id: "metrics", label: "Dashboard", shortLabel: "Dashboard", icon: LayoutDashboard },
    {
      id: "transactions",
      label: "Transações",
      shortLabel: "Vendas",
      icon: Receipt,
      badge: badges.paidSales > 0 ? badges.paidSales : undefined,
    },
    {
      id: "users",
      label: "Usuários",
      shortLabel: "Usuários",
      icon: Users,
      badge: badges.users > 0 ? badges.users : undefined,
    },
    { id: "affiliates", label: "Afiliados", shortLabel: "Afiliados", icon: Handshake },
    { id: "coupons", label: "Cupons & Mídia Kit", shortLabel: "Cupons", icon: Ticket },
    { id: "pricing", label: "Preços & Custos", shortLabel: "Preços", icon: Sliders },
  ];

  const adminDisplayName =
    profile?.full_name?.trim() ||
    profile?.display_name?.trim() ||
    user.email?.split("@")[0] ||
    "Admin";

  const adminInitials = adminDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <StarryBackground />
      <div className="min-h-[100dvh] w-full max-w-[1520px] mx-auto px-3 sm:px-6 py-4 sm:py-6 overflow-x-clip">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── SIDEBAR ESQUERDA DESKTOP (Arquitetura Donezo + Tokens Protocolo Solar) ── */}
          <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-[32px] bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl p-5 sticky top-6 min-h-[calc(100dvh-3rem)] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
            <div>
              {/* Brand */}
              <div className="flex items-center gap-3 px-2 pb-6 mb-5 border-b border-white/10">
                <img
                  src="/brand/protocolo-solar-simbolo-redondo.png"
                  alt="Protocolo Solar"
                  className="w-10 h-10 rounded-full border border-[#F5B041]/40 shadow-[0_0_20px_rgba(245,176,65,0.25)]"
                />
                <div className="min-w-0">
                  <p className="font-ps-display text-sm font-bold text-white tracking-wide truncate">
                    Protocolo Solar
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5B041]">
                    <ShieldCheck className="w-3 h-3" />
                    Admin Central
                  </span>
                </div>
              </div>

              {/* MENU */}
              <div className="mb-6">
                <p className="px-3 mb-2.5 text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">
                  Menu
                </p>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`relative w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                          active
                            ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#10B981] shadow-[0_0_14px_#10B981]" />
                        )}
                        <span className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#10B981]" : "text-white/40"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              active
                                ? "bg-[#10B981] text-[#050507]"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* ATALHOS */}
              <div>
                <p className="px-3 mb-2.5 text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">
                  Atalhos
                </p>
                <div className="space-y-1">
                  <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-white/40" />
                    <span>Voltar ao App</span>
                  </Link>
                  <Link
                    to="/parceiros"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-white/40" />
                    <span>Página Parceiros</span>
                  </Link>
                  <Link
                    to="/credits"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    <Store className="w-4 h-4 text-white/40" />
                    <span>Loja de Créditos</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Featured Card (Padrão Donezo Bottom-Left Dark Card) */}
            <div
              className="mt-6 rounded-3xl p-4 border border-emerald-500/30 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(6,78,59,0.75) 0%, rgba(5,8,12,0.96) 100%)",
              }}
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#F5B041]/20 blur-xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                    Produção Ativa
                  </span>
                </div>
                <p className="font-ps-display text-sm font-bold text-white leading-snug mb-1">
                  protocolosolar.com.br
                </p>
                <p className="text-[11px] text-white/55 mb-3 leading-relaxed">
                  Checkout Pix & Cartão integrado ao Mercado Pago.
                </p>
                <Link
                  to="/"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050507] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Abrir Plataforma</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── COLUNA PRINCIPAL (Topbar + Navegação Mobile + Conteúdo da Aba) ── */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* TOPBAR EXECUTIVA */}
            <header className="rounded-[24px] bg-[#0A0B10]/90 border border-white/10 backdrop-blur-2xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
              {/* Mobile Brand + Back */}
              <div className="flex lg:hidden items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/brand/protocolo-solar-simbolo-redondo.png"
                    alt="Protocolo Solar"
                    className="w-8 h-8 rounded-full border border-[#F5B041]/40"
                  />
                  <div>
                    <span className="font-ps-display text-sm font-bold text-white block leading-none">
                      Painel Admin
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#F5B041]">
                      Protocolo Solar
                    </span>
                  </div>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] text-white/75"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  App
                </Link>
              </div>

              {/* Busca Global (Estilo Donezo Search Bar) */}
              <form
                onSubmit={handleGlobalSearchSubmit}
                className="relative flex-1 max-w-md"
              >
                <Search className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Buscar cliente, e-mail ou transação e pressionar Enter…"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-14 py-2.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-mono text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2">
                  Enter
                </span>
              </form>

              {/* Perfil Admin (Direita) */}
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-tight">
                    {adminDisplayName}
                  </p>
                  <p className="text-[10px] text-white/45 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5B041] to-[#E67E22] text-[#050507] font-ps-display text-xs font-bold flex items-center justify-center shadow-[0_0_20px_rgba(245,176,65,0.3)]">
                  {adminInitials}
                </div>
              </div>
            </header>

            {/* NAVEGAÇÃO MOBILE (Carrossel Horizontal Touch-Friendly) */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`snap-start shrink-0 min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      active
                        ? "bg-white text-[#050507] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "bg-[#0A0B10]/85 border-white/10 text-white/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.shortLabel}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                          active ? "bg-[#050507] text-white" : "bg-white/10 text-white/80"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONTEÚDO PRINCIPAL DA ABA */}
            <motion.main
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-[32px] bg-[#0A0B10]/60 border border-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              {tab === "metrics" && (
                <MetricsDashboard onNavigateTab={handleSelectTab} />
              )}
              {tab === "transactions" && (
                <div className="space-y-4">
                  <div className="pb-2">
                    <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                      Transações & Conciliação
                    </h2>
                    <p className="text-white/45 text-xs sm:text-sm mt-1">
                      Auditoria completa de vendas Mercado Pago, cupons resgatados e créditos consumidos.
                    </p>
                  </div>
                  <TransactionsTable
                    initialFilter={txFilter}
                    initialSearch={txSearch}
                  />
                </div>
              )}
              {tab === "users" && (
                <div className="space-y-4">
                  <div className="pb-2">
                    <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                      Usuários & Carteiras
                    </h2>
                    <p className="text-white/45 text-xs sm:text-sm mt-1">
                      Visualize contas cadastradas e gerencie créditos manualmente quando necessário.
                    </p>
                  </div>
                  <UsersTable />
                </div>
              )}
              {tab === "affiliates" && <AffiliatesManager />}
              {tab === "coupons" && <CouponsManager />}
              {tab === "pricing" && <PricingEditor />}
            </motion.main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
