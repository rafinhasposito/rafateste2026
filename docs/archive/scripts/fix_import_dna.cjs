const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

if (!content.includes('import { DNA_MATRIX }')) {
  content = content.replace(
    'import { FOCUS_MATRIX } from "@/data/focusMatrix";',
    'import { FOCUS_MATRIX } from "@/data/focusMatrix";\nimport { DNA_MATRIX } from "@/data/dnaMatrix";'
  );
}

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
