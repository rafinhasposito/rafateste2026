export interface HouseData {
  id: number;
  name: string;
  emoji: string;
  cristal: string;
  img: string;
  label: string;
  regente: string;
  tags: string[];

  entender_10s: string;
  favorece: string[];
  tema_ano: string;
  ganhar: string;
  vida_real: string;
  dinheiro: string;
  amor: string;
  trabalho: string;
  vida_pessoal: string;
  como_aproveitar: string;
  cuidado: string;
  resumo: string;

  quiz: string[];
  radar: { dinheiro: number; amor: number; saude: number };
}

export const cityDatabase: Record<number, HouseData> = {
  1: {
    id: 1, name: "Casa 1 — Protagonismo e Novas Iniciativas", emoji: "⚡", cristal: "Granada", label: "Ação & Autonomia",
    img: "https://images.unsplash.com/photo-1587313083321-71fb5de3ea7b?w=400&q=80",
    regente: "Regência de Marte", tags: ["Iniciativa", "Autonomia", "Renovação"],
    entender_10s: "Este é um ano para focar em você, tomar as rédeas das suas decisões, renovar seu visual e iniciar projetos pessoais com muito mais disposição e autonomia.",
    favorece: [
      "Tomar decisões importantes de forma independente",
      "Aumento perceptível de disposição física e vitalidade",
      "Tirar projetos pessoais do papel por iniciativa própria",
      "Renovar sua imagem pública, estilo e autocuidado",
      "Conquistar mais independência de forma real"
    ],
    tema_ano: "Seu ano gira em torno de você, da sua independência, coragem e da sua capacidade de se reinventar.",
    ganhar: "Mais autoconfiança no dia a dia, clareza sobre o que você quer para os próximos anos e energia física para realizar suas metas.",
    vida_real: "Você sentirá mais vontade de iniciar novos hábitos de saúde, mudar o visual, começar projetos de forma solo, dizer não a situações que te limitavam e investir tempo em si mesma.",
    dinheiro: "O retorno financeiro dependerá diretamente da sua iniciativa e esforço pessoal. Projetos criados, liderados ou executados de forma solo por você têm mais espaço para crescer do que parcerias onde você fica apagada.",
    amor: "O amor-próprio é a sua maior força de atração. Para solteiras, é um ótimo ano porque sua energia pessoal estará em destaque. Em relacionamentos, você exigirá mais respeito à sua privacidade e ao seu espaço; dinâmicas muito dependentes enfrentarão cobranças saudáveis.",
    trabalho: "Momento ideal para liderar projetos, assumir novas funções, lançar novos rumos ou iniciar um negócio próprio. Suas decisões e resultados serão mais notados por chefes ou clientes.",
    vida_pessoal: "Internamente, você sentirá mais força de vontade. A disposição para cuidar de si mesma aumenta, reduzindo a sensação de sobrecarga causada por carregar problemas de terceiros.",
    como_aproveitar: "Cuide da sua saúde física, faça as pazes com seu espelho, mude algo que deseja na aparência, assuma riscos calculados e tome decisões importantes sem esperar a aprovação dos outros.",
    cuidado: "Agir com individualismo excessivo, perder a paciência com o ritmo mais lento das outras pessoas ou tomar atitudes impulsivas demais sem planejar.",
    resumo: "Se você quer focar em si mesma, vencer a estagnação e recuperar o controle sobre suas próprias escolhas, esta é a melhor Casa para escolher.",
    quiz: [
      "Tomei decisões corajosas que priorizaram a minha própria evolução.",
      "Iniciei algo novo — um projeto, hábito ou caminho que me representava.",
      "Senti-me mais confiante e vitalizado(a) do que nos anos anteriores."
    ],
    radar: { dinheiro: 40, amor: 55, saude: 90 }
  },
  2: {
    id: 2, name: "Casa 2 — Dinheiro, Valor e Segurança", emoji: "💰", cristal: "Pirita", label: "Dinheiro & Bens",
    img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=400&q=80",
    regente: "Regência de Vênus", tags: ["Finanças", "Recursos", "Segurança"],
    entender_10s: "Este é um ano para melhorar sua relação com o dinheiro, organizar suas contas, aumentar sua renda e construir mais estabilidade material.",
    favorece: [
      "Aumentar seus ganhos financeiros e faturamento",
      "Negociar melhores contratos, tarifas ou salários",
      "Criar e consolidar novas fontes de receita",
      "Organizar dívidas, despesas e investimentos",
      "Ter mais segurança e estabilidade financeira real"
    ],
    tema_ano: "Seu ano gira em torno de dinheiro, valor pessoal, segurança material e produtividade.",
    ganhar: "Mais clareza para gerir o que ganha, capacidade de planejar compras importantes de forma segura e uma rotina muito mais produtiva.",
    vida_real: "Você sentirá necessidade de rever seus preços, buscar novas formas de rentabilizar seus talentos, comprar bens de valor duradouro, organizar seu orçamento e focar em projetos que tragam lucros tangíveis.",
    dinheiro: "É o assunto principal do seu ciclo. O ano facilita a atração de recursos, mas exige esforço real e organização prática. Não é hora de viver de sonhos e idealismos, mas sim de focar no que dá resultado real e palpável.",
    amor: "Não é uma Casa focada em romances e paixões intensas. No amor, você buscará estabilidade. Dinheiro, moradia, contas conjuntas e planos futuros de patrimônio ganham importância no relacionamento.",
    trabalho: "O trabalho ganha peso pelo retorno financeiro direto que ele traz. É um bom momento para pedir aumento, procurar clientes melhores, cobrar de forma justa pelo seu serviço e mudar a sua forma de gerir o seu negócio.",
    vida_pessoal: "Internamente, você desejará mais segurança e pé no chão. Ter uma reserva financeira estruturada trará a calma mental necessária para você render e viver melhor.",
    como_aproveitar: "Revise seus preços, crie novas formas de rentabilizar suas habilidades, organize suas planilhas de forma realista e evite desperdícios financeiros.",
    cuidado: "O medo de escassez que impede investimentos necessários no seu crescimento, ou o oposto: gastar por impulso para compensar carências emocionais.",
    resumo: "Se você quer organizar as finanças, aumentar seus ganhos de trabalho e consolidar sua segurança material, esta é a melhor Casa para escolher.",
    quiz: [
      "Consegui aumentar minha renda ou patrimônio de forma organizada.",
      "Tomei decisões financeiras práticas que me trouxeram segurança.",
      "Cobrei um valor mais justo pelo meu trabalho e talento."
    ],
    radar: { dinheiro: 95, amor: 50, saude: 45 }
  },
  3: {
    id: 3, name: "Casa 3 — Comunicação, Estudos e Contatos", emoji: "📡", cristal: "Ágata Azul", label: "Vendas & Contatos",
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
    regente: "Regência de Mercúrio", tags: ["Comunicação", "Vendas", "Estudos"],
    entender_10s: "Este é um ano de movimento e aprendizado prático, onde sua fala, sua escrita e sua capacidade de dialogar vão ajudar a abrir portas de negócios e parcerias.",
    favorece: [
      "Vendas, reuniões e negociações de serviços",
      "Fazer novos contatos e networking útil",
      "Cursos rápidos, leituras e aprendizados práticos",
      "Viagens curtas frequentes a trabalho ou lazer",
      "Uso mais estratégico e dinâmico de redes sociais"
    ],
    tema_ano: "Seu ano gira em torno de comunicação, trânsito de ideias, negociações e interações com quem está ao seu redor.",
    ganhar: "Mais facilidade para apresentar suas ideias, agilidade para aprender assuntos novos e uma rede de contatos mais ampla.",
    vida_real: "Você se verá escrevendo mais, marcando reuniões, fazendo pequenas viagens, comprando livros, iniciando cursos curtos e usando o celular de forma muito mais focada.",
    dinheiro: "O dinheiro vem de sua capacidade de comunicar, negociar e intermediar. Vendas, palestras, serviços prestados ou atividades comerciais ganham um impulso.",
    amor: "A afinidade mental ganha peso. Você vai querer alguém com quem possa conversar bastante. O flerte acontece pelas palavras, mensagens e encontros animados.",
    trabalho: "Muito favorável se você trabalha com vendas, marketing, ensino, tecnologia ou atendimento ao público. A rotina será mais rápida, com várias coisas acontecendo ao mesmo tempo.",
    vida_pessoal: "Sua mente estará muito mais desperta. Isso traz curiosidade para resolver problemas, mas também pede que você encontre momentos para desligar e não se esgotar.",
    como_aproveitar: "Escreva mais, exponha suas ideias, puxe assunto com pessoas que não conhece, faça cursos para adquirir habilidades novas e responda e-mails com mais agilidade.",
    cuidado: "Dispersão ao tentar aprender muitas coisas e não focar em nada, participar de fofocas ou prometer prazos e entregas que não vai conseguir cumprir.",
    resumo: "Se você quer melhorar sua forma de se expressar, vender mais, fazer networking e aprender coisas novas rapidamente, esta é a melhor Casa.",
    quiz: [
      "Usei minha comunicação de forma ativa para resolver problemas ou vender.",
      "Fiz novos contatos que ajudaram nos meus objetivos.",
      "Estudei assuntos práticos ou li muito mais do que o normal."
    ],
    radar: { dinheiro: 65, amor: 60, saude: 50 }
  },
  4: {
    id: 4, name: "Casa 4 — Lar, Família e Raízes", emoji: "🏡", cristal: "Quartzo Rosa", label: "Lar & Imóveis",
    img: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=400&q=80",
    regente: "Regência da Lua", tags: ["Família", "Imóveis", "Conforto"],
    entender_10s: "Este é um ano mais focado para dentro, ideal para organizar sua casa, cuidar da família e resolver pendências da sua vida particular para ter mais paz.",
    favorece: [
      "Mudanças de casa, compra, venda ou reforma de imóveis",
      "Resolver pendências familiares e se aproximar dos parentes",
      "Criar uma rotina de trabalho em casa (home office)",
      "Descansar e recuperar sua estabilidade emocional",
      "Deixar o seu ambiente físico mais confortável e seguro"
    ],
    tema_ano: "Seu ano gira em torno da sua casa, vida privada, relações familiares e sensação de conforto.",
    ganhar: "Mais acolhimento no dia a dia, melhorias no lugar onde você vive e a tranquilidade de resolver velhas questões do passado.",
    vida_real: "Você sentirá mais vontade de ficar em casa, comprar móveis, cozinhar, passar tempo com os pais, investir no seu quarto ou cuidar do seu jardim.",
    dinheiro: "Ganhos podem vir de atividades feitas a partir de casa, vendas imobiliárias ou apoio familiar. É um ótimo período para economizar e reduzir gastos com o estilo de vida 'na rua'.",
    amor: "As relações buscam aconchego. Programas em casa serão mais atrativos que grandes festas. Se já tem alguém, é um bom ano para morar junto ou melhorar a casa do casal.",
    trabalho: "Seu desejo profissional pode estar mais voltado para ter flexibilidade. É um momento melhor para o trabalho remoto ou para quem deseja construir uma base própria e mais estável de operações.",
    vida_pessoal: "Você sentirá necessidade de mais recolhimento e privacidade. A vida social perde o brilho em troca do descanso, e as lembranças do passado podem surgir para serem finalmente curadas.",
    como_aproveitar: "Organize e decore seu espaço físico, converse com sua família, invista na segurança do seu lar e tire um tempo para recarregar as energias longe do barulho externo.",
    cuidado: "Ficar isolado(a) demais do mundo, remoer tristezas do passado ou carregar os problemas da família nas suas próprias costas.",
    resumo: "Se você quer melhorar o lugar onde mora, focar na família ou buscar mais conforto e estabilidade interna, esta é a Casa ideal.",
    quiz: [
      "Foquei na minha casa, fazendo reformas ou mudanças importantes.",
      "Resolvi questões de família que estavam pendentes.",
      "Senti necessidade de ficar mais recluso(a) para me cuidar emocionalmente."
    ],
    radar: { dinheiro: 35, amor: 75, saude: 65 }
  },
  5: {
    id: 5, name: "Casa 5 — Prazer, Criatividade e Lazer", emoji: "🎭", cristal: "Pedra do Sol", label: "Romances & Hobbies",
    img: "https://images.unsplash.com/photo-1586782294158-b1129b0f44de?w=400&q=80",
    regente: "Regência do Sol", tags: ["Criatividade", "Diversão", "Autoexpressão"],
    entender_10s: "Este é um ano para redescobrir o que te dá prazer, investir em hobbies criativos, cuidar da sua aparência e trazer mais leveza para a sua rotina.",
    favorece: [
      "Expressar seu lado criativo e fazer coisas que gosta",
      "Viver romances interessantes e paqueras",
      "Lidar com filhos, crianças ou engravidar",
      "Voltar a frequentar lugares de lazer e entretenimento",
      "Aumentar a autoconfiança e a vontade de se cuidar"
    ],
    tema_ano: "Seu ano gira em torno de lazer, criatividade, romances e expressão da sua própria identidade.",
    ganhar: "Mais alegria no dia a dia, ideias criativas para resolver problemas e uma vida social e afetiva mais ativa.",
    vida_real: "Você terá vontade de sair mais, se arrumar, começar um curso de algo que é puramente hobby, ir a festas, marcar encontros e fazer coisas sem a obrigação de serem 'produtivas'.",
    dinheiro: "Ganhos podem surgir ao usar seus talentos naturais ou através de especulações moderadas, mas cuidado com riscos excessivos. Projetos que dependem de criatividade e originalidade são os mais favorecidos.",
    amor: "É uma das melhores casas para conhecer pessoas. Se está solteiro(a), seu magnetismo atrairá atenção. Se está com alguém, a dica é reacender a paixão fazendo programas divertidos e românticos juntos.",
    trabalho: "Se o seu trabalho permite originalidade e você precisa ser o centro das atenções, será um período excelente. Projetos burocráticos ou mecânicos podem se tornar entediantes.",
    vida_pessoal: "A energia é de expansão e otimismo. A sensação de que a vida é só pagar boletos diminui, dando espaço para uma vontade de aproveitar o momento presente.",
    como_aproveitar: "Tire tempo para se divertir sem culpa, marque encontros, cuide de si mesmo(a), retome aquele hobby que você abandonou e tente colocar seu toque pessoal no que você produz.",
    cuidado: "Gastar demais com coisas desnecessárias apenas por vaidade, se envolver em dramas amorosos ou agir com muito ego nas relações profissionais.",
    resumo: "Se você quer voltar a se divertir, melhorar sua vida amorosa, usar mais a criatividade e aproveitar o lado bom da vida, escolha esta Casa.",
    quiz: [
      "Dediquei mais tempo a hobbies, lazer ou projetos criativos.",
      "Vivi momentos de romance e alegria intensa.",
      "Voltei a me sentir bonito(a), confiante e de bem com a vida."
    ],
    radar: { dinheiro: 45, amor: 90, saude: 55 }
  },
  6: {
    id: 6, name: "Casa 6 — Saúde, Rotina e Produtividade", emoji: "⚙️", cristal: "Jaspe Verde", label: "Saúde & Organização",
    img: "https://images.unsplash.com/photo-1614002167150-f1db1e723cc7?w=400&q=80",
    regente: "Regência de Mercúrio", tags: ["Saúde", "Rotina", "Trabalho Diário"],
    entender_10s: "Este é um ano focado em colocar a sua vida em ordem, cuidando rigorosamente da saúde, da alimentação e organizando sua rotina de trabalho.",
    favorece: [
      "Organizar sua agenda e o dia a dia",
      "Iniciar dieta, exercícios físicos e fazer exames",
      "Aumentar a produtividade no trabalho",
      "Contratar ou treinar pessoas que te ajudam na rotina",
      "Limpar hábitos prejudiciais e desorganização"
    ],
    tema_ano: "Seu ano gira em torno de saúde preventiva, organização prática, rotina e dedicação ao trabalho diário.",
    ganhar: "Um corpo com mais disposição e menos dores, uma rotina que funciona sem estresse e a sensação de dever cumprido todos os dias.",
    vida_real: "Você se pegará comprando organizadores, indo a médicos, adotando novas planilhas, mudando sua alimentação, limpando armários e focando muito nas pequenas tarefas do trabalho.",
    dinheiro: "O foco aqui não é ficar milionário da noite para o dia, mas sim manter a renda através de esforço contínuo. Melhorar sua eficiência e evitar gastos com desperrisos serão fundamentais.",
    amor: "Os relacionamentos se fortalecem com o companheirismo prático. Ajudar o parceiro a resolver problemas do dia a dia e dividir as tarefas vai valer mais do que surpresas românticas.",
    trabalho: "A carga de trabalho costuma aumentar. Será preciso foco em entregar com qualidade e melhorar processos. É a fase de suar a camisa, resolver pepinos e mostrar serviço real.",
    vida_pessoal: "Pode haver certa monotonia, pois o foco está nas obrigações. A paz de espírito virá de ter o ambiente limpo, as contas em dia e a saúde bem cuidada.",
    como_aproveitar: "Marque seus médicos, invista na sua academia, elimine tarefas que não dão resultado, mantenha sua mesa de trabalho limpa e durma as horas necessárias.",
    cuidado: "O perfeccionismo exagerado, o excesso de trabalho que leva ao cansaço extremo (burnout) e a tendência a criticar demais as pessoas ao seu redor.",
    resumo: "Se você precisa organizar a vida, cuidar mais da sua saúde e tornar o seu trabalho do dia a dia mais produtivo, esta é a Casa certa.",
    quiz: [
      "Mudei meus hábitos alimentares, comecei a treinar ou cuidei da saúde.",
      "Coloquei a rotina em ordem e fiquei mais organizado(a).",
      "Trabalhei bastante, focando na qualidade e nos detalhes do dia a dia."
    ],
    radar: { dinheiro: 55, amor: 40, saude: 95 }
  },
  7: {
    id: 7, name: "Casa 7 — Parcerias, Relacionamentos e Contratos", emoji: "🤝", cristal: "Lápis Lazúli", label: "Casamento & Acordos",
    img: "https://images.unsplash.com/photo-1605330366627-e43598db44a3?w=400&q=80",
    regente: "Regência de Vênus", tags: ["Casamento", "Sociedades", "Contratos"],
    entender_10s: "Este é um ano em que você precisará lidar muito mais com as outras pessoas, sendo excelente para fechar acordos, oficializar uniões ou encontrar parceiros.",
    favorece: [
      "Casar, morar junto ou oficializar o relacionamento",
      "Formar sociedades profissionais",
      "Fechar contratos importantes de prestação de serviços",
      "Atender mais clientes de forma direta",
      "Resolver conflitos legais ou jurídicos por meio de acordos"
    ],
    tema_ano: "Seu ano gira em torno dos seus relacionamentos sérios, parcerias de trabalho e da capacidade de negociar com os outros.",
    ganhar: "Pessoas dispostas a ajudar nos seus projetos, um parceiro mais comprometido e oportunidades comerciais que vêm através de outras pessoas.",
    vida_real: "Você gastará mais tempo conversando sobre as vontades do seu parceiro, negociando propostas de trabalho, assinando documentos, ouvindo clientes ou ajustando as coisas a dois.",
    dinheiro: "Ganhos podem surgir através de contratos sólidos ou ao formar uma parceria com alguém cujas habilidades complementam as suas. Tentar resolver tudo sozinho pode estagnar as finanças.",
    amor: "Se está solteiro(a), a chance de iniciar um namoro sério aumenta consideravelmente. Se está em um relacionamento, é o momento para dar um passo adiante, como oficializar, casar ou alinhar os planos do casal.",
    trabalho: "Muito foco no atendimento direto a clientes e parceiros. Boa época para buscar um sócio. Lembre-se: o sucesso será decidido pela sua habilidade de agradar o outro sem perder seus direitos.",
    vida_pessoal: "Você vai sentir que as decisões precisam ser tomadas em conjunto. A dependência (no bom sentido) de terceiros vai te ensinar diplomacia e flexibilidade.",
    como_aproveitar: "Escute as pessoas, busque parceiros para o que você não consegue fazer sozinho, não brigue por orgulho e seja justo(a) nas suas negociações.",
    cuidado: "Aceitar sociedades ou contratos ruins apenas para evitar discussões, focar tanto no outro a ponto de esquecer suas próprias necessidades e entrar em dependência emocional.",
    resumo: "Se você quer casar, formar uma sociedade ou atrair pessoas parceiras para ajudar nos seus projetos, esta Casa vai abrir essas portas.",
    quiz: [
      "Assumi um compromisso sério no amor ou formei uma sociedade.",
      "Aprendi a ceder, negociar e conviver melhor com as pessoas.",
      "Assinei contratos importantes que trouxeram melhorias reais."
    ],
    radar: { dinheiro: 60, amor: 95, saude: 40 }
  },
  8: {
    id: 8, name: "Casa 8 — Transições, Desapego e Profundidade", emoji: "🔥", cristal: "Obsidiana", label: "Mudanças & Dinheiro Extra",
    img: "https://images.unsplash.com/photo-1615568165038-d63604f378a5?w=400&q=80",
    regente: "Regência de Plutão", tags: ["Transições", "Desapego", "Dinheiro Conjunto"],
    entender_10s: "Este é um ano de transformações mais profundas, onde você vai encerrar ciclos que não funcionam mais e lidar de perto com o dinheiro e os recursos dos outros.",
    favorece: [
      "Quitar dívidas, conseguir empréstimos ou negociar financiamentos",
      "Lidar com partilhas, heranças ou questões burocráticas financeiras",
      "Fazer mudanças psicológicas, como iniciar terapia",
      "Cortar de vez pessoas ou situações que te faziam mal",
      "Aumentar a intimidade e a confiança nos relacionamentos"
    ],
    tema_ano: "Seu ano gira em torno de grandes mudanças internas, dinheiro compartilhado e a coragem de desapegar do passado.",
    ganhar: "Mais força emocional, resolução de pendências financeiras complexas e libertação de medos e inseguranças antigas.",
    vida_real: "Você se verá organizando impostos, negociando dívidas, lidando com o fim de certas fases, tendo conversas muito profundas e perdendo a paciência com coisas superficiais.",
    dinheiro: "A atenção não está no seu salário mensal, mas em quantias de outras fontes: acertos de contas, indenizações, heranças, dinheiro do sócio/cônjuge ou aprovação de crédito.",
    amor: "As relações exigirão confiança total e entrega. É a fase de ir para o tudo ou nada, aprofundando o vínculo. Superficialidade pode gerar atritos e cobranças.",
    trabalho: "Não é um ano para mudanças corriqueiras, mas sim para finalizar projetos grandes e reestruturar sua forma de trabalhar. Pode haver oportunidades em gestão financeira ou análise de dados profundos.",
    vida_pessoal: "O ano pode trazer crises existenciais passageiras que servem para jogar fora o 'lixo mental'. Você sai deste ciclo muito mais forte e maduro(a).",
    como_aproveitar: "Pague suas dívidas se possível, encare seus medos de frente, não tenha receio de terminar ciclos ruins e faça uma faxina na sua vida e na sua casa.",
    cuidado: "Sentimentos de posse, brigas ou conflitos envolvendo dinheiro com familiares/sócios e uma tendência a guardar mágoas em silêncio.",
    resumo: "Se você está disposto(a) a fazer grandes mudanças internas, desapegar do que não serve mais e organizar a parte mais complexa da sua vida financeira, escolha esta Casa.",
    quiz: [
      "Encerrei ciclos difíceis e deixei o passado para trás.",
      "Resolvi questões complexas de dinheiro, dívidas ou heranças.",
      "Aprofundei muito minha intimidade com alguém de confiança."
    ],
    radar: { dinheiro: 70, amor: 45, saude: 50 }
  },
  9: {
    id: 9, name: "Casa 9 — Novos Horizontes, Estudos e Viagens", emoji: "🦉", cristal: "Ametista", label: "Viagens & Estudos",
    img: "https://images.unsplash.com/photo-1562916843-157945d81bba?w=400&q=80",
    regente: "Regência de Júpiter", tags: ["Viagens", "Estudos", "Novos Horizontes"],
    entender_10s: "Este é um ano em que você sentirá necessidade de expandir sua visão de mundo, seja estudando algo que não conhecia, viajando ou resolvendo questões legais.",
    favorece: [
      "Realizar viagens longas ou para lugares inéditos",
      "Iniciar faculdade, pós-graduação, idiomas ou cursos densos",
      "Resolver processos judiciais de maneira mais favorável",
      "Lidar com estrangeiros ou assuntos fora da sua região",
      "Encontrar um novo propósito e ser mais otimista"
    ],
    tema_ano: "Seu ano gira em torno de expansão geográfica, estudos aprofundados, busca por sentido e otimismo.",
    ganhar: "Uma visão muito mais ampla e positiva sobre a vida, além de oportunidades de crescimento pessoal através do conhecimento.",
    vida_real: "Você se pegará olhando preços de passagens, pesquisando cursos novos, lidando com advogados para destravar processos, ensinando pessoas ou participando de questões religiosas ou filosóficas.",
    dinheiro: "As chances financeiras estão ligadas a outras cidades ou países, assim como à área acadêmica ou a ganhos vindos da resolução de um processo legal. Pensar pequeno não trará retorno.",
    amor: "Se está solteiro(a), há a possibilidade de conhecer alguém de fora (outra cidade, país) ou em um ambiente acadêmico/espiritual. Se está em um relacionamento, o que une vocês são viagens e planos grandiosos de futuro.",
    trabalho: "Você pode sentir falta de propósito no trabalho atual caso ele seja muito repetitivo. Excelente momento para buscar capacitação de longo prazo, ensinar ou atuar em novos mercados e cidades.",
    vida_pessoal: "O ano é marcado por uma sensação renovada de esperança. Você começa a perceber que os problemas antigos ficaram pequenos diante de um mundo tão vasto a ser explorado.",
    como_aproveitar: "Aprenda um novo idioma, viaje para longe, estude assuntos complexos, procure estar perto de pessoas de culturas diferentes e resolva suas pendências jurídicas.",
    cuidado: "O excesso de confiança achando que as coisas se resolvem sozinhas, gastos impulsivos com viagens mal planejadas e achar que sempre é o(a) dono(a) da verdade.",
    resumo: "Se você quer voltar a estudar com foco, fazer viagens mais distantes, lidar com assuntos legais ou encontrar motivação para o futuro, esta é a Casa ideal.",
    quiz: [
      "Viajei ou tive bastante contato com pessoas e assuntos de fora.",
      "Estudei profundamente um assunto, curso longo ou filosofia de vida.",
      "Senti muito otimismo e busquei um propósito maior para o dia a dia."
    ],
    radar: { dinheiro: 50, amor: 55, saude: 60 }
  },
  10: {
    id: 10, name: "Casa 10 — Carreira, Imagem Pública e Responsabilidades", emoji: "👑", cristal: "Olho de Tigre", label: "Carreira & Responsabilidade",
    img: "https://images.unsplash.com/photo-1587313264448-f0275525531b?w=400&q=80",
    regente: "Regência de Saturno", tags: ["Carreira", "Reconhecimento", "Responsabilidade"],
    entender_10s: "Este é um ano em que você sairá dos bastidores para o palco. A carreira será o grande foco, trazendo muito trabalho e também as recompensas desse esforço.",
    favorece: [
      "Ser reconhecido(a) e valorizado(a) no trabalho",
      "Assumir cargos de chefia ou maiores responsabilidades",
      "Conseguir aquele emprego ou promoção desejada",
      "Construir ou melhorar sua reputação e imagem pública",
      "Tornar suas metas de vida mais sólidas e focadas"
    ],
    tema_ano: "Seu ano gira em torno de evolução profissional, reputação, esforço focado e realizações de longo prazo.",
    ganhar: "Respeito profissional, segurança na sua carreira e a sensação de estar construindo algo para o seu futuro.",
    vida_real: "Você vai trabalhar mais, assumir tarefas importantes, cuidar muito mais do seu lado profissional (como melhorar seu currículo ou perfil no LinkedIn), e a opinião de chefes ou pessoas mais velhas terá grande peso.",
    dinheiro: "A recompensa financeira não surge por 'sorte', e sim pelo suor e competência do trabalho entregue ao longo do tempo. É quando você finalmente cobra o preço por ter persistido na carreira.",
    amor: "Os relacionamentos tendem a ficar mais sérios e as pessoas reparam se o parceiro(a) compartilha das mesmas ambições de futuro. Você não terá muita energia para romances dramáticos que atrapalhem o seu foco.",
    trabalho: "É o ponto alto desta Casa. Cuidado apenas com as cobranças: mais poder atrai mais responsabilidade. Foque na organização de metas profissionais, pois é um período em que seus acertos (e erros) serão vistos por todos.",
    vida_pessoal: "O lazer pode ficar um pouco em segundo plano. Você estará mais maduro(a), preocupando-se mais com 'onde quero estar daqui a dez anos' do que com as farras do final de semana.",
    como_aproveitar: "Defina claramente as suas metas de vida, demonstre responsabilidade para as chefias, invista em uma imagem profissional séria e coloque sua carreira como prioridade no momento.",
    cuidado: "O excesso de trabalho, tornar-se rígido(a) demais ou muito focado(a) no status a ponto de negligenciar a sua saúde física e a sua família.",
    resumo: "Se a sua vida profissional está travada e você quer focar com tudo em crescer, assumir liderança e construir seu legado, esta é a Casa que você deve escolher.",
    quiz: [
      "Recebi reconhecimento, ganhei visibilidade no mercado ou fui promovido(a).",
      "Assumi uma carga muito maior de responsabilidades profissionais.",
      "Tive foco total em metas práticas de médio e longo prazo."
    ],
    radar: { dinheiro: 80, amor: 35, saude: 45 }
  },
  11: {
    id: 11, name: "Casa 11 — Amigos, Contatos e Oportunidades", emoji: "🌐", cristal: "Sodalita", label: "Networking & Apoio",
    img: "https://images.unsplash.com/photo-1587313350162-8e7c1ebefc20?w=400&q=80",
    regente: "Regência de Urano", tags: ["Amigos", "Networking", "Projetos"],
    entender_10s: "Este é um ano em que pessoas, amizades, grupos, internet e novos contatos podem ter um papel muito maior na realização dos seus objetivos práticos.",
    favorece: [
      "Conhecer pessoas que abrem novas portas",
      "Aumentar sua rede de contatos e networking",
      "Crescer nas redes sociais ou se envolver em comunidades",
      "Tirar projetos antigos do papel e receber indicações",
      "Encontrar pessoas com objetivos parecidos com os seus"
    ],
    tema_ano: "Seu ano gira em torno de projetos para o futuro, amizades ativas, grupos e envolvimento com causas coletivas.",
    ganhar: "Apoio de pessoas nos seus sonhos, um calendário social movimentado e ideias modernas para o seu futuro.",
    vida_real: "Você passará muito tempo participando de grupos de WhatsApp profissionais ou hobbies, indo a encontros de comunidades, recebendo convites de amigos, trabalhando com a internet e desenhando ideias para o futuro.",
    dinheiro: "As oportunidades financeiras surgem muito mais através de contatos, indicações e parcerias com grupos do que por um esforço puramente individual.",
    amor: "Você pode conhecer alguém por meio de amigos, grupos de interesses em comum ou nas redes sociais. Se já está em um relacionamento, compartilhar planos de longo prazo pode unir ainda mais o casal.",
    trabalho: "Um ano para criar laços com colegas, fazer networking, divulgar seu trabalho em grupos e na internet, e trabalhar focado nos ideais de uma equipe.",
    vida_pessoal: "O seu olhar se volta muito para o que está à frente, sonhando com o que pode vir. Você sentirá que fazer parte de algo com outras pessoas te dá mais energia.",
    como_aproveitar: "Não fique isolado(a). Conheça novas pessoas, aceite convites interessantes, ajude amigos quando puder, alimente suas redes de contatos profissionais e esteja aberto a colaborar.",
    cuidado: "Amizades muito interesseiras, se envolver em muitos projetos sociais esquecendo dos compromissos básicos e confiar em pessoas sem checar bem antes.",
    resumo: "Escolha esta Casa se você quer ampliar seus contatos, conhecer novas amizades, crescer na internet e ter ajuda externa para fazer seus projetos acontecerem.",
    quiz: [
      "Ampliei muito minha rede de contatos, amizades e círculo social.",
      "Fiz projetos coletivos, atuei na internet ou com grupos grandes.",
      "Senti forte conexão com o futuro e desenhei meus sonhos de longo prazo."
    ],
    radar: { dinheiro: 55, amor: 65, saude: 45 }
  },
  12: {
    id: 12, name: "Casa 12 — Retiro, Autoconhecimento e Finalizações", emoji: "👁️", cristal: "Quartzo Transparente", label: "Bastidores & Descanso",
    img: "https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=400&q=80",
    regente: "Regência de Netuno", tags: ["Introspecção", "Bastidores", "Finalizações"],
    entender_10s: "Este é um ano em que você precisará de descanso e reflexão, ideal para ficar mais longe do barulho do mundo, cuidar da mente e finalizar assuntos desgastados.",
    favorece: [
      "Fazer retiros, meditação, terapia e curar ansiedades",
      "Trabalhar focado(a) nos bastidores, sem precisar de holofotes",
      "Descansar, recuperar energia e dormir melhor",
      "Afinar a intuição para tomar decisões com mais calma",
      "Finalizar ciclos e encerrar assuntos que já deram o que tinham que dar"
    ],
    tema_ano: "Seu ano gira em torno de encerramentos, espiritualidade, necessidade de descanso físico e trabalho mais silencioso.",
    ganhar: "Um resgate do equilíbrio mental, percepções muito intuitivas e a paz de se livrar de problemas antigos.",
    vida_real: "Você vai preferir ficar em silêncio no seu canto em vez de ir a festas badaladas, dormirá mais, procurará terapias ou respostas espirituais, e terminará projetos ou relacionamentos que estavam se arrastando.",
    dinheiro: "Ganhos podem surgir através de trabalhos que você faz longe dos olhos do público (pesquisa, bastidores, produção interna) ou em áreas ligadas a cuidado e saúde.",
    amor: "As relações precisam de muita privacidade. Expor a vida amorosa pode trazer opiniões indesejadas. Podem ocorrer finalizações de relações que já não têm base sólida.",
    trabalho: "Não é um período favorável para a agitação e a auto-promoção excessiva. Projetos feitos no sossego de casa ou em pesquisa trarão melhores resultados do que estar no palco.",
    vida_pessoal: "O corpo e a mente pedirão pausa. Qualquer tentativa de se sobrecarregar de responsabilidades sociais gerará muito cansaço. A intuição estará extremamente alta.",
    como_aproveitar: "Tire férias, aceite que nem todo ano é de aceleração total, faça meditação, invista no seu conforto e aproveite o sossego para recarregar as energias para o ano seguinte (que será o ciclo da Casa 1).",
    cuidado: "O cansaço excessivo se você não respeitar os limites do corpo, o risco de fugir da realidade e tentar salvar as pessoas ao seu redor esquecendo-se de si.",
    resumo: "Se você vem de um período de estresse profundo e precisa de um ano para recarregar a bateria, se conhecer mais e encerrar ciclos, esta é a Casa necessária.",
    quiz: [
      "Precisei me isolar mais do barulho para encontrar paz interna.",
      "Finalizei pendências do passado ou encerrei relações desgastadas.",
      "Aprofundei muito meu lado intuitivo ou espiritual."
    ],
    radar: { dinheiro: 30, amor: 50, saude: 70 }
  }
};

export const houseColors: Record<number, string> = {
  1: "radial-gradient(circle at 50% 0%, rgba(139,0,0,0.6) 0%, rgba(2,4,8,1) 80%)",
  2: "radial-gradient(circle at 50% 0%, rgba(0,100,0,0.5) 0%, rgba(2,4,8,1) 80%)",
  3: "radial-gradient(circle at 50% 0%, rgba(184,134,11,0.5) 0%, rgba(2,4,8,1) 80%)",
  4: "radial-gradient(circle at 50% 0%, rgba(192,192,192,0.4) 0%, rgba(2,4,8,1) 80%)",
  5: "radial-gradient(circle at 50% 0%, rgba(255,140,0,0.5) 0%, rgba(2,4,8,1) 80%)",
  6: "radial-gradient(circle at 50% 0%, rgba(85,107,47,0.5) 0%, rgba(2,4,8,1) 80%)",
  7: "radial-gradient(circle at 50% 0%, rgba(219,112,147,0.5) 0%, rgba(2,4,8,1) 80%)",
  8: "radial-gradient(circle at 50% 0%, rgba(74,4,4,0.7) 0%, rgba(2,4,8,1) 80%)",
  9: "radial-gradient(circle at 50% 0%, rgba(75,0,130,0.5) 0%, rgba(2,4,8,1) 80%)",
  10: "radial-gradient(circle at 50% 0%, rgba(47,79,79,0.6) 0%, rgba(2,4,8,1) 80%)",
  11: "radial-gradient(circle at 50% 0%, rgba(0,0,128,0.6) 0%, rgba(2,4,8,1) 80%)",
  12: "radial-gradient(circle at 50% 0%, rgba(0,128,128,0.5) 0%, rgba(2,4,8,1) 80%)"
};

export const fallbackOraclesFuture: Record<number, string> = {
  1: "O foco está em você. A energia apoia novas iniciativas e independência.",
  2: "O momento é de organizar, valorizar seu trabalho e construir segurança prática.",
  3: "Sua mente e comunicação abrem portas. Interaja e negocie com clareza.",
  4: "Volte-se para casa. Fortaleça as raízes emocionais e familiares.",
  5: "Dê espaço à criatividade e aos romances. O prazer deve retornar à sua rotina.",
  6: "Disciplina e organização. Ajuste sua saúde e métodos de trabalho diário.",
  7: "O outro ganha importância. Momento de parcerias e compromissos alinhados.",
  8: "Desapego necessário. Um ciclo para quitar pendências financeiras e emocionais.",
  9: "Expansão de horizontes. Viagens e novos aprendizados ampliam sua visão de mundo.",
  10: "Dedicação à carreira. É hora de focar em responsabilidade profissional e metas.",
  11: "A força está no networking e no envolvimento com projetos em grupo e futuras amizades.",
  12: "Hora de repouso e reflexão. Atue nos bastidores e cure as energias antes de avançar."
};

export const fallbackOraclesPast: Record<number, string> = {
  1: "Foi o período de agir com autonomia e dar o primeiro passo em novas direções.",
  2: "Foi a fase para focar nas finanças práticas e consolidar sua segurança.",
  3: "Sua comunicação e aprendizado rápido estiveram muito ativos e renderam frutos.",
  4: "Você olhou para as próprias emoções e fortaleceu o ambiente de casa.",
  5: "Um período em que a criatividade, romances e hobbies pediram mais atenção.",
  6: "As rotinas diárias e os cuidados com o corpo e trabalho ganharam prioridade máxima.",
  7: "As alianças e o convívio em parceria tomaram conta das suas decisões.",
  8: "Um tempo de mudanças profundas, finalizações complexas e partilha de recursos.",
  9: "Você buscriptou respostas além da rotina, talvez através de viagens ou estudos maiores.",
  10: "A responsabilidade profissional aumentou consideravelmente, junto com sua imagem.",
  11: "Foi o momento de agir em grupo e de buscar amigos que ajudassem nos seus projetos.",
  12: "Sua intuição pediu calma; foi um momento para descansar e agir silenciosamente."
};
