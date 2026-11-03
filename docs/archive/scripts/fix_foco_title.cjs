const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFoco = `<h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">{P.intention}</span>.</h3>`;
const newFoco = `<h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(to right, \${themeColor}, \${themeColor}80)\` }}>{currentActiveData.label}</span>.</h3>`;

content = content.replace(oldFoco, newFoco);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Fixed hardcoded intention and green gradient");
