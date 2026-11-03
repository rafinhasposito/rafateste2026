const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Atualizar o LIFE_AREAS para ter o ritual simplificado
const startIndex = code.indexOf('const LIFE_AREAS = [');
const endIndex = code.indexOf('];\n\nexport default function AppleResultPreview() {'); 

const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    dna: {
      essencia: "O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de Dinheiro e Recursos, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.",
      metodo: "A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.",
      fase: "A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real."
    },
    ritual: "Compre um item simbólico de alto valor percebido (mesmo que pequeno) usando dinheiro físico. Durante a transação, afirme mentalmente que aquele é o último investimento do seu ciclo de escassez.",
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
    ritual: "Vá ao centro financeiro ou bairro de negócios da cidade. Caminhe observando o fluxo e mande uma mensagem estratégica para alguém de alto nível do seu mercado, plantando uma semente sem pedir nada em troca.",
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "O alinhamento abre caminho para que saltos de negócio apareçam com naturalidade. A sua autoridade ganha um palco iluminado diante dos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "A energia atrai pessoas buscando a sua direção. O cenário é propício para assumir o protagonismo da sua equipe ou mercado sem pedir licença pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "O universo ajuda a transformar sua carreira no seu maior ativo. O destino cria uma armadura de competência que te protege contra crises externas." }
    ],
    timeline: [
      { phase: "Fase 1: Estruturação de Autoridade", period: "Meses 1 a 4", text: "O início do ciclo não é sobre aparecer, mas sobre construir alicerces. A energia favorece o redesenho dos seus processes e a montagem do time que sustentará seu próximo nível." },
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
    ritual: "Vista ou compre uma peça de roupa que a sua versão antiga teria medo de usar. Caminhe pelas ruas da cidade habitando essa nova pele, sem justificar o seu estilo ou a sua presença para absolutamente ninguém.",
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
    ritual: "Desligue todos os alarmes e não abra as redes sociais nas primeiras 4 horas do seu dia. O luxo absoluto do seu primeiro dia de Revolução Solar deve ser dominar o próprio tempo.",
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
    ritual: "Mande mensagem para 3 pessoas que te inspiram ou com quem você quer criar laços de alto nível. Depois, sente-se no lobby de um hotel ou café elegante da cidade apenas para observar e pertencer àquele ambiente.",
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
    ritual: "Trate a si mesmo como você gostaria que o parceiro ideal te tratasse hoje. Reserve a melhor mesa, compre um presente para si e habite o estado de merecimento absoluto. O universo reflete o seu próprio padrão.",
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
    ritual: "Faça uma caminhada silenciosa de 30 minutos por um parque ou templo, sem fones de ouvido. Faça uma doação financeira anônima, por menor que seja, para ancorar a energia do fluxo universal da abundância.",
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
    ritual: "Comece o dia com um choque biológico (um banho muito gelado ou um treino intenso). Depois, faça a sua primeira refeição no melhor e mais limpo restaurante que encontrar, tratando o alimento como combustível premium.",
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

// Add the Ritual Block to the JSX (Block 4) before the Timeline
const targetStr = `                      {/* BLOCO 4: A LINHA DO TEMPO (ACCORDION) */}`;

const newRitualBlock = `                      {/* BLOCO 4: O RITUAL DAS 24 HORAS (Simplificado) */}
                      <div className="w-full mt-40 max-w-4xl mx-auto text-center relative z-10">
                        
                        <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full mb-8">
                           <Sparkles className="w-5 h-5" style={{ color: currentActiveData.color }} />
                           <span className="font-mono text-sm tracking-[0.2em] uppercase text-white/70">O Guia de Ancoragem</span>
                        </div>
                        
                        <h2 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">
                          O Ritual das 24 Horas.
                        </h2>
                        
                        <div className="relative mt-8">
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[140px] font-serif opacity-[0.03] leading-none select-none pointer-events-none" style={{ color: currentActiveData.color }}>"</div>
                           <p className="text-white/80 text-3xl md:text-5xl font-light leading-snug md:leading-tight max-w-4xl mx-auto relative z-10" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                             {currentActiveData.ritual}
                           </p>
                        </div>

                      </div>

                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}`;

code = code.replace(targetStr, newRitualBlock);
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Simplified Ritual Block injected successfully.");
