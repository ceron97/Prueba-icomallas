const clientesModel = require("../models/clientesModel");
const authModel = require("../models/authModel");
const connection = require(`${process.cwd()}/utils/dbConnect`);
const logger = require(`${process.cwd()}/utils/logger`);

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

exports.crear = async (body, user) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";
		await connectionBD.query("BEGIN"); // Iniciar transacción en BD

		let search_cliente = await clientesModel.searchNit(connectionBD, body.nit);
		if (search_cliente.status !== 406) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			if (search_cliente.status === 200) {
				return {
					status: 409,
					title: "Elemento encontrado",
					message: "Ya se encuentra esta cliente registrado.",
				};
			}

			return search_cliente;
		} else {
			body["id_user_create"] = user.id_user;

			let create = await clientesModel.crear(connectionBD, body);
			if (create.status !== 200) {
				await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
				return create;
			} else {
				await connectionBD.query("COMMIT"); // Confirma los cambios
				return {
					status: 200,
					title: "Solicitud exitosa",
					message: "Se ha creado el cliente correctamente.",
				};
			}
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error creando un cliente: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la creación del cliente.`,
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

/* -------------------------------------------------------- ||
||															||
||							   EDIT 						||
||															||
|| -------------------------------------------------------- */

exports.editar = async (id, body) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";
		await connectionBD.query("BEGIN"); // Iniciar transacción en BD

		let search_cliente = await clientesModel.getClienteRepetido(connectionBD, id, body.nit);
		if (search_cliente.status !== 406) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			if (search_cliente.status === 200) {
				return {
					status: 409,
					title: "Elemento encontrado",
					message: "Ya se encuentra esta cliente registrado.",
				};
			}

			return search_cliente;
		} else {
			body["id"] = id;

			let edit = await clientesModel.editar(connectionBD, body);
			if (edit.status !== 200) {
				await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
				return edit;
			} else {
				await connectionBD.query("COMMIT"); // Confirma los cambios
				return {
					status: 200,
					title: "Solicitud exitosa",
					message: "Se ha editado el cliente correctamente.",
				};
			}
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error editando el cliente: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la edición del cliente.`,
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

exports.estado = async (id, body) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";
		await connectionBD.query("BEGIN"); // Iniciar transacción en BD

		const form = {
			id,
			estado: body.estado,
		};

		let edit = await clientesModel.estado(connectionBD, form);
		if (edit.status !== 200) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			return edit;
		} else {
			await connectionBD.query("COMMIT"); // Confirma los cambios
			return {
				status: 200,
				title: "Solicitud exitosa",
				message: "Se ha modificado el estado correctamente.",
			};
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error cambiando el estado de el cliente: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la modificación del estado de el cliente.`,
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

/* -------------------------------------------------------- ||
||															||
||							   DELETE 						||
||															||
|| -------------------------------------------------------- */

exports.borrar = async (id) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";
		await connectionBD.query("BEGIN"); // Iniciar transacción en BD

		let edit = await clientesModel.borrar(connectionBD, id);
		if (edit.status !== 200) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			return edit;
		} else {
			await connectionBD.query("COMMIT"); // Confirma los cambios
			return {
				status: 200,
				title: "Solicitud exitosa",
				message: "Se ha eliminado el cliente correctamente.",
			};
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error eliminado el cliente: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la eliminación del cliente.`,
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

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

exports.consultar = async (user) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";

		let data_rol = await authModel.rolUser(connectionBD, user.id_user);
		if (data_rol.status !== 200) {
			return data_rol;
		} else {
			const roles = data_rol.content.map((rol) => rol.id);
			let data_cliente;

			if (roles.includes(1)) {
				data_cliente = await clientesModel.getClientesAdmin(connectionBD);
			} else {
				data_cliente = await clientesModel.getClientesAsesor(connectionBD, user.id_user);
			}

			return data_cliente;
		}
	} catch (error) {
		logger.stderr(`Error en la consulta de clientes: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error al consultar los clientes.`,
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

exports.consultarCliente = async (id) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";

		let data_cliente = await clientesModel.getClienteId(connectionBD, id);
		return data_cliente;
	} catch (error) {
		logger.stderr(`Error al consultar los datos del cliente: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error al consultar el cliente.`,
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
