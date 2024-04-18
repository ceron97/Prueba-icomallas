var express = require("express");
var router = express.Router();
const clientesController = require("../controllers/clientesController");

/* -------------------------------------------------------- ||
||															||
||							 CREATE 						||
||															||
|| -------------------------------------------------------- */

/* POST crea un cliente. */
router.post("/crear", async function (req, res) {
	await clientesController.crear(req.body, req.user).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PUT	 						||
||															||
|| -------------------------------------------------------- */

/* PUT editar un cliente. */
router.put("/editar/:id", async function (req, res, next) {
	await clientesController.editar(req.params.id, req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PATCH 	 					||
||															||
|| -------------------------------------------------------- */

/* PATCH cambia el estado del cliente. */
router.patch("/estado/:id", async function (req, res, next) {
	await clientesController.estado(req.params.id, req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							   PATCH 	 					||
||															||
|| -------------------------------------------------------- */

/* DELETE borra al cliente de los registros. */
router.delete("/borrar/:id", async function (req, res, next) {
	await clientesController.borrar(req.params.id).then((response) => {
		res.status(response.status).json(response);
	});
});

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/* GET consultar los clientes en BD. */
router.get("/consultar", async function (req, res, next) {
	await clientesController.consultar(req.user).then((response) => {
		res.status(response.status).json(response);
	});
});

/* GET consulta los datos de un cliente. */
router.get("/consultarCliente/:id", async function (req, res, next) {
	await clientesController.consultarCliente(req.params.id).then((response) => {
		res.status(response.status).json(response);
	});
});

module.exports = router;
