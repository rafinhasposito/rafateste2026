

## Plano: Reestruturar Formulário em Stepper de 3 Etapas

### Resumo

Transformar o fluxo atual (mode selector binário + formulário + path selector lado a lado) em um stepper progressivo de 3 etapas com revelação sequencial.

### Estado Atual
- `Mode` é binário: "futuro" | "passado" (sem "presente")
- O formulário de dados natais e o seletor de método aparecem simultaneamente dentro do mesmo card
- Não há conceito de etapas/stepper

### Mudanças em `src/pages/Index.tsx`

#### 1. Novo type e estado

- Alterar `type Mode = "futuro" | "passado" | "presente"`
- Novo estado: `step` (1, 2 ou 3) — controlado automaticamente pelas seleções
- Quando `mode` é selecionado → `step = 2`
- Quando `searchPath` é selecionado → `step = 3`
- Reset: mudar `mode` reseta `searchPath` e volta ao step 2; clicar "voltar" regride

#### 2. Etapa 1 — Seleção Temporal (substitui o mode selector atual)

- 3 cards grandes (Passado, Presente, Futuro) com ícones distintos
- Ao selecionar, exibir texto contextual:
  - Passado: "Onde você passou seu aniversário?"
  - Presente: "Onde você está passando seu aniversário este ano?"
  - Futuro: "Onde você ancora o seu Sol, define os próximos 12 meses."
- Animação de entrada com framer-motion

#### 3. Etapa 2 — Como Deseja Consultar? (aparece após Etapa 1)

- Reutilizar os 3 `pathOptions` existentes (Cidade, Casa, Intenção)
- Título e subtítulo conforme especificado
- Transição suave com AnimatePresence

#### 4. Etapa 3 — Coleta de Dados (aparece após Etapa 2)

- Formulário de dados natais (nome, data, hora, cidade, ano) — mesmo que o atual
- O campo "ano" ajusta label conforme mode (passado/presente/futuro)
- Abaixo do formulário: o componente de lookup correspondente (CityLookup, HouseLookup ou IntentLookup)

#### 5. Navegação entre etapas

- Breadcrumb/indicador visual de progresso no topo (3 dots ou steps)
- Botão "Voltar" em cada etapa para regredir
- Seleção em Etapa 1 e 2 auto-avança (sem botão "Próximo")

#### 6. Ajuste do campo "Presente"

- Quando `mode === "presente"`: o campo de ano é preenchido automaticamente com o ano atual e desabilitado
- Texto e tom verbal neutro (nem passado nem futuro)

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/pages/Index.tsx` | Stepper 3 etapas, novo mode "presente", navegação progressiva |

### O que NÃO muda
- Componentes de lookup (CityLookup, HouseLookup, IntentLookup)
- DestinyResults, houses.ts, Dashboard
- Sem migrações de banco

