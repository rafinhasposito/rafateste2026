# 🤖 AI MASTER RULES (REGRA ZERO)

**ATENÇÃO AGENTES E IA:** Leia este documento ANTES de sugerir ou executar qualquer alteração estrutural no Protocolo Solar.

Este é o pacto de não-alucinação. O projeto possui regras rígidas de negócio e uma arquitetura visual mapeada. Você não deve inventar, não deve mockar dados destrutivos e não deve alterar o comportamento da UI sem consultar a matriz abaixo.

## 🧭 MATRIZ DE INTEGRAÇÃO (Onde encontrar a verdade)

1. **A Constituição da UI (Layout, Paywall e Cores)**
   👉 **Leia:** \`.agents/release/ARCHITECTURE_APPLE_RESULT.md\`
   *Regra de Ouro:* A Sidebar altera o FOCO (a cor da tela e a intenção), mas **NUNCA** altera a Cidade ou a Casa base.

2. **A Arquitetura de Blocos (A Ordem de Leitura)**
   👉 **Leia:** \`Auditoria_Arquitetura.md\`
   *Regra de Ouro:* Respeite a ordem: Hero -> Pilares -> DNA -> Dossiê -> Mantra -> Timeline -> Alertas -> Rotas.

3. **Os Textos de Foco (A Venda / Cadeado)**
   👉 **Leia:** \`07-modificadores-foco-v2.md\`
   *Regra de Ouro:* É daqui que vem o microcopy para as intenções do usuário.

4. **Os 3 Pilares da Casa (Bloco 2 - Bento Grid)**
   👉 **Leia:** \`notebook-updated.md\`
   *Regra de Ouro:* Cada Casa tem seus 3 pilares absolutos de energia. Eles pertencem à Casa, não ao Foco.

5. **O Banco de Dados Real da Casa (O Motor)**
   👉 **Leia:** \`src/data/houses.ts\` e \`src/data/houseThemes.ts\`
   *Regra de Ouro:* Toda a estrutura de Dossiê, Ritual, Fases e Mantras DEVE puxar daqui.

## 🛑 PROTOCOLO DE REFATORAÇÃO V3
- O arquivo \`AppleResultPreviewV3.tsx\` é o alvo de integração.
- A cor da tela varia conforme o Foco (\`activeArea.color\`).
- A Cidade e a Casa são IMUTÁVEIS e não se misturam quando o usuário troca de aba na Sidebar.
