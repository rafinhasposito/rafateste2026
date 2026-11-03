const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const themeColor =')) {
  content = content.replace(
    'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));',
    'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));\n  const themeColor = currentActiveData?.color || activeRoute.color || \'#10b981\';'
  );
}

content = content.replace(/text-\[#10b981\]/g, '"" style={{ color: themeColor }}');
content = content.replace(/bg-\[#10b981\]\/10/g, '"" style={{ backgroundColor: themeColor + "1a" }}');
content = content.replace(/bg-\[#10b981\]\/5/g, '"" style={{ backgroundColor: themeColor + "0d" }}');
content = content.replace(/bg-\[#10b981\]\/20/g, '"" style={{ backgroundColor: themeColor + "33" }}');
content = content.replace(/bg-\[#10b981\]/g, '"" style={{ backgroundColor: themeColor }}');
content = content.replace(/border-\[#10b981\]\/10/g, '"" style={{ borderColor: themeColor + "1a" }}');
content = content.replace(/border-\[#10b981\]\/20/g, '"" style={{ borderColor: themeColor + "33" }}');
content = content.replace(/border-\[#10b981\]\/30/g, '"" style={{ borderColor: themeColor + "4d" }}');
content = content.replace(/shadow-\[0_0_10px_#10b981\]/g, '"" style={{ boxShadow: `0 0 10px ${themeColor}` }}');
content = content.replace(/shadow-\[0_0_30px_rgba\(16,185,129,0\.2\)\]/g, '"" style={{ boxShadow: `0 0 30px ${themeColor}33` }}');

content = content.replace(/className="([^"]*?)"" style=/g, 'className="$1" style=');
content = content.replace(/className='([^']*?)'"" style=/g, 'className=\'$1\' style=');
content = content.replace(/className=\{`([^`]*?)`\}"" style=/g, 'className={`$1`} style=');

// Gradients are tricky inline. Let's just remove the explicit gradient classes and replace with style if needed.
// Actually, let's just leave the gradient out or replace it with a plain background style for those two lines.
content = content.replace(/from-\[#10b981\]\/10/g, '');
content = content.replace(/via-\[#10b981\]\/50/g, '');

fs.writeFileSync(file, content);
console.log("Made Hero Dynamic 2!");
