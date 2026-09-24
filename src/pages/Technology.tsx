import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Orbit, Cpu, Globe, ShieldCheck, Database, Zap, Compass, Target, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/ui/BackButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Technology = () => {
  const navigate = useNavigate();


  return (
    <div className="w-full min-h-screen text-white overflow-hidden relative selection:bg-primary/30">
      
      {/* BACKGROUND EFFECTS: Mesh Gradients & Noise */}
      {/* BACKGROUND EFFECTS (StarryBackground is inherited from ConsumerShell) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* HEADER NAVBAR */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8">
        <BackButton />
      </div>

      {/* HERO SECTION - CINEMATIC */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-amber-500/50 blur-2xl opacity-20 animate-pulse" />
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-xs uppercase font-bold tracking-[0.3em] text-white/80 relative z-10">
            <Zap className="w-4 h-4 text-primary" />
            Engenharia do Destino
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-ps-display font-bold tracking-tighter mb-8 leading-[1.1]"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30">
            Muito além do 
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-200 to-white italic pr-4">
            Misticismo.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/50 max-w-3xl font-light leading-relaxed"
        >
          O Protocolo Solar não é um horóscopo genérico. É um <strong className="text-white font-medium">motor astrométrico</strong> que varre o globo terrestre processando as mesmas efemérides matemáticas utilizadas por agências espaciais.
        </motion.p>
      </section>

      {/* STORYTELLING TIMELINE (THE 3 STEPS) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-40">
        <div className="absolute left-[50px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-24 md:space-y-40">
          {/* STEP 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-end relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/20 bg-[#050505] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(201,162,39,0.08)]">
                <Orbit className="w-12 h-12 md:w-16 md:h-16 text-primary/80" />
              </div>
              <span className="absolute -top-10 -right-10 md:right-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">01</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Mapeamento <br/><span className="text-primary">Natal</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Utilizamos as tabelas planetárias da NASA (JPL DE431) para escanear e fixar a posição exata do Sol no milissegundo do seu nascimento, garantindo a sua assinatura genética celeste com erro zero.
              </p>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-start relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/20 bg-[#050505] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(201,162,39,0.08)]">
                <Cpu className="w-12 h-12 md:w-16 md:h-16 text-primary/80" />
              </div>
              <span className="absolute -top-10 -left-10 md:left-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">02</span>
            </div>
            <div className="md:w-1/2 md:text-right">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Cálculo de <br/><span className="text-primary">Retorno</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Nossos servidores processam o tempo futuro para descobrir o exato momento (convertido para o fuso UTC) em que o Sol cruzará a sua coordenada natal novamente. Este é o marco zero da Revolução.
              </p>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-end relative">
              
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/20 bg-[#050505] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(201,162,39,0.08)]">
                <Globe className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
              <span className="absolute -top-10 -right-10 md:right-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">03</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Varredura <br/><span className="text-primary">Geométrica</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Com o momento temporal cravado, a inteligência artificial testa milhares de coordenadas na Terra simultaneamente. O objetivo? Encontrar a geografia perfeita que força as Casas Astrológicas a se alinharem ao seu Desejo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENTO BOX - TECH SPECS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Main Box */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 bg-gradient-to-br from-[#1C160B] to-[#0A0804] border border-primary/30 backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] relative overflow-hidden shadow-[inset_0_0_100px_rgba(201,162,39,0.05),0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute -right-20 -bottom-20 opacity-10">
              <ShieldCheck className="w-80 h-80 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-[10px] uppercase tracking-widest text-primary font-bold mb-6 border border-primary/30 shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                <Database className="w-3 h-3" /> Padrão Ouro
              </div>
              <h3 className="text-4xl md:text-5xl font-ps-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-white mb-6 drop-shadow-md">Certificação<br/>Suíça (Astrodienst)</h3>
              <p className="text-lg text-white/50 leading-relaxed font-light max-w-lg">
                Nós não inventamos a matemática celeste, nós escalamos o padrão mais rigoroso do mundo. O núcleo do Protocolo Solar roda sobre a <strong>swisseph</strong>, garantindo que o seu ticket aéreo não seja comprado com base em suposições geométricas.
              </p>
            </div>
          </motion.div>

          {/* Small Boxes */}
          <div className="flex flex-col gap-6">
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[2rem] flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Astrometria Engine</span>
              <span className="text-2xl font-mono text-white tracking-widest">JPL DE431</span>
              <div className="mt-4 h-1 w-12 bg-primary/50 rounded-full" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[2rem] flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Acurácia de Cálculo</span>
              <span className="text-2xl font-mono text-white tracking-widest">&lt; 0.001"</span>
              <div className="mt-4 h-1 w-12 bg-primary/50 rounded-full" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-ps-display text-white mb-6">Central de Inteligência</h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
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
      </section>
      
    </div>
  );
};

export default Technology;
