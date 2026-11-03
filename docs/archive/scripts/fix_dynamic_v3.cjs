const fs = require('fs');

// 1. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  /<Route path="\/v3-preview" element=\{<AppleResultPreviewV3 \/>\} \/>/g,
  '<Route path="/v3-preview" element={<AppleResultPreviewV3 />} />\n            <Route path="/v3-preview/:houseId" element={<AppleResultPreviewV3 />} />'
);
fs.writeFileSync('src/App.tsx', appContent);

// 2. Update AppleResultPreviewV3.tsx
let v3Content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Add useParams import if missing
if (!v3Content.includes('useParams')) {
  v3Content = v3Content.replace('import { useState', 'import { useParams } from "react-router-dom";\nimport { useState');
}

// Remove static house/city from P
v3Content = v3Content.replace(
  /city: "Tóquio", coords: "35\.68° N, 139\.69° E", origin: "Surubim",\n\s*house: 2, houseLabel: "Recursos", houseTitle: "Dinheiro, Materialização e Valor",/,
  'origin: "Surubim",\n  // house and city are now dynamic'
);

// We need to inject the useParams logic at the beginning of the component
const componentStartRegex = /export default function AppleResultPreviewV3\(\) \{\n/;
const dynamicLogic = `export default function AppleResultPreviewV3() {
  const { houseId } = useParams();
  const parsedId = houseId ? parseInt(houseId) : 2;
  const urlHouseIndex = (parsedId >= 1 && parsedId <= 12) ? parsedId : 2;

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

  const currentHouseMap = ROUTES_MOCK_DATA.find(r => r.house === urlHouseIndex) || ROUTES_MOCK_DATA[1];

  const P_DYNAMIC = {
    ...P,
    house: urlHouseIndex,
    city: currentHouseMap.city,
    coords: currentHouseMap.coords
  };
`;

v3Content = v3Content.replace(componentStartRegex, dynamicLogic);

// Now replace all P.something with P_DYNAMIC.something inside the component body
// But P is still defined outside. So we just need to replace `P.house` with `P_DYNAMIC.house` etc.
v3Content = v3Content.replace(/P\.house/g, 'P_DYNAMIC.house');
v3Content = v3Content.replace(/P\.city/g, 'P_DYNAMIC.city');
v3Content = v3Content.replace(/P\.coords/g, 'P_DYNAMIC.coords');
v3Content = v3Content.replace(/P\.sign/g, 'P_DYNAMIC.sign');
v3Content = v3Content.replace(/P\.ascendant/g, 'P_DYNAMIC.ascendant');
v3Content = v3Content.replace(/P\.phase/g, 'P_DYNAMIC.phase');
v3Content = v3Content.replace(/P\.firstName/g, 'P_DYNAMIC.firstName');
v3Content = v3Content.replace(/P\.name/g, 'P_DYNAMIC.name');
v3Content = v3Content.replace(/P\.origin/g, 'P_DYNAMIC.origin');
v3Content = v3Content.replace(/P\.time/g, 'P_DYNAMIC.time');
v3Content = v3Content.replace(/P\.hash/g, 'P_DYNAMIC.hash');

// Clean up any double declarations of ROUTES_MOCK_DATA
v3Content = v3Content.replace(
  /const ROUTES_MOCK_DATA = \[\s*\{ house: 1, city: "Nova York, EUA"[\s\S]*?\];/g,
  '' // Remove the duplicate we injected in fix_frankenstein.cjs since we moved it to the top of the component
);

// Ensure houseFixedImageUrl works with currentHouseMap
v3Content = v3Content.replace(
  /const houseFixedData = ROUTES_MOCK_DATA\.find\(r => r\.house === P_DYNAMIC\.house\) \|\| ROUTES_MOCK_DATA\[0\];/g,
  'const houseFixedData = currentHouseMap;'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', v3Content);
