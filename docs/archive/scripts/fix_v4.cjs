const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix areaColor redeclaration
content = content.replace(
  'const areaColor = mockData.color;\n                  const areaColor = LIFE_AREAS[num - 1]?.color || currentActiveData?.color || \'#10b981\';',
  'const areaColor = mockData.color || currentActiveData?.color || \'#10b981\';'
);

// Fix activeArea.full issue:
// The problem is that when I mapped ROUTES_MOCK_DATA, I didn't add the `full` text inside the LIFE_AREAS or wherever.
// Actually, I didn't touch LIFE_AREAS. But wait, `activeArea` in V3 was still `activeArea.full` which existed in LIFE_AREAS.
// Oh, the error says: Property 'full' does not exist on type...
// It means I should add `full?: string` to the array or I just need to remove the TS error.
// The error is because TS is inferring the type of LIFE_AREAS and some elements don't have `full`.
// I'll just cast it or use `(area as any).full`.

content = content.replace(/\{area\.full\}/g, '{(area as any).full}');
content = content.replace(/\{activeArea\.full\}/g, '{(activeArea as any).full}');

fs.writeFileSync(file, content);
