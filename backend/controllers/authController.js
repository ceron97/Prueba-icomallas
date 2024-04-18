const authModel = require("../models/authModel");
const connection = require(`${process.cwd()}/utils/dbConnect`);
const logger = require(`${process.cwd()}/utils/logger`);
const token = require(`${process.cwd()}/utils/token`);

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

exports.logIn = async (body) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";

		let data_user = await authModel.logIn(connectionBD, body.username, body.password);
		if (data_user.status !== 200) {
			return data_user;
		} else {
			let data_rol = await authModel.rolUser(connectionBD, data_user.content.id);
			if (data_rol.status !== 200) {
				return data_rol;
			} else {
				const generateTokens = await token.generateTokens({
					id_user: data_user.content.id,
				});
				if (generateTokens.status !== 200) {
					return generateTokens;
				}

				const roles = data_rol.content.map((rol) => rol.id);
				return {
					status: 200,
					content: {
						token: generateTokens.content,
						roles,
					},
				};
			}
		}
	} catch (error) {
		logger.stderr(`Error al intentar iniciar sesión: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error al intentar iniciar sesión.`,
		};
	} finally {
		try {
			if (connectionBD) {
				await connectionBD.done();
			}
		} catch (error) {
			logger.stderr(`Error al intentar cerrar conexión a BD: ${error}`);
		}
	}
};
