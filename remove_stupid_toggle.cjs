const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const stupidToggle = `{/* Toggles de CIDADES EXTRAS GRÁTIS */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                              <button 
                                onClick={() => setSelectedCityTier('nacional')}
                                className={\`px-4 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 \${selectedCityTier === 'nacional' ? 'bg-white/20 border-white/40 text-white' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10'} border backdrop-blur-md\`}
                              >
                                Nacional
                              </button>
                              <button 
                                onClick={() => setSelectedCityTier('acessivel')}
                                className={\`px-4 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 \${selectedCityTier === 'acessivel' ? 'bg-white/20 border-white/40 text-white' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10'} border backdrop-blur-md\`}
                              >
                                Acessível
                              </button>
                              <button 
                                onClick={() => setSelectedCityTier('highticket')}
                                className={\`px-4 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 \${selectedCityTier === 'highticket' ? 'bg-white/20 border-white/40 text-white' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10'} border backdrop-blur-md\`}
                              >
                                High Ticket
                              </button>
                            </div>

                            {/* Selo de Localização Dinâmico */}
                            <div className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-black/40 rounded-full border border-white/10 w-fit backdrop-blur-md">
                                <MapPin className="w-5 h-5" style={{ color: currentActiveData?.color || '#10b981' }} />
                                <span className="font-mono text-sm tracking-widest uppercase text-white font-semibold">
                                  {selectedCityTier === 'nacional' ? 'São Paulo, SP' : selectedCityTier === 'highticket' ? 'Dubai, Emirados' : currentActiveData?.city || 'Nova York, EUA'}
                                </span>
                            </div>`;

const originalLocation = `{/* Selo de Localização */}
                            <div className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-black/40 rounded-full border border-white/10 w-fit backdrop-blur-md">
                                <MapPin className="w-5 h-5" style={{ color: currentActiveData?.color || '#10b981' }} />
                                <span className="font-mono text-sm tracking-widest uppercase text-white font-semibold">{currentActiveData?.city || 'Nova York, EUA'}</span>
                            </div>`;

if (code.includes(stupidToggle)) {
    code = code.replace(stupidToggle, originalLocation);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Stupid toggle removed!");
} else {
    console.log("Could not find the stupid toggle.");
}
