const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Ensure required icons are imported
const requiredIcons = ['Plane', 'MapPin', 'Calendar', 'Clock', 'Sun', 'ArrowUpCircle', 'Landmark', 'CircleDollarSign'];
let importMatch = content.match(/import \{([^}]+)\} from 'lucide-react'/);
if (importMatch) {
  let existingIcons = importMatch[1].split(',').map(i => i.trim());
  let newIcons = [...new Set([...existingIcons, ...requiredIcons])];
  content = content.replace(importMatch[0], `import { ${newIcons.join(', ')} } from 'lucide-react'`);
}

// 2. Locate and replace the old Boarding Pass
const startBP = "{/* ======================= BOARDING PASS ======================= */}";
const endBP = "{/* ══════════════════════════════════════════════════\n         3. PERSONALIZAÇÃO";
const bpRegex = new RegExp(startBP.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?(?=' + endBP.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + ')');

const newBP = `{/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}
                  <div className="w-full max-w-4xl mx-auto mb-20">
                     <div className="bg-[#02160F]/80 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col">
                       
                       {/* Header */}
                       <div className="bg-[#10b981]/10 border-b border-[#10b981]/20 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                           <Plane className="w-5 h-5 text-[#10b981]" />
                           <span className="font-ps-display font-bold uppercase tracking-[0.25em] text-[#10b981] text-sm">Boarding Pass Solar</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]"></div>
                           <span className="text-[#10b981]/90 font-mono text-xs tracking-widest">{P.hash} • ATIVO</span>
                         </div>
                       </div>

                       {/* Body */}
                       <div className="p-8 md:p-10 flex flex-col gap-10">
                         
                         {/* Viajante */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Viajante</p>
                           <p className="text-white font-serif text-3xl">{P.name}</p>
                         </div>

                         {/* Rota de Ancoragem */}
                         <div className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                           
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Rota de Ancoragem</p>
                           
                           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                             <div className="flex-1">
                               <p className="text-white font-medium text-xl md:text-2xl flex items-center gap-2">
                                 <MapPin className="w-5 h-5 text-white/50 shrink-0"/> 
                                 <span className="truncate">{P.origin} <span className="text-white/30 text-sm ml-1">(BR)</span></span>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Origem Natal</p>
                             </div>
                             
                             <div className="hidden md:flex flex-col items-center justify-center px-4 w-1/3">
                               <Plane className="w-6 h-6 text-[#10b981] opacity-80" />
                               <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>
                             </div>
                             
                             {/* Versão Mobile da Seta */}
                             <div className="md:hidden flex items-center gap-4 text-[#10b981]/50 w-full">
                               <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#10b981]/50 to-transparent ml-2.5"></div>
                               <Plane className="w-5 h-5 rotate-90" />
                             </div>

                             <div className="flex-1 md:text-right">
                               <p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2">
                                 <span className="truncate">{P.city}</span>
                                 <MapPin className="w-6 h-6 shrink-0"/>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Destino do Aniversário</p>
                             </div>
                           </div>
                         </div>

                         {/* Momento Exato */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Momento Exato da Ativação (Retorno Solar)</p>
                           <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white text-lg md:text-xl font-medium">
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Calendar className="w-5 h-5 text-[#10b981]"/> 
                               09 de Agosto, 2027
                             </span>
                             <span className="text-white/20 hidden md:inline">|</span>
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Clock className="w-5 h-5 text-[#10b981]"/> 
                               {P.time}
                             </span>
                           </div>
                         </div>

                         {/* DNA vs Ativação */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-6">
                             <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-5">DNA Astrológico</p>
                             <div className="space-y-4">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Sun className="w-5 h-5 text-yellow-400"/> Sol em {P.sign}
                               </p>
                               <p className="text-white/80 font-medium text-lg flex items-center gap-3">
                                 <ArrowUpCircle className="w-5 h-5 text-purple-400"/> Ascendente {P.ascendant}
                               </p>
                             </div>
                           </div>
                           
                           <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent pointer-events-none"></div>
                             <p className="text-[#10b981]/70 text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10">Ativação Anual</p>
                             <div className="space-y-4 relative z-10">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Landmark className="w-5 h-5 text-[#10b981]"/> Casa {P.house}
                               </p>
                               <p className="text-[#10b981] font-bold text-xl flex items-center gap-3">
                                 <CircleDollarSign className="w-5 h-5"/> Dinheiro & Prosperidade
                               </p>
                             </div>
                           </div>
                         </div>

                         {/* Compatibilidade */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 mt-2 gap-4">
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Compatibilidade da Escolha</p>
                           <div className="flex items-center justify-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-full border border-[#10b981]/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                             <span className="text-[#10b981] font-bold tracking-widest text-lg">{P.match}% MATCH</span>
                           </div>
                         </div>

                       </div>

                       {/* Footer Barcode */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
                         <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar • 24h de Imantação na Cidade de Destino</span>
                       </div>
                     </div>
                  </div>
                  `;

content = content.replace(bpRegex, newBP);
fs.writeFileSync(file, content);
console.log("High-end Boarding Pass crafted successfully!");
