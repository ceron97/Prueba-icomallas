require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const token = require("./utils/token"); // Middleware para verificar token de autenticación

const authRouter = require("./routes/auth"); // Middleware para verificar token de autenticación
const clientesRouter = require("./routes/clientes"); // Middleware para verificar token de autenticación
const usersRouter = require("./routes/users"); // Middleware para verificar token de autenticación

const app = express();
app.listen(process.env.NODE_PORT, () => {
	console.log("Backend server is running!: ", process.env.NODE_PORT);
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const origin = [
	"localhost",
	"127.0.0.0",
	`${process.env.CLIENT_HOST}`,
	`${process.env.CLIENT_HOST_DOMAIN}`,
	"http://localhost",
	"http://127.0.0.0",
	`http://${process.env.CLIENT_HOST}`,
	`http://${process.env.CLIENT_HOST_DOMAIN}`,
	`http://localhost:${process.env.CLIENT_PORT}`,
	`http://127.0.0.0:${process.env.CLIENT_PORT}`,
	`http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
	`http://${process.env.CLIENT_HOST_DOMAIN}:${process.env.CLIENT_PORT}`,
];

app.use(
	cors({
		credentials: true,
		origin: origin,
	})
);

app.use(`${process.env.PATH_REQUEST}/auth`, authRouter);
app.use(`${process.env.PATH_REQUEST}/clientes`, token.verify, clientesRouter);
app.use(`${process.env.PATH_REQUEST}/users`, token.verify, usersRouter);

module.exports = app;
