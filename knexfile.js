// Update with your config settings.

module.exports = {
	client: 'postgresql',
	connection: {
	database: 'd4trc2h3t3s3dn',
	user:     'jzldvetppvdrgj',
	password: '6cd9a9d84b48e24fd15e8c2c09fe89bcbf105a6cb991b9dfddb1d32672bb65a7'
	},
	pool: {
	min: 2,
	max: 10
	},
	migrations: {
	tableName: 'knex_migrations'
	}
};
