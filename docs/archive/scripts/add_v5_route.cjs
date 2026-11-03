const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('AppleResultPreviewV5')) {
  // Add import
  content = content.replace(
    'import AppleResultPreviewV4 from "@/pages/AppleResultPreviewV4";',
    'import AppleResultPreviewV4 from "@/pages/AppleResultPreviewV4";\nimport AppleResultPreviewV5 from "@/pages/AppleResultPreviewV5";'
  );
  // Add route
  content = content.replace(
    '<Route path="/v4-preview" element={<AppleResultPreviewV4 />} />',
    '<Route path="/v4-preview" element={<AppleResultPreviewV4 />} />\n        <Route path="/v5-preview" element={<AppleResultPreviewV5 />} />'
  );
  fs.writeFileSync(file, content);
  console.log("Added V5 route");
}
