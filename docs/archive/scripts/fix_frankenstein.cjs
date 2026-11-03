const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Define ROUTES_MOCK_DATA inside the component or use it if it's there
const mockDataInject = `
  const ROUTES_MOCK_DATA = [
    { house: 1, city: "Nova York, EUA", img: "1496442226666-8d4d0e62e6e9" },
    { house: 2, city: "Tóquio, Japão", img: "1498036882173-b41c28a8ba34" },
    { house: 3, city: "Dubai, EAU", img: "1459787915554-b34915863013" },
    { house: 4, city: "Buenos Aires, ARG", img: "1495317823589-e67efe1524b0" },
    { house: 5, city: "Santiago, Chile", img: "1689850543263-01a52ccc6943" },
    { house: 6, city: "Florianópolis, BRA", img: "1565574337618-b08146e94992" },
    { house: 7, city: "São Paulo, SP", img: "1470160710819-b3bd5ec85c66" },
    { house: 8, city: "Los Angeles, EUA", img: "1444723121867-7a241cacace9" },
    { house: 9, city: "Paris, França", img: "1431274172761-fca41d930114" },
    { house: 10, city: "Roma, Itália", img: "1491566102020-21838225c3c8" },
    { house: 11, city: "Londres, UK", img: "1448906654166-444d494666b3" },
    { house: 12, city: "Bali, Indonésia", img: "1501179691627-eeaa65ea017c" }
  ];
  const houseFixedData = ROUTES_MOCK_DATA.find(r => r.house === P.house) || ROUTES_MOCK_DATA[0];
  const houseFixedImageUrl = \`https://images.unsplash.com/photo-\${houseFixedData.img}?auto=format&fit=crop&w=2000&q=80\`;
`;

// Insert it right after the state declarations
content = content.replace(
  /const houseBaseData = \(BASE_HOUSE_PROFILES as any\)\[baseHouseId\];/,
  `const houseBaseData = (BASE_HOUSE_PROFILES as any)[baseHouseId];\n${mockDataInject}`
);

// Fix Frankenstein renders
content = content.replace(
  /<img src=\{cityDatabase\[P\.house as keyof typeof cityDatabase\]\?\.image \|\| currentActiveData\.image\} alt=\{cityDatabase\[P\.house as keyof typeof cityDatabase\]\?\.nome \|\| currentActiveData\.city\} className="w-full h-full object-cover opacity-90 transition-all duration-1000" \/>/g,
  '<img src={houseFixedImageUrl} alt={houseFixedData.city} className="w-full h-full object-cover opacity-90 transition-all duration-1000" />'
);

content = content.replace(
  /<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">\{cityDatabase\[P\.house as keyof typeof cityDatabase\]\?\.nome \|\| currentActiveData\.city\}<\/span>/g,
  '<span className="font-sans text-sm tracking-widest uppercase text-white font-semibold">{houseFixedData.city}</span>'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
