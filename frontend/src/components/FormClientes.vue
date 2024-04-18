<template>
	<div class="form-container">
		<h2>{{ formTitle }}</h2>
		<form @submit.prevent="handleSubmit">
			<div class="form-group">
				<label for="nit">Nit:</label>
				<input type="number" id="nit" v-model="formData.nit" required />
			</div>
			<div class="form-group">
				<label for="razon-social">Razon Social:</label>
				<input type="text" id="razon-social" v-model="formData.razon_social" required />
			</div>
			<div class="form-group">
				<label for="correo">Correo:</label>
				<input type="email" id="correo" v-model="formData.correo" required />
			</div>
			<div class="form-group">
				<label for="telefono">Teléfono:</label>
				<input type="number" id="telefono" v-model="formData.telefono" />
			</div>
			<div class="form-group">
				<label for="estado">Estado:</label>
				<select id="estado" v-model="formData.estado">
					<option value="true">Activo</option>
					<option value="false">Inactivo</option>
				</select>
			</div>
			<button type="submit">{{ submitButtonText }}</button>
		</form>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "MyForm",
	props: {
		formType: {
			type: String,
			required: true,
			default: "Crear",
		},
		id: {
			type: Number,
			default: null,
		},
	},
	data() {
		return {
			// Define el formulario
			formData: {
				nit: "",
				razon_social: "",
				correo: "",
				telefono: "",
				estado: true, // Valor por defecto
			},
		};
	},
	async mounted() {
		if (this.formType === "Editar" && this.id) {
			await this.fetchItemData();
		}
	},
	computed: {
		formTitle() {
			return this.formType === "Crear" ? "Crear Nuevo Registro" : "Editar Registro";
		},
		submitButtonText() {
			return this.formType === "Crear" ? "Crear" : "Actualizar";
		},
	},
	methods: {
		async fetchItemData() {
			const idToast = this.$toast("Por favor espera...");
			try {
				const response = await axios.get(`http://localhost:8000/api/clientes/consultarCliente/${this.id}`, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				const cliente = response.data.content;
				this.formData = { ...cliente }; // Llenar el formulario con los datos obtenidos
			} catch (error) {
				console.error("Error al obtener los datos del cliente:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al obtener los datos del cliente.");
				}
			}
		},
		async handleSubmit() {
			if (this.formType === "Crear") {
				await this.createItem();
			} else {
				await this.updateItem();
			}
		},
		// Crear un cliente
		async createItem() {
			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.post("http://localhost:8000/api/clientes/crear", this.formData, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Creación exitosa!");
				this.resetForm();
			} catch (error) {
				console.error("Error al crear el cliente:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al crear el cliente.");
				}
			}
		},
		// Edita el client
		async updateItem() {
			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.put(`http://localhost:8000/api/clientes/editar/${this.formData.id}`, this.formData, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Edición exitosa!");
				// this.resetForm();
			} catch (error) {
				console.error("Error al editar los datos del cliente:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al editar los datos del cliente.");
				}
			}
		},
		resetForm() {
			this.formData = {
				nit: "",
				razon_social: "",
				correo: "",
				telefono: "",
				estado: true,
			};
		},
	},
};
</script>

<style scoped>
.form-container {
	width: 80%;
	margin: auto;
}

.form-group {
	margin-bottom: 20px;
}

label {
	display: block;
	margin-bottom: 5px;
}

input[type="number"],
input[type="text"],
input[type="email"],
select {
	width: 100%;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

button {
	padding: 10px 20px;
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
