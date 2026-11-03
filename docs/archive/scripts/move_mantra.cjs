const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Remove the Mantra from INSIDE the glass panel
const innerMantraStr = `<div className="w-full h-px bg-white/10 mb-8 mt-2"></div>

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

if (code.includes(innerMantraStr)) {
    code = code.replace(innerMantraStr, "");
} else {
    console.log("Could not find inner mantra to remove. Proceeding anyway...");
}

// 2. Inject the Mantra OUTSIDE, right before Bloco 5
const block5Anchor = `{/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

const outsideMantraStr = `{/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (OUTSIDE THE PANEL) */}
                      <div className="w-full max-w-5xl mx-auto mt-32 mb-48 px-6 text-center relative flex flex-col items-center">
                        {/* Aspas gigantes no fundo para dar textura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[200px] md:text-[300px] font-serif italic text-white/[0.02] leading-none pointer-events-none select-none">
                          "
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center w-full">
                          <div className="flex items-center gap-3 mb-10 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                             <Sparkles className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                             <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold" style={{ color: currentActiveData?.color || '#10b981' }}>O Mantra de Ativação</span>
                          </div>
                          
                          <p className="text-white text-3xl md:text-5xl lg:text-6xl font-serif italic leading-relaxed md:leading-snug drop-shadow-2xl">
                            "{currentActiveData?.mantra}"
                          </p>
                        </div>
                      </div>

                      `;

if (code.includes(block5Anchor)) {
    code = code.replace(block5Anchor, outsideMantraStr + block5Anchor);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Mantra moved to the outside successfully.");
} else {
    console.log("Could not find Bloco 5 anchor to inject the new mantra.");
}
