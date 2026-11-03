const fs = require('fs');
const file = 'src/pages/Technology.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFaqSection = `{/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6">`;

const newFaqSection = `{/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-32">`;

content = content.replace(oldFaqSection, newFaqSection);

const oldItem3 = `<AccordionItem value="item-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              O sistema funciona para analisar anos passados?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              Sim, e essa é uma das provas mais assustadoras da precisão do sistema. Faça uma busca reversa: insira o ano e a cidade em que você passou um aniversário marcante no passado. O sistema vai revelar exatamente qual Casa você ativou naquele ano, e você verá as características dela espelhadas nos eventos que você viveu.
            </AccordionContent>
          </AccordionItem>`;

const newItem3And4 = `<AccordionItem value="item-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              E se for impossível viajar para o Destino Ideal?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              Não se preocupe. O nosso algoritmo não cospe apenas uma cidade. Ele faz uma varredura global e gera uma lista de "Destinos Secundários". Muitas vezes, uma cidade a algumas horas de carro de você pode garantir 95% de compatibilidade matemática com o seu foco, substituindo o Destino Ideal de 99% (que pode estar do outro lado do mundo).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              O sistema funciona para investigar o Passado?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              Sim, e essa é uma das provas mais assustadoras da precisão do sistema. Faça uma busca reversa: insira o ano e a cidade em que você passou um aniversário marcante no passado. O sistema vai revelar exatamente qual Casa você ativou naquele ano, e você verá as características dela espelhadas nos eventos que você viveu.
            </AccordionContent>
          </AccordionItem>`;

content = content.replace(oldItem3, newItem3And4);

fs.writeFileSync(file, content);
console.log("FAQ Patched.");
