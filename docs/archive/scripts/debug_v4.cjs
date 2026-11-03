const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('console.log("V4 STATE:"')) {
  content = content.replace(
    'const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];',
    'const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];\n  console.log("V4 STATE:", { activeRouteIndex, focusId: activeRoute.focusId, hoveredArea, color: currentActiveData?.color });'
  );
  fs.writeFileSync(file, content);
  console.log("Added console.log for debugging.");
}
