const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// Replace LIFE_AREAS with a clean version without city/image
const lifeAreasRegex = /const LIFE_AREAS = \[[\s\S]*?\];/;
const cleanLifeAreas = `const LIFE_AREAS = [
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true },
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 92, unlocked: false },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#64748B", score: 85, unlocked: false },
  { id: "identidade", icon: Star, label: "Identidade e Imagem", color: "#E11D48", score: 90, unlocked: false },
  { id: "saude", icon: Shield, label: "Rotina e Saúde", color: "#3B82F6", score: 88, unlocked: false },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 85, unlocked: false },
  { id: "espiritual", icon: Zap, label: "Espiritual e Propósito", color: "#8B5CF6", score: 82, unlocked: false }
];`;
content = content.replace(lifeAreasRegex, cleanLifeAreas);

// Ensure imports
if (!content.includes('import { cityDatabase }')) {
  content = content.replace('import React,', 'import React,\nimport { cityDatabase } from "@/data/houses";\n');
}

// Re-map the state to cleanly separate activeArea (Focus) and Base House (Casa 2)
const activeDataTarget = /const currentActiveData = sortedAreas\.find\(a => a\.id === \(hoveredArea \|\| sortedAreas\[0\]\.id\)\);/;
const replacementData = `const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));
  const baseHouseId = 2; // Preview fixo na Casa 2
  const baseHouse = cityDatabase[baseHouseId];
  
  // Informações blindadas da Casa
  const houseCityName = "Nova Iorque, EUA";
  const houseHeroImage = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80";
  const housePillars = [
    { icon: Sparkles, title: "Prosperidade e Aterramento", text: "Gastar energia com o que é instável não faz mais sentido; o foco se volta para a edificação financeira." },
    { icon: Crown, title: "Valorização e Precificação", text: "O momento perfeito para reconhecer o seu verdadeiro mérito, cobrando de forma justa pelo seu tempo e competência." },
    { icon: Shield, title: "Estabilidade e Conforto", text: "Um período de organização e constância que permite proteger o que é seu e fazer suas conquistas gerarem frutos de tranquilidade para o futuro." }
  ];
`;
content = content.replace(activeDataTarget, replacementData);

// Fix UI Bindings
// Replace `activeArea.city` -> `houseCityName`
content = content.replace(/\{activeArea\.city\}/g, '{houseCityName}');
// Replace `activeArea.image` -> `houseHeroImage`
content = content.replace(/activeArea\.image/g, 'houseHeroImage');
// Replace `activeArea.cityDesc` -> `{baseHouse?.oTema}`
content = content.replace(/\{activeArea\.cityDesc\}/g, '{baseHouse?.oTema}');
// Replace Pillars array -> `housePillars`
content = content.replace(/activeArea\.pillars/g, 'housePillars');

// Replace DNA bindings
content = content.replace(/\{activeArea\.dna\?\.essencia\}/g, '{baseHouse?.oQueVocePrecisaEntender}');
content = content.replace(/\{activeArea\.dna\?\.metodo\}/g, '{baseHouse?.oSegredo}');
content = content.replace(/\{activeArea\.dna\?\.fase\}/g, '{baseHouse?.fase1}');

// Replace Ritual binding
content = content.replace(/activeArea\.ritual/g, 'baseHouse?.ritual24h');

// Replace Mantra binding
content = content.replace(/activeArea\.mantra/g, 'baseHouse?.mantra');

// Timeline Replace logic
const oldTimelineMap = /\{activeArea\.timeline\.map\(\(fase, idx\) => \(/g;
const newTimelineMap = `{[
    { phase: "Fase 1: Preparação de Terreno", period: "Meses 1 a 4", text: baseHouse?.fase1 },
    { phase: "Fase 2: Tração Magnética", period: "Meses 5 a 8", text: baseHouse?.fase2 },
    { phase: "Fase 3: Consolidação", period: "Meses 9 a 12", text: baseHouse?.fase3 }
  ].map((fase, idx) => (`
content = content.replace(oldTimelineMap, newTimelineMap);

// Replace generic string Tóquio in code (just in case)
content = content.replace(/>Tóquio, Japão</g, '>{houseCityName}<');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("V3 Cleaned Up Correctly!");
