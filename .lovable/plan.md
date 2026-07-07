## Diagnóstico

Hoje temos **duas telas de resultado diferentes**, com layouts inconsistentes:

- **1 crédito** (`DestinyResults.tsx`) — layout novo, premium: hero com foto da cidade, clima, Wikipedia, cartão glass do Destino Mestre, Egrégora, Rituais, Previsões, tags, cristal, coordenadas.
- **Dashboard / desbloqueio total** (`Dashboard.tsx` → `HouseDetail.tsx`) — layout antigo, enxuto: sem foto, sem clima, sem Wikipedia, sem rituais, sem cartão glass. Além disso, o "Mapeamento Global Completo" no rodapé do `DestinyResults` mostra cidades com **coordenadas quebradas** (`44°, ?????`) porque só temos `lat` — falta `lon` no render.

O objetivo é ter **um único padrão visual** em todas as telas de resultado (1 crédito, 3 créditos, Dashboard, casa selecionada no grid), com o design mais rico do `DestinyResults` como referência.

## Escopo (2 frentes)

### Frente A — Unificar o Dashboard no padrão `DestinyResults`

**1. `src/components/DestinyResults.tsx`**
- Adicionar prop opcional `autoUnlocked?: boolean`.
- Quando `true`: iniciar já com `unlocked = true` (pula o overlay "Desbloquear Mapeamento") e disparar `fetchWikipediaData` + `fetchWeatherData` no mount.
- Incluir no cartão glass os blocos que hoje só existem em `HouseDetail` e que o usuário quer manter:
  - **Radar de Impacto** (Dinheiro / Amor / Saúde) — usando `houseData.radar`.
  - **A Promessa do Universo** (título temporal: "Preparou / Para Este Ciclo / Ativa Neste Momento") — `houseData.promessa_texto`.
  - **Áreas** (Profissional / Amor / Pessoal) já existem em Previsões — manter.
  - **Benefício / Ideal Para** — `houseData.beneficio` e `houseData.ideal`.
  - **Sombra** (só no modo passado) — `houseData.sombra`.
  - **Leitura de Ativação da Casa** (texto temporal atual do `HouseDetail`).
- Adicionar prop `mode?: "passado" | "presente" | "futuro"` para escolher textos e labels no tempo verbal certo (reaproveitando a lógica que já existe em `HouseDetail`).

**2. `src/pages/Dashboard.tsx`**
- Substituir o bloco `<HouseDetail ... />` da casa selecionada por `<DestinyResults ... autoUnlocked mode={currentMode} />`.
- Converter `consultation.result.results[house]` (shape `{ city, options: { highticket, acessivel, nacional } }`) para o shape que `DestinyResults` espera (`cities: { highticket: CityOption[], acessivel: CityOption[], nacional: CityOption[] }`). Cidade primária (`result.city`) vira o primeiro item do `highticket` (masterCity).
- Passar `allResults`, `consultationId`, `userCredits`, `isAuthenticated`.
- Fallback: se `result` da casa selecionada não existir (consulta legada), continuar renderizando `HouseDetail`.
- Não mexer: topo (badge Passado/Presente/Futuro + tipo de busca + nome + data), oráculo, grid das 12 `HouseCard`, seção "Desbloqueie Mais Casas".

### Frente B — Corrigir coordenadas quebradas no "Mapeamento Global Completo"

**3. `src/components/DestinyResults.tsx`** (seção `secondaryCities`)
- Onde renderiza `44°, ?????` — hoje está usando só `lat` e caindo em `?` para `lon`. Corrigir para: `{lat.toFixed(2)}°, {lon.toFixed(2)}°`, com fallback amigável (esconder a linha) quando faltar coordenada em vez de mostrar `?????`.
- Garantir que a bandeira, cidade e país usem a mesma tipografia/tokens do resto do cartão glass (Cinzel para nome da cidade, Inter/foreground para país).

## O que NÃO muda
- Fluxo de crédito e débito.
- Regras de bloqueio/desbloqueio de casas (`houses_unlocked`).
- Componente `HouseDetail` permanece como fallback para consultas legadas.
- Rotas e navegação.
- Design system (cores/fontes) — reusamos os tokens já existentes; padronização é estrutural, não uma redesign de paleta.

## Verificação
- `tsgo --noEmit`.
- Playwright em `/dashboard?id=<id de consulta com mapa completo>`: confirmar que a casa selecionada mostra foto, clima, Wikipedia, Egrégora, Rituais, Radar, Promessa, Áreas, Benefício/Ideal — e que o "Mapeamento Global Completo" exibe coordenadas corretas (`-27.60°, -48.55°`) em vez de `?????`.
