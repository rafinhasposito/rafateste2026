const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// The current setup is:
// <section ref={heroRef} className="relative h-[200vh]">
//    <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
//       ... video ...
//       {/* Hero limpo, o texto desceu para a seção 3 */}
//       <div className="..."></div>
//    </div>
// </section>
//
// <section ref={casaRef} className="relative -mt-[100vh] pt-[40vh] pb-20 md:pb-32 z-10">

// We will change it so the sticky logic works flawlessly without negative margins.
// First, we'll undo the casaRef negative margin.
content = content.replace(
  '<section ref={casaRef} className="relative -mt-[100vh] pt-[40vh] pb-20 md:pb-32 z-10">',
  '<section ref={casaRef} className="relative pt-16 pb-20 md:pb-32 z-10 bg-[#0B1426]">'
);
content = content.replace(
  '        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1426]/90 to-[#0B1426] z-[-1]"></div>\n        <div className="absolute inset-0 top-[60vh] bg-[#0B1426] z-[-1]"></div>',
  ''
);

// Now, we will pull the "NOVA IORQUE" zoom text OUT of casaRef and put it INSIDE heroRef.
// Wait, the zooming text is currently inside casaRef.
const zoomTextRegex = /<div className="text-center mb-16 flex flex-col items-center mt-32">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/; 
// Let's just find the whole zooming text block and extract it.
// Actually, it's easier to just match the motion.h2 part.
// Instead of complex regex, let's reset to a clean state.
