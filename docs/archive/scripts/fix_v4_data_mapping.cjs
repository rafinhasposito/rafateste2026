const fs = require('fs');

let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// 1. Import cityDatabase if not already imported
if (!content.includes('import { cityDatabase } from "@/data/houses";')) {
  content = content.replace(
    'import { houseThemes } from "@/data/houseThemes";',
    'import { houseThemes } from "@/data/houseThemes";\nimport { cityDatabase } from "@/data/houses";'
  );
}

// 2. Fix the Accordion expanded text mapping!
// Instead of (activeArea as any).full, we pull from cityDatabase
// The area ids in LIFE_AREAS are: "amor", "trabalho", "dinheiro", "saude", "networking", "rotina", "espiritual", "identidade"

const oldAccordionText = `{(activeArea as any).full}`;
const newAccordionText = `{
                              activeArea.id === 'dinheiro' ? (cityDatabase[houseModel.id]?.dinheiro || (activeArea as any).full) :
                              activeArea.id === 'amor' ? (cityDatabase[houseModel.id]?.amor || (activeArea as any).full) :
                              activeArea.id === 'trabalho' ? (cityDatabase[houseModel.id]?.trabalho || (activeArea as any).full) :
                              activeArea.id === 'rotina' ? (cityDatabase[houseModel.id]?.vidaPessoal || (activeArea as any).full) :
                              (activeArea as any).full
                            }`;
                            
// Replace all instances of the accordion text
content = content.replace(/\{\(activeArea as any\)\.full\}/g, newAccordionText);

// 3. Fix the DNA Astrológico block mapping
// In V4, currentActiveData.dna?.essencia is used. Let's override it if we are on the primary focus of the house, or just map it to the database directly!
// Wait, to keep it simple and foolproof, I'll just redefine currentActiveData to inject the real database texts into the 'dna' object.

const oldCurrentActiveData = `const currentActiveData = {
    label: houseModel.focusLabel,
    color: houseThemes[houseModel.id]?.themeColor || houseModel.themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.pillars,
    dna: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.dna
  };`;

const newCurrentActiveData = `const currentActiveData = {
    label: houseModel.focusLabel,
    color: houseThemes[houseModel.id]?.themeColor || houseModel.themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.pillars,
    dna: {
      essencia: cityDatabase[houseModel.id]?.oQueVocePrecisaEntender || cityDatabase[houseModel.id]?.oTema || LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.dna?.essencia,
      metodo: cityDatabase[houseModel.id]?.oSegredo || LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.dna?.metodo,
      fase: cityDatabase[houseModel.id]?.fase1 || LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.dna?.fase
    }
  };`;

content = content.replace(oldCurrentActiveData, newCurrentActiveData);

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Fixed the data mappings!");
