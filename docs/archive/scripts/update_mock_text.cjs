const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const oldBoxStart = `{/* Caixa do Ritual (shrink-0 garante que não seja espremida) */}`;
const oldBoxEnd = `                          </div>

                        </div>
                      </div>

                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;

const startIndex = code.indexOf(oldBoxStart);
const endIndex = code.indexOf(oldBoxEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const newBox = `{/* Caixa do Ritual (shrink-0 garante que não seja espremida) */}
                          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shrink-0 mt-6">
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                            
                            <div className="relative z-10 flex flex-col gap-6">
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-2" style={{ color: currentActiveData?.color || '#10b981' }}>O Tema do Ano</span>
                                <p className="text-white/90 text-xl md:text-2xl font-ps-display font-medium leading-tight">
                                  Estruturação, Valor e Segurança.
                                </p>
                              </div>

                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-2" style={{ color: currentActiveData?.color || '#10b981' }}>O Segredo Deste Ano</span>
                                <p className="text-white/80 text-lg font-light leading-relaxed">
                                  A verdadeira riqueza deste ciclo não virá do esforço bruto, mas da sua capacidade de reter o que ganha e parar de dar descontos emocionais no seu valor.
                                </p>
                              </div>

                              <div className="w-full h-px bg-white/10 my-2"></div>

                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 block mb-4" style={{ color: currentActiveData?.color || '#10b981' }}>Os Gestos que Ancoram (24h)</span>
                                <ul className="space-y-4">
                                  <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                                      <span className="text-[10px] font-mono text-white/70">1</span>
                                    </div>
                                    <p className="text-white/80 text-base font-light leading-relaxed">Carregue uma moeda de ouro ou pirita no bolso durante todo o dia para aterrar a energia material.</p>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                                      <span className="text-[10px] font-mono text-white/70">2</span>
                                    </div>
                                    <p className="text-white/80 text-base font-light leading-relaxed">Escreva em papel dourado as 3 metas financeiras que deseja materializar neste ciclo.</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
`;
    
    code = code.substring(0, startIndex) + newBox + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Structured text updated successfully!");
} else {
    console.log("Could not find the target range.");
}
