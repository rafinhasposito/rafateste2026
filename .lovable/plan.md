

## Plano: Unificar Cores, Resultados e Corrigir Fluxo de Creditos/Historico

### Resumo do Problema
1. **Cores das casas** sumiram do DestinyResults -- o `houseColors` de `houses.ts` nao e importado
2. **CityLookup** mostra resultado generico em vez do design premium (DestinyResults)
3. **Botao de desbloqueio** abre WhatsApp em vez de usar o sistema de creditos
4. **Resultado por Casa** mostra apenas a Casa X -- falta mostrar as outras 11 casas com suas cores e cadeados
5. **Historico** nao mostra cores das casas, nao diferencia tipo de busca, nao mostra creditos gastos
6. **Perfil** nao mostra tabela de precos nem extrato de creditos

---

### Mudancas Planejadas

#### 1. `DestinyResults.tsx` -- Cores + 12 Casas + Creditos

**Cores dinamicas:**
- Importar `houseColors` e `cityDatabase` completo
- Extrair cor RGB dominante do gradiente da casa via regex
- Aplicar como `--house-accent` CSS var no container raiz
- Usar essa cor em: borda do lock screen, tags de poderes, icone de ritual, icone de previsoes, barra lateral dos cards secundarios

**Renomear "The Master Destiny" para portugues** (ex: "Destino Principal" ou "O Destino Mestre")

**Novas props:**
- `onUnlock?: (amount: number) => void` -- callback para descontar creditos
- `userCredits?: number` -- saldo atual
- `isAuthenticated?: boolean` -- se usuario esta logado
- `allHousesData?: Record<number, { locked: boolean; label: string }>` -- dados das 12 casas para grid inferior

**Secao das 12 Casas (apos o Master Destiny):**
- Apos as cidades secundarias da Casa X, renderizar grid com as 12 casas
- Cada card usa seu `houseColors[n]` como fundo/borda
- Casa consultada aparece como "desbloqueada" (sem cadeado)
- As outras 11 aparecem com cadeado, nome da casa, label e cor propria
- Ao clicar numa casa bloqueada, abre modal/painel com opcoes: +1 Casa (1 credito), +3 Casas (2 creditos), Mapa Completo (3 creditos)
- Se usuario tem creditos suficientes, desconta imediatamente via `onUnlock`
- Se nao tem, redireciona para `/credits`
- Se nao esta logado, redireciona para `/auth`

**Botao "Desbloquear Mapeamento Completo" (secundarios):**
- Remover link WhatsApp
- Ao clicar, abre o mesmo painel de escolha de desbloqueio (+1, +3, completo)

#### 2. `CityLookup.tsx` -- Usar DestinyResults

- Apos receber resultado da API (`/audit_past`), construir objeto compativel com DestinyResults
- A cidade consultada vira `highticket[0]`, demais arrays ficam vazios
- Substituir o bloco de resultado atual (linhas 142-191) pelo componente `<DestinyResults>`
- Resultado: busca por cidade mostra o mesmo design premium com cores da casa detectada

#### 3. `HouseLookup.tsx` e `IntentLookup.tsx` -- Passar props de creditos

- Importar `useAuth` e `useNavigate`
- Passar `onUnlock`, `userCredits`, `isAuthenticated` ao `DestinyResults`
- Implementar callback `onUnlock` que:
  1. Salva consulta no banco (insert em `consultations`)
  2. Desconta creditos do perfil (update em `profiles`)
  3. Registra transacao (insert em `credit_transactions`)
  4. Atualiza estado local

#### 4. `History.tsx` -- Cores + Tipo de busca + Creditos gastos

**Cores das casas nos cards:**
- Importar `houseColors`
- Extrair cor e aplicar como `borderLeft: 4px solid` em cada card
- Adicionar dot colorido ao lado do nome da casa

**Tipo de busca:**
- Ler campo `mode` + `intent` + `origin` da consulta para inferir tipo (cidade/casa/intencao)
- Exibir badge: "Por Cidade", "Por Casa" ou "Por Intencao"

**Creditos gastos:**
- Query inclui join logico com `credit_transactions` (buscar transacoes do user e associar por `consultation_id`)
- Mostrar quantidade de creditos gastos em cada card

**Saldo no topo:**
- Ja mostra `profile.credits` -- manter
- Adicionar texto: "1 credito = +1 casa | 2 creditos = +3 casas | 3 creditos = mapa completo"

**Extrato de creditos:**
- Nova secao abaixo do historico de consultas
- Lista de `credit_transactions` com data, tipo, descricao e valor (+/-)

#### 5. `Credits.tsx` -- Mostrar tabela de precos de desbloqueio

- Adicionar secao explicativa: "Quanto custa cada desbloqueio"
  - +1 Casa = 1 credito
  - +3 Casas = 2 creditos
  - Mapa Completo (12 casas) = 3 creditos

---

### Arquivos Modificados

| Arquivo | Mudanca |
|---|---|
| `src/components/DestinyResults.tsx` | Cores, portugues, 12 casas, modal desbloqueio, creditos |
| `src/components/CityLookup.tsx` | Usar DestinyResults em vez de layout proprio |
| `src/components/HouseLookup.tsx` | Passar props de auth/creditos ao DestinyResults |
| `src/components/IntentLookup.tsx` | Passar props de auth/creditos ao DestinyResults |
| `src/pages/History.tsx` | Cores, tipo busca, creditos gastos, extrato |
| `src/pages/Credits.tsx` | Tabela de precos de desbloqueio |

### O que NAO muda
- `houses.ts`, `HouseCard.tsx`, `HouseDetail.tsx`, `Dashboard.tsx` -- intactos
- Schema do banco -- sem migracoes
- CSS base, fontes e layout geral

