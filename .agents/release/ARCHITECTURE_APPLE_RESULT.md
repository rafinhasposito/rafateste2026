# 📚 Arquitetura e Regras de Negócio: O Dossiê Final (AppleResultPreview.tsx)

**Status:** Atualizado no Checkpoint 5 (Bloco 3 Concluído)
**Objetivo do Documento:** Servir como o "Guia Definitivo" para qualquer IA, desenvolvedor ou agente que venha a dar manutenção ou expandir esta página. NUNCA altere o comportamento estrutural desta página sem consultar este documento.

---

## 1. O Que É a Página?
A página `AppleResultPreview.tsx` é o entregável final do **Protocolo Solar** (Onde Passar Seu Aniversário). 
Ela simula a experiência de um "Laudo de Inteligência Executiva". Quando o usuário descobre qual cidade ativa qual área da vida dele (ex: Tóquio ativa Dinheiro, Paris ativa Amor), é nesta página que ele lê o Dossiê completo daquela energia.

## 2. Regras de Ouro do Produto

### A. Regra do UX Copy Seguro (Sem Determinismo)
- **O Problema:** Prometer que "algo vai acontecer" (ex: "Você ficará rico", "Você será promovido") gera frustração e risco jurídico caso o evento não ocorra.
- **A Solução:** O texto deve usar **Verbos de Propensão** e focar no "cenário" e na "ação do usuário".
- **Vocabulário Permitido:** *A energia favorece, O magnetismo desta cidade atrai, O universo destrava, O terreno se torna fértil, Potencializa, Abre portas.*

### B. Regra Estética (Padrão Apple / Anti-SaaS)
- Não estamos construindo uma planilha, nem um dashboard B2B, nem um PowerPoint.
- **Evitar:** Cardite (excesso de blocos de vidro um embaixo do outro), Ícones genéricos soltos (clip-art), abreviações ("Asc.").
- **Abraçar:** Tipografia maciça (Display), espaços vazios amplos, Z-Patterns de leitura fluida, vídeos atmosféricos (Aura Loop), efeitos sutis de blur (Glassmorphism).

### C. Regra do Fundo Camaleão
- Como cada casa astrológica tem um "Neon" (Dinheiro = Verde, Amor = Vermelho), a página **inteira** precisa se adaptar.
- A cor de fundo global usa \`color-mix(in srgb, currentActiveData.color 6%, #03100B)\` para garantir que a interface não tenha conflito cognitivo (ex: botão vermelho gritando num fundo verde escuro).

---

## 3. A Estrutura da Página (Os Blocos)

### Sidebar (O Índice / Radar 360)
Fica fixo na esquerda. Lista as 8 áreas da vida mapeadas (Dinheiro, Trabalho, Identidade, Rotina, Networking, Amor, Espiritual, Saúde).
- **Interação:** Clicar em um item altera imediatamente o estado global (\`activeArea\`), mudando todo o conteúdo do Painel Direito.

### O Painel Direito (O Dossiê)
É onde o conteúdo é renderizado, empilhado verticalmente na seguinte ordem:

#### 1. A Capa (O Hero)
- Um banner gigante cobrindo 100% da tela inicial.
- Possui um \`video\` em loop de uma aura abstrata no fundo.
- **Estado Trancado:** O título principal é visível, mas o parágrafo explicativo tem \`filter: blur\`. Abaixo dele, existe o botão "Desbloquear com 1 Crédito".
- **Estado Destrancado:** O blur some e os Blocos 2 e 3 são revelados abaixo da dobra.

#### 2. Bloco 2: Os 3 Pilares (Bento Grid)
- Três cartões (cards de vidro fosco) alinhados horizontalmente (Desktop) ou verticalmente (Mobile).
- Cada pilar explica uma dinâmica específica de como a energia da cidade se manifesta naquela área da vida (ex: "Aumento de Ganhos", "Estabilidade").

#### 3. Bloco 3: O Seu DNA de Ativação (Apple Borderless)
- O cruzamento de dados que prova a personalização do relatório.
- Usa o **Z-Pattern (Tipografia Gigante, sem caixas/cards)**.
- Explica a performance baseada em 3 variáveis fixas do usuário + a casa clicada:
  1. **01. Sua Essência:** Como o Signo Solar da pessoa atua na casa ativa.
  2. **02. Seu Método:** Como o Ascendente da pessoa executa os planos na casa ativa.
  3. **03. Fase Atual:** Como a Idade da pessoa dita as prioridades na casa ativa.

---

## 4. O Motor de Dados (Mock vs Produção)

**Estado Atual (Frontend):**
Atualmente, as informações estão chumbadas no array \`LIFE_AREAS\` dentro da própria tela. Nós criamos uma **Persona Mockada** (Sol em Leão, Ascendente em Virgem, 41 Anos). O bloco 3 tem os textos dinâmicos programados apenas para variar a Casa (Focus) dessa persona.

**Estado Final (Backend / LLM):**
O motor final usará o serviço \`promptEngine.ts\`. Ele pegará o Sol real do cliente (ex: Áries), o Ascendente real (ex: Touro), a idade real e cruzará com a Casa Ativa para pedir à Inteligência Artificial (ChatGPT/Claude) que gere esse JSON padronizado e injete na página, seguindo rigorosamente a Regra do UX Copy.

#### 4. Bloco 4: A Cidade e o Ritual (Painel Split)
- **Visual:** Ocorre uma ruptura do fundo neutro. Uma imagem full-width da cidade destino aparece (ex: Nova York) com *Parallax real*.
- **Estrutura:** Um painel de vidro lateral (Frosted Glass com `bg-black/20`) contendo a descrição do impacto do destino, além do Ritual Prático de 24 horas.
- **Conceito Chave:** A cidade em si *não muda* quando o usuário clica em diferentes casas astrológicas. O usuário calcula *um* destino (ex: Onde passar o aniversário), e as instruções do ritual mudam de acordo com o foco da vida.

#### 5. Bloco 4.5: O Mantra de Ativação (Gradiente Cinemático)
- **Visual:** Um texto Display maciço ocupando a largura central da tela, formatado com *background clip-text gradient* semelhante ao design da Apple.
- **Objetivo:** Isolar a reprogramação neurolinguística e dar-lhe um peso editorial incomparável antes de avançar para as fases do ano.

#### 6. Bloco 5: A Linha do Tempo (Accordion Minimalista)
- **Estrutura:** Lista em acordeão contendo as 3 Fases de desenvolvimento (Meses 1-4, 5-8, 9-12).
- **Interação:** Quando expandido, exibe a narrativa de como o foco ativo do usuário se desdobra temporalmente na nova cidade.

#### 7. Bloco 6: Alertas e Pontos Cegos (PENDENTE)
- **Objetivo:** Prevenir expectativas mágicas. A energia de um local possui "sombras" ou propensões à autossabotagem na casa ativa.
