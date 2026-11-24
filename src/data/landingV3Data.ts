export type V3AngleKey = "padrao" | "fitness" | "carreira" | "cetico";

export interface V3AngleConfig {
  key: V3AngleKey;
  label: string;
  badge: string;
  headline: string;
  highlight: string;
  subcopy: string;
  ctaLabel: string;
  featuredHouseId: number | null;
}

// Headlines 100% compliance Meta Ads (zero "Atributos Pessoais") e TikTok Ads (zero promessa mágica)
export const V3_ANGLES: Record<V3AngleKey, V3AngleConfig> = {
  padrao: {
    key: "padrao",
    label: "Home Editorial • Destinos + Passado Grátis",
    badge: "PROTOCOLO SOLAR • REVOLUÇÃO SOLAR PERSONALIZADA",
    headline: "Onde você quer começar",
    highlight: "seu próximo ano de vida?",
    subcopy:
      "Explore destinos para o seu aniversário com uma leitura personalizada de Revolução Solar. Comece conhecendo gratuitamente a interpretação de um aniversário que você já viveu.",
    ctaLabel: "Consultar meu aniversário passado grátis",
    featuredHouseId: null,
  },
  fitness: {
    key: "fitness",
    label: "Teste 1 • Rotina & Bem-Estar (Casa 06)",
    badge: "Casa 06 • Rotina, Disciplina & Vitalidade",
    headline: "Como o destino do aniversário conversa com",
    highlight: "sua rotina, treinos e bem-estar.",
    subcopy:
      "Na Revolução Solar relocada, cada coordenada destaca um tema diferente do ciclo — e a Casa 06 coloca foco em hábitos, constância e saúde física. Comece testando grátis seu último aniversário.",
    ctaLabel: "Consultar meu aniversário passado grátis",
    featuredHouseId: 6,
  },
  carreira: {
    key: "carreira",
    label: "Teste 2 • Carreira & Visibilidade (Casa 10)",
    badge: "Casa 10 & Casa 02 • Carreira, Posicionamento & Finanças",
    headline: "Explore destinos de aniversário com foco em",
    highlight: "carreira, visibilidade e estrutura.",
    subcopy:
      "Veja em quais coordenadas a Casa 10 (projeção profissional) e a Casa 02 (organização financeira) ganham protagonismo no seu mapa anual. Confira grátis o que seu último aniversário ativou.",
    ctaLabel: "Consultar meu aniversário passado grátis",
    featuredHouseId: 10,
  },
  cetico: {
    key: "cetico",
    label: "Teste 3 • Validação do Passado",
    badge: "Consulta Gratuita • Teste em um Ciclo Já Vivido",
    headline: "Antes de planejar o próximo aniversário, consulte grátis",
    highlight: "um ano que você já viveu.",
    subcopy:
      "Informe onde você passou um aniversário anterior e veja a leitura astrológica daquele ciclo calculada via Swiss Ephemeris — sem cartão e sem pedir e-mail antes do resultado.",
    ctaLabel: "Consultar meu aniversário passado grátis",
    featuredHouseId: null,
  },
};

export interface HeroBoardingDestination {
  id: string;
  city: string;
  country: string;
  iata: string;
  coords: string;
  houseLabel: string;
  themeShort: string;
  image: string;
  video: string;
}

export const HERO_BOARDING_DESTINATIONS: HeroBoardingDestination[] = [
  {
    id: "zurich",
    city: "Zurique",
    country: "Suíça",
    iata: "ZRH",
    coords: "47°22' N • 08°33' E",
    houseLabel: "Casa 02 • Exemplo ilustrativo",
    themeShort: "Vida financeira, margens & reserva",
    image: "/images/abertura/zurich.jpg",
    video: "/videos/v3/voo-embarque-zurique.mp4",
  },
  {
    id: "roma",
    city: "Roma",
    country: "Itália",
    iata: "FCO",
    coords: "41°54' N • 12°29' E",
    houseLabel: "Casa 07 • Exemplo ilustrativo",
    themeShort: "Relacionamentos, acordos & parcerias",
    image: "/images/abertura/roma.jpg",
    video: "/assets/roma.mp4",
  },
  {
    id: "ny",
    city: "Nova York",
    country: "Estados Unidos",
    iata: "JFK",
    coords: "40°43' N • 74°00' W",
    houseLabel: "Casa 10 • Exemplo ilustrativo",
    themeShort: "Carreira, reputação & liderança",
    image: "/images/abertura/ny.jpg",
    video: "/assets/ny.mp4",
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    iata: "CDG",
    coords: "48°51' N • 02°21' E",
    houseLabel: "Casa 05 • Exemplo ilustrativo",
    themeShort: "Criatividade, autoria & leveza",
    image: "/images/abertura/paris.jpg",
    video: "/assets/paris.mp4",
  },
];

export interface DemoCharacterCity {
  id: string;
  city: string;
  country: string;
  iata: string;
  coords: string;
  houseNumber: number;
  houseLabel: string;
  solarAscendant: string;
  headline: string;
  interpretation: string;
  portraitImage: string;
  portraitVideo: string;
  skylineImage: string;
  highlights: { label: string; detail: string }[];
}

export interface NeurosciencePillar {
  step: string;
  title: string;
  body: string;
}

export const NEUROSCIENCE_PILLARS: NeurosciencePillar[] = [
  {
    step: "01 • O Sinal Invisível",
    title: "Como o Wi-Fi ou a gravidade",
    body: "Você não enxerga o sinal no ar, mas sente na prática por que certos anos fluem com leveza e outros parecem travar.",
  },
  {
    step: "02 • A Antena do Ciclo",
    title: "Sinal cheio em uma área",
    body: "No minuto do seu aniversário, o Sol reinicia seu ciclo. A cidade onde você está funciona como uma antena, dando sinal cheio para uma das suas 12 Casas.",
  },
  {
    step: "03 • Você Segue no Leme",
    title: "Possibilidades, não mágica",
    body: "Nada acontece sem a sua ação. Essa coordenada abre terreno fértil — você continua no comando, só para de remar contra a maré.",
  },
];

export const DEMO_CHARACTER_PROFILE = {
  name: "Lucas M. (personagem demonstrativo)",
  birthDate: "28 de outubro",
  birthTime: "14:20",
  birthCity: "São Paulo, SP",
  note: "Cálculos reais conferidos via Swiss Ephemeris para os mesmos dados natais.",
};

export const DEMO_CHARACTER_CITIES: DemoCharacterCity[] = [
  {
    id: "zurique",
    city: "Zurique",
    country: "Suíça",
    iata: "ZRH",
    coords: "47°22' N • 08°33' E",
    houseNumber: 2,
    houseLabel: "Sol na Casa 02",
    solarAscendant: "Ascendente anual em Libra",
    headline: "Foco em estrutura material, precificação e autonomia financeira",
    interpretation:
      "Para Lucas, passar a virada solar em Zurique desloca o Sol anual para a Casa 02. O ano pede decisões objetivas sobre fluxo de caixa, valor da própria hora e construção de patrimônio tangível.",
    portraitImage: "/images/v3/demo-zurique-casa2.jpg",
    portraitVideo: "/videos/v3/demo-zurique-casa2.mp4",
    skylineImage: "/images/abertura/zurich.jpg",
    highlights: [
      { label: "Vida financeira", detail: "Revisão de contratos, corte de desperdícios e foco em margem real." },
      { label: "Trabalho", detail: "Menos volume disperso, mais entregas bem pagas e previsíveis." },
      { label: "Ritmo pessoal", detail: "Busca por segurança concreta, conforto e rotina estável." },
    ],
  },
  {
    id: "roma",
    city: "Roma",
    country: "Itália",
    iata: "FCO",
    coords: "41°54' N • 12°29' E",
    houseNumber: 7,
    houseLabel: "Sol na Casa 07",
    solarAscendant: "Ascendente anual em Escorpião",
    headline: "Foco em relacionamentos, sociedades e acordos a dois",
    interpretation:
      "Com exatamente a mesma data e hora de nascimento, estar em Roma no retorno solar leva o Sol de Lucas para a Casa 07. O ciclo deixa de ser solo e passa a girar em torno de alianças, clientes-chave e vida afetiva.",
    portraitImage: "/images/v3/demo-roma-casa7.jpg",
    portraitVideo: "/videos/v3/demo-roma-casa7.mp4",
    skylineImage: "/images/abertura/roma.jpg",
    highlights: [
      { label: "Relacionamentos", detail: "Conversas decisivas sobre compromisso, reciprocidade e planos juntos." },
      { label: "Negócios", detail: "Crescimento via sócios, parcerias comerciais e negociações diretas." },
      { label: "Ponto de atenção", detail: "Posicionar limites claros sem anular a própria vontade." },
    ],
  },
  {
    id: "ny",
    city: "Nova York",
    country: "EUA",
    iata: "JFK",
    coords: "40°43' N • 74°00' W",
    houseNumber: 10,
    houseLabel: "Sol na Casa 10",
    solarAscendant: "Ascendente anual em Leão",
    headline: "Foco em carreira, visibilidade pública e tomada de comando",
    interpretation:
      "Se Lucas passa o mesmo minuto da virada em Nova York, o Sol anual sobe ao topo do mapa (Casa 10). A leitura muda para exposição profissional, responsabilidade maior e consolidação de reputação.",
    portraitImage: "/images/v3/demo-ny-casa10.jpg",
    portraitVideo: "/videos/v3/demo-ny-casa10.mp4",
    skylineImage: "/images/abertura/ny.jpg",
    highlights: [
      { label: "Carreira", detail: "Projetos de vitrine, promoções ou reposicionamento de marca pessoal." },
      { label: "Autoridade", detail: "Mais cobrança por entrega real, liderança e postura estratégica." },
      { label: "Equilíbrio", detail: "Proteger descanso para não transformar ambição em exaustão." },
    ],
  },
];

export interface V3PriorityOption {
  id: string;
  houseId: number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

export const V3_PRIORITY_OPTIONS: V3PriorityOption[] = [
  {
    id: "carreira",
    houseId: 10,
    title: "Carreira & Posicionamento",
    subtitle: "Visibilidade profissional, liderança, metas e reputação no mercado",
    tag: "Casa 10",
    image: "/images/abertura/ny.jpg",
  },
  {
    id: "relacionamentos",
    houseId: 7,
    title: "Relacionamentos & Parcerias",
    subtitle: "Vida a dois, encontros maduros, acordos e sociedades estratégicas",
    tag: "Casa 07",
    image: "/images/abertura/roma.jpg",
  },
  {
    id: "dinheiro",
    houseId: 2,
    title: "Vida Financeira & Estrutura",
    subtitle: "Organizar ganhos, valorizar seu trabalho e fortalecer reserva",
    tag: "Casa 02",
    image: "/images/abertura/zurich.jpg",
  },
  {
    id: "fitness",
    houseId: 6,
    title: "Rotina, Saúde & Bem-Estar",
    subtitle: "Constância nos treinos, organização diária, energia e hábitos",
    tag: "Casa 06",
    image: "/images/abertura/tokyo.jpg",
  },
];

export interface TravelRadiusOption {
  id: "home" | "300km" | "3000km" | "world";
  title: string;
  subtitle: string;
  badge: string;
}

export const TRAVEL_RADIUS_OPTIONS: TravelRadiusOption[] = [
  {
    id: "home",
    title: "Considerar minha cidade atual",
    subtitle: "Ver a leitura de passar na minha cidade + Manual de Defesa local",
    badge: "Sem viagem",
  },
  {
    id: "300km",
    title: "Destinos próximos (até ~300 km)",
    subtitle: "Avaliar cidades vizinhas de carro/ônibus quando houver mudança de Casa",
    badge: "Regional",
  },
  {
    id: "3000km",
    title: "Brasil & América do Sul (até 3.000 km)",
    subtitle: "Capitais brasileiras e países vizinhos com voos diretos",
    badge: "Nacional / LatAm",
  },
  {
    id: "world",
    title: "Qualquer destino no mundo",
    subtitle: "Comparar coordenadas globais na Europa, América do Norte, Ásia e Oceania",
    badge: "Global",
  },
];

export interface V3PlanSpec {
  pkg: "1" | "3" | "full";
  badge: string;
  name: string;
  forWhom: string;
  exactQuantity: string;
  includedContent: string[];
  accessFormat: string;
  priceInt: string;
  priceDec: string;
  ctaLabel: string;
  featured?: boolean;
}

export const V3_PLANS: V3PlanSpec[] = [
  {
    pkg: "1",
    badge: "Plano de Entrada • Compra Completa",
    name: "1 Destino ou 1 Casa",
    forWhom:
      "Para quem já tem 1 cidade em mente para o aniversário ou quer descobrir os destinos de 1 tema específico.",
    exactQuantity: "1 leitura completa (1 Cidade específica ou 1 Casa Solar à sua escolha)",
    includedContent: [
      "Cálculo exato do retorno solar (data, horário UTC e coordenadas)",
      "Interpretação completa das 8 áreas da vida naquele destino",
      "Manual de Defesa prático (pontos fortes + pontos de atenção do ciclo)",
      "Cartão de Embarque Solar personalizado para salvar",
    ],
    accessFormat: "Acesso online imediato na tela (celular e computador), sem assinatura.",
    priceInt: "19",
    priceDec: "90",
    ctaLabel: "Escolher 1 Leitura (R$ 19,90)",
  },
  {
    pkg: "3",
    badge: "Comparação • 3 Leituras",
    name: "Comparador de 3 Cidades",
    forWhom:
      "Para quem está em dúvida entre até 3 viagens possíveis (ex.: ficar em casa, ir para uma praia próxima ou viajar para fora).",
    exactQuantity: "3 créditos de leitura (use em até 3 Cidades ou 3 Casas Solares)",
    includedContent: [
      "Comparação objetiva entre até 3 coordenadas diferentes",
      "Todas as 8 áreas da vida detalhadas em cada uma das 3 leituras",
      "Filtro de distância regional, nacional ou internacional",
      "Manual de Defesa da Cidade Atual + Cartões de Embarque",
    ],
    accessFormat: "Acesso online imediato • você pode usar os 3 créditos juntos ou quando quiser.",
    priceInt: "49",
    priceDec: "90",
    ctaLabel: "Comparar 3 Destinos (R$ 49,90)",
    featured: true,
  },
  {
    pkg: "full",
    badge: "Visão Integral • 12 Casas",
    name: "Dossiê Completo (12 Casas)",
    forWhom:
      "Para quem quer enxergar o mapa inteiro de possibilidades no mundo antes de bater o martelo no destino do ano.",
    exactQuantity: "Todas as 12 Casas Solares do seu próximo aniversário desbloqueadas",
    includedContent: [
      "Mapeamento global de destinos sugeridos para cada uma das 12 Casas",
      "Leitura completa das 8 áreas da vida nas 12 Casas do ciclo",
      "Visão panorâmica para cruzar orçamento, distância e prioridade pessoal",
      "Acesso permanente ao seu histórico de consultas na conta",
    ],
    accessFormat: "Acesso online imediato e completo na sua área logada • pagamento único.",
    priceInt: "99",
    priceDec: "90",
    ctaLabel: "Liberar as 12 Casas (R$ 99,90)",
  },
];

export interface HomeCityDefenseGuide {
  houseId: number;
  strength: string;
  blindSpot: string;
}

export const HOME_CITY_DEFENSE: Record<number, HomeCityDefenseGuide> = {
  1: {
    strength:
      "Use o ciclo para tomar decisões solo, renovar sua imagem e tirar projetos pessoais do papel sem esperar validação externa.",
    blindSpot:
      "Evite agir por impulso ou romper pontes úteis por impaciência — firmeza não precisa virar isolamento.",
  },
  2: {
    strength:
      "Aproveite a clareza material para revisar preços, cortar vazamentos silenciosos de dinheiro e construir reserva mensal fixa.",
    blindSpot:
      "Evite travar no medo de escassez ou trabalhar demais sem aumentar sua margem real por hora.",
  },
  3: {
    strength:
      "Coloque sua voz para circular: grave conteúdos curtos, faça mais reuniões de venda e feche cursos práticos de retorno rápido.",
    blindSpot:
      "Evite dispersar energia em dez conversas simultâneas sem concluir nenhuma entrega.",
  },
  4: {
    strength:
      "Direcione energia para organizar sua casa, resolver assuntos de família e criar uma base emocional sólida.",
    blindSpot:
      "Evite se fechar demais em casa a ponto de perder oportunidades externas importantes.",
  },
  5: {
    strength:
      "Dê palco para projetos com sua assinatura, invista em lazer sem culpa e abra espaço para conexões afetivas mais leves.",
    blindSpot:
      "Evite depender apenas de empolgação momentânea — mantenha um mínimo de constância financeira em paralelo.",
  },
  6: {
    strength:
      "Transforme treino, sono, dieta e agenda de trabalho em blocos fixos de rotina — esse ciclo favorece disciplina prática.",
    blindSpot:
      "Evite perfeccionismo excessivo ou abraçar tarefas manuais demais até bater no burnout.",
  },
  7: {
    strength:
      "Priorize alianças maduras, contratos claros e parcerias complementares em vez de tentar carregar tudo sozinho.",
    blindSpot:
      "Evite adiar conversas difíceis para agradar — bons acordos dependem de limites transparentes.",
  },
  8: {
    strength:
      "Faça a auditoria completa: renegocie dívidas, encerre ciclos desgastados e organize finanças compartilhadas com frieza.",
    blindSpot:
      "Evite segurar situações que já acabaram por apego — adiar cortes só prolonga o desgaste.",
  },
  9: {
    strength:
      "Invista em estudos de nível superior, idiomas, repertório amplo e projetos com clientes ou referências fora da sua bolha.",
    blindSpot:
      "Evite ficar só no mundo das grandes ideias sem transformar o aprendizado em um passo concreto semanal.",
  },
  10: {
    strength:
      "Assuma postura executiva, apareça mais no seu nicho e priorize entregas visíveis que consolidem sua reputação pública.",
    blindSpot:
      "Evite sacrificar completamente saúde e vida pessoal em nome de status ou aprovação externa.",
  },
  11: {
    strength:
      "Participe de grupos qualificados, faça collabs e fortaleça sua audiência digital — indicações certas aceleram o ano.",
    blindSpot:
      "Evite confundir popularidade vazia com rede estratégica que gera oportunidades reais.",
  },
  12: {
    strength:
      "Proteja seu silêncio para recarregar energia, fazer terapia ou incubar um grande projeto em Deep Work antes de lançar.",
    blindSpot:
      "Evite fugir de decisões práticas ou se isolar sem data para voltar à ação.",
  },
};

export const V3_FAQ_ITEMS = [
  {
    id: "v3-faq-no-time",
    q: "Não sei meu horário de nascimento. Consigo usar?",
    a: "Sim. Na etapa de horário basta marcar “Não sei meu horário exato (usar 12:00 aproximado)”. O sistema utiliza o meio-dia como referência solar e avisa com transparência que, sem o minuto da certidão, cidades na fronteira entre duas Casas podem variar alguns graus. Você conhece a experiência agora e pode atualizar o horário depois se encontrar a certidão.",
  },
  {
    id: "v3-faq-no-travel",
    q: "Preciso viajar para outro país?",
    a: "Não. Você pode consultar a leitura de passar o aniversário na sua própria cidade atual (incluindo o Manual de Defesa local) ou avaliar cidades regionais e nacionais. Não prometemos que sempre haverá uma mudança de Casa a poucos quilômetros — porque isso depende da geometria astronômica real do seu mapa —, mas você confere opções próximas e distantes antes de decidir.",
  },
  {
    id: "v3-faq-free-vs-paid",
    q: "Qual a diferença entre a consulta gratuita e o relatório pago?",
    a: "A consulta gratuita permite testar um aniversário que você já viveu, mostrando a Casa Solar ativada naquele ano e um resumo dos temas centrais para você conhecer o método na prática. Os relatórios pagos calculam o seu próximo aniversário, revelam os destinos compatíveis com seus objetivos, comparam cidades e liberam a leitura detalhada das 8 áreas da vida.",
  },
  {
    id: "v3-faq-natal-diff",
    q: "Isso é diferente do mapa natal?",
    a: "Sim. O mapa natal é fixo — retrata o céu do momento em que você nasceu. A Revolução Solar calcula o instante exato em que o Sol retorna àquela mesma posição a cada aniversário, considerando a latitude e longitude da cidade onde você estiver naquele momento (via tabelas astronômicas Swiss Ephemeris).",
  },
  {
    id: "v3-faq-delivery",
    q: "Como recebo meu relatório?",
    a: "O acesso é 100% digital e imediato, direto na tela do celular ou computador assim que o pagamento via Pix ou Cartão é confirmado. Sua leitura também fica salva na sua conta para consultar durante todo o ano.",
  },
  {
    id: "v3-faq-guarantee-events",
    q: "A leitura garante que algo vai acontecer?",
    a: "Não. Trata-se de uma interpretação astrológica tradicional de Revolução Solar calculada com precisão astronômica, voltada para reflexão pessoal e planejamento de viagem e metas — sem garantia determinista de acontecimentos financeiros, profissionais ou afetivos.",
  },
  {
    id: "v3-faq-affiliate",
    q: "Como funciona a indicação de parceiros (20% no Pix)?",
    a: "Clientes e criadores podem ativar gratuitamente um link identificado (/i/CODIGO) e receber 20% no Pix sobre compras confirmadas, sem aumentar um centavo no preço pago por quem entra. Exigimos protocolo ético: testar primeiro o próprio aniversário passado e sinalizar #publi conforme normas do CONAR.",
  },
];
