const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original file is a mess right now. Let's reset to HEAD and do it properly ONE LAST TIME.
