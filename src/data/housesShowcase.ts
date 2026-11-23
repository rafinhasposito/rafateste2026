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
  idealFor: string;
  unlocks: string;
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
    title: "Autonomia, Liderança & Nova Identidade",
    idealFor:
      "Quem vive em função dos outros, quem quer mudar de visual/estilo ou abrir um projeto solo.",
    unlocks:
      "O ano de parar de pedir licença, resgatar a coragem e assumir o papel principal da sua vida.",
    symbolCity: {
      name: "Nova York",
      country: "EUA",
      reason: "a cidade onde ninguém espera permissão para se reinventar e liderar o próprio jogo.",
    },
  },
  {
    id: 2,
    numberLabel: "02",
    element: "Terra",
    iconKey: "wallet",
    title: "Dinheiro, Caixa Forte & Patrimônio",
    idealFor:
      "Autônomos, prestadores de serviço e quem cansa de trabalhar sem ver a cor do dinheiro.",
    unlocks:
      "O ano de cobrar o preço justo pelo seu talento, fechar torneiras de gastos bobos e acumular reserva financeira.",
    symbolCity: {
      name: "Zurique",
      country: "Suíça",
      reason: "referência mundial em solidez financeira, gestão de patrimônio e valorização de cada recurso.",
    },
  },
  {
    id: 3,
    numberLabel: "03",
    element: "Ar",
    iconKey: "megaphone",
    title: "Vendas, Fala Destravada & Contatos Rápidos",
    idealFor:
      "Corretores, comerciantes, negociadores, quem faz reuniões diárias ou cria conteúdo curto.",
    unlocks:
      "Destrava a timidez na comunicação, multiplica reuniões e faz o seu nome circular rápido no mercado.",
    symbolCity: {
      name: "Londres",
      country: "Reino Unido",
      reason: "o grande ponto de encontro das ideias, da mídia, das negociações rápidas e dos negócios que circulam o mundo.",
    },
  },
  {
    id: 4,
    numberLabel: "04",
    element: "Água",
    iconKey: "home",
    title: "Família, Imóveis & Porto Seguro",
    idealFor:
      "Quem quer comprar/reformar casa, planeja gravidez ou precisa de paz e privacidade no lar.",
    unlocks:
      "Protege sua intimidade, fortalece raízes e ancora seus investimentos em bens duráveis e refúgio familiar.",
    symbolCity: {
      name: "Florença",
      country: "Itália",
      reason: "símbolo de raízes sólidas, arquitetura atemporal, acolhimento e beleza que atravessa gerações.",
    },
  },
  {
    id: 5,
    numberLabel: "05",
    element: "Fogo",
    iconKey: "flame",
    title: "Palco, Magnetismo & Prazer de Viver",
    idealFor:
      "Solteiros em busca de romance, criadores autorais e quem perdeu a alegria na rotina.",
    unlocks:
      "Acende o brilho pessoal, atrai romances envolventes e coloca a sua criatividade sob aplausos.",
    symbolCity: {
      name: "Rio de Janeiro",
      country: "Brasil",
      reason: "energia solar, magnetismo à flor da pele, criatividade vibrante e celebração da vida sem culpa.",
    },
  },
  {
    id: 6,
    numberLabel: "06",
    element: "Terra",
    iconKey: "activity",
    title: "Mundo Fit, Rotina & Alta Performance",
    idealFor:
      "Quem vive furando a dieta, não consegue manter treinos, sofre com desorganização ou está à beira do burnout.",
    unlocks:
      "A disciplina de um relógio suíço: constância na alimentação, treinos no automático e produtividade sem estresse.",
    symbolCity: {
      name: "Tóquio",
      country: "Japão",
      reason: "a capital mundial da disciplina, da precisão cirúrgica e da excelência nos detalhes do dia a dia.",
    },
  },
  {
    id: 7,
    numberLabel: "07",
    element: "Ar",
    iconKey: "handshake",
    title: "Casamento, Parcerias & Contratos de Ouro",
    idealFor:
      "Quem quer namoro sério, casamento ou sociedades comerciais estratégicas.",
    unlocks:
      "O fim do caminho solitário: alianças sólidas onde um mais um soma dez, tanto no amor quanto nos negócios.",
    symbolCity: {
      name: "Paris",
      country: "França",
      reason: "o cenário clássico dos encontros marcantes, da diplomacia fina e das alianças construídas a dois.",
    },
  },
  {
    id: 8,
    numberLabel: "08",
    element: "Água",
    iconKey: "refresh",
    title: "Grandes Viradas, Heranças & Dinheiro Compartilhado",
    idealFor:
      "Quem precisa encerrar ciclos desgastados, renegociar dívidas, aprovar vistos/processos ou atrair investidores.",
    unlocks:
      "Auditoria profunda de vida: desapego cirúrgico do passado e desbloqueio de recursos de terceiros.",
    symbolCity: {
      name: "Singapura",
      country: "Singapura",
      reason: "um dos maiores centros globais de engenharia financeira, reestruturação estratégica e transformação acelerada.",
    },
  },
  {
    id: 9,
    numberLabel: "09",
    element: "Fogo",
    iconKey: "globe",
    title: "Internacionalização, Estudos de Elite & Salto de Vida",
    idealFor:
      "Nômades digitais, estudantes, quem sonha morar fora ou quer expandir negócios além das fronteiras.",
    unlocks:
      "O salto para fora da bolha: viagens marcantes, proteção em causas da justiça e expansão radical de horizontes.",
    symbolCity: {
      name: "Lisboa",
      country: "Portugal",
      reason: "ponte histórica entre continentes, ponto de partida para quem amplia fronteiras e constrói vida global.",
    },
  },
  {
    id: 10,
    numberLabel: "10",
    element: "Terra",
    iconKey: "trophy",
    title: "Fama, Modo CEO & Reconhecimento de Elite",
    idealFor:
      "Influenciadores, cantores, artistas, blogueiros, CEOs e empreendedores que precisam ser vistos.",
    unlocks:
      "O Efeito Anitta: sai dos bastidores para os holofotes mundiais, ganha autoridade no nicho e atrai grandes contratos.",
    symbolCity: {
      name: "Dubai",
      country: "Emirados Árabes",
      reason: "vitrine mundial de ambição concreta, grandes metas e marcas que escolhem jogar no topo.",
    },
  },
  {
    id: 11,
    numberLabel: "11",
    element: "Ar",
    iconKey: "network",
    title: "Networking VIP, Comunidades & Escala Digital",
    idealFor:
      "Infoprodutores, líderes comunitários, gestores de eventos e quem vive de audiência e parcerias.",
    unlocks:
      "Sua rede trabalha por você: atração de padrinhos influentes, indicações espontâneas e viralização de projetos.",
    symbolCity: {
      name: "São Francisco",
      country: "EUA",
      reason: "o berço das redes globais, das comunidades de alto impacto e dos projetos construídos para escalar.",
    },
  },
  {
    id: 12,
    numberLabel: "12",
    element: "Água",
    iconKey: "moon",
    title: "Bastidores, Blindagem & Deep Work",
    idealFor:
      "Quem vai escrever um livro, gestar um projeto sigiloso, fazer terapia profunda ou precisa de detox social.",
    unlocks:
      "Incubação silenciosa: recarga profunda de energia, intuição afiada e proteção longe da inveja e do barulho do mundo.",
    symbolCity: {
      name: "Kyoto",
      country: "Japão",
      reason: "refúgio de silêncio, contemplação e concentração profunda onde grandes obras amadurecem fora dos holofotes.",
    },
  },
];
