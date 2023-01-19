import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const accessToken = process.env.VUE_APP_API_GITHUB_KEY;
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

createApp(App)
  .use(store)
  .use(router, axios)
  .use(VueLoading)
  .use(BootstrapVue3)
  .mount("#app");
