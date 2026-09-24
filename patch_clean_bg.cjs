const fs = require('fs');
const file = 'src/pages/Technology.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Remove the ugly yellow/brown background blobs completely
const blob1 = `<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />`;
const blob2 = `<div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-amber-700/10 blur-[150px] rounded-full mix-blend-screen" />`;
const blob3 = `<div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-yellow-900/10 blur-[150px] rounded-full mix-blend-screen" />`;

content = content.replace(blob1, '');
content = content.replace(blob2, '');
content = content.replace(blob3, '');

// 2. Remove the massive ugly blob behind step 3
const step3Blob = `<div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />`;
content = content.replace(step3Blob, '');

// 3. Clean up the murky gray circles to make them crisp pure black/gold
const oldCircle = `w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]`;
const newCircle = `w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/20 bg-[#050505] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(201,162,39,0.08)]`;

// Replace all occurrences of oldCircle (or similar)
// Step 1
content = content.replace(
  `w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]`,
  newCircle
);
// Step 2
content = content.replace(
  `w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]`,
  newCircle
);
// Step 3 had slightly different string:
content = content.replace(
  `w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(201,162,39,0.2)]`,
  newCircle
);

// 4. Update the Step 3 icon which was text-white to text-primary
content = content.replace(
  `<Globe className="w-12 h-12 md:w-16 md:h-16 text-white" />`,
  `<Globe className="w-12 h-12 md:w-16 md:h-16 text-primary" />`
);

fs.writeFileSync(file, content);
console.log("Background cleaned up. Removed muddy blobs and gray circles.");
