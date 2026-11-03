const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

if (!content.includes('import { useParams }')) {
  content = content.replace(
    'import React, {',
    'import { useParams } from "react-router-dom";\nimport React, {'
  );
  fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
}
