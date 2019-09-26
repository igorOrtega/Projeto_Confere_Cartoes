# Projeto_Confere_Cartoes

Instruções de uso:

Realizei o deploy da API atrevés do heroku, portanto irei informar a URL caso o teste seja feito via heroku e a URL caso o teste seja local.

Em caso de teste local:

    - é necessário instalar o postgres, com a senha do usuário "postgres" sendo "123456", e além disso criar uma banco chamado "projeto_confere".

    - Com o node instalado, rodar o comando "npm i" para instalar as dependencias, e depois disso, rodar "npm start" na pasta do projeto.

A fim de deixar o projeto mais completo, criei uma entidade "clientes", que representa os clientes que utilizam o serviço da confere cartões. Com isso, antes de qualquer teste, é necessário cadastrar ao menos um cliente, através de uma requisição POST nas seguintes URLs:

https://psp-conferecartoes.herokuapp.com/clients
ou
http://127.0.0.1:3000/clients

com o conteúdo JSON no body com o seguinte formato: 

{
	"name": "Igor Ortega",
	"cpf": "38708330840"
}

Todos usuários podem ser listados através de GET nas URLs:

https://psp-conferecartoes.herokuapp.com/clients
ou
http://127.0.0.1:3000/clients

Também é possível retornar o usuário passando seu id de cadastro, sendo que o id é incrementado a cada usuário cadastrado no banco (tal lógica foi aplicada também para os financials e as transactions). Para isso efetuar um GET em umas da URLs:

https://psp-conferecartoes.herokuapp.com/clients/[id do cliente]
ou
http://127.0.0.1:3000/clients/[id do cliente]

Exemplo:https://psp-conferecartoes.herokuapp.com/clients/1

Pode-se, também alterar os dados de um usuário cadastrado, efetuando um PUT em uma das URLs:

https://psp-conferecartoes.herokuapp.com/clients/[id do cliente]
ou
http://127.0.0.1:3000/clients/[id do cliente]

O desafio consiste em um Payment Service Provider logo, é necessário registrar as transações (transactions) dos clientes da confere. Para registrar uma trasaction, basta fazer um POST em uma das seguintes URLs, passando o id do cliente:

https://psp-conferecartoes.herokuapp.com/transactions/[id do cliente]
ou
http://127.0.0.1:3000/transactions/[id do cliente]

Foi implementado um serviço para retornar todas as transactions registradas através de um GET em uma das seguintes URLs:

https://psp-conferecartoes.herokuapp.com/transactions
ou
http://127.0.0.1:3000/transactions

Pode-se filtrar as transactions por id do cliente e por tipo (debit ou credit)

Por id do client, GET em:

https://psp-conferecartoes.herokuapp.com/transactions/[id do cliente]
ou
http://127.0.0.1:3000/transactions/[id do cliente]

Por id do client e tipo, GET em:

https://psp-conferecartoes.herokuapp.com/transactions/[id do cliente]/[tipo]
ou
http://127.0.0.1:3000/transactions/[id do cliente]/[tipo]

Para cada transação registrada, o PSP desenvolvido registra um ou mais financials (recebíveis) para o cliente da confere, de acordo com as regras de negócio informadas no enunciado. Para obter todos os financials, indenpendentemente do cliente (ou seja, lista todos os recebíveis de todos os clientes da confere), basta fazer um GET em:

https://psp-conferecartoes.herokuapp.com/financials
ou
http://127.0.0.1:3000/financials

Pode-se filtrar as financials por id do cliente e por status (received ou expected)

Por id do client, GET em:

https://psp-conferecartoes.herokuapp.com/financials/[id do cliente]
ou
http://127.0.0.1:3000/financials/[id do cliente]

Por id do client e status, GET em:

https://psp-conferecartoes.herokuapp.com/financials/[id do cliente]/[status]
ou
http://127.0.0.1:3000/financials/[id do cliente]/[status]

Por fim, é possível obter o saldo disponível do cliente e o saldo a receber, através de um GET, informando o id do cliente, em:

https://psp-conferecartoes.herokuapp.com/balance/[id do cliente]
ou
http://127.0.0.1:3000/balance/[id do cliente]

Também é possível filtrar os saldos que o cliente pode receber até N meses a partir da data atual, ou seja, retorna saldo disponível e saldo expected que estará disponível em até N meses. Para isso realizar um GET em:

https://psp-conferecartoes.herokuapp.com/balance/[id do cliente]/[N meses]
ou
http://127.0.0.1:3000/balance/[id do cliente]/[N meses]
