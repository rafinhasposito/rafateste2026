const fs = require('fs');
let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// The accordion starts with {/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
// And ends right before {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}

const startStr = '{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}';
const endStr = '{/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.slice(0, startIndex) + content.slice(endIndex);
  fs.writeFileSync('src/pages/HouseResult.tsx', newContent);
  console.log("Successfully removed the 8-focus accordion!");
} else {
  console.log("Could not find boundaries.");
}
