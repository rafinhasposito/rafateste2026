const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const oldIconLine = `<pilar.icon className="w-7 h-7" style={{ color: currentActiveData.color }} />`;
const newIconLine = `{(() => { const Icon = [Target, Crown, Shield][index % 3]; return <Icon className="w-7 h-7" style={{ color: currentActiveData.color }} /> })()}`;
content = content.replace(oldIconLine, newIconLine);

content = content.replace(/pilar\.text/g, 'pilar.description');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
