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
  hook: string;
  unlocks: string;
  idealFor: string;
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
    hook: "O ano de sair da sombra, parar de pedir aprovação e assumir o controle total das suas decisões.",
    unlocks:
      "Reacende coragem, presença marcante e clareza para iniciar projetos próprios e conduzir a sua agenda sem depender da validação dos outros.",
    idealFor:
      "Quem adiou decisões importantes, sente que viveu no piloto automático ou quer uma virada visível na imagem e na liderança pessoal.",
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
    title: "Dinheiro, Segurança & Patrimônio",
    hook: "O ano de valorizar o seu trabalho, estancar vazamentos de grana e construir um caixa sólido.",
    unlocks:
      "Direciona foco para precificação justa, organização financeira, aumento de margem e decisões concretas de acumulação de patrimônio.",
    idealFor:
      "Quem trabalha muito mas vê o dinheiro escapar, quer cobrar o que realmente vale ou precisa construir reserva e estabilidade real.",
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
    title: "Vendas, Comunicação & Negócios Ágeis",
    hook: "Destrava a fala, acelera reuniões e faz o seu nome e suas propostas circularem no mercado.",
    unlocks:
      "Favorece poder de persuasão, negociações rápidas, produção de conteúdo, vendas consultivas e aprendizados que viram resultado rápido.",
    idealFor:
      "Quem precisa vender mais, aparecer com segurança no mercado ou fechar acordos ágeis por meio de boas conversas.",
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
    title: "Família, Imóveis & Paz Emocional",
    hook: "Foco em reformas, compra de imóveis, fortalecimento das raízes e proteção do seu refúgio familiar.",
    unlocks:
      "Cria base emocional estável para resolver pendências de família, estruturar sua casa e construir segurança de dentro para fora.",
    idealFor:
      "Quem planeja comprar, reformar ou mudar de casa, quer fortalecer laços familiares ou precisa de paz mental para sustentar o próximo salto.",
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
    title: "Palco, Romance & Autoestima",
    hook: "O ano do magnetismo pessoal, da diversão sem culpa, do romance leve e dos projetos autorais.",
    unlocks:
      "Aumenta carisma, criatividade, prazer de viver e abertura para romances vibrantes e projetos com a sua assinatura pessoal.",
    idealFor:
      "Quem passou tempo demais só no modo obrigação e quer voltar a se sentir magnético, criativo, leve e valorizado.",
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
    title: "Rotina Fit, Disciplina & Alta Performance",
    hook: "A engrenagem do relógio suíço: constância na dieta, treinos firmes e produtividade no trabalho.",
    unlocks:
      "Dá o ritmo de um relógio suíço para você não furar a dieta, manter treinos constantes e organizar sua rotina sem estresse.",
    idealFor:
      "Para quem quer emagrecer, quem está à beira do burnout ou quem precisa transformar tarefas manuais em processos eficientes de trabalho.",
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
    title: "Parcerias, Casamento & Alianças",
    hook: "Compromissos sólidos no amor e sociedades de negócios onde um mais um soma dez.",
    unlocks:
      "Coloca holofote em relacionamentos maduros, contratos estratégicos e parcerias complementares que multiplicam resultados.",
    idealFor:
      "Quem quer viver um relacionamento sério de verdade, renovar o casamento ou encontrar o sócio ou cliente-chave certo.",
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
    title: "Grandes Viradas, Auditoria & Dinheiro Compartilhado",
    hook: "Encerramento de ciclos desgastados, renegociação de dívidas e atração de recursos externos.",
    unlocks:
      "Traz lucidez para cortar o que drena energia, reestruturar finanças complexas e abrir portas para investimentos, sócios ou capital de terceiros.",
    idealFor:
      "Quem sabe que precisa virar uma página definitiva, resolver pendências financeiras profundas ou escalar com recursos compartilhados.",
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
    title: "Viagens, Internacionalização & Grande Visão",
    hook: "O salto para fora da bolha: expansão de horizontes, estudos de elite e projetos internacionais.",
    unlocks:
      "Amplia repertório, abre caminhos para viagens marcantes, formações de alto nível, negócios fora do eixo habitual e visão de longo prazo.",
    idealFor:
      "Quem sente que o ambiente atual ficou pequeno e quer expandir fronteiras culturais, acadêmicas ou comerciais.",
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
    title: "Modo CEO, Sucesso Público & Autoridade",
    hook: "O efeito Anitta: sair dos bastidores para o topo, atrair grandes clientes e ser reconhecido no seu nicho.",
    unlocks:
      "Eleva visibilidade profissional, posicionamento de autoridade e foco em entregas de grande impacto que consolidam sua reputação.",
    idealFor:
      "Quem já entrega muito nos bastidores e decidiu ocupar o espaço de liderança, reconhecimento e alto valor no mercado.",
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
    title: "Conexões, Internet & Escala Coletiva",
    hook: "O ano em que o seu networking trabalha por você: grupos influentes, parcerias e crescimento digital.",
    unlocks:
      "Acelera audiência, comunidades, indicações qualificadas e projetos que ganham força quando conectados às pessoas certas.",
    idealFor:
      "Quem quer parar de remar sozinho, crescer no digital, entrar em mesas maiores e escalar através de comunidade e alianças.",
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
    hook: "Incubação de projetos sigilosos, recarga profunda de energia e descanso longe do barulho do mundo.",
    unlocks:
      "Protege sua mente contra excesso de ruído, favorece foco silencioso em projetos estratégicos e restaura clareza emocional e espiritual.",
    idealFor:
      "Quem veio de anos intensos e precisa recarregar a bateria, fechar ciclos internos ou construir um grande projeto em silêncio antes de lançar.",
    symbolCity: {
      name: "Kyoto",
      country: "Japão",
      reason: "refúgio de silêncio, contemplação e concentração profunda onde grandes obras amadurecem fora dos holofotes.",
    },
  },
];
