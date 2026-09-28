const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTexts = `const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "coloca você no centro do palco, recupera sua autonomia e acelera a sua coragem de iniciar novos ciclos.",
  2: "destrava a sua capacidade de materialização, recursos financeiros e segurança material.",
  3: "acelera a sua comunicação, magnetiza o seu poder de vendas e coloca a sua mente em alta velocidade.",
  4: "ancora a sua base emocional, traz segurança para o seu lar e fortalece as suas raízes.",
  5: "multiplica o seu brilho pessoal, atrai romances magnéticos e reacende a sua alegria de viver.",
  6: "organiza a sua rotina com eficiência máxima e cria um escudo de vitalidade para a sua saúde.",
  7: "atrai o parceiro ideal, firma grandes sociedades e sela compromissos de longo prazo.",
  8: "quebra estagnações profundas, transforma crises em poder e liberta você de amarras do passado.",
  9: "expande as suas fronteiras físicas e mentais, trazendo grandes viagens e saltos de visão.",
  10: "eleva o seu status público, acelera a sua carreira e projeta o seu nome como autoridade.",
  11: "multiplica o seu poder de conexão e coloca grupos, amizades e internet a serviço dos seus resultados.",
  12: "desacelera o ruído externo, protege a sua energia vital e gesta grandes intuições nos bastidores."
};`;

const newTexts = `const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "colocar você em primeiro lugar, resgatar sua coragem e liderar um novo começo na sua vida.",
  2: "destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo.",
  3: "destravar a sua voz, fechar novos negócios e fazer sua rotina girar com agilidade.",
  4: "criar raízes sólidas, reestruturar seu lar e conquistar um porto seguro de paz interior.",
  5: "reacender a sua paixão, recuperar a alegria de viver e colocar o seu brilho único em evidência.",
  6: "organizar sua rotina, recuperar sua energia física e fazer o seu dia render com máxima eficiência.",
  7: "atrair um relacionamento sério, firmar grandes parcerias e viver a verdadeira reciprocidade a dois.",
  8: "encerrar ciclos antigos, virar a página com coragem e acessar o seu verdadeiro poder pessoal.",
  9: "dar um salto quântico, expandir seus horizontes e viver uma vida sem fronteiras.",
  10: "assumir o topo do seu mercado, ser reconhecido publicamente e brilhar no modo CEO.",
  11: "atrair aliados de peso, multiplicar suas oportunidades pela rede e construir seus grandes projetos de futuro.",
  12: "desacelerar o barulho externo, gestar grandes ideias nos bastidores e renovar sua paz de espírito."
};`;

content = content.replace(oldTexts, newTexts);

// In the HTML block, we need to change "O destino exato para ativar a Casa que" to just "O destino exato para"
// since the new verbs are in the infinitive (colocar, destravar, criar) instead of third person (coloca, destrava, cria).

const oldHTML = `O destino exato para ativar a Casa que{" "}`;
const newHTML = `O destino exato para{" "}`;

content = content.replace(oldHTML, newHTML);

fs.writeFileSync(file, content);
console.log("Updated Cinematic Texts for all 12 Houses!");
