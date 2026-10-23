# LAB-14 — Refatoração

## Estado inicial
laboratorios/estados/filtros-duplicados.cjs. Caminhos referem-se à raiz do repositório, salvo o prefixo estados do LAB-01, que fica em laboratorios. O estado original pertence à tag rascunho-v1; para usar também o verificador deste roteiro, trabalhe na tag verificacao-leitor-v1. Preserve suas alterações antes de iniciar.

## Procedimento
Execute a base, extraia validação repetida e compare todos os filtros aceitos com a referência.

## Critérios
Mesmos resultados e rejeições, inclusive coleção vazia.

## Comentário da solução
referencia/chamados.cjs centraliza validarOpcao; testes/estados.test.cjs compara 16 combinações e rejeições.

## Verifique a sua cópia

No complemento `verificacao-leitor-v1`, execute `node verificadores/verificar-exercicio.cjs LAB-14 exercicio/refatoracao.cjs`. O arquivo indicado deve exportar a função `listar(itens, filtros = {})`, com `status` e `prioridade` no objeto. O estado inicial já é correto e deve passar antes da refatoração; sua cópia deve preservar os mesmos resultados depois. A suíte não julga a qualidade da extração de duplicação: revise também o diff. Veja [verificadores/README.md](../../verificadores/README.md).

## Registro da execução

Equivalência desses casos executada.
Preencha modelos/registro-de-execucao.md com ambiente, pedido, comandos, saída e limitações. Não trate resultado esperado como observado. Para casos de lógica da referência: node --test testes/*.test.cjs, na raiz. Para tarefas documentais ou de agente, esse comando não substitui o ensaio descrito.
