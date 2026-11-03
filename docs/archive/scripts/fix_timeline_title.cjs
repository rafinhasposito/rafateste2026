const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

content = content.replace(
  '<h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tighter mb-6">O Seu Ano em 3 Fases.</h2>',
  '<h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tighter mb-6">A Evolução da Casa {P_DYNAMIC.house}</h2>'
);

content = content.replace(
  'Como o seu foco em <strong className="text-white font-medium">{currentActiveData.label}</strong> se desdobra ao longo dos próximos 12 meses nesta cidade.',
  'Como a energia da cidade trabalha o seu foco em <strong className="text-white font-medium">{currentActiveData.label}</strong> ao longo do novo ciclo.'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
