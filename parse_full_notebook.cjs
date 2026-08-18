const fs = require('fs');

const raw = fs.readFileSync('raw.txt', 'utf8');

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

const memojis = {
  1: "https://em-content.zobj.net/source/apple/391/person-surfing_1f3c4.png",
  2: "https://em-content.zobj.net/source/apple/391/man-student_1f468-200d-1f393.png",
  3: "https://em-content.zobj.net/source/apple/391/man-technologist_1f468-200d-1f4bb.png",
  4: "https://em-content.zobj.net/source/apple/391/person-in-lotus-position_1f9d8.png",
  5: "https://em-content.zobj.net/source/apple/391/woman-dancing_1f483.png",
  6: "https://em-content.zobj.net/source/apple/391/woman-scientist_1f469-200d-1f52c.png",
  7: "https://em-content.zobj.net/source/apple/391/people-holding-hands_1f9d1-200d-1f91d-200d-1f9d1.png",
  8: "https://em-content.zobj.net/source/apple/391/person-in-suit-levitating_1f574-fe0f.png",
  9: "https://em-content.zobj.net/source/apple/391/person-with-skullcap_1f472.png",
  10: "https://em-content.zobj.net/source/apple/391/man-office-worker_1f468-200d-1f4bc.png",
  11: "https://em-content.zobj.net/source/apple/391/people-with-bunny-ears_1f46f.png",
  12: "https://em-content.zobj.net/source/apple/391/mage_1f9d9.png"
};

const data = {};

// Parse Prompt 1: Basic info
const regex1 = /ID da Casa: Casa (\d+) Nome\/Arquétipo: (.*?) Slogan\/Frase de Efeito: (.*?) Resumo do Perfil \(3 linhas\): ([\s\S]*?)Top 3 Tipos de Experiência: (.*?) Destinos Match: (.*?)\./g;
let match;
while ((match = regex1.exec(raw)) !== null) {
  const id = parseInt(match[1]);
  data[id] = {
    id,
    name: match[2].trim(),
    archetype: match[2].trim(),
    headline: match[3].trim(),
    beneficioBanner: match[4].replace(/\.\n/g, '. ').trim(),
    experiencias: match[5].trim(),
    destinos: match[6].trim(),
    emoji: emojis[id],
    memoji: memojis[id],
    ...colors[id]
  };
}

// Parse Prompt 1 Part 2: Mapeamento de Frequência (Atrai/Bloqueia)
const freqBlock = raw.substring(raw.indexOf("O Fator Expansão)"));
for (let i = 1; i <= 12; i++) {
  const r = new RegExp(`Casa ${i}\\n(.*?)\\n•(.*?)<br>•(.*?)<br>•(.*?)<br>\\n•(.*?)<br>•(.*?)<br>•(.*?)\\n`, 'g');
  const m = r.exec(freqBlock);
  if (m && data[i]) {
    data[i].tituloImpacto = m[1].trim();
    data[i].pills = [
      { comando: "ATRAI", label: m[2].trim().substring(0, 45) + '...', icon: "Sparkles" },
      { comando: "AMPLIFICA", label: m[3].trim().substring(0, 45) + '...', icon: "TrendingUp" },
      { comando: "BLOQUEIA", label: m[5].trim().substring(0, 45) + '...', icon: "ShieldCheck" }
    ];
  } else {
    // fallback se falhar a regex complexa
    if (data[i]) {
      data[i].pills = [
        { comando: "ATRAI", label: "Poder e Sucesso", icon: "TrendingUp" },
        { comando: "AMPLIFICA", label: "Oportunidades", icon: "Sparkles" },
        { comando: "BLOQUEIA", label: "Estagnação", icon: "ShieldCheck" }
      ];
    }
  }
}

// Parse Prompt 3: Roadmap (Caminho dos 12 Meses)
const roadmapBlock = raw.substring(raw.indexOf("O SEU DESTINO NOS 12 MESES"));
for (let i = 1; i <= 12; i++) {
  const r = new RegExp(`Casa ${i}: (.*?)\\nFase 1 \\(Mês 1-3\\) - (.*?): (.*?)\\nFase 2 \\(Mês 4-8\\) - (.*?): (.*?)\\nFase 3 \\(Mês 9-12\\) - (.*?): (.*?)\\n`, 'g');
  const m = r.exec(roadmapBlock);
  if (m && data[i]) {
    data[i].lessons = [
      { phase: "Mês 1-3", title: m[2].trim(), desc: m[3].trim() },
      { phase: "Mês 4-8", title: m[4].trim(), desc: m[5].trim() },
      { phase: "Mês 9-12", title: m[6].trim(), desc: m[7].trim() }
    ];
  } else {
    if (data[i]) {
      data[i].lessons = [
        { phase: "Mês 1-3", title: "Fase 1", desc: "Preparação." },
        { phase: "Mês 4-8", title: "Fase 2", desc: "Aceleração." },
        { phase: "Mês 9-12", title: "Fase 3", desc: "Consolidação." }
      ];
    }
  }
}

// Parse Prompt 4: Climax (Conselho)
const climaxBlock = raw.substring(raw.indexOf("O CLÍMAX: CONSELHO E SCORECARD"));
for (let i = 1; i <= 12; i++) {
  const r = new RegExp(`Casa ${i}: (.*?)\\nIdeal Para: (.*?) Um Conselho Cósmico de Proteção: (.*?)\\n`, 'g');
  const m = r.exec(climaxBlock);
  if (m && data[i]) {
    data[i].idealPara = m[2].trim();
    data[i].lossAversion = m[3].trim();
  } else {
    if (data[i]) {
      data[i].idealPara = "Pessoas que buscam evolução.";
      data[i].lossAversion = "Cuidado com o ego.";
    }
  }
}

// Add stats and areas da vida
for (let i = 1; i <= 12; i++) {
  if (data[i]) {
    data[i].stats = [
      { label: "EXPERIÊNCIA", value: 95, color: colors[i].bg },
      { label: "MAGNETISMO", value: 85, color: colors[i].bg },
      { label: "PODER", value: 75, color: colors[i].bg }
    ];
    data[i].areasDaVida = [
      { tag: "EFEITO PESSOAL", title: "Sua vida muda radicalmente. Você ganha clareza.", image: "🌟" },
      { tag: "EFEITO AMOR", title: "Atração magnética de pessoas alinhadas ao seu novo eu.", image: "❤️‍🔥" },
      { tag: "EFEITO PROFISSIONAL", title: "Salto quântico na carreira e negócios.", image: "🚀" }
    ];
  }
}

// Output as TS file
let tsContent = `export const dashboardData: Record<number, any> = {\n`;
for (let i = 1; i <= 12; i++) {
  tsContent += `  ${i}: ${JSON.stringify(data[i], null, 4)},\n`;
}
tsContent += `};\n`;

fs.writeFileSync('src/data/houseDashboardData.ts', tsContent);
console.log("TS file generated!");
