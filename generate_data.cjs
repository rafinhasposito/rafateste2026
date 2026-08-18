const fs = require('fs');

const raw = fs.readFileSync('raw.txt', 'utf8');

const regex = /ID da Casa:\s*Casa\s*(\d+)\s*Nome\/Arquétipo:\s*(.*?)\s*Slogan\/Frase de Efeito:\s*(.*?)\s*Resumo do Perfil \(3 linhas\):\s*(.*?)\s*Top 3 Tipos de Experiência:\s*(.*?)\s*Destinos Match:\s*(.*?)(?=ID da Casa:|$)/gis;

let match;
const houses = {};

const colors = [
  "text-red-500", "text-emerald-500", "text-blue-500", "text-amber-500",
  "text-fuchsia-500", "text-cyan-500", "text-violet-500", "text-rose-500",
  "text-indigo-500", "text-teal-500", "text-orange-500", "text-pink-500"
];
const bgs = [
  "bg-red-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500",
  "bg-fuchsia-500", "bg-cyan-500", "bg-violet-500", "bg-rose-500",
  "bg-indigo-500", "bg-teal-500", "bg-orange-500", "bg-pink-500"
];

const memojis = [
  "/memojis/memoji_woman_1783863393189.jpg",
  "/memojis/memoji_businessman_1783863374575.jpg",
  "/memojis/memoji_face_wealth_1783881845803.jpg",
  "/memojis/memoji_woman_1783863393189.jpg", // reuse for now
  "/memojis/memoji_businessman_1783863374575.jpg",
  "/memojis/memoji_face_wealth_1783881845803.jpg",
  "/memojis/memoji_woman_1783863393189.jpg",
  "/memojis/memoji_businessman_1783863374575.jpg",
  "/memojis/memoji_face_wealth_1783881845803.jpg",
  "/memojis/memoji_woman_1783863393189.jpg",
  "/memojis/memoji_businessman_1783863374575.jpg",
  "/memojis/memoji_face_wealth_1783881845803.jpg"
];

while ((match = regex.exec(raw)) !== null) {
  const id = parseInt(match[1]);
  const nameArchetype = match[2].trim();
  const headline = match[3].trim();
  const resumo = match[4].replace(/\n|\./g, '').trim();
  const experiencias = match[5].replace(/\n|\./g, '').trim();
  const destinos = match[6].replace(/\n|\./g, '').trim();

  const [name, archetype] = nameArchetype.split(' / ').map(s => s.trim());

  houses[id] = {
    id,
    name: name || nameArchetype,
    archetype: archetype || nameArchetype,
    headline,
    beneficioBanner: resumo,
    destinos,
    experiencias,
    emoji: "✨",
    color: colors[id - 1] || "text-slate-500",
    bg: bgs[id - 1] || "bg-slate-500",
    memoji: memojis[id - 1],
    cosmicAdvice: "Sua energia está fluindo para a direção certa. Confie no processo.",
    roadmap: [
      { phase: "Fase 1", action: "Reconhecimento do novo cenário." },
      { phase: "Fase 2", action: "Aprofundamento e conexão." },
      { phase: "Fase 3", action: "Resultados e escala absoluta." }
    ],
    pills: [
        { comando: "ATRAI", label: "Sinergia", icon: "TrendingUp" },
        { comando: "AMPLIFICA", label: "Oportunidades", icon: "Star" },
        { comando: "BLOQUEIA", label: "Resistência", icon: "Shield" }
    ]
  };
}

const fileContent = `export const dashboardData: Record<number, any> = ${JSON.stringify(houses, null, 2)};\n`;
fs.writeFileSync('src/data/houseDashboardData.ts', fileContent);
console.log('Successfully generated src/data/houseDashboardData.ts with', Object.keys(houses).length, 'houses.');
