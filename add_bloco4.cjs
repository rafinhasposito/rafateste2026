const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const targetStr = `                      </div>

                    </div>
                  )}
               </div>`;

const block4Str = `                      </div>

                      {/* BLOCO 4: A LINHA DO TEMPO (ACCORDION) */}
                      <div className="w-full mt-40 max-w-4xl mx-auto mb-32">
                        <div className="text-center mb-24">
                          <h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tighter mb-6">O Seu Ano em 3 Fases.</h2>
                          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Como o seu foco em <strong className="text-white font-medium">{currentActiveData.label}</strong> se desdobra ao longo dos próximos 12 meses nesta cidade.
                          </p>
                        </div>

                        <div className="flex flex-col border-t border-white/10">
                          {currentActiveData.timeline?.map((phase, index) => {
                            const isOpen = openTimelinePhase === index;
                            return (
                              <div key={index} className="border-b border-white/10 flex flex-col group">
                                <button 
                                  onClick={() => setOpenTimelinePhase(isOpen ? null : index)}
                                  className="w-full py-10 md:py-14 flex flex-col md:flex-row md:items-center justify-between text-left transition-colors duration-500 hover:bg-white/[0.02]"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 w-full px-4 md:px-8">
                                    <span 
                                      className="font-mono text-sm tracking-[0.2em] uppercase transition-colors duration-500 w-40 shrink-0" 
                                      style={{ color: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.4)' }}
                                    >
                                      {phase.period}
                                    </span>
                                    <h3 className={\`font-ps-display text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-500 \${isOpen ? 'text-white' : 'text-white/40 group-hover:text-white/70'}\`}>
                                      {phase.phase}
                                    </h3>
                                  </div>
                                  <div className="hidden md:flex shrink-0 ml-4 mr-8 w-12 h-12 items-center justify-center rounded-full border transition-all duration-500" style={{ borderColor: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.1)', backgroundColor: isOpen ? \`\${currentActiveData.color}10\` : 'transparent' }}>
                                     <Plus className={\`w-5 h-5 transition-transform duration-500 \${isOpen ? 'rotate-45' : ''}\`} style={{ color: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.4)' }} />
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pb-14 px-4 md:pl-[14rem] md:pr-12">
                                         <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-light">{phase.text}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  )}
               </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, block4Str);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Block 4 Accordion Timeline injected successfully.");
} else {
    console.log("Could not find the target string.");
}
