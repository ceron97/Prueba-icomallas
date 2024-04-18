const jwt = require("jsonwebtoken");
const logger = require(`${process.cwd()}/utils/logger`);

module.exports.generateTokens = async function (payload) {
	try {
		const accessTokenExpires = Date.now() + 4 * (60 * 60 * 1000);

		const accessToken = jwt.sign({ ...payload, exp: accessTokenExpires }, process.env.ACCESS_TOKEN_PRIVATE_KEY);

		return {
			status: 200,
			content: accessToken,
		};
	} catch (error) {
		logger.stderr(`Ocurrio un error al intentar generar el token TKN-001GT-EF: ${error}`);
		return {
			status: 403,
			title: "Verificación fallida",
			message: "No se pudo verificar la sesión: TKN-001GT-EF",
		};
	}
};

module.exports.verify = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			res.json({
				status: 401,
				title: "Sesión invalida",
				message: "La sesión ha caducado",
			});
		} else {
			jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decode) => {
				if (err) {
					res.json({
						status: 401,
						title: "Sesión invalida",
						message: "La sesión ha caducado",
					});
				} else {
					(req.user = {
						usuario_id: decode.usuario_id,
						tipo_id: decode.tipo_id,
						num_id: decode.num_id,
						nombre: decode.nombre,
					}),
						next();
				}
			});
		}
	} catch (error) {
		logger.stderr(`Error al verificar el token del usuario TKN-003V-EF": ${error}`);
		res.json({
			status: 401,
			title: "Verificación fallida",
			message: "No se pudo verificar la sesión: TKN-003V-EF",
		});
	}
};
