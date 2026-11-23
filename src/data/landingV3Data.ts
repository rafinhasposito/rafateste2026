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

export const V3_ANGLES: Record<V3AngleKey, V3AngleConfig> = {
  padrao: {
    key: "padrao",
    label: "Padrão (Validação Grátis)",
    badge: "Cálculo Astronômico Swiss Ephemeris • Zero Horóscopo Genérico",
    headline: "Descubra grátis o que a cidade do seu último aniversário",
    highlight: "ativou no seu ano.",
    subcopy:
      "Seu mapa de nascimento é fixo, mas o lugar onde você passa a virada do aniversário destaca qual das 12 áreas da vida puxa os próximos 12 meses. Teste no seu aniversário atual ou passado antes de decidir qualquer coisa.",
    ctaLabel: "Testar Grátis Meu Ano Atual / Passado",
    featuredHouseId: null,
  },
  fitness: {
    key: "fitness",
    label: "Teste 1 • Rotina & Fitness (Casa 06)",
    badge: "Casa 06 • Rotina, Dieta & Alta Performance",
    headline: "Por que sua dieta e seus treinos",
    highlight: "sempre morrem em março?",
    subcopy:
      "Não é falta de força de vontade. A cidade onde você passa o aniversário define qual área da vida ganha ritmo nos próximos 12 meses. Veja grátis qual Casa governou seu último ano e entenda como a Casa 06 favorece constância sem burnout.",
    ctaLabel: "Fazer Teste Grátis do Meu Ano Agora",
    featuredHouseId: 6,
  },
  carreira: {
    key: "carreira",
    label: "Teste 2 • Carreira & Posicionamento (Casa 10)",
    badge: "Casa 10 & Casa 02 • Autoridade, Carreira & Caixa",
    headline: "Você trabalha o dobro dos outros, mas quem aparece mais",
    highlight: "é quem cresce?",
    subcopy:
      "Entregar bem nos bastidores não basta quando o ciclo do ano não favorece visibilidade. Teste grátis qual Casa o seu último aniversário ativou e veja onde a Casa 10 e a Casa 02 colocam seu trabalho em destaque.",
    ctaLabel: "Testar Grátis Meu Último Aniversário",
    featuredHouseId: 10,
  },
  cetico: {
    key: "cetico",
    label: "Teste 3 • Cético / Prova do Passado",
    badge: "Validação Reversa Gratuita • Teste Às Cegas",
    headline: "Não acredita que o lugar do aniversário muda o ano?",
    highlight: "Teste onde você já passou.",
    subcopy:
      "Antes de pagar qualquer real ou planejar viagem, coloque a cidade onde você passou seu aniversário anterior. Veja qual Casa o algoritmo calcula e confira se bate com o que você realmente viveu.",
    ctaLabel: "Fazer Teste Cego do Aniversário Passado",
    featuredHouseId: null,
  },
};

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
    a: "Mapa astral natal grátis mostra apenas o céu estático do dia em que você nasceu. O Protocolo Solar executa cálculos astronômicos geográficos (Swiss Ephemeris) para o minuto exato da sua Revolução Solar anual em diferentes cidades do mundo — e traduz tudo em linguagem prática, sem jargão. Por isso liberamos o teste gratuito do seu aniversário atual ou passado logo acima para você validar antes de pagar.",
  },
  {
    id: "v3-faq-no-time",
    q: "Não sei meu horário exato de nascimento. Consigo usar?",
    a: "Sim. Basta marcar a opção “Não sei meu horário exato” no teste acima. O sistema usa 12:00 como referência solar e informa com transparência que a cúspide exata do Ascendente pode variar alguns graus sem a certidão — assim você não trava agora e pode atualizar seu horário depois quando encontrar.",
  },
  {
    id: "v3-faq-no-travel",
    q: "Não tenho dinheiro para viajar para a Europa. Serve para mim?",
    a: "Com certeza. A relocalização funciona com cidades brasileiras, destinos regionais (muitas vezes a poucas horas de carro) e exterior. E mesmo se você decidir passar o aniversário na sua própria cidade, o relatório mostra exatamente qual Casa ficará ativa e o Manual de Defesa da Cidade Natal para aproveitar o melhor do ciclo.",
  },
  {
    id: "v3-faq-pricing",
    q: "Qual a diferença exata entre R$ 19,90, R$ 49,90 e R$ 99,90?",
    a: "Todas as consultas já incluem todas as 8 áreas da vida abertas. A diferença está em quantas Casas/destinos você desbloqueia: R$ 19,90 libera 1 Casa ou 1 Cidade (ideal para validar 1 objetivo); R$ 49,90 libera 3 Consultas para comparar até 3 destinos ou Casas antes de decidir a viagem; R$ 99,90 libera o Mapa Completo com todas as 12 Casas do seu próximo aniversário de uma só vez.",
  },
  {
    id: "v3-faq-affiliate",
    q: "Como funciona a indicação de parceiros (20% no Pix)?",
    a: "Qualquer usuário ou criador pode ativar seu link exclusivo (/i/CODIGO) sem pagar nada e receber 20% via Pix por vendas reais confirmadas — sem alterar o preço para o comprador. Seguimos compliance transparente (sinalização #publi e recomendação baseada em teste real do Aniversário Passado, sem promessas mágicas).",
  },
];
