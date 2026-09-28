const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldPhrase = `O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca{" "}
             <span className="text-[#3b82f6] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>`;

const newPhrase = `O destino exato para ativar a Casa que{" "}
             <span className="text-[#3b82f6] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>`;

content = content.replace(oldPhrase, newPhrase);

fs.writeFileSync(file, content);
console.log("Fixed phrase!");
