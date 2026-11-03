const fs = require('fs');

let content = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf-8');

const lifeAreasReplacement = `const LIFE_AREAS = [
  { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", unlocked: true },
  { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", unlocked: false },
  { id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", unlocked: false },
  { id: "saude", icon: Leaf, label: "Saúde e Rotina", color: "#22c55e", unlocked: false },
  { id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", unlocked: false },
  { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", unlocked: false },
  { id: "sociedades", icon: Users, label: "Casamento e Sociedades", color: "#eab308", unlocked: false },
  { id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", unlocked: false }
];`;

content = content.replace(/const LIFE_AREAS = \[[\s\S]*?\];\n/, lifeAreasReplacement + '\n');
fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', content);
console.log("Replaced LIFE_AREAS");
