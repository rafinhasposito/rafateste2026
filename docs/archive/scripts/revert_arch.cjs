const fs = require('fs');
let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const oldMergedAreasRegex = /const mergedAreas = areas\.map\(area => \{[\s\S]*?\}\)\;/;

const restoreMergedAreas = `
  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    
    // As per user rule: The 96 combinations in focusMatrix.ts ARE the intended personalized experience!
    // The photo and city are locked, but the Pillars, Timeline, and Ritual MUST adapt to the Focus.
    
    if (!focusData) return area;
    
    return {
      ...area,
      score: focusData.match || area.score,
      teaser: focusData.headline || area.teaser,
      full: focusData.headline || area.teaser,
      mantra: focusData.mantra || area.mantra,
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
  });
`;

content = content.replace(oldMergedAreasRegex, restoreMergedAreas);
fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
