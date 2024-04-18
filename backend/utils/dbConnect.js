const logger = require(`${process.cwd()}/utils/logger`);
const databaseConfig = require(`${process.cwd()}/libs/databaseConfig`);

/**
 * Método para obtener una conexión a la base de datos
 * @return {*} conexión a Base de datos pruebas
 */
exports.getConnection = async function () {
	try {
		const CONNBD = await databaseConfig.connect();
		return CONNBD;
	} catch (error) {
		logger.stderr(`Error al intentar obtener la conexión a la BD: ${error}`);
		return false;
	}
};
