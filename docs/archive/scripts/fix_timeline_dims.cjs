const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTimeline = `const TIMELINE = [
  { phase: "Fase 1", months: "Mês 1 a 3", title: "Organização de Contatos", desc: "Faça uma limpa saudável nas suas redes sociais, afaste-se de relações que não somam e teste novos projetos em formato experimental.", img: "/apple-mock/audio_mix__cv5tvd3y13ee_large.jpg" },
  { phase: "Fase 2", months: "Mês 4 a 8", title: "Extroversão Máxima", desc: "A fase mais forte para aceitar convites, frequentar eventos presenciais, fechar parcerias comerciais e ver novos aliados surgirem.", img: "/apple-mock/app_actions__budci8e25k76_large.jpg", highlight: true },
  { phase: "Fase 3", months: "Mês 9 a 12", title: "Escala de Resultados", desc: "Hora de colher os frutos do networking, delegar tarefas operacionais pesadas e deixar que a força do grupo multiplique o alcance do seu faturamento.", img: "/apple-mock/photographic_styles__ef8cg39z0q2q_large.jpg" },
];`;

const newTimeline = `const TIMELINE = [
  { phase: "Fase 1", months: "Mês 1 a 3", title: "Mapeamento e Auditoria", desc: "Faça uma limpa saudável nas despesas desnecessárias, organize a sua estrutura de precificação e teste novas fontes de receita.", img: "/apple-mock/audio_mix__cv5tvd3y13ee_large.jpg" },
  { phase: "Fase 2", months: "Mês 4 a 8", title: "Aceleração Financeira", desc: "A fase mais forte e magnética para fechar negócios, atrair capital, precificar alto e materializar as sementes que você plantou.", img: "/apple-mock/app_actions__budci8e25k76_large.jpg", highlight: true },
  { phase: "Fase 3", months: "Mês 9 a 12", title: "Consolidação do Status", desc: "Hora de converter o faturamento em patrimônio seguro, blindar o que você construiu e elevar o seu padrão e conforto de vida.", img: "/apple-mock/photographic_styles__ef8cg39z0q2q_large.jpg" },
];`;

content = content.replace(oldTimeline, newTimeline);

const oldDims = `const DIMS = [
  { icon: Heart, label: "Amor", val: 98, color: "#f43f5e" },
  { icon: Users, label: "Networking", val: 95, color: "#3b82f6" },
  { icon: Crown, label: "Identidade", val: 88, color: "#c9a227" },
  { icon: Briefcase, label: "Trabalho", val: 85, color: "#10b981" },
  { icon: Sparkles, label: "Espiritual", val: 80, color: "#818cf8" },
  { icon: DollarSign, label: "Dinheiro", val: 75, color: "#f59e0b" },
  { icon: Calendar, label: "Rotina", val: 65, color: "#a855f7" },
  { icon: Leaf, label: "Saúde", val: 55, color: "#22c55e" },
];`;

const newDims = `const DIMS = [
  { icon: DollarSign, label: "Dinheiro", val: 98, color: "#f59e0b" },
  { icon: Briefcase, label: "Trabalho", val: 88, color: "#10b981" },
  { icon: Crown, label: "Identidade", val: 80, color: "#c9a227" },
  { icon: Calendar, label: "Rotina", val: 72, color: "#a855f7" },
  { icon: Users, label: "Networking", val: 65, color: "#3b82f6" },
  { icon: Heart, label: "Amor", val: 62, color: "#f43f5e" },
  { icon: Sparkles, label: "Espiritual", val: 55, color: "#818cf8" },
  { icon: Leaf, label: "Saúde", val: 52, color: "#22c55e" },
];`;

content = content.replace(oldDims, newDims);

fs.writeFileSync(file, content);
console.log("Success!");
