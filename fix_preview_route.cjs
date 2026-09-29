const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const search = `  const houseNum = props.house || 2;`;
const replace = `  // --- MOCK INJECTOR FOR /v2-preview ROUTE ---
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
  // -------------------------------------------
`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    code = code.replace(`const citiesObj = props.cities || {};`, ``);
    code = code.replace(`const allResults = props.allResults || {};`, ``);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Mock fallback for /v2-preview route injected.");
} else {
    console.log("Could not find the injection point.");
}
