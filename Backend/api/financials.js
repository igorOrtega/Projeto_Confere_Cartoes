module.exports = app => {

    // adcionar dias para uma data
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    // processa a transação e gera financials, de acordo com as regras de negócio
    function process(transaction) {

        var financials = []
        const financial = {}

        financial.client_id = transaction.client_id
        financial.transaction_id = transaction.id

        if (transaction.type === 'debit') {
            financial.status = 'received'
            financial.received_date = new Date()
            // desconto de 2,8%
            financial.value = (transaction.value)*(0.972)

            financials.push({...financial})

        } else if (transaction.type === 'credit'){
            // status como expected
            financial.status = 'expected'
            // a vista
            if (transaction.installments === 1) {

                // adiciona 30 dias na data de recebimento
                financial.received_date = new Date().addDays(30)

                // desconto de 3,2%
                financial.value = (transaction.value)*(0.968)

                financials.push({...financial})

            // 2 a 6 parcelas
            } else if (transaction.installments >= 2 && transaction.installments <= 6) {
            
                const installment = (transaction.value/transaction.installments)
                
                // gera um financial para cada parcela
                for (var N = 1; N <= transaction.installments; N++) {
                    // adiciona (30 * N) dias na data de recebimento
                    financial.received_date = new Date().addDays((30*N))
                    // desconto de 3,8%
                    financial.value = (installment)*(0.962)

                    financials.push({...financial})
                }
                
            // 7 a 12 parcelas
            } else if (transaction.installments >= 7 && transaction.installments <= 12) {
                
                const installment = (transaction.value/transaction.installments)
                
                // gera um financial para cada parcela
                for (var N = 1; N <= transaction.installments; N++) {
                    // adiciona (30 * N) dias na data de recebimento
                    financial.received_date = new Date().addDays((30*N))
                    // desconto de 4,2%
                    financial.value = (installment)*(0.958)

                    financials.push({...financial})
                }

            }
        }
        return financials
    }

    // obter todos os financials
    const get = (req, res) => {
        app.db('financials')
            .select()
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    // obter financial por clientId
    const getByClientId = (req, res) => {
        app.db('financials')
            .select()
            .where({ client_id: req.params.clientId })
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    // obter financial por client ID e Status
    const getByClientIdAndStatus = (req, res) => {
        app.db('financials')
            .select()
            .where({ client_id: req.params.clientId, status: req.params.status})
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    const getBalance = async (req, res) => {

        const balance = {}

       await app.db('financials')
            .sum('value')
            .where({client_id: req.params.clientId, status: "received"})
            .first()
            .then(avaiableBalance => {
                balance.avaiable_Balance = avaiableBalance.sum
                if (balance.avaiable_Balance === null) balance.avaiable_Balance = 0
                })
            .catch(err => res.status(500).send(err))
                
        app.db('financials')
            .sum('value')
            .where({client_id: req.params.clientId, status: "expected"})
            .first()
            .then(expectedBalance => { 
                balance.expected_Balance = expectedBalance.sum
                if (balance.expected_Balance === null) balance.expected_Balance = 0
                res.json(balance)
            })
            .catch(err => res.status(500).send(err))
    }

    // retorna os financials que serão recebidos em até N meses (30 * N)
    const getBalanceExpectedDate = async (req, res) => {

        const balance = {}
    
        const reqDate = new Date().addDays(30*req.params.months)
        
        await app.db('financials')
            .sum('value')
            .where('client_id', '=', req.params.clientId)
            .where('status', '=', 'received')
            .where('received_date', '<', reqDate)
            .first()
            .then(avaiableBalance => {
                balance.avaiable_Balance = avaiableBalance.sum
                if (balance.avaiable_Balance === null) balance.avaiable_Balance = 0
                })
            .catch(err => res.status(500).send(err))
                
        app.db('financials')
            .sum('value')
            .where('client_id', '=', req.params.clientId)
            .where('status', '=', 'expected')
            .where('received_date', '<', reqDate)
            .first()
            .then(expectedBalance => { 
                balance.expected_Balance = expectedBalance.sum
                if (balance.expected_Balance === null) balance.expected_Balance = 0
                res.json(balance)
            })
            .catch(err => res.status(500).send(err))
            
    }

    return { process, get, getByClientId, getByClientIdAndStatus, getBalance, getBalanceExpectedDate }
}