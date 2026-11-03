import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add intent to DestinyResultsProps
content = content.replace("  unlockedCount?: number;\n}", "  unlockedCount?: number;\n  intent?: string | null;\n}")

# 2. Modify mergedAreas to boost the user's selected intent
old_merged = """  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    
    // As per user rule: The 96 combinations in focusMatrix.ts ARE the intended personalized experience!
    // The photo and city are locked, but the Pillars, Timeline, and Ritual MUST adapt to the Focus.
    
    if (!focusData) return area;
    
    return {
      ...area,
      score: focusData.match || area.score,"""

new_merged = """  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    
    // As per user rule: The 96 combinations in focusMatrix.ts ARE the intended personalized experience!
    // The photo and city are locked, but the Pillars, Timeline, and Ritual MUST adapt to the Focus.
    
    let finalScore = focusData ? (focusData.match || area.score) : area.score;
    
    // O DEVER DA PÁGINA É ENTREGAR O QUE O USUÁRIO PEDIU:
    // Se o usuário escolheu uma intenção específica na consulta, ela deve vencer SEMPRE.
    if (props.intent) {
      const intentNorm = props.intent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const areaLabelNorm = area.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const areaIdNorm = area.id.toLowerCase();
      // Se a intenção do banco bater com o ID ou com o Label da área da vida, damos o Score Máximo (999)
      if (areaLabelNorm.includes(intentNorm) || intentNorm.includes(areaLabelNorm.split(' ')[0]) || intentNorm.includes(areaIdNorm)) {
        finalScore = 999;
      }
    }

    if (!focusData) {
      return { ...area, score: finalScore };
    }
    
    return {
      ...area,
      score: finalScore,"""

content = content.replace(old_merged, new_merged)

with open(file_path, "w") as f:
    f.write(content)

print("V3 updated to RESPECT the user's intent!")
