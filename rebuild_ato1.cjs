const fs = require('fs');
const file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldPhraseBlock = `<motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             O destino exato para{" "}
             <span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
           </p>
        </motion.div>`;

// We will inject the Boarding Pass content here
const boardingPassFile = fs.readFileSync('/tmp/boarding_pass.tsx', 'utf8');
const justTheBPContent = boardingPassFile.split('<div className="w-full max-w-4xl mx-auto mb-20">')[1].split(' {/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}')[0].trim();

const newAto1 = `
        {/* ======================= ATO 1: PRA ONDE VOU ======================= */}
        <motion.div style={{ opacity: textOpacity }} className="w-full flex flex-col items-center mt-8 mb-16 px-4 relative z-30">
          
          {/* 1. Boarding Pass (No topo absoluto) */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            ` + justTheBPContent + `
          
          {/* 2. Badges de Status */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
             <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest">STATUS: REGISTRADO</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">JANELA: 24H NO DESTINO</span>
             </div>
          </div>

          {/* 3. Frase de Impacto */}
          <div className="flex flex-col items-center max-w-4xl text-center mb-10">
             <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
               O destino exato para destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo.
             </p>
          </div>

          {/* 4. Botão Compartilhar */}
          <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors px-6 py-3 rounded-2xl text-white/80 font-medium text-sm group">
            <Camera className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            Compartilhar Ancoragem nos Stories
          </button>
          
        </motion.div>
`;

code = code.replace(oldPhraseBlock, newAto1);
fs.writeFileSync(file, code);
console.log("Ato 1 replaced successfully");
