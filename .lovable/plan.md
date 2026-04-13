

## Plano: Exibir Número e Cores da Casa no Resultado por Cidade (Passado)

### Problema

Quando o usuário consulta por cidade (modo Passado), o resultado mostra a cidade mas não destaca visualmente o **número da casa** nem aplica as **cores específicas da casa** de forma proeminente. O número da casa aparece pequeno no lock screen, e após desbloqueio o foco visual é na cidade sem identidade cromática da casa.

### Solução

Reforçar a identidade visual da casa em todo o card de resultado:

#### 1. Número da Casa Grande e Proeminente

- Adicionar um **badge/número gigante** da casa (ex: "7") como elemento decorativo de fundo (estilo watermark) no card principal, usando `rgba(${accentColor}, 0.06)` em tamanho ~120px
- Acima do nome da cidade, exibir um badge colorido: **"Casa 7 · Libra"** com fundo `rgba(${accentColor}, 0.15)` e borda `rgba(${accentColor}, 0.4)`

#### 2. Cores da Casa Aplicadas ao Card Principal

- Aplicar o `houseColors[house]` (gradiente radial) como **background do card inteiro** do Destino Mestre (atualmente só usa imagem de fundo)
- Adicionar uma camada de gradiente com a cor accent da casa sobre o overlay existente
- Bordas do card: usar `rgba(${accentColor}, 0.5)` mais forte
- Tags de poder: já usam accent — manter

#### 3. Textos com Cor da Casa

- Título "O Destino Mestre" → cor accent da casa (já está)
- Nome da cidade: manter branco mas adicionar **text-shadow** com cor accent: `0 0 30px rgba(${accentColor}, 0.3)`
- Label "Casa N" acima da cidade: fonte Cinzel, cor accent, tracking largo

#### 4. Foto da Cidade com Overlay Colorido

- Sobre a foto da cidade, aplicar um gradient overlay usando a cor accent da casa: `linear-gradient(to bottom, rgba(${accentColor}, 0.2), transparent)`
- Borda da foto: `rgba(${accentColor}, 0.3)` em vez de `border-primary/10`

### Arquivo Modificado

| Arquivo | Mudança |
|---|---|
| `src/components/DestinyResults.tsx` | Badge casa grande, gradiente accent no card, text-shadow, overlay colorido na foto |

### O que NÃO muda
- Lógica de dados, desbloqueio, créditos
- Grid das 12 casas (já tem cores por casa)
- Componentes de lookup, houses.ts

