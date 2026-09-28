const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the background from Section 3
content = content.replace(
  '<section className="relative pt-16 pb-20 md:pb-32 bg-[#02160F]">',
  '<section className="relative pt-16 pb-20 md:pb-32">'
);

// 2. Remove the injected Boarding Pass from Section 2
const injectedBoardingRegex = /        \{\/\* ======================= BOARDING PASS ======================= \*\/\}[\s\S]*?<\/motion\.div>/;
content = content.replace(injectedBoardingRegex, '');

// 3. Remove the old Boarding Pass Section 4
const oldBoardingRegex = /      \{\/\* ══════════════════════════════════════════════════\n         4\. BOARDING PASS\n         ══════════════════════════════════════════════════ \*\/\}[\s\S]*?<\/section>/;
content = content.replace(oldBoardingRegex, '');

// 4. Inject the new beautiful Boarding Pass directly under "O algoritmo escolheu..."
const targetText = `O algoritmo escolheu a Casa {P.house} milimetricamente porque ela é a grande chave para destravar esse objetivo específico no seu próximo ano.
                  </p>`;

const newBoardingPass = `O algoritmo escolheu a Casa {P.house} milimetricamente porque ela é a grande chave para destravar esse objetivo específico no seu próximo ano.
                  </p>

                  {/* ======================= BOARDING PASS ======================= */}
                  <div className="w-full max-w-4xl mx-auto mb-16">
                     <div className="bg-[#02160F]/60 border border-[#10b981]/20 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.15)] backdrop-blur-xl">
                       {/* Header */}
                       <div className="bg-[#10b981]/10 border-b border-[#10b981]/20 px-8 py-5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <Plane className="w-5 h-5 text-[#10b981]" />
                           <span className="font-ps-display font-bold uppercase tracking-[0.2em] text-[#10b981] text-sm">Boarding Pass Solar</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                           <span className="text-[#10b981]/70 font-mono text-[10px] tracking-widest">{P.hash} • {P.vector}</span>
                         </div>
                       </div>
                       {/* Body */}
                       <div className="p-8">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                           <div className="space-y-6">
                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Viajante</p>
                               <p className="text-white font-serif text-lg">{P.name}</p>
                             </div>
                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Origem Natal</p>
                               <p className="text-white font-medium">{P.origin}</p>
                             </div>
                           </div>
                           <div className="space-y-6">
                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Destino Ideal</p>
                               <p className="text-[#10b981] font-bold text-2xl uppercase tracking-wider">{P.city}</p>
                               <p className="text-white/40 font-mono text-xs mt-1">{P.coords}</p>
                             </div>
                             <div>
                               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Data da Viagem</p>
                               <p className="text-white font-medium">{P.date}</p>
                               <p className="text-white/40 font-mono text-xs">{P.time}</p>
                             </div>
                           </div>
                           <div className="space-y-6 md:col-span-2">
                             <div className="bg-[#10b981]/5 rounded-2xl p-5 border border-[#10b981]/10 flex flex-col md:flex-row items-center gap-6 justify-between h-full">
                               <div>
                                 <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Classe / Energia</p>
                                 <p className="text-[#10b981] font-bold text-xl uppercase">Casa {P.house}</p>
                                 <p className="text-white/70 font-medium text-sm">{P.houseLabel}</p>
                               </div>
                               <div className="flex gap-6 items-center">
                                 <div className="text-center">
                                   <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Match</p>
                                   <p className="text-white font-ps-display font-bold text-4xl">{P.match}%</p>
                                 </div>
                                 <div className="w-px h-12 bg-white/10"></div>
                                 <div className="text-center">
                                   <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Custo</p>
                                   <div className="flex items-center gap-1">
                                     <Shield className="w-3 h-3 text-[#10b981]" />
                                     <p className="text-white font-bold text-lg">{P.cost} Crédito</p>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                       {/* Footer Barcode */}
                       <div className="bg-black/40 px-8 py-3 flex justify-between items-center opacity-50">
                         <div className="font-barcode text-4xl tracking-widest text-[#10b981]">||| || ||| | || || |||</div>
                         <span className="font-mono text-xs text-white/30 tracking-[0.3em]">PROTOCOLO SOLAR</span>
                       </div>
                     </div>
                  </div>`;

content = content.replace(targetText, newBoardingPass);

// 5. Fix the Accordion hardcoded Rose-500 colors so it uses area.color properly.
// The accordion container button uses: ${isOpen ? (isUnlocked ? 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'bg-white/[0.04] border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)]') : 'bg-black/40 border-white/5'}
// We can change this to use inline styles for the active state to perfectly map area.color.
// Or just let's inject a style block for the active item.
// Let's replace the whole LIFE_AREAS.map for the accordion:

const oldMapStart = `                        {LIFE_AREAS.map((area) => {
                          const isUnlocked = area.id.toLowerCase() === P.intention.toLowerCase() || area.unlocked;
                          const isOpen = openArea === area.id;
                          return (`;

const oldMapEnd = `                                </motion.div>
                              );
                            })}
                          </div>
                        </div>`;

// Wait, doing full regex replacement of this giant block is risky.
// Instead, let's just do a string replacement of the hardcoded rose-500 classes:

content = content.replace(/bg-rose-500\/10 border-rose-500\/20 shadow-\[0_0_40px_rgba\(244,63,94,0\.1\)\]/g, 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]');
content = content.replace(/bg-rose-500\/20 border-rose-500\/30/g, 'bg-emerald-500/20 border-emerald-500/30');
content = content.replace(/text-rose-400/g, 'text-emerald-400');
content = content.replace(/bg-rose-500\/10 border border-rose-500\/20/g, 'bg-emerald-500/10 border border-emerald-500/20');
content = content.replace(/rgba\(244,63,94,0\.05\)/g, 'rgba(16,185,129,0.05)');

// Also the user wanted the big block on the right to match the exact image (yellow/gold for identity).
// In AppleResultPrototype, the active item uses its own color. Let's make sure the large card takes the background color of the active item!
// Look at: <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transition-all duration-1000" style={{ backgroundImage: "url('/apple-mock/apple_intelligence__bkgdcn4e0kj6_large.png')" }} />
// And: <div className="absolute inset-0 bg-gradient-to-t from-[#02160F] via-[#02160F]/60 to-transparent" />
// We can add a color overlay:
const oldRightCard = `<div className="sticky top-10 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden min-h-[600px] relative flex flex-col justify-end">`;
const newRightCard = `<div className="sticky top-10 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden min-h-[600px] relative flex flex-col justify-end transition-colors duration-700" style={{ backgroundColor: LIFE_AREAS.find(a => a.id === openArea)?.color + '1a' }}>`;
content = content.replace(oldRightCard, newRightCard);

fs.writeFileSync(file, content);
console.log("Fixed everything!");
