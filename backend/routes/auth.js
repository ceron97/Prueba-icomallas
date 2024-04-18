var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

/* -------------------------------------------------------- ||
||															||
||							INQUIRIES						||
||															||
|| -------------------------------------------------------- */

/* POST realiza el logueo del usuario. */
router.post("/logIn", async function (req, res) {
	await authController.logIn(req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

module.exports = router;
