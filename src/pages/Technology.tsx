import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Cpu, Globe, ShieldCheck, Database, Zap, Compass, Target, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/ui/BackButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Por que eu preciso viajar fisicamente para o destino no meu aniversário?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Na Revolução Solar (astrologia de relocalização), a posição das Casas Astrológicas muda conforme a latitude e longitude onde você está no momento exato do seu retorno solar. Mudar de cidade muda qual área da vida (carreira, amor, finanças, saúde) recebe o foco principal dos próximos 12 meses."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo eu preciso ficar na cidade escolhida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recomenda-se permanecer fisicamente na cidade escolhida por pelo menos 24 horas ao redor do minuto exato do seu Retorno Solar, chegando idealmente 1 dia antes para estar em solo firme na virada do ciclo."
      }
    },
    {
      "@type": "Question",
      "name": "A Revolução Solar acontece exatamente no mesmo horário e dia do meu aniversário?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nem sempre. Como o ano astronômico dura cerca de 365 dias e 6 horas, o instante exato em que o Sol retorna ao grau do seu nascimento pode acontecer algumas horas antes ou depois — inclusive no dia anterior ou seguinte ao seu aniversário no calendário."
      }
    }
  ]
};

const Technology = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Como Funciona a Revolução Solar | Onde Passar Seu Aniversário — Protocolo Solar";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="w-full min-h-screen text-white overflow-hidden relative selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      
      {/* BACKGROUND EFFECTS (StarryBackground is inherited from ConsumerShell) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* HEADER NAVBAR (Desktop only, mobile handled by MobileAppChrome) */}
      <div className="hidden lg:block relative z-50 w-full max-w-7xl mx-auto px-6 py-8">
        <BackButton />
      </div>

      {/* HERO SECTION - HUMAN & SEO OPTIMIZED */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 lg:pt-10 pb-20 md:pb-28 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A227]/35 bg-[#C9A227]/10 backdrop-blur-xl rounded-full text-[11px] uppercase font-bold tracking-[0.25em] text-[#F5DE98] relative z-10">
            <Zap className="w-3.5 h-3.5 text-[#E5C158]" />
            Como Funciona na Prática
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-3xl sm:text-5xl md:text-6xl font-ps-display font-bold tracking-tight mb-6 leading-[1.12]"
        >
          <span className="text-white">
            Por que o lugar onde você passa seu aniversário{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5DE98] via-[#E5C158] to-[#C9A227]">
            muda o seu ano?
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed"
        >
          Todo ano, o Sol volta exatamente para o mesmo ponto do céu em que estava quando você nasceu. A <strong className="text-white font-medium">cidade onde você está nesse instante</strong> define qual área da sua vida ganha mais força nos próximos 12 meses.
        </motion.p>
      </section>

      {/* STORYTELLING TIMELINE (THE 3 STEPS IN PLAIN PORTUGUESE) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 md:mb-36">
        <div className="absolute left-[50px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A227]/25 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-16 md:space-y-28">
          {/* STEP 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-16 text-center md:text-left"
          >
            <div className="md:w-1/2 flex justify-center md:justify-end relative">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border border-[#C9A227]/30 bg-[#07101C] flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(201,162,39,0.12)]">
                <Orbit className="w-10 h-10 md:w-14 md:h-14 text-[#F5DE98]" />
              </div>
              <span className="hidden md:block absolute -top-8 right-6 text-[120px] font-ps-display font-bold text-white/[0.03] select-none pointer-events-none">01</span>
            </div>
            <div className="md:w-1/2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">Passo 1</span>
              <h2 className="text-2xl md:text-4xl font-ps-display text-white mb-3">Seu ponto de <span className="text-[#F5DE98]">partida</span></h2>
              <p className="text-sm sm:text-base md:text-lg text-white/65 font-light leading-relaxed">
                Com a sua data, horário e cidade de nascimento, localizamos a posição exata em que o Sol estava no céu no momento em que você nasceu.
              </p>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 text-center md:text-left"
          >
            <div className="md:w-1/2 flex justify-center md:justify-start relative">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border border-[#C9A227]/30 bg-[#07101C] flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(201,162,39,0.12)]">
                <Cpu className="w-10 h-10 md:w-14 md:h-14 text-[#F5DE98]" />
              </div>
              <span className="hidden md:block absolute -top-8 left-6 text-[120px] font-ps-display font-bold text-white/[0.03] select-none pointer-events-none">02</span>
            </div>
            <div className="md:w-1/2 md:text-right">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">Passo 2</span>
              <h2 className="text-2xl md:text-4xl font-ps-display text-white mb-3">O minuto exato da <span className="text-[#F5DE98]">sua virada</span></h2>
              <p className="text-sm sm:text-base md:text-lg text-white/65 font-light leading-relaxed">
                Descobrimos o dia, a hora e o minuto exato deste ano em que o Sol volta a esse mesmo grau — a sua <strong className="text-white/90 font-normal">Revolução Solar</strong> (que pode cair algumas horas antes ou depois do seu aniversário no calendário).
              </p>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-16 text-center md:text-left"
          >
            <div className="md:w-1/2 flex justify-center md:justify-end relative">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border border-[#C9A227]/30 bg-[#07101C] flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(201,162,39,0.12)]">
                <Globe className="w-10 h-10 md:w-14 md:h-14 text-[#F5DE98]" />
              </div>
              <span className="hidden md:block absolute -top-8 right-6 text-[120px] font-ps-display font-bold text-white/[0.03] select-none pointer-events-none">03</span>
            </div>
            <div className="md:w-1/2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">Passo 3</span>
              <h2 className="text-2xl md:text-4xl font-ps-display text-white mb-3">A cidade certa para o <span className="text-[#F5DE98]">seu objetivo</span></h2>
              <p className="text-sm sm:text-base md:text-lg text-white/65 font-light leading-relaxed">
                Comparamos centenas de destinos no Brasil e no mundo para revelar quais cidades colocam dinheiro, amor, carreira, saúde ou visibilidade em destaque no seu novo ciclo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENTO BOX - CREDIBILITY WITHOUT CONFUSING JARGON */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24 md:mb-36">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          
          {/* Large Main Box */}
          <motion.div 
            whileHover={{ scale: 0.995 }}
            className="md:col-span-2 bg-gradient-to-br from-[#121D33]/95 via-[#091222]/95 to-[#050A14]/98 border border-[#C9A227]/35 backdrop-blur-2xl p-7 sm:p-10 md:p-14 rounded-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none">
              <ShieldCheck className="w-72 h-72 text-[#C9A227]" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A227]/15 rounded-full text-[10px] uppercase tracking-widest text-[#F5DE98] font-bold mb-5 border border-[#C9A227]/35">
                <Database className="w-3 h-3" /> Precisão Astronômica Real
              </div>
              <h2 className="text-2xl sm:text-4xl font-ps-display text-white mb-4 leading-tight">
                Cálculo astronômico de padrão suíço, traduzido para a vida real.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/65 leading-relaxed font-light max-w-xl">
                Por trás de uma leitura simples e direta, usamos as tabelas astronômicas de alta precisão (<strong className="text-white/90 font-normal">Swiss Ephemeris</strong> e <strong className="text-white/90 font-normal">NASA JPL</strong>) para que você escolha sua viagem com segurança matemática — sem horóscopo genérico.
              </p>
            </div>
          </motion.div>

          {/* Small Boxes */}
          <div className="flex flex-col gap-5 md:gap-6">
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-[#08111F]/90 border border-[#C9A227]/25 backdrop-blur-xl p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5DE98]/70 mb-1.5">Opções para Todo Bolso</span>
              <span className="text-xl sm:text-2xl font-ps-display text-white">Brasil & Exterior</span>
              <p className="text-xs text-white/55 mt-2 leading-relaxed">Sugestões nacionais, acessíveis e internacionais que ativam a mesma área da vida.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-[#08111F]/90 border border-[#C9A227]/25 backdrop-blur-xl p-6 sm:p-8 rounded-3xl flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5DE98]/70 mb-1.5">Teste no Passado</span>
              <span className="text-xl sm:text-2xl font-ps-display text-white">Comprove Você Mesmo</span>
              <p className="text-xs text-white/55 mt-2 leading-relaxed">Consulte onde você passou aniversários anteriores e veja como bateu com o ano vivido.</p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-ps-display text-white mb-3">Dúvidas Comuns</h2>
          <p className="text-sm text-white/55 font-ps-ui">Tudo o que você precisa saber antes de planejar sua viagem de aniversário.</p>
        </div>

        <div className="space-y-16">
          {/* PILAR 1 */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <Compass className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-ps-display text-white">A Mecânica da Viagem & Permanência</h3>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1-1" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  Por que eu preciso viajar fisicamente para o destino?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  A astrologia de relocalização opera estritamente sob as coordenadas geográficas de latitude e longitude. Enquanto os planetas nos signos permanecem os mesmos no céu global, a divisão das Casas Astrológicas (que definem em qual área da vida os acontecimentos vão focar) muda de acordo com o local exato onde você está no planeta no segundo do Retorno Solar. Mudar de coordenada altera a geometria do seu ano.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1-2" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  Quanto tempo eu preciso ficar no local?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  O instante crítico é o segundo exato do Retorno Solar. Para impregnar a frequência do novo mapa, a regra clássica exige que você permaneça no local por pelo menos 24 horas seguidas (a janela completa do marco zero). Se possível, recomenda-se chegar de 1 a 2 dias antes para vivenciar a transição com calma.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  E se o momento do Retorno Solar for de madrugada ou durante um voo?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  Não há problema se for de madrugada, desde que você esteja fisicamente na cidade escolhida. Caso você esteja em trânsito dentro de um avião, a coordenada considerada pelo algoritmo será o ponto geográfico exato (latitude e longitude) sobre o qual a aeronave estiver sobrevoando naquele milissegundo. Por isso, o ideal é estar em solo firme na cidade de destino no momento do cálculo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* PILAR 2 */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-ps-display text-white">Estratégia, Prazos & Resultados</h3>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-2-1" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  E se for impossível viajar para o Destino Ideal (ex: local muito distante ou caro)?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  O algoritmo do Protocolo Solar não entrega apenas uma cidade no mundo. Ele faz uma varredura global e gera um ranking de rotas alternativas — incluindo opções nacionais, continentais e regionais acessíveis — que ativam a exata mesma Casa Astrológica desejada dentro da sua realidade logística e orçamentária.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2-2" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  Quando a energia do novo ano pessoal começa a fazer efeito?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  A transição energética de um ano para o outro ocorre de forma gradual. Você começará a sentir os primeiros sinais, temas e oportunidades da nova Revolução Solar entre 30 a 90 dias antes do seu aniversário. O momento do Retorno Solar é a ancoragem oficial, e os temas do mapa anterior se dissipam completamente nos meses seguintes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  O meu Mapa Astral de Nascimento é alterado quando eu viajo?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  Não. O seu Mapa Natal é o seu "DNA astral" fixo e permanente para a vida toda. A Revolução Solar funciona como uma "lente de atualização anual" (um aplicativo que você roda durante 12 meses sobre a sua estrutura base), direcionando o seu foco e energia para objetivos específicos naquele ciclo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* PILAR 3 */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-ps-display text-white">Tecnologia & Validação</h3>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-3-1" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  O sistema funciona para analisar anos passados? (Busca Reversa)
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  Sim, e essa é a maior prova da precisão da ferramenta. Na funcionalidade de Busca Reversa, você insere os dados de aniversários passados em que viajou ou esteve fora da sua cidade natal. O sistema recalcula o mapa daquele ano específico e você poderá constatar matematicamente como os fatos marcantes vividos espelharam a Casa ativada naquela viagem.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3-2" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  A Revolução Solar acontece exatamente no mesmo horário e dia do meu aniversário?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  Nem sempre. Como o ano astronômico possui aproximadamente 365,25 dias (motivo dos anos bissextos), o Sol leva um tempo ligeiramente diferente para retornar ao grau exato de nascimento a cada ano. Por isso, o Retorno Solar pode ocorrer algumas horas antes ou depois, inclusive no dia anterior ou posterior ao seu aniversário civil.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
                  Preciso me mudar definitivamente para a cidade escolhida para manter os resultados?
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
                  Não. O mapa da Revolução Solar é "impresso" na sua aura no momento exato do retorno. Uma vez ativado o marco zero durante a janela de 24 horas no destino, você pode retornar para a sua cidade de residência habitual e a frequência calculada continuará atuando ao longo dos 365 dias do seu ciclo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* BOTTOM CONVERSION CTA */}
        <div className="mt-16 p-7 sm:p-10 rounded-3xl border border-[#C9A227]/40 bg-gradient-to-b from-[#0E1B31]/95 to-[#060C18]/98 text-center shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
          <h3 className="text-2xl sm:text-3xl font-ps-display text-white mb-2.5">
            Pronto para descobrir o melhor destino do seu próximo aniversário?
          </h3>
          <p className="text-sm text-white/65 font-ps-ui max-w-lg mx-auto mb-6 leading-relaxed">
            Teste uma cidade que você já tem em mente ou escolha a área da vida que você quer destravar nos próximos 12 meses.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2.5 h-13 px-8 py-3.5 rounded-xl font-ps-display tracking-[0.08em] text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#C9A227",
              color: "#02050A",
              boxShadow: "0 0 32px rgba(201,162,39,0.3)",
            }}
          >
            <span>DESCOBRIR MEU DESTINO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
      
    </div>
  );
};

export default Technology;
