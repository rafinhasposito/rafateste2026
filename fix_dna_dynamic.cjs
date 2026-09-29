const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Atualizar o LIFE_AREAS para incluir o nó 'dna' para todas as 8 áreas
const startIndex = code.indexOf('const LIFE_AREAS = [');
const endIndex = code.indexOf('const TIMELINE', startIndex);

const newLifeAreas = `const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    dna: {
      essencia: "O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de Dinheiro e Recursos, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.",
      metodo: "A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.",
      fase: "A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real."
    },
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "A energia favorece o faturamento e atrai novos clientes. O universo aqui não entrega por sorte, mas recompensa a sua coragem de faturar e expandir horizontes." },
      { icon: Crown, title: "Valorização do Trabalho", text: "A vibração do lugar convida à autoconfiança extrema. O cenário é perfeito para acabar com os descontos emocionais e cobrar o valor justo pelo seu talento." },
      { icon: Shield, title: "Estabilidade & Segurança", text: "O destino foca na organização e proteção do que é seu. Proteger o lucro ganha tanta força quanto fazê-lo acontecer, estancando vazamentos de energia e caixa." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "O alinhamento abre caminho para que saltos de negócio apareçam com naturalidade. A sua autoridade ganha um palco iluminado diante dos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "A energia atrai pessoas buscando a sua direção. O cenário é propício para assumir o protagonismo da sua equipe ou mercado sem pedir licença pelo seu brilho." },
      { icon: Shield, title: "Blindagem Profissional", text: "O universo ajuda a transformar sua carreira no seu maior ativo. O destino cria uma armadura de competência que te protege contra crises externas." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "A sensação ao pisar neste destino é de clareza absoluta de quem você é. A energia afasta a dúvida e garante que você entre em qualquer sala sabendo o seu valor." },
      { icon: Crown, title: "Posicionamento Premium", text: "O universo alinha a sua imagem ao alto valor. O magnetismo é tão forte que as pessoas costumam ler o seu sucesso antes mesmo de você abrir a boca." },
      { icon: Shield, title: "Fim da Autossabotagem", text: "A força do mapa destrava o medo da exposição. A energia pede que você pare de se encolher para caber em lugares pequenos e ocupe o seu espaço real." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O alinhamento dissolve a procrastinação. A energia favorece um estado de foco profundo, permitindo que você produza em 4 horas o que costumava levar 10." },
      { icon: Crown, title: "Automação do Caos", text: "O universo pede eficiência extrema. A vibração da cidade facilita a delegação de tarefas, libertando o seu tempo para decisões que realmente movem o ponteiro." },
      { icon: Shield, title: "Paz Mental Diária", text: "A sensação ao fim do dia é de vitória e missão cumprida. O destino transforma a rotina de uma prisão exaustiva para a verdadeira fundação da sua liberdade." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "A vibração atrai encontros mágicos. Convites para ambientes exclusivos costumam surgir, colocando você a um aperto de mãos dos maiores contratos." },
      { icon: Crown, title: "Parcerias de Elite", text: "O destino eleva a sua frequência social. A energia atrai apenas associações com quem puxa o seu nível para cima, afastando relações que sugam o seu tempo." },
      { icon: Shield, title: "Proteção por Contatos", text: "O universo cria uma verdadeira rede de segurança ao seu redor através das suas conexões. O poder do 'quem indica' ganha força máxima a seu favor." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "O destino foca na atração de parcerias maduras. A energia é ideal para encontrar quem queira construir junto, cortando o desgaste com relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "A sensação de amor próprio se torna o seu maior escudo. O universo pede o fim das concessões excessivas, garantindo que você dite as regras do seu valor." },
      { icon: Shield, title: "Construção de Futuro", text: "A vibração transforma a atração física em raízes profundas. O cenário é perfeito para que o romance se torne uma base para realizações conjuntas." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O destino aguça o seu sexto sentido de forma inegável. A sensação é de saber o caminho exato antes mesmo que a mente lógica consiga tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "A vibração da cidade dissipa qualquer crise existencial. O universo te acorda com a certeza do porquê você faz o que faz, unindo carreira e alma." },
      { icon: Shield, title: "Paz de Espírito", text: "O alinhamento constrói um escudo invisível contra o ruído do mundo. A energia te ancora em um centro de calma que nenhum estresse externo consegue derrubar." }
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
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O magnetismo local impulsiona o seu vigor. A sensação de cansaço crônico cede espaço para uma energia limpa, acompanhando o ritmo da sua ambição mental." },
      { icon: Crown, title: "Longevidade e Vigor", text: "A vibração faz com que o seu corpo responda instantaneamente aos bons tratos. O universo recompensa seus novos hábitos com uma aparência de saúde radiante." },
      { icon: Shield, title: "Corpo Blindado", text: "A energia foca na sua imunidade. O destino transforma o seu sistema de defesa em uma verdadeira fortaleza, garantindo que a saúde acompanhe a sua escalada." }
    ]
  }
];

`;

code = code.substring(0, startIndex) + newLifeAreas + code.substring(endIndex);

// 2. Modificar o JSX do Bloco 3 para usar o currentActiveData.dna
const oldDnaBlock = `                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}
                      <div className="w-full mt-40">
                        
                        <div className="flex flex-col gap-32 md:gap-40 w-full relative">
                          
                          {/* Elemento 1: Essência (Left Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start text-left max-w-3xl relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              01. Sua Essência
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Sol em Leão.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de <strong className="text-white font-medium">{currentActiveData.label}</strong>, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.
                            </p>
                          </motion.div>

                          {/* Elemento 2: Método (Right Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-end text-left md:text-right max-w-3xl self-end relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              02. Seu Método
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Ascendente <br className="hidden md:block" />em Virgem.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.
                            </p>
                          </motion.div>

                          {/* Elemento 3: Fase Atual (Center Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-center text-left md:text-center max-w-4xl self-center relative z-10 mt-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              03. Fase Atual
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Maturidade.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real.
                            </p>
                          </motion.div>

                          {/* Fundo Atmosférico abstrato para amarrar os textos */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] opacity-10 pointer-events-none blur-[150px] -z-10" style={{ backgroundColor: currentActiveData.color }} />
                        </div>

                      </div>`;

const newDnaBlock = `                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}
                      <div className="w-full mt-40">
                        
                        <div className="flex flex-col gap-32 md:gap-40 w-full relative">
                          
                          {/* Elemento 1: Essência (Left Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start text-left max-w-3xl relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              01. Sua Essência
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Sol em Leão.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dna?.essencia}
                            </p>
                          </motion.div>

                          {/* Elemento 2: Método (Right Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-end text-left md:text-right max-w-3xl self-end relative z-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              02. Seu Método
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Ascendente <br className="hidden md:block" />em Virgem.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dna?.metodo}
                            </p>
                          </motion.div>

                          {/* Elemento 3: Fase Atual (Center Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-center text-left md:text-center max-w-4xl self-center relative z-10 mt-10"
                          >
                            <span className="font-mono uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              03. Fase Atual
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Maturidade.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dna?.fase}
                            </p>
                          </motion.div>

                          {/* Fundo Atmosférico abstrato para amarrar os textos */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] opacity-10 pointer-events-none blur-[150px] -z-10" style={{ backgroundColor: currentActiveData.color }} />
                        </div>

                      </div>`;

code = code.replace(oldDnaBlock, newDnaBlock);

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Made block 3 copy fully dynamic for all 8 houses.");
