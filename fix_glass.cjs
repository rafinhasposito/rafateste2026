const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const block4Start = `{/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}`;
const block4End = `{/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(block4Start) && code.includes(block4End)) {
    const startIndex = code.indexOf(block4Start);
    const endIndex = code.indexOf(block4End);
    
    // Webkit mask bug fix for border-radius + overflow-hidden
    const newBlock4 = `{/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}
                      <div ref={block4Ref} 
                           className="w-full mt-40 max-w-[1400px] mx-auto mb-32 relative rounded-[40px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-end min-h-[700px]"
                           style={{ overflow: 'hidden', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                      >
                        
                        {/* Imagem de Fundo Completa com Parallax Real */}
                        <motion.div 
                          style={{ y: parallaxY }}
                          className="absolute -inset-[20%] w-[140%] h-[140%] left-0 z-0"
                        >
                          <img src={GLOBAL_CITY_IMAGE} alt={GLOBAL_CITY_NAME} className="w-full h-full object-cover opacity-100" />
                        </motion.div>
                        
                        {/* Overlay Gradient suave apenas para leitura (nao escurecer tudo) */}
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent z-0 pointer-events-none"></div>

                        {/* Painel Lateral Direito (O verdadeiro vidro fosco) */}
                        <div className="relative z-10 w-full md:w-[45%] h-full min-h-[700px] bg-black/20 backdrop-blur-[40px] border-t md:border-t-0 md:border-l border-white/10 p-10 md:p-16 flex flex-col justify-center rounded-b-[40px] md:rounded-bl-none md:rounded-r-[40px]">
                          
                          <div className="mb-10">
                            {/* Selo de Localização */}
                            <div className="flex items-center gap-3 mb-8 px-6 py-3 bg-black/40 rounded-full border border-white/20 w-fit backdrop-blur-md shadow-lg">
                                <MapPin className="w-5 h-5 text-white" />
                                <span className="font-mono text-sm md:text-base tracking-widest uppercase text-white font-semibold">{GLOBAL_CITY_NAME}</span>
                            </div>
                            
                            <p className="text-white/90 text-xl font-light leading-relaxed drop-shadow-md">
                              {GLOBAL_CITY_DESC}
                            </p>
                          </div>

                          <div className="bg-white/10 rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl shrink-0 backdrop-blur-md">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 transition-opacity" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/70 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>O Ritual de 24 Horas</span>
                            <p className="text-white text-lg md:text-xl font-light leading-relaxed relative z-10 mb-6 drop-shadow-sm">
                              {currentActiveData?.ritual}
                            </p>

                            <div className="w-full h-px bg-white/20 mb-6"></div>

                            <p className="text-white/80 text-base md:text-lg font-serif italic relative z-10 drop-shadow-sm">
                              "{currentActiveData?.mantra}"
                            </p>
                          </div>

                        </div>
                      </div>

                      `;
    
    code = code.substring(0, startIndex) + newBlock4 + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Fixed Block 4 glass transparency and Safari corner bleed.");
} else {
    console.log("Could not find block 4 bounds.");
}
