const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV5.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* FLOATING DEBUG BOX \*\/\}[\s\S]*?<\/div>\s*\{\/\* AS 8 ÁREAS - GRID SPLIT \*\/\}/g;
content = content.replace(regex, '{/* AS 8 ÁREAS - GRID SPLIT */}');

fs.writeFileSync(file, content);
console.log("Removed debug box from V5");
