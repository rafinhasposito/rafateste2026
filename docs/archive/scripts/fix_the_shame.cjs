const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. REVERT DEFAULT STATE (Lógica do app foi pro caralho)
code = code.replace(/useState<string>\("trabalho"\)/g, 'useState<string>("dinheiro")');
code = code.replace(/useState<string \| null>\("trabalho"\)/g, 'useState<string | null>("dinheiro")');

// 2. CLEAN UP THE BLOCK 4 UI & QUOTES
const block4Start = `{/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}`;
const block4End = `{/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(block4Start) && code.includes(block4End)) {
    const startIndex = code.indexOf(block4Start);
    const endIndex = code.indexOf(block4End);
    
    // We rewrite the block to match EXACTLY the Sandbox V3 they loved, 
    // with the single global city (Nova York) and NO literal quotes.
    const newBlock4 = `{/* BLOCO 4: O RITUAL E A CIDADE (PAINEL SPLIT APPLE) */}
                      <div ref={block4Ref} className="w-full mt-40 max-w-[1400px] mx-auto mb-32 h-[700px] md:h-[750px] relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex justify-end">
                        
                        {/* Imagem de Fundo (Global: Nova York) */}
                        <motion.div 
                          style={{ y: parallaxY }}
                          className="absolute -inset-[20%] w-[140%] h-[140%] left-0"
                        >
                          <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" alt="Nova York" className="w-full h-full object-cover opacity-90" />
                        </motion.div>
                        
                        {/* Gradiente sutil protegendo a esquerda */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#03100B]/80 via-transparent to-transparent pointer-events-none"></div>

                        {/* Painel Lateral Direito (Design V3 original do Sandbox) */}
                        <div className="relative z-10 w-full md:w-[45%] h-full bg-[#03100B]/70 backdrop-blur-2xl border-l border-white/10 p-10 md:p-14 flex flex-col justify-center">
                          
                          <div className="mb-10">
                            {/* Selo de Localização (Maior e sem aspas) */}
                            <div className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-black/40 rounded-full border border-white/10 w-fit backdrop-blur-md">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-sm tracking-widest uppercase text-white">Nova York, EUA</span>
                            </div>
                            
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                              A energia inesgotável desta ilha não aceita mediocridade, forçando você a assumir a autoridade da sua própria vida e colocar suas ideias nos maiores palcos disponíveis. Um epicentro de vibração alta que acelera manifestações materiais.
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>O Ritual de 24 Horas</span>
                            
                            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed relative z-10 mb-5">
                              {currentActiveData?.ritual}
                            </p>

                            <div className="w-full h-px bg-white/10 mb-5"></div>

                            <p className="text-white/60 text-base font-serif italic relative z-10">
                              "{currentActiveData?.mantra}"
                            </p>
                          </div>

                        </div>
                      </div>

                      `;
    
    code = code.substring(0, startIndex) + newBlock4 + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Restored V3 design, removed quotes, fixed default focus logic.");
} else {
    console.log("Could not find block 4 bounds.");
}
