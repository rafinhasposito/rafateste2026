const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const arrayDef = `
  const ROUTES_MOCK_DATA = [
    { house: 1, city: "Nova York, EUA", coords: "40.71° N, 74.01° W", img: "1496442226666-8d4d0e62e6e9" },
    { house: 2, city: "Tóquio, Japão", coords: "35.68° N, 139.69° E", img: "1498036882173-b41c28a8ba34" },
    { house: 3, city: "Dubai, EAU", coords: "25.20° N, 55.27° E", img: "1459787915554-b34915863013" },
    { house: 4, city: "Buenos Aires, ARG", coords: "34.60° S, 58.38° W", img: "1495317823589-e67efe1524b0" },
    { house: 5, city: "Santiago, Chile", coords: "33.45° S, 70.67° W", img: "1689850543263-01a52ccc6943" },
    { house: 6, city: "Florianópolis, BRA", coords: "27.59° S, 48.55° W", img: "1565574337618-b08146e94992" },
    { house: 7, city: "São Paulo, SP", coords: "23.55° S, 46.63° W", img: "1470160710819-b3bd5ec85c66" },
    { house: 8, city: "Los Angeles, EUA", coords: "34.05° N, 118.24° W", img: "1444723121867-7a241cacace9" },
    { house: 9, city: "Paris, França", coords: "48.85° N, 2.35° E", img: "1431274172761-fca41d930114" },
    { house: 10, city: "Roma, Itália", coords: "41.90° N, 12.49° E", img: "1491566102020-21838225c3c8" },
    { house: 11, city: "Londres, UK", coords: "51.50° N, 0.12° W", img: "1448906654166-444d494666b3" },
    { house: 12, city: "Bali, Indonésia", coords: "8.40° S, 115.18° E", img: "1501179691627-eeaa65ea017c" }
  ];
`;

content = content.replace(
  /const currentHouseMap = ROUTES_MOCK_DATA\.find/g,
  arrayDef + '\n  const currentHouseMap = ROUTES_MOCK_DATA.find'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
