const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Fix Ritual
content = content.replace(
  '>Os Gestos que Ancoram (Ritual 24h)<',
  '>Ritual de 24h para Ativar a Casa {P_DYNAMIC.house}<'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
