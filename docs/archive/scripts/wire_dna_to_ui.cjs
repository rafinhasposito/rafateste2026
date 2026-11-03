const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Add the import
if (!content.includes('import { DNA_MATRIX }')) {
  content = content.replace(
    "import { FOCUS_MATRIX } from '../data/focusMatrix';",
    "import { FOCUS_MATRIX } from '../data/focusMatrix';\nimport { DNA_MATRIX } from '../data/dnaMatrix';"
  );
}

// Update mergedAreas
content = content.replace(
  'defenseProtocol: focusData.defenseProtocol',
  'defenseProtocol: focusData.defenseProtocol,\n          dnaData: DNA_MATRIX[P_DYNAMIC.house]?.[area.id] || area.dna'
);

// Update UI rendering for DNA (Block 3)
content = content.replace(/\{currentActiveData\.dna\?\.essencia\}/g, '{currentActiveData.dnaData?.essencia || currentActiveData.dna?.essencia}');
content = content.replace(/\{currentActiveData\.dna\?\.metodo\}/g, '{currentActiveData.dnaData?.metodo || currentActiveData.dna?.metodo}');
content = content.replace(/\{currentActiveData\.dna\?\.fase\}/g, '{currentActiveData.dnaData?.fase || currentActiveData.dna?.fase}');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
