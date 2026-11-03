const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Fix 1: The all-green Hero text.
content = content.replace(
  /<p className="text-2xl md:text-3xl lg:text-4xl font-light text-white\/90 leading-\[1\.4\] md:leading-\[1\.3\] tracking-tight">\s*<span className="text-\[#10b981\] font-medium">\{currentActiveData\.teaser\}<\/span>\s*<\/p>/,
  `<p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             {currentActiveData.teaser}
           </p>`
);

// Fix 2: "A Casa 2 foi calculada..." phrase
content = content.replace(
  'A Casa {P_DYNAMIC.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.',
  'A Casa {P_DYNAMIC.house} carrega a vibração exata para impulsionar o seu objetivo no novo ciclo.'
);

// Fix 3: Pill Symmetry (Fixing line breaks)
content = content.replace(
  /<Landmark className="w-5 h-5" style=\{\{ color: currentActiveData\?\.color \|\| '#34d399' \}\} \/>\s*<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold mr-3">CASA \{P_DYNAMIC\.house\}<\/span>\s*<div className="w-px h-4 bg-white\/20 mr-3"><\/div>\s*<MapPin className="w-4 h-4 text-white\/50 mr-1" \/>\s*<span className="font-sans text-sm tracking-widest uppercase text-white\/80 font-medium">\{houseFixedData\.city\}<\/span>/,
  `<div className="flex items-center gap-2 flex-shrink-0">
                                  <Landmark className="w-4 h-4" style={{ color: currentActiveData?.color || '#34d399' }} />
                                  <span className="font-sans text-sm tracking-widest uppercase text-white font-semibold whitespace-nowrap">CASA {P_DYNAMIC.house}</span>
                                </div>
                                <div className="w-px h-4 bg-white/20"></div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-white/50" />
                                  <span className="font-sans text-sm tracking-widest uppercase text-white/80 font-medium whitespace-nowrap">{houseFixedData.city}</span>
                                </div>`
);

// Fix 4: "O Tema na Casa 2" -> "O Tema do seu ANO na Casa 2"
content = content.replace(
  'O Tema na Casa {P_DYNAMIC.house}',
  'O Tema do seu ANO na Casa {P_DYNAMIC.house}'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
