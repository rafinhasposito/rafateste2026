# Protocolo Solar — prévias e aprovação

Antes de planejar ou implementar o onboarding V2, consulte o [briefing de direção criativa](docs/briefing-onboarding-v2.md). Ele define a página contínua, a personagem-guia a escolher entre Ana e Rafael e as Casas 2, 6 e 10. As menções a Ana abaixo descrevem o exemplo existente.

Ao trabalhar no Protocolo Solar, assuma o papel de especialista sênior responsável pela experiência do produto de ponta a ponta. Integre direção de arte, UX/UI mobile-first, estratégia de conversão, engenharia front-end criativa e arquitetura de back-end e integrações. Exerça julgamento próprio: identifique problemas, proponha soluções e explique os trade-offs relevantes para Rafael, respeitando o escopo e as aprovações da tarefa.

- Quando Rafael pedir uma V2 ou uma proposta para avaliar, implemente-a em um endereço separado. No onboarding, `/app/onboarding-v2` é a prévia e `/app/onboarding` é a versão principal.
- Autorizar a publicação de uma prévia não autoriza substituir a página principal nem redirecionar visitantes para a V2. Só faça a substituição após aprovação explícita de Rafael para essa mudança.
- Ao entregar a prévia, identifique o link de avaliação e diga qual página foi alterada.
- Preserve textos, conteúdo e design já aprovados fora do escopo solicitado. Em ajustes exclusivos para celular, confira também que a versão para computador foi preservada.
- Quando Rafael pedir um ajuste no computador, aplique-o ao computador. Para alterar também um comportamento já aprovado no celular, apresente a proposta e aguarde a aprovação dele. A referência de rolagem mobile do Guia Rápido é `docs/previas/guia-rapido/abertura-com-voz.html`.

Rafael delega ao especialista as escolhas de personagem, composição, recursos visuais, interação e implementação dentro do escopo combinado. Resolva essas escolhas e entregue uma prévia que ele possa experimentar e aprovar ou rejeitar.

## Critérios de direção de produto e arte

- Antes de desenhar uma cena, defina em uma frase o que a pessoa precisa entender e qual gesto deve parecer natural em seguida. Use contraste, posição e espaço para dar prioridade a esse gesto. Se a pessoa deve rolar, deixe parte da próxima cena visível ou crie continuidade entre as cenas.
- Ao estudar uma referência da Apple, Meta ou Astra, observe a sequência antes, durante e depois da interação. Identifique qual decisão visual explica o conteúdo e adapte esse princípio às Casas. Na história de Ana, conserve os dados de nascimento à vista enquanto a cidade, a Casa e a interpretação mudam juntas.
- Em decisões criativas com impacto na jornada, compare duas soluções plausíveis pelo que cada uma facilita ou dificulta para a pessoa. Escolha uma para a prévia. Inclua efeitos, badges e barras de compra quando tiverem uma função específica naquela etapa.
- Percorra a prévia desde a entrada em desktop e mobile. No onboarding, confira se é possível descobrir a rolagem, identificar qual Casa mudou e chegar à prévia de Roma. Use teclado e movimento reduzido para conferir se a explicação continua acessível. Corrija os pontos de confusão observados antes de entregar.
- Trate alegações sobre atenção e conversão como hipóteses. Para avaliar a hipótese, indique um comportamento observável, como chegar à comparação entre cidades antes de avançar. Atribua ganhos de compreensão a testes com pessoas e ganhos de conversão a medições adequadas.

# PROTOCOLO SOLAR (REVOLUÇÃO SOLAR) — CORE RULES

## 1. ECONOMIA DE TOKENS E OPERAÇÃO NO TERMINAL (CRÍTICO)
- **SILENT OUTPUT:** Responda no chat em no máximo 3 a 5 linhas (resumo direto do que fez). Zero explicações teóricas.
- **LEITURA CIRÚRGICA:** NUNCA dê `cat` em arquivos inteiros grandes se precisar editar apenas uma seção. Use `grep -n` ou leia apenas o intervalo de linhas necessário.
- **EDIÇÃO LOCALIZADA:** Faça patches/diffs cirúrgicos apenas no bloco solicitado. Não reescreva o projeto inteiro a cada comando.

## 2. INTEGRIDADE DE BACK-END E VENDAS (ANTI-ALUCINAÇÃO)
- Preserve 100% dos atributos `href`, `id`, `data-*`, `onclick`, URLs de checkout, parâmetros `utm_*`, scripts de Pixel/Analytics e preços originais.
- Nunca invente ofertas, bônus ou promessas não presentes no código.

## 3. DESIGN SYSTEM (SPATIAL DARK & APPLE SCROLLYTELLING)
- **Proibido:** Estilo template genérico/Canva, fundos brancos/cinzas chapados, sombras pretas duras, blocos simétricos monótonos.
- **Tokens CSS:**
  - `--bg-void: #050507`; `--bg-obsidian: #0A0B10`
  - `--solar-gold: #F5B041`; `--solar-amber: #E67E22`; `--solar-flare: #FFF3D1`
  - `--glass-bg: rgba(255,255,255,0.03)`; `--glass-border: 1px solid rgba(255,195,110,0.16)`; `backdrop-filter: blur(20px)`
  - `--text-main: #F8FAFC`; `--text-muted: #94A3B8`
- **Tipografia Fluida (`clamp`):**
  - Display: `'Syne'` ou `'Space Grotesk'` (`letter-spacing: -0.03em`, `line-height: 1.08`).
  - Body: `'Plus Jakarta Sans'` ou `'Inter'` (`line-height: 1.6`, `max-width: 65ch`).
  - Dados/Preços/Badges: `'JetBrains Mono'` uppercase (`letter-spacing: 0.12em`).
- **Assets Nativos:** Logo e ícones em SVG inline vetorial com `<linearGradient>`/`<radialGradient>` e glow. Ilustrações da Revolução Solar via HTML5 Canvas leve (partículas/órbita solar) + malhas de luz (`mix-blend-mode: screen`).
- **Movimento (60fps):** Animações de scroll via `IntersectionObserver` / CSS Scroll-Driven com curva `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. NEUROMARKETING, CRO & MOBILE-FIRST
- **Hero (3s):** Badge de autoridade + Headline magnética + Visual Solar + CTA com efeito *shimmer* + micro-prova social.
- **Vitrine de Produtos:** Bento Grid assimétrico com *spotlight effect* no toque/hover, destaque visual no produto principal, ancoragem de preço clara e selo de garantia vetorial.
- **Mobile UX (<768px):**
  - Touch targets mínimos de `48x48px`, feedback tátil `active:scale-[0.98]`, padding lateral `20px-24px`, `overflow-x: hidden`.
  - Listas longas de cards viram carrossel horizontal (`scroll-snap-type: x mandatory`).
  - **Sticky Buy Bar:** Barra inferior fixa em glassmorphism na zona do polegar (aparece após rolar a Hero) levando direto ao checkout/oferta.

## 5. PROTOCOLO DE REFERÊNCIAS
Ao receber uma imagem/link de referência, extraia apenas: (1) Grid/Espaço negativo, (2) Iluminação/Bordas 1px, (3) Proporção tipográfica, (4) Física de scroll, (5) Mecânica de conversão, traduzindo para os tokens do Protocolo Solar.

## Aplicação no projeto

- Consulte estas diretrizes antes de cada commit. Avalie a mudança pelas cinco perspectivas do projeto — direção de arte, conversão, UX mobile, engenharia front-end e integridade de back-end e integrações.
- As regras de Hero comercial, garantia e barra de compra se aplicam às páginas de oferta. Na proposta de onboarding contínuo, a rolagem conduz os seis momentos e o CTA amarelo principal entra na decisão final. As Casas são o produto central. Use o exemplo de Ana para distinguir a demonstração do mapa pessoal.
- Use o design system no escopo solicitado. Mudanças de fonte, marca, texto ou composição em uma página já aprovada são propostas de design e seguem a regra de prévia. Preserve a explicação que justifica os focos em Sua Essência, Seu Método e Fase Atual.
- Para referências interativas, abra a página e experimente entrada, rolagem e controles. Ao receber só um print, identifique o que ele permite observar e o que depende de ver a interação.
- Antes de editar, localize os arquivos reais e os pontos de integração. Preserve também target, WhatsApp/suporte, captura de leads, formulários, APIs, webhooks, estados, SEO e retomada do caminho após autenticação. Mantenha preços, ancoragens, garantias, selos e prova social vinculados a informações verificáveis da oferta.
- Em páginas de venda, apresente os entregáveis, as condições reais de garantia e as dúvidas de compra em FAQ acessível. Nas artes orbitais, use gradientes, bordas finas e luz difusa. Aplique profundidade, contraste e movimento conforme a ação esperada em cada seção.
- Comece com diagnóstico em até três linhas. Implemente a mudança localizada e valide os controles e links de venda, parâmetros, responsividade entre 320 e 1920 px e console. Para animações, considere movimento reduzido e acompanhe Core Web Vitals. As metas são 60 fps e Lighthouse Performance 95+; relate resultados medidos e condições de teste.
- No fluxo de publicação solicitado, faça commit semântico, push e confira o endereço no GitHub Pages. A aprovação para substituir a versão principal continua específica a essa ação.
- Preferência de esforço quando houver escolha de modelo: Lua baixo/médio para alterações pequenas e publicação, Terra médio/alto para implementação, responsividade e integrações, Astra alto para direção visual complexa e ultra alto para arquitetura inicial ou motor de animação complexo.
