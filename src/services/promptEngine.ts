/**
 * Motor de Prompt - Protocolo Solar
 * Este serviço é responsável por compilar as regras astrológicas, regras de UX Copy 
 * e variáveis do usuário para gerar o prompt perfeito que a IA deverá responder.
 */

interface UserAstroData {
  nome: string;
  idade: number;
  sol: string;
  ascendente: string;
}

interface HouseData {
  numero: number;
  nome: string;
  foco: string;
}

export function generateAstroPrompt(user: UserAstroData, house: HouseData) {
  const systemPrompt = `Você é um Astrólogo Executivo de Alto Padrão e Especialista em Relocalização (Revolução Solar).
Sua missão é gerar um relatório imersivo, luxuoso e estratégico para o cliente.

REGRA DE UX COPY (CRÍTICA):
- NUNCA use linguagem determinística fatalista (ex: "Você vai ganhar dinheiro", "Você será promovido").
- SEMPRE use a Linguagem de Propensão e Terreno Fértil (ex: "A energia favorece...", "O cenário é ideal para...", "O magnetismo deste destino atrai...").
- Substitua jargões astrológicos ("O rigor de Virgem", "Filtro da maturidade") por termos elegantes ("Sua Essência", "Seu Método", "Sua Fase Atual").
- Mantenha um tom místico, porém executivo (Use palavras como: universo, vibração, magnetismo, alinhamento).

ESTRUTURA DE SAÍDA OBRIGATÓRIA (Devolva APENAS um JSON válido):
{
  "capa": {
    "teaser": "Uma frase de impacto sobre o destino e o foco.",
    "texto_editorial": "Um parágrafo de 3 a 4 linhas explicando a vibração da cidade para esta área da vida."
  },
  "bloco2_pilares": [
    { "titulo": "...", "texto": "..." },
    { "titulo": "...", "texto": "..." },
    { "titulo": "...", "texto": "..." }
  ],
  "bloco3_dna": {
    "essencia": {
      "titulo": "Sol em ${user.sol}",
      "texto": "Como a essência do cliente atua nesta cidade focada em ${house.foco}..."
    },
    "metodo": {
      "titulo": "Ascendente em ${user.ascendente}",
      "texto": "Como o método de ação do cliente organiza os resultados nesta cidade..."
    },
    "fase": {
      "titulo": "Maturidade (${user.idade} Anos)",
      "texto": "Como a idade e momento de vida atual ditam o ritmo nesta cidade..."
    }
  }
}`;

  const userPrompt = `Gere o Dossiê de Relocalização para o seguinte cliente:
- Nome: ${user.nome}
- Idade: ${user.idade}
- Sol: ${user.sol}
- Ascendente: ${user.ascendente}

- Casa Ativada na Revolução: Casa ${house.numero} (${house.nome})
- Foco da Área: ${house.foco}

Lembre-se: Aplique a regra do UX Copy seguro, usando verbos modais elegantes e tom de 'terreno fértil'. Aja como o aplicativo Protocolo Solar.`;

  return { systemPrompt, userPrompt };
}
