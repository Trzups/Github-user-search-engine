import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const accessToken = process.env.VUE_APP_API_GITHUB_KEY;
axios.defaults.headers.common["Authorization"] = `Bearer: ${accessToken}`;

createApp(App).use(store).use(router, axios).use(VueLoading).mount("#app");
