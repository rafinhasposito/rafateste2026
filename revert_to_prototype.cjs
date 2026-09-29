const fs = require('fs');
fs.copyFileSync('src/pages/AppleResultPrototype.tsx', 'src/pages/AppleResultPreview.tsx');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');
code = code.replace(/AppleResultPrototype/g, 'AppleResultPreview');
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log('Reverted to Prototype');
