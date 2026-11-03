const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Replace mock "O Tema" with houseData
code = code.replace(
  /<p className="text-white\/80 text-lg font-light leading-relaxed">\s*O magnetismo deste destino atrai oportunidades ligadas à.*?\s*<\/p>/g,
  `<p className="text-white/80 text-lg font-light leading-relaxed">{houseData.oTema || "Sua essência exige que você seja protagonista neste ciclo."}</p>`
);

// Replace mock "O Segredo Deste Ano" with houseData
code = code.replace(
  /<p className="text-white\/80 text-lg font-light leading-relaxed">\s*A verdadeira riqueza deste ciclo não virá do esforço bruto.*?\s*<\/p>/g,
  `<p className="text-white/80 text-lg font-light leading-relaxed">{houseData.oSegredo || "A verdadeira riqueza não vem do acaso, vem de se posicionar corretamente."}</p>`
);

// Replace mock "Os Gestos que Ancoram" with houseData.ritual24h
// In the current code, the gestures are hardcoded <li> tags.
code = code.replace(
  /<ul className="space-y-4">[\s\S]*?<\/ul>/,
  `<ul className="space-y-4">
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                                    <p className="text-white/80 font-light">{houseData.ritual24h || "Caminhe observando o fluxo da cidade. Envie uma mensagem estratégica."}</p>
                                  </li>
                                </ul>`
);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Real results injected.");
