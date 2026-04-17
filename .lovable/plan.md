
Objetivo

Sim — concordo. O problema não é só “escuro demais”: hoje a página mistura cor escura de identidade com cor de leitura. Vou corrigir isso na raiz para que nenhum texto importante fique escuro sobre fundo escuro ou claro demais sobre imagem clara.

Diagnóstico encontrado

- Em `src/components/DestinyResults.tsx`, vários títulos/labels usam `rgb(${accentColor})`.
- Esse `accentColor` vem de `extractAccentColor()` lendo `houseColors` em `src/data/houses.ts`.
- Algumas casas geram acentos naturalmente escuros (azul profundo, roxo escuro, verde fechado), mas essas cores estão sendo usadas em texto.
- Além disso, há muitos textos em `text-white/40`, `text-white/50` e `text-white/60`, que ficam fracos demais sobre cards escuros/translúcidos.
- Na foto da seção “Sobre”, o título ainda compete com a imagem porque a cor de destaque está sendo aplicada direto sobre a foto.

Plano

1. Separar cor decorativa de cor legível
- Criar uma paleta semântica por casa dentro de `DestinyResults.tsx`:
  - fundo sólido da casa
  - cor vibrante/clara para bordas, ícones e badges
  - branco/off-white para todo texto principal
- Parar de usar a cor extraída do gradiente como cor de leitura.

2. Aplicar regra dura de contraste
- `Casa N`, nome da cidade, país, descrições, rituais, previsões e textos da Wikipedia ficarão sempre em branco/off-white.
- A cor da casa ficará reservada para:
  - ícones
  - selos
  - bordas
  - número da casa
  - badge “Casa-alvo”

3. Corrigir a seção “Sobre”
- Manter a foto da cidade nessa seção, antes do texto.
- Reforçar o overlay escuro da imagem para criar contraste real.
- Colocar “Sobre [Cidade]” em branco.
- Usar a cor da casa só como chip/linha de destaque, nunca como texto principal em cima da foto.

4. Dar mais destaque aos nomes das casas
- No grid 1–12:
  - nome da casa em branco, maior e mais forte
  - número/selo/barra lateral com a cor da casa
  - signo, arquétipo e metadados em off-white legível
- A casa selecionada continua destacada, mas sem depender de texto colorido escuro.

5. Ajustar todos os textos secundários apagados
- Subir contraste de coordenadas, país, continente, cristal, descrições do modal e textos auxiliares.
- Remover usos excessivos de `text-white/40-60` nessa página.

Detalhes técnicos

- Arquivo principal: `src/components/DestinyResults.tsx`
- Mudanças-chave:
  - substituir texto crítico hoje colorido por `text-white`/`text-white/90`
  - criar tokens visuais por casa para separar identidade visual de legibilidade
  - reforçar o overlay da foto na seção “Sobre”
  - revisar labels do hero, cards internos, grid das casas, mapeamento global e modal
- Não muda:
  - lógica de unlock
  - créditos
  - integração com clima/Wikipedia
  - estrutura do fluxo

Resultado esperado

- zero texto escuro sobre fundo escuro
- foto da cidade continua bonita, mas sem brigar com o conteúdo
- a Casa Escolhida continua com personalidade própria, só que muito mais legível e elegante
