const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const oldRotasStart = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
const oldRotasEnd = `                        </div>
                      </div>

                      {/* BLOCO 7: A GRADE DE 12 CASAS (UPSELL) */}`;

const startIndex = code.indexOf(oldRotasStart);
const endIndex = code.indexOf(oldRotasEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const newRotas = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { city: "São Paulo, SP", country: "Brasil", score: 96, tier: "Nacional", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Santiago", country: "Chile", score: 94, tier: "Acessível", img: "https://images.unsplash.com/photo-1518182170546-076616fdacdc?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Buenos Aires", country: "Argentina", score: 92, tier: "Acessível", img: "https://images.unsplash.com/photo-1613083163740-4284b3e6e87c?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Dubai", country: "Emirados Árabes", score: 98, tier: "High Ticket", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Tóquio", country: "Japão", score: 97, tier: "High Ticket", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Singapura", country: "Singapura", score: 95, tier: "High Ticket", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop" }
                          ].map((alt, i) => (
                            <div 
                              key={i} 
                              className="relative rounded-3xl overflow-hidden group h-64 border transition-all duration-500 cursor-pointer" 
                              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = \`\${currentActiveData?.color || '#10b981'}80\`}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                            >
                              {/* Background Image */}
                              <img src={alt.img} alt={alt.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                              {/* Gradient Overlays */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-color" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>

                              {/* Content */}
                              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full backdrop-blur-md bg-black/40 border text-white font-bold" style={{ borderColor: \`\${currentActiveData?.color || '#10b981'}40\` }}>
                                    {alt.tier}
                                  </span>
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-black/40 border font-mono text-xs font-bold text-white shadow-lg" style={{ borderColor: \`\${currentActiveData?.color || '#10b981'}80\`, boxShadow: \`0 0 15px \${currentActiveData?.color || '#10b981'}40\` }}>
                                    {alt.score}%
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-ps-display text-2xl text-white font-bold drop-shadow-md mb-1">{alt.city}</h4>
                                  <span className="text-sm text-white/80 font-light flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" style={{ color: currentActiveData?.color || '#10b981' }}/> {alt.country}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
`;
    code = code.substring(0, startIndex) + newRotas + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Alternative routes cards updated with images and dynamic colors!");
} else {
    console.log("Could not find the target range for alternative routes.");
}
