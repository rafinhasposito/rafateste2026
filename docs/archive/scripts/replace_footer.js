const fs = require('fs');
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                       {/* Footer Barcode */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
                         <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar • 24h de Imantação na Cidade de Destino</span>
                       </div>
                     </div>
                  </div>`;

const replacement = `                       {/* Footer Barcode + Share */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
                         <div className="flex items-center gap-4">
                           <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5 hidden md:block">Protocolo Solar • 24h de Imantação</span>
                           <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-4 py-2 transition-all hover:scale-105 active:scale-95 group">
                             <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:text-[#10b981] transition-colors" />
                             <span className="text-[10px] text-white/60 group-hover:text-white uppercase font-bold tracking-widest transition-colors">📸 Compartilhar Ancoragem</span>
                           </button>
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* STATUS BADGES */}
                  <div className="flex flex-wrap justify-center gap-4 mt-8 pb-4">
                    <div className="flex items-center gap-2.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-5 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                      <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-widest">Status de Ancoragem: Registrado</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                      <Clock className="w-3.5 h-3.5 text-white/50" />
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Janela de Ativação: 24h no Destino</span>
                    </div>
                  </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success");
} else {
  console.log("Target not found");
}
