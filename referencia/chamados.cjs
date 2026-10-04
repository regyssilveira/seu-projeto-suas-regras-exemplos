"use strict";
const STATUS = ["aberto", "em-andamento", "concluido"];
const PRIORIDADES = ["baixa", "normal", "alta"];
function validarOpcao(valor, opcoes, campo) {
  if (!opcoes.includes(valor)) throw new Error(campo + " inválido");
}
function normalizarTitulo(titulo) {
  if (typeof titulo !== "string") throw new Error("Título deve ser texto");
  const normalizado = titulo.replace(/^ +| +$/g, "");
  if (!normalizado.length) throw new Error("Título obrigatório");
  return normalizado;
}
function criarServico(iniciais = []) {
  const itens = iniciais.map(item => ({ ...item }));
  let sequencia = itens.reduce((max, item) => Math.max(max, Number(item.id.slice(3))), 0);
  return {
    listar(filtros = {}) {
      if (filtros.status !== undefined) validarOpcao(filtros.status, STATUS, "Status");
      if (filtros.prioridade !== undefined) validarOpcao(filtros.prioridade, PRIORIDADES, "Prioridade");
      return itens.filter(item =>
        (filtros.status === undefined || item.status === filtros.status) &&
        (filtros.prioridade === undefined || item.prioridade === filtros.prioridade)
      ).sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).map(item => ({ ...item }));
    },
    criar(titulo, descricao = "", status = "aberto", prioridade = "normal") {
      const texto = normalizarTitulo(titulo);
      if (typeof descricao !== "string") throw new Error("Descrição deve ser texto");
      validarOpcao(status, STATUS, "Status"); validarOpcao(prioridade, PRIORIDADES, "Prioridade");
      const novo = {id:"CH-" + String(++sequencia).padStart(3,"0"), titulo:texto, descricao, status, prioridade};
      itens.push(novo); return { ...novo };
    },
    atualizar(id, status, prioridade) {
      const item = itens.find(atual => atual.id === id);
      if (!item) throw new Error("Chamado não encontrado");
      validarOpcao(status, STATUS, "Status"); validarOpcao(prioridade, PRIORIDADES, "Prioridade");
      item.status = status; item.prioridade = prioridade; return { ...item };
    }
  };
}
if (typeof module !== "undefined") module.exports = {criarServico,normalizarTitulo};
if (typeof window !== "undefined") window.Chamados = {criarServico,normalizarTitulo};
