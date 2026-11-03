const fs = require('fs');

const fileContent = fs.readFileSync('./perfil-12-casas-conversa-de-cafe-v2.md', 'utf-8');
const lines = fileContent.split('\n');

const baseHouses = {};
let currentHouse = null;

for (const line of lines) {
  const tLine = line.trim();
  if (!tLine) continue;

  const houseMatch = tLine.match(/### CASA (\d+) - O PERFIL DA METRÓPOLE/);
  if (houseMatch) {
    currentHouse = parseInt(houseMatch[1], 10);
    baseHouses[currentHouse] = {};
    continue;
  }

  if (!currentHouse) continue;

  if (tLine.startsWith('**A Vibe da Cidade:** ')) {
    baseHouses[currentHouse].vibe = tLine.replace('**A Vibe da Cidade:** ', '');
    continue;
  }

  if (tLine.startsWith('**O Que Você Precisa Entender:** ')) {
    baseHouses[currentHouse].understand = tLine.replace('**O Que Você Precisa Entender:** ', '');
    continue;
  }

  if (tLine.startsWith('**A Dinâmica Real:** ')) {
    baseHouses[currentHouse].realDynamics = tLine.replace('**A Dinâmica Real:** ', '');
    continue;
  }
}

const outputContent = `export const BASE_HOUSE_PROFILES = ${JSON.stringify(baseHouses, null, 2)};\n`;
fs.writeFileSync('src/data/baseHouseProfiles.ts', outputContent);
console.log("Successfully parsed base houses MD to src/data/baseHouseProfiles.ts");
