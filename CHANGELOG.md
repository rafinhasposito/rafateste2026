# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [1.1.0] - 2026-08-18
### Adicionado
- Implementação nativa das 6 telas do Onboarding do Protocolo Solar (Astrologia de Relocalização) com suporte a navegação por steps, swipe touch no mobile, teclado e redirecionamento direto para o cálculo.
- Componente `CelestialMandala.tsx` com o mapa orbital das 12 Casas, Planetas, Novos Cenários e Escolhas (Tela 3/6).
- Componente `CityComparisonBeacons.tsx` para comparação geográfica entre São Paulo e Nova York (Tela 4/6).
- Componente `TimelineModeCards.tsx` com os cards interativos de Passado, Presente e Futuro (Tela 5/6).
- Suíte de testes automatizados `src/test/onboarding.test.tsx` com 100% de aprovação no Vitest.

### Modificado
- Unificação do Design System com tipografia Cinzel/Inter, paleta dourada refinada (`#D4AF37`), botões de luxo e cards com vidro cósmico em todo o app (`Index.tsx`, `Auth.tsx`, `Credits.tsx`, `UserMenu.tsx`, `index.css`).

