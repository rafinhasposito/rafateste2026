const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetHero = `{/* Nome da cidade — máximo impacto */}
          <h1 className="font-ps-display text-[15vw] md:text-[140px] font-bold tracking-tight leading-[0.85] mb-6">
            {P.city}
          </h1>`;

const replacementHero = `{/* Nome da cidade — máximo impacto com animação inicial */}
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
          </motion.div>`;

content = content.replace(targetHero, replacementHero);

const targetSection3 = /      \{\/\* ══════════════════════════════════════════════════\n         3\. CASA 11 GIGANTE[\s\S]*?<\/section>\n/;
content = content.replace(targetSection3, "");

fs.writeFileSync(file, content);
