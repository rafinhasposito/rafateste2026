const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetText = `<span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
           </p>
        </motion.div>`;

const boardingPassCode = `<span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
           </p>
        </motion.div>

        {/* ======================= BOARDING PASS ======================= */}
        <motion.div style={{ opacity: textOpacity }} className="mt-16 w-full max-w-4xl px-4">
           <div className="bg-[#02160F] border border-[#10b981]/20 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.15)] backdrop-blur-xl">
             
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
                 
                 {/* Viajante & Origem */}
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

                 {/* Destino */}
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

                 {/* Energia & Match */}
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
                           <p className="text-white font-bold text-lg">{P.cost}</p>
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
        </motion.div>`;

content = content.replace(targetText, boardingPassCode);

fs.writeFileSync(file, content);
console.log("Boarding Pass added!");
