# Regra Global Mobile-First — Protocolo Solar

Sempre que criar ou editar qualquer página, componente React ou prévia HTML no Protocolo Solar, aplique obrigatoriamente os critérios do simulador **Mobile FIRST** (`MOBILE_TARGETS.md`):

1. **Desenhe para `390×844` (iPhone 14/15/16) primeiro** e valide de `320px` (iPhone SE) até `430px` (Pro Max) antes de expandir para Desktop (`>= 1024px`).
2. **Proibido cortar elementos ou vazar largura**: `scrollWidth <= innerWidth` em todas as etapas. Botões lado a lado em desktop devem empilhar (`flex-direction: column` ou `flex-wrap: wrap`) no mobile para nunca truncar texto (ex.: nunca cortar `"DESBLOQUEAR MAPA"`).
3. **Um único eixo de ação na zona do polegar**: não espalhe setas ou botões de avanço em cantos opostos da tela. Mantenha o botão principal centralizado na parte inferior com `padding-bottom: max(20px, env(safe-area-inset-bottom))`.
4. **Inputs com `font-size >= 16px`** e áreas de toque mínimas de **`44×44px`** (`48×48px` nos CTAs).
5. **Vídeos e Canvas adaptados ao retrato (`9:16`)**: no mobile, posicione o elemento visual (vídeo vertical do Theo ou galáxia 3D das 12 Casas) no terço superior/central e o painel de leitura/input na metade inferior com contraste limpo.
