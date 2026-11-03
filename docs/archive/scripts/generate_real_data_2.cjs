const fs = require('fs');
const mdPath = '📁 revolucao-solar - mds notebooklm/📁 banco-de-dados/guia-casas-revolucao.md';
const content = fs.readFileSync(mdPath, 'utf8');

const houses = [];
let currentHouse = null;

const lines = content.split('\n');
let captureTema = false;
let captureSegredo = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('### Casa ')) {
    if (currentHouse) houses.push(currentHouse);
    currentHouse = {
      num: parseInt(line.split('### Casa ')[1].split(' ')[0]),
      tema: "",
      segredo: "",
      mantra: "",
      ritual: "",
      fase1: "",
      fase2: "",
      fase3: ""
    };
    captureTema = false;
    captureSegredo = false;
  }

  if (!currentHouse) continue;

  if (line.includes('10 segundos:**')) {
    currentHouse.tema = lines[i+1].trim();
  }

  if (line.includes('Pode favorecer:**') || line.includes('*Quero ter')) {
     captureSegredo = true;
     continue;
  }

  if (captureSegredo && line.startsWith('* ')) {
    currentHouse.segredo += line.replace(/\* /g, '') + " ";
  } else if (captureSegredo && line.startsWith('>>>')) {
    currentHouse.segredo = line.replace(/>>> /g, '').replace(/`/g, '').trim();
    captureSegredo = false;
  } else if (captureSegredo && line.startsWith('**')) {
    captureSegredo = false;
  }

  if (line.startsWith('**🔮 O Mantra do seu Ano:**')) {
    currentHouse.mantra = lines[i+1].replace(/> /g, '').replace(/\*/g, '').replace(/"/g, '').trim();
  }

  if (line.startsWith('**🕯️ O Ritual das Primeiras 24 Horas:**')) {
    currentHouse.ritual = lines[i+1].replace(/> /g, '').trim();
  }

  if (line.startsWith('*   **Fase 1')) {
    currentHouse.fase1 = line.split(':**')[1].trim();
  }
  if (line.startsWith('*   **Fase 2')) {
    currentHouse.fase2 = line.split(':**')[1].trim();
  }
  if (line.startsWith('*   **Fase 3')) {
    currentHouse.fase3 = line.split(':**')[1].trim();
  }
}

if (currentHouse) houses.push(currentHouse);

const jsonOutput = JSON.stringify(houses, null, 2);
fs.writeFileSync('src/data/houses_content.ts', 'export const REAL_HOUSES_DATA = ' + jsonOutput + ';');
console.log("Extracted " + houses.length + " houses from MD properly.");
