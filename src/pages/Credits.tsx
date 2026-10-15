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
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages, costs, loading } = usePricing();
  const [busyPkg, setBusyPkg] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Pagamento aprovado! Seus créditos já estão disponíveis.");
      window.history.replaceState({}, document.title, "/credits");
    } else if (status === "failure") {
      toast.error("O pagamento foi recusado ou cancelado.");
      window.history.replaceState({}, document.title, "/credits");
    } else if (status === "pending") {
      toast.info("Pagamento pendente. Os créditos cairão assim que confirmado.");
      window.history.replaceState({}, document.title, "/credits");
    }
  }, [searchParams]);

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
    <>
      <StarryBackground />
      <div className="min-h-[100dvh] px-4 py-16 md:py-24 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-ps-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-xl leading-none">
            Créditos de Acesso
          </h1>
          <p className="text-white/50 text-base md:text-xl font-light font-ps-ui max-w-2xl mx-auto leading-relaxed">
            Adquira créditos para calcular novas cidades, aprofundar focos e desbloquear rotas estratégicas no seu mapa de Revolução Solar.
          </p>
          {profile && (
            <div className="mt-8 inline-flex flex-col items-center justify-center p-4 px-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Seu Saldo Oficial</span>
              <span className="text-white font-ps-display text-5xl md:text-6xl font-bold leading-none drop-shadow-md">
                {profile.credits} <span className="text-xs uppercase tracking-widest text-white/40 font-mono font-normal">crédito{profile.credits === 1 ? '' : 's'}</span>
              </span>
            </div>
          )}
        </motion.div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 font-sans text-[11px] uppercase tracking-[0.2em] font-bold">Calculando valores cósmicos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto items-stretch pt-4">
            {packages.map((pkg, i) => {
              const highlight = i === 1;
              const [int, dec] = fmt(pkg.price_brl);
              return (
                <motion.div
                  key={pkg.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 md:p-10 text-center relative transition-all duration-500 flex flex-col justify-between rounded-3xl ${
                    highlight
                      ? "border-2 border-white/30 bg-white/[0.08] backdrop-blur-xl shadow-[0_0_80px_rgba(255,255,255,0.08)] md:-translate-y-2 z-10"
                      : "border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Badge de Destaque no Pacote do Meio */}
                  {highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-[0.25em] rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-black shrink-0" />
                      Mais Escolhido
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${highlight ? 'text-primary' : 'text-white/40'}`}>
                        {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}
                      </span>
                    </div>

                    <h3 className={`font-ps-display text-3xl font-bold tracking-tight mb-3 ${highlight ? 'text-white drop-shadow-md' : 'text-white/90'}`}>
                      {pkg.label}
                    </h3>

                    <p className="text-white/50 text-xs sm:text-sm font-light font-ps-ui mb-8 min-h-[2.5rem] leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mb-6 flex items-start justify-center text-white drop-shadow-lg">
                      <span className="text-white/40 text-sm font-bold mt-2 mr-1">R$</span>
                      <span className="font-ps-display text-6xl md:text-7xl font-bold leading-none tracking-tighter">{int}</span>
                      <span className="text-white/50 text-base mt-1">,{dec}</span>
                    </div>

                    <div className="mb-8 text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2">
                      {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""} na conta
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg)}
                    className={`w-full py-4 text-xs font-sans uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-2xl ${
                      highlight
                        ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        : "bg-white/10 border border-white/15 text-white hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                    }`}
                    disabled={busyPkg === pkg.key}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>{busyPkg === pkg.key ? "Iniciando..." : "Comprar"}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
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
          transition={{ delay: 0.4 }}
          className="mt-24 pt-16 border-t border-white/10"
        >
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/40 block mb-2 font-bold">
              Como Funcionam os Créditos
            </span>
            <h3 className="font-ps-display text-2xl md:text-3xl text-white font-bold tracking-tight">
              Tabela de Conversão
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {costs.map((item) => {
              const Icon = ICONS[item.key] || Map;
              return (
                <div 
                  key={item.key} 
                  className="p-6 text-center rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <Icon className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="font-ps-display text-base font-bold text-white mb-1.5">{item.label}</p>
                    <p className="text-primary font-mono text-[11px] uppercase tracking-[0.15em] font-bold mb-3">
                      {item.credits} crédito{item.credits > 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-white/40 text-[11px] font-ps-ui font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Credits;
