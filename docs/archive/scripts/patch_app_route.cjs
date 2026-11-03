const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import AppleResultPrototype')) {
  // Add import
  content = content.replace('import Index from "./pages/Index";', 'import Index from "./pages/Index";\nimport AppleResultPrototype from "./pages/AppleResultPrototype";');
  
  // Add Route
  const routeString = '<Route path="/v2-apple" element={<AppleResultPrototype />} />';
  content = content.replace('<Route path="*" element={<NotFound />} />', `${routeString}\n            <Route path="*" element={<NotFound />} />`);
  
  fs.writeFileSync(file, content);
  console.log("Patched App.tsx with /v2-apple route.");
} else {
  console.log("Route already exists.");
}
