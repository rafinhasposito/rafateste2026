import type { SupportedLocale } from "@/lib/i18n";

export interface HouseSignal {
  tag: string;
  line: string;
  avatar: string;
}

export interface HouseV2 {
  id: number;
  code: string;
  cover: string;
  title: string;
  oneLiner: string;
  forWho: string;
  copy: string;
  element: string;
  env: string;
  envDark: string;
  ticket: string;
  bg1: string;
  bg2: string;
  video: string;
  poster: string;
  signals: HouseSignal[];
}

export const HOUSES_V2: HouseV2[] = [
  {
    id: 1, code: "01", cover: "PROTAGONISMO", title: "Protagonismo, Coragem & Recomeço",
    oneLiner: "Foco em você. Amor-próprio no topo. Você no comando.",
    forWho: "Para quem cansou de viver pela expectativa dos outros e quer assumir o leme.",
    copy: "Seu ano puxa o holofote de volta para você. É um ciclo de reposicionamento pessoal, coragem para parar de se anular e dar passos que vinha adiando.",
    element: "Fogo", env: "#0E2D73", envDark: "#061844", ticket: "#63A9EB", bg1: "#C6DFF8", bg2: "#9EC2EB",
    video: "/v2-assets/casa-01.mp4", poster: "/v2-assets/casa-01.jpg",
    signals: [
      { tag: "Chega de se anular", line: "Cansou de viver pela expectativa dos outros.", avatar: "/memojis/mulher%20negra%20cabelo%20cacheado.png" },
      { tag: "Coragem pra virar", line: "Quer força pra dar o passo que vem adiando.", avatar: "/memojis/mulher%20moderna.png" },
      { tag: "Novo eu em 365d", line: "Busca renovar imagem, presença e autonomia.", avatar: "/memojis/mulher%20boina%20roxa.png" }
    ]
  },
  {
    id: 2, code: "02", cover: "PROSPERIDADE", title: "Dinheiro, Prosperidade & Abundância",
    oneLiner: "Cobre o que vale. Estanque ralos. Veja sobrar.",
    forWho: "Para quem trabalha muito mas quer ver o dinheiro render e construir patrimônio.",
    copy: "Este ciclo coloca sua vida financeira e seu senso de valor próprio no centro. Favorece precificar sem culpa, fechar ralos e construir reserva firme.",
    element: "Terra", env: "#0A4B37", envDark: "#042A1E", ticket: "#5CC49C", bg1: "#BFE8D7", bg2: "#8FCFB5",
    video: "/v2-assets/casa-02.mp4", poster: "/v2-assets/casa-02.jpg",
    signals: [
      { tag: "Sair do aperto", line: "Quer dinheiro rendendo e sobrando todo mês.", avatar: "/memojis/1.png" },
      { tag: "Cobrar seu valor", line: "Pronto pra lucrar sem culpa nem desconto.", avatar: "/memojis/10.png" },
      { tag: "Construir patrimônio", line: "Foco em reserva, bens e estabilidade real.", avatar: "/memojis/11.png" }
    ]
  },
  {
    id: 3, code: "03", cover: "COMUNICAÇÃO", title: "Comunicação, Vendas & Movimento",
    oneLiner: "Sua voz convence. Seus acordos destravam. Tudo circula.",
    forWho: "Para quem tem ótimas ideias mas quer destravar a fala, vendas e negociações.",
    copy: "Este ciclo acelera voz, movimento, vendas e trocas rápidas. Reuniões comerciais, viagens curtas e contatos locais ganham ritmo fluido.",
    element: "Ar", env: "#B04917", envDark: "#6E2808", ticket: "#F5A56C", bg1: "#F9D4B9", bg2: "#F0B489",
    video: "/v2-assets/casa-03.mp4", poster: "/v2-assets/casa-03.jpg",
    signals: [
      { tag: "Destravar a voz", line: "Quer comunicar com clareza e vender sem esforço.", avatar: "/memojis/12.png" },
      { tag: "Fechar contratos", line: "Busca acordos, clientes e negociações fluidas.", avatar: "/memojis/2.png" },
      { tag: "Sair da estagnação", line: "Quer um ano vivo, cheio de troca e movimento.", avatar: "/memojis/3.png" }
    ]
  },
  {
    id: 4, code: "04", cover: "LAR & RAÍZES", title: "Lar, Raízes & Estabilidade",
    oneLiner: "Sua casa em paz. Seu imóvel destravado. Chão firme.",
    forWho: "Para quem precisa de porto seguro, estruturar o imóvel ou recuperar paz no lar.",
    copy: "Este ciclo puxa a atenção para dentro: casa, família, emoções profundas e a necessidade real de ter um refúgio tranquilo e chão firme.",
    element: "Água", env: "#185678", envDark: "#0B334A", ticket: "#75B9DC", bg1: "#C1E0F0", bg2: "#94C4DE",
    video: "/v2-assets/casa-04.mp4", poster: "/v2-assets/casa-04.jpg",
    signals: [
      { tag: "Arrumar a base", line: "Quer paz dentro de casa e rotina emocional leve.", avatar: "/memojis/4.png" },
      { tag: "Imóvel & lar", line: "Planeja compra, mudança, reforma ou home office.", avatar: "/memojis/5.png" },
      { tag: "Raízes fortes", line: "Deseja fortalecer laços íntimos e segurança real.", avatar: "/memojis/6.png" }
    ]
  },
  {
    id: 5, code: "05", cover: "PRAZER & ROMANCE", title: "Prazer, Romance & Criatividade",
    oneLiner: "Brilho autoral. Paixão leve. Alegria de viver de volta.",
    forWho: "Para quem caiu numa rotina cinza e quer reacender prazer, romance e criatividade.",
    copy: "Seu ano pede brilho autoral, entusiasmo e leveza. Paixão, magnetismo pessoal e projetos com a sua assinatura criativa ganham destaque.",
    element: "Fogo", env: "#A66E0A", envDark: "#694203", ticket: "#F7CC5E", bg1: "#FAE4AA", bg2: "#F2CE74",
    video: "/v2-assets/casa-05.mp4", poster: "/v2-assets/casa-05.jpg",
    signals: [
      { tag: "Sair do piloto automático", line: "Cansou de uma rotina cinza só de obrigações.", avatar: "/memojis/7.png" },
      { tag: "Viver paixão", line: "Quer magnetismo, romance envolvente e leveza.", avatar: "/memojis/8.png" },
      { tag: "Criar com alma", line: "Busca destravar projetos autorais e prazer real.", avatar: "/memojis/9.png" }
    ]
  },
  {
    id: 6, code: "06", cover: "SAÚDE & ROTINA", title: "Saúde, Rotina & Produtividade",
    oneLiner: "Disciplina leve. Corpo forte. Agenda que funciona.",
    forWho: "Para quem quer constância nos treinos, alimentação limpa e rotina sem caos.",
    copy: "Este ciclo coloca corpo, agenda e constância em foco. Pequenos hábitos diários, saúde e organização do trabalho decidem o resultado do ano.",
    element: "Terra", env: "#0A615B", envDark: "#043B38", ticket: "#5ECEC2", bg1: "#B7E9E3", bg2: "#84D2C9",
    video: "/v2-assets/casa-06.mp4", poster: "/v2-assets/casa-06.jpg",
    signals: [
      { tag: "Constância real", line: "Quer manter treinos e rotina sem abandonar na 2ª semana.", avatar: "/memojis/1.png" },
      { tag: "Corpo & energia", line: "Foco em disposição física, sono e equilíbrio.", avatar: "/memojis/2.png" },
      { tag: "Fim do caos", line: "Busca método diário produtivo sem burnout.", avatar: "/memojis/3.png" }
    ]
  },
  {
    id: 7, code: "07", cover: "AMOR & ALIANÇAS", title: "Amor, Parcerias & Alianças",
    oneLiner: "Encontros de verdade. Amor recíproco. Sócios certos.",
    forWho: "Para quem cansou de carregar tudo sozinho no amor ou nos negócios.",
    copy: "Este ciclo gira em torno do outro: relacionamentos sérios, sociedades complementares e acordos de longo prazo saem da teoria.",
    element: "Ar", env: "#B32E56", envDark: "#701533", ticket: "#F593B1", bg1: "#F7C9D7", bg2: "#EDA1B8",
    video: "/v2-assets/casa-07.mp4", poster: "/v2-assets/casa-07.jpg",
    signals: [
      { tag: "Parceria madura", line: "Cansou de encontros rasos e quer reciprocidade real.", avatar: "/memojis/4.png" },
      { tag: "Somar forças", line: "Busca sócios ou alianças comerciais de longo prazo.", avatar: "/memojis/5.png" },
      { tag: "Sair do solo", line: "Quer construir a dois com leveza e compromisso.", avatar: "/memojis/6.png" }
    ]
  },
  {
    id: 8, code: "08", cover: "RENASCIMENTO", title: "Transformação, Poder & Renascimento",
    oneLiner: "Vire a página de vez. Solte o peso. Renasça mais forte.",
    forWho: "Para quem precisa encerrar ciclos vencidos e destravar grandes viradas.",
    copy: "Um ciclo profundo de limpeza e renovação. Tudo o que já perdeu sentido pede encerramento para abrir espaço para autonomia e poder pessoal.",
    element: "Água", env: "#6B1136", envDark: "#3E061D", ticket: "#DE7A9E", bg1: "#ECC1D1", bg2: "#D994AE",
    video: "/v2-assets/casa-08.mp4", poster: "/v2-assets/casa-08.jpg",
    signals: [
      { tag: "Encerrar ciclos", line: "Sente que precisa virar uma página que já venceu.", avatar: "/memojis/7.png" },
      { tag: "Faxina profunda", line: "Quer destravar pendências e recuperar leveza.", avatar: "/memojis/8.png" },
      { tag: "Força interior", line: "Pronto para renascer com mais autonomia.", avatar: "/memojis/9.png" }
    ]
  },
  {
    id: 9, code: "09", cover: "VIAGENS & EXPANSÃO", title: "Expansão, Viagens & Liberdade",
    oneLiner: "Saia da bolha. Novos horizontes. Liberdade real.",
    forWho: "Para quem sente que a rotina ou cidade atual ficou pequena demais.",
    copy: "Seu ano alarga horizontes. Viagens marcantes, estudos avançados, novas culturas e vontade real de sair da bolha conduzem suas escolhas.",
    element: "Fogo", env: "#282F94", envDark: "#14185C", ticket: "#8E96F5", bg1: "#CFD3F8", bg2: "#A9AFEE",
    video: "/v2-assets/casa-09.mp4", poster: "/v2-assets/casa-09.jpg",
    signals: [
      { tag: "Fora da bolha", line: "Sente que sua rotina atual ficou pequena demais.", avatar: "/memojis/10.png" },
      { tag: "Viagens & mundo", line: "Quer abrir fronteiras, estudar ou morar fora.", avatar: "/memojis/11.png" },
      { tag: "Visão maior", line: "Busca liberdade de pensamento e grandes projetos.", avatar: "/memojis/12.png" }
    ]
  },
  {
    id: 10, code: "10", cover: "SUCESSO & TOPO", title: "Sucesso, Reconhecimento & Topo",
    oneLiner: "Seu nome respeitado. Cargo ou negócio no topo.",
    forWho: "Para quem entrega excelência nos bastidores e quer ocupar seu espaço no topo.",
    copy: "Este ciclo coloca sua carreira, reputação e liderança sob os holofotes. É o ano de sair dos bastidores e ocupar espaço de autoridade.",
    element: "Terra", env: "#161D29", envDark: "#090D14", ticket: "#DFBE70", bg1: "#E4DCCB", bg2: "#CBBFA8",
    video: "/v2-assets/casa-10.mp4", poster: "/v2-assets/casa-10.jpg",
    signals: [
      { tag: "Sair dos bastidores", line: "Entrega muito mas quer finalmente ser visto no topo.", avatar: "/memojis/1.png" },
      { tag: "Autoridade & marca", line: "Foco em reputação, liderança e contratos maiores.", avatar: "/memojis/2.png" },
      { tag: "Ano decisivo", line: "Pronto para dar o salto profissional da sua vida.", avatar: "/memojis/3.png" }
    ]
  },
  {
    id: 11, code: "11", cover: "CONEXÕES & REDE", title: "Conexões, Amizades & Futuro",
    oneLiner: "Portas abertas por quem importa. Força em rede.",
    forWho: "Para quem quer crescer com aliados certos, comunidade e indicações de valor.",
    copy: "Seu ano cresce em rede. Amigos certos, convites, indicações espontâneas e projetos coletivos abrem portas que o esforço solo não abriria.",
    element: "Ar", env: "#0E4FA8", envDark: "#062F6B", ticket: "#69B2FA", bg1: "#C1DDFA", bg2: "#92C0F5",
    video: "/v2-assets/casa-11.mp4", poster: "/v2-assets/casa-11.jpg",
    signals: [
      { tag: "Aliados certos", line: "Cansou de remar sozinho sem apoio estratégico.", avatar: "/memojis/4.png" },
      { tag: "Escala & internet", line: "Quer multiplicar alcance, audiência e indicações.", avatar: "/memojis/5.png" },
      { tag: "Projetos de futuro", line: "Busca grupos influentes e pertencimento real.", avatar: "/memojis/6.png" }
    ]
  },
  {
    id: 12, code: "12", cover: "CURA & INTUIÇÃO", title: "Cura, Intuição & Silêncio",
    oneLiner: "Descanse a mente. Geste em segredo. Paz profunda.",
    forWho: "Para quem precisa recarregar a mente longe do ruído e ouvir a própria intuição.",
    copy: "Este ciclo pede pausa estratégica, proteção da energia mental e escuta da intuição para gestar seu próximo grande salto em paz.",
    element: "Água", env: "#4E2285", envDark: "#2C0F52", ticket: "#B890F0", bg1: "#DDCBF7", bg2: "#BFA2EB",
    video: "/v2-assets/casa-12.mp4", poster: "/v2-assets/casa-12.jpg",
    signals: [
      { tag: "Detox de ruído", line: "Sente exaustão mental e precisa desacelerar.", avatar: "/memojis/7.png" },
      { tag: "Intuição afiada", line: "Quer clareza espiritual e decisões mais calmas.", avatar: "/memojis/8.png" },
      { tag: "Criar em segredo", line: "Busca privacidade para estruturar seu próximo passo.", avatar: "/memojis/9.png" }
    ]
  }
];

export const LIFE_AREAS_V2 = [
  { id: "dinheiro", label: "Dinheiro & Recursos", text: "Fortalece sua relação com ganhos, precificação e novas oportunidades financeiras nos próximos 12 meses." },
  { id: "trabalho", label: "Trabalho & Carreira", text: "Direciona a energia do seu ano para ganhar tração profissional, autoridade e novos resultados." },
  { id: "identidade", label: "Identidade & Imagem", text: "Fortalece seu posicionamento pessoal, autoconfiança e a forma como o mundo percebe o seu valor." },
  { id: "amor", label: "Amor & Alianças", text: "Ativa o melhor alinhamento para viver conexões afetivas mais verdadeiras, maduras e leves." },
  { id: "networking", label: "Networking & Rede", text: "Aproxima pessoas estratégicas, mentores e alianças capazes de abrir novas portas no seu caminho." },
  { id: "rotina", label: "Rotina & Método", text: "Organiza seu tempo e sua energia diária para produzir com mais clareza, foco e leveza." },
  { id: "saude", label: "Saúde & Vitalidade", text: "Renova sua disposição física, equilíbrio emocional e constância no cuidado com o corpo." },
  { id: "espiritual", label: "Propósito & Intuição", text: "Aprofunda sua clareza de propósito, intuição e sentido real por trás das decisões do ano." }
] as const;

export const AFFINITY_MATRIX_V2: Record<number, Record<string, number>> = {
  1: { amor: 72, trabalho: 85, dinheiro: 75, saude: 92, networking: 68, rotina: 70, espiritual: 65, identidade: 98 },
  2: { amor: 62, trabalho: 88, dinheiro: 98, saude: 52, networking: 65, rotina: 72, espiritual: 55, identidade: 80 },
  3: { amor: 65, trabalho: 92, dinheiro: 80, saude: 58, networking: 88, rotina: 85, espiritual: 60, identidade: 72 },
  4: { amor: 82, trabalho: 60, dinheiro: 78, saude: 72, networking: 50, rotina: 75, espiritual: 88, identidade: 65 },
  5: { amor: 98, trabalho: 82, dinheiro: 75, saude: 78, networking: 70, rotina: 60, espiritual: 65, identidade: 92 },
  6: { amor: 50, trabalho: 88, dinheiro: 78, saude: 98, networking: 60, rotina: 95, espiritual: 55, identidade: 65 },
  7: { amor: 98, trabalho: 86, dinheiro: 75, saude: 55, networking: 92, rotina: 60, espiritual: 65, identidade: 72 },
  8: { amor: 88, trabalho: 80, dinheiro: 92, saude: 70, networking: 65, rotina: 55, espiritual: 85, identidade: 78 },
  9: { amor: 72, trabalho: 88, dinheiro: 75, saude: 70, networking: 82, rotina: 58, espiritual: 98, identidade: 80 },
  10: { amor: 58, trabalho: 98, dinheiro: 88, saude: 55, networking: 80, rotina: 72, espiritual: 68, identidade: 95 },
  11: { amor: 72, trabalho: 90, dinheiro: 85, saude: 62, networking: 98, rotina: 68, espiritual: 78, identidade: 80 },
  12: { amor: 70, trabalho: 60, dinheiro: 65, saude: 88, networking: 50, rotina: 80, espiritual: 98, identidade: 75 }
};

export function getHouseV2(id: number): HouseV2 {
  const safe = Math.min(12, Math.max(1, Number.isFinite(id) ? id : 1));
  return HOUSES_V2[safe - 1];
}

// 5-Language UI Copy Dictionary (PT, ES, EN, FR, IT)
export const V2_UI: Record<SupportedLocale, {
  navHome: string;
  navHouses: string;
  navFree: string;
  navCredits: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  heroCtaFree: string;
  heroCtaHouses: string;
  collectionEyebrow: string;
  collectionTitle: string;
  freeBandEyebrow: string;
  freeBandTitle: string;
  freeBandSub: string;
  freeBandCta: string;
  creditsEyebrow: string;
  creditsTitle: string;
  creditsRule: string;
  tab1: string;
  tab3: string;
  tab12: string;
  ctaUnlock: string;
  ctaUnlockAll: string;
  ctaConsultNow: string;
  compliance: string;
}> = {
  pt: {
    navHome: "Início",
    navHouses: "12 Casas",
    navFree: "Consulta Grátis",
    navCredits: "Créditos",
    heroEyebrow: "Revolução Solar Relocada · 12 Casas",
    heroTitle: "Onde você passa o aniversário muda o foco do seu ano.",
    heroSub: "Teste grátis o aniversário que já passou e compare com o que você viveu — ou explore as 12 Casas pelo que deseja priorizar.",
    heroCtaFree: "Testar meu último aniversário grátis →",
    heroCtaHouses: "Explorar as 12 Casas ↓",
    collectionEyebrow: "Escolha pela energia que você quer viver",
    collectionTitle: "As 12 Casas Solares",
    freeBandEyebrow: "Prova real antes de pagar",
    freeBandTitle: "Descubra qual Casa você ativou no último aniversário.",
    freeBandSub: "Cálculo astronômico real (Swiss Ephemeris) com sua data, hora e cidade — 100% grátis.",
    freeBandCta: "Consultar agora →",
    creditsEyebrow: "Acesso imediato · Pagamento único",
    creditsTitle: "Escolha Seus Créditos",
    creditsRule: "Cada crédito libera 1 Casa ou 1 Cidade completa, já com todas as 8 áreas da vida abertas + Guia personalizado.",
    tab1: "1 Crédito",
    tab3: "3 Créditos",
    tab12: "Mapa 12",
    ctaUnlock: "Liberar agora →",
    ctaUnlockAll: "Liberar mapa completo →",
    ctaConsultNow: "Consultar agora →",
    compliance: "Acesso digital imediato · Pagamento único (sem assinatura) · Cálculo astronômico Swiss Ephemeris · Ferramenta cultural e informativa (18+), sem promessa determinista."
  },
  es: {
    navHome: "Inicio",
    navHouses: "12 Casas",
    navFree: "Consulta Gratis",
    navCredits: "Créditos",
    heroEyebrow: "Revolución Solar Relocada · 12 Casas",
    heroTitle: "El lugar donde pasas tu cumpleaños redefine el enfoque de tu año.",
    heroSub: "Prueba gratis tu último cumpleaños y compáralo con lo que viviste — o explora las 12 Casas según tus prioridades.",
    heroCtaFree: "Probar mi último cumpleaños gratis →",
    heroCtaHouses: "Explorar las 12 Casas ↓",
    collectionEyebrow: "Elige según la energía que deseas vivir",
    collectionTitle: "Las 12 Casas Solares",
    freeBandEyebrow: "Prueba real antes de pagar",
    freeBandTitle: "Descubre qué Casa activaste en tu último cumpleaños.",
    freeBandSub: "Cálculo astronómico real (Swiss Ephemeris) con tu fecha, hora y ciudad — 100% gratis.",
    freeBandCta: "Consultar ahora →",
    creditsEyebrow: "Acceso inmediato · Pago único",
    creditsTitle: "Elige Tus Créditos",
    creditsRule: "Cada crédito desbloquea 1 Casa o 1 Ciudad completa con las 8 áreas de la vida abiertas + Guía personalizada.",
    tab1: "1 Crédito",
    tab3: "3 Créditos",
    tab12: "Mapa 12",
    ctaUnlock: "Desbloquear ahora →",
    ctaUnlockAll: "Desbloquear mapa completo →",
    ctaConsultNow: "Consultar ahora →",
    compliance: "Acceso digital inmediato · Pago único (sin suscripción) · Cálculo astronómico Swiss Ephemeris · Herramienta cultural e informativa (18+)."
  },
  en: {
    navHome: "Home",
    navHouses: "12 Houses",
    navFree: "Free Audit",
    navCredits: "Credits",
    heroEyebrow: "Relocated Solar Return · 12 Houses",
    heroTitle: "Where you spend your birthday shifts the focus of your next 12 months.",
    heroSub: "Test your past birthday for free and compare with what you lived — or explore all 12 Houses by what you want next.",
    heroCtaFree: "Test my last birthday free →",
    heroCtaHouses: "Explore the 12 Houses ↓",
    collectionEyebrow: "Choose by the energy you want next",
    collectionTitle: "The 12 Solar Houses",
    freeBandEyebrow: "Real proof before paying",
    freeBandTitle: "See which House you activated on your last birthday.",
    freeBandSub: "Real astronomical calculation (Swiss Ephemeris) using your birth data & city — 100% free.",
    freeBandCta: "Check now →",
    creditsEyebrow: "Instant access · One-time payment",
    creditsTitle: "Choose Your Credits",
    creditsRule: "Each credit unlocks 1 full House or 1 full City with all 8 life areas open + your personalized Guide.",
    tab1: "1 Credit",
    tab3: "3 Credits",
    tab12: "Full 12",
    ctaUnlock: "Unlock now →",
    ctaUnlockAll: "Unlock full map →",
    ctaConsultNow: "Check now →",
    compliance: "Instant digital access · One-time payment (no subscription) · Swiss Ephemeris calculation · Cultural & informational tool (18+)."
  },
  fr: {
    navHome: "Accueil",
    navHouses: "12 Maisons",
    navFree: "Essai Gratuit",
    navCredits: "Crédits",
    heroEyebrow: "Révolution Solaire Relocalisée · 12 Maisons",
    heroTitle: "Le lieu de votre anniversaire redéfinit l'énergie de vos 12 prochains mois.",
    heroSub: "Testez gratuitement votre dernier anniversaire — ou explorez les 12 Maisons selon vos priorités.",
    heroCtaFree: "Tester mon dernier anniversaire →",
    heroCtaHouses: "Explorer les 12 Maisons ↓",
    collectionEyebrow: "Choisissez l'énergie de votre année",
    collectionTitle: "Les 12 Maisons Solaires",
    freeBandEyebrow: "Preuve réelle gratuite",
    freeBandTitle: "Découvrez quelle Maison vous avez activée.",
    freeBandSub: "Calcul astronomique réel (Swiss Ephemeris) avec vos données natales — 100% gratuit.",
    freeBandCta: "Consulter maintenant →",
    creditsEyebrow: "Accès immédiat · Paiement unique",
    creditsTitle: "Choisissez Vos Crédits",
    creditsRule: "Chaque crédit débloque 1 Maison ou 1 Ville complète avec les 8 domaines de vie ouverts + Guide personnalisé.",
    tab1: "1 Crédit",
    tab3: "3 Crédits",
    tab12: "Carte 12",
    ctaUnlock: "Débloquer maintenant →",
    ctaUnlockAll: "Débloquer la carte complète →",
    ctaConsultNow: "Consulter maintenant →",
    compliance: "Accès numérique immédiat · Paiement unique · Calcul Swiss Ephemeris · Outil culturel et informatif (18+)."
  },
  it: {
    navHome: "Home",
    navHouses: "12 Case",
    navFree: "Prova Gratis",
    navCredits: "Crediti",
    heroEyebrow: "Rivoluzione Solare Rilocata · 12 Case",
    heroTitle: "Dove festeggi il compleanno cambia il focus dei tuoi prossimi 12 mesi.",
    heroSub: "Testa gratis il tuo ultimo compleanno e confrontalo con ciò che hai vissuto — oppure esplora le 12 Case.",
    heroCtaFree: "Testa il mio ultimo compleanno →",
    heroCtaHouses: "Esplora le 12 Case ↓",
    collectionEyebrow: "Scegli l'energia del tuo prossimo anno",
    collectionTitle: "Le 12 Case Solari",
    freeBandEyebrow: "Prova reale gratuita",
    freeBandTitle: "Scopri quale Casa hai attivato lo scorso anno.",
    freeBandSub: "Calcolo astronomico reale (Swiss Ephemeris) con i tuoi dati natali — 100% gratis.",
    freeBandCta: "Consulta ora →",
    creditsEyebrow: "Accesso immediato · Pagamento unico",
    creditsTitle: "Scegli i Tuoi Crediti",
    creditsRule: "Ogni credito sblocca 1 Casa o 1 Città completa con tutte le 8 aree della vita aperte + Guida personalizzata.",
    tab1: "1 Credito",
    tab3: "3 Crediti",
    tab12: "Mappa 12",
    ctaUnlock: "Sblocca ora →",
    ctaUnlockAll: "Sblocca mappa completa →",
    ctaConsultNow: "Consulta ora →",
    compliance: "Accesso digitale immediato · Pagamento unico · Calcolo Swiss Ephemeris · Strumento culturale e informativo (18+)."
  }
};
