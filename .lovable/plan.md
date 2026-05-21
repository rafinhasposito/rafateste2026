## Diagnóstico

O banco de dados está **vazio**. O código já chama `profiles`, `consultations` e `credit_transactions` em vários lugares, mas essas tabelas nunca foram criadas — por isso créditos, histórico e compras estão quebrados hoje. Preços e custos por ação estão **hardcoded** em `src/pages/Credits.tsx` e nos componentes Lookup.

## O que vou construir

### 1. Banco de dados (1 migration)

**Tabelas novas:**
- `profiles` — `user_id`, `display_name`, `avatar_url`, `credits` (default 1 crédito de boas-vindas), timestamps
- `user_roles` — `user_id`, `role` (enum: `admin` | `user`). Tabela separada por segurança (impede escalada de privilégio)
- `consultations` — histórico de buscas: `user_id`, `query_type` (city/house/intent), `query_data` jsonb, `results` jsonb, `credits_spent`
- `credit_transactions` — extrato: `user_id`, `amount` (+/-), `type` (purchase/spend/admin_grant), `description`
- `pricing_config` — configuração editável de pacotes e custos por ação. Linhas: `package_1cr`, `package_2cr`, `package_3cr`, `cost_city`, `cost_house_1`, `cost_house_3`, `cost_full_map`. Cada uma com `label`, `credits`, `price_brl`, `description`, `active`

**Função de segurança:** `has_role(user_id, role)` SECURITY DEFINER para usar em RLS sem recursão

**Trigger:** ao criar usuário em `auth.users`, cria automaticamente `profiles` com 1 crédito grátis e papel `user`

**RLS:**
- `profiles` / `consultations` / `credit_transactions`: usuário vê só os próprios; admin vê todos
- `user_roles`: usuário vê o próprio papel; só admin altera
- `pricing_config`: leitura pública (frontend precisa pra exibir preços); escrita só admin

### 2. Login (Google + Email/Senha)

- Mantém Google (já funciona)
- Adiciona formulário Email/Senha em `/auth` com abas "Entrar" e "Criar conta"
- Página nova `/reset-password` para recuperação de senha
- Auto-confirm desligado (usuário precisa verificar email — padrão seguro)
- Loga ouvinte `onAuthStateChange` antes de `getSession()` no `useAuth`

### 3. Painel Admin `/admin`

Rota protegida (só usuários com role `admin` entram). Três abas:

- **Preços & Custos**: edita os 7 itens de `pricing_config` (pacotes de compra + custos por ação). Salvar atualiza o banco; o frontend público lê de lá em vez do hardcode.
- **Usuários**: lista todos com `email`, `display_name`, `credits`, total gasto, data de cadastro. Botões: "+ Crédito", "− Crédito" (registra em `credit_transactions` como `admin_grant`), "Tornar admin" / "Remover admin".
- **Transações**: tabela com todas as movimentações de crédito (compras, gastos, grants), filtro por usuário e tipo.

### 4. Frontend lê preços do banco

- `Credits.tsx` busca `pricing_config` em vez do array hardcoded
- `CityLookup` / `HouseLookup` / `IntentLookup` buscam os custos de `pricing_config` em vez de constantes locais
- Botão de comprar continua "em breve" (estrutura pronta, Stripe fica para depois conforme você pediu)

### 5. Bootstrap do seu acesso admin

Depois que a migration rodar e você fizer login uma vez (Google ou email), eu te peço o email da conta e rodo um INSERT em `user_roles` te marcando como admin. A partir daí, `/admin` libera pra você.

## O que NÃO muda

- Lógica de cálculo astrológico, integração Flask/Wikipedia/OpenWeather
- Layout dos resultados, grid das casas, fotos das cidades
- Fluxo de stepper, ritual de constelação

## Arquivos afetados

- **Novos**: `src/pages/Admin.tsx`, `src/pages/ResetPassword.tsx`, `src/hooks/usePricing.tsx`, `src/hooks/useIsAdmin.tsx`, `src/components/admin/PricingEditor.tsx`, `src/components/admin/UsersTable.tsx`, `src/components/admin/TransactionsTable.tsx`
- **Editados**: `src/pages/Auth.tsx` (adiciona email/senha), `src/pages/Credits.tsx` (lê do banco), `src/components/CityLookup.tsx` + `HouseLookup.tsx` + `IntentLookup.tsx` (lê custos do banco), `src/App.tsx` (rotas `/admin` e `/reset-password`), `src/components/UserMenu.tsx` (link "Admin" se for admin)

## Resultado esperado

- Login funciona com Google **e** Email/Senha + recuperação de senha
- Você acessa `/admin`, edita preço de qualquer pacote ou custo de ação e o site inteiro atualiza imediatamente sem mexer em código
- Você vê todos os usuários, dá ou tira créditos manualmente
- Estrutura de pagamento pronta — quando quiser ligar Stripe, é só plugar
