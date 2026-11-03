const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

code = code.replace(/currentActiveData\?\.color/g, 'houseData.color || "#10b981"');
code = code.replace(/currentActiveData\?\.label/g, 'houseData.label || "Foco Atual"');

// Fix the undefined variables we removed
code = code.replace(/const \[activeDnaTab, setActiveDnaTab\] = useState\('essencia'\);/g, '');
code = code.replace(/const \[openTimelinePhase, setOpenTimelinePhase\] = useState<number \| null>\(0\);/g, '');

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Leftovers fixed.");
