const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const dnaReplacement = `  const baseDna = {
    essencia: \`Com o Sol em \${P.sign}, sua força e magnetismo natural são ativados por essa cidade. O universo entra em ressonância com a sua essência.\`,
    metodo: \`Seu Ascendente em \${P.ascendant} dita o método. O destino facilita a execução da sua visão de mundo com clareza.\`,
    fase: \`Nesta fase da sua vida (\${P.phase}), o objetivo astrológico principal ganha maturidade e a ambição cede espaço à sabedoria prática.\`
  };`;

content = content.replace(/const focusData = currentActiveData\?\.focusData \|\| \{\};/, `const focusData = currentActiveData?.focusData || {};\n${dnaReplacement}`);
content = content.replace(/currentActiveData\.dna\?\.essencia/g, 'baseDna.essencia');
content = content.replace(/currentActiveData\.dna\?\.metodo/g, 'baseDna.metodo');
content = content.replace(/currentActiveData\.dna\?\.fase/g, 'baseDna.fase');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("Updated DNA");
