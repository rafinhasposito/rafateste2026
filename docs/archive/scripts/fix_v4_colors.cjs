const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard #10b981 with dynamic hex where possible, but safely.
// We'll define a theme color variable.
if (!content.includes('const themeColor =')) {
  content = content.replace(
    'const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];',
    'const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];\n  const themeColor = currentActiveData?.color || activeRoute.color || \'#10b981\';'
  );
}

// Block 1: Boarding Pass Header
content = content.replace(
  'className="bg-[#10b981]/10 border-b border-[#10b981]/20 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-[#10b981]/20 transition-colors select-none"',
  'className="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer transition-colors select-none" style={{ backgroundColor: `${themeColor}15`, borderBottom: `1px solid ${themeColor}30` }}'
);
content = content.replace(
  '<Plane className="w-5 h-5 text-[#10b981]" />',
  '<Plane className="w-5 h-5" style={{ color: themeColor }} />'
);
content = content.replace(
  '<span className="font-ps-display font-bold uppercase tracking-[0.25em] text-[#10b981] text-sm">Boarding Pass Solar</span>',
  '<span className="font-ps-display font-bold uppercase tracking-[0.25em] text-sm" style={{ color: themeColor }}>Boarding Pass Solar</span>'
);
content = content.replace(
  '<div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]"></div>',
  '<div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}></div>'
);
content = content.replace(
  '<span className="text-[#10b981]/90 font-sans text-xs tracking-widest">{P.hash} • ATIVO</span>',
  '<span className="font-sans text-xs tracking-widest" style={{ color: themeColor }}>{P.hash} • ATIVO</span>'
);
content = content.replace(
  '<span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-full animate-pulse">',
  '<span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full animate-pulse" style={{ color: themeColor, backgroundColor: `${themeColor}15`, borderColor: `${themeColor}30`, borderWidth: 1 }}>'
);
content = content.replace(
  '<div className={`p-1 rounded-full ${!isBoardingPassOpen ? \'bg-[#10b981]/10\' : \'\'}`}>',
  '<div className={`p-1 rounded-full`} style={{ backgroundColor: !isBoardingPassOpen ? `${themeColor}15` : \'transparent\' }}>'
);
content = content.replace(
  '<ChevronDown className={`w-5 h-5 text-[#10b981] transition-transform duration-500 ${isBoardingPassOpen ? \'rotate-180\' : \'\'}`} />',
  '<ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isBoardingPassOpen ? \'rotate-180\' : \'\'}`} style={{ color: themeColor }} />'
);

// Body of Boarding Pass
content = content.replace(
  '<span className="text-[#10b981] font-bold flex items-center gap-2">',
  '<span className="font-bold flex items-center gap-2" style={{ color: themeColor }}>'
);
content = content.replace(
  '<div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>',
  '<div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" style={{ backgroundColor: `${themeColor}0A` }}></div>'
);
content = content.replace(
  '<Plane className="w-6 h-6 text-[#10b981] opacity-80" />',
  '<Plane className="w-6 h-6 opacity-80" style={{ color: themeColor }} />'
);
content = content.replace(
  '<div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>',
  '<div className="w-full h-px mt-3" style={{ background: `linear-gradient(to right, transparent, ${themeColor}80, transparent)` }}></div>'
);
content = content.replace(
  '<div className="md:hidden flex items-center gap-4 text-[#10b981]/50 w-full">',
  '<div className="md:hidden flex items-center gap-4 w-full" style={{ color: `${themeColor}80` }}>'
);
content = content.replace(
  '<div className="w-px h-8 bg-gradient-to-b from-transparent via-[#10b981]/50 to-transparent ml-2.5"></div>',
  '<div className="w-px h-8 ml-2.5" style={{ background: `linear-gradient(to bottom, transparent, ${themeColor}80, transparent)` }}></div>'
);
content = content.replace(
  '<p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2">',
  '<p className="font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2" style={{ color: themeColor }}>'
);
content = content.replace(
  '<Calendar className="w-5 h-5 text-[#10b981]"/>',
  '<Calendar className="w-5 h-5" style={{ color: themeColor }}/>'
);
content = content.replace(
  '<Clock className="w-5 h-5 text-[#10b981]"/>',
  '<Clock className="w-5 h-5" style={{ color: themeColor }}/>'
);
content = content.replace(
  '<div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-6">',
  '<div className="rounded-2xl p-6 border" style={{ backgroundColor: `${themeColor}0D`, borderColor: `${themeColor}1A` }}>'
);
content = content.replace(
  '<div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-6 relative overflow-hidden">',
  '<div className="rounded-2xl p-6 relative overflow-hidden border" style={{ backgroundColor: `${themeColor}1A`, borderColor: `${themeColor}33` }}>'
);
content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent pointer-events-none"></div>',
  '<div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom right, ${themeColor}1A, transparent)` }}></div>'
);
content = content.replace(
  '<p className="text-[#10b981]/70 text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10">Ativação Anual</p>',
  '<p className="text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10" style={{ color: `${themeColor}B3` }}>Ativação Anual</p>'
);
content = content.replace(
  '<Landmark className="w-5 h-5 text-[#10b981]"/> Casa {P.house}',
  '<Landmark className="w-5 h-5" style={{ color: themeColor }}/> Casa {dynamicHouseNum}'
);
content = content.replace(
  '<p className="text-[#10b981] font-bold text-xl flex items-center gap-3">',
  '<p className="font-bold text-xl flex items-center gap-3" style={{ color: themeColor }}>'
);

// Match Badge
content = content.replace(
  '<div className="flex items-center justify-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-full border border-[#10b981]/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">',
  '<div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full border" style={{ backgroundColor: `${themeColor}33`, borderColor: `${themeColor}4D`, boxShadow: `0 0 30px ${themeColor}33` }}>'
);
content = content.replace(
  '<div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>',
  '<div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>'
);
content = content.replace(
  '<span className="text-[#10b981] font-bold tracking-widest text-lg">{P.match}% MATCH</span>',
  '<span className="font-bold tracking-widest text-lg" style={{ color: themeColor }}>{P.match}% MATCH</span>'
);
content = content.replace(
  '<div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">',
  '<div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t" style={{ borderColor: `${themeColor}33` }}>'
);
content = content.replace(
  '<div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>',
  '<div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] scale-y-150 py-2" style={{ color: `${themeColor}B3` }}>||| || ||| | || || |||</div>'
);

fs.writeFileSync(file, content);
console.log("Colors injected successfully!");
