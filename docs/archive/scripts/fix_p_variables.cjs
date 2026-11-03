const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Move P into the component
const pStart = `const P = {`;
const pEnd = `};`;

const pBlock = code.substring(code.indexOf(pStart), code.indexOf(pEnd) + 2);

code = code.replace(pBlock, '');

const injectP = `
  const P = {
    name: "Rafael Sposito", 
    firstName: "Rafael", 
    year: new Date().getFullYear() + 1, 
    date: "09/08/" + (new Date().getFullYear() + 1), 
    time: "05:30 (UTC)",
    city: houseData?.city?.display_name || "Nova Iorque", 
    coords: "40.71° N, 74.01° W", 
    origin: "Surubim",
    house: houseNum, 
    houseLabel: houseData?.name?.split('—')[1]?.trim() || "Recursos", 
    houseTitle: houseData?.tag || "Dinheiro e Valor",
    houseTag: houseData?.intent || "Prosperidade",
    match: 98, 
    cost: 1, 
    vector: "FUTURO", 
    hash: "#CC59F4F6",
    sign: "Leão", 
    ascendant: "Virgem", 
    phase: "Adulto", 
    intention: houseData?.tag?.split(',')[0] || "Dinheiro",
  };
`;

code = code.replace(`// --- MOCK INJECTOR FOR /v2-preview ROUTE ---`, `// --- MOCK INJECTOR FOR /v2-preview ROUTE ---\n` + injectP);

// 2. Remove the console.log from the script to avoid clutter, run it and save
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Moved P inside component to make it reactive to houseData!");
