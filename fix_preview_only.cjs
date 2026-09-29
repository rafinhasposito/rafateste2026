const fs = require('fs');
let file = 'src/pages/AppleResultPreview.tsx';
let code = fs.readFileSync(file, 'utf8');

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

if (code.includes(oldPreview)) {
    code = code.replace(oldPreview, newPreview);
    
    // Add User icon import
    if (!code.includes('User,')) {
        code = code.replace('import { MapPin,', 'import { MapPin, User,');
    }
    
    fs.writeFileSync(file, code);
    console.log('Preview updated successfully!');
} else {
    console.log('Could not find oldPreview block!');
}
