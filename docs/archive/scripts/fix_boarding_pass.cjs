const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldDinheiro = `<p className="font-bold text-xl flex items-center gap-3" style={{ color: themeColor }}>
                                 <CircleDollarSign className="w-5 h-5"/> Dinheiro & Prosperidade
                               </p>`;

const newDinheiro = `<p className="font-bold text-xl flex items-center gap-3" style={{ color: themeColor }}>
                                 <currentActiveData.icon className="w-5 h-5"/> {currentActiveData.label}
                               </p>`;

content = content.replace(oldDinheiro, newDinheiro);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);
console.log("Fixed hardcoded Dinheiro & Prosperidade in Boarding Pass");
