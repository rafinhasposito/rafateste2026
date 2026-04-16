

## Plano: Fundo Sólido no Hero + Foto da Cidade na Seção "Sobre"

### Problema
A foto da cidade no hero compete com o glass card e os textos. O resultado fica confuso visualmente.

### Nova Abordagem

**Hero:** Fundo sólido da casa (já temos `HOUSE_SOLID_COLORS`) com um gradiente sutil, SEM foto. Limpo, elegante, foco total no texto.

**Seção "Sobre [Cidade]":** A foto da cidade aparece aqui, grande e deslumbrante, ANTES do texto da Wikipedia. Funciona como uma "janela" visual para a cidade.

```text
┌─────────────────────────────────────────────────┐
│  FUNDO SÓLIDO da casa (gradiente sutil)         │
│  ┌── GLASS CARD ─────────────────────────────┐  │
│  │  CASA 9 · Viagens & Estudos               │  │
│  │  Québec 🇨🇦 · coords · clima              │  │
│  │  ─────────────────────────────────         │  │
│  │  Egrégora | Significado                    │  │
│  │  ─────────────────────────────────         │  │
│  │  ┌─ SOBRE QUÉBEC ──────────────────────┐  │  │
│  │  │  ┌──────────────────────────────┐    │  │  │
│  │  │  │  FOTO DA CIDADE (rounded,    │    │  │  │
│  │  │  │  max-h-64, object-cover,     │    │  │  │
│  │  │  │  borda accent suave)         │    │  │  │
│  │  │  └──────────────────────────────┘    │  │  │
│  │  │  Texto da Wikipedia...               │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  Rituais | Previsões                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Mudanças Específicas

#### 1. Hero — Fundo Sólido com Gradiente
- Remover a `<img>` do hero (linhas 322-329)
- Trocar o gradient overlay por um gradiente sólido elegante:
  ```
  linear-gradient(135deg, houseSolidColor 0%, darken 60%, rgba(0,0,0,0.9) 100%)
  ```
- Manter o watermark do número da casa (sutil)

#### 2. Seção "Sobre" — Foto da Cidade em Destaque
- Dentro da seção Wikipedia (linhas 551-571), adicionar a foto ANTES do texto
- Foto com `rounded-xl`, `max-h-64`, `object-cover`, `w-full`
- Borda suave na cor accent: `border-2 border-[rgba(accent,0.3)]`
- Se `wikiData.thumbnail` existir, usar a imagem da Wikipedia; senão, usar `heroImage` (do dicionário de fotos)
- Fallback: se não houver foto, seção aparece só com texto (como hoje)

#### 3. Contraste Mantido
- Glass card continua `bg-black/40 backdrop-blur-xl`
- Textos brancos, labels na cor accent
- Sem mudanças nas seções de Rituais, Previsões, Grid ou Mapeamento

### Arquivo Modificado

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Remover foto do hero, fundo sólido gradiente, foto da cidade na seção "Sobre" |

### O que NÃO muda
- Lógica de desbloqueio, créditos, API, Wikipedia fetch
- Grid das 12 casas, Mapeamento Global
- `houses.ts`, `Index.tsx`, `GoalCards.tsx`
- Sem migrações

