"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const dados = require("../fixtures/chamados.json");

const copia = valor => structuredClone(valor);
const preparar = () => copia([dados[2], dados[0], dados[1]]);
const esperados = ids => ids.map(id => copia(dados.find(item => item.id === id)));
const caso = (nome, executar) => ({ nome, executar });

function exigirFuncao(valor, nome) {
  assert.equal(typeof valor, "function", `O módulo deve exportar ${nome}.`);
  return valor;
}

function conferirLista(listar, argumentos, ids) {
  const entrada = preparar();
  const anterior = copia(entrada);
  const filtros = copia(argumentos);
  const resultado = listar(entrada, ...argumentos);
  assert.deepStrictEqual(resultado, esperados(ids), "Confira os registros completos e a ordem por identificador.");
  assert.deepStrictEqual(entrada, anterior, "A listagem modificou os dados de entrada.");
  assert.deepStrictEqual(argumentos, filtros, "A listagem modificou os filtros recebidos.");
  assert.notStrictEqual(resultado, entrada, "Retorne uma coleção nova.");
  if (resultado.length) resultado[0].titulo = "Alterado apenas na saída";
  resultado.push({ id: "SOMENTE-SAIDA" });
  assert.deepStrictEqual(entrada, anterior, "A saída expõe os registros de entrada; retorne cópias.");
}

function conferirRejeicao(listar, argumentos, vazia) {
  const entrada = vazia ? [] : preparar();
  const anterior = copia(entrada);
  const filtros = copia(argumentos);
  assert.throws(() => listar(entrada, ...argumentos), "Valor desconhecido deve gerar erro.");
  assert.deepStrictEqual(entrada, anterior, "A tentativa rejeitada modificou os dados.");
  assert.deepStrictEqual(argumentos, filtros, "A tentativa rejeitada modificou os filtros.");
}

function casosTitulo(modulo) {
  const normalizar = exigirFuncao(typeof modulo === "function" ? modulo : modulo.normalizarTitulo, "uma função ou { normalizarTitulo }");
  const casos = ["", "   ", undefined, null, 42, {}].map(valor =>
    caso(`Rejeita ${JSON.stringify(valor) ?? "undefined"}`, () => assert.throws(() => normalizar(valor)))
  );
  for (const [entrada, esperado] of [
    ["Ajustar tela", "Ajustar tela"],
    ["  Ajustar tela  ", "Ajustar tela"],
    ["  Ajustar  tela  ", "Ajustar  tela"],
  ]) casos.push(caso(`Normaliza ${JSON.stringify(entrada)}`, () => assert.equal(normalizar(entrada), esperado)));
  return { casos, limite: "Avalia normalização de título; não comprova criação sem mutação. Use LAB-01-CRIACAO para essa camada. Tabulações e outros espaços ficam fora do LAB-01." };
}

function casosCriacao(modulo) {
  const criarServico = exigirFuncao(modulo.criarServico, "{ criarServico }");
  function servicoNovo() {
    const origem = copia(dados);
    const servico = criarServico(origem);
    assert.equal(typeof servico?.criar, "function", "O serviço deve oferecer criar(titulo).");
    assert.equal(typeof servico?.listar, "function", "O serviço deve oferecer listar().");
    assert.deepStrictEqual(servico.listar(), dados, "O serviço deve começar com os chamados fornecidos.");
    return { servico, origem };
  }
  const casos = ["", "   ", undefined, null, 42].map(valor => caso(
    `Criação rejeita ${JSON.stringify(valor) ?? "undefined"} e preserva os registros`, () => {
      const { servico, origem } = servicoNovo();
      const anterior = copia(servico.listar());
      assert.throws(() => servico.criar(valor));
      assert.deepStrictEqual(servico.listar(), anterior, "A criação rejeitada alterou a coleção.");
      assert.deepStrictEqual(origem, dados, "O serviço alterou os dados recebidos do chamador.");
    }
  ));
  casos.push(caso("Criação válida grava título normalizado e preserva os chamados anteriores", () => {
    const { servico, origem } = servicoNovo();
    const novo = servico.criar("  Ajustar  tela  ");
    assert.equal(novo.titulo, "Ajustar  tela");
    assert.equal(typeof novo.id, "string");
    assert.ok(novo.id.length && !dados.some(item => item.id === novo.id), "O serviço deve gerar um identificador novo.");
    assert.deepStrictEqual(servico.listar().filter(item => item.id !== novo.id), dados);
    assert.equal(servico.listar().length, dados.length + 1);
    assert.equal(servico.listar().find(item => item.id === novo.id)?.titulo, "Ajustar  tela");
    assert.deepStrictEqual(origem, dados);
  }));
  return { casos, limite: "Avalia a criação do LAB-01, não todo o contrato do serviço. O arquivo precisa oferecer criarServico(iniciais), criar(titulo) e listar()." };
}

function casosListagem(modulo) {
  const listar = exigirFuncao(modulo, "uma função (itens, filtros = {})");
  const todos = ["CH-001", "CH-002", "CH-003"];
  const casos = [
    caso("Sem segundo argumento preserva todos os registros", () => conferirLista(listar, [], todos)),
    caso("Objeto vazio preserva todos os registros", () => conferirLista(listar, [{}], todos)),
    caso("Status undefined equivale a filtro omitido", () => conferirLista(listar, [{ status: undefined }], todos)),
  ];
  for (const [status, ids] of [["aberto", ["CH-001", "CH-003"]], ["concluido", ["CH-002"]], ["em-andamento", []]]) {
    casos.push(caso(`Status ${status}: seleção, ordem e cópias`, () => conferirLista(listar, [{ status }], ids)));
    casos.push(caso(`Status ${status} em coleção vazia`, () => assert.deepStrictEqual(listar([], { status }), [])));
  }
  casos.push(caso("Coleção vazia sem filtro", () => assert.deepStrictEqual(listar([]), [])));
  for (const status of ["cancelado", "", null, 0]) for (const vazia of [false, true]) {
    casos.push(caso(`Rejeita status ${JSON.stringify(status)}; coleção ${vazia ? "vazia" : "preenchida"}`, () => conferirRejeicao(listar, [{ status }], vazia)));
  }
  return { casos, limite: "Avalia a função de listagem do LAB-12. Não avalia controle de tela ou filtragem por prioridade." };
}

function casosFiltros(modulo, objeto = false) {
  const listar = exigirFuncao(modulo, objeto ? "uma função (itens, filtros = {})" : "uma função (itens, status, prioridade)");
  const argumentos = (status, prioridade) => objeto ? [{ status, prioridade }] : [status, prioridade];
  // Oráculo explícito: não reaplica a expressão E/OU da função avaliada.
  const matriz = [
    [undefined, [["CH-001", "CH-002", "CH-003"], [], ["CH-002", "CH-003"], ["CH-001"]]],
    ["aberto", [["CH-001", "CH-003"], [], ["CH-003"], ["CH-001"]]],
    ["em-andamento", [[], [], [], []]],
    ["concluido", [["CH-002"], [], ["CH-002"], []]],
  ];
  const prioridades = [undefined, "baixa", "normal", "alta"];
  const casos = [];
  for (const [status, resultados] of matriz) prioridades.forEach((prioridade, i) => {
    casos.push(caso(`Status ${status ?? "omitido"}, prioridade ${prioridade ?? "omitida"}: seleção, ordem e cópias`, () => conferirLista(listar, argumentos(status, prioridade), resultados[i])));
  });
  casos.push(caso("Chamada sem filtros preserva a lista", () => conferirLista(listar, [], ["CH-001", "CH-002", "CH-003"])));
  casos.push(caso("Sem filtros e sem registros", () => assert.deepStrictEqual(listar([]), [])));
  for (const status of [undefined, "aberto", "em-andamento", "concluido"]) for (const prioridade of prioridades) {
    casos.push(caso(`Filtros válidos em coleção vazia: ${status}/${prioridade}`, () => assert.deepStrictEqual(listar([], ...argumentos(status, prioridade)), [])));
  }
  for (const [status, prioridade] of [["cancelado", undefined], [undefined, "urgente"], ["", undefined], [undefined, ""], [null, undefined], [undefined, null]]) {
    for (const vazia of [false, true]) casos.push(caso(`Rejeita status ${String(status)}, prioridade ${String(prioridade)}; coleção ${vazia ? "vazia" : "preenchida"}`, () => conferirRejeicao(listar, argumentos(status, prioridade), vazia)));
  }
  return { casos, limite: `Avalia o contrato de filtros do ${objeto ? "LAB-14, com objeto de filtros" : "LAB-13, com argumentos separados"}. Não mede qualidade da refatoração, controle visual ou ativação de skills.` };
}

const laboratorios = { "LAB-01": casosTitulo, "LAB-01-CRIACAO": casosCriacao, "LAB-12": casosListagem, "LAB-13": modulo => casosFiltros(modulo), "LAB-14": modulo => casosFiltros(modulo, true) };

function main(args) {
  const json = args.includes("--json");
  const posicionais = args.filter(arg => arg !== "--json");
  let relatorio;
  try {
    if (posicionais.length !== 2 || !Object.hasOwn(laboratorios, posicionais[0])) {
      throw new Error("Uso: node verificadores/verificar-exercicio.cjs LAB-01|LAB-01-CRIACAO|LAB-12|LAB-13|LAB-14 caminho-do-arquivo.cjs [--json]");
    }
    const [laboratorio, informado] = posicionais;
    const alvo = fs.realpathSync(path.resolve(informado));
    const sha256 = createHash("sha256").update(fs.readFileSync(alvo)).digest("hex");
    const modulo = require(alvo);
    const { casos, limite } = laboratorios[laboratorio](modulo);
    const resultados = casos.map(({ nome, executar }) => {
      try { executar(); return { nome, aprovado: true }; }
      catch (erro) { return { nome, aprovado: false, erro: erro.message }; }
    });
    const aprovados = resultados.filter(c => c.aprovado).length;
    relatorio = { laboratorio, alvo, sha256, limite, total: resultados.length, aprovados, reprovados: resultados.length - aprovados, resultados };
    process.exitCode = relatorio.reprovados ? 1 : 0;
  } catch (erro) {
    relatorio = { erro: erro.message };
    process.exitCode = 2;
  }
  if (json) console.log(JSON.stringify(relatorio, null, 2));
  else if (relatorio.erro) console.error(relatorio.erro);
  else {
    console.log(`${relatorio.laboratorio}\nAlvo: ${relatorio.alvo}\nSHA-256: ${relatorio.sha256}`);
    for (const resultado of relatorio.resultados) console.log(`${resultado.aprovado ? "OK" : "FALHOU"}: ${resultado.nome}${resultado.erro ? "\n" + resultado.erro : ""}`);
    console.log(`Resultado: ${relatorio.aprovados}/${relatorio.total} casos aprovados.\nLimite: ${relatorio.limite}`);
  }
}

if (require.main === module) main(process.argv.slice(2));
