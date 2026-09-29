const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const startIndex = code.indexOf('const LIFE_AREAS = [');
let endIndex = code.indexOf('const TIMELINE', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O dinheiro tende a fluir através da sua capacidade de atrair e materializar recursos.", 
    full: "O Brilho do Sol em Leão: Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na Casa 2, seu magnetismo pode se traduzir em valor monetário real. O Rigor do Ascendente em Virgem: Traz a mente analítica e o foco na eficiência, facilitando que você olhe para planilhas e processos com disciplina.",
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "Foco no aumento de faturamento e novos clientes. A atração de recursos reais é altamente favorecida. O dinheiro na Casa 2 tende a não vir por sorte, mas pela coragem de faturar." },
      { icon: Crown, title: "Valorização do Trabalho", text: "Cenário ideal para focar na autoconfiança. O ciclo favorece o fim dos descontos emocionais, ajudando você a auditar seus serviços e cobrar o valor justo." },
      { icon: Shield, title: "Estabilidade & Segurança", text: "O período favorece a organização de caixa e o corte de vazamentos invisíveis. Proteger o lucro tende a ser tão fundamental quanto fazê-lo acontecer." }
    ]
  },
  { 
    id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", score: 88, unlocked: false, 
    teaser: "Suas metas profissionais podem avançar muito se focadas na escala de valor.", 
    full: "O seu crescimento profissional passa a pedir uma gestão de carreira impecável. Você tende a ser valorizado não apenas pelo esforço, mas pelo impacto financeiro que a sua expertise pode gerar nos ambientes em que circula.",
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "Oportunidades de promoção ou saltos de negócio podem aparecer com muita naturalidade. A sua autoridade tende a ser reconhecida pelos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "As pessoas tendem a buscar a sua direção. É o ciclo altamente propício para assumir o protagonismo da sua equipe ou mercado sem pedir desculpas pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "A sua carreira pode se tornar o seu maior ativo. O período favorece a criação de uma blindagem contra crises de mercado por meio de competência e resultados." }
    ]
  },
  { 
    id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, 
    teaser: "Sua marca pessoal tende a se tornar sinônimo de excelência e poder realizador.", 
    full: "A forma como o mundo te enxerga pode atingir um nível premium. O ciclo favorece uma postura de líder. A sua marca pessoal tende a atrair parceiros dispostos a investir e multiplicar a sua visão.",
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "Você pode passar a entrar em qualquer sala sabendo exatamente o seu valor. A dúvida tende a ceder lugar a uma clareza absoluta de quem você é." },
      { icon: Crown, title: "Posicionamento Premium", text: "Sua imagem pessoal pode passar a comunicar alto valor instantaneamente. As pessoas tendem a ler o seu sucesso antes mesmo de você falar." },
      { icon: Shield, title: "Fim da Autossabotagem", text: "A energia favorece que você pare de se encolher para caber em lugares pequenos. O medo da exposição pode sumir, abrindo caminho para o reconhecimento." }
    ]
  },
  { 
    id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, 
    teaser: "A disciplina pode se transformar na sua principal ferramenta de escala.", 
    full: "A rotina caótica tende a ceder espaço para processos refinados. O segredo da prosperidade neste período pode ser a automação do que não exige sua criatividade, liberando energia para decisões de alto nível.",
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O ciclo favorece o fim da procrastinação. Você pode fazer em 4 horas o que costumava levar 10, liberando tempo focar no que dá dinheiro." },
      { icon: Crown, title: "Automação do Caos", text: "Processos complexos tendem a se tornar simples. A energia facilita a delegação e automação de tudo aquilo que drena o seu brilhantismo." },
      { icon: Shield, title: "Paz Mental Diária", text: "Você pode chegar ao fim do dia com a sensação de missão cumprida. A rotina tende a deixar de ser uma prisão para se tornar a base da sua liberdade." }
    ]
  },
  { 
    id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 65, unlocked: false, 
    teaser: "Pessoas influentes podem abrir portas restritas do seu mercado.", 
    full: "O ciclo pede que você selecione a dedo com quem compartilha seu tempo. O ano tende a ser marcado por círculos menores, porém muito mais poderosos e focados em gerar riqueza.",
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "Convites para ambientes exclusivos podem surgir do nada. Você tende a estar a um aperto de mãos de fechar os maiores contratos da sua vida." },
      { icon: Crown, title: "Parcerias de Elite", text: "O ano favorece associações com quem puxa o seu nível para cima. Pode ser o fim das relações que sugam energia e o início da colaboração real." },
      { icon: Shield, title: "Proteção por Contatos", text: "O famoso 'quem indica' ganha força. A sua rede de proteção pode ser o seu círculo de contatos, garantindo que portas se abram mais fácil." }
    ]
  },
  { 
    id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, 
    teaser: "O romance pede estabilidade e a construção de um futuro financeiro conjunto.", 
    full: "O foco tende a sair da intensidade desmedida e ir para a confiança mútua. O relacionamento pode se beneficiar muito de sonhos financeiros compartilhados e de uma parceria que traz segurança.",
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "A energia favorece a atração de pessoas maduras. É o ciclo ideal para atrair quem queira construir junto e parar de investir em relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "O foco no amor próprio ganha muita força. O ciclo favorece acabar com as concessões excessivas. Quem tende a ditar as regras do seu valor é você." },
      { icon: Shield, title: "Construção de Futuro", text: "O romance pode deixar de ser apenas atração física e se tornar uma base sólida para a vida familiar e realizações materiais conjuntas." }
    ]
  },
  { 
    id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", score: 55, unlocked: false, 
    teaser: "Você pode encontrar propósito real ao transformar ideias em valor material.", 
    full: "O seu legado tende a se tornar mais visível. A realização espiritual é potencializada quando você percebe que seus talentos podem criar uma base segura não só para você, mas para os outros.",
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O seu sexto sentido para negócios e decisões de vida pode atingir o ápice. Você tende a saber o caminho certo antes mesmo da lógica tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "O ciclo ajuda a dissipar crises existenciais. Você pode acordar sabendo o porquê faz o que faz, conectando o seu trabalho com um propósito maior." },
      { icon: Shield, title: "Paz de Espírito", text: "A energia favorece a criação de uma âncora interna que impede que o estresse externo te derrube. Você pode operar a partir de uma calma inabalável." }
    ]
  },
  { 
    id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, 
    teaser: "A manutenção física tende a ser a base para sustentar o teto patrimonial.", 
    full: "O corpo vai pedir constância. Cuidar da alimentação e do sono podem deixar de ser luxo e passar a ser o requisito fundamental para manter o pique exigido pelo sucesso material.",
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O vigor físico tem tudo para acompanhar a sua ambição mental. Sem cansaço crônico, você pode acessar a mesma energia que tinha anos atrás." },
      { icon: Crown, title: "Longevidade e Vigor", text: "O corpo tende a responder incrivelmente rápido a bons hábitos. Seu tônus pode melhorar e sua aparência passa a refletir saúde radiante." },
      { icon: Shield, title: "Corpo Blindado", text: "A imunidade ganha reforço contra o estresse. O seu sistema físico pode se tornar uma verdadeira fortaleza para aguentar o tranco do sucesso." }
    ]
  }
];

`;

    code = code.substring(0, startIndex) + newLifeAreas + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Modals added for simpler, non-deterministic yet punchy language.");
} else {
    console.log("Could not find start or end index.");
}
