const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add state for City Tier
const stateInsert = `  const [selectedCityTier, setSelectedCityTier] = useState<'nacional' | 'acessivel' | 'highticket'>('acessivel');\n`;
if (!code.includes('selectedCityTier')) {
    code = code.replace('const [isPaywallOpen, setIsPaywallOpen] = useState(false);', `const [isPaywallOpen, setIsPaywallOpen] = useState(false);\n${stateInsert}`);
}

// 2. Mock Data Update: Add destination objects to the first item (Dinheiro) just to test
// We'll just hardcode the toggle UI in Block 4 for now to prove the concept.

const block4Search = `{/* Selo de Localização */}
                            <div className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-black/40 rounded-full border border-white/10 w-fit backdrop-blur-md">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-sm tracking-widest uppercase text-white font-semibold">Nova York, EUA</span>
                            </div>`;

const block4Replace = `{/* Toggles de CIDADES EXTRAS GRÁTIS */}
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

if (code.includes(block4Search)) {
    code = code.replace(block4Search, block4Replace);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Cidades Extras (Toggles) Injected into Block 4.");
} else {
    console.log("Could not find Block 4 Location badge to replace.");
}

