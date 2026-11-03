const fs = require('fs');

let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// The currentActiveData was pulling color, city, image, score from LIFE_AREAS or fake logic.
// Let's force it to strictly pull from the House Model!

const regex = /const currentActiveData = \{[^}]+\};/;
const newObject = `const currentActiveData = {
    label: houseModel.focusLabel,
    color: houseThemes[houseModel.id]?.themeColor || houseModel.themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: cityDatabase[houseModel.id]?.podeFavorecer?.slice(0,3).map(p => ({ icon: window.Sparkles || window.Star, title: "Foco", text: p })) || LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.pillars,
    dna: {
      essencia: cityDatabase[houseModel.id]?.oQueVocePrecisaEntender || cityDatabase[houseModel.id]?.oTema || "Essência não encontrada",
      metodo: cityDatabase[houseModel.id]?.oSegredo || "Método não encontrado",
      fase: cityDatabase[houseModel.id]?.fase1 || "Fase não encontrada"
    }
  };`;

// wait, the exact string to replace might be different because I updated it recently.
