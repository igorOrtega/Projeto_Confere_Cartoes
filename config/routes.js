module.exports = app => {
    
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '../readme.html');;
      });

    app.route('/clients')
        .post(app.api.clients.save)
        .get(app.api.clients.get)

    app.route('/client/:id')
        .put(app.api.clients.save)
        .get(app.api.clients.getById)
    
    app.route('/transactions')
        .get(app.api.transactions.get)

    app.route('/transactions/:clientId')
        .post(app.api.transactions.save)
        .get(app.api.transactions.getByClientId)
    
    app.route('/transactions/:clientId/:type')
        .get(app.api.transactions.getByClientIdAndType)
    
    app.route('/financials')
        .get(app.api.financials.get)
    
    app.route('/financials/:clientId')
        .get(app.api.financials.getByClientId)

    app.route('/financials/:clientId/:status')
        .get(app.api.financials.getByClientIdAndStatus)
    
    app.route('/balance/:clientId')
        .get(app.api.financials.getBalance)

    // filtro por data
    app.route('/balanceAt/:clientId/:months')
        .get(app.api.financials.getBalanceExpectedDate)
    
}