const logger = require(`${process.cwd()}/utils/logger`);

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/**
 * Consulta los datos de el usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} username Nombre de usuario
 * @param {*} password Contraseña
 */
exports.logIn = async (connectionBD, username, password) => {
	try {
		const result = await connectionBD.any(
			`SELECT USU."id", USU."estado"
                FROM "users" USU
                WHERE USU."username" = $1
					AND USU."password" = $2;`,
			[username, password]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result[0],
			};
		} else {
			return {
				status: 401,
				title: "Autenticación fallida",
				message: "Usuario u/o contraseña erroneos.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando el login: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error durante la autenticación de datos.`,
		};
	}
};

/**
 * Consulta los roles del usuario
 *
 * @param {*} connectionBD Objeto de conexión a la base de datos que se pasa desde el controlador
 * @param {*} id id del usuario
 */
exports.rolUser = async (connectionBD, id) => {
	try {
		const result = await connectionBD.any(
			`SELECT ROL.*
                FROM "rol_user" RUSU, "roles" ROL
                WHERE RUSU."id_user" = $1
					AND RUSU."id_rol" = ROL."id";`,
			[id]
		);

		if (result.length > 0) {
			return {
				status: 200,
				content: result,
			};
		} else {
			return {
				status: 401,
				title: "Sin resultados",
				message: "El usuario no tiene roles asignados.",
			};
		}
	} catch (error) {
		logger.stderr(`Error consultando los roles: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error durante la verificación de roles.`,
		};
	}
};
