import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Map, CreditCard, Sparkles, Compass, Crown, MapPin, ChevronRight, QrCode, Copy, Check, X, ShieldCheck, RefreshCw } from "lucide-react";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";

const ICONS: Record<string, any> = { 
  cost_city: MapPin,
  cost_house_1: Lock, 
  cost_focus: Sparkles, 
  cost_all_focuses: Crown, 
  cost_full_map: Compass 
};

interface PixPaymentState {
  orderId: string;
  paymentId: string | number;
  qrCode: string;
  qrCodeBase64: string;
  publicKey?: string;
}

const Credits = () => {
  const { profile, session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages, costs, loading } = usePricing();

  // Estados do Modal de Checkout Transparente (Dentro do Site)
  const [selectedPkg, setSelectedPkg] = useState<PricingItem | null>(null);
  const [paymentTab, setPaymentTab] = useState<"pix" | "card">("pix");
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixPaymentState | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const cardBrickControllerRef = useRef<any>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const collectionStatus = searchParams.get("collection_status");
    const isApproved = status === "success" || status === "approved" || collectionStatus === "approved";
    const isPending = status === "pending" || collectionStatus === "pending" || collectionStatus === "in_process";
    const isFailure = status === "failure" || collectionStatus === "rejected";

    if (isApproved) {
      toast.success("Pagamento aprovado! Seus créditos já estão disponíveis.");
      refreshProfile();
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

  const resolveAccessToken = async (): Promise<string | null> => {
    let accessToken: string | null = session?.access_token || null;
    if (!accessToken) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {}
    }
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
                break;
              }
            }
          }
        }
      } catch {}
    }
    return accessToken;
  };

  const extractFunctionError = async (error: any): Promise<string> => {
    let detail = error?.message || "Erro ao comunicar com o servidor de pagamentos.";
    try {
      const ctx = error?.context;
      if (ctx) {
        if (typeof ctx.json === "function") {
          const parsed = await ctx.json().catch(() => null);
          if (parsed?.error) detail = parsed.error;
        } else if (typeof ctx.text === "function") {
          const text = await ctx.text().catch(() => "");
          const parsed = JSON.parse(text || "{}");
          if (parsed?.error) detail = parsed.error;
        }
      }
    } catch {}
    return detail;
  };

  const generatePixForPackage = async (pkg: PricingItem) => {
    setLoadingPix(true);
    setPixError(null);
    setPixData(null);
    setCopiedPix(false);

    try {
      const accessToken = await resolveAccessToken();
      if (!accessToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: { action: "create_pix", pricing_config_id: pkg.key },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (error) {
        throw new Error(await extractFunctionError(error));
      }
      if (data?.error) {
        throw new Error(data.error);
      }

      setPixData({
        orderId: data.orderId,
        paymentId: data.paymentId,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        publicKey: data.publicKey
      });
    } catch (err: any) {
      console.error("[Checkout Pix] Error:", err);
      setPixError(err?.message || "Não foi possível gerar o QR Code Pix.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleOpenCheckoutModal = (pkg: PricingItem) => {
    if (!profile) {
      toast.error("Você precisa estar logado para adquirir créditos.");
      navigate("/auth");
      return;
    }
    setSelectedPkg(pkg);
    setPaymentTab("pix");
    setPaymentApproved(false);
    generatePixForPackage(pkg);
  };

  const handleCloseModal = () => {
    if (cardBrickControllerRef.current) {
      try {
        cardBrickControllerRef.current.unmount();
      } catch {}
      cardBrickControllerRef.current = null;
    }
    setSelectedPkg(null);
    setPixData(null);
    setPixError(null);
    setPaymentApproved(false);
  };

  // Polling automático a cada 3.5s enquanto o modal Pix estiver aberto
  useEffect(() => {
    if (!selectedPkg || paymentTab !== "pix" || !pixData?.paymentId || paymentApproved) return;

    const interval = setInterval(async () => {
      try {
        const accessToken = await resolveAccessToken();
        if (!accessToken) return;

        const { data } = await supabase.functions.invoke("create-mercadopago-checkout", {
          body: {
            action: "check_payment",
            order_id: pixData.orderId,
            payment_id: pixData.paymentId
          },
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (data?.status === "approved") {
          setPaymentApproved(true);
          await refreshProfile();
          toast.success("Pix confirmado! Seus créditos foram liberados.");
        }
      } catch {}
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedPkg, paymentTab, pixData, paymentApproved, refreshProfile]);

  const handleManualCheckPix = async () => {
    if (!pixData?.paymentId) return;
    setCheckingPayment(true);
    try {
      const accessToken = await resolveAccessToken();
      if (!accessToken) return;

      const { data } = await supabase.functions.invoke("create-mercadopago-checkout", {
        body: {
          action: "check_payment",
          order_id: pixData.orderId,
          payment_id: pixData.paymentId
        },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data?.status === "approved") {
        setPaymentApproved(true);
        await refreshProfile();
        toast.success("Pagamento confirmado! Créditos adicionados.");
      } else {
        toast.info("Ainda aguardando confirmação do banco. Assim que compensar, liberaremos imediatamente.");
      }
    } catch {
      toast.error("Erro ao verificar status. Tente novamente em instantes.");
    } finally {
      setCheckingPayment(false);
    }
  };

  // Monta o Card Payment Brick oficial do Mercado Pago quando a aba "card" é selecionada
  useEffect(() => {
    if (!selectedPkg || paymentTab !== "card" || paymentApproved) {
      if (cardBrickControllerRef.current) {
        try {
          cardBrickControllerRef.current.unmount();
        } catch {}
        cardBrickControllerRef.current = null;
      }
      return;
    }

    let cancelled = false;

    const mountCardBrick = async () => {
      const MP = (window as any).MercadoPago || await new Promise<any>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.onload = () => resolve((window as any).MercadoPago);
        script.onerror = () => resolve(null);
        document.body.appendChild(script);
      });

      if (!MP || cancelled) return;

      const publicKey = pixData?.publicKey || "APP_USR-696a532b-8901-4941-9361-8ce2722c133b";
      const mp = new MP(publicKey, { locale: "pt-BR" });
      const bricksBuilder = mp.bricks();

      const container = document.getElementById("mp-card-brick-container");
      if (container) container.innerHTML = "";

      try {
        cardBrickControllerRef.current = await bricksBuilder.create("cardPayment", "mp-card-brick-container", {
          initialization: {
            amount: Number(selectedPkg.price_brl || 0),
            payer: {
              email: session?.user?.email || ""
            }
          },
          customization: {
            visual: {
              style: {
                theme: "dark"
              },
              hidePaymentButton: false
            },
            paymentMethods: {
              maxInstallments: 12
            }
          },
          callbacks: {
            onReady: () => {},
            onSubmit: async (cardFormData: any) => {
              try {
                const accessToken = await resolveAccessToken();
                if (!accessToken) throw new Error("Sessão expirada.");

                const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
                  body: {
                    action: "process_card",
                    pricing_config_id: selectedPkg.key,
                    order_id: pixData?.orderId,
                    card_data: cardFormData
                  },
                  headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (error) {
                  throw new Error(await extractFunctionError(error));
                }
                if (data?.error) {
                  throw new Error(data.error);
                }

                if (data?.status === "approved") {
                  setPaymentApproved(true);
                  await refreshProfile();
                  toast.success("Pagamento com cartão aprovado! Créditos liberados.");
                } else if (data?.status === "in_process" || data?.status === "pending") {
                  toast.info("Pagamento em análise pela operadora. Seus créditos serão liberados assim que aprovado.");
                  handleCloseModal();
                } else {
                  toast.error("Cartão recusado pelo banco emissor. Verifique os dados ou pague via Pix.");
                }
              } catch (err: any) {
                toast.error(err?.message || "Erro ao processar cartão.");
                throw err;
              }
            },
            onError: (error: any) => {
              console.error("[Card Brick] Error:", error);
            }
          }
        });
      } catch (err) {
        console.error("[Card Brick] Mount error:", err);
      }
    };

    mountCardBrick();

    return () => {
      cancelled = true;
      if (cardBrickControllerRef.current) {
        try {
          cardBrickControllerRef.current.unmount();
        } catch {}
        cardBrickControllerRef.current = null;
      }
    };
  }, [selectedPkg, paymentTab, paymentApproved]);

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
                    Pix ou Cartão • Sem sair do site
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckoutModal(pkg)}
                  className={`w-full py-4 text-xs font-ps-ui uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-2xl ${
                    highlight
                      ? "bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] shadow-[0_10px_30px_rgba(201,162,39,0.3)] hover:scale-[1.02] active:scale-95"
                      : "bg-white/[0.06] border border-[#C9A227]/30 text-[#F5DE98] hover:bg-[#C9A227] hover:text-[#02050A] hover:border-[#C9A227] active:scale-95"
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Escolher Pacote</span>
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

      {/* =====================================================================
          MODAL DE CHECKOUT TRANSPARENTE (PIX QR CODE + CARTÃO NO PRÓPRIO SITE)
         ===================================================================== */}
      <AnimatePresence>
        {selectedPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-[#C9A227]/40 bg-[#070E1B] shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden my-auto max-h-[92dvh] flex flex-col"
            >
              {/* Cabeçalho do Modal */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0A1426]">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5DE98] font-bold block mb-0.5">
                    Checkout Seguro • {selectedPkg.credits} Crédito{Number(selectedPkg.credits) > 1 ? "s" : ""}
                  </span>
                  <h3 className="font-ps-display text-xl sm:text-2xl font-bold text-white">
                    {selectedPkg.label} — R$ {Number(selectedPkg.price_brl || 0).toFixed(2).replace(".", ",")}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corpo do Modal */}
              <div className="p-6 overflow-y-auto flex-1">
                {paymentApproved ? (
                  <div className="py-10 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-ps-display text-3xl font-bold text-white">
                      Pagamento Confirmado!
                    </h4>
                    <p className="text-white/70 text-sm max-w-sm leading-relaxed">
                      Seus <strong className="text-[#F5DE98]">{selectedPkg.credits} créditos</strong> já foram adicionados à sua conta e estão prontos para uso.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-4 px-8 py-3.5 rounded-2xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-xs uppercase tracking-[0.2em] transition-all"
                    >
                      Continuar no Protocolo Solar
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Seletor de Método: PIX vs CARTÃO */}
                    <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-black/40 border border-white/10 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentTab("pix")}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${
                          paymentTab === "pix"
                            ? "bg-[#C9A227] text-[#02050A] shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        <QrCode className="w-4 h-4 shrink-0" />
                        <span>Pix (Imediato)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab("card")}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${
                          paymentTab === "card"
                            ? "bg-[#C9A227] text-[#02050A] shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 shrink-0" />
                        <span>Cartão</span>
                      </button>
                    </div>

                    {/* ABA 1: PIX DENTRO DO SITE */}
                    {paymentTab === "pix" && (
                      <div className="flex flex-col items-center text-center">
                        {loadingPix ? (
                          <div className="py-14 flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin" />
                            <p className="text-white/70 text-xs uppercase tracking-[0.2em] font-semibold">
                              Gerando QR Code Pix...
                            </p>
                          </div>
                        ) : pixError ? (
                          <div className="py-8 px-4 rounded-2xl bg-red-500/10 border border-red-500/30 w-full text-center">
                            <p className="text-red-300 text-sm mb-4">{pixError}</p>
                            <button
                              onClick={() => generatePixForPackage(selectedPkg)}
                              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Tentar Novamente
                            </button>
                          </div>
                        ) : pixData ? (
                          <>
                            <p className="text-white/75 text-xs sm:text-sm mb-4 leading-relaxed">
                              Escaneie o QR Code abaixo no aplicativo do seu banco ou use o botão <strong className="text-[#F5DE98]">Pix Copia e Cola</strong>:
                            </p>

                            {pixData.qrCodeBase64 && (
                              <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(201,162,39,0.15)] mb-5">
                                <img
                                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                  alt="QR Code Pix"
                                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                                />
                              </div>
                            )}

                            {pixData.qrCode && (
                              <div className="w-full mb-5">
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-black/50 border border-white/10 mb-3">
                                  <input
                                    type="text"
                                    readOnly
                                    value={pixData.qrCode}
                                    className="w-full bg-transparent text-white/60 text-xs font-mono truncate focus:outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pixData.qrCode);
                                    setCopiedPix(true);
                                    toast.success("Código Pix copiado!");
                                    setTimeout(() => setCopiedPix(false), 3000);
                                  }}
                                  className="w-full py-3.5 px-6 rounded-2xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(201,162,39,0.25)] transition-all active:scale-95"
                                >
                                  {copiedPix ? (
                                    <>
                                      <Check className="w-4 h-4 shrink-0" />
                                      <span>Código Pix Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 shrink-0" />
                                      <span>Copiar Código Pix (Copia e Cola)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            <div className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 text-left">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                <span className="text-emerald-200/90 text-xs leading-snug">
                                  Aguardando pagamento... Liberação automática nesta tela.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleManualCheckPix}
                                disabled={checkingPayment}
                                className="shrink-0 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${checkingPayment ? "animate-spin" : ""}`} />
                                <span>Já paguei</span>
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    )}

                    {/* ABA 2: CARTÃO DE CRÉDITO DENTRO DO SITE */}
                    {paymentTab === "card" && (
                      <div className="w-full">
                        <div id="mp-card-brick-container" className="min-h-[320px]" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Rodapé de Segurança */}
              <div className="px-6 py-3.5 bg-black/50 border-t border-white/10 flex items-center justify-center gap-2 text-white/45 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>Pagamento processado no ambiente criptografado do Mercado Pago</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Credits;
