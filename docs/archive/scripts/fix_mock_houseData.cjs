const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add cityDatabase import
if (!code.includes('import { cityDatabase }')) {
  code = code.replace(`import { DesktopWebChrome }`, `import { cityDatabase } from "@/data/houses";\nimport { DesktopWebChrome }`);
}

// 2. Fix the mock
const searchMock = `const houseData = props.houseData || {};`;
const replaceMock = `const houseData = isPreviewMode ? cityDatabase[houseNum as keyof typeof cityDatabase] : (props.houseData || {});`;

code = code.replace(searchMock, replaceMock);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("houseData mock fixed with real database.");
