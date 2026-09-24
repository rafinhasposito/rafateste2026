const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace hardcoded #C9A227 with Tailwind primary variable
content = content.replace(/#C9A227/g, 'hsl(var(--primary))');

// Soften text colors
content = content.replace(/text-white\/40/g, 'text-muted-foreground/60');
content = content.replace(/text-white\/50/g, 'text-muted-foreground/80');
content = content.replace(/text-white\/60/g, 'text-muted-foreground');
content = content.replace(/text-white\/90/g, 'text-foreground/90');
content = content.replace(/text-white/g, 'text-foreground/90');

// Replace dark black backgrounds with airy glassmorphism
content = content.replace(/bg-black\/40/g, 'bg-background/40 backdrop-blur-xl border-primary/10 shadow-lg');
content = content.replace(/bg-\[\#030306\]\/60/g, 'bg-background/40 backdrop-blur-sm');
content = content.replace(/bg-\[\#030306\]\/80/g, 'bg-background/60 backdrop-blur-md');
content = content.replace(/bg-\[\#030306\]/g, 'bg-background/80 backdrop-blur-md');

// Improve section borders and spacing
content = content.replace(/border-white\/10/g, 'border-primary/10');
content = content.replace(/border-white\/20/g, 'border-primary/20');
content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-primary/[0.02]');
content = content.replace(/hover:bg-white\/\[0\.05\]/g, 'hover:bg-primary/[0.05]');

fs.writeFileSync(file, content);
console.log("CSS Premium Applied");
