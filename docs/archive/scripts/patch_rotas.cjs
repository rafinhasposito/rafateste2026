const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

const targetStr = `                    </div>
                  )}
               </div>
            </div>`;

const rotasAndGrade = `                    </div>

                      {/* BLOCO 7: ROTAS ALTERNATIVAS (Cidades Extras) */}
                      <div className="w-full max-w-5xl mx-auto mt-20 mb-32 px-6">
                        <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
                          <Compass className="w-8 h-8 text-white/50" />
                          <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tighter text-white">
                            Rotas Alternativas
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { title: "Nacional", desc: "Acessível e perto de você", data: citiesObj.nacional },
                            { title: "Acessível", desc: "Viagem internacional viável", data: citiesObj.acessivel },
                            { title: "High Ticket", desc: "Destino de alto padrão", data: citiesObj.highticket }
                          ].map((tier, idx) => (
                            <div key={idx} className="flex flex-col gap-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border" style={{ backgroundColor: \`\${currentActiveData.color}15\`, color: currentActiveData.color, borderColor: \`\${currentActiveData.color}30\` }}>{idx+1}</div>
                                <div>
                                  <h4 className="font-bold text-xl text-white tracking-tight">{tier.title}</h4>
                                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{tier.desc}</p>
                                </div>
                              </div>
                              {tier.data.map((city, i) => (
                                <div key={i} className="bg-black/60 border rounded-[28px] overflow-hidden transition-all group relative h-56 flex flex-col justify-end p-6 cursor-pointer" style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.borderColor = currentActiveData.color}
                                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                                >
                                  <div className="absolute inset-0">
                                    <img src={city.img} alt={city.city} className="w-full h-full object-cover opacity-30 group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000 ease-[0.19,1,0.22,1]" style={{ mixBlendMode: 'luminosity' }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: currentActiveData.color }}></div>
                                  </div>
                                  <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex justify-between items-end mb-3">
                                      <h5 className="font-ps-display text-2xl font-bold text-white transition-colors">{city.city}</h5>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                                        <MapPin className="w-4 h-4" style={{ color: currentActiveData.color }} />
                                        <span className="uppercase tracking-widest text-[10px]">{city.country}</span>
                                      </div>
                                      <span className="font-mono text-[10px] font-bold px-3 py-1.5 rounded-full border" style={{ backgroundColor: \`\${currentActiveData.color}15\`, color: currentActiveData.color, borderColor: \`\${currentActiveData.color}30\` }}>{city.score}% MATCH</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BLOCO 8: VISÃO COMPLETA (A Grade de Upsell) */}
                      <div className="w-full max-w-6xl mx-auto mt-32 mb-40 px-6">
                        <div className="flex flex-col items-center text-center mb-16 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] opacity-10 bg-white pointer-events-none"></div>
                          
                          <div className="flex items-center gap-3 mb-8 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                            <Sparkles className="w-4 h-4 text-white/50" />
                            <span className="font-mono text-[10px] tracking-widest uppercase text-white/70 font-bold">Visão 360º</span>
                          </div>
                          <h2 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8">
                            Expanda o Seu Mapa.
                          </h2>
                          <p className="text-white/50 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Você desbloqueou a Rota principal para a <strong className="text-white font-medium">{P.houseLabel}</strong>. Descubra quais cidades do mundo ativam a sua saúde, seu amor e as outras 11 dimensões da sua vida.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
                            const isCurrent = num === P.house;
                            const dbData = cityDatabase[num as keyof typeof cityDatabase];
                            const label = dbData?.name?.split('—')[1]?.trim() || dbData?.label || "Área da Vida";
                            const isUnlocked = isCurrent;
                            const cityForThisHouse = isCurrent ? P.city : "Bloqueado";

                            return (
                              <div 
                                key={num}
                                onClick={() => {
                                  if (!isUnlocked) {
                                    setTargetLockedArea({ label: label, color: currentActiveData.color, id: num.toString() });
                                    setIsPaywallOpen(true);
                                  }
                                }}
                                className={\`relative p-6 rounded-[32px] border transition-all duration-500 ease-[0.19,1,0.22,1] \${isCurrent ? 'bg-white/[0.03] border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] scale-[1.02]' : 'bg-[#050505] border-white/5 hover:border-white/20 hover:bg-white/[0.02] cursor-pointer'} overflow-hidden h-52 flex flex-col justify-between group\`}
                              >
                                {isCurrent && (
                                  <div className="absolute top-0 right-0 w-40 h-40 blur-[60px] opacity-20 pointer-events-none transition-opacity duration-500 bg-white"></div>
                                )}
                                
                                <div className="relative z-10 flex justify-between items-start">
                                  <div>
                                    <span className="font-mono text-[10px] tracking-widest uppercase font-bold block mb-2" style={{ color: isCurrent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>Casa {num}</span>
                                    <h3 className={\`font-ps-display text-2xl font-bold tracking-tight \${isCurrent ? 'text-white' : 'text-white/60 group-hover:text-white'}\`}>{label}</h3>
                                  </div>
                                  <div className={\`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-500 \${isCurrent ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5 group-hover:border-white/20'}\`}>
                                    {isUnlocked ? <Unlock className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />}
                                  </div>
                                </div>

                                <div className="relative z-10 mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: isCurrent ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)' }}>
                                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: isCurrent ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}>{isUnlocked ? "Destino Livre" : "Destino Restrito"}</span>
                                  <span className={\`font-bold \${isUnlocked ? 'text-white' : 'text-white/20'} text-base\`}>{cityForThisHouse}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                  )}
               </div>
            </div>`;

code = code.replace(targetStr, rotasAndGrade);
fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
console.log("Rotas + Grade Patched.");
