const fs = require('fs');

const tsCode = fs.readFileSync('src/data/houseThemes.ts', 'utf8');

// Extract the object part
const objectMatch = tsCode.match(/export const houseThemes: Record<number, HouseTheme> = (\{[\s\S]+\});/);
if (!objectMatch) {
  console.log("Could not find houseThemes object");
  process.exit(1);
}

let themes = eval('(' + objectMatch[1] + ')');

// Manually list the exact names that the user confirmed are in memojis_assets
const males = [
  "Homem cabelo preto de oculos.png",
  "homem adulto.png",
  "homem jovem.png",
  "homem loiro de oculos.png",
  "homem moreno oculos.png",
  "homem nerd.png",
  "homem oculos pria.png",
  "homem preto de oculos.png",
  "homem preto negro.png"
];

const females = [
  "mulher CEO.png",
  "mulher Feliz.png",
  "mulher apaixonada.png",
  "mulher boina roxa.png",
  "mulher cabelo colorido.png",
  "mulher cabelo verde.png",
  "mulher chapeu branco.png",
  "mulher com cabelo xuxinha.png",
  "mulher confiante.png",
  "mulher de touca.png",
  "mulher loira chapeu.png",
  "mulher loira com oculos.png",
  "mulher loira.png",
  "mulher moderna.png",
  "mulher morena.png",
  "mulher negra cabelo cacheado.png",
  "mulher negra.png",
  "mulher oriental.png"
];

// Shuffle helper
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// We want to ensure no two adjacent personas use the same memoji, and across houses it's as varied as possible
let mIndex = 0;
let fIndex = 0;

// Shuffle them once so it's beautifully random but distributed
const shuffledMales = shuffle([...males]);
const shuffledFemales = shuffle([...females]);

for (let i = 1; i <= 12; i++) {
  if (themes[i] && themes[i].personas) {
    for (let j = 0; j < themes[i].personas.length; j++) {
      themes[i].personas[j].avatarM = shuffledMales[mIndex % shuffledMales.length];
      themes[i].personas[j].avatarF = shuffledFemales[fIndex % shuffledFemales.length];
      mIndex++;
      fIndex++;
    }
    // slightly offset for the next house so combinations aren't identical
    mIndex += 1;
    fIndex += 2;
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
console.log("Memojis patched successfully with new list!");
