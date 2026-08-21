# Sistema de Componentes (Design Foundation)

Este documento reflete a auditoria e as regras de implementação do Design System "Cosmic Travel Intelligence" na Fase 2.

## Auditoria de Primitivos (src/components/ui/)

| Componente | Classificação | Status na Fase 2 |
| :--- | :--- | :--- |
| `button.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `input.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `textarea.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `select.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `checkbox.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `radio-group.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `switch.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `card.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `badge.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `dialog.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `sheet.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `tabs.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `tooltip.tsx` | **OFFICIAL** | Refatorado (Tokens aplicados) |
| `accordion.tsx` | LEGACY | Mantido intacto |
| `alert-dialog.tsx` | LEGACY | Mantido intacto |
| `alert.tsx` | LEGACY | Mantido intacto |
| `avatar.tsx` | LEGACY | Mantido intacto |
| `chart.tsx` | LEGACY | Mantido intacto |
| `carousel.tsx` | LEGACY | Mantido intacto |
| `form.tsx` | LEGACY | Mantido intacto |
| `label.tsx` | LEGACY | Mantido intacto |
| `sidebar.tsx` | LEGACY | Mantido intacto |
| `table.tsx` | LEGACY | Mantido intacto |
| `toast.tsx` | LEGACY | Mantido intacto |
| *Outros (radix)* | LEGACY | Mantido intacto |

## Matriz de Consumo de Primitivos Modificados (Impacto Real)

Abaixo o rastreamento das páginas legadas que importam diretamente os primitivos da biblioteca `src/components/ui/` (isolando dependências internas entre os próprios componentes da UI):

| Componente UI | Qtd de Imports (Fora de UI) | Arquivos Consumidores | Impacto Visual Potencial |
| :--- | :--- | :--- | :--- |
| `button.tsx` | 0 | Nenhuma página importa de `@/components/ui/button` | Nenhum (Componentes isolados usam botões HTML puros ou nativos legados) |
| `input.tsx` | 0 | Nenhuma | Nenhum |
| `textarea.tsx`| 0 | Nenhuma | Nenhum |
| `select.tsx` | 0 | Nenhuma | Nenhum |
| `checkbox.tsx`| 0 | Nenhuma | Nenhum |
| `radio-group` | 0 | Nenhuma | Nenhum |
| `switch.tsx` | 0 | Nenhuma | Nenhum |
| `card.tsx` | 0 | Nenhuma (O `MetricsDashboard` usa seu próprio `<Card>`) | Nenhum |
| `badge.tsx` | 1 | `BoardingPassCard.tsx` | Baixo (Apenas o boarding pass mudará as cores da tag) |
| `dialog.tsx` | 0 | Nenhuma | Nenhum |
| `sheet.tsx` | 0 | Nenhuma | Nenhum |
| `tabs.tsx` | 0 | Nenhuma | Nenhum |
| `tooltip.tsx` | 1 | `App.tsx` (Provider) | Nenhum (Apenas define o provider global) |

**Conclusão da Auditoria:** O redesign dos primitivos não causou nenhuma mudança visual ampla não-intencional nas páginas existentes porque elas não consomem os componentes Shadcn originais; os componentes foram adicionados mas não adotados nas telas antigas.

## Regras de Consumo (Fase 2+)

1. **Primitives Puros:** Usamos os componentes básicos do Radix UI via `src/components/ui`. Não crie wrappers como `CosmicButton` ou `LuxuryInput`.
2. **Design Tokens:** Utilize estritamente os tokens de Foundation, Surface, Brand, Status e State definidos em `index.css`.
   - Exemplo Correto: `bg-brand-primary text-brand-primary-fg hover:opacity-90`
   - Exemplo Incorreto: `bg-yellow-500 text-black hover:bg-yellow-600`
3. **Tipografia:** A regra fundamental do Protocolo Solar é:
   - **Cinzel (`font-display`)**: Usado EXCLUSIVAMENTE para Brand / Display / Hero / Onboarding / Revelação / Momentos emocionais especiais.
   - **Inter (`font-sans`)**: Usado OBRIGATORIAMENTE para UI funcional, Cards base (`CardTitle`), `DialogTitle`, Forms, Navigation, Admin, Labels e Buttons. Primitivos genéricos não devem assumir "momentos emocionais" sozinhos.
4. **Radii:** Utilizar apenas `var(--radius-sm)`, `var(--radius-md)` e `var(--radius-lg)`.
5. **Acessibilidade Preservada:** Não modifique os focos visuais nativos sem repor a navegação por teclado (`focus-visible:ring-state-focus`).

## Regras Anti-Regressão

- Nenhuma rota ou página foi alterada durante a refatoração dos primitivos. As páginas existentes herdam os primitivos se já os usavam, mas migrações estruturais de páginas serão feitas fase a fase.
- A Lógica Astrológica e integrações com o Supabase não são da conta do sistema de UI e nunca devem ser alteradas ao mexer em CSS/Primitivos.
