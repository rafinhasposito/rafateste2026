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
    label: "Padrão • Quiz + Passado Grátis",
    badge: "Cálculo Astronômico Swiss Ephemeris • Zero Horóscopo Genérico",
    headline: "Descubra grátis qual Casa a cidade do seu último aniversário",
    highlight: "ativou no seu ano.",
    subcopy:
      "Explore como a localização geográfica da virada do aniversário altera qual das 12 áreas ganha destaque nos próximos 12 meses. Faça o teste gratuito do seu último ano antes de decidir qualquer plano.",
    ctaLabel: "Começar Teste Grátis (2 min)",
    featuredHouseId: null,
  },
  fitness: {
    key: "fitness",
    label: "Teste 1 • Rotina & Fitness (Casa 06)",
    badge: "Casa 06 • Rotina, Disciplina & Alta Performance",
    headline: "Como o mapa do aniversário influencia o ritmo da rotina,",
    highlight: "dos treinos e da disciplina.",
    subcopy:
      "Na Revolução Solar relocada, cada cidade destaca um setor diferente do ano — e a Casa 06 concentra o foco em hábitos, constância e saúde física. Teste grátis qual Casa rodou no seu último aniversário.",
    ctaLabel: "Fazer Teste Grátis da Minha Rotina",
    featuredHouseId: 6,
  },
  carreira: {
    key: "carreira",
    label: "Teste 2 • Carreira & Visibilidade (Casa 10)",
    badge: "Casa 10 & Casa 02 • Posicionamento, Carreira & Caixa",
    headline: "Veja como a cidade do aniversário muda o foco em",
    highlight: "carreira, visibilidade e finanças.",
    subcopy:
      "O Protocolo Solar calcula em quais coordenadas do Brasil ou do mundo a Casa 10 (reconhecimento e liderança) e a Casa 02 (caixa e patrimônio) entram em destaque. Valide primeiro no seu último aniversário grátis.",
    ctaLabel: "Simular Meu Ano Profissional Grátis",
    featuredHouseId: 10,
  },
  cetico: {
    key: "cetico",
    label: "Teste 3 • Cético / Prova do Passado",
    badge: "Validação Reversa Gratuita • Teste Às Cegas",
    headline: "Antes de planejar o próximo aniversário, teste grátis",
    highlight: "onde você já passou.",
    subcopy:
      "Coloque a cidade do seu último aniversário e confira se o cálculo astronômico da Casa ativada bate com o que realmente aconteceu nos últimos 12 meses — sem cartão e sem criar senha antes.",
    ctaLabel: "Fazer Teste Cego do Passado Grátis",
    featuredHouseId: null,
  },
};

export interface V3PriorityOption {
  id: string;
  houseId: number;
  title: string;
  subtitle: string;
  tag: string;
}

export const V3_PRIORITY_OPTIONS: V3PriorityOption[] = [
  {
    id: "dinheiro",
    houseId: 2,
    title: "Dinheiro & Caixa Forte",
    subtitle: "Precificar melhor, organizar finanças e construir reserva",
    tag: "Casa 02",
  },
  {
    id: "carreira",
    houseId: 10,
    title: "Carreira, Fama & Modo CEO",
    subtitle: "Ganhar visibilidade, autoridade no nicho e grandes contratos",
    tag: "Casa 10",
  },
  {
    id: "fitness",
    houseId: 6,
    title: "Rotina Fit, Dieta & Saúde",
    subtitle: "Manter treinos, alimentação e agenda rodando no ritmo",
    tag: "Casa 06",
  },
  {
    id: "amor",
    houseId: 7,
    title: "Amor, Casamento & Alianças",
    subtitle: "Relacionamento sério ou sociedades estratégicas de valor",
    tag: "Casa 07",
  },
  {
    id: "virada",
    houseId: 9,
    title: "Viagens, Exterior & Expansão",
    subtitle: "Sair da bolha, estudar, viajar ou expandir fronteiras",
    tag: "Casa 09",
  },
  {
    id: "cetico",
    houseId: 1,
    title: "Só quero testar meu passado primeiro",
    subtitle: "Validar grátis se o último aniversário bateu com a vida real",
    tag: "Teste Cego",
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
    title: "Vou passar na minha cidade atual",
    subtitle: "Quero ver minha Casa local + Manual de Defesa da Cidade Natal",
    badge: "Custo R$ 0 viagem",
  },
  {
    id: "300km",
    title: "Até ~300 km de carro ou ônibus",
    subtitle: "Bate-volta regional ou cidades vizinhas no fim de semana",
    badge: "Regional",
  },
  {
    id: "3000km",
    title: "Até 3.000 km (Brasil / América do Sul)",
    subtitle: "Capitais, praias ou destinos nacionais e vizinhos",
    badge: "Nacional / LatAm",
  },
  {
    id: "world",
    title: "Qualquer lugar do mundo",
    subtitle: "Europa, EUA, Ásia e rotas internacionais completas",
    badge: "Global",
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
    id: "v3-faq-free-map",
    q: "Por que pagar se existe mapa astral grátis na internet?",
    a: "Mapa astral natal grátis mostra apenas o céu estático do dia em que você nasceu. O Protocolo Solar executa cálculos astronômicos geográficos (Swiss Ephemeris) para o minuto exato da sua Revolução Solar anual em diferentes cidades do mundo — e traduz tudo em linguagem prática, sem jargão. Por isso liberamos a validação gratuita do seu aniversário passado e da sua cidade atual antes de qualquer pagamento.",
  },
  {
    id: "v3-faq-no-time",
    q: "Não sei meu horário exato de nascimento. Consigo usar?",
    a: "Sim. Basta marcar “Não sei meu horário exato” no passo 2 do quiz. O sistema usa 12:00 como referência solar e informa com transparência que a cúspide exata do Ascendente pode variar alguns graus sem a certidão — assim você não trava agora e pode atualizar depois.",
  },
  {
    id: "v3-faq-no-travel",
    q: "Não tenho dinheiro para viajar para a Europa. Serve para mim?",
    a: "Sim. A relocalização funciona com destinos regionais (muitas vezes até ~300 km de carro), capitais brasileiras ou exterior. E se você decidir ficar na sua cidade natal, o relatório já entrega o Manual de Defesa da Cidade Natal mostrando como aproveitar o melhor da Casa local.",
  },
  {
    id: "v3-faq-pricing",
    q: "Qual a diferença exata entre R$ 19,90, R$ 49,90 e R$ 99,90?",
    a: "Todas as consultas já incluem todas as 8 áreas da vida abertas. R$ 19,90 libera 1 Casa escolhida ou 1 Cidade específica; R$ 49,90 libera 3 Consultas para comparar até 3 destinos ou Casas antes da viagem; R$ 99,90 libera o Mapa Completo com todas as 12 Casas do seu próximo aniversário de uma só vez.",
  },
  {
    id: "v3-faq-affiliate",
    q: "Como funciona a indicação de parceiros (20% no Pix)?",
    a: "Qualquer usuário ou criador pode ativar seu link exclusivo (/i/CODIGO) gratuitamente e receber 20% via Pix por vendas confirmadas, mantendo o mesmo preço oficial para quem compra. Seguimos protocolo transparente: testar primeiro o próprio Aniversário Passado e sinalizar #publi conforme o CONAR.",
  },
];
