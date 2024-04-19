<template>
	<div class="login-container">
		<h2>Iniciar sesión</h2>
		<form @submit.prevent="submitForm" class="login-form">
			<div class="form-group">
				<label for="username">Nombre de usuario:</label>
				<input type="text" id="username" v-model="credentials.username" required />
			</div>
			<div class="form-group">
				<label for="password">Contraseña:</label>
				<input type="password" id="password" v-model="credentials.password" required />
			</div>
			<button type="submit">Iniciar sesión</button>
		</form>
	</div>
</template>

<script>
import AuthService from "../services/AuthService"; // Importar el servicio de autenticación

export default {
	name: "LoginPage",
	data() {
		return {
			credentials: {
				username: "",
				password: "",
			},
		};
	},
	methods: {
		async submitForm() {
			try {
				// Llamar al método de inicio de sesión del servicio de autenticación
				await AuthService.login(this.credentials, this.$toast);

				// Redirecciona al home
				this.$router.push("/home");
			} catch (error) {
				// Manejar errores de inicio de sesión (ya se muestra una notificación desde el AuthService)
				console.error("Error al iniciar sesión:", error);
			}
		},
	},
};
</script>

<style scoped>
/* Estilos específicos del componente */
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
}

.login-form {
	width: 300px;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.form-group {
	margin-bottom: 15px;
}

label {
	display: block;
	margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
	width: 100%;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

button {
	width: 100%;
	padding: 10px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

button:hover {
	background-color: #0056b3;
}
</style>
