const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const insertTarget = 'A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.\n                  </p>';
const bpStart = '{/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}';
const bpEndString = '                   )}\n                 </AnimatePresence>\n               </div>\n            </div>';

if (code.includes(insertTarget) && code.includes(bpStart)) {
    const sbp = code.indexOf(bpStart);
    const ebp = code.indexOf(bpEndString, sbp) + bpEndString.length;
    const bpBlock = code.substring(sbp, ebp);
    code = code.substring(0, sbp) + code.substring(ebp);
    code = code.replace(insertTarget, insertTarget + '\n\n' + bpBlock);
    
    // Clean up Boarding Pass Preview (remove badges, correct data)
    const oldPreview = `<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-white/30" />
                                  <span className="text-white/60 text-sm font-medium">{P.origin}</span>
                                  <Plane className="w-4 h-4 text-[#10b981]/50" />
                                  <span className="text-[#10b981] font-bold text-sm uppercase">{P.city}</span>
                               </div>
                               <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <span className="flex items-center gap-2 text-white/70">
                                    <Calendar className="w-4 h-4 text-[#10b981]/70" />
                                    09 Ago, 2027
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-[#10b981] font-bold flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    {P.match}% MATCH
                                  </span>
                               </div>
                             </div>`;
    const newPreview = `<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                  <span className="text-white/90 font-medium text-sm flex items-center gap-2">
                                    <User className="w-4 h-4 text-white/40" />
                                    {P.firstName}
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-white/60 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-white/40" />
                                    09/08/1985
                                  </span>
                                  <span className="text-white/20 hidden md:inline">|</span>
                                  <span className="text-white/80 text-sm flex items-center gap-2 font-medium">
                                    <Sun className="w-4 h-4 text-yellow-400" />
                                    Leão
                                  </span>
                               </div>
                               <div className="flex items-center gap-3 text-sm">
                                  <span className="text-[#10b981] font-bold flex items-center gap-2 bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
                                    <Star className="w-4 h-4" />
                                    {P.match}% MATCH
                                  </span>
                               </div>
                             </div>`;
    code = code.replace(oldPreview, newPreview);
    
    // Remove badges
    const badgesBlock = `<div className="flex flex-wrap items-center justify-center gap-4 mb-10">
             <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest">STATUS: REGISTRADO</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">JANELA: 24H NO DESTINO</span>
             </div>
          </div>`;
    code = code.replace(badgesBlock, '');
    
    // Remove share
    const shareBtnBlock = `{/* 4. Botão Compartilhar */}
          <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors px-6 py-3 rounded-2xl text-white/80 font-medium text-sm group">
            <Camera className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            Compartilhar Ancoragem nos Stories
          </button>`;
    code = code.replace(shareBtnBlock, '');
    
    if (!code.includes('User,')) code = code.replace('import { MapPin,', 'import { MapPin, User, Sun,');
    
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log('Boarding Pass moved and cleaned');
}
