const fs = require('fs');
const file = 'src/pages/Technology.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. IMPORT STARRY BACKGROUND
if (!content.includes("import StarryBackground")) {
  content = content.replace(
    "import { Accordion",
    "import StarryBackground from '@/components/StarryBackground';\nimport { Accordion"
  );
}

// 2. INJECT STARRY BACKGROUND
if (!content.includes("<StarryBackground />")) {
  const bgSection = `{/* BACKGROUND EFFECTS: Mesh Gradients & Noise */}
      <motion.div 
        style={{ y: yBackground }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <StarryBackground />`;
        
  content = content.replace(
    `{/* BACKGROUND EFFECTS: Mesh Gradients & Noise */}
      <motion.div 
        style={{ y: yBackground }}
        className="fixed inset-0 z-0 pointer-events-none"
      >`,
    bgSection
  );
}

// 3. TRANSFORM THE MAIN BENTO BOX INTO GOLD
const oldBento = `className="md:col-span-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] relative overflow-hidden"`;
const newBento = `className="md:col-span-2 bg-gradient-to-br from-[#1C160B] to-[#0A0804] border border-primary/30 backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] relative overflow-hidden shadow-[inset_0_0_100px_rgba(201,162,39,0.05),0_20px_50px_rgba(0,0,0,0.5)]"`;

content = content.replace(oldBento, newBento);

// Update inner parts of the Gold Bento Box
const oldPill = `bg-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/80 mb-6 border border-white/5`;
const newPill = `bg-primary/20 rounded-full text-[10px] uppercase tracking-widest text-primary font-bold mb-6 border border-primary/30 shadow-[0_0_15px_rgba(201,162,39,0.3)]`;
content = content.replace(oldPill, newPill);

const oldText = `text-4xl md:text-5xl font-ps-display text-white mb-6`;
const newText = `text-4xl md:text-5xl font-ps-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-white mb-6 drop-shadow-md`;
content = content.replace(oldText, newText);

const oldShield = `className="absolute -right-20 -bottom-20 opacity-20"`;
const newShield = `className="absolute -right-20 -bottom-20 opacity-10"`;
content = content.replace(oldShield, newShield);
const oldShieldIcon = `className="w-80 h-80 text-white"`;
const newShieldIcon = `className="w-80 h-80 text-primary"`;
content = content.replace(oldShieldIcon, newShieldIcon);

fs.writeFileSync(file, content);
console.log("Applied Starry Background and Gold Bento Box.");
