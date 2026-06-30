# Plano: Admin + Cobrança unificada + Pagamentos Stripe

## 1. Promover `divulgacaoareavip@gmail.com` a admin

- Migration que, ao identificar o `user_id` desse email em `auth.users`, insere `('admin')` em `public.user_roles` (idempotente, `ON CONFLICT DO NOTHING`).
- Trigger `on_auth_user_created` adicional: se `NEW.email = 'divulgacaoareavip@gmail.com'`, promove automaticamente em qualquer (re)cadastro futuro.
- Resultado: ao logar com esse email, o menu mostra "Painel Admin" e `/admin` libera as abas Métricas, Preços, Usuários, Transações.

> Você já pode liberar créditos manualmente em **Admin → Usuários** (botões +/−1 por usuário, com log em `credit_transactions`). Vou adicionar também um campo "definir saldo exato" e "+10 / +50" para acelerar lançamentos.

## 2. Cobrança unificada: 1 crédito por consulta

Hoje a cobrança só acontece quando o usuário clica "desbloquear cidades extras". Vou padronizar:

- **Toda consulta custa 1 crédito**, debitado antes da chamada da API, nas três entradas: `CityLookup`, `HouseLookup`, `IntentLookup`.
- Atualizar `pricing_config`: chave `consulta_base = 1`. Os pacotes de desbloqueio extra (3 casas / 12 casas) continuam, mas a primeira casa-alvo já vem incluída na consulta base.
- Se o usuário tiver 0 créditos → redireciona para `/credits` antes de chamar a API (evita gastar request).
- Reabrir uma consulta antiga em **Histórico** continua **gratuito** (já está pago).
- Admins não são cobrados (bypass via `useIsAdmin`).
- Cada débito gera linha em `credit_transactions` com `type='consulta'` e descrição contendo casa/cidade/ano.

## 3. Pagamentos — Stripe (recomendado)

Para o público (Brasil, cartão local + internacional, Pix via Stripe, assinaturas futuras) e como a recomendação automática descartou Paddle por país do vendedor (BR), o melhor caminho é **Stripe gerenciado pela Lovable** com **cálculo e coleta de imposto (+0,5%)** — Stripe calcula/coleta o imposto no checkout e você cuida de registro/declaração/recolhimento.

Fluxo proposto:
1. Habilitar Stripe gerenciado (sem precisar de chave manual; ambiente de teste imediato).
2. Criar produtos espelhando o `pricing_config` atual:
   - 1 crédito — R$ 29,90
   - 3 créditos — R$ 79,90
   - 10 créditos — R$ 199,90 (novo, melhor margem)
   - Mapa completo (12 casas, sem custo adicional de créditos) — R$ 249,90
3. Página `/credits` reformulada: cards de pacote → botão "Comprar" → Stripe Checkout (modo `payment`, não assinatura) → webhook credita `profiles.credits` e registra `credit_transactions` (`type='compra'`).
4. Edge function `stripe-webhook` (verify signature) + edge function `create-checkout` (cria session com `client_reference_id = user.id`).
5. Admin → aba **Métricas** já mostra receita; ela passa a refletir compras reais.

> Alternativa se preferir agora: manter os preços só como referência e ativar Stripe depois. Mas sem gateway a aba "Comprar créditos" continua decorativa.

## 4. Revisão geral do site (itens que vou ajustar de quebra)

- `UserMenu`: garantir link "Painel Admin" só aparece se `isAdmin`.
- `Credits.tsx`: refatorar para consumir `pricing_config` + botão real de Stripe.
- `Dashboard / History`: reabrir consulta antiga **não** cobra (já paga).
- Mensagem clara no formulário da home: "Esta consulta usa 1 crédito".
- Bloqueio amigável quando saldo = 0 com CTA para `/credits`.

## Detalhes técnicos

- Migration:
  ```sql
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users
  WHERE email='divulgacaoareavip@gmail.com'
  ON CONFLICT DO NOTHING;
  ```
  + ajuste em `handle_new_user` para auto-promover esse email.
- Débito 1cr: helper `chargeConsultation(userId, meta)` em `src/lib/credits.ts` chamado nos 3 lookups.
- Stripe: `payments--enable_stripe_payments` → `batch_create_product` → edge functions `create-checkout` e `stripe-webhook` → atualizar `/credits`.
- Webhook usa `service_role` para escrever em `profiles` e `credit_transactions`.

## Confirmações que preciso

1. Confirma habilitar **Stripe** agora (test mode imediato, live após verificar conta)?
2. Mantém os preços R$ 29,90 / 79,90 / 199,90 / 249,90 ou quer outros?
3. Reabrir consulta antiga deve mesmo continuar **grátis**?
