

## Plano: Corrigir Grid 12 Casas + Fotos/Clima + Desbloqueio Funcional

### Problemas Atuais

1. **Grid das 12 casas** mostra apenas nome/label — sem tags, cristal, arquétipo, signo, cidade nem bandeira. O design do Dashboard (HouseCard) é muito superior e já funciona
2. **Desbloqueio consome créditos mas não revela nada** — `handleUnlockPackage` chama `onUnlock` que desconta créditos no banco, mas o componente não tem estado local para rastrear quais casas foram desbloqueadas. Nenhum dado de cidades das outras 11 casas é carregado
3. **Sem fotos nem clima das cidades** — o Master Destiny usa imagens curadas + Wikipedia, mas não tem clima real nem fotos dinâmicas
4. **Contraste ruim** — texto escuro sobre fundo escuro no grid

---

### Mudanças

#### 1. Grid das 12 Casas com design completo (`DestinyResults.tsx`)

Substituir o grid simplificado (linhas 533-582) por cards iguais ao `HouseCard.tsx`:
- Cada card usa `houseColors[houseNum]` como `background` (gradiente radial)
- Mostrar: "Casa N", label, arquétipo + signo (`getHouseArchetype`, `houseSigns`), regente, tags, cristal
- Casa consultada: desbloqueada com cidade + bandeira visível
- Outras 11: overlay de cadeado com blur, clique abre modal de pacotes

**Estado de desbloqueio local:**
- `const [unlockedHouses, setUnlockedHouses] = useState<Set<number>>(new Set([house]))`
- Quando `handleUnlockPackage` é chamado com sucesso, adicionar casas ao Set **antes** de chamar `onUnlock`
- Para +1: desbloqueia a próxima casa; +3: próximas 3; 12: todas
- Casas desbloqueadas mostram dados de `cityDatabase[houseNum]` (estáticos) enquanto dados de API não estão disponíveis

#### 2. Fotos dinâmicas via Unsplash API (`DestinyResults.tsx`)

- Usar Unsplash Source (gratuito, sem API key): `https://source.unsplash.com/800x600/?{cityName},city`
- Aplicar como thumbnail nos cards desbloqueados e como hero no Master Destiny quando não houver imagem curada no dicionário `CITY_IMAGES`
- Fallback: Wikipedia image → curated → Unsplash Source → fallback genérico

#### 3. Clima atual via OpenWeatherMap (`DestinyResults.tsx`)

- Criar edge function `get-weather` que recebe `city` e `country` e retorna temperatura + ícone
- No Master Destiny desbloqueado, exibir badge com temperatura e ícone do clima ao lado das coordenadas
- Chamada assíncrona on-demand (apenas quando desbloqueia)
- Requer API key do OpenWeatherMap (secret)

#### 4. Corrigir contraste de texto

- Nos cards do grid: `text-primary` para "Casa N", `text-foreground` para label, `text-foreground/50` para arquétipo
- Tags: `bg-foreground/5 border-foreground/10 text-foreground/60` (igual ao HouseCard)

#### 5. Corrigir overlay "Mapeamento Global Completo"

- O overlay (linhas 480-510) ao clicar deve chamar `setShowUnlockModal(true)` em vez de mostrar overlay próprio com botão separado
- Após desbloqueio com sucesso: remover blur dos nomes das cidades secundárias

---

### Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Grid 12 casas completo, estado desbloqueio, fotos Unsplash, clima, contraste |
| `supabase/functions/get-weather/index.ts` | Nova edge function para clima (OpenWeatherMap) |

### Pré-requisito

- **API Key OpenWeatherMap**: Necessária como secret para a edge function de clima. Vou solicitar ao usuário antes de implementar.

### O que NÃO muda
- `houses.ts`, `HouseCard.tsx`, `Dashboard.tsx` — intactos
- Sem migrações de banco

