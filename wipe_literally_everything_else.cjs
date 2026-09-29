const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const cutStart = code.indexOf('{/* ══════════════════════════════════════════════════\n         5. A REVELAÇÃO');
const cutEnd = code.indexOf('<style dangerouslySetInnerHTML');

if (cutStart !== -1 && cutEnd !== -1) {
    code = code.substring(0, cutStart) + '\n      ' + code.substring(cutEnd);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Deleted EVERYTHING below the match matrix.");
} else {
    console.log("Could not find cut points.");
}
