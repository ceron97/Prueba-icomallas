const databaseConfig = require(`${process.cwd()}/libs/databaseConfig`);
const logger = require(`${process.cwd()}/utils/logger`);

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

/**
 * Creación de un usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.crear = async (connectionBD, data) => {
	try {
		const query = databaseConfig.$config.pgp.helpers.insert(data, null, "users") + ` RETURNING "id"`;
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
			logger.stdout(`Fallo creando un usuario: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Creación del usuario fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error creando un usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error creando el usuario.`,
		};
	}
};

/**
 * Creación de la relacion de roles y usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.crearRoles = async (connectionBD, data) => {
	try {
		const cs = new databaseConfig.$config.pgp.helpers.ColumnSet(["id_user", "id_rol"], {
			table: "rol_user",
		});
		const query = databaseConfig.$config.pgp.helpers.insert(data, cs);
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
			logger.stdout(`Fallo creando los roles del usuario: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Creación de los roles del usuario fallida:.",
			};
		}
	} catch (error) {
		logger.stderr(`Error creando los roles del usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error creando los roles del usuario.`,
		};
	}
};

/* -------------------------------------------------------- ||
||															||
||							   EDIT 						||
||															||
|| -------------------------------------------------------- */

/**
 * Edición del usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.editar = async (connectionBD, data) => {
	try {
		const condition = databaseConfig.$config.pgp.as.format(' WHERE "id" = ${id}', data);
		const query = databaseConfig.$config.pgp.helpers.update(data, null, "users") + condition;
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
			logger.stdout(`Fallo editando el usuario: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Edición del usuario fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error editando el usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error editando el usuario.`,
		};
	}
};

/**
 * Edición del estado de el usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.estado = async (connectionBD, data) => {
	try {
		const condition = databaseConfig.$config.pgp.as.format(' WHERE "id" = ${id}', data);
		const query = databaseConfig.$config.pgp.helpers.update(data, null, "users") + condition;
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
 * Eliminar el usuario de los registros
 *
 * @param {*} conexionBd Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} datos Arreglo de datos que contiene la información a eliminar
 */
exports.borrar = async (conexionBd, datos) => {
	try {
		const CONNBD = conexionBd; // Obtener una conexión a la base de datos POSTGRESQL
		const text = `DELETE FROM "users" WHERE "id" = $1;`;
		const result = await CONNBD.result(text, datos, (a) => a.rowCount);

		if (result > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			logger.stdout(`Fallo eliminando el usuario: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Eliminación del usuario fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error eliminando el usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error eliminando el usuario.`,
		};
	}
};

/**
 * Eliminación de los roles en los registros
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.borrarRoles = async (connectionBD, data) => {
	try {
		const text = `DELETE FROM "rol_user" WHERE "id" IN ($1:csv);`;
		const result = await connectionBD
			.result(text, [data], (a) => a.rowCount)
			.then((count) => {
				return count;
			})
			.catch((error) => {
				return error;
			});

		if (result > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			logger.stdout(`Fallo eliminando los roles registrados: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Eliminación de roles registrados fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error eliminando roles registrados: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error eliminando roles registrados.`,
		};
	}
};

/**
 * Eliminación de los roles pertenecientes a un usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} data Arreglo o objeto con los datos usados
 */
exports.borrarRolesUsuario = async (connectionBD, data) => {
	try {
		const text = `DELETE FROM "rol_user" WHERE "id_user" = $1;`;
		const result = await connectionBD
			.result(text, [data], (a) => a.rowCount)
			.then((count) => {
				return count;
			})
			.catch((error) => {
				return error;
			});

		if (result > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			logger.stdout(`Fallo eliminando los roles del usuario: ${result}`);
			return {
				status: 409,
				title: "Fallo de operación",
				message: "Eliminación de roles del usuario fallida.",
			};
		}
	} catch (error) {
		logger.stderr(`Error eliminando roles del usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrió un error eliminando roles del usuario.`,
		};
	}
};

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/**
 * Consulta los usuarios
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 */
exports.getUsuarios = async (connectionBD) => {
	try {
		const result = await connectionBD.any(
			`SELECT "users"."id", "users"."username", "users"."nombre", "users"."estado"
				FROM "users"
				ORDER BY "users"."id" DESC;`
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
				message: "No se encontraron registros de las usuarios.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando las usuarios: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error buscando los registros de las usuarios.`,
		};
	}
};

/**
 * Consulta los roles
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 */
exports.consultarRoles = async (connectionBD) => {
	try {
		const result = await connectionBD.any(
			`SELECT "roles".*
                FROM "roles";`
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
				message: "No se encontraron registros los roles.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los roles: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando los roles.`,
		};
	}
};

/**
 * Consulta el numero del nit, si ya otro usuario lo tiene asignado
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id id del usuario
 */
exports.consultarRolesUsuario = async (connectionBD, id) => {
	try {
		const result = await connectionBD.any(
			`SELECT "rol_user".*
                FROM "rol_user"
				WHERE "rol_user"."id_user" = $1;`,
			[id]
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
				message: "No se encontraron registros los roles asignados al usuario.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los roles asignados al usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando los roles asignados al usuario.`,
		};
	}
};

/**
 * Consulta todos los datos de un usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id_cliente id de el usuario
 */
exports.getUsuarioId = async (connectionBD, id_cliente) => {
	try {
		const result = await connectionBD.any(
			`SELECT "users"."username", "users"."nombre", "users"."estado"
                FROM "users"
				WHERE "users"."id" = $1;`,
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
				message: "No se encontraron registros de los datos del usuario.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los datos de un usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando los datos del usuario.`,
		};
	}
};

/**
 * Consulta si ya existe el nit del usuario registrado asignado a otro usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id id del usuario
 * @param {*} nit Nit del usuario
 */
exports.buscarUsername = async (connectionBD, username) => {
	try {
		const result = await connectionBD.any(
			`SELECT "users"."id"
                FROM "users"
				WHERE "users"."username" = $1;`,
			[username]
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
				message: "No se encontraron registros existentes del nombre de usuario.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando usuario por el nombre de usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando el nombre de usuario.`,
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
exports.getUsuarioRepetido = async (connectionBD, id, username) => {
	try {
		const result = await connectionBD.any(
			`SELECT "users"."id"
                FROM "users"
				WHERE "users"."id" != $1
					AND "users"."username" = $2;`,
			[id, username]
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
				message: "No se encontraron registros repetidos del nombre de usuario.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los nombres de usuario: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error consultando los nombres de usuarios.`,
		};
	}
};
