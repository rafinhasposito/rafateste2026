const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove country from main title
content = content.replace(
  '<motion.h2\n          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}\n          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 origin-center uppercase text-center"\n        >\n          {dynamicCity}\n        </motion.h2>',
  '<motion.h2\n          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}\n          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 origin-center uppercase text-center"\n        >\n          {dynamicCity.split(",")[0]}\n        </motion.h2>'
);

// 2. Fix the DNA da Cidade Block
const oldCityBlock = `<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">{currentActiveData.city}</span>
                            </div>
                            
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                              {currentActiveData.cityDesc}
                            </p>`;
const newCityBlock = `<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">{dynamicCity.split(',')[0]}</span>
                            </div>
                            
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                              A frequência magnética de {dynamicCity.split(',')[0]} entra em ressonância exata com a área de <strong>{currentActiveData.label}</strong> do seu mapa. Este destino afasta as distrações e cria o ambiente biológico e energético perfeito para suportar os objetivos do seu novo ciclo.
                            </p>`;
content = content.replace(oldCityBlock, newCityBlock);

// 3. Remove country from the small boarding pass tag if it has it
content = content.replace(
  '<span className="truncate">{dynamicCity}</span>',
  '<span className="truncate">{dynamicCity.split(",")[0]}</span>'
);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Fixed city mismatch issues.");
