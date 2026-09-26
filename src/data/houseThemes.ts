export type HouseTheme = {
  id: number;
  name: string;
  themeColor: string;
  subtitle: string;
  energyIntro: string;
  energyPoints: {
    title: string;
    text: string;
  }[];
  personas: {
    avatarM: string;
    avatarF: string;
    text: string;
  }[];
};

export const houseThemes: Record<number, HouseTheme> = {
  "1": {
    "id": 1,
    "name": "Casa 1",
    "themeColor": "#E11D48",
    "subtitle": "A energia do Protagonismo, da Coragem e do Recomeço",
    "personas": [
      {
        "avatarM": "homem nerd.png",
        "avatarF": "mulher negra cabelo cacheado.png",
        "text": "Cansou de viver em função das expectativas alheias e precisa colocar suas próprias prioridades em primeiro lugar."
      },
      {
        "avatarM": "homem preto de oculos.png",
        "avatarF": "mulher moderna.png",
        "text": "Busca coragem e disposição física para iniciar novos projetos e tomar decisões que vinha adiando."
      },
      {
        "avatarM": "homem oculos pria.png",
        "avatarF": "mulher boina roxa.png",
        "text": "Quer vivenciar um ano de renovação pessoal, fortalecendo sua identidade, sua imagem e sua independência."
      }
    ],
    "energyIntro": "A energia deste ano convida você a colocar o foco em si mesmo, resgatar seu amor-próprio e tomar as rédeas das suas decisões com total autonomia.",
    "energyPoints": [
      {
        "title": "Protagonismo e Independência",
        "text": "Esperar pelos outros ou adiar decisões ficou no passado; este é o momento de recuperar a autoconfiança, cuidar da sua presença e liderar o seu próprio caminho."
      },
      {
        "title": "Coragem e Recomeço",
        "text": "Um ciclo de movimento e renovação pessoal, onde a sua atitude e a sua vontade de mudar se tornam o grande motor para todas as áreas da sua vida."
      },
      {
        "title": "Vitalidade e Imagem",
        "text": "A disposição física e o autocuidado ganham destaque, fortalecendo sua identidade e sua capacidade de estabelecer limites claros com o mundo."
      }
    ]
  },
  "2": {
    "id": 2,
    "name": "Casa 2",
    "themeColor": "#10B981",
    "subtitle": "A energia do Dinheiro, da Prosperidade e da Abundância",
    "personas": [
      {
        "avatarM": "homem loiro de oculos.png",
        "avatarF": "mulher oriental.png",
        "text": "Cansou da imprevisibilidade financeira e quer construir uma base sólida e organizada para o seu futuro."
      },
      {
        "avatarM": "homem preto negro.png",
        "avatarF": "mulher loira.png",
        "text": "Busca reconhecer e monetizar seu valor real, cobrando de forma justa por seus talentos e dedicação."
      },
      {
        "avatarM": "homem jovem.png",
        "avatarF": "mulher loira chapeu.png",
        "text": "Quer vivenciar um ano de tranquilidade e conforto, gerando segurança para si e para quem você ama."
      }
    ],
    "energyIntro": "A energia deste ano convida você a consolidar suas bases materiais, valorizar seus talentos e construir uma relação mais segura e próspera com seus recursos.",
    "energyPoints": [
      {
        "title": "Prosperidade e Aterramento",
        "text": "Gastar energia com o que é instável não faz mais sentido; o foco se volta para a edificação financeira e para o acúmulo de valor real e duradouro."
      },
      {
        "title": "Valorização e Precificação",
        "text": "O momento perfeito para reconhecer o seu verdadeiro mérito, cobrando de forma justa pelo seu tempo, competência e dedicação."
      },
      {
        "title": "Estabilidade e Conforto",
        "text": "Um período de organização e constância que permite proteger o que é seu e fazer suas conquistas gerarem frutos de tranquilidade para o futuro."
      }
    ]
  },
  "3": {
    "id": 3,
    "name": "Casa 3",
    "themeColor": "#F59E0B",
    "subtitle": "A energia da Comunicação, das Vendas e do Movimento",
    "personas": [
      {
        "avatarM": "homem adulto.png",
        "avatarF": "mulher com cabelo xuxinha.png",
        "text": "Cansou de sentir sua voz ou seus projetos travados e precisa comunicar suas ideias com mais poder de atração."
      },
      {
        "avatarM": "homem nerd.png",
        "avatarF": "mulher cabelo colorido.png",
        "text": "Busca mais movimento na rotina, com negociações rápidas, aprendizados práticos e circulação de oportunidades."
      },
      {
        "avatarM": "homem preto de oculos.png",
        "avatarF": "mulher CEO.png",
        "text": "Quer vivenciar um ano dinâmico, trocando experiências e construindo pontes leves no seu cotidiano."
      }
    ],
    "energyIntro": "A energia deste ano convida você a colocar suas ideias em circulação, destravar sua comunicação e fazer sua rotina rodar com dinamismo e versatilidade.",
    "energyPoints": [
      {
        "title": "Vendas e Negociação",
        "text": "Ficar travado na hesitação ficou para trás; a força deste ciclo está em comunicar-se com clareza e fazer a sua voz e seus projetos alcançarem mais pessoas."
      },
      {
        "title": "Agilidade e Circulação",
        "text": "Reuniões, conversas, negociações e pequenas viagens ganham um ritmo acelerado, abrindo portas e renovando as oportunidades no seu dia a dia."
      },
      {
        "title": "Mente Aberta e Aprendizado",
        "text": "Um período de curiosidade e capacidade de adaptação rápida, ideal para absorver novos conhecimentos e criar pontes leves e eficientes."
      }
    ]
  },
  "4": {
    "id": 4,
    "name": "Casa 4",
    "themeColor": "#38BDF8",
    "subtitle": "A energia do Lar, da Família e da Paz Interior",
    "personas": [
      {
        "avatarM": "Homem cabelo preto de oculos.png",
        "avatarF": "mulher morena.png",
        "text": "Cansou da instabilidade emocional ou do caos externo e precisa de um espaço seguro para recarregar as energias."
      },
      {
        "avatarM": "homem loiro de oculos.png",
        "avatarF": "mulher apaixonada.png",
        "text": "Busca reestruturar seu lar, mudar de casa ou resolver pendências familiares com maturidade e afeto."
      },
      {
        "avatarM": "homem preto negro.png",
        "avatarF": "mulher negra.png",
        "text": "Quer vivenciar um ano de acolhimento e paz interior, fortalecendo os laços com quem realmente importa."
      }
    ],
    "energyIntro": "A energia deste ano convida você a olhar para dentro, fortalecer suas bases emocionais e construir um verdadeiro refúgio de paz no seu ambiente.",
    "energyPoints": [
      {
        "title": "Lar e Refúgio",
        "text": "Viver em meio à agitação externa sem ter para onde voltar desgasta; este é o momento de criar raízes fortes e proteger sua privacidade com carinho."
      },
      {
        "title": "Paz Familiar e Raízes",
        "text": "Um ciclo de pertencimento e acolhimento, perfeito para resolver pendências familiares com maturidade e cultivar um porto seguro inabalável."
      },
      {
        "title": "Estabilidade Emocional",
        "text": "O foco se volta para a reestruturação da sua intimidade, fortalecendo os laços com quem realmente importa e garantindo equilíbrio interno."
      }
    ]
  },
  "5": {
    "id": 5,
    "name": "Casa 5",
    "themeColor": "#EAB308",
    "subtitle": "A energia do Romance, do Prazer e do Brilho Pessoal",
    "personas": [
      {
        "avatarM": "homem moreno oculos.png",
        "avatarF": "mulher boina roxa.png",
        "text": "Cansou da rotina pesada e quer recuperar a alegria, o prazer e o entusiasmo em cada dia do seu ano."
      },
      {
        "avatarM": "homem adulto.png",
        "avatarF": "mulher confiante.png",
        "text": "Busca dar vazão à sua criatividade, colocar projetos autorais no mundo e sentir orgulho da sua expressão."
      },
      {
        "avatarM": "homem nerd.png",
        "avatarF": "mulher cabelo verde.png",
        "text": "Quer vivenciar um ano de paixão e autoestima renovada, celebrando seus talentos e seu direito de brilhar."
      }
    ],
    "energyIntro": "A energia deste ano convida você a reacender o entusiasmo pela vida, resgatar o prazer de criar e colocar a sua luz própria em evidência.",
    "energyPoints": [
      {
        "title": "Romance e Paixão",
        "text": "Aceitar uma vida morna não é mais uma opção; este ciclo abre espaço para conexões calorosas, encontros marcantes e celebração do afeto."
      },
      {
        "title": "Brilho e Autoestima",
        "text": "O momento de recuperar a alegria de viver, valorizar sua autenticidade e permitir-se brilhar no centro do palco da sua própria história."
      },
      {
        "title": "Projetos Autorais e Criatividade",
        "text": "Uma fase fértil para dar vazão ao seu carisma, investir nos seus hobbys e tirar ideias autorais do papel com orgulho e diversão."
      }
    ]
  },
  "6": {
    "id": 6,
    "name": "Casa 6",
    "themeColor": "#14B8A6",
    "subtitle": "A energia da Saúde, da Vitalidade e da Organização",
    "personas": [
      {
        "avatarM": "homem oculos pria.png",
        "avatarF": "mulher loira chapeu.png",
        "text": "Cansou da desorganização ou da falta de constância e precisa de disciplina para fazer o seu dia render."
      },
      {
        "avatarM": "Homem cabelo preto de oculos.png",
        "avatarF": "mulher Feliz.png",
        "text": "Busca recuperar sua saúde física, organizar seus hábitos e construir uma rotina livre de sobrecarga."
      },
      {
        "avatarM": "homem loiro de oculos.png",
        "avatarF": "mulher loira com oculos.png",
        "text": "Quer vivenciar um ano de alta eficiência, aprimorando seu trabalho e servindo com excelência sem se esgotar."
      }
    ],
    "energyIntro": "A energia deste ano convida você a transformar o caos em ordem, aperfeiçoar seus processos diários e cuidar do seu corpo como o seu maior patrimônio.",
    "energyPoints": [
      {
        "title": "Eficiência e Alta Performance",
        "text": "Viver apagando incêndios drena seus resultados; a força deste ciclo está em trabalhar com inteligência, métodos claros e organização impecável."
      },
      {
        "title": "Saúde e Vitalidade",
        "text": "Um período para alcançar disciplina nos treinos, alimentar-se bem e conquistar o bem-estar físico que sustenta seu ritmo diário."
      },
      {
        "title": "Rotina de Relógio Suíço",
        "text": "O momento de otimizar tarefas, aprimorar a prestação dos seus serviços e construir uma rotina funcional e livre de sobrecarga."
      }
    ]
  },
  "7": {
    "id": 7,
    "name": "Casa 7",
    "themeColor": "#F43F5E",
    "subtitle": "A energia do Casamento, do Compromisso e das Parcerias",
    "personas": [
      {
        "avatarM": "homem jovem.png",
        "avatarF": "mulher CEO.png",
        "text": "Cansou de relações superficiais ou desiguais e busca um compromisso sério, maduro e recíproco."
      },
      {
        "avatarM": "homem moreno oculos.png",
        "avatarF": "mulher de touca.png",
        "text": "Busca firmar sociedades, contratos ou alianças estratégicas para crescer em dupla no amor ou nos negócios."
      },
      {
        "avatarM": "homem adulto.png",
        "avatarF": "mulher chapeu branco.png",
        "text": "Quer vivenciar um ano de harmonia e cooperação, aprendendo a dividir a vida com equilíbrio e diplomacia."
      }
    ],
    "energyIntro": "A energia deste ano convida você a construir pontes sólidas, valorizar o compartilhamento a dois e firmar acordos baseados na verdadeira reciprocidade.",
    "energyPoints": [
      {
        "title": "Casamento e Relações Sérias",
        "text": "Tentar resolver tudo sozinho ou aceitar relações desequilibradas ficou no passado; este ciclo favorece uniões maduras e compromissos reais."
      },
      {
        "title": "Parcerias e Sociedades",
        "text": "A oportunidade de caminhar lado a lado com quem soma, unindo forças nos negócios ou na vida pessoal sob pactos de mútuo respeito."
      },
      {
        "title": "Equilíbrio e Diplomacia",
        "text": "Uma fase de cooperação e alinhamento, onde saber negociar com elegância e diplomacia abre caminhos de grande maturidade."
      }
    ]
  },
  "8": {
    "id": 8,
    "name": "Casa 8",
    "themeColor": "#881337",
    "subtitle": "A energia da Transformação, do Poder e da Intimidade",
    "personas": [
      {
        "avatarM": "homem preto de oculos.png",
        "avatarF": "mulher negra.png",
        "text": "Cansou de velhos padrões e quer virar a página, promovendo uma transformação profunda na sua história."
      },
      {
        "avatarM": "homem oculos pria.png",
        "avatarF": "mulher negra cabelo cacheado.png",
        "text": "Busca reestruturar financiamentos, gerenciar investimentos ou acessar recursos e parcerias de grande porte."
      },
      {
        "avatarM": "Homem cabelo preto de oculos.png",
        "avatarF": "mulher moderna.png",
        "text": "Quer vivenciar um ano de renascimento e poder pessoal, deixando para trás o que pesava no seu caminho."
      }
    ],
    "energyIntro": "A energia deste ano convida você a encarar mudanças necessárias, desapegar do que não serve mais e acessar uma versão muito mais forte e magnética de si mesmo.",
    "energyPoints": [
      {
        "title": "Transformação e Renascimento",
        "text": "Insistir no que está estagnado bloqueia seu crescimento; este é o ciclo para desintoxicar a vida, superar crises e virar a página com poder."
      },
      {
        "title": "Grandes Investimentos e Alquimia",
        "text": "O momento de gerenciar recursos compartilhados, reestruturar finanças de grande porte e atrair parceiros e capital estratégico."
      },
      {
        "title": "Intimidade e Poder Pessoal",
        "text": "Uma fase de regeneração profunda, onde o desapego do passado e a cura de bloqueios antigos ativam um magnetismo inabalável."
      }
    ]
  },
  "9": {
    "id": 9,
    "name": "Casa 9",
    "themeColor": "#6366F1",
    "subtitle": "A energia das Viagens, da Liberdade e da Expansão",
    "personas": [
      {
        "avatarM": "homem preto negro.png",
        "avatarF": "mulher cabelo verde.png",
        "text": "Cansou da sensação de limitação e quer expandir seus horizontes pessoais, acadêmicos ou profissionais."
      },
      {
        "avatarM": "homem jovem.png",
        "avatarF": "mulher oriental.png",
        "text": "Busca realizar viagens transformadoras, aprofundar estudos ou internacionalizar seus projetos de vida."
      },
      {
        "avatarM": "homem moreno oculos.png",
        "avatarF": "mulher loira.png",
        "text": "Quer vivenciar um ano de sabedoria e clareza espiritual, encontrando um sentido maior para seus passos."
      }
    ],
    "energyIntro": "A energia deste ano convida você a dar um salto quântico, ampliar sua visão de mundo e buscar conhecimentos superiores que elevam o seu propósito.",
    "energyPoints": [
      {
        "title": "Viagens e Grandes Horizontes",
        "text": "Ficar preso a uma rotina limitada não combina mais com você; este ciclo favorece viagens transformadoras e a abertura de caminhos internacionais."
      },
      {
        "title": "Expansão e Mente Aberta",
        "text": "Uma fase de crescimento acelerado, ideal para mentorias, especializações e estudos elevados que libertam sua mente de velhas amarras."
      },
      {
        "title": "Sabedoria e Propósito",
        "text": "O momento de conectar-se com filosofias inspiradoras, buscar significado em cada passo e permitir que a vida se expanda sem fronteiras."
      }
    ]
  },
  "10": {
    "id": 10,
    "name": "Casa 10",
    "themeColor": "#334155",
    "subtitle": "A energia da Fama, do Sucesso e do Reconhecimento",
    "personas": [
      {
        "avatarM": "homem nerd.png",
        "avatarF": "mulher loira com oculos.png",
        "text": "Cansou do amadorismo ou do anonimato e precisa ser visto pelo mercado como uma verdadeira autoridade."
      },
      {
        "avatarM": "homem preto de oculos.png",
        "avatarF": "mulher com cabelo xuxinha.png",
        "text": "Busca alcançar cargos de liderança, consolidar sua marca e fechar contratos de grande prestígio."
      },
      {
        "avatarM": "homem oculos pria.png",
        "avatarF": "mulher cabelo colorido.png",
        "text": "Quer vivenciar um ano de ambição realizada e respeito público, colhendo os frutos da sua dedicação."
      }
    ],
    "energyIntro": "A energia deste ano convida você a assumir o topo da sua jornada, consolidar sua reputação e ser reconhecido publicamente pelo valor do seu trabalho.",
    "energyPoints": [
      {
        "title": "Modo CEO e Autoridade",
        "text": "Permanecer nos bastidores ficou para trás; a força deste ciclo está em posicionar-se com firmeza, exercer liderança e mandar no seu mercado."
      },
      {
        "title": "Sucesso e Reconhecimento",
        "text": "Um período de visibilidade e prestígio, onde o seu esforço ganha destaque público e atrai conquistas de alto nível."
      },
      {
        "title": "Fama e Ambição Realizada",
        "text": "O momento de colher o topo da montanha, fechar contratos importantes e construir um legado de respeito e admiração."
      }
    ]
  },
  "11": {
    "id": 11,
    "name": "Casa 11",
    "themeColor": "#3B82F6",
    "subtitle": "A energia dos Amigos, das Conexões e do Futuro",
    "personas": [
      {
        "avatarM": "homem loiro de oculos.png",
        "avatarF": "mulher chapeu branco.png",
        "text": "Cansou de carregar a vida sozinho no esforço individual e entendeu que o seu crescimento depende do ecossistema certo."
      },
      {
        "avatarM": "homem preto negro.png",
        "avatarF": "mulher morena.png",
        "text": "Busca abrir caminhos com o apoio de aliados, mentores e pessoas que acreditam genuinamente nas suas ideias."
      },
      {
        "avatarM": "homem jovem.png",
        "avatarF": "mulher apaixonada.png",
        "text": "Quer vivenciar um ano mais leve, onde seu nome e seus projetos circulam através de convites, indicações e pertencimento."
      }
    ],
    "energyIntro": "A energia deste ano convida você a sair do esforço individual e construir através da força do coletivo, das amizades e das alianças certas.",
    "energyPoints": [
      {
        "title": "Pertencimento e Visão de Futuro",
        "text": "Um ciclo onde pessoas, grupos, comunidades e novas conexões desempenham um papel vital na realização dos seus objetivos práticos."
      },
      {
        "title": "Força do Ecossistema",
        "text": "Carregar a vida sozinho nas costas tem limite; a força deste ciclo está em olhar para o lado, aceitar o apoio certo e permitir que o grupo impulsione seus passos."
      },
      {
        "title": "Amigos e Oportunidades",
        "text": "Momento em que indicações, parcerias e projetos colaborativos abrem caminhos mais leves para você atingir suas metas mais ambiciosas."
      }
    ]
  },
  "12": {
    "id": 12,
    "name": "Casa 12",
    "themeColor": "#8B5CF6",
    "subtitle": "A energia da Paz, da Intuição e da Recarga Espiritual",
    "personas": [
      {
        "avatarM": "homem adulto.png",
        "avatarF": "mulher moderna.png",
        "text": "Cansou da sobrecarga sensorial e do barulho externo, precisando de um tempo para recompor sua energia mental."
      },
      {
        "avatarM": "homem nerd.png",
        "avatarF": "mulher boina roxa.png",
        "text": "Busca incubar um projeto sigiloso em deep work, estudar em silêncio ou realizar uma grande cura interior."
      },
      {
        "avatarM": "homem preto de oculos.png",
        "avatarF": "mulher confiante.png",
        "text": "Quer vivenciar um ano de paz, espiritualidade e intuição apurada, protegido contra desgastes desnecessários."
      }
    ],
    "energyIntro": "A energia deste ano convida você a desacelerar a mente, cultivar o silêncio estratégico e gestar grandes ideias nos bastidores antes de revelá-las ao mundo.",
    "energyPoints": [
      {
        "title": "Santuário e Recarga Espiritual",
        "text": "Expor-se sem necessidade drena sua força; este ciclo convida a proteger sua privacidade, cuidar da mente e cultivar paz interior."
      },
      {
        "title": "Bastidores e Deep Work",
        "text": "O momento de trabalhar em segredo, focar em projetos sigilosos e estruturar ideias com profundidade longe de olhares curiosos."
      },
      {
        "title": "Paz e Intuição Apurada",
        "text": "Uma fase de cura, sabedoria silenciosa e autoconfiança renovada, preparando o terreno com serenidade para um novo grande ciclo."
      }
    ]
  }
};
