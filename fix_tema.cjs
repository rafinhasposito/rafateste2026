const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

code = code.replace(
  /Estruturação, Valor e Segurança\./g,
  `{houseData.oTema || "Estruturação, Valor e Segurança."}`
);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("oTema fixed.");
