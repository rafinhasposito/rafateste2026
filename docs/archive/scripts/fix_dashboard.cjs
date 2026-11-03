const fs = require('fs');
const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the Header block
const headerStart = "{/* Header — Consultation Summary Card (mirrors History) */}\n        {(() => {";
const newHeaderStart = "{/* Header — Consultation Summary Card (mirrors History) */}\n        {!selectedHouse && (() => {";
content = content.replace(headerStart, newHeaderStart);

// Find the start of the Oracle block
const oracleStart = "{/* Oracle Text */}\n        {oracleText && (";
const newOracleStart = "{/* Oracle Text */}\n        {!selectedHouse && oracleText && (";
content = content.replace(oracleStart, newOracleStart);

fs.writeFileSync(file, content);
console.log("Dashboard.tsx patched successfully.");
