const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const startIndex = code.indexOf('const LIFE_AREAS = [');
let endIndex = code.indexOf('const TIMELINE', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    full: "O Brilho do Sol em Leão: Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na Casa 2, a energia desta cidade potencializa seu magnetismo para se traduzir em valor monetário real. O Rigor do Ascendente em Virgem: Traz a mente analítica, facilitando que você olhe para processos com disciplina e visão de longo prazo.",
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "A energia favorece o faturamento e atrai novos clientes. O universo aqui não entrega por sorte, mas recompensa a sua coragem de faturar e expandir horizontes." },
      { icon: Crown, title: "Valorização do Trabalho", text: "A vibração do lugar convida à autoconfiança extrema. O cenário é perfeito para acabar com os descontos emocionais e cobrar o valor justo pelo seu talento." },
      { icon: Shield, title: "Estabilidade & Segurança", text: "O destino foca na organização e proteção do que é seu. Proteger o lucro ganha tanta força quanto fazê-lo acontecer, estancando vazamentos de energia e caixa." }
    ]
  },
  { 
    id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", score: 88, unlocked: false, 
    teaser: "A força deste destino impulsiona suas metas profissionais rumo ao topo.", 
    full: "O universo pede uma gestão de carreira impecável neste ciclo. A energia do destino faz com que você seja notado não apenas pelo esforço, mas pelo impacto financeiro que a sua expertise gera.",
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "O alinhamento abre caminho para que saltos de negócio apareçam com naturalidade. A sua autoridade ganha um palco iluminado diante dos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "A energia atrai pessoas buscando a sua direção. O cenário é propício para assumir o protagonismo da sua equipe ou mercado sem pedir licença pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "O universo ajuda a transformar sua carreira no seu maior ativo. O destino cria uma armadura de competência que te protege contra crises externas." }
    ]
  },
  { 
    id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, 
    teaser: "A vibração da cidade transforma a sua marca pessoal em sinônimo de excelência.", 
    full: "A forma como o mundo te enxerga atinge um nível premium. A energia favorece uma postura de líder com resultados. A sua aura passa a atrair parceiros dispostos a investir na sua visão.",
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "A sensação ao pisar neste destino é de clareza absoluta de quem você é. A energia afasta a dúvida e garante que você entre em qualquer sala sabendo o seu valor." },
      { icon: Crown, title: "Posicionamento Premium", text: "O universo alinha a sua imagem ao alto valor. O magnetismo é tão forte que as pessoas costumam ler o seu sucesso antes mesmo de você abrir a boca." },
      { icon: Shield, title: "Fim da Autossabotagem", text: "A força do mapa destrava o medo da exposição. A energia pede que você pare de se encolher para caber em lugares pequenos e ocupe o seu espaço real." }
    ]
  },
  { 
    id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, 
    teaser: "O universo organiza o seu tempo para transformar disciplina na sua maior alavanca.", 
    full: "A rotina caótica cede espaço para a clareza. O segredo da prosperidade neste destino é usar a energia local para automatizar tudo o que não exige sua genialidade criativa.",
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O alinhamento dissolve a procrastinação. A energia favorece um estado de foco profundo, permitindo que você produza em 4 horas o que costumava levar 10." },
      { icon: Crown, title: "Automação do Caos", text: "O universo pede eficiência extrema. A vibração da cidade facilita a delegação de tarefas, libertando o seu tempo para decisões que realmente movem o ponteiro." },
      { icon: Shield, title: "Paz Mental Diária", text: "A sensação ao fim do dia é de vitória e missão cumprida. O destino transforma a rotina de uma prisão exaustiva para a verdadeira fundação da sua liberdade." }
    ]
  },
  { 
    id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 65, unlocked: false, 
    teaser: "O magnetismo deste destino aproxima pessoas que abrem portas restritas do seu mercado.", 
    full: "A energia pede filtros rigorosos sobre com quem você compartilha seu tempo. O universo favorece círculos menores, porém infinitamente mais poderosos e focados em colaboração real.",
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "A vibração atrai encontros mágicos. Convites para ambientes exclusivos costumam surgir, colocando você a um aperto de mãos dos maiores contratos." },
      { icon: Crown, title: "Parcerias de Elite", text: "O destino eleva a sua frequência social. A energia atrai apenas associações com quem puxa o seu nível para cima, afastando relações que sugam o seu tempo." },
      { icon: Shield, title: "Proteção por Contatos", text: "O universo cria uma verdadeira rede de segurança ao seu redor através das suas conexões. O poder do 'quem indica' ganha força máxima a seu favor." }
    ]
  },
  { 
    id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, 
    teaser: "A energia pede estabilidade e transforma o romance em uma base forte para o futuro.", 
    full: "A vibração local foca em confiança mútua em vez de apenas intensidade passageira. O universo alinha o relacionamento a sonhos materiais compartilhados e parceria absoluta.",
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "O destino foca na atração de parcerias maduras. A energia é ideal para encontrar quem queira construir junto, cortando o desgaste com relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "A sensação de amor próprio se torna o seu maior escudo. O universo pede o fim das concessões excessivas, garantindo que você dite as regras do seu valor." },
      { icon: Shield, title: "Construção de Futuro", text: "A vibração transforma a atração física em raízes profundas. O cenário é perfeito para que o romance se torne uma base para realizações conjuntas." }
    ]
  },
  { 
    id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", score: 55, unlocked: false, 
    teaser: "O universo conecta a sua essência com a capacidade de gerar valor no mundo material.", 
    full: "A energia deste destino torna o seu legado visível. A realização profunda desperta quando você usa o seu magnetismo para criar uma fundação que protege não só a você, mas aos outros.",
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O destino aguça o seu sexto sentido de forma inegável. A sensação é de saber o caminho exato antes mesmo que a mente lógica consiga tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "A vibração da cidade dissipa qualquer crise existencial. O universo te acorda com a certeza do porquê você faz o que faz, unindo carreira e alma." },
      { icon: Shield, title: "Paz de Espírito", text: "O alinhamento constrói um escudo invisível contra o ruído do mundo. A energia te ancora em um centro de calma que nenhum estresse externo consegue derrubar." }
    ]
  },
  { 
    id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, 
    teaser: "A força deste destino pede um corpo firme para suportar o peso das suas ambições.", 
    full: "O universo exige constância física. Cuidar da energia do seu corpo deixa de ser opção e se torna o pilar central para você aguentar a frequência altíssima deste ciclo de sucesso.",
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O magnetismo local impulsiona o seu vigor. A sensação de cansaço crônico cede espaço para uma energia limpa, acompanhando o ritmo da sua ambição mental." },
      { icon: Crown, title: "Longevidade e Vigor", text: "A vibração faz com que o seu corpo responda instantaneamente aos bons tratos. O universo recompensa seus novos hábitos com uma aparência de saúde radiante." },
      { icon: Shield, title: "Corpo Blindado", text: "A energia foca na sua imunidade. O destino transforma o seu sistema de defesa em uma verdadeira fortaleza, garantindo que a saúde acompanhe a sua escalada." }
    ]
  }
];

`;

    code = code.substring(0, startIndex) + newLifeAreas + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Mystical/Astrological wording injected successfully.");
} else {
    console.log("Could not find start or end index.");
}
