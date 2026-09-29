const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const target = `                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      </div>`;

const replacement = `                      <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                          visible: { transition: { staggerChildren: 0.15 } },
                          hidden: {}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        {/* Pilar 1 */}
                        <motion.div 
                           variants={{
                             hidden: { opacity: 0, y: 30 },
                             visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                           }}
                           className="bg-[#02160F]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-white/[0.04] hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group"
                        >
                           <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: \`inset 0 0 0 1px \${currentActiveData.color}20\` }} />
                           <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 blur-3xl" style={{ backgroundColor: currentActiveData.color }} />
                           
                           <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-lg" style={{ backgroundColor: \`\${currentActiveData.color}10\`, borderColor: \`\${currentActiveData.color}30\`, boxShadow: \`0 10px 20px -10px \${currentActiveData.color}40\` }}>
                             <ArrowUpRight className="w-7 h-7" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 group-hover:text-[#10b981]">Aumento de Ganhos</h3>
                           <p className="text-white/60 text-base leading-[1.8] font-light">Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar e expandir os horizontes.</p>
                        </motion.div>

                        {/* Pilar 2 */}
                        <motion.div 
                           variants={{
                             hidden: { opacity: 0, y: 30 },
                             visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                           }}
                           className="bg-[#02160F]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-white/[0.04] hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group"
                        >
                           <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: \`inset 0 0 0 1px \${currentActiveData.color}20\` }} />
                           <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 blur-3xl" style={{ backgroundColor: currentActiveData.color }} />
                           
                           <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-lg" style={{ backgroundColor: \`\${currentActiveData.color}10\`, borderColor: \`\${currentActiveData.color}30\`, boxShadow: \`0 10px 20px -10px \${currentActiveData.color}40\` }}>
                             <Crown className="w-7 h-7" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 group-hover:text-[#10b981]">Valorização do Trabalho</h3>
                           <p className="text-white/60 text-base leading-[1.8] font-light">Foco irrestrito na autoconfiança. É o momento exato de acabar com os descontos emocionais e auditar todos os seus serviços para cobrar o valor justo.</p>
                        </motion.div>

                        {/* Pilar 3 */}
                        <motion.div 
                           variants={{
                             hidden: { opacity: 0, y: 30 },
                             visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                           }}
                           className="bg-[#02160F]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-white/[0.04] hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group"
                        >
                           <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: \`inset 0 0 0 1px \${currentActiveData.color}20\` }} />
                           <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 blur-3xl" style={{ backgroundColor: currentActiveData.color }} />
                           
                           <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-lg" style={{ backgroundColor: \`\${currentActiveData.color}10\`, borderColor: \`\${currentActiveData.color}30\`, boxShadow: \`0 10px 20px -10px \${currentActiveData.color}40\` }}>
                             <Shield className="w-7 h-7" style={{ color: currentActiveData.color }} />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-4 tracking-tight transition-colors duration-500 group-hover:text-[#10b981]">Estabilidade & Segurança</h3>
                           <p className="text-white/60 text-base leading-[1.8] font-light">Foco prático em organização de caixa, corte de vazamentos invisíveis e reserva inteligente. Proteger o lucro é tão fundamental quanto fazê-lo acontecer.</p>
                        </motion.div>
                      </motion.div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Stagger animations and premium UI applied to Block 2.");
} else {
    console.log("Target block 2 not found!");
}
