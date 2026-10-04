const {test}=require("node:test"),assert=require("node:assert/strict");
const dados=require("../fixtures/chamados.json");
const {criarServico}=require("../referencia/chamados.cjs");
const anterior=require("../laboratorios/estados/listagem-inicial.cjs");
const duplicado=require("../laboratorios/estados/filtros-duplicados.cjs");
test("LAB-12 preserva listagem sem filtro",()=>assert.deepEqual(anterior(dados),criarServico(dados).listar()));
test("LAB-14 preserva todos os filtros aceitos",()=>{for(const status of [undefined,"aberto","em-andamento","concluido"])for(const prioridade of [undefined,"baixa","normal","alta"]){const filtros={status,prioridade};assert.deepEqual(duplicado(dados,filtros),criarServico(dados).listar(filtros));}});
test("LAB-14 preserva rejeições",()=>{for(const filtros of [{status:"x"},{prioridade:"x"}]){assert.throws(()=>duplicado([],filtros));assert.throws(()=>criarServico().listar(filtros));}});
