
# Revisão Geral — Plano em 4 Fases

Escopo dividido para reduzir risco de regressão e consumo de créditos. Cada fase é entregue e validada antes da próxima. Padrão visual de referência: **Dashboard**. Aviso de créditos: **inline nos botões + modal para ações caras (≥ 2 créditos ou irreversíveis)**.

---

## Fase 1 — Bugs críticos + Transparência de créditos

**Objetivo:** eliminar crashes, estados inconsistentes e garantir que nenhum crédito seja consumido sem aviso.

### Transparência de créditos
- Criar componente `ConfirmCreditAction` (AlertDialog reutilizável) com: quantidade de créditos, saldo atual, saldo após, aviso de irreversibilidade.
- Criar helper `CreditBadge` para exibir "(1 crédito)" ao lado do label de botões.
- Aplicar em:
  - `CityLookup`, `HouseLookup`, `IntentLookup` — botão principal mostra "Consultar (1 crédito)"; **sem modal** (custo baixo, ação recorrente), mas com toast de confirmação após débito.
  - `DestinyResults` — pacotes de desbloqueio (+1 casa = 1cr, +3 casas = 2cr, revelar tudo = 3cr) passam por **modal de confirmação obrigatório**.
  - Dashboard `?unlock=N` — se chegou via URL sem confirmação prévia, exibir modal antes de debitar.
- Mensagens padronizadas: "Esta ação consumirá X crédito(s). Saldo atual: Y. Após: Z."

### Bugs conhecidos (varredura)
- `HouseDetail.tsx` — revisar todos os `.toFixed`, `.map`, `.length` em campos possivelmente undefined (city.lat/lon já corrigido; auditar tags, options, cities).
- `DestinyResults.tsx` — validar `allResults[n]?.city` antes de renderizar; estados vazios com componente único `EmptyState`.
- `Dashboard.tsx` — garantir idempotência do `useEffect` de `?unlock=N` (evitar débito duplo em StrictMode / refresh).
- `History.tsx` — verificar por que "últimas consultas" não aparecem; provável mismatch de RLS ou filtro de user_id.
- Console: remover warnings de key, CSS shorthand, controlled/uncontrolled inputs.
- Remover imports não usados nos arquivos tocados.

### Entregáveis Fase 1
- 1 novo componente `ConfirmCreditAction`, 1 helper `CreditBadge`.
- Edits em: 3 lookups, `DestinyResults`, `Dashboard`, `History`, `HouseDetail`.
- Zero erros de console nas rotas principais (validado com Playwright headless).

---

## Fase 2 — Textos, gramática e tempos verbais

**Objetivo:** unificar copy em toda a aplicação. Zero mistura de tempos verbais.

### Ações
- Varredura de todos os textos hard-coded em `src/**/*.tsx` e `src/**/*.ts`.
- Corrigir ortografia, gramática, pontuação, concordância.
- Regra de tempos verbais:
  - **Presente contínuo** durante loading: "Consultando o cosmos...", "Calculando rotas...", "Carregando histórico..." (auditar todos os `loading ? "..." : "..."`).
  - **Passado** só após conclusão: "Consulta realizada", "Crédito debitado", "Casa desbloqueada".
  - **Futuro** só para ações posteriores: "Você receberá...", "Será descontado...".
- Padronizar termos duplicados:
  - "Casa" vs "Casa Astrológica" → sempre "Casa N" nos títulos, "Casa Astrológica" apenas em contexto explicativo.
  - "Cidade" vs "Destino" vs "Rota" → definir 1 termo por contexto.
  - "Créditos" vs "Consultas" → sempre "créditos".
  - "Passado/Presente/Futuro" — verbos consistentes por modo (memória já registrada).
- Placeholders, tooltips, toasts, mensagens de erro, empty states — todos revisados.
- Toasts com mesma estrutura via `useAlert` — variantes: success, error, info, loading.

### Entregáveis Fase 2
- Glossário curto em `src/lib/copy.ts` com strings reutilizadas (títulos de seção, labels de botão de ação, mensagens de estado).
- Edits de copy em ~15-20 arquivos.

---

## Fase 3 — Padronização visual (referência: Dashboard)

**Objetivo:** uma única linguagem visual em todas as telas.

### Ações
- **Tokens**: auditar `index.css` — garantir que todos os componentes usem `text-foreground`, `bg-card`, `border-border` etc. Remover qualquer `text-white`, `bg-black`, hex hard-coded.
- **Botões**: unificar alturas (`h-12` primário, `h-10` secundário), padding, tipografia (Cinzel uppercase tracking).
- **Cards**: mesma borda, raio (`rounded-xl`), shadow, padding interno.
- **Inputs**: mesma altura, foco, placeholder, ícones à esquerda.
- **Grid/spacing**: gap-6 entre seções, gap-4 entre itens, container `max-w-6xl mx-auto px-4`.
- **Modais**: usar shadcn Dialog com header + description + footer; nunca `alert()` ou `confirm()`.
- **Loading states**: padronizar spinner (`Loader2 animate-spin`), skeletons via `<Skeleton />`.
- **Empty states**: componente `<EmptyState icon title description action />` reutilizável.
- **Header/nav**: mesma altura, mesmo padding, mesmo comportamento mobile.

### Telas alvo
Index, Dashboard, History, Credits, Profile, Auth, Admin — todas alinhadas ao Dashboard.

### Entregáveis Fase 3
- Novo `<EmptyState />`, `<PageContainer />`, `<SectionHeader />`.
- Refatoração visual (sem mudança de lógica) em ~10 páginas/componentes.

---

## Fase 4 — UX, acessibilidade e responsividade

**Objetivo:** polimento final.

### UX
- Reduzir cliques em fluxos frequentes.
- Feedback imediato em toda ação (toast + estado visual).
- Botões desabilitados quando ação inválida, com tooltip explicando por quê.

### Acessibilidade
- `aria-label` em todos os botões ícone-only.
- Contraste — nada abaixo de WCAG AA (usar tokens `foreground`/`muted-foreground`).
- Foco visível em todos os interativos.
- Hierarquia de headings (1 `<h1>` por página, sem pular níveis).
- `<main>` único por rota.
- `h-dvh` no lugar de `h-screen` onde aplicável.

### Responsividade
- Testar em 375px, 768px, 1024px, 1440px com Playwright.
- Corrigir quebras: grids que viram coluna única, tabelas com scroll horizontal, modais que ocupam tela cheia no mobile.
- Menu mobile do Header revisado.

### Validação final
- Playwright: percorrer fluxo completo (login → consulta passado/presente/futuro → desbloqueio → history → dashboard) em desktop e mobile.
- Zero warnings no console em todas as rotas.
- Confirmar que todos os avisos de créditos aparecem antes do débito.

---

## Detalhes técnicos

### Custo estimado
Fase 1 é a maior (bugs + fluxo de créditos, ~8-12 arquivos modificados). Fases 2-4 são progressivamente menores em risco mas amplas em superfície.

### Ordem de execução dentro de cada fase
1. Ler todos os arquivos relevantes em paralelo.
2. Criar componentes/helpers compartilhados primeiro.
3. Aplicar em todas as chamadas.
4. Validar com Playwright antes de encerrar a fase.

### O que NÃO vai mudar
- Schema do banco (a menos que um bug exija).
- Lógica de negócio de precificação (`usePricing`).
- Endpoints da API externa.
- Fluxo de autenticação Google.

---

**Começo pela Fase 1.** Aprove para eu implementar; ao final entrego resumo e peço confirmação antes da Fase 2.
