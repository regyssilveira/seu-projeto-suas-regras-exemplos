# LAB-13 — Bug E/OU

## Estado inicial
laboratorios/estados/filtro-com-bug.cjs. Caminhos referem-se à raiz do repositório, salvo o prefixo estados do LAB-01, que fica em laboratorios. O estado original pertence à tag rascunho-v1; para usar também o verificador deste roteiro, trabalhe na tag verificacao-leitor-v1. Preserve suas alterações antes de iniciar.

## Procedimento
Reproduza concluido + alta. Registre resultado antes de corrigir OU para E no exercício.

## Critérios
Antes: CH-001/CH-002; depois: vazio; verificar filtros isolados na referência.

## Comentário da solução
Usar conjunção para critérios presentes e validar entradas antes de percorrer a coleção.

## Verifique a sua cópia

No complemento `verificacao-leitor-v1`, execute `node verificadores/verificar-exercicio.cjs LAB-13 exercicio/filtro.cjs`. O arquivo indicado deve exportar a função `filtrar(itens, status, prioridade)`, com os argumentos separados do estado inicial. O caso `concluido` com `alta` precisa retornar vazio após a correção. O comando também confere filtros isolados/omitidos, valores inválidos, ordem, cópias e preservação dos dados. Veja [verificadores/README.md](../../verificadores/README.md).

## Registro da execução

Defeito e solução executados.
Preencha modelos/registro-de-execucao.md com ambiente, pedido, comandos, saída e limitações. Não trate resultado esperado como observado. Para casos de lógica da referência: node --test testes/*.test.cjs, na raiz. Para tarefas documentais ou de agente, esse comando não substitui o ensaio descrito.
