# LAB-14 — Refatoração

## Estado inicial
laboratorios/estados/filtros-duplicados.cjs. Caminhos referem-se à raiz do repositório, salvo o prefixo estados do LAB-01, que fica em laboratorios. Use a tag rascunho-v1 em cópia de exercício. Preserve suas alterações antes de iniciar.

## Procedimento
Execute a base, extraia validação repetida e compare todos os filtros aceitos com a referência.

## Critérios
Mesmos resultados e rejeições, inclusive coleção vazia.

## Comentário da solução
referencia/chamados.cjs centraliza validarOpcao; testes/estados.test.cjs compara 16 combinações e rejeições.

## Registro e limites
Equivalência desses casos executada.
Preencha modelos/registro-de-execucao.md com ambiente, pedido, comandos, saída e limitações. Não trate resultado esperado como observado. Para casos de lógica da referência: node --test testes/*.test.cjs, na raiz. Para tarefas documentais ou de agente, esse comando não substitui o ensaio descrito.
