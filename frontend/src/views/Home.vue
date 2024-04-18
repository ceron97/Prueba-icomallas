<template>
	<div class="contact">
		<h1>Panel de control</h1>
		<p>Inica tus procesos...</p>
		<MenuCards />
	</div>
</template>

<script>
import MenuCards from "../components/MenuCards.vue";

export default {
	name: "ContactPage",
	components: {
		// Registra el componente MenuCards
		MenuCards,
	},
};
</script>

<style scoped>
.contact {
	text-align: center;
	padding: 20px;
}
</style>
