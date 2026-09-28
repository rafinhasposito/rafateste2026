const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Sol em Leão
content = content.replace(
  'Você não entra em uma comunidade como um mero membro. Você entra como o farol reluzente que atrai e lidera multidões.',
  'Você não persegue a prosperidade através do esforço brutal ou da competição cega. O seu próprio magnetismo atrai naturalmente recursos, clientes e oportunidades exclusivas.'
);
content = content.replace(
  '"A minha visão inspira comunidades e os meus aliados multiplicam os meus resultados."',
  '"A minha visão criativa gera valor real e o mundo material recompensa o meu brilho."'
);

// 2. Ascendente Virgem
content = content.replace(
  'A escala viral exige processos impecáveis. O seu crescimento em redes não virá do caos, mas da extrema organização.',
  'A segurança financeira duradoura exige gestão impecável. A sua prosperidade material este ano não virá de sorte impulsiva, mas da extrema organização.'
);
content = content.replace(
  'Evite focar excessivamente nos aplausos da audiência e esquecer de valorizar quem trabalha nos bastidores.',
  'Evite focar obsessivamente em economizar micro-gastos ao invés de estruturar novas fontes de lucro e receita.'
);

// 3. As Sombras
content = content.replace(
  '<h4 className="text-red-300 font-bold mb-2">Amizades Interesseiras</h4>',
  '<h4 className="text-red-300 font-bold mb-2">Mentalidade de Escassez</h4>'
);
content = content.replace(
  'Falsas promessas de apoio sem compromisso real. Confiar rápido demais pode custar caro.',
  'O medo irreal de perder o que conquistou. Reter recursos por insegurança apenas interrompe o fluxo de abundância do universo.'
);
content = content.replace(
  '<h4 className="text-red-300 font-bold mb-2">Perda de Foco</h4>',
  '<h4 className="text-red-300 font-bold mb-2">Gastos por Compensação</h4>'
);
content = content.replace(
  'Abraçar muitas atividades de grupo ao mesmo tempo e acabar sem foco nas obrigações diárias.',
  'Utilizar compras impulsivas e objetos de luxo para preencher vazios emocionais, sabotando o seu teto patrimonial do ano.'
);

// 4. O Ritual das 24h
content = content.replace(
  'Não passe o dia do seu aniversário sozinho. Jante com amigos, mande mensagens para pessoas importantes da sua rede de contatos ou visite um local dinâmico e movimentado em',
  'Faça uma transação financeira simbólica e luxuosa. Compre algo de extremo bom gosto que represente sua prosperidade em'
);
content = content.replace(
  'Escreva suas 3 maiores metas de futuro em um papel.',
  'Escreva as suas 3 metas exatas de patrimônio e faturamento em um papel.'
);
content = content.replace(
  'Crie uma planilha de contatos organizada por categorias de networking.',
  'Estruture a planilha matriz dos seus rendimentos, investimentos e divisão de lucros.'
);

fs.writeFileSync(file, content);
console.log("Success!");
