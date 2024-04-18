const databaseConfig = require(`${process.cwd()}/libs/databaseConfig`);
const logger = require(`${process.cwd()}/utils/logger`);

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

/**
 * Creación de un cliente
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.crear = async (connectionBD, data) => {
	try {
		const query = databaseConfig.$config.pgp.helpers.insert(data, null, "clientes") + ` RETURNING "id"`;
		const result = await connectionBD
			.result(query, (r) => r.rowCount)
			.then((count) => {
				return count;
			})
			.catch((error) => {
				return error;
			});

		if (result.rowCount > 0) {
			return {
				status: 200,
				content: result.rows[0].id,
			};
		} else {
			logger.stdout(`Fallo creando un cliente: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Creación del cliente fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error creando un cliente: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error creando el cliente.`,
		};
	}
};

/* -------------------------------------------------------- ||
||															||
||							   EDIT 						||
||															||
|| -------------------------------------------------------- */

/**
 * Edición del cliente
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.editar = async (connectionBD, data) => {
	try {
		const condition = databaseConfig.$config.pgp.as.format(' WHERE "id" = ${id}', data);
		const query = databaseConfig.$config.pgp.helpers.update(data, null, "clientes") + condition;
		const result = await connectionBD
			.result(query, (r) => r.rowCount)
			.then((count) => {
				return count;
			})
			.catch((error) => {
				return error;
			});

		if (result.rowCount > 0) {
			return {
				status: 200,
				content: result.rowCount,
			};
		} else {
			logger.stdout(`Fallo editando el cliente: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Edición del cliente fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error editando el cliente: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error editando el cliente.`,
		};
	}
};

/**
 * Edición del estado de el cliente
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.estado = async (connectionBD, data) => {
	try {
		const condition = databaseConfig.$config.pgp.as.format(' WHERE "id" = ${id}', data);
		const query = databaseConfig.$config.pgp.helpers.update(data, null, "clientes") + condition;
		const result = await connectionBD
			.result(query, (r) => r.rowCount)
			.then((count) => {
				return count;
			})
			.catch((error) => {
				return error;
			});

		if (result.rowCount > 0) {
			return {
				status: 200,
				content: result.rowCount,
			};
		} else {
			logger.stdout(`Fallo cambio de estado: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Cambio de estado fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error cambiando el estado: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error cambiando el estado.`,
		};
	}
};

/* -------------------------------------------------------- ||
||															||
||							DELETE							||
||															||
|| -------------------------------------------------------- */

/**
 * Eliminar el cliente de los registros
 *
 * @param {*} conexionBd Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} datos Arreglo de datos que contiene la información a eliminar
 */
exports.borrar = async (conexionBd, datos) => {
	try {
		const CONNBD = conexionBd; // Obtener una conexión a la base de datos POSTGRESQL
		const text = `DELETE FROM "clientes" WHERE "id" = $1;`;
		const result = await CONNBD.result(text, datos, (a) => a.rowCount);

		if (result > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			logger.stdout(`Fallo eliminando el cliente: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Eliminación del cliente fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error eliminando el cliente: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error eliminando el cliente.`,
		};
	}
};

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/**
 * Consulta los clientes que tenga asignados el asesor
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id_user Id del usuario
 */
exports.getClientesAsesor = async (connectionBD, id_user) => {
	try {
		const result = await connectionBD.any(
			`SELECT "clientes".*, "users"."nombre" AS "usuario_creo"
				FROM "clientes", "users"
				WHERE "id_user_create" = $1
					AND "clientes"."id_user_create" = "users"."id";`,
			[id_user]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			return {
				status: 406,
				title: "Sin resultados",
				message: "No se encontraron registros de las clientes.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando las clientes: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error buscando los registros de las clientes.`,
		};
	}
};

/**
 * Si es administrador permite consultar todos los clientes existentes
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 */
exports.getClientesAdmin = async (connectionBD) => {
	try {
		const result = await connectionBD.any(
			`SELECT "clientes".*, "users"."nombre"
				FROM "clientes", "users"
				WHERE "clientes"."id_user_create" = "users"."id";`
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			return {
				status: 406,
				title: "Sin resultados",
				message: "No se encontraron registros de las clientes.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando las clientes: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error buscando los registros de las clientes.`,
		};
	}
};

/**
 * Consulta el numero del nit, si ya otro usuario lo tiene asignado
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} nit nit del cliente
 */
exports.searchNit = async (connectionBD, nit) => {
	try {
		const result = await connectionBD.any(
			`SELECT "clientes"."id"
                FROM "clientes"
				WHERE "nit" = $1;`,
			[nit]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result[0],
			};
		} else {
			return {
				status: 406,
				title: "Sin resultados",
				message: "No se encontraron registros del nit de el cliente.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando un nit de cliente: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando el nit de el cliente.`,
		};
	}
};

/**
 * Consulta todos los datos de un cliente
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id_cliente id de el cliente
 */
exports.getClienteId = async (connectionBD, id_cliente) => {
	try {
		const result = await connectionBD.any(
			`SELECT "clientes".*
                FROM "clientes"
				WHERE "clientes"."id" = $1;`,
			[id_cliente]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result[0],
			};
		} else {
			return {
				status: 406,
				title: "Sin resultados",
				message: "No se encontraron registros de los datos del cliente.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los datos de un cliente: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando los datos del cliente.`,
		};
	}
};

/**
 * Consulta si ya existe el nit del cliente registrado asignado a otro cliente
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id id del cliente
 * @param {*} nit Nit del cliente
 */
exports.getClienteRepetido = async (connectionBD, id, nit) => {
	try {
		const result = await connectionBD.any(
			`SELECT "clientes"."id"
                FROM "clientes"
				WHERE "clientes"."id" != $2
					AND "clientes"."nit" = $1;`,
			[nit, id]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result[0],
			};
		} else {
			return {
				status: 406,
				title: "Sin resultados",
				message: "No se encontraron registros existentes del nit.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando clientes por el nit: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando el nit del cliente.`,
		};
	}
};
