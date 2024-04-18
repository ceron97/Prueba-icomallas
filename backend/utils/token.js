const jwt = require("jsonwebtoken");
const logger = require(`${process.cwd()}/utils/logger`);

module.exports.generateTokens = async function (payload) {
	try {
		const accessTokenExpires = Date.now() + 4 * (60 * 60 * 1000); // Tiempo para que expire el token
		const accessToken = jwt.sign({ ...payload, exp: accessTokenExpires }, process.env.ACCESS_TOKEN_PRIVATE_KEY);

		return {
			status: 200,
			content: accessToken,
		};
	} catch (error) {
		logger.stderr(`Ocurrio un error al intentar generar el token: ${error}`);
		return {
			status: 403,
			title: "Verificación fallida",
			message: "No se pudo verificar la sesión",
		};
	}
};

module.exports.verify = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			res.status(401).json({
				status: 401,
				title: "Sesión invalida",
				message: "La sesión ha caducado",
			});
		} else {
			jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decode) => {
				if (err) {
					res.status(401).json({
						status: 401,
						title: "Sesión invalida",
						message: "La sesión ha caducado",
					});
				} else {
					(req.user = {
						id_user: decode.id_user,
					}),
						next();
				}
			});
		}
	} catch (error) {
		logger.stderr(`Error al verificar el token del usuario": ${error}`);
		res.status(401).json.json({
			status: 401,
			title: "Verificación fallida",
			message: "No se pudo verificar la sesión",
		});
	}
};
