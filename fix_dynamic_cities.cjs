const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Fix the location badge in Block 4 to use the dynamic variables
const searchLoc = `<span className="font-mono text-sm tracking-widest uppercase text-white font-semibold">{currentActiveData?.city || 'Nova York, EUA'}</span>`;
const replaceLoc = `<span className="font-mono text-sm tracking-widest uppercase text-white font-semibold">{\`\${cityName}, \${countryName}\`}</span>`;

if (code.includes(searchLoc)) {
    code = code.replace(searchLoc, replaceLoc);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Block 4 location badge is dynamic now.");
} else {
    console.log("Could not find Block 4 badge.");
}
