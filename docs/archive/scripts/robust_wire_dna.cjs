const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// Ensure DNA_MATRIX is imported
if (!content.includes('import { DNA_MATRIX }')) {
  content = content.replace(
    "import { FOCUS_MATRIX } from '@/data/focusMatrix';",
    "import { FOCUS_MATRIX } from '@/data/focusMatrix';\nimport { DNA_MATRIX } from '@/data/dnaMatrix';"
  );
}

// Replace the return object of mergedAreas
const mapString = `
    if (!focusData) return area;
    
    return {
      ...area,
      score: focusData.match || area.score,
      teaser: focusData.headline || area.teaser,
      full: focusData.headline || area.teaser,
      mantra: focusData.mantra || area.mantra,
      themeData: focusData.theme,
      secretData: focusData.secret,
      blindSpotData: focusData.blindSpot,
      defenseProtocolData: focusData.defenseProtocol,
      dnaData: DNA_MATRIX[P_DYNAMIC.house]?.[area.id] || area.dna,
      pillars: focusData.pillars?.map((p: any, i: number) => ({
        icon: area.pillars?.[i]?.icon || area.pillars?.[0]?.icon || Target,
        title: p.title,
        text: p.description
      })) || area.pillars,
      timeline: focusData.phases?.map((p: any, i: number) => ({
        phase: p.title,
        period: \`Mês \${i * 4 + 1} a \${(i + 1) * 4}\`,
        text: p.description
      })) || area.timeline,
      ritualData: focusData.ritual || area.ritualData
    };
`;

// we need to replace the old return object.
// let's just use regex to replace everything from "if (!focusData) return area;" to the end of the map function.
content = content.replace(
  /if \(\!focusData\) return area;[\s\S]*?ritualData: focusData\.ritual \|\| area\.ritualData\n\s*\};\n\s*\}\);/,
  mapString.trim() + '\n  });'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
