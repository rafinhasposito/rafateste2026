const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const rotasAlternativas = `
                      {/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}
                      <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6">
                        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                          <div>
                            <h2 className="font-ps-display text-3xl md:text-4xl font-bold tracking-tighter mb-2">
                              Rotas Alternativas
                            </h2>
                            <p className="text-white/50 text-base md:text-lg max-w-2xl font-light">
                              Se o seu Destino Mestre não for viável, estas coordenadas secundárias também ativam a energia da sua casa atual com alta compatibilidade.
                            </p>
                          </div>
                          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                             <Sparkles className="w-4 h-4 text-emerald-400" />
                             <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">100% Grátis</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { city: "São Paulo, SP", country: "Brasil", score: 96, tier: "Nacional" },
                            { city: "Santiago", country: "Chile", score: 94, tier: "Acessível" },
                            { city: "Buenos Aires", country: "Argentina", score: 92, tier: "Acessível" },
                            { city: "Dubai", country: "Emirados Árabes", score: 98, tier: "High Ticket" },
                            { city: "Tóquio", country: "Japão", score: 97, tier: "High Ticket" },
                            { city: "Singapura", country: "Singapura", score: 95, tier: "High Ticket" }
                          ].map((alt, i) => (
                            <div key={i} className="bg-[#050505] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all group flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block mb-1">{alt.tier}</span>
                                  <h4 className="font-ps-display text-xl text-white font-bold">{alt.city}</h4>
                                  <span className="text-sm text-white/60">{alt.country}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                  <span className="font-mono text-xs font-bold text-emerald-500">{alt.score}%</span>
                                </div>
                              </div>
                              <button className="w-full py-3 mt-4 rounded-xl bg-white/5 text-white/80 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <MapPin className="w-3 h-3" /> Ver Coordenadas
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
`;

const insertionPoint = `{/* BLOCO 7: A GRADE DE 12 CASAS (UPSELL) */}`;

if (code.includes(insertionPoint)) {
    code = code.replace(insertionPoint, rotasAlternativas + '\n                      ' + insertionPoint);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Rotas Alternativas injected!");
} else {
    console.log("Could not find insertion point.");
}
