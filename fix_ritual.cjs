const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const startIndex = code.indexOf('const LIFE_AREAS = [');
const endIndex = code.indexOf('];\n\nexport default function AppleResultPreview() {'); 

if (startIndex === -1) {
    console.log("ERRO: Nao achou LIFE_AREAS");
    process.exit(1);
}

const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    dna: {
      essencia: "O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de Dinheiro e Recursos, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.",
      metodo: "A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.",
      fase: "A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real."
    },
    ritual: {
      manha: { titulo: "O Despertar do Valor", texto: "Comece o dia frequentando o ambiente mais exclusivo que puder acessar nesta cidade. Peça um café premium. Aja, caminhe e respire como alguém que já faturou o seu maior objetivo do ano. O universo lê a sua postura física antes dos seus pensamentos." },
      tarde: { titulo: "Ancoragem Material", texto: "Compre um item de valor simbólico (uma caneta, um acessório, um livro de negócios) usando dinheiro físico. Este objeto será o seu amuleto de tração financeira pelos próximos 12 meses." },
      noite: { titulo: "Fechamento de Caixa", texto: "Escreva em um papel três fontes de renda ou negócios que você deseja destravar neste ano. Guarde este papel na carteira ou na capa do celular." },
      mantra: "Eu comando a minha autonomia. O dinheiro flui até mim não por sorte, mas como consequência inevitável da minha excelência."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "A energia favorece o faturamento e atrai novos clientes. O universo aqui não entrega por sorte, mas recompensa a sua coragem de faturar e expandir horizontes." },
      { icon: Crown, title: "Valorização do Trabalho", text: "A vibração do lugar convida à autoconfiança extrema. O cenário é perfeito para acabar com os descontos emocionais e cobrar o valor justo pelo seu talento." },
      { icon: Shield, title: "Estabilidade & Segurança", text: "O destino foca na organização e proteção do que é seu. Proteger o lucro ganha tanta força quanto fazê-lo acontecer, estancando vazamentos de energia e caixa." }
    ],
    timeline: [
      { phase: "Fase 1: Preparação de Terreno", period: "Meses 1 a 4", text: "O ciclo se inicia pedindo arrumação de casa. A energia favorece a revisão de preços, corte de gastos inúteis e o planejamento cirúrgico do seu funil de vendas. É a fase de fechar torneiras." },
      { phase: "Fase 2: Tração Magnética", period: "Meses 5 a 8", text: "Com a base arrumada, o seu magnetismo entra em potência máxima. Convites e propostas tendem a se materializar com mais facilidade. O cenário é ideal para fechar grandes contratos." },
      { phase: "Fase 3: Consolidação", period: "Meses 9 a 12", text: "A euforia da expansão cede lugar à segurança estrutural. O destino foca em transformar lucros isolados em previsibilidade financeira e blindagem de patrimônio." }
    ]
  },
  { 
    id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", score: 88, unlocked: false, 
    teaser: "A força deste destino impulsiona suas metas profissionais rumo ao topo.", 
    dna: {
      essencia: "O seu brilho pessoal exige protagonismo. No Trabalho, a vibração desta cidade garante que o seu magnetismo abra portas que diplomas sozinhos não abririam.",
      metodo: "A sua necessidade de excelência encontra o terreno fértil. O destino recompensa a sua capacidade de estruturar equipes, otimizar rotinas e liderar pelo exemplo prático.",
      fase: "O foco agora é consolidação. Não se trata mais de provar o seu valor para o mercado, mas de assumir a autoridade que você já construiu e colher os frutos financeiros disso."
    },
    ritual: {
      manha: { titulo: "Visualização do Topo", texto: "Vá ao centro financeiro ou empresarial da cidade. Observe o fluxo. Mande uma mensagem estratégica para alguém de alto nível do seu mercado, plantando uma semente sem pedir nada em troca." },
      tarde: { titulo: "Atualização de Status", texto: "Reserve 30 minutos em um café local para reescrever a sua biografia (LinkedIn, currículo ou apresentação pessoal). Eleve o tom. Remova a humildade excessiva." },
      noite: { titulo: "O Brinde da Autoridade", texto: "Tome um drink ou faça um jantar celebrando o cargo ou contrato que você AINDA não tem, mas que a energia do ano já começou a trazer." },
      mantra: "Eu ocupo o meu espaço por direito. A minha autoridade é inquestionável e o meu trabalho gera impacto irreplicável."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "O alinhamento abre caminho para que saltos de negócio apareçam com naturalidade. A sua autoridade ganha um palco iluminado diante dos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "A energia atrai pessoas buscando a sua direção. O cenário é propício para assumir o protagonismo da sua equipe ou mercado sem pedir licença pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "O universo ajuda a transformar sua carreira no seu maior ativo. O destino cria uma armadura de competência que te protege contra crises externas." }
    ],
    timeline: [
      { phase: "Fase 1: Estruturação de Autoridade", period: "Meses 1 a 4", text: "O início do ciclo não é sobre aparecer, mas sobre construir alicerces. A energia favorece o redesenho dos seus processos e a montagem do time que sustentará seu próximo nível." },
      { phase: "Fase 2: O Palco Iluminado", period: "Meses 5 a 8", text: "Sua competência atinge massa crítica. O cenário abre portas para visibilidade real diante de tomadores de decisão, tornando suas ideias o centro das atenções." },
      { phase: "Fase 3: Liderança Estabelecida", period: "Meses 9 a 12", text: "Você não precisa mais convencer ninguém do seu valor. A vibração consolida o seu nome como referência, atraindo convites sem que você precise forçar a prospecção." }
    ]
  },
  { 
    id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, 
    teaser: "A vibração da cidade transforma a sua marca pessoal em sinônimo de excelência.", 
    dna: {
      essencia: "Você nasceu para ser visto. Nesta cidade, a sua identidade se fortalece, e o universo te empurra para o centro do palco sem que você precise forçar a barra.",
      metodo: "A sua imagem passa a transmitir uma precisão cirúrgica. As pessoas confiam em você porque o seu brilho vem acompanhado de extrema competência e atenção aos detalhes.",
      fase: "A necessidade de aprovação externa desaparece. Você entra num ciclo onde a sua marca pessoal é pautada por quem você realmente é, e não pelo que esperam de você."
    },
    ritual: {
      manha: { titulo: "O Novo Espelho", texto: "Compre ou vista uma peça de roupa marcante logo pela manhã. Algo que a sua versão antiga teria medo ou vergonha de usar. Caminhe pelas ruas da cidade habitando essa nova pele." },
      tarde: { titulo: "Registro de Poder", texto: "Tire uma foto sua no local mais icônico ou bonito do destino. Não para postar, mas para guardar. Olhe para a foto e perceba a diferença na sua postura." },
      noite: { titulo: "Descarte de Rótulos", texto: "Escreva em um guardanapo três características ou medos que as pessoas associam a você e que você não aceita mais. Rasgue e jogue fora." },
      mantra: "A minha presença fala por si. Eu não me diminuo para caber em espaços que não honram a minha grandeza."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "A sensação ao pisar neste destino é de clareza absoluta de quem você é. A energia afasta a dúvida e garante que você entre em qualquer sala sabendo o seu valor." },
      { icon: Crown, title: "Posicionamento Premium", text: "O universo alinha a sua imagem ao alto valor. O magnetismo é tão forte que as pessoas costumam ler o seu sucesso antes mesmo de você abrir a boca." },
      { icon: Shield, title: "Fim da Autossabotagem", text: "A força do mapa destrava o medo da exposição. A energia pede que você pare de se encolher para caber em lugares pequenos e ocupe o seu espaço real." }
    ],
    timeline: [
      { phase: "Fase 1: Desconstrução e Limpeza", period: "Meses 1 a 4", text: "O universo pede uma limpa na sua imagem. É o momento perfeito para jogar fora identidades antigas, repensar seu estilo e abandonar rótulos que já não cabem mais." },
      { phase: "Fase 2: Magnestismo em Alta", period: "Meses 5 a 8", text: "A sua nova persona ganha força. A energia atrai olhares e parcerias, fazendo com que o mundo perceba o upgrade interno que você realizou nos meses anteriores." },
      { phase: "Fase 3: Segurança Inabalável", period: "Meses 9 a 12", text: "A sua identidade torna-se seu maior escudo protetor. A vibração da cidade garante que nenhuma crítica externa tenha força para balançar a sua confiança real." }
    ]
  },
  { 
    id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, 
    teaser: "O universo organiza o seu tempo para transformar disciplina na sua maior alavanca.", 
    dna: {
      essencia: "Até mesmo o seu dia a dia precisa ter a sua assinatura de criatividade. Aqui, a rotina não apaga o seu brilho, mas serve como combustível para você focar no que importa.",
      metodo: "O seu Ascendente está em casa. A energia local transforma o seu preciosismo em alta produtividade, ajudando a criar sistemas que funcionam quase no piloto automático.",
      fase: "O tempo se tornou seu recurso mais caro. A fase atual exige que você corte tudo aquilo que não traz retorno, blindando sua agenda contra distrações inúteis."
    },
    ritual: {
      manha: { titulo: "Auditoria do Tempo", texto: "Acorde sem usar alarmes ou redes sociais. O luxo do primeiro dia do seu ano solar deve ser dominar o próprio tempo e não responder à agenda dos outros." },
      tarde: { titulo: "O Ato de Delegar", texto: "Terceirize, pague ou delegue uma tarefa que você odeia fazer durante a viagem (ex: lavar roupa, carregar malas). Acostume o cérebro a comprar tempo." },
      noite: { titulo: "A Regra de Ouro", texto: "Defina uma única regra inquebrável para a sua rotina neste ano (ex: Não abrir o WhatsApp antes das 9h). Escreva na primeira página da sua agenda." },
      mantra: "Meu tempo é a minha moeda mais valiosa. A disciplina não me prende, ela é a base da minha liberdade absoluta."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O alinhamento dissolve a procrastinação. A energia favorece um estado de foco profundo, permitindo que você produza em 4 horas o que costumava levar 10." },
      { icon: Crown, title: "Automação do Caos", text: "O universo pede eficiência extrema. A vibração da cidade facilita a delegação de tarefas, libertando o seu tempo para decisões que realmente movem o ponteiro." },
      { icon: Shield, title: "Paz Mental Diária", text: "A sensação ao fim do dia é de vitória e missão cumprida. O destino transforma a rotina de uma prisão exaustiva para a verdadeira fundação da sua liberdade." }
    ],
    timeline: [
      { phase: "Fase 1: Mapeamento de Fugas", period: "Meses 1 a 4", text: "O momento favorece a identificação brutal de onde o seu tempo escorre pelo ralo. A energia ajuda a podar compromissos tóxicos e reuniões improdutivas." },
      { phase: "Fase 2: Engenharia de Tempo", period: "Meses 5 a 8", text: "Com o calendário limpo, a vibração acelera a implementação de sistemas e delegação inteligente. Processos complexos passam a rodar com fluidez natural." },
      { phase: "Fase 3: Ritmo de Cruzeiro", period: "Meses 9 a 12", text: "A rotina deixa de ser uma luta diária. O universo estabiliza os hábitos e você atinge a verdadeira liberdade: ter previsibilidade sem perder a paz." }
    ]
  },
  { 
    id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 65, unlocked: false, 
    teaser: "O magnetismo deste destino aproxima pessoas que abrem portas restritas do seu mercado.", 
    dna: {
      essencia: "Você naturalmente atrai as pessoas, mas aqui o seu magnetismo filtra quem realmente importa. A energia afasta sugadores e aproxima parceiros estratégicos.",
      metodo: "A sua rede de contatos ganha um filtro de utilidade mútua. O universo facilita alianças onde os dois lados entregam excelência, sem espaço para promessas vazias.",
      fase: "Você não quer mais 'fazer amigos por fazer'. A maturidade pede círculos de influência focados em crescimento, suporte mútuo e expansão de impérios."
    },
    ritual: {
      manha: { titulo: "Poda Estratégica", texto: "Deixe de seguir ou silencie 5 pessoas nas suas redes sociais que te sugam energia, reclamam muito ou não representam o futuro que você quer construir." },
      tarde: { titulo: "A Semente do Lobo", texto: "Vá a um evento, restaurante ou lobby de hotel onde o público é do nível que você deseja alcançar. Sente-se no bar. Apenas observe as conversas e a postura. Pertenca." },
      noite: { titulo: "A Ponte", texto: "Mande uma mensagem elogiando (de forma sincera e sem pedir favores) um contato profissional ou parceiro que você admira. Plante uma aliança." },
      mantra: "Eu atraio pessoas que puxam o meu nível para cima. Eu sento em mesas onde a colaboração substitui a competição."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "A vibração atrai encontros mágicos. Convites para ambientes exclusivos costumam surgir, colocando você a um aperto de mãos dos maiores contratos." },
      { icon: Crown, title: "Parcerias de Elite", text: "O destino eleva a sua frequência social. A energia atrai apenas associações com quem puxa o seu nível para cima, afastando relações que sugam o seu tempo." },
      { icon: Shield, title: "Proteção por Contatos", text: "O universo cria uma verdadeira rede de segurança ao seu redor através das suas conexões. O poder do 'quem indica' ganha força máxima a seu favor." }
    ],
    timeline: [
      { phase: "Fase 1: Poda Social", period: "Meses 1 a 4", text: "A vibração pede uma limpeza de contatos sugadores de energia. É o ciclo ideal para romper com parcerias desequilibradas de forma elegante e abrir espaço na agenda." },
      { phase: "Fase 2: Conexões Estratégicas", period: "Meses 5 a 8", text: "Mesas que antes pareciam inacessíveis abrem suas portas. O magnetismo aproxima mentores, aliados de alto nível e pessoas dispostas a jogar o seu jogo." },
      { phase: "Fase 3: O Círculo Blindado", period: "Meses 9 a 12", text: "A energia transforma conhecidos em parceiros de negócios sólidos. A sua rede vira um cinturão de segurança real, elevando o seu padrão de atuação para os próximos anos." }
    ]
  },
  { 
    id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, 
    teaser: "A energia pede estabilidade e transforma o romance em uma base forte para o futuro.", 
    dna: {
      essencia: "O seu Leão pede admiração mútua. No Amor, o destino afasta relações em que você precise se diminuir e atrai parcerias onde o seu brilho é celebrado e protegido.",
      metodo: "O romantismo encontra a praticidade. O universo favorece parceiros que trazem ordem, cuidado diário e que saibam construir uma vida a dois sem dramas desnecessários.",
      fase: "A fase de montanha-russa emocional já passou. O que você busca e atrai agora é paz, previsibilidade e alguém para ser o seu porto seguro nas conquistas da vida."
    },
    ritual: {
      manha: { titulo: "Auto-Romance Máximo", texto: "Trate a si mesmo como você gostaria que o melhor parceiro do mundo te tratasse hoje. Compre flores para si, faça um spa matinal. O universo reflete o seu próprio padrão." },
      tarde: { titulo: "A Âncora Visual", texto: "Se estiver com alguém, celebre as conquistas materiais e a parceria de vocês num jantar elegante. Se estiver solteiro, vá a um local romântico e habitue-se a estar confortável sendo o próprio prêmio." },
      noite: { titulo: "Limpeza de Histórico", texto: "Perdoe intimamente relacionamentos passados que não deram certo. Libere a raiva ou a culpa. Você precisa de espaço vazio no 'HD' para a energia de Casa 7 entrar." },
      mantra: "Eu aceito receber amor na mesma medida da minha dedicação. Eu me torno magnético ao focar no meu próprio brilho."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "O destino foca na atração de parcerias maduras. A energia é ideal para encontrar quem queira construir junto, cortando o desgaste com relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "A sensação de amor próprio se torna o seu maior escudo. O universo pede o fim das concessões excessivas, garantindo que você dite as regras do seu valor." },
      { icon: Shield, title: "Construção de Futuro", text: "A vibração transforma a atração física em raízes profundas. O cenário é perfeito para que o romance se torne uma base para realizações conjuntas." }
    ],
    timeline: [
      { phase: "Fase 1: Fim das Concessões", period: "Meses 1 a 4", text: "O destino exige a elevação dos seus padrões amorosos. A energia ajuda a encerrar padrões de submissão e atrai um senso de valor próprio inegociável." },
      { phase: "Fase 2: Magnetismo de Propósito", period: "Meses 5 a 8", text: "Com a confiança resgatada, o universo entra em fluxo para atrair parcerias que partilham a mesma direção, construindo alianças baseadas em admiração e suporte real." },
      { phase: "Fase 3: Raízes Profundas", period: "Meses 9 a 12", text: "O romance se transforma em fortaleza. A vibração solidifica o compromisso, eliminando a volatilidade e consolidando um terreno fértil de paz na vida a dois." }
    ]
  },
  { 
    id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", score: 55, unlocked: false, 
    teaser: "O universo conecta a sua essência com a capacidade de gerar valor no mundo material.", 
    dna: {
      essencia: "A sua luz interna ganha um propósito maior. O destino te lembra que o seu poder pessoal tem a missão de iluminar não só o seu caminho, mas o das pessoas ao redor.",
      metodo: "A espiritualidade deixa de ser mística e passa a ser prática. O universo alinha a sua intuição com ações calculadas, transformando insight em resultados concretos.",
      fase: "Você entende que o verdadeiro sucesso precisa ter alma. A maturidade espiritual foca em alinhar a sua ambição material com a sua paz de espírito diária."
    },
    ritual: {
      manha: { titulo: "Isolamento Fértil", texto: "Faça uma caminhada silenciosa de 30 minutos por algum parque ou templo da cidade, sem fones de ouvido. Deixe a intuição localizar as respostas que você estava buscando fora." },
      tarde: { titulo: "O Ato de Retribuição", texto: "A energia desta casa é ativada doando. Pague o café de alguém anonimamente, faça uma doação ou ajude um desconhecido. O fluxo universal responde imediatamente." },
      noite: { titulo: "A Carta ao Futuro", texto: "Escreva como se já tivesse passado 1 ano. Agradeça pelas superações e pelos bloqueios que foram retirados do seu caminho de forma misteriosa." },
      mantra: "Eu confio na inteligência invisível que orquestra os meus passos. A minha paz de espírito é inegociável."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O destino aguça o seu sexto sentido de forma inegável. A sensação é de saber o caminho exato antes mesmo que a mente lógica consiga tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "A vibração da cidade dissipa qualquer crise existencial. O universo te acorda com a certeza do porquê você faz o que faz, unindo carreira e alma." },
      { icon: Shield, title: "Paz de Espírito", text: "O alinhamento constrói um escudo invisível contra o ruído do mundo. A energia te ancora em um centro de calma que nenhum estresse externo consegue derrubar." }
    ],
    timeline: [
      { phase: "Fase 1: Silêncio Estratégico", period: "Meses 1 a 4", text: "A energia exige que você baixe o volume do mundo exterior. É um período essencial para a prática de meditação e reconexão profunda com a sua voz interna original." },
      { phase: "Fase 2: Intuição em Ação", period: "Meses 5 a 8", text: "A clareza espiritual ganha contornos práticos. O universo facilita que insights aparentemente irracionais se transformem em decisões precisas e estratégicas nos negócios e na vida." },
      { phase: "Fase 3: Alinhamento Absoluto", period: "Meses 9 a 12", text: "O fim da crise existencial. A vibração consolida a certeza interna do seu propósito, criando um escudo emocional tão forte que nenhum obstáculo externo consegue te desestabilizar." }
    ]
  },
  { 
    id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, 
    teaser: "A força deste destino pede um corpo firme para suportar o peso das suas ambições.", 
    dna: {
      essencia: "A sua vitalidade é naturalmente alta, mas aqui ela é direcionada para a manutenção da máquina. A energia foca em preservar o seu corpo para aguentar o teto do sucesso.",
      metodo: "O Virgem assume o controle absoluto da sua biologia. O universo favorece protocolos de biohacking, rotinas de sono e uma alimentação milimetricamente ajustada.",
      fase: "O corpo já não aceita abusos como antes. O seu momento de vida exige que o autocuidado seja tratado com a mesma prioridade e respeito que a sua conta bancária."
    },
    ritual: {
      manha: { titulo: "Choque Biológico", texto: "Pratique o ancoramento físico. Caminhe descalço, tome um banho gelado ou faça um treino intenso. Avise o seu corpo biológico que um novo ciclo superior começou." },
      tarde: { titulo: "Combustível de Elite", texto: "Faça uma refeição no melhor restaurante saudável que encontrar. Saboreie cada garfada como se estivesse injetando combustível de aviação na máquina que construirá o seu império." },
      noite: { titulo: "O Protocolo Noturno", texto: "Desligue as telas duas horas antes de dormir. O seu cérebro precisa resetar completamente na primeira noite neste destino." },
      mantra: "Meu corpo é o templo das minhas ambições. Eu invisto na minha biologia para que ela sustente a minha mente."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O magnetismo local impulsiona o seu vigor. A sensação de cansaço crônico cede espaço para uma energia limpa, acompanhando o ritmo da sua ambição mental." },
      { icon: Crown, title: "Longevidade e Vigor", text: "A vibração faz com que o seu corpo responda instantaneamente aos bons tratos. O universo recompensa seus novos hábitos com uma aparência de saúde radiante." },
      { icon: Shield, title: "Corpo Blindado", text: "A energia foca na sua imunidade. O destino transforma o seu sistema de defesa em uma verdadeira fortaleza, garantindo que a saúde acompanhe a sua escalada." }
    ],
    timeline: [
      { phase: "Fase 1: Diagnóstico e Ajuste", period: "Meses 1 a 4", text: "A vibração pede checagens precisas. A energia favorece identificar pequenas inflamações e ajustar a sua rotina de sono e alimentação para formar um platô firme de biologia." },
      { phase: "Fase 2: Biohacking e Vigor", period: "Meses 5 a 8", text: "Os novos hábitos começam a rodar no automático. O universo impulsiona uma vitalidade incomum, acabando com a névoa mental e fornecendo combustível limpo para suas conquistas." },
      { phase: "Fase 3: Fortaleza Imunológica", period: "Meses 9 a 12", text: "A sensação é de corpo blindado. O metabolismo entra no seu auge de performance e estabilidade, garantindo que a sua saúde consiga bancar integralmente a altura das suas ambições." }
    ]
  }
];
`;

code = code.substring(0, startIndex) + newLifeAreas + code.substring(endIndex);

// Add the Ritual Block to the JSX (Block 4) and shift Timeline to Block 5
const targetStr = `                      {/* BLOCO 4: A LINHA DO TEMPO (ACCORDION) */}`;

const newRitualBlock = `                      {/* BLOCO 4: O RITUAL DE ATIVAÇÃO (AS PRIMEIRAS 24 HORAS) */}
                      <div className="w-full mt-40 max-w-5xl mx-auto">
                        <div className="text-center mb-24 relative">
                          <span className="font-mono text-sm tracking-[0.3em] uppercase mb-4 block" style={{ color: currentActiveData.color }}>O Dia do Aniversário</span>
                          <h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tighter mb-6">O Protocolo de Ativação.</h2>
                          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            O roteiro prático e intencional do que você deve executar nas primeiras 24 horas para plugar sua energia nesta cidade.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                          {/* Manhã */}
                          <div className="bg-black/30 backdrop-blur-md border border-white/5 p-10 rounded-[32px] flex flex-col gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-10 -mt-10 transition-colors duration-500 group-hover:bg-opacity-20" style={{ backgroundColor: currentActiveData.color }} />
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                               <Sun className="w-6 h-6" style={{ color: currentActiveData.color }} />
                               <h3 className="font-bold text-xl uppercase tracking-widest text-white">Manhã</h3>
                            </div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">{currentActiveData.ritual?.manha.titulo}</h4>
                            <p className="text-white/60 text-lg font-light leading-relaxed">{currentActiveData.ritual?.manha.texto}</p>
                          </div>

                          {/* Tarde */}
                          <div className="bg-black/30 backdrop-blur-md border border-white/5 p-10 rounded-[32px] flex flex-col gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-10 -mt-10 transition-colors duration-500 group-hover:bg-opacity-20" style={{ backgroundColor: currentActiveData.color }} />
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                               <Clock className="w-6 h-6" style={{ color: currentActiveData.color }} />
                               <h3 className="font-bold text-xl uppercase tracking-widest text-white">Tarde</h3>
                            </div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">{currentActiveData.ritual?.tarde.titulo}</h4>
                            <p className="text-white/60 text-lg font-light leading-relaxed">{currentActiveData.ritual?.tarde.texto}</p>
                          </div>

                          {/* Noite */}
                          <div className="bg-black/30 backdrop-blur-md border border-white/5 p-10 rounded-[32px] flex flex-col gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full -mr-10 -mt-10 transition-colors duration-500 group-hover:bg-opacity-20" style={{ backgroundColor: currentActiveData.color }} />
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                               <Star className="w-6 h-6" style={{ color: currentActiveData.color }} />
                               <h3 className="font-bold text-xl uppercase tracking-widest text-white">Noite</h3>
                            </div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">{currentActiveData.ritual?.noite.titulo}</h4>
                            <p className="text-white/60 text-lg font-light leading-relaxed">{currentActiveData.ritual?.noite.texto}</p>
                          </div>
                        </div>

                        {/* Mantra de Ancoragem */}
                        <div className="mt-16 w-full p-12 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col items-center text-center">
                           <div className="absolute inset-0 opacity-10 blur-[80px]" style={{ backgroundColor: currentActiveData.color }} />
                           <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative z-10">
                              <Sparkles className="w-8 h-8" style={{ color: currentActiveData.color }} />
                           </div>
                           <span className="font-mono text-sm tracking-[0.2em] uppercase text-white/50 mb-6 relative z-10">Mantra de Ancoragem</span>
                           <h4 className="font-ps-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl relative z-10" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                             "{currentActiveData.ritual?.mantra}"
                           </h4>
                        </div>

                      </div>

                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

code = code.replace(targetStr, newRitualBlock);
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Ritual Block injected successfully.");
