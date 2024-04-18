const { Console } = require("console");
const { existsSync, mkdirSync, createWriteStream } = require("fs");
const logPath = "logs/";

module.exports.stdout = async function (msg) {
	try {
		if (!existsSync(logPath)) {
			mkdirSync(logPath, { recursive: true });
		}

		const date = new Date();
		const ddActual = String(date.getDate()).padStart(2, "0"), // Dia actual
			mmActual = String(date.getMonth() + 1).padStart(2, "0"), // Mes actual
			yyyyActual = String(date.getFullYear()).padStart(2, "0"), // Año actual
			hhActual = String(date.getHours()).padStart(2, "0"), // Hora actual
			minutesActual = String(date.getMinutes()).padStart(2, "0"), // Minuto actual
			ssActual = String(date.getSeconds()).padStart(2, "0"), // Segundos actuales
			mlSsActual = String(date.getMilliseconds()).padStart(3, "0"); // Segundos actuales

		const timeFile = `${ddActual}_${mmActual}_${yyyyActual}`;
		const timeRegister = `${ddActual}-${mmActual}-${yyyyActual} ${hhActual}-${minutesActual}:${ssActual}:${mlSsActual}`;
		const file = `${logPath}logs_${timeFile}.txt`;

		const logger = new Console({
			stdout: createWriteStream(file, { flags: "a" }),
		});

		logger.error(`INFO: ${timeRegister}
			=> ${msg}`);
	} catch (error) {
		const date = new Date();
		console.log(`${date.getDate()}-${
			date.getMonth() + 1
		}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
						=> Error en el registro de los logs: ${error}`);
	}
};

module.exports.stderr = async function (msg) {
	try {
		if (!existsSync(logPath)) {
			mkdirSync(logPath, { recursive: true });
		}

		const date = new Date();
		const ddActual = String(date.getDate()).padStart(2, "0"), // Dia actual
			mmActual = String(date.getMonth() + 1).padStart(2, "0"), // Mes actual
			yyyyActual = String(date.getFullYear()).padStart(2, "0"), // Año actual
			hhActual = String(date.getHours()).padStart(2, "0"), // Hora actual
			minutesActual = String(date.getMinutes()).padStart(2, "0"), // Minuto actual
			ssActual = String(date.getSeconds()).padStart(2, "0"), // Segundos actuales
			mlSsActual = String(date.getMilliseconds()).padStart(3, "0"); // Segundos actuales

		const timeFile = `${ddActual}_${mmActual}_${yyyyActual}`;
		const timeRegister = `${ddActual}-${mmActual}-${yyyyActual} ${hhActual}-${minutesActual}:${ssActual}:${mlSsActual}`;
		const file = `${logPath}logs_${timeFile}.txt`;
		const logger = new Console({
			stdout: createWriteStream(file, { flags: "a" }),
		});

		logger.error(`ERROR: ${timeRegister}
			=> ${msg}`);
	} catch (error) {
		const date = new Date();
		console.log(`${date.getDate()}-${
			date.getMonth() + 1
		}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
						=> Error en el registro de los logs: ${error}`);
	}
};
