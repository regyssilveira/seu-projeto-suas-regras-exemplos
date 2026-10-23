"use strict";
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");

const raiz = path.resolve(__dirname, "..");
const cli = path.join(raiz, "verificadores/verificar-exercicio.cjs");
const prefixo = path.join(fs.realpathSync(os.tmpdir()), "regras-leitor-");
const temporario = fs.mkdtempSync(prefixo);
after(() => {
  assert.ok(fs.realpathSync(temporario).startsWith(prefixo), "Limpeza limitada à pasta temporária criada pelo teste.");
  fs.rmSync(temporario, { recursive: true, force: true });
});

function gravar(nome, codigo) {
  const alvo = path.join(temporario, nome);
  fs.writeFileSync(alvo, codigo);
  return alvo;
}
function executar(lab, alvo) {
  const resultado = spawnSync(process.execPath, [cli, lab, alvo, "--json"], { cwd: temporario, encoding: "utf8", timeout: 10000 });
  assert.ifError(resultado.error);
  return { ...resultado, relatorio: JSON.parse(resultado.stdout) };
}

const normalizacao = 'module.exports = titulo => { if(typeof titulo !== "string") throw Error("texto"); const texto=titulo.replace(/^ +| +$/g, ""); if(!texto) throw Error("obrigatório"); return texto; };';
const listagem = `module.exports = (itens, filtros={}) => {
 if(filtros.status!==undefined && !["aberto","em-andamento","concluido"].includes(filtros.status)) throw Error("status");
 return itens.filter(item=>filtros.status===undefined || item.status===filtros.status).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0).map(item=>({...item}));
};`;
const filtro = `module.exports = (itens, status, prioridade) => {
 if(status!==undefined && !["aberto","em-andamento","concluido"].includes(status)) throw Error("status");
 if(prioridade!==undefined && !["baixa","normal","alta"].includes(prioridade)) throw Error("prioridade");
 return itens.filter(item=>(status===undefined || item.status===status) && (prioridade===undefined || item.prioridade===prioridade)).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0).map(item=>({...item}));
};`;

const refatoracao = fs.readFileSync(path.join(raiz, "laboratorios/estados/filtros-duplicados.cjs"), "utf8");
for (const [lab, codigo, total] of [["LAB-01", normalizacao, 9], ["LAB-12", listagem, 18], ["LAB-13", filtro, 46], ["LAB-14", refatoracao, 46]]) {
  test(`${lab}: aprova a cópia indicada fora do repositório e registra arquivo/hash`, () => {
    const alvo = gravar(`${lab} cópia correta.cjs`, codigo);
    const resultado = executar(lab, alvo);
    assert.equal(resultado.status, 0);
    assert.equal(resultado.relatorio.reprovados, 0);
    assert.equal(resultado.relatorio.total, total);
    assert.equal(resultado.relatorio.alvo, fs.realpathSync(alvo));
    assert.equal(resultado.relatorio.sha256, createHash("sha256").update(fs.readFileSync(alvo)).digest("hex"));
  });
}

for (const [lab, estado] of [["LAB-01", "titulo-inicial.cjs"], ["LAB-12", "listagem-inicial.cjs"], ["LAB-13", "filtro-com-bug.cjs"]]) {
  test(`${lab}: reprova a cópia do estado inicial, mesmo com referência correta disponível`, () => {
    const alvo = path.join(temporario, `${lab} cópia inicial.cjs`);
    fs.copyFileSync(path.join(raiz, "laboratorios/estados", estado), alvo);
    const resultado = executar(lab, alvo);
    assert.equal(resultado.status, 1);
    assert.ok(resultado.relatorio.reprovados > 0);
  });
}

test("LAB-01: detecta normalização que destrói espaços internos", () => {
  const alvo = gravar("titulo com espaços internos alterados.cjs", normalizacao.replace("return texto;", 'return texto.replace(/ +/g," ");'));
  const resultado = executar("LAB-01", alvo);
  assert.equal(resultado.status, 1);
  assert.equal(resultado.relatorio.reprovados, 1);
});

test("LAB-01 não declara que avaliou criação e exige interface distinta para essa camada", () => {
  const alvo = gravar("normalização somente.cjs", normalizacao);
  assert.match(executar("LAB-01", alvo).relatorio.limite, /não comprova criação/);
  assert.equal(executar("LAB-01-CRIACAO", alvo).status, 2);
});

const servico = fs.readFileSync(path.join(raiz, "referencia/chamados.cjs"), "utf8");
test("LAB-01-CRIACAO: aprova a cópia local de um serviço correto", () => {
  const resultado = executar("LAB-01-CRIACAO", gravar("serviço correto.cjs", servico));
  assert.equal(resultado.status, 0);
  assert.equal(resultado.relatorio.total, 6);
});
test("LAB-01-CRIACAO: reprova serviço que altera estado antes de rejeitar título", () => {
  const codigo = servico.replace('const texto = normalizarTitulo(titulo);', 'let texto; try { texto=normalizarTitulo(titulo); } catch(erro) { itens[0].titulo="Mutação indevida"; throw erro; }');
  assert.notEqual(codigo, servico);
  const resultado = executar("LAB-01-CRIACAO", gravar("serviço com mutação.cjs", codigo));
  assert.equal(resultado.status, 1);
  assert.ok(resultado.relatorio.resultados.some(c => !c.aprovado && /criação rejeitada alterou/.test(c.erro)));
});

test("LAB-12: detecta validação feita apenas durante percurso da coleção", () => {
  const codigo = listagem.replace(' if(filtros.status', ' if(itens.length && filtros.status');
  const resultado = executar("LAB-12", gravar("inválido em vazio.cjs", codigo));
  assert.equal(resultado.status, 1);
  assert.ok(resultado.relatorio.resultados.some(c => !c.aprovado && /coleção vazia/.test(c.nome)));
});
test("LAB-12: detecta ordenação em lugar da entrada", () => {
  const codigo = listagem.replace(' return itens.filter', ' itens.sort((a,b)=>a.id.localeCompare(b.id)); return itens.filter');
  const resultado = executar("LAB-12", gravar("ordena entrada.cjs", codigo));
  assert.equal(resultado.status, 1);
  assert.ok(resultado.relatorio.resultados.some(c => !c.aprovado && /dados de entrada/.test(c.erro)));
});
test("LAB-12: detecta saída que expõe registros originais", () => {
  const resultado = executar("LAB-12", gravar("saída compartilhada.cjs", listagem.replace('.map(item=>({...item}))', '')));
  assert.equal(resultado.status, 1);
  assert.ok(resultado.relatorio.resultados.some(c => !c.aprovado && /saída expõe/.test(c.erro)));
});
test("LAB-13: reprova E corrigido que ainda não aceita um filtro omitido", () => {
  const codigo = filtro.replace('(status===undefined || item.status===status)', '(item.status===status)');
  assert.equal(executar("LAB-13", gravar("exige status.cjs", codigo)).status, 1);
});
test("LAB-13: detecta inversão da ordem sem confundir com seleção", () => {
  const codigo = filtro.replace('a.id<b.id?-1:a.id>b.id?1:0', 'a.id>b.id?-1:a.id<b.id?1:0');
  assert.equal(executar("LAB-13", gravar("ordem inversa.cjs", codigo)).status, 1);
});
test("LAB-13: detecta saída que expõe registros originais", () => {
  const resultado = executar("LAB-13", gravar("filtro compartilhado.cjs", filtro.replace('.map(item=>({...item}))', '')));
  assert.equal(resultado.status, 1);
});
test("LAB-14: detecta perda da rejeição de prioridade inválida", () => {
  const codigo = refatoracao.replace('if(filtros.prioridade !== undefined && !["baixa","normal","alta"].includes(filtros.prioridade))', 'if(false)');
  assert.notEqual(codigo, refatoracao);
  assert.equal(executar("LAB-14", gravar("refatoração com regressão.cjs", codigo)).status, 1);
});
test("LAB-14: detecta alteração do objeto de filtros recebido", () => {
  const codigo = refatoracao.replace('function(itens, filtros = {}) {', 'function(itens, filtros = {}) { filtros.auditado=true;');
  assert.notEqual(codigo, refatoracao);
  const resultado = executar("LAB-14", gravar("filtros alterados.cjs", codigo));
  assert.equal(resultado.status, 1);
  assert.ok(resultado.relatorio.resultados.some(c => !c.aprovado && /filtros recebidos/.test(c.erro)));
});

test("Argumentos inválidos e arquivo inexistente têm código 2", () => {
  assert.equal(executar("LAB-99", "não existe.cjs").status, 2);
  assert.equal(executar("LAB-12", "não existe.cjs").status, 2);
});
test("Erro de sintaxe e exportação inadequada não produzem aprovação", () => {
  assert.equal(executar("LAB-12", gravar("sintaxe inválida.cjs", 'module.exports = (;')).status, 2);
  assert.equal(executar("LAB-12", gravar("exportação inválida.cjs", 'module.exports = {};')).status, 2);
});
test("CLI também apresenta um resultado legível sem JSON", () => {
  const alvo = gravar("título para saída legível.cjs", normalizacao);
  const resultado = spawnSync(process.execPath, [cli, "LAB-01", alvo], { cwd: temporario, encoding: "utf8" });
  assert.equal(resultado.status, 0);
  assert.match(resultado.stdout, /Resultado: 9\/9/);
  assert.match(resultado.stdout, /Alvo:/);
  assert.match(resultado.stdout, /SHA-256:/);
});
