

## Plano: Hero Deslumbrante com Foto da Cidade em Destaque + Contraste Corrigido

### Problema

O hero atual usa a foto da cidade com `opacity: 0.2` e `mix-blend-mode: luminosity` sobre um fundo sólido escuro — resultado: tudo cinza/escuro, a foto é invisível, e o glass card (`rgba(255,255,255,0.07)`) mal se distingue do fundo. Zero impacto visual.

### Nova Abordagem: Foto Full-Bleed com Overlay Gradiente da Casa

```text
┌─────────────────────────────────────────────────┐
│  FOTO DA CIDADE (100% opacity, object-cover)    │
│  ┌─ GRADIENT OVERLAY ──────────────────────┐    │
│  │  De: rgba(houseSolidColor, 0.85) topo   │    │
│  │  Para: rgba(0,0,0,0.7) base             │    │
│  │                                          │    │
│  │  ┌── GLASS CARD (forte) ─────────────┐  │    │
│  │  │  bg-black/40 backdrop-blur-xl      │  │    │
│  │  │  border: 1px solid white/25        │  │    │
│  │  │                                    │  │    │
│  │  │  CASA 9  (3xl, white, cinzel)      │  │    │
│  │  │  Viagens & Estudos (accent color)  │  │    │
│  │  │  ─────────────────────────────     │  │    │
│  │  │  Québec  🇨🇦  coords  clima       │  │    │
│  │  │  Egrégora | Significado            │  │    │
│  │  │  Rituais | Previsões               │  │    │
│  │  └───────────────────────────────────┘  │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Mudanças Específicas

#### 1. Foto da Cidade — VISÍVEL e Deslumbrante
- Remover `opacity-20` e `mix-blend-mode: luminosity`
- Imagem em **opacity total** (`opacity-100`) quando desbloqueado, `opacity-60 blur-sm` quando bloqueado
- Adicionar **gradient overlay forte** por cima da foto usando a cor sólida da casa:
  ```
  linear-gradient(to bottom, 
    rgba(houseSolidColor, 0.8) 0%,
    rgba(houseSolidColor, 0.4) 40%,
    rgba(0,0,0,0.85) 100%)
  ```
- Isso cria o efeito "imagem deslumbrante tingida com a cor da casa"

#### 2. Glass Card — Mais Opaco e Legível
- Trocar `bg-white/7` por `bg-black/40 backdrop-blur-xl`
- Border mais visível: `border-white/25` (era `/15`)
- Adicionar `shadow-[0_8px_32px_rgba(0,0,0,0.5)]`

#### 3. Seções Internas — Fundo Distinto
- Egrégora, Rituais, Previsões, Wikipedia: trocar `bg-white/5 border-white/10` por `bg-black/30 border-white/15`
- Texto corpo: `text-white/90` (era `/80` e `/85`)
- Labels: `rgb(accentColor)` com `font-bold` (já está, manter)

#### 4. Cards das 12 Casas — Fundo Mais Escuro
- Cards desbloqueados: `bg-black/30` com `border-white/15`
- Nomes das casas: `text-white font-bold text-base` (garantir)
- Labels/archetype: `text-white/70` (era `/60`)

#### 5. Mapeamento Global — Idem
- Cards: `bg-black/25 border-white/12`
- Nomes: `text-white font-semibold`

### Arquivo Modificado

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Foto full-opacity, gradient overlay da casa, glass card mais opaco, contraste global corrigido |

### O que NÃO muda
- Lógica de desbloqueio, créditos, API
- `houses.ts`, `Index.tsx`, `GoalCards.tsx`
- Sem migrações

