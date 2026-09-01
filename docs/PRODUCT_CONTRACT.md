# CONTRATO DO PRODUTO (PRODUCT_CONTRACT)

Este documento é a LEI DO PRODUTO.
Nenhum agente deve alterar regras aqui definidas ou restaurar funcionalidades antigas que violem este documento.

## 1. CORE COMERCIAL E JORNADA
A cadeia indivisível do produto é:
`Consulta -> Resultado -> 12 Casas -> Desbloqueio -> Persistência -> Histórico -> Reabertura`

Se qualquer elo falhar, o core está quebrado.

## 2. REGRAS DE COBRANÇA E MOEDA
O sistema opera com DUAS lógicas de valor separadas:
1. **Créditos**: Servem APENAS para criar Novas Consultas.
2. **FIAT (R$)**: Serve para Desbloquear Casas adicionais de uma consulta já gerada. O pagamento é feito via Mercado Pago e atrelado ao `consultation_id`.

**Precificação:**
- **Nova Consulta**: 1 Crédito (Equivalente a R$ 29,90). Dá direito ao Resultado Inicial (1 Casa aberta).
- **Desbloquear 1 Casa específica**: R$ 14,90
- **Pacote +3 Casas**: R$ 29,90
- **Mapa Completo (12 Casas)**: R$ 99,90 TETO TOTAL.
  - O usuário NUNCA paga mais que R$ 99,90 por uma mesma Revolução Solar (consulta).
  - O valor do "Completar Mapa" é dinâmico: `R$ 99,90 - Total Já Gasto Nesta Consulta`.
  - Exemplo: Se pagou R$ 29,90 pela consulta, faltam R$ 70,00.

**NÃO EXISTE compra de casas com créditos.**

## 3. RESULTADO EDITORIAL (O PRODUTO ENTREGUE)
A Casa inicial (e qualquer desbloqueada) DEVE exibir o dossiê editorial rico:
1. Hero (Destino, Coordenadas, Casa ativada)
2. Egrégora do Destino (AI Insight)
3. Dossiê Estratégico ("O Segredo", "Áreas da Vida", "Como Aproveitar", "Onde Pisar com Cuidado")
4. Exploração das outras Casas

## 4. EXPLORAÇÃO DAS 12 CASAS (UI)
- As 12 casas aparecem de forma **COMPACTA** no fim do resultado.
- Casa atual/desbloqueada: Visível, clicável (faz a tela focar nela).
- Casa bloqueada: Com ícone 🔒, opaca. Clicar abre o Modal de Desbloqueio (Regra Monetária FIAT, não créditos).
- NENHUMA lista gigantesca de "HouseCards" abaixo do grid compacto.

## 5. CONTAS ADMIN vs USUÁRIO
- **Admin** (ex: divulgacaoareavip@gmail.com): Permite acesso e simulação de débito sem reduzir saldo de créditos ou bloquear acesso real. Não usar admin para validar débito do usuário comum.
- **Usuário Comum**: Valida RLS, débito real, saldo, histórico, Mercado Pago.

## 6. HISTORY / DASHBOARD
- Ao clicar "Abrir Dossiê" no History, deve carregar o Dashboard na URL `/dashboard?id=UUID`.
- A consulta deve abrir imediatamente na Casa Inicial, com as mesmas casas desbloqueadas de antes.
- Nenhuma cobrança deve ocorrer apenas por reabrir uma consulta salva.
- A tela preta está expressamente proibida. Falhas devem ser capturadas por ErrorBoundary.

## 7. INTEGRIDADE TÉCNICA
- **Banco Definitivo**: gvqdlsflrbctfiorimcl
- **NUNCA** usar mocks de ID (ex: "test-consultation-id").
- **Regression Gate**: Antes de dar tarefa como concluída, garantir que a alteração não quebrou os outros 6 elos da jornada.
