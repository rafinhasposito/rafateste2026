import { BackButton } from '@/components/ui/BackButton';
import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Unlock, Map, CreditCard, Sparkles, Compass, Crown, MapPin, ChevronRight } from "lucide-react";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const ICONS: Record<string, any> = { 
  cost_city: MapPin,
  cost_house_1: Lock, 
  cost_focus: Sparkles, 
  cost_all_focuses: Crown, 
  cost_full_map: Compass 
};

const Credits = () => {
  const { profile, session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages, costs, loading } = usePricing();
  const [busyPkg, setBusyPkg] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");
    const isApproved = status === "success" || status === "approved" || collectionStatus === "approved";
    const isPending = status === "pending" || collectionStatus === "pending" || collectionStatus === "in_process";
    const isFailure = status === "failure" || collectionStatus === "rejected";

    if (isApproved) {
      toast.success("Pagamento aprovado! Seus créditos já estão disponíveis.");
      refreshProfile();
      // Polling para sincronização em tempo real caso o webhook ainda esteja processando
      const t1 = setTimeout(refreshProfile, 2000);
      const t2 = setTimeout(refreshProfile, 5000);
      window.history.replaceState({}, document.title, "/credits");
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (isFailure) {
      toast.error("O pagamento foi recusado ou cancelado.");
      window.history.replaceState({}, document.title, "/credits");
    } else if (isPending) {
      toast.info("Pagamento pendente. Os créditos serão liberados assim que compensado.");
      refreshProfile();
      const t = setTimeout(refreshProfile, 4000);
      window.history.replaceState({}, document.title, "/credits");
      return () => clearTimeout(t);
    }
  }, [searchParams, refreshProfile]);

  const handlePurchase = async (pkg: PricingItem) => {
    if (!profile) {
      toast.error("Você precisa estar logado para adquirir créditos.");
      navigate("/auth");
      return;
    }

    setBusyPkg(pkg.key);
    try {
      // 1. Prioriza token da sessão ativa no contexto
      let accessToken: string | null = session?.access_token || null;

      // 2. Se não estiver no contexto, tenta getSession() (agora seguro sem lock do browser)
      if (!accessToken) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch (e) {
          console.warn("[Checkout] getSession failed:", e);
        }
      }

      // 3. Fallback: varre chaves do localStorage para encontrar o token
      if (!accessToken) {
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith("sb-") || key.includes("auth-token"))) {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                const found = parsed?.access_token ?? parsed?.session?.access_token ?? parsed?.data?.session?.access_token;
                if (found) {
                  accessToken = found;
                  console.log("[Checkout] token found in localStorage key:", key);
                  break;
                }
              }
            }
          }
        } catch (e) {
          console.warn("[Checkout] localStorage search failed:", e);
        }
      }

      if (!accessToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: { pricing_config_id: pkg.key },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      console.log("[Checkout] response:", data, "error:", error);

      if (error) {
        let detail = error.message;
        try {
          const context = (error as any).context;
          if (context) {
            const text = await context.text?.();
            const parsed = JSON.parse(text || "{}");
            if (parsed?.error) detail = parsed.error;
          }
        } catch {}
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Checkout URL não recebida do servidor.");
      }
    } catch (err: any) {
      console.error("[Checkout] Error:", err);
      const msg = err?.message || "";
      toast.error(msg || "Erro ao iniciar pagamento. Tente novamente.");
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("missing authorization")) {
        setTimeout(() => navigate("/auth"), 1500);
      }
    } finally {
      setBusyPkg(null);
    }
  };

  const fmt = (n: number | null) => (n == null ? ["0", "00"] : n.toFixed(2).split("."));

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 pb-20 md:pt-24 md:pb-24 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#F5DE98] text-[10px] uppercase tracking-[0.24em] font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
          Consultas & Desbloqueios
        </span>
        <h1 className="font-ps-display text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
          Créditos de Consulta
        </h1>
        <p className="text-white/60 text-sm sm:text-base md:text-lg font-light font-ps-ui max-w-2xl mx-auto leading-relaxed">
          Adquira créditos para descobrir suas melhores cidades de aniversário, testar novos destinos e abrir as 12 áreas do seu ano.
        </p>
        {profile && (
          <div className="mt-7 inline-flex items-center gap-4 py-3.5 px-7 rounded-2xl bg-[#08111F]/90 border border-[#C9A227]/30 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
            <span className="text-white/55 text-[11px] uppercase tracking-[0.2em] font-semibold">Seu Saldo Atual</span>
            <span className="h-5 w-px bg-white/10" />
            <span className="text-[#F5DE98] font-ps-display text-3xl sm:text-4xl font-bold leading-none">
              {profile.credits} <span className="text-xs uppercase tracking-widest text-[#F5DE98]/65 font-ps-ui font-medium">crédito{profile.credits === 1 ? '' : 's'}</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-7 h-7 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#F5DE98]/70 font-ps-ui text-[11px] uppercase tracking-[0.2em] font-semibold">Carregando pacotes disponíveis...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-5xl mx-auto items-stretch pt-3">
          {packages.map((pkg, i) => {
            const highlight = i === 1;
            const [int, dec] = fmt(pkg.price_brl);
            return (
              <motion.div
                key={pkg.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-7 sm:p-9 text-center relative transition-all duration-400 flex flex-col justify-between rounded-3xl ${
                  highlight
                    ? "border-2 border-[#C9A227]/60 bg-gradient-to-b from-[#101F3A]/95 via-[#091326]/95 to-[#060C18]/98 backdrop-blur-xl shadow-[0_22px_60px_rgba(201,162,39,0.16)] md:-translate-y-2 z-10"
                    : "border border-white/10 bg-[#08111F]/85 backdrop-blur-xl hover:border-[#C9A227]/35 hover:bg-[#0B172A]/90 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                }`}
              >
                {/* Badge de Destaque no Pacote do Meio */}
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#02050A] text-[10px] font-bold uppercase tracking-[0.22em] rounded-full shadow-[0_6px_20px_rgba(201,162,39,0.35)] flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-[#02050A] shrink-0" />
                    Mais Escolhido
                  </div>
                )}

                <div>
                  <div className="mb-3">
                    <span className={`text-[11px] font-bold uppercase tracking-[0.24em] font-ps-ui ${highlight ? 'text-[#F5DE98]' : 'text-white/50'}`}>
                      {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}
                    </span>
                  </div>

                  <h3 className={`font-ps-display text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${highlight ? 'text-white' : 'text-white/90'}`}>
                    {pkg.label}
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm font-light font-ps-ui mb-7 min-h-[2.5rem] leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mb-5 flex items-start justify-center text-white">
                    <span className="text-[#F5DE98]/70 text-sm font-bold mt-2 mr-1">R$</span>
                    <span className={`font-ps-display text-5xl sm:text-6xl font-bold leading-none tracking-tight ${highlight ? 'text-[#F5DE98]' : 'text-white'}`}>{int}</span>
                    <span className="text-white/60 text-base mt-1">,{dec}</span>
                  </div>

                  <div className="mb-7 text-[11px] text-white/45 font-ps-ui uppercase tracking-[0.16em] font-medium flex items-center justify-center gap-2">
                    Liberação imediata na conta
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-4 text-xs font-ps-ui uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-2xl ${
                    highlight
                      ? "bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] shadow-[0_10px_30px_rgba(201,162,39,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      : "bg-white/[0.06] border border-[#C9A227]/30 text-[#F5DE98] hover:bg-[#C9A227] hover:text-[#02050A] hover:border-[#C9A227] active:scale-95 disabled:opacity-50"
                  }`}
                  disabled={busyPkg === pkg.key}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>{busyPkg === pkg.key ? "Abrindo Checkout..." : "Escolher Pacote"}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-75" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Unlock Pricing Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-20 pt-14 border-t border-white/10"
      >
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-ps-ui tracking-[0.26em] text-[#F5DE98]/75 block mb-2 font-semibold">
            Transparência Total
          </span>
          <h3 className="font-ps-display text-2xl md:text-3xl text-white font-bold tracking-tight">
            O Que Cada Crédito Libera
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {costs.map((item) => {
            const Icon = ICONS[item.key] || Map;
            return (
              <div 
                key={item.key} 
                className="p-6 text-center rounded-2xl border border-white/[0.08] bg-[#08111F]/80 hover:border-[#C9A227]/30 transition-all duration-300 flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-[#F5DE98]" />
                  </div>
                  <p className="font-ps-display text-base font-bold text-white mb-1.5">{item.label}</p>
                  <p className="text-[#F5DE98] font-ps-ui text-[11px] uppercase tracking-[0.15em] font-bold mb-3">
                    {item.credits} crédito{item.credits > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-white/50 text-xs font-ps-ui font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Credits;
