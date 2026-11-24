export type V3AngleKey = "padrao" | "fitness" | "carreira" | "cetico";

export interface V3AngleConfig {
  key: V3AngleKey;
  headline: string;
  subcopy: string;
  ctaLabel: string;
  featuredHouseId: number | null;
}

// Micro-copy curta, magnética e 100% compatível com Meta Ads & TikTok Ads
export const V3_ANGLES: Record<V3AngleKey, V3AngleConfig> = {
  padrao: {
    key: "padrao",
    headline: "Onde começa o seu próximo ano?",
    subcopy:
      "Descubra grátis qual área ganhou sinal cheio na cidade do seu último aniversário.",
    ctaLabel: "Testar meu último aniversário grátis",
    featuredHouseId: null,
  },
  fitness: {
    key: "fitness",
    headline: "Em qual cidade sua rotina finalmente engrena?",
    subcopy:
      "Veja grátis qual Casa a cidade do seu último aniversário ligou nos seus últimos 12 meses.",
    ctaLabel: "Testar meu último aniversário grátis",
    featuredHouseId: 6,
  },
  carreira: {
    key: "carreira",
    headline: "Em qual coordenada sua carreira ganha palco?",
    subcopy:
      "Confira grátis o que o lugar do seu último aniversário ativou no seu ciclo.",
    ctaLabel: "Testar meu último aniversário grátis",
    featuredHouseId: 10,
  },
  cetico: {
    key: "cetico",
    headline: "Não acredite. Teste um ano que você já viveu.",
    subcopy:
      "Coloque a cidade do seu último aniversário e tire a prova grátis em 30 segundos.",
    ctaLabel: "Tirar a prova no meu passado grátis",
    featuredHouseId: null,
  },
};

export interface HeroBoardingDestination {
  id: string;
  city: string;
  country: string;
  iata: string;
  coords: string;
  houseCode: string;
  vibe: string;
  image: string;
  video: string;
}

export const HERO_BOARDING_DESTINATIONS: HeroBoardingDestination[] = [
  {
    id: "zurich",
    city: "Zurique",
    country: "Suíça",
    iata: "ZRH",
    coords: "47°22'N · 08°33'E",
    houseCode: "CASA 02",
    vibe: "Caixa, margens & patrimônio",
    image: "/images/abertura/zurich.jpg",
    video: "/videos/v3/voo-embarque-zurique.mp4",
  },
  {
    id: "roma",
    city: "Roma",
    country: "Itália",
    iata: "FCO",
    coords: "41°54'N · 12°29'E",
    houseCode: "CASA 07",
    vibe: "Encontros, alianças & vida a dois",
    image: "/images/abertura/roma.jpg",
    video: "/assets/roma.mp4",
  },
  {
    id: "ny",
    city: "Nova York",
    country: "EUA",
    iata: "JFK",
    coords: "40°43'N · 74°00'W",
    houseCode: "CASA 10",
    vibe: "Protagonismo, carreira & fama",
    image: "/images/abertura/ny.jpg",
    video: "/assets/ny.mp4",
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    iata: "CDG",
    coords: "48°51'N · 02°21'E",
    houseCode: "CASA 05",
    vibe: "Prazer, criação & magnetismo",
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
  mapX: number; // % em SVG 0..1000
  mapY: number; // % em SVG 0..420
  houseNumber: number;
  houseLabel: string;
  headline: string;
  oneLiner: string;
  portraitImage: string;
  portraitVideo: string;
  skylineImage: string;
  chips: string[];
}

export const DEMO_CHARACTER_PROFILE = {
  name: "Lucas · 28/10 às 14:20",
  originIata: "GRU",
  originCity: "São Paulo",
  mapX: 330,
  mapY: 310,
};

export const DEMO_CHARACTER_CITIES: DemoCharacterCity[] = [
  {
    id: "zurique",
    city: "Zurique",
    country: "Suíça",
    iata: "ZRH",
    coords: "47°22'N · 08°33'E",
    mapX: 525,
    mapY: 132,
    houseNumber: 2,
    houseLabel: "CASA 02",
    headline: "Sinal cheio em dinheiro e estrutura",
    oneLiner: "Mesma pessoa, mesma data: em Zurique o ciclo vira organização financeira e reserva.",
    portraitImage: "/images/v3/demo-zurique-casa2.jpg",
    portraitVideo: "/videos/v3/demo-zurique-casa2.mp4",
    skylineImage: "/images/abertura/zurich.jpg",
    chips: ["Margem & Preço", "Caixa Forte", "Patrimônio"],
  },
  {
    id: "roma",
    city: "Roma",
    country: "Itália",
    iata: "FCO",
    coords: "41°54'N · 12°29'E",
    mapX: 540,
    mapY: 156,
    houseNumber: 7,
    houseLabel: "CASA 07",
    headline: "Sinal cheio em amor e grandes acordos",
    oneLiner: "Em Roma o ano deixa de ser solo: entram sociedades estratégicas e decisões a dois.",
    portraitImage: "/images/v3/demo-roma-casa7.jpg",
    portraitVideo: "/videos/v3/demo-roma-casa7.mp4",
    skylineImage: "/images/abertura/roma.jpg",
    chips: ["Vida a Dois", "Sociedades", "Contratos"],
  },
  {
    id: "ny",
    city: "Nova York",
    country: "EUA",
    iata: "JFK",
    coords: "40°43'N · 74°00'W",
    mapX: 285,
    mapY: 155,
    houseNumber: 10,
    houseLabel: "CASA 10",
    headline: "Sinal cheio em carreira e visibilidade",
    oneLiner: "Em Nova York o Sol sobe ao topo do mapa: palco, autoridade e tomada de comando.",
    portraitImage: "/images/v3/demo-ny-casa10.jpg",
    portraitVideo: "/videos/v3/demo-ny-casa10.mp4",
    skylineImage: "/images/abertura/ny.jpg",
    chips: ["Modo CEO", "Reputação", "Holofote"],
  },
];

export interface V3PriorityOption {
  id: string;
  houseId: number;
  title: string;
  flapCode: string;
  tag: string;
  image: string;
}

export const V3_PRIORITY_OPTIONS: V3PriorityOption[] = [
  {
    id: "carreira",
    houseId: 10,
    title: "Carreira & Holofote",
    flapCode: "CASA 10 · PALCO",
    tag: "Casa 10",
    image: "/images/abertura/ny.jpg",
  },
  {
    id: "amor",
    houseId: 7,
    title: "Amor & Parcerias",
    flapCode: "CASA 07 · DUPLA",
    tag: "Casa 07",
    image: "/images/abertura/roma.jpg",
  },
  {
    id: "dinheiro",
    houseId: 2,
    title: "Caixa & Patrimônio",
    flapCode: "CASA 02 · CAIXA",
    tag: "Casa 02",
    image: "/images/abertura/zurich.jpg",
  },
  {
    id: "fitness",
    houseId: 6,
    title: "Corpo & Disciplina",
    flapCode: "CASA 06 · RITMO",
    tag: "Casa 06",
    image: "/images/abertura/tokyo.jpg",
  },
];

export interface TravelRadiusOption {
  id: "home" | "300km" | "3000km" | "world";
  title: string;
  badge: string;
}

export const TRAVEL_RADIUS_OPTIONS: TravelRadiusOption[] = [
  { id: "home", title: "Ficar na minha cidade", badge: "R$ 0 viagem" },
  { id: "300km", title: "Até ~300 km de carro", badge: "Regional" },
  { id: "3000km", title: "Brasil & América do Sul", badge: "Nacional" },
  { id: "world", title: "Qualquer lugar do mundo", badge: "Global" },
];

export interface V3PlanSpec {
  pkg: "1" | "3" | "full";
  code: string;
  name: string;
  tagline: string;
  bullets: string[];
  priceInt: string;
  priceDec: string;
  ctaLabel: string;
  featured?: boolean;
}

export const V3_PLANS: V3PlanSpec[] = [
  {
    pkg: "1",
    code: "PASSE 01",
    name: "1 Destino ou 1 Casa",
    tagline: "Compra completa para testar 1 cidade ou descobrir os destinos de 1 foco.",
    bullets: [
      "1 Cidade ou 1 Casa Solar liberada",
      "Todas as 8 áreas da vida abertas",
      "Manual de Defesa + Bilhete Solar",
    ],
    priceInt: "19",
    priceDec: "90",
    ctaLabel: "Liberar 1 Leitura",
  },
  {
    pkg: "3",
    code: "PASSE 03",
    name: "Comparador 3 Cidades",
    tagline: "Compare até 3 viagens possíveis antes de emitir passagem.",
    bullets: [
      "3 leituras livres (Cidades ou Casas)",
      "8 áreas da vida em cada destino",
      "Filtro regional, nacional ou global",
    ],
    priceInt: "49",
    priceDec: "90",
    ctaLabel: "Comparar 3 Destinos",
    featured: true,
  },
  {
    pkg: "full",
    code: "PASSE 12",
    name: "Mapa Completo (12 Casas)",
    tagline: "Destrava o globo inteiro com todas as 12 Casas do seu próximo ciclo.",
    bullets: [
      "Todas as 12 Casas Solares abertas",
      "Rotas no Brasil e no mundo inteiro",
      "Acesso imediato e salvo na conta",
    ],
    priceInt: "99",
    priceDec: "90",
    ctaLabel: "Abrir Mapa Completo",
  },
];

export interface HomeCityDefenseGuide {
  houseId: number;
  strength: string;
  blindSpot: string;
}

export const HOME_CITY_DEFENSE: Record<number, HomeCityDefenseGuide> = {
  1: {
    strength: "Ótimo para decisões solo, mudar visual e tirar projetos pessoais da gaveta.",
    blindSpot: "Cuidado apenas para não confundir autonomia com impaciência.",
  },
  2: {
    strength: "Favorece renegociar preços, organizar ganhos e montar reserva real.",
    blindSpot: "Evite trabalhar no automático sem aumentar sua margem.",
  },
  3: {
    strength: "Excelente para vendas, vídeos curtos, networking rápido e estudos práticos.",
    blindSpot: "Evite abrir dez frentes ao mesmo tempo sem fechar nenhuma.",
  },
  4: {
    strength: "Pede foco em casa, imóveis, família e base emocional firme.",
    blindSpot: "Evite se trancar demais a ponto de perder boas conexões.",
  },
  5: {
    strength: "Acende autoria, romance, lazer sem culpa e magnetismo pessoal.",
    blindSpot: "Mantenha rotina mínima para não depender só de empolgação.",
  },
  6: {
    strength: "Ciclo de relógio suíço para treino, saúde física e agenda limpa.",
    blindSpot: "Não abrace tarefas demais até chegar na exaustão.",
  },
  7: {
    strength: "Impulsiona vida a dois, bons contratos e sócios complementares.",
    blindSpot: "Não engula acordos ruins só para evitar conversa franca.",
  },
  8: {
    strength: "Ideal para cortar ralos financeiros, quitar pendências e virar a página.",
    blindSpot: "Evite segurar ciclos que já deram o que tinham que dar.",
  },
  9: {
    strength: "Expande fronteiras: viagens, idiomas, ensino e novos mercados.",
    blindSpot: "Transforme grandes ideias em metas semanais práticas.",
  },
  10: {
    strength: "Topo do mapa: visibilidade pública, promoções e postura de liderança.",
    blindSpot: "Proteja o sono e a vida pessoal enquanto acelera na carreira.",
  },
  11: {
    strength: "Multiplica resultados via grupos, collabs, eventos e indicações.",
    blindSpot: "Filtre bem sua rede para focar em quem constrói junto.",
  },
  12: {
    strength: "Ano estratégico de bastidor, terapia, descanso e preparo de virada.",
    blindSpot: "Respeite seu ritmo sem fugir das decisões práticas.",
  },
};

export const V3_FAQ_ITEMS = [
  {
    id: "faq-hora",
    q: "Não sei meu horário exato de nascimento. Funciona?",
    a: "Sim. Marque “Usar 12:00 aproximado” no teste. Avisamos com transparência que cidades na fronteira entre duas Casas podem variar alguns graus sem a certidão.",
  },
  {
    id: "faq-viagem",
    q: "Preciso viajar para fora do país?",
    a: "Não. Você pode consultar sua própria cidade atual (com Manual de Defesa incluso) ou testar destinos próximos de carro e voos nacionais.",
  },
  {
    id: "faq-diferenca",
    q: "Qual a diferença entre o teste grátis e os passes pagos?",
    a: "O teste grátis revela a Casa Solar de um aniversário que você já viveu. Os passes pagos calculam seu próximo aniversário, revelam destinos compatíveis e abrem as 8 áreas da vida.",
  },
  {
    id: "faq-garantia",
    q: "A leitura garante acontecimentos futuros?",
    a: "Não. É cálculo astronômico (Swiss Ephemeris) aplicado à interpretação astrológica para planejamento e reflexão — você segue sempre no leme das suas escolhas.",
  },
];
