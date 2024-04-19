var express = require("express");
var router = express.Router();
const usuariosController = require("../controllers/usuariosController");

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

/* POST crea un usuario. */
router.post("/crear", async function (req, res) {
	await usuariosController.crear(req.body, req.user).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PUT	 						||
||															||
|| -------------------------------------------------------- */

/* PUT editar un usuario. */
router.put("/editar/:id", async function (req, res, next) {
	await usuariosController.editar(req.params.id, req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PATCH 	 					||
||															||
|| -------------------------------------------------------- */

/* PATCH cambia el estado del usuario. */
router.patch("/estado/:id", async function (req, res, next) {
	await usuariosController.estado(req.params.id, req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PATCH 	 					||
||															||
|| -------------------------------------------------------- */

/* DELETE borra al usuario de los registros. */
router.delete("/borrar/:id", async function (req, res, next) {
	await usuariosController.borrar(req.params.id).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/* GET consultar los usuarios en BD. */
router.get("/consultar", async function (req, res, next) {
	await usuariosController.consultar(req.user).then((response) => {
		res.status(response.status).json(response);
	});
});

/* GET consulta las listas del formulario. */
router.get("/consultarListas", async function (req, res, next) {
	await usuariosController.consultarListas().then((response) => {
		res.status(response.status).json(response);
	});
});

/* GET consulta los datos de un usuario. */
router.get("/consultarUsuario/:id", async function (req, res, next) {
	await usuariosController.consultarUsuario(req.params.id).then((response) => {
		res.status(response.status).json(response);
	});
});

module.exports = router;
