# Registry of Decisions

Este documento registra as decisões arquiteturais, de design e produto, além de suas justificativas e alternativas consideradas ao longo da evolução do Voyage Flow.

## Decisão 1: Refatoração Visual e Desacoplamento da Camada de Copy (Planejada)
- **Data:** 11 de Julho de 2026
- **Problema:** A interface atual e os textos de resultados (copy) não estão agradando os stakeholders. Além disso, o componente principal `DestinyResults.tsx` está muito denso (God Component), misturando regras de negócios, UI pesada e chamadas ao banco de dados.
- **Decisão:** Realizar um redesign completo (UX/UI) com um sistema de cores, tipografia e espaçamentos mais limpos e sofisticados. Paralelamente, desacoplar os textos das casas astrológicas usando uma fonte externa (Notebook LM) que o Product Owner irá fornecer, criando uma estrutura de dados dedicada.
- **Alternativas consideradas:** Manter a estrutura atual e apenas mudar cores. (Rejeitada pois não resolve a escalabilidade do código nem a clareza da UX).
- **Motivo:** Garantir que o produto atinja um padrão "World Class" compatível com startups unicórnio, com código sustentável.
