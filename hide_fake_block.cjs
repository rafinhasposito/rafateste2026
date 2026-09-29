const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchTab = `{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}`;
const replaceTab = `{/* MOCKED BLOCK HIDDEN */} {false && (`;

const endSearch = `{/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}`;
const replaceEnd = `)} {/* FIM DA OCULTACAO */} \n {/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}`;

if (code.includes(searchTab) && code.includes(endSearch)) {
  code = code.replace(searchTab, replaceTab);
  code = code.replace(endSearch, replaceEnd);
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Mocked block safely hidden behind {false && }");
} else {
  console.log("Could not find markers.");
}
