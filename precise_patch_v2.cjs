const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// --- 1. CLEAN THE HERO ---
// Removendo o texto do Hero
const heroTarget = `<div className="absolute bottom-0 left-0 right-0 pb-16 flex flex-col items-center text-center px-6 z-10">

          {/* Pill tag acima — estilo da página Tecnologia */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-xs uppercase font-bold tracking-[0.3em] text-white/70 mb-6">
            <span>✦</span>
            <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>

          {/* Nome da cidade — máximo impacto */}
          <h1 className="font-ps-display text-[15vw] md:text-[140px] font-bold tracking-tight leading-[0.85] mb-6">
            {P.city}
          </h1>

          {/* Descrição: copy única por Casa */}
          <p className="text-white/60 text-base md:text-lg font-light max-w-lg mx-auto leading-relaxed">
            O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
          </p>
        </div>`;
content = content.replace(heroTarget, `        {/* Hero limpo, o texto desceu para a seção 3 */}`);


// --- 2. REPLACE THE ZOOMING TEXT ---
const casa11GiganteRegex = /<div className="text-center mb-16 flex flex-col items-center">[\s\S]*?<\/div>/;
const cityZoomingText = `<div className="text-center mb-16 flex flex-col items-center">
            <motion.div style={{ opacity: casaOpacity }} className="mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
                <span>✦</span>
                <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
              </div>
            </motion.div>
            
            <motion.h2
              style={{ scale: casaScale, opacity: casaOpacity, filter: casaBlur }}
              className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#3b82f6] to-blue-200 origin-center uppercase"
            >
              {P.city}
            </motion.h2>

            <motion.div style={{ opacity: casaOpacity }} className="flex flex-col items-center max-w-2xl px-4">
               <div className="flex flex-col items-center mb-8">
                 <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-3">Foco Escolhido</span>
                 <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-sm uppercase tracking-widest font-semibold backdrop-blur-md">
                    <Heart className="w-4 h-4" /> {P.intention}
                 </div>
               </div>

               <p className="text-white/60 text-base md:text-lg font-light leading-relaxed text-center">
                 O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.
               </p>
            </motion.div>
          </div>`;
content = content.replace(casa11GiganteRegex, cityZoomingText);


// --- 3. REMOVE REDUNDANT TEXTS BUT KEEP THE ACCORDION ---
// First, slice from "1. A ENERGIA DO ANO" up to "Para Quem É A Casa"
const redundantText1 = /\{\/\* 1\. A ENERGIA DO ANO[\s\S]*?<h3 className="text-white\/90 text-3xl md:text-5xl font-ps-display font-bold mb-6 text-center relative z-10">Para Quem É A Casa \{P\.house\}\?<\/h3>[\s\S]*?\{\/\* A GRANDE DIVISÃO DA PERSONALIZAÇÃO \*\/\}/;
content = content.replace(redundantText1, "{/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}");

// Remove the `mt-20 pt-16 border-t border-white/5` from the Accordion
content = content.replace(
  'className="mt-20 pt-16 border-t border-white/5 relative z-10 flex flex-col items-center"',
  'className="relative z-10 flex flex-col items-center"'
);

// Then, slice from "4. RADAR 360" up to just before "BOARDING PASS" (keeping the `</section>` properly)
const redundantText2 = /\{\/\* 4\. RADAR 360 \*\/\}[\s\S]*?\{\/\* ══════════════════════════════════════════════════\n         4\. BOARDING PASS/;
content = content.replace(redundantText2, `        </div>\n      </section>\n\n      {/* ══════════════════════════════════════════════════\n         4. BOARDING PASS`);

fs.writeFileSync(file, content);
