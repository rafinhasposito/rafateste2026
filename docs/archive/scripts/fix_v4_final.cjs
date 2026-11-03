const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Import if missing
if (!content.includes('import { REAL_HOUSES_DATA }')) {
  content = content.replace(
    'import { Lock, MapPin',
    'import { REAL_HOUSES_DATA } from "../data/houses_content";\nimport { Lock, MapPin'
  );
}

// 2. Fix TDZ for themeColor
const tdzThemeColor = "const themeColor = currentActiveData?.color || activeRoute.color || '#10b981';";
content = content.replace(tdzThemeColor, ''); // Remove it from where it currently is
content = content.replace(
  'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));',
  'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));\n  const themeColor = currentActiveData?.color || activeRoute.color || \'#10b981\';'
);

// 3. Remove the bad console.log if it's there
content = content.replace('console.log("V4 STATE:", { activeRouteIndex, focusId: activeRoute.focusId, hoveredArea, color: currentActiveData?.color });', '');

fs.writeFileSync(file, content);
console.log("Fixed TDZ and Missing Import silently.");
