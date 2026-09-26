const fs = require('fs');

const tsCode = fs.readFileSync('src/data/houseThemes.ts', 'utf8');

// Extract the object part
const objectMatch = tsCode.match(/export const houseThemes: Record<number, HouseTheme> = (\{[\s\S]+\});/);
if (!objectMatch) {
  console.log("Could not find houseThemes object");
  process.exit(1);
}

let themes = eval('(' + objectMatch[1] + ')');

const md = fs.readFileSync('notebook-updated.md', 'utf8');
const housesMd = md.split('### 🏛️ CASA ').slice(1);

housesMd.forEach(block => {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l);
  const houseId = parseInt(lines[0]);
  
  let energyIntro = "";
  let energyPoints = [];
  
  let currentTitle = "";
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "**Frase de Impacto:**") {
      energyIntro = lines[i+1];
    } else if (lines[i].match(/^\*\*\d\d\s\|/)) {
      // Matches **01 | Title:**
      const match = lines[i].match(/^\*\*\d\d\s\|\s(.*?):\*\*$/);
      if (match) {
        currentTitle = match[1];
        energyPoints.push({
          title: currentTitle,
          text: lines[i+1]
        });
      }
    }
  }

  if (themes[houseId]) {
    themes[houseId].energyIntro = energyIntro;
    themes[houseId].energyPoints = energyPoints;
    delete themes[houseId].energyLines; // Remove old format
  }
});

const output = `export type HouseTheme = {
  id: number;
  name: string;
  themeColor: string;
  subtitle: string;
  energyIntro: string;
  energyPoints: {
    title: string;
    text: string;
  }[];
  personas: {
    avatarM: string;
    avatarF: string;
    text: string;
  }[];
};

export const houseThemes: Record<number, HouseTheme> = ${JSON.stringify(themes, null, 2)};
`;

fs.writeFileSync('src/data/houseThemes.ts', output);
console.log("Updated houseThemes.ts successfully");
