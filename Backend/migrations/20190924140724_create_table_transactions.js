
exports.up = function(knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary()
        table.float('value').notNull()
        table.string('description')
        table.string('type').notNull()
        table.string('installments')
        table.string('card_number').notNull()
        table.string('card_expiry').notNull()
        table.string('card_cvv').notNull()
        table.string('card_holder').notNull()
        table.integer('clientID').references('id')
            .inTable('clients').notNull()
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('transactions')
};
