const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Replace "A Revelação" intro text
code = code.replace(/Isso significa que este será um ano em que pessoas, amizades, grupos, internet e novos contatos terão um papel muito maior na realização dos seus objetivos práticos\. O universo pede que você pare de caminhar sozinho\./,
  'Esta é a casa clássica da <strong>Prosperidade, do Valor Pessoal e da Estabilidade Material</strong>. Para o seu momento de vida (41 anos) com a força do seu Sol em Leão e a precisão do Ascendente em Virgem, este ciclo não se trata de trabalhar mais no esforço cego, mas sim de <span className="text-[#10b981] border-b border-[#10b981]/20 pb-1">sistematizar o seu talento para cobrar o valor justo e construir segurança sólida.</span>'
);
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log('Intro text fixed to Casa 2');
