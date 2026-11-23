import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  Share2,
  Users,
  Video,
  Compass,
  ShieldCheck,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { calculateCommissionBrl, formatBrl } from "@/lib/affiliates";

const FAQ_ITEMS = [
  {
    id: "faq-free",
    q: "Preciso pagar alguma coisa para participar?",
    a: "Não. O cadastro no Programa de Parceiros é 100% gratuito, sem mensalidade e sem meta mínima de vendas.",
  },
  {
    id: "faq-price",
    q: "O preço muda para quem compra pelo meu link?",
    a: "Não. Quem entra pelo seu link paga exatamente os mesmos valores oficiais (R$ 19,90 na 1 Casa, R$ 49,90 no Pacote 3 Consultas e R$ 99,90 no Mapa Completo). Os 20% saem da nossa margem.",
  },
  {
    id: "faq-window",
    q: "E se a pessoa clicar hoje e comprar só daqui a alguns dias?",
    a: "A comissão continua sendo sua. O rastreamento guarda sua indicação por 30 dias no navegador e vincula automaticamente na conta do cliente assim que ele entra.",
  },
  {
    id: "faq-payout",
    q: "Como acompanho minhas vendas e recebo no Pix?",
    a: "No seu painel em /afiliado você vê cliques, cadastros, vendas confirmadas e saldo em tempo real. Basta cadastrar sua chave Pix no painel para receber seus repasses.",
  },
  {
    id: "faq-self",
    q: "Posso ganhar comissão comprando pelo meu próprio link?",
    a: "Não. O sistema valida compras reais feitas por terceiros e bloqueia automaticamente auto-indicação.",
  },
];

const PRESETS = [
  { label: "Amigos", countLabel: "10 vendas", sales: 10 },
  { label: "Criador", countLabel: "35 vendas", sales: 35 },
  { label: "Influencer", countLabel: "100 vendas", sales: 100 },
];

export const PartnersLanding = () => {
  const { user } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const navigate = useNavigate();

  const [monthlySales, setMonthlySales] = useState<number>(35);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Programa de Parceiros (20% no Pix) | Protocolo Solar";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyCta(heroBottom < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mix realista: 30% 1 Casa (19,90) + 40% Expansão (49,90) + 30% Mapa Completo (99,90)
  const comm1 = calculateCommissionBrl(19.9, 20);
  const comm2 = calculateCommissionBrl(49.9, 20);
  const comm3 = calculateCommissionBrl(99.9, 20);
  const avgCommissionPerSale = 0.3 * comm1 + 0.4 * comm2 + 0.3 * comm3;
  const estimatedMonthly = Math.round(monthlySales * avgCommissionPerSale * 100) / 100;
  const estimatedFullMapOnly = Math.round(comm3 * monthlySales * 100) / 100;
  const estimatedAnnual = Math.round(estimatedMonthly * 12 * 100) / 100;

  const handlePrimaryCta = () => {
    if (user) {
      navigate("/afiliado");
    } else {
      navigate("/auth?returnTo=%2Fafiliado");
    }
  };

  const ctaLabel = isAffiliate
    ? "Abrir Meu Painel"
    : user
      ? "Ativar Meu Cadastro"
      : "Ativar Meu Link Grátis";

  const sliderProgress = ((monthlySales - 5) / (200 - 5)) * 100;

  return (
    <div className="w-full min-h-[100svh] text-[#F2F4F7] relative z-10 overflow-x-hidden pb-32 lg:pb-24 selection:bg-[#C9A227]/30">
      {/* Desktop Back Button (matching Technology.tsx) */}
      <div className="hidden lg:block relative z-20 max-w-6xl mx-auto px-6 pt-8">
        <BackButton label="Voltar" to="/" />
      </div>

      {/* 1. HERO EDITORIAL COM ÓRBITA SOLAR */}
      <section
        ref={heroRef}
        className="relative max-w-4xl mx-auto px-5 sm:px-6 pt-20 lg:pt-8 pb-16 sm:pb-24 text-center"
      >
        {/* Anéis orbitais sutis — assinatura visual Protocolo Solar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] -z-10"
        >
          <div
            className="absolute inset-0 rounded-full opacity-35 blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(201,162,39,0.28) 0%, rgba(201,162,39,0.06) 45%, transparent 72%)",
            }}
          />
          <div className="absolute inset-8 rounded-full border border-[#C9A227]/[0.11]" />
          <div className="absolute inset-20 rounded-full border border-[#E8D59B]/[0.08]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 backdrop-blur-xl text-[11px] font-ps-ui uppercase font-semibold tracking-[0.22em] text-[#F5DE98] mb-7"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E5C158] shrink-0" />
          <span>Programa de Parceiros</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06 }}
          className="font-ps-display font-normal text-[2.35rem] sm:text-5xl md:text-[3.75rem] tracking-[-0.02em] leading-[1.09] text-white mb-6"
        >
          Indique o Protocolo Solar e ganhe{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5DE98] via-[#E5C158] to-[#C9A227]">
            20% no Pix
          </span>{" "}
          a cada venda.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="font-ps-ui text-[#CBD5E1] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-9"
        >
          O valor para quem compra continua exatamente o mesmo. Você recebe seu número de cadastro em segundos, compartilha seu link curto e acompanha tudo ao vivo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="w-full sm:w-auto min-h-[54px] px-8 py-3.5 rounded-xl font-ps-ui text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#02050A] bg-[#C9A227] hover:bg-[#D9B643] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2.5 shadow-[0_0_32px_rgba(201,162,39,0.28)]"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <a
            href="#simulador"
            className="w-full sm:w-auto min-h-[54px] px-7 py-3.5 rounded-xl font-ps-ui text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E8D59B] bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 transition-all inline-flex items-center justify-center"
          >
            Simular Ganhos
          </a>
        </motion.div>

        {/* 3 Métricas Editoriais (espelhando a estética da Home: 12 · 365 · ±0.01°) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="grid grid-cols-3 gap-4 sm:gap-10 max-w-xl mx-auto mt-14 pt-8 border-t border-white/[0.08]"
        >
          <div>
            <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white tabular-nums">
              20%
            </p>
            <p className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] mt-1">
              Por venda no Pix
            </p>
          </div>
          <div>
            <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white tabular-nums">
              30 dias
            </p>
            <p className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] mt-1">
              Janela garantida
            </p>
          </div>
          <div>
            <p className="font-ps-display font-normal text-2xl sm:text-3xl text-white tabular-nums">
              R$ 0
            </p>
            <p className="font-ps-ui text-[11px] uppercase tracking-[0.16em] text-[#AAB6C4] mt-1">
              Para começar
            </p>
          </div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-20 sm:space-y-28">
        {/* 2. SIMULADOR INTERATIVO DE GANHOS */}
        <section
          id="simulador"
          className="scroll-mt-24 p-6 sm:p-10 rounded-[28px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A30]/92 via-[#07101C]/96 to-[#040912]/98 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-ps-ui uppercase tracking-[0.2em] text-[#E8D59B] font-semibold mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C9A227]" />
                  Simulador de Comissão
                </span>
                <h2 className="font-ps-display font-normal text-2xl sm:text-4xl text-white leading-tight">
                  Quanto você pode receber por mês?
                </h2>
                <p className="font-ps-ui text-sm text-[#AAB6C4] mt-2 leading-relaxed">
                  Escolha um cenário ou ajuste o controle conforme o tamanho da sua rede.
                </p>
              </div>

              {/* 3 Presets Limpos */}
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => {
                  const active = monthlySales === p.sales;
                  return (
                    <button
                      key={p.sales}
                      type="button"
                      onClick={() => setMonthlySales(p.sales)}
                      className={`min-h-[48px] px-2 sm:px-3 py-2.5 rounded-xl border text-center transition-all ${
                        active
                          ? "bg-[#C9A227]/16 border-[#C9A227]/70 text-[#F5DE98]"
                          : "bg-white/[0.03] border-white/10 text-[#CBD5E1] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="block font-ps-ui text-[11px] sm:text-xs font-semibold truncate">
                        {p.label}
                      </span>
                      <span className="block font-ps-ui text-[10px] sm:text-[11px] text-[#AAB6C4] mt-0.5 tabular-nums">
                        {p.countLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Controle Deslizante */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-ps-ui text-xs uppercase tracking-[0.14em] text-[#AAB6C4]">
                    Vendas por mês
                  </span>
                  <span className="font-ps-display font-normal text-3xl text-[#F5DE98] tabular-nums whitespace-nowrap shrink-0">
                    {monthlySales}{" "}
                    <span className="font-ps-ui text-xs uppercase tracking-[0.12em] text-[#AAB6C4]">
                      vendas
                    </span>
                  </span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(Number(e.target.value))}
                  aria-label="Quantidade estimada de vendas por mês"
                  style={{
                    background: `linear-gradient(to right, #C9A227 0%, #E8D59B ${sliderProgress}%, rgba(255,255,255,0.14) ${sliderProgress}%, rgba(255,255,255,0.14) 100%)`,
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#E8D59B]"
                />
                <div className="flex justify-between font-ps-ui text-xs text-[#94A3B8] tabular-nums">
                  <span>5</span>
                  <span>50</span>
                  <span>100</span>
                  <span>200 vendas</span>
                </div>
              </div>

              {/* Tabela Limpa de Comissões por Pacote (sem micro-caixas apertadas) */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#040912]/70 divide-y divide-white/[0.06]">
                <div className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-ps-ui font-medium text-white">1 Casa Avulsa</span>
                    <span className="font-ps-ui text-xs text-[#94A3B8] ml-2">R$ 19,90</span>
                  </div>
                  <span className="font-ps-ui font-semibold text-[#F5DE98] tabular-nums shrink-0">
                    +{formatBrl(comm1)}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-ps-ui font-medium text-white">Pacote 3 Consultas</span>
                    <span className="font-ps-ui text-xs text-[#94A3B8] ml-2">R$ 49,90</span>
                  </div>
                  <span className="font-ps-ui font-semibold text-[#F5DE98] tabular-nums shrink-0">
                    +{formatBrl(comm2)}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between gap-3 text-sm bg-[#C9A227]/[0.06]">
                  <div className="min-w-0">
                    <span className="font-ps-ui font-medium text-[#FFF3D1]">Mapa Completo</span>
                    <span className="font-ps-ui text-xs text-[#E8D59B]/75 ml-2">R$ 99,90</span>
                  </div>
                  <span className="font-ps-ui font-bold text-[#F5DE98] tabular-nums shrink-0">
                    +{formatBrl(comm3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Painel de Resultado (Foco Silencioso) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#040912]/90 border border-[#C9A227]/35 space-y-6">
              <div>
                <span className="font-ps-ui text-[11px] uppercase tracking-[0.2em] text-[#E8D59B] block mb-2">
                  Estimativa Mensal (Mix Médio)
                </span>
                <p className="font-ps-display font-normal text-4xl sm:text-5xl text-white tracking-tight leading-none tabular-nums">
                  {formatBrl(estimatedMonthly)}
                </p>
                <p className="font-ps-ui text-sm text-[#AAB6C4] mt-3 tabular-nums">
                  Em 12 meses:{" "}
                  <strong className="text-white font-semibold">{formatBrl(estimatedAnnual)}</strong>
                </p>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-3 font-ps-ui text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#AAB6C4]">Se todas forem Mapa Completo</span>
                  <span className="text-[#F5DE98] font-semibold tabular-nums">
                    {formatBrl(estimatedFullMapOnly)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#AAB6C4]">Custo para participar</span>
                  <span className="text-white font-semibold tabular-nums">R$ 0,00</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrimaryCta}
                className="w-full min-h-[52px] px-5 py-3.5 rounded-xl font-ps-ui text-xs font-bold uppercase tracking-[0.16em] text-[#02050A] bg-[#C9A227] hover:bg-[#D9B643] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(201,162,39,0.22)]"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. COMO FUNCIONA EM 3 PASSOS (Timeline Editorial Limpa — sem caixas repetitivas) */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A227] font-semibold block mb-2.5">
              Passo a Passo
            </span>
            <h2 className="font-ps-display font-normal text-3xl sm:text-4xl text-white leading-tight">
              Do cadastro ao primeiro Pix em minutos
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#C9A227]/35 to-transparent"
            />

            <div className="relative text-center md:text-left space-y-4">
              <div className="w-16 h-16 mx-auto md:mx-0 rounded-full border border-[#C9A227]/40 bg-[#07101C] flex items-center justify-center shadow-[0_0_32px_rgba(201,162,39,0.12)]">
                <BadgeCheck className="w-6 h-6 text-[#F5DE98]" />
              </div>
              <div>
                <span className="font-ps-ui text-[11px] uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
                  Passo 1
                </span>
                <h3 className="font-ps-display font-normal text-2xl text-white mt-1">
                  Receba seu nº de cadastro
                </h3>
              </div>
              <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
                Ative sua conta em 10 segundos para gerar seu número oficial de parceiro e seu link curto{" "}
                <span className="font-mono text-xs text-[#E8D59B]">/i/482917</span>.
              </p>
            </div>

            <div className="relative text-center md:text-left space-y-4">
              <div className="w-16 h-16 mx-auto md:mx-0 rounded-full border border-[#C9A227]/40 bg-[#07101C] flex items-center justify-center shadow-[0_0_32px_rgba(201,162,39,0.12)]">
                <Share2 className="w-6 h-6 text-[#F5DE98]" />
              </div>
              <div>
                <span className="font-ps-ui text-[11px] uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
                  Passo 2
                </span>
                <h3 className="font-ps-display font-normal text-2xl text-white mt-1">
                  Compartilhe com o Kit Pronto
                </h3>
              </div>
              <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
                Use mensagens prontas para WhatsApp, sequência de 3 Stories, roteiro de Reels e arte 9:16 já personalizados com seu link.
              </p>
            </div>

            <div className="relative text-center md:text-left space-y-4">
              <div className="w-16 h-16 mx-auto md:mx-0 rounded-full border border-[#C9A227]/40 bg-[#07101C] flex items-center justify-center shadow-[0_0_32px_rgba(201,162,39,0.12)]">
                <Wallet className="w-6 h-6 text-[#F5DE98]" />
              </div>
              <div>
                <span className="font-ps-ui text-[11px] uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
                  Passo 3
                </span>
                <h3 className="font-ps-display font-normal text-2xl text-white mt-1">
                  Acompanhe e receba no Pix
                </h3>
              </div>
              <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
                Cada compra confirmada entra na hora no seu painel em{" "}
                <span className="font-mono text-xs text-[#E8D59B]">/afiliado</span> e é repassada direto na sua chave Pix.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PARA QUEM É (Bento Assimétrico idêntico à Technology.tsx) */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-ps-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A227] font-semibold block mb-2.5">
              Para Quem É
            </span>
            <h2 className="font-ps-display font-normal text-3xl sm:text-4xl text-white leading-tight">
              Feito para quem recomenda com naturalidade
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div className="md:col-span-2 p-7 sm:p-10 rounded-[24px] border border-[#C9A227]/30 bg-gradient-to-br from-[#101C32]/92 via-[#08111F]/95 to-[#050A14]/98 relative overflow-hidden flex flex-col justify-between gap-6">
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/12 border border-[#C9A227]/30 text-[11px] font-ps-ui uppercase tracking-[0.18em] text-[#F5DE98] font-semibold">
                  <Users className="w-3.5 h-3.5" /> Clientes & Amigos
                </div>
                <h3 className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-snug">
                  Indique 5 Mapas Completos e recupere 100% do seu investimento.
                </h3>
                <p className="font-ps-ui text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-xl">
                  Postou o destino do seu próximo aniversário nos Stories e seus amigos perguntaram qual app você usou? Compartilhe seu link de parceiro — cada Mapa Completo gera{" "}
                  <strong className="text-[#F5DE98] font-semibold">{formatBrl(comm3)}</strong> direto para você.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-ps-ui text-[#AAB6C4] relative z-10 pt-2 border-t border-white/[0.07]">
                <span>Funciona no WhatsApp</span>
                <span className="text-[#C9A227]">•</span>
                <span>Sticker de Link nos Stories</span>
                <span className="text-[#C9A227]">•</span>
                <span>Bio do Instagram e TikTok</span>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex-1 p-6 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-[#C9A227]/20 flex flex-col justify-center space-y-2.5">
                <Video className="w-5 h-5 text-[#E5C158]" />
                <h3 className="font-ps-display font-normal text-xl text-white">
                  Criadores & Influenciadores
                </h3>
                <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
                  Astrologia, viagens ou lifestyle: conteúdo que desperta curiosidade imediata sobre o próximo aniversário.
                </p>
              </div>

              <div className="flex-1 p-6 sm:p-7 rounded-[24px] bg-[#07101A]/90 border border-[#C9A227]/20 flex flex-col justify-center space-y-2.5">
                <Compass className="w-5 h-5 text-[#E5C158]" />
                <h3 className="font-ps-display font-normal text-xl text-white">
                  Astrólogos & Agentes
                </h3>
                <p className="font-ps-ui text-sm text-[#AAB6C4] leading-relaxed">
                  Indique a ferramenta para clientes planejarem a viagem da Revolução Solar e gere renda recorrente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4.5 PROTOCOLO DE DIVULGAÇÃO AUTÊNTICA & COMPLIANCE CONAR */}
        <section className="rounded-[26px] border border-[#C9A227]/30 bg-gradient-to-br from-[#0D1A30]/92 via-[#07101E]/95 to-[#050A14]/98 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-2 font-ps-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A227] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Protocolo de Divulgação que Converte
              </span>
              <h2 className="font-ps-display font-normal text-2xl sm:text-3xl text-white leading-tight">
                Sentir → Medir → Recomendar (sem parecer venda forçada)
              </h2>
            </div>
            <span className="self-start sm:self-auto px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-200">
              Compliance CONAR • #publi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F5DE98]">
                01 • Valide seu próprio ano
              </span>
              <p className="font-ps-ui text-sm text-[#CBD5E1] leading-relaxed">
                Antes de indicar, teste gratuitamente o seu <strong className="text-white">Aniversário Passado</strong>. Mostrar o próprio resultado real gera 3x mais confiança do que prometer resultados prontos.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F5DE98]">
                02 • Explique o mecanismo em 15s
              </span>
              <p className="font-ps-ui text-sm text-[#CBD5E1] leading-relaxed">
                Mostre a diferença prática: não é horóscopo genérico — é cálculo astronômico (Swiss Ephemeris) que revela como mudar a cidade do aniversário muda a Casa principal do ano.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F5DE98]">
                03 • Sinalize a parceria
              </span>
              <p className="font-ps-ui text-sm text-[#CBD5E1] leading-relaxed">
                Use <strong className="text-white">#publi</strong> ou <strong className="text-white">#parceiro</strong> (norma CONAR) e lembre sua audiência: o preço oficial (R$ 19,90 / 49,90 / 99,90) nunca muda pelo seu link.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ (Usando o Accordion oficial do Protocolo Solar — idêntico à Technology.tsx) */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 font-ps-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A227] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparência Total
            </span>
            <h2 className="font-ps-display font-normal text-3xl sm:text-4xl text-white">
              Dúvidas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible defaultValue="faq-free" className="w-full space-y-3.5">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-white/[0.08] bg-[#07101A]/85 rounded-2xl px-5 sm:px-6 backdrop-blur-md overflow-hidden"
              >
                <AccordionTrigger className="text-white hover:text-[#F5DE98] hover:no-underline py-5 font-ps-display font-normal text-lg sm:text-xl tracking-wide text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-ps-ui text-[#CBD5E1] text-sm sm:text-base leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 6. CTA FINAL (Alinhado ao CTA final da Technology.tsx) */}
        <section className="p-6 sm:p-12 rounded-[28px] border border-[#C9A227]/35 bg-gradient-to-b from-[#0E1B31]/95 to-[#060C18]/98 text-center shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-5">
          <h2 className="font-ps-display font-normal text-2xl sm:text-4xl text-white leading-tight">
            Pronto para ativar seu cadastro de parceiro?
          </h2>
          <p className="font-ps-ui text-sm sm:text-base text-[#AAB6C4] max-w-lg mx-auto leading-relaxed">
            Em menos de 10 segundos você recebe seu número oficial, seu link curto e o kit completo para divulgar hoje mesmo.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="w-full sm:w-auto min-h-[54px] px-5 sm:px-8 py-3.5 rounded-xl font-ps-ui text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[#02050A] bg-[#C9A227] hover:bg-[#D9B643] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_32px_rgba(201,162,39,0.28)] whitespace-nowrap"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </section>
      </div>

      {/* Barra Fixa Mobile (aparece após rolar a Hero) */}
      {showStickyCta && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-3 bg-[#02050A]/94 backdrop-blur-xl border-t border-[#C9A227]/25"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
        >
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="w-full min-h-[50px] px-5 py-3 rounded-xl font-ps-ui text-xs font-bold uppercase tracking-[0.15em] text-[#02050A] bg-[#C9A227] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnersLanding;
