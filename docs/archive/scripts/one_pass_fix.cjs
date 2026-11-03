const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Substituir o Hero (mantendo o <section ref={heroRef} ...> e o final </section>)
const heroTarget = `{/* Nome da cidade — máximo impacto */}
          <h1 className="font-ps-display text-[15vw] md:text-[140px] font-bold tracking-tight leading-[0.85] mb-6">
            {P.city}
          </h1>

          {/* Descrição: copy única por Casa */}
          <p className="text-white/60 text-base md:text-lg font-light max-w-lg mx-auto leading-relaxed">
            O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
          </p>
        </div>
      </section>`;

const heroReplacement = `{/* Nome da cidade — máximo impacto com animação inicial */}
          <motion.h1 
            initial={{ scale: 1.4, opacity: 0, filter: "blur(16px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="font-ps-display text-[22vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
          >
            {P.city}
          </motion.h1>
          
          {/* Foco escolhido (Trazido para o Hero) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center mb-8"
          >
             <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
             <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                <Heart className="w-4 h-4" /> {P.intention}
             </div>
          </motion.div>
        </div>
      </section>`;

content = content.replace(heroTarget, heroReplacement);

// 2. Extrair o Acordeão (A GRANDE DIVISÃO DA PERSONALIZAÇÃO)
const accordionRegex = /(\{\/\* A GRANDE DIVISÃO DA PERSONALIZAÇÃO \*\/\}[\s\S]*?)(?=          <\/Reveal>)/;
const match = content.match(accordionRegex);
if (!match) {
  console.log("Accordion not found!");
  process.exit(1);
}
let accordionBlock = match[1];

// Limpar aquele `mt-20 pt-16 border-t border-white/5` inicial do Accordion
accordionBlock = accordionBlock.replace(
  'className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center"',
  'className="relative z-10 flex flex-col items-center"'
);

// 3. Remover a Seção 3 por inteiro e colocar o Acordeão no lugar dela
const section3Regex = /(      \{\/\* ══════════════════════════════════════════════════\n         3\. CASA 11 GIGANTE[\s\S]*?)(?=      \{\/\* ══════════════════════════════════════════════════\n         4\. BOARDING PASS)/;

const newSection = `      {/* ══════════════════════════════════════════════════
         3. PERSONALIZAÇÃO (ACORDEÃO)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-20 md:pb-32 bg-[#0B1426]">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none"></div>
               
               ${accordionBlock}          </Reveal>
        </div>
      </section>\n\n`;

content = content.replace(section3Regex, newSection);

fs.writeFileSync(file, content);
console.log("Success!");
