const fs = require('fs');
const file = 'src/data/houses.ts';
let content = fs.readFileSync(file, 'utf8');

const copyInjection = {
  1: {
    forWho: "Pessoas que precisam se reconstruir, profissionais querendo assumir posições de liderança e quem viveu muito em função de terceiros.",
    benefits: ["Decisões independentes", "Vitalidade física e mental", "Renovação de imagem e estilo", "Projetos solo impulsionados", "Recuperação da autoconfiança"],
    realLifeImpact: "Você sentirá mais vontade de se exercitar, mudar o corte de cabelo ou o estilo de vestir, dar início a planos individuais e estabelecer limites claros em relações que te sufocam.",
    ritual24h: "Agende uma massagem, mude o visual ou compre uma roupa nova que marque esse novo ciclo. Escreva em um papel suas metas de desenvolvimento pessoal.",
    mantra: "Eu assumo o comando das minhas escolhas e colho os resultados da minha própria iniciativa."
  },
  2: {
    forWho: "Autônomos e freelancers com dificuldade em cobrar caro, pessoas endividadas que precisam se estruturar e empreendedores focados em lucro tangível.",
    benefits: ["Aumento de ganhos e faturamento", "Negociação de melhores contratos", "Novas fontes de receita consolidadas", "Organização de dívidas", "Estabilidade material real"],
    realLifeImpact: "Você sentirá necessidade de rever seus preços, buscar formas de rentabilizar suas habilidades, organizar seu orçamento e focar em projetos práticos.",
    ritual24h: "Dê um passo prático. Organize sua carteira física, limpe seus cartões e abra uma nova conta ou investimento. Evite compras impulsivas.",
    mantra: "Eu reconheço o valor do meu trabalho, organizo minhas contas e colho a estabilidade material."
  },
  3: {
    forWho: "Vendedores, autônomos, produtores de conteúdo, escritores e quem precisa destravar a comunicação e o networking diário.",
    benefits: ["Destravar a comunicação e vendas diárias", "Crescimento rápido no alcance online", "Mais clientes e fechamento de contratos rápidos", "Cursos e workshops fluindo melhor"],
    realLifeImpact: "Seu telefone não vai parar. Muitas mensagens, e-mails, trocas rápidas, necessidade de aprender algo novo (cursos rápidos) e muitas pequenas viagens e deslocamentos no dia a dia.",
    ritual24h: "Leia um artigo da sua área, inicie um curso ou grave o primeiro vídeo de um projeto que estava adiando. Destrave a voz.",
    mantra: "Minha comunicação é clara, minha voz tem poder e minhas conexões abrem portas diárias."
  },
  4: {
    forWho: "Pessoas que trabalham em home-office, famílias buscando comprar casa, casais desejando filhos e quem precisa de aterramento emocional.",
    benefits: ["Compra, venda ou reforma de imóveis", "Criação de um 'porto seguro' emocional", "Harmonização de conflitos familiares", "Fortalecimento de raízes", "Foco na vida privada"],
    realLifeImpact: "A necessidade de ficar em casa, organizar o lar, cozinhar e receber apenas os mais íntimos aumenta muito. Você sentirá necessidade de proteger seu espaço pessoal.",
    ritual24h: "Limpe e defume a casa ou compre um objeto novo para a decoração do seu lar. Desconecte-se de eventos sociais nesse dia e jante com quem realmente importa.",
    mantra: "Minha casa é meu templo, minhas bases são sólidas e eu crio meu próprio porto seguro."
  },
  5: {
    forWho: "Artistas, criativos, quem quer viver romances intensos, atrair atenção do público e quem deseja ter filhos (ou lançar uma obra).",
    benefits: ["Aumento de magnetismo e carisma", "Fertilidade e potência criativa", "Romances, paqueras e vida amorosa agitada", "Visibilidade para seus projetos criativos"],
    realLifeImpact: "A vida ganha um tom mais festeiro e criativo. Você vai querer se divertir mais, sair mais e será muito mais notado por onde passar.",
    ritual24h: "Faça algo puramente por diversão ou prazer no seu aniversário. Dance, pinte, saia para celebrar. Conecte-se com a sua essência mais criativa.",
    mantra: "Eu mereço viver com alegria, atraio olhares por onde passo e manifesto minha criatividade com poder."
  },
  6: {
    forWho: "Quem vive furando a dieta, quer entrar no mundo fit, organizar a rotina diária e evitar a sobrecarga de trabalho sem limite.",
    benefits: ["Organização de rotina e horários", "Consistência em treinos e dietas", "Maior foco e produtividade diária", "Limpeza de tarefas inúteis", "Melhoria real de saúde física"],
    realLifeImpact: "Você terá menos tolerância para a bagunça. Vai querer planilhas, agenda, horários definidos para treinar e limites muito claros de quando o trabalho começa e quando ele termina.",
    ritual24h: "Comece o dia organizando seu espaço de trabalho, faça um exercício físico logo pela manhã e escreva a sua rotina ideal em uma agenda. Diga não para distrações.",
    mantra: "Minha rotina é blindada, minha saúde é minha prioridade e meu trabalho rende como um relógio."
  },
  7: {
    forWho: "Quem busca um relacionamento sério, pessoas prontas para casar e empresários que precisam de sócios de alto valor.",
    benefits: ["Atrair parcerias comerciais valiosas", "Oficialização de namoros ou casamentos", "Maior equilíbrio e maturidade no amor", "Contratos com clientes VIPs"],
    realLifeImpact: "A vida solo perde a graça. Você vai atrair pessoas que querem somar com você, tanto nos negócios quanto na vida pessoal. Relacionamentos casuais perdem espaço para conexões profundas.",
    ritual24h: "Jante com o seu parceiro ou, se estiver solteiro, liste as 3 características inegociáveis que você exige na sua próxima relação. Celebre a energia do 'nós'.",
    mantra: "Eu atraio parcerias de alto valor, vivo amores inteiros e construo impérios bem acompanhado."
  },
  8: {
    forWho: "Investidores, terapeutas, empresários, pessoas precisando lidar com heranças e quem quer uma transformação de poder brutal.",
    benefits: ["Ganhos através de comissões ou sócios", "Poder de investigação e profundidade", "Aprovação de crédito e financiamentos", "Transformação psicológica total", "Aumento da potência magnética"],
    realLifeImpact: "Você não terá mais paciência para futilidades. Será um ano para cortar o mal pela raiz, lidar com burocracias, gerir dinheiro de terceiros e acessar uma força psicológica que você não sabia que tinha.",
    ritual24h: "Descarte algo que não te serve mais (roupas, documentos ou contatos). Faça um balanço das suas finanças. Feche um ciclo para dar espaço ao novo.",
    mantra: "Eu comando a minha transformação, comando os meus recursos e renasço mais forte a cada ciclo."
  },
  9: {
    forWho: "Quem quer fazer mestrado, doutorado, planeja imigrar, mudar de país, expandir um negócio internacional ou aprofundar sua fé.",
    benefits: ["Aprovação em vistos e universidades", "Expansão da consciência e estudos profundos", "Viagens longas e marcantes", "Crescimento filosófico e de fé", "Alargamento de horizontes no exterior"],
    realLifeImpact: "A cidade onde você mora parece pequena demais. A necessidade de ler mais, estudar, debater filosofia, viajar e explorar diferentes culturas dominará o seu ano.",
    ritual24h: "Planeje sua próxima grande viagem, compre um livro profundo ou assista a um documentário sobre uma cultura distante. Expanda sua mente hoje.",
    mantra: "O mundo é pequeno para a minha ambição, minhas fronteiras se expandem e eu busco a verdade máxima."
  },
  10: {
    forWho: "Influenciadores, artistas, empreendedores e qualquer profissional que deseja fama, sair dos bastidores e virar autoridade máxima.",
    benefits: ["Construção de autoridade absoluta", "Projeção de imagem e prestígio", "Conquista do topo da carreira", "Prêmios e reconhecimentos", "Viralização e contratos grandes"],
    realLifeImpact: "Você para de ser um segredo bem guardado. O mercado te vê como referência. A pressão será alta, mas a visibilidade e o sucesso público pagarão o preço.",
    ritual24h: "Vista-se como a pessoa de sucesso que você almeja ser. Crie ou atualize o seu portfólio. Assuma publicamente uma nova posição ou título profissional.",
    mantra: "Eu assumo o topo, projeto autoridade absoluta e meu sucesso no mercado é inegável."
  },
  11: {
    forWho: "Membros de ONGs, líderes de comunidade, políticos, quem precisa de alianças e quem deseja realizar sonhos grandes e disruptivos.",
    benefits: ["Expansão drástica do círculo social", "Apoio de pessoas influentes e mentores", "Projetos digitais e inovadores", "Realização de desejos antigos", "Abertura de portas através do networking"],
    realLifeImpact: "Seus contatos serão o seu maior ativo. Pessoas que você mal conhece vão te ajudar. Você terá ideias geniais e fora da caixa, muito ligadas ao futuro e à tecnologia.",
    ritual24h: "Mande mensagem para 3 pessoas que te inspiram ou com quem você quer criar laços. Desenhe um plano para o seu maior sonho de vida de longo prazo.",
    mantra: "Eu ando com os gigantes, minhas conexões geram riqueza e o meu futuro já está garantido."
  },
  12: {
    forWho: "Terapeutas, pesquisadores, monges, cientistas de laboratório e quem precisa focar em cura, espiritualidade e silêncio produtivo.",
    benefits: ["Intuição e conexão espiritual extrema", "Produtividade massiva em trabalho solo", "Cura de traumas antigos", "Fechamento final de ciclos dolorosos", "Imersão em estudos ocultos ou ciência de base"],
    realLifeImpact: "Você vai preferir trabalhar isolado. Festas lotadas sugarão a sua energia. Seu sexto sentido estará no máximo e seus maiores projetos nascerão no silêncio do seu quarto ou escritório.",
    ritual24h: "Reserve o dia para meditar, orar ou fazer um retiro de silêncio de algumas horas. Desconecte as redes sociais e zere a sua energia.",
    mantra: "Eu encontro poder no silêncio, minha intuição me guia com exatidão e eu curo o que precisa ser curado."
  }
};

let contentLines = content.split('\n');

for (let i = 1; i <= 12; i++) {
  const marker1 = "  " + i + ": {";
  const marker2 = "  " + i + ":{";
  let startIndex = contentLines.findIndex(l => l === marker1 || l === marker2);
  
  if (startIndex !== -1) {
    const injection = "    forWho: \"" + copyInjection[i].forWho + "\",\n" +
                      "    benefits: " + JSON.stringify(copyInjection[i].benefits) + ",\n" +
                      "    realLifeImpact: \"" + copyInjection[i].realLifeImpact + "\",\n" +
                      "    ritual24h: \"" + copyInjection[i].ritual24h + "\",\n" +
                      "    mantra: \"" + copyInjection[i].mantra + "\",";
    contentLines.splice(startIndex + 1, 0, injection);
  }
}

fs.writeFileSync(file, contentLines.join('\n'));
console.log("Deep Copy Injected perfectly into houses.ts");
