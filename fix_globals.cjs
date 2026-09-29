const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const GLOBAL_CITY_NAME = "Nova York, EUA";
const GLOBAL_CITY_IMAGE = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop";
const GLOBAL_CITY_DESC = "A energia inesgotável desta ilha não aceita mediocridade, forçando você a assumir a autoridade da sua própria vida e colocar suas ideias nos maiores palcos disponíveis. Um epicentro de vibração alta que acelera manifestações materiais.";

code = code.replace(/GLOBAL_CITY_IMAGE/g, `"${GLOBAL_CITY_IMAGE}"`);
code = code.replace(/GLOBAL_CITY_NAME/g, `"${GLOBAL_CITY_NAME}"`);
code = code.replace(/GLOBAL_CITY_DESC/g, `"${GLOBAL_CITY_DESC}"`);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Fixed undefined globals.");
