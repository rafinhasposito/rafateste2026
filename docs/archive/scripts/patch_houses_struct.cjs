const fs = require('fs');
const file = 'src/data/houses.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('forWho?: string;')) {
  content = content.replace(
    'resumo?: string;',
    'resumo?: string;\n  forWho?: string;\n  benefits?: string[];\n  realLifeImpact?: string;\n  phasesOfYear?: string[];'
  );
  fs.writeFileSync(file, content);
  console.log("Interface updated in houses.ts");
} else {
  console.log("Interface already has forWho");
}
