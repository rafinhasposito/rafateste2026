const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import HOUSE_RESULTS
content = content.replace(
  'import { REAL_HOUSES_DATA } from "../data/houses_content";',
  'import { REAL_HOUSES_DATA } from "../data/houses_content";\nimport { HOUSE_RESULTS } from "@/data/houseResults";'
);

// Map the data cleanly
const oldDataVars = `const dynamicCity = activeRoute.city;
  const dynamicHouseNum = activeRoute.house;
  const dynamicHouseLabel = activeRoute.label;
  const dynamicHouseImg = \`https://images.unsplash.com/photo-\${activeRoute.img}?auto=format&fit=crop&w=2000&q=80\`;
  const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];
  
  // Encontra qual "Área de Vida" (DNA/Foco) corresponde a essa rota (usando o focusId)
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));
  const themeColor = currentActiveData?.color || activeRoute.color || '#10b981';`;

const newDataVars = `// Clean Architecture: Single Source of Truth
  const houseModel = HOUSE_RESULTS[activeRouteIndex + 1] || HOUSE_RESULTS[1];
  const dynamicCity = houseModel.city + ", " + houseModel.country;
  const dynamicHouseNum = houseModel.id;
  const dynamicHouseLabel = houseModel.focusLabel;
  const dynamicHouseImg = houseModel.img;
  const themeColor = houseModel.themeColor;
  
  // Legacy variables mapped to new model for Grid compatibility
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

content = content.replace(oldDataVars, newDataVars);

// Replace any remaining {dynamicCity.split(',')[0]} with {houseModel.city} just to be cleaner
content = content.replace(/\{dynamicCity\.split\(\',\', 1\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\',1\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\', \d\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\s*\'\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\s*\'\s*\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\s*\'\s*,\s*1\s*\)\[0\]\}/g, '{houseModel.city}');
content = content.replace(/\{dynamicCity\.split\(\',\', 1\)/g, '{houseModel.city');

content = content.replace(/dynamicCity\.split\('\,'\)\[0\]/g, 'houseModel.city');
content = content.replace(/dynamicCity\.split\(\',\', 1\)\[0\]/g, 'houseModel.city');
content = content.replace(/dynamicCity\.split\(','\)\[0\]/g, 'houseModel.city');

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Rewrote V4 to use a clean HOUSE_RESULTS data model!");
