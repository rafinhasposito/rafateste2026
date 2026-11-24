import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
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

const FAQ_ITEMS = [
  {
    id: "faq-who",
    q: "Quem pode participar do Programa de Parceiros?",
    a: "Astrólogos, terapeutas, consultores de viagem, criadores de conteúdo e leitores que já experimentaram o Protocolo Solar no próprio mapa e desejam indicar a plataforma com autenticidade.",
  },
  {
    id: "faq-price",
    q: "O valor muda para quem acessa por um link de parceiro?",
    a: "Não. Quem acessa por indicação encontra exatamente os mesmos valores oficiais do site (R$ 19,90, R$ 49,90 e R$ 99,90), sem nenhum acréscimo.",
  },
  {
    id: "faq-panel",
    q: "Onde ficam meu link, acompanhamento e materiais de apoio?",
    a: "Todas as ferramentas operacionais — link pessoal, registro de indicações, configuração de Pix (20% por leitura confirmada) e materiais visuais — ficam restritas ao painel autenticado após ativar seu cadastro gratuito.",
  },
  {
    id: "faq-ethics",
    q: "Quais são as diretrizes de transparência?",
    a: "Exigimos comunicação ética e transparente: nunca prometer resultados determinísticos, respeitar a sinalização de parceria (#parceiro / #publi) em redes sociais e recomendar sempre a partir da experiência real com a ferramenta.",
  },
];

export const PartnersLanding = () => {
  const { user } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Programa Oficial de Parceiros | Protocolo Solar";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handlePrimaryCta = () => {
    if (user) {
      navigate("/afiliado");
    } else {
      navigate("/auth?returnTo=%2Fafiliado");
    }
  };

  const ctaLabel = isAffiliate
    ? "Acessar Meu Painel de Parceiro"
    : user
      ? "Ativar Cadastro de Parceiro"
      : "Entrar e Ativar Painel de Parceiro";

  return (
    <div className="w-full min-h-[100svh] bg-[#060911] text-[#F8FAFC] font-sans relative z-10 overflow-x-hidden pb-28 lg:pb-24">
      <div className="hidden lg:block relative z-20 max-w-5xl mx-auto px-6 pt-8">
        <BackButton label="Voltar ao Início" to="/" />
      </div>

      {/* 1. HERO INSTITUCIONAL SÓBRIO */}
      <section className="relative max-w-4xl mx-auto px-5 sm:px-6 pt-20 lg:pt-10 pb-14 sm:pb-20 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(234,179,68,0.14) 0%, rgba(11,17,30,0.2) 55%, transparent 75%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/10 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F3DC9B] mb-5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EAB344] shrink-0" />
          <span>Programa Oficial de Parceiros & Criadores</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-display font-bold text-3xl sm:text-5xl text-[#F8FAFC] tracking-[-0.02em] leading-[1.08] mb-5 max-w-3xl mx-auto"
        >
          Compartilhe o que fez sentido{" "}
          <span className="italic font-semibold text-[#F3DC9B]">
            no seu próprio mapa.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-[#B0BCCF] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Reunimos astrólogos, terapeutas, criadores de viagem e leitores que já validaram o Protocolo Solar na própria história e desejam indicar a plataforma com transparência.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto"
        >
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="ps-btn-gold text-sm"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <Link to="/#consulta-gratuita" className="ps-btn-glass text-sm">
            <Compass className="w-4 h-4 text-[#EAB344] shrink-0" />
            <span>Testar meu mapa grátis antes</span>
          </Link>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 space-y-16 sm:space-y-20">
        {/* 2. TRÊS PILARES DE INTEGRIDADE (SEGURO PARA CLIENTES, CÉTICOS E PARCEIROS) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <div className="rounded-2xl bg-[#0B111E] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#111A2E] border border-[#EAB344]/30 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5 text-[#EAB344]" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#F8FAFC] mb-2">
                1. Experiência real primeiro
              </h2>
              <p className="text-sm text-[#B0BCCF] leading-relaxed">
                Antes de indicar, incentivamos que cada parceiro confira gratuitamente a leitura do seu último aniversário e valide o cálculo na própria vida.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B111E] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#111A2E] border border-[#EAB344]/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-[#EAB344]" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#F8FAFC] mb-2">
                2. Mesmo preço oficial
              </h2>
              <p className="text-sm text-[#B0BCCF] leading-relaxed">
                Quem chega por indicação encontra exatamente os mesmos valores oficiais do site, sem taxas extras. O repasse de 20% sai integralmente da nossa margem.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B111E] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#111A2E] border border-[#EAB344]/30 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#EAB344]" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#F8FAFC] mb-2">
                3. Painel restrito ao parceiro
              </h2>
              <p className="text-sm text-[#B0BCCF] leading-relaxed">
                Link personalizado, histórico de indicações, chave Pix e materiais visuais ficam disponíveis somente na sua área autenticada após ativação do cadastro.
              </p>
            </div>
          </div>
        </section>

        {/* 3. PERFIS DE PARCEIROS */}
        <section className="rounded-3xl bg-[#0B111E]/90 border border-white/10 p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#EAB344] font-semibold">
              Comunidade Oficial
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1">
              Para quem o programa foi desenhado
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#111A2E]/70 border border-white/[0.08] p-5 space-y-2">
              <BadgeCheck className="w-5 h-5 text-[#EAB344]" />
              <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                Astrólogos & Terapeutas
              </h3>
              <p className="text-xs sm:text-sm text-[#B0BCCF] leading-relaxed">
                Profissionais que utilizam a Revolução Solar com clientes e buscam precisão astronômica (Swiss Ephemeris) para comparar destinos.
              </p>
            </div>

            <div className="rounded-2xl bg-[#111A2E]/70 border border-white/[0.08] p-5 space-y-2">
              <Video className="w-5 h-5 text-[#EAB344]" />
              <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                Criadores de Viagem & Lifestyle
              </h3>
              <p className="text-xs sm:text-sm text-[#B0BCCF] leading-relaxed">
                Criadores que planejam viagens de aniversário e compartilham experiências reais de roteiro e autoconhecimento com sua audiência.
              </p>
            </div>

            <div className="rounded-2xl bg-[#111A2E]/70 border border-white/[0.08] p-5 space-y-2">
              <Users className="w-5 h-5 text-[#EAB344]" />
              <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                Clientes do Protocolo Solar
              </h3>
              <p className="text-xs sm:text-sm text-[#B0BCCF] leading-relaxed">
                Pessoas que já geraram sua leitura anual, gostaram da clareza do mapa e costumam recomendar para amigos próximos.
              </p>
            </div>
          </div>
        </section>

        {/* 4. DÚVIDAS FREQUENTES */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#EAB344] font-semibold">
              Transparência
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1">
              Perguntas frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible defaultValue="faq-who" className="w-full space-y-3">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-white/10 bg-[#0B111E] rounded-2xl px-5 overflow-hidden"
              >
                <AccordionTrigger className="text-[#F8FAFC] hover:text-[#F3DC9B] hover:no-underline py-4 font-sans font-semibold text-sm sm:text-base text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#B0BCCF] text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 5. CONVITE FINAL */}
        <section className="rounded-3xl bg-[#111A2E]/85 border border-[#EAB344]/35 p-7 sm:p-10 text-center space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Já tem conta ou quer ativar seu painel de parceiro?
          </h2>
          <p className="text-sm text-[#B0BCCF] max-w-lg mx-auto leading-relaxed">
            O cadastro é gratuito e todas as ferramentas do parceiro ficam disponíveis na sua área autenticada.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handlePrimaryCta}
              className="ps-btn-gold text-sm"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartnersLanding;
