const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Move the text down slightly and reduce bottom padding
content = content.replace(
  '<section ref={casaRef} className="relative z-20 -mt-[25vh] pb-24 md:pb-32 flex flex-col items-center px-6">',
  '<section ref={casaRef} className="relative z-20 -mt-[15vh] pb-12 flex flex-col items-center px-6">'
);

// 2. Reduce the top padding of the next section to close the gap
content = content.replace(
  '<section className="relative pt-16 pb-20 md:pb-32">',
  '<section className="relative pt-8 pb-20 md:pb-32">'
);

fs.writeFileSync(file, content);
console.log("Spacing fixed!");
