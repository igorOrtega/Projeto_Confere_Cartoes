module.exports = app => {
    app.route('/transactions')
        .post(app.api.transactions.save)
}