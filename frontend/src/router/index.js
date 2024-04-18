import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue"; // Componente para el formulario de inicio de sesión
import Home from "../views/Home.vue";
import Admin from "../views/Admin.vue"; // Componente para la ruta protegida
import Clientes from "../views/Clientes.vue";
import AuthService from "../services/AuthService"; // Servicio para verificar el estado de autenticación

Vue.use(VueRouter);

const routes = [
	{
		path: "/home",
		name: "home",
		component: Home,
		meta: {
			requiresAuth: true, // Marca esta ruta como protegida
		},
	},
	{
		path: "/admin",
		name: "admin",
		component: Admin,
		meta: {
			requiresAuth: true, // Marca esta ruta como protegida
			roles: [1], // Asigna el rol de acceso
		},
	},
	{
		path: "/clientes",
		name: "clientes",
		component: Clientes,
		meta: {
			requiresAuth: true, // Marca esta ruta como protegida
			roles: [2], // Asigna el rol de acceso
		},
	},
	{ path: "/login", component: Login },
];

const router = new VueRouter({
	routes,
	mode: "history",
});

router.beforeEach((to, from, next) => {
	const matchedRoute = router.resolve(to.path);

	// Si no esta autenticado y es una ruta protegida o no existe
	if (
		(to.matched.some((record) => record.meta.requiresAuth) || matchedRoute.resolved.matched.length === 0) &&
		!AuthService.isAuthenticated()
	) {
		next("/login"); // Redirige al login si la ruta no existe o requiere autenticacion y no esta autenticado
	} else if ((to.path === "/login" || matchedRoute.resolved.matched.length === 0) && AuthService.isAuthenticated()) {
		// Si está autenticado y es el login o no existe la ruta
		next("/home");
	} else if (to.matched.some((record) => record.meta.requiresAuth) && AuthService.isAuthenticated()) {
		// Si es una ruta protegida y esta autenticado
		const userRoles = AuthService.getRoles(); // Obtener los roles del usuario desde el servicio de autenticación
		const routeRoles = to.meta.roles; // Obtener los roles permitidos para la ruta
		if (routeRoles && userRoles.some((role) => routeRoles.includes(role))) {
			// Si el usuario tiene al menos uno de los roles permitidos para la ruta, dejarlo pasar
			next();
		} else {
			// Si el usuario no tiene los roles permitidos para la ruta, redirigir a una página default
			next("/home");
		}
	} else {
		// La ruta existe, continuar con la navegación
		next();
	}
});

export default router;
