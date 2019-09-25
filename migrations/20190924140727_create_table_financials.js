
exports.up = function(knex) {
    return knex.schema.createTable('financials', table => {
        table.increments('id').primary()
        table.string('status').notNull()
        table.string('received_date')
        table.float('value').notNull()
        table.integer('clientID').references('id')
            .inTable('clients').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('financials')
};