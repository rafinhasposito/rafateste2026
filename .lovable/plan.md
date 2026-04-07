

## Plano: Unificar Cores, Resultados e Corrigir Histórico/Créditos

### Escopo do Problema

1. **Cores ausentes**: `DestinyResults.tsx` não importa `houseColors` — todos os cards usam cores genéricas `primary`, perdendo a identidade visual de cada casa
2. **Resultados inconsistentes**: `CityLookup` não usa `DestinyResults` (mostra resultado simples), enquanto `HouseLookup` e `IntentLookup` já usam. Falta unificação
3. **Histórico**: A página History navega para `/dashboard?id=`, que funciona, mas os cards do histórico não mostram as cores das casas
4. **Créditos/Desbloqueio**: O Dashboard tem lógica de créditos funcional, mas o `DestinyResults` (usado nos lookups da Index) tem botão "Desbloquear" que abre WhatsApp em vez de usar o sistema de créditos

---

### Mudanças Planejadas

#### 1. Cores das Casas no DestinyResults (`src/components/DestinyResults.tsx`)

- Importar `houseColors` de `@/data/houses`
- Criar helper que extrai a cor RGB dominante do gradiente via regex (ex: `rgba(139,0,0,0.6)` → `139,0,0`)
- Definir `--house-accent` como variável CSS inline no container raiz
- Aplicar nos seguintes pontos:
  - **Lock Screen**: borda do card de cadeado com cor da casa (`border-color` inline)
  - **Ícone do cadeado**: círculo usa a cor da casa como fundo sutil
  - **Master Destiny**: tags de poderes usam `border` e `bg` da cor da casa em vez de `primary`
  - **Rituais**: número circular usa cor da casa como borda
  - **Previsões**: ícone circular usa borda da cor da casa
  - **Cards secundários**: barra lateral esquerda de 3px com cor da casa

#### 2. Unificar CityLookup com DestinyResults (`src/components/CityLookup.tsx`)

- Após receber resultado da API `/audit_past`, construir objeto `cities` com a cidade consultada como `highticket[0]` e arrays vazios para as demais
- Substituir o bloco de resultado atual (linhas 142-191) por `<DestinyResults>` passando `house`, `houseName`, `houseData` e `cities`
- Resultado: todas as 3 vias de pesquisa mostram o mesmo design premium

#### 3. Cores no Histórico (`src/pages/History.tsx`)

- Importar `houseColors` de `@/data/houses`
- Extrair cor dominante da casa e aplicar como `borderLeft` colorido em cada card de consulta
- Adicionar dot colorido ao lado do nome da casa

#### 4. Conectar botão de desbloqueio ao sistema de créditos (`src/components/DestinyResults.tsx`)

- Adicionar props opcionais: `onUnlock?: () => void` e `isAuthenticated?: boolean`
- No botão "Desbloquear Mapeamento Completo" (secundários):
  - Se `onUnlock` fornecido → chamar `onUnlock()`
  - Senão → navegar para `/credits` (em vez de abrir WhatsApp)
- Nos componentes pai (`HouseLookup`, `IntentLookup`, `CityLookup`): passar callbacks que salvam a consulta no banco e descontam créditos, ou navegam para login/credits

---

### Arquivos Modificados

| Arquivo | Tipo de Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Cores das casas + props de desbloqueio |
| `src/components/CityLookup.tsx` | Usar DestinyResults em vez de layout próprio |
| `src/pages/History.tsx` | Cores das casas nos cards |
| `src/components/HouseLookup.tsx` | Passar callback onUnlock |
| `src/components/IntentLookup.tsx` | Passar callback onUnlock |

### O que NÃO muda
- `houses.ts`, `HouseCard.tsx`, `HouseDetail.tsx`, `Dashboard.tsx` — intactos
- Estrutura de banco de dados — sem alterações
- CSS base, fontes, layout geral

