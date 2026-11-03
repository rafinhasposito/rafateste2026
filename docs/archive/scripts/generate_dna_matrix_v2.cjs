const fs = require('fs');

const md = fs.readFileSync('dna-ativacao-96-focos-v2.md', 'utf-8');
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
         DB[currentHouse]['rotina'] = { essencia: '', metodo: '', fase: '' };
         DB[currentHouse]['saude'] = { essencia: '', metodo: '', fase: '' };
         currentFocus = 'rotina_saude_combo';
      } else {
         DB[currentHouse][currentFocus] = { essencia: '', metodo: '', fase: '' };
      }
    }
  }

  const eMatch = line.match(/^\*\*Essência:\*\* (.*)/);
  const mMatch = line.match(/^\*\*Método:\*\* (.*)/);
  const fMatch = line.match(/^\*\*Fase:\*\* (.*)/);

  if (eMatch && currentHouse && currentFocus) {
     if (currentFocus === 'rotina_saude_combo') {
       DB[currentHouse]['rotina'].essencia = eMatch[1].trim();
       DB[currentHouse]['saude'].essencia = eMatch[1].trim();
     } else if (currentFocus !== 'amor_duplicado') {
       DB[currentHouse][currentFocus].essencia = eMatch[1].trim();
     }
  }
  if (mMatch && currentHouse && currentFocus) {
     if (currentFocus === 'rotina_saude_combo') {
       DB[currentHouse]['rotina'].metodo = mMatch[1].trim();
       DB[currentHouse]['saude'].metodo = mMatch[1].trim();
     } else if (currentFocus !== 'amor_duplicado') {
       DB[currentHouse][currentFocus].metodo = mMatch[1].trim();
     }
  }
  if (fMatch && currentHouse && currentFocus) {
     if (currentFocus === 'rotina_saude_combo') {
       DB[currentHouse]['rotina'].fase = fMatch[1].trim();
       DB[currentHouse]['saude'].fase = fMatch[1].trim();
     } else if (currentFocus !== 'amor_duplicado') {
       DB[currentHouse][currentFocus].fase = fMatch[1].trim();
     }
  }
}

const dnaTsCode = `// Gerado automaticamente via NotebookLM e Script Parser (V2 - Conversa de Café)
export const DNA_MATRIX: Record<number, Record<string, { essencia: string; metodo: string; fase: string }>> = ${JSON.stringify(DB, null, 2)};
`;

fs.writeFileSync('src/data/dnaMatrix.ts', dnaTsCode);
console.log('DNA_MATRIX successfully updated!');

