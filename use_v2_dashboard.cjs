const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const importSearch = `import DestinyResults from "@/components/DestinyResults";`;
const importReplace = `import DestinyResults from "@/pages/AppleResultPreview";`;

if (code.includes(importSearch)) {
    code = code.replace(importSearch, importReplace);
    fs.writeFileSync('src/pages/Dashboard.tsx', code);
    console.log("Dashboard now imports AppleResultPreview instead of DestinyResults!");
} else {
    console.log("Could not find the import statement in Dashboard.");
}
