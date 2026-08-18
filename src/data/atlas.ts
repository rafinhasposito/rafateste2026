export type ZodiacElement = "Fogo" | "Terra" | "Ar" | "Água";

export interface HouseAtlasData {
  id: number;
  title: string;
  tesouro: string;
  sombra: string;
  protocolo: string;
  timeline: {
    m1_3: string;
    m4_6: string;
    m7_9: string;
    m10_12: string;
  };
  mantra: string;
  exemplos: string[];
  bussola: Record<ZodiacElement, string>;
}

export const ATLAS_DO_DESTINO: Record<number, HouseAtlasData> = {
  1: {
    id: 1,
    title: "CASA 1: O Despertar do Protagonista",
    tesouro: "Reinvenção pessoal, vitalidade física e magnetismo absoluto. A coordenada do renascimento.",
    sombra: "Ao focar tanto na própria identidade, corre o risco de se tornar excessivamente autoritário, impaciente e afastar pessoas próximas. O ego pode ser o seu maior inimigo.",
    protocolo: "No dia do seu aniversário, pratique uma atividade física intensa para movimentar o corpo. Compre e vista uma peça de roupa totalmente nova. Tome, neste dia, uma decisão ousada que estava a adiar. Foco absoluto em si.",
    timeline: {
      m1_3: "Desconstrução da velha identidade; vontades súbitas de mudar o visual ou a rotina.",
      m4_6: "A coragem atinge o pico. Oportunidades para liderar projetos ganham tração.",
      m7_9: "O seu magnetismo é inegável. Onde você entra, a atenção é sua. Iniciativas dão lucro.",
      m10_12: "Consolidação do seu novo estatuto de líder e da sua nova versão física/mental."
    },
    mantra: "Eu sou o único arquiteto do meu destino e a fonte inesgotável do meu próprio poder.",
    exemplos: [
      "Quero dar um reboot na minha vida",
      "Preciso de coragem para um projeto solo",
      "Quero focar 100% no meu corpo e na minha imagem",
      "Quero ser notado ao entrar nos lugares"
    ],
    bussola: {
      Fogo: "O ano do salto cego. A cidade te dará coragem explosiva, fama e uma aura de liderança magnética.",
      Terra: "O ano do construtor. A cidade te dará disciplina de ferro, foco no trabalho duro e uma imagem de autoridade inabalável.",
      Ar: "O ano da influência. Você se torna um conector de pessoas, sua mente acelera e sua comunicação viraliza.",
      Água: "O ano do renascimento íntimo. A cidade traz forte intuição, cura física e um magnetismo misterioso e sedutor."
    }
  },
  2: {
    id: 2,
    title: "CASA 2: A Máquina de Ouro e Valor",
    tesouro: "Multiplicação financeira, elevação do seu valor de mercado e construção de património palpável.",
    sombra: "O materialismo extremo. O risco de medir o seu valor humano apenas pelo saldo bancário ou gastar de forma compulsiva para provar status.",
    protocolo: "Reserve um almoço ou jantar num restaurante de altíssimo padrão na cidade. Compre algo de valor material durável (uma joia, ouro, ou um livro raro). Envie uma mensagem ao universo de que o seu padrão financeiro subiu.",
    timeline: {
      m1_3: "Revisão profunda de gastos, crenças financeiras e reajuste de preços/salário.",
      m4_6: "Novas fontes de rendimento começam a fluir; clientes ideais aproximam-se.",
      m7_9: "O grande salto financeiro do ano. Assinatura de negócios altamente lucrativos.",
      m10_12: "Acumulação. Transformar o dinheiro rápido em património seguro."
    },
    mantra: "O meu valor é inegociável e a abundância flui até mim de forma natural e constante.",
    exemplos: [
      "Quero dobrar minha renda",
      "Vou lançar um produto e quero que seja lucrativo",
      "Preciso de segurança financeira",
      "Quero parar de perder dinheiro"
    ],
    bussola: {
      Fogo: "O dinheiro vem rápido, através de iniciativas ousadas, empreendedorismo e riscos calculados.",
      Terra: "O dinheiro acumula de forma segura. Excelente para investimentos imobiliários, fundos de longo prazo e bens físicos.",
      Ar: "O dinheiro vem através de infoprodutos, vendas, comunicação, aulas e comércio rápido (múltiplas fontes de renda).",
      Água: "O dinheiro flui através de arte, terapias, intuição para os negócios ou negócios familiares."
    }
  },
  3: {
    id: 3,
    title: "CASA 3: A Mestre das Conexões",
    tesouro: "Networking de elite, genialidade mental, persuasão em vendas e aceleração de contratos.",
    sombra: "Dispersão mental e ansiedade severa. O risco de começar dezenas de cursos, leituras ou projetos e não finalizar nenhum.",
    protocolo: "Escreva à mão as suas grandes metas. Passeie pelas ruas mais comerciais e intelectuais da cidade. Envie mensagens a 3 contactos estratégicos que podem mudar o rumo do seu ano profissional.",
    timeline: {
      m1_3: "Aceleração mental brutal. Muitas ideias novas, pequenas viagens e cursos.",
      m4_6: "As peças encaixam-se. Reuniões cruciais acontecem e acordos verbais são feitos.",
      m7_9: "Assinatura de contratos formais, lançamentos digitais ou viralização da sua mensagem.",
      m10_12: "Colheita dos lucros gerados inteiramente pela sua rede de contactos."
    },
    mantra: "A minha voz abre todas as portas e as minhas ideias têm um valor incalculável no mercado.",
    exemplos: [
      "Quero escrever um livro",
      "Preciso fechar muitos contratos de vendas",
      "Quero viralizar nas redes sociais",
      "Preciso conhecer as pessoas certas no meu nicho"
    ],
    bussola: {
      Fogo: "Comunicação agressiva, persuasiva e inspiradora. O melhor local para ser um palestrante ou vendedor.",
      Terra: "Comunicação prática e técnica. Ideal para quem escreve manuais, códigos (programadores) ou contratos precisos.",
      Ar: "Genialidade pura. A mente vira uma máquina de ideias brilhantes e conexões instantâneas (oásis para criadores de conteúdo).",
      Água: "Comunicação empática que toca a alma. Excelente para psicólogos, conselheiros e copywriters de emoção."
    }
  },
  4: {
    id: 4,
    title: "CASA 4: A Fortaleza de Pedra",
    tesouro: "Sucesso no mercado imobiliário, paz de espírito inabalável, cura do passado e estruturação familiar.",
    sombra: "Estagnação na zona de conforto. Ficar excessivamente nostálgico, caseiro ou preso a conflitos de infância que drenam a sua energia atual.",
    protocolo: "Hospede-se num local extremamente confortável (um Airbnb premium que pareça uma mansão ou um hotel boutique). Ligue aos seus pais ou mentores de vida para agradecer. Foque na sua segurança emocional.",
    timeline: {
      m1_3: "Limpeza literal e emocional. Vontade de remodelar a casa ou cortar laços tóxicos.",
      m4_6: "Surgem excelentes oportunidades imobiliárias ou de ancoragem (novo lar).",
      m7_9: "A base consolida-se. Profunda paz de espírito e harmonia familiar/pessoal.",
      m10_12: "Segurança absoluta estabelecida para o grande salto profissional do próximo ano."
    },
    mantra: "A minha paz interior é a fundação inabalável sobre a qual construo o meu império.",
    exemplos: [
      "Quero comprar minha casa própria",
      "Quero engravidar e montar meu ninho",
      "Preciso de paz após um ano de burnout",
      "Quero ter sucesso trabalhando home-office"
    ],
    bussola: {
      Fogo: "Um lar agitado, cheio de visitas, festas e independência familiar.",
      Terra: "Foco total na propriedade física. Excelente para investir em terras ou arquitetura sólida e luxuosa.",
      Ar: "Uma casa high-tech, moderna, voltada para troca de ideias e muitas mudanças de ambiente.",
      Água: "O refúgio emocional perfeito. Uma casa voltada para acolhimento, cura e segurança profunda."
    }
  },
  5: {
    id: 5,
    title: "CASA 5: O Palco e a Chama",
    tesouro: "Genialidade criativa pura, romances avassaladores, sorte magnética e o resgate da alegria de viver.",
    sombra: "Vaidade extrema, necessidade viciante de validação externa (likes/aplausos) e atração por dramas amorosos desnecessários.",
    protocolo: "Faça algo por puro prazer e não por obrigação. Vá a um teatro, espetáculo ou casino de luxo. Vista a sua melhor roupa, aquela que atrai olhares. Celebre a sua existência.",
    timeline: {
      m1_3: "Despertar criativo intenso. Novos interesses artísticos ou intelectuais. Flirts iniciais.",
      m4_6: "O palco ilumina-se. Os seus projetos autorais ou a sua vida amorosa ganham enorme tração.",
      m7_9: "O pico do brilho. A fase de receber aplausos, paixões consolidadas ou ganhos especulativos.",
      m10_12: "Transformar a inspiração caótica num portfólio, obra ou relacionamento sólido."
    },
    mantra: "Eu atraio a atenção certa. A minha genialidade é magnética e a minha vida é uma obra de arte.",
    exemplos: [
      "Quero viver um grande amor",
      "Sou artista e preciso de inspiração",
      "Quero lançar uma obra prima",
      "Quero ter sorte e me divertir como nunca"
    ],
    bussola: {
      Fogo: "Paixões avassaladoras, palco, drama e prêmios públicos. Você é a estrela incontestável.",
      Terra: "Prazeres sofisticados (bons vinhos, alta gastronomia) e hobbies que se transformam em negócios altamente lucrativos.",
      Ar: "Flertes intelectuais, poliamor ou parcerias criativas em comunicação e design.",
      Água: "Romances com conexão de almas, arte profunda, poesia e uma fertilidade mística inigualável."
    }
  },
  6: {
    id: 6,
    title: "CASA 6: A Máquina de Alta Performance",
    tesouro: "Otimização brutal da rotina, saúde de ferro, disciplina militar e sucesso inquestionável no trabalho diário.",
    sombra: "O esgotamento (burnout). O perfeccionismo doentio que o leva a criticar excessivamente a si mesmo e às suas equipas.",
    protocolo: "Acorde cedo e não permita nenhum caos na sua agenda. Coma de forma extremamente saudável. Planeie o seu ano num planner ou ferramenta digital de excelência. Agende um check-up médico.",
    timeline: {
      m1_3: "Eliminação radical de hábitos tóxicos, vícios e ineficiências no trabalho.",
      m4_6: "A rotina perfeita é estabelecida. A produtividade explode sem esforço aparente.",
      m7_9: "Reconhecimento direto dos seus superiores ou clientes pelo serviço de excelência. Pico de saúde física.",
      m10_12: "Manutenção da alta performance como o seu novo estilo de vida definitivo."
    },
    mantra: "A excelência é o meu padrão diário e o meu corpo é a minha máquina de vitórias.",
    exemplos: [
      "Preciso curar uma doença",
      "Quero o corpo dos meus sonhos",
      "Preciso escalar minha equipe de funcionários",
      "Quero focar brutalmente no meu trabalho diário"
    ],
    bussola: {
      Fogo: "Uma rotina de esportes radicais, liderança de equipes e competição saudável no ambiente de trabalho.",
      Terra: "A perfeição do biohacking. Produtividade máxima, gestão de tempo impecável e saúde blindada por boa alimentação.",
      Ar: "Trabalho voltado para tecnologia, dados e agilidade mental. A rotina muda todos os dias, mas funciona perfeitamente.",
      Água: "Cura através de terapias holísticas. O trabalho ganha um propósito emocional, ajudando e servindo outras pessoas."
    }
  },
  7: {
    id: 7,
    title: "CASA 7: O Contrato de Ouro",
    tesouro: "Casamento, sociedades empresariais multimilionárias, alianças estratégicas e vitórias judiciais/negociais.",
    sombra: "A dependência. O perigo de perder a sua própria identidade, cedendo demais para agradar ao parceiro ou sócio e esquecendo os seus limites.",
    protocolo: "Se estiver acompanhado, reserve um momento sofisticado a dois. Fale sobre o futuro em termos de 'Nós'. Se estiver sozinho, faça um pacto de compromisso com os seus futuros sócios ou clientes.",
    timeline: {
      m1_3: "Reajuste, teste ou finalização de parcerias antigas que já não entregam valor.",
      m4_6: "Entrada de pessoas-chave no seu caminho. Encontros predestinados.",
      m7_9: "Formalização. O casamento, o grande contrato ou a assinatura da sociedade.",
      m10_12: "Expansão e lucros gerados diretamente pelo poder desta aliança."
    },
    mantra: "Eu atraio alianças de ouro. O meu império multiplica-se através das pessoas certas.",
    exemplos: [
      "Quero me casar este ano",
      "Estou procurando o sócio ideal para minha startup",
      "Tenho um processo judicial e preciso ganhar",
      "Quero atrair clientes High Ticket"
    ],
    bussola: {
      Fogo: "Parceiros dinâmicos, líderes e até um pouco competitivos. Casamentos rápidos e sociedades agressivas no mercado.",
      Terra: "Casamentos baseados em segurança financeira. Sócios focados em construir impérios de longo prazo.",
      Ar: "Relações pautadas pela liberdade e inteligência mútua. Sócios que entram com a 'ideia' enquanto você entra com a execução.",
      Água: "Casamentos de profunda lealdade e dependência emocional. Sócios intuitivos e protetores."
    }
  },
  8: {
    id: 8,
    title: "CASA 8: A Fênix e o Poder Oculto",
    tesouro: "Transformação profunda, acesso a capital de terceiros (investimentos, heranças), magnetismo sexual e renascimento psicológico.",
    sombra: "Lutas obscuras por poder. Crises financeiras se misturar os seus recursos com pessoas não confiáveis. Tendência a ciúmes, obsessões e controlo.",
    protocolo: "Faça um ato de corte simbólico (elimine um contacto, deite fora um objeto ligado a um trauma). Reveja o seu portfólio de investimentos de forma secreta. Exija profundidade no dia de hoje.",
    timeline: {
      m1_3: "Confronto com os seus maiores medos financeiros e emocionais. Quebra de bloqueios.",
      m4_6: "Surgem oportunidades de fundos de investimento, partilhas ou comissões elevadas.",
      m7_9: "O grande renascimento. A entrada de capital externo ou a superação absoluta do passado.",
      m10_12: "Domínio total e silencioso sobre os seus novos recursos e emoções."
    },
    mantra: "Eu sou inquebrável. O meu poder interno transforma qualquer crise num lucro estrondoso.",
    exemplos: [
      "Vou abrir uma rodada de investimentos para minha empresa",
      "Preciso me curar de um trauma",
      "Quero explorar meu poder de atração e intimidade",
      "Estou aguardando uma grande herança ou comissão"
    ],
    bussola: {
      Fogo: "Transformação rápida e muitas vezes abrupta. Excelentes instintos para investimentos de alto risco e alto retorno.",
      Terra: "Controle absoluto sobre finanças de outras pessoas (gestão de fundos). Ganhos através de imóveis ou mercado financeiro.",
      Ar: "Transformação através do conhecimento oculto, psicanálise profunda e investimentos em tecnologia.",
      Água: "A verdadeira Fênix. Cura de traumas profundos, poder místico e intuição assustadora para ler as intenções ocultas das pessoas."
    }
  },
  9: {
    id: 9,
    title: "CASA 9: A Coroa de Júpiter",
    tesouro: "Sucesso e expansão internacional, sabedoria superior, vitórias jurídicas colossais e pura 'sorte' (proteção).",
    sombra: "O excesso de otimismo e a irresponsabilidade (achar que a sorte resolve tudo). A arrogância intelectual (o 'dono da verdade').",
    protocolo: "Visite o local mais imponente, cultural ou sagrado da cidade. Leia algumas páginas de filosofia ou estude 10 minutos de um novo idioma. Olhe para além das fronteiras.",
    timeline: {
      m1_3: "Forte insatisfação com a mediocridade atual. Planeamento de viagens, vistos ou mestrados.",
      m4_6: "Portas internacionais, académicas ou jurídicas abrem-se de forma surpreendente.",
      m7_9: "O clímax de Júpiter: a viagem que muda a sua vida, a publicação do livro ou a sentença vitoriosa.",
      m10_12: "Consolidação de uma visão de mundo completamente superior e livre."
    },
    mantra: "O universo conspira inteiramente a meu favor. Não há limites para o meu território.",
    exemplos: [
      "Quero me mudar de país ou conseguir um visto",
      "Vou defender meu Doutorado",
      "Quero lançar meu livro ou método globalmente",
      "Preciso de sorte e expansão de horizontes"
    ],
    bussola: {
      Fogo: "Viagens de aventura, pioneirismo no exterior e uma fé inabalável que atrai pura sorte ('Lei da Atração' ativada no máximo).",
      Terra: "Expansão estruturada. Você viaja para construir uma filial física da sua empresa ou estudar em uma universidade de prestígio tradicional.",
      Ar: "O nômade digital perfeito. Viagens focadas em ensinar, aprender idiomas e se conectar com culturas globais.",
      Água: "Viagens com propósito espiritual (retiros na Ásia, imersões) e expansão da consciência e intuição mística."
    }
  },
  10: {
    id: 10,
    title: "CASA 10: O Ápice do Império",
    tesouro: "Fama, estatuto máximo na profissão, dominação do mercado, promoções a cargos de topo e construção de legado.",
    sombra: "A frieza emocional. A tendência de negligenciar completamente a família, o parceiro e a saúde em prol de uma ambição cega. Queda pública se faltar à ética.",
    protocolo: "Almoce no local frequentado pela elite executiva da cidade. Vista-se para o cargo milionário que deseja, e não para o que tem. Atualize o seu posicionamento online focando na autoridade.",
    timeline: {
      m1_3: "Aumento brutal das responsabilidades. O mercado começa a testar a sua capacidade de liderança.",
      m4_6: "As primeiras grandes vitórias públicas, convites para chefia ou destaque nos média.",
      m7_9: "O topo da montanha. O prémio, o cargo de CEO, a distinção que coroa a sua carreira.",
      m10_12: "O grande desafio de manter o império e governar do topo com sabedoria."
    },
    mantra: "Eu não peço permissão para liderar. O topo é o meu habitat natural.",
    exemplos: [
      "Quero ser promovido a Diretor/CEO",
      "Quero que meu nome seja reconhecido na minha indústria",
      "Quero construir um legado",
      "Quero dominar meus concorrentes"
    ],
    bussola: {
      Fogo: "O líder visionário. Você será visto como o pioneiro indiscutível, o 'tubarão' do mercado.",
      Terra: "O magnata inabalável. Uma imagem de extremo luxo, segurança, status tradicional e riqueza consolidada.",
      Ar: "O gênio inovador. Você será reconhecido como a voz mais inteligente da sua geração, focado em tecnologia ou comunicação de massas.",
      Água: "O líder carismático e protetor. Alguém amado pelo público e respeitado pela empatia, excelente para figuras públicas ou políticos."
    }
  },
  11: {
    id: 11,
    title: "CASA 11: A Matriz do Futuro",
    tesouro: "Networking de elite corporativa, lucros massivos do trabalho, viralização em comunidades e apoio de aliados poderosos (Mecenas).",
    sombra: "Envolver-se com amizades por puro interesse. O perigo de perder a própria identidade em prol das massas ou apostar em projetos demasiado utópicos.",
    protocolo: "Visite um polo tecnológico ou um evento de networking seleto na cidade de destino. Compartilhe a sua visão de futuro nas redes. Fale com pessoas influentes como se fossem seus pares.",
    timeline: {
      m1_3: "Filtragem natural dos seus grupos. Algumas amizades antigas afastam-se para dar espaço aos novos aliados.",
      m4_6: "Inserção em círculos sociais ou grupos de Mastermind de altíssimo nível.",
      m7_9: "O Boom. Lucros diretos vindos da Casa 10, viralização ou a chegada de um 'investidor anjo'.",
      m10_12: "Solidificação do seu estatuto como influenciador e líder de comunidades."
    },
    mantra: "A minha visão inspira multidões. Os meus aliados elevam e aceleram os meus resultados.",
    exemplos: [
      "Quero explodir meu canal no YouTube",
      "Preciso de patrocínio ou apoio de pessoas influentes",
      "Vou lançar uma Startup",
      "Quero lucrar com o status que já alcancei"
    ],
    bussola: {
      Fogo: "Liderança inflamada de movimentos sociais ou fãs (você será o comandante de um exército de seguidores).",
      Terra: "Grupos de Mastermind focados em negócios de altíssimo nível. Clubes de investidores e associações exclusivas.",
      Ar: "Escalabilidade tecnológica. Redes de networking absurdas que ligam você aos 'peixes grandes' do Vale do Silício ou mercado digital.",
      Água: "Formação de 'tribos' leais e conectadas emocionalmente a você. Fãs que tratam a sua marca como uma família."
    }
  },
  12: {
    id: 12,
    title: "CASA 12: O Retiro do Mago",
    tesouro: "Paz profunda, incubação secreta de grandes impérios, blindagem e proteção espiritual absoluta, intuição profética.",
    sombra: "Fuga da realidade. Tendência à melancolia, ao isolamento excessivo (depressão) ou deparar-se com inimigos ocultos e traições nos bastidores.",
    protocolo: "Desligue todas as redes sociais. O luxo supremo de hoje é o silêncio. Vá a um spa premium, faça um retiro na natureza ou medite profundamente. Comece um diário fechado a sete chaves.",
    timeline: {
      m1_3: "Forte necessidade de recuo e encerramento de ciclos kármicos. Sentimento de 'limpeza'.",
      m4_6: "O trabalho de bastidores engrena. Desenvolve o seu maior projeto sem que ninguém veja.",
      m7_9: "Pico de intuição. Problemas complexos são resolvidos através de instintos ('vozes interiores') afiados.",
      m10_12: "A gestação finaliza. A bateria espiritual atinge os 100%, pronto para o renascimento violento do próximo ano (Casa 1)."
    },
    mantra: "No silêncio absoluto encontro a minha maior força. O meu próximo sucesso é gestado em segredo.",
    exemplos: [
      "Vou tirar um ano sabático",
      "Estou escrevendo um projeto em absoluto segredo",
      "Preciso desaparecer do mapa para me curar",
      "Quero ativar meus dons espirituais"
    ],
    bussola: {
      Fogo: "Um isolamento ativo (ex: focar meses treinando fisicamente para um campeonato em silêncio) ou superar autossabotagens pela raiz.",
      Terra: "Isolamento focado no trabalho profundo (Deep Work). Você se esconde do mundo para construir um império de portas fechadas.",
      Ar: "O sabático mental. Um ano para ler centenas de livros, meditar e reprogramar todas as suas crenças limitantes.",
      Água: "A imersão total no mundo espiritual. Intuição profética, sonhos lúcidos, e resolução definitiva de carmas de vidas passadas."
    }
  }
};
