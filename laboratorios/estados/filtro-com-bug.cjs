// Defeito semeado: OU em lugar de E.
module.exports = (itens,status,prioridade) => itens.filter(item => item.status === status || item.prioridade === prioridade);
