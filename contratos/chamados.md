# Contrato do sistema de chamados

Contrato didático v1. Cada linguagem escolhe sua sintaxe.
- Campos: id textual imutável, titulo textual obrigatório, descricao textual opcional, status, prioridade.
- Status: aberto, em-andamento, concluido. Rótulos visuais podem ter acentos.
- Prioridade: baixa, normal, alta.
- Criar: rejeitar título vazio ou composto apenas por espaços U+0020; aparar esses espaços nas extremidades. Outros espaços e tabulações ficam fora do LAB-01.
- Identificador gerado pelo serviço, não informado pelo usuário.
- Atualizar: somente status e prioridade de id existente; validar tudo antes de qualquer mutação.
- Listar: filtro omitido não restringe. Valor desconhecido é erro mesmo em coleção vazia.
- Dois filtros usam E. Combinação válida sem correspondência retorna coleção vazia.
- Ordenar por identificador crescente e retornar cópias dos registros.
- Dados em memória; reiniciar descarta mudanças. Rede, autenticação, concorrência e banco de dados fora do escopo.

## Dados e resultados
CH-001: Impressora sem papel; aberto; alta.
CH-002: Acesso restabelecido; concluido; normal.
CH-003: Atualizar cadastro; aberto; normal.

aberto retorna CH-001 e CH-003; aberto + alta retorna CH-001; concluido + alta retorna coleção vazia. Status desconhecido é erro. Criar com três espaços e atualizar CH-999 são erros que não modificam a coleção.
