const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the entire variable declaration block
const regex = /const activeRoute = ROUTES_MOCK_DATA\[activeRouteIndex\];[\s\S]*?const themeColor = currentActiveData\?\.color \|\| activeRoute\.color \|\| '#10b981';/;

const newDataVars = `// Clean Architecture: Single Source of Truth
  const houseModel = HOUSE_RESULTS[activeRouteIndex + 1] || HOUSE_RESULTS[1];
  const dynamicCity = houseModel.city + ", " + houseModel.country;
  const dynamicHouseNum = houseModel.id;
  const dynamicHouseLabel = houseModel.focusLabel;
  const dynamicHouseImg = houseModel.img;
  const themeColor = houseModel.themeColor;
  
  // Legacy variables mapped to new model for Grid compatibility
  const activeRoute = ROUTES_MOCK_DATA[activeRouteIndex];
  const currentHouseData = houseModel;
  const currentActiveData = {
    label: houseModel.focusLabel,
    color: houseModel.themeColor,
    score: houseModel.score,
    city: houseModel.city,
    image: houseModel.img,
    pillars: sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id))?.pillars,
    dna: sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id))?.dna
  };`;

content = content.replace(regex, newDataVars);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Replaced variables block");
