const fs = require('fs');

// The user wants exactly what was approved. 
// AppleResultPrototype.tsx from 16:57 is the holy grail.
fs.copyFileSync('src/pages/AppleResultPrototype.tsx', 'src/pages/AppleResultPreview.tsx');

let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');
// Only rename the component export so it mounts correctly.
code = code.replace(/export default function AppleResultPrototype/g, 'export default function AppleResultPreview');
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);

console.log('Restored perfectly to the 16:57 approved state.');
