const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite Hero opening
const heroRegex = /<section ref=\{heroRef\}[^>]*>/;
content = content.replace(heroRegex, `<section ref={heroRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">`);

// 2. Rewrite Hero closing
const heroCloseRegex = /(<div className="absolute bottom-0 left-0 right-0 pb-16 flex flex-col items-center text-center px-6 z-10"><\/div>\s*)<\/section>/;
content = content.replace(heroCloseRegex, `$1</div></section>`);

// Se não achar essa exata (porque pode ter um comentário), vamos tentar um replace mais tolerante
if (!content.includes('</div></section>')) {
   const heroCloseAlt = /(<\/div>\s*<\/section>)/; // The old closing might just be </div></section> from my previous patch?
   // Actually let's just find the closing section of heroRef.
   // It is exactly before {/* 2. or {/* 3.
   const heroSectionClose = /<\/section>\n\n\s*\{\/\* ══════════════════════════════════════════════════\n\s*(?:2\.|3\.)/;
   content = content.replace(heroSectionClose, `</div>\n      </section>\n\n      {/* ══════════════════════════════════════════════════\n         3.`);
}

// 3. Rewrite Casa opening
const casaRegex = /<section ref=\{casaRef\}[^>]*>/;
content = content.replace(casaRegex, `<section ref={casaRef} className="relative -mt-[100vh] pt-[40vh] pb-20 md:pb-32 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1426]/90 to-[#0B1426] z-[-1]"></div>
        <div className="absolute inset-0 top-[60vh] bg-[#0B1426] z-[-1]"></div>`);

fs.writeFileSync(file, content);
console.log("Success!");
