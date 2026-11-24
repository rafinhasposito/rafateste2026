import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLocale = "pt" | "es" | "en" | "fr" | "it";

export const LOCALE_OPTIONS: {
  code: SupportedLocale;
  short: string;
  label: string;
  htmlLang: string;
}[] = [
  { code: "pt", short: "PT", label: "Português", htmlLang: "pt-BR" },
  { code: "es", short: "ES", label: "Español", htmlLang: "es" },
  { code: "en", short: "EN", label: "English", htmlLang: "en" },
  { code: "fr", short: "FR", label: "Français", htmlLang: "fr" },
  { code: "it", short: "IT", label: "Italiano", htmlLang: "it" },
];

const PT_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);
const ES_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "UY", "PY", "EC", "BO",
  "VE", "CR", "PA", "DO", "GT", "HN", "SV", "NI", "PR", "CU",
]);
const FR_COUNTRIES = new Set(["FR", "MC", "SN", "CI", "CM", "MA", "TN", "LU"]);
const IT_COUNTRIES = new Set(["IT", "SM", "VA"]);

function parseLocaleToken(raw: string | null | undefined): SupportedLocale | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase().slice(0, 2);
  if (clean === "pt" || clean === "es" || clean === "en" || clean === "fr" || clean === "it") {
    return clean;
  }
  return null;
}

function detectBrowserLocaleSync(): SupportedLocale {
  if (typeof window === "undefined") return "pt";

  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = parseLocaleToken(params.get("lang"));
    if (urlLang) {
      localStorage.setItem("ps_lang_manual", urlLang);
      return urlLang;
    }
  } catch {
    // ignore URL errors
  }

  try {
    const manual = parseLocaleToken(localStorage.getItem("ps_lang_manual"));
    if (manual) return manual;
    const cachedGeo = parseLocaleToken(sessionStorage.getItem("ps_lang_geo"));
    if (cachedGeo) return cachedGeo;
  } catch {
    // ignore storage errors
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (
      tz.startsWith("America/Sao_Paulo") ||
      tz.startsWith("America/Fortaleza") ||
      tz.startsWith("America/Recife") ||
      tz.startsWith("America/Bahia") ||
      tz.startsWith("America/Manaus") ||
      tz.startsWith("America/Belem") ||
      tz.startsWith("America/Cuiaba") ||
      tz === "Europe/Lisbon"
    ) {
      return "pt";
    }
  } catch {
    // ignore timezone errors
  }

  const langs = typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : [];
  for (const l of langs) {
    const parsed = parseLocaleToken(l);
    if (parsed) return parsed;
  }

  return "pt";
}

function mapCountryToLocale(countryCode: string, browserFallback: SupportedLocale): SupportedLocale {
  const cc = countryCode.trim().toUpperCase();
  if (PT_COUNTRIES.has(cc)) return "pt";
  if (ES_COUNTRIES.has(cc)) return "es";
  if (IT_COUNTRIES.has(cc)) return "it";
  if (FR_COUNTRIES.has(cc)) return "fr";
  if (cc === "CH" || cc === "BE" || cc === "CA") {
    if (browserFallback === "fr" || browserFallback === "it") return browserFallback;
  }
  return "en";
}

export interface HouseLocalizedCopy {
  title: string;
  shortTag: string;
  profile: string;
  focus: string;
  city: string;
  country: string;
}

export interface AppDictionary {
  nav: {
    home: string;
    consult: string;
    houses: string;
    myConsultations: string;
    partners: string;
    quickGuide: string;
    signIn: string;
    myAccount: string;
    signOut: string;
    back: string;
    discover: string;
    account: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaFilm: string;
    passHeader: string;
    passengerLabel: string;
    passengerValue: string;
    destinationLabel: string;
    houseLabel: string;
    focusLabel: string;
    tapCityHint: string;
  };
  film: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    playWithSound: string;
    mute: string;
    unmute: string;
    reelsBadge: string;
    reelsTitle: string;
    reelsSubtitle: string;
    sameBirthNotice: string;
  };
  checkIn: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    stepOf: string;
    step1Title: string;
    nameLabel: string;
    namePlaceholder: string;
    birthDateLabel: string;
    continueBtn: string;
    step2Title: string;
    birthTimeLabel: string;
    unknownTimeLabel: string;
    unknownTimeNote: string;
    step3Title: string;
    birthCityLabel: string;
    birthCityPlaceholder: string;
    step4Title: string;
    pastYearLabel: string;
    pastCityLabel: string;
    pastCityPlaceholder: string;
    submitFreeBtn: string;
    calculatingBtn: string;
    samplePreviewBtn: string;
    trustLine: string;
  };
  housesSection: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    viewAllBtn: string;
    exploreHouse: string;
    filterAll: string;
    forWhoLabel: string;
    activatesLabel: string;
    elements: Record<"Fogo" | "Terra" | "Ar" | "Água", string>;
  };
  pricing: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    oneTime: string;
    mostPopular: string;
    currencyHint: string;
    plans: {
      single: {
        tag: string;
        name: string;
        desc: string;
        bullets: [string, string, string];
        cta: string;
      };
      triple: {
        tag: string;
        name: string;
        desc: string;
        bullets: [string, string, string];
        cta: string;
      };
      full: {
        tag: string;
        name: string;
        desc: string;
        bullets: [string, string, string];
        cta: string;
      };
    };
    trustSwiss: string;
    trustNoTravel: string;
    trustRedeem: string;
    trustRedeemLink: string;
  };
  faq: {
    badge: string;
    title: string;
    items: { q: string; a: string }[];
  };
  pastReport: {
    backOtherYear: string;
    planNextYearBtn: string;
    bridgeQuestion: string;
    bridgeSub: string;
    drawerBadge: string;
    drawerTitle: string;
    stayWarningPrefix: string;
    stayWarningMiddle: string;
  };
  houses: Record<number, HouseLocalizedCopy>;
}

const DICTIONARIES: Record<SupportedLocale, AppDictionary> = {
  pt: {
    nav: {
      home: "Início",
      consult: "Calculadora",
      houses: "As 12 Casas",
      myConsultations: "Consultas",
      partners: "Parceiros",
      quickGuide: "Guia Rápido",
      signIn: "Entrar",
      myAccount: "Minha Conta",
      signOut: "Sair",
      back: "Voltar",
      discover: "Descobrir",
      account: "Conta",
    },
    hero: {
      badge: "Revolução Solar por Coordenadas",
      titleStart: "Onde começa o seu ",
      titleHighlight: "próximo ano?",
      titleEnd: "",
      subtitle: "A cidade onde você passa o aniversário redefine qual área da sua vida ganha força nos 12 meses seguintes.",
      ctaPrimary: "Ver meu último aniversário grátis",
      ctaFilm: "Assistir ao filme (1m30)",
      passHeader: "Cartão de Embarque Solar",
      passengerLabel: "Viajante",
      passengerValue: "Seu Mapa Pessoal",
      destinationLabel: "Destino de Aniversário",
      houseLabel: "Casa Ativada",
      focusLabel: "Energia Principal",
      tapCityHint: "Toque em um destino para simular a mudança de Casa:",
    },
    film: {
      badge: "Entenda em 90 Segundos",
      titleStart: "Mesmo céu de nascimento. ",
      titleHighlight: "Novo ponto na Terra.",
      subtitle: "Veja na prática por que mudar de coordenada no aniversário altera o foco do ciclo inteiro.",
      playWithSound: "Assistir com áudio",
      mute: "Silenciar",
      unmute: "Ativar som",
      reelsBadge: "Comparativo Visual",
      reelsTitle: "1 Data de Nascimento · 3 Cidades · 3 Anos Diferentes",
      reelsSubtitle: "Compare como a mesma pessoa ativa focos distintos apenas mudando o destino da virada solar.",
      sameBirthNotice: "Exemplo real calculado via Swiss Ephemeris",
    },
    checkIn: {
      badge: "Teste Gratuito Imediato",
      titleStart: "Confira o ano que você ",
      titleHighlight: "já viveu.",
      subtitle: "Descubra gratuitamente qual Casa esteve ativa no seu último aniversário e tire a prova na sua própria história.",
      stepOf: "Passo",
      step1Title: "Como podemos te chamar e quando você nasceu?",
      nameLabel: "Primeiro nome",
      namePlaceholder: "Ex.: Rafael",
      birthDateLabel: "Data de nascimento",
      continueBtn: "Continuar",
      step2Title: "Qual foi o horário do seu nascimento?",
      birthTimeLabel: "Horário na certidão",
      unknownTimeLabel: "Não sei a hora exata (usar 12:00 aproximado)",
      unknownTimeNote: "Sem a hora exata, usamos o meio-dia solar como estimativa transparente.",
      step3Title: "Em qual cidade você nasceu?",
      birthCityLabel: "Cidade natal",
      birthCityPlaceholder: "Digite e selecione sua cidade natal...",
      step4Title: "Onde você passou seu último aniversário?",
      pastYearLabel: "Ano do aniversário",
      pastCityLabel: "Cidade onde estava na virada",
      pastCityPlaceholder: "Digite e selecione a cidade...",
      submitFreeBtn: "Revelar meu resultado gratuito",
      calculatingBtn: "Calculando efemérides solares...",
      samplePreviewBtn: "Ou ver um exemplo completo agora",
      trustLine: "100% gratuito · Sem cartão · Relatório completo das 8 áreas no passado",
    },
    housesSection: {
      badge: "Painel das 12 Áreas",
      titleStart: "As 12 ",
      titleHighlight: "Casas Solares",
      subtitle: "Cada Casa representa o tema que assume o protagonismo do seu ano. Toque para assistir e explorar.",
      viewAllBtn: "Explorar guia completo das 12 Casas",
      exploreHouse: "Ver detalhes da Casa",
      filterAll: "Todas (12)",
      forWhoLabel: "Para quem busca",
      activatesLabel: "O que ativa no ano",
      elements: { Fogo: "Fogo", Terra: "Terra", Ar: "Ar", Água: "Água" },
    },
    pricing: {
      badge: "Próximo Aniversário",
      titleStart: "Escolha como planejar seu ",
      titleHighlight: "próximo destino.",
      subtitle: "Pagamento único, acesso imediato na tela e todas as 8 áreas da vida liberadas em qualquer opção.",
      oneTime: "pagamento único",
      mostPopular: "Mais escolhido",
      currencyHint: "",
      plans: {
        single: {
          tag: "1 Consulta",
          name: "1 Cidade",
          desc: "Ideal se você já tem 1 destino em mente para o aniversário.",
          bullets: [
            "Análise completa de 1 cidade ou 1 Casa",
            "As 8 áreas da sua vida explicadas",
            "Guia prático caso decida não viajar",
          ],
          cta: "Escolher 1 Cidade",
        },
        triple: {
          tag: "3 Consultas",
          name: "Comparar 3 Cidades",
          desc: "Ideal para comparar até 3 viagens possíveis antes de bater o martelo.",
          bullets: [
            "Compare até 3 cidades ou 3 Casas",
            "As 8 áreas abertas nas 3 opções",
            "Use tudo agora ou quando quiser",
          ],
          cta: "Comparar 3 Cidades",
        },
        full: {
          tag: "Acesso Integral",
          name: "Mapa Completo (12 Casas)",
          desc: "Veja suas melhores cidades no Brasil e no mundo nos 12 temas do ano.",
          bullets: [
            "Todas as 12 Casas abertas de uma vez",
            "Ranking global e regional de destinos",
            "Histórico completo salvo na sua conta",
          ],
          cta: "Liberar as 12 Casas",
        },
      },
      trustSwiss: "Cálculo astronômico Swiss Ephemeris",
      trustNoTravel: "Inclui leitura da sua cidade atual se não viajar",
      trustRedeem: "Recebeu um presente?",
      trustRedeemLink: "Resgatar código",
    },
    faq: {
      badge: "Dúvidas Rápidas",
      title: "Perguntas frequentes",
      items: [
        {
          q: "Por que é diferente de um mapa astral grátis?",
          a: "O mapa natal mostra apenas o dia em que você nasceu. O Protocolo Solar recalcula o retorno exato do Sol para o seu próximo aniversário cruzando centenas de cidades reais para indicar onde o foco do ano muda a seu favor.",
        },
        {
          q: "E se eu não puder viajar neste aniversário?",
          a: "Você não precisa viajar para usar. A leitura mostra exatamente qual Casa será ativada na sua própria cidade atual e como aproveitar os pontos fortes e se organizar nos próximos 12 meses.",
        },
        {
          q: "E se eu não souber minha hora exata de nascimento?",
          a: "Você pode marcar a opção de horário aproximado (12:00). O sistema avisa com transparência o grau de estimativa antes de qualquer compra.",
        },
        {
          q: "É assinatura mensal?",
          a: "Não. Todos os passes são pagamento único via Pix ou cartão, sem cobrança recorrente.",
        },
      ],
    },
    pastReport: {
      backOtherYear: "Testar outro ano",
      planNextYearBtn: "Planejar próximo ano",
      bridgeQuestion: "Reconheceu seu ciclo de",
      bridgeSub: "Descubra as melhores cidades para o seu próximo aniversário",
      drawerBadge: "Próximo Ciclo Solar",
      drawerTitle: "Para onde ir no próximo aniversário?",
      stayWarningPrefix: "Se permanecer em",
      stayWarningMiddle: "seu próximo ciclo ativa a",
    },
    houses: {
      1: { title: "Autonomia & Recomeço", shortTag: "Protagonismo", profile: "Quem quer virar a chave, mudar postura e liderar projetos próprios.", focus: "Coragem de decisão, presença forte e energia de novo começo.", city: "Nova York", country: "EUA" },
      2: { title: "Dinheiro & Caixa Forte", shortTag: "Patrimônio", profile: "Quem quer parar de cobrar pouco e transformar esforço em reserva sólida.", focus: "Valorização financeira, margem real e construção de patrimônio.", city: "Zurique", country: "Suíça" },
      3: { title: "Vendas & Comunicação", shortTag: "Negócios", profile: "Quem precisa destravar fala, reuniões, conteúdo e fechamento comercial.", focus: "Poder de persuasão, movimento rápido e portas abertas em conversas.", city: "Londres", country: "Reino Unido" },
      4: { title: "Lar, Imóveis & Família", shortTag: "Base Segura", profile: "Quem planeja comprar ou mudar de casa e busca paz emocional.", focus: "Estruturação de patrimônio familiar, raízes firmes e refúgio pessoal.", city: "Florença", country: "Itália" },
      5: { title: "Romance & Magnetismo", shortTag: "Paixão & Brilho", profile: "Quem busca paixão verdadeira, carisma criativo e leveza de viver.", focus: "Poder de atração, autoconfiança afetiva e brilho autoral.", city: "Roma", country: "Itália" },
      6: { title: "Rotina, Saúde & Método", shortTag: "Alta Performance", profile: "Quem quer constância no treino, saúde em dia e agenda produtiva.", focus: "Disciplina leve, vitalidade física e organização que rende.", city: "Tóquio", country: "Japão" },
      7: { title: "Amor Sério & Sociedades", shortTag: "Alianças", profile: "Quem busca relacionamento maduro ou sócios estratégicos de alto nível.", focus: "Compromissos duradouros, contratos justos e grandes parcerias.", city: "Paris", country: "França" },
      8: { title: "Virada Estratégica", shortTag: "Reestruturação", profile: "Quem precisa encerrar ciclos pesados e destravar acordos financeiros.", focus: "Limpeza de pendências, lucidez patrimonial e renascimento forte.", city: "Singapura", country: "Singapura" },
      9: { title: "Fronteiras & Mundo", shortTag: "Expansão Global", profile: "Quem sonha com exterior, estudos avançados e expansão de visão.", focus: "Caminhos internacionais, sabedoria prática e escala fora da bolha.", city: "Rio → Mundo", country: "Internacional" },
      10: { title: "Carreira, Palco & Topo", shortTag: "Reconhecimento", profile: "Quem trabalha muito nos bastidores e quer autoridade visível no mercado.", focus: "Reputação de liderança, grandes contratos e holofotes na carreira.", city: "Dubai", country: "Emirados" },
      11: { title: "Rede VIP & Escala Digital", shortTag: "Comunidade", profile: "Quem busca conexões influentes, audiência fiel e crescimento em rede.", focus: "Padrinhos estratégicos, alcance digital e projetos coletivos.", city: "São Francisco", country: "EUA" },
      12: { title: "Foco Secreto & Paz", shortTag: "Blindagem", profile: "Quem precisa descansar a mente e preparar um grande passo em silêncio.", focus: "Proteção energética, clareza intuitiva e bastidor produtivo.", city: "Kyoto", country: "Japão" },
    },
  },
  es: {
    nav: {
      home: "Inicio",
      consult: "Calculadora",
      houses: "Las 12 Casas",
      myConsultations: "Consultas",
      partners: "Afiliados",
      quickGuide: "Guía Rápida",
      signIn: "Entrar",
      myAccount: "Mi Cuenta",
      signOut: "Salir",
      back: "Volver",
      discover: "Descubrir",
      account: "Cuenta",
    },
    hero: {
      badge: "Revolución Solar por Coordenadas",
      titleStart: "¿Dónde empieza tu ",
      titleHighlight: "próximo año?",
      titleEnd: "",
      subtitle: "La ciudad donde pasas tu cumpleaños define qué área de tu vida cobra fuerza durante los siguientes 12 meses.",
      ctaPrimary: "Ver mi último cumpleaños gratis",
      ctaFilm: "Ver la película (1m30)",
      passHeader: "Pase de Abordaje Solar",
      passengerLabel: "Viajero",
      passengerValue: "Tu Mapa Personal",
      destinationLabel: "Destino de Cumpleaños",
      houseLabel: "Casa Activada",
      focusLabel: "Energía Principal",
      tapCityHint: "Toca un destino para simular el cambio de Casa:",
    },
    film: {
      badge: "Entiéndelo en 90 Segundos",
      titleStart: "El mismo cielo natal. ",
      titleHighlight: "Un nuevo punto en la Tierra.",
      subtitle: "Descubre por qué cambiar de coordenada en tu cumpleaños transforma el enfoque de todo tu año.",
      playWithSound: "Ver con sonido",
      mute: "Silenciar",
      unmute: "Activar sonido",
      reelsBadge: "Comparativa Visual",
      reelsTitle: "1 Fecha Natal · 3 Ciudades · 3 Años Distintos",
      reelsSubtitle: "Compara cómo la misma persona activa prioridades diferentes según la ciudad de su retorno solar.",
      sameBirthNotice: "Cálculo astronómico real con Swiss Ephemeris",
    },
    checkIn: {
      badge: "Prueba Gratuita Inmediata",
      titleStart: "Comprueba el año que ",
      titleHighlight: "ya viviste.",
      subtitle: "Descubre gratis qué Casa estuvo activa en tu último cumpleaños y compruébalo con tu propia historia.",
      stepOf: "Paso",
      step1Title: "¿Cómo te llamas y cuándo naciste?",
      nameLabel: "Primer nombre",
      namePlaceholder: "Ej.: Mateo",
      birthDateLabel: "Fecha de nacimiento",
      continueBtn: "Continuar",
      step2Title: "¿A qué hora naciste?",
      birthTimeLabel: "Hora de nacimiento",
      unknownTimeLabel: "No sé la hora exacta (usar 12:00 aprox.)",
      unknownTimeNote: "Sin hora exacta usamos el mediodía solar como estimación transparente.",
      step3Title: "¿En qué ciudad naciste?",
      birthCityLabel: "Ciudad natal",
      birthCityPlaceholder: "Escribe y selecciona tu ciudad natal...",
      step4Title: "¿Dónde pasaste tu último cumpleaños?",
      pastYearLabel: "Año del cumpleaños",
      pastCityLabel: "Ciudad donde estabas",
      pastCityPlaceholder: "Escribe y selecciona la ciudad...",
      submitFreeBtn: "Ver mi resultado gratuito",
      calculatingBtn: "Calculando efemérides solares...",
      samplePreviewBtn: "O ver un ejemplo completo ahora",
      trustLine: "100% gratis · Sin tarjeta · Informe completo de las 8 áreas",
    },
    housesSection: {
      badge: "Panel de las 12 Áreas",
      titleStart: "Las 12 ",
      titleHighlight: "Casas Solares",
      subtitle: "Cada Casa representa el tema protagonista de tu año. Toca cualquiera para ver su video y detalles.",
      viewAllBtn: "Ver guía completa de las 12 Casas",
      exploreHouse: "Explorar Casa",
      filterAll: "Todas (12)",
      forWhoLabel: "Ideal para quien busca",
      activatesLabel: "Qué activa en el año",
      elements: { Fogo: "Fuego", Terra: "Tierra", Ar: "Aire", Água: "Agua" },
    },
    pricing: {
      badge: "Próximo Cumpleaños",
      titleStart: "Elige cómo planificar tu ",
      titleHighlight: "próximo destino.",
      subtitle: "Pago único, acceso inmediato online y las 8 áreas de tu vida incluidas en cada pase.",
      oneTime: "pago único",
      mostPopular: "Más elegido",
      currencyHint: "Cobro seguro en BRL (aprox. USD 4 / 10 / 19 en tarjeta internacional)",
      plans: {
        single: {
          tag: "1 Consulta",
          name: "1 Ciudad",
          desc: "Ideal si ya tienes 1 destino en mente para tu cumpleaños.",
          bullets: [
            "Análisis completo de 1 ciudad o 1 Casa",
            "Las 8 áreas de tu vida explicadas",
            "Guía práctica si decides no viajar",
          ],
          cta: "Elegir 1 Ciudad",
        },
        triple: {
          tag: "3 Consultas",
          name: "Comparar 3 Ciudades",
          desc: "Ideal para comparar hasta 3 viajes posibles antes de decidir.",
          bullets: [
            "Compara hasta 3 ciudades o 3 Casas",
            "Las 8 áreas abiertas en las 3 opciones",
            "Úsalos juntos o cuando quieras",
          ],
          cta: "Comparar 3 Ciudades",
        },
        full: {
          tag: "Acceso Total",
          name: "Mapa Completo (12 Casas)",
          desc: "Descubre tus mejores ciudades del mundo en los 12 temas del año.",
          bullets: [
            "Las 12 Casas desbloqueadas a la vez",
            "Ranking global y regional de destinos",
            "Historial guardado en tu cuenta",
          ],
          cta: "Desbloquear las 12 Casas",
        },
      },
      trustSwiss: "Precisión astronómica Swiss Ephemeris",
      trustNoTravel: "Incluye lectura en tu ciudad actual si no viajas",
      trustRedeem: "¿Tienes un código de regalo?",
      trustRedeemLink: "Canjear código",
    },
    faq: {
      badge: "Preguntas Rápidas",
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿En qué se diferencia de una carta astral gratis?",
          a: "La carta natal es fija de por vida. Protocolo Solar recalcula el minuto exacto de tu próximo retorno solar cruzando coordenadas reales del mundo para mostrar dónde cambia el foco del año.",
        },
        {
          q: "¿Qué pasa si no puedo viajar en mi cumpleaños?",
          a: "No necesitas viajar. La lectura muestra qué Casa se activa en tu ciudad actual y cómo aprovechar el ciclo a tu favor.",
        },
        {
          q: "¿Y si no conozco mi hora exacta de nacimiento?",
          a: "Puedes activar la opción aproximada (12:00) con aviso transparente antes de adquirir cualquier pase.",
        },
        {
          q: "¿Es una suscripción mensual?",
          a: "No. Todos los pases son de pago único, sin cargos recurrentes.",
        },
      ],
    },
    pastReport: {
      backOtherYear: "Probar otro año",
      planNextYearBtn: "Planificar próximo año",
      bridgeQuestion: "¿Reconociste tu ciclo de",
      bridgeSub: "Descubre las mejores ciudades para tu próximo cumpleaños",
      drawerBadge: "Próximo Ciclo Solar",
      drawerTitle: "¿Dónde pasar tu próximo cumpleaños?",
      stayWarningPrefix: "Si te quedas en",
      stayWarningMiddle: "tu próximo ciclo activa la",
    },
    houses: {
      1: { title: "Autonomía & Nuevo Inicio", shortTag: "Protagonismo", profile: "Para tomar las riendas, renovar imagen y lanzar proyectos propios.", focus: "Valentía, decisión propia y energía de reinicio personal.", city: "Nueva York", country: "EE. UU." },
      2: { title: "Dinero & Patrimonio", shortTag: "Prosperidad", profile: "Para cobrar mejor tu valor y convertir trabajo en ahorro real.", focus: "Solidez financiera, margen y construcción de patrimonio.", city: "Zúrich", country: "Suiza" },
      3: { title: "Ventas & Comunicación", shortTag: "Negocios", profile: "Para fluir al hablar, negociar, vender y mover tu marca.", focus: "Persuasión comercial, agilidad y acuerdos rápidos.", city: "Londres", country: "Reino Unido" },
      4: { title: "Hogar, Inmuebles & Familia", shortTag: "Base Segura", profile: "Para mudanzas, compra de casa y paz emocional en familia.", focus: "Raíces firmes, estabilidad doméstica y refugio interior.", city: "Florencia", country: "Italia" },
      5: { title: "Romance & Magnetismo", shortTag: "Pasión & Brillo", profile: "Para encender el amor, el carisma creativo y el disfrute.", focus: "Atracción afectiva, autoconfianza y expresión creativa.", city: "Roma", country: "Italia" },
      6: { title: "Rutina, Salud & Método", shortTag: "Alto Rendimiento", profile: "Para sostener hábitos, entrenamiento, salud y orden diario.", focus: "Disciplina constante, vitalidad física y productividad.", city: "Tokio", country: "Japón" },
      7: { title: "Amor Serio & Sociedades", shortTag: "Alianzas", profile: "Para relaciones formales o socios estratégicos de confianza.", focus: "Compromisos sólidos, contratos justos y grandes alianzas.", city: "París", country: "Francia" },
      8: { title: "Giro Estratégico", shortTag: "Transformación", profile: "Para cerrar etapas pesadas y destrabar temas financieros.", focus: "Reestructuración profunda, claridad y renacimiento.", city: "Singapur", country: "Singapur" },
      9: { title: "Fronteras & Mundo", shortTag: "Expansión Global", profile: "Para vivir fuera, estudiar a alto nivel y abrir horizontes.", focus: "Caminos internacionales, visión amplia y escala global.", city: "Río → Mundo", country: "Internacional" },
      10: { title: "Carrera, Éxito & Cima", shortTag: "Reconocimiento", profile: "Para salir del anonimato y ganar autoridad visible en tu sector.", focus: "Liderazgo ejecutivo, prestigio y grandes contratos.", city: "Dubái", country: "EAU" },
      11: { title: "Red VIP & Escala Digital", shortTag: "Comunidad", profile: "Para crecer en internet, comunidades y contactos clave.", focus: "Networking de alto impacto y proyectos escalables.", city: "San Francisco", country: "EE. UU." },
      12: { title: "Enfoque Secreto & Paz", shortTag: "Blindaje", profile: "Para descansar la mente y preparar un gran proyecto en privado.", focus: "Protección emocional, intuición y enfoque profundo.", city: "Kioto", country: "Japón" },
    },
  },
  en: {
    nav: {
      home: "Home",
      consult: "Calculator",
      houses: "The 12 Houses",
      myConsultations: "Readings",
      partners: "Partners",
      quickGuide: "Quick Guide",
      signIn: "Sign In",
      myAccount: "My Account",
      signOut: "Sign Out",
      back: "Back",
      discover: "Discover",
      account: "Account",
    },
    hero: {
      badge: "Solar Return Relocation Engine",
      titleStart: "Where does your ",
      titleHighlight: "next year begin?",
      titleEnd: "",
      subtitle: "The city where you celebrate your birthday shifts which area of your life takes center stage for the next 12 months.",
      ctaPrimary: "Check my last birthday for free",
      ctaFilm: "Watch the film (1m30)",
      passHeader: "Solar Boarding Pass",
      passengerLabel: "Traveler",
      passengerValue: "Your Personal Chart",
      destinationLabel: "Birthday Destination",
      houseLabel: "Activated House",
      focusLabel: "Primary Theme",
      tapCityHint: "Tap a destination to preview how your House shifts:",
    },
    film: {
      badge: "Understand in 90 Seconds",
      titleStart: "Same birth sky. ",
      titleHighlight: "A new point on Earth.",
      subtitle: "See why changing coordinates on your birthday reshapes the main focus of your entire year.",
      playWithSound: "Watch with sound",
      mute: "Mute",
      unmute: "Unmute",
      reelsBadge: "Visual Comparison",
      reelsTitle: "1 Birth Chart · 3 Cities · 3 Distinct Years",
      reelsSubtitle: "See how the exact same birth data unlocks different life priorities across global destinations.",
      sameBirthNotice: "Astronomical precision powered by Swiss Ephemeris",
    },
    checkIn: {
      badge: "Instant Free Check",
      titleStart: "Verify the year you ",
      titleHighlight: "already lived.",
      subtitle: "See for free which Solar House was active on your last birthday and test it against your real life.",
      stepOf: "Step",
      step1Title: "What is your first name and birth date?",
      nameLabel: "First name",
      namePlaceholder: "e.g., Alex",
      birthDateLabel: "Date of birth",
      continueBtn: "Continue",
      step2Title: "What time were you born?",
      birthTimeLabel: "Time of birth",
      unknownTimeLabel: "I don't know my exact time (use 12:00 noon)",
      unknownTimeNote: "Without exact birth time, we transparently calculate using solar noon.",
      step3Title: "Which city were you born in?",
      birthCityLabel: "Birth city",
      birthCityPlaceholder: "Type and select your birth city...",
      step4Title: "Where did you spend your last birthday?",
      pastYearLabel: "Birthday year",
      pastCityLabel: "City on that birthday",
      pastCityPlaceholder: "Type and select the city...",
      submitFreeBtn: "Reveal my free past report",
      calculatingBtn: "Computing solar ephemeris...",
      samplePreviewBtn: "Or preview a complete sample report",
      trustLine: "100% free · No card required · Full 8-area past reading unlocked",
    },
    housesSection: {
      badge: "The 12 Life Arenas",
      titleStart: "The 12 ",
      titleHighlight: "Solar Houses",
      subtitle: "Each House represents the central theme of your next 12 months. Tap any card to watch and explore.",
      viewAllBtn: "Explore all 12 Solar Houses",
      exploreHouse: "Explore House",
      filterAll: "All (12)",
      forWhoLabel: "Best for",
      activatesLabel: "What it activates",
      elements: { Fogo: "Fire", Terra: "Earth", Ar: "Air", Água: "Water" },
    },
    pricing: {
      badge: "Your Next Birthday",
      titleStart: "Choose how to plan your ",
      titleHighlight: "next destination.",
      subtitle: "One-time payment, instant online access, and all 8 life areas unlocked in every pass.",
      oneTime: "one-time payment",
      mostPopular: "Most popular",
      currencyHint: "Secure checkout in BRL (~$4 / $10 / $19 USD on international cards)",
      plans: {
        single: {
          tag: "1 Reading",
          name: "1 City Pass",
          desc: "Ideal when you already have 1 specific birthday city in mind.",
          bullets: [
            "Full reading for 1 city or 1 House",
            "All 8 life areas explained clearly",
            "Includes guidance if staying home",
          ],
          cta: "Choose 1 City",
        },
        triple: {
          tag: "3 Readings",
          name: "Compare 3 Cities",
          desc: "Ideal to compare up to 3 destination options side by side.",
          bullets: [
            "Compare up to 3 cities or 3 Houses",
            "All 8 life areas unlocked in all 3",
            "Use together now or anytime later",
          ],
          cta: "Compare 3 Cities",
        },
        full: {
          tag: "Full Access",
          name: "Complete Map (12 Houses)",
          desc: "Unlock your top destinations worldwide across all 12 themes.",
          bullets: [
            "All 12 Solar Houses unlocked at once",
            "Global & regional city recommendations",
            "Permanent history saved in your account",
          ],
          cta: "Unlock All 12 Houses",
        },
      },
      trustSwiss: "Swiss Ephemeris astronomical engine",
      trustNoTravel: "Includes guidance for your home city if not traveling",
      trustRedeem: "Have a gift code?",
      trustRedeemLink: "Redeem code",
    },
    faq: {
      badge: "Quick Answers",
      title: "Frequently asked questions",
      items: [
        {
          q: "How is this different from a free natal birth chart?",
          a: "Your natal chart is static for life. Protocolo Solar computes the exact astronomical moment of your annual Solar Return across global coordinates to show how each city shifts your year's focus.",
        },
        {
          q: "What if I can't travel on my next birthday?",
          a: "You don't have to travel. Your reading shows which House activates right in your current city and how to navigate the next 12 months wisely.",
        },
        {
          q: "What if I don't know my exact birth time?",
          a: "Select the approximate 12:00 option. We transparently flag the estimate before you purchase any pass.",
        },
        {
          q: "Is this a recurring subscription?",
          a: "No. Every pass is a single one-time payment with instant online access.",
        },
      ],
    },
    pastReport: {
      backOtherYear: "Test another year",
      planNextYearBtn: "Plan next year",
      bridgeQuestion: "Did you recognize your cycle in",
      bridgeSub: "Discover the best cities for your upcoming birthday",
      drawerBadge: "Upcoming Solar Cycle",
      drawerTitle: "Where will your next birthday take you?",
      stayWarningPrefix: "Staying in",
      stayWarningMiddle: "activates",
    },
    houses: {
      1: { title: "Autonomy & Fresh Start", shortTag: "Self-Leadership", profile: "Ready to reinvent yourself, lead solo projects, and put yourself first.", focus: "Bold initiative, personal presence, and fresh momentum.", city: "New York", country: "USA" },
      2: { title: "Wealth & Solid Cashflow", shortTag: "Prosperity", profile: "Ready to raise your rates, close money leaks, and build real assets.", focus: "Financial grounding, stronger margins, and lasting wealth.", city: "Zurich", country: "Switzerland" },
      3: { title: "Sales & Magnetic Voice", shortTag: "Communication", profile: "For founders, creators, and negotiators ready to speak and sell with ease.", focus: "Persuasive expression, fast deals, and thriving visibility.", city: "London", country: "UK" },
      4: { title: "Home, Real Estate & Roots", shortTag: "Sanctuary", profile: "Planning a move, property purchase, or deeper peace with family.", focus: "Real estate clarity, emotional grounding, and inner peace.", city: "Florence", country: "Italy" },
      5: { title: "Romance & Creative Spark", shortTag: "Magnetism", profile: "Seeking real romance, creative applause, and effortless joy.", focus: "Personal magnetism, passion, and bold creative expression.", city: "Rome", country: "Italy" },
      6: { title: "Routine, Fitness & Craft", shortTag: "High Performance", profile: "Ready to lock in workouts, health habits, and a calm productive schedule.", focus: "Daily consistency, physical vitality, and clean execution.", city: "Tokyo", country: "Japan" },
      7: { title: "Committed Love & Alliances", shortTag: "Partnerships", profile: "Looking for a serious relationship or high-trust business partners.", focus: "Lasting commitments, balanced contracts, and key alliances.", city: "Paris", country: "France" },
      8: { title: "Strategic Turnaround", shortTag: "Reinvention", profile: "Ready to close draining chapters and restructure shared finances.", focus: "Clean closure, financial clarity, and powerful renewal.", city: "Singapore", country: "Singapore" },
      9: { title: "Global Horizons & Study", shortTag: "Expansion", profile: "Dreaming of living abroad, higher study, and global perspective.", focus: "International doors, wisdom, and thinking beyond borders.", city: "Rio → World", country: "Global" },
      10: { title: "Career Peak & Spotlight", shortTag: "Authority", profile: "Ready to step out of the background and claim industry recognition.", focus: "Executive leadership, prestige, and major career milestones.", city: "Dubai", country: "UAE" },
      11: { title: "VIP Network & Digital Scale", shortTag: "Community", profile: "Building an audience, digital products, and influential circles.", focus: "High-leverage connections, community growth, and reach.", city: "San Francisco", country: "USA" },
      12: { title: "Deep Work & Inner Shield", shortTag: "Sanctuary", profile: "Needing mental rest, privacy, or quiet focus on a major project.", focus: "Protected energy, sharp intuition, and restorative calm.", city: "Kyoto", country: "Japan" },
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      consult: "Calculateur",
      houses: "Les 12 Maisons",
      myConsultations: "Lectures",
      partners: "Partenaires",
      quickGuide: "Guide Rapide",
      signIn: "Connexion",
      myAccount: "Mon Compte",
      signOut: "Déconnexion",
      back: "Retour",
      discover: "Découvrir",
      account: "Compte",
    },
    hero: {
      badge: "Révolution Solaire par Coordonnées",
      titleStart: "Où commence votre ",
      titleHighlight: "prochaine année ?",
      titleEnd: "",
      subtitle: "La ville où vous fêtez votre anniversaire détermine quel domaine de votre vie prend l'avantage durant les 12 prochains mois.",
      ctaPrimary: "Vérifier mon dernier anniversaire gratuitement",
      ctaFilm: "Voir le film (1m30)",
      passHeader: "Carte d'Embarquement Solaire",
      passengerLabel: "Voyageur",
      passengerValue: "Votre Thème Personnel",
      destinationLabel: "Destination d'Anniversaire",
      houseLabel: "Maison Activée",
      focusLabel: "Énergie Majeure",
      tapCityHint: "Touchez une ville pour simuler le changement de Maison :",
    },
    film: {
      badge: "Comprendre en 90 Secondes",
      titleStart: "Même ciel de naissance. ",
      titleHighlight: "Nouveau point sur Terre.",
      subtitle: "Découvrez pourquoi changer de coordonnées le jour de votre anniversaire redéfinit les priorités de votre année.",
      playWithSound: "Regarder avec le son",
      mute: "Couper le son",
      unmute: "Activer le son",
      reelsBadge: "Comparaison Visuelle",
      reelsTitle: "1 Date de Naissance · 3 Villes · 3 Années Différentes",
      reelsSubtitle: "Observez comment un même thème natal active des élans distincts selon la ville choisie.",
      sameBirthNotice: "Calcul astronomique réel via Swiss Ephemeris",
    },
    checkIn: {
      badge: "Test Gratuit Immédiat",
      titleStart: "Vérifiez l'année que vous ",
      titleHighlight: "avez déjà vécue.",
      subtitle: "Découvrez gratuitement quelle Maison était active lors de votre dernier anniversaire.",
      stepOf: "Étape",
      step1Title: "Quel est votre prénom et votre date de naissance ?",
      nameLabel: "Prénom",
      namePlaceholder: "Ex. : Camille",
      birthDateLabel: "Date de naissance",
      continueBtn: "Continuer",
      step2Title: "À quelle heure êtes-vous né(e) ?",
      birthTimeLabel: "Heure de naissance",
      unknownTimeLabel: "Je ne connais pas l'heure exacte (utiliser 12h00)",
      unknownTimeNote: "Sans heure exacte, nous utilisons midi solaire en toute transparence.",
      step3Title: "Dans quelle ville êtes-vous né(e) ?",
      birthCityLabel: "Ville de naissance",
      birthCityPlaceholder: "Saisissez et sélectionnez votre ville...",
      step4Title: "Où avez-vous passé votre dernier anniversaire ?",
      pastYearLabel: "Année de l'anniversaire",
      pastCityLabel: "Ville ce jour-là",
      pastCityPlaceholder: "Saisissez et sélectionnez la ville...",
      submitFreeBtn: "Révéler mon bilan gratuit",
      calculatingBtn: "Calcul des éphémérides solaires...",
      samplePreviewBtn: "Ou voir un exemple complet",
      trustLine: "100% gratuit · Sans carte · Lecture complète des 8 domaines",
    },
    housesSection: {
      badge: "Les 12 Domaines de Vie",
      titleStart: "Les 12 ",
      titleHighlight: "Maisons Solaires",
      subtitle: "Chaque Maison incarne l'énergie dominante de votre cycle annuel. Touchez une carte pour explorer.",
      viewAllBtn: "Explorer le guide des 12 Maisons",
      exploreHouse: "Explorer la Maison",
      filterAll: "Toutes (12)",
      forWhoLabel: "Idéal pour",
      activatesLabel: "Ce qu'elle active",
      elements: { Fogo: "Feu", Terra: "Terre", Ar: "Air", Água: "Eau" },
    },
    pricing: {
      badge: "Prochain Anniversaire",
      titleStart: "Choisissez comment préparer votre ",
      titleHighlight: "prochaine destination.",
      subtitle: "Paiement unique, accès immédiat en ligne et les 8 domaines de vie inclus dans chaque formule.",
      oneTime: "paiement unique",
      mostPopular: "Le plus choisi",
      currencyHint: "Paiement sécurisé en BRL (~3,50 € / 9 € / 17 € par carte internationale)",
      plans: {
        single: {
          tag: "1 Lecture",
          name: "Pass 1 Ville",
          desc: "Idéal si vous avez déjà 1 ville précise en tête.",
          bullets: [
            "Analyse complète d'1 ville ou d'1 Maison",
            "Les 8 domaines de vie détaillés",
            "Guide pratique même sans voyager",
          ],
          cta: "Choisir 1 Ville",
        },
        triple: {
          tag: "3 Lectures",
          name: "Comparer 3 Villes",
          desc: "Idéal pour comparer jusqu'à 3 destinations avant de décider.",
          bullets: [
            "Comparez jusqu'à 3 villes ou 3 Maisons",
            "Les 8 domaines ouverts dans les 3 choix",
            "Utilisez-les maintenant ou plus tard",
          ],
          cta: "Comparer 3 Villes",
        },
        full: {
          tag: "Accès Complet",
          name: "Carte Complète (12 Maisons)",
          desc: "Découvrez vos meilleures villes dans le monde sur les 12 thèmes.",
          bullets: [
            "Les 12 Maisons Solaires débloquées",
            "Sélection mondiale et régionale de villes",
            "Historique permanent sur votre compte",
          ],
          cta: "Débloquer les 12 Maisons",
        },
      },
      trustSwiss: "Précision astronomique Swiss Ephemeris",
      trustNoTravel: "Inclut la lecture de votre ville actuelle sans voyage",
      trustRedeem: "Un code cadeau ?",
      trustRedeemLink: "Utiliser un code",
    },
    faq: {
      badge: "Questions Fréquentes",
      title: "Questions fréquentes",
      items: [
        {
          q: "Quelle différence avec un thème astral gratuit ?",
          a: "Le thème natal reste fixe toute la vie. Protocolo Solar recalcule l'instant exact de votre retour solaire annuel selon les coordonnées mondiales pour révéler où orienter votre année.",
        },
        {
          q: "Et si je ne peux pas voyager pour mon anniversaire ?",
          a: "Le voyage n'est pas obligatoire. Votre lecture indique la Maison activée dans votre ville actuelle et comment en tirer le meilleur parti.",
        },
        {
          q: "Et si j'ignore mon heure exacte de naissance ?",
          a: "Cochez l'option 12h00 approximative : l'estimation est indiquée clairement avant tout achat.",
        },
        {
          q: "Est-ce un abonnement mensuel ?",
          a: "Non. Chaque pass est un paiement unique sans prélèvement récurrent.",
        },
      ],
    },
    pastReport: {
      backOtherYear: "Tester une autre année",
      planNextYearBtn: "Préparer l'an prochain",
      bridgeQuestion: "Vous reconnaissez votre cycle",
      bridgeSub: "Découvrez les meilleures villes pour votre prochain anniversaire",
      drawerBadge: "Prochain Cycle Solaire",
      drawerTitle: "Où fêter votre prochain anniversaire ?",
      stayWarningPrefix: "En restant à",
      stayWarningMiddle: "votre prochain cycle active la",
    },
    houses: {
      1: { title: "Autonomie & Renouveau", shortTag: "Initiative", profile: "Pour reprendre les rênes, s'affirmer et lancer ses propres projets.", focus: "Audace personnelle, présence forte et nouvel élan.", city: "New York", country: "États-Unis" },
      2: { title: "Patrimoine & Trésorerie", shortTag: "Prospérité", profile: "Pour valoriser son travail et bâtir une sécurité financière solide.", focus: "Croissance matérielle, marges saines et stabilité.", city: "Zurich", country: "Suisse" },
      3: { title: "Ventes & Parole Fluide", shortTag: "Communication", profile: "Pour convaincre, négocier, publier et accélérer ses échanges.", focus: "Éloquence, accords rapides et rayonnement commercial.", city: "Londres", country: "Royaume-Uni" },
      4: { title: "Foyer, Immobilier & Famille", shortTag: "Ancrage", profile: "Pour acheter, déménager ou cultiver la sérénité familiale.", focus: "Racines solides, projets immobiliers et paix intérieure.", city: "Florence", country: "Italie" },
      5: { title: "Romance & Magnétisme", shortTag: "Passion & Éclat", profile: "Pour raviver l'amour, la créativité et le plaisir de vivre.", focus: "Charisme naturel, rencontres vibrantes et élan créatif.", city: "Rome", country: "Italie" },
      6: { title: "Routine, Santé & Méthode", shortTag: "Discipline", profile: "Pour ancrer le sport, la vitalité et une organisation efficace.", focus: "Constance quotidienne, forme physique et clarté.", city: "Tokyo", country: "Japon" },
      7: { title: "Union & Alliances d'Or", shortTag: "Partenariats", profile: "Pour bâtir une relation sérieuse ou s'associer avec les bonnes personnes.", focus: "Engagements durables, contrats équilibrés et synergies.", city: "Paris", country: "France" },
      8: { title: "Tournant Stratégique", shortTag: "Transformation", profile: "Pour tourner la page et restructurer ses engagements financiers.", focus: "Lucidité stratégique, libération et renouveau puissant.", city: "Singapour", country: "Singapour" },
      9: { title: "Horizons & International", shortTag: "Expansion", profile: "Pour s'expatrier, étudier et élargir sa vision du monde.", focus: "Ouverture internationale, études et grands voyages.", city: "Rio → Monde", country: "International" },
      10: { title: "Carrière & Reconnaissance", shortTag: "Leadership", profile: "Pour sortir de l'ombre et s'imposer comme référence de son secteur.", focus: "Autorité professionnelle, prestige et grands objectifs.", city: "Dubaï", country: "ÉAU" },
      11: { title: "Réseau VIP & Impact Digital", shortTag: "Communauté", profile: "Pour fédérer une audience et accéder à des cercles influents.", focus: "Connexions décisives, portée digitale et projets collectifs.", city: "San Francisco", country: "États-Unis" },
      12: { title: "Focus Secret & Sérénité", shortTag: "Protection", profile: "Pour se ressourcer loin du bruit et mûrir un grand projet en coulisses.", focus: "Calme profond, intuition affûtée et protection.", city: "Kyoto", country: "Japon" },
    },
  },
  it: {
    nav: {
      home: "Home",
      consult: "Calcolatore",
      houses: "Le 12 Case",
      myConsultations: "Letture",
      partners: "Partner",
      quickGuide: "Guida Rapida",
      signIn: "Accedi",
      myAccount: "Il Mio Profilo",
      signOut: "Esci",
      back: "Indietro",
      discover: "Scopri",
      account: "Profilo",
    },
    hero: {
      badge: "Rivoluzione Solare per Coordinate",
      titleStart: "Dove inizia il tuo ",
      titleHighlight: "prossimo anno?",
      titleEnd: "",
      subtitle: "La città in cui festeggi il compleanno definisce quale area della tua vita prende forza nei successivi 12 mesi.",
      ctaPrimary: "Verifica gratis il mio ultimo compleanno",
      ctaFilm: "Guarda il film (1m30)",
      passHeader: "Carta d'Imbarco Solare",
      passengerLabel: "Viaggiatore",
      passengerValue: "Il Tuo Tema Personale",
      destinationLabel: "Meta di Compleanno",
      houseLabel: "Casa Attivata",
      focusLabel: "Energia Principale",
      tapCityHint: "Tocca una città per simulare il cambio di Casa:",
    },
    film: {
      badge: "Capisci in 90 Secondi",
      titleStart: "Lo stesso cielo di nascita. ",
      titleHighlight: "Un nuovo punto sulla Terra.",
      subtitle: "Scopri perché cambiare coordinate nel giorno del compleanno trasforma il focus dell'intero anno.",
      playWithSound: "Guarda con audio",
      mute: "Disattiva audio",
      unmute: "Attiva audio",
      reelsBadge: "Confronto Visivo",
      reelsTitle: "1 Data di Nascita · 3 Città · 3 Anni Diversi",
      reelsSubtitle: "Osserva come la stessa persona attiva priorità diverse cambiando la meta del ritorno solare.",
      sameBirthNotice: "Calcolo astronomico reale con Swiss Ephemeris",
    },
    checkIn: {
      badge: "Prova Gratuita Immediata",
      titleStart: "Verifica l'anno che hai ",
      titleHighlight: "già vissuto.",
      subtitle: "Scopri gratis quale Casa era attiva nel tuo ultimo compleanno e confrontala con la tua storia reale.",
      stepOf: "Passo",
      step1Title: "Come ti chiami e quando sei nato/a?",
      nameLabel: "Nome",
      namePlaceholder: "Es.: Giulia",
      birthDateLabel: "Data di nascita",
      continueBtn: "Continua",
      step2Title: "A che ora sei nato/a?",
      birthTimeLabel: "Ora di nascita",
      unknownTimeLabel: "Non conosco l'ora esatta (usa 12:00 indicativo)",
      unknownTimeNote: "Senza l'ora esatta usiamo il mezzogiorno solare in modo trasparente.",
      step3Title: "In quale città sei nato/a?",
      birthCityLabel: "Città di nascita",
      birthCityPlaceholder: "Scrivi e seleziona la città di nascita...",
      step4Title: "Dove hai trascorso il tuo ultimo compleanno?",
      pastYearLabel: "Anno del compleanno",
      pastCityLabel: "Città in quel giorno",
      pastCityPlaceholder: "Scrivi e seleziona la città...",
      submitFreeBtn: "Rivela il mio risultato gratuito",
      calculatingBtn: "Calcolo effemeridi solari...",
      samplePreviewBtn: "Oppure guarda un esempio completo",
      trustLine: "100% gratuito · Senza carta · Analisi completa delle 8 aree",
    },
    housesSection: {
      badge: "Pannello delle 12 Aree",
      titleStart: "Le 12 ",
      titleHighlight: "Case Solari",
      subtitle: "Ogni Casa rappresenta il tema protagonista del tuo anno. Tocca una scheda per vedere il video e i dettagli.",
      viewAllBtn: "Esplora la guida completa delle 12 Case",
      exploreHouse: "Esplora la Casa",
      filterAll: "Tutte (12)",
      forWhoLabel: "Ideale per chi cerca",
      activatesLabel: "Cosa attiva nell'anno",
      elements: { Fogo: "Fuoco", Terra: "Terra", Ar: "Aria", Água: "Acqua" },
    },
    pricing: {
      badge: "Prossimo Compleanno",
      titleStart: "Scegli come pianificare la tua ",
      titleHighlight: "prossima meta.",
      subtitle: "Pagamento unico, accesso immediato online e tutte le 8 aree della vita incluse in ogni opzione.",
      oneTime: "pagamento unico",
      mostPopular: "Più scelto",
      currencyHint: "Pagamento sicuro in BRL (~3,50 € / 9 € / 17 € con carta internazionale)",
      plans: {
        single: {
          tag: "1 Lettura",
          name: "1 Città",
          desc: "Ideale se hai già in mente 1 destinazione specifica.",
          bullets: [
            "Analisi completa di 1 città o 1 Casa",
            "Tutte le 8 aree della vita spiegate",
            "Guida pratica anche se non viaggi",
          ],
          cta: "Scegli 1 Città",
        },
        triple: {
          tag: "3 Letture",
          name: "Confronta 3 Città",
          desc: "Ideale per confrontare fino a 3 possibili viaggi prima di decidere.",
          bullets: [
            "Confronta fino a 3 città o 3 Case",
            "Tutte le 8 aree sbloccate nelle 3 opzioni",
            "Usale subito o quando preferisci",
          ],
          cta: "Confronta 3 Città",
        },
        full: {
          tag: "Accesso Completo",
          name: "Mappa Completa (12 Case)",
          desc: "Scopri le tue migliori città nel mondo in tutti i 12 temi dell'anno.",
          bullets: [
            "Tutte le 12 Case Solari sbloccate",
            "Classifica globale e regionale delle mete",
            "Storico salvato nel tuo profilo",
          ],
          cta: "Sblocca le 12 Case",
        },
      },
      trustSwiss: "Precisione astronomica Swiss Ephemeris",
      trustNoTravel: "Include la lettura della tua città attuale se non viaggi",
      trustRedeem: "Hai un codice regalo?",
      trustRedeemLink: "Riscatta codice",
    },
    faq: {
      badge: "Domande Rapide",
      title: "Domande frequenti",
      items: [
        {
          q: "In cosa differisce da un tema natale gratuito?",
          a: "Il tema natale resta fisso per tutta la vita. Protocolo Solar ricalcola il minuto esatto del tuo ritorno solare annuale sulle coordinate del mondo per mostrarti dove cambia il focus dell'anno.",
        },
        {
          q: "E se non posso viaggiare per il compleanno?",
          a: "Non è obbligatorio partire. La lettura mostra quale Casa si attiva nella tua città attuale e come viverla al meglio.",
        },
        {
          q: "E se non conosco l'ora esatta di nascita?",
          a: "Puoi selezionare l'orario indicativo 12:00 con avviso trasparente prima di qualsiasi acquisto.",
        },
        {
          q: "È un abbonamento mensile?",
          a: "No. Ogni pass prevede un pagamento unico senza rinnovi automatici.",
        },
      ],
    },
    pastReport: {
      backOtherYear: "Prova un altro anno",
      planNextYearBtn: "Pianifica il prossimo anno",
      bridgeQuestion: "Hai riconosciuto il tuo ciclo del",
      bridgeSub: "Scopri le migliori città per il tuo prossimo compleanno",
      drawerBadge: "Prossimo Ciclo Solare",
      drawerTitle: "Dove trascorrere il prossimo compleanno?",
      stayWarningPrefix: "Restando a",
      stayWarningMiddle: "il prossimo ciclo attiva la",
    },
    houses: {
      1: { title: "Autonomia & Nuovo Inizio", shortTag: "Protagonismo", profile: "Per chi vuole voltare pagina, rinnovarsi e guidare progetti propri.", focus: "Coraggio decisionale, presenza forte ed energia di rinascita.", city: "New York", country: "USA" },
      2: { title: "Denaro & Solidità", shortTag: "Patrimonio", profile: "Per valorizzare il proprio lavoro e costruire risparmio reale.", focus: "Crescita finanziaria, margini sani e patrimonio stabile.", city: "Zurigo", country: "Svizzera" },
      3: { title: "Vendite & Comunicazione", shortTag: "Business", profile: "Per sbloccare parola, trattative, contenuti e accordi rapidi.", focus: "Persuasione, movimento dinamico e nuove opportunità.", city: "Londra", country: "Regno Unito" },
      4: { title: "Casa, Immobili & Famiglia", shortTag: "Radici", profile: "Per chi pianifica casa nuova, ristrutturazione o serenità familiare.", focus: "Stabilità domestica, radici solide e pace interiore.", city: "Firenze", country: "Italia" },
      5: { title: "Romanticismo & Carisma", shortTag: "Passione", profile: "Per riaccendere amore, creatività personale e gioia di vivere.", focus: "Magnetismo affettivo, fiducia e brillantezza creativa.", city: "Roma", country: "Italia" },
      6: { title: "Routine, Salute & Metodo", shortTag: "Disciplina", profile: "Per mantenere allenamento, benessere e agenda produttiva.", focus: "Costanza quotidiana, energia fisica e ordine mentale.", city: "Tokyo", country: "Giappone" },
      7: { title: "Amore Solido & Società", shortTag: "Alleanze", profile: "Per chi cerca una relazione importante o soci affidabili.", focus: "Legami duraturi, accordi equi e grandi collaborazioni.", city: "Parigi", country: "Francia" },
      8: { title: "Svolta Strategica", shortTag: "Trasformazione", profile: "Per chiudere capitoli pesanti e riorganizzare accordi economici.", focus: "Pulizia profonda, lucidità patrimoniale e ripartenza.", city: "Singapore", country: "Singapore" },
      9: { title: "Orizzonti & Mondo", shortTag: "Espansione", profile: "Per vivere all'estero, studiare ad alto livello e ampliare visione.", focus: "Percorsi internazionali, cultura e scala globale.", city: "Rio → Mondo", country: "Internazionale" },
      10: { title: "Carriera, Palco & Vertice", shortTag: "Riconoscimento", profile: "Per uscire dietro le quinte e affermarsi come leader del settore.", focus: "Autorevolezza, prestigio pubblico e grandi traguardi.", city: "Dubai", country: "EAU" },
      11: { title: "Rete VIP & Scala Digitale", shortTag: "Community", profile: "Per crescere online, creare community e contatti strategici.", focus: "Networking d'élite, portata digitale e progetti condivisi.", city: "San Francisco", country: "USA" },
      12: { title: "Focus Segreto & Quiete", shortTag: "Protezione", profile: "Per ricaricare la mente e preparare un grande progetto lontano dal rumore.", focus: "Protezione energetica, intuizione lucida e serenità.", city: "Kyoto", country: "Giappone" },
    },
  },
};

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: AppDictionary;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "pt",
  setLocale: () => undefined,
  t: DICTIONARIES.pt,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => detectBrowserLocaleSync());

  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem("ps_lang_manual", next);
    } catch {
      // ignore storage errors
    }
  };

  // Update <html lang="..."> whenever locale changes
  useEffect(() => {
    const meta = LOCALE_OPTIONS.find((item) => item.code === locale);
    if (meta && typeof document !== "undefined") {
      document.documentElement.lang = meta.htmlLang;
    }
  }, [locale]);

  // Async Geo-IP verification on first visit (only when user hasn't manually chosen a language)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem("ps_lang_manual") || sessionStorage.getItem("ps_lang_geo")) {
        return;
      }
    } catch {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2400);

    const detectByIp = async () => {
      try {
        const res = await fetch("https://get.geojs.io/v1/ip/country.json", {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const payload = (await res.json()) as { country?: string };
        if (cancelled || !payload?.country) return;
        const resolved = mapCountryToLocale(payload.country, detectBrowserLocaleSync());
        try {
          sessionStorage.setItem("ps_lang_geo", resolved);
        } catch {
          // ignore storage errors
        }
        if (!localStorage.getItem("ps_lang_manual")) {
          setLocaleState(resolved);
        }
      } catch {
        // Silent fallback to synchronous browser/timezone locale
      } finally {
        window.clearTimeout(timer);
      }
    };

    void detectByIp();
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: DICTIONARIES[locale] || DICTIONARIES.pt,
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
