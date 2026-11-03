# REGRAS ABSOLUTAS DE DESENVOLVIMENTO (LEITURA OBRIGATÓRIA)

## 1. PROIBIDO INJEÇÃO CEGA (FIM DOS .CJS PARA JSX)
- NUNCA use scripts Node (`.cjs`) com `replace()` de string para injetar blocos grandes de código React.
- Todas as edições devem garantir que as VARIÁVEIS estão declaradas e os IMPORTS (`Accordion`, `Lucide Icons`) estão no topo do arquivo.
- Se a página der tela branca, o culpado é você por não validar tipagem e escopo.

## 2. A FONTE DA VERDADE É A V1
- A regra de negócio mora em `src/components/DestinyResults.tsx`.
- Nunca invente uma funcionalidade nova na V2 (`AppleResultPreview`) sem olhar como a V1 faz. A V2 é uma evolução estética, não uma mudança do modelo de negócios.

## 3. A ARQUITETURA INTOCÁVEL (CASA > CIDADE > 8 FOCOS)
- **12 Casas:** É o continente. O usuário ganha 1 grátis e compra as outras 11 (Upsell).
- **Cidades Extras:** Cada Casa tem rotas alternativas (Nacional, Acessível, High Ticket) que são DADAS DE GRAÇA para aquela casa destrancada.
- **8 Focos (Dimensões):** Dentro da cidade atual, o usuário vê como ela afeta 8 áreas da vida (Amor, Saúde, etc.). ISSO É UM ACCORDION, NÃO UM MENU DE NAVEGAÇÃO SUPERIOR. A cidade NUNCA muda quando ele lê um foco diferente.

## 4. COERÊNCIA DE MOCK DATA
- Se o Boarding Pass diz "Casa 2 - Madrid", a Grade de Upsell no final da página TEM que dizer que a Casa Livre é a 2 e a cidade é Madrid.

## 5. TESTE ANTES DE ENTREGAR
- Qualquer alteração exige `npm run dev` limpo e verificação de terminal vazio (sem erros de TS/React) antes de pedir aprovação do usuário.
