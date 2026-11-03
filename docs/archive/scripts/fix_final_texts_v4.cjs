const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Mantra (Line 1115)
content = content.replace(
  '"{currentActiveData?.mantra}"',
  '"{currentHouseData?.mantra}"'
);

// 2. Fases (Line 1130)
const oldTimeline = '{currentActiveData.timeline?.map((phase, index) => {';
const newTimeline = `{[
                            { phase: "Fase 1: Primeiros Passos", period: "Meses 1 a 4", text: currentHouseData?.fase1 },
                            { phase: "Fase 2: Expansão", period: "Meses 5 a 8", text: currentHouseData?.fase2 },
                            { phase: "Fase 3: Colheita", period: "Meses 9 a 12", text: currentHouseData?.fase3 }
                          ].map((phase, index) => {`;
content = content.replace(oldTimeline, newTimeline);

// 3. Ritual (Line 1083)
const oldRitualBlock = `<p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                                Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto financeiro.
                              </p>`;
const newRitualBlock = `<p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                                {currentHouseData?.ritual}
                              </p>`;
content = content.replace(oldRitualBlock, newRitualBlock);

// Remove the second ritual item to make it clean
const oldRitualItem2 = `<div className="flex items-start gap-6">
                              <span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData?.color || '#10b981' }}>2.</span>
                              <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                                Durante a transação, afirme mentalmente que aquele é o último investimento do seu antigo ciclo de escassez.
                              </p>
                            </div>`;
content = content.replace(oldRitualItem2, "");

// Ensure V5 is also identical
fs.writeFileSync('src/pages/AppleResultPreviewV4.tsx', content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Successfully replaced Mantra, Ritual, and Fases mapping in V4 and V5.");
