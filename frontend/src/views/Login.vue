<template>
	<div>
		<h2>Iniciar sesión</h2>
		<form @submit.prevent="submitForm">
			<div>
				<label for="username">Nombre de usuario:</label>
				<input type="text" id="username" v-model="credentials.username" required />
			</div>
			<div>
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
</style>
