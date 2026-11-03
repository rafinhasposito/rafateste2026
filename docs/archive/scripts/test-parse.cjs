const fs = require('fs');
const mdContent = fs.readFileSync('📁 revolucao-solar - mds notebooklm/📁 banco-de-dados/08-introducoes-casas trailler.md', 'utf8');
const houses = mdContent.split(/##\s+CASA/).slice(1);
const houseRaw = houses[0];
const personaMatch = houseRaw.match(/####\s*📌\s*Para\s*Quem\s*É\s*A\s*Casa.*?([\s\S]*?)(?:\-\-\-|$)/);
console.log("Persona Section:", personaMatch ? personaMatch[1] : "NOT FOUND");
