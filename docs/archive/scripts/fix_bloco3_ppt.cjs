const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const targetStrStart = `                        {(() => {
                          const dnaData = [`;
const targetStrEnd = `                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            </div>
                          );
                        })()}`;

if (code.includes(targetStrStart)) {
    const startIndex = code.indexOf(targetStrStart);
    const endIndex = code.indexOf(targetStrEnd, startIndex) + targetStrEnd.length;

    const newBlock = `                        {(() => {
                          const dnaData = [
                            {
                              id: 'essencia',
                              label: 'Sua Essência',
                              title: 'Sol em Leão',
                              text: \`O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de \${currentActiveData.label}, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.\`
                            },
                            {
                              id: 'metodo',
                              label: 'Seu Método',
                              title: 'Ascendente em Virgem',
                              text: 'A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.'
                            },
                            {
                              id: 'fase',
                              label: 'Fase Atual',
                              title: 'Maturidade (41 Anos)',
                              text: 'A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real.'
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
                                      className={\`relative px-6 md:px-10 py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 z-10 \${isActive ? 'text-black' : 'text-white/60 hover:text-white'}\`}
                                    >
                                      {isActive && (
                                        <motion.div
                                          layoutId="activeTabIndicator"
                                          className="absolute inset-0 rounded-full -z-10"
                                          style={{ backgroundColor: currentActiveData.color, boxShadow: \`0 0 30px \${currentActiveData.color}40\` }}
                                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                      )}
                                      <span className="relative z-20">
                                        {item.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* The Content Area - Editorial Style */}
                              <div className="w-full max-w-4xl min-h-[280px] relative">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={activeDnaObj.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 bg-black/30 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                                  >
                                    {/* Subtle Ambient Glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] opacity-20 pointer-events-none rounded-full blur-[100px]" style={{ backgroundColor: currentActiveData.color }} />
                                    
                                    <div className="relative z-10 max-w-3xl flex flex-col items-center">
                                      <h4 className="font-ps-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">{activeDnaObj.title}</h4>
                                      <div className="w-12 h-px mb-8 opacity-40" style={{ backgroundColor: currentActiveData.color }} />
                                      <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-light">{activeDnaObj.text}</p>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            </div>
                          );
                        })()}`;

    code = code.substring(0, startIndex) + newBlock + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("PPT styling removed. Editorial typography injected.");
} else {
    console.log("Could not find the target string start.");
}
