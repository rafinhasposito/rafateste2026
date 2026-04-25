## Objetivo

Duas mudanças visuais pontuais e cirúrgicas — sem mexer em lógica, créditos, API ou no visual da Casa Escolhida.

---

### 1. Grid "Explorar todas as casas" passa de 4 → 3 colunas

Hoje o grid das 12 casas no desktop fica em 4 colunas, deixando os cards apertados e a tipografia espremida (especialmente o nome da casa + arquétipo + signo + cristal). Com 3 colunas, cada card ganha cerca de 33% mais largura e a leitura fica muito mais elegante.

**Breakpoints novos:**
- Mobile: **2 colunas** (igual hoje)
- Tablet (sm): **3 colunas**
- Desktop (lg): **3 colunas** (era 4)

**Locais que mudam (3 ocorrências):**
- `src/components/DestinyResults.tsx` linha 752 — grid principal das 12 casas
- `src/components/DestinyResults.tsx` linha 691 — grid de mapeamento global
- `src/pages/Dashboard.tsx` linha 364 — grid das 12 casas no histórico

Tudo trocando `lg:grid-cols-4` por `lg:grid-cols-3` (e ajustando `sm:grid-cols-3` onde faltar).

---

### 2. Nova curadoria de fotos das cidades

Substituir as URLs do Unsplash atuais por fotos mais icônicas, identificáveis e de melhor enquadramento horizontal (ideais para o card 16:9 da seção "Sobre"). Foco em imagens que mostrem o **skyline reconhecível** da cidade (não fotos genéricas de rua ou close-up de monumentos).

**Critérios da nova curadoria:**
- Skyline / vista aérea / cartão-postal universalmente reconhecível
- Boa iluminação (golden hour ou luz natural intensa)
- Composição horizontal limpa, sem texto sobreposto
- Cores vibrantes que combinem com o tom premium do app

**Cidades que serão revisadas (~60 entradas):**
São Paulo, Rio de Janeiro, Nova Iorque, Paris, Londres, Tóquio, Dubai, Roma, Barcelona, Miami, Bali, Singapura, Amsterdam, Sydney, Berlim, Buenos Aires, Istambul, Lisboa, Cusco, Santorini, Florianópolis, Salvador, Auckland, Bangkok, Bora Bora, Fernando de Noronha, Praga, Viena, Moscou, Cairo, Marrakech, Hong Kong, Seul, Madri, Atenas, Zurique, Vancouver, Toronto, Cidade do México, Bogotá, Lima, Santiago, Montevidéu, Los Angeles + variações em inglês/português.

**Local:** `src/components/DestinyResults.tsx`, constante `CITY_IMAGES` (linhas 103–166) e `FALLBACK_IMAGE` (linha 167).

A função `getCityImage()` continua igual — só os valores mudam.

---

### O que NÃO muda

- Lógica de créditos e desbloqueio
- Integração com Wikipedia, clima, API Flask
- Componente `HouseCard.tsx` (estrutura interna)
- Cores das casas, cristais, arquétipos
- Visual da Casa Escolhida (hero, glass card, foto da cidade na seção "Sobre")
- Banco / Supabase / edge functions

---

### Resultado esperado

- Cards das 12 casas com respiro adequado, tipografia legível e proporção mais nobre
- Fotos das cidades reconhecíveis à primeira vista — São Paulo como São Paulo, Paris como Paris
- Zero mudança em comportamento, créditos ou fluxo
