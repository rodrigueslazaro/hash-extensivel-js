# Hash Extensível Implementado em JavaScript

Hash extensível implementado para disciplina de Banco de Dados II.

# Execução

Para executar o arquivo, utilize a versão mais recente do NodeJS

exemplo:

node app.js

Todos os testes foram executados dentro do algoritmo, portanto a execução
não recebe parâmetros.

Para alterar o tamanho limite do bucket mude a constante LIMITE na linha 1.

Para alterar o número de inserções/remoções mude a constante IN na linha 2.

# Pesquisa

Para executar pesquisas, chame o método pesquisa(x) da classe diretório
no script, passando a chave inteira desejada x.

exemplo:

seja d uma instância da classe Diretório

d.pesquisa(10); 

- retornar o registro encontrado
- retorna 0 quando não encotra a chave
