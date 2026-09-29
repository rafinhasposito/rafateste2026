const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const target = `<h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white/20 leading-none drop-shadow-xl mb-6 select-none" style={{ filter: 'blur(6px)' }}>
                              {activeArea.label}
                            </h3>`;
const replacement = `<h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                              {activeArea.label}
                            </h3>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Locked title successfully unblurred and made visible.");
} else {
    console.log("Could not find target locked title block.");
}
