var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

/* POST verifica que existe el usuario. */
router.post("/logIn", async function (req, res) {
	await authController.logIn(req.body).then((response) => {
		res.status(response.status).json(response);
	});
});

module.exports = router;
