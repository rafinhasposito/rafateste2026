# Fase 3: Arquitetura Implementada

## Arquivos Criados
- `src/layouts/ConsumerShell.tsx`: Controlador raiz que abriga o `<Outlet />` sem desmontar estado e injeta o fundo estrelado global.
- `src/layouts/DesktopWebChrome.tsx`: Top Navigation premium, adotado a partir de 1024px.
- `src/layouts/MobileAppChrome.tsx`: Bottom Navigation (e fallback header), adotada abaixo de 1024px.
- `src/layouts/FocusedShell.tsx`: Wrapper minimalista com botão voltar (ChevronLeft) para fluxos imersivos.
- `src/hooks/useMediaQuery.ts`: Hook universal para detecção reativa.

## Rotas Migradas
Foram envelopadas no `ConsumerShell`:
- `/` (Index / Discovery)
- `/dashboard` (Resultados)
- `/history` (Histórico)
- `/perfil` (Perfil)

Foram envelopadas no `FocusedShell`:
- `/auth` (Autenticação)
- `/reset-password` (Recuperação de Senha)
- `/credits` (Orçamento)
- `/app/onboarding` (Apresentação Inicial)

## Breakpoint (1024px)
Aprovado como `lg` (1024px) no Tailwind.
- **Menor que 1024px:** MobileAppChrome (Bottom Navigation) - O que naturalmente adapta também tablets (iPad Portrait) no formato de toque inferior, otimizando o preenchimento da UI.
- **1024px ou mais:** DesktopWebChrome (Top Navigation horizontal Premium).

## Decisão de Estado Estável
Implementamos a estabilidade isolando a variável cromática:
Os componentes de UI (`<DesktopWebChrome />` e `<MobileAppChrome />`) são injetados como **Irmãos (siblings)** de `<main><Outlet /></main>`. Isso assegura que, independentemente da rotação do tablet ou redimensionamento brusco de janela, a página real (onde repousa o contexto do usuário, os states dos inputs e chamadas ao DB) jamais perca seu ancestral (o `ConsumerShell`), não acarretando refetches de API e UX quebrada.

## Exceções
- A rota `/admin` permaneceu totalmente por fora de qualquer intervenção, validando o requisito arquitetural de mantê-la segura.
- `UserMenu` soltos nas páginas legadas foram limpos de forma cautelosa.

## Dívidas Arquiteturais (Atenção para próximas Fases)
1. Alguns componentes como `Index` possuíam backgrounds estáticos independentes. Removemos a duplicidade do UserMenu, mas os layouts absolutos de background de algumas views ainda precisam migrar para se valer de forma 100% nativa do padding do Shell.
2. A tela `/dashboard` (Resultados Astro) continua ocupando a tela inteira (`min-h-screen`), e caberá à Fase 6B ditar se ela rola naturalmente ou se o mapa absorverá 50/50 em height e scroll-locks independentes.

