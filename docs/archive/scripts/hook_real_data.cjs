const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Import
if (!content.includes("import { REAL_HOUSES_DATA }")) {
  content = content.replace(
    'import { Lock, MapPin, Map, Star, Compass, ArrowRight, Target, Sparkles, ChevronDown, CheckCircle2, PlayCircle, Shield, Key, Sun, Moon, Zap, DollarSign, Briefcase, Crown, Calendar, Users, Heart, Leaf } from "lucide-react";',
    `import { Lock, MapPin, Map, Star, Compass, ArrowRight, Target, Sparkles, ChevronDown, CheckCircle2, PlayCircle, Shield, Key, Sun, Moon, Zap, DollarSign, Briefcase, Crown, Calendar, Users, Heart, Leaf } from "lucide-react";\nimport { REAL_HOUSES_DATA } from "../data/houses_content";`
  );
}

// 2. Map currentHouseData
const oldDynamic = `const dynamicHouseImg = \`https://images.unsplash.com/photo-\${activeRoute.img}?auto=format&fit=crop&w=2000&q=80\`;`;
const newDynamic = `const dynamicHouseImg = \`https://images.unsplash.com/photo-\${activeRoute.img}?auto=format&fit=crop&w=2000&q=80\`;
  const currentHouseData = REAL_HOUSES_DATA[activeRouteIndex];`;
content = content.replace(oldDynamic, newDynamic);

// 3. Replace Notebook LM Tema
content = content.replace(
  '<p className="text-white/80 font-light leading-relaxed mb-6">A premissa deste ano é focada no seu crescimento financeiro',
  '<p className="text-white/80 font-light leading-relaxed mb-6">{currentHouseData.tema}'
);

// 4. Replace Notebook LM Segredo
content = content.replace(
  '<p className="text-white/80 font-light leading-relaxed mb-6">O maior erro na Rota do Dinheiro é',
  '<p className="text-white/80 font-light leading-relaxed mb-6">{currentHouseData.segredo}'
);

// 5. Replace Notebook LM Ritual
const oldRitualList = `<ol className="list-decimal pl-4 space-y-3 text-white/80 font-light leading-relaxed">
                            <li><strong>Atitude 1:</strong> No dia do seu aniversário, dê um passo prático em direção à sua prosperidade.</li>
                            <li><strong>Atitude 2:</strong> Organize sua carteira física, limpe seus cartões e abra uma nova conta (mesmo que com um valor simbólico).</li>
                            <li><strong>Atitude 3:</strong> Evite fazer compras impulsivas ou parcelamentos desnecessários nesse dia para sintonizar a energia de acumulação.</li>
                          </ol>`;
const newRitualList = `<p className="text-white/80 font-light leading-relaxed mb-6">{currentHouseData.ritual}</p>`;
if (content.includes("Atitude 1")) {
  content = content.replace(oldRitualList, newRitualList);
}

// 6. Replace Mantra
const oldMantra = `Eu reconheço o valor do meu trabalho, organizo minhas contas e colho a estabilidade material.`;
content = content.replace(oldMantra, `{currentHouseData.mantra}`);

// 7. Replace Timeline (Fase 1, Fase 2, Fase 3)
// Timeline maps over `currentActiveData.timeline`
const oldTimelineMap = `{currentActiveData.timeline?.map((phase, idx) => (`;
const newTimelineMap = `{[
                          { title: "Meses 1-4", label: "Adaptação e Foco", desc: currentHouseData.fase1 },
                          { title: "Meses 5-8", label: "Colheita e Aceleração", desc: currentHouseData.fase2 },
                          { title: "Meses 9-12", label: "Consolidação Plena", desc: currentHouseData.fase3 }
                        ].map((phase, idx) => (`;
content = content.replace(oldTimelineMap, newTimelineMap);

fs.writeFileSync(file, content);
console.log("Hooked Real Data!");
