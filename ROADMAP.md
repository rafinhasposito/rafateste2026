# AGENTE PROTOCOLO SOLAR — ESTADO ATUAL + ROADMAP

## 1. OBJETIVO DO PROJETO

Construir o **Protocolo Solar**, aplicativo/web premium de Revolução Solar e relocação.

O produto ajuda o usuário a explorar **onde passar o aniversário** e como diferentes localidades podem colocar áreas diferentes da vida em destaque.

A experiência deve ser:

- premium
- cinematográfica
- simples para leigos
- visualmente sofisticada
- funcional de verdade
- mobile e web tratados como experiências próprias

Não é um dashboard de astrologia.

---

## 2. ARQUITETURA VISUAL

Identidade:

- Void Black: `#030306`
- Gold: `#D4AF37`
- Cinzel: títulos/display
- Inter: UI/leitura

Universo visual:

- Terra
- Via Láctea
- Sol
- horizonte
- espaço
- luz
- profundidade
- fotografia/cena cinematográfica

Evitar:

- astrologia genérica
- excesso de cards
- glassmorphism gratuito
- dashboards
- bordas demais
- caixas pretas em cima de uma fotografia
- roxo/vermelho aleatório
- interface parecendo template

---

## 3. REGRA MOBILE ≠ WEB

### MOBILE

- rápido
- intuitivo
- tátil
- muito claro
- fácil de entender sem instruções

Uma escolha não pode parecer apenas texto.

Pode usar: estações, timeline, círculos, módulos, elementos de escolha, previews.

### WEB

Web deve explorar **scrollytelling estilo Apple**.

Scroll controla: movimento, aproximação, iluminação, revelação, foco, transição entre estados.

Não fazer apenas uma página estática grande.

Mobile e Web compartilham identidade, **não layout**.

---

## 4. REGRA DE ASSETS — MUITO IMPORTANTE

O Antigravity **NÃO deve criar direção de arte**.

### PROIBIDO enviar para implementação

- moodboard com várias telas
- storyboard composto
- screenshot com UI
- colagem
- prancha de apresentação

### FORMA CORRETA

Cada asset de produção deve existir como arquivo separado.

Exemplo:

```
temporal-mobile-bg.webp

temporal-web-001.webp
temporal-web-002.webp
temporal-web-003.webp
...
```

As imagens: não possuem texto, não possuem botão, não possuem UI, não possuem moldura, não possuem nome do arquivo desenhado, não possuem mockup de telefone/browser.

O Antigravity recebe o asset pronto e **somente implementa UI + interação**.

---

## 5. MODELO DE TRABALHO

Trabalhar **uma tela por vez**.

```
DEFINIR TELA → CRIAR ASSETS → IMPLEMENTAR → TESTAR SOMENTE A TELA → RAFAEL REVISA → AJUSTAR OU APROVAR → CHECKPOINT → PRÓXIMA TELA
```

Uma tela aprovada vira **patrimônio do projeto**.

---

## 6. ESTADO TÉCNICO OFICIAL

- Candidate: `/Users/rafaelgeorge/solar-release-candidate`
- Branch: `release/recovery-83ce832`
- Linha oficial: `b1059ed`
- Auth validado pessoalmente (Google, e-mail/senha, sessão, perfil)
- Não reabrir Auth sem bug real reproduzido

---

## 7. NAVEGAÇÃO PRINCIPAL

- **DESCOBRIR** — Home / nova exploração
- **CONSULTAS** — Histórico
- **CONTA** — Perfil e conta

A Home é DESCOBRIR. Não criar Home paralela.

---

## 8. FLUXO PRINCIPAL

```
DESCOBRIR → SELEÇÃO TEMPORAL (Passado/Presente/Futuro) → MÉTODO (Cidade/Casa/Intenção) → DADOS/CONSULTA → CÁLCULO → RESULTADO → 12 CASAS → DESBLOQUEIOS
```

---

## 9. ROADMAP — FASES

| Fase | Nome | Status |
|------|------|--------|
| 1 | Descobrir / Seleção Temporal | **EM ANDAMENTO** |
| 2 | Método de Exploração (Cidade/Casa/Intenção) | Pendente |
| 3 | Consulta por Cidade | Pendente |
| 4 | Consulta por Casa | Pendente |
| 5 | Consulta por Intenção | Pendente |
| 6 | Processamento / Transição | Pendente |
| 7 | Resultado Principal | Pendente |
| 8 | 12 Casas | Pendente |
| 9 | House Detail | Pendente |
| 10 | Consultas / Histórico | Pendente |
| 11 | Preços + Créditos | Pendente |
| 12 | Paywall | Pendente |
| 13 | Checkout (Mercado Pago) | Pendente |
| 14 | Conta | Pendente |
| 15 | Onboarding Final | Pendente |
| 16 | Responsividade Final | Pendente |
| 17 | Estados de Sistema | Pendente |
| 18 | Microinterações | Pendente |
| 19 | QA Final | Pendente |
| 20 | Segurança / Release | Pendente |

---

## 10. O QUE NÃO FAZER

- refazer código que funciona "porque fica mais limpo"
- auditoria gigante enquanto estamos construindo uma tela
- tocar em 10 áreas ao mesmo tempo
- declarar PASS por simulação
- mudar backend durante missão visual
- alterar Auth sem bug
- criar design por conta própria se existe asset aprovado
- transformar Rafael em QA primário
- passar para próxima tela sem aprovação

---

## Regra final

> **O que foi validado vira patrimônio do projeto. Uma nova fase precisa se encaixar nesse patrimônio, não destruí-lo.**
