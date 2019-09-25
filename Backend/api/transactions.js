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
            if (transaction.type === 'credit') existsOrError(transaction.installments,'Número de parcelas não informado')
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
            .catch(err => res.status(500).send(err))
        // atualiza financials do cliente
        const financial = process(transaction)
        // so responde requição depois de processar financial
        app.db('financials')
            .insert(financial)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
            
    }

    // obter todos as transactions
    const get = (req, res) => {
        app.db('transactions')
            .select('id', 'value', 'description', 'type', 'installments', 'card_number', 'card_expiry', 'card_cvv', 'card_holder', 'clientID')
            .then(transactions => res.json(transactions))
            .catch(err => res.status(500).send(err))
    }

    // obter transaction por clientID
    const getByClientId = (req, res) => {
        app.db('transactions')
            .select('id', 'value', 'description', 'type', 'installments', 'card_number', 'card_expiry', 'card_cvv', 'card_holder', 'clientID')
            .where({ clientID: req.params.id })
            .then(transactions =>  res.json(transactions))
            .catch(err => res.status(500).send(err))
    }

    // obter transaction por client ID e type
    const getByIdAndType = (req, res) => {
        app.db('transactions')
            .select('id', 'value', 'description', 'type', 'installments', 'card_number', 'card_expiry', 'card_cvv', 'card_holder', 'clientID')
            .where({ clientID: req.params.id } && {type: req.params.type})
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }

    return  {save, get, getByClientId, getByIdAndType}
}