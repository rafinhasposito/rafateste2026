## O que vou construir

### 1. Página `/perfil` — perfil pessoal

Rota protegida. Mostra:

**Bloco "Minha Conta"**
- Avatar + nome + email
- Saldo de créditos em destaque (dourado)
- Botão "Comprar mais créditos" → `/credits`
- Data de cadastro

**Bloco "Meus Dados Natais" (opcionais, editáveis)**
- Nome completo
- Data de nascimento
- Hora de nascimento
- Cidade de nascimento (autocomplete igual ao da home, grava `lat`/`lon`/`country`)
- Botão "Salvar"

Salva em `profiles` (colunas novas — ver Banco).

**Bloco "Minhas Últimas Consultas"**
Últimas 5 buscas de `consultations`, com link "Ver todas" → `/history`.

### 2. Auto-preenchimento na home

`CityLookup` / `HouseLookup` / `IntentLookup` passam a ler os dados natais do `profiles` ao abrir e pré-preencher o formulário. Campos seguem editáveis (só preenche se a pessoa salvou no perfil). Quem nunca preencheu segue digitando normal — nada bloqueia.

### 3. Nova aba `/admin` → "Métricas" (vira a aba padrão)

**Cards no topo:**
- Total de cadastros (count `profiles`)
- Cadastros últimos 7 / 30 dias
- Usuários ativos (≥ 1 consulta)
- Compradores (≥ 1 transação `type='purchase'`)
- Receita total em BRL (cruza `credit_transactions.purchase` × `pricing_config.price_brl`) — aparece zerado com label "aguardando pagamentos" até Stripe ligar
- Créditos vendidos (soma de amounts `purchase`)
- Créditos gastos (soma de amounts negativos)
- Consultas totais + breakdown por tipo (cidade / casa / intenção)

**Gráfico:** linha de cadastros por dia, últimos 30 dias (`recharts`, já no projeto).

**Tabela:** Top 10 usuários por créditos comprados e por créditos gastos.

Abas existentes (Preços, Usuários, Transações) ficam como estão.

### 4. Link no menu do usuário

`UserMenu.tsx` ganha item "Meu Perfil" → `/perfil`.

## Banco de dados

Uma migration:
- `ALTER TABLE profiles` adiciona `full_name text`, `birth_date date`, `birth_time time`, `birth_city text`, `birth_country text`, `birth_lat numeric`, `birth_lon numeric`. Tudo opcional (nullable).
- Nenhuma tabela nova. RLS atual cobre.

## Arquivos afetados

**Novos:**
- `src/pages/Profile.tsx`
- `src/components/admin/MetricsDashboard.tsx`
- `src/hooks/useNatalData.tsx` (lê/salva dados natais, expõe pré-preenchimento)

**Editados:**
- `src/App.tsx` (rota `/perfil`)
- `src/components/UserMenu.tsx` (item "Meu Perfil")
- `src/pages/Admin.tsx` (adiciona aba "Métricas" como primeira/padrão)
- `src/components/CityLookup.tsx`, `HouseLookup.tsx`, `IntentLookup.tsx` (auto-fill via `useNatalData`)
- `src/integrations/supabase/types.ts` (regenera após a migration)

## O que NÃO muda

- Lógica astrológica, integrações Flask/Wikipedia/OpenWeather
- Layout dos resultados, grid das 12 casas, fotos das cidades
- Stepper, ritual de constelação
- Fluxo de compra (Stripe segue "em breve")

## Resultado

- `/perfil`: vê créditos, salva dados natais uma vez
- Próximas consultas vêm pré-preenchidas — só escolhe modo + destino
- `/admin` abre direto em "Métricas" com cadastros, compradores, receita, consultas e gráfico de crescimento
