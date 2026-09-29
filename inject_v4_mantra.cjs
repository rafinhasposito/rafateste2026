const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const mantraStart = `{/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (OUTSIDE THE PANEL) */}`;
const mantraEnd = `{/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(mantraStart) && code.includes(mantraEnd)) {
    const startIndex = code.indexOf(mantraStart);
    const endIndex = code.indexOf(mantraEnd);
    
    const refinedV4 = `{/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}
                      <div className="w-full max-w-6xl mx-auto mt-32 mb-48 px-6 text-center flex flex-col items-center relative">
                        {/* Glow suave de fundo para ancorar o texto */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex items-center gap-3 mb-10 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                             <Sparkles className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                             <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold" style={{ color: currentActiveData?.color || '#10b981' }}>O Mantra de Ativação</span>
                          </div>
                          
                          <p className="text-4xl md:text-6xl lg:text-7xl font-ps-display font-bold tracking-tighter leading-[1.1] md:leading-[1.15] bg-clip-text text-transparent pb-2 max-w-5xl"
                             style={{ backgroundImage: \`linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 40%, \${currentActiveData?.color || '#10b981'} 100%)\` }}>
                            "{currentActiveData?.mantra}"
                          </p>
                        </div>
                      </div>

                      `;
    
    code = code.substring(0, startIndex) + refinedV4 + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("V4 Cinematic Mantra injected and refined.");
} else {
    console.log("Could not find the Mantra block bounds.");
}
