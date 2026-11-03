const fs = require('fs');
const mdContent = fs.readFileSync('📁 revolucao-solar - mds notebooklm/📁 banco-de-dados/08-introducoes-casas trailler.md', 'utf8');

const themeColors = {
  1: "#dc2626", 2: "#16a34a", 3: "#eab308", 4: "#94a3b8", 5: "#f59e0b",
  6: "#0d9488", 7: "#db2777", 8: "#7e22ce", 9: "#6366f1", 10: "#c9a227",
  11: "#3b82f6", 12: "#06b6d4",
};

const avatars = {
  1: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  2: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  3: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  4: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  5: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  6: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  7: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  8: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  9: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  10: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  11: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
  12: [{m: "homem_jovem.png", f: "mulher_oriental.png"}, {m: "homem_adulto.png", f: "mulher_moderna.png"}, {m: "homem_nerd.png", f: "mulher_negra.png"}],
};

const houses = mdContent.split('## CASA ').slice(1);
const parsedThemes = {};

houses.forEach((houseRaw) => {
  const houseNum = parseInt(houseRaw.trim().split('\n')[0].trim());
  if (isNaN(houseNum)) return;
  
  let subtitle = "";
  const subMatch = houseRaw.match(/\*\*([^\*]+)\*\*/);
  if (subMatch) subtitle = subMatch[1];

  let energyLines = [];
  if (houseRaw.includes('A Energia do Ano')) {
    const energyPart = houseRaw.split('A Energia do Ano')[1].split('#### 📌')[0];
    energyLines = energyPart.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  }

  let personaLines = [];
  if (houseRaw.includes('Para Quem É A Casa')) {
    const personaPart = houseRaw.split('Para Quem É A Casa')[1].split('---')[0];
    personaLines = personaPart.split('\n').filter(l => l.includes('•')).map(l => {
      // Remover os bullets e os textos em negrito que vêm antes da descrição
      // Ex: "• **Cansou de carregar a vida sozinho no esforço individual** e entendeu que o seu crescimento depende do ecossistema certo."
      // Queremos preservar tudo para fazer sentido, ou só tirar o bullet.
      // O UI antigo exibia: "Cansou de carregar tudo sozinho e entendeu que o seu crescimento depende do ecossistema certo."
      // Entao vamos apenas remover o bullet e o markdown de negrito.
      let text = l.replace(/•\s*/, '').replace(/\*\*/g, '').trim();
      return text;
    });
  }

  parsedThemes[houseNum] = {
    id: houseNum,
    name: `Casa ${houseNum}`,
    themeColor: themeColors[houseNum] || "#ffffff",
    subtitle: subtitle,
    energyLines: energyLines,
    personas: personaLines.slice(0, 3).map((text, i) => ({
      avatarM: avatars[houseNum][i] ? avatars[houseNum][i].m : "homem_jovem.png",
      avatarF: avatars[houseNum][i] ? avatars[houseNum][i].f : "mulher_oriental.png",
      text: text || "Descrição genérica"
    }))
  };
});

const output = `export type HouseTheme = {
  id: number;
  name: string;
  themeColor: string;
  subtitle: string;
  energyLines: string[];
  personas: {
    avatarM: string;
    avatarF: string;
    text: string;
  }[];
};

export const houseThemes: Record<number, HouseTheme> = ${JSON.stringify(parsedThemes, null, 2)};
`;

fs.writeFileSync('src/data/houseThemes.ts', output);
console.log("Successfully rebuilt houseThemes.ts from notebookLM file.");
