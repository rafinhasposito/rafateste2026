const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldPhrase = 'O algoritmo escolheu a Casa {P.house} milimetricamente porque ela é a grande chave para destravar esse objetivo específico no seu próximo ano.';
const newPhrase = 'A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.';

if (content.includes(oldPhrase)) {
  content = content.replace(oldPhrase, newPhrase);
  fs.writeFileSync(file, content);
  console.log("Phrase updated successfully!");
} else {
  console.log("Could not find the phrase in the file!");
}
