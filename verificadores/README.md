# Confira a sua cópia de exercício

Este complemento usa Node.js para avaliar o arquivo que você indicar. Não instala pacotes nem troca o alvo pela referência correta. Os caminhos abaixo partem da raiz do repositório; o arquivo de exercício pode estar em outra pasta, inclusive fora dele. Use aspas quando o caminho tiver espaços.

A tag `verificacao-leitor-v1` acrescenta os verificadores ao material da primeira redação. A tag `rascunho-v1`, citada no piloto, permanece intacta e não contém este complemento. Para obter os verificadores numa cópia sem alterações próprias, selecione `verificacao-leitor-v1`. Se já tiver exercícios modificados, preserve-os antes de trocar de versão ou obtenha o complemento em outra cópia.

## Prepare e confira o alvo

Copie o estado inicial indicado no laboratório para a sua área de exercício, usando o gerenciador de arquivos ou o comando de cópia do seu sistema. Por exemplo, no PowerShell:

```powershell
New-Item -ItemType Directory -Path exercicio -Force
Copy-Item laboratorios/estados/titulo-inicial.cjs exercicio/titulo.cjs
```

Execute o verificador antes da correção. O estado defeituoso deve reprovar. Corrija o arquivo em `exercicio` e repita o mesmo comando. Confira a linha **Alvo**: ela precisa apontar para o arquivo que você alterou, e não para `referencia/chamados.cjs`. O relatório também informa o SHA-256, uma identificação do conteúdo do arquivo examinado. Registre o comando, a saída e a versão de Node.js usada.

O comando carrega e executa o módulo local informado; não é uma inspeção somente textual. O próprio verificador não escreve no alvo. Uma aprovação representa os casos executados, não prova universal de correção, compilação Delphi, interface visual ou ativação de uma skill.

## Escolha a interface do laboratório

| Modo | Exportação do arquivo indicado | O que é avaliado |
|---|---|---|
| LAB-01 | `module.exports = normalizarTitulo`, ou objeto com `normalizarTitulo` | Rejeição de título vazio/espaços e remoção de espaços U+0020 das extremidades, preservando os internos |
| LAB-01-CRIACAO | Objeto com `criarServico(iniciais)`; serviço com `criar(titulo)` e `listar()` | Rejeição sem alterar dados, criação válida com título normalizado e preservação dos chamados anteriores |
| LAB-12 | `module.exports = listar`; chamada `listar(itens, filtros = {})` | Status opcional, erro para desconhecido inclusive sem itens, ordem e cópias |
| LAB-13 | `module.exports = filtrar`; chamada `filtrar(itens, status, prioridade)` | Filtros opcionais combinados por E, valores inválidos, ordem, cópias e preservação dos dados |
| LAB-14 | `module.exports = listar`; chamada `listar(itens, filtros = {})` | Preservação do contrato completo dos dois filtros durante a refatoração |

No LAB-12 e no LAB-14, `filtros` é um objeto com propriedades `status` e, no LAB-14, `prioridade`. Propriedade omitida ou `undefined` não restringe; texto vazio e `null` não equivalem a omissão. No LAB-13, os dois valores são argumentos separados, como no estado inicial daquele exercício.

```sh
node verificadores/verificar-exercicio.cjs LAB-01 exercicio/titulo.cjs
node verificadores/verificar-exercicio.cjs LAB-01-CRIACAO exercicio/servico.cjs
node verificadores/verificar-exercicio.cjs LAB-12 exercicio/listagem.cjs
node verificadores/verificar-exercicio.cjs LAB-13 exercicio/filtro.cjs
node verificadores/verificar-exercicio.cjs LAB-14 exercicio/refatoracao.cjs
```

Execute somente os comandos correspondentes aos arquivos que preparou. Nos LABs 1, 12 e 13, o estado inicial tem um comportamento incompleto ou defeituoso e deve reprovar. No LAB-14, o estado inicial já é correto: ele deve passar antes e depois da extração da duplicação. O verificador avalia preservação de comportamento; a qualidade da extração ainda exige revisão do diff.

## Normalização não é criação

O arquivo inicial do LAB-01 exporta apenas uma função de título. Ele não oferece uma coleção nem uma operação de cadastro. Portanto, passar em `LAB-01` não comprova que uma criação rejeitada preserve dados. Para conferir essa segunda camada, indique em `LAB-01-CRIACAO` a cópia do seu serviço com a interface da tabela. Não envolva a função num serviço inventado apenas pelo teste: a rejeição precisa ser conferida no código de criação que você realmente modificou.

## Quando sua interface for diferente

Faça um adaptador explícito junto da solução, preservando o comportamento e indicando qual arquivo contém a implementação. Por exemplo, se sua cópia de serviço em `exercicio/servico.cjs` já oferece `criarServico` e `listar(filtros)`, o adaptador do LAB-13 em `exercicio/filtro.cjs` pode ser:

```javascript
const { criarServico } = require("./servico.cjs");
module.exports = (itens, status, prioridade) =>
  criarServico(itens).listar({ status, prioridade });
```

Esse adaptador deve carregar sua cópia, não a referência da biblioteca. O hash mostrado pelo comando identifica o arquivo-alvo; se ele importa outros arquivos, registre também quais foram usados e sua versão. Para outra linguagem, use os mesmos critérios com as ferramentas reais do seu perfil. O comando Node não verifica automaticamente uma implementação Delphi.

## Interprete o resultado

- Código de saída **0**: todos os casos desse modo passaram.
- Código **1**: há divergência no comportamento; leia os casos marcados como FALHOU.
- Código **2**: uso incorreto, arquivo ausente, falha no carregamento ou exportação incompatível. Isso não é aprovação do exercício.

No PowerShell, consulte `$LASTEXITCODE` imediatamente após o comando; em shells como Bash, consulte `$?`. Para registrar os casos em formato estruturado, acrescente `--json`:

```sh
node verificadores/verificar-exercicio.cjs LAB-12 "exercicio/minha listagem.cjs" --json
```

Os casos usam dados conhecidos e também fornecem a coleção em ordem diferente, para distinguir seleção de ordenação. Verificam registros completos e preservação dos dados; modificar a saída não deve alterar a entrada. As combinações E/OU têm resultados esperados explícitos, sem reaplicar a expressão da função avaliada para produzir a expectativa.

Para testar o próprio complemento, execute `node --test testes/verificador-leitor.test.cjs`. A suíte cria cópias temporárias fora do repositório, incluindo caminhos com espaços, aprova soluções corretas e reprova estados iniciais e regressões deliberadas. Os registros de execução estão em `evidencias/verificacao-copia-leitor.json`.
