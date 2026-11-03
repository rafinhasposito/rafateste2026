const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// The P object:
// city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
content = content.replace(
  /city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",/,
  'city: "Tóquio", coords: "35.68° N, 139.69° E", origin: "Surubim",'
);

// Also check Block 7
// const cityForThisHouse = isCurrent ? P.city : (isUnlocked ? mockData.city : "Bloqueado");
// Should be houseFixedData.city instead of P.city to be absolutely safe, but if P.city is Tokyo it works.

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
