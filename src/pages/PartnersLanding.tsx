import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  Clock,
  Share2,
  CheckCircle2,
  ChevronDown,
  Users,
  Video,
  Compass,
  ShieldCheck,
  TrendingUp,
  Gift,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { calculateCommissionBrl, formatBrl } from "@/lib/affiliates";

const FAQ_ITEMS = [
  {
    q: "Preciso pagar alguma coisa para ser afiliado?",
    a: "Não. A entrada no Programa de Parceiros é 100% gratuita, sem mensalidade e sem meta mínima de vendas.",
  },
  {
    q: "O preço muda para quem compra pelo meu link?",
    a: "Não! Seus amigos ou seguidores pagam exatamente os mesmos valores oficiais (R$ 19,90 na 1 Casa, R$ 49,90 no Pacote Expansão e R$ 99,90 no Mapa Completo). Os 20% saem da nossa margem.",
  },
  {
    q: "E se a pessoa clicar hoje e comprar só daqui a alguns dias?",
    a: "A comissão continua sendo sua. Nosso rastreamento guarda sua indicação por 30 dias no navegador e vincula na conta do cliente assim que ele faz login.",
  },
  {
    q: "Como acompanho minhas vendas e recebo o dinheiro?",
    a: "No seu painel em /afiliado você vê cliques, cadastros, vendas confirmadas e saldo em tempo real. Basta informar sua chave Pix no painel para receber seus repasses.",
  },
  {
    q: "Posso ganhar comissão comprando pelo meu próprio link?",
    a: "Não. O sistema valida compras reais feitas por outras pessoas e bloqueia automaticamente auto-indicação.",
  },
];

const PRESETS = [
  { label: "Amigos & Família", sales: 10 },
  { label: "Perfil / Criador", sales: 35 },
  { label: "Influenciador", sales: 100 },
];

export const PartnersLanding = () => {
  const { user } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const navigate = useNavigate();

  const [monthlySales, setMonthlySales] = useState<number>(35);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyCta(heroBottom < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mix realista de vendas: 30% 1 Casa (19,90) + 40% Expansão (49,90) + 30% Mapa Completo (99,90)
  // Ticket médio ponderado = R$ 55,90 -> comissão 20% = R$ 11,18/venda
  const avgCommissionPerSale =
    0.3 * calculateCommissionBrl(19.9, 20) +
    0.4 * calculateCommissionBrl(49.9, 20) +
    0.3 * calculateCommissionBrl(99.9, 20);
  const estimatedMonthly = Math.round(monthlySales * avgCommissionPerSale * 100) / 100;
  const estimatedFullMapOnly = calculateCommissionBrl(99.9, 20) * monthlySales;
  const estimatedAnnual = estimatedMonthly * 12;

  const handlePrimaryCta = () => {
    if (user) {
      navigate("/afiliado");
    } else {
      navigate("/auth?returnTo=%2Fafiliado");
    }
  };

  const ctaLabel = isAffiliate
    ? "Abrir Meu Painel de Afiliado"
    : user
      ? "Ativar Meu Link de Afiliado (10s)"
      : "Quero Meu Link de Afiliado Grátis";

  return (
    <div className="min-h-[100dvh] text-white relative z-10 overflow-x-hidden pb-32 lg:pb-24">
      {/* Glow orbital sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full opacity-25 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(245,176,65,0.55) 0%, rgba(230,126,34,0.18) 45%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-20 lg:pt-14 space-y-20 sm:space-y-24">
        {/* 1. HERO (3s) */}
        <section ref={heroRef} className="text-center max-w-4xl mx-auto space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#FFF3D1] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5B041]" />
            Programa de Parceiros • 20% Direto no Pix
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="font-ps-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.06] text-white"
          >
            Indique o Protocolo Solar e ganhe{" "}
            <span className="bg-gradient-to-r from-[#FFF3D1] via-[#F5B041] to-[#E67E22] bg-clip-text text-transparent">
              20% em Pix
            </span>{" "}
            a cada venda.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="font-ps-ui text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Compartilhe com amigos, Stories, Reels ou grupos de WhatsApp. O valor para quem compra não muda — você ativa seu link em 10 segundos e acompanha tudo ao vivo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(245,176,65,0.35)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55 font-ps-ui pt-1"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B041]" /> Cadastro gratuito
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5B041]" /> Cookie de 30 dias
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#F5B041]" /> Repasse via Pix
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#F5B041]" /> Kit pronto para Stories e WhatsApp
            </span>
          </motion.div>
        </section>

        {/* 2. SIMULADOR INTERATIVO DE GANHOS + TABELA DE COMISSÕES */}
        <section className="p-6 sm:p-10 rounded-[32px] border border-[#C9A227]/30 bg-gradient-to-b from-[#0E1A32]/85 via-[#081020]/95 to-[#050811]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5DE98] font-bold mb-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Simulador de Ganhos
                </span>
                <h2 className="font-ps-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Quanto você pode faturar indicando?
                </h2>
                <p className="text-white/60 text-sm font-ps-ui mt-1">
                  Arraste para simular quantas pessoas compram pelo seu link por mês.
                </p>
              </div>

              {/* Presets rápidos */}
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.sales}
                    type="button"
                    onClick={() => setMonthlySales(p.sales)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-ps-ui font-semibold border transition-all ${
                      monthlySales === p.sales
                        ? "bg-[#C9A227]/20 border-[#C9A227] text-[#FFF3D1]"
                        : "bg-white/[0.03] border-white/10 text-white/65 hover:text-white"
                    }`}
                  >
                    {p.label} ({p.sales}/mês)
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="space-y-3 pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-white/55">
                    Vendas confirmadas / mês
                  </span>
                  <span className="font-ps-display text-3xl font-bold text-[#F5DE98]">
                    {monthlySales}{" "}
                    <span className="text-xs font-mono uppercase text-white/50">vendas</span>
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
                  className="w-full h-2.5 rounded-full appearance-none bg-white/15 accent-[#F5B041] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>5 vendas</span>
                  <span>50 vendas</span>
                  <span>100 vendas</span>
                  <span>200 vendas</span>
                </div>
              </div>

              {/* 3 pacotes reais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/45">
                    1 Casa (R$ 19,90)
                  </p>
                  <p className="font-mono text-lg font-bold text-[#F5DE98] mt-0.5">
                    +{formatBrl(calculateCommissionBrl(19.9, 20))}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/45">
                    Expansão (R$ 49,90)
                  </p>
                  <p className="font-mono text-lg font-bold text-[#F5DE98] mt-0.5">
                    +{formatBrl(calculateCommissionBrl(49.9, 20))}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#C9A227]/12 border border-[#C9A227]/35">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#F5DE98]/85">
                    Mapa Completo (R$ 99,90)
                  </p>
                  <p className="font-mono text-lg font-bold text-[#FFF3D1] mt-0.5">
                    +{formatBrl(calculateCommissionBrl(99.9, 20))}
                  </p>
                </div>
              </div>
            </div>

            {/* Resultado do Simulador */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#C9A227]/18 via-[#0A1324]/95 to-[#050912]/95 border border-[#C9A227]/45 space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5DE98]/85 block mb-1.5">
                  Estimativa Mensal (Mix Médio)
                </span>
                <p className="font-ps-display text-4xl sm:text-5xl font-bold text-[#FFF3D1] tracking-tight leading-none">
                  {formatBrl(estimatedMonthly)}
                </p>
                <p className="text-xs text-white/55 mt-2">
                  Projeção anual: <strong className="text-white/90">{formatBrl(estimatedAnnual)}</strong>
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Se todas forem Mapa Completo:</span>
                  <strong className="font-mono text-[#F5DE98]">
                    {formatBrl(estimatedFullMapOnly)}/mês
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Investimento para começar:</span>
                  <strong className="font-mono text-emerald-300">R$ 0,00</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrimaryCta}
                className="w-full min-h-[50px] px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs font-extrabold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. COMO FUNCIONA EM 3 PASSOS (BENTO ASSIMÉTRICO) */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#F5DE98]/80 font-bold">
              Simples do começo ao Pix
            </span>
            <h2 className="font-ps-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Comece em menos de 1 minuto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-[#08111F]/90 border border-white/10 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center font-mono font-bold text-[#F5DE98]">
                01
              </div>
              <h3 className="font-ps-display text-xl font-bold text-white">
                Ative seu código exclusivo
              </h3>
              <p className="text-sm text-white/60 font-ps-ui leading-relaxed">
                Entre com sua conta, escolha seu código (ex.: <span className="font-mono text-[#F5DE98]">?ref=SEUNOME</span>) e informe sua chave Pix. Zero burocracia.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#08111F]/90 border border-[#C9A227]/30 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#C9A227]/20 border border-[#C9A227]/50 flex items-center justify-center text-[#F5DE98]">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-ps-display text-xl font-bold text-white">
                Use nosso Kit Pronto
              </h3>
              <p className="text-sm text-white/60 font-ps-ui leading-relaxed">
                Dentro do seu painel você já recebe mensagens de WhatsApp, sequência de 3 Stories, roteiro de Reels/TikTok e arte 9:16 pronta com seu link.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#08111F]/90 border border-white/10 space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center text-emerald-300">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-ps-display text-xl font-bold text-white">
                Acompanhe e receba no Pix
              </h3>
              <p className="text-sm text-white/60 font-ps-ui leading-relaxed">
                Cada compra via Pix ou Cartão entra instantaneamente no seu histórico em <span className="font-mono text-white/85">/afiliado</span> e é repassada direto para sua chave Pix.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PARA QUEM É */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
            <Users className="w-6 h-6 text-[#F5B041]" />
            <h3 className="font-ps-display text-lg font-bold text-white">
              Quem já fez seu Mapa
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Postou seu destino nos Stories e seus amigos perguntaram qual app você usou? Mande seu link — 5 Mapas Completos já pagam 100% do seu próprio mapa.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
            <Video className="w-6 h-6 text-[#F5B041]" />
            <h3 className="font-ps-display text-lg font-bold text-white">
              Criadores & Influenciadores
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Astrologia, viagens, lifestyle ou autoconhecimento: conteúdo altamente compartilhável que gera curiosidade instantânea sobre o próximo aniversário.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
            <Compass className="w-6 h-6 text-[#F5B041]" />
            <h3 className="font-ps-display text-lg font-bold text-white">
              Astrólogos & Agentes de Viagem
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Recomende a ferramenta para clientes escolherem o destino da Revolução Solar e crie uma nova fonte recorrente de comissão por indicação.
            </p>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5DE98]/80 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparência Total
            </span>
            <h2 className="font-ps-display text-3xl font-bold text-white">
              Dúvidas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/10 bg-[#08111F]/85 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-[54px] px-5 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-ps-ui text-sm sm:text-base font-semibold text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#F5DE98] shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-white/65 leading-relaxed border-t border-white/[0.06] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CTA FINAL */}
        <section className="p-8 sm:p-12 rounded-[32px] border border-[#C9A227]/40 bg-gradient-to-r from-[#0E1A32]/95 via-[#131C30]/95 to-[#0A1020]/95 text-center space-y-5">
          <h2 className="font-ps-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Pronto para ativar seu link exclusivo?
          </h2>
          <p className="text-white/65 text-sm sm:text-base max-w-xl mx-auto">
            Leva menos de 10 segundos e você já sai com seu link `?ref=` + kit pronto para divulgar hoje mesmo.
          </p>
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(245,176,65,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>

      {/* Sticky Bottom CTA Mobile (aparece após rolar Hero) */}
      {showStickyCta && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-[#050811]/92 backdrop-blur-xl border-t border-[#C9A227]/30">
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#F5B041] to-[#C9A227] text-[#050507] font-ps-ui text-xs font-extrabold uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.98]"
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
