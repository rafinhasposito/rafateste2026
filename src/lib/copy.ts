/**
 * Copy centralizado — strings reutilizadas na UI.
 * Regras de tempos verbais:
 * - Presente contínuo (gerúndio) para loading: "Consultando o cosmos...", "Calculando rotas...".
 * - Passado para conclusão: "Consulta realizada", "Casa desbloqueada".
 * - Futuro para efeitos posteriores: "Será debitado", "Você receberá".
 */

export const LOADING = {
  cosmos: "Consultando o cosmos...",
  routes: "Calculando rotas...",
  history: "Carregando histórico...",
  map: "Carregando mapa estelar...",
  packages: "Carregando pacotes...",
  saving: "Salvando...",
  processing: "Processando...",
  generic: "Carregando...",
} as const;

export const ACTIONS = {
  consult: "Consultar",
  revealDestiny: "Revelar meu destino",
  revealCities: "Revelar cidades ideais",
  seeOracle: "Ver Oráculo",
  newConsultation: "Nova Consulta",
  buyCredits: "Comprar mais créditos",
} as const;

export const EMPTY = {
  noConsultations: "Você ainda não realizou nenhuma consulta.",
  noTransactions: "Nenhuma movimentação de créditos até o momento.",
} as const;

export const CREDITS = {
  insufficient: "Créditos insuficientes. Cada consulta custa 1 crédito.",
  charged: "Consulta iniciada. 1 crédito debitado.",
  need: (n: number) =>
    `Créditos insuficientes. Você precisa de ${n} crédito${n > 1 ? "s" : ""} para esta ação.`,
  unlocked: (n: number) =>
    `${n} casa${n > 1 ? "s" : ""} desbloqueada${n > 1 ? "s" : ""} com sucesso.`,
} as const;

export const ERRORS = {
  unlockFailed: "Falha ao desbloquear. Tente novamente.",
  consultationFailed: "Não foi possível concluir a consulta. Tente novamente.",
  genericSave: "Não foi possível salvar. Tente novamente.",
} as const;

export const pluralCredits = (n: number) =>
  `${n} crédito${n === 1 ? "" : "s"}`;
