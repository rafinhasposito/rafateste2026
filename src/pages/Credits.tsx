import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Map,
  CreditCard,
  Sparkles,
  Compass,
  Crown,
  MapPin,
  ChevronRight,
  QrCode,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Zap,
  HelpCircle,
} from "lucide-react";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";

const ICONS: Record<string, any> = {
  cost_city: MapPin,
  cost_house_1: Lock,
  cost_focus: Sparkles,
  cost_all_focuses: Crown,
  cost_full_map: Compass,
};

interface PixPaymentState {
  orderId: string;
  paymentId: string | number;
  qrCode: string;
  qrCodeBase64: string;
  publicKey?: string;
}

function getPackageChecklist(credits: number): {
  idealFor: string;
  tagline: string;
  bullets: string[];
} {
  if (credits <= 1) {
    return {
      idealFor: "Para sua 1ª Descoberta",
      tagline: "Tudo o que você precisa para fazer 1 consulta completa.",
      bullets: [
        "Realiza 1 consulta completa (Por Cidade, Por Casa ou Por Intenção)",
        "Inclui gratuitamente o seu 1º Foco Principal detalhado",
        "Libera 9 Rotas Alternativas divididas em 3 Continentes",
        "Ou pode ser usado para abrir +1 Casa extra ou +1 Foco extra no seu mapa",
      ],
    };
  }
  if (credits <= 5) {
    return {
      idealFor: "Para Comparar Destinos & Áreas",
      tagline: "O equilíbrio perfeito para testar cidades ou aprofundar seu mapa.",
      bullets: [
        `Permite fazer até ${credits} consultas diferentes (ex: testar 3 cidades ou anos)`,
        "Ou fazer 1 consulta principal + desbloquear novas Casas e Focos (Amor, Dinheiro, Carreira)",
        "Libera todos os 6 Focos de uma Casa de uma só vez (custo: 3 créditos)",
        "Créditos não expiram — use quando quiser",
      ],
    };
  }
  return {
    idealFor: "Experiência Completa 360º",
    tagline: "Para quem quer dominar todas as 12 áreas do ano com economia máxima.",
    bullets: [
      "Faz sua consulta principal (1 crédito) + Desbloqueia o Mapa Completo com todas as 12 Casas (7 créditos)",
      "Ainda sobram créditos para destravar Focos extras ou simular outros destinos",
      "Acesso às 12 cidades titulares + 108 rotas alternativas globais do seu ano",
      "Melhor custo por crédito da plataforma",
    ],
  };
}

const Credits = () => {
  const { profile, session, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { packages, costs, loading, getCost } = usePricing();

  // Estado da Tela de Checkout Dedicada (Lado a Lado, sem pop-up apertado)
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
              const found =
                parsed?.access_token ??
                parsed?.session?.access_token ??
                parsed?.data?.session?.access_token;
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
        headers: { Authorization: `Bearer ${accessToken}` },
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
        publicKey: data.publicKey,
      });
    } catch (err: any) {
      console.error("[Checkout Pix] Error:", err);
      setPixError(err?.message || "Não foi possível gerar o QR Code Pix.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleSelectPackage = (pkg: PricingItem) => {
    if (!profile) {
      toast.error("Você precisa estar logado para adquirir créditos.");
      navigate("/auth");
      return;
    }
    if (cardBrickControllerRef.current) {
      try {
        cardBrickControllerRef.current.unmount();
      } catch {}
      cardBrickControllerRef.current = null;
    }
    setSelectedPkg(pkg);
    setPaymentTab("pix");
    setPaymentApproved(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    generatePixForPackage(pkg);
  };

  const handleBackToPackages = () => {
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
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // Polling automático a cada 3.5s enquanto o Pix estiver na tela
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
            payment_id: pixData.paymentId,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
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
          payment_id: pixData.paymentId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
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
      const MP =
        (window as any).MercadoPago ||
        (await new Promise<any>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.onload = () => resolve((window as any).MercadoPago);
          script.onerror = () => resolve(null);
          document.body.appendChild(script);
        }));

      if (!MP || cancelled) return;

      const publicKey = pixData?.publicKey || "APP_USR-696a532b-8901-4941-9361-8ce2722c133b";
      const mp = new MP(publicKey, { locale: "pt-BR" });
      const bricksBuilder = mp.bricks();

      const container = document.getElementById("mp-card-brick-container");
      if (container) container.innerHTML = "";

      try {
        cardBrickControllerRef.current = await bricksBuilder.create(
          "cardPayment",
          "mp-card-brick-container",
          {
            initialization: {
              amount: Number(selectedPkg.price_brl || 0),
              payer: {
                email: session?.user?.email || "",
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "dark",
                },
                hidePaymentButton: false,
              },
              paymentMethods: {
                maxInstallments: 12,
              },
            },
            callbacks: {
              onReady: () => {},
              onSubmit: async (cardFormData: any) => {
                try {
                  const accessToken = await resolveAccessToken();
                  if (!accessToken) throw new Error("Sessão expirada.");

                  const { data, error } = await supabase.functions.invoke(
                    "create-mercadopago-checkout",
                    {
                      body: {
                        action: "process_card",
                        pricing_config_id: selectedPkg.key,
                        order_id: pixData?.orderId,
                        card_data: cardFormData,
                      },
                      headers: { Authorization: `Bearer ${accessToken}` },
                    }
                  );

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
                    toast.info(
                      "Pagamento em análise pela operadora. Seus créditos serão liberados assim que aprovado."
                    );
                    handleBackToPackages();
                  } else {
                    toast.error(
                      "Cartão recusado pelo banco emissor. Verifique os dados ou pague via Pix."
                    );
                  }
                } catch (err: any) {
                  toast.error(err?.message || "Erro ao processar cartão.");
                  throw err;
                }
              },
              onError: (error: any) => {
                console.error("[Card Brick] Error:", error);
              },
            },
          }
        );
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

  const costConsultation = 1;
  const costSingleHouse = getCost("cost_house_1", 1);
  const costSingleFocus = getCost("cost_focus", 1);
  const costAllFocuses = getCost("cost_all_focuses", 3);
  const costFullMap = getCost("cost_full_map", 7);

  // ============================================================================
  // TELA 2: CHECKOUT DEDICADO EM TELA CHEIA (PACOTE À ESQUERDA | PAGAMENTO À DIREITA)
  // ============================================================================
  if (selectedPkg) {
    const checklist = getPackageChecklist(selectedPkg.credits);
    const [int, dec] = fmt(selectedPkg.price_brl);
    const currentCredits = profile?.credits ?? 0;

    return (
      <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 pb-28 md:pt-24 md:pb-24 max-w-6xl mx-auto relative z-10">
        {/* Barra Superior de Retorno */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-white/10">
          <button
            type="button"
            onClick={handleBackToPackages}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/85 hover:text-white text-xs font-ps-ui uppercase tracking-[0.18em] font-semibold transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#F5DE98]" />
            <span>Voltar aos Pacotes</span>
          </button>

          <div className="flex items-center gap-2 text-white/60 text-xs font-ps-ui">
            <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
            <span>Ambiente Criptografado • Liberação Automática</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA DA ESQUERDA (5 cols): RESUMO DO PACOTE ESCOLHIDO + TROCA RÁPIDA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 sm:p-8 rounded-3xl border border-[#C9A227]/45 bg-gradient-to-b from-[#101F3A]/95 via-[#091326]/95 to-[#060C18]/98 shadow-[0_20px_60px_rgba(0,0,0,0.65)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#F5DE98] text-[10px] font-bold uppercase tracking-[0.2em]">
                  Pacote Selecionado
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5DE98]">
                  +{selectedPkg.credits} Crédito{selectedPkg.credits > 1 ? "s" : ""}
                </span>
              </div>

              <h2 className="font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                {selectedPkg.label}
              </h2>
              <p className="text-white/65 text-sm font-light leading-relaxed mb-6">
                {selectedPkg.description || checklist.tagline}
              </p>

              {/* Preço Total */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 block mb-1 font-semibold">
                    Total a Pagar
                  </span>
                  <div className="flex items-baseline text-[#F5DE98]">
                    <span className="text-sm font-bold mr-1">R$</span>
                    <span className="font-ps-display text-4xl font-bold leading-none">{int}</span>
                    <span className="text-base font-semibold">,{dec}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 block mb-1 font-semibold">
                    Seu Saldo Após a Compra
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    {currentCredits} → {currentCredits + Number(selectedPkg.credits)} créditos
                  </span>
                </div>
              </div>

              {/* O que está incluso neste pacote */}
              <div className="space-y-3 mb-6">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5DE98]/80 font-bold block">
                  O que você poderá fazer com estes créditos:
                </span>
                {checklist.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-left">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-xs sm:text-[13px] leading-relaxed font-light">
                      {b}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trocar de pacote com 1 clique sem precisar voltar */}
              {packages.length > 1 && (
                <div className="pt-5 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-semibold block mb-3">
                    Deseja alterar a quantidade de créditos?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {packages.map((p) => {
                      const isCurrent = p.key === selectedPkg.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => {
                            if (!isCurrent) handleSelectPackage(p);
                          }}
                          className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? "border-[#C9A227] bg-[#C9A227]/20 text-white font-bold"
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/25"
                          }`}
                        >
                          <span className="block text-[11px] font-bold">
                            {p.credits} Créd.
                          </span>
                          <span className="block text-[10px] text-[#F5DE98]/80">
                            R$ {Number(p.price_brl || 0).toFixed(0)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DA DIREITA (7 cols): COMO VOCÊ QUER PAGAR (PIX OU CARTÃO) */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl border border-white/15 bg-[#070E1B]/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.75)]">
              {paymentApproved ? (
                <div className="py-12 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="font-ps-display text-3xl sm:text-4xl font-bold text-white">
                    Pagamento Confirmado!
                  </h3>
                  <p className="text-white/75 text-base max-w-md leading-relaxed">
                    Seus <strong className="text-[#F5DE98]">{selectedPkg.credits} créditos</strong> já foram adicionados ao seu saldo e estão prontos para uso imediato.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="px-8 py-4 rounded-2xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(201,162,39,0.3)]"
                    >
                      Iniciar Consulta Agora
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/history")}
                      className="px-6 py-4 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all"
                    >
                      Ir para Minhas Consultas
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5DE98] font-bold block mb-1">
                      Passo Final
                    </span>
                    <h3 className="font-ps-display text-2xl sm:text-3xl font-bold text-white">
                      Como você prefere pagar?
                    </h3>
                  </div>

                  {/* Seletor de Método: PIX vs CARTÃO */}
                  <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-black/50 border border-white/10 mb-8">
                    <button
                      type="button"
                      onClick={() => setPaymentTab("pix")}
                      className={`py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all ${
                        paymentTab === "pix"
                          ? "bg-[#C9A227] text-[#02050A] shadow-[0_6px_24px_rgba(201,162,39,0.35)]"
                          : "text-white/65 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-4 h-4 shrink-0" />
                      <span>Pix (Liberação Imediata)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab("card")}
                      className={`py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all ${
                        paymentTab === "card"
                          ? "bg-[#C9A227] text-[#02050A] shadow-[0_6px_24px_rgba(201,162,39,0.35)]"
                          : "text-white/65 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {/* ABA 1: PIX */}
                  {paymentTab === "pix" && (
                    <div className="flex flex-col items-center text-center">
                      {loadingPix ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                          <div className="w-9 h-9 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin" />
                          <p className="text-white/75 text-xs uppercase tracking-[0.2em] font-semibold">
                            Gerando QR Code Pix...
                          </p>
                        </div>
                      ) : pixError ? (
                        <div className="py-8 px-6 rounded-2xl bg-red-500/10 border border-red-500/30 w-full text-center">
                          <p className="text-red-300 text-sm mb-4">{pixError}</p>
                          <button
                            type="button"
                            onClick={() => generatePixForPackage(selectedPkg)}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Gerar Novamente
                          </button>
                        </div>
                      ) : pixData ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full mb-6">
                            {pixData.qrCodeBase64 && (
                              <div className="md:col-span-5 flex justify-center">
                                <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(201,162,39,0.18)]">
                                  <img
                                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                    alt="QR Code Pix"
                                    className="w-48 h-48 object-contain"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="md:col-span-7 text-left flex flex-col gap-4">
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5DE98] block">
                                  Pagamento Instantâneo via Pix
                                </span>
                                <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-light">
                                  1. Abra o aplicativo do seu banco e escolha <strong className="text-white">Pix → Ler QR Code</strong> ou <strong className="text-white">Pix Copia e Cola</strong>.<br />
                                  2. Assim que finalizar, seus <strong className="text-[#F5DE98]">{selectedPkg.credits} créditos</strong> entram na conta em poucos segundos sem precisar atualizar a página.
                                </p>
                              </div>

                              {pixData.qrCode && (
                                <div className="w-full">
                                  <div className="flex items-center gap-2 p-3 rounded-xl bg-black/60 border border-white/10 mb-3">
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
                                    className="w-full py-4 px-6 rounded-2xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(201,162,39,0.28)] transition-all active:scale-95"
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
                            </div>
                          </div>

                          <div className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 text-left">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="text-emerald-200/90 text-xs leading-snug">
                                Aguardando confirmação do banco... Os créditos serão liberados automaticamente nesta tela.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleManualCheckPix}
                              disabled={checkingPayment}
                              className="shrink-0 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${checkingPayment ? "animate-spin" : ""}`} />
                              <span>Já paguei</span>
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}

                  {/* ABA 2: CARTÃO DE CRÉDITO */}
                  {paymentTab === "card" && (
                    <div className="w-full">
                      <div id="mp-card-brick-container" className="min-h-[360px]" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TELA 1: VITRINE DE PACOTES + GUIA CLARO DE QUANTOS CRÉDITOS VOCÊ PRECISA
  // ============================================================================
  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 pb-28 md:pt-24 md:pb-24 max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#F5DE98] text-[10px] uppercase tracking-[0.24em] font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
          Passaporte de Coordenadas
        </span>
        <h1 className="font-ps-display text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
          Escolha Seu Pacote de Créditos
        </h1>
        <p className="text-white/65 text-sm sm:text-base md:text-lg font-light font-ps-ui max-w-2xl mx-auto leading-relaxed">
          Entenda abaixo exatamente quantos créditos você precisa para o seu objetivo e libere seu mapa na hora via Pix ou Cartão.
        </p>

        {profile && (
          <div className="mt-6 inline-flex items-center gap-4 py-3 px-6 rounded-2xl bg-[#08111F]/90 border border-[#C9A227]/30 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
            <span className="text-white/55 text-[11px] uppercase tracking-[0.2em] font-semibold">
              Seu Saldo Atual
            </span>
            <span className="h-5 w-px bg-white/10" />
            <span className="text-[#F5DE98] font-ps-display text-2xl sm:text-3xl font-bold leading-none">
              {profile.credits}{" "}
              <span className="text-xs uppercase tracking-widest text-[#F5DE98]/65 font-ps-ui font-medium">
                crédito{profile.credits === 1 ? "" : "s"}
              </span>
            </span>
          </div>
        )}
      </motion.div>

      {/* GUIA RÁPIDO ANTES DOS PACOTES: "DE QUANTOS CRÉDITOS EU PRECISO?" */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-12 p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#07101E]/85 backdrop-blur-xl shadow-[0_16px_45px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center justify-center gap-2 mb-5">
          <HelpCircle className="w-4 h-4 text-[#C9A227]" />
          <span className="text-[11px] font-ps-ui uppercase tracking-[0.22em] text-[#F5DE98] font-bold">
            Como Funcionam os Créditos (Guia Rápido)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Objetivo 1 • Direto ao Ponto
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  {costConsultation} Crédito
                </span>
              </div>
              <h4 className="font-ps-display text-lg font-bold text-white mb-1.5">
                Descobrir Meu Destino Principal
              </h4>
              <p className="text-white/60 text-xs leading-relaxed font-light">
                Com apenas <strong className="text-white">1 crédito</strong> você calcula sua Revolução Solar (Por Cidade, Casa ou Intenção), recebe seu <strong className="text-white">1º Foco Principal grátis</strong> e vê <strong className="text-white">9 Rotas Alternativas</strong> em 3 Continentes.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#C9A227]/[0.06] border border-[#C9A227]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5DE98]">
                  Objetivo 2 • Mais Escolhido
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#F5DE98] text-[11px] font-bold">
                  3 a 5 Créditos
                </span>
              </div>
              <h4 className="font-ps-display text-lg font-bold text-white mb-1.5">
                Comparar Cidades ou Abrir Focos
              </h4>
              <p className="text-white/65 text-xs leading-relaxed font-light">
                Ideal se você quer testar mais de uma cidade para o aniversário, abrir uma <strong className="text-white">Casa extra ({costSingleHouse} créd.)</strong> ou destravar <strong className="text-white">todos os 6 Focos ({costAllFocuses} créd.)</strong> de Dinheiro, Amor, Carreira e Saúde.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                  Objetivo 3 • Visão 360º
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold">
                  {costConsultation + costFullMap}+ Créditos
                </span>
              </div>
              <h4 className="font-ps-display text-lg font-bold text-white mb-1.5">
                Desbloquear Todas as 12 Casas
              </h4>
              <p className="text-white/60 text-xs leading-relaxed font-light">
                Para fazer sua consulta inicial (<strong className="text-white">{costConsultation} créd.</strong>) e já liberar o <strong className="text-white">Mapa Completo com todas as 12 Casas ({costFullMap} créd.)</strong>, revelando qual cidade do mundo ativa cada área da sua vida.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-7 h-7 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#F5DE98]/70 font-ps-ui text-[11px] uppercase tracking-[0.2em] font-semibold">
            Carregando pacotes disponíveis...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto items-stretch pt-2">
          {packages.map((pkg, i) => {
            const highlight = i === 1;
            const [int, dec] = fmt(pkg.price_brl);
            const checklist = getPackageChecklist(pkg.credits);
            const perCredit =
              pkg.price_brl && pkg.credits > 0
                ? (pkg.price_brl / pkg.credits).toFixed(2).replace(".", ",")
                : null;

            return (
              <motion.div
                key={pkg.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-7 sm:p-8 text-left relative transition-all duration-400 flex flex-col justify-between rounded-3xl ${
                  highlight
                    ? "border-2 border-[#C9A227]/70 bg-gradient-to-b from-[#101F3A]/95 via-[#091326]/95 to-[#060C18]/98 backdrop-blur-xl shadow-[0_22px_60px_rgba(201,162,39,0.18)] md:-translate-y-2 z-10"
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
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-ps-ui ${
                        highlight
                          ? "bg-[#C9A227]/20 text-[#F5DE98] border border-[#C9A227]/40"
                          : "bg-white/[0.05] text-white/70 border border-white/10"
                      }`}
                    >
                      {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/45 font-medium">
                      {checklist.idealFor}
                    </span>
                  </div>

                  <h3
                    className={`font-ps-display text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${
                      highlight ? "text-white" : "text-white/95"
                    }`}
                  >
                    {pkg.label}
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm font-light font-ps-ui mb-5 leading-relaxed">
                    {pkg.description || checklist.tagline}
                  </p>

                  {/* Preço */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/[0.07] mb-6 flex items-baseline justify-between">
                    <div className="flex items-start text-white">
                      <span className="text-[#F5DE98]/70 text-xs font-bold mt-1.5 mr-1">R$</span>
                      <span
                        className={`font-ps-display text-4xl sm:text-5xl font-bold leading-none tracking-tight ${
                          highlight ? "text-[#F5DE98]" : "text-white"
                        }`}
                      >
                        {int}
                      </span>
                      <span className="text-white/60 text-sm mt-1">,{dec}</span>
                    </div>

                    {perCredit && pkg.credits > 1 && (
                      <span className="text-[11px] text-emerald-300/90 font-medium">
                        R$ {perCredit} / créd.
                      </span>
                    )}
                  </div>

                  {/* Checklist do que este pacote faz */}
                  <div className="space-y-2.5 mb-7">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold block mb-2">
                      O que você libera com este pacote:
                    </span>
                    {checklist.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            highlight ? "text-[#F5DE98]" : "text-[#C9A227]/80"
                          }`}
                        />
                        <span className="text-white/80 text-xs leading-relaxed font-light">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-4 text-xs font-ps-ui uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-2xl ${
                      highlight
                        ? "bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] shadow-[0_10px_30px_rgba(201,162,39,0.3)] hover:scale-[1.02] active:scale-95"
                        : "bg-white/[0.07] border border-[#C9A227]/35 text-[#F5DE98] hover:bg-[#C9A227] hover:text-[#02050A] hover:border-[#C9A227] active:scale-95"
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Continuar para Pagamento</span>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </button>
                  <p className="text-center text-[10px] text-white/40 uppercase tracking-[0.16em] mt-3">
                    Pix Imediato ou Cartão em até 12x
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tabela de Custos Detalhada */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16 pt-12 border-t border-white/10"
      >
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase font-ps-ui tracking-[0.26em] text-[#F5DE98]/75 block mb-2 font-semibold">
            Tabela de Uso no Sistema
          </span>
          <h3 className="font-ps-display text-2xl md:text-3xl text-white font-bold tracking-tight">
            Quanto Custa Cada Recurso Dentro do Mapa
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {costs.map((item) => {
            const Icon = ICONS[item.key] || Map;
            return (
              <div
                key={item.key}
                className="p-5 text-left rounded-2xl border border-white/[0.08] bg-[#08111F]/80 hover:border-[#C9A227]/30 transition-all duration-300 flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F5DE98]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#F5DE98] font-ps-ui text-[10px] uppercase tracking-[0.15em] font-bold">
                      {item.credits} crédito{item.credits > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="font-ps-display text-base font-bold text-white mb-1.5">
                    {item.label}
                  </p>
                </div>
                <p className="text-white/55 text-xs font-ps-ui font-light leading-relaxed">
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
