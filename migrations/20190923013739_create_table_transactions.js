
exports.up = function(knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary()
        table.float('value').notNull()
        table.string('description')
        table.string('type').notNull()
        table.string('installments')
        table.string('cardNumber').notNull()
        table.string('cardExpiry').notNull()
        table.string('cardCvv').notNull()
        table.string('cardHolder').notNull()
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('transactions')
};
