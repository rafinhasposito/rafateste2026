const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Replace `${cityName}, ${countryName}` with `'Nova York, EUA'` globally
// We will only do this for the LIFE_AREAS definition which is outside the component
// The easiest is just replacing it everywhere, since we use `cityName` directly in the jsx where needed now, or I can just fix the backticks.
code = code.replace(/\`\$\{cityName\}, \$\{countryName\}\`/g, '"Nova York, EUA"');

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Fixed ReferenceError by restoring static string in constants.");
