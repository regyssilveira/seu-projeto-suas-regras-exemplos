// Defeito semeado: aceita somente espaços.
module.exports = function(titulo) {
 if (typeof titulo !== "string" || titulo.length === 0) throw new Error("Título obrigatório");
 return titulo;
};
