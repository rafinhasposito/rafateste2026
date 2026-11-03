const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Mantra
content = content.replace(
  '"{currentActiveData?.mantra}"',
  '"{currentHouseData?.mantra}"'
);

// Replace Timeline/Fases
const oldTimeline = `{currentActiveData.timeline?.map((phase, index) => {`;
const newTimeline = `{[
                            { phase: "Fase 1: Início", period: "Meses 1 a 4", text: currentHouseData?.fase1 },
                            { phase: "Fase 2: Expansão", period: "Meses 5 a 8", text: currentHouseData?.fase2 },
                            { phase: "Fase 3: Colheita", period: "Meses 9 a 12", text: currentHouseData?.fase3 }
                          ].map((phase, index) => {`;
content = content.replace(oldTimeline, newTimeline);

// Replace Ritual
content = content.replace(
  '<p className="text-white/80 font-light leading-relaxed mb-6">\n                            {currentActiveData.ritual?.text}\n                          </p>',
  '<p className="text-white/80 font-light leading-relaxed mb-6">\n                            {currentHouseData?.ritual}\n                          </p>'
);

// Just in case the previous script failed, let's also try generic regex replacements for the ritual
content = content.replace(/\{currentActiveData\.ritual\?\.text\}/g, '{currentHouseData?.ritual}');

// Wait, earlier I did a naive replace on Fases.
// Let's verify what the timeline map actually looks like!
