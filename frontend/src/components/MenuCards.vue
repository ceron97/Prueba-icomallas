<template>
	<div class="menu-cards">
		<router-link v-for="(card, index) in filteredCards" :key="index" :to="card.route" class="card-link">
			<div class="card">
				<div class="card-content">
					<h3>{{ card.title }}</h3>
					<p>{{ card.description }}</p>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
	data() {
		return {
			// Crea las crds que se van a mostrar
			cards: [
				{ title: "Admin", description: "Maneja los usuarios del sistema", roles: [1], route: "/admin" },
				{
					title: "Clientes",
					description: "Maneja tus procesos con tus clientes",
					roles: [2],
					route: "/clientes",
				},
			],
		};
	},
	computed: {
		filteredCards() {
			// Verifica mostrar las cards segun el rol que posea
			const userRoles = AuthService.getRoles(); // Recibe un arreglo de roles
			if (!userRoles || userRoles.length === 0) return [];

			const filtered = this.cards.filter((card) => {
				// Verificar si hay alguna intersección entre los roles del usuario y los roles de la card
				return card.roles.some((role) => userRoles.includes(role));
			});

			return filtered;
		},
	},
};
</script>

<style scoped>
.menu-cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.card-link {
	text-decoration: none;
}

.card {
	width: 200px;
	margin: 20px;
	padding: 20px;
	background-color: #f0f0f0;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-content {
	text-align: center;
}

h3 {
	margin-bottom: 10px;
	font-size: 1.2em;
	color: #333;
}

p {
	font-size: 1em;
	color: #666;
}
</style>
