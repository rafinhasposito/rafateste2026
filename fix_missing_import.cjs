const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

if (!code.includes('import UnlockPremiumModal')) {
  code = code.replace(
    `import { DesktopWebChrome }`,
    `import UnlockPremiumModal from "@/components/UnlockPremiumModal";\nimport { DesktopWebChrome }`
  );
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Imported UnlockPremiumModal.");
} else {
  console.log("Already imported.");
}
