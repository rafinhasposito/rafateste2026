const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Revert to Casa 2
code = code.replace(`const isCurrent = idx + 1 === 10; // Mock: Casa 10 is the active um`, `const isCurrent = idx + 1 === 2; // Mock: Casa 2 is the active um`);

// 2. Fix the broken images in Rotas Alternativas. Let's just use the known working fallback image from DestinyResults for all of them in the mock.
const fallbackImg = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";
code = code.replace(/img: "https:\/\/images\.unsplash\.com\/photo-[^"]+"/g, `img: "${fallbackImg}"`);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Images fixed and reverted to Casa 2.");
