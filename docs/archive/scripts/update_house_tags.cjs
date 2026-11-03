const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// 1. Hero Teaser
content = content.replace(
  'O foco é <span className="text-[#10b981] capitalize">{currentActiveData.id}</span>.',
  'Ativação da Casa {P_DYNAMIC.house} — Foco em <span className="text-[#10b981] capitalize">{currentActiveData.id}</span>'
);

// 2. Boarding Pass Title
content = content.replace(
  'BOARDING PASS SOLAR',
  'PROTOCOLO SOLAR • CASA {P_DYNAMIC.house}'
);

// 3. Pillars Title
content = content.replace(
  'Os 3 Pilares da Ativação',
  'Os 3 Pilares da Ativação da Casa {P_DYNAMIC.house}'
);

// 4. Dossier Tag (Adding a tag next to the city in Block 4)
// Look for the MapPin in the dossier header (around line 1070)
content = content.replace(
  /<MapPin className="w-5 h-5" style=\{\{ color: currentActiveData\?\.color \|\| '#34d399' \}\} \/>\s*<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">\{houseFixedData\.city\}<\/span>/,
  `<Landmark className="w-5 h-5" style={{ color: currentActiveData?.color || '#34d399' }} />
                                <span className="font-sans text-sm tracking-widest uppercase text-white font-semibold mr-3">CASA {P_DYNAMIC.house}</span>
                                <div className="w-px h-4 bg-white/20 mr-3"></div>
                                <MapPin className="w-4 h-4 text-white/50 mr-1" />
                                <span className="font-sans text-sm tracking-widest uppercase text-white/80 font-medium">{houseFixedData.city}</span>`
);

// 5. Theme Title
content = content.replace(
  'O Tema do Seu Ano<',
  'O Tema na Casa {P_DYNAMIC.house}<'
);

// 6. Ritual Title
content = content.replace(
  'Os Gestos que Ancoram',
  'Ritual 24h (Ativando a Casa {P_DYNAMIC.house})'
);
content = content.replace(
  '<span className="text-white/40 ml-2 font-normal text-sm">(Ritual 24h)</span>',
  '' // Remove old subtitle since it's in the main title now
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
