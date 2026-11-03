const fs = require('fs');

const md = fs.readFileSync('banco-de-dados-12-casas-8-focos-conversa-de-cafe-v2.md', 'utf-8');
const lines = md.split('\n');

const DB = {};

let currentHouse = null;
let currentFocus = null;

const mapFocus = (title) => {
  const t = title.toLowerCase();
  if (t.includes('dinheiro')) return 'dinheiro';
  if (t.includes('trabalho') || t.includes('carreira')) return 'trabalho';
  if (t.includes('identidade') || t.includes('imagem')) return 'identidade';
  if (t.includes('networking') || t.includes('conex')) return 'networking';
  if (t.includes('amor')) return 'amor';
  if (t.includes('espiritual') || t.includes('prop')) return 'espiritual';
  if (t.includes('rotina')) return 'rotina'; 
  if (t.includes('saúde') || t.includes('saude')) return 'saude';
  if (t.includes('casamento')) return 'amor_duplicado'; // Ignored
  return null;
};

for (const line of lines) {
  const hMatch = line.match(/### CASA (\d+) × FOCO: (.*)/i);
  if (hMatch) {
    currentHouse = hMatch[1];
    currentFocus = mapFocus(hMatch[2]);
    if (!DB[currentHouse]) DB[currentHouse] = {};
    if (currentFocus) {
      if (hMatch[2].toLowerCase().includes('rotina e sa')) {
         DB[currentHouse]['rotina'] = { pillars: [], phases: [], ritual: {} };
         DB[currentHouse]['saude'] = { pillars: [], phases: [], ritual: {} };
         currentFocus = 'rotina_saude_combo';
      } else {
         DB[currentHouse][currentFocus] = { pillars: [], phases: [], ritual: {} };
      }
    }
  }

  if (!currentHouse || !currentFocus) continue;

  const extract = (regex, callback) => {
    const match = line.match(regex);
    if (match) {
      if (currentFocus === 'rotina_saude_combo') {
        callback(DB[currentHouse]['rotina'], match);
        callback(DB[currentHouse]['saude'], match);
      } else if (currentFocus !== 'amor_duplicado') {
        callback(DB[currentHouse][currentFocus], match);
      }
    }
  };

  extract(/^\*\*Match:\*\* (\d+)%/, (obj, m) => obj.match = parseInt(m[1]));
  extract(/^\*\*Headline:\*\* (.*)/, (obj, m) => obj.headline = m[1].trim());
  extract(/^\*\*O Tema do Ano:\*\* (.*)/, (obj, m) => obj.theme = m[1].trim());
  extract(/^\*\*O Segredo Deste Ano:\*\* (.*)/, (obj, m) => obj.secret = m[1].trim());
  extract(/^\*\*Mantra:\*\* (.*)/, (obj, m) => obj.mantra = m[1].replace(/["']/g, '').trim());
  extract(/^\*\*O Ponto Cego:\*\* (.*)/, (obj, m) => obj.blindSpot = m[1].trim());
  extract(/^\*\*Protocolo de Defesa:\*\* (.*)/, (obj, m) => obj.defenseProtocol = m[1].replace(/["']/g, '').trim());

  extract(/^\*\*Pilar (\d+):\*\* (.*?)\s*\|\s*(.*)/, (obj, m) => {
    obj.pillars.push({ title: m[2].trim(), description: m[3].trim() });
  });

  extract(/^\*\*Fase (\d+) \(.*?\):\*\* (.*?)\s*\|\s*(.*)/, (obj, m) => {
    obj.phases.push({ title: m[2].trim(), description: m[3].trim() });
  });

  extract(/^\*\*Ritual Passo (\d+):\*\* (.*)/, (obj, m) => {
    obj.ritual[`step${m[1]}`] = m[2].trim();
  });
}

const tsCode = `export const FOCUS_MATRIX: Record<number, Record<string, any>> = ${JSON.stringify(DB, null, 2)};\n`;

fs.writeFileSync('src/data/focusMatrix.ts', tsCode);
console.log('Matrix successfully rebuilt!');

