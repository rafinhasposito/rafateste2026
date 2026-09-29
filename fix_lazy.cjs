const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add Parallax hooks
const hookInjectionPoint = `  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);`;
if (!code.includes('const block4Ref = useRef<HTMLDivElement>(null);')) {
    code = code.replace(hookInjectionPoint, hookInjectionPoint + `\n\n  // Parallax Block 4\n  const block4Ref = useRef<HTMLDivElement>(null);\n  const { scrollYProgress: scroll4Progress } = useScroll({ target: block4Ref, offset: ["start end", "end start"] });\n  const parallaxY = useTransform(scroll4Progress, [0, 1], ["-15%", "15%"]);\n`);
}

// 2. Change Default Area to "trabalho" (New York)
code = code.replace(`useState<string>("dinheiro");`, `useState<string>("trabalho");`);
code = code.replace(`useState<string | null>("dinheiro");`, `useState<string | null>("trabalho");`);

// 3. Fix the HTML Block 4 (Replace the old split block with the proper parallax and no-cut text layout)
const block4Start = `                      {/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}`;
const block4End = `                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(block4Start) && code.includes(block4End)) {
    const startIndex = code.indexOf(block4Start);
    const endIndex = code.indexOf(block4End);
    
    const newBlock4 = `{/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}
                      <div ref={block4Ref} className="w-full mt-40 max-w-[1400px] mx-auto mb-32 relative rounded-[40px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-end min-h-[700px]">
                        
                        {/* Imagem de Fundo Completa com Parallax Real */}
                        <motion.div 
                          style={{ y: parallaxY }}
                          className="absolute -inset-[20%] w-[140%] h-[140%] left-0 z-0"
                        >
                          <img src={currentActiveData.image} alt={currentActiveData.city} className="w-full h-full object-cover opacity-90" />
                        </motion.div>
                        
                        {/* Overlay Gradient for readability on the left */}
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#03100B]/80 via-transparent to-transparent z-0 pointer-events-none"></div>

                        {/* Painel Lateral Direito (Flex auto para crescer conforme o texto sem cortar) */}
                        <div className="relative z-10 w-full md:w-[45%] h-full min-h-[700px] bg-[#03100B]/80 backdrop-blur-3xl border-t md:border-t-0 md:border-l border-white/10 p-10 md:p-16 flex flex-col justify-center">
                          
                          <div className="mb-10">
                            {/* Selo de Localização (Maior) */}
                            <div className="flex items-center gap-3 mb-8 px-6 py-3 bg-black/60 rounded-full border border-white/10 w-fit backdrop-blur-md shadow-lg">
                                <MapPin className="w-5 h-5" style={{ color: currentActiveData.color }} />
                                <span className="font-mono text-sm md:text-base tracking-widest uppercase text-white font-semibold">{currentActiveData.city}</span>
                            </div>
                            
                            <p className="text-white/90 text-xl font-light leading-relaxed">
                              {currentActiveData.cityDesc}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity" style={{ backgroundColor: currentActiveData.color }}></div>
                            
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4" style={{ color: currentActiveData.color }}>O Ritual de 24 Horas</span>
                            <p className="text-white text-lg md:text-xl font-light leading-relaxed relative z-10 mb-6">
                              {currentActiveData.ritual}
                            </p>

                            <div className="w-full h-px bg-white/10 mb-6"></div>

                            <p className="text-white/70 text-base md:text-lg font-serif italic relative z-10">
                              "{currentActiveData.mantra}"
                            </p>
                          </div>

                        </div>
                      </div>

                      `;
    
    code = code.substring(0, startIndex) + newBlock4 + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Fixed Block 4 with real Parallax, min-height, and New York default.");
} else {
    console.log("Could not find block 4 bounds.");
}
