const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// The file currently has this import block at the top:
// import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";
// import { MobileAppChrome } from "@/layouts/MobileAppChrome";
// import { MapPin, ...

if (!code.includes('UnlockPremiumModal from "@/components/UnlockPremiumModal"')) {
    code = code.replace(
        'import { MobileAppChrome } from "@/layouts/MobileAppChrome";',
        'import { MobileAppChrome } from "@/layouts/MobileAppChrome";\nimport { cityDatabase } from "@/data/houses";\nimport UnlockPremiumModal from "@/components/UnlockPremiumModal";'
    );
    fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
    console.log("Imports added.");
} else {
    console.log("Imports already present.");
}
