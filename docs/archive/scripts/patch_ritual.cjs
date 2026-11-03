const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

const target = `{/* Caixa do Ritual (shrink-0 garante que não seja espremida) */}
                          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>O Ritual de 24 Horas</span>
                            
                            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed relative z-10 mb-6">
                              {currentActiveData?.ritual}
                            </p>
                            
                            
                          </div>`;

const newRitual = `{/* Caixa do Ritual & Dossiê Astrológico (shrink-0 garante que não seja espremida) */}
                          <div className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden group shrink-0 mt-8">
                            <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            {/* O Tema */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-3" style={{ color: currentActiveData?.color || '#10b981' }}>O Tema do Seu Ano</span>
                            <p className="text-white/90 text-xl md:text-2xl font-medium leading-relaxed relative z-10 mb-8">
                              Consolidação e Crescimento Material
                            </p>

                            <div className="w-full h-px bg-white/10 my-8"></div>

                            {/* O Segredo */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-3" style={{ color: currentActiveData?.color || '#10b981' }}>O Segredo Deste Ano</span>
                            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed relative z-10 mb-8">
                              A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você.
                            </p>

                            <div className="w-full h-px bg-white/10 my-8"></div>

                            {/* Os Gestos que Ancoram */}
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>Os Gestos que Ancoram (Ritual 24h)</span>
                            <div className="space-y-5 relative z-10">
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>1.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto financeiro.
                                </p>
                              </div>
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>2.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Durante a transação, afirme mentalmente: "Este é o último investimento do meu antigo ciclo de escassez".
                                </p>
                              </div>
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-sm font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>3.</span>
                                <p className="text-white/80 text-base md:text-lg font-light leading-relaxed">
                                  Ancore na cidade caminhando pelos distritos financeiros sentindo que aquele é o seu habitat natural.
                                </p>
                              </div>
                            </div>
                          </div>`;

// Use regex matching to be safe against spaces
code = code.replace(/\{\/\*\s*Caixa do Ritual \(shrink-0.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?<\/div>/s, newRitual);
fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
console.log("Patched.");
