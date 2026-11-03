const fs = require('fs');

let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// Fix currentActiveData
const oldCurrentActiveData = `const currentActiveData = {
    icon: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.icon,
    unlocked: true,
    label: houseModel.focusLabel,
    color: houseModel.themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.pillars,
    dna: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.dna
  };`;

const newCurrentActiveData = `const currentActiveData = {
    icon: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.icon,
    unlocked: true,
    label: houseModel.focusLabel,
    color: themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: [
      { icon: window.Sparkles || window.Star, title: "A Essência", text: cityDatabase[houseModel.id]?.oTema || "Sua base de operação" },
      { icon: window.Sparkles || window.Star, title: "O Método", text: cityDatabase[houseModel.id]?.oSegredo || "A forma de agir" },
      { icon: window.Sparkles || window.Star, title: "O Alerta", text: cityDatabase[houseModel.id]?.cuidadoCom || "Onde ter atenção" }
    ],
    dna: {
      essencia: cityDatabase[houseModel.id]?.oQueVocePrecisaEntender || "A inteligência central deste destino.",
      metodo: cityDatabase[houseModel.id]?.oSegredo || "Como a energia opera na prática.",
      fase: cityDatabase[houseModel.id]?.fase1 || "Como iniciar sua jornada."
    }
  };`;

content = content.replace(oldCurrentActiveData, newCurrentActiveData);

// Fix Accordion colors and texts. In the Accordion, the mapped item should NOT override the house's color!
// Look for `activeArea.color`. In V4, it uses `activeArea.color` for borders, backgrounds, etc.
// Replace all `activeArea.color` in the accordion block with `themeColor`.
// Also, activeArea.label -> keep it. 
content = content.replace(/activeArea\.color/g, 'themeColor');

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Fixed HouseResult.tsx!");
