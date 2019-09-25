module.exports = app => {

    // funções de data
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
      
        return pad(day,2) + '/' + pad(month,2) + '/' + year;
      }
      

    // processa a transação e gera financials, de acordo com as regras de negócio
    function process(transaction) {

        var financials = []
        const financial = {}

        financial.clientID = transaction.clientID

        if (transaction.type === 'debit') {
            financial.status = 'received'
            financial.received_date = formatDate(new Date())
            // desconto de 2,8%
            financial.value = (transaction.value)*(0.972)

            financials.push({...financial})

        } else if (transaction.type === 'credit'){
            // status como expected
            financial.status = 'expected'
            // a vista
            if (transaction.installments === 1) {

                // adiciona 30 dias na data de recebimento
                financial.received_date = formatDate(new Date().addDays(30))

                // desconto de 3,2%
                financial.value = (transaction.value)*(0.968)

                financials.push({...financial})

            // 2 a 6 parcelas
            } else if (transaction.installments >= 2 && transaction.installments <= 6) {
            
                const installment = (transaction.value/transaction.installments)
                
                // gera um financial para cada parcela
                for (var N = 1; N <= transaction.installments; N++) {
                    // adiciona (30 * N) dias na data de recebimento
                    financial.received_date = formatDate(new Date().addDays((30*N)))
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
                    financial.received_date = formatDate(new Date().addDays((30*N)))
                    // desconto de 4,2%
                    financial.value = (installment)*(0.958)

                    financials.push({...financial})
                }

            }
        }
        console.log(financials)
        return financials
    }

    // obter todos os financials
    const get = (req, res) => {
        app.db('financials')
            .select('id', 'status', 'received_date', 'value', 'clientID')
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    // obter financial por clientID
    const getById = (req, res) => {
        app.db('financials')
            .select('id', 'status', 'received_date', 'value', 'clientID')
            .where({ clientID: req.params.id })
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    // obter financial por client ID e Status
    const getByIdAndStatus = (req, res) => {
        app.db('financials')
            .select('id', 'status', 'received_date', 'value', 'clientID')
            .where({ clientID: req.params.id } && {status: req.params.status})
            .then(financials => res.json(financials))
            .catch(err => res.status(500).send(err))
    }

    const getBalance = (req, res) => {

        const balance = {}

        app.db('financials')
            .sum('value')
            .where({clientID: req.params.id, status: "received"})
            .first()
            .then(avaiableBalance => {
                balance.avaiable_Balance = avaiableBalance.sum
                if (balance.avaiable_Balance === null) balance.avaiable_Balance = 0
                })
            .catch(err => res.status(500).send(err))
                
        app.db('financials')
            .sum('value')
            .where({clientID: req.params.id, status: "expected"})
            .first()
            .then(expectedBalance => { 
                balance.expected_Balance = expectedBalance.sum
                if (balance.expected_Balance === null) balance.expected_Balance = 0
                res.json(balance)
            })
            .catch(err => res.status(500).send(err))
    }

    return { process, get, getById, getByIdAndStatus, getBalance }
}