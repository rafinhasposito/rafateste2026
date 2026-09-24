const fs = require('fs');
const file = 'src/pages/Technology.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the entire motion.div block and replace it
const startIdx = content.indexOf('<motion.div');
const endIdx = content.indexOf('</motion.div>') + '</motion.div>'.length;

if (startIdx !== -1 && endIdx !== -1) {
    const fixedBg = `{/* BACKGROUND EFFECTS (StarryBackground is inherited from ConsumerShell) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>`;
      
    content = content.substring(0, startIdx) + fixedBg + content.substring(endIdx);
    fs.writeFileSync(file, content);
    console.log("Crash fixed. motion.div and yBackground removed.");
} else {
    console.log("Could not find motion.div");
}
