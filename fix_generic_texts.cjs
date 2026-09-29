const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Fix LIFE_AREAS generic texts
code = code.replace(/Esta é a Casa da materialização\. O aumento de receita não vem de sorte, mas da estruturação sólida do seu valor próprio\. Oportunidades financeiras de alto nível se alinham perfeitamente com o seu magnetismo na cidade destino\./g, 
  'Seu Sol em Leão exige reconhecimento, mas com o filtro de Virgem na Revolução Solar, a ordem é perder a timidez de cobrar caro e renegociar contratos pelo seu verdadeiro valor de mercado. Como leonino, seu valor pessoal está diretamente ligado à sua autonomia e ao orgulho do que você constrói. Você sente a necessidade e o direito de ser bem remunerado pela sua autoridade.'
);

code = code.replace(/O dinheiro flui através da sua capacidade de atrair e materializar recursos\./g,
  'Seu magnetismo deixa de ser apenas imagem e passa a se traduzir em valor monetário real.'
);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log('Generic texts fixed');
