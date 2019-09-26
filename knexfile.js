// Update with your config settings.

module.exports = {
	client: 'postgresql',
	connection: process.env.DATABASE_URL,
	migrations: {
	tableName: 'knex_migrations'
	},
	ssl: true
};
