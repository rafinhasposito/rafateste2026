const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Hide the Chevron on desktop
content = content.replace(
  '{isUnlocked\n                                  ? <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? \'rotate-180 text-emerald-400\' : \'text-white/30\'}`} />\n                                  : <ChevronRight className="w-5 h-5 text-white/20" />\n                                }',
  '{isUnlocked\n                                  ? <ChevronDown className={`md:hidden w-5 h-5 transition-transform duration-300 ${isOpen ? \'rotate-180 text-emerald-400\' : \'text-white/30\'}`} />\n                                  : <ChevronRight className="md:hidden w-5 h-5 text-white/20" />\n                                }'
);

// 2. Wrap the entire expanded div in md:hidden
content = content.replace(
  '<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>',
  '<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden">'
);

// 3. Inject the aura-loop.mp4 video into the right panel to match the Trailer
const bgSection = `{/* BACKGROUNDS PREMIUM DO TRAILER */}
                                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: \`radial-gradient(circle at top right, \${area.color} 0%, transparent 80%)\` }} />
                                <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: area.color }} />
                                <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: \`linear-gradient(to top, color-mix(in srgb, \${area.color} 12%, #000), color-mix(in srgb, \${area.color} 12%, rgba(0,0,0,0.8)) 50%, transparent)\` }} />`;

const newBgSection = `{/* BACKGROUNDS PREMIUM DO TRAILER */}
                                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: \`radial-gradient(circle at top right, \${area.color} 0%, transparent 80%)\` }} />
                                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" src="/videos/aura-loop.mp4" />
                                <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: area.color }} />
                                <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: \`linear-gradient(to top, color-mix(in srgb, \${area.color} 12%, #000), color-mix(in srgb, \${area.color} 12%, rgba(0,0,0,0.8)) 50%, transparent)\` }} />`;

content = content.replace(bgSection, newBgSection);

// 4. Ensure the right panel text matches the Trailer exactly (the font size and button styling)
// In the current code, the right panel title is: text-5xl md:text-7xl
// In the screenshot, the user is getting text-5xl but not text-7xl for some reason? Let's make sure it's huge.
// Also the text color isn't popping. The trailer had drop-shadow-xl.
// Let's add text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 to give it that premium trailer look.
content = content.replace(
  '<h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">',
  '<h3 className="font-ps-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6">'
);

fs.writeFileSync(file, content);
console.log("Desktop Accordion and Cinematic Video fixed!");
