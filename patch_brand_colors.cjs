const fs = require('fs');
const file = 'src/pages/Technology.tsx';

let content = fs.readFileSync(file, 'utf8');

// The goal is to replace all indigo/purple/blue/sky instances with primary/yellow/amber
// while keeping the exact same structure.

const replacements = [
  // Background Mesh Gradients
  ['bg-indigo-900/20', 'bg-primary/10'],
  ['bg-purple-900/10', 'bg-amber-700/10'],
  ['bg-blue-900/10', 'bg-yellow-900/10'],
  
  // Hero
  ['from-indigo-500 to-purple-500', 'from-primary/50 to-amber-500/50'],
  ['text-indigo-400', 'text-primary'],
  ['from-indigo-300 via-purple-300 to-white', 'from-primary via-yellow-200 to-white'],
  
  // Icons and Accents
  ['text-indigo-300/80', 'text-primary/80'],
  ['text-indigo-300', 'text-primary'],
  
  ['text-purple-300/80', 'text-primary/80'],
  ['text-purple-300', 'text-primary'],
  
  ['bg-blue-500/20', 'bg-primary/20'],
  ['rgba(59,130,246,0.2)', 'rgba(201,162,39,0.2)'], // approx #C9A227
  ['text-blue-300/80', 'text-primary/80'],
  ['text-blue-300', 'text-primary'],
  
  // Bento Box Lines
  ['bg-indigo-500/50', 'bg-primary/50'],
  ['bg-purple-500/50', 'bg-primary/50'],
  
  // Selection
  ['selection:bg-indigo-500/30', 'selection:bg-primary/30']
];

let updatedContent = content;
for (const [search, replace] of replacements) {
  updatedContent = updatedContent.split(search).join(replace);
}

fs.writeFileSync(file, updatedContent);
console.log("Brand colors (Black/Yellow) restored to the rich design.");
