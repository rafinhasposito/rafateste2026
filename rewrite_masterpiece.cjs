const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// The hallucinated state `areas` is from line ~335 to ~513. We need to kill it.
// The easiest way is to rewrite the component return statement.
// But rewriting the whole file is huge. I'll just remove the horizontal tabs from the JSX and remap the sections.

// Let's replace the whole section starting from "Navegação Horizontal das Áreas" to the start of "As 8 Dimensões do seu Ano"
const startMarker = `{/* Navegação Horizontal das Áreas (Agora Focos) */}`;
const endMarker = `{/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}`;

if (code.includes(startMarker) && code.includes(endMarker)) {
  const parts = code.split(startMarker);
  const part2 = parts[1].split(endMarker);
  
  const newContent = `
                  {/* DOSSIÊ ASTROLÓGICO REAL (NOTEBOOK LM DATA) */}
                  <div className="w-full mt-24 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                      
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-[#10b981]/10 border-[#10b981]/30">
                          <Target className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight">O Seu Dossiê</h2>
                      </div>
                      
                      <div className="flex flex-col gap-12 md:gap-24">
                          
                          {/* O Que Você Precisa Entender */}
                          {houseData.oQueVocePrecisaEntender && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">A Dinâmica</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight">O Que Você Precisa Entender</h3>
                              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                                {houseData.oQueVocePrecisaEntender}
                              </p>
                            </motion.div>
                          )}

                          {/* Como Aparece na Vida Real */}
                          {houseData.comoApareceNaVidaReal && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl self-end text-left md:text-right">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">Impacto Prático</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight">Como Aparece na Vida Real</h3>
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
                                  {houseData.oTema || "Consolidação e Crescimento"}
                                </p>
                                <div className="w-full h-px bg-white/10 my-6"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Segredo</span>
                                <p className="text-white/70 text-lg font-light leading-relaxed">
                                  {houseData.oSegredo}
                                </p>
                             </motion.div>
                             
                             {/* O Ritual */}
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-black/60 rounded-[32px] p-8 md:p-12 border border-[#10b981]/20 relative overflow-hidden group backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 blur-3xl bg-[#10b981]"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Gesto que Ancora (24h)</span>
                                <div className="flex items-start gap-4">
                                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#10b981] shadow-[0_0_10px_#10b981]"></div>
                                  <p className="text-white/80 text-xl font-light leading-relaxed">
                                    {houseData.ritual24h || "Explore o fluxo da cidade e estabeleça uma intenção clara nas primeiras horas."}
                                  </p>
                                </div>
                             </motion.div>
                          </div>

                          {/* Fases do Ano */}
                          {(houseData.fase1 || houseData.fase2 || houseData.fase3) && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full mt-12">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-8 text-center">A Linha do Tempo</span>
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
  `;
  
  code = parts[0] + newContent + "\n" + endMarker + part2[1];
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Replaced hallucinated blocks with REAL Notebook LM data fields!");
} else {
  console.log("Could not find the markers to replace!");
}
