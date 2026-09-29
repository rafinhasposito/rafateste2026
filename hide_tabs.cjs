const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchTab = `{/* Navegação Horizontal das Áreas (Agora Focos) */}`;
const replaceTab = `{/* Navegação Horizontal Oculta por determinação do PM */} {false && (`;

const endSearch = `{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}`;
const replaceEnd = `)} {/* Fim da ocultação */} \n {/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}`;

if (code.includes(searchTab) && code.includes(endSearch)) {
  code = code.replace(searchTab, replaceTab);
  code = code.replace(endSearch, replaceEnd);
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Horizontal Tabs hidden safely!");
} else {
  console.log("Could not find blocks to hide.");
}
