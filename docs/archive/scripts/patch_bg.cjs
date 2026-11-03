const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace deep blue backgrounds with deep emerald backgrounds
content = content.replace(/#0B1426/g, '#02160F');
content = content.replace(/#101D36/g, '#042A1D');

fs.writeFileSync(file, content);
console.log("Background colors patched!");
