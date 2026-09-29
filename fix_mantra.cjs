const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const targetStr = `<div className="w-full h-px bg-white/10 mb-6"></div>

                            <p className="text-white/60 text-base md:text-lg font-serif italic relative z-10">
                              "{currentActiveData?.mantra}"
                            </p>`;

const replacementStr = `<div className="w-full h-px bg-white/10 mb-8 mt-2"></div>

                            <div className="relative z-10 bg-black/20 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-md">
                              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                              
                              <div className="flex items-center gap-2 mb-4">
                                 <Sparkles className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                                 <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: currentActiveData?.color || '#10b981' }}>O Mantra de Ativação</span>
                              </div>
                              
                              <p className="text-white text-xl md:text-2xl font-serif italic leading-relaxed drop-shadow-sm font-medium">
                                "{currentActiveData?.mantra}"
                              </p>
                            </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Mantra highlighted successfully.");
} else {
    console.log("Could not find the target mantra string. Please check the exact formatting.");
}
