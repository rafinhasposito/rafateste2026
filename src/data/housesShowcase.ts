export type HouseElement = "Fogo" | "Terra" | "Ar" | "Água";

export type HouseIconKey =
  | "crown"
  | "wallet"
  | "megaphone"
  | "home"
  | "flame"
  | "activity"
  | "handshake"
  | "refresh"
  | "globe"
  | "trophy"
  | "network"
  | "moon";

export interface HouseShowcaseItem {
  id: number;
  numberLabel: string;
  element: HouseElement;
  iconKey: HouseIconKey;
  title: string;
  profile: string;
  cycleFocus: string;
  inPractice: {
    area: string;
    example: string;
  }[];
  symbolCity: {
    name: string;
    country: string;
    reason: string;
  };
}

export const ELEMENT_STYLES: Record<
  HouseElement,
  { label: string; text: string; bg: string; border: string }
> = {
  Fogo: {
    label: "Fogo",
    text: "#FCA5A5",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(248, 113, 113, 0.28)",
  },
  Terra: {
    label: "Terra",
    text: "#86EFAC",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(74, 222, 128, 0.28)",
  },
  Ar: {
    label: "Ar",
    text: "#93C5FD",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(96, 165, 250, 0.28)",
  },
  Água: {
    label: "Água",
    text: "#C4B5FD",
    bg: "rgba(139, 92, 246, 0.12)",
    border: "rgba(167, 139, 250, 0.28)",
  },
};

export const HOUSES_SHOWCASE: HouseShowcaseItem[] = [
  {
    id: 1,
    numberLabel: "01",
    element: "Fogo",
    iconKey: "crown",
    title: "Autonomia & Chega de Pedir Licença",
    profile:
      "Quem vive dizendo \"sim\" pra todo mundo e \"não\" pra si mesmo, ou quer mudar de visual e começar um projeto solo.",
    cycleFocus:
      "A energia do pontapé inicial. Devolve a coragem de bancar suas vontades, mudar sua postura e colocar o seu nome em primeiro lugar.",
    inPractice: [
      {
        area: "Nas decisões do dia a dia",
        example:
          "Você para de pedir opinião pra cinco pessoas antes de agir e sente firmeza pra bater o martelo no que quer.",
      },
      {
        area: "Na imagem e presença",
        example:
          "Dá vontade real de renovar guarda-roupa, corte, posicionamento e a forma como você entra em qualquer ambiente.",
      },
      {
        area: "Em projetos próprios",
        example:
          "Tira aquela ideia antiga da gaveta — é o ciclo que favorece começar algo com a sua cara, sem esperar ninguém aprovar.",
      },
    ],
    symbolCity: {
      name: "Nova York",
      country: "EUA",
      reason: "símbolo de quem chega com iniciativa própria, se reinventa e lidera o próprio jogo.",
    },
  },
  {
    id: 2,
    numberLabel: "02",
    element: "Terra",
    iconKey: "wallet",
    title: "Dinheiro & Caixa Forte",
    profile:
      "Pra quem trabalha feito um louco o mês inteiro, mas chega dia 25 e não vê a cor do dinheiro na conta.",
    cycleFocus:
      "Dá postura pra parar de cobrar mixaria pelo seu trabalho, fechar os ralos de gastos bobos e começar a construir patrimônio de verdade.",
    inPractice: [
      {
        area: "No preço do seu trabalho",
        example:
          "Você perde o medo de falar o seu valor e para de dar desconto só pra agradar cliente que não valoriza.",
      },
      {
        area: "No controle do bolso",
        example:
          "Fica claro onde o dinheiro está escorrendo pelo ralo — gastos por impulso perdem espaço pra reserva e caixa sólido.",
      },
      {
        area: "Na renda e patrimônio",
        example:
          "A cabeça fica prática e focada em aumentar margem, organizar entradas e transformar esforço em dinheiro no bolso.",
      },
    ],
    symbolCity: {
      name: "Zurique",
      country: "Suíça",
      reason: "referência mundial em solidez financeira, gestão de caixa e valorização de patrimônio.",
    },
  },
  {
    id: 3,
    numberLabel: "03",
    element: "Ar",
    iconKey: "megaphone",
    title: "Vendas & Fala Destravada",
    profile:
      "Corretores, lojistas, vendedores e quem precisa fazer reunião todo dia ou gravar stories, mas trava na hora de falar.",
    cycleFocus:
      "Solta a sua comunicação e o seu poder de convencer. Favorece WhatsApp movimentado, reuniões mais fluidas e seu nome circulando no mercado.",
    inPractice: [
      {
        area: "Na câmera e nas reuniões",
        example:
          "Gravar stories, apresentar proposta ou puxar conversa com cliente fica muito mais natural e menos travado.",
      },
      {
        area: "No volume de vendas",
        example:
          "O ritmo acelera: mais conversas acontecendo, negociações mais rápidas e mais gente perguntando sobre o seu trabalho.",
      },
      {
        area: "No aprendizado rápido",
        example:
          "Cursos práticos, livros e conversas viram argumento de venda e dinheiro na mesma semana.",
      },
    ],
    symbolCity: {
      name: "Londres",
      country: "Reino Unido",
      reason: "ponto de encontro de mídia, boas conversas, ideias ágeis e negócios em movimento.",
    },
  },
  {
    id: 4,
    numberLabel: "04",
    element: "Água",
    iconKey: "home",
    title: "Meu Canto, Imóveis & Família",
    profile:
      "Quem quer comprar ou reformar casa, sonha com gravidez ou simplesmente precisa de silêncio e paz com a família.",
    cycleFocus:
      "Fortalece o seu ninho. Cria o clima ideal pra resolver imóveis, cuidar das raízes e ter um porto seguro de verdade pra voltar no fim do dia.",
    inPractice: [
      {
        area: "Em casa e imóveis",
        example:
          "Decisões de mudança, compra, reforma ou deixar o seu lar com a sua cara ganham prioridade e fluidez.",
      },
      {
        area: "Na vida em família",
        example:
          "Assuntos antigos com pais, filhos ou moradia encontram espaço pra serem resolvidos com mais calma e acolhimento.",
      },
      {
        area: "Na paz mental",
        example:
          "Em vez de viver correndo pra fora, você constrói base emocional firme por dentro pra aguentar qualquer desafio.",
      },
    ],
    symbolCity: {
      name: "Florença",
      country: "Itália",
      reason: "símbolo de raízes sólidas, arquitetura acolhedora e beleza que atravessa gerações.",
    },
  },
  {
    id: 5,
    numberLabel: "05",
    element: "Fogo",
    iconKey: "flame",
    title: "Palco, Romance & Magnetismo",
    profile:
      "Solteiros há tempos no zero a zero, quem vive estressado sem se divertir ou criadores que querem carisma e aplauso nos projetos autorais.",
    cycleFocus:
      "Devolve o brilho nos seus olhos, acende o magnetismo pessoal e abre espaço pra romances envolventes, criatividade solta e prazer de viver sem culpa.",
    inPractice: [
      {
        area: "No amor e na paquera",
        example:
          "Você sai do modo travado e se sente mais confiante, leve e magnético — atraindo encontros muito mais interessantes.",
      },
      {
        area: "Na câmera e no palco",
        example:
          "Seu carisma aparece sem esforço: projetos autorais, vídeos, artes ou apresentações ganham vida e chamam atenção.",
      },
      {
        area: "No prazer de viver",
        example:
          "A rotina deixa de ser só boleto e obrigação — lazer, viagens leves e hobbies voltam a recarregar seu entusiasmo.",
      },
    ],
    symbolCity: {
      name: "Rio de Janeiro",
      country: "Brasil",
      reason: "energia solar, magnetismo à flor da pele, criatividade vibrante e leveza sem culpa.",
    },
  },
  {
    id: 6,
    numberLabel: "06",
    element: "Terra",
    iconKey: "activity",
    title: "Rotina, Dieta & Mundo Fit",
    profile:
      "Pra quem vive furando a dieta na quarta-feira, paga academia e não vai, ou sente que o dia é um caos e não sobra tempo pra cuidar do corpo.",
    cycleFocus:
      "Traz a disciplina de um relógio suíço pra acordar na hora, treinar no automático, manter a alimentação nos trilhos e fazer o dia finalmente render.",
    inPractice: [
      {
        area: "Na dieta e nos treinos",
        example:
          "Em vez de recomeçar toda segunda-feira, você encaixa treino e alimentação como hábito automático no dia a dia.",
      },
      {
        area: "Na agenda e produtividade",
        example:
          "Tarefas que hoje viram bagunça ganham horário, método e processo — você entrega mais sem chegar destruído à noite.",
      },
      {
        area: "Na saúde e disposição",
        example:
          "O corpo pede menos excesso e responde mais rápido quando você ajusta sono, exames e cuidados diários.",
      },
    ],
    symbolCity: {
      name: "Tóquio",
      country: "Japão",
      reason: "a capital mundial da disciplina diária, do método e da precisão nos detalhes.",
    },
  },
  {
    id: 7,
    numberLabel: "07",
    element: "Ar",
    iconKey: "handshake",
    title: "Casamento & Sociedades de Ouro",
    profile:
      "Quem cansou de romances superficiais e quer namoro sério, ou quem precisa de um sócio competente pra dividir o peso.",
    cycleFocus:
      "O fim do caminho solitário. Favorece compromissos maduros e alianças onde um mais um soma dez, tanto no amor quanto nos negócios.",
    inPractice: [
      {
        area: "No relacionamento",
        example:
          "Conversas rasas perdem a graça — o foco vai pra quem soma de verdade, quer compromisso ou fortalece o casamento.",
      },
      {
        area: "Em sociedades e contratos",
        example:
          "Parcerias comerciais, clientes-chave e acordos equilibrados ficam em destaque pra você parar de carregar tudo sozinho.",
      },
      {
        area: "No jeito de lidar com pessoas",
        example:
          "Você negocia melhor, enxerga rápido quem é confiável e constrói vínculos de longo prazo.",
      },
    ],
    symbolCity: {
      name: "Paris",
      country: "França",
      reason: "cenário clássico dos encontros marcantes, da diplomacia e das alianças construídas a dois.",
    },
  },
  {
    id: 8,
    numberLabel: "08",
    element: "Água",
    iconKey: "refresh",
    title: "Virada de Chave & Livramento",
    profile:
      "Quem está preso em processos burocráticos, dívidas que não fecham, sociedades desgastadas ou precisa virar a página de vez.",
    cycleFocus:
      "A faxina pesada. Ajuda a encerrar o que estava te atrasando, renegociar pendências e destravar recursos compartilhados pro seu recomeço.",
    inPractice: [
      {
        area: "Em dívidas e finanças travadas",
        example:
          "Dá lucidez pra sentar, renegociar, cortar contratos ruins e organizar dinheiro compartilhado, crédito ou investidores.",
      },
      {
        area: "Em ciclos desgastados",
        example:
          "Aquilo que você arrastava com a barriga há anos finalmente se resolve — você fecha a porta sem olhar pra trás.",
      },
      {
        area: "Na força emocional",
        example:
          "Você sai mais maduro, estratégico e livre do peso invisível que drenava sua energia.",
      },
    ],
    symbolCity: {
      name: "Singapura",
      country: "Singapura",
      reason: "referência global em engenharia financeira, reestruturação estratégica e viradas aceleradas.",
    },
  },
  {
    id: 9,
    numberLabel: "09",
    element: "Fogo",
    iconKey: "globe",
    title: "Passaporte, Estudo & Fora da Bolha",
    profile:
      "Quem quer morar fora, viajar o mundo, passar em concursos ou faculdades, ou sente que a cidade natal ficou pequena demais.",
    cycleFocus:
      "Expande o seu horizonte. Favorece caminhos internacionais, estudos de alto nível e contato com pessoas e lugares de outro patamar.",
    inPractice: [
      {
        area: "Em viagens e exterior",
        example:
          "Planos de morar fora, intercâmbio, clientes em dólar/euro ou viagens transformadoras saem do papel.",
      },
      {
        area: "Nos estudos e visão",
        example:
          "Foco afiado pra provas, pós, idiomas e especializações que abrem portas fora da bolha atual.",
      },
      {
        area: "Na mentalidade",
        example:
          "Problemas pequenos deixam de te travar — você passa a jogar um jogo maior e pensar em escala global.",
      },
    ],
    symbolCity: {
      name: "Lisboa",
      country: "Portugal",
      reason: "ponte histórica entre continentes para quem amplia fronteiras e constrói vida global.",
    },
  },
  {
    id: 10,
    numberLabel: "10",
    element: "Terra",
    iconKey: "trophy",
    title: "Fama, Modo CEO & Reconhecimento de Elite",
    profile:
      "Influenciadores, criadores de conteúdo, cantores, artistas, blogueiras e donos de negócio que trabalham muito nos bastidores, mas o mercado ainda não nota.",
    cycleFocus:
      "Te tira da sombra e te coloca sob os holofotes. É a coordenada pra ganhar autoridade no nicho, ver seu trabalho ganhar alcance, atrair grandes marcas e se posicionar como líder.",
    inPractice: [
      {
        area: "Na fama e viralização",
        example:
          "Seu conteúdo, palco ou marca pessoal ganha visibilidade real — as pessoas param pra ouvir e te reconhecem pelo nome.",
      },
      {
        area: "Com marcas e grandes contratos",
        example:
          "Você deixa de correr atrás de migalha e se posiciona de igual pra igual com marcas, clientes maiores e oportunidades de topo.",
      },
      {
        area: "No Modo CEO",
        example:
          "Sai do operacional invisível e assume postura de liderança, reputação forte e metas grandes de carreira.",
      },
    ],
    symbolCity: {
      name: "Dubai",
      country: "Emirados Árabes",
      reason: "vitrine mundial de grandes metas, visibilidade de alto nível e marcas que jogam no topo.",
    },
  },
  {
    id: 11,
    numberLabel: "11",
    element: "Ar",
    iconKey: "network",
    title: "Audiência, Internet & Contatos VIP",
    profile:
      "Criadores, infoprodutores e empreendedores que cansaram de tentar crescer sozinhos e sabem que audiência fiel e uma indicação certa mudam o jogo.",
    cycleFocus:
      "O poder da rede e da escala digital. Conecta você a pessoas influentes, fortalece comunidades e faz o seu trabalho circular muito além do seu círculo atual.",
    inPractice: [
      {
        area: "Na internet e audiência",
        example:
          "Projetos digitais, comunidades e conteúdos compartilháveis ganham tração orgânica e boca a boca real.",
      },
      {
        area: "No networking VIP",
        example:
          "Você entra em mesas maiores, conhece padrinhos influentes e recebe indicações que economizam anos de esforço solo.",
      },
      {
        area: "Em parcerias coletivas",
        example:
          "Collabs, eventos, grupos e projetos em equipe multiplicam seu alcance sem depender só do seu braço.",
      },
    ],
    symbolCity: {
      name: "São Francisco",
      country: "EUA",
      reason: "berço das redes globais, das comunidades de alto impacto e dos projetos que escalam no digital.",
    },
  },
  {
    id: 12,
    numberLabel: "12",
    element: "Água",
    iconKey: "moon",
    title: "Modo Silencioso & Blindagem",
    profile:
      "Quem está à beira do esgotamento, precisa de um detox das redes sociais ou vai produzir um projeto grande em total segredo.",
    cycleFocus:
      "Proteção e foco profundo. Cria espaço pra recarregar a bateria, afiar a intuição e trabalhar longe da fofoca, da inveja e do barulho do mundo.",
    inPractice: [
      {
        area: "Na saúde mental e descanso",
        example:
          "Você desacelera sem culpa, faz um detox de barulho externo e recupera sono, clareza e paz interior.",
      },
      {
        area: "Em projetos sigilosos (Deep Work)",
        example:
          "Ideal pra escrever um livro, estruturar uma grande virada ou preparar um lançamento nos bastidores antes de mostrar ao mundo.",
      },
      {
        area: "Na blindagem pessoal",
        example:
          "Fica mais seletivo sobre com quem divide sua vida, protegendo sua energia de ambientes tóxicos.",
      },
    ],
    symbolCity: {
      name: "Kyoto",
      country: "Japão",
      reason: "refúgio de silêncio e concentração profunda onde grandes obras amadurecem fora dos holofotes.",
    },
  },
];
