

## Plano: Corrigir Fotos, Cidades nas 12 Casas Desbloqueadas e Contraste Visual

### Problemas Identificados

1. **Fotos do Destino Mestre** — `source.unsplash.com` retorna redirects/erros frequentemente (serviço descontinuado). Precisa usar URLs fixas ou Unsplash Images diretamente.

2. **Casas desbloqueadas não mostram cidades** — Na linha 599, `houseCity` é `null` para todas as casas exceto a consultada (`isCurrentHouse`). Quando o usuário paga para desbloquear +1, +3 ou 12 casas, o componente não tem dados de cidades para as outras 11 casas.

3. **Busca por cidade e intenção** — Mesma situação: o `DestinyResults` recebe apenas a cidade da casa consultada. Ao desbloquear as 12 casas, não há dados para popular.

4. **Contraste ruim** — Texto `text-foreground/50` e `text-foreground/70` sobre fundo `rgba(2,4,8,1)` fica praticamente invisível. As tags com `bg-foreground/5` são ilegíveis.

### Solução

#### 1. Fotos — Expandir CITY_IMAGES e corrigir fallback

- Substituir `source.unsplash.com` (descontinuado) por URLs diretas do Unsplash via `images.unsplash.com/photo-ID`
- Adicionar mais cidades ao dicionário curado (Tokyo, Moscou, Praga, Viena, etc.)
- Fallback: usar a imagem da `cityDatabase[house].img` como última opção

#### 2. Cidades nas 12 casas — Usar dados da API completos

O problema central: a API `/find_all_cities` retorna `data.results` com dados para TODAS as 12 casas (keyed por número). Mas `HouseLookup` e `IntentLookup` extraem apenas `data.results[selectedHouse]`.

**Mudanças em `HouseLookup.tsx` e `IntentLookup.tsx`:**
- Extrair `data.results` completo e passar como nova prop `allResults` ao `DestinyResults`

**Mudanças em `CityLookup.tsx`:**
- A API `/audit_past` retorna apenas 1 casa. Usar `cityDatabase` para dados estáticos das outras casas, sem cidades (mostrar apenas "Desbloqueada" sem cidade específica).

**Mudanças em `DestinyResults.tsx`:**
- Nova prop: `allResults?: Record<string, { options: { highticket, acessivel, nacional } }>`
- No grid das 12 casas, quando uma casa está desbloqueada e `allResults[houseNum]` existe, mostrar a cidade `highticket[0]` dessa casa com bandeira e nome
- Se não tem dados de API para aquela casa, mostrar badge "Desbloqueada" sem cidade

#### 3. Contraste — Reforçar legibilidade em fundo escuro

**Cards do grid das 12 casas:**
- Tags: `bg-white/10 border-white/20 text-white/80` (em vez de `bg-foreground/5`)
- Cristal label: `text-white/60` e valor: `text-white/90`
- Arquétipo/signo/regente: `text-white/60`
- Casa N: usar cor accent da casa (`rgb(${hAccent})`) em vez de `text-primary`
- Label: `text-white font-semibold`
- Overlay bloqueado: manter `bg-background/80`

**Master Destiny (seção principal):**
- Tags de poder: já usam accent color — OK
- Texto de rituais/previsões: `text-white/80` em vez de `text-foreground/70`

**Cards secundários:**
- Nomes de cidades: `text-white font-semibold` em vez de `text-foreground`

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Nova prop `allResults`, cidades nas 12 casas, contraste, fallback de fotos |
| `src/components/HouseLookup.tsx` | Passar `allResults` completo da API |
| `src/components/IntentLookup.tsx` | Passar `allResults` completo da API |
| `src/components/CityLookup.tsx` | Ajuste menor (sem dados multi-casa da API audit_past) |

### O que NÃO muda
- `houses.ts`, `HouseCard.tsx`, `Dashboard.tsx` — intactos
- Sem migrações de banco
- Edge function `get-weather` — intacta

