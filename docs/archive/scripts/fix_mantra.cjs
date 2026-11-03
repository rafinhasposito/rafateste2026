const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

content = content.replace(
  'Eu comando a minha autonomia. O dinheiro flui até mim não por sorte, mas como consequência inevitável da minha excelência.',
  'Eu sei o valor do meu trabalho, cuido bem das minhas contas e faço meu dinheiro render.'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
