# LAB-01 — Título obrigatório

## Estado inicial
estados/titulo-inicial.cjs. Caminhos referem-se à raiz do repositório, salvo o prefixo estados do LAB-01, que fica em laboratorios. O estado original pertence à tag rascunho-v1; para usar também o verificador deste roteiro, trabalhe na tag verificacao-leitor-v1. Preserve suas alterações antes de iniciar.

## Procedimento
Copie o estado inicial para uma área de exercício. Peça a correção primeiro com pedido curto e depois, em outra cópia e sessão, com contrato explícito. Preserve configurações, entradas e registros.

## Critérios
Vazio e três espaços são rejeitados; texto válido tem espaços comuns nas extremidades removidos; criação inválida não modifica dados.

## Comentário da solução
referencia/chamados.cjs: normalizarTitulo. O teste automatizado demonstra o defeito e a solução, não o efeito causal de prompts.

## Verifique a sua cópia

No complemento `verificacao-leitor-v1`, execute `node verificadores/verificar-exercicio.cjs LAB-01 exercicio/titulo.cjs`, indicando a sua função de título. O estado inicial deve reprovar; a correção deve passar sem destruir espaços internos. Isso avalia normalização, não criação. Para testar uma cópia do serviço de cadastro, use `node verificadores/verificar-exercicio.cjs LAB-01-CRIACAO exercicio/servico.cjs`. Confira as interfaces e os limites em [verificadores/README.md](../../verificadores/README.md). A tag `rascunho-v1`, citada no piloto, não contém o complemento.

## Registro da execução

Lógica executada; duas sessões comparativas de agentes ainda não registradas.
Preencha modelos/registro-de-execucao.md com ambiente, pedido, comandos, saída e limitações. Não trate resultado esperado como observado. Para casos de lógica da referência: node --test testes/*.test.cjs, na raiz. Para tarefas documentais ou de agente, esse comando não substitui o ensaio descrito.
