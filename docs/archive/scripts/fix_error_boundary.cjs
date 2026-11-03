const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV5.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<pre>{this.state.info.componentStack}</pre>',
  '<pre>{this.state.info ? this.state.info.componentStack : "Loading stack..."}</pre>'
);

fs.writeFileSync(file, content);
console.log("Fixed Error Boundary crash");
