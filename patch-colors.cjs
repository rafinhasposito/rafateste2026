const fs = require('fs');

const tsCode = fs.readFileSync('src/data/houseThemes.ts', 'utf8');

// Extract the object part
const objectMatch = tsCode.match(/export const houseThemes: Record<number, HouseTheme> = (\{[\s\S]+\});/);
if (!objectMatch) {
  console.log("Could not find houseThemes object");
  process.exit(1);
}

let themes = eval('(' + objectMatch[1] + ')');

const exactColors = {
  1: "#E11D48",
  2: "#10B981",
  3: "#F59E0B",
  4: "#38BDF8",
  5: "#EAB308",
  6: "#14B8A6",
  7: "#F43F5E",
  8: "#881337",
  9: "#6366F1",
  10: "#334155",
  11: "#3B82F6",
  12: "#8B5CF6"
};

for (let i = 1; i <= 12; i++) {
  if (themes[i]) {
    themes[i].themeColor = exactColors[i];
  }
}

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
console.log("Colors patched successfully!");
