/**
 * Copy centralizada — usada em toda a aplicação para garantir
 * consistência de vocabulário e tempos verbais.
 *
 * Regras:
 *  - Loading → presente contínuo ("Consultando...", "Carregando...").
 *  - Conclusão → passado ("Consulta realizada", "Crédito debitado").
 *  - Ações futuras → futuro ("Você receberá...", "Será debitado...").
 *  - Termo oficial: "crédito(s)" (nunca "consulta" como moeda).
 */

export const copy = {
  // Loading
  loadingCosmos: "Calculando seu Ascendente Anual...",
  loadingRoutes: "Ancorando o seu Sol (Foco de Energia)...",
  loadingCity: "Mapeando a posição da Lua (Clima Emocional)...",
  loadingHistory: "Carregando histórico...",
  loadingMap: "Sintetizando Atlas do Destino...",
  loadingGeneric: "Carregando...",
  processing: "Processando...",

  // Botões principais (com custo inline)
  ctaIntent: "Revelar meu destino (1 crédito)",
  ctaHouse: "Revelar cidades ideais (1 crédito)",
  ctaCity: "Simular deslocamento (1 crédito)",

  // Toasts pós-débito
  chargedOne: "Consulta iniciada. 1 crédito debitado.",
  chargedMany: (n: number) => `Consulta iniciada. ${n} créditos debitados.`,

  // Erros
  errNoCredits:
    "Você não possui créditos suficientes. Cada consulta custa 1 crédito.",
  errFillNatal: "Preencha seus dados natais acima antes de continuar.",
  errAuthRequired: "Entre na sua conta para realizar a consulta.",
  errQueryPrefix: "Falha na consulta:",

  // Validações específicas
  errIntentShort: "Descreva seu desejo com pelo menos 10 caracteres.",
  errIntentNoMatch:
    "Não conseguimos identificar a área. Tente palavras como: dinheiro, amor, carreira, saúde ou viagem.",
  errHouseNotSelected: "Selecione uma casa astrológica no grid.",

  // Desbloqueios
  unlockConfirmTitle: "Confirmar desbloqueio",
  unlockIrreversible:
    "Esta ação é irreversível. Os créditos serão debitados imediatamente.",

  // Créditos
  creditLabel: (n: number) => `${n} crédito${n === 1 ? "" : "s"}`,
} as const;
