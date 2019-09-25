module.exports = app => {

    const { existsOrError, notExistsOrError, isIntegerOrError, isNumberOrError} = app.api.validations
    const { process } = app.api.financials

    const save = async (req, res) => {
        
        const transaction = {...req.body}
        
        transaction.clientID = req.params.id

        // consulta se usuario passado está cadastrado
        const clientFromDB = await app.db('clients')
            .where({ id: transaction.clientID }).first()

        try {
            existsOrError(clientFromDB, 'Cliente não cadastrado')
            isNumberOrError(transaction.value,'O valor da transação não é um número')
            existsOrError(transaction.type,'Tipo de transação não informado')
            existsOrError(transaction.card.number,'Número do cartão não informado')
            existsOrError(transaction.card.expiry,'Validade do cartão não informada')
            existsOrError(transaction.card.cvv,'Cvv do cartão não informado')
            existsOrError(transaction.card.holder,'Proprietário do cartão não informado')

        } catch(msg) {
            return res.status(400).send(msg)
        }

        // guarda apenas ultimos 4 digitos do número do cartão
        transaction.card.number = "**** **** **** " + transaction.card.number.slice(-4);

        // converte informações do cartão para padrão do banco
        transaction.card_number = transaction.card.number
        transaction.card_expiry = transaction.card.expiry
        transaction.card_cvv = transaction.card.cvv
        transaction.card_holder = transaction.card.holder

        delete transaction.card

        // insere transação no banco
        app.db('transactions')
            .insert(transaction)
        // atualiza financials do cliente
        const financial = process(transaction)
        // so responde requição depois de processar financial
        app.db('financials')
            .insert(financial)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
            
    }

    return  {save}
}