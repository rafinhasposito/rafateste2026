const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const finalContent = `
                  {/* --- DOSSIÊ ASTROLÓGICO REAL --- */}
                  <div className="w-full mt-24 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-[#10b981]/10 border-[#10b981]/30">
                          <Target className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight text-white">O Seu Dossiê</h2>
                      </div>
                      
                      <div className="flex flex-col gap-12 md:gap-24 text-left">
                          
                          {/* O Que Você Precisa Entender */}
                          {houseData?.oQueVocePrecisaEntender && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto md:mx-0">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">A Dinâmica</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight font-ps-display">O Que Você Precisa Entender</h3>
                              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                                {houseData.oQueVocePrecisaEntender}
                              </p>
                            </motion.div>
                          )}

                          {/* Como Aparece na Vida Real */}
                          {houseData?.comoApareceNaVidaReal && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl self-end text-left md:text-right mx-auto md:mx-0">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">Impacto Prático</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight font-ps-display">Como Aparece na Vida Real</h3>
                              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                                {houseData.comoApareceNaVidaReal}
                              </p>
                            </motion.div>
                          )}
                          
                          {/* O Tema, O Segredo, O Ritual (Bento Grid) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                             {/* O Tema */}
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/5 rounded-[32px] p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30 bg-[#10b981]"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Tema do Ano</span>
                                <p className="text-white/90 text-2xl md:text-3xl font-ps-display font-medium leading-tight mb-8">
                                  {houseData?.oTema || "Consolidação e Crescimento"}
                                </p>
                                <div className="w-full h-px bg-white/10 my-6"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Segredo</span>
                                <p className="text-white/70 text-lg font-light leading-relaxed">
                                  {houseData?.oSegredo}
                                </p>
                             </motion.div>
                             
                             {/* O Ritual */}
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-black/60 rounded-[32px] p-8 md:p-12 border border-[#10b981]/20 relative overflow-hidden group backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 blur-3xl bg-[#10b981]"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Gesto que Ancora (24h)</span>
                                <div className="flex items-start gap-4">
                                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#10b981] shadow-[0_0_10px_#10b981]"></div>
                                  <p className="text-white/80 text-xl font-light leading-relaxed">
                                    {houseData?.ritual24h || "Explore o fluxo da cidade e estabeleça uma intenção clara nas primeiras horas."}
                                  </p>
                                </div>
                             </motion.div>
                          </div>

                          {/* Fases do Ano */}
                          {(houseData?.fase1 || houseData?.fase2 || houseData?.fase3) && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full mt-12">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-8 text-center md:text-left">A Linha do Tempo</span>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                  { title: "Fase 1 (Mês 1 a 4)", text: houseData.fase1 },
                                  { title: "Fase 2 (Mês 5 a 8)", text: houseData.fase2 },
                                  { title: "Fase 3 (Mês 9 a 12)", text: houseData.fase3 }
                                ].filter(f => f.text).map((fase, i) => (
                                  <div key={i} className="border-l border-[#10b981]/30 pl-6 relative">
                                    <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-[#10b981]"></div>
                                    <h4 className="text-white font-bold mb-3">{fase.title}</h4>
                                    <p className="text-white/60 text-sm font-light leading-relaxed">{fase.text}</p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                      </div>
                  </div>

                  {/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}
                  <div className="w-full max-w-4xl mx-auto mt-32 mb-16 px-4 md:px-0 text-left">
                    <div className="text-center mb-12">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-6">
                        <Sparkles className="w-3 h-3" /> Visão Panorâmica
                      </span>
                      <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4">As 8 Dimensões do seu Ano</h3>
                      <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Descubra como ancorar o seu Sol nesta Casa afetará diretamente cada pilar da sua vida nos próximos 12 meses.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-black/40 border border-[#10b981]/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
                      {[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData?.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData?.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData?.amor },
                        { id: "vidaPessoal", label: "Vida Pessoal & Saúde", icon: Sparkles, text: houseData?.vidaPessoal },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData?.saude },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData?.areasDaVida?.['Viagens'] },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData?.areasDaVida?.['Lar'] }
                      ].filter(x => x.text).map((dim, i) => (
                        <AccordionItem value={dim.id} key={dim.id} className="border-b border-[#10b981]/10 px-2 md:px-4 last:border-0">
                          <AccordionTrigger className="text-white hover:no-underline py-6 opacity-90 hover:opacity-100 group">
                            <span className="font-ps-display text-lg md:text-xl tracking-wide flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                                <dim.icon className="w-5 h-5 text-[#10b981]" />
                              </div>
                              {dim.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 font-light text-base md:text-lg leading-relaxed pb-8 pt-2 px-2 md:px-14">
                            {dim.text}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}
                  <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6 text-left">
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                      <div>
                        <h2 className="font-ps-display text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-white">
                          Rotas Alternativas
                        </h2>
                        <p className="text-white/50 text-base md:text-lg max-w-2xl font-light">
                          Se o seu Destino Mestre não for viável, estas coordenadas secundárias também ativam a energia desta casa.
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                         <Sparkles className="w-4 h-4 text-emerald-400" />
                         <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">Incluso</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {[
                        { title: "Nacional", desc: "Acessível e perto de você", data: citiesObj.nacional || [] },
                        { title: "Acessível", desc: "Viagem internacional viável", data: citiesObj.acessivel || [] },
                        { title: "High Ticket", desc: "Destino de alto padrão", data: citiesObj.highticket || [] }
                      ].map((tier, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white">{idx+1}</div>
                            <div>
                              <h4 className="font-bold text-lg text-white">{tier.title}</h4>
                              <p className="text-white/50 text-xs uppercase tracking-wider">{tier.desc}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            {tier.data.map((city, i) => (
                              <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] pointer-events-none group-hover:bg-[#10b981]/10 transition-colors"></div>
                                <div className="flex justify-between items-start mb-4">
                                  <h5 className="font-ps-display text-2xl font-bold text-white">{city.city}</h5>
                                  <span className="font-mono text-xs font-bold bg-[#10b981]/20 text-[#10b981] px-2 py-1 rounded">
                                    {city.score}% MATCH
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-white/50 text-sm">
                                  <MapPin className="w-4 h-4 text-[#10b981]" />
                                  <span>{city.country}</span>
                                </div>
                              </div>
                            ))}
                            {tier.data.length === 0 && (
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-white/40 text-sm italic">
                                Nenhuma rota encontrada para este nível.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BLOCO 7: A GRADE DE 12 CASAS (UPSELL) */}
                  <div className="w-full max-w-7xl mx-auto mt-40 mb-32 px-6 text-left">
                    <div className="text-center mb-16">
                      <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
                        Expanda o Seu Mapa.
                      </h2>
                      <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Você desbloqueou a visão profunda para a <strong>{P.houseLabel}</strong>. Descubra quais cidades ativam a sua saúde, amor, viagens e as outras 11 áreas da sua vida.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
                        const isCurrent = num === houseNum;
                        const dbData = cityDatabase[num as keyof typeof cityDatabase];
                        const label = dbData?.name?.split('—')[1]?.trim() || "Área da Vida";
                        const isUnlocked = isCurrent || allResults?.[num];
                        const cityForThisHouse = allResults?.[num]?.city?.display_name || (isCurrent ? P.city : "Nova York, EUA");

                        return (
                          <div 
                            key={num}
                            onClick={() => {
                              if (!isUnlocked) {
                                setTargetLockedArea({ label: label, color: "#10b981", id: num.toString() });
                                setIsPaywallOpen(true);
                              }
                            }}
                            className={\`relative p-6 rounded-3xl border transition-all duration-300 \${isCurrent ? 'bg-white/10 border-white/30' : 'bg-[#050505] border-white/5 hover:border-white/20 cursor-pointer'} overflow-hidden h-48 flex flex-col justify-between group\`}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 bg-[#10b981]"></div>

                            <div className="relative z-10 flex justify-between items-start">
                              <div>
                                <span className="font-mono text-[10px] tracking-widest uppercase mb-1 block text-[#10b981]">Casa \${num}</span>
                                <h3 className="font-ps-display text-xl font-bold text-white mb-1">{label}</h3>
                              </div>
                              {!isUnlocked ? (
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                  <Lock className="w-3.5 h-3.5 text-white/40" />
                                </div>
                              ) : (
                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-white" />
                                  <span className="text-[10px] uppercase font-mono font-bold text-white">Livre</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="relative z-10">
                              {!isUnlocked ? (
                                <p className="text-white/30 text-sm font-light select-none blur-sm transition-all duration-300 group-hover:blur-0 group-hover:text-white/50">
                                  Desbloqueie para descobrir a cidade desta casa.
                                </p>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-amber-500" />
                                  <span className="text-white/80 font-medium text-sm">{cityForThisHouse}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
`;

code = code.replace('// HERE', finalContent);

// Add missing imports if needed
if (!code.includes('Accordion')) {
  code = code.replace(`import { DesktopWebChrome`, `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";\nimport { DesktopWebChrome`);
}
if (!code.includes('import { cityDatabase }')) {
  code = code.replace(`import { DesktopWebChrome`, `import { cityDatabase } from "@/data/houses";\nimport { DesktopWebChrome`);
}
if (!code.includes('import UnlockPremiumModal')) {
  code = code.replace(`import { DesktopWebChrome`, `import UnlockPremiumModal from "@/components/UnlockPremiumModal";\nimport { DesktopWebChrome`);
}

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Ultimate rewrite completed.");
