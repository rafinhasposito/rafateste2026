

## Plano: Refatoração Visual Completa — Glassmorphism, Contraste e Grid das 12 Casas

### Resumo

Redesign completo do `DestinyResults.tsx` focando em 4 áreas: (1) glassmorphism no card principal, (2) contraste global texto/fundo, (3) grid das 12 casas com bordas coloridas por elemento, (4) cards de localização limpos no Mapeamento Global.

---

### 1. Card "O Destino Mestre" — Novo Design Glassmorphism

**Estrutura atual:** Hero image com overlays sobrepostos, textos diretamente sobre a foto, resultando em "foto sobre foto" e baixa legibilidade.

**Nova estrutura:**

```text
┌──────────────────────────────────────────────────┐
│  FUNDO SÓLIDO da casa (ex: azul royal Casa 9)   │
│  + Imagem da cidade com opacity 0.25 + blend     │
│  ┌──────────────────────────────────────────┐    │
│  │  CARD DE VIDRO (glassmorphism)            │    │
│  │  ┌─────────────────────────────────┐      │    │
│  │  │  "Casa 9" (grande, font-cinzel)  │      │    │
│  │  │  "Viagens & Estudos" (subtítulo) │      │    │
│  │  │  ─────────────────────────────── │      │    │
│  │  │  Bandeira + Québec + coords     │      │    │
│  │  │  Clima badge                     │      │    │
│  │  │  ─────────────────────────────── │      │    │
│  │  │  Egrégora | Significado          │      │    │
│  │  │  Sobre Québec (wiki)             │      │    │
│  │  │  Rituais (com ícones)            │      │    │
│  │  │  Previsões (com ícones)          │      │    │
│  │  └─────────────────────────────────┘      │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

**Implementação técnica:**
- **Fundo externo:** cor sólida por casa usando uma nova paleta `HOUSE_SOLID_COLORS` (ex: Casa 9 = `#1e3a6e` azul royal, Casa 1 = `#6e1e1e` vermelho escuro, etc.)
- **Imagem:** `opacity: 0.2`, `mix-blend-mode: luminosity`, posicionada como background absoluto
- **Card de vidro:** `bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl`
- **Eliminar** os overlays sobrepostos atuais (linhas 310-316) que criam o efeito "foto sobre foto"
- **Eliminar** a foto duplicada (linhas 472-486) — a imagem já está no fundo

### 2. Correção Global de Contraste

- **Dentro do glass card:** todo texto será `text-white` ou `text-white/90` (corpo) e `rgb(${accentColor})` (títulos/labels)
- **Tags:** fundo `bg-white/15` com texto `text-white/90` (atualmente algumas ficam escuras)
- **Seções internas (Egrégora, Rituais, Previsões):** substituir `bg-card/60` e `bg-card/40` por `bg-white/5 border border-white/10` — evita o card escuro dentro de card escuro
- **Wikipedia section:** mesma regra — `bg-white/5`

### 3. Grid "Explorar Todas as Casas" — Bordas por Elemento

Nova paleta de bordas por elemento/signo:

| Casa | Signo | Elemento | Cor da Borda |
|------|-------|----------|-------------|
| 1, 5, 9 | Áries, Leão, Sagitário | Fogo | `#e74c3c` vermelho |
| 2, 6, 10 | Touro, Virgem, Capricórnio | Terra | `#27ae60` verde |
| 3, 7, 11 | Gêmeos, Libra, Aquário | Ar | `#3498db` azul |
| 4, 8, 12 | Câncer, Escorpião, Peixes | Água | `#9b59b6` violeta |

**Card da casa selecionada (casa-alvo):** borda 2px sólida na cor do elemento + `ring-2` + badge "Casa-alvo" + `bg-white/8` em vez de transparente

**Cards normais:** borda esquerda 3px na cor do elemento, resto `border-white/10`

### 4. Mapeamento Global — Cards de Localização Limpos

Refatorar os cards de cidades secundárias:
- Layout simples: `bg-white/5 border border-white/10 rounded-xl p-4`
- Bandeira à esquerda, nome da cidade e país à direita
- Coordenadas em `font-mono text-white/40`
- Sem bordas coloridas por casa (neutro) — borda esquerda `border-l-2 border-white/20`
- Quando bloqueado: blur no nome + ícone de cadeado discreto

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Glassmorphism no hero, contraste global, grid com bordas por elemento, cards de mapeamento limpos |

### O que NÃO muda
- `houses.ts`, `HouseCard.tsx`, `GoalCards.tsx`, `Index.tsx`
- Lógica de desbloqueio, créditos, API
- Sem migrações de banco

