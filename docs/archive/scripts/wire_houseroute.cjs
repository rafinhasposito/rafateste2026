const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('import HouseResult')) {
  app = app.replace(
    'import AppleResultPreviewV5 from "./pages/AppleResultPreviewV5";',
    'import AppleResultPreviewV5 from "./pages/AppleResultPreviewV5";\nimport HouseResult from "./pages/HouseResult";'
  );
}

if (!app.includes('<Route path="/resultado/:houseId"')) {
  app = app.replace(
    '<Route path="/v5-preview" element={<AppleResultPreviewV5 />} />',
    '<Route path="/v5-preview" element={<AppleResultPreviewV5 />} />\n        <Route path="/resultado/:houseId" element={<HouseResult />} />'
  );
}

fs.writeFileSync('src/App.tsx', app);
console.log("Wired up HouseResult route in App.tsx!");
