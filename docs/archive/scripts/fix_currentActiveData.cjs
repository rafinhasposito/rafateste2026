const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const currentActiveData = \{\n    label: houseModel\.focusLabel,/;

const newData = `const currentActiveData = {
    icon: LIFE_AREAS.find(a => a.id === (hoveredArea || LIFE_AREAS[0].id))?.icon,
    unlocked: true,
    label: houseModel.focusLabel,`;

content = content.replace(regex, newData);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Added missing properties to currentActiveData");
