const fs = require('fs');

// 1. Restore the exact layout from the image (AppleResultPrototype.tsx)
fs.copyFileSync('src/pages/AppleResultPrototype.tsx', 'src/pages/AppleResultPreview.tsx');

let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 2. Rename the component
code = code.replace(/export default function AppleResultPrototype/g, 'export default function AppleResultPreview');

// 3. Apply the ONLY correction asked: Fix the generic text in the green card
const genericText = "Esta é a Casa da materialização. O aumento de receita não vem de sorte, mas da estruturação sólida do seu valor próprio. Oportunidades financeiras de alto nível se alinham perfeitamente com o seu magnetismo na cidade destino.";
const personalizedText = "O Brilho do Sol em Leão: Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na Casa 2, seu magnetismo passa a se traduzir em valor monetário real. O Rigor do Ascendente em Virgem: Traz a mente analítica, o foco na eficiência e a disciplina diária, forçando você a olhar para planilhas e processos. A Maturidade (41 Anos): O objetivo financeiro não é a ostentação superficial, mas a construção de um porto seguro e previsibilidade de caixa.";

if (code.includes(genericText)) {
    code = code.replace(genericText, personalizedText);
    console.log("Replaced generic text with personalized DNA text.");
} else {
    console.log("WARNING: Could not find the generic text to replace.");
}

// 4. Save the file
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Restored the exact UI from the image successfully.");
