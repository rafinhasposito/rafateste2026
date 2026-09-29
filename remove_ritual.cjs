const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const ritualStart = `                      {/* BLOCO 4: O RITUAL DE ATIVAÇÃO (AS PRIMEIRAS 24 HORAS) */}`;
const ritualEnd = `                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(ritualStart) && code.includes(ritualEnd)) {
    const startIndex = code.indexOf(ritualStart);
    const endIndex = code.indexOf(ritualEnd);
    
    code = code.substring(0, startIndex) + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Ritual block removed from production preview.");
} else {
    console.log("Could not find ritual block.");
}
