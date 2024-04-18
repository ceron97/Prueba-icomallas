<template>
	<div class="container">
		<h2>Mis Registros</h2>
		<div v-if="!showForm">
			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>Nit</th>
							<th>Razon social</th>
							<th>Correo</th>
							<th>Telefono</th>
							<th>Asesor</th>
							<th>Fecha creación</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<!-- Aquí se mostrarían los registros -->
						<tr v-for="(item, index) in items" :key="index">
							<td>{{ item.nit }}</td>
							<td>{{ item.razon_social }}</td>
							<td>{{ item.correo }}</td>
							<td>{{ item.telefono }}</td>
							<td>{{ item.usuario_creo }}</td>
							<td>{{ formatDate(item.fecha_creacion) }}</td>
							<!-- Aplicar el filtro de fecha -->
							<td>{{ item.estado === true ? "Activo" : "Inactivo" }}</td>
							<td>
								<button @click="editItem(item.id)">Editar</button>
								<button @click="confirmAction(item, 'delete')">Eliminar</button>
								<button @click="confirmAction(item, 'changeStatus')">
									{{ item.estado === true ? "Inactivar" : "Activar" }}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<button @click="refresh">Actualizar</button>
			</div>
			<button @click="createItem">Crear Nuevo</button>
		</div>
		<div v-else>
			<MyForm :id="clientId" :formType="formType" />
			<button @click="showForm = false">Cancelar</button>
		</div>
	</div>
</template>

<script>
import MyForm from "@/components/FormClientes.vue";
import axios from "axios";

export default {
	name: "ClientesPage",
	components: {
		MyForm,
	},
	data() {
		return {
			showForm: false,
			clientId: null,
			formType: "Crear",
			items: [],
			itemAction: null, // Dato para almacenar la acción a confirmar (eliminar o cambiar estado)
			itemToAction: null, // Dato para almacenar el item en el que se realizará la acción
		};
	},
	methods: {
		// Inicializa el formulario de creación
		createItem() {
			this.clientId = null;
			this.formType = "Crear";
			this.showForm = true;
		},
		// Inicializa el formulario de edición
		editItem(clientId) {
			this.clientId = clientId;
			this.showForm = true;
			this.formType = "Editar";
		},
		// Verifica con una alerta si desea eliminar o cambiar el estado
		confirmAction(item, action) {
			// Asignar la acción y el item correspondiente a los datos itemAction y itemToAction
			this.itemAction = action;
			this.itemToAction = item;
			// Mostrar una alerta de confirmación
			if (
				confirm(
					`¿Estás seguro de que quieres ${
						action === "delete" ? "eliminar" : "cambiar el estado de"
					} este registro?`
				)
			) {
				if (action === "delete") {
					this.deleteItem();
				} else if (action === "changeStatus") {
					this.changeStatus();
				}
			} else {
				// Si el usuario cancela, limpiar los datos itemAction y itemToAction
				this.itemAction = null;
				this.itemToAction = null;
			}
		},
		// Elimina al cliente de los registros
		async deleteItem() {
			if (!this.itemToAction) return; // Salir si no hay ningún item para eliminar
			const item = this.itemToAction; // Obtener el item a eliminar del dato itemToAction

			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.delete(`http://localhost:8000/api/clientes/borrar/${item.id}`, {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Eliminación exitosa!");
				this.refresh();
			} catch (error) {
				console.error("Error al obtener los datos del cliente:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al obtener los datos del cliente.");
				}
			}

			this.itemAction = null;
			this.itemToAction = null;
		},
		// Modifica el estado de el cliente
		async changeStatus() {
			if (!this.itemToAction) return; // Salir si no hay ningún item para cambiar de estado
			const item = this.itemToAction; // Obtener el item a cambiar de estado del dato itemToAction

			const idToast = this.$toast("Por favor espera...");
			try {
				await axios.patch(
					`http://localhost:8000/api/clientes/estado/${item.id}`,
					{ estado: !item.estado },
					{
						withCredentials: true,
					}
				);

				this.$toast.dismiss(idToast);
				this.$toast.success("¡Edición exitosa!");
				this.refresh();
			} catch (error) {
				console.error("Error al obtener los datos del cliente:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al obtener los datos del cliente.");
				}
			}

			this.itemAction = null;
			this.itemToAction = null;
		},
		// Actualiza los datos de la tabla
		async refresh() {
			const idToast = this.$toast("Por favor espera...");
			try {
				const response = await axios.get("http://localhost:8000/api/clientes/consultar", {
					withCredentials: true,
				});

				this.$toast.dismiss(idToast);
				this.items = response.data.content;
			} catch (error) {
				console.error("Error al cargar los datos:", error);
				this.$toast.dismiss(idToast);
				if (error?.response?.data?.status) {
					this.$toast.error(error?.response?.data?.message);
				} else {
					this.$toast.error("Error al cargar los datos.");
				}
			}
		},
		// Realizar el formateo de las fechas
		formatDate(date) {
			const formattedDate = new Date(date);
			const day = formattedDate.getDate().toString().padStart(2, "0");
			const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
			const year = formattedDate.getFullYear();
			return `${day}/${month}/${year}`;
		},
	},
	mounted() {
		this.refresh();
	},
};
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.table-container {
	margin-bottom: 20px;
}

.table {
	border-collapse: collapse;
	width: 80%;
	margin: auto;
}

th,
td {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 8px;
}

th {
	background-color: #f2f2f2;
}

button {
	margin-right: 10px;
}
</style>
