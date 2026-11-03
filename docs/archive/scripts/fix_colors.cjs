const fs = require('fs');

// Update HouseResult.tsx to use houseThemes for colors!
let content = fs.readFileSync('src/pages/HouseResult.tsx', 'utf8');

// Import houseThemes
content = content.replace(
  'import { HOUSE_RESULTS } from "@/data/houseResults";',
  'import { HOUSE_RESULTS } from "@/data/houseResults";\nimport { houseThemes } from "@/data/houseThemes";'
);

// Update themeColor derivation
content = content.replace(
  'const themeColor = houseModel.themeColor;',
  'const themeColor = houseThemes[houseModel.id]?.themeColor || houseModel.themeColor;'
);

fs.writeFileSync('src/pages/HouseResult.tsx', content);
console.log("Updated HouseResult.tsx to use master colors from houseThemes!");
