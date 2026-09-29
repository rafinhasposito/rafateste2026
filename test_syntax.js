const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const parser = acorn.Parser.extend(jsx());
try {
  let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');
  // Strip TypeScript types so acorn can parse it (very rough approach)
  // Let's just rely on vite's build to check for syntax errors
} catch (e) {
  console.log(e);
}
