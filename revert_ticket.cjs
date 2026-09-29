const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const ritualStart = `                      {/* BLOCO 4: O RITUAL (TICKET TÁTIL APPLE WALLET) */}`;
const ritualEnd = `                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

if (code.includes(ritualStart) && code.includes(ritualEnd)) {
    const startIndex = code.indexOf(ritualStart);
    const endIndex = code.indexOf(ritualEnd);
    
    code = code.substring(0, startIndex) + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Ticket block completely removed from V2 preview.");
} else {
    console.log("Could not find ticket block.");
}
