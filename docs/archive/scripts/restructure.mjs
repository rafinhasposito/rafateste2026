import fs from 'fs';
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const section3Start = 209; // `      {/* ══════════════════════════════════════════════════`
const section3End = 640; // `      </section>`

const boardingPassStart = 218; // `               {/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}`
const boardingPassEnd = 355; // `                  </div>` (after STATUS BADGES)

const cinemaPanelStart = 356; // `                  ` (before {/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */})
const cinemaPanelEnd = 636; // `            </div>` (before `</Reveal>`)

let beforeSection = lines.slice(0, section3Start).join('\n');
let afterSection = lines.slice(section3End + 1).join('\n');

let boardingPassContent = lines.slice(boardingPassStart, boardingPassEnd + 1).join('\n');
let cinemaPanelContent = lines.slice(cinemaPanelStart, cinemaPanelEnd + 1).join('\n');

let newSection3 = `      {/* ══════════════════════════════════════════════════
         3. PERSONALIZAÇÃO (ACORDEÃO E CINEMA PANEL)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-20 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-8">
                   <Sparkles className="w-3 h-3" />
                   <span>Análise Personalizada</span>
                 </div>
               </div>

${cinemaPanelContent}

               {/* SANFONA DO BOARDING PASS */}
               <div className="w-full mt-12 relative z-10">
                 <button 
                   onClick={() => setIsBoardingPassOpen(!isBoardingPassOpen)}
                   className="w-full flex items-center justify-between bg-black/40 border border-[#10b981]/20 rounded-2xl p-6 hover:bg-black/60 transition-all"
                 >
                   <div className="flex items-center gap-3">
                     <Plane className="w-5 h-5 text-[#10b981]" />
                     <span className="text-[#10b981] font-bold tracking-widest uppercase text-sm">BOARDING PASS SOLAR</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                       <span className="text-[#10b981]/70 text-[10px] uppercase font-mono tracking-widest">#CC59F4F6 • ATIVO</span>
                     </div>
                     <ChevronDown className={\`w-5 h-5 text-[#10b981] transition-transform \${isBoardingPassOpen ? 'rotate-180' : ''}\`} />
                   </div>
                 </button>

                 <AnimatePresence>
                   {isBoardingPassOpen && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="pt-8">
${boardingPassContent}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

            </div>
          </Reveal>
        </div>
      </section>`;

let finalContent = beforeSection + '\n' + newSection3 + '\n' + afterSection;
fs.writeFileSync(file, finalContent, 'utf8');
console.log("Success");
