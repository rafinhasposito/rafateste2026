const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// 1. We need to replace the LIFE_AREAS mock so it stops having cities, images, and descriptions that belong to Houses.
// We will replace it with a cleaner version.

const lifeAreasRegex = /const LIFE_AREAS = \[[\s\S]*?\];/;
const cleanLifeAreas = `const LIFE_AREAS = [
  { id: "identidade", icon: Star, label: "Identidade e Imagem", color: "#c9a227", score: 90, unlocked: false },
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true },
  { id: "networking", icon: Briefcase, label: "Comunicação e Vendas", color: "#14b8a6", score: 85, unlocked: false },
  { id: "lar", icon: Heart, label: "Lar e Vida Privada", color: "#6366f1", score: 70, unlocked: false },
  { id: "amor", icon: Heart, label: "Romance e Paixões", color: "#f43f5e", score: 92, unlocked: false },
  { id: "saude", icon: Shield, label: "Rotina e Saúde", color: "#10b981", score: 88, unlocked: false },
  { id: "sociedades", icon: Users, label: "Casamento e Sociedades", color: "#f43f5e", score: 95, unlocked: false },
  { id: "transformacao", icon: Zap, label: "Poder Oculto", color: "#8b5cf6", score: 82, unlocked: false }
];`;

content = content.replace(lifeAreasRegex, cleanLifeAreas);

// 2. We need to fix the data injection in the component. 
// We will import cityDatabase and houseThemes.
if (!content.includes('import { cityDatabase }')) {
  content = content.replace('import React,', 'import React,\nimport { cityDatabase } from "@/data/houses";\nimport { houseThemes } from "@/data/houseThemes";\n');
}

// Inside the component, we define the base House (e.g. Casa 2 - Nova Iorque)
// Right after `const activeActiveData = ...`
const activeDataTarget = /const currentActiveData = sortedAreas\.find\(a => a\.id === \(hoveredArea \|\| sortedAreas\[0\]\.id\)\);/;
const replacementData = `const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));
  const baseHouseId = 2; // Hardcoded to Casa 2 for the preview
  const baseHouse = cityDatabase[baseHouseId];
  const houseColor = houseThemes[baseHouseId]?.themeColor || "#10b981";
  const cityImage = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80"; // Nova Iorque
  const cityName = "Nova Iorque, EUA";
`;
content = content.replace(activeDataTarget, replacementData);

// 3. Fix the rendering where it used `activeArea.city`, `activeArea.image`, `activeArea.cityDesc`
content = content.replace(/\{activeArea\.city\}/g, '{cityName}');
content = content.replace(/activeArea\.image/g, 'cityImage');
content = content.replace(/\{activeArea\.cityDesc\}/g, '{baseHouse?.comoApareceNaVidaReal || baseHouse?.oTema}');

// Fix Pillars (Bloco 2)
// Search for `activeArea.pillars.map` and replace with a hardcoded or derived one
content = content.replace(/activeArea\.pillars/g, `[
    { icon: Sparkles, title: "Prosperidade e Aterramento", text: "Gastar energia com o que é instável não faz mais sentido; o foco se volta para a edificação financeira." },
    { icon: Sparkles, title: "Valorização e Precificação", text: "O momento perfeito para reconhecer o seu verdadeiro mérito, cobrando de forma justa pelo seu talento." },
    { icon: Sparkles, title: "Estabilidade e Conforto", text: "Um período de organização e constância que permite proteger o que é seu e gerar tranquilidade." }
  ]`);

// Fix DNA (Bloco 3)
content = content.replace(/\{activeArea\.dna\?.essencia\}/g, '{baseHouse?.oQueVocePrecisaEntender}');
content = content.replace(/\{activeArea\.dna\?.metodo\}/g, '{baseHouse?.oSegredo}');
content = content.replace(/\{activeArea\.dna\?.fase\}/g, '{baseHouse?.fase1}');

// Fix Ritual (Bloco 4)
content = content.replace(/activeArea\.ritual/g, 'baseHouse?.ritual24h');

// Fix Mantra (Bloco 4.5)
content = content.replace(/activeArea\.mantra/g, 'baseHouse?.mantra');

// Fix Timeline (Bloco 5)
// Timeline was using activeArea.timeline.map
const oldTimelineMap = /\{activeArea\.timeline\.map\(\(fase, idx\) => \(/g;
const newTimelineMap = `{[
    { phase: "Fase 1: Preparação", period: "Meses 1 a 4", text: baseHouse?.fase1 },
    { phase: "Fase 2: Tração Magnética", period: "Meses 5 a 8", text: baseHouse?.fase2 },
    { phase: "Fase 3: Consolidação", period: "Meses 9 a 12", text: baseHouse?.fase3 }
  ].map((fase, idx) => (`
content = content.replace(oldTimelineMap, newTimelineMap);

// Replace the word Tóquio in any other hardcoded spots if it slipped through
content = content.replace(/Tóquio/g, 'Nova Iorque');
content = content.replace(/Japão/g, 'EUA');

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("V3 has been cleaned of the Frankenstein data!");
