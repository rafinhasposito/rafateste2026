const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { DesktopWebChrome }')) {
  content = content.replace(
    'import { MapPin',
    'import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";\nimport { MobileAppChrome } from "@/layouts/MobileAppChrome";\nimport { MapPin'
  );
  fs.writeFileSync(file, content);
}
console.log("Fixed!");
