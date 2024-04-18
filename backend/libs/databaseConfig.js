const initOptions = {
	/* initialization options */
};
const pgp = require("pg-promise")(initOptions);
pgp.pg.types.setTypeParser(20, parseFloat); // Convierte el tipo numeric a integer
pgp.pg.types.setTypeParser(1700, parseFloat); // Convierte el tipo bigInt a integer

const databaseConfig = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST, // Valor global con la url del servidor
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	allowExitOnIdle: true,
};

const db = pgp(databaseConfig);

module.exports = db;
