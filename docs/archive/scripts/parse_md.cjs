const fs = require('fs');

const fileContent = fs.readFileSync('./banco-de-dados-12-casas-8-focos-conversa-de-cafe.md', 'utf-8');
const lines = fileContent.split('\n');

const db = {};

let currentHouse = null;
let currentFocus = null;
let currentObj = null;

const focusMap = {
  "DINHEIRO E RECURSOS": "dinheiro",
  "TRABALHO E CARREIRA": "trabalho",
  "IDENTIDADE E IMAGEM": "identidade",
  "SAÚDE E ROTINA": "saude",
  "ROTINA E SAÚDE": "saude",
  "NETWORKING E CONEXÕES": "networking",
  "AMOR E RELACIONAMENTO": "amor",
  "CASAMENTO E SOCIEDADES": "sociedades",
  "ESPIRITUAL E PROPÓSITO": "espiritual",
};

for (const line of lines) {
  const tLine = line.trim();
  if (!tLine) continue;

  const houseFocusMatch = tLine.match(/### CASA (\d+) × FOCO: (.*)/);
  if (houseFocusMatch) {
    if (currentHouse && currentFocus && currentObj) {
      if (!db[currentHouse]) db[currentHouse] = {};
      db[currentHouse][currentFocus] = currentObj;
    }
    
    currentHouse = parseInt(houseFocusMatch[1], 10);
    const rawFocus = houseFocusMatch[2].trim();
    currentFocus = focusMap[rawFocus] || rawFocus;
    
    currentObj = {
      pillars: [],
      phases: []
    };
    continue;
  }

  if (!currentObj) continue;

  const matchRegex = /\*\*Match:\*\* (\d+)%/;
  if (tLine.match(matchRegex)) {
    currentObj.match = parseInt(tLine.match(matchRegex)[1], 10);
    continue;
  }

  if (tLine.startsWith('**Headline:** ')) {
    currentObj.headline = tLine.replace('**Headline:** ', '');
    continue;
  }

  if (tLine.startsWith('**Pilar ')) {
    const parts = tLine.split('|');
    if (parts.length >= 2) {
      const title = parts[0].replace(/\*\*Pilar \d+:\*\* /, '').trim();
      const desc = parts[1].trim();
      currentObj.pillars.push({ title, description: desc });
    }
    continue;
  }

  if (tLine.startsWith('**O Tema do Ano:** ')) {
    currentObj.theme = tLine.replace('**O Tema do Ano:** ', '');
    continue;
  }

  if (tLine.startsWith('**O Segredo Deste Ano:** ')) {
    currentObj.secret = tLine.replace('**O Segredo Deste Ano:** ', '');
    continue;
  }

  if (tLine.startsWith('**Ritual Passo 1:** ')) {
    if(!currentObj.ritual) currentObj.ritual = {};
    currentObj.ritual.step1 = tLine.replace('**Ritual Passo 1:** ', '');
    continue;
  }
  if (tLine.startsWith('**Ritual Passo 2:** ')) {
    if(!currentObj.ritual) currentObj.ritual = {};
    currentObj.ritual.step2 = tLine.replace('**Ritual Passo 2:** ', '');
    continue;
  }
  if (tLine.startsWith('**Ritual Passo 3:** ')) {
    if(!currentObj.ritual) currentObj.ritual = {};
    currentObj.ritual.step3 = tLine.replace('**Ritual Passo 3:** ', '');
    continue;
  }

  if (tLine.startsWith('**Mantra:** ')) {
    currentObj.mantra = tLine.replace('**Mantra:** ', '').replace(/"/g, '');
    continue;
  }

  if (tLine.startsWith('**Fase ')) {
    const titleMatch = tLine.match(/\*\*Fase \d+ \(.*?\):\*\* (.*?) \| (.*)/);
    if (titleMatch) {
      currentObj.phases.push({ title: titleMatch[1].trim(), description: titleMatch[2].trim() });
    }
    continue;
  }

  if (tLine.startsWith('**O Ponto Cego:** ')) {
    currentObj.blindSpot = tLine.replace('**O Ponto Cego:** ', '');
    continue;
  }

  if (tLine.startsWith('**Protocolo de Defesa:** ')) {
    currentObj.defenseProtocol = tLine.replace('**Protocolo de Defesa:** ', '').replace(/"/g, '');
    continue;
  }
}

// Push last
if (currentHouse && currentFocus && currentObj) {
  if (!db[currentHouse]) db[currentHouse] = {};
  db[currentHouse][currentFocus] = currentObj;
}

const outputContent = `export const FOCUS_MATRIX = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync('src/data/focusMatrix.ts', outputContent);
console.log("Successfully parsed MD to src/data/focusMatrix.ts");
