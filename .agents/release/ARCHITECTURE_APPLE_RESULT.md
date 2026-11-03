# 📚 Arquitetura e Regras de Negócio: O Dossiê Final (V3 - Oficial)

**Status:** Atualizado para a Rota V3 (Produto Final Integrado)
**Objetivo do Documento:** Servir como o "Guia Definitivo" para Engenheiros de Dados e Analistas de Prompt que vão conectar o motor de Inteligência Artificial ao Frontend. NUNCA altere o comportamento estrutural desta página sem consultar este documento.

---

## 1. O Que É a Página?
A página `HouseResult.tsx` (ou o sandbox `AppleResultPreviewV3.tsx`) é o entregável final do **Protocolo Solar**. 
Ela simula a experiência de um "Laudo de Inteligência Executiva". Quando o usuário descobre qual cidade ativa qual área da vida dele (ex: Tóquio ativa Dinheiro), é nesta página que ele lê o Dossiê completo.

## 2. Regras de Ouro do Produto

### A. Regra do UX Copy Seguro (Sem Determinismo)
- O texto gerado pela IA deve usar **Verbos de Propensão** e focar no "cenário". Promessas exatas são proibidas.
- **Exemplo Proibido:** "Como consequência inevitável..."
- **Exemplo Aprovado:** "Eu sei o valor do meu trabalho e faço meu dinheiro render."
- **Vocabulário:** *A energia favorece, O magnetismo atrai, O universo destrava, O terreno se torna fértil.*

### B. A Arquitetura Bipartida (Casa x Foco)
Para evitar conflitos de dados ("O Bug Frankenstein"), a página segue estritamente a seguinte separação:
- **A FUNDAÇÃO INVIOLÁVEL (A Rota/Casa):** Lida através da URL (`useParams`). Controla o Nome da Cidade, o País, as Coordenadas, o Vídeo de Fundo (Hero) e a Foto do Dossiê. **Isso nunca muda ao clicar no menu.**
- **A LENTE DO USUÁRIO (O Foco/Matriz de 96):** Controla o Match %, Título de Venda, Cores, os 3 Pilares, a Linha do Tempo e o Ritual de 24h. Isso muda dinamicamente quando o usuário troca de foco na Sidebar, cruzando o desejo do usuário com a cidade.

### C. Regra do Fundo Camaleão
- A página reage à cor astrológica da Casa Ativa (O Foco). O fundo usa \`color-mix(in srgb, color 6%, #03100B)\` para garantir que a interface respire o "Neon" do momento.

---

## 3. A Estrutura da Página (Ordem Exata de Renderização)

### Sidebar (O Radar 360) e o Fluxo de Desbloqueio (Opção C)
Lista as áreas da vida mapeadas. Se a área estiver bloqueada e o usuário clicar, um Modal Glassmorphism de alta conversão sobe. Assim que a compra é confirmada (1 Crédito), a UI desativa o blur **automaticamente e de forma instantânea** sobre todo o conteúdo, sem a necessidade de um segundo clique na tela principal.

### O Painel Direito (O Dossiê) - A Cascata de Leitura

#### 1. A Capa (O Hero Cinemático)
- Banner gigante cobrindo 100% da tela. Vídeo em loop roteado pela Casa base (ex: `tokyo.mp4`).
- Letreiro tipográfico maciço apenas com o nome da Cidade isolado, e badge do País no topo superior direito.

#### 2. Bloco 2: Os 3 Pilares Práticos (Bento Grid)
- Três cartões de vidro explicando a dinâmica de como a energia da cidade se manifesta. Vêm da Matriz de 96 cruzamentos.

#### 3. Bloco 3: Seu DNA de Ativação (Apple Borderless)
- Z-Pattern focado no mapa astral real do usuário cruzado com a cidade (Essência, Método, Fase Atual).

#### 4. Bloco 4: O Dossiê Mestre (Expanding Bento Grid / Apple Standard)
- Substituímos o excesso de texto e layouts estáticos por um "Expanding Bento Grid" construído via Flexbox (Two-Tier Flex Containers).
- **Mecânica Two-Tier Flex:** O grid funciona em duas linhas horizontais independentes. Ao focar (hover/tap) num card de uma linha, ele se expande fluidamente (ganhando `flex: 2.5`), empurrando e comprimindo seu vizinho (que recua para `flex: 0.8`), enquanto a linha inferior permanece perfeitamente intacta. Isso extirpa bugs de colisão/quebra que ocorrem ao tentar animar larguras em CSS Grid nativa.
- **Padrão "Capa Oculta":** Os cards parecem blocos de vidro com apenas um ícone e o título principal (Ex: "O Efeito", "O Ritual"). O texto real fica oculto (opacity 0) até o usuário interagir.
- **Apple Typography:** O conteúdo interno do Dossiê eliminou "caixinhas" e bordas poluídas. Baseia-se integralmente em espaços em branco, hierarquia tipográfica gigantesca (`font-ps-display`) e blocos de leitura ultra-legíveis.
- No **Mobile**, a expansão Flex horizontal é desativada e a matriz vira uma coluna empilhada, expandindo suavemente na altura ao receber um Tap.

#### 5. Bloco 4.5: O Mantra de Ativação (Gradiente Cinemático)
- Texto Display maciço reprogramando o usuário (Totalmente limpo de determinismo).

#### 6. Bloco 5: A Linha do Tempo
- Acordeão minimalista temporal, ditando como o Foco escolhido evoluirá nos próximos 12 meses naquela cidade.

#### 7. Bloco 7: Grid de 12 Casas (A Expansão / Upsell)
- Fica no rodapé da página. Renderiza as cidades trancadas através de leitura real da matriz `ROUTES_MOCK_DATA`.
- **Regra Visual:** Corte brutalista. Topo (130px) com foto limpa da cidade. Base com a tarja de cor astrológica contendo a cidade limpa sem a string do País acoplada.
