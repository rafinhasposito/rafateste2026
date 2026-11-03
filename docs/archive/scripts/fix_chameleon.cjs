const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Remove the hardcoded green gradient from the main wrapper and add a smooth transition
const mainWrapperTarget = '<div className="min-h-screen bg-[#02160F] text-[#f5f5f7] overflow-x-hidden font-sans bg-gradient-to-b from-[#02160F] via-[#042A1D] to-[#02160F]">';
const mainWrapperReplace = '<div className="min-h-screen text-[#f5f5f7] overflow-x-hidden font-sans transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || \'#10b981\'} 6%, #03100B)` }}>';
if (code.includes(mainWrapperTarget)) {
    code = code.replace(mainWrapperTarget, mainWrapperReplace);
}

// 2. The Hero video overlay also has hardcoded green:
// <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#02160F] z-10" />
// <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#02160F] to-transparent pointer-events-none z-10" />
const heroGrad1 = '<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#02160F] z-10" />';
const heroGrad1Replace = '<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#03100B] z-10" />';
if (code.includes(heroGrad1)) {
    code = code.replace(heroGrad1, heroGrad1Replace);
}

const heroGrad2 = '<div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#02160F] to-transparent pointer-events-none z-10" />';
const heroGrad2Replace = '<div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#03100B] to-transparent pointer-events-none z-10" />';
if (code.includes(heroGrad2)) {
    code = code.replace(heroGrad2, heroGrad2Replace);
}

// 3. Make the 3 Pillars background adapt too!
// currently: bg-[#02160F]/80
const pillarBg = /bg-\[\#02160F\]\/80/g;
code = code.replace(pillarBg, 'bg-black/40');

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Chameleon background applied.");
