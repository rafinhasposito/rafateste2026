

## Plano: Sistema de Cores por Seção + Destaque nos Nomes das Casas

### Problema

Tudo usa o mesmo esquema escuro dourado — Home, Passado, Presente e Futuro são visualmente idênticos. Os nomes das 12 casas no grid ficam pequenos e sem destaque. O site inteiro parece "uma cor só".

### Solução: Paleta Cromática por Seção

Cada contexto temporal terá sua própria identidade cromática, aplicada nos cards do stepper, no glass-panel do Step 3, nos badges e nos acentos:

| Seção | Cor Principal | Aplicação |
|---|---|---|
| **Home (Hero)** | Dourado (atual) | Mantém o gold premium como identidade geral |
| **Passado** | Âmbar/Cobre `rgb(205, 127, 50)` | Tons quentes envelhecidos, sensação de memória |
| **Presente** | Esmeralda `rgb(0, 180, 120)` | Verde vibrante, energia do agora |
| **Futuro** | Índigo/Violeta `rgb(120, 80, 220)` | Tons cósmicos, projeção e visão |

### Mudanças em `src/pages/Index.tsx`

#### 1. Mapa de cores por modo

```ts
const modeTheme = {
  passado: { accent: "205, 127, 50", glow: "rgba(205,127,50,0.3)", border: "rgba(205,127,50,0.4)", bg: "rgba(205,127,50,0.08)" },
  presente: { accent: "0, 180, 120", glow: "rgba(0,180,120,0.3)", border: "rgba(0,180,120,0.4)", bg: "rgba(0,180,120,0.08)" },
  futuro: { accent: "120, 80, 220", glow: "rgba(120,80,220,0.3)", border: "rgba(120,80,220,0.4)", bg: "rgba(120,80,220,0.08)" },
};
```

#### 2. Step 1 — Cards temporais com cor própria

Cada card (Passado/Presente/Futuro) terá borda e ícone na sua cor específica em vez de tudo dourado. Ao selecionar, o glow e o fundo usam a cor do modo.

#### 3. Step 2 e Step 3 — Cor do modo selecionado

- O glass-panel do formulário herda a cor accent do modo (borda, linha superior, badges)
- Os step indicators (1-2-3) usam a cor do modo ativo em vez de gold fixo
- Os breadcrumb badges mudam de gold para a cor do modo

#### 4. Nomes das Casas com mais destaque

No grid das 12 casas (`DestinyResults.tsx`) e nos `GoalCards.tsx`:
- Nome da casa: fonte maior (`text-sm` → `text-base`), `font-bold`, cor accent da casa (`rgb(${hAccent})`) em vez de branco genérico
- Label (ex: "Ação & Magnetismo"): fonte `text-white font-semibold` com letter-spacing
- Número da casa: badge colorido maior com fundo accent

### Mudanças em `src/index.css`

- Adicionar variáveis CSS para as 3 cores temporais (para uso global se necessário):
  ```css
  --mode-passado: 30 76% 50%;
  --mode-presente: 160 100% 35%;
  --mode-futuro: 260 58% 59%;
  ```

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/pages/Index.tsx` | `modeTheme` map, cores dinâmicas nos steps/badges/borders |
| `src/index.css` | Variáveis CSS para as cores temporais |
| `src/components/DestinyResults.tsx` | Nomes das casas maiores e com cor accent |
| `src/components/GoalCards.tsx` | Nome da casa com mais destaque e cor |

### O que NÃO muda
- `houses.ts`, `HouseCard.tsx`, Dashboard
- Lógica de API, desbloqueio, créditos
- Sem migrações de banco

