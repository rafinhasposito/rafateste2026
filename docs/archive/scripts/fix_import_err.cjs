const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

content = content.replace(
  'import { REAL_HOUSES_DATA } from "@/data/houses_content"; from "@/data/baseHouseProfiles";',
  'import { REAL_HOUSES_DATA } from "@/data/houses_content";'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
