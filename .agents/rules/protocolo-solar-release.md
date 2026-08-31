# Protocolo Solar — Release Mode

## Estado permanente
Este workspace está em MODO LANÇAMENTO da V1.

## Regra central
FUNCIONA -> NÃO TOCAR.
NÃO FUNCIONA -> CORRIGIR COM A MENOR MUDANÇA POSSÍVEL.

## Baseline
- O produto já existe e não deve ser redesenhado.
- O Lovable original é o baseline funcional/editorial.
- O código atual contém melhorias já validadas e deve ser preservado quando estiver funcionando.
- Não reconstruir arquitetura para buscar "uma solução melhor".

## Arquitetura congelada
Não remover, reordenar ou reinventar sem blocker funcional comprovado:
- onboarding;
- Passado / Presente / Futuro;
- Por Cidade / Por Casa / Por Intenção;
- dados natais;
- cálculo;
- resultados;
- interpretação das 12 Casas;
- contexto de cidade;
- exploração das 12 Casas.

## Conteúdo V1
Pode ser usado na V1:
- conteúdo Human-First já validado;
- campos neutros/originais já aprovados.

Conteúdo legado "Conselheiro de Elite":
- preservar nos dados;
- não reescrever durante a corrida de lançamento;
- se não for necessário ao fluxo principal, não exibir;
- tratar como V1.1, nunca como blocker.

## Blocker de lançamento
É blocker somente quando impede ou compromete seriamente o uso:
- app não abre;
- build falha;
- erro fatal de runtime;
- rota essencial quebrada;
- botão essencial sem ação;
- formulário essencial não envia;
- cálculo não retorna ou retorna erro;
- resultado não renderiza;
- Casa não abre;
- dado essencial ausente;
- API obrigatória quebrada;
- fluxo essencial inutilizável em mobile ou desktop;
- deploy impossível.

## Não-blockers: V1.1
Nunca interromper V1 por:
- copy que poderia ficar melhor;
- tom editorial secundário;
- padding, sombra, detalhe de cor;
- microinteração;
- animação;
- refatoração;
- dívida técnica;
- nomenclatura;
- componente que poderia ser mais elegante;
- feature nova;
- otimização sem impacto real no lançamento.

## Proibições durante Release Mode
- Não criar nova arquitetura.
- Não abrir auditoria conceitual/editorial geral.
- Não criar implementation_plan, architecture_review ou documentos de burocracia.
- Não refatorar áreas vizinhas ao corrigir um blocker.
- Não pedir aprovação para seguir de um blocker para o próximo.
- Não declarar tarefa concluída só porque o build passou.
- Não parar para sugerir novas features.
- Não reabrir decisões congeladas.

## Método obrigatório
1. Fazer checkpoint Git seguro antes de alterações relevantes.
2. Testar o produto.
3. Encontrar blockers reais.
4. Corrigir o menor escopo possível.
5. Retestar a correção.
6. Rodar build.
7. Continuar até zero blockers ou existir blocker humano externo real.
8. Ao final, smoke test completo mobile + desktop.
9. Só então declarar V1 pronta.

## Uso de agentes
O Release Captain deve delegar QA em paralelo sempre que possível:
- qa-functional: fluxo real pelo browser, sem editar código.
- qa-build: build/runtime/console/APIs, sem redesenhar.
- qa-responsive: mobile/desktop, somente blockers de uso.

Somente o Release Captain deve consolidar correções no código principal.

## Condição de parada
Pode parar apenas se:
A) zero blockers de lançamento e build final verde; ou
B) existe blocker humano externo real: credencial, senha, pagamento, acesso ausente,
   decisão irreversível ou operação de produção que exige autorização.

Antes de parar, atualizar `.agents/release/status.json`.
