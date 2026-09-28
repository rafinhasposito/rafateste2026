const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add the text matrix near HOUSE_VIDEO_FILTER
const filterTarget = '/* Filtro de cor do vídeo de partículas';
const dictionaryInjection = `/* Textos cinematográficos dinâmicos para cada Casa */
const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "coloca o seu magnetismo pessoal, independência e imagem no centro do palco.",
  2: "destrava a sua capacidade de materialização, recursos financeiros e segurança material.",
  3: "acelera o seu poder de persuasão, trocas comerciais e conexões intelectuais.",
  4: "fortalece a sua base emocional, estrutura familiar e a construção de um lar seguro.",
  5: "desperta a sua autoconfiança absoluta, fertilidade, romances e magnetismo criador.",
  6: "otimiza o seu corpo físico, rotina, hiper-foco e maestria no trabalho diário.",
  7: "atrai alianças de alto valor, uniões profundas e sociedades que transformam o seu jogo.",
  8: "ativa seu poder de regeneração e a atração de investimentos, heranças e recursos de terceiros.",
  9: "expande as suas fronteiras, abrindo portas para viagens internacionais, sabedoria e novos horizontes.",
  10: "impulsiona a sua autoridade, reconhecimento público e consolida o seu nome no topo.",
  11: "multiplica o seu poder de conexão e coloca grupos, amizades e a internet a serviço dos seus resultados.",
  12: "desbloqueia a sua intuição cega, cura traumas do passado e permite o encerramento definitivo de ciclos."
};

${filterTarget}`;

if (!content.includes('HOUSE_CINEMATIC_TEXTS')) {
  content = content.replace(filterTarget, dictionaryInjection);
}

// 2. Make the text dynamic in the JSX
const oldText = `<span className="text-[#3b82f6] font-medium block mt-1 md:inline md:mt-0">grupos, amizades e internet a serviço dos seus resultados.</span>`;
const newText = `<span className="text-[#3b82f6] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>`;

content = content.replace(oldText, newText);

fs.writeFileSync(file, content);
console.log("Success!");
