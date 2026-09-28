const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject currentActiveData before returning the accordion
if (!content.includes('const currentActiveData')) {
  content = content.replace(
    'const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);',
    `const sortedAreas = [...LIFE_AREAS].sort((a,b) => b.score - a.score);\n  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));`
  );
}

// Fix line 472: inside the first map, activeArea -> area
content = content.replace(
  'style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${activeArea?.color || \'#10b981\'} 12%, #000000)`}, color-mix(in srgb, ${activeArea?.color || \'#10b981\'} 12%, rgba(0,0,0,0.7)) 50%, transparent)` }}',
  'style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${area.color || \'#10b981\'} 12%, #000000)`}, color-mix(in srgb, ${area.color || \'#10b981\'} 12%, rgba(0,0,0,0.7)) 50%, transparent)` }}'
);

// Fix line 509: outside both maps, activeArea -> currentActiveData
content = content.replace(
  'style={{ backgroundColor: `color-mix(in srgb, ${activeArea?.color || \'#10b981\'} 12%, #000000)` }}',
  'style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || \'#10b981\'} 12%, #000000)` }}'
);

fs.writeFileSync(file, content);
console.log("Fixed activeArea scope errors!");
