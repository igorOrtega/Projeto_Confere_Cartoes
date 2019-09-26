// importa modulo do express e já inicia app
const app = require('express')()
// conexão com banco de dados
const db = require('./config/db.js')

app.db = db

// consign (injeta modulos na api)
const consign = require('consign')

consign()
    .then('./config/middlewares.js')
    .then('./api/validations.js')
    .then('./api/financials.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

// inicializa servidor (ouvindo porta)
app.listen(3000, () => {
    console.log('Backend executando')
})