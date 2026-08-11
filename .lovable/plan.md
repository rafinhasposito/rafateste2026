# Modo de Teste sem Login

Objetivo: permitir usar o site inteiro (consultas, desbloqueios, resultados) sem precisar entrar na conta, apenas para testes.

## Como vai funcionar

Um "modo convidado" ligado por uma única flag no código (`src/lib/testMode.ts`, `TEST_MODE = true`). Enquanto estiver ligada:

- Nenhuma tela pede login e nenhum redirecionamento para `/auth` acontece.
- Créditos ficam ilimitados: nada é cobrado, nenhum alerta de saldo insuficiente, nenhum redirecionamento para `/credits`.
- Todas as casas ficam desbloqueadas de imediato nos resultados (sem modal de crédito).
- As consultas não são gravadas no banco: o resultado é guardado na sessão do navegador e mostrado na hora, inclusive no Dashboard.
- Um selo discreto "MODO TESTE" aparece no topo para lembrar que o login está desativado.

Para voltar ao normal depois do teste, basta trocar a flag para `false` — nada da lógica de login, créditos ou cobrança é apagado.

## Detalhes técnicos

1. Novo `src/lib/testMode.ts` exportando `TEST_MODE` e um usuário fictício (`guest`).
2. `src/hooks/useAuth.tsx`: quando `TEST_MODE`, retorna sessão fictícia com `profile.credits = 9999` e `loading = false`.
3. `src/lib/credits.ts` (`chargeConsultation`): retorna `{ ok: true }` sem tocar no banco em modo teste.
4. `src/lib/consultations.ts` (`saveConsultation`): grava em `sessionStorage` e devolve um id local em vez de inserir no banco.
5. `CityLookup.tsx`, `HouseLookup.tsx`, `IntentLookup.tsx`: remover a checagem `if (!user)` e o alerta de débito quando em modo teste.
6. `DestinyResults.tsx`: tratar todas as casas como desbloqueadas e pular os modais/`navigate("/auth")`.
7. `Dashboard.tsx`: ler a consulta do `sessionStorage` quando o id for local; desbloqueios são livres.
8. `Profile.tsx` e `Admin.tsx`: não redirecionar para `/auth`; Admin liberado em modo teste.
9. `UserMenu.tsx`: mostrar o selo "MODO TESTE" em vez de saldo real.
