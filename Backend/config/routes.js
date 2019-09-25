module.exports = app => {

    app.route('/clients')
        .post(app.api.clients.save)
        .get(app.api.clients.get)

    app.route('/client/:id')
        .put(app.api.clients.save)
        .get(app.api.clients.getById)
    
    app.route('/transactions')
        .get(app.api.transactions.get)

    app.route('/transactions/:id')
        .post(app.api.transactions.save)
        .get(app.api.transactions.getByClientId)
    
    app.route('/transactions/:id/:type')
        .get(app.api.transactions.getByIdAndType)
    
    app.route('/financials')
        .get(app.api.financials.get)
    
    app.route('/financials/:id')
        .get(app.api.financials.getById)

    app.route('/financials/:id/:status')
        .get(app.api.financials.getByIdAndStatus)
    
    app.route('/balance/:id')
        .get(app.api.financials.getBalance)
    
}