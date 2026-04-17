

## Plano: Trazer o Visual Premium para a Página de Histórico

### Diagnóstico

A página `/dashboard?id=...` (histórico de "Meus Mapas") usa componentes diferentes da home:
- **Home (busca nova)**: usa `DestinyResults.tsx` — já refatorado, com foto da cidade, glass card, cores vibrantes, alto contraste.
- **Histórico (Dashboard)**: usa `HouseDetail.tsx` + `HouseCard.tsx` — **ainda no design antigo**, com texto cinza apagado (`text-foreground/30-60`), sem foto da cidade, sem cores por casa, sem clima/Wikipedia.

Por isso o usuário sente que "tinha tudo isso antes e agora ficou ruim" — na verdade, o histórico nunca recebeu o visual premium.

### Solução

Aplicar o mesmo sistema visual do `DestinyResults.tsx` aos dois componentes do dashboard, mantendo a lógica intacta (créditos, desbloqueio, dados).

### Mudanças

#### 1. `HouseDetail.tsx` — Refatoração visual completa
- **Hero**: fundo sólido da casa (`HOUSE_SOLID_COLORS`) com gradiente + watermark do número da casa, ao invés do `houseColors` gradient antigo.
- **Glass card**: envolver conteúdo em `bg-black/40 backdrop-blur-xl border-white/15`.
- **Foto da cidade**: adicionar imagem grande (`h-64 object-cover`) na seção do destino principal, com overlay escuro no rodapé para legibilidade.
- **Contraste**: substituir todos os `text-foreground/30-60` por `text-white/90` (corpo) e `text-white` (títulos). Eliminar texto colorido sobre fundo escuro.
- **Cores decorativas**: usar `HOUSE_ACCENT_RGB` (cores vibrantes) só para ícones, bordas, badges e o nome do arquétipo — nunca para texto longo.
- **Seções (Leitura, Sombra, Promessa, Áreas, Benefício/Ideal, Radar)**: padronizar com `bg-black/30 border-white/15`, labels coloridos com accent vibrante, corpo em branco/off-white.
- **Bandeira do país** ao lado do nome da cidade no destino principal.

#### 2. `HouseCard.tsx` — Cards do grid das 12 casas
- Borda esquerda colorida pelo elemento da casa (Fogo/Terra/Ar/Água via `ELEMENT_COLORS`).
- Fundo `bg-black/40` ao invés do gradient leve atual; melhor contraste do texto.
- Nome da casa em `text-white font-bold`, label em `text-white/90`, metadados em `text-white/70` (não mais `/50`).
- Badge "Casa-alvo" com cor vibrante da casa.
- Estado bloqueado: blur + cadeado discreto (manter atual mas refinar).
- Estado selecionado: ring na cor accent da casa (não mais dourado genérico).

#### 3. Reutilizar tokens do `DestinyResults.tsx`
- Extrair `HOUSE_SOLID_COLORS`, `HOUSE_ACCENT_RGB`, `ELEMENT_COLORS`, `CITY_IMAGES`, `getCityImage` para um novo arquivo compartilhado: **`src/lib/houseTheme.ts`**.
- Importar em `DestinyResults.tsx`, `HouseDetail.tsx` e `HouseCard.tsx` para garantir consistência visual em todo o app.

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/lib/houseTheme.ts` | **NOVO** — tokens compartilhados (cores sólidas, accents vibrantes, cores por elemento, fotos das cidades) |
| `src/components/HouseDetail.tsx` | Hero com fundo sólido, foto da cidade, glass card, contraste branco, cores accent decorativas |
| `src/components/HouseCard.tsx` | Borda colorida por elemento, fundo escuro, texto branco legível, badge alvo na cor da casa |
| `src/components/DestinyResults.tsx` | Trocar tokens locais pelos imports do `houseTheme.ts` (sem mudança visual) |

### O que NÃO muda

- `Dashboard.tsx` (estrutura, lógica, fluxo)
- Sistema de créditos e desbloqueio
- `houses.ts`, `houseMeta.ts`, dados
- Banco / API / Supabase

### Resultado esperado

O histórico em `/dashboard?id=...` ficará visualmente idêntico ao `DestinyResults.tsx` da home — foto deslumbrante da cidade, fundo sólido com a cor da casa, texto branco perfeitamente legível, cores vibrantes apenas em elementos decorativos, grid das 12 casas com bordas por elemento. Zero texto cinza sobre fundo escuro.

