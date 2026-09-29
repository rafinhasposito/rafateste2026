const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const target = `<div className="px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
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

const replacement = `<div className="px-8 py-5 flex items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex items-center gap-4 text-sm w-full">
                                  <span className="text-white/90 font-medium">{P.firstName}</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">09/08/1985</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">{P.sign}</span>
                                  
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="text-[#10b981] font-bold flex items-center gap-2">
                                      <Star className="w-4 h-4" />
                                      {P.match}% MATCH
                                    </span>
                                  </div>
                               </div>
                             </div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Boarding pass closed state successfully updated!");
} else {
    console.log("ERROR: Could not find the target code block.");
}
