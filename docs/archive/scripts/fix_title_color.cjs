const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTitle = `<motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] to-emerald-200 origin-center uppercase text-center"
        >
          {dynamicCity}
        </motion.h2>`;

const newTitle = `<motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur, backgroundImage: \`linear-gradient(to bottom, \${themeColor}, \${themeColor}80)\` }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text origin-center uppercase text-center"
        >
          {dynamicCity.split(',')[0]}
        </motion.h2>`;

content = content.replace(oldTitle, newTitle);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Fixed main title color and country name issue!");
