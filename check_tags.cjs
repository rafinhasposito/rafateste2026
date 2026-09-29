const fs = require('fs');
const code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const divOpens = (code.match(/<div/g) || []).length;
const divCloses = (code.match(/<\/div>/g) || []).length;

console.log("div opens:", divOpens, "closes:", divCloses);
