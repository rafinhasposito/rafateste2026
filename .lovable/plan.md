## Causa raiz encontrada

As fotos novas que coloquei no `CITY_IMAGES` **estão lá**, mas nunca aparecem porque o código busca a foto da Wikipedia primeiro. Como Wikipedia quase sempre responde para cidades grandes (Nova York, Paris, São Paulo…), a minha curadoria do Unsplash nunca é usada — só serviria se a Wikipedia falhasse.

**Linha problemática (`src/components/DestinyResults.tsx:278`):**

```ts
const heroImage = wikiData?.originalimage?.source 
              || wikiData?.thumbnail?.source 
              || cityImage;  // ← minha curadoria, último na fila
```

Resultado: você vê sempre a foto que a Wikipedia escolheu (geralmente o brasão da cidade, um mapa, ou uma foto vertical mal enquadrada), nunca os skylines bonitos que selecionei.

---

## Correção

Inverter a prioridade: **minha curadoria primeiro**, Wikipedia só como fallback para cidades fora da lista.

**Nova ordem:**
1. Foto curada do Unsplash (skyline icônico, horizontal, alta qualidade) — para as ~50 cidades principais
2. Wikipedia (`originalimage` ou `thumbnail`) — para cidades fora da curadoria
3. Imagem genérica de fallback — caso ambos falhem

**Mudança (1 arquivo, 2 trechos pequenos):**

`src/components/DestinyResults.tsx`:
- Adicionar helper `getCuratedCityImage()` que retorna a URL curada **ou null** (em vez de cair no fallback genérico)
- Linha 278: mudar a ordem para `curated || wikiData?.originalimage || wikiData?.thumbnail || cityImage`

O texto da seção "Sobre [Cidade]" continua vindo da Wikipedia normalmente — só a **foto** muda de fonte.

---

## Resultado esperado

Cidades como Nova York, Paris, Lisboa, São Paulo, Rio, Tóquio etc. passarão a mostrar os skylines icônicos do Unsplash que selecionei. Cidades pequenas (fora da lista de 50) continuam usando a foto da Wikipedia como antes.

## O que NÃO muda

- Texto/resumo da Wikipedia continua aparecendo
- Lógica de créditos, desbloqueio, clima
- Grid das casas, histórico, tudo o resto
