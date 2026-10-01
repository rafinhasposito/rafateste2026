import { useParams } from "react-router-dom";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";
import { MobileAppChrome } from "@/layouts/MobileAppChrome";
import { cityDatabase } from "@/data/houses";
import { FOCUS_MATRIX } from "@/data/focusMatrix";
import { DNA_MATRIX } from "@/data/dnaMatrix";
import { prefixosSol, prefixosAscendente, prefixosFase } from "@/data/modifiers";
import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";
import { houseThemes } from "@/data/houseThemes";
import { REAL_HOUSES_DATA } from "@/data/houses_content";
import UnlockPremiumModal from "@/components/UnlockPremiumModal";
import { MapPin, ArrowUpCircle, Landmark, CircleDollarSign, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, ShieldAlert, Eye, Clock, Hourglass, BookOpen, Plane, QrCode, Fingerprint, Hash, CreditCard, Compass, Plus, Unlock } from "lucide-react";

/* ══════════════════════════════════════════════════
   ANIMATION COMPONENTS
   ══════════════════════════════════════════════════ */
const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
};

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = () => { n += Math.ceil(target / 30); if (n >= target) { setVal(target); return; } setVal(n); requestAnimationFrame(step); };
    step();
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ══════════════════════════════════════════════════
   DATA (Theme is hardcoded to #02160F dark blue, #10b981 bright blue)
   ══════════════════════════════════════════════════ */
const P = {
  name: "Rafael Sposito", firstName: "Rafael", year: 2027, date: "09/08/2027", time: "05:30 (UTC)",
  origin: "Surubim",
  // house and city are now dynamic
  houseTag: "Prosperidade Financeira & Segurança",
  match: 98, cost: 1, vector: "FUTURO", hash: "#CC59F4F6",
  sign: "Leão", ascendant: "Virgem", phase: "Adulto", intention: "Dinheiro",
};

/* Textos cinematográficos dinâmicos para cada Casa */
const HOUSE_CINEMATIC_TEXTS: Record<number, string> = {
  1: "colocar você em primeiro lugar, resgatar sua coragem e liderar um novo começo na sua vida.",
  2: "destravar o seu dinheiro, valorizar seu trabalho e construir estabilidade no seu novo ciclo.",
  3: "destravar a sua voz, fechar novos negócios e fazer sua rotina girar com agilidade.",
  4: "criar raízes sólidas, reestruturar seu lar e conquistar um porto seguro de paz interior.",
  5: "reacender a sua paixão, recuperar a alegria de viver e colocar o seu brilho único em evidência.",
  6: "organizar sua rotina, recuperar sua energia física e fazer o seu dia render com máxima eficiência.",
  7: "atrair um relacionamento sério, firmar grandes parcerias e viver a verdadeira reciprocidade a dois.",
  8: "encerrar ciclos antigos, virar a página com coragem e acessar o seu verdadeiro poder pessoal.",
  9: "dar um salto quântico, expandir seus horizontes e viver uma vida sem fronteiras.",
  10: "assumir o topo do seu mercado, ser reconhecido publicamente e brilhar no modo CEO.",
  11: "atrair aliados de peso, multiplicar suas oportunidades pela rede e construir seus grandes projetos de futuro.",
  12: "desacelerar o barulho externo, gestar grandes ideias nos bastidores e renovar sua paz de espírito."
};

/* Filtro de cor do vídeo de partículas — 1 vídeo, 12 auras */
const HOUSE_VIDEO_FILTER: Record<number, string> = {
  1:  "hue-rotate(0deg) saturate(1.4)",        // Vermelho — Identidade
  2:  "hue-rotate(120deg) saturate(1.2)",       // Verde — Recursos
  3:  "hue-rotate(60deg) saturate(1.3)",        // Amarelo — Comunicação
  4:  "hue-rotate(180deg) saturate(0.8)",       // Prata/Azul claro — Lar
  5:  "hue-rotate(40deg) saturate(1.5)",        // Dourado — Criatividade
  6:  "hue-rotate(30deg) saturate(0.5)",        // Terra — Rotina
  7:  "hue-rotate(300deg) saturate(1.2)",       // Rosa — Relacionamentos
  8:  "hue-rotate(270deg) saturate(1.4)",       // Roxo escuro — Transformação
  9:  "hue-rotate(20deg) saturate(1.3)",        // Laranja — Expansão
  10: "hue-rotate(200deg) saturate(1.2)",       // Azul escuro — Carreira
  11: "none",                                   // Azul (original) — Grupos
  12: "hue-rotate(250deg) saturate(1.3)",       // Violeta — Espiritualidade
};

const FAVORECER = [
  { icon: Users, text: "Conhecer pessoas influentes que abrem portas profissionais importantes" },
  { icon: ArrowUpRight, text: "Aumentar de forma consistente a sua rede de contatos e audiência" },
  { icon: DollarSign, text: "Receber indicações, propostas e convites de trabalho de forma mais leve" },
  { icon: Target, text: "Criar parcerias de negócios, programas de afiliados ou coproduções de peso" },
  { icon: Sparkles, text: "Tirar projetos antigos do papel com a ajuda de grupos ou masterminds" },
];

const LIFE_AREAS = [
  { 
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    city: "Tóquio, Japão",
    cityDesc: "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. Tóquio pulsa com uma energia de disciplina e hiperprodutividade, criando o terreno magnético exato para quem precisa transformar metas dispersas em lucro previsível.",
    image: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80",
    dna: {
      essencia: "O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de Dinheiro e Recursos, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.",
      metodo: "A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.",
      fase: "A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real."
    },
    ritual: "Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto. Durante a transação, afirme mentalmente que aquele é o último investimento do seu antigo ciclo de escassez.",
    mantra: "Eu sei o valor do meu trabalho, cuido bem das minhas contas e faço meu dinheiro render.",
    pillars: [
      { icon: ArrowUpRight, title: "Aumento de Ganhos", text: "A energia favorece o faturamento e atrai novos clientes. O universo aqui não entrega por sorte, mas recompensa a sua coragem de faturar e expandir horizontes." },
      { icon: Crown, title: "Valorização do Trabalho", text: "A vibração do lugar convida à autoconfiança extrema. O cenário é perfeito para acabar com os descontos emocionais e cobrar o valor justo pelo seu talento." },
      { icon: Shield, ShieldAlert, title: "Estabilidade & Segurança", text: "O destino foca na organização e proteção do que é seu. Proteger o lucro ganha tanta força quanto fazê-lo acontecer, estancando vazamentos de energia e caixa." }
    ],
    timeline: [
      { phase: "Fase 1: Preparação de Terreno", period: "Meses 1 a 4", text: "O ciclo se inicia pedindo arrumação de casa. A energia favorece a revisão de preços, corte de gastos inúteis e o planejamento cirúrgico do seu funil de vendas. É a fase de fechar torneiras." },
      { phase: "Fase 2: Tração Magnética", period: "Meses 5 a 8", text: "Com a base arrumada, o seu magnetismo entra em potência máxima. Convites e propostas tendem a se materializar com mais facilidade. O cenário é ideal para fechar grandes contratos." },
      { phase: "Fase 3: Consolidação", period: "Meses 9 a 12", text: "A euforia da expansão cede lugar à segurança estrutural. O destino foca em transformar lucros isolados em previsibilidade financeira e blindagem de patrimônio." }
    ]
  },
  { 
    id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#3b82f6", score: 88, unlocked: false, 
    teaser: "A força deste destino impulsiona suas metas profissionais rumo ao topo.", 
    city: "Nova York, EUA",
    cityDesc: "O epicentro financeiro do mundo. A energia inesgotável desta ilha não aceita mediocridade, forçando você a assumir a autoridade da sua própria carreira e colocar suas ideias nos maiores palcos disponíveis.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80",
    dna: {
      essencia: "O seu brilho pessoal exige protagonismo. No Trabalho, a vibração desta cidade garante que o seu magnetismo abra portas que diplomas sozinhos não abririam.",
      metodo: "A sua necessidade de excelência encontra o terreno fértil. O destino recompensa a sua capacidade de estruturar equipes, otimizar rotinas e liderar pelo exemplo prático.",
      fase: "O foco agora é consolidação. Não se trata mais de provar o seu valor para o mercado, mas de assumir a autoridade que você já construiu e colher os frutos financeiros disso."
    },
    ritual: "Vá ao centro financeiro da cidade. Caminhe observando o fluxo de negócios. Envie uma mensagem estratégica para alguém de alto nível do seu mercado, plantando uma semente e se colocando à disposição, sem pedir nada em troca.",
    mantra: "Eu ocupo o meu espaço por direito. A minha autoridade é inquestionável e o meu trabalho gera um impacto irreplicável.",
    pillars: [
      { icon: ArrowUpRight, title: "Ascensão Acelerada", text: "O alinhamento abre caminho para que saltos de negócio apareçam com naturalidade. A sua autoridade ganha um palco iluminado diante dos tomadores de decisão." },
      { icon: Crown, title: "Liderança Incontestável", text: "A energia atrai pessoas buscando a sua direção. O cenário é propício para assumir o protagonismo da sua equipe ou mercado sem pedir licença pelo seu brilho." },
      { icon: Shield, ShieldAlert, title: "Blindagem Profissional", text: "O universo ajuda a transformar sua carreira no seu maior ativo. O destino cria uma armadura de competência que te protege contra crises externas." }
    ],
    timeline: [
      { phase: "Fase 1: Estruturação de Autoridade", period: "Meses 1 a 4", text: "O início do ciclo não é sobre aparecer, mas sobre construir alicerces. A energia favorece o redesenho dos seus processes e a montagem do time que sustentará seu próximo nível." },
      { phase: "Fase 2: O Palco Iluminado", period: "Meses 5 a 8", text: "Sua competência atinge massa crítica. O cenário abre portas para visibilidade real diante de tomadores de decisão, tornando suas ideias o centro das atenções." },
      { phase: "Fase 3: Liderança Estabelecida", period: "Meses 9 a 12", text: "Você não precisa mais convencer ninguém do seu valor. A vibração consolida o seu nome como referência, atraindo convites sem que você precise forçar a prospecção." }
    ]
  },
  { 
    id: "identidade", icon: Crown, label: "Identidade e Imagem", color: "#c9a227", score: 80, unlocked: false, 
    teaser: "A vibração da cidade transforma a sua marca pessoal em sinônimo de excelência.", 
    city: "Milão, Itália",
    cityDesc: "Berço da estética impecável. O magnetismo de Milão exige que você abandone qualquer versão encolhida de si mesmo, atraindo oportunidades baseadas inteiramente na confiança do seu posicionamento.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
    dna: {
      essencia: "Você nasceu para ser visto. Nesta cidade, a sua identidade se fortalece, e o universo te empurra para o centro do palco sem que você precise forçar a barra.",
      metodo: "A sua imagem passa a transmitir uma precisão cirúrgica. As pessoas confiam em você porque o seu brilho vem acompanhado de extrema competência e atenção aos detalhes.",
      fase: "A necessidade de aprovação externa desaparece. Você entra num ciclo onde a sua marca pessoal é pautada por quem você realmente é, e não pelo que esperam de você."
    },
    ritual: "Tire um momento exclusivo para você. Faça algo que melhore a sua autoestima e compre uma roupa nova que marque esse ciclo. Caminhe pelas ruas habitando essa pele, sem justificar seu brilho para ninguém.",
    mantra: "Eu assumo o comando das minhas escolhas. A minha presença fala por si e eu não me diminuo para caber em expectativas alheias.",
    pillars: [
      { icon: ArrowUpRight, title: "Autoconfiança Magnética", text: "A sensação ao pisar neste destino é de clareza absoluta de quem você é. A energia afasta a dúvida e garante que você entre em qualquer sala sabendo o seu valor." },
      { icon: Crown, title: "Posicionamento Premium", text: "O universo alinha a sua imagem ao alto valor. O magnetismo é tão forte que as pessoas costumam ler o seu sucesso antes mesmo de você abrir a boca." },
      { icon: Shield, ShieldAlert, title: "Fim da Autossabotagem", text: "A força do mapa destrava o medo da exposição. A energia pede que você pare de se encolher para caber em lugares pequenos e ocupe o seu espaço real." }
    ],
    timeline: [
      { phase: "Fase 1: Desconstrução e Limpeza", period: "Meses 1 a 4", text: "O universo pede uma limpa na sua imagem. É o momento perfeito para jogar fora identidades antigas, repensar seu estilo e abandonar rótulos que já não cabem mais." },
      { phase: "Fase 2: Magnestismo em Alta", period: "Meses 5 a 8", text: "A sua nova persona ganha força. A energia atrai olhares e parcerias, fazendo com que o mundo perceba o upgrade interno que você realizou nos meses anteriores." },
      { phase: "Fase 3: Segurança Inabalável", period: "Meses 9 a 12", text: "A sua identidade torna-se seu maior escudo protetor. A vibração da cidade garante que nenhuma crítica externa tenha força para balançar a sua confiança real." }
    ]
  },
  { 
    id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7", score: 72, unlocked: false, 
    teaser: "O universo organiza o seu tempo para transformar disciplina na sua maior alavanca.", 
    city: "Zurique, Suíça",
    cityDesc: "A capital mundial da precisão. Esta cidade não tolera desperdício, calibrando o seu tempo e foco para que você produza o dobro do resultado exigindo metade do esforço físico.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop",
    dna: {
      essencia: "Até mesmo o seu dia a dia precisa ter a sua assinatura de criatividade. Aqui, a rotina não apaga o seu brilho, mas serve como combustível para você focar no que importa.",
      metodo: "O seu Ascendente está em casa. A energia local transforma o seu preciosismo em alta produtividade, ajudando a criar sistemas que funcionam quase no piloto automático.",
      fase: "O tempo se tornou seu recurso mais caro. A fase atual exige que você corte tudo aquilo que não traz retorno, blindando sua agenda contra distrações inúteis."
    },
    ritual: "Desligue todos os alarmes e não abra as redes sociais nas primeiras 4 horas do seu dia. O luxo absoluto do seu primeiro dia de Revolução Solar deve ser dominar o próprio tempo.",
    mantra: "Meu tempo é a minha moeda mais valiosa. A disciplina não me prende, ela é a base exata da minha liberdade absoluta.",
    pillars: [
      { icon: ArrowUpRight, title: "Alta Performance Real", text: "O alinhamento dissolve a procrastinação. A energia favorece um estado de foco profundo, permitindo que você produza em 4 horas o que costumava levar 10." },
      { icon: Crown, title: "Automação do Caos", text: "O universo pede eficiência extrema. A vibração da cidade facilita a delegação de tarefas, libertando o seu tempo para decisões que realmente movem o ponteiro." },
      { icon: Shield, ShieldAlert, title: "Paz Mental Diária", text: "A sensação ao fim do dia é de vitória e missão cumprida. O destino transforma a rotina de uma prisão exaustiva para a verdadeira fundação da sua liberdade." }
    ],
    timeline: [
      { phase: "Fase 1: Mapeamento de Fugas", period: "Meses 1 a 4", text: "O momento favorece a identificação brutal de onde o seu tempo escorre pelo ralo. A energia ajuda a podar compromissos tóxicos e reuniões improdutivas." },
      { phase: "Fase 2: Engenharia de Tempo", period: "Meses 5 a 8", text: "Com o calendário limpo, a vibração acelera a implementação de sistemas e delegação inteligente. Processos complexos passam a rodar com fluidez natural." },
      { phase: "Fase 3: Ritmo de Cruzeiro", period: "Meses 9 a 12", text: "A rotina deixa de ser uma luta diária. O universo estabiliza os hábitos e você atinge a verdadeira liberdade: ter previsibilidade sem perder a paz." }
    ]
  },
  { 
    id: "networking", icon: Users, label: "Networking e Conexões", color: "#14b8a6", score: 65, unlocked: false, 
    teaser: "O magnetismo deste destino aproxima pessoas que abrem portas restritas do seu mercado.", 
    city: "Singapura",
    cityDesc: "Um hub global de inovação. A frequência deste destino aproxima aliados de elite e mentores cruciais, abrindo portas de mesas fechadas sem que você precise pedir permissão.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
    dna: {
      essencia: "Você naturalmente atrai as pessoas, mas aqui o seu magnetismo filtra quem realmente importa. A energia afasta sugadores e aproxima parceiros estratégicos.",
      metodo: "A sua rede de contatos ganha um filtro de utilidade mútua. O universo facilita alianças onde os dois lados entregam excelência, sem espaço para promessas vazias.",
      fase: "Você não quer mais 'fazer amigos por fazer'. A maturidade pede círculos de influência focados em crescimento, suporte mútuo e expansão de impérios."
    },
    ritual: "Mande mensagem para 3 pessoas que te inspiram ou com quem você quer criar laços de alto nível. Depois, sente-se no lobby de um hotel elegante da cidade apenas para observar e pertencer àquele ambiente.",
    mantra: "Eu atraio pessoas que elevam o meu nível. Eu sento em mesas onde a colaboração de elite substitui a competição rasa.",
    pillars: [
      { icon: ArrowUpRight, title: "Acesso a Mesas Fechadas", text: "A vibração atrai encontros mágicos. Convites para ambientes exclusivos costumam surgir, colocando você a um aperto de mãos dos maiores contratos." },
      { icon: Crown, title: "Parcerias de Elite", text: "O destino eleva a sua frequência social. A energia atrai apenas associações com quem puxa o seu nível para cima, afastando relações que sugam o seu tempo." },
      { icon: Shield, ShieldAlert, title: "Proteção por Contatos", text: "O universo cria uma verdadeira rede de segurança ao seu redor através das suas conexões. O poder do 'quem indica' ganha força máxima a seu favor." }
    ],
    timeline: [
      { phase: "Fase 1: Poda Social", period: "Meses 1 a 4", text: "A vibração pede uma limpeza de contatos sugadores de energia. É o ciclo ideal para romper com parcerias desequilibradas de forma elegante e abrir espaço na agenda." },
      { phase: "Fase 2: Conexões Estratégicas", period: "Meses 5 a 8", text: "Mesas que antes pareciam inacessíveis abrem suas portas. O magnetismo aproxima mentores, aliados de alto nível e pessoas dispostas a jogar o seu jogo." },
      { phase: "Fase 3: O Círculo Blindado", period: "Meses 9 a 12", text: "A energia transforma conhecidos em parceiros de negócios sólidos. A sua rede vira um cinturão de segurança real, elevando o seu padrão de atuação para os próximos anos." }
    ]
  },
  { 
    id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e", score: 62, unlocked: false, 
    teaser: "A energia pede estabilidade e transforma o romance em uma base forte para o futuro.", 
    city: "Roma, Itália",
    cityDesc: "A cidade eterna. A vibração deste destino afasta paixões rasas e convida à fundação de laços profundos. É um terreno magnético para estabilizar romances e torná-los fortalezas.",
    image: "https://images.unsplash.com/photo-1516483638261-f40889eba30e?q=80&w=1980&auto=format&fit=crop",
    dna: {
      essencia: "O seu Leão pede admiração mútua. No Amor, o destino afasta relações em que você precise se diminuir e atrai parcerias onde o seu brilho é celebrado e protegido.",
      metodo: "O romantismo encontra a praticidade. O universo favorece parceiros que trazem ordem, cuidado diário e que saibam construir uma vida a dois sem dramas desnecessários.",
      fase: "A fase de montanha-russa emocional já passou. O que você busca e atrai agora é paz, previsibilidade e alguém para ser o seu porto seguro nas conquistas da vida."
    },
    ritual: "Trate a si mesmo como você gostaria que o parceiro ideal te tratasse hoje. Reserve a melhor mesa, compre um presente para si e habite o estado de merecimento absoluto. O universo reflete o seu próprio padrão.",
    mantra: "Eu aceito receber amor na exata medida da minha dedicação. Eu me torno magnético quando honro o meu próprio valor.",
    pillars: [
      { icon: ArrowUpRight, title: "Magnetismo Real", text: "O destino foca na atração de parcerias maduras. A energia é ideal para encontrar quem queira construir junto, cortando o desgaste com relações rasas." },
      { icon: Crown, title: "Valorização Pessoal", text: "A sensação de amor próprio se torna o seu maior escudo. O universo pede o fim das concessões excessivas, garantindo que você dite as regras do seu valor." },
      { icon: Shield, ShieldAlert, title: "Construção de Futuro", text: "A vibração transforma a atração física em raízes profundas. O cenário é perfeito para que o romance se torne uma base para realizações conjuntas." }
    ],
    timeline: [
      { phase: "Fase 1: Fim das Concessões", period: "Meses 1 a 4", text: "O destino exige a elevação dos seus padrões amorosos. A energia ajuda a encerrar padrões de submissão e atrai um senso de valor próprio inegociável." },
      { phase: "Fase 2: Magnetismo de Propósito", period: "Meses 5 a 8", text: "Com a confiança resgatada, o universo entra em fluxo para atrair parcerias que partilham a mesma direção, construindo alianças baseadas em admiração e suporte real." },
      { phase: "Fase 3: Raízes Profundas", period: "Meses 9 a 12", text: "O romance se transforma em fortaleza. A vibração solidifica o compromisso, eliminando a volatilidade e consolidando um terreno fértil de paz na vida a dois." }
    ]
  },
  { 
    id: "espiritual", icon: Sparkles, label: "Espiritual e Propósito", color: "#6366f1", score: 55, unlocked: false, 
    teaser: "O universo conecta a sua essência com a capacidade de gerar valor no mundo material.", 
    city: "Quioto, Japão",
    cityDesc: "O epicentro do silêncio focado. Uma energia milenar que silencia o ruído externo e sintoniza você com a sua intuição mais profunda, traduzindo insights em passos firmes.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    dna: {
      essencia: "A sua luz interna ganha um propósito maior. O destino te lembra que o seu poder pessoal tem a missão de iluminar não só o seu caminho, mas o das pessoas ao redor.",
      metodo: "A espiritualidade deixa de ser mística e passa a ser prática. O universo alinha a sua intuição com ações calculadas, transformando insight em resultados concretos.",
      fase: "Você entende que o verdadeiro sucesso precisa ter alma. A maturidade espiritual foca em alinhar a sua ambição material com a sua paz de espírito diária."
    },
    ritual: "Faça uma caminhada silenciosa de 30 minutos por um parque ou templo, sem fones de ouvido. Faça uma doação financeira anônima para ancorar a energia de abundância do universo.",
    mantra: "Eu confio na inteligência invisível que orquestra os meus passos. A minha paz de espírito é o meu maior ativo.",
    pillars: [
      { icon: ArrowUpRight, title: "Intuição Afiada", text: "O destino aguça o seu sexto sentido de forma inegável. A sensação é de saber o caminho exato antes mesmo que a mente lógica consiga tentar explicar." },
      { icon: Crown, title: "Clareza de Propósito", text: "A vibração da cidade dissipa qualquer crise existencial. O universo te acorda com a certeza do porquê você faz o que faz, unindo carreira e alma." },
      { icon: Shield, ShieldAlert, title: "Paz de Espírito", text: "O alinhamento constrói um escudo invisível contra o ruído do mundo. A energia te ancora em um centro de calma que nenhum estresse externo consegue derrubar." }
    ],
    timeline: [
      { phase: "Fase 1: Silêncio Estratégico", period: "Meses 1 a 4", text: "A energia exige que você baixe o volume do mundo exterior. É um período essencial para a prática de meditação e reconexão profunda com a sua voz interna original." },
      { phase: "Fase 2: Intuição em Ação", period: "Meses 5 a 8", text: "A clareza espiritual ganha contornos práticos. O universo facilita que insights aparentemente irracionais se transformem em decisões precisas e estratégicas nos negócios e na vida." },
      { phase: "Fase 3: Alinhamento Absoluto", period: "Meses 9 a 12", text: "O fim da crise existencial. A vibração consolida a certeza interna do seu propósito, criando um escudo emocional tão forte que nenhum obstáculo externo consegue te desestabilizar." }
    ]
  },
  { 
    id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e", score: 52, unlocked: false, 
    teaser: "A força deste destino pede um corpo firme para suportar o peso das suas ambições.", 
    city: "Vancouver, Canadá",
    cityDesc: "Natureza implacável e ar puro. Este destino acelera o seu metabolismo e convida ao biohacking natural, purificando a sua vitalidade para suportar o topo da sua carreira.",
    image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=2118&auto=format&fit=crop",
    dna: {
      essencia: "A sua vitalidade é naturalmente alta, mas aqui ela é direcionada para a manutenção da máquina. A energia foca em preservar o seu corpo para aguentar o teto do sucesso.",
      metodo: "O Virgem assume o controle absoluto da sua biologia. O universo favorece protocolos de biohacking, rotinas de sono e uma alimentação milimetricamente ajustada.",
      fase: "O corpo já não aceita abusos como antes. O seu momento de vida exige que o autocuidado seja tratado com a mesma prioridade e respeito que a sua conta bancária."
    },
    ritual: "Comece o dia com um choque biológico (um banho gelado ou um treino intenso). Depois, faça a sua primeira refeição no melhor e mais limpo restaurante que encontrar, tratando o alimento como combustível premium.",
    mantra: "Meu corpo é o templo inegociável das minhas ambições. Eu invisto na minha biologia para que ela sustente a minha mente.",
    pillars: [
      { icon: ArrowUpRight, title: "Energia Inesgotável", text: "O magnetismo local impulsiona o seu vigor. A sensação de cansaço crônico cede espaço para uma energia limpa, acompanhando o ritmo da sua ambição mental." },
      { icon: Crown, title: "Longevidade e Vigor", text: "A vibração faz com que o seu corpo responda instantaneamente aos bons tratos. O universo recompensa seus novos hábitos com uma aparência de saúde radiante." },
      { icon: Shield, ShieldAlert, title: "Corpo Blindado", text: "A energia foca na sua imunidade. O destino transforma o seu sistema de defesa em uma verdadeira fortaleza, garantindo que a saúde acompanhe a sua escalada." }
    ],
    timeline: [
      { phase: "Fase 1: Diagnóstico e Ajuste", period: "Meses 1 a 4", text: "A vibração pede checagens precisas. A energia favorece identificar pequenas inflamações e ajustar a sua rotina de sono e alimentação para formar um platô firme de biologia." },
      { phase: "Fase 2: Biohacking e Vigor", period: "Meses 5 a 8", text: "Os novos hábitos começam a rodar no automático. O universo impulsiona uma vitalidade incomum, acabando com a névoa mental e fornecendo combustível limpo para suas conquistas." },
      { phase: "Fase 3: Fortaleza Imunológica", period: "Meses 9 a 12", text: "A sensação é de corpo blindado. O metabolismo entra no seu auge de performance e estabilidade, garantindo que a sua saúde consiga bancar integralmente a altura das suas ambições." }
    ]
  }
];

// Apple Highlight Text Component
const AppleHighlightText = ({ text, activeColor, gradientParent = false }: { text: string, activeColor: string, gradientParent?: boolean }) => {
  if (!text) return null;
  const keywords = [
    "valor real do seu tempo", "talentos", "dar desconto por vergonha",
    "pé no chão", "juízo com cada centavo", "reajuste de preços", "viver com tranquilidade", "reservas",
    "terreno firme", "base sólida",
    "colocar você em primeiro lugar", "coragem", "liderar um novo começo",
    "destravar a sua voz", "fechar novos negócios", "contatos úteis",
    "porto seguro de paz interior", "sossego", "recarregar as energias", "paz mental",
    "talentos autorais no centro do palco", "alegria de viver", "amor, tesão e personalidade",
    "vida fit em dia", "render sem estresse", "corpo forte", "mente calma",
    "parcerias de peso", "compromissos sérios", "negociar com maturidade",
    "desapego", "renascimento", "grandes investimentos", "virar a página", "poder pessoal",
    "salto gigante", "liberdade", "sem medo do tamanho dos seus sonhos",
    "modo CEO ligado", "holofotes na sua autoridade", "sucesso", "postura de líder",
    "amigos que abrem portas", "network", "mídias digitais",
    "santuário de paz", "intuição afiada", "trabalho profundo de bastidores", "descanso reparador",
    "Sintonize a intenção", "ação física", "Ancore na cidade"
  ];
  
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <span 
              key={i} 
              style={gradientParent ? { color: activeColor, WebkitTextFillColor: activeColor } : { color: activeColor }} 
              className="font-normal opacity-100 drop-shadow-md"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export interface CityOption {
  city: string;
  country: string;
  continent: string;
  display_name: string;
  lat: number;
  lon: number;
  img?: string;
  score?: number;
}

export interface HouseResult {
  city?: CityOption;
  options?: {
    nacional: CityOption | null;
    acessivel: CityOption | null;
    highticket: CityOption | null;
  };
}

export interface DestinyResultsProps {
  house?: number | null;
  houseName?: string;
  houseData?: any;
  cities?: {
    highticket: CityOption[];
    acessivel: CityOption[];
    nacional: CityOption[];
  };
  allResults?: Record<string, HouseResult> | undefined;
  userCredits?: number;
  isAuthenticated?: boolean;
  consultationId?: string;
  autoUnlocked?: boolean;
  onUnlock?: (n: number) => void;
  onUnlockFocus?: (focusId: string, houseNum: number) => Promise<void>;
  unlockedFocuses?: Record<string, string[]>;
  embedded?: boolean;
  isHouseUnlocked?: (h: number) => boolean;
  onSelectHouse?: (h: number) => void;
  mode?: string;
  unlockedCount?: number;
  intent?: string | null;
}

export default function AppleResultPreviewV3(props: DestinyResultsProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);
    return () => clearTimeout(timer);
  }, [props.house]);

  const { houseId } = useParams();
  const parsedId = houseId ? parseInt(houseId) : 2;
  const urlHouseIndex = props.house || ((parsedId >= 1 && parsedId <= 12) ? parsedId : 2);

  const bestCity = props.cities?.highticket?.[0] || props.cities?.acessivel?.[0] || props.cities?.nacional?.[0];
  const cityStr = bestCity ? `${bestCity.city}, ${bestCity.country}` : "Nova York, EUA";

  const P_DYNAMIC = {
    ...P,
    house: urlHouseIndex,
    houseLabel: props.houseName || "Casa",
    city: cityStr,
    coords: bestCity ? `${bestCity.lat?.toFixed(2)}°, ${bestCity.lon?.toFixed(2)}°` : "40.71° N, 74.01° W"
  };
  
  // Cor dinâmica da Casa
  const houseColor = houseThemes[P_DYNAMIC.house]?.themeColor || "#10b981";
  
  const getHeroVideo = (cityName: string) => {
    if (!cityName) return "/assets/particles.mp4";
    
    // Pega só o nome da cidade (antes da vírgula)
    const baseCity = cityName.split(',')[0].trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Mapeamento direto e blindado para evitar problemas de nomeação
    const map: Record<string, string> = {
      "nova york": "new_york.mp4",
      "new york": "new_york.mp4",
      "toquio": "tokyo.mp4",
      "tokyo": "tokyo.mp4",
      "dubai": "dubai.mp4",
      "paris": "paris.mp4",
      "roma": "roma.mov",
      "rome": "roma.mov",
      "londres": "london.mp4",
      "london": "london.mp4",
      "bali": "bali.mp4",
      "amsterda": "amsterdam.mov",
      "amsterdam": "amsterdam.mov",
      "barcelona": "barcelona.mp4",
      "buenos aires": "buenosaires.mp4",
      "atenas": "athens.mp4",
      "athens": "athens.mp4",
      "cairo": "cairo.mp4",
      "florenca": "florence.mp4",
      "florence": "florence.mp4",
      "genebra": "geneva.mp4",
      "geneva": "geneva.mp4",
      "ibiza": "ibiza.mp4",
      "jerusalem": "jerusalem.mp4",
      "kyoto": "kyoto.mp4",
      "quiotto": "kyoto.mp4",
      "las vegas": "las_vegas.mp4",
      "monaco": "monaco.mp4",
      "patagonia": "patagonia.mp4",
      "provence": "provence.mp4",
      "reykjavik": "reykjavik.mp4",
      "santorini": "santorini.mp4",
      "seul": "seoul.mp4",
      "seoul": "seoul.mp4",
      "singapura": "singapore.mp4",
      "singapore": "singapore.mp4",
      "veneza": "venice.mp4",
      "venice": "venice.mp4",
      "zurique": "zurich.mp4",
      "zurich": "zurich.mp4"
    };

    if (map[baseCity]) {
      return `/assets/cities/${map[baseCity]}`;
    }
    
    // Fallback global de estrelas premium
    return "/assets/particles.mp4"; 
  };
  const heroVideoSrc = getHeroVideo(P_DYNAMIC.city);
  const heroCountry = P_DYNAMIC.city.split(', ')[1] || "Destino";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Parallax Block 4
  const block4Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scroll4Progress } = useScroll({ target: block4Ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scroll4Progress, [0, 1], ["-15%", "15%"]);


  const carRef = useRef<HTMLDivElement>(null);
  const scrollCar = (d: number) => carRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [targetLockedArea, setTargetLockedArea] = useState<{ id: string; label: string; color: string; type: 'foco' | 'rota', houseNum?: number } | null>(null);
  // Fallbacks genéricos e atmosféricos baseados no luxo e não em cidades específicas
  const getAtmosphericFallback = (house: number) => {
    const fallbacks: Record<number, string> = {
      1: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1000&q=80",
      2: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1000&q=80",
      3: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
      4: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1000&q=80",
      5: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
      6: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d4?auto=format&fit=crop&w=1000&q=80",
      7: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
      8: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      9: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=80",
      10: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      11: "https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&w=1000&q=80",
      12: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80"
    };
    return fallbacks[house] || fallbacks[2];
  };

  // Extraindo Rotas Alternativas reais do backend para a Casa ativa atual (P_DYNAMIC.house)
  const currentHouseResult = props.allResults ? props.allResults[P_DYNAMIC.house.toString()] : null;
  
  const extractRoute = (tierData: any, fallbackName: string) => {
    if (!tierData) return null;
    // tierData is an array of cities from Python API
    const cityData = Array.isArray(tierData) ? tierData[0] : tierData;
    if (!cityData) return null;
    return {
      ...cityData,
      city: cityData.city || cityData.name || "Destino",
      score: cityData.score || (fallbackName === 'Nacional' ? 96 : fallbackName === 'Acessível' ? 94 : 98),
      img: (cityData.img && cityData.img.startsWith('http')) ? cityData.img : getAtmosphericFallback(P_DYNAMIC.house)
    };
  };

  const htRoute = extractRoute(currentHouseResult?.options?.highticket, 'High-Ticket');
  const acRoute = extractRoute(currentHouseResult?.options?.acessivel, 'Acessível');
  const naRoute = extractRoute(currentHouseResult?.options?.nacional, 'Nacional');

  // Somente usa o props.cities genérico se currentHouseResult não existir E estivermos na mesma casa inicial
  const isInitialHouse = !props.allResults || (props.consultationId && P_DYNAMIC.house === props.house);
  const fallbackNa = isInitialHouse ? props.cities?.nacional : [];
  const fallbackAc = isInitialHouse ? props.cities?.acessivel : [];
  const fallbackHt = isInitialHouse ? props.cities?.highticket : [];
  
  const citiesObj = {
    nacional: naRoute ? [naRoute] : fallbackNa || [],
    acessivel: acRoute ? [acRoute] : fallbackAc || [],
    highticket: htRoute ? [htRoute] : fallbackHt || []
  };

  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  // Find the intended area based on props.intent
  const intendedAreaId = React.useMemo(() => {
    if (!props.intent) return null;
    const matched = [...LIFE_AREAS].find(a => a.id.toLowerCase() === props.intent?.toLowerCase() || a.label.toLowerCase().includes(props.intent?.toLowerCase() || ""));
    return matched ? matched.id : null;
  }, [props.intent]);

  const [hoveredArea, setHoveredArea] = useState<string | null>(intendedAreaId);

  // Force reset hovered focus when the house changes
  React.useEffect(() => {
    setHoveredArea(intendedAreaId);
  }, [P_DYNAMIC.house, intendedAreaId]);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [areas, setAreas] = useState(LIFE_AREAS);
  const [activeDnaTab, setActiveDnaTab] = useState('essencia');
  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [unlockingFocus, setUnlockingFocus] = useState<string | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    const saved = P.unlockedFocuses?.[String(P_DYNAMIC.house)] || [];
    return [defaultFocus, ...saved];
  });
  
  useEffect(() => {
    const defaultFocus = intendedAreaId ? intendedAreaId : Object.keys(LIFE_AREAS)[0];
    const saved = P.unlockedFocuses?.[String(P_DYNAMIC.house)] || [];
    setUnlockedItems([defaultFocus, ...saved]);
  }, [P.unlockedFocuses, P_DYNAMIC.house, intendedAreaId]);
  const [activeDossierCard, setActiveDossierCard] = useState<number | null>(0);
  const baseHouseId = P_DYNAMIC.house as keyof typeof BASE_HOUSE_PROFILES;
  const houseBaseData = (BASE_HOUSE_PROFILES as any)[baseHouseId];

  
  const getHouseImageUrl = (cityName: string, houseId: number, apiImg?: string) => {
    if (apiImg) return apiImg;
    const norm = (cityName||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (norm.includes("nova york")) return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("toquio")) return "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("dubai")) return "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("paris")) return "https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("roma")) return "https://images.unsplash.com/photo-1516483638261-f40889eba30e?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("londres") || norm.includes("london")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("sao paulo") || norm.includes("são paulo")) return "https://images.unsplash.com/photo-1470160710819-b3bd5ec85c66?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("rio de janeiro")) return "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("jerusalem") || norm.includes("jerusale")) return "https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("berlim") || norm.includes("berlin")) return "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=80";
    
    return getAtmosphericFallback(houseId);
  };
  const houseFixedImageUrl = getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img);

  const currentHouseProfiles = (FOCUS_MATRIX as any)[baseHouseId] || {};

  const normalizeKey = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, "");
  
  const gerarDnaText = (sol: string, asc: string, fase: string, dnaOrig: { essencia: string, metodo: string, fase: string }) => {
    if (!dnaOrig || !dnaOrig.essencia) return dnaOrig;
    const solKey = normalizeKey(sol);
    const ascKey = normalizeKey(asc);
    const faseKey = normalizeKey(fase);
    
    const formatSuffix = (text: string) => text ? text.charAt(0).toLowerCase() + text.slice(1) : "";
    
    return {
      essencia: `${prefixosSol[solKey] || "Na sua essência,"} ${formatSuffix(dnaOrig.essencia)}`,
      metodo: `${prefixosAscendente[ascKey] || "Na sua atitude,"} ${formatSuffix(dnaOrig.metodo)}`,
      fase: `${prefixosFase[faseKey] || "Nesta fase da vida,"} ${formatSuffix(dnaOrig.fase)}`
    };
  };

  const mergedAreas = areas.map(area => {
    const focusData = currentHouseProfiles[area.id];
    
    // As per user rule: The 96 combinations in focusMatrix.ts ARE the intended personalized experience!
    // The photo and city are locked, but the Pillars, Timeline, and Ritual MUST adapt to the Focus.
    
    let finalScore = focusData ? (focusData.match || area.score) : area.score;
    
    // O DEVER DA PÁGINA É ENTREGAR O QUE O USUÁRIO PEDIU:
    // Se o usuário escolheu uma intenção específica na consulta, ela deve vencer SEMPRE.
    if (props.intent) {
      const intentNorm = props.intent.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const areaLabelNorm = area.label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const areaIdNorm = area.id.toLowerCase();
      // Se a intenção do banco bater com o ID ou com o Label da área da vida, damos o Score Máximo (999)
      if (areaLabelNorm.includes(intentNorm) || intentNorm.includes(areaLabelNorm.split(' ')[0]) || intentNorm.includes(areaIdNorm)) {
        finalScore = 999;
      }
    }

    if (!focusData) {
      return { ...area, score: finalScore };
    }
    
    const isIntended = (area.id === intendedAreaId);
    return {
      ...area,
      score: finalScore,
      unlocked: isIntended ? true : (area.unlocked || false),
      teaser: focusData.headline || area.teaser,
      full: focusData.headline || area.teaser,
      mantra: focusData.mantra || area.mantra,
      themeData: focusData.theme,
      secretData: focusData.secret,
      blindSpotData: focusData.blindSpot,
      defenseProtocolData: focusData.defenseProtocol,
      dnaData: gerarDnaText(P_DYNAMIC.sign, P_DYNAMIC.ascendant, P_DYNAMIC.phase, DNA_MATRIX[P_DYNAMIC.house]?.[area.id]) || area.dna,
      pillars: focusData.pillars?.map((p: any, i: number) => ({
        icon: area.pillars?.[i]?.icon || area.pillars?.[0]?.icon || Target,
        title: p.title,
        text: p.description
      })) || area.pillars,
      timeline: focusData.phases?.map((p: any, i: number) => ({
        phase: p.title,
        period: `Mês ${i * 4 + 1} a ${(i + 1) * 4}`,
        text: p.description
      })) || area.timeline,
      ritualData: focusData.ritual || area.ritualData
    };
  });



  const sortedAreas = [...mergedAreas].sort((a,b) => {
    const isA = a.id === intendedAreaId;
    const isB = b.id === intendedAreaId;
    if (isA && !isB) return -1;
    if (!isA && isB) return 1;
    return b.score - a.score;
  });
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id)) || sortedAreas[0];

  
  // DEBUG HELPER
  React.useEffect(() => {
    const handleErr = (msg, url, line, col, error) => {
      alert("RUNTIME ERROR: " + msg + " line: " + line);
    };
    window.addEventListener("error", handleErr);
    return () => window.removeEventListener("error", handleErr);
  }, []);

  const [showSummary, setShowSummary] = useState<boolean>(false);

  const casaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: casaProgress } = useScroll({
    target: casaRef,
    offset: ["start 90%", "start 40%"]
  });
  const textScale = useTransform(casaProgress, [0, 1], [1.4, 1]);
  const textOpacity = useTransform(casaProgress, [0, 1], [0, 1]);
  const textBlur = useTransform(casaProgress, [0, 1], ["blur(16px)", "blur(0px)"]);

  return (
    <div className="min-h-screen text-[#f5f5f7] overflow-x-hidden font-sans transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${houseColor} 6%, #03100B)`, "--hc": houseColor, "--hc10": `${houseColor}1a`, "--hc15": `${houseColor}26`, "--hc20": `${houseColor}33`, "--hc30": `${houseColor}4d`, "--hc40": `${houseColor}66`, "--hc70": `${houseColor}b3` } as React.CSSProperties}>
      
      {/* ── NAVBAR PADRÃO (RESPONSIVA) ── */}
      <div className="hidden lg:block">
        <DesktopWebChrome />
      </div>
      <div className="block lg:hidden">
        <MobileAppChrome />
      </div>

      {/* ══════════════════════════════════════════════════
         1. HERO DO VÍDEO (Padrão)
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Vídeo em full brightness */}
        <motion.div style={{ scale: vidScale, opacity: vidOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#03100B] z-10" />
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" key={heroVideoSrc}>
            <source src={heroVideoSrc} type={heroVideoSrc?.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
          </video>
        </motion.div>
        
        <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
           <MapPin className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{heroCountry}</span>
        </div>

        {/* Degradê na base para proteger a transição */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#03100B] to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════════
         2. TEXTO DA CIDADE (Sobreposição Option 1)
         ══════════════════════════════════════════════════ */}
      <section ref={casaRef} className="relative z-20 -mt-[15vh] pb-12 flex flex-col items-center px-6">
        <motion.div style={{ opacity: textOpacity }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-white/70">
            <span>✦</span>
            <span>{P_DYNAMIC.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>
        </motion.div>
        
        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur, color: houseColor, backgroundImage: `linear-gradient(to bottom, ${houseColor}, #a7f3d0)` }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[1] mb-8 pt-2 text-transparent bg-clip-text origin-center uppercase text-center break-words whitespace-normal break-all sm:break-normal px-2"
        >
          {P_DYNAMIC.city.split(', ')[0]}
        </motion.h2>

        <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             {currentActiveData.teaser}
           </p>
        </motion.div>


      </section>

      {/* ══════════════════════════════════════════════════
         3. PERSONALIZAÇÃO (ACORDEÃO)
         ══════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-20 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Reveal className="mb-24 max-w-[1000px] mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
               {/* Fundo glow sutil */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[var(--hc5)] blur-[120px] rounded-full pointer-events-none"></div>
               
               {/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}
               <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[var(--hc)] mb-8">
                    <Sparkles className="w-3 h-3" />
                    <span>Seu Resultado Personalizado</span>
                  </div>
                  
                  <h3 className="text-center mb-16 md:mb-20 flex flex-col items-center gap-2 md:gap-3">
                    <span className="font-ps-display text-2xl md:text-3xl lg:text-4xl text-white/60 font-light tracking-wide">
                      Casa {P_DYNAMIC.house}
                    </span>
                    <span className="font-ps-display text-5xl md:text-7xl lg:text-[80px] text-transparent bg-clip-text bg-gradient-to-r from-[var(--hc)] to-white/50 leading-[1] tracking-tight">
                      Foco em {currentActiveData?.label?.split(" ")[0] }
                    </span>
                  </h3>

                  {/* ======================= PROTOCOLO SOLAR • CASA {P_DYNAMIC.house} (HIGH-END) ======================= */}
                  <div className="w-full max-w-4xl mx-auto mb-20">
                     <div className="bg-black/40 border border-[var(--hc30)] rounded-[32px] overflow-hidden shadow-[0_30px_80px_var(--hc15)] backdrop-blur-xl flex flex-col">
                       {/* Header */}
                       <div 
                         onClick={() => setIsBoardingPassOpen(!isBoardingPassOpen)}
                         className="bg-[var(--hc10)] border-b border-[var(--hc20)] px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-[var(--hc20)] transition-colors select-none"
                       >
                         <div className="flex items-center gap-3">
                           <Plane className="w-5 h-5 text-[var(--hc)]" />
                           <span className="font-ps-display font-bold uppercase tracking-[0.25em] text-[var(--hc)] text-sm">Protocolo Solar • Casa {P_DYNAMIC.house}</span>
                         </div>
                         <div className="flex items-center gap-4 md:gap-6">
                           <div className="flex items-center gap-3 hidden md:flex">
                             <div className="w-2 h-2 rounded-full bg-[var(--hc)] animate-pulse shadow-[0_0_10px_var(--hc)]"></div>
                             <span className="text-[var(--hc90)] font-sans text-xs tracking-widest">{P_DYNAMIC.hash} • ATIVO</span>
                           </div>
                           
                           {!isBoardingPassOpen && (
                             <span className="text-[var(--hc)] text-[10px] uppercase font-bold tracking-widest bg-[var(--hc10)] border border-[var(--hc20)] px-3 py-1.5 rounded-full animate-pulse">
                               Ver Completo
                             </span>
                           )}
                           
                           <div className={`p-1 rounded-full ${!isBoardingPassOpen ? 'bg-[var(--hc10)]' : ''}`}>
                             <ChevronDown className={`w-5 h-5 text-[var(--hc)] transition-transform duration-500 ${isBoardingPassOpen ? 'rotate-180' : ''}`} />
                           </div>
                         </div>
                       </div>

                       {/* Preview Resumo (Aparece apenas quando fechado) */}
                       <AnimatePresence initial={false}>
                         {!isBoardingPassOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden bg-[#02160F]/40 cursor-pointer"
                             onClick={() => setIsBoardingPassOpen(true)}
                           >
                             <div className="px-8 py-5 flex items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                               <div className="flex items-center gap-4 text-sm w-full">
                                  <span className="text-white/90 font-medium">{P_DYNAMIC.firstName}</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">09/08/1985</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">{P_DYNAMIC.sign}</span>
                                  
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="text-[var(--hc)] font-bold flex items-center gap-2">
                                      <Star className="w-4 h-4" />
                                      {P.match}% MATCH
                                    </span>
                                  </div>
                               </div>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                       
                       {/* Body Completo */}
                       <AnimatePresence initial={false}>
                         {isBoardingPassOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                             className="overflow-hidden origin-top"
                           >
                             <div className="p-8 md:p-10 flex flex-col gap-10">
                         {/* Viajante */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Viajante</p>
                           <p className="text-white font-serif text-3xl">{P_DYNAMIC.name}</p>
                         </div>
                         {/* Rota de Ancoragem */}
                         <div className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--hc5)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Rota de Ancoragem</p>
                           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                             <div className="flex-1">
                               <p className="text-white font-medium text-xl md:text-2xl flex items-center gap-2">
                                 <MapPin className="w-5 h-5 text-white/50 shrink-0"/> 
                                 <span className="truncate">{P_DYNAMIC.origin} <span className="text-white/30 text-sm ml-1">(BR)</span></span>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Origem Natal</p>
                             </div>
                             <div className="hidden md:flex flex-col items-center justify-center px-4 w-1/3">
                               <Plane className="w-6 h-6 text-[var(--hc)] opacity-80" />
                               <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>
                             </div>
                             <div className="md:hidden flex items-center gap-4 text-[var(--hc50)] w-full">
                               <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#10b981]/50 to-transparent ml-2.5"></div>
                               <Plane className="w-5 h-5 rotate-90" />
                             </div>
                             <div className="flex-1 md:text-right">
                               <p className="text-[var(--hc)] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2">
                                 <span className="truncate">{P_DYNAMIC.city}</span>
                                 <MapPin className="w-6 h-6 shrink-0"/>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Destino do Aniversário</p>
                             </div>
                           </div>
                         </div>
                         {/* Momento Exato */}
                         <div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Momento Exato da Ativação (Retorno Solar)</p>
                           <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white text-lg md:text-xl font-medium">
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Calendar className="w-5 h-5 text-[var(--hc)]"/> 
                               09 de Agosto, 2027
                             </span>
                             <span className="text-white/20 hidden md:inline">|</span>
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Clock className="w-5 h-5 text-[var(--hc)]"/> 
                               {P_DYNAMIC.time}
                             </span>
                           </div>
                         </div>
                         {/* DNA vs Ativação */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="bg-[var(--hc5)] border border-[var(--hc10)] rounded-2xl p-6">
                             <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-5">DNA Astrológico</p>
                             <div className="space-y-4">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Sun className="w-5 h-5 text-yellow-400"/> Sol em {P_DYNAMIC.sign}
                               </p>
                               <p className="text-white/80 font-medium text-lg flex items-center gap-3">
                                 <ArrowUpCircle className="w-5 h-5 text-purple-400"/> Ascendente {P_DYNAMIC.ascendant}
                               </p>
                             </div>
                           </div>
                           <div className="bg-[var(--hc10)] border border-[var(--hc20)] rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent pointer-events-none"></div>
                             <p className="text-[var(--hc70)] text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10">Ativação Anual</p>
                             <div className="space-y-4 relative z-10">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Landmark className="w-5 h-5 text-[var(--hc)]"/> Casa {P_DYNAMIC.house}
                               </p>
                               <p className="text-[var(--hc)] font-bold text-xl flex items-center gap-3">
                                 <CircleDollarSign className="w-5 h-5"/> {currentActiveData?.label || "Dinheiro & Prosperidade"}
                               </p>
                             </div>
                           </div>
                         </div>
                         {/* Compatibilidade */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 mt-2 gap-4">
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Compatibilidade da Escolha</p>
                           <div className="flex items-center justify-center gap-3 bg-[var(--hc20)] px-6 py-3 rounded-full border border-[var(--hc30)] shadow-[0_0_30px_var(--hc20)]">
                             <div className="w-2.5 h-2.5 rounded-full bg-[var(--hc)] animate-pulse"></div>
                             <span className="text-[var(--hc)] font-bold tracking-widest text-lg">{P.match}% MATCH</span>
                           </div>
                         </div>
                       </div>
                       {/* Footer Barcode */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[var(--hc20)]">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[var(--hc70)] scale-y-150 py-2">||| || ||| | || || |||</div>
                         <span className="font-sans text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar • 24h de Imantação na Cidade de Destino</span>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
                  
{/* Área Desbloqueada & Paywall via Acordeão Estilo Mapeamento 360 */}
                  <div className="w-full mt-10 flex flex-col lg:flex-row gap-6 min-h-[700px] text-left">
                                  {/* COLUNA ESQUERDA: SIDEBAR — expandida por padrão, encolhe pra ícones quando mouse vai pro painel */}
              <div
                className="hidden lg:flex w-[72px] shrink-0 flex-col gap-2 items-stretch min-h-[700px]"
              >
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
                  const isActive = currentActive === area.id;
                  const isUnlockedLocally = props.isHouseUnlocked ? props.isHouseUnlocked(P_DYNAMIC.house) : (area.unlocked || unlockedItems.includes(area.id));

                  return (
                    <div
                      key={area.id}
                      onClick={() => {
                        if (!isUnlockedLocally) {
                          setTargetLockedArea({ id: area.id, label: area.label, color: area.color, type: 'foco', houseNum: P_DYNAMIC.house }); setIsPaywallOpen(true);
                        } else {
                          setHoveredArea(area.id);
                        }
                      }}
                      className="relative flex-1 rounded-2xl border flex items-center justify-center cursor-pointer group transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                        borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.05)',
                        boxShadow: isActive ? `0 0 20px ${area.color}20` : 'none',
                      }}
                    >
                      {/* Aura sutil para o item ativo */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10 rounded-2xl"
                          style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }}
                        />
                      )}
                      <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 z-10"
                          style={{
                            backgroundColor: isActive ? `${area.color}33` : `${area.color}15`,
                            borderColor: isActive ? `${area.color}55` : `${area.color}30`,
                          }}
                      >
                          <area.icon className="w-4 h-4" style={{ color: isActive ? area.color : `${area.color}80` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOBILE: ACCORDION — tap item → barra anima + painel expande inline */}
              <div className="w-full lg:hidden flex flex-col gap-3">
                {sortedAreas.map((area) => {
                  const currentActive = hoveredArea || sortedAreas[0].id;
                  const isActive = currentActive === area.id;
                  const isUnlockedLocally = props.isHouseUnlocked ? props.isHouseUnlocked(P_DYNAMIC.house) : (area.unlocked || unlockedItems.includes(area.id));

                  return (
                    <div key={area.id} className="flex flex-col">
                      {/* Cabeçalho do item (sempre visível) */}
                      <button
                        onClick={() => {
                          if (!isUnlockedLocally) {
                            setTargetLockedArea({ id: area.id, label: area.label, color: area.color, type: 'foco', houseNum: P_DYNAMIC.house }); setIsPaywallOpen(true);
                          } else {
                            setHoveredArea(isActive ? null : area.id);
                          }
                        }}
                        className="relative flex items-center gap-4 p-4 rounded-2xl border overflow-hidden text-left transition-all duration-300"
                        style={{
                          backgroundColor: isActive ? `${area.color}18` : `${area.color}08`,
                          borderColor: isActive ? `${area.color}44` : 'rgba(255,255,255,0.06)',
                          boxShadow: isActive ? `0 0 20px ${area.color}20` : 'none',
                        }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: `linear-gradient(135deg, ${area.color} 0%, transparent 70%)` }} />
                        )}

                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                          style={{ backgroundColor: isActive ? `${area.color}33` : `${area.color}15`, borderColor: isActive ? `${area.color}55` : `${area.color}30` }}
                        >
                          <area.icon className="w-5 h-5" style={{ color: isActive ? area.color : `${area.color}80` }} />
                        </div>

                        <div className="flex-1 min-w-0 relative z-10">
                          <span className={`block font-ps-display text-base font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70'}`}>
                            {area.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                animate={{ width: isActive ? `${area.score}%` : '0%' }}
                                transition={{ duration: 0.8, type: 'spring', bounce: 0.25, delay: isActive ? 0.05 : 0 }}
                                style={{ backgroundColor: area.color }}
                              />
                            </div>
                            <motion.span
                              animate={{ opacity: isActive ? 1 : 0 }}
                              transition={{ duration: 0.3, delay: isActive ? 0.7 : 0 }}
                              className="text-[10px] font-bold tracking-widest shrink-0 text-white"
                            >
                              {area.score}%
                            </motion.span>
                          </div>
                        </div>
                      </button>

                      {/* Painel expandido (aparece só quando ativo) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="relative mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
                              style={{ minHeight: 320 }}
                            >
                              {/* Background colorido */}
                              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${area.color} 0%, transparent 80%)` }} />
                              <div className="absolute inset-0 mix-blend-color opacity-60 pointer-events-none" style={{ backgroundColor: area.color }} />
                              <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${area.color || '#10b981'} 12%, #000000)`}, color-mix(in srgb, ${area.color || '#10b981'} 12%, rgba(0,0,0,0.7)) 50%, transparent)` }} />

                              {/* Conteúdo */}
                              <div className="relative z-10 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-black/20" style={{ borderColor: `${area.color}55` }}>
                                    <area.icon className="w-4 h-4" style={{ color: area.color }} />
                                  </div>
                                  <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.25em]">{area.label}</span>
                                </div>

                                {(area.unlocked || unlockedItems.includes(area.id)) ? (
                                  <>
                                    <h3 className="font-ps-display text-3xl font-bold text-white leading-tight mb-4">{area.label}</h3>
                                    <div className="w-12 h-px mb-4" style={{ backgroundColor: `${area.color}80` }} />
                                    <p className="text-white/80 text-sm font-light leading-relaxed mb-6">{area.full}</p>
                                    <div
                                      className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                                      style={{ backgroundColor: area.color, color: '#fff', boxShadow: `0 0 30px ${area.color}40` }}
                                    >
                                      <Sparkles className="w-4 h-4" />
                                      Foco Ativado ✓
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <h3 className="font-ps-display text-3xl font-bold text-white/20 leading-tight mb-4 select-none" style={{ filter: 'blur(4px)' }}>{area.label}</h3>
                                    <div className="w-12 h-px mb-4 opacity-20" style={{ backgroundColor: `${area.color}80` }} />
                                    <p className="text-white/10 text-sm font-light leading-relaxed mb-6 select-none" style={{ filter: 'blur(6px)' }}>{area.full}</p>
                                    <button onClick={async (e) => { 
                                      e.stopPropagation(); 
                                      if (P.onUnlockFocus) {
                                        setUnlockingFocus(area.id);
                                        try {
                                          await P.onUnlockFocus(area.id, P_DYNAMIC.house);
                                        } catch(err) {}
                                        finally { setUnlockingFocus(null); }
                                      } else {
                                        setUnlockedItems(prev => [...prev, area.id]); 
                                      }
                                    }}
                                    disabled={unlockingFocus === area.id} className="w-full px-6 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 bg-white text-black hover:scale-105 active:scale-95 transition-transform">
    <CreditCard className="w-4 h-4" />
    {unlockingFocus === area.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}
  </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>


              {/* COLUNA DIREITA: O PAINEL GIGANTE (Travado) */}
              <div
                className="flex-1 h-[600px] lg:min-h-[700px] relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || '#10b981'} 12%, #000000)` }}
              >
                <AnimatePresence mode="wait">
                  {sortedAreas.filter(a => a.id === (hoveredArea || sortedAreas[0].id)).map((activeArea) => (
                    <motion.div
                      key={activeArea.id}
                      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-end"
                    >
                      {/* BACKGROUNDS PREMIUM */}
                      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${activeArea.color} 0%, transparent 80%)` }} />
                      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 pointer-events-none" src="/videos/aura-loop.mp4" />
                      <div className="absolute inset-0 mix-blend-color opacity-80 pointer-events-none" style={{ backgroundColor: activeArea.color }} />
                      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${`color-mix(in srgb, ${activeArea?.color || '#10b981'} 12%, #000000)`}, color-mix(in srgb, ${activeArea?.color || '#10b981'} 12%, rgba(0,0,0,0.8)) 50%, transparent)` }} />
                      
                      {/* CONTEÚDO — muda conforme desbloqueio */}
                      <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-end h-full">
                        
                        {/* Ícone + label sempre visível */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-black/20 backdrop-blur-md" style={{ borderColor: `${activeArea.color}55` }}>
                            <activeArea.icon className="w-5 h-5" style={{ color: activeArea.color }} />
                          </div>
                          <span className="text-white/60 text-xs uppercase font-bold tracking-[0.25em]">
                            {activeArea.label}
                          </span>
                        </div>

                        {(activeArea.unlocked || unlockedItems.includes(activeArea.id)) ? (
                          <>
                            {/* DESBLOQUEADO — conteúdo completo */}
                            <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                              {activeArea.label}
                            </h3>
                            <div className="w-16 h-px mb-6" style={{ backgroundColor: `${activeArea.color}80` }} />
                            <p className="text-white/75 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl drop-shadow-md">
                              {activeArea.full}
                            </p>
                            <div
                              className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3"
                              style={{ backgroundColor: activeArea.color, color: '#fff', boxShadow: `0 0 50px ${activeArea.color}80` }}
                            >
                              <Sparkles className="w-4 h-4 shrink-0" />
                              Foco Ativado ✓
                            </div>
                          </>
                        ) : (
                          <>
                            {/* TRANCADO — preview embaçado + botão de crédito */}
                            <h3 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl mb-6">
                              {activeArea.label}
                            </h3>
                            <div className="w-16 h-px mb-6 opacity-20" style={{ backgroundColor: `${activeArea.color}80` }} />
                            <p className="text-white/10 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl select-none" style={{ filter: 'blur(8px)' }}>
                              {activeArea.full}
                            </p>
                            <div className="flex flex-col items-center md:items-start gap-4">
                              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
                                <Lock className="w-4 h-4 text-white/40" />
                                <span className="text-white/50 text-sm font-medium">Conteúdo personalizado bloqueado</span>
                              </div>
                              <button
                                onClick={async (e) => { 
                                  e.stopPropagation(); 
                                  if (P.onUnlockFocus) {
                                    setUnlockingFocus(activeArea.id);
                                    try {
                                      await P.onUnlockFocus(activeArea.id, P_DYNAMIC.house);
                                    } catch(err) {}
                                    finally { setUnlockingFocus(null); }
                                  } else {
                                    setUnlockedItems(prev => [...prev, activeArea.id]); 
                                  }
                                }}
                                disabled={unlockingFocus === activeArea.id}
                                className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
                              >
                                <CreditCard className="w-4 h-4 shrink-0" />
                                {unlockingFocus === activeArea.id ? "Desbloqueando..." : "Desbloquear com 1 Crédito"}
                              </button>
                            </div>
                          </>
                        )}
                        
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

                  </div>
                  
                  {/* ÁREA DE CONTEÚDO DESBLOQUEADO (DOSSIÊ) */}
                  {(currentActiveData?.unlocked || (currentActiveData && unlockedItems.includes(currentActiveData.id))) && (
                    <div className="w-full mt-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${currentActiveData.color}15`, borderColor: `${currentActiveData.color}30` }}>
                          <Target className="w-5 h-5" style={{ color: currentActiveData.color }} />
                        </div>
                        <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight">Os 3 Pilares da Ativação da Casa {P_DYNAMIC.house}</h2>
                      </div>
                      
                      <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                          visible: { transition: { staggerChildren: 0.15 } },
                          hidden: {}
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        {currentActiveData.pillars?.map((pilar, index) => (
                          <motion.div 
                             key={index}
                             variants={{
                               hidden: { opacity: 0, y: 30 },
                               visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                             }}
                             className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-10 hover:bg-white/[0.04] hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group"
                          >
                             <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: `inset 0 0 0 1px ${currentActiveData.color}20` }} />
                             <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 blur-3xl" style={{ backgroundColor: currentActiveData.color }} />
                             
                             <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 shadow-lg" style={{ backgroundColor: `${currentActiveData.color}10`, borderColor: `${currentActiveData.color}30`, boxShadow: `0 10px 20px -10px ${currentActiveData.color}40` }}>
                               <pilar.icon className="w-7 h-7" style={{ color: currentActiveData.color }} />
                             </div>
                             <h3 className="text-2xl font-bold mb-4 tracking-tight transition-colors duration-500 text-white hover-color-magic" style={{ '--hover-color': currentActiveData.color } as React.CSSProperties}>{pilar.title}</h3>
                             <p className="text-white/60 text-base leading-[1.8] font-light">{pilar.text}</p>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* BLOCO 3: O SEU DNA DE ATIVAÇÃO (Borderless Apple Narrative) */}
                      <div className="w-full mt-40">
                        
                        <div className="flex flex-col gap-32 md:gap-40 w-full relative">
                          
                          {/* Elemento 1: Essência (Left Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start text-left max-w-3xl relative z-10"
                          >
                            <span className="font-sans uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              01. Sua Essência
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Sol em Leão.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dnaData?.essencia || currentActiveData.dna?.essencia}
                            </p>
                          </motion.div>

                          {/* Elemento 2: Método (Right Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-end text-left md:text-right max-w-3xl self-end relative z-10"
                          >
                            <span className="font-sans uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              02. Seu Método
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Ascendente <br className="hidden md:block" />em Virgem.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dnaData?.metodo || currentActiveData.dna?.metodo}
                            </p>
                          </motion.div>

                          {/* Elemento 3: Fase Atual (Center Aligned) */}
                          <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-start md:items-center text-left md:text-center max-w-4xl self-center relative z-10 mt-10"
                          >
                            <span className="font-sans uppercase tracking-[0.3em] text-xs md:text-sm mb-6" style={{ color: currentActiveData.color }}>
                              03. Fase Atual
                            </span>
                            <h3 className="font-ps-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-none">
                              Maturidade.
                            </h3>
                            <p className="text-white/60 text-xl md:text-3xl font-light leading-relaxed">
                              {currentActiveData.dnaData?.fase || currentActiveData.dna?.fase}
                            </p>
                          </motion.div>

                          {/* Fundo Atmosférico abstrato para amarrar os textos */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] opacity-10 pointer-events-none blur-[150px] -z-10" style={{ backgroundColor: currentActiveData.color }} />
                        </div>

                      </div>

{/* BLOCO 4: O PLANO DE ATIVAÇÃO MESTRE (SIMÉTRICO & DIGESTÍVEL) */}
                      <div ref={block4Ref} className="w-full mt-40 max-w-[1400px] mx-auto mb-32 relative px-4 md:px-8">
                        {(() => {
                          const sentences = (houseBaseData?.understand || currentActiveData.cityDesc || "").split(". ").filter(Boolean);
                          const quote = sentences[0] ? sentences[0].trim() + (sentences[0].endsWith('.') ? '' : '.') : "";
                          const beneficios = sentences[1] ? sentences[1].trim() + (sentences[1].endsWith('.') ? '' : '.') : "";
                          const paraQuem = sentences[2] ? sentences[2].trim() + (sentences[2].endsWith('.') ? '' : '.') : "";
                          const activeColor = currentActiveData?.color || '#C9A227';
                          
                          // Animações
                          const containerVariants = {
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
                          };
                          const itemVariants = {
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                          };

                          return (
                            <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
                              
                              {/* O CABEÇALHO DO BLOCO */}
                              <motion.div variants={itemVariants} className="w-full flex justify-center mb-8">
                                <h3 className="font-sans text-[11px] md:text-sm tracking-[0.4em] uppercase font-bold" style={{ color: activeColor }}>
                                  Ativação da Casa {P_DYNAMIC.house}
                                </h3>
                              </motion.div>

                              {/* 1. O HERO: Foto Panorâmica com Hierarquia Focada */}
                              <motion.div variants={itemVariants} className="w-full h-[50vh] min-h-[450px] md:h-[65vh] rounded-[40px] overflow-hidden relative shadow-2xl mb-12 border border-white/10 group">
                                  <motion.img 
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    src={houseFixedImageUrl} 
                                    alt={P_DYNAMIC.city} 
                                    className="w-full h-full object-cover object-center" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-[#030306]/50 to-transparent"></div>
                                  
                                  <div className="absolute bottom-10 md:bottom-16 left-0 right-0 z-10 flex flex-col items-center text-center px-6">
                                    <motion.h1 
                                      initial={{ opacity: 0, y: 30 }} 
                                      whileInView={{ opacity: 1, y: 0 }} 
                                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                      className="font-ps-display text-5xl md:text-8xl text-white mb-3 tracking-tight drop-shadow-2xl uppercase"
                                    >
                                      {P_DYNAMIC.city}
                                    </motion.h1>
                                    <motion.p 
                                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} 
                                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
                                      transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                      className="font-ps-ui text-lg md:text-[24px] font-light tracking-wide drop-shadow-md text-white/90 max-w-3xl leading-[1.4]"
                                    >
                                      {quote}
                                    </motion.p>
                                  </div>
                              </motion.div>

                              {/* 2. OS BLOCOS DE CONTEÚDO (Expanding Bento Grid Perfeito) */}
                              <div className="flex flex-col gap-6 lg:gap-8 relative z-10 max-w-6xl mx-auto w-full">
                                 {/* Glow de fundo */}
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] blur-[150px] opacity-10 pointer-events-none" style={{ backgroundColor: activeColor }}></div>
                                 
                                 {(() => {
                                   const cardData = [
                                     {
                                       id: 0,
                                       title: "O Efeito",
                                       subtitle: "A vibração desse destino",
                                       icon: <MapPin className="w-8 h-8" />,
                                       content: (
                                          <div className="flex flex-col h-full w-full min-w-0 max-w-[500px] justify-center relative">
                                            {/* Marca d'água sutil para preencher o vazio sem poluir */}
                                            <Sparkles className="absolute -bottom-4 -right-4 w-48 h-48 opacity-[0.03] pointer-events-none" style={{ color: activeColor }} />
                                            
                                            <div className="relative z-10 flex flex-col gap-6 md:gap-8">
                                              <div>
                                                <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] block mb-3 md:mb-4" style={{ color: activeColor }}>
                                                  Benefício Central
                                                </span>
                                                <p className="font-ps-display text-white/95 text-[22px] sm:text-[26px] md:text-[28px] leading-[1.1] tracking-tight pr-4">
                                                  <AppleHighlightText text={beneficios} activeColor={activeColor} />
                                                </p>
                                              </div>
                                              
                                              {/* Transferido do Card 2 - O Momento Ideal */}
                                              <div className="pt-5 md:pt-6 border-t border-white/[0.04]">
                                                <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-bold text-white/30 block mb-2">O Momento Ideal</span>
                                                <p className="font-ps-ui text-white/50 text-[13px] md:text-[14px] leading-relaxed font-light pr-4">
                                                  <AppleHighlightText text={paraQuem} activeColor={activeColor} />
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                       )
                                     },
                                     {
                                       id: 1,
                                       title: "O Objetivo",
                                       subtitle: "A dinâmica no dia a dia",
                                       icon: <Target className="w-8 h-8" />,
                                       content: (
                                          <div className="flex flex-col justify-center h-full w-full min-w-0 max-w-[500px]">
                                            <div className="flex flex-col gap-5 md:gap-6 pr-2 md:pr-6">
                                              {/* Badge estilo iOS */}
                                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-lg w-fit backdrop-blur-sm">
                                                <Target className="w-3 h-3" style={{ color: activeColor }} />
                                                <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: activeColor }}>Na Prática</span>
                                              </div>
                                              
                                              {/* Texto Principal (Manchete Apple) */}
                                              <p className="font-ps-display text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 text-[20px] md:text-[24px] leading-[1.2] tracking-tight pr-2">
                                                <AppleHighlightText text={houseBaseData?.realDynamics || "O cotidiano se alinha perfeitamente com a energia do local."} activeColor={activeColor} gradientParent={true} />
                                              </p>
                                            </div>
                                          </div>
                                       )
                                     },
                                     {
                                       id: 2,
                                       title: "A Chave",
                                       subtitle: "O Segredo do Ciclo",
                                       icon: <Sparkles className="w-8 h-8" />,
                                       content: (
                                          <div className="flex flex-col gap-10 w-full min-w-0 max-w-[450px]">
                                            <div>
                                              <span className="font-sans text-[10px] tracking-[0.2em] uppercase block mb-4 text-white/40">Foco do Novo Ciclo</span>
                                              <p className="font-ps-display text-white text-3xl sm:text-4xl leading-tight">
                                                <AppleHighlightText text={currentActiveData.themeData || "Consolidação e Crescimento"} activeColor={activeColor} />
                                              </p>
                                            </div>
                                            
                                            <div>
                                              <span className="font-sans text-[10px] tracking-[0.2em] uppercase block mb-3" style={{ color: activeColor }}>A Chave Oculta</span>
                                              <p className="font-ps-ui text-white/80 text-[16px] leading-[1.6] font-light">
                                                <AppleHighlightText text={currentActiveData.secretData || "A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico."} activeColor={activeColor} />
                                              </p>
                                            </div>
                                          </div>
                                       )
                                     },
                                     {
                                       id: 3,
                                       title: "O Ritual",
                                       subtitle: "Ativação em 24h",
                                       icon: <Compass className="w-8 h-8" />,
                                       content: (
                                          <div className="flex flex-col w-full min-w-0 max-w-[500px] justify-center h-full">
                                            <span className="font-sans text-[10px] md:text-[11px] uppercase font-bold tracking-[0.3em] block mb-6 md:mb-10" style={{ color: activeColor }}>Guia de Ativação</span>
                                            
                                            {/* Apple Giant Numbers Layout */}
                                            <div className="flex flex-col gap-6 md:gap-8">
                                               {[
                                                 currentActiveData.ritualData?.step1 || 'Sintonize a intenção.',
                                                 currentActiveData.ritualData?.step2 || 'Faça uma ação física.',
                                                 currentActiveData.ritualData?.step3 || 'Ancore na cidade.'
                                               ].map((step, idx) => (
                                                 <div key={idx} className="flex items-start gap-5 md:gap-6">
                                                   <span 
                                                     className="font-ps-display text-[40px] md:text-[56px] leading-[0.75] tracking-tighter opacity-90 flex-shrink-0 mt-1" 
                                                     style={{ 
                                                       color: activeColor, 
                                                       textShadow: `0 4px 24px ${activeColor}50` 
                                                     }}
                                                   >
                                                     0{idx + 1}
                                                   </span>
                                                   <div className="pt-1">
                                                     <p className="font-ps-ui text-white/90 text-[15px] md:text-[16px] leading-relaxed font-light pr-2">
                                                       <AppleHighlightText text={step} activeColor={activeColor} />
                                                     </p>
                                                   </div>
                                                 </div>
                                               ))}
                                            </div>
                                          </div>
                                       )
                                     }
                                   ];

                                   const ExpandingRow = ({ cardsRow }: { cardsRow: typeof cardData }) => {
                                      const [activeCardId, setActiveCardId] = useState<number | null>(null);

                                      return (
                                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full lg:h-[450px]">
                                           {cardsRow.map((card) => {
                                              const isHovered = activeCardId === card.id;
                                              const isNeighborHovered = activeCardId !== null && activeCardId !== card.id;

                                              return (
                                                <motion.div
                                                   key={card.id}
                                                   onMouseEnter={() => window.innerWidth >= 1024 && setActiveCardId(card.id)}
                                                   onMouseLeave={() => window.innerWidth >= 1024 && setActiveCardId(null)}
                                                   onClick={() => window.innerWidth < 1024 && setActiveCardId(isHovered ? null : card.id)}
                                                   initial={false}
                                                   animate={{ 
                                                     flex: (typeof window !== 'undefined' && window.innerWidth >= 1024) 
                                                              ? (isHovered ? 2.5 : isNeighborHovered ? 0.8 : 1) 
                                                              : 1,
                                                     height: (typeof window !== 'undefined' && window.innerWidth < 1024)
                                                              ? (isHovered ? "auto" : "250px")
                                                              : "100%"
                                                   }}
                                                   transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                   className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden cursor-pointer shadow-2xl flex-shrink-0"
                                                >
                                                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none z-0"></div>
                                                   
                                                   {/* Estado: CAPA (Desaparece no hover/tap) */}
                                                   <motion.div 
                                                     animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.95 : 1 }}
                                                     transition={{ duration: 0.5 }}
                                                     className="absolute inset-0 p-8 md:p-12 flex flex-col items-center justify-center text-center z-20 pointer-events-none bg-[#030306]/40 backdrop-blur-sm"
                                                   >
                                                      <div className="p-4 rounded-full bg-white/5 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]" style={{ color: activeColor }}>
                                                        {card.icon}
                                                      </div>
                                                      <h3 className="font-ps-display text-3xl md:text-4xl text-white mb-3" style={{ opacity: isNeighborHovered ? 0.3 : 1, transition: 'opacity 0.5s' }}>{card.title}</h3>
                                                      <span className="font-ps-ui text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">{card.subtitle}</span>
                                                   </motion.div>

                                                   {/* Estado: CONTEÚDO (Aparece no hover/tap) */}
                                                   <motion.div 
                                                     animate={{ opacity: isHovered ? 1 : 0 }}
                                                     transition={{ duration: 0.6, delay: isHovered ? 0.1 : 0 }}
                                                     className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center z-10 ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                                   >
                                                      {card.content}
                                                   </motion.div>
                                                </motion.div>
                                              );
                                           })}
                                        </div>
                                      );
                                   };

                                   return (
                                     <>
                                       <ExpandingRow cardsRow={[cardData[0], cardData[1]]} />
                                       <ExpandingRow cardsRow={[cardData[2], cardData[3]]} />
                                     </>
                                   );
                                 })()}
                              </div>
                            </motion.div>
                          );
                        })()}
                      </div>

                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}
                      <div className="w-full max-w-6xl mx-auto mt-32 mb-48 px-6 text-center flex flex-col items-center relative">
                        {/* Glow suave de fundo para ancorar o texto */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex items-center gap-3 mb-10 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                             <Sparkles className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                             <span className="font-sans text-xs tracking-[0.2em] uppercase font-bold" style={{ color: currentActiveData?.color || '#10b981' }}>O Mantra de Ativação</span>
                          </div>
                          
                          <p className="text-4xl md:text-6xl lg:text-7xl font-ps-display font-bold tracking-tighter leading-[1.1] md:leading-[1.15] bg-clip-text text-transparent pb-2 max-w-5xl"
                             style={{ backgroundImage: `linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 40%, ${currentActiveData?.color || '#10b981'} 100%)` }}>
                            "{currentActiveData?.mantra}"
                          </p>
                        </div>
                      </div>

                      {/* BLOCO 5: A LINHA DO TEMPO (ACCORDION) */}
                      <div className="w-full mt-40 max-w-4xl mx-auto mb-32">
                        <div className="text-center mb-24">
                          <h2 className="font-ps-display text-4xl md:text-6xl font-bold tracking-tighter mb-6">A Evolução da Casa {P_DYNAMIC.house}</h2>
                          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Como a energia da cidade trabalha o seu foco em <strong className="text-white font-medium">{currentActiveData.label}</strong> ao longo do novo ciclo.
                          </p>
                        </div>

                        <div className="flex flex-col border-t border-white/10">
                          {currentActiveData.timeline?.map((phase, index) => {
                            const isOpen = openTimelinePhase === index;
                            return (
                              <div key={index} className="border-b border-white/10 flex flex-col group">
                                <button 
                                  onClick={() => setOpenTimelinePhase(isOpen ? null : index)}
                                  className="w-full py-10 md:py-14 flex flex-col md:flex-row md:items-center justify-between text-left transition-colors duration-500 hover:bg-white/[0.02]"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 w-full px-4 md:px-8">
                                    <span 
                                      className="font-sans text-sm tracking-[0.2em] uppercase transition-colors duration-500 w-40 shrink-0" 
                                      style={{ color: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.4)' }}
                                    >
                                      {phase.period}
                                    </span>
                                    <h3 className={`font-ps-display text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-500 ${isOpen ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                                      {phase.phase}
                                    </h3>
                                  </div>
                                  <div className="hidden md:flex shrink-0 ml-4 mr-8 w-12 h-12 items-center justify-center rounded-full border transition-all duration-500" style={{ borderColor: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.1)', backgroundColor: isOpen ? `${currentActiveData.color}10` : 'transparent' }}>
                                     <Plus className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} style={{ color: isOpen ? currentActiveData.color : 'rgba(255,255,255,0.4)' }} />
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pb-14 px-4 md:pl-[14rem] md:pr-12">
                                         <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-light">{phase.text}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {/* BLOCO 6: O PONTO CEGO (AMEAÇA CRÍTICA - V2) */}
                      <div className="w-full max-w-5xl mx-auto mt-40 mb-32 px-6">
                        <div className="bg-[#020202] rounded-3xl border border-red-900/30 p-1 md:p-1.5 relative overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.15)]">
                          
                          {/* Pulsing subtle glow */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] blur-[8px] bg-red-600"></div>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-red-500"></div>

                          <div className="bg-[#050505] rounded-[28px] p-8 md:p-16 relative z-10 flex flex-col items-center text-center border border-white/[0.02]">
                            
                            <div className="flex items-center gap-3 mb-10 px-5 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                               <span className="font-sans text-[10px] tracking-widest uppercase text-red-400 font-bold">O Ponto Cego</span>
                            </div>
                            
                            <h3 className="font-ps-display text-4xl md:text-6xl font-bold text-white mb-10 tracking-tighter">
                              O Ponto Cego.
                            </h3>
                            
                            <p className="text-red-50/70 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mb-14">
                              {currentActiveData.blindSpotData || "A euforia desta configuração atrai oportunidades, mas também um impulso irresistível para o desperdício."}
                            </p>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-14"></div>
                            
                            <div className="text-left w-full max-w-3xl bg-black/40 p-8 rounded-2xl border border-red-900/20">
                               <div className="flex items-center gap-3 mb-6 border-b border-red-900/30 pb-4">
                                 <ShieldAlert className="w-5 h-5 text-red-500" />
                                 <span className="font-sans text-xs tracking-[0.2em] uppercase text-red-500 font-bold">Protocolo de Defesa</span>
                               </div>
                               <p className="text-white text-xl md:text-2xl font-serif italic leading-relaxed">
                                 "{currentActiveData.defenseProtocolData || 'Congele 30% de todo lucro novo no momento em que ele tocar a sua conta, antes de tomar qualquer decisão de gasto.'}"
                               </p>
                            </div>

                          </div>
                        </div>
                      </div>


                    </div>
                  )}
               </div>
            </div>
          
            {/* BLOCO 7: ROTAS ALTERNATIVAS (Cidades Extras) */}
            <div className="w-full max-w-5xl mx-auto mt-20 mb-32 px-6">
              <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
                <Compass className="w-8 h-8 text-white/50" />
                <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tighter text-white">
                  Rotas Alternativas
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Nacional", desc: "Acessível e perto de você", data: citiesObj.nacional },
                  { title: "Acessível", desc: "Viagem internacional viável", data: citiesObj.acessivel },
                  { title: "High Ticket", desc: "Destino de alto padrão", data: citiesObj.highticket }
                ].map((tier, idx) => (
                  <div key={idx} className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-bold border" style={{ backgroundColor: `${currentActiveData?.color || '#10b981'}15`, color: currentActiveData?.color || '#10b981', borderColor: `${currentActiveData?.color || '#10b981'}30` }}>{idx+1}</div>
                      <div>
                        <h4 className="font-bold text-xl text-white tracking-tight">{tier.title}</h4>
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{tier.desc}</p>
                      </div>
                    </div>
                    {tier.data.length > 0 ? tier.data.map((city, i) => (
                      <div key={i} className="bg-black border rounded-[28px] overflow-hidden transition-all group relative h-56 flex flex-col justify-end p-6 cursor-pointer" style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = currentActiveData?.color || '#10b981'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                      >
                        <div className="absolute inset-0">
                          <img src={city.img} alt={city.city} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000 ease-[0.19,1,0.22,1]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                        </div>
                        <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                          <div className="flex justify-between items-end mb-3">
                            <h5 className="font-ps-display text-2xl font-bold text-white transition-colors">{city.city || city.name || "Destino Desconhecido"}</h5>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                              <MapPin className="w-4 h-4" style={{ color: currentActiveData?.color || '#10b981' }} />
                              <span className="uppercase tracking-widest text-[10px]">{city.country}</span>
                            </div>
                            <span className="font-sans text-[10px] font-bold px-3 py-1.5 rounded-full border" style={{ backgroundColor: `${currentActiveData?.color || '#10b981'}15`, color: currentActiveData?.color || '#10b981', borderColor: `${currentActiveData?.color || '#10b981'}30` }}>{city.score}% MATCH</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="border border-dashed border-white/10 rounded-[28px] h-56 flex flex-col items-center justify-center p-6 text-center bg-white/[0.02] backdrop-blur-sm">
                         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
                           <Lock className="w-5 h-5 text-white/20" />
                         </div>
                         <span className="font-ps-display text-sm font-bold text-white/50 mb-1">Em breve</span>
                         <span className="text-white/25 text-[10px] leading-relaxed max-w-[200px]">Nosso sistema está calculando a melhor rota para o seu perfil.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCO 8: VISÃO COMPLETA (A Grade de Upsell) */}
            <div className="w-full max-w-6xl mx-auto mt-32 mb-40 px-6">
              <div className="flex flex-col items-center text-center mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] opacity-10 bg-white pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-8 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                  <Sparkles className="w-4 h-4 text-white/50" />
                  <span className="font-sans text-[10px] tracking-widest uppercase text-white/70 font-bold">Visão 360º</span>
                </div>
                <h2 className="font-ps-display text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8">
                  Expanda o Seu Mapa.
                </h2>
                <p className="text-white/50 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Você desbloqueou a Rota principal para: <strong className="text-white font-medium">{cityDatabase[P_DYNAMIC.house as keyof typeof cityDatabase]?.name?.split('—')[1]?.trim() || P_DYNAMIC.houseLabel}</strong>. Descubra quais cidades do mundo ativam a sua saúde, seu amor e as outras 11 dimensões da sua vida.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
                  const isCurrent = num === P_DYNAMIC.house;
                  const dbData = cityDatabase[num as keyof typeof cityDatabase];
                  const label = dbData?.name?.split('—')[1]?.trim() || dbData?.label || "Área da Vida";
                  const isUnlocked = props.isHouseUnlocked ? props.isHouseUnlocked(num) : (isCurrent || unlockedItems.includes(num.toString()));
                  
                  
                  const resultForHouse = props.allResults && props.allResults[num.toString()];
                  const fallbackCity = "Desconhecido";
                  const mappedCityName = resultForHouse && resultForHouse.city ? resultForHouse.city.city : fallbackCity;
                  
                  const cityForThisHouse = isCurrent ? P_DYNAMIC.city.split(", ")[0] : (isUnlocked ? mappedCityName.split(", ")[0] : "Bloqueado");
                  const rawImg = resultForHouse?.options?.highticket?.img;
                  const imageForThisHouse = rawImg 
                    ? (rawImg.startsWith("http") ? rawImg : `https://images.unsplash.com/photo-${rawImg}?auto=format&fit=crop&w=1000&q=80`) 
                    : getAtmosphericFallback(num);
                  const areaColor = houseThemes[num]?.themeColor || '#10b981';

                  return (
                    <div 
                      key={num}
                      onClick={() => {
                        if (!isUnlocked) {
                          setTargetLockedArea({ label: label, color: areaColor, id: num.toString(), type: 'rota', houseNum: num }); setIsPaywallOpen(true);
                        } else if (!isCurrent && props.onSelectHouse) {
                          props.onSelectHouse(num);
                        }
                      }}
                      className={`relative rounded-[32px] border transition-all duration-500 ease-[0.19,1,0.22,1] overflow-hidden flex flex-col group h-[260px] ${
                        isCurrent 
                          ? 'bg-[#050505] border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] scale-[1.02]' 
                          : isUnlocked 
                            ? 'bg-[#050505] cursor-pointer hover:border-white/20'
                            : 'bg-[#050505] border-white/5 hover:border-white/20 hover:bg-white/[0.02] cursor-pointer p-6 justify-between'
                      }`}
                      style={{ borderColor: isUnlocked && !isCurrent ? `${areaColor}30` : undefined }}
                    >
                      {isUnlocked ? (
                        <>
                          {/* FOTO TOP (Corte Seco) */}
                          <div className="relative h-[130px] w-full shrink-0 overflow-hidden bg-[#050505]">
                            <img src={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} onError={(e) => { e.currentTarget.src = getAtmosphericFallback(num); }} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                            {isCurrent && (
                              <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                            )}
                          </div>
                          
                          {/* TEXT BOTTOM (Fundo colorido sólido e reto) */}
                          <div className="flex flex-col flex-1 px-6 pb-6 pt-5 justify-end relative overflow-hidden">
                            {/* Tarja com a cor da casa */}
                            {(!isCurrent) && (
                              <div className="absolute inset-0 z-0 opacity-25" style={{ backgroundColor: areaColor }}></div>
                            )}
                            
                            <div className="relative z-10 flex items-center justify-between mb-2">
                              <span className="font-sans text-[10px] tracking-widest uppercase font-bold" style={{ color: isCurrent ? 'white' : areaColor }}>Casa {num}</span>
                              <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-white/80">{cityForThisHouse}</span>
                            </div>
                            <h3 className="relative z-10 font-ps-display text-2xl leading-[1.1] font-bold tracking-tight text-white pr-2">{label}</h3>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* LOCKED STATE */}
                          <div className="relative z-10 flex justify-between items-start">
                            <div>
                              <span className="font-sans text-[10px] tracking-widest uppercase font-bold block mb-2 text-white/30">Casa {num}</span>
                              <h3 className="font-ps-display text-2xl leading-[1.1] font-bold tracking-tight text-white/60 group-hover:text-white pr-2">{label}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center shrink-0 transition-colors duration-500 group-hover:border-white/20">
                              <Lock className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
                            </div>
                          </div>

                          <div className="relative z-10 mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Destino Restrito</span>
                            <span className="font-bold text-white/20 text-base">Bloqueado</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

</Reveal>
        </div>
      </section>
      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        isEmbedded={!!props.onUnlock}
        userCredits={props.userCredits}
        onClose={() => setIsPaywallOpen(false)} 
        onSuccess={(id, purchaseType) => {
          if (props.onUnlock && targetLockedArea?.houseNum) {
             // Se purchaseType for 'full', passamos 0 como flag de Unlock All
             props.onUnlock(purchaseType === 'full' ? 0 : targetLockedArea.houseNum);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
             // Sandbox / Preview mode behavior
             if (purchaseType === 'single') {
               setUnlockedItems(prev => [...prev, id]);
               if (targetLockedArea?.type === 'foco') {
                 setHoveredArea(id);
               }
             } else {
               // Full unlock (all 12 houses and focuses)
               const allIds = [
                 ...LIFE_AREAS.map(a => a.id),
                 ..."1,2,3,4,5,6,7,8,9,10,11,12".split(',')
               ];
               setUnlockedItems(allIds);
               if (targetLockedArea?.type === 'foco') {
                 setHoveredArea(id);
               }
             }
          }
        }}
        targetArea={targetLockedArea} 
      />
      <style dangerouslySetInnerHTML={{__html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
