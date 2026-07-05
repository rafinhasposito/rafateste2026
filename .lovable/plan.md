# Plano: Corrigir Histórico, Desbloqueio Passado/Presente e Sweep de Bugs

## Problemas confirmados

1. **Histórico vazio**: os fluxos da home (`CityLookup`, `HouseLookup`, `IntentLookup`) cobram 1 crédito e chamam a API, mas **não inserem em `consultations`**. Só o Dashboard lê essa tabela → toda consulta nova desaparece do histórico. Só existem 24 linhas antigas.
2. **"Olhinho + DESBLOQUEADA" no passado/presente**: `CityLookup` usa o endpoint `/audit_past`, que só devolve a casa-alvo (sem `results` das outras 11). Quando o usuário paga para desbloquear as 12 casas, o `DestinyResults` não tem cidades para exibir e cai no fallback genérico "Desbloqueada". No futuro funciona porque `HouseLookup`/`IntentLookup` chamam `/find_all_cities` e passam `allResults`.
3. **Warning React**: `DestinyResults` mistura shorthand `border` com longhand `borderLeft` no mesmo `style` (log do console).
4. **`handleUnlock` duplicado**: cada lookup tem sua própria função de desbloqueio de "pacotes", mas o Dashboard já tem a versão canônica; a versão da home debita créditos mas não atualiza `houses_unlocked` em lugar nenhum (não tem registro pra atualizar) — é um vazamento de créditos.

## Correções

### 1. Persistir toda consulta em `consultations`
Nos três lookups, logo após sucesso da API, inserir:
- `user_id, name, birthdate, birthtime, birth_place, year, mode` (passado/presente/futuro), `goal` (nº casa quando aplicável), `intent` (quando aplicável), `origin` (cidade quando Cidade), `result` = payload completo da API (inclui `results` para desbloqueios futuros no Dashboard), `houses_unlocked: 1` (só a casa-alvo liberada).
- Guardar o `id` retornado no state para o botão "Desbloquear +N" navegar para `/dashboard?id=<id>` **em vez de** debitar créditos localmente sem atualizar nada.

### 2. Passado/Presente com paridade de desbloqueio
Em `CityLookup`, após `/audit_past` retornar `houseNum`, disparar **em paralelo** `/find_all_cities` com `alvoId: houseNum` e mesclar o `results` no `allResults` passado ao `DestinyResults`. Assim, quando o usuário paga para desbloquear as outras casas, elas mostram cidade+bandeira+país igual ao futuro.

### 3. Remover fallback "Desbloqueada" enganoso
Em `DestinyResults` (linhas ~898-905), se `isUnlocked && !houseCity && !isCurrentHouse`, mostrar um estado real: "Calculando cidade…" com spinner OU esconder a linha (nunca mais o olhinho + palavra "Desbloqueada" solta).

### 4. Unificar botão de desbloqueio
Trocar `handleUnlock` local dos 3 lookups por: navegar para `/dashboard?id=<consultation.id>&unlock=<n>`, e o Dashboard já cuida do débito + `houses_unlocked` corretamente (única fonte de verdade). Elimina o vazamento de créditos.

### 5. Fix warning React
Em `DestinyResults`, substituir o objeto `style` que tem `border` + `borderLeft` por longhands (`borderTop/Right/Bottom/Left` ou `borderColor`+`borderLeftColor`) para eliminar o warning do console.

### 6. Sweep adicional
- Verificar se `IntentLookup` e `HouseLookup` também têm `handleUnlock` vazio (têm) e aplicar o mesmo redirecionamento.
- Confirmar que o Dashboard carregado via `?id=` continua abrindo a casa-alvo por padrão e permitindo clicar nas outras (grid de 3 colunas mantido).
- Garantir que `mode` gravado em `consultations` bate com os filtros usados no `History` (`passado` vs `futuro`).

## Arquivos afetados
- `src/components/CityLookup.tsx` — insert em consultations, chamada extra `/find_all_cities`, remover `handleUnlock` local.
- `src/components/HouseLookup.tsx` — insert em consultations, remover `handleUnlock` local.
- `src/components/IntentLookup.tsx` — insert em consultations, remover `handleUnlock` local.
- `src/components/DestinyResults.tsx` — fix warning border, remover fallback "Desbloqueada", roteamento para `/dashboard?id=…` no clique de desbloqueio.
- `src/pages/Dashboard.tsx` — ler `?unlock=N` opcional para auto-abrir modal (opcional, só se for trivial).
- `src/pages/Index.tsx` — passar `mode` para os componentes de lookup (se ainda não passa).

## Fora do escopo
Sem mudanças no schema do banco, no Admin, nas cores/estilos ou nos textos.