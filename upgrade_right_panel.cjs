const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRightPanel = `                      {/* Lado Direito / Paywall CTA */}
                      <div className="hidden md:flex md:col-span-7 pl-4 relative">
                        <AnimatePresence mode="wait">
                          {openArea && (
                        <div className="sticky top-10 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden min-h-[600px] relative flex flex-col justify-end transition-colors duration-700" style={{ backgroundColor: LIFE_AREAS.find(a => a.id === openArea)?.color + '1a' }}>
                          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transition-all duration-1000" style={{ backgroundImage: "url('/apple-mock/apple_intelligence__bkgdcn4e0kj6_large.png')" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#02160F] via-[#02160F]/60 to-transparent" />

                          <div className="relative z-10 p-12 max-w-2xl">
                            {LIFE_AREAS.filter(a => a.id === openArea).map(area => {
                              const isUnlocked = area.id.toLowerCase() === P.intention.toLowerCase() || area.unlocked;
                              return (
                                <motion.div key={area.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                  <div className={\`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border \${isUnlocked ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}\`}>
                                    <area.icon className={\`w-8 h-8 \${isUnlocked ? 'text-emerald-400' : 'text-white/30'}\`} />
                                  </div>
                                  <h3 className="font-ps-display text-4xl font-bold tracking-tight mb-4">{area.label}</h3>
                                  {isUnlocked ? (
                                    <p className="text-white/80 text-lg font-light leading-relaxed">{area.full}</p>
                                  ) : (
                                    <div>
                                      <p className="text-white/50 text-lg font-light leading-relaxed mb-8">{area.teaser}</p>
                                      <button className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-gray-200 transition flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                        <Lock className="w-4 h-4" />
                                        Liberar Acesso (1 Crédito)
                                      </button>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                          )}
                        </AnimatePresence>
                      </div>`;

const newRightPanel = `                      {/* Lado Direito / Paywall CTA */}
                      <div className="hidden md:flex md:col-span-7 pl-4 relative">
                        <AnimatePresence mode="wait">
                          {LIFE_AREAS.filter(a => a.id === openArea).map((area) => {
                            const isUnlocked = area.id.toLowerCase() === P.intention.toLowerCase() || area.unlocked;
                            return (
                              <motion.div
                                key={area.id}
                                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="sticky top-10 flex-1 w-full h-[600px] lg:h-full relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000"
                                style={{ backgroundColor: \`color-mix(in srgb, \${area.color} 12%, #000000)\` }}
                              >
                                {/* BACKGROUNDS PREMIUM DO TRAILER */}
                                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: \`radial-gradient(circle at top right, \${area.color} 0%, transparent 80%)\` }} />
                                <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: area.color }} />
                                <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: \`linear-gradient(to top, color-mix(in srgb, \${area.color} 12%, #000), color-mix(in srgb, \${area.color} 12%, rgba(0,0,0,0.8)) 50%, transparent)\` }} />
                                
                                {/* CONTEÚDO PRINCIPAL */}
                                <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-end h-full">
                                  
                                  {/* Ícone pequeno + label da área */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-black/20 backdrop-blur-md" style={{ borderColor: \`\${area.color}55\` }}>
                                      <area.icon className="w-5 h-5" style={{ color: area.color }} />
                                    </div>
                                    <span className="text-white/60 text-xs uppercase font-bold tracking-[0.25em]">
                                      {area.label}
                                    </span>
                                  </div>

                                  {/* Título grande e limpo */}
                                  <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                                    {area.label}
                                  </h3>

                                  <div className="w-16 h-px mb-6" style={{ backgroundColor: \`\${area.color}80\` }} />
                                  
                                  {isUnlocked ? (
                                    <>
                                      <p className="text-white/80 text-lg font-light leading-relaxed mb-10 max-w-xl drop-shadow-md">
                                        {area.full}
                                      </p>
                                      <div>
                                        <div 
                                          className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(255,255,255,0.1)] cursor-default"
                                          style={{ backgroundColor: area.color, color: '#fff', boxShadow: \`0 0 50px \${area.color}80\` }}
                                        >
                                          <Sparkles className="w-4 h-4 shrink-0" />
                                          Foco Ativado ✓
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-white/75 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl drop-shadow-md">
                                        {area.teaser}
                                      </p>
                                      <div>
                                        <button 
                                          className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 hover:bg-gray-100"
                                        >
                                          <Lock className="w-4 h-4 shrink-0" />
                                          Liberar Acesso (1 Crédito)
                                        </button>
                                      </div>
                                    </>
                                  )}
                                  
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>`;

// Let's do a more robust replace that just grabs everything inside md:col-span-7
const startTag = "{/* Lado Direito / Paywall CTA */}";
const endTag = `                        </AnimatePresence>\n                      </div>`;
const exactRegex = new RegExp(startTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?' + endTag.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&'));

content = content.replace(exactRegex, newRightPanel);

fs.writeFileSync(file, content);
console.log("Updated right panel!");
