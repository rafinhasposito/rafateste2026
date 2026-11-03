const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const heroVideoMap = `
  const getHeroVideo = (houseId: number) => {
    const vids: Record<number, string> = {
      1: "/assets/ny.mp4",
      2: "/assets/cities/tokyo.mp4",
      3: "/assets/cities/dubai.mp4",
      9: "/assets/cities/paris.mp4",
      10: "/assets/cities/roma.mov",
      11: "/assets/cities/london.mp4",
      12: "/assets/cities/bali.mp4"
    };
    return vids[houseId] || "/assets/particles.mp4";
  };
  const heroVideoSrc = getHeroVideo(P_DYNAMIC.house);
  const heroCountry = P_DYNAMIC.city.split(', ')[1] || "Destino";
`;

content = content.replace(
  'const heroRef = useRef<HTMLDivElement>(null);',
  heroVideoMap + '\n  const heroRef = useRef<HTMLDivElement>(null);'
);

content = content.replace(
  /<video autoPlay muted loop playsInline className="w-full h-full object-cover">\s*<source src="\/assets\/ny\.mp4" type="video\/mp4" \/>\s*<\/video>/,
  '<video autoPlay muted loop playsInline className="w-full h-full object-cover" key={heroVideoSrc}>\n            <source src={heroVideoSrc} type="video/mp4" />\n          </video>'
);

content = content.replace(
  /<span className="text-\[10px\] font-bold uppercase tracking-\[0\.3em\]">EUA<\/span>/,
  '<span className="text-[10px] font-bold uppercase tracking-[0.3em]">{heroCountry}</span>'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
