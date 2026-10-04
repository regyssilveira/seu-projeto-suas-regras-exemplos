// Estado anterior ao LAB-14: comportamento correto com validação duplicada.
module.exports = function(itens, filtros = {}) {
 if(filtros.status !== undefined && !["aberto","em-andamento","concluido"].includes(filtros.status)) throw new Error("Status inválido");
 if(filtros.prioridade !== undefined && !["baixa","normal","alta"].includes(filtros.prioridade)) throw new Error("Prioridade inválida");
 return itens.filter(item=>(filtros.status===undefined||item.status===filtros.status)&&(filtros.prioridade===undefined||item.prioridade===filtros.prioridade)).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0).map(item=>({...item}));
};
