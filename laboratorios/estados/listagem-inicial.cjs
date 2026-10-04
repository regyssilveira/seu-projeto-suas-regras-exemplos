// Estado anterior ao LAB-12: listagem sem filtros.
module.exports = itens => itens.slice().sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0).map(item=>({...item}));
