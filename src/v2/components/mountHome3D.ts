// @ts-nocheck
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface Home3DCallbacks {
  onOpenHouse: (houseId: number) => void;
  onOpenFreeAudit: () => void;
  onBuyPackage: (pkg: "single" | "3" | "full") => void;
}

export function mountHome3D(rootEl: HTMLElement, callbacks: Home3DCallbacks): () => void {
  let disposed = false;
  let rafId = 0;
  let rendererRef: THREE.WebGLRenderer | null = null;
  let envRTRef: THREE.WebGLRenderTarget | null = null;
  const winListeners: Array<[string, EventListenerOrEventListenerObject, any]> = [];
  const activeVideos: HTMLVideoElement[] = [];

  const addWinListener = (type: string, fn: EventListenerOrEventListenerObject, opts?: any) => {
    winListeners.push([type, fn, opts]);
    window.addEventListener(type, fn, opts);
  };

  const byId = (id: string) => rootEl.querySelector(`#${id}`) as HTMLElement;

  (async () => {


    const HOUSES = [
      {
        id: 1, code: "01", coverTheme: "PROTAGONISMO", title: "Protagonismo, Coragem & Recomeço",
        tagline: "Protagonismo e coragem",
        hook: "Para tomar decisões por conta própria e resgatar a coragem.",
        forWho: "Pessoas que viveram muito em função dos outros, apagadas ou dizendo \"sim\" para tudo.",
        practice: "É o ciclo do reinício e da postura firme. Favorece tomar decisões solo, renovar o visual/estilo, lançar projetos individuais e parar de pedir licença.",
        yearEnergy: "A energia deste ano convida você a assumir o centro da própria história, resgatar sua coragem natural e dar o primeiro passo sem esperar aprovação.",
        element: "Fogo", env: "#0E2D73", envDark: "#061844", ticket: "#63A9EB", stage: "#9EC2EB", cardBg: "#C6DFF8", glow: "rgba(14,45,115,0.92)",
        videoElId: "vid1", videoSrc: "/v2-assets/casa-01.mp4", posterSrc: "/v2-assets/casa-01.jpg"
      },
      {
        id: 2, code: "02", coverTheme: "PROSPERIDADE", title: "Dinheiro, Prosperidade & Abundância",
        tagline: "Valor próprio e prosperidade",
        hook: "Para precificar seu valor real, estancar gastos e fazer sobrar.",
        forWho: "Quem trabalha o mês inteiro, mas o dinheiro evapora e sente dificuldade em cobrar o justo pelo próprio trabalho.",
        practice: "Ajusta a régua de autovalor. Joga a favor de precificar sem culpa, fechar ralos financeiros, negociar ganhos e construir reserva com estabilidade.",
        yearEnergy: "A energia deste ano convida você a consolidar suas bases materiais, valorizar seus talentos e construir uma relação mais segura e próspera com seus recursos.",
        element: "Terra", env: "#0A4B37", envDark: "#042A1E", ticket: "#5CC49C", stage: "#8FCFB5", cardBg: "#BFE8D7", glow: "rgba(10,75,55,0.92)",
        videoElId: "vid2", videoSrc: "/v2-assets/casa-02.mp4", posterSrc: "/v2-assets/casa-02.jpg"
      },
      {
        id: 3, code: "03", coverTheme: "COMUNICAÇÃO", title: "Comunicação, Vendas & Movimento",
        tagline: "Fala clara e movimento",
        hook: "Para destravar a fala, negociar rápido e fazer seu nome circular.",
        forWho: "Comerciantes, corretores, criadores e profissionais com ótimas ideias que travam na hora de vender, gravar ou negociar.",
        practice: "Acelera a circulação de conversas, reuniões comerciais ágeis, conteúdo curto e contatos locais que viram oportunidades reais.",
        yearEnergy: "A energia deste ano convida você a destravar sua voz, transformar conversas em oportunidades e fazer suas ideias circularem com leveza e agilidade.",
        element: "Ar", env: "#B04917", envDark: "#6E2808", ticket: "#F5A56C", stage: "#F0B489", cardBg: "#F9D4B9", glow: "rgba(176,73,23,0.92)",
        videoSrc: "/v2-assets/casa-03.mp4", posterSrc: "/v2-assets/casa-03.jpg"
      },
      {
        id: 4, code: "04", coverTheme: "LAR & RAÍZES", title: "Lar, Raízes & Estabilidade",
        tagline: "Porto seguro e raízes",
        hook: "Para arrumar a casa, desacelerar e fortalecer o refúgio íntimo.",
        forWho: "Quem sente a vida íntima sem chão, casa desorganizada ou precisa resolver pendências familiares e recuperar a paz.",
        practice: "Favorece estruturar o alicerce emocional e físico: compra, aluguel ou reforma de imóvel, home office tranquilo e fortalecimento do lar.",
        yearEnergy: "A energia deste ano convida você a cuidar do seu porto seguro, fortalecer suas raízes e construir um espaço de paz onde sua vida respira melhor.",
        element: "Água", env: "#185678", envDark: "#0B334A", ticket: "#75B9DC", stage: "#94C4DE", cardBg: "#C1E0F0", glow: "rgba(24,86,120,0.92)",
        videoSrc: "/v2-assets/casa-04.mp4", posterSrc: "/v2-assets/casa-04.jpg"
      },
      {
        id: 5, code: "05", coverTheme: "PRAZER & ROMANCE", title: "Prazer, Romance & Criatividade",
        tagline: "Prazer e brilho autoral",
        hook: "Para resgatar o prazer de viver, atrair paixão e brilhar projetos autorais.",
        forWho: "Quem caiu numa rotina cinza só de obrigações, bloqueio criativo ou meses no zero a zero na vida afetiva.",
        practice: "Reacende entusiasmo, leveza e magnetismo pessoal. Favorece romances envolventes, projetos criativos autorais e alegria sem culpa.",
        yearEnergy: "A energia deste ano convida você a reacender o brilho pessoal, viver o amor com entusiasmo e colocar sua assinatura criativa no mundo.",
        element: "Fogo", env: "#A66E0A", envDark: "#694203", ticket: "#F7CC5E", stage: "#F2CE74", cardBg: "#FAE4AA", glow: "rgba(166,110,10,0.92)",
        videoSrc: "/v2-assets/casa-05.mp4", posterSrc: "/v2-assets/casa-05.jpg"
      },
      {
        id: 6, code: "06", coverTheme: "SAÚDE & ROTINA", title: "Saúde, Rotina & Produtividade",
        tagline: "Disciplina de relógio suíço",
        hook: "Para manter treinos e rotina no ritmo de um relógio suíço.",
        forWho: "Quem fura a dieta toda quarta-feira, paga academia sem ir ou vive apagando incêndio no dia a dia de trabalho.",
        practice: "Cria um ambiente favorável para constância em treinos, alimentação limpa, agenda organizada e trabalho recorrente sem caos.",
        yearEnergy: "A energia deste ano convida você a transformar disciplina em leveza, cuidar do corpo com constância e fazer sua rotina trabalhar a seu favor.",
        element: "Terra", env: "#0A615B", envDark: "#043B38", ticket: "#5ECEC2", stage: "#84D2C9", cardBg: "#B7E9E3", glow: "rgba(10,97,91,0.92)",
        videoSrc: "/v2-assets/casa-06.mp4", posterSrc: "/v2-assets/casa-06.jpg"
      },
      {
        id: 7, code: "07", coverTheme: "AMOR & ALIANÇAS", title: "Amor, Parcerias & Alianças",
        tagline: "Compromissos de peso",
        hook: "Para sair do caminho solitário e firmar alianças sérias de longo prazo.",
        forWho: "Quem cansou de carregar tudo sozinho nos negócios ou de encontros rasos que não viram parceria de verdade.",
        practice: "Favorece acordos maduros, namoros que evoluem para compromisso sólido e sociedades complementares onde dois somam mais.",
        yearEnergy: "A energia deste ano convida você a sair da caminhada solo, cultivar trocas equilibradas e construir parcerias sólidas no amor e nos negócios.",
        element: "Ar", env: "#B32E56", envDark: "#701533", ticket: "#F593B1", stage: "#EDA1B8", cardBg: "#F7C9D7", glow: "rgba(179,46,86,0.92)",
        videoSrc: "/v2-assets/casa-07.mp4", posterSrc: "/v2-assets/casa-07.jpg"
      },
      {
        id: 8, code: "08", coverTheme: "RENASCIMENTO", title: "Transformação, Poder & Renascimento",
        tagline: "Faxina e renovação",
        hook: "Para encerrar o que está desgastado e abrir espaço para grandes mudanças.",
        forWho: "Quem está preso em ciclos vencidos, pendências burocráticas/financeiras travadas ou precisa virar a página de vez.",
        practice: "Joga a favor de desapegar do que não rende, reorganizar finanças compartilhadas/investimentos e renascer com mais autonomia.",
        yearEnergy: "A energia deste ano convida você a soltar o que já cumpriu seu papel, renovar sua força interior e abrir caminho para uma nova fase mais leve.",
        element: "Água", env: "#6B1136", envDark: "#3E061D", ticket: "#DE7A9E", stage: "#D994AE", cardBg: "#ECC1D1", glow: "rgba(107,17,54,0.92)",
        videoSrc: "/v2-assets/casa-08.mp4", posterSrc: "/v2-assets/casa-08.jpg"
      },
      {
        id: 9, code: "09", coverTheme: "VIAGENS & EXPANSÃO", title: "Expansão, Viagens & Liberdade",
        tagline: "Salto fora da bolha",
        hook: "Para sair da bolha, estudar fora e ampliar sua visão de mundo.",
        forWho: "Quem sente que a rotina atual, a cidade ou o círculo de sempre ficaram pequenos demais para o tamanho da própria ambição.",
        practice: "Favorece viagens marcantes, estudos avançados, contato com outras culturas e expansão de projetos além das fronteiras habituais.",
        yearEnergy: "A energia deste ano convida você a expandir seus horizontes, buscar novas paisagens e enxergar sua vida sob uma perspectiva muito maior.",
        element: "Fogo", env: "#282F94", envDark: "#14185C", ticket: "#8E96F5", stage: "#A9AFEE", cardBg: "#CFD3F8", glow: "rgba(40,47,148,0.92)",
        videoSrc: "/v2-assets/casa-09.mp4", posterSrc: "/v2-assets/casa-09.jpg"
      },
      {
        id: 10, code: "10", coverTheme: "SUCESSO & TOPO", title: "Sucesso, Reconhecimento & Topo",
        tagline: "Holofotes e liderança",
        hook: "Para sair dos bastidores, ganhar visibilidade e liderar seu nicho.",
        forWho: "Criadores, artistas, profissionais e empreendedores que entregam um trabalho impecável nos bastidores, mas querem ser vistos no topo.",
        practice: "Apoia posicionamento público, reputação de elite, ganho de visibilidade qualificada e fechamento de contratos maiores.",
        yearEnergy: "A energia deste ano convida você a sair da sombra, ocupar o seu espaço de autoridade e ser reconhecido pelo valor real do que entrega.",
        element: "Terra", env: "#161D29", envDark: "#090D14", ticket: "#DFBE70", stage: "#CBBFA8", cardBg: "#E4DCCB", glow: "rgba(22,29,41,0.92)",
        videoSrc: "/v2-assets/casa-10.mp4", posterSrc: "/v2-assets/casa-10.jpg"
      },
      {
        id: 11, code: "11", coverTheme: "CONEXÕES & REDE", title: "Conexões, Amizades & Futuro",
        tagline: "Força da coletividade",
        hook: "Para crescer com apoio da rede, internet e indicações de valor.",
        forWho: "Quem tenta remar sozinho sem aliados no mercado ou quer escalar projetos digitais, eventos e comunidades.",
        practice: "Favorece conexões estratégicas, indicações espontâneas, grupos influentes e receitas que crescem através da sua rede.",
        yearEnergy: "A energia deste ano convida você a multiplicar seus resultados em boa companhia, aproximando aliados certos e projetos de futuro.",
        element: "Ar", env: "#0E4FA8", envDark: "#062F6B", ticket: "#69B2FA", stage: "#92C0F5", cardBg: "#C1DDFA", glow: "rgba(14,79,168,0.92)",
        videoSrc: "/v2-assets/casa-11.mp4", posterSrc: "/v2-assets/casa-11.jpg"
      },
      {
        id: 12, code: "12", coverTheme: "CURA & INTUIÇÃO", title: "Cura, Intuição & Silêncio",
        tagline: "Incubação e recarga",
        hook: "Para sair do radar, criar grandes projetos em segredo e recarregar a mente.",
        forWho: "Quem está perto do esgotamento mental por excesso de ruído social ou precisa de silêncio para gestar um projeto importante.",
        practice: "Cria um clima de privacidade, intuição afiada e descanso reparador para estruturar próximos passos longe do barulho externo.",
        yearEnergy: "A energia deste ano convida você a desacelerar o ruído externo, ouvir sua intuição com clareza e preparar seu próximo grande salto em paz.",
        element: "Água", env: "#4E2285", envDark: "#2C0F52", ticket: "#B890F0", stage: "#BFA2EB", cardBg: "#DDCBF7", glow: "rgba(78,34,133,0.92)",
        videoSrc: "/v2-assets/casa-12.mp4", posterSrc: "/v2-assets/casa-12.jpg"
      }
    ];

    const HOUSE_STEPS = {
      "1": [
        {
          "head": "A energia do Protagonismo, da Coragem e do Recomeço",
          "label": "01 · Casa 01 · A Energia",
          "text": "A Casa 01 convida você a colocar o foco em si mesmo, assumir o leme da própria história e dar o primeiro passo sem esperar aprovação."
        },
        {
          "head": "Chega de se anular",
          "label": "02 · Casa 01 · A Virada",
          "text": "Esperar pelos outros ou viver dizendo sim para tudo ficou no passado; este ciclo corta a hesitação e devolve o comando para você."
        },
        {
          "head": "Passos firmados sem medo",
          "label": "03 · Casa 01 · Na Prática",
          "text": "Movimento e renovação real: mudar o visual, lançar projetos próprios e estabelecer limites claros com o mundo."
        },
        {
          "head": "Autoconfiança & Amor-Próprio",
          "label": "04 · Casa 01 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: autocuidado em destaque, presença magnética e a certeza silenciosa de caminhar nos seus próprios passos."
        }
      ],
      "2": [
        {
          "head": "A energia do Dinheiro, da Prosperidade e da Abundância",
          "label": "01 · Casa 02 · A Energia",
          "text": "A Casa 02 convida você a consolidar bases materiais, valorizar seus talentos e construir uma relação segura com seus recursos."
        },
        {
          "head": "Estanque os ralos",
          "label": "02 · Casa 02 · A Virada",
          "text": "Trabalhar o mês inteiro e ver o saldo evaporar perde força; o foco vira estancar vazamentos e acumular valor duradouro."
        },
        {
          "head": "Cobre o seu valor real",
          "label": "03 · Casa 02 · Na Prática",
          "text": "O momento certo para precificar sem culpa, negociar aumentos e transformar competência em receita concreta."
        },
        {
          "head": "Caixa Forte & Paz Financeira",
          "label": "04 · Casa 02 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: reserva sólida, conforto merecido e tranquilidade para escolher sem aperto."
        }
      ],
      "3": [
        {
          "head": "A energia da Comunicação, das Vendas e do Movimento",
          "label": "01 · Casa 03 · A Energia",
          "text": "A Casa 03 convida você a colocar suas ideias em circulação e fazer sua rotina girar com leveza e agilidade."
        },
        {
          "head": "Destrave sua fala",
          "label": "02 · Casa 03 · A Virada",
          "text": "Chega de guardar ótimas ideias na gaveta ou travar na hora de gravar, apresentar ou fechar negócios."
        },
        {
          "head": "Negociações que giram rápido",
          "label": "03 · Casa 03 · Na Prática",
          "text": "Reuniões comerciais ágeis, conteúdo que conecta, cursos práticos e contatos locais virando oportunidades reais."
        },
        {
          "head": "Sua Voz em Evidência",
          "label": "04 · Casa 03 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: nome circulando no mercado, clareza ao persuadir e portas se abrindo pela sua palavra."
        }
      ],
      "4": [
        {
          "head": "A energia do Lar, da Família e da Paz Interior",
          "label": "01 · Casa 04 · A Energia",
          "text": "A Casa 04 convida você a fortalecer suas raízes emocionais e construir um refúgio verdadeiro onde sua vida respira melhor."
        },
        {
          "head": "Construa seu porto seguro",
          "label": "02 · Casa 04 · A Virada",
          "text": "Viver sem chão no meio da correria externa desgasta; chega a hora de proteger sua privacidade e acalmar a casa."
        },
        {
          "head": "Imóvel, Reforma & Acolhimento",
          "label": "03 · Casa 04 · Na Prática",
          "text": "Ciclo propício para comprar, alugar ou renovar seu espaço, montar um home office sereno e resolver pendências familiares."
        },
        {
          "head": "Chão Firme pra Respirar",
          "label": "04 · Casa 04 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: estabilidade emocional real, laços íntimos curados e paz ao fechar a porta de casa."
        }
      ],
      "5": [
        {
          "head": "A energia do Romance, do Prazer e do Brilho Pessoal",
          "label": "01 · Casa 05 · A Energia",
          "text": "A Casa 05 convida você a reacender o entusiasmo de viver, criar com liberdade e colocar sua luz própria em evidência."
        },
        {
          "head": "Saia da rotina cinza",
          "label": "02 · Casa 05 · A Virada",
          "text": "Meses no piloto automático só cumprindo obrigações ficam para trás; o ciclo devolve leveza e alegria sem culpa."
        },
        {
          "head": "Projetos com Sua Assinatura",
          "label": "03 · Casa 05 · Na Prática",
          "text": "Bloqueios criativos destravam, romances envolventes florescem e suas criações autorais ganham palco e admiração."
        },
        {
          "head": "Magnetismo & Paixão Viva",
          "label": "04 · Casa 05 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: autoestima elevada, carisma natural e prazer genuíno de ocupar a própria vida."
        }
      ],
      "6": [
        {
          "head": "A energia da Saúde, da Vitalidade e da Organização",
          "label": "01 · Casa 06 · A Energia",
          "text": "A Casa 06 convida você a transformar disciplina em leveza e fazer sua rotina diária trabalhar finalmente a seu favor."
        },
        {
          "head": "Fim do efeito sanfona",
          "label": "02 · Casa 06 · A Virada",
          "text": "Chega de furar a dieta toda quarta-feira, pagar academia sem ir ou viver apagando incêndios na agenda."
        },
        {
          "head": "Treino & Agenda no Ritmo",
          "label": "03 · Casa 06 · Na Prática",
          "text": "Constância em treinos, alimentação limpa, processos organizados e trabalho recorrente rodando como relógio suíço."
        },
        {
          "head": "Corpo Forte & Mente Leve",
          "label": "04 · Casa 06 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: energia física sobrando, estética em dia e alta performance sem esgotamento."
        }
      ],
      "7": [
        {
          "head": "A energia do Casamento, do Compromisso e das Parcerias",
          "label": "01 · Casa 07 · A Energia",
          "text": "A Casa 07 convida você a sair da caminhada solitária e construir trocas equilibradas de longo prazo no amor e nos negócios."
        },
        {
          "head": "Chega de carregar tudo solo",
          "label": "02 · Casa 07 · A Virada",
          "text": "Encontros rasos e sociedades desequilibradas perdem espaço para relações onde dois somam de verdade."
        },
        {
          "head": "Acordos Maduros de Longo Prazo",
          "label": "03 · Casa 07 · Na Prática",
          "text": "Namoros que evoluem para compromisso firme, contratos sólidos e parcerias complementares com visão compartilhada."
        },
        {
          "head": "Aliança Real a Dois",
          "label": "04 · Casa 07 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: reciprocidade, segurança afetiva e apoio mútuo para crescer muito mais longe juntos."
        }
      ],
      "8": [
        {
          "head": "A energia da Transformação, do Poder e da Intimidade",
          "label": "01 · Casa 08 · A Energia",
          "text": "A Casa 08 convida você a desapegar do que já venceu e acessar sua força mais profunda de reinvenção."
        },
        {
          "head": "Vire a página de vez",
          "label": "02 · Casa 08 · A Virada",
          "text": "Ciclos desgastados, pendências financeiras travadas e amarras emocionais são limpos pela raiz."
        },
        {
          "head": "Capitais & Investimentos Maiores",
          "label": "03 · Casa 08 · Na Prática",
          "text": "Reorganização estratégica de patrimônio compartilhado, aportes de maior porte e decisões corajosas de virada."
        },
        {
          "head": "Renascimento com Poder Real",
          "label": "04 · Casa 08 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: presença magnética, autonomia emocional e uma versão muito mais forte de si mesmo."
        }
      ],
      "9": [
        {
          "head": "A energia das Viagens, da Liberdade e da Expansão",
          "label": "01 · Casa 09 · A Energia",
          "text": "A Casa 09 convida você a enxergar a vida sob uma perspectiva muito maior e abrir caminhos além das fronteiras habituais."
        },
        {
          "head": "Rompa a bolha atual",
          "label": "02 · Casa 09 · A Virada",
          "text": "Quando a cidade, o círculo ou a rotina de sempre ficam pequenos demais para sua ambição, este ciclo destrava o salto."
        },
        {
          "head": "Novos Países, Estudos & Rotas",
          "label": "03 · Casa 09 · Na Prática",
          "text": "Viagens marcantes, especializações, mentorias de alto nível e projetos que ganham alcance internacional."
        },
        {
          "head": "Horizonte Sem Fronteiras",
          "label": "04 · Casa 09 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: mente expandida, repertório de mundo e liberdade real para escolher seu próximo destino."
        }
      ],
      "10": [
        {
          "head": "A energia da Fama, do Sucesso e do Reconhecimento",
          "label": "01 · Casa 10 · A Energia",
          "text": "A Casa 10 convida você a ocupar o topo da sua jornada e ser reconhecido publicamente pelo valor real do que entrega."
        },
        {
          "head": "Saia dos bastidores",
          "label": "02 · Casa 10 · A Virada",
          "text": "Fazer um trabalho impecável na sombra enquanto outros levam o crédito acaba aqui; é o ano de assumir o holofote."
        },
        {
          "head": "Liderança & Contratos Maiores",
          "label": "03 · Casa 10 · Na Prática",
          "text": "Posicionamento público de elite, visibilidade qualificada, convites de destaque e fechamentos de alto valor."
        },
        {
          "head": "Autoridade no Topo do Nicho",
          "label": "04 · Casa 10 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: reputação consolidada, respeito do mercado e legado profissional admirado."
        }
      ],
      "11": [
        {
          "head": "A energia dos Amigos, das Conexões e do Futuro",
          "label": "01 · Casa 11 · A Energia",
          "text": "A Casa 11 convida você a sair do esforço solitário e multiplicar resultados através das pessoas e alianças certas."
        },
        {
          "head": "Pare de remar sozinho",
          "label": "02 · Casa 11 · A Virada",
          "text": "Carregar tudo nas costas tem teto; este ciclo dissolve o isolamento e aproxima quem realmente impulsiona seus passos."
        },
        {
          "head": "Indicações & Aliados de Peso",
          "label": "03 · Casa 11 · Na Prática",
          "text": "Convites estratégicos, coproduções, comunidades influentes e oportunidades que chegam pela chancela da sua rede."
        },
        {
          "head": "Crescimento em Ecossistema",
          "label": "04 · Casa 11 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: pertencimento verdadeiro, escala mais leve e projetos de futuro construídos em boa companhia."
        }
      ],
      "12": [
        {
          "head": "A energia da Paz, da Intuição e da Recarga Espiritual",
          "label": "01 · Casa 12 · A Energia",
          "text": "A Casa 12 convida você a desacelerar o barulho externo e preparar seu próximo grande salto com clareza nos bastidores."
        },
        {
          "head": "Desligue o ruído externo",
          "label": "02 · Casa 12 · A Virada",
          "text": "Excesso de exposição e cansaço mental saem de cena para proteger sua energia e devolver o descanso reparador."
        },
        {
          "head": "Geste Projetos em Segredo",
          "label": "03 · Casa 12 · Na Prática",
          "text": "Foco profundo longe de olhares curiosos, estruturação estratégica e decisões guiadas por percepção afiada."
        },
        {
          "head": "Clareza Silenciosa & Cura",
          "label": "04 · Casa 12 · O Grande Prêmio",
          "text": "O grande ganho deste ciclo: mente renovada, serenidade inabalável e terreno pronto para renascer no ciclo seguinte."
        }
      ]
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const N = HOUSES.length;
    const modN = (i) => ((i % N) + N) % N;
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOutSine = (t) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;

    // Cubic bezier solver (.25, .75, .2, 1) — Stride glide
    function cubicBezier(p1x, p1y, p2x, p2y) {
      const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
      const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
      const sx = (t) => ((ax * t + bx) * t + cx) * t;
      const sy = (t) => ((ay * t + by) * t + cy) * t;
      const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
      return (x) => {
        let t = x;
        for (let i = 0; i < 5; i++) {
          const err = sx(t) - x;
          const d = dx(t);
          if (Math.abs(err) < 1e-4 || Math.abs(d) < 1e-5) break;
          t -= err / d;
        }
        return sy(clamp(t));
      };
    }
    const glideEase = cubicBezier(0.25, 0.75, 0.2, 1);
    const introEase = cubicBezier(0.16, 1, 0.3, 1);

    // =========================================================================
    // PROCEDURAL HIGH-RES CANVAS TEXTURES (Front Sleeve, Back Raio-X, Ticket)
    // =========================================================================
    function drawCottonGrain(ctx, w, h, alpha = 0.045) {
      ctx.save();
      for (let i = 0; i < 4200; i++) {
        const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const y = (Math.sin(i * 78.233) * 24634.6345) % 1;
        const px = Math.abs(x) * w;
        const py = Math.abs(y) * h;
        ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
        ctx.fillRect(px, py, 2, 2);
      }
      ctx.restore();
    }

    function drawFourPointStar(ctx, cx, cy, r, fill) {
      ctx.save();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.quadraticCurveTo(cx, cy, cx + r, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + r);
      ctx.quadraticCurveTo(cx, cy, cx - r, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function wrapText(ctx, text, cx, y, maxW, lineH) {
      const words = text.split(" ");
      let line = "";
      let cy = y;
      for (let i = 0; i < words.length; i++) {
        const test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, cx, cy);
          line = words[i];
          cy += lineH;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, cx, cy);
      return cy;
    }

    function buildFrontCanvas(h) {
      const W = 680, H = 1040;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");

      // Envelope shape with REAL transparent half-moon thumb notch at top!
      ctx.save();
      ctx.beginPath();
      const nr = 76;
      ctx.moveTo(14, 0);
      ctx.lineTo(W / 2 - nr, 0);
      ctx.arc(W / 2, 0, nr, Math.PI, 0, true);
      ctx.lineTo(W - 14, 0);
      ctx.quadraticCurveTo(W, 0, W, 14);
      ctx.lineTo(W, H - 18);
      ctx.quadraticCurveTo(W, H, W - 18, H);
      ctx.lineTo(18, H);
      ctx.quadraticCurveTo(0, H, 0, H - 18);
      ctx.lineTo(0, 14);
      ctx.quadraticCurveTo(0, 0, 14, 0);
      ctx.closePath();
      ctx.clip();

      const grad = ctx.createLinearGradient(0, 0, W * 0.85, H);
      grad.addColorStop(0, h.env);
      grad.addColorStop(1, h.envDark);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      drawCottonGrain(ctx, W, H, 0.05);

      // Subtle paper lighting sheen & side creases
      const sheen = ctx.createLinearGradient(0, 0, W, H * 0.7);
      sheen.addColorStop(0, "rgba(255,255,255,0.055)");
      sheen.addColorStop(0.45, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(0,0,0,0.22)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, W, H);

      // Side bevel crease
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(W - 14, 0, 14, H);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 0, 10, H);

      // Brand star + ellipse
      drawFourPointStar(ctx, W / 2, 138, 22, "#F2E2B6");
      ctx.save();
      ctx.translate(W / 2, 206);
      ctx.rotate(-0.18);
      ctx.strokeStyle = "rgba(242,226,182,0.52)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 178, 42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // PROTOCOLO SOLAR
      ctx.textAlign = "center";
      ctx.fillStyle = "#F5E7C3";
      ctx.font = "500 32px 'DM Sans', sans-serif";
      ctx.fillText("P R O T O C O L O", W / 2, 204);
      ctx.font = "500 28px 'DM Sans', sans-serif";
      ctx.fillText("S O L A R", W / 2, 244);

      // CASA + Giant Champagne Serif Number
      ctx.fillStyle = "rgba(245,231,195,0.88)";
      ctx.font = "400 44px 'Marcellus', serif";
      ctx.fillText("C A S A", W / 2, 370);

      const numGrad = ctx.createLinearGradient(0, 390, 0, 680);
      numGrad.addColorStop(0, "#FFF8E1");
      numGrad.addColorStop(0.55, "#EAD298");
      numGrad.addColorStop(1, "#C39F4D");
      ctx.fillStyle = numGrad;
      ctx.font = "400 300px 'Marcellus', serif";
      ctx.fillText(String(h.id), W / 2, 650);

      // Global orbital constellation arcs (no airplane, no South America)
      ctx.save();
      ctx.strokeStyle = "rgba(242,226,182,0.34)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(W * 0.72, H * 0.94, 240, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([7, 9]);
      ctx.beginPath();
      ctx.arc(W * 0.72, H * 0.94, 175, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(242,226,182,0.52)";
      ctx.beginPath();
      ctx.moveTo(48, 860);
      ctx.quadraticCurveTo(300, 680, 632, 790);
      ctx.stroke();
      ctx.setLineDash([]);
      [[165, 795, 6], [398, 742, 8], [556, 770, 5.5]].forEach(([sx, sy, sr]) => {
        ctx.fillStyle = "#F5E7C3";
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Theme at bottom
      ctx.fillStyle = "#F5E7C3";
      ctx.font = "400 30px 'Marcellus', serif";
      ctx.fillText(`—  ${h.coverTheme}  —`, W / 2, 956);

      ctx.restore();
      return c;
    }

    function buildBackCanvas(h) {
      const W = 680, H = 1040;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, h.env);
      grad.addColorStop(1, h.envDark);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      drawCottonGrain(ctx, W, H, 0.05);

      // Authentic paper envelope top folds
      ctx.strokeStyle = "rgba(0,0,0,0.22)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(54, 118);
      ctx.lineTo(W - 54, 118);
      ctx.lineTo(W, 0);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, W, 118);

      drawFourPointStar(ctx, W / 2, 206, 26, "#F2E2B6");

      ctx.textAlign = "center";
      ctx.fillStyle = "#F5E7C3";
      ctx.font = "400 38px 'Marcellus', serif";
      ctx.fillText("R A I O - X   D A", W / 2, 296);
      ctx.fillText(`C A S A   ${h.id}`, W / 2, 348);

      // Divider 1
      ctx.strokeStyle = "rgba(242,226,182,0.45)";
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(210, 392); ctx.lineTo(470, 392); ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "italic 400 40px Georgia, serif";
      ctx.fillText(h.tagline, W / 2, 466);

      // Divider 2
      ctx.beginPath(); ctx.moveTo(210, 514); ctx.lineTo(470, 514); ctx.stroke();

      ctx.fillStyle = "#E8D59B";
      ctx.font = "italic 400 38px Georgia, serif";
      ctx.fillText("Quando escolher", W / 2, 594);

      ctx.fillStyle = "#F2F4F7";
      ctx.font = "400 34px 'DM Sans', sans-serif";
      wrapText(ctx, h.hook, W / 2, 662, 510, 46);

      // Bottom orbit emblem
      ctx.save();
      ctx.translate(W / 2, 872);
      ctx.rotate(-0.2);
      ctx.strokeStyle = "rgba(242,226,182,0.52)";
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 128, 34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      drawFourPointStar(ctx, W / 2, 872, 16, "#F2E2B6");

      ctx.fillStyle = "rgba(245,231,195,0.68)";
      ctx.font = "600 18px 'DM Sans', sans-serif";
      ctx.fillText("SWISS EPHEMERIS · DESTINO INDIVIDUAL", W / 2, 976);

      return c;
    }

    function buildTicketCanvas(h) {
      const W = 580, H = 920;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");

      // Rounded boarding card
      ctx.fillStyle = h.ticket;
      const r = 34;
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(W - r, 0); ctx.quadraticCurveTo(W, 0, W, r);
      ctx.lineTo(W, H - r); ctx.quadraticCurveTo(W, H, W - r, H);
      ctx.lineTo(r, H); ctx.quadraticCurveTo(0, H, 0, H - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, h.ticket);
      grad.addColorStop(0.24, "#F7F3EC");
      grad.addColorStop(1, "#ECE4D6");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Top peeking band (visible inside the envelope notch!)
      ctx.fillStyle = h.ticket;
      ctx.fillRect(0, 0, W, 210);
      ctx.strokeStyle = "rgba(255,255,255,0.52)";
      ctx.lineWidth = 2.4;
      ctx.setLineDash([7, 7]);
      ctx.beginPath(); ctx.arc(170, 175, 130, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(26, 124); ctx.quadraticCurveTo(220, 38, 430, 102); ctx.stroke();
      ctx.setLineDash([]);
      drawFourPointStar(ctx, 412, 76, 14, "#FFFFFF");

      // Vertical mini barcode in peeking top-right (just like reference!)
      ctx.strokeStyle = "rgba(20,25,35,0.22)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(474, 18); ctx.lineTo(474, 188); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(20,25,35,0.56)";
      [26, 36, 52, 62, 78, 92, 104, 120, 134, 146, 162, 172].forEach((by, idx) => {
        ctx.fillRect(496, by, 44, idx % 3 === 0 ? 9 : 4.5);
      });

      // Lower body (revealed when sliding out in Section 2!)
      ctx.fillStyle = "#141923";
      ctx.textAlign = "left";
      ctx.font = "700 18px 'DM Sans', sans-serif";
      ctx.fillText(`SOLAR PASS · CASA ${h.code} · ${h.element.toUpperCase()}`, 44, 276);

      ctx.font = "400 46px 'Marcellus', serif";
      wrapTextLeft(ctx, h.title, 44, 344, 492, 52);

      // Decorative orbital wheel in middle for houses without video yet
      ctx.save();
      ctx.translate(W / 2, 575);
      ctx.strokeStyle = "rgba(141,105,20,0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 118, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i * 30 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 48, Math.sin(a) * 48);
        ctx.lineTo(Math.cos(a) * 118, Math.sin(a) * 118);
        ctx.stroke();
      }
      const a1 = ((h.id - 1) * 30 - 90) * Math.PI / 180;
      const a2 = (h.id * 30 - 90) * Math.PI / 180;
      ctx.fillStyle = h.env;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a1) * 48, Math.sin(a1) * 48);
      ctx.lineTo(Math.cos(a1) * 118, Math.sin(a1) * 118);
      ctx.arc(0, 0, 118, a1, a2);
      ctx.lineTo(Math.cos(a2) * 48, Math.sin(a2) * 48);
      ctx.arc(0, 0, 48, a2, a1, true);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#C9A227";
      ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.textAlign = "center";
      ctx.fillStyle = "#485060";
      ctx.font = "600 20px 'DM Sans', sans-serif";
      ctx.fillText("DESTINO CALCULADO PELO SEU MAPA", W / 2, 772);
      ctx.fillStyle = "#8D6914";
      ctx.font = "700 18px 'DM Sans', sans-serif";
      ctx.fillText("NENHUMA CIDADE É FIXA PARA ESTA CASA", W / 2, 810);

      return c;
    }

    function wrapTextLeft(ctx, text, x, y, maxW, lineH) {
      const words = text.split(" ");
      let line = "", cy = y;
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, x, cy);
          line = w; cy += lineH;
        } else line = test;
      }
      if (line) ctx.fillText(line, x, cy);
    }

    // Flat composite thumbnail for Section 3 & 4 cards
    function buildCompositePreviewUrl(h, frontCanvas, ticketCanvas) {
      const c = document.createElement("canvas");
      c.width = 400; c.height = 670;
      const ctx = c.getContext("2d");
      // Peeking ticket top
      ctx.drawImage(ticketCanvas, 0, 0, 580, 260, 32, 0, 336, 150);
      // Envelope front overlapping
      ctx.drawImage(frontCanvas, 0, 0, 680, 1040, 14, 72, 372, 570);
      return c.toDataURL("image/png");
    }

    // =========================================================================
    // STATE & UI REFERENCES
    // =========================================================================
    let target = 0; // Starts at Casa 01 (Azul-Noite Real)
    let pos = reducedMotion ? 0 : -2.6;
    let slideStartPos = pos, slideTargetPos = 0, slideStartTime = 0, slideDur = reducedMotion ? 0 : 1450, isIntroSlide = true;
    let autoplayOn = !reducedMotion;
    let lastInteraction = performance.now();
    let dragging = false, dragStartX = 0, dragStartPos = 0, dragVel = 0, dragLastX = 0, dragLastT = 0, dragMoved = false;

    // Color reveal state
    let revealActive = false, revealStart = 0, revealDur = 420, revealColor = HOUSES[0].stage;

    // Section 2 step + flip + ticket extraction state
    let currentStep = 0;
    let flipFrom = 0, flipTo = 0, flipStart = 0, flipDur = 720;
    let extractVal = 0; // 0 = tucked in envelope, 1 = slid out revealing ticket/video

    // Section 4 Plan state ("single" | "combo3" | "full12")
    let pkgMode = "combo3";
    let selectedHouseId = null;
    let cardHover = { id: null, tx: 0, ty: 0 };

    const navEl = byId("nav");
    const navHi = byId("navHi");
    const navLinks = [...rootEl.querySelectorAll(".nav-pill a")];
    const casasSec = byId("casas");
    const insideSec = byId("inside");
    const colecaoSec = byId("colecao");
    const cicloSec = byId("ciclo");
    const revealLayer = byId("revealLayer");
    const titleEl = byId("title");
    const hookEl = byId("heroHook");
    const countEl = byId("count");
    const houseDotsEl = byId("houseDots");
    const heroTrailerLbl = byId("heroTrailerLbl");
    const inFront = byId("inFront");
    const inBackFrame = byId("inBackFrame");
    const inFrontFrame = byId("inFrontFrame");
    const inDark = byId("inDark");
    const inBar = byId("inBar");
    const inNum = byId("inNum");
    const inHead = byId("inHead");
    const inCap = byId("inCap");
    const inPrimaryBtn = byId("inPrimaryBtn");
    const stormLayer = byId("stormLayer");
    const cardsGrid = byId("cardsGrid");
    const morphDeck = byId("morphDeck");
    const morphDeckBadge = byId("morphDeckBadge");
    const tierThumb = byId("tierThumb");
    const tierSegBtns = [...rootEl.querySelectorAll(".tier-seg-btn")];
    const tierCreditPill = byId("tierCreditPill");
    const tierSavePill = byId("tierSavePill");
    const tierTitle = byId("tierTitle");
    const odoTens = byId("odoTens");
    const odoOnes = byId("odoOnes");
    const tierBullets = byId("tierBullets");
    const tierBuyBtn = byId("tierBuyBtn");
    const morphImgs = [];
    const pickedHousePill = byId("pickedHousePill");
    const pickedHouseDot = byId("pickedHouseDot");
    const pickedHouseText = byId("pickedHouseText");

    // Populate floating stars in Hero & Storm stars in Section 2
    const starLayer = byId("starLayer");
    if (!starLayer) return;
    starLayer.innerHTML = "";
    stormLayer.innerHTML = "";
    houseDotsEl.innerHTML = "";
    cardsGrid.innerHTML = "";
    morphDeck.querySelectorAll(".morph-card").forEach((n) => n.remove());
    const HERO_STARS = [
      { x: 10, y: 18, s: 26, anim: "driftA", dur: 7.4 },
      { x: 86, y: 16, s: 22, anim: "driftB", dur: 8.6 },
      { x: 16, y: 66, s: 18, anim: "driftB", dur: 6.8 },
      { x: 80, y: 62, s: 28, anim: "driftA", dur: 9.1 },
      { x: 26, y: 26, s: 12, anim: "driftA", dur: 10.2 },
      { x: 72, y: 28, s: 14, anim: "driftB", dur: 7.9 },
      { x: 6, y: 42, s: 14, anim: "driftA", dur: 8.2 },
      { x: 92, y: 44, s: 16, anim: "driftB", dur: 7.1 },
    ];
    HERO_STARS.forEach((st, idx) => {
      const d = document.createElement("div");
      d.className = "star-bit";
      d.style.left = st.x + "%";
      d.style.top = st.y + "%";
      d.style.animation = `${st.anim} ${st.dur}s ease-in-out ${idx * 0.25}s infinite`;
      d.innerHTML = `<svg width="${st.s}" height="${st.s}" viewBox="0 0 24 24"><path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="#C9A227"/></svg>`;
      starLayer.appendChild(d);
    });

    const stormStars = [];
    for (let i = 0; i < 24; i++) {
      const el = document.createElement("div");
      el.className = "storm-star";
      el.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="${i % 3 === 0 ? "#FFF3D1" : "#E8D59B"}"/></svg>`;
      stormLayer.appendChild(el);
      const seed = Math.sin(i * 91.7) * 43758.5;
      const frac = seed - Math.floor(seed);
      stormStars.push({
        el,
        angle: (i / 24) * Math.PI * 2 + frac * 0.35,
        phase: (i / 24) * 0.85,
        spin: (i % 2 === 0 ? 1 : -1) * (180 + frac * 180),
        size: 0.65 + frac * 0.9
      });
    }

    // Build textures & preview data URLs after fonts load
    await Promise.all([
      document.fonts.load("400 32px Marcellus"),
      document.fonts.load("400 20px 'DM Sans'"),
      document.fonts.load("700 20px 'DM Sans'"),
    ]).catch(() => {});

    if (disposed) return;
    const frontCanvases = [];
    const backCanvases = [];
    const ticketCanvases = [];
    const previewUrls = [];

    for (const h of HOUSES) {
      const fc = buildFrontCanvas(h);
      const bc = buildBackCanvas(h);
      const tc = buildTicketCanvas(h);
      frontCanvases.push(fc);
      backCanvases.push(bc);
      ticketCanvases.push(tc);
      previewUrls.push(buildCompositePreviewUrl(h, fc, tc));
    }

    // Build Hero quick-jump dots, Section 3 Cards & Section 4 Builder Thumbs
    HOUSES.forEach((h, idx) => {
      const dot = document.createElement("button");
      dot.className = "h-dot" + (idx === 0 ? " active" : "");
      dot.type = "button";
      dot.textContent = h.code;
      dot.title = `Casa ${h.code} · ${h.title}`;
      dot.addEventListener("click", () => {
        const curMod = modN(target);
        let diff = idx - curMod;
        if (diff > N / 2) diff -= N;
        if (diff < -N / 2) diff += N;
        if (diff !== 0) goTo(target + diff);
      });
      houseDotsEl.appendChild(dot);

      // Section 3 Card (clean sculptural envelope + 1 hook + direct link to dedicated House page)
      const card = document.createElement("article");
      card.className = "h-card" + (idx === 0 ? " live" : "");
      card.dataset.houseIdx = String(idx);
      card.style.background = `linear-gradient(165deg, ${h.cardBg} 0%, ${h.stage} 100%)`;
      card.innerHTML = `
        <div class="h-card-art-slot">
          <img class="h-card-art" src="${previewUrls[idx]}" alt="Envelope Casa ${h.code} ${h.title}" />
        </div>
        <div class="h-card-mob-lbl">${h.code} · ${h.coverTheme.split(" & ")[0]}</div>
        <div>
          <p class="h-card-hook">${h.hook}</p>
          <div class="h-card-actions">
            <a class="trailer-link" href="/v2/casas/${h.id}" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">Explorar Casa →</a>
          </div>
        </div>
      `;
      card.addEventListener("mousemove", (e) => {
        if (isTouch) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
        if (idx === modN(target)) cardHover = { id: idx, tx: x, ty: y };
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        if (cardHover.id === idx) cardHover = { id: null, tx: 0, ty: 0 };
      });
      card.addEventListener("click", (ev: Event) => {
        ev.preventDefault();
        callbacks.onOpenHouse(h.id);
      });
      cardsGrid.appendChild(card);

      // Populate live 12-passport morphing deck in Section 4
      const mImg = document.createElement("img");
      mImg.className = "morph-card";
      mImg.src = previewUrls[idx];
      mImg.alt = `Passaporte Casa ${h.code}`;
      morphDeck.appendChild(mImg);
      morphImgs.push(mImg);
    });

    // =========================================================================
    // THREE.JS REAL-TIME 3D ENVELOPE + SLIDING TICKET ENGINE
    // =========================================================================
    let glActive = false;
    let renderer, scene, camera, raycaster;
    let frontTexs = [], backTexs = [], ticketTexs = [], videoTexs = {};
    let shadowTex;
    let pool = [];
    let traveller = null;

    function makeShadowTexture() {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 256;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(128, 128, 16, 128, 128, 122);
      g.addColorStop(0, "rgba(12, 16, 28, 0.44)");
      g.addColorStop(0.55, "rgba(12, 16, 28, 0.16)");
      g.addColorStop(1, "rgba(12, 16, 28, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    function createEnvelopeUnit() {
      const root = new THREE.Group();
      root.rotation.order = "ZYX";

      // Dimensions in world units (width = 1, height ≈ 1.62)
      const W = 1.0, H = 1.53, D = 0.068;

      const frontMat = new THREE.MeshStandardMaterial({
        transparent: true, alphaTest: 0.45, roughness: 0.88, metalness: 0.04, envMapIntensity: 0.12
      });
      const backMat = new THREE.MeshStandardMaterial({
        transparent: true, roughness: 0.88, metalness: 0.04, envMapIntensity: 0.12
      });
      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x142b54, transparent: true, roughness: 0.90, metalness: 0.04, envMapIntensity: 0.10
      });
      const ticketMat = new THREE.MeshStandardMaterial({
        transparent: true, roughness: 0.74, metalness: 0.02, side: THREE.DoubleSide, envMapIntensity: 0.12
      });

      const sleeve = new THREE.Group();
      sleeve.position.y = -0.09;

      const frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), frontMat);
      frontMesh.position.z = D / 2;
      const backMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), backMat);
      backMesh.position.z = -D / 2;
      backMesh.rotation.y = Math.PI;

      const leftEdge = new THREE.Mesh(new THREE.PlaneGeometry(D, H), edgeMat);
      leftEdge.position.x = -W / 2;
      leftEdge.rotation.y = -Math.PI / 2;

      const rightEdge = new THREE.Mesh(new THREE.PlaneGeometry(D, H), edgeMat);
      rightEdge.position.x = W / 2;
      rightEdge.rotation.y = Math.PI / 2;

      const bottomEdge = new THREE.Mesh(new THREE.PlaneGeometry(W, D), edgeMat);
      bottomEdge.position.y = -H / 2;
      bottomEdge.rotation.x = Math.PI / 2;

      sleeve.add(frontMesh, backMesh, leftEdge, rightEdge, bottomEdge);

      // Inner Sliding Ticket / Video Card
      const ticketMesh = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.87, H * 0.85), ticketMat);
      ticketMesh.position.set(0, 0.24, 0.002);
      sleeve.add(ticketMesh);

      // Soft contact shadow plane
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex, transparent: true, depthWrite: false, opacity: 0.45
      });
      const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 1.88), shadowMat);
      shadowMesh.renderOrder = -1;

      root.add(sleeve);
      scene.add(root);
      scene.add(shadowMesh);

      return {
        root, sleeve, frontMesh, backMesh, ticketMesh, shadowMesh,
        frontMat, backMat, edgeMat, ticketMat, shadowMat,
        houseIdx: -1, slotIndex: 0, usingVideo: false
      };
    }

    const videoEls = {};
    function ensureHouseVideo(hid) {
      if (videoTexs[hid]) return videoEls[hid];
      const house = HOUSES.find(item => item.id === hid);
      if (!house || !house.videoSrc) return null;
      let vid = byId(`vid${hid}`);
      if (!vid) {
        vid = document.createElement("video");
        vid.id = `vid${hid}`;
        vid.src = house.videoSrc;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.preload = "auto";
        vid.crossOrigin = "anonymous";
        vid.style.display = "none";
        rootEl.appendChild(vid);
      activeVideos.push(vid);
      }
      const vt = new THREE.VideoTexture(vid);
      vt.colorSpace = THREE.SRGBColorSpace;
      vt.minFilter = THREE.LinearFilter;
      vt.magFilter = THREE.LinearFilter;
      vt.wrapS = THREE.ClampToEdgeWrapping;
      vt.wrapT = THREE.ClampToEdgeWrapping;
      vt.repeat.set(0.38, 1);
      vt.offset.set(0.31, 0);
      videoTexs[hid] = vt;
      videoEls[hid] = vid;
      return vid;
    }

    function applyHouseToUnit(unit, idx, useVideo = false) {
      const h = HOUSES[idx];
      if (unit.houseIdx !== idx) {
        unit.frontMat.map = frontTexs[idx];
        unit.frontMat.needsUpdate = true;
        unit.backMat.map = backTexs[idx];
        unit.backMat.needsUpdate = true;
        unit.edgeMat.color.set(h.envDark);
        unit.houseIdx = idx;
      }
      if (useVideo && h.videoSrc && !videoTexs[h.id]) ensureHouseVideo(h.id);
      const wantVideo = useVideo && !!videoTexs[h.id];
      if (unit.usingVideo !== wantVideo || unit.ticketMat.map == null || unit.houseIdx === idx) {
        const nextMap = wantVideo ? videoTexs[h.id] : ticketTexs[idx];
        if (unit.ticketMat.map !== nextMap) {
          unit.ticketMat.map = nextMap;
          unit.ticketMat.needsUpdate = true;
        }
        unit.usingVideo = wantVideo;
      }
    }

    function initThree() {
      try {
        const canvas = byId("gl");
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        rendererRef = renderer;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.94;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(35, 1, 10, 12000);
        raycaster = new THREE.Raycaster();

        const pmrem = new THREE.PMREMGenerator(renderer);
        envRTRef = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRTRef.texture;
        pmrem.dispose();

        scene.add(new THREE.AmbientLight(0xffffff, 0.42));
        const keyLight = new THREE.DirectionalLight(0xfff5e4, 0.68);
        keyLight.position.set(-0.55, 0.85, 1.6);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0xe8d59b, 0.24);
        rimLight.position.set(1.0, -0.4, -0.8);
        scene.add(rimLight);

        shadowTex = makeShadowTexture();

        for (let i = 0; i < N; i++) {
          const ft = new THREE.CanvasTexture(frontCanvases[i]);
          ft.colorSpace = THREE.SRGBColorSpace; ft.anisotropy = 8;
          frontTexs.push(ft);

          const bt = new THREE.CanvasTexture(backCanvases[i]);
          bt.colorSpace = THREE.SRGBColorSpace; bt.anisotropy = 8;
          backTexs.push(bt);

          const tt = new THREE.CanvasTexture(ticketCanvases[i]);
          tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8;
          ticketTexs.push(tt);
        }

        // Lazy-load 3D video textures on demand per House (saves mobile 4G!)
        ensureHouseVideo(1);

        for (let i = 0; i < 9; i++) pool.push(createEnvelopeUnit());
        traveller = createEnvelopeUnit();

        glActive = true;
        resizeGL();
      } catch (err) {
        console.warn("WebGL fallback ativado:", err);
        rootEl.classList.add("no-gl");
        glActive = false;
      }
    }

    let vw = window.innerWidth, vh = window.innerHeight, camD = 1500;
    function resizeGL() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const isPhone = vw < 820;
      if (glActive && renderer) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhone ? 1.75 : 2));
        renderer.setSize(vw, vh, false);
        camD = clamp(1500 * Math.min(vw / 1440, vh / 900), 1000, 2200);
        camera.aspect = vw / vh;
        camera.fov = (2 * Math.atan((vh / 2) / camD) * 180) / Math.PI;
        camera.near = 10;
        camera.far = camD * 4;
        camera.position.set(0, 0, camD);
        camera.updateProjectionMatrix();
      }
      // Scale Section 2 fixed 1440x900 (or 390x780 mobile) frames
      const fw = isPhone ? 390 : 1440;
      const fh = isPhone ? 780 : 900;
      const k = Math.min(vw / fw, vh / fh);
      const tf = `translate(-50%, -50%) scale(${k})`;
      inBackFrame.style.transform = tf;
      inFrontFrame.style.transform = tf;
      updateNavHighlight();
    }

    // Place a 3D unit from screen-space state
    const UNIT_H = 1.78;
    function placeUnit(unit, st) {
      const visible = st.op > 0.01;
      unit.root.visible = visible;
      unit.shadowMesh.visible = visible && st.shadow > 0.02;
      if (!visible) return;

      const scale = st.h / UNIT_H;
      unit.root.position.set(st.x - vw / 2, vh / 2 - st.y, st.z || 0);
      unit.root.scale.set(scale * (st.sx || 1), scale * (st.sy || 1), scale);
      unit.root.rotation.set(
        ((st.rx || 0) * Math.PI) / 180,
        ((st.ry || 0) * Math.PI) / 180,
        -((st.rz || 0) * Math.PI) / 180
      );

      // Ticket sliding animation inside the envelope!
      const slide = st.slide || 0;
      unit.sleeve.position.y = lerp(-0.09, -0.42, slide);
      unit.ticketMesh.position.y = lerp(0.24, 0.82, slide);
      unit.ticketMesh.position.z = slide > 0.35 ? lerp(0.002, 0.044, (slide - 0.35) / 0.65) : 0.002;

      unit.frontMat.opacity = st.op;
      unit.backMat.opacity = st.op;
      unit.edgeMat.opacity = st.op;
      unit.ticketMat.opacity = st.op;

      const cosRy = Math.max(0.32, Math.abs(Math.cos(((st.ry || 0) * Math.PI) / 180)));
      unit.shadowMesh.position.set(
        st.x - vw / 2,
        vh / 2 - st.y - st.h * 0.06,
        (st.z || 0) - st.h * 0.28
      );
      unit.shadowMesh.scale.set(scale * cosRy, scale, 1);
      unit.shadowMesh.rotation.z = -((st.rz || 0) * Math.PI) / 180;
      unit.shadowMat.opacity = 0.45 * st.op * (st.shadow ?? 1);
    }

    // Hero arc slot computation
    const ARC_SLOTS = [
      { dx: 0, dy: 0, h: 420, rz: 0, ry: 0 },
      { dx: 256, dy: 26, h: 326, rz: 4.5, ry: 16 },
      { dx: 472, dy: 48, h: 300, rz: 8.5, ry: 26 },
      { dx: 685, dy: 82, h: 278, rz: 12.5, ry: 34 },
      { dx: 890, dy: 122, h: 258, rz: 15, ry: 40 },
    ];

    function arcState(k, slotIdx, now) {
      const isPhone = vw < 820;
      const heroRect = casasSec.getBoundingClientRect();
      const heroH = heroRect.height;
      const u = isPhone ? Math.min(vw / 500, heroH / 920) : Math.min(vw / 1440, heroH / 900);
      const spread = isPhone ? 1.04 : 1.0;

      const absK = Math.min(Math.abs(k), 4);
      const sgn = k < 0 ? -1 : 1;
      const i0 = Math.floor(absK);
      const i1 = Math.min(i0 + 1, 4);
      const f = absK - i0;
      const a = ARC_SLOTS[i0], b = ARC_SLOTS[i1];

      const dx = lerp(a.dx, b.dx, f) * sgn * u * spread;
      const dy = lerp(a.dy, b.dy, f) * u;
      const h = lerp(a.h, b.h, f) * u;
      const rz = lerp(a.rz, b.rz, f) * sgn;
      const ry = lerp(a.ry, b.ry, f) * sgn;

      const cx = vw / 2;
      const cy = heroRect.top + (isPhone ? heroH * 0.365 : heroH * 0.43);

      const floatWave = reducedMotion ? 0 : Math.sin((now / 4600) * Math.PI * 2 + 1.37 * slotIdx);
      const op = absK <= 3.1 ? 1 : clamp(1 - (absK - 3.1) / 0.7);

      return {
        x: cx + dx,
        y: cy + dy - (0.5 * floatWave + 0.5) * 8 * u,
        h,
        rz: rz + 0.4 * floatWave,
        ry,
        rx: 0,
        z: -absK * 36 * u,
        op,
        shadow: 1,
        slide: 0
      };
    }

    // =========================================================================
    // HOUSE CHANGE CHOREOGRAPHY (Circle color reveal + Letter rise + Counter)
    // =========================================================================
    function renderTitleLetters(text, dir = 1) {
      titleEl.innerHTML = "";
      let idx = 0;
      text.split(" ").forEach((word) => {
        const wSpan = document.createElement("span");
        wSpan.className = "title-word";
        [...word].forEach((ch) => {
          const cSpan = document.createElement("span");
          cSpan.className = "title-char";
          cSpan.textContent = ch;
          if (!reducedMotion) {
            cSpan.style.opacity = "0";
            cSpan.style.transform = `translateY(${dir > 0 ? "105%" : "-105%"})`;
            const delay = 80 + idx * 16;
            cSpan.animate(
              [
                { opacity: 0, transform: `translateY(${dir > 0 ? "105%" : "-105%"})` },
                { opacity: 1, transform: "translateY(0)" }
              ],
              { duration: 540, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
            );
          }
          wSpan.appendChild(cSpan);
          idx++;
        });
        titleEl.appendChild(wSpan);
      });
    }

    function applyActiveHouseUI(dir = 1, animate = true) {
      const idx = modN(target);
      const h = HOUSES[idx];

      // Update color reveal
      if (animate && !reducedMotion) {
        revealColor = h.stage;
        revealLayer.style.setProperty("--rv", h.stage);
        revealStart = performance.now();
        revealActive = true;
      } else {
        rootEl.style.setProperty("--stage", h.stage);
      }

      if (animate) renderTitleLetters(h.title, dir);
      else titleEl.textContent = h.title;

      hookEl.style.opacity = "0";
      setTimeout(() => {
        hookEl.textContent = h.hook;
        hookEl.style.opacity = "1";
      }, animate && !reducedMotion ? 110 : 0);

      countEl.textContent = h.code;
      rootEl.style.setProperty("--stage-ink", h.envDark);
      heroTrailerLbl.textContent = `Ver Raio-X da Casa ${h.code}`;

      byId("fallbackImg").src = previewUrls[idx];

      [...houseDotsEl.children].forEach((d, i) => d.classList.toggle("active", i === idx));
      [...cardsGrid.children].forEach((c, i) => c.classList.toggle("live", i === idx));

      updateInsideCopy(currentStep);
    }

    function goTo(nextTarget, customDur) {
      const prevIdx = modN(target);
      const dir = nextTarget >= target ? 1 : -1;
      const dist = Math.abs(nextTarget - pos);
      target = Math.round(nextTarget);
      slideStartPos = pos;
      slideTargetPos = target;
      slideStartTime = performance.now();
      isIntroSlide = false;
      slideDur = reducedMotion ? 0 : (customDur ?? (620 + Math.max(0, dist - 1) * 150));
      lastInteraction = performance.now();

      if (modN(target) !== prevIdx) {
        setTimeout(() => applyActiveHouseUI(dir, true), reducedMotion ? 0 : 75);
      }
    }

    // =========================================================================
    // SECTION 2 STEPS CONTENT
    // =========================================================================
    let insideSwapTimer = null;
    function updateInsideCopy(step, animateSwap = false) {
      const h = HOUSES[modN(target)];
      const steps = HOUSE_STEPS[h.id];
      inNum.textContent = h.code;
      const stepBtns = [...rootEl.querySelectorAll(".step-btn")];
      stepBtns.forEach((b, i) => b.classList.toggle("active", i === step));

      const idx = clamp(step, 0, 3);
      const cur = steps[idx];
      const nextLabels = [
        `02 · ${steps[1].head} →`,
        h.videoSrc ? `03 · ${steps[2].head} (+ Vídeo) →` : `03 · ${steps[2].head} →`,
        `04 · ${steps[3].head} →`,
        "Ver as 12 Casas ↓"
      ];
      inPrimaryBtn.textContent = nextLabels[idx];

      const apply = () => {
        inHead.classList.toggle("is-pillar", idx > 0);
        if (idx === 0) {
          const m = cur.head.match(/^(A energia d[aeo]s?)\s+(.+)$/i);
          if (m) {
            const core = m[2]
              .replace(/,\s+d[aeo]s?\s+/gi, ", ")
              .replace(/\s+e\s+d[aeo]s?\s+/gi, " & ");
            inHead.innerHTML = `<span class="in-head-lead">${m[1]}</span>${core}`;
          } else {
            inHead.textContent = cur.head;
          }
        } else {
          inHead.textContent = cur.head;
        }
        inCap.innerHTML = `<span class="in-cap-label">${cur.label}</span>${cur.text}`;
      };

      clearTimeout(insideSwapTimer);
      if (animateSwap && !reducedMotion) {
        inHead.classList.add("swapping");
        inCap.classList.add("swapping");
        insideSwapTimer = setTimeout(() => {
          apply();
          inHead.classList.remove("swapping");
          inCap.classList.remove("swapping");
        }, 90);
      } else {
        inHead.classList.remove("swapping");
        inCap.classList.remove("swapping");
        apply();
      }
    }

    function scrollToInsideStep(stepIdx) {
      const r = insideSec.getBoundingClientRect();
      const secTopDoc = window.scrollY + r.top;
      const maxScroll = Math.max(1, insideSec.offsetHeight - vh);
      const targets = [0.08, 0.34, 0.58, 0.74];
      window.scrollTo({ top: secTopDoc + maxScroll * targets[clamp(stepIdx, 0, 3)], behavior: "smooth" });
    }

    function setInsideStep(nextStep) {
      if (nextStep === currentStep) return;
      const angles = [0, 180, 360, 540];
      const now = performance.now();
      const curAngle = getFlipAngle(now);
      flipFrom = curAngle;
      flipTo = angles[nextStep];
      flipStart = now;
      const halfTurns = clamp(Math.abs(flipTo - flipFrom) / 180, 0.7, 2);
      flipDur = reducedMotion ? 0 : Math.round(1250 * halfTurns);
      currentStep = nextStep;
      updateInsideCopy(nextStep, true);
    }

    function getFlipAngle(now) {
      if (flipDur <= 0) return flipTo;
      const t = clamp((now - flipStart) / flipDur);
      return lerp(flipFrom, flipTo, easeInOutSine(t));
    }

    // =========================================================================
    // SECTION 4 KINETIC CREDIT-TIER PRICING STAGE (Emil Kowalski Morph + Odometer)
    // =========================================================================
    const TIER_DATA = {
      single: {
        idx: 0,
        badge: "",
        creditPill: "1 CRÉDITO · PRIMEIRO PASSO",
        savePill: "Acesso imediato",
        title: "1 Crédito Solar",
        cta: "Liberar agora →",
        bullets: [
          "Libera <strong>1 Casa ou 1 Cidade completa</strong> (todas as 8 áreas da vida)",
          "Inclui seu <strong>Guia personalizado</strong> (12 meses + 24h)"
        ]
      },
      combo3: {
        idx: 1,
        badge: "",
        creditPill: "3 CRÉDITOS · PARA COMPARAR 3 OPÇÕES",
        savePill: "Economize R$ 9,80",
        title: "3 Créditos Solares",
        cta: "Liberar agora →",
        bullets: [
          "Compare <strong>3 Casas ou 3 Cidades completas</strong> lado a lado",
          "Destinos perto de casa ou fora + <strong>Guia completo</strong>"
        ]
      },
      full12: {
        idx: 2,
        badge: "",
        creditPill: "12 CRÉDITOS · MAPA COMPLETO",
        savePill: "Todas as 12 Casas",
        title: "Mapa Completo · 12 Casas",
        cta: "Liberar mapa completo →",
        bullets: [
          "Todas as <strong>12 Casas</strong> do seu próximo ano liberadas",
          "Explore qualquer cidade do Brasil e do mundo"
        ]
      }
    };
    let tierBulletTimer = null;

    tierBuyBtn.addEventListener("click", () => {
      const mapped = pkgMode === "single" ? "single" : pkgMode === "full12" ? "full" : "3";
      callbacks.onBuyPackage(mapped);
    });

    function renderBuilder(animateText = false) {
      const t = TIER_DATA[pkgMode] || TIER_DATA.combo3;
      cicloSec.dataset.pkg = pkgMode;

      // 1. Sliding spring thumb on segmented control
      tierThumb.style.transform = `translateX(${t.idx * 100}%)`;
      tierSegBtns.forEach((b) => b.classList.toggle("active", b.dataset.pkg === pkgMode));

      // 2. Odometer rolling price digits (R$ 19,90 / 49,90 / 99,90)
      odoTens.style.transform = `translateY(-${(t.idx * 100 / 3).toFixed(4)}%)`;
      odoOnes.style.transform = `translateY(-${(t.idx * 100 / 3).toFixed(4)}%)`;

      // 3. Morph 1 -> 3 -> 12 real Boarding Pass Envelopes with spring stagger!
      const heroIdx = selectedHouseId ? selectedHouseId - 1 : 0;
      const comboIndices = [(heroIdx + 11) % 12, heroIdx, (heroIdx + 1) % 12];
      const isCompact = vw < 820;

      morphImgs.forEach((img, i) => {
        if (pkgMode === "single") {
          const isHero = i === heroIdx;
          img.style.setProperty("--stagger", "0ms");
          img.style.opacity = isHero ? "1" : "0";
          img.style.zIndex = isHero ? "15" : "1";
          img.style.transform = isHero
            ? `translate3d(0, 0, 0) scale(${isCompact ? 1.08 : 1.12}) rotate(-3deg)`
            : "translate3d(0, 26px, 0) scale(0.72) rotate(0deg)";
        } else if (pkgMode === "combo3") {
          const slot = comboIndices.indexOf(i);
          if (slot !== -1) {
            const dx = (slot - 1) * (isCompact ? 58 : 88);
            const dy = slot === 1 ? -12 : 8;
            const rot = (slot - 1) * 14;
            const sc = slot === 1 ? 1.08 : 0.94;
            img.style.setProperty("--stagger", `${slot * 45}ms`);
            img.style.opacity = "1";
            img.style.zIndex = slot === 1 ? "16" : String(10 + slot);
            img.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sc}) rotate(${rot}deg)`;
          } else {
            img.style.setProperty("--stagger", "0ms");
            img.style.opacity = "0";
            img.style.zIndex = "1";
            img.style.transform = "translate3d(0, 28px, 0) scale(0.68) rotate(0deg)";
          }
        } else {
          // Balanced 12-passport symmetric solar fan (zero awkward clipping!)
          const angle = -28 + i * (56 / 11);
          const dx = (i - 5.5) * (isCompact ? 13 : 20);
          const dy = Math.abs(i - 5.5) * (isCompact ? 2.2 : 3.0) - 6;
          img.style.setProperty("--stagger", `${i * 20}ms`);
          img.style.opacity = "1";
          img.style.zIndex = String(10 + i);
          img.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${isCompact ? 0.82 : 0.9}) rotate(${angle.toFixed(1)}deg)`;
        }
      });

      // 4. Crisp copy + blur-masked bullet swap
      tierCreditPill.textContent = t.creditPill;
      tierSavePill.textContent = t.savePill;
      tierTitle.textContent = t.title;
      tierBuyBtn.textContent = t.cta;

      clearTimeout(tierBulletTimer);
      const paintBullets = () => {
        tierBullets.innerHTML = t.bullets.map((b) => `<li>${b}</li>`).join("");
      };
      if (animateText && !reducedMotion) {
        tierBullets.classList.add("swapping");
        tierBulletTimer = setTimeout(() => {
          paintBullets();
          tierBullets.classList.remove("swapping");
        }, 110);
      } else {
        paintBullets();
      }

      if (selectedHouseId) {
        const h = HOUSES[selectedHouseId - 1];
        pickedHouseDot.style.background = h.env;
        pickedHouseText.textContent = `Casa destacada: Casa ${h.code} · ${h.title}`;
        pickedHousePill.classList.add("show");
      }
    }

    function addHouseToBuilder(houseId) {
      selectedHouseId = houseId;
      renderBuilder(false);
    }

    tierSegBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (pkgMode === btn.dataset.pkg) return;
        pkgMode = btn.dataset.pkg;
        renderBuilder(true);
      });
    });

    // =========================================================================
    // COHESIVE HOUSE-COLORED MODAL (Zero Frankenstein dark popup!)
    // =========================================================================
    const drawerBackdrop = byId("drawerBackdrop");
    const drawerCard = byId("drawerCard");
    const drawerEyebrow = byId("drawerEyebrow");
    const drawerTitle = byId("drawerTitle");
    const drawerSub = byId("drawerSub");
    const drawerMedia = byId("drawerMedia");
    const drawerPillars = byId("drawerPillars");
    let drawerHouseIdx = 0;

    function openDrawer(idx) {
      drawerHouseIdx = idx;
      const h = HOUSES[idx];
      const steps = HOUSE_STEPS[h.id];
      drawerCard.style.setProperty("--m-bg1", h.cardBg);
      drawerCard.style.setProperty("--m-bg2", h.stage);
      drawerEyebrow.textContent = `Casa ${h.code} · Elemento ${h.element}`;
      drawerTitle.textContent = h.title;
      drawerSub.textContent = steps[0].head;

      drawerPillars.innerHTML = steps.slice(1).map((p) => `
        <div class="drawer-pillar">
          <h5>${p.head}</h5>
          <p>${p.text}</p>
        </div>
      `).join("");

      if (h.videoSrc) {
        drawerMedia.innerHTML = `<video src="${h.videoSrc}" poster="${h.posterSrc}" controls autoplay muted loop playsinline></video>`;
      } else {
        drawerMedia.innerHTML = `
          <div class="drawer-placeholder">
            <img src="${previewUrls[idx]}" alt="Envelope Casa ${h.code}" style="height:152px;filter:drop-shadow(0 16px 22px rgba(16,22,34,0.28));" />
            <div><strong>Filme cinematográfico da Casa ${h.code} em produção</strong><br/>Assim que for aprovado, o vídeo entra automaticamente neste palco.</div>
          </div>
        `;
      }
      drawerBackdrop.classList.add("open");
      rootEl.classList.add("drawer-open");
    }

    function closeDrawer() {
      drawerBackdrop.classList.remove("open");
      rootEl.classList.remove("drawer-open");
      const v = drawerMedia.querySelector("video");
      if (v) v.pause();
    }

    byId("drawerClose").addEventListener("click", closeDrawer);
    drawerBackdrop.addEventListener("click", (e) => { if (e.target === drawerBackdrop) closeDrawer(); });
    byId("drawerPickBtn").addEventListener("click", () => {
      addHouseToBuilder(HOUSES[drawerHouseIdx].id);
      closeDrawer();
      cicloSec.scrollIntoView({ behavior: "smooth" });
    });
    byId("drawerPastBtn").addEventListener("click", () => {
      closeDrawer();
      callbacks.onOpenFreeAudit();
    });

    // =========================================================================
    // INTERACTIONS (Drag arc, Raycast click, Buttons, Keyboard, Autoplay)
    // =========================================================================
    const arcHit = byId("arcHit");

    arcHit.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragLastX = e.clientX;
      dragLastT = performance.now();
      dragStartPos = pos;
      dragVel = 0;
      lastInteraction = performance.now();
    });

    addWinListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (!dragMoved && Math.abs(dx) > 6) {
        dragMoved = true;
        slideDur = 0;
        rootEl.classList.add("dragging");
      }
      if (!dragMoved) return;

      const isPhone = vw < 820;
      const u = isPhone ? Math.min(vw / 500, vh / 920) : Math.min(vw / 1440, vh / 900);
      const slotPx = 256 * u * (isPhone ? 1.04 : 1);
      const newPos = dragStartPos - dx / slotPx;
      const now = performance.now();
      const dt = Math.max(1, now - dragLastT);
      const instV = (newPos - pos) / dt;
      dragVel = lerp(dragVel, instV, 0.4);
      pos = newPos;
      dragLastX = e.clientX;
      dragLastT = now;
      lastInteraction = now;
    });

    function finishDrag(e) {
      if (!dragging) return;
      dragging = false;
      rootEl.classList.remove("dragging");

      if (!dragMoved && e && glActive && raycaster) {
        // Raycast click on 3D envelopes
        const mouse = new THREE.Vector2((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        const allMeshes = [...pool.map((u) => u.frontMesh), traveller.frontMesh];
        const hits = raycaster.intersectObjects(allMeshes, false);
        if (hits.length > 0) {
          const hitMesh = hits[0].object;
          if (hitMesh === traveller.frontMesh) {
            scrollToInsideStep(0);
          } else {
            const unit = pool.find((u) => u.frontMesh === hitMesh);
            if (unit) goTo(unit.slotIndex);
          }
        }
        return;
      }

      const snapTo = Math.round(pos + clamp(dragVel * 220, -2, 2));
      const dur = Math.max(360, 620 * Math.min(1, Math.abs(snapTo - pos) + 0.35));
      goTo(snapTo, dur);
    }

    addWinListener("pointerup", finishDrag);
    addWinListener("pointercancel", () => finishDrag(null));

    byId("nextBtn").addEventListener("click", () => goTo(target + 1));
    byId("prevBtn").addEventListener("click", () => goTo(target - 1));
    byId("heroTrailerBtn").addEventListener("click", () => scrollToInsideStep(0));
    inPrimaryBtn.addEventListener("click", () => {
      if (currentStep < 3) scrollToInsideStep(currentStep + 1);
      else colecaoSec.scrollIntoView({ behavior: "smooth" });
    });
    byId("navPastCta").addEventListener("click", () => callbacks.onOpenFreeAudit());
    byId("pastStripBtn").addEventListener("click", () => callbacks.onOpenFreeAudit());

    const autoBtn = byId("autoBtn");
    const autoIcon = byId("autoIcon");
    autoBtn.addEventListener("click", () => {
      autoplayOn = !autoplayOn;
      autoBtn.setAttribute("aria-pressed", String(autoplayOn));
      autoIcon.innerHTML = autoplayOn
        ? `<svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1.5" width="2.8" height="9" rx="1"/><rect x="7.2" y="1.5" width="2.8" height="9" rx="1"/></svg>`
        : `<svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><polygon points="3,1.5 10.5,6 3,10.5"/></svg>`;
      lastInteraction = performance.now();
    });

    rootEl.querySelectorAll(".step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = Number(btn.dataset.step);
        const r = insideSec.getBoundingClientRect();
        const secTopDoc = window.scrollY + r.top;
        const maxScroll = insideSec.offsetHeight - vh;
        const targets = [0.08, 0.34, 0.58, 0.74];
        window.scrollTo({ top: secTopDoc + maxScroll * targets[s], behavior: "smooth" });
      });
    });

    addWinListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
      const hr = casasSec.getBoundingClientRect();
      if (hr.bottom > vh * 0.45 && hr.top < vh * 0.5) {
        if (e.key === "ArrowRight") goTo(target + 1);
        if (e.key === "ArrowLeft") goTo(target - 1);
      }
    });

    // Nav highlight & smooth anchor click
    function updateNavHighlight() {
      const secs = [casasSec, insideSec, colecaoSec, cicloSec];
      let activeId = "casas";
      for (const s of secs) {
        if (s.getBoundingClientRect().top <= vh * 0.38) activeId = s.id;
      }
      navEl.classList.toggle("scrolled", window.scrollY > 36);
      navEl.classList.remove("dark");
      navLinks.forEach((a) => {
        const on = a.dataset.sec === activeId;
        a.classList.toggle("active", on);
        if (on) {
          navHi.style.left = a.offsetLeft + "px";
          navHi.style.width = a.offsetWidth + "px";
        }
      });
    }
    // Smooth cinematic scroll helper so clicking "12 Casas" lets you SEE the envelope glide & spin gracefully!
    function smoothScrollToY(targetY, duration = 1150) {
      if (reducedMotion) { window.scrollTo(0, targetY); return; }
      const startY = window.scrollY;
      const delta = targetY - startY;
      const t0 = performance.now();
      function step(now) {
        const t = clamp((now - t0) / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, startY + delta * eased);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    navLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const el = a.dataset.sec ? byId(a.dataset.sec) : null;
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY;
        smoothScrollToY(y, a.dataset.sec === "colecao" ? 1350 : 950);
      });
    });

    // =========================================================================
    // MAIN 60FPS ANIMATION LOOP (Hero Arc -> Section 2 Flip & Extract -> Landing)
    // =========================================================================
    let mobileSnappedCard = false;

    function tick(now: number) {
      if (disposed) return;
      rafId = rafId = requestAnimationFrame(tick);

      // 1. Tween hero carousel pos
      if (!dragging && slideDur > 0) {
        const t = clamp((now - slideStartTime) / slideDur);
        const eased = isIntroSlide ? introEase(t) : glideEase(t);
        pos = lerp(slideStartPos, slideTargetPos, eased);
        if (t >= 1) slideDur = 0;
      }

      // 2. Autoplay when hero visible
      const heroR = casasSec.getBoundingClientRect();
      const heroVisible = heroR.bottom > vh * 0.55 && heroR.top > -vh * 0.4;
      if (autoplayOn && !dragging && !document.hidden && heroVisible && now - lastInteraction > 3600) {
        goTo(target + 1);
      }

      // 3. Feathered circular color reveal behind center envelope
      if (revealActive) {
        const t = clamp((now - revealStart) / revealDur);
        const eased = glideEase(t);
        const cx = vw / 2;
        const cy = vw < 820 ? vh * 0.39 : vh * 0.43;
        const maxR = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.38;
        const r = maxR * eased;
        const feather = Math.max(60, 0.35 * r);
        const mask = `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)`;
        revealLayer.style.webkitMaskImage = mask;
        revealLayer.style.maskImage = mask;
        if (t >= 1) {
          revealActive = false;
          rootEl.style.setProperty("--stage", revealColor);
          revealLayer.style.setProperty("--rv", "transparent");
          revealLayer.style.webkitMaskImage = "";
          revealLayer.style.maskImage = "";
        }
      }

      // 4. Scroll blend metrics across sections
      const inR = insideSec.getBoundingClientRect();
      const colR = colecaoSec.getBoundingClientRect();

      updateNavHighlight();

      const p1 = clamp(1 - inR.top / vh);
      const p3 = clamp((vh - colR.top) / (vh * 0.7));
      const inScroll = clamp(-inR.top / Math.max(1, insideSec.offsetHeight - vh));

      // Section 2 steps & storm progress
      const stepIdx = inScroll < 0.22 ? 0 : inScroll < 0.46 ? 1 : inScroll < 0.68 ? 2 : 3;
      if (inR.top < vh && inR.bottom > 0) setInsideStep(stepIdx);

      const q = clamp((inScroll - 0.78) / 0.22);

      // Show fixed #inFront aligned to #inside sticky bounds
      const inVisible = inR.top < vh && inR.bottom > 0;
      inFront.style.visibility = inVisible ? "visible" : "hidden";
      if (inVisible) {
        let pinY = 0;
        if (inR.top > 0) pinY = inR.top;
        else if (inR.bottom < vh) pinY = inR.bottom - vh;
        inFront.style.transform = `translateY(${pinY}px)`;
        const frontFade = 1 - clamp(q * 3.8);
        inFrontFrame.style.opacity = String(frontFade);
        inNum.style.opacity = String(frontFade);
        inDark.style.opacity = String(clamp(q * 3.2) * 0.45);
      }

      // Golden star storm wave (q: 0 -> 1)
      if (!reducedMotion && q > 0 && q < 1) {
        const R = 0.56 * Math.hypot(vw, vh);
        const baseSize = 0.055 * Math.min(vw, vh);
        for (const st of stormStars) {
          const s = clamp((q - 0.42 * st.phase) / 0.58);
          if (s <= 0 || s >= 1) {
            st.el.style.opacity = "0";
          } else {
            const rad = (0.06 + Math.pow(s, 1.45) * 0.94) * R;
            const x = Math.cos(st.angle) * rad;
            const y = Math.sin(st.angle) * rad * 0.82;
            const sc = (0.25 + 1.5 * s) * st.size * (baseSize / 36);
            const op = Math.sin(Math.PI * s) * clamp(5 * q) * clamp(6 * (1 - q));
            st.el.style.opacity = op.toFixed(3);
            st.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${sc.toFixed(2)}) rotate(${(st.spin * s).toFixed(1)}deg)`;
          }
        }
      } else {
        for (const st of stormStars) st.el.style.opacity = "0";
      }

      // Ticket extraction smoothly in Step 03 (and slightly back before landing)
      const wantExtract = (p1 > 0.7 && p3 < 0.15 && stepIdx === 2) ? 1 : 0;
      extractVal = lerp(extractVal, wantExtract, reducedMotion ? 1 : 0.1);

      // Control hidden videos playback only when active & extracted (1 video at a time — saves battery & 4G!)
      const activeHouse = HOUSES[modN(target)];
      const wantActiveVid = extractVal > 0.12 && p3 < 0.5;
      if (wantActiveVid && activeHouse.videoSrc) ensureHouseVideo(activeHouse.id);
      Object.entries(videoEls).forEach(([hidStr, vid]) => {
        if (!vid) return;
        const shouldPlay = wantActiveVid && activeHouse.id === Number(hidStr);
        if (shouldPlay && vid.paused) vid.play().catch(() => {});
        if (!shouldPlay && !vid.paused) vid.pause();
      });

      // Grid 2x2 on mobile requires no horizontal card auto-snap

      // 5. Render 3D Scene
      if (!glActive) return;

      const centerSlot = Math.round(pos);
      const activeIdx = modN(target);
      const jT = Math.round(target);

      // Place side envelopes (fade away as p1 rises)
      let pIdx = 0;
      const sideFade = 1 - clamp(1.65 * p1);
      for (let j = centerSlot - 4; j <= centerSlot + 4; j++) {
        if (j === jT) continue;
        if (pIdx >= pool.length) break;
        const unit = pool[pIdx++];
        unit.slotIndex = j;
        applyHouseToUnit(unit, modN(j), false);
        const st = arcState(j - pos, j, now);
        st.op *= sideFade;
        placeUnit(unit, st);
      }
      while (pIdx < pool.length) {
        pool[pIdx++].root.visible = false;
      }

      // Place THE TRAVELLER (Hero A -> Section 2 B -> Section 3 Card C)
      applyHouseToUnit(traveller, activeIdx, extractVal > 0.15);

      const stateA = arcState(jT - pos, jT, now);

      const barR = inBar.getBoundingClientRect();
      const bob = reducedMotion ? 0 : Math.sin((now / 2600) * Math.PI * 2) * 6;
      // Gentle cinematic half-turn spin into the 12 Casas grid (never a frantic dizzy spin!)
      const flipDeg = getFlipAngle(now) + (reducedMotion ? 0 : 180 * q);
      const stateB = {
        x: barR.left + barR.width / 2,
        y: barR.top + barR.height / 2 + bob,
        h: barR.height * 0.92,
        rz: 10 * (1 - extractVal * 0.65),
        ry: flipDeg,
        rx: 0,
        z: 0,
        op: 1,
        shadow: 1,
        slide: extractVal
      };

      const liveCard = cardsGrid.querySelector(`.h-card[data-house-idx="${activeIdx}"] .h-card-art`);
      const cr = liveCard ? liveCard.getBoundingClientRect() : { left: vw / 2 - 70, top: vh / 2 - 100, width: 140, height: 196 };
      const wholeTurns = Math.round(flipDeg / 360) * 360;
      const hov = cardHover.id === activeIdx ? cardHover : { tx: 0, ty: 0 };
      const stateC = {
        x: cr.left + cr.width / 2,
        y: cr.top + cr.height / 2,
        h: cr.height * 0.96,
        rz: 0,
        ry: wholeTurns + hov.tx * 14,
        rx: -hov.ty * 14,
        z: 24,
        op: cr.bottom < -60 || cr.top > vh + 60 ? 0 : 1,
        shadow: 0.65,
        slide: 0
      };

      let finalSt = stateA;
      if (p1 > 0) {
        const e1 = easeInOutSine(p1);
        finalSt = {
          x: lerp(stateA.x, stateB.x, e1),
          y: lerp(stateA.y, stateB.y, e1),
          h: lerp(stateA.h, stateB.h, e1),
          rz: lerp(stateA.rz, stateB.rz, e1),
          ry: lerp(stateA.ry, stateB.ry, e1),
          rx: lerp(stateA.rx, stateB.rx, e1),
          z: lerp(stateA.z, stateB.z, e1),
          op: lerp(stateA.op, stateB.op, e1),
          shadow: lerp(stateA.shadow, stateB.shadow, e1),
          slide: lerp(stateA.slide, stateB.slide, e1)
        };
      }
      if (p3 > 0) {
        const e3 = easeInOutSine(p3);
        finalSt = {
          x: lerp(finalSt.x, stateC.x, e3),
          y: lerp(finalSt.y, stateC.y, e3),
          h: lerp(finalSt.h, stateC.h, e3),
          rz: lerp(finalSt.rz, stateC.rz, e3),
          ry: lerp(finalSt.ry, stateC.ry, e3),
          rx: lerp(finalSt.rx, stateC.rx, e3),
          z: lerp(finalSt.z, stateC.z, e3),
          op: lerp(finalSt.op, stateC.op, e3),
          shadow: lerp(finalSt.shadow, stateC.shadow, e3),
          slide: lerp(finalSt.slide, stateC.slide, e3)
        };
      }

      placeUnit(traveller, finalSt);
      renderer.render(scene, camera);
    }

    // Boot
    initThree();
    applyActiveHouseUI(1, false);
    renderBuilder();
    addWinListener("resize", resizeGL);

    if (disposed) return;
    // Entrance choreography
    rafId = requestAnimationFrame(() => {
      if (disposed) return;
      slideStartTime = performance.now();
      lastInteraction = performance.now() + 2200;
      navEl.classList.add("ready");
      byId("rings").classList.add("ready");
      byId("heroControls").classList.add("ready");
      countEl.classList.add("ready");
      autoBtn.classList.add("ready");
      starLayer.querySelectorAll(".star-bit").forEach((s, i) => {
        setTimeout(() => s.classList.add("ready"), 220 + i * 70);
      });
      updateNavHighlight();
      rafId = requestAnimationFrame(tick);
    });
  
  })();

  return () => {
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    for (const [type, fn, opts] of winListeners) {
      window.removeEventListener(type, fn, opts);
    }
    for (const v of activeVideos) {
      try { v.pause(); v.removeAttribute("src"); v.load(); } catch {}
    }
    try { envRTRef?.dispose(); } catch {}
    try { rendererRef?.dispose(); } catch {}
    rootEl.classList.remove("dragging", "drawer-open", "no-gl");
  };
}
