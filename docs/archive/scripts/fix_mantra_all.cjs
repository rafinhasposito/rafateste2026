const fs = require('fs');

const files = [
  'src/pages/HouseResult.tsx',
  'src/pages/AppleResultPreview.tsx',
  'src/pages/AppleResultPreviewV4.tsx',
  'src/pages/AppleResultPreviewV5.tsx',
  'src/pages/TheRealFlowSandbox.tsx',
  'src/pages/MantraSandbox.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(
      /Eu comando a minha autonomia\. O dinheiro flui até mim não por sorte, mas como consequência inevitável da minha excelência\./g,
      'Eu sei o valor do meu trabalho, cuido bem das minhas contas e faço meu dinheiro render.'
    );
    fs.writeFileSync(file, content);
  }
});
