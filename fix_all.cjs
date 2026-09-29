const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

code = code.replace(`const userCredits = 9561;`, `// const userCredits = 9561;`);
code = code.replace(`const isActualCurrent = houseNum === houseNum /* We use houseNum from props */;`, ``);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
