const usuariosModel = require("../models/usuariosModel");
const authModel = require("../models/authModel");
const connection = require(`${process.cwd()}/utils/dbConnect`);
const logger = require(`${process.cwd()}/utils/logger`);

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

exports.crear = async (body) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";
		await connectionBD.query("BEGIN"); // Iniciar transacción en BD

		const selectedItems = body.selectedItems;

		let search_usuario = await usuariosModel.buscarUsername(connectionBD, body.username);
		if (search_usuario.status !== 406) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			if (search_usuario.status === 200) {
				return {
					status: 409,
					title: "Elemento encontrado",
					message: "Ya se encuentra esta usuario registrado.",
				};
			}

			return search_usuario;
		} else {
			delete body["selectedItems"];

			let create = await usuariosModel.crear(connectionBD, body);
			if (create.status !== 200) {
				await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
				return create;
			} else {
				const roles_usuarios = selectedItems.map((role) => ({
					id_rol: role,
					id_user: create.content,
				}));
				let create_roles = await usuariosModel.crearRoles(connectionBD, roles_usuarios);
				if (create_roles.status !== 200) {
					await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
					return create_roles;
				} else {
					await connectionBD.query("COMMIT"); // Confirma los cambios
					return {
						status: 200,
						title: "Solicitud exitosa",
						message: "Se ha creado el usuario correctamente.",
					};
				}
			}
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error creando un usuario: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la creación del usuario.`,
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
		const selectedItems = body["selectedItems"];

		let search_usuario = await usuariosModel.getUsuarioRepetido(connectionBD, id, body.username);
		if (search_usuario.status !== 406) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			if (search_usuario.status === 200) {
				return {
					status: 409,
					title: "Elemento encontrado",
					message: "Ya se encuentra esta usuario registrado.",
				};
			}

			return search_usuario;
		} else {
			delete body["selectedItems"];
			if (body["password"] === "") delete body["password"];

			let rolesUsuario = await usuariosModel.consultarRolesUsuario(connectionBD, id);
			if (rolesUsuario.status !== 200) {
				await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
				return rolesUsuario;
			} else {
				body["id"] = id;

				let edit = await usuariosModel.editar(connectionBD, body);
				if (edit.status !== 200) {
					await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
					return edit;
				} else {
					rolesUsuario = rolesUsuario.status === 200 ? rolesUsuario.content : [];
					const ids_front = selectedItems.map((item) => item);
					const ids_bd = rolesUsuario.map((item) => item.id_rol);

					const create_ids = selectedItems
						.filter((item) => !ids_bd.includes(item))
						.map((item) => ({
							id_user: id,
							id_rol: item,
						}));

					const delete_ids = rolesUsuario
						.filter((item) => !ids_front.includes(item.id_rol))
						.map((item) => item.id);

					if (create_ids.length > 0) {
						let createRoles = await usuariosModel.crearRoles(connectionBD, create_ids);
						if (createRoles.status !== 200) {
							await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
							return createRoles;
						}
					}

					if (delete_ids.length > 0) {
						let deleteRoles = await usuariosModel.borrarRoles(connectionBD, delete_ids);
						if (deleteRoles.status !== 200) {
							await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
							return deleteRoles;
						}
					}

					await connectionBD.query("COMMIT"); // Confirma los cambios
					return {
						status: 200,
						title: "Solicitud exitosa",
						message: "Se ha editado el usuario correctamente.",
					};
				}
			}
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error editando el usuario: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la edición del usuario.`,
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

		let edit = await usuariosModel.estado(connectionBD, form);
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
		logger.stderr(`Error cambiando el estado de el usuario: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la modificación del estado de el usuario.`,
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

		let borrarRolesUsuario = await usuariosModel.borrarRolesUsuario(connectionBD, id);
		if (borrarRolesUsuario.status !== 200) {
			await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
			return borrarRolesUsuario;
		} else {
			let borrarUsuario = await usuariosModel.borrar(connectionBD, id);
			if (borrarUsuario.status !== 200) {
				await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
				return borrarUsuario;
			} else {
				await connectionBD.query("COMMIT"); // Confirma los cambios
				return {
					status: 200,
					title: "Solicitud exitosa",
					message: "Se ha eliminado el usuario correctamente.",
				};
			}
		}
	} catch (error) {
		await connectionBD.query("ROLLBACK"); // Se ejecuta si hubo algún error durante las operaciones, no confirma los cambios
		logger.stderr(`Error eliminado el usuario: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error en la eliminación del usuario.`,
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

		data_usuario = await usuariosModel.getUsuarios(connectionBD);
		return data_usuario;
	} catch (error) {
		logger.stderr(`Error en la consulta de usuarios: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error al consultar los usuarios.`,
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

exports.consultarListas = async () => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";

		let data_roles = await usuariosModel.consultarRoles(connectionBD);
		if (data_roles.status !== 200) {
			return data_roles;
		} else {
			return {
				status: 200,
				content: { roles: data_roles.content },
			};
		}
	} catch (error) {
		logger.stderr(`Error en la consulta de las listas: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error al consultar las listas.`,
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

exports.consultarUsuario = async (id) => {
	const connectionBD = await connection.getConnection(); // Obtener conexión a BD la cual se pasa a los metodos
	try {
		if (!connectionBD) throw "Error en la conexión";

		let data_usuario = await usuariosModel.getUsuarioId(connectionBD, id);
		if (data_usuario.status !== 200) {
			return data_usuario;
		} else {
			let data_roles = await usuariosModel.consultarRolesUsuario(connectionBD, id);
			if (data_roles.status !== 200) {
				return data_roles;
			} else {
				data_roles = data_roles.content.map((role) => role.id_rol);

				return {
					status: 200,
					content: { usuario: data_usuario.content, roles: data_roles },
				};
			}
		}
	} catch (error) {
		logger.stderr(`Error al consultar los datos del usuario: ${error}`);
		return {
			status: 409,
			message: `Ocurrio un error al consultar el usuario.`,
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
