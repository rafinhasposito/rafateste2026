const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add DestinyResultsProps import
if (!code.includes('import { DestinyResultsProps }')) {
  code = code.replace(`import { DesktopWebChrome }`, `import { DestinyResultsProps } from "@/components/DestinyResults";\nimport { DesktopWebChrome }`);
}

// 2. Change signature
code = code.replace(
  `export default function AppleResultPreview() {`,
  `export default function AppleResultPreview(props: DestinyResultsProps) {`
);

// 3. Define houseNum, houseData, citiesObj, etc at the top of the component
const searchStart = `export default function AppleResultPreview(props: DestinyResultsProps) {\n`;
const variables = `
  // --- MOCK INJECTOR FOR /v2-preview ROUTE ---
  const isPreviewMode = Object.keys(props).length === 0;
  const houseNum = props.house || 2;
  const mockCitiesObj = {
    nacional: [{ city: "São Paulo, SP", country: "Brasil", score: 96 }],
    acessivel: [{ city: "Madrid", country: "Espanha", score: 98 }],
    highticket: [{ city: "Dubai", country: "Emirados Árabes", score: 97 }]
  };
  const citiesObj = isPreviewMode ? mockCitiesObj : (props.cities || {});
  const allResults = isPreviewMode ? { 
    2: { city: { display_name: "Madrid", country: "Espanha" } },
    10: { city: { display_name: "Nova York", country: "EUA" } } 
  } : (props.allResults || {});
  const houseData = props.houseData || {};
  // -------------------------------------------
`;

if (code.includes(searchStart) && !code.includes('const isPreviewMode')) {
  code = code.replace(searchStart, searchStart + variables);
}

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Props integration re-added.");
