const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('AppleResultPreviewV3')) {
  // Adiciona o import
  code = code.replace(
    /import AppleResultPreview from '.\/pages\/AppleResultPreview';/,
    "import AppleResultPreview from './pages/AppleResultPreview';\nimport AppleResultPreviewV3 from './pages/AppleResultPreviewV3';"
  );
  
  // Adiciona a rota
  code = code.replace(
    /<Route path="\/v2-preview" element=\{<AppleResultPreview \/>\} \/>/,
    "<Route path=\"/v2-preview\" element={<AppleResultPreview />} />\n        <Route path=\"/v3-preview\" element={<AppleResultPreviewV3 />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Rota V3 adicionada.");
}
