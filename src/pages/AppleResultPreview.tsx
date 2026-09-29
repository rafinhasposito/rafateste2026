import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { cityDatabase } from "@/data/houses";
import UnlockPremiumModal from "@/components/UnlockPremiumModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";
import { MobileAppChrome } from "@/layouts/MobileAppChrome";
import { MapPin, ArrowUpCircle, Landmark, CircleDollarSign, ChevronDown, ChevronRight, ChevronLeft, Lock, Sparkles, AlertTriangle, ArrowUpRight, Heart, Users, Briefcase, DollarSign, Leaf, Calendar, Crown, Star, Zap, Sun, Target, Shield, ShieldAlert, Eye, Clock, Hourglass, BookOpen, Plane, QrCode, Fingerprint, Hash, CreditCard, Compass, Plus } from "lucide-react";

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
  city: "Nova Iorque", coords: "40.71° N, 74.01° W", origin: "Surubim",
  house: 2, houseLabel: "Recursos", houseTitle: "Dinheiro, Materialização e Valor",
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
    id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#10b981", score: 98, unlocked: true, 
    teaser: "O magnetismo deste destino destrava a sua capacidade de atrair e materializar recursos.", 
    city: "Tóquio, Japão",
    cityDesc: "Uma metrópole onde a eficiência cirúrgica encontra o caos vibrante. Tóquio pulsa com uma energia de disciplina e hiperprodutividade, criando o terreno magnético exato para quem precisa transformar metas dispersas em lucro previsível.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop",
    dna: {
      essencia: "O seu magnetismo natural e a sua autonomia são os seus maiores ativos. Na área de Dinheiro e Recursos, a energia desta cidade entra em ressonância com a sua essência para atrair resultados com velocidade absoluta.",
      metodo: "A mente analítica trabalha a seu favor. O universo facilita que você organize o caos e execute processos com disciplina, método impecável e visão cirúrgica de longo prazo.",
      fase: "A ambição cede lugar à sabedoria prática. O objetivo astrológico agora não é a ostentação superficial, mas a construção definitiva de um porto seguro, previsibilidade e estabilidade real."
    },
    ritual: "Compre um item simbólico de alto valor (mesmo que pequeno) usando dinheiro físico. Este objeto será o seu amuleto. Durante a transação, afirme mentalmente que aquele é o último investimento do seu antigo ciclo de escassez.",
    mantra: "Eu comando a minha autonomia. O dinheiro flui até mim não por sorte, mas como consequência inevitável da minha excelência.",
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
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
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

export default function AppleResultPreview() {
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
  const houseData = cityDatabase[P.house] || cityDatabase[2];
  const citiesObj = {
    nacional: [
      { city: "São Paulo", country: "Brasil", score: 96, lat: -23.55, lon: -46.63 },
      { city: "Florianópolis", country: "Brasil", score: 93, lat: -27.59, lon: -48.55 },
    ],
    acessivel: [
      { city: "Santiago", country: "Chile", score: 94, lat: -33.45, lon: -70.67 },
      { city: "Buenos Aires", country: "Argentina", score: 92, lat: -34.60, lon: -58.38 },
    ],
    highticket: [
      { city: "Dubai", country: "Emirados Árabes", score: 98, lat: 25.20, lon: 55.27 },
      { city: "Tóquio", country: "Japão", score: 97, lat: 35.68, lon: 139.69 },
    ],
  };
  const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string | null>("dinheiro");
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [areas, setAreas] = useState(LIFE_AREAS);
  const [activeDnaTab, setActiveDnaTab] = useState('essencia');
  const [openTimelinePhase, setOpenTimelinePhase] = useState<number | null>(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [targetLockedArea, setTargetLockedArea] = useState<{label: string, color: string, id: string} | null>(null);
  const userCredits = 9561;
  const sortedAreas = [...areas].sort((a,b) => b.score - a.score);
  const currentActiveData = sortedAreas.find(a => a.id === (hoveredArea || sortedAreas[0].id));
  
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
    <div className="min-h-screen text-[#f5f5f7] overflow-x-hidden font-sans transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || '#10b981'} 6%, #03100B)` }}>
      
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
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/assets/ny.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute top-20 md:top-24 right-6 md:right-10 z-20 flex items-center gap-2 text-white/50">
           <MapPin className="w-3.5 h-3.5" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">EUA</span>
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
            <span>{P.firstName}, o seu próximo aniversário pode ser em...</span>
          </div>
        </motion.div>
        
        <motion.h2
          style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}
          className="font-ps-display text-[20vw] md:text-[160px] font-bold tracking-tighter leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] to-emerald-200 origin-center uppercase text-center"
        >
          {P.city}
        </motion.h2>

        <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             O destino exato para{" "}
             <span className="text-[#10b981] font-medium block mt-1 md:inline md:mt-0">{HOUSE_CINEMATIC_TEXTS[P.house]}</span>
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
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none"></div>
               
               {/* A GRANDE DIVISÃO DA PERSONALIZAÇÃO */}
               <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-8">
                    <Sparkles className="w-3 h-3" />
                    <span>Seu Resultado Personalizado</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-ps-display font-bold text-center mb-4">O foco é <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-300">{P.intention}</span>.</h3>
                  <p className="text-white/50 text-center text-lg max-w-2xl mx-auto mb-16">
                    A Casa {P.house} foi calculada sob medida para ser a chave exata que destrava o seu objetivo no novo ciclo.
                  </p>

                  {/* ======================= BOARDING PASS SOLAR (HIGH-END) ======================= */}
                  <div className="w-full max-w-4xl mx-auto mb-20">
                     <div className="bg-black/40 border border-[#10b981]/30 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl flex flex-col">
                       {/* Header */}
                       <div 
                         onClick={() => setIsBoardingPassOpen(!isBoardingPassOpen)}
                         className="bg-[#10b981]/10 border-b border-[#10b981]/20 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-[#10b981]/20 transition-colors select-none"
                       >
                         <div className="flex items-center gap-3">
                           <Plane className="w-5 h-5 text-[#10b981]" />
                           <span className="font-ps-display font-bold uppercase tracking-[0.25em] text-[#10b981] text-sm">Boarding Pass Solar</span>
                         </div>
                         <div className="flex items-center gap-4 md:gap-6">
                           <div className="flex items-center gap-3 hidden md:flex">
                             <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]"></div>
                             <span className="text-[#10b981]/90 font-mono text-xs tracking-widest">{P.hash} • ATIVO</span>
                           </div>
                           
                           {!isBoardingPassOpen && (
                             <span className="text-[#10b981] text-[10px] uppercase font-bold tracking-widest bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-full animate-pulse">
                               Ver Completo
                             </span>
                           )}
                           
                           <div className={`p-1 rounded-full ${!isBoardingPassOpen ? 'bg-[#10b981]/10' : ''}`}>
                             <ChevronDown className={`w-5 h-5 text-[#10b981] transition-transform duration-500 ${isBoardingPassOpen ? 'rotate-180' : ''}`} />
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
                                  <span className="text-white/90 font-medium">{P.firstName}</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">09/08/1985</span>
                                  <span className="text-white/20">|</span>
                                  <span className="text-white/70">{P.sign}</span>
                                  
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="text-[#10b981] font-bold flex items-center gap-2">
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
                           <p className="text-white font-serif text-3xl">{P.name}</p>
                         </div>
                         {/* Rota de Ancoragem */}
                         <div className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6">Rota de Ancoragem</p>
                           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                             <div className="flex-1">
                               <p className="text-white font-medium text-xl md:text-2xl flex items-center gap-2">
                                 <MapPin className="w-5 h-5 text-white/50 shrink-0"/> 
                                 <span className="truncate">{P.origin} <span className="text-white/30 text-sm ml-1">(BR)</span></span>
                               </p>
                               <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Origem Natal</p>
                             </div>
                             <div className="hidden md:flex flex-col items-center justify-center px-4 w-1/3">
                               <Plane className="w-6 h-6 text-[#10b981] opacity-80" />
                               <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent mt-3"></div>
                             </div>
                             <div className="md:hidden flex items-center gap-4 text-[#10b981]/50 w-full">
                               <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#10b981]/50 to-transparent ml-2.5"></div>
                               <Plane className="w-5 h-5 rotate-90" />
                             </div>
                             <div className="flex-1 md:text-right">
                               <p className="text-[#10b981] font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center md:justify-end gap-2">
                                 <span className="truncate">{P.city}</span>
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
                               <Calendar className="w-5 h-5 text-[#10b981]"/> 
                               09 de Agosto, 2027
                             </span>
                             <span className="text-white/20 hidden md:inline">|</span>
                             <span className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                               <Clock className="w-5 h-5 text-[#10b981]"/> 
                               {P.time}
                             </span>
                           </div>
                         </div>
                         {/* DNA vs Ativação */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-6">
                             <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-5">DNA Astrológico</p>
                             <div className="space-y-4">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Sun className="w-5 h-5 text-yellow-400"/> Sol em {P.sign}
                               </p>
                               <p className="text-white/80 font-medium text-lg flex items-center gap-3">
                                 <ArrowUpCircle className="w-5 h-5 text-purple-400"/> Ascendente {P.ascendant}
                               </p>
                             </div>
                           </div>
                           <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent pointer-events-none"></div>
                             <p className="text-[#10b981]/70 text-[10px] uppercase font-bold tracking-widest mb-5 relative z-10">Ativação Anual</p>
                             <div className="space-y-4 relative z-10">
                               <p className="text-white font-medium text-lg flex items-center gap-3">
                                 <Landmark className="w-5 h-5 text-[#10b981]"/> Casa {P.house}
                               </p>
                               <p className="text-[#10b981] font-bold text-xl flex items-center gap-3">
                                 <CircleDollarSign className="w-5 h-5"/> Dinheiro & Prosperidade
                               </p>
                             </div>
                           </div>
                         </div>
                         {/* Compatibilidade */}
                         <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 mt-2 gap-4">
                           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Compatibilidade da Escolha</p>
                           <div className="flex items-center justify-center gap-3 bg-[#10b981]/20 px-6 py-3 rounded-full border border-[#10b981]/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
                             <span className="text-[#10b981] font-bold tracking-widest text-lg">{P.match}% MATCH</span>
                           </div>
                         </div>
                       </div>
                       {/* Footer Barcode */}
                       <div className="bg-black/60 px-8 py-5 flex flex-col md:flex-row justify-between items-center opacity-80 gap-4 border-t border-[#10b981]/20">
                         <div className="font-barcode text-5xl md:text-6xl tracking-[0.2em] text-[#10b981]/70 scale-y-150 py-2">||| || ||| | || || |||</div>
                         <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">Protocolo Solar • 24h de Imantação na Cidade de Destino</span>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
                  

                  {/* --- DOSSIÊ ASTROLÓGICO REAL --- */}
                  <div className="w-full mt-24 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-[#10b981]/10 border-[#10b981]/30">
                          <Target className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <h2 className="font-ps-display text-3xl md:text-5xl font-bold tracking-tight text-white">O Seu Dossiê</h2>
                      </div>
                      
                      <div className="flex flex-col gap-12 md:gap-24 text-left">
                          
                          {/* O Que Você Precisa Entender */}
                          {houseData?.oQueVocePrecisaEntender && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto md:mx-0">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">A Dinâmica</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight font-ps-display">O Que Você Precisa Entender</h3>
                              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                                {houseData.oQueVocePrecisaEntender}
                              </p>
                            </motion.div>
                          )}

                          {/* Como Aparece na Vida Real */}
                          {houseData?.comoApareceNaVidaReal && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl self-end text-left md:text-right mx-auto md:mx-0">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">Impacto Prático</span>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight font-ps-display">Como Aparece na Vida Real</h3>
                              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                                {houseData.comoApareceNaVidaReal}
                              </p>
                            </motion.div>
                          )}
                          
                          {/* O Tema, O Segredo, O Ritual (Bento Grid) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                             {/* O Tema */}
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/5 rounded-[32px] p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 transition-opacity group-hover:opacity-30 bg-[#10b981]"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Tema do Ano</span>
                                <p className="text-white/90 text-2xl md:text-3xl font-ps-display font-medium leading-tight mb-8">
                                  {houseData?.oTema || "Consolidação e Crescimento"}
                                </p>
                                <div className="w-full h-px bg-white/10 my-6"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Segredo</span>
                                <p className="text-white/70 text-lg font-light leading-relaxed">
                                  {houseData?.oSegredo}
                                </p>
                             </motion.div>
                             
                             {/* O Ritual */}
                             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-black/60 rounded-[32px] p-8 md:p-12 border border-[#10b981]/20 relative overflow-hidden group backdrop-blur-md">
                                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10 pointer-events-none transition-all duration-700 group-hover:scale-150 blur-3xl bg-[#10b981]"></div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-4">O Gesto que Ancora (24h)</span>
                                <div className="flex items-start gap-4">
                                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#10b981] shadow-[0_0_10px_#10b981]"></div>
                                  <p className="text-white/80 text-xl font-light leading-relaxed">
                                    {houseData?.ritual24h || "Explore o fluxo da cidade e estabeleça uma intenção clara nas primeiras horas."}
                                  </p>
                                </div>
                             </motion.div>
                          </div>

                          {/* Fases do Ano */}
                          {(houseData?.fase1 || houseData?.fase2 || houseData?.fase3) && (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full mt-12">
                              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#10b981] block mb-8 text-center md:text-left">A Linha do Tempo</span>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                  { title: "Fase 1 (Mês 1 a 4)", text: houseData.fase1 },
                                  { title: "Fase 2 (Mês 5 a 8)", text: houseData.fase2 },
                                  { title: "Fase 3 (Mês 9 a 12)", text: houseData.fase3 }
                                ].filter(f => f.text).map((fase, i) => (
                                  <div key={i} className="border-l border-[#10b981]/30 pl-6 relative">
                                    <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-[#10b981]"></div>
                                    <h4 className="text-white font-bold mb-3">{fase.title}</h4>
                                    <p className="text-white/60 text-sm font-light leading-relaxed">{fase.text}</p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                      </div>
                  </div>

                  {/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}
                  <div className="w-full max-w-4xl mx-auto mt-32 mb-16 px-4 md:px-0 text-left">
                    <div className="text-center mb-12">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-6">
                        <Sparkles className="w-3 h-3" /> Visão Panorâmica
                      </span>
                      <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4">As 8 Dimensões do seu Ano</h3>
                      <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Descubra como ancorar o seu Sol nesta Casa afetará diretamente cada pilar da sua vida nos próximos 12 meses.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-black/40 border border-[#10b981]/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
                      {[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData?.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData?.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData?.amor },
                        { id: "vidaPessoal", label: "Vida Pessoal & Saúde", icon: Sparkles, text: houseData?.vidaPessoal },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData?.saude },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData?.areasDaVida?.['Viagens'] },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData?.areasDaVida?.['Lar'] }
                      ].filter(x => x.text).map((dim, i) => (
                        <AccordionItem value={dim.id} key={dim.id} className="border-b border-[#10b981]/10 px-2 md:px-4 last:border-0">
                          <AccordionTrigger className="text-white hover:no-underline py-6 opacity-90 hover:opacity-100 group">
                            <span className="font-ps-display text-lg md:text-xl tracking-wide flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                                <dim.icon className="w-5 h-5 text-[#10b981]" />
                              </div>
                              {dim.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 font-light text-base md:text-lg leading-relaxed pb-8 pt-2 px-2 md:px-14">
                            {dim.text}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}
                  <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6 text-left">
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                      <div>
                        <h2 className="font-ps-display text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-white">
                          Rotas Alternativas
                        </h2>
                        <p className="text-white/50 text-base md:text-lg max-w-2xl font-light">
                          Se o seu Destino Mestre não for viável, estas coordenadas secundárias também ativam a energia desta casa.
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                         <Sparkles className="w-4 h-4 text-emerald-400" />
                         <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">Incluso</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {[
                        { title: "Nacional", desc: "Acessível e perto de você", data: citiesObj.nacional || [] },
                        { title: "Acessível", desc: "Viagem internacional viável", data: citiesObj.acessivel || [] },
                        { title: "High Ticket", desc: "Destino de alto padrão", data: citiesObj.highticket || [] }
                      ].map((tier, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white">{idx+1}</div>
                            <div>
                              <h4 className="font-bold text-lg text-white">{tier.title}</h4>
                              <p className="text-white/50 text-xs uppercase tracking-wider">{tier.desc}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            {tier.data.map((city, i) => (
                              <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] pointer-events-none group-hover:bg-[#10b981]/10 transition-colors"></div>
                                <div className="flex justify-between items-start mb-4">
                                  <h5 className="font-ps-display text-2xl font-bold text-white">{city.city}</h5>
                                  <span className="font-mono text-xs font-bold bg-[#10b981]/20 text-[#10b981] px-2 py-1 rounded">
                                    {city.score}% MATCH
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-white/50 text-sm">
                                  <MapPin className="w-4 h-4 text-[#10b981]" />
                                  <span>{city.country}</span>
                                </div>
                              </div>
                            ))}
                            {tier.data.length === 0 && (
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-white/40 text-sm italic">
                                Nenhuma rota encontrada para este nível.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BLOCO 7: A GRADE DE 12 CASAS (UPSELL) */}
                  <div className="w-full max-w-7xl mx-auto mt-40 mb-32 px-6 text-left">
                    <div className="text-center mb-16">
                      <h2 className="font-ps-display text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
                        Expanda o Seu Mapa.
                      </h2>
                      <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Você desbloqueou a visão profunda para a <strong>{P.houseLabel}</strong>. Descubra quais cidades ativam a sua saúde, amor, viagens e as outras 11 áreas da sua vida.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => {
                        const isCurrent = num === P.house;
                        const dbData = cityDatabase[num as keyof typeof cityDatabase];
                        const label = dbData?.name?.split('—')[1]?.trim() || dbData?.label || "Área da Vida";
                        const isUnlocked = isCurrent;
                        const cityForThisHouse = isCurrent ? P.city : "???";

                        return (
                          <div 
                            key={num}
                            onClick={() => {
                              if (!isUnlocked) {
                                setTargetLockedArea({ label: label, color: "#10b981", id: num.toString() });
                                setIsPaywallOpen(true);
                              }
                            }}
                            className={`relative p-6 rounded-3xl border transition-all duration-300 ${isCurrent ? 'bg-white/10 border-white/30' : 'bg-[#050505] border-white/5 hover:border-white/20 cursor-pointer'} overflow-hidden h-48 flex flex-col justify-between group`}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 bg-[#10b981]"></div>

                            <div className="relative z-10 flex justify-between items-start">
                              <div>
                                <span className="font-mono text-[10px] tracking-widest uppercase mb-1 block text-[#10b981]">Casa ${num}</span>
                                <h3 className="font-ps-display text-xl font-bold text-white mb-1">{label}</h3>
                              </div>
                              {!isUnlocked ? (
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                  <Lock className="w-3.5 h-3.5 text-white/40" />
                                </div>
                              ) : (
                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-white" />
                                  <span className="text-[10px] uppercase font-mono font-bold text-white">Livre</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="relative z-10">
                              {!isUnlocked ? (
                                <p className="text-white/30 text-sm font-light select-none blur-sm transition-all duration-300 group-hover:blur-0 group-hover:text-white/50">
                                  Desbloqueie para descobrir a cidade desta casa.
                                </p>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-amber-500" />
                                  <span className="text-white/80 font-medium text-sm">{cityForThisHouse}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>


          
            </div>
            </div>
</Reveal>
        </div>
      </section>



      
      <style dangerouslySetInnerHTML={{__html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
      <UnlockPremiumModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        targetAreaLabel={targetLockedArea?.label} 
        targetAreaColor={targetLockedArea?.color} 
        userCredits={userCredits}
        onUnlock={(option) => {
          if (option === 'single' && targetLockedArea) {
            setAreas(areas.map(a => a.id === targetLockedArea.id ? { ...a, unlocked: true } : a));
            setHoveredArea(targetLockedArea.id);
          } else if (option === 'all') {
            setAreas(areas.map(a => ({ ...a, unlocked: true })));
            if (targetLockedArea) setHoveredArea(targetLockedArea.id);
          }
          setIsPaywallOpen(false);
        }}
      />
    </div>
  );
}
