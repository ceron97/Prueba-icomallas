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
						token,
						roles,
					},
				};
			}

			return {
				status: 406,
			};
			// 	if (content.estado) {
			// 		if (content.cargo_estado) {
			// 			if (content.area_estado) {
			// 				const payload = {
			// 					usuario_id: content.usuario_id,
			// 					tipo_id: content.tipo_id,
			// 					num_id: content.num_id,
			// 					nombre: content.nombre,
			// 				};

			// 				const generateTokens = await token.generateTokens(payload);
			// 				if (generateTokens.status !== 200) {
			// 					return generateTokens;
			// 				}
			// 				const contentGenerateTokens = generateTokens.content;

			// 				return {
			// 					status: 200,
			// 					content: {
			// 						...payload,
			// 						accessToken: contentGenerateTokens.accessToken,
			// 						refreshToken: contentGenerateTokens.refreshToken,
			// 						accessTokenExpires: contentGenerateTokens.accessTokenExpires,
			// 					},
			// 				};
			// 			} else {
			// 				return {
			// 					status: 403,
			// 					title: "Autenticación fallida",
			// 					message: "El area no tiene acceso al sistema: AUTC-001LI-EC.",
			// 				};
			// 			}
			// 		} else {
			// 			return {
			// 				status: 403,
			// 				title: "Autenticación fallida",
			// 				message: "El cargo no tiene acceso al sistema: AUTC-001LI-EC.",
			// 			};
			// 		}
			// 	} else {
			// 		return {
			// 			status: 403,
			// 			title: "Autenticación fallida",
			// 			message: "El usuario no tiene acceso al sistema: AUTC-001LI-EC.",
			// 		};
			// 	}
		}
	} catch (error) {
		logger.stderr(`Error al intentar iniciar sesión AUTC-001LI-EC: ${error}`);
		return {
			status: 500,
			message: `Ocurrio un error al intentar iniciar sesión: AUTC-001LI-EC.`,
		};
	} finally {
		try {
			if (connectionBD) {
				await connectionBD.done();
			}
		} catch (error) {
			logger.stderr(`Error al intentar cerrar conexión a BD AUTC-001LI-CBD: ${error}`);
		}
	}
};

exports.refreshToken = async (body) => {
	try {
		const { refreshToken } = body;

		const verifyRefreshToken = await token.verifyRefreshToken(refreshToken);
		if (verifyRefreshToken.status !== 200) {
			return verifyRefreshToken;
		} else {
			const contentVerifyRefreshToken = verifyRefreshToken.content;
			const payload = {
				usuario_id: contentVerifyRefreshToken.usuario_id,
				tipo_id: contentVerifyRefreshToken.tipo_id,
				num_id: contentVerifyRefreshToken.num_id,
				nombre: contentVerifyRefreshToken.nombre,
			};

			const generateTokens = await token.generateTokens(payload);
			if (generateTokens.status !== 200) {
				return generateTokens;
			}
			const contentGenerateTokens = generateTokens.content;

			return {
				status: 200,
				content: {
					...payload,
					accessToken: contentGenerateTokens.accessToken,
					refreshToken: contentGenerateTokens.refreshToken,
					accessTokenExpires: contentGenerateTokens.accessTokenExpires,
				},
			};
		}
	} catch (error) {
		logger.stderr(`Error al refrescar el token AUTC-002LI-EC: ${error}`);
		return {
			status: 500,
			message: `No se pudo verificar la sesión: AUTC-002LI-EC.`,
		};
	}
};
