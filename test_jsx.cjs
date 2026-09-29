const babel = require('@babel/core');
const fs = require('fs');
try {
  babel.transformSync(fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8'), {
    presets: ['@babel/preset-react']
  });
  console.log("SUCCESS");
} catch (e) {
  console.error(e.message);
}
