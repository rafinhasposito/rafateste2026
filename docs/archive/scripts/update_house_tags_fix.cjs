const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// 1. Hero Teaser (Fixing the regex)
content = content.replace(
  /<h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-\[#10b981\] to-emerald-300">\{P\.intention\}<\/span>\.<\/h3>/,
  '<h3 className="text-3xl md:text-5xl font-ps-display font-bold text-center mb-4">Ativação da Casa {P_DYNAMIC.house} — Foco em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">{P.intention}</span></h3>'
);

// 2. Boarding Pass Title
content = content.replace(
  'Boarding Pass Solar',
  'Protocolo Solar • Casa {P_DYNAMIC.house}'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
