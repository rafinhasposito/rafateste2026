const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Replace the hardcoded subtitle structure with the dynamic one from focusMatrix
content = content.replace(
  /<p className="text-2xl md:text-3xl lg:text-4xl font-light text-white\/90 leading-\[1\.4\] md:leading-\[1\.3\] tracking-tight">\s*O destino exato para\{" "\}\s*<span className="text-\[#10b981\] font-medium block mt-1 md:inline md:mt-0">\{HOUSE_CINEMATIC_TEXTS\[P_DYNAMIC\.house\]\}<\/span>\s*<\/p>/,
  `<p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             <span className="text-[#10b981] font-medium">{currentActiveData.teaser}</span>
           </p>`
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
