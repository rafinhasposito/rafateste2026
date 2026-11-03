const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Replace pillars
content = content.replace(/currentActiveData\.pillars/g, 'focusData.pillars');

// Replace timeline
content = content.replace(/currentActiveData\.timeline/g, 'focusData.phases');
content = content.replace(/phase\.phase/g, 'phase.title');
content = content.replace(/phase\.text/g, 'phase.description');
content = content.replace(/phase\.period/g, '""');

// Replace city & image & cityDesc
content = content.replace(/currentActiveData\.image/g, 'cityDatabase[P.house as keyof typeof cityDatabase]?.image || "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"');
content = content.replace(/currentActiveData\.city\}/g, 'cityDatabase[P.house as keyof typeof cityDatabase]?.nome}');
content = content.replace(/currentActiveData\.cityDesc/g, 'houseBaseData.understand');

// Replace mantra & secrets & rituals
content = content.replace(/currentActiveData\?\.mantra/g, 'focusData?.mantra');
content = content.replace(/currentActiveData\.mantra/g, 'focusData.mantra');

content = content.replace(/>Os Gestos que Ancoram \(Ritual 24h\)/g, '>Os Gestos que Ancoram (Ritual 24h)</span>\n                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">\n                                {focusData.ritual?.step1}\n                              </p>\n                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">\n                                {focusData.ritual?.step2}\n                              </p>\n                              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-6">\n                                {focusData.ritual?.step3}\n                              </p>\n                              {/*');
content = content.replace(/<span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData\?\.color \|\| '#10b981' }}>1\.<\/span>[\s\S]*?<span className="font-sans text-xl font-bold mt-1" style={{ color: currentActiveData\?\.color \|\| '#10b981' }}>3\.<\/span>[\s\S]*?<\/div>/, '');

// The secret and theme
content = content.replace(
  /<span className="font-sans text-xs md:text-sm tracking-\[0.2em\] uppercase block mb-4" style={{ color: currentActiveData\?\.color \|\| '#10b981' }}>O Tema do Seu Ano<\/span>\n[\s\S]*?<\/p>/,
  '<span className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase block mb-4" style={{ color: currentActiveData?.color || \'#10b981\' }}>O Tema do Seu Ano</span>\n                            <p className="text-white font-sans text-lg md:text-xl font-medium leading-relaxed mb-12">\n                              {focusData.theme}\n                            </p>'
);

content = content.replace(
  /<span className="font-sans text-xs md:text-sm tracking-\[0.2em\] uppercase block mb-4" style={{ color: currentActiveData\?\.color \|\| '#10b981' }}>O Segredo Deste Ano<\/span>\n[\s\S]*?<\/p>/,
  '<span className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase block mb-4" style={{ color: currentActiveData?.color || \'#10b981\' }}>O Segredo Deste Ano</span>\n                            <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-12">\n                              {focusData.secret}\n                            </p>'
);

// Ponto cego & Defesa
content = content.replace(
  /<span className="font-sans text-xs tracking-\[0.2em\] uppercase block mb-6" style={{ color: currentActiveData\?\.color \|\| '#10b981' }}>Risco de Autossabotagem<\/span>\n[\s\S]*?<\/p>/,
  '<span className="font-sans text-xs tracking-[0.2em] uppercase block mb-6" style={{ color: currentActiveData?.color || \'#10b981\' }}>O Ponto Cego</span>\n                          <p className="text-white/60 font-sans text-sm md:text-base leading-relaxed mb-8">\n                            {focusData.blindSpot}\n                          </p>'
);

content = content.replace(
  /<span className="font-sans text-[10px] tracking-\[0.2em\] uppercase font-bold text-white\/50">Protocolo de Defesa<\/span>\n[\s\S]*?<\/p>/,
  '<span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-white/50">Protocolo de Defesa</span>\n                            <p className="text-white/80 font-sans text-sm md:text-base leading-relaxed font-medium mt-2">\n                              "{focusData.defenseProtocol}"\n                            </p>'
);


fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("Updated variables");
