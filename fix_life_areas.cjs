const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const startIndex = code.indexOf('const LIFE_AREAS = [');
let endIndex = code.indexOf('];', startIndex);

// We want to find the exact end of LIFE_AREAS array.
// The next declaration is const TIMELINE = [
endIndex = code.indexOf('const TIMELINE', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O dinheiro flui através da sua capacidade de atrair e materializar recursos.", 
    full: "O Brilho do Sol em Leão: Como leonino, seu valor pessoal está diretamente ligado à sua autonomia. Na Casa 2, seu magnetismo passa a se traduzir em valor monetário real. O Rigor do Ascendente em Virgem: Traz a mente analítica, o foco na eficiência e a disciplina diária, forçando você a olhar para planilhas e processos.",
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "Foco no aumento real de faturamento, novos clientes e atração de recursos reais. O dinheiro na Casa 2 não vem de sorte, vem da coragem de faturar e expandir os horizontes." },
      { icon: Crown, title: "Valorização do Trabalho", text: "Foco irrestrito na autoconfiança. É o momento exato de acabar com os descontos emocionais e auditar todos os seus serviços para cobrar o valor justo." },
      { icon: Shield, title: "Estabilidade & Segurança", text: "Foco prático em organização de caixa, corte de vazamentos invisíveis e reserva inteligente. Proteger o lucro é tão fundamental quanto fazê-lo acontecer." }
    ]
  },
  { 
    id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", score: 88, unlocked: false, 
    teaser: "Suas metas profissionais avançam focadas na escala de valor.", 
    full: "O seu crescimento profissional passa a exigir uma gestão de carreira impecável. Você começará a ser valorizado não apenas pelo esforço, mas pelo impacto financeiro que a sua expertise gera nos ambientes em que circula.",
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "Oportunidades de promoção ou saltos de negócio aparecem com naturalidade. A sua autoridade será reconhecida pelos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "As pessoas buscarão a sua direção. É o ciclo para assumir o protagonismo da sua equipe, empresa ou mercado, sem pedir desculpas pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "Você não será mais vulnerável a crises de mercado. A sua carreira se torna o seu maior ativo, protegido por competência extrema e resultados." }
    ]
  },
  { 
    id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, 
    teaser: "Sua marca pessoal se torna sinônimo de excelência e poder realizador.", 
    full: "A forma como o mundo te enxerga atinge um nível premium. Você assume uma postura de líder com resultados inquestionáveis. A sua marca pessoal passa a atrair parceiros dispostos a investir e multiplicar a sua visão.",
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "Você passará a entrar em qualquer sala de reunião sabendo exatamente o seu valor. A dúvida cede lugar a uma clareza absoluta de quem você é." },
      { icon: Crown, title: "Posicionamento Premium", text: "Sua imagem pessoal passa a comunicar alto valor. As pessoas lerão o seu sucesso antes mesmo de você abrir a boca para vender sua ideia." },
      { icon: Shield, title: "Fim da Autossabotagem", text: "Você para de se encolher para caber em lugares pequenos. O medo da exposição some, abrindo caminho para o reconhecimento." }
    ]
  },
  { 
    id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, 
    teaser: "A disciplina se transforma na sua principal ferramenta de escala.", 
    full: "A rotina caótica cede espaço para processos refinados. O segredo da sua prosperidade neste período será a automação do que não exige sua criatividade, liberando sua energia apenas para decisões de alto nível.",
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O fim da procrastinação. Você fará em 4 horas o que costumava levar 10, liberando tempo para viver e focar no que dá dinheiro." },
      { icon: Crown, title: "Automação do Caos", text: "Processos complexos se tornam simples. Você passará a delegar ou automatizar tudo aquilo que drena sua energia brilhante." },
      { icon: Shield, title: "Paz Mental Diária", text: "Chegar ao fim do dia com a sensação de missão cumprida. A rotina não será mais uma prisão, mas a espinha dorsal da sua liberdade." }
    ]
  },
  { 
    id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 65, unlocked: false, 
    teaser: "Pessoas influentes abrem portas restritas do seu mercado.", 
    full: "Você seleciona a dedo com quem compartilha seu tempo. O ano é marcado por círculos menores, porém muito mais poderosos e focados em gerar riqueza e criar estruturas sólidas de colaboração.",
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "Convites para ambientes exclusivos surgirão do nada. Você estará a um aperto de mãos dos maiores contratos da sua vida." },
      { icon: Crown, title: "Parcerias de Elite", text: "Associações apenas com quem puxa o seu nível para cima. Fim das relações de sangue-suga e início da colaboração ganha-ganha." },
      { icon: Shield, title: "Proteção por Contatos", text: "O famoso 'quem indica'. A sua rede de proteção será o seu círculo de contatos, garantindo que você nunca caia no ostracismo." }
    ]
  },
  { 
    id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, 
    teaser: "O romance pede estabilidade, respeito ao tempo e construção conjunta.", 
    full: "O foco sai da intensidade desmedida e vai para a confiança mútua. O relacionamento se beneficia de sonhos financeiros compartilhados e de uma parceria que traz segurança material e emocional para ambas as partes.",
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "Atração de pessoas maduras. É o ciclo para atrair pessoas que queiram construir junto, parando de investir energia em relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "Foco irrestrito no seu amor próprio. Acabar com as concessões e limites emocionais ultrapassados. Quem dita as regras do seu valor é você." },
      { icon: Shield, title: "Construção de Futuro", text: "Foco em planos de longo prazo. O romance deixa de ser atração passageira e se torna uma base sólida para a vida familiar e conquistas conjuntas." }
    ]
  },
  { 
    id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", score: 55, unlocked: false, 
    teaser: "Você encontra propósito ao transformar ideias abstratas em valor material.", 
    full: "O seu legado se torna visível. A realização espiritual acontece quando você percebe que a sua riqueza e os seus talentos estão criando não só conforto para você, mas uma base segura para os outros.",
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O seu sexto sentido para negócios e decisões de vida estará no ápice. Você saberá o caminho certo antes da lógica tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "O fim das crises existenciais. Você acorda sabendo o porquê faz o que faz, conectando o seu ganha-pão com algo muito maior." },
      { icon: Shield, title: "Paz de Espírito", text: "Uma âncora invisível que impede que o estresse externo te derrube. Você operará a partir de um centro de calma inabalável." }
    ]
  },
  { 
    id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, 
    teaser: "A manutenção física se torna a base para aguentar o teto patrimonial.", 
    full: "O corpo precisa de constância. Cuidar da alimentação e do sono deixam de ser luxo e passam a ser o requisito número um para você manter o pique exigido pelo volume de realizações materiais que este destino oferece.",
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O vigor físico que acompanha a sua ambição mental. Sem cansaço crônico no meio do dia, você terá a mesma energia de dez anos atrás." },
      { icon: Crown, title: "Longevidade e Vigor", text: "O corpo passa a responder incrivelmente rápido a bons hábitos. Seu tônus melhora e sua aparência reflete a saúde interna radiante." },
      { icon: Shield, title: "Corpo Blindado", text: "Fim da imunidade baixa causada por estresse. O seu sistema físico se tornará uma fortaleza para aguentar o tranco do sucesso." }
    ]
  }
];

`;

    code = code.substring(0, startIndex) + newLifeAreas + code.substring(endIndex);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("LIFE_AREAS successfully replaced with pillar data!");
} else {
    console.log("Could not find start or end index.");
}
