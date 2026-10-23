# Seu Projeto, Suas Regras — exemplos

Material complementar de Régys Borges da Silveira. Licença Apache 2.0.

## Comece pelo seu projeto
O percurso independe de linguagem. Leia contratos/chamados.md, use modelos/perfil-do-projeto.md e adapte as receitas. Não é necessário migrar seu sistema para a implementação de referência.

## Referência opcional
Abra referencia/index.html no navegador. Dados fictícios em memória; recarregar restaura o estado inicial. Para testar a lógica com Node.js, sem instalar pacotes:
```sh
node --test testes/*.test.cjs
```
Versão testada e resultados em evidencias/execucao-referencia.txt.

## Laboratórios e skills
laboratorios contém tarefas e estados com defeitos intencionais. receitas contém fontes de skills para estudar e copiar para o local reconhecido pelo seu agente. Essa pasta não instala skills automaticamente. Consulte adaptadores/README.md.
Testes da lógica não comprovam ativação de skills nem equivalência entre agentes.

## Confira a alteração que você fez

Para avaliar a sua cópia, use o verificador específico e indique o arquivo alterado:

```sh
node verificadores/verificar-exercicio.cjs LAB-12 exercicio/listagem.cjs
```

Confira o caminho exibido em Alvo. O comando geral de testes da referência não muda de alvo quando você altera outro arquivo. O complemento oferece modos para os LABs 1, 12, 13 e 14 e distingue normalização de título de criação sem mutação. Veja interfaces, preparação, códigos de saída e exemplos em [verificadores/README.md](verificadores/README.md).

## Reprodução
A tag rascunho-v1 identifica o conjunto da primeira redação e permanece preservada. A tag verificacao-leitor-v1 acrescenta a verificação das cópias do leitor, mantendo os contratos e estados originais. O piloto anterior continua citando rascunho-v1; este é um complemento identificado separadamente. Trabalhe em clone de exercício e preserve suas alterações. Aplicação local didática, sem autenticação ou persistência de produção.
