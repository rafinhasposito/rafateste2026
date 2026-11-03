const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

if (!code.includes('User,')) {
    code = code.replace('import { MapPin,', 'import { MapPin, User,');
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log('User imported correctly');
} else {
    console.log('User already imported');
}
