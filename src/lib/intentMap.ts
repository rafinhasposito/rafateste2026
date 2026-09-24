/**
 * Mapa de palavras-chave de intenção → casas astrológicas.
 * Usado no fluxo "Manifesto de Intenção" para determinar automaticamente a casa ideal.
 */

interface IntentMatch {
  house: number;
  keywords: string[];
}

const intentDatabase: IntentMatch[] = [
  {
    house: 1,
    keywords: ["liderança", "lider", "protagonismo", "coragem", "autonomia", "independência", "independencia", "recomeço", "recomeco", "reset", "renascer", "identidade", "autoconfiança", "autoconfianca", "vitalidade", "energia", "força", "forca"],
  },
  {
    house: 2,
    keywords: ["dinheiro", "grana", "riqueza", "prosperidade", "lucro", "patrimônio", "patrimonio", "finanças", "financas", "investimento", "renda", "estabilidade financeira", "abundância", "abundancia", "ganhar mais", "enriquecer", "fortuna"],
  },
  {
    house: 3,
    keywords: ["comunicação", "comunicacao", "vendas", "marketing", "contatos", "networking", "influência", "influencia", "escrever", "escrita", "falar", "podcast", "youtube", "redes sociais", "contrato", "negociação", "negociacao", "curso", "aprender"],
  },
  {
    house: 4,
    keywords: ["casa", "lar", "família", "familia", "imóvel", "imovel", "apartamento", "mudança", "mudanca", "morar", "raiz", "base", "ancestral", "cura familiar", "paz interior", "reforma", "construir casa"],
  },
  {
    house: 5,
    keywords: ["amor", "romance", "paixão", "paixao", "namoro", "namorar", "criatividade", "arte", "brilho", "filhos", "filho", "gravidez", "sorte", "diversão", "diversao", "prazer", "alegria", "expressão", "expressao", "entretenimento"],
  },
  {
    house: 6,
    keywords: ["saúde", "saude", "rotina", "disciplina", "academia", "dieta", "emagrecer", "corpo", "organização", "organizacao", "eficiência", "eficiencia", "produtividade", "hábitos", "habitos", "trabalho diário", "ordem"],
  },
  {
    house: 7,
    keywords: ["casamento", "casar", "parceria", "sócio", "socio", "sociedade", "contrato", "aliança", "alianca", "compromisso", "relacionamento sério", "noivado", "união", "uniao", "parceiro", "parceira"],
  },
  {
    house: 8,
    keywords: ["transformação", "transformacao", "poder", "renascimento", "herança", "heranca", "investimento", "crise", "morte simbólica", "psicologia", "terapia", "profundidade", "controle", "magnético", "magnetico", "sexualidade", "intensidade"],
  },
  {
    house: 9,
    keywords: ["viagem", "internacional", "exterior", "expansão", "expansao", "universidade", "mestrado", "doutorado", "filosofia", "espiritualidade", "fé", "fe", "religião", "religiao", "publicação", "publicacao", "livro", "conhecimento", "sabedoria", "crescimento"],
  },
  {
    house: 10,
    keywords: ["carreira", "sucesso", "fama", "reconhecimento", "cargo", "promoção", "promocao", "ceo", "empresa", "negócio", "negocio", "status", "reputação", "reputacao", "visibilidade", "autoridade", "prestígio", "prestigio", "meta profissional"],
  },
  {
    house: 11,
    keywords: ["comunidade", "amigos", "rede", "grupo", "coletivo", "futuro", "inovação", "inovacao", "tecnologia", "startup", "projeto social", "sonho", "utopia", "liberdade", "networking estratégico", "causa"],
  },
  {
    house: 12,
    keywords: ["espiritualidade", "meditação", "meditacao", "retiro", "cura interior", "silêncio", "silencio", "inconsciente", "karma", "encerramento", "desapego", "solidão", "solidao", "introspecção", "introspeccao", "intuição", "intuicao", "sonhos"],
  },
];

export function matchIntentToHouse(text: string): { house: number; score: number } | null {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  let bestMatch: { house: number; score: number } | null = null;

  for (const entry of intentDatabase) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(kwNorm)) {
        score += kw.length; // longer matches = more specific
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { house: entry.house, score };
    }
  }

  return bestMatch;
}
