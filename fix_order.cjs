const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Extract Boarding Pass Block
const bpStart = '{/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}';
const bpEndString = '                   )}\n                 </AnimatePresence>\n               </div>\n            </div>';
let bpBlock = '';
if (code.includes(bpStart)) {
    const startIndex = code.indexOf(bpStart);
    const endIndex = code.indexOf(bpEndString, startIndex) + bpEndString.length;
    bpBlock = code.substring(startIndex, endIndex);
}

// 2. Extract Impact Phrase Block
const phraseStart = '{/* 2. Frase de Impacto */}';
const phraseEndString = '          </div>';
let phraseBlock = '';
if (code.includes(phraseStart)) {
    const pStart = code.indexOf(phraseStart);
    const pEnd = code.indexOf(phraseEndString, pStart) + phraseEndString.length;
    phraseBlock = code.substring(pStart, pEnd);
}

// 3. Remove the entire ATO 1 Wrapper
const ato1Start = '{/* ======================= ATO 1: PRA ONDE VOU ======================= */}';
const ato1EndString = '        </motion.div>';
if (code.includes(ato1Start)) {
    const aStart = code.indexOf(ato1Start);
    const aEnd = code.indexOf(ato1EndString, aStart) + ato1EndString.length;
    
    // Replace ATO 1 wrapper with JUST the impact phrase, properly formatted
    const replacement = `
        <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             O destino exato para{" "}
             <span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
           </p>
        </motion.div>
    `;
    code = code.substring(0, aStart) + replacement + code.substring(aEnd);
}

// 4. Inject Boarding Pass under "A Casa 2 foi calculada..."
const insertTarget = 'A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.\n                  </p>';
if (code.includes(insertTarget)) {
    const splitArr = code.split(insertTarget);
    code = splitArr[0] + insertTarget + '\n\n' + bpBlock + splitArr[1];
}

fs.writeFileSync(file, code);
console.log('Order fixed!');
