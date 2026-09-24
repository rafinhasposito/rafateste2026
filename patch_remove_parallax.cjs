const fs = require('fs');
const file = 'src/pages/Technology.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove StarryBackground import
content = content.replace(`import StarryBackground from '@/components/StarryBackground';\n`, '');
content = content.replace(`import StarryBackground from '@/components/StarryBackground';`, '');

// Remove useScroll and useTransform if they are not used elsewhere
// They are not used anywhere else in Technology.tsx
content = content.replace(/, useScroll, useTransform /g, ' ');
const parallaxHook = `  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);`;
content = content.replace(parallaxHook, '');

// Replace the buggy motion.div background with a static noise overlay
const buggyBg = `{/* BACKGROUND EFFECTS: Mesh Gradients & Noise */}
      <motion.div 
        style={{ y: yBackground }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <StarryBackground />
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </motion.div>`;

const fixedBg = `{/* BACKGROUND EFFECTS (StarryBackground is inherited from ConsumerShell) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>`;

content = content.replace(buggyBg, fixedBg);

// Make sure the main wrapper doesn't force a weird background color that clashes with ConsumerShell
// ConsumerShell provides the dark background. 
content = content.replace(
  `className="w-full min-h-screen bg-[#030305] text-white overflow-hidden relative selection:bg-primary/30"`,
  `className="w-full min-h-screen text-white overflow-hidden relative selection:bg-primary/30"`
);

fs.writeFileSync(file, content);
console.log("Parallax background removed. Inheriting StarryBackground from Shell.");
