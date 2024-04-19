import axios from "axios";
import Cookies from "js-cookie";

const AuthService = {
	// Método para iniciar sesión
	async login(credentials, toast) {
		const idToast = toast("Por favor espera...");
		try {
			// Enviar las credenciales al servidor para autenticación
			const response = await axios.post("http://localhost:8000/api/auth/login", credentials);

			const { roles, token } = response.data.content;

			Cookies.set("token", token, { expires: 1 / 6 }); // 1/6 representa 4 horas en días
			Cookies.set("userRoles", JSON.stringify(roles), { expires: 1 / 6 }); // 1/6 representa 4 horas en días

			toast.dismiss(idToast);
			toast.success("¡Inicio de sesión exitoso!");
		} catch (error) {
			console.error("Error al obtener los datos del cliente:", error);
			toast.dismiss(idToast);
			if (error?.response?.data?.status) {
				toast.error(error?.response?.data?.message);
			} else {
				toast.error("¡Error al iniciar sesión! Por favor, verifica tus credenciales.");
			}

			throw new Error("Error al iniciar sesión. Por favor, comprueba tus credenciales.");
		}
	},

	// Método para cerrar sesión
	logout(toast) {
		toast.success("¡Cierre de sesión exitoso!");
		// Eliminar el token y userRoles de autenticación del almacenamiento
		Cookies.remove("token");
		Cookies.remove("userRoles");
	},

	// Método para verificar si el usuario está autenticado
	isAuthenticated() {
		// Comprobar si hay un token de autenticación en el almacenamiento local (localStorage)
		const accessToken = Cookies.get("token");
		return !!accessToken;
	},

	// Método para obtener el token de autenticación
	getAccessToken() {
		return Cookies.get("token");
	},

	getRoles() {
		// Obtiene los roles del usuario del almacenamiento
		return JSON.parse(Cookies.get("userRoles")) || [];
	},
};

export default AuthService;
