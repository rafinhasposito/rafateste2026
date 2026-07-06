## Objetivo
Reconstruir a tela "Ver o Mapa Completo" (`/dashboard`) seguindo a direção **Editorial Cósmico** escolhida, unificando o vocabulário visual com o Histórico de Consultas: hierarquia editorial, cards `rounded-2xl/3xl` com borda-esquerda colorida por casa, tipografia Cinzel dominante, labels `uppercase tracking-[0.2em]`, superfícies `slate-900/40` com `backdrop-blur`, e acentos por casa/modo (âmbar/esmeralda/índigo + `--house-accent`).

Nada de conteúdo removido — apenas reorganização, refinamento visual e coesão.

## Escopo (arquivos)
1. `src/pages/Dashboard.tsx`
2. `src/components/HouseDetail.tsx`
3. `src/components/HouseCard.tsx` (ajustes leves para casar com nova estética)

## Mudanças por seção

### 1. Cabeçalho do Dashboard
- Substituir a "top bar" simples por um **header editorial**:
  - Migalha `Mapa Astral / Ver o Mapa Completo` em índigo `uppercase tracking-widest`.
  - Título `Dashboard Estelar` em Cinzel 3xl-4xl.
  - À direita, pill do modo (Passado/Presente/Futuro na cor certa) + pill "Créditos" e link "Nova Consulta" reorganizados como pílulas coerentes.

### 2. Card de resumo + Oráculo (fusão)
- Fundir o card de resumo da consulta e o bloco de Oráculo em **uma única "carta editorial"** `rounded-3xl` com:
  - Ícone/glifo cósmico grande decorativo em `opacity-10` no canto.
  - Label `Oráculo do Mestre Astrólogo` em índigo.
  - Frase em Cinzel 2xl branca (a citação do oráculo).
  - Rodapé separado por `border-t`: nome + Casa alvo colorida + data/hora + origem (equivalente ao card atual, condensado).
- Borda-esquerda 4px na cor da casa alvo.

### 3. Grid das 12 Casas
- Manter `HouseCard`, mas ajustar container: grid `grid-cols-6 md:grid-cols-12 gap-3` em variação "constelação" — cards menores tipo aspecto quadrado com `CASA` label + número em Cinzel; a casa selecionada ganha `border-2` na cor da casa + `bg-[accent]/10` + glow. Casa alvo mantém coroa. Casas bloqueadas com `opacity-40 grayscale-[.4]`.
- Chip "N de 12 desbloqueadas" acima do grid.

### 4. Painel de Detalhe da Casa (HouseDetail) — reconstrução completa
Aplicar layout de duas colunas:

```text
┌──────────────────────────────────────────────────────────┐
│ Fechar                                                   │
├─────────────────────┬────────────────────────────────────┤
│ SIDEBAR (1/3)       │  MAIN (2/3)                        │
│ border-l-8 accent   │                                    │
│ • Casa N (Cinzel 3xl)│ • Leitura de Ativação             │
│ • Label da casa      │ • Tags                            │
│ • Arquétipo / Signo  │ • Egrégora / Resumo poético       │
│   / Regente / Cristal│ • Destinos Calculados (grid 2×2)  │
│ • Badge modo         │   com mapa + coordenadas          │
│ • Cidade aniversário │ • Promessa do Universo            │
│   (past + goal)      │ • Profissional / Amor / Pessoal   │
│ • Tags (chips)       │ • Benefício / Ideal Para          │
│ • Radar de Impacto   │                                   │
│   (barras finas)     │                                   │
└─────────────────────┴────────────────────────────────────┘
```

- Container: `bg-slate-900/60 rounded-[2rem] border border-border/50 overflow-hidden`.
- Sidebar: `bg-slate-950/40 border-r`, `border-l-8` cor da casa.
- Radar com barras finas h-1 estilo protótipo (não h-1.5 pesadas).
- Destinos: cards `rounded-2xl bg-slate-800/40 border border-slate-800`, mapa embutido menor (h-24), coordenadas discretas.
- Cabeçalhos de seção: `text-[10px] uppercase tracking-[0.25em]` na cor accent da casa.
- Footer com `Benefício` (verde) e `Ideal Para` (âmbar) lado a lado com labels coloridos, separados por `border-t border-slate-800`.

### 5. CTA de desbloqueio
- Manter lógica intacta, mas envelopar no mesmo estilo: card `rounded-2xl bg-slate-900/40 border`, título Cinzel, botões coerentes com pílulas do resto.

## Tokens & padronização
- Usar tokens semânticos existentes: `card`, `border`, `foreground`, `muted-foreground`, `primary`. Onde o protótipo usa `slate-900/60` e `slate-800`, mapear para `bg-card/40` / `border-border/50` para respeitar o design system.
- Cor de acento por casa via `--house-accent` inline (`style={{ borderLeftColor: 'rgb(var(--accent))' }}`), aproveitando `extractAccentColor`.
- Cores por modo continuam: âmbar (passado), esmeralda (presente/futuro atual — ajustar para índigo no futuro conforme memory), respeitando a memory `Temporal modes`.

## Detalhes técnicos
- Motion: manter `AnimatePresence` no HouseDetail; entradas com `fade-in + y:20`; barras de radar animam width como já fazem.
- Sem novas dependências.
- Preservar todo o conteúdo textual dinâmico (past/present/future adaptations, sombra, cidade do aniversário).
- Guards `Number.isFinite` no mapa/coords ficam como estão.
- Sem mudança de rota, API, lógica de créditos, unlock ou queries Supabase.

## Fora de escopo
- Não mexer em `HouseLookup`, `CityLookup`, `IntentLookup`, `DestinyResults`, histórico, autenticação ou backend.
- Não introduzir novas fontes nem palette clara.
- Não remover seções existentes.

## Verificação
- Abrir `/dashboard?id=…` em Playwright após build, capturar full-page e comparar com o protótipo escolhido: header editorial, card oráculo fundido, grid 12 casas, painel 2-colunas com sidebar accent, radar barras finas, footer Benefício/Ideal.
- Testar modos Passado e Futuro para garantir troca de labels/cores.
