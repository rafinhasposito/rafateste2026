const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'console.log("V4 STATE:", { activeRouteIndex, focusId: activeRoute.focusId, hoveredArea, color: currentActiveData?.color });',
  ''
);

fs.writeFileSync(file, content);
console.log("Fixed TDZ Error!");
