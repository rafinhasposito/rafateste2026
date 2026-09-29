const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const targetStr = `                      </motion.div>
                    </div>
                  )}
               </div>`;

if (code.includes(targetStr)) {
    const dnaBlock = `                      </motion.div>

                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Segmented Control) */}
                      <div className="w-full mt-32">
                        <div className="flex flex-col items-center mb-16 text-center">
                          <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tight mb-4">O Seu DNA de Ativação</h2>
                          <p className="text-white/60 text-lg max-w-2xl font-light">
                            Descubra como a sua assinatura astrológica única direciona a conquista desta área.
                          </p>
                        </div>

                        {(() => {
                          const dnaData = [
                            {
                              id: 'essencia',
                              label: 'Sua Essência',
                              title: 'Sol em Leão: O Seu Magnetismo Natural',
                              text: \`Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na área de \${currentActiveData.label}, a energia desta cidade potencializa seu magnetismo para atrair resultados com velocidade.\`,
                              icon: Sun
                            },
                            {
                              id: 'metodo',
                              label: 'Seu Método',
                              title: 'Asc. em Virgem: Seu Modo de Execução',
                              text: 'Traz a mente analítica a seu favor. O universo facilita que você organize processos com disciplina, método impecável e visão de longo prazo.',
                              icon: ArrowUpCircle
                            },
                            {
                              id: 'fase',
                              label: 'Fase Atual',
                              title: 'Maturidade (41 Anos): Seu Momento de Vida',
                              text: 'A ambição cede lugar à sabedoria prática. O objetivo agora não é a ostentação superficial, mas a construção definitiva de um porto seguro e estabilidade real.',
                              icon: Hourglass
                            }
                          ];
                          
                          const activeDnaObj = dnaData.find(d => d.id === activeDnaTab) || dnaData[0];

                          return (
                            <div className="flex flex-col items-center w-full">
                              {/* The Pill Control */}
                              <div className="bg-black/50 backdrop-blur-xl p-1.5 rounded-full flex gap-1 mb-12 border border-white/10 shadow-lg">
                                {dnaData.map(item => {
                                  const isActive = activeDnaTab === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => setActiveDnaTab(item.id)}
                                      className={\`relative px-5 md:px-8 py-3.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300 z-10 \${isActive ? 'text-black' : 'text-white/60 hover:text-white'}\`}
                                    >
                                      {isActive && (
                                        <motion.div
                                          layoutId="activeTabIndicator"
                                          className="absolute inset-0 rounded-full -z-10"
                                          style={{ backgroundColor: currentActiveData.color, boxShadow: \`0 0 20px \${currentActiveData.color}60\` }}
                                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                      )}
                                      <span className="flex items-center gap-2">
                                        {/* Apenas mostrar label para limpar */}
                                        {item.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* The Content Area */}
                              <div className="w-full max-w-4xl min-h-[300px] relative">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={activeDnaObj.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                  >
                                    <div 
                                      className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-[2rem] flex items-center justify-center shadow-2xl relative"
                                      style={{ backgroundColor: \`\${currentActiveData.color}15\`, border: \`1px solid \${currentActiveData.color}30\` }}
                                    >
                                      <div className="absolute inset-0 blur-xl opacity-40 rounded-[2rem]" style={{ backgroundColor: currentActiveData.color }}></div>
                                      <activeDnaObj.icon className="w-12 h-12 md:w-16 md:h-16 relative z-10" style={{ color: currentActiveData.color }} strokeWidth={1.5} />
                                    </div>
                                    
                                    <div className="text-center md:text-left">
                                      <h4 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">{activeDnaObj.title}</h4>
                                      <p className="text-white/60 text-base md:text-xl leading-relaxed font-light">{activeDnaObj.text}</p>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                    </div>
                  )}
               </div>`;

    code = code.replace(targetStr, dnaBlock);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Block 3 successfully injected into the main page.");
} else {
    console.log("Could not find the target string.");
}
