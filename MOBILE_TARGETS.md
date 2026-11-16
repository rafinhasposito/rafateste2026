# Especificações Técnicas de Validação Mobile-First — Protocolo Solar

Este documento define os dispositivos-alvo, métricas de toque, regras de viewport e verificações automáticas equivalentes ao simulador **Mobile FIRST** para todas as páginas e prévias do **Protocolo Solar** (React/Vite PWA + páginas HTML do Guia Rápido).

---

## 1. Dispositivos e Viewports Oficiais de Teste (Padrão Mobile FIRST)

Toda página ou componente deve ser validado nestas 5 resoluções antes de ser entregue:

| Categoria | Dispositivo de Referência | Viewport (`width × height`) | Critério Crítico |
| :--- | :--- | :--- | :--- |
| **Mobile Small** | iPhone SE (3ª ger.) | `320 × 568` / `375 × 667` | Nenhum botão cortado lateralmente; títulos com `clamp()` sem estourar |
| **Mobile Android** | Samsung Galaxy S23 / S24 | `360 × 780` | Cards e formulários cabem na altura útil (`100svh`) sem sobreposição |
| **Mobile Standard** | iPhone 14 / 15 / 16 Pro | `390 × 844` / `393 × 852` | Viewport base de criação Mobile-First; zona do polegar livre |
| **Mobile Large** | iPhone 15 / 16 Pro Max | `430 × 932` | Proporção harmônica de vídeos verticais, roda das 12 Casas e deck de cards |
| **Tablet** | iPad Mini / iPad Air | `768 × 1024` / `820 × 1180` | Transição limpa entre layout de coluna única e grid lateral |

---

## 2. Regras Obrigatórias de Engenharia Mobile-First

1. **Meta Viewport & Safe Area (iOS / Android):**
   - Sempre incluir `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
   - Usar `100svh` (Small Viewport Height) em cenas de tela cheia para descontar a barra dinâmica do Safari iOS e Chrome Android.
   - Respeitar `env(safe-area-inset-top)` no header e `env(safe-area-inset-bottom)` na barra de CTA inferior.

2. **Zero Overflow Horizontal:**
   - É proibido existir rolagem lateral acidental: `document.documentElement.scrollWidth <= window.innerWidth`.
   - Nenhum botão, badge ou card (ex.: `"DESBLOQUEAR MAPA..."`, card de Roma, trio de cidades) pode sair da tela ou ficar cortado à direita.

3. **Área de Toque (Touch Targets):**
   - Todo botão, ponto de etapa, card interativo ou controle de áudio deve ter no mínimo **`44×44px`** (ideal **`48×48px`**).
   - CTAs principais ficam centralizados na barra inferior (zona do polegar), nunca espalhados em cantos opostos.

4. **Inputs Nativos sem Zoom Indesejado no iOS:**
   - Todos os campos `<input>`, `<select>` e `<textarea>` devem ter **`font-size: 16px` ou maior** no mobile para impedir que o Safari dê zoom automático ao focar.

5. **Mídia Adaptativa (Vídeo Vertical no Mobile):**
   - Em viewports `< 768px`, vídeos de personagem (como Theo) devem carregar a versão vertical (`9:16`) ou usar enquadramento `object-position: center top` com máscara suave na base onde entra o texto/formulário.
   - Sempre incluir `playsinline` e fallback de áudio para políticas de autoplay do iOS/Android.
