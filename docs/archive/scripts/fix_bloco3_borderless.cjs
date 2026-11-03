const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const targetStrStart = `                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Segmented Control) */}`;
const targetStrEnd = `                          );
                        })()}
                      </div>`;

if (code.includes(targetStrStart)) {
    const startIndex = code.indexOf(targetStrStart);
    const endIndex = code.indexOf(targetStrEnd, startIndex) + targetStrEnd.length;

    const newBlock = `                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}
                      <div className="w-full mt-40">
                        
                        <div className="flex flex-col gap-32 md:gap-40 w-full relative">
                          
                          {/* Elemento 1: Essência (Left Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start text-left max-w-3xl relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              01. Sua Essência
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Sol em Leão.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de <strong className="text-white font-medium">{currentActiveData.label}</strong>, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.
                            </p>
                          </motion.div>

                          {/* Elemento 2: Método (Right Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-end text-left md:text-right max-w-3xl self-end relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              02. Seu Método
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Ascendente <br className="hidden md:block" />em Virgem.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.
                            </p>
                          </motion.div>

                          {/* Elemento 3: Fase Atual (Center Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-center text-left md:text-center max-w-4xl self-center relative z-10 mt-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              03. Fase Atual
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Maturidade.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real.
                            </p>
                          </motion.div>

                          {/* Fundo Atmosférico abstrato para amarrar os textos */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] opacity-10 pointer-events-none blur-[150px] -z-10" style={{ backgroundColor: currentActiveData.color }} />
                        </div>

                      </div>`;

    code = code.substring(0, startIndex) + newBlock + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Borderless typography injected successfully.");
} else {
    console.log("Could not find the target string start.");
}
