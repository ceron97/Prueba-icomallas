import Vue from "vue";
import VueToastification from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "./router"; // Importa la configuración del enrutador

Vue.config.productionTip = false;
Vue.use(VueToastification); // Permite añadir el toasfy

new Vue({
	router, // Usa el enrutador configurado
	render: (h) => h(App),
}).$mount("#app");
