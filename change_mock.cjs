const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldMock = `const P = {
  name: "Rafael Sposito", firstName: "Rafael", year: 2027, date: "09/08/2027", time: "05:30 (UTC)",
  city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
  house: 11, houseLabel: "Grupos", houseTitle: "Amigos, Parcerias e Ganhos Digitais",
  houseTag: "Networking, Comunidades & Escala Viral",
  match: 98, cost: 1, vector: "FUTURO", hash: "#CC59F4F6",
  sign: "Leão", ascendant: "Virgem", phase: "Adulto", intention: "Amor",
};`;

const newMock = `const P = {
  name: "Rafael Sposito", firstName: "Rafael", year: 2027, date: "09/08/2027", time: "05:30 (UTC)",
  city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
  house: 2, houseLabel: "Recursos", houseTitle: "Dinheiro, Materialização e Valor",
  houseTag: "Prosperidade Financeira & Segurança",
  match: 98, cost: 1, vector: "FUTURO", hash: "#CC59F4F6",
  sign: "Leão", ascendant: "Virgem", phase: "Adulto", intention: "Dinheiro",
};`;

content = content.replace(oldMock, newMock);
fs.writeFileSync(file, content);
console.log("Mock updated!");
