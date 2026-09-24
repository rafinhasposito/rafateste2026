import { BackButton } from '@/components/ui/BackButton';
import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Unlock, Map, ArrowLeft, CreditCard } from "lucide-react";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const ICONS: Record<string, any> = { cost_house_1: Lock, cost_house_3: Unlock, cost_full_map: Map, cost_city: Map };

const Credits = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages, costs, loading } = usePricing();
  const [busyPkg, setBusyPkg] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Pagamento aprovado! Seus créditos já estão disponíveis.");
      // Limpar param
      window.history.replaceState({}, document.title, "/credits");
    } else if (status === "failure") {
      toast.error("O pagamento foi recusado ou cancelado.");
      window.history.replaceState({}, document.title, "/credits");
    } else if (status === "pending") {
      toast.info("Pagamento pendente. Os créditos cairão quando confirmado.");
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
      const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: { pricing_config_id: pkg.key }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Checkout URL não recebida do servidor.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao iniciar o pagamento. Tente novamente.");
    } finally {
      setBusyPkg(null);
    }
  };
  const fmt = (n: number | null) => n == null ? ["0", "00"] : n.toFixed(2).split(".");
  const housesLabel = (c: number) => c === 1 ? "1 Casa" : c === 2 ? "3 Casas" : "12 Casas";

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
          <BackButton label="Descobrir" to="/" className="mb-8 mx-auto" />
          <h1 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-widest">
            Créditos de Acesso
          </h1>
          <p className="text-white/50 text-sm font-ps-ui max-w-lg mx-auto">
            Cada crédito desbloqueia casas específicas no seu mapa de Revolução Solar. Obtenha acesso para descobrir suas rotas de prosperidade.
          </p>
          {profile && (
            <div className="mt-8 inline-flex flex-col items-center justify-center">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-sans mb-2">Seu Saldo Oficial</span>
              <span className="text-[#C9A227] font-ps-display text-5xl font-bold leading-none">{profile.credits}</span>
            </div>
          )}
        </motion.div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/60 font-sans text-xs uppercase tracking-widest">Calculando valores cósmicos...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, i) => {
            const highlight = i === 1;
            const [int, dec] = fmt(pkg.price_brl);
            return (
            <motion.div
              key={pkg.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 md:p-10 text-center relative transition-all duration-300 flex flex-col justify-between ${
                highlight
                  ? "border border-[#C9A227]/50 bg-[#C9A227]/5 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                  : "border border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="mb-4">
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.3em] ${highlight ? 'text-[#C9A227]' : 'text-white/40'}`}>
                    {housesLabel(pkg.credits)}
                  </span>
                </div>
                <h3 className={`font-ps-display text-2xl font-bold uppercase tracking-wider mb-3 ${highlight ? 'text-white' : 'text-white/80'}`}>
                  {pkg.label}
                </h3>
                <p className="text-white/50 text-xs font-ps-ui mb-8 min-h-[3rem] leading-relaxed">
                  {pkg.description}
                </p>
                <div className="mb-6 flex items-start justify-center text-white">
                  <span className="text-white/50 text-sm mt-1 mr-1">R$</span>
                  <span className="font-ps-display text-5xl font-bold leading-none">{int}</span>
                  <span className="text-white/50 text-base mt-1">,{dec}</span>
                </div>
                <div className="mb-8 text-[10px] text-white/40 font-sans uppercase tracking-widest font-bold">
                  {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""} incl.
                </div>
              </div>
              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full py-4 text-[10px] font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                  highlight
                    ? "bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                    : "bg-transparent border border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-50"
                }`}
                disabled={busyPkg === pkg.key}
              >
                {busyPkg === pkg.key ? "Redirecionando..." : "Adquirir Acesso"}
              </button>
            </motion.div>
          );})}
        </div>
        )}

        {/* Unlock Pricing Table */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-24 pt-16 border-t border-white/10"
        >
          <h3 className="font-ps-display text-xl text-white uppercase tracking-widest mb-10 text-center">
            Tabela de Conversão
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {costs.map((item) => {
              const Icon = ICONS[item.key] || Map;
              return (
                <div key={item.key} className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="font-ps-display text-base text-white mb-2">{item.label}</p>
                  <p className="text-[#C9A227] font-sans text-xs uppercase tracking-widest font-bold mb-2">{item.credits} crédito{item.credits > 1 ? "s" : ""}</p>
                  <p className="text-white/40 text-[10px] font-ps-ui leading-relaxed">{item.description}</p>
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
