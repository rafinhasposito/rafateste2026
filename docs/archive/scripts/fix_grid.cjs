const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// I need to replace the mapping in Block 7 from \`sortedAreas.map\` to a hardcoded array of 12 Houses.
const oldGridStart = `<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">`;
const oldGridEnd = `                      </div>
                      </div>
      <UnlockPremiumModal`;

const startIndex = code.indexOf(oldGridStart);
const endIndex = code.indexOf(oldGridEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const newGrid = `<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {Array.from({ length: 12 }).map((_, idx) => {
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
                                {/* Glow sutil na cor da casa */}
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
                          })}
`;
    code = code.substring(0, startIndex) + newGrid + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Grid replaced with 12 Houses logic.");
} else {
    console.log("Could not find the grid bounds.");
}
