const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert import if missing
if (!content.includes('AppleResultPreviewV3')) {
  content = content.replace(
    'import AppleResultPreview from "./pages/AppleResultPreview";',
    'import AppleResultPreview from "./pages/AppleResultPreview";\nimport AppleResultPreviewV3 from "./pages/AppleResultPreviewV3";'
  );
  
  content = content.replace(
    '<Route path="/v2-preview" element={<AppleResultPreview />} />',
    '<Route path="/v2-preview" element={<AppleResultPreview />} />\n            <Route path="/v3-preview" element={<AppleResultPreviewV3 />} />'
  );
}

fs.writeFileSync('src/App.tsx', content);
