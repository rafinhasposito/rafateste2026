const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

// 1. Add REAL_HOUSES_DATA import
if (!content.includes('REAL_HOUSES_DATA')) {
  content = content.replace(
    'import { BASE_HOUSE_PROFILES }',
    'import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";\nimport { REAL_HOUSES_DATA } from "@/data/houses_content";'
  );
}

// 2. Fix mergedAreas to RESPECT the architecture rule (Immutable Pillars, Timeline, Ritual)
const mergedAreasRegex = /const mergedAreas = areas\.map\(area => \{[\s\S]*?\}\)\;/;
const cleanMergedAreas = `
  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    
    // ARCHITECTURE DICTIONARY: Casa = Imutável (Pilares, Timeline, Ritual). Foco = Mutável (Match, Teaser)
    const houseContent = REAL_HOUSES_DATA.find(h => h.num === P_DYNAMIC.house) || REAL_HOUSES_DATA[0];
    
    // Map the real timeline from the house foundation
    const realTimeline = [
      { phase: "Fase 1", text: houseContent.fase1 },
      { phase: "Fase 2", text: houseContent.fase2 },
      { phase: "Fase 3", text: houseContent.fase3 }
    ];

    if (!focusData) return {
      ...area,
      ritualData: houseContent.ritual,
      timeline: realTimeline
    };
    
    return {
      ...area,
      score: focusData.match || area.score,
      teaser: focusData.headline || area.teaser,
      full: focusData.headline || area.teaser,
      // Focus lens updates the texts, but NOT the ritual/timeline
      ritualData: houseContent.ritual,
      timeline: realTimeline,
      // Pillars should be immutable? The user said "Os 3 Pilares" are immutable. 
      // But REAL_HOUSES_DATA doesn't have 3 pillars array. We'll fallback to area default to stop it changing per focus.
      pillars: area.pillars
    };
  });
`;

content = content.replace(mergedAreasRegex, cleanMergedAreas);

// 3. Fix the MOCK_DATA at the bottom (remove country strings from locked cities)
content = content.replace(
  /const MOCK_DATA = \[\s*\{ city: "Nova York, EUA"[\s\S]*?\];/g,
  'const MOCK_DATA = ROUTES_MOCK_DATA;' // Just reuse the global mapping we already fixed!
);

// Fix the render in the locked city carousel so it doesn't show the country
content = content.replace(
  /const cityForThisHouse = isCurrent \? P_DYNAMIC\.city : \(isUnlocked \? mockData\.city : "Bloqueado"\);/,
  'const cityForThisHouse = isCurrent ? P_DYNAMIC.city.split(", ")[0] : (isUnlocked ? mockData.city.split(", ")[0] : "Bloqueado");'
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
