# LAB-12 — Filtro opcional

## Estado inicial
laboratorios/estados/listagem-inicial.cjs. Caminhos referem-se à raiz do repositório, salvo o prefixo estados do LAB-01, que fica em laboratorios. O estado original pertence à tag rascunho-v1; para usar também o verificador deste roteiro, trabalhe na tag verificacao-leitor-v1. Preserve suas alterações antes de iniciar.

## Procedimento
Copie o estado inicial para exercício. Implemente status opcional preservando retorno sem filtro e ordem.

## Critérios
aberto: CH-001/CH-003; em-andamento: vazio; cancelado: erro inclusive sem itens.

## Comentário da solução
referencia/chamados.cjs: listar; testes de contrato e estados verificam os resultados.

## Verifique a sua cópia

No complemento `verificacao-leitor-v1`, execute `node verificadores/verificar-exercicio.cjs LAB-12 exercicio/listagem.cjs`. O arquivo indicado deve exportar a função `listar(itens, filtros = {})`, com `status` no objeto de filtros. O estado inicial deve reprovar. O comando confere seleção, erro em coleção vazia, ordem e cópias dos registros no arquivo que você modificou. Veja [verificadores/README.md](../../verificadores/README.md).

## Registro da execução

Lógica de solução e preservação executadas.
Preencha modelos/registro-de-execucao.md com ambiente, pedido, comandos, saída e limitações. Não trate resultado esperado como observado. Para casos de lógica da referência: node --test testes/*.test.cjs, na raiz. Para tarefas documentais ou de agente, esse comando não substitui o ensaio descrito.
