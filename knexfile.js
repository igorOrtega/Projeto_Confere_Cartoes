// Update with your config settings.

module.exports = {
	client: 'postgresql',
	connection: process.env.DATABASE_URL || {
		database: 'projeto_confere',
		user:     'postgres',
		password: '123456'
	},
	migrations: {
	tableName: 'knex_migrations'
	},
	ssl: true
};
