const fs = require('fs');
const file = 'src/pages/HouseResult.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none"></div>',
  '<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: `${themeColor}0D` }}></div>' // 0D is ~5% opacity
);

content = content.replace(
  '<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-8">',
  '<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest mb-8" style={{ color: themeColor }}>'
);

content = content.replace(
  '<div className="bg-black/40 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col">',
  '<div className="bg-black/40 border rounded-[32px] overflow-hidden backdrop-blur-xl flex flex-col transition-all duration-1000" style={{ borderColor: `${themeColor}4D`, boxShadow: `0 30px 80px -20px ${themeColor}26` }}>'
);

// I should also check if any other places have "#10b981" string literal that I should dynamically replace?
// I see `currentActiveData?.color || '#10b981'` -> these are fine as fallback, since currentActiveData.color is now dynamic.

fs.writeFileSync(file, content);
console.log("Fixed hardcoded green styling!");
