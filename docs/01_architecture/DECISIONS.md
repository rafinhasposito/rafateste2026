# Registry of Decisions

Este documento registra as decisões arquiteturais, de design e produto, além de suas justificativas e alternativas consideradas ao longo da evolução do Voyage Flow.

## Decisão 1: Refatoração Visual e Desacoplamento da Camada de Copy (Planejada)
- **Data:** 11 de Julho de 2026
- **Problema:** A interface atual e os textos de resultados (copy) não estão agradando os stakeholders. Além disso, o componente principal `DestinyResults.tsx` está muito denso (God Component), misturando regras de negócios, UI pesada e chamadas ao banco de dados.
- **Decisão:** Realizar um redesign completo (UX/UI) com um sistema de cores, tipografia e espaçamentos mais limpos e sofisticados. Paralelamente, desacoplar os textos das casas astrológicas usando uma fonte externa (Notebook LM) que o Product Owner irá fornecer, criando uma estrutura de dados dedicada.
- **Alternativas consideradas:** Manter a estrutura atual e apenas mudar cores. (Rejeitada pois não resolve a escalabilidade do código nem a clareza da UX).
- **Motivo:** Garantir que o produto atinja um padrão "World Class" compatível com startups unicórnio, com código sustentável.

## Decisão 2: Implementação das 6 Telas do Onboarding e Unificação do Design Cósmico
- **Data:** 18 de Agosto de 2026
- **Contexto:** Necessidade de transformar as referências visuais do onboarding em código React nativo interativo (6 telas de alta conversão) e alinhar todas as interfaces do app (Index, Auth, Credits, Profile, Dashboard) ao tema de luxo "Protocolo Solar".
- **Decisão:** Criação de componentes dedicados (`CelestialMandala`, `CityComparisonBeacons`, `TimelineModeCards`, `BrandHeader`, `EditorialBlock`, `CinematicEarth`), suporte a gestos touch/teclado, fluxo contínuo de onboarding até o cálculo (`/?mode=...`), e tokens de design dourados/vidro cósmico em `index.css`.
- **Resultado:** Experiência consistente em mobile e desktop, build validado e suíte de testes no Vitest aprovada.
