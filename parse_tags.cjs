const fs = require('fs');
const content = fs.readFileSync('src/pages/AppleResultPrototype.tsx', 'utf8');

let index = 0;
const stack = [];
const regex = /<\/?([a-zA-Z0-9_.]+)[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const tagStr = match[0];
  const tagName = match[1];
  
  if (tagStr.endsWith('/>')) {
    continue; // Self-closing
  }
  
  // Ignora tags dentro de strings ou comentários rudimentarmente (não perfeito mas ajuda)
  
  if (tagStr.startsWith('</')) {
    const last = stack.pop();
    if (last !== tagName) {
      console.log('Mismatched tag at index ' + match.index + ': expected ' + last + ' but got ' + tagName + '. Tag string: ' + tagStr);
      process.exit(1);
    }
  } else {
    stack.push(tagName);
  }
}
if (stack.length > 0) {
  console.log('Unclosed tags remaining:', stack);
} else {
  console.log('All tags perfectly balanced.');
}
