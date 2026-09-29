const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const oldGridStr = `{sortedAreas.map((area, idx) => {
                            const isCurrent = area.id === currentActiveData?.id;
                            return (
                              <div 
                                key={area.id}
                                onClick={() => {
                                  if (!area.unlocked && !isCurrent) {
                                    setTargetLockedArea({ label: area.label, color: area.color, id: area.id });
                                    setIsPaywallOpen(true);
                                  }
                                }}
                                className={\`relative p-6 rounded-3xl border transition-all duration-300 \${isCurrent ? 'bg-white/10 border-white/30' : 'bg-[#050505] border-white/5 hover:border-white/20 cursor-pointer'} overflow-hidden h-48 flex flex-col justify-between group\`}
                              >
                                {/* Glow sutil na cor da casa */}
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40" style={{ backgroundColor: area.color }}></div>

                                <div className="relative z-10 flex justify-between items-start">
                                  <div>
                                    <span className="font-mono text-[10px] tracking-widest uppercase mb-1 block" style={{ color: area.color }}>Casa \${idx + 1}</span>
                                    <h3 className="font-ps-display text-xl font-bold text-white mb-1">{area.label}</h3>
                                  </div>
                                  {!area.unlocked && !isCurrent ? (
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
                                  {!area.unlocked && !isCurrent ? (
                                    <p className="text-white/30 text-sm font-light select-none blur-sm transition-all duration-300 group-hover:blur-0 group-hover:text-white/50">
                                      Desbloqueie para descobrir a cidade ideal para {area.label.toLowerCase()}.
                                    </p>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" style={{ color: area.color }} />
                                      <span className="text-white/80 font-medium text-sm">{area.city || 'Nova York, EUA'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}`;

const newGridStr = `{Array.from({ length: 12 }).map((_, idx) => {
                            const isCurrent = idx + 1 === 2; // Mock: Casa 2 is the active one
                            const houseNum = idx + 1;
                            const houseLabels = [
                              "Ação & Magnetismo", "Dinheiro & Bens", "Vendas & Contatos", "Lar & Imóveis",
                              "Romances & Sorte", "Saúde & Eficiência", "Casamento & Sociedades", "Heranças & Poder",
                              "Viagens & Estudos", "Fama & Carreira", "Networking & Apoio VIP", "Bastidores & Intuição"
                            ];
                            const mockCities = [
                              "Innsbruck", "Madrid", "Mumbai", "Quioto", "Bali", "Sydney", "Auckland", "Bora Bora", "Cidade do México", "Dallas", "Florianópolis", "Ponta Delgada"
                            ];
                            return (
                              <div 
                                key={houseNum}
                                onClick={() => {
                                  if (!isCurrent) {
                                    setTargetLockedArea({ label: \`Casa \${houseNum} - \${houseLabels[idx]}\`, color: '#FBBF24', id: \`casa-\${houseNum}\` });
                                    setIsPaywallOpen(true);
                                  }
                                }}
                                className={\`relative p-6 rounded-3xl border transition-all duration-300 \${isCurrent ? 'bg-white/10 border-amber-500/50' : 'bg-[#050505] border-white/5 hover:border-white/20 cursor-pointer'} overflow-hidden h-48 flex flex-col justify-between group\`}
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40" style={{ backgroundColor: isCurrent ? '#FBBF24' : '#ffffff' }}></div>

                                <div className="relative z-10 flex justify-between items-start">
                                  <div>
                                    <span className="font-mono text-[10px] tracking-widest uppercase mb-1 block text-white/50">Casa {houseNum}</span>
                                    <h3 className="font-ps-display text-xl font-bold text-white mb-1">{houseLabels[idx]}</h3>
                                  </div>
                                  {!isCurrent ? (
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                      <Lock className="w-3.5 h-3.5 text-white/40" />
                                    </div>
                                  ) : (
                                    <div className="px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/40 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-amber-500" />
                                      <span className="text-[10px] uppercase font-mono font-bold text-amber-500">Livre</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="relative z-10">
                                  {!isCurrent ? (
                                    <p className="text-white/30 text-sm font-light select-none blur-sm transition-all duration-300 group-hover:blur-0 group-hover:text-white/50">
                                      Desbloqueie para descobrir a cidade desta casa.
                                    </p>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-amber-500" />
                                      <span className="text-white/80 font-medium text-sm">{mockCities[idx]}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}`;

if (code.includes(oldGridStr)) {
    code = code.replace(oldGridStr, newGridStr);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Grid replaced perfectly!");
} else {
    console.log("Could not find exact grid string match.");
}
