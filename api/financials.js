module.exports = app => {

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
        var month = date.getMonth();
        var year = date.getFullYear();
      
        return pad(day,2) + '/' + pad(month,2) + '/' + year;
      }
      

    // processa o financial, de acordo com as regras de negócio
    function process(transaction) {

        const financial = {}

        financial.clientID = transaction.clientID

        if (transaction.type === 'debit') {
            financial.status = 'received'
            financial.received_date = formatDate(new Date())
            // desconto de 2,8%
            financial.value = (transaction.value)*(0.972)

        } else if (transaction.type === 'credit'){
            // status como expected
            financial.status = 'expected'
            // a vista
            if (transaction.installments === 1) {
                // adiciona 30 dias na data de recebimento
                financial.received_date = formatDate((new Date()).addDays(30))
                // desconto de 3,2%
                financial.value = (transaction.value)*(0.968)
            } else if (transaction.installments >= 2 && transaction.installments <= 6) {
                console.log('ok1')
                // adiciona (30 * N parcelas) dias na data de recebimento
                financial.received_date = formatDate((new Date()).addDays((30*transaction.installments)))
                console.log((30*transaction.installments))
                // desconto de 3,8%
                financial.value = (transaction.value)*(0.962)
            } else if (transaction.installments >= 7 && transaction.installments <= 12) {
                // adiciona (30 * N parcelas) dias na data de recebimento
                financial.received_date = formatDate((new Date()).addDays(30*transaction.installments))
                // desconto de 4,2%
                financial.value = (transaction.value)*(0.958)
            }
            
        }

        return financial
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
            .where({ id: req.params.id })
            .first()
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }

    // obter financial por client ID e Status
    const getByIdAndStatus = (req, res) => {
        app.db('financials')
            .select('id', 'status', 'received_date', 'value', 'clientID')
            .where({ id: req.params.id } && {status: req.params.status})
            .first()
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }

    return { process, get, getById, getByIdAndStatus }
}