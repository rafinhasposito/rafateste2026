const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Blue with Emerald (Casa 2 / Dinheiro Official Color)
content = content.replace(/#3b82f6/g, '#10b981');
content = content.replace(/blue-200/g, 'emerald-200');
content = content.replace(/rgba\(59,130,246/g, 'rgba(16,185,129');

fs.writeFileSync(file, content);
console.log("Colors patched to Emerald!");
