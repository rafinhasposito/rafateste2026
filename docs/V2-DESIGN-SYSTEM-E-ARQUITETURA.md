# Protocolo Solar V2 — Master Design System, UX/Neuro & Arquitetura Completa de Produto

> **Documento Oficial de Referência da Versão 2 ("Solar Editorial Luxury")**  
> **Escopo:** Guia único e definitivo para construir, traduzir, conectar e publicar TODAS as páginas da V2 do Protocolo Solar mantendo a **V1 100% intacta** em produção até aprovação final.  
> **Referências Aprovadas em Prévia Viva:**  
> - Home 3D: `solar-release-candidate/docs/previas/envelopes-3d/index.html`  
> - Página da Casa (01–12): `solar-release-candidate/docs/previas/envelopes-3d/casa.html`  
> - Consulta Grátis (API Real): `solar-release-candidate/docs/previas/envelopes-3d/consulta-gratis.html`  
> - Guia Rápido / Vídeos do Theo: `solar-release-candidate/docs/previas/guia-rapido/onboarding-v3.html` e `abertura-com-voz.html`

---

## 1. Direção de Arte & Design System V2 (Tokens Exatos)

A V2 abandona o visual genérico de "PDF em caixinhas escuras" e adota o universo **Solar Editorial Luxury** — passaporte tátil, envelopes 3D colecionáveis, luz quente editorial, movimento físico fluido (60fps) e **prioridade absoluta em Mobile-First (iPhone 390×844)**.

### 1.1 Paleta Base
| Token CSS | Hex / Valor | Uso Obrigatório |
| :--- | :--- | :--- |
| `--cream` | `#F4EAE0` | Fundo editorial quente principal (zero branco chapado clínico) |
| `--surface-card` | `rgba(255, 255, 255, 0.94)` | Cartões táteis (Passaporte, Formulário, Planos, Detalhe) |
| `--ink` | `#101622` | Texto principal, CTAs primários, marca |
| `--ink-soft` | `#384357` | Corpo de texto secundário (contraste WCAG AA+) |
| `--obsidian` | `#0B101B` | Bloco de contraste alto (Consulta Grátis na Home, Loading Cipher, Dossiê) |
| `--gold-soft` | `#F5D993` | Destaques dourados sobre superfícies escuras (números, barras, badges) |
| `--gold-deep` | `#C9A227` | Estrela solar da marca, linhas orbitais, detalhes metálicos |
| `--glass-nav` | `rgba(249, 245, 240, 0.96)` + `blur(24px)` | Top bar ao rolar e Bottom Tab Bar fixa estilo WhatsApp iOS |

### 1.2 Paleta Oficial e Nomenclatura Unificada das 12 Casas
> **Regra de ouro:** Zero "salada de fruta". Toda tela (Home, Casa, Consulta Grátis, Resultado, Guia, SEO, i18n) usa exatamente estes nomes e cores.

| Casa | Selo Curto (Capa) | Título Comercial Unificado | Envelope (`--h-env`) | Profundo (`--h-deep`) | Bilhete (`ticket`) | Palco (`bg1` → `bg2`) | Vídeo Oficial (`1280×720`) |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **01** | `PROTAGONISMO` | Protagonismo, Coragem & Recomeço | `#0E2D73` | `#061844` | `#63A9EB` | `#C6DFF8` → `#9EC2EB` | `casa-01.mp4` |
| **02** | `PROSPERIDADE` | Dinheiro, Prosperidade & Abundância | `#0A4B37` | `#042A1E` | `#5CC49C` | `#BFE8D7` → `#8FCFB5` | `casa-02.mp4` |
| **03** | `COMUNICAÇÃO` | Comunicação, Vendas & Movimento | `#B04917` | `#6E2808` | `#F5A56C` | `#F9D4B9` → `#F0B489` | `casa-03.mp4` |
| **04** | `LAR & RAÍZES` | Lar, Raízes & Estabilidade | `#185678` | `#0B334A` | `#75B9DC` | `#C1E0F0` → `#94C4DE` | `casa-04.mp4` |
| **05** | `PRAZER & ROMANCE` | Prazer, Romance & Criatividade | `#A66E0A` | `#694203` | `#F7CC5E` | `#FAE4AA` → `#F2CE74` | `casa-05.mp4` |
| **06** | `SAÚDE & ROTINA` | Saúde, Rotina & Produtividade | `#0A615B` | `#043B38` | `#5ECEC2` | `#B7E9E3` → `#84D2C9` | `casa-06.mp4` |
| **07** | `AMOR & ALIANÇAS` | Amor, Parcerias & Alianças | `#B32E56` | `#701533` | `#F593B1` | `#F7C9D7` → `#EDA1B8` | `casa-07.mp4` |
| **08** | `RENASCIMENTO` | Transformação, Poder & Renascimento | `#6B1136` | `#3E061D` | `#DE7A9E` | `#ECC1D1` → `#D994AE` | `casa-08.mp4` |
| **09** | `VIAGENS & EXPANSÃO` | Expansão, Viagens & Liberdade | `#282F94` | `#14185C` | `#8E96F5` | `#CFD3F8` → `#A9AFEE` | `casa-09.mp4` |
| **10** | `SUCESSO & TOPO` | Sucesso, Reconhecimento & Topo | `#161D29` | `#090D14` | `#DFBE70` | `#E4DCCB` → `#CBBFA8` | `casa-10.mp4` |
| **11** | `CONEXÕES & REDE` | Conexões, Amizades & Futuro | `#0E4FA8` | `#062F6B` | `#69B2FA` | `#C1DDFA` → `#92C0F5` | `casa-11.mp4` |
| **12** | `CURA & INTUIÇÃO` | Cura, Intuição & Silêncio | `#4E2285` | `#2C0F52` | `#B890F0` | `#DDCBF7` → `#BFA2EB` | `casa-12.mp4` |

### 1.3 Tipografia & Hierarquia Fluida (`clamp`)
- **Display / Títulos Nobres:** `'Marcellus', Georgia, serif` (`font-weight: 400`, `line-height: 1.02–1.05`, `letter-spacing: -0.02em`)
  - Hero H1: `clamp(32px, 4.8vw, 58px)`
  - Seção H2: `clamp(28px, 3.8vw, 48px)`
  - Números-chave (Score %, Odômetro, Casa): `50px–76px` (`font-variant-numeric: tabular-nums`)
- **Interface & Corpo:** `'DM Sans', system-ui, sans-serif`
  - Corpo principal: `clamp(15px, 1.5vw, 17.5px)` (`line-height: 1.5`, `max-width: 52ch`)
  - Eyebrows / Pills / Badges: `10.5px–11px`, `font-weight: 800`, `letter-spacing: 0.14em–0.18em`, `uppercase`
  - Inputs de formulário: **`16px` fixo obrigatório** (impede auto-zoom no Safari iOS)
- **Códigos Técnicos / Cipher Reveal (uso pontual):** `ui-monospace, 'SF Mono', Menlo, monospace` (`letter-spacing: 0.14em`)

### 1.4 Régua Matemática de Espaçamento, Bordas & Mobile-First
> **Regra anti-desleixo matemático:** Nenhum texto, envelope, badge ou botão pode encostar em bordas ou ficar encoberto pela navegação.

| Dimensão | Mobile (`<= 820px`, foco `390×844`) | Desktop (`> 820px`, foco `1440×900`) |
| :--- | :--- | :--- |
| Margem lateral externa da tela | **`20px`** exatos (`padding-inline: 20px`) | `min(4vw, 56px)` com `max-width: 1120px–1180px` |
| Padding interno de cards grandes | `24px 20px` (mínimo `20px`) | `30px–44px` |
| Border-radius | `24px–26px` (cards), `14px–18px` (inputs/chips), `999px` (pills/CTAs) | `28px–30px` (cards), `999px` (pills/CTAs) |
| Altura mínima de toque (Touch Targets) | **`>= 48px`** (CTAs principais `52px–56px`) | `44px–56px` |
| Top Bar fixa | `60px` (`scroll-margin-top: 60px` nas âncoras) | `66px–68px` |
| **Bottom Tab Bar fixa (WhatsApp iOS)** | **`64px + env(safe-area-inset-bottom)`**, 4 colunas fixas, `border-top: 1px`, scroll-spy ativo | `display: none` (navegação central no topo) |
| Folga inferior da última seção | **`calc(108px + env(safe-area-inset-bottom))`** (zero sobreposição) | `72px–96px` |
| Overflow horizontal permitido | **`0px`** (`scrollWidth === innerWidth` em `320px–1920px`) | **`0px`** |

### 1.5 Governança de Animações, Skills & React Bits (Moderação Estratégica)
- **Curva padrão 60fps (Emil Kowalski / Apple):** `cubic-bezier(0.22, 1, 0.36, 1)` (apenas `transform` e `opacity`, respeitando `prefers-reduced-motion`).
- **Componentes APROVADOS e ONDE entram:**
  1. **Envelopes 3D Three.js + Raio-X suave (`flip 1250ms`):** Home Desktop/Mobile (no mobile, grid compacto 3×4 na vitrine para ver todas as 12 Casas sem scroll infinito).
  2. **Specular Button (brilho metálico clicável):** CTA principal de todas as conversões (`Liberar agora →`, `Liberar mapa completo →`, `Consultar agora →`) — **zero repetição de preço ou nome da casa no rótulo do botão**.
  3. **Termômetro Interativo com Envelope Pop-Out (`overflow: visible`):** Página da Casa (`Você Sente Isso?` — ao marcar `1 → 2 → 3` sinais, o envelope cresce e salta para fora da borda superior com brilho dourado).
  4. **Lanyard 3D Real (React Bits Three.js XPBD Physics — `assets/lanyard-3d.js` / `@react-bits/Lanyard-JS-CSS`):** Crachá 3D real com fita tecida com normal map, argola e presilha metálica dourada, furo real na geometria extrudada, shader holográfico (`finish: "holographic"`), física de gravidade/elástico/brisa, arrastar, jogar e **clicar para girar 180° (frente e verso)** — NUNCA imitação plana em CSS! Usado no Resultado da Consulta Grátis (`/meu-passado`) e Perfil do Usuário (`/perfil`).
  5. **Cipher / Decrypted Text (APENAS 1 linha curta):** Tela de carregamento astronômico revelando o código curto da Casa (ex.: `CASA 09 · VIAGENS & EXPANSÃO`).
  6. **Gradient Text:** Destaque pontual no card escuro de Consulta Grátis na Home e títulos-chave de oferta.
  7. **Ghost Type:** Campo de busca por intenção / IA ("Qual energia você quer viver no próximo ano?") em `/consultar`.
  8. **Expanding Grid:** Mural visual de destinos/cidades e histórias/parceiros em `/parceiros` e `/resultado/:houseId`.
- **Elementos BANIDOS da V2 (Decisões Registradas):**
  - ❌ `Slide Commit` (botão de arrastar) — não faz sentido no Desktop/Web.
  - ❌ Painéis de aeroporto multi-linha (Split-Flap com frases longas) — ilegível no celular.
  - ❌ Ilustrações escuras/monólitos de IA (`casa-1..12.jpg`, `arch_*.jpg`) — apagadas permanentemente.
  - ❌ Dados pré-preenchidos falsos (`Sol em Touro`, datas fixas) e fórmulas fake no lugar do Swiss Ephemeris.
  - ❌ Texto técnico de programador ("nosso motor busca...", "objeção...") voltado ao cliente final.

---

## 2. Estratégia Cruzada: Pesquisa Fish + Público Global + Vídeos + Guia Rápido

### 2.1 Matriz de Públicos (Pesquisa Fish + Estudo Global 2026)
| Segmento | Perfil & Comportamento | Dor Real / Gatilho | Entrada Ideal na V2 | Oferta Natural |
| :--- | :--- | :--- | :--- | :--- |
| **P1 · Céticos & Curiosos** | H/M 24–50, tráfego aberto (sem interesse de astrologia) | *"Será que isso funciona mesmo ou é horóscopo genérico?"* | **Consulta Grátis (`/meu-passado`)** — prova reversa do último aniversário | `1 Crédito (R$ 19,90)` ou `3 Créditos (R$ 49,90)` |
| **P2 · Mulheres Millennials (Core Buyer)** | Mulheres 28–44, autonomia financeira e viagem | Estagnação financeira, carreira invisível, ciclos repetitivos no amor | **Home 3D** ou **Casa 02 / 10 / 05 / 07** com vídeo + 8 Focos | **`3 Créditos (R$ 49,90)`** (comparar 3 opções) |
| **P3 · Gen Z / Rotina & Viagem Curta** | Mulheres 18–27 (TikTok/Reels, 95% mobile) | *"Não tenho dinheiro pra ir pra Europa"*, busca constância/autoestima | **Casa 06 / 01** + filtro **perto de casa (300–1.000 km)** + Cartão vertical compartilhável | **`1 Crédito (R$ 19,90)`** (impulso rápido) |
| **P4 · Oceano Azul (45–64)** | Mulheres/Homens 45–64, tempo e verba de viagem | Busca clareza madura, paz no lar, saúde e novos ciclos sem esoterismo raso | **Como Funciona (`/tecnologia`) + Guia Rápido do Theo** | **`Mapa 12 (R$ 99,90)`** |
| **P5 · Público Global (`ES/EN/FR/IT`)** | Viajantes internacionais (EUA, Europa, LatAm) | Já consomem *Solar Return Relocation* / *Astrocartography* em apps de US$ 15–49 | Home & Consulta Grátis com detecção automática (`I18nProvider` `?lang=`) | Preço localizado (`USD / EUR`) via Stripe/Checkout internacional |

### 2.2 Arquitetura das 3 Camadas de Vídeo (Sem Poluição, Carregamento Rápido)
1. **Camada 1 — 12 Vídeos Cinematográficos das Casas (`assets/casa-01..12.mp4`, ~1,7 MB cada, `+faststart`):**
   - Hero da Página da Casa (`/casas/:houseId`), bilhete 3D da Home (lazy-load sob demanda) e tela de Resultado da Consulta Grátis (`/meu-passado`).
2. **Camada 2 — Vídeos Explicativos do Produto / Guia Rápido (Theo — `01-VIDEOS/00-ATIVOS-NA-V3-AGORA/`):**
   - `01-abertura-anos-bons-dificeis-8s.mp4`, `03-transicoes-geografia-recalcula-14s.mp4`, `05-master-cidades-prioridades-15s.mp4` integrados no fluxo **`/app/onboarding`** (Guia Rápido) e na página **Como Funciona (`/tecnologia`)** como explicador visual de 60 segundos (opt-in com controle de áudio, nunca bloqueando quem já quer calcular!).
3. **Camada 3 — 48 Vídeos de Cidades Reais (`01-VIDEOS/06-CIDADES-DO-MUNDO/producao-web/`):**
   - Cenário cinematográfico no **Resultado Pago (`/resultado/:houseId`)** ao revelar a cidade específica recomendada ao usuário (nunca cravando cidade fixa na descrição genérica da Casa!).

### 2.3 Compliance Obrigatório (Meta Ads, TikTok Ads & Jurídico)
- Classificação **18+** explícita e visível no rodapé/termos.
- Linguagem **não-determinista**: *tendência, clima favorável, janela de possibilidades* (zero promessa garantida de dinheiro, cura ou casamento).
- Zero menção a celebridades (sem Anitta) e zero atributos pessoais agressivos em anúncios/LPs.
- Separação total entre páginas de cliente (zero menção a comissão `20% Pix`) e páginas de parceiros (`/parceiros`, `/afiliado`).
- Preservação obrigatória da explicação dos 3 pilares (**`01. Sua Essência`**, **`02. Seu Método`**, **`03. Fase Atual`**) e da **Matriz de 8 Focos de Vida** (`AFFINITY_MATRIX`).

---

## 3. Mapa Completo de Todas as Páginas (V1 → V2)

> **REGRA INVIOLÁVEL DE ARQUITETURA & CONVERSÃO:**  
> 1. **ZERO reinvenção de motores da V1:** a V2 é exclusivamente camada de **Design, UX e Animação**. Na implementação React (`src/v2/`), reutilizar 100% intactos `CityAutocomplete.tsx`, `cityAliases.ts`, `cityCopy.ts`, `astro.ts`, `pastAuditClient.ts`, `consultations.ts`, `consultationUnlocks.ts`, `credits.ts`, `coupons.ts`, `affiliates.ts`, `useAuth` e `i18n.tsx` — **jamais reescrever** busca/tradução de cidades, modos de consulta ou lógica de resultado já validados!  
> 2. **ZERO spoiler do próximo aniversário na Consulta Grátis:** `/meu-passado` revela **somente** a Casa ativada no último aniversário (prova de validação). A energia do próximo aniversário permanece **bloqueada** como gatilho natural de conversão para os créditos.

> **Integridade total:** 100% das rotas, APIs (`protocolo-solar-api.onrender.com`), Supabase (`Auth`, `consultations`, `credits`, `coupons`, `affiliates`), Mercado Pago (`create-mercadopago-checkout`), UTMs (`utm_*`), Pixel e 5 idiomas (`pt`, `es`, `en`, `fr`, `it`) são preservados.

| Onda | Rota V1 (Intacta) | Prévia V2 (Isolada) | Papel na Jornada | Componentes V2 & Integrações Obrigatórias |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `/` (`LandingV3`) | `/v2` (base: `envelopes-3d/index.html`) | Vitrine 3D + Conversão | 12 Envelopes 3D + Raio-X (`Marcellus`) + Grid 3×4 mobile + Card Escuro Consulta Grátis (`Gradient Text`) + Palco de Créditos (`1/3/12`, `Specular Button`: `Liberar agora →` / `Liberar mapa completo →`) + Tab Bar iOS |
| **1** | `/casas` & `/casas/:houseId` (`HouseDetailGuide`) | `/v2/casas/:houseId` (base: `envelopes-3d/casa.html`) | Página de Desejo da Casa | Passaporte Hero com vídeo real (`casa-01..12.mp4`) + Termômetro `"Você Sente Isso?"` com envelope pop-out + **8 Focos de Vida interativos** (`01. Sua Essência / 02. Seu Método / 03. Fase Atual`) + Créditos + SEO próprio por Casa |
| **1** | `/meu-passado` (`FreePastResult`) | `/v2/consulta-gratis` (base: `envelopes-3d/consulta-gratis.html`) | Prova Gratuita Anti-Ceticismo | Formulário limpo (zero pré-preenchido) + Autocomplete `Photon/OSM` + Swiss Ephemeris real (`/audit_past` atual + próximo ano) + `Cipher Reveal` 1 linha + **Lanyard 3D** + Vídeo da Casa ativada + CTA `Liberar mapa completo →` |
| **2** | `/consultar` (`Index`) | `/v2/consultar` | Motor Interativo Completo | 3 tempos (**Passado / Presente / Futuro**) + 3 buscas (**Por Cidade / Por Casa / Por Intenção** com `Ghost Type`) + filtro distância (`300 km / Brasil / Mundo`) + consumo real de créditos via `useAuth` & `consultations.ts` |
| **2** | `/resultado/:houseId` (`HouseResult`) | `/v2/resultado/:houseId` | Experiência Premium Paga | Dossiê interativo (zero cara de PDF!): Vídeo da Cidade real + Passaporte/Cartão vertical compartilhável (Stories) + 8 Focos abertos + Linha do Tempo **12 Meses + Primeiras 24h** (baseado no Guia Definitivo) + botão salvar/baixar |
| **2** | `/credits` & `/resgatar` (`Credits`) | `/v2/creditos` & `/v2/resgatar` | Pagamento & Presente VIP | Palco unificado (`1 Crédito R$ 19,90` · `3 Créditos R$ 49,90 ★` · `Mapa 12 R$ 99,90`), `create-mercadopago-checkout` (Pix/Cartão), cupons (`coupons.ts`), resgate de presente VIP (`/resgatar?code=`), preservação de `utm_*` + `ref` afiliado + suporte futuro Stripe internacional (`USD/EUR`) |
| **3** | `/auth` & `/reset-password` (`Auth`) | `/v2/entrar` | Login sem Fricção | Card editorial limpo sobre fundo `--cream`, login/cadastro em 1 tela, preservação 100% do redirect pós-login (`returnTo` / dados natais em `sessionStorage`) |
| **3** | `/dashboard`, `/history`, `/perfil` | `/v2/minha-conta` | Área do Usuário (App Feeling) | **Crachá `Lanyard` 3D pessoal** no `/perfil` com dados natais salvos + saldo de créditos visível + lista de consultas desbloqueadas (`/history`) com reabertura instantânea do dossiê + Tab Bar iOS fixa |
| **3** | `/tecnologia` & `/app/onboarding` | `/v2/como-funciona` & `/v2/guia-rapido` | Educação & Quebra de Objeção | Integra os vídeos do **Theo (`onboarding-v3.html`)** explicando em 60s como a geografia altera a Revolução Solar + explicação visual do Swiss Ephemeris + FAQ acessível (hora incerta, viagem curta, 18+) |
| **4** | `/parceiros`, `/seja-afiliado`, `/afiliado` | `/v2/parceiros` & `/v2/afiliado` | Aquisição via Criadores | **Expanding Grid** de parceiros/histórias + simulador limpo de comissão (`20% Pix`) + link curto `/i/:code` + Mídia Kit pronto (`mediaKitPrint.ts`) isolado das páginas de cliente |
| **4** | `/termos`, `/privacidade` | `/v2/termos`, `/v2/privacidade` | Compliance & Jurídico | Tipografia editorial limpa (`Marcellus` + `DM Sans`, `max-width: 65ch`), 18+, LGPD |

---

## 4. Internacionalização (5 Idiomas) & Preparação Global

O projeto já possui `I18nProvider` em `solar-release-candidate/src/lib/i18n.tsx` com **5 idiomas ativos**:
- **`pt` (`pt-BR`)** — Mercado inicial de validação (Pix / Mercado Pago em `R$ 19,90 / R$ 49,90 / R$ 99,90`).
- **`es` (`es`)** — LatAm + Espanha (segunda onda de maior afinidade cultural).
- **`en` (`en`)** — EUA, Reino Unido, Canadá, Austrália (maior ticket médio global em `USD`).
- **`fr` (`fr`)** e **`it` (`it`)** — Europa (França, Suíça, Itália).

**Regras obrigatórias na migração V2 para React (`src/`):**
1. **Zero texto hardcoded na UI:** todas as labels das 12 Casas, 8 Focos, Termômetro `"Você Sente Isso?"`, CTAs (`Liberar agora →`, `Liberar mapa completo →`, `Consultar agora →`), Tab Bar e Consulta Grátis entram em chaves organizadas no `i18n.tsx` (ou dicionários por idioma `src/locales/{pt,es,en,fr,it}.ts`).
2. **Seletor discreto de idioma** na Top Bar (Desktop) e no Perfil/Menu (Mobile), respeitando `?lang=en|es|fr|it|pt` e `localStorage("ps_lang_manual")`.
3. **Moeda & Checkout Global:** camada `pricingByLocale` mantendo `BRL` via Mercado Pago para `BR` e pronta para conectar Stripe (`USD`/`EUR`) quando o tráfego global for ligado.
4. **SEO Multilíngue:** pré-render estático no `vite build` gerando `<title>`, `<meta description>`, `canonical`, JSON-LD (`WebApplication`, `FAQPage`, `BreadcrumbList`) e `hreflang` para `/`, `/casas/1..12`, `/meu-passado`, `/tecnologia` e `/parceiros`.

---

## 5. Protocolo Seguro de Construção & Publicação (Zero Risco na V1)

1. **Preservação absoluta das versões anteriores:**
   - **V1 no ar (`src/pages/LandingV3.tsx`, `Index.tsx`, `HouseDetailGuide.tsx`, `FreePastResult.tsx`, `Credits.tsx`, etc.):** permanecem **100% intactas** em suas rotas atuais.
   - **Prévias anteriores (`docs/previas/guia-rapido/`, `terra-casa-2.html`, `envelopes-3d/`):** preservadas sem exclusão.
2. **Construção modular da V2 dentro de `solar-release-candidate/src/v2/`:**
   - Criar biblioteca compartilhada `src/v2/design-system/` (`tokens.css`, `housesData.ts`, `SpecularButton.tsx`, `IosTabBar.tsx`, `LanyardCard.tsx`, `HouseVideoHero.tsx`, `CreditsStage.tsx`).
   - Montar cada onda em rotas de prévia isoladas (`/v2`, `/v2/casas/:id`, `/v2/consulta-gratis`, `/v2/consultar`, `/v2/resultado/:id`, `/v2/creditos`, `/v2/minha-conta`, `/v2/como-funciona`, `/v2/parceiros`).
3. **Gate de QA obrigatório antes de qualquer troca da raiz `/`:**
   - `npm run build` verde (0 erros TS/Vite).
   - Playwright automatizado em **`390×844` (iPhone)** e **`1440×900` (Desktop)**: `0` erros de console, `0` imagens/vídeos quebrados, `0px` de overflow, teste real de `/audit_past`, login, saldo de créditos e checkout.
   - Lighthouse Performance **`>= 95`**, 60fps e respeito a `prefers-reduced-motion`.
   - **Aprovação explícita do Rafael** antes de promover `/v2` para `/` e fazer `git push` para produção.
