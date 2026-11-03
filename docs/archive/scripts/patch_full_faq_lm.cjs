const fs = require('fs');
const file = 'src/pages/Technology.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add icons to the import
content = content.replace("Database, Zap", "Database, Zap, Compass, Target, Settings");

// 2. Define the new FAQ JSX
const newFaq = `{/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
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
      </section>`;

// Replace old FAQ section with new one
const startIndex = content.indexOf('{/* FAQ SECTION - GLASSMORPHISM ACCORDION */}');
// find the closing tag of that section
const sectionCloseTag = '</section>';
let nextSectionClose = content.indexOf(sectionCloseTag, startIndex);
if(nextSectionClose !== -1) {
    const endIndex = nextSectionClose + sectionCloseTag.length;
    content = content.substring(0, startIndex) + newFaq + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log("FAQ completely updated to 9 questions and 3 pillars.");
} else {
    console.log("Could not find end of FAQ section");
}
