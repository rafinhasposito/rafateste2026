const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// I will just use a generic fixer: I will find the number of open divs and close divs.
// But that's hard. Let's find exactly what I replaced.

const orig = `
                  {/* Fases do Ano */}
                          {(houseData.fase1 || houseData.fase2 || houseData.fase3) && (
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
`;

if (code.includes(orig)) {
    console.log("Found the block");
} else {
    console.log("Block not found");
}
