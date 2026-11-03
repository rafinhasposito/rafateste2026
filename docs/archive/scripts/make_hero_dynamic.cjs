const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to inject a `themeColor` variable.
if (!content.includes('const themeColor =')) {
  content = content.replace(
    'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));',
    'const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));\n  const themeColor = currentActiveData?.color || activeRoute.color || \'#10b981\';'
  );
}

// Now we need to carefully replace the Tailwind hardcoded greens with inline styles in the Boarding Pass.
// Instead of complex regex, I will just replace the specific blocks.
// Wait, an easier way to do dynamic colors with Tailwind in this specific app is to use the `style` attribute.
// Let's replace `text-[#10b981]` with `style={{ color: themeColor }}`

content = content.replace(/text-\[#10b981\]/g, '"" style={{ color: themeColor }}');
content = content.replace(/bg-\[#10b981\]\/10/g, '"" style={{ backgroundColor: `${themeColor}1a` }}');
content = content.replace(/bg-\[#10b981\]\/5/g, '"" style={{ backgroundColor: `${themeColor}0d` }}');
content = content.replace(/bg-\[#10b981\]\/20/g, '"" style={{ backgroundColor: `${themeColor}33` }}');
content = content.replace(/bg-\[#10b981\]/g, '"" style={{ backgroundColor: themeColor }}');
content = content.replace(/border-\[#10b981\]\/10/g, '"" style={{ borderColor: `${themeColor}1a` }}');
content = content.replace(/border-\[#10b981\]\/20/g, '"" style={{ borderColor: `${themeColor}33` }}');
content = content.replace(/border-\[#10b981\]\/30/g, '"" style={{ borderColor: `${themeColor}4d` }}');
content = content.replace(/shadow-\[0_0_10px_#10b981\]/g, '"" style={{ boxShadow: `0 0 10px ${themeColor}` }}');
content = content.replace(/shadow-\[0_0_30px_rgba\(16,185,129,0\.2\)\]/g, '"" style={{ boxShadow: `0 0 30px ${themeColor}33` }}');
content = content.replace(/from-\[#10b981\]\/10/g, '"" style={{ '--tw-gradient-from': `${themeColor}1a` }}');
content = content.replace(/via-\[#10b981\]\/50/g, '"" style={{ '--tw-gradient-via': `${themeColor}80` }}');

// Fix the classNames that got messed up by the naive replace
content = content.replace(/className="([^"]*?)"" style=/g, 'className="$1" style=');
content = content.replace(/className='([^']*?)'"" style=/g, 'className=\'$1\' style=');
content = content.replace(/className=\{`([^`]*?)`\}"" style=/g, 'className={`$1`} style=');

fs.writeFileSync(file, content);
console.log("Made Hero Dynamic!");
