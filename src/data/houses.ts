export interface HouseData {
  id: number;
  name: string;
  emoji: string;
  cristal: string;
  img: string;
  label: string;
  regente: string;
  tags: string[];
  resumo: string;
  porque: string;
  beneficio: string;
  ideal: string;
  pessoal: string;
  amor: string;
  prof: string;
  past_text: string;
  beneficio_passado: string;
  ideal_passado: string;
  pessoal_passado: string;
  sombra: string;
  amor_passado: string;
  prof_passado: string;
  promessa_titulo: string;
  promessa_texto: string;
  quiz: string[];
  radar: { dinheiro: number; amor: number; saude: number };
}

export const cityDatabase: Record<number, HouseData> = {
  1: {
    id: 1, name: "O Herói (Casa 1)", emoji: "⚡", cristal: "Granada", label: "Ação & Magnetismo",
    img: "https://images.unsplash.com/photo-1587313083321-71fb5de3ea7b?w=400&q=80",
    regente: "Regência de Marte", tags: ["Liderança", "Magnetismo", "Autonomia"],
    resumo: "O Despertar do Herói", porque: "A energia vital se concentra em VOCÊ. É o ano de renascer como protagonista absoluto.",
    beneficio: "Autoconfiança magnética, vitalidade extrema e a coragem para iniciar qualquer projeto.",
    ideal: "Empreendedores, líderes natos e quem precisa de um reset completo de identidade.",
    pessoal: "A energia do ano está toda em você. Traz um impulso de autoconfiança, vitalidade e protagonismo. Você se sentirá no controle do seu destino, assumindo novos papéis.",
    amor: "Seu magnetismo pessoal estará em alta. O desafio é equilibrar a individualidade com a parceria. Romances intensos que ajudam a se conhecer melhor.",
    prof: "Excelente para iniciar projetos, empreendimentos ou assumir posições de liderança. É um ano para ser empreendedor. O sucesso virá da dedicação a si mesmo.",
    past_text: "A energia vital estava 100% focada em você. Autonomia, coragem e recomeços foram o terreno fértil deste ciclo.",
    beneficio_passado: "Autoconfiança inquebrável, corpo saudável e protagonismo natural em todas as áreas.",
    ideal_passado: "Coragem para liderar, dizer 'não' e colocar suas necessidades em primeiro lugar.",
    pessoal_passado: "A Casa 1 exigia que você se colocasse em primeiro lugar. Era o ano de dizer 'eu existo, eu importo' e agir de acordo.",
    sombra: "Se não assumiu o protagonismo, outros decidiram por você. Frustração, invisibilidade e falta de energia vital.",
    amor_passado: "Atraiu quem respeitava sua individualidade. Relacionamentos que sufocavam não sobreviveram — e isso foi necessário.",
    prof_passado: "Oportunidades de liderança e novos empreendimentos estavam disponíveis. Se não se moveu, o mercado seguiu sem você.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua identidade pessoal. Este era o ano para renascer, assumir protagonismo e plantar a semente de um novo 'eu' para os próximos 12 anos.",
    quiz: [
      "Tomei decisões corajosas que priorizaram a minha própria evolução.",
      "Iniciei algo novo — um projeto, hábito ou caminho que me representava de verdade.",
      "Senti-me mais confiante e vitalizado(a) do que nos anos anteriores."
    ],
    radar: { dinheiro: 40, amor: 55, saude: 90 }
  },
  2: {
    id: 2, name: "A Prosperidade (Casa 2)", emoji: "💰", cristal: "Pirita", label: "Dinheiro & Bens",
    img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=400&q=80",
    regente: "Regência de Vênus", tags: ["Finanças", "Recursos", "Estabilidade"],
    resumo: "A Multiplicação do Ouro", porque: "O céu favorece a atração e multiplicação de recursos materiais.",
    beneficio: "Estabilidade financeira, novos fluxos de renda e segurança material concreta.",
    ideal: "Investidores, comerciantes e quem busca estabilidade e riqueza tangível.",
    pessoal: "O foco está nos recursos e na segurança. É um ano para consolidar a autoestima através de realizações concretas. A palavra de ordem é 'construir'.",
    amor: "A segurança será um pilar. Busca por parceiros que ofereçam estabilidade. A ênfase pode estar nas finanças conjuntas e planejamento do futuro.",
    prof: "Foco total em gerar renda e multiplicar recursos. Inteligência financeira aguçada. Propício para negociar aumentos, fechar contratos lucrativos e investir em algo sólido.",
    past_text: "O Universo havia preparado o solo para a colheita financeira. Cada centavo tinha o potencial de virar um investimento que multiplicaria.",
    beneficio_passado: "Estabilidade financeira, segurança material e multiplicação de recursos.",
    ideal_passado: "Disciplina financeira, visão prática e determinação para construir algo sólido.",
    pessoal_passado: "Sua autoestima estava ligada à capacidade de produzir resultados concretos. Valorizar o que tinha era a chave.",
    sombra: "Se desperdiçou ou ignorou as oportunidades financeiras, a insegurança material tomou conta.",
    amor_passado: "Relacionamentos estáveis e que agregavam valor mútuo foram favorecidos.",
    prof_passado: "Excelente para negócios, aumentos salariais e investimentos. A janela de oportunidade financeira estava escancarada.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua vida material e financeira. Este era o ano para construir riqueza, consolidar patrimônio e multiplicar seus recursos.",
    quiz: [
      "Consegui aumentar minha renda ou patrimônio de forma significativa.",
      "Tomei decisões financeiras inteligentes que me trouxeram segurança.",
      "Senti que meu valor pessoal estava alinhado com o que eu recebia do mundo."
    ],
    radar: { dinheiro: 95, amor: 50, saude: 45 }
  },
  3: {
    id: 3, name: "A Voz (Casa 3)", emoji: "📡", cristal: "Ágata Azul", label: "Vendas & Contatos",
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
    regente: "Regência de Mercúrio", tags: ["Comunicação", "Vendas", "Networking"],
    resumo: "O Despertar da Voz", porque: "O céu amplifica sua comunicação e sua capacidade de influenciar.",
    beneficio: "Comunicação magnética, contratos assinados e a capacidade de vender qualquer ideia.",
    ideal: "Vendedores, escritores, marketers e quem vive de comunicação e contatos.",
    pessoal: "Mente a mil. Contatos, pequenas viagens, cursos. Você se sentirá sociável, querendo aprender. O ambiente próximo ganha importância.",
    amor: "Favorece romances leves e declarações. A comunicação será a chave – diálogos abertos fortalecem o vínculo. Cuidado com mal-entendidos.",
    prof: "Ótimo para comunicação, marketing, vendas e escrita. Negociações e contratos favorecidos. Agilidade mental será seu maior ativo.",
    past_text: "O Universo havia turbinado a sua mente e a sua voz. Era o ano para influenciar, vender e conectar.",
    beneficio_passado: "Comunicação afiada, contatos estratégicos e contratos vantajosos.",
    ideal_passado: "Falar, escrever, negociar e conectar-se com inteligência.",
    pessoal_passado: "A Casa 3 pedia que você usasse a sua voz, estudasse e se movimentasse no ambiente próximo.",
    sombra: "Se ficou em silêncio, perdeu contratos e conexões vitais. A estagnação mental gerou frustração.",
    amor_passado: "A comunicação era a chave. Relacionamentos que funcionavam pela conversa prosperaram.",
    prof_passado: "Excelente para vendas, marketing e negociações. As portas se abriam pela sua palavra.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua comunicação e intelecto. Este era o ano para falar, negociar, vender e aprender como nunca.",
    quiz: [
      "Usei minha comunicação ativamente para avançar nos meus objetivos.",
      "Fiz novos contatos estratégicos que abriram portas importantes.",
      "Estudei, aprendi algo novo ou viajei para expandir minha visão."
    ],
    radar: { dinheiro: 65, amor: 60, saude: 50 }
  },
  4: {
    id: 4, name: "A Raiz (Casa 4)", emoji: "🏡", cristal: "Quartzo Rosa", label: "Lar & Imóveis",
    img: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=400&q=80",
    regente: "Regência da Lua", tags: ["Família", "Imóveis", "Cura"],
    resumo: "O Resgate da Raiz", porque: "O céu cura suas bases emocionais e familiares para que você voe alto.",
    beneficio: "Paz familiar, conquista imobiliária e cura profunda de padrões ancestrais.",
    ideal: "Quem busca estabilidade emocional, quer comprar imóvel ou curar relações familiares.",
    pessoal: "Foco para dentro de casa, família e origens. Vontade de se mudar ou reformar. Introspecção, segurança emocional e cura de questões do passado.",
    amor: "Decisões de morar junto ou construir um lar. A estabilidade emocional será testada – o lar precisa ser um porto seguro.",
    prof: "Favorável para trabalhos em casa (home office), imóveis ou arquitetura. Pode marcar o recolhimento para planejar o próximo grande passo.",
    past_text: "O Universo te chamou de volta para o ninho. Era o ano de curar as bases, fortalecer a família e encontrar a paz interior.",
    beneficio_passado: "Segurança emocional, paz no lar e cura de padrões ancestrais.",
    ideal_passado: "Olhar para dentro, curar a família e fortalecer as fundações.",
    pessoal_passado: "A Casa 4 exigia que você curasse suas raízes. Questões familiares e emocionais vieram à tona para serem resolvidas.",
    sombra: "Se ignorou as questões do lar e da família, a instabilidade emocional contaminou tudo.",
    amor_passado: "Relacionamentos que ofereciam segurança emocional foram favorecidos. A intimidade profunda era a meta.",
    prof_passado: "Trabalho com imóveis, reformas ou home office estava em alta. O recolhimento estratégico preparou o terreno.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital nas suas bases emocionais e familiares. Este era o ano para curar, construir um lar seguro e resolver questões ancestrais.",
    quiz: [
      "Resolvi questões importantes com minha família ou no meu lar.",
      "Senti-me emocionalmente mais seguro(a) e em paz comigo mesmo(a).",
      "Investi no meu espaço — mudança, reforma ou criação de um refúgio pessoal."
    ],
    radar: { dinheiro: 35, amor: 75, saude: 65 }
  },
  5: {
    id: 5, name: "O Criador (Casa 5)", emoji: "🎭", cristal: "Pedra do Sol", label: "Romances & Sorte",
    img: "https://images.unsplash.com/photo-1586782294158-b1129b0f44de?w=400&q=80",
    regente: "Regência do Sol", tags: ["Criatividade", "Romance", "Sorte"],
    resumo: "O Palco do Brilho", porque: "O céu te coloca no centro do palco — é o ano de brilhar e ser visto.",
    beneficio: "Criatividade em ebulição, romances apaixonantes e sorte nas apostas da vida.",
    ideal: "Artistas, criativos, apaixonados e quem busca prazer e autoexpressão.",
    pessoal: "Expansão, diversão e autoexpressão. Confiança e criatividade em alta. Lazer e vida social ganham destaque. Conexão com a criança interior.",
    amor: "Amor vivido com intensidade e paixão. Romances inesperados. A chama precisa ser reavivada com novidades. Sorte no amor exige ousadia.",
    prof: "Projetos artísticos e originais serão bem-sucedidos. Favorece inovação, entretenimento e turismo. Cuidado com especulações arriscadas.",
    past_text: "O Universo abriu o palco exclusivamente para você. Era o ano de criar, amar e se expressar sem medo.",
    beneficio_passado: "Brilho pessoal, romances intensos e criatividade sem limites.",
    ideal_passado: "Coragem para se expressar, criar e viver com alegria.",
    pessoal_passado: "A Casa 5 pedia autoexpressão radical. Era o ano de mostrar quem você é ao mundo.",
    sombra: "Se se escondeu, a energia criativa apodreceu e virou tédio, ciúmes ou drama vazio.",
    amor_passado: "Romances intensos e apaixonantes estavam disponíveis. A sorte no amor favorecia quem ousava.",
    prof_passado: "Projetos criativos e inovadores tinham tudo para brilhar. Arte, entretenimento e turismo em alta.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua criatividade e autoexpressão. Este era o ano para brilhar, amar intensamente e criar algo que o representasse.",
    quiz: [
      "Expressei minha criatividade de forma autêntica e sem medo de julgamento.",
      "Vivi momentos de alegria intensa, romance ou diversão verdadeira.",
      "Tive coragem de me mostrar ao mundo e assumir meu brilho pessoal."
    ],
    radar: { dinheiro: 45, amor: 90, saude: 55 }
  },
  6: {
    id: 6, name: "A Ordem (Casa 6)", emoji: "⚙️", cristal: "Jaspe Verde", label: "Saúde & Eficiência",
    img: "https://images.unsplash.com/photo-1614002167150-f1db1e723cc7?w=400&q=80",
    regente: "Regência de Mercúrio", tags: ["Saúde", "Rotina", "Eficiência"],
    resumo: "A Engenharia da Eficiência", porque: "O céu exige que você coloque a casa em ordem antes de receber as bênçãos.",
    beneficio: "Corpo saudável, rotina otimizada e eficiência que gera resultados exponenciais.",
    ideal: "Quem precisa de disciplina, saúde e organização para subir de nível.",
    pessoal: "Foco no dia a dia, organização e saúde. Melhorar alimentação e iniciar rotinas saudáveis. É um ano para criar eficiência.",
    amor: "Relacionamentos podem surgir na rotina. A vida prática e divisão de tarefas serão centrais. Reserve momentos para não esfriar a paixão.",
    prof: "Aumento de carga de trabalho e responsabilidades. Aperfeiçoamento técnico. Muito serviço, mas com ganho de eficiência e reconhecimento diário.",
    past_text: "O Universo exigiu disciplina. Era o ano de organizar o caos, cuidar do corpo e construir a máquina de eficiência.",
    beneficio_passado: "Saúde forte, rotina otimizada e eficiência que precede o sucesso.",
    ideal_passado: "Disciplina diária, cuidado com o corpo e organização implacável.",
    pessoal_passado: "A Casa 6 pedia que você colocasse a vida em ordem. Hábitos, saúde e rotina eram prioridade.",
    sombra: "Se ignorou a saúde e a rotina, o corpo cobrou. O caos organizacional impediu qualquer progresso.",
    amor_passado: "Relacionamentos práticos e funcionais foram favorecidos. A rotina a dois precisava de equilíbrio.",
    prof_passado: "A carga de trabalho aumentou, mas quem se organizou colheu reconhecimento e eficiência.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua saúde, rotina e eficiência. Este era o ano para colocar ordem no caos e construir a base operacional do seu sucesso.",
    quiz: [
      "Melhorei significativamente minha saúde, alimentação ou rotina de exercícios.",
      "Organizei minha vida de forma eficiente — trabalho, finanças e dia a dia.",
      "Colhi resultados concretos da minha disciplina e esforço diário."
    ],
    radar: { dinheiro: 55, amor: 40, saude: 95 }
  },
  7: {
    id: 7, name: "O Elo (Casa 7)", emoji: "🤝", cristal: "Lápis Lazúli", label: "Casamento & Sociedades",
    img: "https://images.unsplash.com/photo-1605330366627-e43598db44a3?w=400&q=80",
    regente: "Regência de Vênus", tags: ["Casamento", "Contratos", "Parcerias"],
    resumo: "A Aliança Sagrada", porque: "O céu favorece uniões poderosas — no amor e nos negócios.",
    beneficio: "Casamento sólido, sociedades lucrativas e contratos que mudam a sua vida.",
    ideal: "Quem busca se casar, fazer sociedade ou fechar grandes contratos.",
    pessoal: "O 'outro' ganha protagonismo. Aprender a negociar, compartilhar e comprometer-se. Questões contratuais e de espelhamento.",
    amor: "Ano clássico para casamentos, uniões e parcerias sólidas. A comunicação e a justiça serão cruciais para evitar conflitos abertos.",
    prof: "Excelente para sociedades, fechar contratos e trabalhar com clientes. Parcerias estratégicas podem alavancar fortemente sua carreira.",
    past_text: "O Universo colocou o espelho na sua frente. Era o ano de se unir, fechar alianças e aprender com o outro.",
    beneficio_passado: "Parcerias de ouro, casamento e contratos que multiplicam resultados.",
    ideal_passado: "Humildade para aprender com o outro, justiça e capacidade de negociar.",
    pessoal_passado: "A Casa 7 exigia que você aprendesse a dividir, ceder e fazer alianças verdadeiras.",
    sombra: "Se insistiu em fazer tudo sozinho, as oportunidades de parceria passaram. Conflitos e rupturas desnecessárias.",
    amor_passado: "Era o ano do casamento ou da parceria definitiva. A chave era o equilíbrio entre dar e receber.",
    prof_passado: "Sociedades e contratos estratégicos estavam à disposição. Quem se aliou, multiplicou.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital nas suas parcerias e relacionamentos. Este era o ano para se unir, casar, fechar sociedades e aprender a arte da aliança.",
    quiz: [
      "Firmei uma parceria ou relacionamento importante que agregou valor real.",
      "Aprendi a negociar, ceder e encontrar o equilíbrio nas minhas relações.",
      "Fechei contratos ou alianças que trouxeram crescimento mútuo."
    ],
    radar: { dinheiro: 60, amor: 95, saude: 40 }
  },
  8: {
    id: 8, name: "O Salto (Casa 8)", emoji: "🔥", cristal: "Obsidiana", label: "Heranças & Poder",
    img: "https://images.unsplash.com/photo-1615568165038-d63604f378a5?w=400&q=80",
    regente: "Regência de Plutão", tags: ["Transformação", "Poder", "Renascimento"],
    resumo: "A Metamorfose Total", porque: "O céu destrói o velho para construir o extraordinário.",
    beneficio: "Poder magnético, dinheiro oculto destravado e renascimento completo.",
    ideal: "Quem está pronto para morrer para o velho e renascer com poder absoluto.",
    pessoal: "Intensidade. Mudanças internas profundas, lidar com fins de ciclos e renascimentos. Interesse por espiritualidade e psicologia.",
    amor: "Crises transformadoras. Questões de controle e profundidade. Separações ou uniões extremamente profundas. Amadurecimento afetivo.",
    prof: "Favorece ganhos por investimentos, heranças ou processos judiciais. Modelo de negócios pode mudar radicalmente. Transformação.",
    past_text: "O Universo exigiu a morte simbólica do seu velho 'eu'. Era o ano de renascer das cinzas com um poder que você não sabia que tinha.",
    beneficio_passado: "Poder pessoal intenso, recursos ocultos destravados e transformação radical.",
    ideal_passado: "Coragem para deixar o velho morrer e abraçar a transformação sem resistência.",
    pessoal_passado: "A Casa 8 pedia que você enfrentasse seus medos mais profundos e se transformasse.",
    sombra: "Se resistiu à mudança, a destruição veio de fora. Perdas, crises e o sentimento de ser esmagado pela vida.",
    amor_passado: "Relacionamentos foram testados em profundidade. O que era superficial não sobreviveu.",
    prof_passado: "Modelos de negócio obsoletos morreram. Quem se reinventou, acessou poder e recursos antes invisíveis.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua transformação profunda. Este era o ano para renascer, acessar poder oculto e destruir tudo o que não servia mais.",
    quiz: [
      "Passei por uma transformação profunda que mudou quem eu sou.",
      "Destravei recursos financeiros, heranças ou oportunidades antes ocultas.",
      "Tive a coragem de deixar morrer o que não me servia mais."
    ],
    radar: { dinheiro: 70, amor: 45, saude: 50 }
  },
  9: {
    id: 9, name: "A Expansão (Casa 9)", emoji: "🦉", cristal: "Ametista", label: "Viagens & Estudos",
    img: "https://images.unsplash.com/photo-1562916843-157945d81bba?w=400&q=80",
    regente: "Regência de Júpiter", tags: ["Viagens", "Sabedoria", "Estrangeiro"],
    resumo: "A Quebra do Paradigma", porque: "O céu expande seus horizontes além de qualquer limite que você acreditava ter.",
    beneficio: "Viagens transformadoras, sucesso internacional e sabedoria que muda tudo.",
    ideal: "Quem busca crescer intelectualmente, internacionalizar ou expandir a mente.",
    pessoal: "Horizontes ampliados. Viagens distantes, estudos filosóficos e busca por propósito. Ano de muita fé e otimismo.",
    amor: "Relacionamentos com outras culturas ou à distância favorecidos. Viajar juntos e compartilhar visão de mundo fortalece laços.",
    prof: "Ótimo para carreiras acadêmicas, comércio exterior ou turismo. Negócios internacionais. É um ano para ousar em novos mercados.",
    past_text: "O Universo abriu as fronteiras da sua mente. Era o ano de viajar, estudar e pensar grande.",
    beneficio_passado: "Visão de mundo expandida, sucesso com o estrangeiro e fé inabalável.",
    ideal_passado: "Humildade para aprender, coragem para viajar e fé para acreditar no impossível.",
    pessoal_passado: "A Casa 9 pedia que você saísse da zona de conforto intelectual e geográfica.",
    sombra: "Se ficou preso ao conhecido, a estagnação mental gerou frustração e falta de propósito.",
    amor_passado: "Relacionamentos interculturais ou à distância estavam favorecidos. Viajar juntos era a cola.",
    prof_passado: "O mercado internacional estava aberto. Quem se arriscou em novos territórios, prosperou.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua expansão mental e geográfica. Este era o ano para viajar, estudar e quebrar os limites do que você achava possível.",
    quiz: [
      "Viajei, estudei ou ampliei minha visão de mundo de forma significativa.",
      "Tive experiências com outras culturas ou mercados internacionais.",
      "Senti uma fé renovada e uma sensação de propósito maior."
    ],
    radar: { dinheiro: 50, amor: 55, saude: 60 }
  },
  10: {
    id: 10, name: "O Governante (Casa 10)", emoji: "👑", cristal: "Olho de Tigre", label: "Fama & Carreira",
    img: "https://images.unsplash.com/photo-1587313264448-f0275525531b?w=400&q=80",
    regente: "Regência de Saturno", tags: ["Carreira", "Status", "Autoridade"],
    resumo: "O Ápice do Poder", porque: "O céu te empurra para o topo — reconhecimento, status e autoridade.",
    beneficio: "Promoção, fama no nicho, autoridade inquestionável e colheita profissional.",
    ideal: "Profissionais ambiciosos, líderes e quem busca o auge da carreira.",
    pessoal: "Imagem pública e social em evidência. Assumir liderança, colher frutos do trabalho duro e definir seu legado. Foco no longo prazo.",
    amor: "Parceiro com destaque ou envolvimento com pessoas de status. Cuidado para não colocar a carreira cegamente acima do amor.",
    prof: "O auge. Sucesso, promoção e autoridade. Momento de se mostrar, fazer networking e assumir responsabilidades de peso.",
    past_text: "O Universo te colocou sob os holofotes do mundo. Era o ano de colher, liderar e ser reconhecido.",
    beneficio_passado: "Reconhecimento público, promoção e autoridade no seu campo.",
    ideal_passado: "Responsabilidade, disciplina e a coragem de estar no topo.",
    pessoal_passado: "A Casa 10 exigia que você brilhasse publicamente e assumisse a sua posição de liderança.",
    sombra: "Se fugiu da responsabilidade, outros ocuparam o seu lugar. Invisibilidade profissional e falta de reconhecimento.",
    amor_passado: "A carreira competiu com o amor. Equilíbrio entre os dois era fundamental.",
    prof_passado: "O auge profissional estava disponível. Promoções, reconhecimento e autoridade para quem estava preparado.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital na sua carreira e imagem pública. Este era o ano de brilhar profissionalmente, ser reconhecido e assumir a liderança.",
    quiz: [
      "Fui reconhecido(a) publicamente pelo meu trabalho e competência.",
      "Assumi posições de liderança ou responsabilidade maior.",
      "Senti que estava no auge ou em ascensão profissional."
    ],
    radar: { dinheiro: 80, amor: 35, saude: 45 }
  },
  11: {
    id: 11, name: "O Visionário (Casa 11)", emoji: "🌐", cristal: "Sodalita", label: "Networking & Apoio VIP",
    img: "https://images.unsplash.com/photo-1587313350162-8e7c1ebefc20?w=400&q=80",
    regente: "Regência de Urano", tags: ["Networking", "Inovação", "Futuro"],
    resumo: "A Egrégora de Poder", porque: "O céu te conecta às pessoas certas — a rede que multiplica tudo.",
    beneficio: "Rede de contatos de ouro, apoiadores VIP e projetos coletivos que decolam.",
    ideal: "Visionários, networkers e quem entende que o sucesso é coletivo.",
    pessoal: "Vida social intensificada. Novos grupos, projetos coletivos. Você se sente parte de algo maior. Sonhos ganham forma.",
    amor: "Romances surgindo em grupos de amigos. Parceria fortalecida por projetos em comum. Amigos são importantes conselheiros.",
    prof: "Networking é a chave. Projetos inovadores e tecnológicos decolam. Ajuda de pessoas influentes. Somar forças.",
    past_text: "O Universo te inseriu numa egrégora poderosa. Era o ano de se conectar, inovar e sonhar coletivamente.",
    beneficio_passado: "Rede de apoio VIP, inovação e projetos coletivos bem-sucedidos.",
    ideal_passado: "Abertura para o novo, humildade para somar e visão de futuro.",
    pessoal_passado: "A Casa 11 pedia que você se conectasse a grupos, causas e projetos maiores que você.",
    sombra: "Se se isolou, perdeu oportunidades que só surgem em rede. Os seus maiores sonhos ficaram travados.",
    amor_passado: "Amizades se transformaram em algo mais. A rede social era o terreno fértil para o amor.",
    prof_passado: "Inovação e tecnologia estavam em alta. Quem se conectou a pessoas influentes, decolou.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital nas suas conexões e projetos coletivos. Este era o ano para se conectar, inovar e construir a rede que sustentaria seus maiores sonhos.",
    quiz: [
      "Fiz conexões significativas que abriram portas antes impossíveis.",
      "Participei de projetos coletivos ou comunidades que amplificaram meus resultados.",
      "Senti que meus sonhos mais ousados estavam mais próximos da realidade."
    ],
    radar: { dinheiro: 55, amor: 65, saude: 45 }
  },
  12: {
    id: 12, name: "O Silêncio (Casa 12)", emoji: "👁️", cristal: "Quartzo Transparente", label: "Bastidores & Intuição",
    img: "https://images.unsplash.com/photo-1515091943-9d5c0ad475af?w=400&q=80",
    regente: "Regência de Netuno", tags: ["Intuição", "Bastidores", "Espiritualidade"],
    resumo: "O Silêncio que Governa", porque: "O céu te chama para os bastidores — o poder invisível que gera os milagres.",
    beneficio: "Intuição cirúrgica, projetos gestados em segredo que explodem depois, e cura profunda da alma.",
    ideal: "Quem está pronto para o recolhimento estratégico e a preparação silenciosa.",
    pessoal: "Ano para desacelerar e mergulhar no autoconhecimento. Retiro, espiritualidade e cura de padrões inconscientes. Privacidade.",
    amor: "Relacionamentos reservados ou mantidos em segredo. Necessidade de amar com compaixão e estabelecer limites saudáveis.",
    prof: "Trabalho nos bastidores. Pesquisa e desenvolvimento para o futuro. Evite lançamentos grandiosos; foque na preparação silenciosa.",
    past_text: "O Universo pediu silêncio. Era o ano de curar a alma, trabalhar nos bastidores e gestar o futuro em segredo.",
    beneficio_passado: "Intuição afiada, cura profunda e projetos gestados que explodiriam depois.",
    ideal_passado: "Silêncio, introspecção, espiritualidade e trabalho nos bastidores.",
    pessoal_passado: "A Casa 12 pedia que você desacelerasse, curasse feridas antigas e trabalhasse em segredo.",
    sombra: "Se forçou a visibilidade, o esgotamento e a confusão mental tomaram conta.",
    amor_passado: "Relações secretas ou intensamente privadas. Amar com compaixão era o aprendizado.",
    prof_passado: "Trabalho silencioso e preparação foram a chave. Quem se recolheu estrategicamente, gestou o sucesso.",
    promessa_titulo: "A Promessa do Universo para Este Ciclo",
    promessa_texto: "O Universo concentrou toda a carga vital no seu mundo interior e nos bastidores. Este era o ano para curar, gestar projetos em segredo e afinar a intuição.",
    quiz: [
      "Dediquei tempo ao autoconhecimento, meditação ou práticas espirituais.",
      "Trabalhei em projetos nos bastidores que depois trouxeram resultados.",
      "Senti minha intuição mais afiada e confiei mais no meu instinto."
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
  1: "O universo está pronto para entregar o leme nas suas mãos. A configuração da sua abóbada celeste cortará as interferências externas, exigindo protagonismo absoluto. Prepare-se para um ciclo de reinvenção e poder pessoal onde as regras serão ditadas apenas por você.",
  2: "As efemérides revelam uma janela de ouro para a sua prosperidade. O céu se alinhará para favorecer a estabilidade, a atração de recursos e a segurança material. Tudo o que você tocar com inteligência prática tenderá a multiplicar o seu patrimônio.",
  3: "Sua mente será o seu maior ativo. O céu ajustará a sua frequência para a velocidade, abrindo as comportas para a comunicação persuasiva, contatos influentes e contratos ágeis. O universo pede que você use a sua voz sem medo.",
  4: "Um ciclo de fortalecimento das suas bases. As estrelas ancorarão a sua energia na cura do seu núcleo familiar e na atração da segurança emocional e imobiliária. Para voar alto no futuro, o universo exige que as suas raízes estejam inabaláveis agora.",
  5: "A sorte está lançada a seu favor. O céu se abrirá para a alegria pura, exigindo que você coloque a sua criatividade no mundo. Prepare-se para colapsar romances intensos, brilho pessoal e uma coragem contagiante para ser quem você realmente é.",
  6: "A verdadeira prosperidade mora na disciplina. O universo preparou um ciclo de purificação para a sua rotina, saúde e ambiente de trabalho. Ao colocar a casa em ordem e focar na eficiência diária, você abrirá espaço para os grandes milagres da sua jornada.",
  7: "O poder das conexões de ouro. A sua rota ativará a lei da ressonância, atraindo as pessoas exatas que você precisa para evoluir. Será um ciclo magistral para oficializar casamentos reais ou fechar sociedades e contratos comerciais de altíssimo nível.",
  8: "As estrelas prepararam o terreno para a sua metamorfose. O universo cortará o que não serve mais na sua vida, forçando um renascimento profundo. É a configuração exata para destravar dinheiros ocultos, quitar amarras do passado e assumir o seu poder magnético.",
  9: "A quebra do paradigma. O teto da sua realidade será arrancado. O céu abrirá as portas para as viagens longas, o conhecimento superior e o sucesso com o estrangeiro. O universo exige que você pare de pensar pequeno e amplie as suas crenças.",
  10: "O ápice do reconhecimento público. As efemérides empurrarão os seus esforços para o palco do mundo. A energia estará focada no seu status, autoridade e na colheita das realizações profissionais pelas quais você tanto batalhou. Abrace a liderança.",
  11: "A força da egrégora a seu favor. O céu conspirará para conectar você à mente coletiva e às pessoas certas. Os seus maiores sonhos ganharão tração através de redes de influência, amizades genuínas e patrocinadores que acreditam na sua visão de futuro.",
  12: "O recolhimento curativo. Antes do grande salto, o universo pede silêncio. As estrelas favorecerão a gestação de projetos nos bastidores, a cura da alma e a elevação máxima da sua intuição. O que você construir agora em segredo, governará o seu amanhã."
};

export const fallbackOraclesPast: Record<number, string> = {
  1: "Ao ancorar a sua energia na Casa 1, o universo silenciou o mundo lá fora para que você ouvisse apenas a sua própria voz. O atrito que você sentiu ocorreu quando tentou agradar aos outros em vez de assumir o leme. Foi o seu ano de aprender a ter coragem e a depender exclusivamente da sua luz.",
  2: "Ao ancorar a sua energia na Casa 2, o universo calibrou a sua frequência para entender o valor prático das coisas. A escassez só apareceu se você resistiu a organizar as suas bases. Foi o ciclo em que você foi testado a materializar segurança, transformar suor em ouro e aterrar a sua vida financeira.",
  3: "Quando você decidiu firmar seus passos neste meridiano, o universo acelerou a sua mente na vibração da Casa 3. O cansaço mental ou as fofocas só ocorreram se você perdeu o controle do próprio foco. Foi um período vital para aprender a vender as suas ideias, conectar-se com o ambiente e destravar a sua comunicação.",
  4: "O universo te chamou de volta para o ninho. Ao ancorar na Casa 4, a frequência forçou a cura das suas emoções e da sua família. Desafios domésticos surgiram apenas para mostrar onde a fundação estava fraca. Aquele ciclo foi um divisor de águas para você aprender que a verdadeira prosperidade exige paz de espírito.",
  5: "Ao ancorar a sua energia na Casa 5, o universo exigiu que você resgatasse a sua capacidade de sorrir e criar. Bloqueios e dramas aconteceram caso você tenha esquecido de viver a sua própria alegria. O céu te deu um palco naquele ano para você entender o poder magnético do seu brilho pessoal e da sua autoexpressão.",
  6: "A ordem precede o milagre. Ao ativar a Casa 6, o universo te chamou para o trabalho duro, exigindo foco na saúde e no método. O esgotamento só se fez presente para te forçar a consertar os seus hábitos. Aquele ano foi a oficina onde você lapidou as engrenagens da sua prosperidade.",
  7: "Quando você ancorou a sua energia na Casa 7, o universo começou a agir como um espelho. As pessoas que entraram (ou saíram) da sua vida e os conflitos que surgiram foram respostas diretas à sua própria frequência. Você precisou dominar a arte de se associar e de equilibrar o dar e receber.",
  8: "A faxina quântica. Ao firmar seus passos neste meridiano, a Casa 8 exigiu a morte do seu velho 'eu'. As perdas materiais ou emocionais foram o fogo necessário para transmutar os seus medos. O universo não te puniu, ele te esvaziou para que você pudesse acessar um poder e uma força que nem sabia que possuía.",
  9: "A expansão forçada. Ao ancorar na Casa 9, o universo abriu as fronteiras da sua mente. Os obstáculos vieram quando você tentou se agarrar às velhas crenças. Aquele ciclo exigia que você viajasse mais longe, estudasse com mais profundidade e aceitasse que as suas antigas certezas já não serviam.",
  10: "O ano da colheita pública. Ao ancorar na Casa 10, o universo exigiu que você assumisse a sua posição no topo. Frustrações na carreira surgiram se você hesitou ou não estava preparado para a responsabilidade. Aquele era o seu ano de ouro para reconhecimento — cada degrau subido representava anos de batalha.",
  11: "A força coletiva. Ao ancorar na Casa 11, o universo te inseriu numa rede maior. Os seus sonhos individuais foram turbinados por alianças. A solidão que sentiu foi o resultado de não se abrir para as tribos certas. A lição: ninguém chega ao topo sozinho, e os seus apoiadores sempre foram o segredo.",
  12: "O grande silêncio. Ao ancorar na Casa 12, o universo pediu a sua retirada do palco. O cansaço, a confusão e as perdas vieram quando você resistiu ao recolhimento. Aquele foi o ano de gestar em segredo o maior projeto da sua vida. O que era para ser uma pausa dourada virou esgotamento se você ignorou o chamado."
};
