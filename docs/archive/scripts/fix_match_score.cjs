const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{P.match}% MATCH',
  '{currentActiveData.score}% MATCH'
);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Fixed Match Score");
