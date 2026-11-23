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
    profile:
      "Pessoas em fase de transição, quem quer mudar visual/estilo ou iniciar projetos solo.",
    cycleFocus:
      "Favorece assumir o protagonismo das próprias escolhas, resgatar a coragem e agir com independência.",
    symbolCity: {
      name: "Nova York",
      country: "EUA",
      reason: "referência simbólica de iniciativa própria, reinvenção e postura de liderança.",
    },
  },
  {
    id: 2,
    numberLabel: "02",
    element: "Terra",
    iconKey: "wallet",
    title: "Finanças, Produtividade & Construção de Caixa",
    profile:
      "Autônomos, prestadores de serviços e profissionais buscando valorização no mercado.",
    cycleFocus:
      "Cria um ambiente propício para precificar seu trabalho com firmeza, organizar contas e focar em estabilidade material.",
    symbolCity: {
      name: "Zurique",
      country: "Suíça",
      reason: "referência simbólica de solidez financeira, gestão de patrimônio e valorização de recursos.",
    },
  },
  {
    id: 3,
    numberLabel: "03",
    element: "Ar",
    iconKey: "megaphone",
    title: "Comunicação, Negociações & Circulação de Ideias",
    profile:
      "Comerciantes, corretores, negociadores e criadores de conteúdo dinâmico.",
    cycleFocus:
      "Estimula o fluxo de contatos ágeis, clareza para apresentar ideias e maior movimento no seu mercado local.",
    symbolCity: {
      name: "Londres",
      country: "Reino Unido",
      reason: "referência simbólica de circulação de ideias, mídia, diálogo e negociações dinâmicas.",
    },
  },
  {
    id: 4,
    numberLabel: "04",
    element: "Água",
    iconKey: "home",
    title: "Lar, Família & Estrutura Emocional",
    profile:
      "Quem planeja reformas, mudança de casa, projetos familiares ou busca desacelerar.",
    cycleFocus:
      "Direciona a atenção para o espaço íntimo, fortalecimento das raízes e segurança para o seu porto seguro.",
    symbolCity: {
      name: "Florença",
      country: "Itália",
      reason: "referência simbólica de raízes sólidas, arquitetura acolhedora e senso de pertencimento.",
    },
  },
  {
    id: 5,
    numberLabel: "05",
    element: "Fogo",
    iconKey: "flame",
    title: "Autoexpressão, Projetos Autorais & Prazer de Viver",
    profile:
      "Criadores autorais, solteiros abertos a romance e quem quer resgatar o entusiasmo na rotina.",
    cycleFocus:
      "Abre espaço para valorizar seus talentos únicos, viver momentos de lazer e dar vazão à criatividade pessoal.",
    symbolCity: {
      name: "Rio de Janeiro",
      country: "Brasil",
      reason: "referência simbólica de vitalidade solar, criatividade expressiva e leveza no cotidiano.",
    },
  },
  {
    id: 6,
    numberLabel: "06",
    element: "Terra",
    iconKey: "activity",
    title: "Hábitos, Rotina & Saúde Física",
    profile:
      "Quem busca constância em treinos e alimentação, quer organizar a agenda ou evitar sobrecarga de trabalho.",
    cycleFocus:
      "Apoia a construção de disciplina no dia a dia, melhorias no estilo de vida e eficiência prática nas suas entregas.",
    symbolCity: {
      name: "Tóquio",
      country: "Japão",
      reason: "referência simbólica de disciplina diária, método, precisão e excelência nos detalhes.",
    },
  },
  {
    id: 7,
    numberLabel: "07",
    element: "Ar",
    iconKey: "handshake",
    title: "Parcerias, Alianças & Relações Estáveis",
    profile:
      "Quem busca construir compromissos sérios a dois ou estruturar sociedades de negócios.",
    cycleFocus:
      "Coloca o foco em cooperação, acordos equilibrados e aprendizados práticos através da convivência e do diálogo.",
    symbolCity: {
      name: "Paris",
      country: "França",
      reason: "referência simbólica de encontros marcantes, diplomacia e construção de acordos a dois.",
    },
  },
  {
    id: 8,
    numberLabel: "08",
    element: "Água",
    iconKey: "refresh",
    title: "Grandes Transições, Fechamento de Ciclos & Recursos Partilhados",
    profile:
      "Quem lida com burocracias, renegociação de dívidas, processos de visto/sociedade ou transições de vida.",
    cycleFocus:
      "Favorece desapegar de pendências do passado, reestruturar finanças divididas e conduzir mudanças profundas com maturidade.",
    symbolCity: {
      name: "Singapura",
      country: "Singapura",
      reason: "referência simbólica de reestruturação estratégica, gestão compartilhada e transformação.",
    },
  },
  {
    id: 9,
    numberLabel: "09",
    element: "Fogo",
    iconKey: "globe",
    title: "Expansão de Horizontes, Estudos & Conexões Globais",
    profile:
      "Estudantes, nômades, quem sonha morar fora ou quer expandir negócios além das fronteiras.",
    cycleFocus:
      "Estimula o aprendizado avançado, contato com outras culturas e uma visão mais ampla sobre o seu propósito de vida.",
    symbolCity: {
      name: "Lisboa",
      country: "Portugal",
      reason: "referência simbólica de pontes entre culturas, abertura de fronteiras e visão global.",
    },
  },
  {
    id: 10,
    numberLabel: "10",
    element: "Terra",
    iconKey: "trophy",
    title: "Carreira, Imagem Pública & Autoridade de Nicho",
    profile:
      "Influenciadores, artistas, blogueiros, CEOs e empreendedores que buscam posicionamento profissional.",
    cycleFocus:
      "Apoia o ganho de visibilidade estratégica, consolidação da sua reputação pública e postura executiva perante o mercado.",
    symbolCity: {
      name: "Dubai",
      country: "Emirados Árabes",
      reason: "referência simbólica de grandes metas, visibilidade profissional e posicionamento de alto nível.",
    },
  },
  {
    id: 11,
    numberLabel: "11",
    element: "Ar",
    iconKey: "network",
    title: "Redes de Contato, Comunidades & Projetos Digitais",
    profile:
      "Gestores de comunidade, líderes de projetos, infoprodutores e quem atua com coletivos.",
    cycleFocus:
      "Facilita a circulação em grupos alinhados aos seus objetivos, troca de experiências e o crescimento através de colaborações.",
    symbolCity: {
      name: "São Francisco",
      country: "EUA",
      reason: "referência simbólica de redes colaborativas, inovação coletiva e ecossistemas digitais.",
    },
  },
  {
    id: 12,
    numberLabel: "12",
    element: "Água",
    iconKey: "moon",
    title: "Bastidores, Recuperação de Energia & Deep Work",
    profile:
      "Quem vai escrever projetos densos, precisa de um detox social, descanso profundo ou imersão interna.",
    cycleFocus:
      "Cria um clima de maior privacidade e introspecção, ideal para incubar ideias sem ruído externo e recarregar a mente.",
    symbolCity: {
      name: "Kyoto",
      country: "Japão",
      reason: "referência simbólica de silêncio, contemplação e concentração profunda fora dos holofotes.",
    },
  },
];
