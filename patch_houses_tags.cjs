const fs = require('fs');
const file = 'src/data/houses.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add tag to interface
if (!content.includes('tag?: string;')) {
  content = content.replace('name?: string;', 'name?: string;\n  tag?: string;');
}

const tags = {
  1: 'Autonomia, Liderança & Nova Identidade',
  2: 'Dinheiro, Segurança & Monetização',
  3: 'Comunicação, Vendas & Conexões Rápidas',
  4: 'Raízes, Família & Estrutura Emocional',
  5: 'Criatividade, Palco & Prazer Absoluto',
  6: 'Mundo Fit, Rotina & Saúde',
  7: 'Casamento, Sociedades & Contratos de Ouro',
  8: 'Transformação, Poder & Capital Oculto',
  9: 'Expansão, Internacionalização & Sorte',
  10: 'Carreira, Destaque & Autoridade',
  11: 'Networking, Comunidades & Escala Viral',
  12: 'Bastidores, Intuição & Deep Work'
};

for (let i = 1; i <= 12; i++) {
  const targetStr = `id: ${i},`;
  const replacementStr = `id: ${i},\n    tag: "${tags[i]}",`;
  
  if (content.includes(targetStr) && !content.includes(`tag: "${tags[i]}"`)) {
    content = content.replace(targetStr, replacementStr);
  }
}

fs.writeFileSync(file, content);
console.log("Patched houses.ts with new tags.");
