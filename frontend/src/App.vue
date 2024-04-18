<template>
	<div id="app">
		<div v-if="isLoggedIn">
			<header>
				<nav class="navbar" role="navigation" aria-label="main navigation">
					<div class="navbar-start">
						<div class="navbar-item">
							<router-link to="/home" class="button is-primary is-medium">Home</router-link>
						</div>

						<!-- Mostrar elementos del menú según los roles -->
						<template v-if="userRoles.includes(1)">
							<div class="navbar-item">
								<router-link to="/admin" class="button is-primary is-medium">Admin</router-link>
							</div>
						</template>
						<template v-if="userRoles.includes(2)">
							<div class="navbar-item">
								<router-link to="/clientes" class="button is-primary is-medium">Clientes</router-link>
							</div>
						</template>
					</div>

					<div class="navbar-end">
						<div class="navbar-item">
							<div class="buttons">
								<button @click="logout" class="button is-danger is-medium logout">Logout</button>
							</div>
						</div>
					</div>
				</nav>
			</header>
			<main>
				<router-view></router-view>
				<!-- Muestra el contenido de la página actual -->
			</main>
		</div>
		<div v-else>
			<router-view></router-view>
			<!-- Muestra solo el componente de login -->
		</div>
	</div>
</template>

<script>
import AuthService from "./services/AuthService";

export default {
	data() {
		return {
			isLoggedIn: false, // Estado de autenticación inicialmente falso
			userRoles: [], // Roles del usuario
		};
	},
	async created() {
		// Verificar si el usuario está autenticado al cargar la aplicación
		this.isLoggedIn = AuthService.isAuthenticated();
		if (this.isLoggedIn) {
			// Obtener los roles del usuario si está autenticado
			this.userRoles = await AuthService.getRoles();
		}
	},
	methods: {
		async logout() {
			try {
				// Llamar al método de cierre de sesión del AuthService
				AuthService.logout(this.$toast);
				this.isLoggedIn = false; // Actualizar el estado de autenticación
				this.$router.push("/login"); // Redirigir al usuario al login
			} catch (error) {
				console.error("Error al cerrar sesión:", error);
			}
		},
	},
	watch: {
		// Verificar continuamente el estado de autenticación mientras el usuario navega
		$route: async function () {
			this.isLoggedIn = AuthService.isAuthenticated();
			if (this.isLoggedIn) {
				// Actualizar los roles del usuario si está autenticado
				this.userRoles = await AuthService.getRoles();
			}
		},
	},
};
</script>

<style scoped>
/* Estilos globales de la aplicación */
body {
	font-family: Arial, sans-serif;
}

.navbar {
	background-color: #333;
	color: white;
	display: flex;
	justify-content: space-between;
}

.navbar-start {
	display: flex;
	align-items: center;
}

.navbar-item {
	padding: 15px;
}

.navbar-item a {
	color: white;
}

.navbar-item a:hover {
	background-color: #555;
}

button.is-medium {
	padding: 10px 20px;
}

button.logout {
	cursor: pointer;
}

button.is-danger {
	background-color: #e74c3c;
	border-color: #e74c3c;
}

button.is-danger:hover {
	background-color: #c0392b;
	border-color: #c0392b;
}

button.is-primary {
	background-color: #3498db;
	border-color: #3498db;
}

button.is-primary:hover {
	background-color: #2980b9;
	border-color: #2980b9;
}

main {
	padding: 20px;
}
</style>
