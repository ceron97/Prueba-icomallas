<template>
	<div class="form-container">
		<h2>{{ formTitle }}</h2>
		<form @submit.prevent="handleSubmit">
			<div class="form-group">
				<label for="username">Usuario:</label>
				<input type="text" id="username" v-model="formData.username" required />
			</div>
			<div class="form-group">
				<label for="razon-social">Contraseña:</label>
				<input type="password" id="razon-social" v-model="formData.password" :required="isPasswordRequired" />
			</div>
			<div class="form-group">
				<label for="confirmPassword">Confirmar contraseña:</label>
				<input type="password" id="confirmPassword" v-model="confirmPassword" :required="isPasswordRequired" />
			</div>
			<div class="form-group">
				<label for="nombre">Nombre:</label>
				<input type="text" id="nombre" v-model="formData.nombre" />
			</div>
			<div class="form-group">
				<label for="estado">Estado:</label>
				<select id="estado" v-model="formData.estado">
					<option value="true">Activo</option>
					<option value="false">Inactivo</option>
				</select>
			</div>
			<div class="form-group">
				<table class="dynamic-table">
					<thead>
						<tr>
							<th>Seleccionar</th>
							<th>Descripción</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in dynamicTableData" :key="index">
							<td>
								<input
									type="checkbox"
									:id="'checkbox_' + item.id"
									v-model="formData.selectedItems"
									:value="item.id"
								/>
							</td>
							<td>{{ item.descripcion }}</td>
						</tr>
					</tbody>
				</table>
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
			formData: {
				username: "",
				password: "",
				nombre: "",
				estado: true,
				selectedItems: [],
			},
			confirmPassword: "", // Nuevo campo para confirmar contraseña
			dynamicTableData: [], // Inicialmente vacío
		};
	},
	async mounted() {
		this.fetchDynamicTableData(); // Llamar a la función al renderizar el formulario
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
		isPasswordRequired() {
			return this.formType === "Crear"; // Aplicar required solo cuando se está creando un nuevo registro
		},
	},
	methods: {
		async fetchDynamicTableData() {
			const idToast = this.$toast("Por favor espera...");
			try {
				const response = await axios.get(`http://localhost:8000/api/usuarios/consultarListas`, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.dynamicTableData = response.data.content.roles;
			} catch (error) {
				console.error("Error al obtener los datos del usuario:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al obtener los datos del usuario.");
				}
			}
		},
		async fetchItemData() {
			const idToast = this.$toast("Por favor espera...");
			try {
				const response = await axios.get(`http://localhost:8000/api/usuarios/consultarUsuario/${this.id}`, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				const { usuario, roles } = response.data.content;
				this.formData = { ...usuario, password: "", selectedItems: roles }; // Llenar el formulario con los datos obtenidos
			} catch (error) {
				console.error("Error al obtener los datos del usuario:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al obtener los datos del usuario.");
				}
			}
		},
		async handleSubmit() {
			if (
				this.formData.selectedItems.length === 0 ||
				(this.formType === "Crear" && this.formData.password === "" && this.confirmPassword === "")
			) {
				if (this.formData.password === "" && this.confirmPassword === "") {
					this.$toast.warning("La contraseña es obligatoria");
				}

				if (this.formData.password !== this.confirmPassword) {
					this.$toast.warning("La contraseña y la confirmación de contraseña no coinciden");
				}

				if (this.formData.selectedItems.length === 0) {
					this.$toast.warning("Se debe seleccionar minimamente un rol");
				}
				return;
			}

			if (this.formType === "Crear") {
				await this.createItem();
			} else {
				await this.updateItem();
			}
		},
		// Crear un usuario
		async createItem() {
			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.post("http://localhost:8000/api/usuarios/crear", this.formData, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Creación exitosa!");
				this.resetForm();
			} catch (error) {
				console.error("Error al crear el usuario:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al crear el usuario.");
				}
			}
		},
		// Edita el usuario
		async updateItem() {
			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.put(`http://localhost:8000/api/usuarios/editar/${this.id}`, this.formData, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Edición exitosa!");
				// this.resetForm();
			} catch (error) {
				console.error("Error al editar los datos del usuario:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al editar los datos del usuario.");
				}
			}
		},
		resetForm() {
			this.formData = {
				username: "",
				password: "",
				nombre: "",
				estado: true,
				selectedItems: [],
			};
			this.confirmPassword = "";
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
input[type="password"],
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

/* Estilos para la tabla */
.dynamic-table {
	width: 100%;
	border-collapse: collapse;
}

.dynamic-table th,
.dynamic-table td {
	border: 1px solid #ddd;
	padding: 8px;
	text-align: left;
}

.dynamic-table th {
	background-color: #f2f2f2;
}

.dynamic-table tr:nth-child(even) {
	background-color: #f2f2f2;
}
</style>
