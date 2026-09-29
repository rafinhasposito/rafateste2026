const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchBottom = `<UnlockPremiumModal`;
const gridCode = `
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
                                {/* Glow sutil na cor da casa */}
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
                                      <span className="text-[10px] uppercase font-mono font-bold">Livre</span>
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

      <UnlockPremiumModal`;

if (code.includes(searchBottom) && !code.includes('Expanda o Seu Mapa')) {
  code = code.replace(searchBottom, gridCode);
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Real grid injected!");
} else {
  console.log("Could not inject or already injected.");
}
