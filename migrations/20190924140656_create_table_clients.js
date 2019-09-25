
exports.up = function(knex) {
    return knex.schema.createTable('clients', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('cpf').notNull().unique()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('clients')
};
