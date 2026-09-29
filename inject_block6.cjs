const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const block5Start = `{/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

// Let's find the closing div of Block 5. Block 5 is a div, containing a header div and an accordion div.
// It's safer to use regex or string replace to find the exact place after Block 5.
// Let's look for the end of Block 5 and inject it before the closing `</motion.div>` of the mapped area.
// Looking at my AppleResultPreview.tsx, the map ends with:
/*
                          {currentActiveData.timeline?.map((phase, index) => {
                            ...
                          })}
                        </div>
                      </div>
*/

const searchStr = `                        </div>
                      </div>`;

const block6Str = `
                      {/* BLOCO 6: O PONTO CEGO (AMEAÇA CRÍTICA - V2) */}
                      <div className="w-full max-w-5xl mx-auto mt-40 mb-32 px-6">
                        <div className="bg-[#020202] rounded-3xl border border-red-900/30 p-1 md:p-1.5 relative overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.15)]">
                          
                          {/* Pulsing subtle glow */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] blur-[8px] bg-red-600"></div>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-red-500"></div>

                          <div className="bg-[#050505] rounded-[28px] p-8 md:p-16 relative z-10 flex flex-col items-center text-center border border-white/[0.02]">
                            
                            <div className="flex items-center gap-3 mb-10 px-5 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                               <span className="font-mono text-[10px] tracking-widest uppercase text-red-400 font-bold">Risco de Autossabotagem</span>
                            </div>
                            
                            <h3 className="font-ps-display text-4xl md:text-6xl font-bold text-white mb-10 tracking-tighter">
                              O Ponto Cego.
                            </h3>
                            
                            <p className="text-red-50/70 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mb-14">
                              A euforia desta configuração astrológica atrai oportunidades, mas também um impulso irresistível para o desperdício. Seu maior risco é confundir alto fluxo com patrimônio consolidado.
                            </p>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-14"></div>
                            
                            <div className="text-left w-full max-w-3xl bg-black/40 p-8 rounded-2xl border border-red-900/20">
                               <div className="flex items-center gap-3 mb-6 border-b border-red-900/30 pb-4">
                                 <ShieldAlert className="w-5 h-5 text-red-500" />
                                 <span className="font-mono text-xs tracking-[0.2em] uppercase text-red-500 font-bold">Protocolo de Defesa</span>
                               </div>
                               <p className="text-white text-xl md:text-2xl font-serif italic leading-relaxed">
                                 "Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto."
                               </p>
                            </div>

                          </div>
                        </div>
                      </div>
`;

// To ensure we inject after Block 5, we can split by block5Start
if (code.includes(block5Start)) {
    const parts = code.split(block5Start);
    const beforeBlock5 = parts[0];
    const afterBlock5Start = parts[1];
    
    // Find the end of Block 5 (which is the two closing divs)
    const endOfBlock5Index = afterBlock5Start.indexOf(searchStr) + searchStr.length;
    
    const block5Content = afterBlock5Start.substring(0, endOfBlock5Index);
    const restOfCode = afterBlock5Start.substring(endOfBlock5Index);
    
    code = beforeBlock5 + block5Start + block5Content + block6Str + restOfCode;
    
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Block 6 successfully injected.");
} else {
    console.log("Could not find Block 5 to anchor the injection.");
}
