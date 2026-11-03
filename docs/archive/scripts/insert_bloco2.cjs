const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const target = `              </div>

                  </div>
               </div>
            </div>`;

const block2 = `              </div>

                  </div>
                  
                  {/* ÁREA DE CONTEÚDO DESBLOQUEADO (DOSSIÊ) */}
                  {currentActiveData?.unlocked && (
                    <div className="w-full mt-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ backgroundColor: \`\${currentActiveData.color}15\`, borderColor: \`\${currentActiveData.color}30\` }}>
                          <Target className="w-5 h-5" style={{ color: currentActiveData.color }} />
                        </div>
                        <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight">Os 3 Pilares da Ativação</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pilar 1 */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none transition-transform group-hover:scale-150 duration-700" style={{ backgroundImage: \`radial-gradient(circle at top right, \${currentActiveData.color}, transparent 70%)\` }} />
                           <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border" style={{ backgroundColor: \`\${currentActiveData.color}20\`, borderColor: \`\${currentActiveData.color}40\` }}>
                             <ArrowUpRight className="w-6 h-6" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">Aumento de Ganhos</h3>
                           <p className="text-white/60 text-sm leading-relaxed">Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar.</p>
                        </div>
                        {/* Pilar 2 */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none transition-transform group-hover:scale-150 duration-700" style={{ backgroundImage: \`radial-gradient(circle at top right, \${currentActiveData.color}, transparent 70%)\` }} />
                           <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border" style={{ backgroundColor: \`\${currentActiveData.color}20\`, borderColor: \`\${currentActiveData.color}40\` }}>
                             <Crown className="w-6 h-6" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">Valorização do Trabalho</h3>
                           <p className="text-white/60 text-sm leading-relaxed">Foco na autoconfiança. É o momento de acabar com os descontos emocionais e auditar seus serviços para cobrar o valor justo pelo seu tempo.</p>
                        </div>
                        {/* Pilar 3 */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none transition-transform group-hover:scale-150 duration-700" style={{ backgroundImage: \`radial-gradient(circle at top right, \${currentActiveData.color}, transparent 70%)\` }} />
                           <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border" style={{ backgroundColor: \`\${currentActiveData.color}20\`, borderColor: \`\${currentActiveData.color}40\` }}>
                             <Shield className="w-6 h-6" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">Estabilidade & Segurança</h3>
                           <p className="text-white/60 text-sm leading-relaxed">Foco em organização de caixa, corte de vazamentos invisíveis e reserva de tranquilidade. Proteger o lucro é tão importante quanto fazê-lo.</p>
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>`;

if (code.includes(target)) {
    code = code.replace(target, block2);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Block 2 (3 Pilares) successfully inserted.");
} else {
    console.log("ERROR: Could not find target insertion point.");
}
