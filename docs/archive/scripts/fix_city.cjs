const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Global City constants
const GLOBAL_CITY_NAME = "Nova York, EUA";
const GLOBAL_CITY_IMAGE = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop";

// 1. Replace currentActiveData.city and currentActiveData.image with global constants in Block 4
code = code.replace(/<img src=\{currentActiveData\.image\} alt=\{currentActiveData\.city\}/g, `<img src="${GLOBAL_CITY_IMAGE}" alt="${GLOBAL_CITY_NAME}"`);
code = code.replace(/<span className="font-mono text-sm md:text-base tracking-widest uppercase text-white font-semibold">\{currentActiveData\.city\}<\/span>/g, `<span className="font-mono text-sm md:text-base tracking-widest uppercase text-white font-semibold">${GLOBAL_CITY_NAME}</span>`);

// Let's also fix the text logic for cityDesc. The user said "Essa parte fala da cidade escolhida". If it's a fixed city, the description shouldn't change wildly like "Berço da estética" to "Hub global de inovação". I will hardcode a nice New York description.
const GLOBAL_CITY_DESC = "A energia inesgotável desta ilha não aceita mediocridade, forçando você a assumir a autoridade da sua própria vida e colocar suas ideias nos maiores palcos disponíveis. Um epicentro de vibração alta que acelera manifestações materiais.";

code = code.replace(/\{currentActiveData\.cityDesc\}/g, GLOBAL_CITY_DESC);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Fixed the global city issue in Block 4.");
