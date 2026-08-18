const fs = require('fs');

const raw = fs.readFileSync('raw.txt', 'utf8');

const regex = /ID da Casa: Casa (\d+) Nome\/Arquétipo: (.*?) Slogan\/Frase de Efeito: (.*?) Resumo do Perfil \(3 linhas\): ([\s\S]*?)Top 3 Tipos de Experiência: (.*?) Destinos Match: (.*?)\./g;

const dashboardData = {};

const colors = {
  1: { color: "text-red-500", bg: "bg-red-500", lightBg: "bg-red-50" },
  2: { color: "text-amber-500", bg: "bg-amber-500", lightBg: "bg-amber-50" },
  3: { color: "text-yellow-500", bg: "bg-yellow-500", lightBg: "bg-yellow-50" },
  4: { color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50" },
  5: { color: "text-orange-500", bg: "bg-orange-500", lightBg: "bg-orange-50" },
  6: { color: "text-teal-500", bg: "bg-teal-500", lightBg: "bg-teal-50" },
  7: { color: "text-pink-500", bg: "bg-pink-500", lightBg: "bg-pink-50" },
  8: { color: "text-purple-600", bg: "bg-purple-600", lightBg: "bg-purple-50" },
  9: { color: "text-indigo-500", bg: "bg-indigo-500", lightBg: "bg-indigo-50" },
  10: { color: "text-slate-800", bg: "bg-slate-800", lightBg: "bg-slate-50" },
  11: { color: "text-cyan-500", bg: "bg-cyan-500", lightBg: "bg-cyan-50" },
  12: { color: "text-fuchsia-600", bg: "bg-fuchsia-600", lightBg: "bg-fuchsia-50" },
};

const emojis = {
  1: "🔥", 2: "🤑", 3: "🧠", 4: "🏰", 5: "🌟", 6: "⚙️", 7: "🤝", 8: "🦅", 9: "👑", 10: "🏢", 11: "🥂", 12: "🔮"
};

let match;
while ((match = regex.exec(raw)) !== null) {
  const id = parseInt(match[1]);
  const name = match[2].trim();
  const headline = match[3].trim();
  const beneficio = match[4].replace(/\.\n/g, '. ').trim();
  const experiencias = match[5].trim();
  const destinos = match[6].trim();

  dashboardData[id] = {
    id,
    name,
    emoji: emojis[id],
    ...colors[id],
    memoji: "https://em-content.zobj.net/source/apple/391/man-student_1f468-200d-1f393.png", // We will keep default for now or pick some later
    archetype: name,
    headline,
    beneficioBanner: beneficio,
    stats: [
      { label: "EXPERIÊNCIA", value: 95, color: colors[id].bg },
      { label: "MAGNETISMO", value: 85, color: colors[id].bg },
      { label: "PODER", value: 75, color: colors[id].bg }
    ],
    idealPara: "Quem busca " + experiencias.split(',')[0],
    pills: [
      { comando: "ATRAI", label: "Poder e Sucesso", icon: "TrendingUp" },
      { comando: "AMPLIFICA", label: "Oportunidades", icon: "Sparkles" },
      { comando: "BLOQUEIA", label: "Estagnação", icon: "ShieldCheck" }
    ],
    areasDaVida: [
      { tag: "EFEITO PESSOAL", title: "Sua vida muda radicalmente. Você ganha clareza.", image: "🌟" },
      { tag: "EFEITO AMOR", title: "Atração magnética de pessoas alinhadas ao seu novo eu.", image: "❤️‍🔥" },
      { tag: "EFEITO PROFISSIONAL", title: "Salto quântico na carreira e negócios.", image: "🚀" }
    ],
    lessons: [
      { phase: "Mês 1-3", title: "Fase 1", desc: "Limpeza profunda e preparação do terreno." },
      { phase: "Mês 4-8", title: "Fase 2", desc: "Aceleração máxima e atração de recursos." },
      { phase: "Mês 9-12", title: "Fase 3", desc: "Consolidação do seu novo império." }
    ],
    lossAversion: "CUIDADO: Se você perder essa janela, continuará na mediocridade."
  };
}

fs.writeFileSync('dashboardData.json', JSON.stringify(dashboardData, null, 2));
console.log("Done");
