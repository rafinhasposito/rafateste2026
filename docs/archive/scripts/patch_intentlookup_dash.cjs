const fs = require('fs');
const file = 'src/components/IntentLookup.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace setResult({ ... }) with navigate
const resultRegex = /setResult\(\{\s*house: houseId,\s*houseName: houseData\.label,\s*houseData,\s*cities,\s*allResults,\s*consultationId\s*\}\);/m;
content = content.replace(resultRegex, `if (consultationId) navigate("/dashboard?id=" + consultationId);`);

// Remove <AnimatePresence> {result && <DestinyResults ... />} </AnimatePresence>
// In IntentLookup it's inside <motion.div> and has a "Trocar Intenção" button
const uiRegex = /<AnimatePresence>[\s\S]*?<DestinyResults[\s\S]*?<\/AnimatePresence>/m;
content = content.replace(uiRegex, '');

fs.writeFileSync(file, content);
console.log("Patched IntentLookup to navigate directly to Dashboard.");
