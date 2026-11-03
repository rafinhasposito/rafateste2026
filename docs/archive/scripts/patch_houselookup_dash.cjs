const fs = require('fs');
const file = 'src/components/HouseLookup.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace setResult({ ... }) with navigate
const resultRegex = /setResult\(\{\s*house:[\s\S]*?consultationId,\s*\}\);/m;
content = content.replace(resultRegex, `if (consultationId) navigate("/dashboard?id=" + consultationId);`);

// Remove <AnimatePresence> {result && <DestinyResults ... />} </AnimatePresence>
const uiRegex = /<AnimatePresence>[\s\S]*?<DestinyResults[\s\S]*?<\/AnimatePresence>/m;
content = content.replace(uiRegex, '');

fs.writeFileSync(file, content);
console.log("Patched HouseLookup to navigate directly to Dashboard.");
