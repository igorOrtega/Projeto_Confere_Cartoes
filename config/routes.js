module.exports = app => {

    app.route('/clients')
        .post(app.api.clients.save)
        .get(app.api.clients.get)

    app.route('/client/:id')
        .put(app.api.clients.save)
        .get(app.api.clients.getById)

    app.route('/transactions/:id')
        .post(app.api.transactions.save)
}